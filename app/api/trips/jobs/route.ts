// app/api/trips/jobs/route.ts
// POST: create an async generation job and fire the worker Edge Function.
// Mirrors /api/generate-trip's auth + billing; differs in that the work is
// done asynchronously. Endpoint boundary = billing boundary (same rule).

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { User } from '@supabase/supabase-js'
import { checkGenerationAllowed, consumeOneTrip } from '../../../../lib/entitlements'
import { getSupabaseAdmin, getSupabaseServer } from '../../../../lib/supabase/server'
import { REF_COOKIE, sanitizeRefSource } from '../../../../lib/attribution/ref-source'

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

// Canonical fingerprint of "what trip is this" — deliberately excludes
// incidental fields (ref_source, key ordering) so refresh/double-submit of
// the exact same form input matches even if those differ.
function inputsFingerprint(inputs: any): string {
  return JSON.stringify({
    destination:   inputs?.destination   ?? null,
    origin:        inputs?.origin        ?? null,
    start:         inputs?.start         ?? null,
    end:           inputs?.end           ?? null,
    nights:        inputs?.nights        ?? null,
    duration_days: inputs?.duration_days ?? null,
    traveler:      inputs?.traveler      ?? null,
    interests:     inputs?.interests     ?? null,
    pace:          inputs?.pace          ?? null,
    budget:        inputs?.budget        ?? null,
    segments:      inputs?.segments      ?? null,
  })
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

    // ── Idempotency guard — new trips only ────────────────────────────────
    // Refresh / double-submit / effect re-fire during the ~100-250s async
    // wait had no way to detect "I already have this exact request in
    // flight (or just finished)" — every repeat POST created a brand new
    // job AND charged a new credit, even while the original was still
    // running or had already completed. Confirmed in production: a single
    // 8-day trip spawned 7 jobs (6 wasted credits) inside ~2 minutes of
    // refreshes, with 2 of the duplicates completing and saving real trip
    // rows the user never saw on the results page. Returning the existing
    // job here — same response shape as a fresh create — needs no client
    // change: runAsyncGeneration just polls whatever jobId comes back.
    if (!isRegeneration) {
      const DEDUPE_WINDOW_MS = 15 * 60 * 1000
      const wantFp = inputsFingerprint(body)
      const { data: recentJobs } = await (getSupabaseAdmin() as any)
        .from('generation_jobs')
        .select('id, status, chunks_total, chunks_done, created_at, inputs')
        .eq('user_id', user.id)
        .in('status', ['queued', 'running', 'completed'])
        .order('created_at', { ascending: false })
        .limit(10)

      const nowMs = Date.now()
      const dupe = (recentJobs ?? []).find((j: any) => {
        if (inputsFingerprint(j.inputs) !== wantFp) return false
        if (j.status === 'completed') {
          const ageMs = nowMs - new Date(j.created_at).getTime()
          if (ageMs > DEDUPE_WINDOW_MS) return false
        }
        return true
      })

      if (dupe) {
        console.log('[trips/jobs] deduped — returning existing job', dupe.id, 'status:', dupe.status)
        return NextResponse.json(
          {
            jobId:       dupe.id,
            status:      dupe.status,
            chunksTotal: dupe.chunks_total,
            chunksDone:  dupe.chunks_done,
            deduped:     true,
          },
          { status: 202 }
        )
      }
    }

    // Entitlement gate — only for new trips.
    if (!isRegeneration) {
      const check = await checkGenerationAllowed()
      if (!check.allowed) {
        const reason = (check as { allowed: false; reason: string }).reason
        if (reason === 'error') return err(503, 'entitlement_check_failed', 'Service temporarily unavailable')
        return err(402, 'no_credits', 'No credits remaining', { reason })
      }
    }

    const durationDays = Math.min(Math.max(Number((body as any)?.duration_days) || 1, 1), 35)
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
    // Reduced 10 → 7 (morning) → 5 (evening) on 2026-05-26: Sonnet 4.6
    // broke the 150s Supabase Free function cap on 10-day chunks; 7-day
    // chunks were still marginal in production. See the rationale block
    // in supabase/functions/generate-trip-worker/index.ts.
    const SEGMENT_DAYS = 5
    const bodySegments = Array.isArray((body as any)?.segments) ? (body as any).segments : []
    const isMultiCity  = bodySegments.length >= 2
    const chunksTotal  = isMultiCity
      ? bodySegments.reduce((sum: number, s: any) => {
          const segDays = Math.max(1, (Number(s?.nights) || 0) + 1)
          return sum + Math.ceil(segDays / SEGMENT_DAYS)
        }, 0)
      : Math.ceil(durationDays / SEGMENT_DAYS)

    const admin = getSupabaseAdmin()

    // Partner referral stamp (see lib/attribution/ref-source.ts). Captured from
    // the lagom_ref cookie and folded into the stored job inputs so the worker
    // persists it on the trip row it inserts at completion. Null for organic.
    const refSource = sanitizeRefSource((await cookies()).get(REF_COOKIE)?.value)
    const jobInputs = refSource ? { ...body, ref_source: refSource } : body

    // Insert the job row BEFORE anything else so a worker invocation has state to read.
    const { data: jobRow, error: insertErr } = await (admin as any)
      .from('generation_jobs')
      .insert({
        user_id:      user.id,
        status:       'queued',
        inputs:       jobInputs,
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
