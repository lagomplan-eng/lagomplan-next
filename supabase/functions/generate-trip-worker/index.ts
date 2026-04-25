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
const ANON_KEY          = Deno.env.get('SUPABASE_ANON_KEY')!

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
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-trip`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      Authorization:   `Bearer ${ANON_KEY}`,
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
  return res.trip_data
}

function assembleResult(chunks: ChunkContent[], jobInputs: Record<string, any>): Record<string, any> {
  // Concatenate per-day outputs into a single trip_data shape that matches
  // what the sync endpoint returns. The sync endpoint's trip_data typically
  // includes { title, subtitle, days, budget, packing }. We pull days from
  // each chunk, keep metadata from the first chunk.
  const first = chunks[0] ?? {}
  const days = chunks.flatMap((c, i) => {
    const d = Array.isArray(c.days) ? c.days : []
    return d.map((day: any, j: number) => ({ ...day, day_number: i + 1 + j }))
  })
  return {
    title:       first.title       ?? `Viaje a ${jobInputs.destination}`,
    subtitle:    first.subtitle    ?? `${jobInputs.duration_days} días`,
    destination: jobInputs.destination,
    days,
    budget:      first.budget      ?? null,
    packing:     first.packing     ?? null,
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
    // Not done — reconciler or client will call us back
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

  const { data: tripRow } = await admin
    .from('trips')
    .insert({
      slug:          tripSlug,
      title:         result.title,
      user_id:       job.user_id,
      trip_data:     result,
      destination:   (job.inputs as any).destination ?? null,
      origin:        (job.inputs as any).origin ?? null,
      duration_days: (job.inputs as any).duration_days ?? null,
      travelers:     (job.inputs as any).traveler ?? null,
      travel_style:  (job.inputs as any).pace ?? null,
      budget_level:  (job.inputs as any).budget ?? null,
      interests:     Array.isArray((job.inputs as any).interests) ? (job.inputs as any).interests : [],
    })
    .select('id')
    .single()

  // Guarded completion — the AND status='running' clause prevents double-completion
  // if two worker invocations race.
  await admin
    .from('generation_jobs')
    .update({
      status:  'completed',
      result,
      trip_id: tripRow?.id ?? null,
    })
    .eq('id', job.id)
    .eq('status', 'running')

  return new Response(JSON.stringify({ ok: true, status: 'completed' }), {
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  })
})
