// app/api/trips/jobs/reconcile/route.ts
// Cron endpoint. Re-invokes the worker for any job that has been stuck in
// queued/running for longer than STALE_MS. Covers dropped fire-and-forget
// invocations without requiring a real queue.
//
// Security: requires CRON_SECRET via Authorization: Bearer <secret>, or
// Vercel Cron (which sets x-vercel-cron=1 and includes the secret).
// Schedule: every 2 minutes via vercel.json or external scheduler.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../../lib/supabase/server'

export const dynamic = 'force-dynamic'

const STALE_MS  = 2 * 60 * 1000   // 2 minutes since last update
const MAX_PICK  = 10              // hard cap to avoid cascading invokes

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true // no secret configured → permissive (dev)
  const header = req.headers.get('authorization') ?? ''
  return header === `Bearer ${secret}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ ok: false, message: 'supabase not configured' }, { status: 500 })
  }

  const admin    = getSupabaseAdmin()
  const cutoff   = new Date(Date.now() - STALE_MS).toISOString()
  const workerUrl = `${supabaseUrl}/functions/v1/generate-trip-worker`

  const { data: stale } = await (admin as any)
    .from('generation_jobs')
    .select('id')
    .in('status', ['queued', 'running'])
    .lt('updated_at', cutoff)
    .limit(MAX_PICK)

  const picked = (stale ?? []) as Array<{ id: string }>

  // Fire-and-forget each invocation in parallel. We don't await, don't care
  // about responses — the worker is idempotent.
  for (const j of picked) {
    fetch(workerUrl, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ job_id: j.id }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true, invoked: picked.length })
}
