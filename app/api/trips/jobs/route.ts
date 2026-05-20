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
    // Multi-city: one chunk per SUB-CHUNK of a segment (long segments split
    // into multiple Edge Fn calls). Each chunk calls generate-trip as a
    // clean single-city request for that sub-range, and the worker assembles
    // per-sub-chunk days + first-of-each-segment accommodations into the
    // final trip_data. This avoids both (a) the multi-city megaprompt and
    // (b) over-long single-segment calls blowing the Edge Fn's memory/time
    // budget.
    //
    // Single-city: chunks of up to SEGMENT_DAYS each.
    //
    // Keep SEGMENT_DAYS + the per-segment sub-chunking math in sync with the
    // worker's planMultiCityChunks(). The worker is the source of truth for
    // chunk content; this computation just sizes chunks_total to match.
    const SEGMENT_DAYS = 10
    const bodySegments = Array.isArray((body as any)?.segments) ? (body as any).segments : []
    const isMultiCity  = bodySegments.length >= 2
    const chunksTotal  = isMultiCity
      ? bodySegments.reduce((sum: number, s: any) => {
          const segDays = Math.max(1, (Number(s?.nights) || 0) + 1)
          return sum + Math.ceil(segDays / SEGMENT_DAYS)
        }, 0)
      : Math.ceil(durationDays / SEGMENT_DAYS)

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
