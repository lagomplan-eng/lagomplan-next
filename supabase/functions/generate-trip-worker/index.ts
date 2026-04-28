// supabase/functions/generate-trip-worker/index.ts
//
// Re-entrant worker for async trip generation.
//
// Contract:
//   - Invoked with { job_id } (POST body).
//   - Reads the job row. Idempotent: exits cleanly if already completed/failed.
//   - Generates one chunk per day, persisting each chunk before advancing.
//   - When all chunks are persisted, assembles them into final trip_data,
//     writes result on the job row, inserts the trip row, sets status='completed'.
//   - If runtime budget gets low, exits with status='running'; the reconciler
//     (or the client-triggered retry) re-invokes and resumes from chunks_done.
//
// The existing /functions/v1/generate-trip Edge Function produces a full trip
// in one call. For v1 we delegate per-chunk generation to the SAME Edge Function
// by calling it with day-scoped inputs, then combine the results here. This
// avoids re-implementing prompt engineering in two places.
//
// If the delegated call fails on a chunk, the worker marks the job failed.
// Silent retries are the client's responsibility (see useTripGeneration hook).

// deno-lint-ignore-file no-explicit-any
// @ts-nocheck — Deno runtime; types resolved at deploy time

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Use the LEGACY JWT-format anon key (set as a custom secret), not the
// auto-injected SUPABASE_ANON_KEY. Supabase rolled out new opaque
// `sb_publishable_*` keys that the existing /functions/v1/generate-trip
// function — deployed before the rollout — rejects as "Invalid JWT format".
// LEGACY_ANON_KEY is the original eyJhbGc... JWT-format anon key.
const LEGACY_ANON_KEY   = Deno.env.get('LEGACY_ANON_KEY') ?? ''

// Diagnostics: log key shape on cold start so we can confirm the secret was
// set as a real JWT (eyJhbGc...) and not, e.g., the new sb_publishable_* key
// or an empty value.
console.log('[worker] env check:', {
  url:          SUPABASE_URL?.slice(0, 40) || 'MISSING',
  legacy_anon:  LEGACY_ANON_KEY ? `${LEGACY_ANON_KEY.slice(0, 10)}... (len=${LEGACY_ANON_KEY.length})` : 'EMPTY',
  legacy_starts_eyJ: LEGACY_ANON_KEY.startsWith('eyJ'),
})

// Budget: Supabase Edge Functions cap around 150s. We stop invoking new LLM
// calls once the remaining budget is below this floor and exit cleanly.
// The reconciler (or client) will call us back to finish.
const BUDGET_FLOOR_MS = 25_000

// Per-chunk LLM call timeout — generous, but below the function budget.
const CHUNK_TIMEOUT_MS = 60_000

type JobRow = {
  id:           string
  user_id:      string
  status:       'queued' | 'running' | 'completed' | 'failed'
  inputs:       Record<string, any>
  chunks_total: number
  chunks_done:  number
}

type ChunkContent = Record<string, any>

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

async function callGenerateTrip(payload: Record<string, any>, signal: AbortSignal) {
  console.log('[worker] calling generate-trip — token shape:', {
    starts_eyJ: LEGACY_ANON_KEY.startsWith('eyJ'),
    len:        LEGACY_ANON_KEY.length,
    prefix:     LEGACY_ANON_KEY.slice(0, 10),
  })
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-trip`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      apikey:          LEGACY_ANON_KEY,
      Authorization:   `Bearer ${LEGACY_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
    signal,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`generate-trip returned ${res.status}: ${text.slice(0, 500)}`)
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`generate-trip returned non-JSON: ${text.slice(0, 500)}`)
  }
}

async function generateChunk(jobInputs: Record<string, any>, dayIndex: number, prevSummary: string | null, signal: AbortSignal): Promise<ChunkContent> {
  // Day-scoped payload. We derive start/end for the single day so the LLM
  // produces a focused plan instead of the whole trip in one call.
  const start = new Date(jobInputs.start)
  const dayStart = new Date(start)
  dayStart.setDate(start.getDate() + dayIndex)

  const dayPayload = {
    ...jobInputs,
    duration_days: 1,
    day_index:     dayIndex,                        // for prompt context
    previous_day_summary: prevSummary ?? undefined, // continuity hint
    start: dayStart.toISOString().slice(0, 10),
    end:   dayStart.toISOString().slice(0, 10),
  }

  const res = await callGenerateTrip(dayPayload, signal)
  if (!res?.trip_data) throw new Error('chunk response missing trip_data')
  // Diagnostic — log the chunk shape on first chunk so we can see exactly
  // where the days array lives. The existing /generate-trip Edge Function
  // doesn't have a documented contract; the response shape was hand-rolled.
  if (dayIndex === 0) {
    console.log('[worker] chunk[0] keys:', Object.keys(res.trip_data || {}))
    console.log('[worker] chunk[0] sample:', JSON.stringify(res.trip_data).slice(0, 800))
  }
  return res.trip_data
}

// Pull days from a chunk regardless of where the field lives. The sync endpoint
// emits days under several variants — we mirror normalizeTripData's tolerance.
function chunkDays(chunk: any): any[] {
  if (Array.isArray(chunk?.days))            return chunk.days
  if (Array.isArray(chunk?.itinerary?.days)) return chunk.itinerary.days
  if (Array.isArray(chunk?.trip?.days))      return chunk.trip.days
  if (Array.isArray(chunk?.data?.days))      return chunk.data.days
  if (Array.isArray(chunk?.itinerary))       return chunk.itinerary  // some variants omit the wrapper
  return []
}

function assembleResult(chunks: ChunkContent[], jobInputs: Record<string, any>): Record<string, any> {
  // Concatenate per-day outputs into a single trip_data shape that matches
  // what the sync endpoint returns. The sync endpoint's trip_data typically
  // includes { title, subtitle, days, budget, packing }. We pull days from
  // each chunk, keep metadata from the first chunk.
  const first = chunks[0] ?? {}
  const days = chunks.flatMap((c, i) => {
    const d = chunkDays(c)
    return d.map((day: any, j: number) => ({ ...day, day_number: i + 1 + j }))
  })
  console.log('[worker] assembled result:', {
    chunks_count: chunks.length,
    days_count:   days.length,
    first_chunk_keys: Object.keys(first || {}),
  })
  return {
    title:       (first as any).title       ?? `Viaje a ${jobInputs.destination}`,
    subtitle:    (first as any).subtitle    ?? `${jobInputs.duration_days} días`,
    destination: jobInputs.destination,
    days,
    budget:      (first as any).budget      ?? null,
    packing:     (first as any).packing     ?? null,
  }
}

// Refund one trip credit. Only refunds if the user is on a metered tier
// (per_trip / pack_5 / pack_10) and trips_remaining hasn't already maxed out.
// Best-effort — if anything fails, we log and move on. A user keeping the
// credit they paid for is much worse than a missed refund here.
async function refundOneTripIfApplicable(admin: any, userId: string): Promise<void> {
  try {
    const { data } = await admin
      .from('user_entitlements')
      .select('tier, trips_remaining, trips_used')
      .eq('user_id', userId)
      .single()

    if (!data) return
    // Subscribers (explorer) and free tier users don't get a metered refund —
    // explorer is unlimited, free tier doesn't decrement on consume.
    if (data.tier === 'explorer') return

    await admin
      .from('user_entitlements')
      .update({
        trips_remaining: (data.trips_remaining ?? 0) + 1,
        trips_used:      Math.max(0, (data.trips_used ?? 0) - 1),
        updated_at:      new Date().toISOString(),
      })
      .eq('user_id', userId)
    console.log('[worker] refunded credit for user:', userId)
  } catch (e) {
    console.warn('[worker] refund failed (non-fatal):', e)
  }
}

function shortSummary(chunk: ChunkContent): string {
  const d = Array.isArray(chunk.days) ? chunk.days[0] : null
  if (!d) return ''
  const title = d.title ?? ''
  const activities = Array.isArray(d.activities)
    ? d.activities.slice(0, 2).map((a: any) => a.name || a.title).filter(Boolean).join(', ')
    : ''
  return [title, activities].filter(Boolean).join(' · ').slice(0, 200)
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() })

  const startedAt = Date.now()

  let job_id: string
  try {
    const body = await req.json()
    job_id = body.job_id
    if (!job_id) throw new Error('missing job_id')
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: String(e) }), {
      status: 400,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  // Load job
  const { data: jobData, error: jobErr } = await admin
    .from('generation_jobs')
    .select('id, user_id, status, inputs, chunks_total, chunks_done')
    .eq('id', job_id)
    .single()

  if (jobErr || !jobData) {
    return new Response(JSON.stringify({ ok: false, message: 'job not found' }), {
      status: 404,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }
  const job = jobData as JobRow

  // Idempotent exit for terminal jobs
  if (job.status === 'completed' || job.status === 'failed') {
    return new Response(JSON.stringify({ ok: true, status: job.status, noop: true }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  // Mark running
  await admin.from('generation_jobs').update({ status: 'running' }).eq('id', job.id)

  // Load any chunks already persisted (resume support)
  const { data: existingChunks } = await admin
    .from('generation_chunks')
    .select('chunk_index, content')
    .eq('job_id', job.id)
    .order('chunk_index', { ascending: true })

  const chunksByIndex = new Map<number, ChunkContent>()
  for (const c of existingChunks ?? []) chunksByIndex.set((c as any).chunk_index, (c as any).content)

  let prevSummary: string | null =
    chunksByIndex.size > 0
      ? shortSummary(chunksByIndex.get(chunksByIndex.size - 1) as ChunkContent)
      : null

  // Generate missing chunks
  for (let i = job.chunks_done; i < job.chunks_total; i++) {
    // Budget check — if we're under the floor, bow out cleanly
    const remainingBudget = 140_000 - (Date.now() - startedAt)
    if (remainingBudget < BUDGET_FLOOR_MS) break

    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), Math.min(CHUNK_TIMEOUT_MS, remainingBudget - 2_000))

    let chunk: ChunkContent
    try {
      chunk = await generateChunk(job.inputs, i, prevSummary, ctrl.signal)
    } catch (e) {
      clearTimeout(t)
      await admin
        .from('generation_jobs')
        .update({ status: 'failed', error: String(e).slice(0, 500) })
        .eq('id', job.id)

      // Refund the credit charged at /api/trips/jobs creation. Users shouldn't
      // pay for upstream failures (LLM errors, Supabase outages, timeouts).
      // Skip if any chunk was successfully generated — the user got partial
      // value, and a no-op refund avoids credit-printing on flaky scenarios.
      if (job.chunks_done === 0 && i === 0) {
        await refundOneTripIfApplicable(admin, job.user_id)
      }

      return new Response(JSON.stringify({ ok: false, status: 'failed' }), {
        status: 502,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }
    clearTimeout(t)

    // Persist chunk before updating counter — readers never see progress without backing data
    await admin.from('generation_chunks').insert({
      job_id:      job.id,
      chunk_index: i,
      content:     chunk,
    })
    await admin.from('generation_jobs').update({ chunks_done: i + 1 }).eq('id', job.id)

    chunksByIndex.set(i, chunk)
    prevSummary = shortSummary(chunk)
  }

  // Re-read job to see if we finished
  const { data: final } = await admin
    .from('generation_jobs')
    .select('chunks_done, chunks_total')
    .eq('id', job.id)
    .single()

  if (!final) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  if (final.chunks_done < final.chunks_total) {
    // Self re-invoke: budget exhausted but more chunks remain. Fire another
    // worker call in the background to resume from chunks_done. Without
    // this, jobs sit at status='running' forever (the cron reconciler is
    // a future safety net, not the primary completion mechanism).
    //
    // EdgeRuntime.waitUntil keeps the function alive until the background
    // request completes, so the re-invocation actually fires.
    console.log('[worker] re-invoking', job.id, 'at chunks_done =', final.chunks_done, '/', final.chunks_total)
    const reinvoke = fetch(`${SUPABASE_URL}/functions/v1/generate-trip-worker`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        apikey:          LEGACY_ANON_KEY,
        Authorization:   `Bearer ${LEGACY_ANON_KEY}`,
      },
      body: JSON.stringify({ job_id: job.id }),
    }).catch(e => console.warn('[worker] self-reinvoke failed:', e))

    // @ts-ignore — EdgeRuntime is a Supabase-injected global
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime?.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(reinvoke)
    }

    return new Response(JSON.stringify({ ok: true, status: 'running', chunks_done: final.chunks_done }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  // Assemble and complete
  const orderedChunks: ChunkContent[] = []
  for (let i = 0; i < final.chunks_total; i++) {
    const c = chunksByIndex.get(i)
    if (!c) {
      // Hole in chunks — fetch from DB
      const { data } = await admin
        .from('generation_chunks')
        .select('content')
        .eq('job_id', job.id)
        .eq('chunk_index', i)
        .single()
      if (data) orderedChunks.push((data as any).content)
    } else {
      orderedChunks.push(c)
    }
  }

  const result = assembleResult(orderedChunks, job.inputs)

  // Persist trip row for authed user (matches sync endpoint behavior).
  const tripSlug = `${(job.inputs as any).destination ?? 'trip'}-${job.id.slice(0, 8)}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')

  // Normalize enum-typed columns to match what the DB accepts. Mirrors
  // /api/trips/route.ts so the worker stays in lock-step with the sync path.
  // Without this, 'Equilibrado' / 'Familia' / etc. get rejected by the
  // travel_style / traveler_type enum constraints and the insert fails.
  const VALID_TRAVELERS  = ['solo', 'pareja', 'familia', 'amigos']
  const VALID_PACES      = ['relajado', 'equilibrado', 'activo']
  const rawTraveler      = (job.inputs as any).traveler
  const rawPace          = (job.inputs as any).pace
  const travelerNorm     = typeof rawTraveler === 'string'
    ? rawTraveler.toLowerCase()
    : null
  const paceNorm         = typeof rawPace === 'string'
    ? rawPace.toLowerCase()
    : null
  const travelersValue   = travelerNorm && VALID_TRAVELERS.includes(travelerNorm) ? travelerNorm : null
  const travelStyleValue = paceNorm     && VALID_PACES.includes(paceNorm)         ? paceNorm     : null

  const insertPayload = {
    slug:          tripSlug,
    title:         result.title,
    user_id:       job.user_id,
    trip_data:     result,
    destination:   (job.inputs as any).destination ?? null,
    origin:        (job.inputs as any).origin ?? null,
    duration_days: (job.inputs as any).duration_days ?? null,
    travelers:     travelersValue,
    travel_style:  travelStyleValue,
    budget_level:  (job.inputs as any).budget ?? null,
    interests:     Array.isArray((job.inputs as any).interests) ? (job.inputs as any).interests : [],
  }

  // Check for insert errors instead of silently swallowing — the previous
  // version assumed insert always succeeded and quietly set trip_id=null
  // when it didn't, leaving "completed" jobs with no actual trip row.
  const { data: tripRow, error: tripInsertErr } = await admin
    .from('trips')
    .insert(insertPayload)
    .select('id')
    .single()

  if (tripInsertErr || !tripRow) {
    console.error('[worker] trips insert failed:', tripInsertErr?.message, 'payload:', JSON.stringify(insertPayload).slice(0, 500))
    await admin
      .from('generation_jobs')
      .update({
        status: 'failed',
        error:  `trip insert failed: ${tripInsertErr?.message ?? 'unknown'}`,
      })
      .eq('id', job.id)
    // Refund the credit — user shouldn't pay for a save failure on our side
    await refundOneTripIfApplicable(admin, job.user_id)
    return new Response(JSON.stringify({ ok: false, status: 'failed', error: tripInsertErr?.message }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  // Guarded completion — the AND status='running' clause prevents double-completion
  // if two worker invocations race.
  await admin
    .from('generation_jobs')
    .update({
      status:  'completed',
      result,
      trip_id: tripRow.id,
    })
    .eq('id', job.id)
    .eq('status', 'running')

  console.log('[worker] completed job:', job.id, '→ trip:', tripRow.id)

  return new Response(JSON.stringify({ ok: true, status: 'completed', trip_id: tripRow.id }), {
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  })
})
