// app/api/trips/jobs/route.ts
// POST: create an async generation job and fire the worker Edge Function.
// Mirrors /api/generate-trip's auth + billing; differs in that the work is
// done asynchronously. Endpoint boundary = billing boundary (same rule).

import { NextRequest, NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { checkGenerationAllowed, consumeOneTrip } from '../../../../lib/entitlements'
import { getSupabaseAdmin, getSupabaseServer } from '../../../../lib/supabase/server'

export const maxDuration = 15
export const dynamic = 'force-dynamic'

type ErrBody = { ok: false; code: string; message: string; detail?: unknown }
const err = (status: number, code: string, message: string, detail?: unknown) =>
  NextResponse.json<ErrBody>({ ok: false, code, message, detail }, { status })

async function resolveUser(req: NextRequest): Promise<User | null> {
  const supabase = await getSupabaseServer()
  const cookieRes = await supabase.auth.getUser()
  if (cookieRes.data.user) return cookieRes.data.user
  const authHeader = req.headers.get('authorization') ?? ''
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim()
    if (token) {
      const tokenRes = await supabase.auth.getUser(token)
      if (tokenRes.data.user) return tokenRes.data.user
    }
  }
  return null
}

// Owned-trip check = regeneration → no billing. Mirrors the rule in /api/generate-trip.
async function isRegenerationOfOwnedTrip(tripId: unknown, userId: string): Promise<boolean> {
  if (typeof tripId !== 'string' || tripId.length === 0) return false
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await (admin as any)
      .from('trips')
      .select('user_id')
      .eq('id', tripId)
      .single()
    if (error || !data) return false
    return data.user_id === userId
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Async generation requires an authenticated user. Anon users stay on sync.
    const user = await resolveUser(req)
    if (!user) {
      return err(401, 'not_authenticated', 'Sign in to generate a plan')
    }

    const isRegeneration = await isRegenerationOfOwnedTrip((body as any)?.tripId, user.id)

    // Entitlement gate — only for new trips.
    if (!isRegeneration) {
      const check = await checkGenerationAllowed()
      if (!check.allowed) {
        const reason = (check as { allowed: false; reason: string }).reason
        if (reason === 'error') return err(503, 'entitlement_check_failed', 'Service temporarily unavailable')
        return err(402, 'no_credits', 'No credits remaining', { reason })
      }
    }

    const durationDays = Math.min(Math.max(Number((body as any)?.duration_days) || 1, 1), 30)
    // Segments of up to 10 days each. The worker generates one segment per
    // generate-trip call. Was `chunksTotal = durationDays` (1 day per chunk),
    // which made the self-reinvoke chain length 30 for a 30-day trip; the new
    // shape is 3 segments for 30 days, 10x shorter chain, much more reliable.
    // Keep this constant in sync with SEGMENT_DAYS in the worker.
    const SEGMENT_DAYS = 10
    const chunksTotal  = Math.ceil(durationDays / SEGMENT_DAYS)

    const admin = getSupabaseAdmin()

    // Insert the job row BEFORE anything else so a worker invocation has state to read.
    const { data: jobRow, error: insertErr } = await (admin as any)
      .from('generation_jobs')
      .insert({
        user_id:      user.id,
        status:       'queued',
        inputs:       body,
        chunks_total: chunksTotal,
        chunks_done:  0,
      })
      .select('id, chunks_total')
      .single()

    if (insertErr || !jobRow) {
      return err(500, 'job_create_failed', 'Could not create job', insertErr?.message)
    }

    // Consume credit only after the job row exists, and only for new trips.
    if (!isRegeneration) {
      await consumeOneTrip(user.id).catch(e =>
        console.error('[trips/jobs] consumeOneTrip error:', e)
      )
    }

    // Fire-and-forget worker invocation. Reconciler handles any dropped invocation.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && anonKey) {
      const workerUrl = `${supabaseUrl}/functions/v1/generate-trip-worker`
      fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ job_id: jobRow.id }),
      }).catch(e => console.error('[trips/jobs] worker invoke failed:', e))
    }

    return NextResponse.json(
      {
        jobId:       jobRow.id,
        status:      'queued',
        chunksTotal: jobRow.chunks_total,
        chunksDone:  0,
      },
      { status: 202 }
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[trips/jobs] error', message)
    return err(500, 'internal', `Internal error: ${message}`)
  }
}
