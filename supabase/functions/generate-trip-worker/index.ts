// supabase/functions/generate-trip-worker/index.ts
//
// Re-entrant worker for async trip generation.
//
// Contract:
//   - Invoked with { job_id } (POST body).
//   - Reads the job row. Idempotent: exits cleanly if already completed/failed.
//   - SINGLE-CITY: runs a cheap Haiku "skeleton" pre-pass (one theme/
//     neighborhood/anchor/pace entry per day), then generates all days
//     CONCURRENTLY (batches of SC_CONCURRENCY), each a standalone 1-day Claude
//     call anchored to its skeleton entry instead of a sequential
//     previous-day summary.
//   - MULTI-CITY: unchanged — sequential per-segment generation with the
//     original previous_day_summary continuity hint. Nothing in this file's
//     multi-city path was touched; see the 2026-09-23 PR description for
//     why (the day-level concurrency redesign was scoped to single-city).
//   - When all chunks are persisted, assembles them into final trip_data,
//     writes result on the job row, inserts the trip row, sets status='completed'.
//   - If runtime budget gets low, exits with status='running'; the
//     self-reinvoke chain (or the reconciler) re-invokes and resumes from
//     chunks_done.
//
// The existing /functions/v1/generate-trip Edge Function produces a full trip
// in one call. For v1 we delegate per-chunk generation to the SAME Edge Function
// by calling it with day-scoped inputs, then combine the results here. This
// avoids re-implementing prompt engineering in two places.

// deno-lint-ignore-file no-explicit-any
// @ts-nocheck — Deno runtime; types resolved at deploy time

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { normalizeJobInputsForTripsInsert } from './logic.ts'

const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Use the LEGACY JWT-format anon key (set as a custom secret), not the
// auto-injected SUPABASE_ANON_KEY. Supabase rolled out new opaque
// `sb_publishable_*` keys that the existing /functions/v1/generate-trip
// function — deployed before the rollout — rejects as "Invalid JWT format".
// LEGACY_ANON_KEY is the original eyJhbGc... JWT-format anon key.
const LEGACY_ANON_KEY   = Deno.env.get('LEGACY_ANON_KEY') ?? ''

// Same project-wide secret generate-trip/index.ts reads — used here only
// for the skeleton pre-pass, which calls Anthropic directly (Haiku) rather
// than going through generate-trip (which is Sonnet-only).
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
// Env-overridable, same rollback-lever pattern as generate-trip's
// GENERATE_TRIP_MODEL — flip via `supabase secrets set` with no redeploy.
const SKELETON_MODEL    = Deno.env.get('SKELETON_MODEL') ?? 'claude-haiku-4-5-20251001'

// Fire-and-forget metrics logging for the skeleton (Haiku) call — the only
// Anthropic call this file makes directly. Per-chunk generate-trip calls
// log their own metrics row inside generate-trip/index.ts itself (that
// function is the one actually talking to Anthropic for those).
function logGenerationMetric(row: Record<string, unknown>): void {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return
  fetch(`${SUPABASE_URL}/rest/v1/generation_metrics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey:         SERVICE_ROLE_KEY,
      Authorization:  `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer:         'return=minimal',
    },
    body: JSON.stringify(row),
  }).catch((e) => console.warn('[worker] metrics insert failed:', e))
}

// Diagnostics: log key shape on cold start so we can confirm the secret was
// set as a real JWT (eyJhbGc...) and not, e.g., the new sb_publishable_* key
// or an empty value.
console.log('[worker] env check:', {
  url:          SUPABASE_URL?.slice(0, 40) || 'MISSING',
  legacy_anon:  LEGACY_ANON_KEY ? `${LEGACY_ANON_KEY.slice(0, 10)}... (len=${LEGACY_ANON_KEY.length})` : 'EMPTY',
  legacy_starts_eyJ: LEGACY_ANON_KEY.startsWith('eyJ'),
  anthropic_key_present: !!ANTHROPIC_API_KEY,
})

// ── MC_* — multi-city constants (UNCHANGED values — see file header) ─────
//
// Deliberately NOT shared with the single-city SC_* constants below: MC_
// still runs 3-5 day segments at ~130s each and would abort mid-generation
// if it ever inherited SC_'s 60s/70s budget, which is sized for 1-day
// chunks. Two fully separate constant sets, two fully separate functions.
//
// Budget: Supabase Free Edge Functions cap at 150s. A 5-day segment on
// Sonnet 4.6 takes ~100s — ~45s margin under the 145s timeout — sized
// for real-world variance, not the optimistic average. See history
// below and scripts/test-sonnet-4-6-shape.ts for the diagnostic data.
const MC_BUDGET_FLOOR_MS = 135_000
const MC_CHUNK_TIMEOUT_MS = 145_000
// Segment size for multi-city sub-chunking — number of days per generate-trip
// call within one real-world segment. History:
//   • Pre-2026-04: 1 day per call. 30-chunk chains were fragile.
//   • 2026-04 → 2026-05-25: 10 days on Sonnet 4.0.
//   • 2026-05-26 morning: tried 7 days on Sonnet 4.6 — failed in prod.
//   • 2026-05-26 evening: dropped to 5 days on Sonnet 4.6 — ~100s, ~45s margin.
// Keep in sync with `app/api/trips/jobs/route.ts`'s multi-city chunksTotal math.
const MC_SEGMENT_DAYS = 5

// ── SC_* — single-city constants (NEW — day-level concurrency redesign) ──
//
// One Claude call per day, up to SC_CONCURRENCY days in flight at once,
// each bounded by its own 60s timeout. Replaces the old 5-day sequential
// segment loop for single-city trips only. See PR description for the
// full rationale. Deliberately NOT shared with MC_* — see note above.
const SC_DAYS_PER_CHUNK   = 1
const SC_CONCURRENCY      = 8
const SC_CHUNK_TIMEOUT_MS = 60_000
const SC_BUDGET_FLOOR_MS  = 70_000
// Hard ceiling on retry wall-clock, measured from invocation start. Once
// elapsed time crosses this, stop retrying rejected chunks in THIS
// invocation and let the self-reinvoke fallback (below) pick up whatever's
// still missing in a fresh invocation with a fresh budget.
const SC_RETRY_ABANDON_MS = 100_000
const SC_MAX_RETRIES      = 2
const SC_RETRY_BACKOFF_MS = [1_000, 2_000]

type JobRow = {
  id:           string
  user_id:      string
  status:       'queued' | 'running' | 'completed' | 'failed'
  inputs:       Record<string, any>
  chunks_total: number
  chunks_done:  number
  skeleton?:    SkeletonDay[] | null
}

type ChunkContent = Record<string, any>

type SkeletonDay = {
  day:            number
  theme:          string
  neighborhood:   string
  anchor:         string
  pace:           string
  // city/travel_day/transfer_hours: schema is ready for the multi-city
  // unification follow-up (see PR discussion — single-city ships alone in
  // THIS PR; the outline pass hasn't yet been proven to respect a
  // pre-specified segment list, only tested inventing its own routing).
  // Unused by the single-city path today: every day is the same city, so
  // generateSkeleton() below always sets city to the trip destination and
  // travel_day to false.
  city:           string
  travel_day:     boolean
  transfer_hours: number
}

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

// Sub-chunk plan for multi-city jobs (UNCHANGED). A long segment (e.g. 23
// days in Gothenburg) won't fit a single Edge Fn call, so we further split
// each segment into sub-chunks of at most MC_SEGMENT_DAYS. Each plan entry
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
    const subCount = Math.ceil(segDays / MC_SEGMENT_DAYS)
    let offset = 0
    for (let subIdx = 0; subIdx < subCount; subIdx++) {
      const subDays = Math.min(MC_SEGMENT_DAYS, segDays - offset)
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

// ── NEW: single-city day plan ─────────────────────────────────────────────
// One entry per day (SC_DAYS_PER_CHUNK=1 today; kept as a loop over the
// constant rather than hardcoded, so a future tuning pass can change the
// step without touching call sites). Returns 0-indexed day offsets.
function planChunks(totalDays: number): number[] {
  const days: number[] = []
  for (let d = 0; d < totalDays; d += SC_DAYS_PER_CHUNK) days.push(d)
  return days
}

function addDaysISO(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

type SegmentResult = { chunk: ChunkContent; budgetCurrencySuspect: boolean | null }

// Multi-city segment generation (UNCHANGED behavior) — kept as its own
// function so the single-city day-chunk path below doesn't have to thread
// prevSummary through a shared signature.
async function generateMultiCitySegment(
  jobInputs: Record<string, any>,
  chunkIndex: number,
  prevSummary: string | null,
  signal: AbortSignal,
  jobId: string,
): Promise<SegmentResult> {
  const multiCity = getTripSegments(jobInputs)!
  const plan   = planMultiCityChunks(multiCity)
  if (chunkIndex >= plan.length) {
    throw new Error(`chunk_index ${chunkIndex} out of range for multi-city plan (length ${plan.length})`)
  }
  const entry = plan[chunkIndex]
  const seg   = multiCity[entry.segmentIndex]

  const subStartDate = addDaysISO(seg.startDate, entry.dayOffset)
  const subEndDate   = addDaysISO(seg.startDate, entry.dayOffset + entry.subDays - 1)

  const segOrigin = seg.origin
    ?? (entry.segmentIndex === 0 ? jobInputs.origin : multiCity[entry.segmentIndex - 1].destination)

  const { segments: _drop, ...singleCityBase } = jobInputs as any

  const segmentPayload = {
    ...singleCityBase,
    destination:  seg.destination,
    origin:       segOrigin,
    start:        subStartDate,
    end:          subEndDate,
    nights:       Math.max(0, entry.subDays - 1),
    duration_days: entry.subDays,
    previous_day_summary: prevSummary ?? undefined,
    segment_index:    entry.segmentIndex,
    total_segments:   multiCity.length,
    sub_chunk_index:  entry.subIndex,
    sub_chunk_total:  entry.segSubCount,
    job_id:           jobId,
  }

  const res = await callGenerateTrip(segmentPayload, signal)
  if (!res?.trip_data) throw new Error('segment response missing trip_data')
  return {
    chunk: res.trip_data,
    budgetCurrencySuspect: typeof res.budget_currency_suspect === 'boolean' ? res.budget_currency_suspect : null,
  }
}

// ── NEW: single-city per-day chunk generation ─────────────────────────────
// One day per call. No previous_day_summary — anti-repetition/continuity
// comes from the upfront skeleton pre-pass instead (see generateSkeleton
// below), so days can be generated in any order / concurrently.
async function generateDayChunk(
  jobInputs: Record<string, any>,
  dayIndex: number,
  totalDays: number,
  daySkeleton: SkeletonDay | null,
  fullSkeleton: SkeletonDay[],
  signal: AbortSignal,
  jobId: string,
): Promise<SegmentResult> {
  const tripStartISO   = typeof jobInputs.start === 'string' ? jobInputs.start : new Date(jobInputs.start).toISOString().slice(0, 10)
  const dayStartISO    = addDaysISO(tripStartISO, dayIndex)

  const segmentPayload = {
    ...jobInputs,
    duration_days:   1,
    segment_index:   dayIndex,
    total_segments:  totalDays,
    trip_day_offset: dayIndex,
    trip_total_days: totalDays,
    trip_start_date: tripStartISO,
    trip_end_date:   addDaysISO(tripStartISO, totalDays - 1),
    start: dayStartISO,
    end:   dayStartISO,
    day_skeleton:  daySkeleton ?? undefined,
    full_skeleton: fullSkeleton,
    job_id:        jobId,
  }

  const res = await callGenerateTrip(segmentPayload, signal)
  if (!res?.trip_data) throw new Error('day chunk response missing trip_data')
  return {
    chunk: res.trip_data,
    budgetCurrencySuspect: typeof res.budget_currency_suspect === 'boolean' ? res.budget_currency_suspect : null,
  }
}

// ── NEW: skeleton pre-pass ─────────────────────────────────────────────────
// One small Haiku call producing a per-day theme/neighborhood/anchor/pace
// skeleton for the whole trip. Computed once per job (cached on the job
// row's `skeleton` column so a self-reinvoke doesn't redo it), and used by
// every day chunk to avoid repeating the same neighborhood/anchor across
// days despite being generated concurrently and out of order.
const SKELETON_SCHEMA = {
  type: 'object',
  required: ['days'],
  properties: {
    days: {
      type: 'array',
      items: {
        type: 'object',
        required: ['day', 'theme', 'neighborhood', 'anchor', 'pace'],
        properties: {
          day:          { type: 'integer' },
          theme:        { type: 'string' },
          neighborhood: { type: 'string' },
          anchor:       { type: 'string' },
          pace:         { type: 'string' },
        },
      },
    },
  },
}

async function generateSkeleton(
  jobInputs: Record<string, any>,
  totalDays: number,
  signal: AbortSignal,
  jobId: string,
): Promise<SkeletonDay[]> {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured for skeleton pass')

  const startedAt = Date.now()

  const isEN = jobInputs.locale === 'en'
  const interests = Array.isArray(jobInputs.interests) ? jobInputs.interests.join(', ') : ''

  const prompt = isEN
    ? `Plan a lightweight day-by-day skeleton for a ${totalDays}-day trip to ${jobInputs.destination} (traveler: ${jobInputs.traveler ?? 'n/a'}, pace: ${jobInputs.pace ?? 'n/a'}, budget: ${jobInputs.budget ?? 'n/a'}, interests: ${interests || 'general'}). For EACH day (1 to ${totalDays}), give a short theme, the main neighborhood/area, one anchor activity or place, and the pace. Vary neighborhoods and anchors across days — do not repeat the same neighborhood or anchor on two different days unless the trip is too short to avoid it. Call the emit_skeleton tool with exactly ${totalDays} day entries, one per day from 1 to ${totalDays}.`
    : `Planea un esqueleto ligero día por día para un viaje de ${totalDays} días a ${jobInputs.destination} (viajero: ${jobInputs.traveler ?? 'n/a'}, ritmo: ${jobInputs.pace ?? 'n/a'}, presupuesto: ${jobInputs.budget ?? 'n/a'}, intereses: ${interests || 'generales'}). Para CADA día (1 a ${totalDays}), da un tema breve, la zona/barrio principal, una actividad o lugar ancla, y el ritmo. Varía zonas y anclas entre días — no repitas la misma zona o ancla en dos días distintos a menos que el viaje sea demasiado corto para evitarlo. Llama a la herramienta emit_skeleton con exactamente ${totalDays} entradas de día, una por cada día de 1 a ${totalDays}.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: SKELETON_MODEL,
      max_tokens: 2000,
      system: isEN
        ? 'You are a travel planner sketching a lightweight day-by-day skeleton, not the full itinerary. Be concise — one short line of intent per day, not activities.'
        : 'Eres un planificador de viajes esbozando un esqueleto ligero día por día, no el itinerario completo. Sé conciso — una intención breve por día, no actividades.',
      tools: [{
        name: 'emit_skeleton',
        description: isEN ? 'Emit the day-by-day skeleton.' : 'Emite el esqueleto día por día.',
        input_schema: SKELETON_SCHEMA,
      }],
      tool_choice: { type: 'tool', name: 'emit_skeleton' },
      messages: [{ role: 'user', content: prompt }],
    }),
    signal,
  })

  const text = await res.text()
  const ms = Date.now() - startedAt
  if (!res.ok) throw new Error(`skeleton call returned ${res.status}: ${text.slice(0, 500)}`)

  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`skeleton call returned non-JSON: ${text.slice(0, 500)}`)
  }

  logGenerationMetric({
    job_id:        jobId,
    chunk_index:   null,
    schema_kind:   'skeleton',
    path:          'single',
    model:         SKELETON_MODEL,
    ms,
    input_tokens:  data.usage?.input_tokens ?? null,
    output_tokens: data.usage?.output_tokens ?? null,
    stop_reason:   data.stop_reason ?? null,
    ok:            data.stop_reason !== 'max_tokens',
  })

  const toolUse = Array.isArray(data.content)
    ? data.content.find((c: any) => c?.type === 'tool_use' && c?.name === 'emit_skeleton')
    : null
  const days = toolUse?.input?.days
  if (!Array.isArray(days) || days.length === 0) {
    throw new Error('skeleton call returned no days')
  }
  // city/travel_day/transfer_hours are on the SkeletonDay type (schema
  // ready for the multi-city unification follow-up — see the type's own
  // comment) but not asked of Haiku here: for a single-city trip, city is
  // always the trip destination and there's no inter-city travel day by
  // definition, so it's cheaper and more reliable to fill these
  // deterministically than to spend tokens asking the model to restate
  // something it can't get wrong-in-a-useful-way for this path.
  return (days as any[]).map(d => ({
    ...d,
    city:           jobInputs.destination,
    travel_day:     false,
    transfer_hours: 0,
  })) as SkeletonDay[]
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

// ── NEW: pre-assembly integrity check ─────────────────────────────────────
// Asserts the concatenated day list is contiguous 1..N with no duplicates,
// and that front-matter (title, budget_breakdown) is present on the chunk
// that's supposed to carry it (chunk 0). Throws — caller marks the job
// failed rather than silently assembling a broken/gappy trip.
function assertChunksIntegrity(chunks: ChunkContent[], expectedDays: number): void {
  const seen = new Set<number>()
  let dayCount = 0
  for (const chunk of chunks) {
    for (const day of chunkDays(chunk)) {
      dayCount++
      const n = (day as any)?.day_number
      if (typeof n !== 'number') throw new Error(`assertChunksIntegrity: day missing day_number`)
      if (seen.has(n)) throw new Error(`assertChunksIntegrity: duplicate day_number ${n}`)
      seen.add(n)
    }
  }
  if (dayCount !== expectedDays) {
    throw new Error(`assertChunksIntegrity: expected ${expectedDays} days, got ${dayCount}`)
  }
  for (let n = 1; n <= expectedDays; n++) {
    if (!seen.has(n)) throw new Error(`assertChunksIntegrity: missing day_number ${n} (not contiguous 1..${expectedDays})`)
  }
  const first = chunks[0] as any
  if (!first?.title || !first?.budget_breakdown) {
    throw new Error('assertChunksIntegrity: chunk 0 missing front-matter (title/budget_breakdown)')
  }
}

function assembleResult(chunks: ChunkContent[], jobInputs: Record<string, any>): Record<string, any> {
  // Concatenate per-segment outputs into a single trip_data shape matching
  // what the sync endpoint returns. Each chunk is a segment containing up
  // to MC_SEGMENT_DAYS days (multi-city) or exactly 1 day (single-city). Day
  // numbers are cumulative across segments so users see "Day 17" not
  // "Segment 2 Day 7". Trip-level metadata (title, subtitle, budget,
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
    //
    // Date rewrite: the AI emits checkInDate / checkOutDate / nights for
    // whatever sub-range the chunk covered (often only 1 night, now that
    // single-city chunks are day-sized), so on multi-chunk trips the
    // surviving hotel entry would say "1 noche" when the actual stay spans
    // the full trip. Patch the dates to the TRIP-level (single-city) or
    // SEGMENT-level (multi-city) span so the hotel card shows what the
    // traveler actually books.
    const chunkAccs = Array.isArray((chunk as any)?.accommodations) ? (chunk as any).accommodations : []
    if (chunkAccs.length === 0) continue
    if (plan) {
      const segIdx = plan[chunkIdx]?.segmentIndex
      if (segIdx !== undefined && !accommodationsSeenForSegment.has(segIdx)) {
        const seg = multiCity![segIdx]
        const patched = chunkAccs.map((a: any) => ({
          ...a,
          checkInDate:  seg.startDate,
          checkOutDate: seg.endDate,
          nights:       Math.max(0, seg.nights),
        }))
        accommodations.push(...patched)
        accommodationsSeenForSegment.add(segIdx)
      }
    } else if (accommodations.length === 0) {
      // Single-city: take the first non-empty accommodation block and
      // rewrite its dates/nights to the full trip span. jobInputs holds
      // the trip-level start / end / duration_days (the client passes
      // these through unchanged on /api/trips/jobs creation).
      const tripStart = typeof jobInputs.start === 'string' ? jobInputs.start : undefined
      const tripEnd   = typeof jobInputs.end   === 'string' ? jobInputs.end   : undefined
      const tripNights = (() => {
        const fromInputs = Number(jobInputs.duration_days)
        if (Number.isFinite(fromInputs) && fromInputs > 0) return Math.max(0, fromInputs - 1)
        return 0
      })()
      const patched = chunkAccs.map((a: any) => ({
        ...a,
        ...(tripStart ? { checkInDate:  tripStart } : {}),
        ...(tripEnd   ? { checkOutDate: tripEnd   } : {}),
        ...(tripNights > 0 ? { nights: tripNights } : {}),
      }))
      accommodations.push(...patched)
    }
  }

  // Title patching:
  //
  // The first chunk's title is generated by the AI as if it were a complete
  // trip (because each chunk is an isolated single-city generation). For a
  // multi-chunk trip, the AI titles chunk 0 with the chunk's own day
  // count — e.g. now that single-city chunk 0 is 1 day, an 8-day Osaka trip
  // gets "1 Día en Osaka" because chunk 0 is 1 day long. The trip itself is
  // 8 days, so the displayed title is wrong even though the rest of the
  // itinerary is fine.
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

  // ES patterns: "7 Días en X", "Tokio en 5 días: Cultura", "1 Día en X".
  // EN patterns: "7 Days in X", "Tokyo in 5 days: Culture", "1 Day in X".
  // Word-boundary match (not anchored to start) — chunk-0 titles in the
  // wild come in both "<N días> en <city>" AND "<city> en <N días>"
  // shapes depending on AI style, and the start-anchored version missed
  // the second form. Replace only the FIRST occurrence to avoid touching
  // ":" separators or anything past the colon.
  function patchTitleDayCount(raw: string | undefined): string | undefined {
    if (typeof raw !== 'string' || !raw) return undefined
    const esMatch = raw.match(/\b\d+\s+d[ií]as?\b/i)
    if (esMatch) {
      const word = totalTripDays === 1 ? 'día' : 'días'
      return raw.replace(esMatch[0], `${totalTripDays} ${word}`)
    }
    const enMatch = raw.match(/\b\d+\s+days?\b/i)
    if (enMatch) {
      const word = totalTripDays === 1 ? 'day' : 'days'
      return raw.replace(enMatch[0], `${totalTripDays} ${word}`)
    }
    return raw // no day-count phrase, leave as-is
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
    tagline:          (first as any).tagline       ?? null,
    hero_tags:        (first as any).hero_tags     ?? null,
    before_you_go:    (first as any).before_you_go ?? null,
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
  // hint for the next segment's prompt (multi-city only — see file header).
  // Picks day titles only (skipping activities to keep the summary short)
  // so the next segment sees a sequence like "Day 1: Centro Histórico ·
  // Day 2: Coyoacán · ...". Capped at 400 chars.
  const days = chunkDays(chunk)
  if (days.length === 0) return ''
  const titles = days.map((d: any) => d?.title).filter(Boolean)
  return titles.join(' · ').slice(0, 400)
}

// ── Forked entry points ────────────────────────────────────────────────────
// Two fully separate functions, two fully separate constant sets (MC_* /
// SC_*), no variable threaded conditionally between them (no shared
// prevSummary-or-skeleton state). Each takes the shared mutable
// chunksByIndex map (read/write, same purpose as before — resume support
// + progress tracking) but nothing else is shared. Both return `Response`
// to short-circuit on failure, or `null` to fall through to the shared
// completion tail in serve() below (re-read job, self-reinvoke or
// assemble-and-complete — identical for both paths, doesn't touch
// per-path state).

async function runSequentialMultiCity(
  admin: any,
  job: JobRow,
  multiCity: TripSegment[],
  chunksByIndex: Map<number, ChunkContent>,
  startedAt: number,
): Promise<Response | null> {
  let prevSummary: string | null =
    job.chunks_done > 0 && chunksByIndex.has(job.chunks_done - 1)
      ? shortSummary(chunksByIndex.get(job.chunks_done - 1) as ChunkContent)
      : null

  for (let i = job.chunks_done; i < job.chunks_total; i++) {
    const remainingBudget = 140_000 - (Date.now() - startedAt)
    if (remainingBudget < MC_BUDGET_FLOOR_MS) break

    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), Math.min(MC_CHUNK_TIMEOUT_MS, remainingBudget - 2_000))

    let chunk: ChunkContent
    let chunkBudgetCurrencySuspect: boolean | null = null
    try {
      const segResult = await generateMultiCitySegment(job.inputs, i, prevSummary, ctrl.signal, job.id)
      chunk = segResult.chunk
      chunkBudgetCurrencySuspect = segResult.budgetCurrencySuspect
    } catch (e) {
      clearTimeout(t)
      await admin
        .from('generation_jobs')
        .update({ status: 'failed', error: String(e).slice(0, 500) })
        .eq('id', job.id)
      if (job.chunks_done === 0 && i === 0) {
        await refundOneTripIfApplicable(admin, job.user_id)
      }
      return new Response(JSON.stringify({ ok: false, status: 'failed' }), {
        status: 502,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }
    clearTimeout(t)

    chunksByIndex.set(i, chunk)

    try {
      const { error: insertErr } = await admin
        .from('generation_chunks')
        .insert({ job_id: job.id, chunk_index: i, content: chunk })
      if (insertErr) throw new Error(`chunks insert failed: ${insertErr.message}`)

      const chunksDoneUpdate: Record<string, unknown> = { chunks_done: i + 1 }
      if (i === 0) chunksDoneUpdate.budget_currency_suspect = chunkBudgetCurrencySuspect
      const { error: updateErr } = await admin
        .from('generation_jobs')
        .update(chunksDoneUpdate)
        .eq('id', job.id)
      if (updateErr) throw new Error(`chunks_done update failed: ${updateErr.message}`)

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
          console.warn('[worker:mc] partial_result write failed at chunk', i, partialErr.message)
        }
      } catch (assemblyErr) {
        console.warn('[worker:mc] partial_result assembly threw at chunk', i, assemblyErr)
      }
    } catch (persistErr) {
      console.error('[worker:mc] chunk persist failed at index', i, persistErr)
      await admin
        .from('generation_jobs')
        .update({ status: 'failed', error: String(persistErr).slice(0, 500) })
        .eq('id', job.id)
      return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'persist' }), {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

    prevSummary = shortSummary(chunk)
  }

  return null
}

async function runConcurrentSingleCity(
  admin: any,
  job: JobRow,
  chunksByIndex: Map<number, ChunkContent>,
  startedAt: number,
): Promise<Response | null> {
  const totalDays = Math.max(1, Math.min(35, Number(job.inputs.duration_days) || 1))

  // Skeleton — compute once per job, cache on the row so a self-reinvoke
  // doesn't redo the Haiku call.
  let skeleton: SkeletonDay[] | null = Array.isArray(job.skeleton) ? job.skeleton : null
  if (!skeleton) {
    const skelCtrl = new AbortController()
    const skelTimer = setTimeout(() => skelCtrl.abort(), SC_CHUNK_TIMEOUT_MS)
    try {
      skeleton = await generateSkeleton(job.inputs, totalDays, skelCtrl.signal, job.id)
    } catch (e) {
      clearTimeout(skelTimer)
      console.error('[worker:sc] skeleton pass failed:', e)
      await admin
        .from('generation_jobs')
        .update({ status: 'failed', error: `skeleton: ${String(e).slice(0, 500)}` })
        .eq('id', job.id)
      await refundOneTripIfApplicable(admin, job.user_id)
      return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'skeleton' }), {
        status: 502,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }
    clearTimeout(skelTimer)
    await admin.from('generation_jobs').update({ skeleton } as any).eq('id', job.id)
  }

  const dayPlan = planChunks(totalDays)
  const missing = dayPlan.filter(d => !chunksByIndex.has(d))

  async function runOneDay(dayIdx: number, signal: AbortSignal) {
    const daySkeleton = skeleton!.find(s => s.day === dayIdx + 1) ?? null
    const segResult = await generateDayChunk(job.inputs, dayIdx, totalDays, daySkeleton, skeleton!, signal, job.id)
    return { dayIdx, segResult }
  }

  for (let batchStart = 0; batchStart < missing.length; batchStart += SC_CONCURRENCY) {
    const remainingBudget = 140_000 - (Date.now() - startedAt)
    if (remainingBudget < SC_BUDGET_FLOOR_MS) break // self-reinvoke picks up the rest

    let batch = missing.slice(batchStart, batchStart + SC_CONCURRENCY)
    const succeeded = new Map<number, SegmentResult>()

    for (let attempt = 0; attempt <= SC_MAX_RETRIES && batch.length > 0; attempt++) {
      if (attempt > 0) {
        if (Date.now() - startedAt > SC_RETRY_ABANDON_MS) break // fall through to self-reinvoke
        await new Promise(r => setTimeout(r, SC_RETRY_BACKOFF_MS[attempt - 1] ?? 2_000))
      }

      const results = await Promise.allSettled(batch.map(dayIdx => {
        const ctrl = new AbortController()
        const t = setTimeout(() => ctrl.abort(), SC_CHUNK_TIMEOUT_MS)
        return runOneDay(dayIdx, ctrl.signal).finally(() => clearTimeout(t))
      }))

      const stillFailing: number[] = []
      for (let k = 0; k < results.length; k++) {
        const r = results[k]
        const dayIdx = batch[k]
        if (r.status === 'fulfilled') {
          succeeded.set(r.value.dayIdx, r.value.segResult)
        } else {
          console.warn('[worker:sc] day chunk rejected', dayIdx, 'attempt', attempt, String(r.reason).slice(0, 300))
          stillFailing.push(dayIdx)
        }
      }
      batch = stillFailing
    }

    if (batch.length > 0) {
      // Retries exhausted (or abandoned past the wall-clock cutoff) with
      // chunks still failing — this is a real failure, not a budget
      // timeout, so we fail the job rather than looping self-reinvoke
      // forever on a possibly-deterministic error.
      await admin
        .from('generation_jobs')
        .update({ status: 'failed', error: `day chunks failed after retries: ${batch.join(',')}` })
        .eq('id', job.id)
      if (job.chunks_done === 0 && succeeded.size === 0) {
        await refundOneTripIfApplicable(admin, job.user_id)
      }
      return new Response(JSON.stringify({ ok: false, status: 'failed', failed_days: batch }), {
        status: 502,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

    // Whole batch succeeded — persist in day order.
    const orderedBatch = [...succeeded.entries()].sort((a, b) => a[0] - b[0])
    for (const [dayIdx, segResult] of orderedBatch) {
      chunksByIndex.set(dayIdx, segResult.chunk)
      try {
        const { error: insertErr } = await admin
          .from('generation_chunks')
          .insert({ job_id: job.id, chunk_index: dayIdx, content: segResult.chunk })
        // Unique (job_id, chunk_index) — a retried/duplicate insert for an
        // already-persisted day is a benign no-op, not a hard failure.
        if (insertErr && insertErr.code !== '23505') {
          throw new Error(`chunks insert failed: ${insertErr.message}`)
        }
        if (dayIdx === 0) {
          await admin
            .from('generation_jobs')
            .update({ budget_currency_suspect: segResult.budgetCurrencySuspect } as any)
            .eq('id', job.id)
        }
      } catch (persistErr) {
        console.error('[worker:sc] day chunk persist failed at index', dayIdx, persistErr)
        await admin
          .from('generation_jobs')
          .update({ status: 'failed', error: String(persistErr).slice(0, 500) })
          .eq('id', job.id)
        return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'persist' }), {
          status: 500,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        })
      }
    }

    // Contiguous-from-zero count — batches are processed in ascending
    // order so this is monotonic as long as nothing above returned early.
    let doneCount = 0
    while (doneCount < totalDays && chunksByIndex.has(doneCount)) doneCount++

    const { error: updateErr } = await admin
      .from('generation_jobs')
      .update({ chunks_done: doneCount })
      .eq('id', job.id)
    if (updateErr) {
      console.error('[worker:sc] chunks_done update failed:', updateErr.message)
      await admin
        .from('generation_jobs')
        .update({ status: 'failed', error: `chunks_done update failed: ${updateErr.message}` })
        .eq('id', job.id)
      return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'persist' }), {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

    // Progressive partial assembly — same UX purpose as the multi-city
    // path: render finished days while the rest are still generating.
    try {
      const chunksOrdered: ChunkContent[] = []
      for (let idx = 0; idx < doneCount; idx++) {
        const c = chunksByIndex.get(idx)
        if (c) chunksOrdered.push(c)
      }
      if (chunksOrdered.length > 0) {
        const partial = assembleResult(chunksOrdered, job.inputs)
        await admin.from('generation_jobs').update({ partial_result: partial } as any).eq('id', job.id)
      }
    } catch (assemblyErr) {
      console.warn('[worker:sc] partial_result assembly threw:', assemblyErr)
    }
  }

  return null
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
    .select('id, user_id, status, inputs, chunks_total, chunks_done, skeleton')
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

  // Load any chunks already persisted (resume support).
  const { data: existingChunks } = await admin
    .from('generation_chunks')
    .select('chunk_index, content')
    .eq('job_id', job.id)
    .order('chunk_index', { ascending: true })

  const chunksByIndex = new Map<number, ChunkContent>()
  for (const c of existingChunks ?? []) chunksByIndex.set((c as any).chunk_index, (c as any).content)

  const multiCity = getTripSegments(job.inputs)

  // Explicit fork — see the two functions above for why this is a single
  // ternary dispatch and not a shared loop with a multiCity branch inside it.
  const earlyReturn = multiCity
    ? await runSequentialMultiCity(admin, job, multiCity, chunksByIndex, startedAt)
    : await runConcurrentSingleCity(admin, job, chunksByIndex, startedAt)
  if (earlyReturn) return earlyReturn

  // Re-read job to see if we finished. budget_currency_suspect is read back
  // here rather than from in-memory state — this invocation may not be the
  // one that generated chunk 0 (self-reinvoke chain), so the DB row is the
  // only reliable source at completion time.
  const { data: final } = await admin
    .from('generation_jobs')
    .select('chunks_done, chunks_total, budget_currency_suspect')
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
    // a future safety net, not the primary completion mechanism). Also the
    // fallback for single-city day chunks that kept failing past the
    // per-invocation retry budget (see SC_RETRY_ABANDON_MS above) — a fresh
    // invocation gets a fresh retry budget for whatever's still missing.
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

  const expectedDays = multiCity
    ? multiCity.reduce((sum, s) => sum + Math.max(1, s.nights + 1), 0)
    : Math.max(1, Math.min(35, Number(job.inputs.duration_days) || 1))

  try {
    assertChunksIntegrity(orderedChunks, expectedDays)
  } catch (integrityErr) {
    console.error('[worker] pre-assembly integrity check failed:', integrityErr)
    await admin
      .from('generation_jobs')
      .update({ status: 'failed', error: `integrity: ${String(integrityErr).slice(0, 500)}` })
      .eq('id', job.id)
    await refundOneTripIfApplicable(admin, job.user_id)
    return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'integrity' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  const result = assembleResult(orderedChunks, job.inputs)

  // Persist trip row for authed user (matches sync endpoint behavior).
  const tripSlug = `${(job.inputs as any).destination ?? 'trip'}-${job.id.slice(0, 8)}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')

  // Normalize enum-typed columns (+ currency) to match what the DB accepts
  // and what the client actually sent. Mirrors /api/trips/route.ts so the
  // worker stays in lock-step with the sync path.
  const { travelers: travelersValue, travel_style: travelStyleValue, currency: currencyValue } =
    normalizeJobInputsForTripsInsert(job.inputs)

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
    budget_level:  (job.inputs as any).budget_level ?? (job.inputs as any).budget ?? "medium",
    interests:     Array.isArray((job.inputs as any).interests) ? (job.inputs as any).interests : [],
    currency:      currencyValue,
    budget_currency_suspect: typeof final.budget_currency_suspect === 'boolean' ? final.budget_currency_suspect : null,
    ref_source:    (job.inputs as any).ref_source ?? null,
  }

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
