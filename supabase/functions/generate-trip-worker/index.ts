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

// Budget: Supabase Free Edge Functions cap at 150s. A 5-day segment on
// Sonnet 4.6 takes ~100s — ~45s margin under the 145s timeout — sized
// for real-world variance, not the optimistic average. See history
// below and scripts/test-sonnet-4-6-shape.ts for the diagnostic data.
// BUDGET_FLOOR_MS at 135_000 — high enough that we never START a
// segment we can't reasonably complete.
const BUDGET_FLOOR_MS = 135_000

// Per-segment LLM call timeout — sized for a 5-day segment on
// Sonnet 4.6 with healthy margin. We abort at 145s, 5s before
// Supabase kills the function at 150s, so the worker has time to
// gracefully record the failure + refund the credit.
const CHUNK_TIMEOUT_MS = 145_000

// Segment size — number of days per generate-trip call. History:
//   • Pre-2026-04: 1 day per call. 30-chunk chains were fragile.
//   • 2026-04 → 2026-05-25: 10 days on Sonnet 4.0 (chunks ~130s, fit
//     in Supabase Free's 150s cap with margin).
//   • 2026-05-26 morning: tried 7 days on Sonnet 4.6 (chunks ~135-140s
//     in diagnostics, but real-world variance pushed it over 145s on
//     prod runs — T1b 11-day Oaxaca aborted at chunk 0).
//   • 2026-05-26 evening: dropped to 5 days on Sonnet 4.6 — chunks
//     ~100s, ~45s safety margin. Adds ~1 chunk per 30-day trip vs
//     the 7-day setting (was 5, now 6) but eliminates the timeout
//     class of failures.
// If we ever upgrade Supabase to Pro/Team (400s cap), we can return
// to 10-day segments. Keep this in sync with `app/api/trips/jobs/route.ts`
// which uses the same constant for chunks_total computation.
const SEGMENT_DAYS = 5

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

type TripSegment = {
  destination: string
  startDate:   string
  endDate:     string
  nights:      number
  origin?:     string
}

function getTripSegments(jobInputs: Record<string, any>): TripSegment[] | null {
  const raw = jobInputs?.segments
  if (!Array.isArray(raw) || raw.length < 2) return null
  // Defensive validation — drop malformed entries rather than throwing,
  // so a bad segment shape downgrades gracefully to single-city.
  const valid = raw.filter(s => s && typeof s === 'object'
    && typeof s.destination === 'string' && s.destination
    && typeof s.startDate   === 'string' && s.startDate
    && typeof s.endDate     === 'string' && s.endDate)
  return valid.length >= 2 ? (valid as TripSegment[]) : null
}

// Sub-chunk plan for multi-city jobs. A long segment (e.g. 23 days in
// Gothenburg) won't fit a single Edge Fn call, so we further split each
// segment into sub-chunks of at most SEGMENT_DAYS. Each plan entry
// describes one Edge Fn call. Chunk indexing in the job table maps
// directly to this array's index.
type ChunkPlanEntry = {
  segmentIndex: number   // which segment of the chain this chunk belongs to
  subIndex:     number   // 0-indexed position within that segment
  segSubCount:  number   // total sub-chunks for this segment (for the AI hint)
  dayOffset:    number   // day offset within the segment (0-indexed)
  subDays:      number   // number of days this chunk covers
}

function planMultiCityChunks(segments: TripSegment[]): ChunkPlanEntry[] {
  const plan: ChunkPlanEntry[] = []
  for (let segIdx = 0; segIdx < segments.length; segIdx++) {
    // nights+1 = inclusive day count for the segment (check-in day through
    // check-out day). Same-day segments still produce 1 day.
    const segDays = Math.max(1, segments[segIdx].nights + 1)
    const subCount = Math.ceil(segDays / SEGMENT_DAYS)
    let offset = 0
    for (let subIdx = 0; subIdx < subCount; subIdx++) {
      const subDays = Math.min(SEGMENT_DAYS, segDays - offset)
      plan.push({
        segmentIndex: segIdx,
        subIndex:     subIdx,
        segSubCount:  subCount,
        dayOffset:    offset,
        subDays,
      })
      offset += subDays
    }
  }
  return plan
}

// Pure helper exposed for the API route to compute chunks_total without
// duplicating the planning logic. Returns the count (≥1).
function countMultiCityChunks(segments: TripSegment[]): number {
  return planMultiCityChunks(segments).length
}

function addDaysISO(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

async function generateSegment(jobInputs: Record<string, any>, chunkIndex: number, totalChunks: number, prevSummary: string | null, signal: AbortSignal): Promise<ChunkContent> {
  const multiCity = getTripSegments(jobInputs)

  let segmentPayload: Record<string, any>

  if (multiCity) {
    // ── Multi-city: chunk = (segment, sub-range within segment) ─────────────
    // Build the plan once per call (cheap, ≤ ~10 entries) and look up the
    // entry for this chunk index. Long segments are split into multiple
    // sub-chunks so each Edge Fn call stays under the resource budget.
    const plan = planMultiCityChunks(multiCity)
    if (chunkIndex >= plan.length) {
      throw new Error(`chunk_index ${chunkIndex} out of range for multi-city plan (length ${plan.length})`)
    }
    const entry = plan[chunkIndex]
    const seg   = multiCity[entry.segmentIndex]

    const subStartDate = addDaysISO(seg.startDate, entry.dayOffset)
    const subEndDate   = addDaysISO(seg.startDate, entry.dayOffset + entry.subDays - 1)

    // Origin: explicit segment origin > previous segment's destination >
    // jobInputs.origin (trip-level origin).
    const segOrigin = seg.origin
      ?? (entry.segmentIndex === 0 ? jobInputs.origin : multiCity[entry.segmentIndex - 1].destination)

    // Strip segments + multi-city-only fields from the forwarded payload so
    // the generate-trip Edge Function doesn't double-apply the multi-city
    // prompt branch.
    const { segments: _drop, ...singleCityBase } = jobInputs as any

    segmentPayload = {
      ...singleCityBase,
      destination:  seg.destination,
      origin:       segOrigin,
      start:        subStartDate,
      end:          subEndDate,
      nights:       Math.max(0, entry.subDays - 1),
      duration_days: entry.subDays,
      previous_day_summary: prevSummary ?? undefined,
      // Diagnostic / informational fields. generate-trip's prompt ignores
      // these today, but they show up in logs and serve as a hook for
      // future per-chunk prompt tuning ("Tell the AI this is sub-chunk 2
      // of 3 for this segment").
      segment_index:    entry.segmentIndex,
      total_segments:   multiCity.length,
      sub_chunk_index:  entry.subIndex,
      sub_chunk_total:  entry.segSubCount,
    }
  } else {
    // ── Single-city: original day-block chunking ────────────────────────────
    const totalDays      = Math.max(1, Math.min(35, Number(jobInputs.duration_days) || 1))
    const segmentStartIdx = chunkIndex * SEGMENT_DAYS
    const segmentDayCount = Math.min(SEGMENT_DAYS, totalDays - segmentStartIdx)

    const tripStart = new Date(jobInputs.start)
    const segmentStartDate = new Date(tripStart)
    segmentStartDate.setDate(tripStart.getDate() + segmentStartIdx)
    const segmentEndDate = new Date(segmentStartDate)
    segmentEndDate.setDate(segmentStartDate.getDate() + segmentDayCount - 1)

    segmentPayload = {
      ...jobInputs,
      duration_days:        segmentDayCount,
      segment_index:        chunkIndex,
      total_segments:       totalChunks,
      previous_day_summary: prevSummary ?? undefined,
      start: segmentStartDate.toISOString().slice(0, 10),
      end:   segmentEndDate.toISOString().slice(0, 10),
    }
  }

  const res = await callGenerateTrip(segmentPayload, signal)
  if (!res?.trip_data) throw new Error('segment response missing trip_data')
  if (chunkIndex === 0) {
    console.log('[worker] chunk[0] keys:', Object.keys(res.trip_data || {}))
    console.log('[worker] chunk[0] day count:', Array.isArray(res.trip_data?.days) ? res.trip_data.days.length : 'n/a')
    console.log('[worker] chunk[0] mode:', multiCity ? 'multi-city (sub-chunked)' : 'single-city')
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
  // Concatenate per-segment outputs into a single trip_data shape matching
  // what the sync endpoint returns. Each chunk is a segment containing up
  // to SEGMENT_DAYS days (single-city) OR one segment of the chain (multi-
  // city). Day numbers are cumulative across segments so users see "Day 17"
  // not "Segment 2 Day 7". Trip-level metadata (title, subtitle, budget,
  // packing) comes from the first segment; the rest are discarded.
  const first     = chunks[0] ?? {}
  const multiCity = getTripSegments(jobInputs)
  let dayCounter = 0
  const days: any[] = []
  const accommodations: any[] = []

  // Each segment is generated as an independent single-city call, so the
  // AI numbers days from 1 *within* that segment. After we bump day_number
  // to be cumulative across the trip, the AI-emitted strings ("Día 7 ·
  // Gothenburg — ...") become inconsistent with the card header ("DÍA 17").
  // Rewrite the leading "Día N" / "Day N" prefix in day_label + title so
  // the displayed numbers line up. Match Spanish + English; case-insensitive
  // on the day word; tolerate spaces around the dot separator.
  const dayLeadRE = /^(D[ií]a|Day)\s+\d+/i
  function renumberLeadingDay(s: unknown, n: number): string | undefined {
    if (typeof s !== 'string' || !s) return s as undefined
    return dayLeadRE.test(s)
      ? s.replace(dayLeadRE, (m) => m.replace(/\d+/, String(n)))
      : s
  }

  // For multi-city: build chunk→segment mapping so we only count the FIRST
  // sub-chunk of each segment for accommodations (a long segment splits
  // into multiple sub-chunks, each of which would emit its own
  // accommodation entry — we want one per segment, not one per sub-chunk).
  const plan = multiCity ? planMultiCityChunks(multiCity) : null
  const accommodationsSeenForSegment = new Set<number>()

  for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
    const chunk = chunks[chunkIdx]
    const segmentDays = chunkDays(chunk)
    for (const day of segmentDays) {
      dayCounter += 1
      days.push({
        ...day,
        day_number: dayCounter,
        day_label:  renumberLeadingDay((day as any).day_label, dayCounter),
        title:      renumberLeadingDay((day as any).title,     dayCounter),
      })
    }
    // Accommodations: in single-city, every chunk's accommodation block
    // describes the same lodging (or the AI's best guess each time); pick
    // the first non-empty. In multi-city, take exactly one per segment —
    // from the first sub-chunk of each segment — and skip duplicates from
    // sub-chunks that re-emit the same hotel.
    const chunkAccs = Array.isArray((chunk as any)?.accommodations) ? (chunk as any).accommodations : []
    if (chunkAccs.length === 0) continue
    if (plan) {
      const segIdx = plan[chunkIdx]?.segmentIndex
      if (segIdx !== undefined && !accommodationsSeenForSegment.has(segIdx)) {
        accommodations.push(...chunkAccs)
        accommodationsSeenForSegment.add(segIdx)
      }
    } else if (accommodations.length === 0) {
      // Single-city: take the first non-empty accommodation block.
      accommodations.push(...chunkAccs)
    }
  }

  // Title patching:
  //
  // The first chunk's title is generated by the AI as if it were a complete
  // trip (because each chunk is an isolated single-city generation). For a
  // multi-chunk trip (>SEGMENT_DAYS), the AI titles chunk 0 with the
  // chunk's own day count — e.g. an 11-day Oaxaca trip with SEGMENT_DAYS=7
  // gets "7 Días en Oaxaca: Arte, Sabor y Tradición" because chunk 0 is
  // 7 days long. The trip itself is 11 days, so the displayed title is
  // wrong even though the rest of the itinerary is fine.
  //
  // Fix: take the AI title (which has nice creative additions like
  // ": Arte, Sabor y Tradición") and patch ONLY the leading day count.
  // Preserves the AI's flair while showing the correct duration. If the
  // title doesn't start with a "N días"/"N day(s)" prefix we leave it
  // alone — already correct.
  const tripLocale: 'es' | 'en' = jobInputs.locale === 'en' ? 'en' : 'es'
  const totalTripDays = (() => {
    if (multiCity) return multiCity.reduce((sum, s) => sum + Math.max(1, s.nights + 1), 0)
    const fromInputs = Number(jobInputs.duration_days)
    return Number.isFinite(fromInputs) && fromInputs > 0 ? fromInputs : days.length
  })()

  // ES patterns: "7 Días en X", "1 Día en X" (case-insensitive on the day word).
  // EN patterns: "7 Days in X", "1 Day in X".
  // Match only at start-of-string so we don't accidentally rewrite a "7-day"
  // inside the middle of a title (rare but possible).
  function patchTitleDayCount(raw: string | undefined): string | undefined {
    if (typeof raw !== 'string' || !raw) return undefined
    const esMatch = raw.match(/^\d+\s+d[ií]as?/i)
    if (esMatch) {
      const word = totalTripDays === 1 ? 'día' : 'días'
      return raw.replace(esMatch[0], `${totalTripDays} ${word}`)
    }
    const enMatch = raw.match(/^\d+\s+days?/i)
    if (enMatch) {
      const word = totalTripDays === 1 ? 'Day' : 'Days'
      return raw.replace(enMatch[0], `${totalTripDays} ${word}`)
    }
    return raw // no day-count prefix, leave as-is
  }

  const aiTitle      = (first as any).title as string | undefined
  const patchedTitle = patchTitleDayCount(aiTitle)

  // Title for multi-city: prefer first segment's title (which the AI named
  // for that city) but fall back to a chain summary.
  const fallbackTitle = multiCity
    ? (tripLocale === 'en'
        ? `Multi-city trip: ${multiCity.map(s => s.destination).join(' → ')}`
        : `Viaje multi-ciudad: ${multiCity.map(s => s.destination).join(' → ')}`)
    : (tripLocale === 'en'
        ? `${totalTripDays} ${totalTripDays === 1 ? 'day' : 'days'} in ${jobInputs.destination}`
        : `${totalTripDays} ${totalTripDays === 1 ? 'día' : 'días'} en ${jobInputs.destination}`)

  console.log('[worker] assembled result:', {
    mode:               multiCity ? 'multi-city' : 'single-city',
    segments_count:     chunks.length,
    days_count:         days.length,
    accommodations:     accommodations.length,
    first_segment_keys: Object.keys(first || {}),
  })

  // Budget: prefer the schema-canonical `budget_breakdown` (what the Edge Fn
  // actually emits per its TRIP_SCHEMA). Fall back to legacy `budget` for
  // safety. For multi-city, take the first chunk's breakdown — aggregating
  // per-segment ranges is non-trivial (they're strings like "$4,000 - $6,000")
  // and a single representative breakdown is better than empty.
  const firstBudget = (first as any).budget_breakdown ?? (first as any).budget ?? null

  // Subtitle fallback also locale-aware. The AI usually emits a subtitle;
  // when it doesn't, this fallback covers it (and unlike title, the AI's
  // subtitle on chunk 0 has been observed correct in production —
  // patching isn't needed here, only the fallback's hardcoded language).
  const fallbackSubtitle = tripLocale === 'en'
    ? `${totalTripDays} ${totalTripDays === 1 ? 'day' : 'days'}`
    : `${totalTripDays} ${totalTripDays === 1 ? 'día' : 'días'}`

  return {
    title:            patchedTitle ?? fallbackTitle,
    subtitle:         (first as any).subtitle ?? fallbackSubtitle,
    destination:      jobInputs.destination,
    days,
    accommodations:   accommodations.length > 0 ? accommodations : ((first as any).accommodations ?? null),
    budget_breakdown: firstBudget,
    packing:          (first as any).packing  ?? null,
    // Preserve segments on the saved trip_data so the result page hydrates
    // the multi-city chip row + drawer summary on DB load.
    ...(multiCity ? { segments: multiCity } : {}),
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
  // Compact summary of the segment we just generated, used as a continuity
  // hint for the next segment's prompt. Picks day titles only (skipping
  // activities to keep the summary short) so the next segment sees a
  // sequence like "Day 1: Centro Histórico · Day 2: Coyoacán · ...".
  // Capped at 400 chars — long enough to convey segment shape without
  // bloating subsequent prompts.
  const days = chunkDays(chunk)
  if (days.length === 0) return ''
  const titles = days.map((d: any) => d?.title).filter(Boolean)
  return titles.join(' · ').slice(0, 400)
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

  // Load any segments already persisted (resume support). Each row in
  // generation_chunks is now one segment (up to SEGMENT_DAYS days),
  // not one day — but the table name and column names stay for backward
  // compatibility with existing data and the polling endpoint.
  const { data: existingChunks } = await admin
    .from('generation_chunks')
    .select('chunk_index, content')
    .eq('job_id', job.id)
    .order('chunk_index', { ascending: true })

  const chunksByIndex = new Map<number, ChunkContent>()
  for (const c of existingChunks ?? []) chunksByIndex.set((c as any).chunk_index, (c as any).content)

  // Continuity hint for the next segment: summary of the most recently
  // persisted segment. Uses chunks_done - 1 (the last completed index)
  // rather than size - 1, which would be wrong if chunks ever come back
  // sparse (resumed mid-failure).
  let prevSummary: string | null =
    job.chunks_done > 0 && chunksByIndex.has(job.chunks_done - 1)
      ? shortSummary(chunksByIndex.get(job.chunks_done - 1) as ChunkContent)
      : null

  // Generate missing segments
  for (let i = job.chunks_done; i < job.chunks_total; i++) {
    // Budget check — if we're under the floor, bow out cleanly. With
    // BUDGET_FLOOR_MS = 135s and segment time ~130s, this means at most
    // one segment per invocation. Self-reinvoke (or cron) handles the rest.
    const remainingBudget = 140_000 - (Date.now() - startedAt)
    if (remainingBudget < BUDGET_FLOOR_MS) break

    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), Math.min(CHUNK_TIMEOUT_MS, remainingBudget - 2_000))

    let chunk: ChunkContent
    try {
      chunk = await generateSegment(job.inputs, i, job.chunks_total, prevSummary, ctrl.signal)
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

    // Persist chunk before updating counter — readers never see progress
    // without backing data. Wrapped in try/catch because the previous version
    // had these awaits OUTSIDE any error handling; if either DB call threw
    // (network blip, unique-constraint collision from a partial prior run,
    // RLS misconfiguration), the function died with an unhandled exception
    // and the job sat in status='running' forever, never reaching the cron
    // reconciler's "rescue stuck jobs" heuristic. Mark failed instead.
    // Reflect the new chunk in the in-memory map BEFORE the persist try
    // block so the progressive partial-assembly inside it sees the latest
    // chunk too. Persistence failures still mark the job failed below;
    // they don't poison the in-memory state because the function returns
    // immediately in that branch.
    chunksByIndex.set(i, chunk)

    try {
      const { error: insertErr } = await admin
        .from('generation_chunks')
        .insert({ job_id: job.id, chunk_index: i, content: chunk })
      if (insertErr) throw new Error(`chunks insert failed: ${insertErr.message}`)

      const { error: updateErr } = await admin
        .from('generation_jobs')
        .update({ chunks_done: i + 1 })
        .eq('id', job.id)
      if (updateErr) throw new Error(`chunks_done update failed: ${updateErr.message}`)

      // ── Progressive partial assembly (streaming-UI feature) ─────────────
      // After every chunk completes, recompute assembleResult() over the
      // chunks-so-far and write it to generation_jobs.partial_result. The
      // polling endpoint exposes this column; TripResult.tsx renders
      // whatever days exist while waiting for the rest. The user sees the
      // first chunk's days at ~100s instead of waiting the full 10 min
      // for a long trip.
      //
      // Inner try/catch is defensive: a failure to compute or write the
      // partial_result must NOT fail the chunk persistence — partial is
      // a UX enhancement, not load-bearing. If it fails, the client just
      // shows the regular spinner until the next chunk lands, or until
      // the final result is saved at completion.
      try {
        const chunksOrdered: ChunkContent[] = []
        for (let idx = 0; idx <= i; idx++) {
          const c = chunksByIndex.get(idx)
          if (c) chunksOrdered.push(c)
        }
        const partial = assembleResult(chunksOrdered, job.inputs)
        const { error: partialErr } = await admin
          .from('generation_jobs')
          .update({ partial_result: partial } as any)
          .eq('id', job.id)
        if (partialErr) {
          console.warn('[worker] partial_result write failed at chunk', i, partialErr.message)
        }
      } catch (assemblyErr) {
        console.warn('[worker] partial_result assembly threw at chunk', i, assemblyErr)
      }
    } catch (persistErr) {
      console.error('[worker] chunk persist failed at index', i, persistErr)
      await admin
        .from('generation_jobs')
        .update({ status: 'failed', error: String(persistErr).slice(0, 500) })
        .eq('id', job.id)
      // Don't refund here — chunks generated successfully (we paid for the
      // LLM calls). The persistence failure is on us; eat it rather than
      // also clawing back the credit, which compounds the user impact.
      return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'persist' }), {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

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
