// supabase/functions/generate-trip-worker/index.ts
//
// Re-entrant worker for async trip generation.
//
// Contract:
//   - Invoked with { job_id } (POST body).
//   - Reads the job row. Idempotent: exits cleanly if already completed/failed.
//   - ONE PIPELINE for both single-city and multi-city (2026-09-29 multi-
//     city migration — previously multi-city ran a fully separate sequential
//     per-segment loop with a previous_day_summary continuity hint; deleted,
//     see git history for runSequentialMultiCity/planMultiCityChunks if you
//     need it). Runs a cheap Haiku "skeleton" pre-pass (one theme/
//     neighborhood/anchor/pace/city/travel_day/transfer_hours entry per
//     day, across the WHOLE trip regardless of how many cities), then
//     generates all days CONCURRENTLY (batches of SC_CONCURRENCY), each a
//     standalone 1-day Claude call anchored to its skeleton entry instead of
//     a sequential previous-day summary. For multi-city, planMultiCityDays()
//     assigns each day a city/origin/travel-day flag deterministically from
//     the segment list (never left to the model), and generateDayChunk
//     overrides that day's destination/origin accordingly. Multi-city stays
//     on Sonnet 4.6 via the GENERATE_TRIP_MODEL secret (resolveDayModel
//     below) — its tool-calling shape was never migrated to Sonnet 5.5's
//     strict mode, a deliberate, separate later decision.
//   - When all chunks are persisted, assembles them into final trip_data,
//     writes result on the job row, inserts the trip row, sets status='completed'.
//   - If runtime budget gets low, exits with status='running'; the
//     self-reinvoke chain (or the reconciler) re-invokes and resumes from
//     chunks_done.
//
// Day/front-matter generation calls Anthropic directly (see
// callAnthropicOnce below) rather than delegating to the /functions/v1/
// generate-trip Edge Function over HTTP — see the 2026-09-28 HTTP-
// extraction PR note further down for why. generate-trip is still used for
// single-block duplicate-venue repair (regenerateDuplicateBlock).

// deno-lint-ignore-file no-explicit-any
// @ts-nocheck — Deno runtime; types resolved at deploy time

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { normalizeJobInputsForTripsInsert } from './logic.ts'
// HTTP-extraction refactor (2026-09-28): day chunks and front-matter used
// to go through generate-trip over HTTP (callGenerateTrip below, still
// used by multi-city -- untouched). That extra hop is where the
// "traceless death" / phantom-retry failures lived: generate-trip's own
// execution would complete and log a metric successfully while this
// worker's fetch to it dropped at the connection level, discarding a
// finished result and forcing a retry on work that was already done.
// generateDayChunk/generateFrontmatter now call Anthropic directly, the
// same way generateSkeleton already did (proven live in production) --
// same process, no second hop to drop. buildInput/isBudgetCurrencySuspect/
// computeHeadcount and the prompt-building logic are the SAME functions
// generate-trip/index.ts still uses for its own untouched paths (multi-
// city, sync) -- imported from there, not reimplemented.
import { buildInput, isBudgetCurrencySuspect, computeHeadcount } from '../generate-trip/logic.ts'
import { systemPromptFor, TRIP_SCHEMA_DAYS_ONLY, TRIP_SCHEMA_FRONTMATTER_ONLY, buildPrompt } from '../generate-trip/prompt.ts'

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

// Per-model $/MTok rates -- same table and same source as
// generate-trip/index.ts's copy (2026-09-28, verified against
// https://platform.claude.com/docs/en/about-claude/pricing, not guessed).
// Duplicated rather than imported for the same reason logGenerationMetric
// above is duplicated: no shared module for this (prompt.ts is prompt-only,
// deliberately not a dumping ground for unrelated concerns). Sonnet's rate
// is the published list price ($3 in / $15 out) -- a $2/$10 rate was tried
// briefly the same day on a claimed account discount that turned out not
// to exist for this model. claude-sonnet-5 added 2026-09-28 for the
// Sonnet 5 migration evaluation (backlog #101) -- confirmed against
// platform.claude.com/docs/en/models/sonnet-5/overview. As of the
// HTTP-extraction refactor this table is actively used for day/front-
// matter calls too, not just the skeleton.
const MODEL_RATES: Record<string, { input: number; cacheWrite: number; cacheRead: number; output: number }> = {
  'claude-sonnet-4-6':         { input: 3, cacheWrite: 3.75, cacheRead: 0.30, output: 15 },
  'claude-haiku-4-5-20251001': { input: 1, cacheWrite: 1.25, cacheRead: 0.10, output: 5 },
  'claude-sonnet-5':           { input: 2, cacheWrite: 2.50, cacheRead: 0.20, output: 10 },
  // Same price as claude-sonnet-5 (confirmed via platform.claude.com/docs/
  // en/models/sonnet-5-5/overview, released 2026-09-28) -- superseded that
  // evaluation (backlog #101) since it's the same price and strictly
  // faster/fewer-tokens. See isSonnet55()/toStrictSchema() below for the
  // request-shape changes this model requires.
  'claude-sonnet-5-5':         { input: 2, cacheWrite: 2.50, cacheRead: 0.20, output: 10 },
}
// Default flipped to claude-sonnet-5-5 2026-09-29 (backlog #101): 10-city
// regression on the clean HTTP-extracted pipeline showed ~22s wall vs 4.6's
// ~37s, $0.129/trip vs $0.175, 0/70 retries, clean accommodations/dupes.
// Deliberately its OWN env var, NOT the GENERATE_TRIP_MODEL secret
// generate-trip/index.ts's own MODEL resolution reads -- that path (sync,
// regenerate-duplicate-block) still uses forced tool_choice
// (tool_choice:"tool"), which 400s on Sonnet 5.5, and was never migrated to
// the strict-mode shape (out of scope, see PR description). Sharing one
// lever would mean flipping either path's rollback silently breaks the
// other's request shape. test_model is the same TEMPORARY model-evaluation
// hook (backlog #101) -- REMOVE it once evaluation of whatever's next
// concludes; the model default itself is no longer temporary.
//
// Multi-city (2026-09-29 migration onto this same pipeline) deliberately
// stays on GENERATE_TRIP_MODEL/4.6, NOT GENERATE_TRIP_DAY_MODEL -- its
// prompt (buildSegmentsContext's DAY -> CITY mapping, LODGING BY SEGMENT,
// transition-day rules) was never exercised against Sonnet 5.5's strict
// tool use, and getting that right (schema, effort, the travel-day framing
// above) is a separate, later decision. Since resolveDayModel never returns
// a Sonnet 5.5 model ID for a multi-city job, isSonnet55() downstream is
// always false for it -- the request naturally takes the original forced-
// tool_choice shape with zero extra branching needed at the call site.
function resolveDayModel(jobInputs: Record<string, any>): string {
  if (typeof jobInputs.test_model === 'string') return jobInputs.test_model
  if (getTripSegments(jobInputs)) return Deno.env.get('GENERATE_TRIP_MODEL') ?? 'claude-sonnet-4-6'
  return Deno.env.get('GENERATE_TRIP_DAY_MODEL') ?? 'claude-sonnet-5-5'
}

// Sonnet 5.5 rejects forced tool_choice (tool_choice:"tool"/"any" -> 400)
// and needs a different request shape (tool_choice:"auto" + strict:true,
// thinking:"between_tools" + output_config.effort). Every other model this
// worker calls (4.6, Haiku, Sonnet 5) keeps the existing forced-tool_choice
// shape untouched. Matches on the bare model ID or any dated variant of it,
// the same convention Anthropic uses for its own dated model IDs.
function isSonnet55(model: string): boolean {
  return model === 'claude-sonnet-5-5' || model.startsWith('claude-sonnet-5-5-')
}

// TEMPORARY evaluation hook (backlog #101), same pattern as test_model.
// Day-writer/frontmatter calls need no reasoning -- the skeleton pre-pass
// already made every structural decision (theme/neighborhood/anchor/pace/
// venues) and Places-equivalent context is already in the prompt; the day
// writer is filling in prose around decisions already made, not making new
// ones. 'low' is the default; pass test_effort to A/B against 'medium' if
// the 10-city numbers don't make the case on their own. Only consulted
// when isSonnet55() -- 4.6/5/Haiku don't take an effort parameter at all.
function resolveEffort(jobInputs: Record<string, any>): string {
  if (typeof jobInputs.test_effort === 'string') return jobInputs.test_effort
  return 'low'
}

// Sonnet 5.5's strict tool use (required to replace forced tool_choice --
// see isSonnet55() above) rejects maxLength/maxItems and requires
// additionalProperties:false on every object node. Derives the strict
// variant from the canonical schema (TRIP_SCHEMA_DAYS_ONLY/
// TRIP_SCHEMA_FRONTMATTER_ONLY in prompt.ts, shared with generate-trip/
// index.ts's own untouched paths) instead of hand-maintaining a duplicate,
// so the two can't drift. Trade-off: this DROPS the blocks-per-day (6) and
// description-length (320 char) caps that were added 2026-09-28 specifically
// to bound wall-clock (output length drives per-call latency almost
// linearly). Those caps aren't expressible in a strict schema (maxItems is
// unsupported; only minItems 0/1 is). Compensated with an explicit prompt
// reminder (see STRICT_MODE_LENGTH_REMINDER below) but that's best-effort,
// not enforced -- watch cost_usd and per-call ms on the 5.5 batch for
// runaway output before trusting this trade-off long-term.
function toStrictSchema(schema: any): any {
  if (Array.isArray(schema)) return schema.map(toStrictSchema)
  if (schema === null || typeof schema !== 'object') return schema
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(schema)) {
    if (k === 'maxLength' || k === 'minLength' || k === 'maxItems') continue // unsupported under strict tool use
    out[k] = toStrictSchema(v)
  }
  if (out.type === 'object') out.additionalProperties = false
  return out
}

// Compensates for the dropped maxItems:6 / maxLength:320 caps (see
// toStrictSchema above) -- appended to the day-chunk user prompt only
// (frontmatter has no blocks/description fields) when calling Sonnet 5.5.
const STRICT_MODE_LENGTH_REMINDER: Record<'es' | 'en', string> = {
  es: '\n\nLímites de formato: máximo 6 bloques por día, cada "description" de máximo 320 caracteres.',
  en: '\n\nFormatting limits: at most 6 blocks per day, each "description" at most 320 characters.',
}

// Same validation generate-trip/index.ts's serve() handler applies to its
// own tool_use response -- copied, not imported, since it's a small
// function tied to this file's own error-throwing convention (the HTTP
// handler returns a Response; this throws, for runUnitWithRetries to
// catch and classify). Returns true when the payload is genuinely missing
// the itinerary (empty days, or every day has zero blocks) -- frontmatter
// responses correctly have no `days` field at all, so isFrontmatterOnly
// short-circuits before that check.
function isInvalidShape(toolUseInput: any, isFrontmatterOnly: boolean): boolean {
  if (!toolUseInput) return true
  if (isFrontmatterOnly) return false
  if (!Array.isArray(toolUseInput.days) || toolUseInput.days.length === 0) return true
  const anyDayHasBlocks = toolUseInput.days.some(
    (d: any) => Array.isArray(d?.blocks) && d.blocks.length > 0
  )
  return !anyDayHasBlocks
}
function computeCostUsd(model: string, usage: {
  input_tokens?: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number; output_tokens?: number;
} | undefined): number | null {
  const rates = MODEL_RATES[model]
  if (!rates || !usage) return null
  const cost =
    ((usage.input_tokens ?? 0) * rates.input +
     (usage.cache_creation_input_tokens ?? 0) * rates.cacheWrite +
     (usage.cache_read_input_tokens ?? 0) * rates.cacheRead +
     (usage.output_tokens ?? 0) * rates.output) / 1_000_000
  return Number(cost.toFixed(6))
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

// ── SC_* — day-level concurrency constants (single-city AND multi-city) ──
//
// Originally single-city-only (hence the name, kept for minimal diff —
// not worth a file-wide rename); as of the 2026-09-29 multi-city migration
// this same set governs multi-city jobs too, since a multi-city trip is now
// just a day plan whose city varies (see planMultiCityDays below) rather
// than a separate sequential per-segment loop. The old MC_* constant set
// (135s/145s budgets sized for 3-5-day HTTP sub-chunks) is gone along with
// the sequential loop that used it — a multi-city day chunk is exactly the
// same shape and cost as a single-city one, so it fits the SAME 60s/70s
// budget math below without adjustment.
//
// One Claude call per day, up to SC_CONCURRENCY days in flight at once,
// each bounded by its own 60s timeout. Replaces the old 5-day sequential
// segment loop for single-city trips only. See PR description for the
// full rationale. Deliberately NOT shared with MC_* — see note above.
const SC_DAYS_PER_CHUNK   = 1
// Tried 4, 2026-09-28, to test a rate-limit hypothesis -- reverted the same
// day. With 8 units (7 days + front-matter) SC_CONCURRENCY=4 makes two
// SEQUENTIAL batches through the outer loop below, not two concurrent
// waves: batch 2 only starts once batch 1's Promise.allSettled fully
// resolves, and inherits whatever's left of the job-relative 60s budget at
// that point. Confirmed live: batch 1 alone (skeleton + 4 concurrent
// calls) took 47.5s, leaving batch 2 only ~9.5s -- its four calls all
// genuinely succeeded (confirmed via generation_metrics, ok:true, zero
// status_code/error) but 27-30s after the 9.5s they were given, well past
// the point the worker had already aborted and failed the job. This isn't
// a rate-limit signature (no ok:false rows anywhere) -- it's the two-wave
// structure itself not fitting a 60s ceiling.
//
// Raised 8 -> 16, 2026-09-30: every single-city test this session ran
// exactly 7 days (8 units), so the >SC_CONCURRENCY batching path was never
// actually exercised until the multi-city migration's own test batch hit
// it for the first time -- 3 of 5 multi-city trips over 8 units (9, 10, 14
// units) all failed on exactly their 9th-and-later unit, via this EXACT
// same second-batch starvation mechanism, just newly visible because
// multi-city trips commonly run longer than 7 days where single-city
// testing never had. Confirmed live: a 9-unit trip's unit 7 (the sole
// member of batch 2) got aborted at 11.6s with ZERO retry attempted --
// batch 1 alone had already eaten ~40s of the 60s job deadline, leaving
// batch 2 too little to run OR retry. Same root cause as the CONCURRENCY=4
// finding above, just triggered by trip length instead of a lower
// constant. 16 covers the longest real trip length observed (14 days = 15
// units) in one wave, matching the same "structurally one batch" reasoning
// that motivated reverting to 8 in the first place. Verified via a live
// load test before committing to this value (not just isolate-boot logs at
// 8, which never got checked at 16) -- see PR description for the
// per-call latency comparison against the 7-8-concurrent baseline. If
// concurrency itself degrades at higher fan-out (not yet observed, but
// untested above 16), the fallback is a per-batch deadline instead of one
// job-wide clock, not a lower ceiling -- a lower ceiling just moves this
// same failure to a shorter trip length, it doesn't fix the mechanism.
const SC_CONCURRENCY      = 16
//
// KNOWN, ACCEPTED COST: firing all SC_CONCURRENCY Sonnet calls (day writers
// + front-matter) within ~100-300ms of each other (confirmed via
// generation_metrics implied-start-time analysis, 2026-09-28) means the
// Sonnet system-prompt cache is routinely cold when they all fire. Nothing
// warms it first -- the skeleton pass runs on Haiku with a completely
// different prompt, so it can't seed the Sonnet cache. Result: several of
// the concurrent calls race to write the cache instead of one call writing
// and the rest reading, each paying the 1.25x write rate instead of the
// 0.1x read rate for the same ~1200-1900 token system-prompt block.
// Confirmed on a real trip: 7 of 8 calls each independently paid a cache
// write (cost_usd backward-derived pre/post rate-correction on 2026-09-28
// matched the write-token counts exactly). Deliberately NOT fixing this by
// sequencing -- firing front-matter first to warm the cache before the day
// writers start would serialize ~25-30s of wall time onto every single-city
// job to save roughly $0.01-0.02/trip in redundant cache writes. Wrong
// trade against the 60s ceiling. Leaving this as accepted, understood cost
// so a future reader doesn't have to re-derive it from a cost_usd anomaly.
const SC_BUDGET_FLOOR_MS  = 70_000
// 60s is a hard ceiling on TOTAL job duration (skeleton included), every
// retry included — confirmed live 2026-09-25 TWICE: a 71s job (35s+ wave,
// one retry) read as a failure against that target, and a first attempt
// at fixing this with a FIXED 55s/5s split still overshot to 63.2s because
// skeleton alone took 6.6s that run — a fixed split doesn't account for
// skeleton's real variance (observed 4-7s across runs). SC_JOB_DEADLINE_MS
// is measured against `startedAt` (the actual invocation start, before
// skeleton runs), not a fixed post-skeleton allowance, so a slow skeleton
// correctly eats into the generation budget instead of pushing the total
// past 60s. SC_FINAL_OVERHEAD_RESERVE_MS reserves headroom for the
// non-generation work after the last attempt (assembly, the accommodations
// check, duplicate detection, trips insert) — NOT duplicate-venue repair,
// which is explicitly the "last resort" the product wants even if it
// pushes past 60s on the rare trip that needs it (see the repair block
// near the CRÍTICA check below).
//
// Every attempt (first AND retry) is bounded by whatever's left of the
// job's SC_JOB_DEADLINE_MS, computed fresh against real elapsed time since
// invocation start — NOT a separate fixed per-attempt cap. There used to
// be one (SC_CHUNK_TIMEOUT_MS, raised 35s -> 45s earlier the same day,
// 2026-09-25) but it caused the exact failure it was meant to prevent:
// live, a Buenos Aires day-chunk's attempt-0 was aborted by the 45s cap
// mid-flight (no metric row logged at all -- killed before it could
// finish), which left its retry only ~22s of real budget. The retry
// itself needed ~30s and got aborted too at the 60s job deadline (job
// failed at 57.3s) -- but the underlying Anthropic call, unaffected by our
// own AbortController once far enough along, kept running server-side and
// completed successfully 9s later (confirmed via generation_metrics:
// ok:true, logged AFTER the job had already been marked failed). A
// complete, correct result existed and was thrown away because the fixed
// cap fired before the real call needed to. Removing the cap means
// attempt 0 gets the full ~50s job-relative remainder (after skeleton) to
// begin with, so the case that forced a retry in the first place is far
// less likely to happen at all. If less than SC_MIN_RETRY_WINDOW_MS
// remains when a retry would fire, skip it and fail the job cleanly
// instead of starting a retry that can't finish in time anyway.
//
// Backstop for the residual case (an attempt that's genuinely still
// in-flight when the job deadline hits): generate-trip now self-persists
// its own successful result straight into generation_chunks the moment it
// has one (see persistChunkContent in generate-trip/index.ts), independent
// of whether this worker's fetch() ever receives the response. Right
// before declaring a batch a hard failure below, the worker re-reads
// generation_chunks for the still-failing units one more time — a result
// that finished just past this invocation's patience is still picked up
// instead of discarded, same failure mode as the Buenos Aires case above
// but now recoverable rather than merely explained.
const SC_JOB_DEADLINE_MS           = 60_000
const SC_FINAL_OVERHEAD_RESERVE_MS = 3_000
const SC_MIN_RETRY_WINDOW_MS       = 10_000
const SC_MAX_RETRIES      = 2
const SC_RETRY_BACKOFF_MS = [1_000, 2_000]
// Skeleton is a single cheap Haiku call (observed 4-8s), not part of the
// per-day attempt loop above — kept on its own fixed bound rather than a
// job-relative one since it runs before any of that budget math starts.
const SC_SKELETON_TIMEOUT_MS = 45_000

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
  // Named venues, not just a theme/neighborhood — assigned once, upfront,
  // across ALL days in the same skeleton call, specifically so the model
  // doing the assignment can see every other day's pick and avoid
  // collisions. Added 2026-09-25 after live content validation on the
  // 10-city test found cross-day venue duplicates (independent concurrent
  // day-writers converging on the same obvious spot for a neighborhood/
  // theme with no visibility into each other's choices — theme+neighborhood
  // alone wasn't a specific enough assignment to prevent that).
  //
  // key_breakfast added after a SECOND live test still showed duplicates —
  // diagnosis (job skeleton vs actual writer output, both inspected
  // directly) showed the skeleton's own assignments were already unique in
  // every case; the duplicates were ALWAYS breakfast, a meal slot
  // key_restaurant never covered. Every day has 2-3 restaurant blocks
  // (breakfast, lunch/dinner) but the skeleton only named one of them —
  // for the unassigned slot, independent day-writers reliably converged on
  // the same well-known local spot. key_restaurant is now implicitly the
  // day's signature lunch/dinner pick; key_breakfast covers the other
  // reliably-duplicated slot explicitly.
  key_restaurant: string
  key_breakfast:  string
  key_site:       string
  // city/travel_day/transfer_hours: used by the 2026-09-29 multi-city
  // migration (planMultiCityDays below). city and travel_day are ALWAYS
  // deterministic overrides applied after the Haiku call returns, for both
  // single- and multi-city — never left to the model, since the segment
  // list already answers both with certainty. transfer_hours is the one
  // field genuinely left to the model: a real-world estimate of how long
  // the transfer between two specific cities takes, which the code has no
  // way to know on its own. Single-city: city is always the trip
  // destination, travel_day is always false, transfer_hours is always 0 (no
  // transfer exists) — unchanged from before this migration.
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
  if (!res.ok) {
    // .status attached (not just embedded in the message string) so the
    // retry loop can classify 400/401/403 (permanent -- no retry) vs
    // 429/5xx (transient -- retry with backoff) without string-parsing.
    const err = new Error(`generate-trip returned ${res.status}: ${text.slice(0, 500)}`)
    ;(err as any).status = res.status
    throw err
  }
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

// ── Day plan (single-city AND multi-city) ─────────────────────────────────
// One entry per day (SC_DAYS_PER_CHUNK=1 today; kept as a loop over the
// constant rather than hardcoded, so a future tuning pass can change the
// step without touching call sites). Returns 0-indexed day offsets. Used
// as-is for both city modes — a day chunk is a day chunk regardless of
// which city it belongs to; planMultiCityDays below is what supplies the
// PER-DAY city/origin/travel information layered on top of this same list.
function planChunks(totalDays: number): number[] {
  const days: number[] = []
  for (let d = 0; d < totalDays; d += SC_DAYS_PER_CHUNK) days.push(d)
  return days
}

// Per-day city assignment for a multi-city trip, replacing the old
// planMultiCityChunks (which grouped up to MC_SEGMENT_DAYS days into one
// HTTP call to generate-trip — gone along with the sequential loop that
// used it). Index i of the returned array corresponds to dayIndex i in
// planChunks(totalDays)'s output (0-indexed, trip-wide across every
// segment concatenated) — every day chunk is exactly 1 day, so "chunk
// boundaries" and "city boundaries" are the same thing by construction;
// there's no sub-chunking left to snap to a city change, a day IS the unit.
//
// city/origin/segmentIndex are fully deterministic from the segment list —
// never left to the model. travelDay marks the LAST day of every segment
// except the final one (matches buildSegmentsContext's own documented
// transition-day rule in prompt.ts, so the day-writer's per-day framing and
// the shared multi-city prompt context agree on which days are travel days).
type MultiCityDayInfo = {
  city:         string
  origin:       string
  segmentIndex: number
  travelDay:    boolean
  // This day's actual calendar date, derived from ITS OWN segment's
  // startDate + offset -- not from the trip-wide start date + a global day
  // index. Segments are trusted to be contiguous (day-count math elsewhere
  // in this file already assumes this), but deriving dates per-segment
  // rather than via a single running offset means a gap or overlap in the
  // segment list can't silently shift every later city's dates.
  dateISO:      string
}

function planMultiCityDays(segments: TripSegment[], jobOrigin: string | undefined): MultiCityDayInfo[] {
  const out: MultiCityDayInfo[] = []
  for (let segIdx = 0; segIdx < segments.length; segIdx++) {
    const seg = segments[segIdx]
    // nights+1 = inclusive day count for the segment (check-in day through
    // check-out day). Same-day segments still produce 1 day.
    const segDays = Math.max(1, seg.nights + 1)
    const segOrigin = seg.origin
      ?? (segIdx === 0 ? (jobOrigin ?? '') : segments[segIdx - 1].destination)
    const isFinalSegment = segIdx === segments.length - 1
    for (let d = 0; d < segDays; d++) {
      out.push({
        city:         seg.destination,
        origin:       segOrigin,
        segmentIndex: segIdx,
        travelDay:    d === segDays - 1 && !isFinalSegment,
        dateISO:      addDaysISO(seg.startDate, d),
      })
    }
  }
  return out
}

// Trip-wide day count for a multi-city trip — same formula used everywhere
// else in this file that needs it (assembleResult's totalTripDays, serve()'s
// expectedDays). Kept as its own named function rather than inlined at each
// call site so the formula can't drift between them.
function countMultiCityDays(segments: TripSegment[]): number {
  return segments.reduce((sum, s) => sum + Math.max(1, s.nights + 1), 0)
}

function addDaysISO(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

type SegmentResult = { chunk: ChunkContent; budgetCurrencySuspect: boolean | null }

// ── Per-day chunk generation (single-city AND multi-city) ────────────────
// One day per call. No previous_day_summary — anti-repetition/continuity
// comes from the upfront skeleton pre-pass instead (see generateSkeleton
// below), so days can be generated in any order / concurrently. For multi-
// city, dayInfo (from planMultiCityDays) overrides destination/origin to
// this specific day's city — jobInputs.destination/origin, whatever the
// client sent, is the FIRST segment's at best and irrelevant for any later
// one. segments itself is NOT stripped from the payload (the old
// generateMultiCitySegment used to drop it) — buildPrompt's own
// isMultiCity(input.segments) check needs it present to render the DAY →
// CITY MAPPING / LODGING BY SEGMENT / transition-day context every day
// chunk (and the front-matter call) relies on.
async function generateDayChunk(
  jobInputs: Record<string, any>,
  dayIndex: number,
  totalDays: number,
  daySkeleton: SkeletonDay | null,
  fullSkeleton: SkeletonDay[],
  signal: AbortSignal,
  jobId: string,
  attempt: number,
  dayInfo: MultiCityDayInfo | null = null,
): Promise<SegmentResult> {
  const tripStartISO   = typeof jobInputs.start === 'string' ? jobInputs.start : new Date(jobInputs.start).toISOString().slice(0, 10)
  // dayInfo.dateISO (derived from THIS day's own segment) for multi-city --
  // more robust than tripStartISO + dayIndex, which assumes every segment
  // is back-to-back with no gap. Single-city (dayInfo null) keeps the
  // original trip-start + offset computation, unchanged.
  const dayStartISO    = dayInfo ? dayInfo.dateISO : addDaysISO(tripStartISO, dayIndex)

  const segmentPayload = {
    ...jobInputs,
    duration_days:   1,
    // Explicit trip-level nights/overnight, NOT this chunk's own 1-day span.
    // generate-trip/index.ts falls back to `duration_days - 1` whenever
    // `nights` isn't a number -- and jobInputs.nights arrives as a URL-query
    // STRING from the real client (always has), so without this override
    // that fallback used the just-overridden duration_days=1 above, computed
    // nights=0, set overnight=false, and told the model "Duración: 1 día
    // (sin pernocta)" -- directly triggering its own "no overnight -> leave
    // accommodations empty" instruction. 100% reproducible, not model
    // flakiness: confirmed live 2026-09-25, every single-city day chunk hit
    // it.
    nights:          Math.max(0, totalDays - 1),
    overnight:       totalDays > 1,
    segment_index:   dayIndex,
    total_segments:  totalDays,
    trip_day_offset: dayIndex,
    trip_total_days: totalDays,
    trip_start_date: tripStartISO,
    trip_end_date:   addDaysISO(tripStartISO, totalDays - 1),
    start: dayStartISO,
    end:   dayStartISO,
    // Multi-city per-day overrides -- jobInputs.destination/origin (the
    // client's top-level values) are, at best, only correct for the FIRST
    // segment. destination/origin here are what buildPrompt actually reads
    // for season/WC-context lines and the jet-lag block; segments (already
    // present via the ...jobInputs spread above, not stripped) is what
    // drives the DAY → CITY MAPPING / LODGING BY SEGMENT text itself.
    ...(dayInfo ? { destination: dayInfo.city, origin: dayInfo.origin } : {}),
    day_skeleton:  daySkeleton ?? undefined,
    full_skeleton: fullSkeleton,
    job_id:        jobId,
    attempt,
  }

  return callAnthropicForChunk(segmentPayload, false, dayIndex, signal, jobId, attempt)
}

// ── Direct Anthropic call for single-city day/front-matter units ─────────
// Shared by generateDayChunk and generateFrontmatter below -- same call
// shape, differing only in tool/schema/token-budget and which chunk_index
// this attempt logs and self-persists under (a day index, or -1 for
// front-matter -- the literal, not FRONTMATTER_UNIT below, for the same
// reason generate-trip/index.ts used to keep its own copy as a literal:
// cheap to keep in sync by inspection, no import-ordering question).
//
// Mirrors generateSkeleton's direct-call shape (already proven live) and
// generate-trip/index.ts's own serve() handler logic for these two unit
// kinds (isInvalidShape, the wrapped-fetch error/metrics logging, cost
// computation) -- this is that same logic, inlined here instead of
// reached over HTTP, so a completed result can never be discarded by a
// dropped connection between two separate function invocations.
//
// Takes an explicit `model` (rather than resolving it internally) and an
// `isFallback` flag so callAnthropicForChunk below can call this twice
// within the same attempt -- once for the primary model, once for the
// Sonnet-5.5-failed fallback to 4.6 -- with both calls sharing this one
// implementation instead of two near-duplicate copies.
async function callAnthropicOnce(
  segmentPayload: Record<string, any>,
  isFrontmatterOnly: boolean,
  chunkIndexForMetrics: number,
  signal: AbortSignal,
  jobId: string,
  attempt: number,
  model: string,
  isFallback: boolean,
): Promise<SegmentResult> {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured for day/front-matter call')

  const input = buildInput(segmentPayload)
  const toolName = isFrontmatterOnly ? 'emit_trip_frontmatter' : 'emit_trip_days'
  const toolSchema = isFrontmatterOnly ? TRIP_SCHEMA_FRONTMATTER_ONLY : TRIP_SCHEMA_DAYS_ONLY
  const strictMode = isSonnet55(model)
  // +30% buffer on 5.5: same tokenizer as Sonnet 5, which produces ~30% more
  // tokens than 4.6/Haiku for the same text (confirmed in the migration
  // guide, not yet confirmed against our own prompts) -- watch stop_reason
  // for 'max_tokens' truncation on the 5.5 batch and raise further if seen.
  const maxTokens = isFrontmatterOnly
    ? (strictMode ? 2700 : 2000)
    : (strictMode ? 3300 : 2500)

  const metricBase = {
    job_id: jobId,
    chunk_index: chunkIndexForMetrics,
    schema_kind: isFrontmatterOnly ? 'frontmatter' : 'lean',
    path: 'single',
    model,
    attempt,
    ok: false,
    model_fallback: isFallback,
  }

  const startedAt = Date.now()
  let res: Response
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: [{
          type: 'text',
          text: systemPromptFor(input.locale),
          cache_control: { type: 'ephemeral' },
        }],
        tools: [{
          name: toolName,
          description: isFrontmatterOnly
            ? (input.locale === 'en' ? "Emit the trip's front matter (title, tagline, budget, lodging) — no days." : 'Emite los datos generales del viaje (título, tagline, presupuesto, alojamiento) — sin días.')
            : (input.locale === 'en' ? "Emit this day's itinerary block." : 'Emite el bloque de itinerario de este día.'),
          input_schema: strictMode ? toStrictSchema(toolSchema) : toolSchema,
          ...(strictMode ? { strict: true } : {}),
        }],
        // tool_choice:"tool" (forced) 400s on Sonnet 5.5 -- "auto" + strict
        // schema + an explicit must-call-the-tool prompt line is the
        // documented replacement. Every other model keeps forced tool_choice.
        tool_choice: strictMode ? { type: 'auto' } : { type: 'tool', name: toolName },
        // between_tools = the lowest thinking setting on 5.5 (forced-
        // choice models below never send a thinking field at all, so this
        // whole block is 5.5-only). effort:'low' by default -- see
        // resolveEffort() above.
        ...(strictMode ? {
          thinking: { type: 'between_tools' },
          output_config: { effort: resolveEffort(segmentPayload) },
        } : {}),
        messages: [{
          role: 'user',
          content: buildPrompt(input)
            + (strictMode
                ? (input.locale === 'en'
                    ? `\n\nRespond ONLY by calling the ${toolName} tool with the complete data — do not respond with plain text.`
                    : `\n\nResponde ÚNICAMENTE llamando a la herramienta ${toolName} con los datos completos — no respondas con texto.`)
                : '')
            + (strictMode && !isFrontmatterOnly ? STRICT_MODE_LENGTH_REMINDER[input.locale] : ''),
        }],
      }),
      signal,
    })
  } catch (fetchErr) {
    // Same fetch-throws case generate-trip/index.ts used to classify --
    // no .status attached, so runUnitWithRetries treats it as transient.
    const message = fetchErr instanceof Error ? fetchErr.message : String(fetchErr)
    logGenerationMetric({ ...metricBase, ms: Date.now() - startedAt, status_code: null, error: message.slice(0, 500) })
    throw new Error(`direct Anthropic call fetch failed: ${message}`)
  }

  const ms = Date.now() - startedAt

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    logGenerationMetric({ ...metricBase, ms, status_code: res.status, error: errText.slice(0, 500) })
    const err = new Error(`direct Anthropic call returned ${res.status}: ${errText.slice(0, 500)}`)
    ;(err as any).status = res.status // 400/401/403 -> permanent, per runUnitWithRetries' classification
    throw err
  }

  const data = await res.json()

  if (data.stop_reason === 'max_tokens') {
    logGenerationMetric({
      ...metricBase, ms, status_code: null, error: 'max_tokens truncation',
      input_tokens: data.usage?.input_tokens ?? null,
      output_tokens: data.usage?.output_tokens ?? null,
      stop_reason: 'max_tokens',
      cost_usd: computeCostUsd(model, data.usage),
    })
    throw new Error('max_tokens truncation')
  }

  // Only reachable with tool_choice:"auto" (strictMode/5.5) -- forced
  // tool_choice can't refuse. Logged distinctly so a refusal doesn't read
  // as an unexplained "no tool_use in response" in the metrics.
  if (data.stop_reason === 'refusal') {
    const category = data.stop_details?.reason ?? data.stop_details?.type ?? 'unknown'
    logGenerationMetric({
      ...metricBase, ms, status_code: null, error: `refusal: ${category}`,
      stop_reason: 'refusal',
      cost_usd: computeCostUsd(model, data.usage),
    })
    throw new Error(`model refused: ${category}`)
  }

  logGenerationMetric({
    ...metricBase,
    ok: true,
    ms,
    input_tokens:  data.usage?.input_tokens ?? null,
    output_tokens: data.usage?.output_tokens ?? null,
    cache_read:    data.usage?.cache_read_input_tokens ?? null,
    stop_reason:   data.stop_reason ?? null,
    cost_usd:      computeCostUsd(model, data.usage),
  })

  const toolUse = Array.isArray(data.content)
    ? data.content.find((c: any) => c?.type === 'tool_use' && c?.name === toolName)
    : null
  if (!toolUse?.input) {
    throw new Error('no tool_use in direct Anthropic response')
  }
  if (isInvalidShape(toolUse.input, isFrontmatterOnly)) {
    throw new Error('invalid shape: model produced no itinerary days')
  }

  const budgetCurrencySuspect = isFrontmatterOnly
    ? isBudgetCurrencySuspect(toolUse.input.budget_breakdown, input.currency, input.nights, computeHeadcount(input))
    : null

  return { chunk: toolUse.input, budgetCurrencySuspect }
}

// Entry point generateDayChunk/generateFrontmatter actually call. Resolves
// the model once, tries it, and — only when that model is Sonnet 5.5 and
// the call fails for ANY reason (fetch failure, non-2xx, max_tokens,
// refusal, no tool_use, invalid shape) — retries THIS SAME attempt once on
// Sonnet 4.6 with the non-strict/forced-tool_choice shape, rather than
// letting runUnitWithRetries' outer loop retry 5.5 again. Added 2026-09-29
// after a real multi-minute outage in Sonnet 5.5's strict-tool-use grammar
// compiler failed every one of 8 concurrent calls in a batch identically —
// with SC_CONCURRENCY concurrent calls per batch, an outage without this
// fails the whole job, not just slows it. Deliberately broad (any error,
// not just 503) since every failure mode we can hit here is either
// something 4.6's mature non-strict path doesn't share (grammar-compiler
// instability) or something equally possible on either model (network
// blip) — narrowing this to "503 only" would leave the other Sonnet-5.5-
// specific failure shapes with no safety net. Doesn't consume any of
// SC_MAX_RETRIES' budget; it's a same-attempt, same-deadline detour. If the
// 4.6 fallback ALSO fails, that error is what the outer retry loop sees
// and classifies normally (a 400 there is genuinely permanent, unrelated
// to 5.5). A sustained outage costs one wasted 5.5 probe per attempt, not
// a failed job — see PR description / generation_metrics.model_fallback
// for how often this actually fires.
async function callAnthropicForChunk(
  segmentPayload: Record<string, any>,
  isFrontmatterOnly: boolean,
  chunkIndexForMetrics: number,
  signal: AbortSignal,
  jobId: string,
  attempt: number,
): Promise<SegmentResult> {
  const model = resolveDayModel(segmentPayload)
  try {
    return await callAnthropicOnce(segmentPayload, isFrontmatterOnly, chunkIndexForMetrics, signal, jobId, attempt, model, false)
  } catch (err) {
    if (!isSonnet55(model) || signal.aborted) throw err
    console.warn('[worker] Sonnet 5.5 call failed, falling back to 4.6 for this attempt:', String(err).slice(0, 200))
    return await callAnthropicOnce(segmentPayload, isFrontmatterOnly, chunkIndexForMetrics, signal, jobId, attempt, 'claude-sonnet-4-6', true)
  }
}

// ── NEW: front-matter generation (title/tagline/hero_tags/before_you_go/
// budget_breakdown/accommodations, NO days) ────────────────────────────────
// Previously bundled into chunk 0 (full schema) -- chunk 0 was consistently
// the slowest call (~40-48s vs ~23-31s for a lean day, confirmed via
// generation_metrics on the 10-city test) because it carried this extra
// front-matter on top of a day's worth of content. Split into its own call,
// fired concurrently with the day writers instead of serialized ahead of
// them, so max total duration drops from "slowest lean day + front-matter
// overhead" to just "slowest concurrent call" -- all of them now roughly
// the same size.
async function generateFrontmatter(
  jobInputs: Record<string, any>,
  totalDays: number,
  signal: AbortSignal,
  jobId: string,
  attempt: number,
): Promise<SegmentResult> {
  const tripStartISO = typeof jobInputs.start === 'string' ? jobInputs.start : new Date(jobInputs.start).toISOString().slice(0, 10)

  // Multi-city: jobInputs.destination (whatever the client sent) isn't
  // reliable for a chain -- destinationLine in buildPrompt already branches
  // off segments itself for the actual prompt text, but input.destination
  // still feeds season-line/WC-context helpers, so point it at the first
  // city rather than leave it stale/generic.
  const multiCity = getTripSegments(jobInputs)

  const payload = {
    ...jobInputs,
    duration_days:   totalDays,
    nights:          Math.max(0, totalDays - 1),
    overnight:       totalDays > 1,
    trip_total_days: totalDays,
    trip_start_date: tripStartISO,
    trip_end_date:   addDaysISO(tripStartISO, totalDays - 1),
    frontmatter_only: true,
    ...(multiCity ? { destination: multiCity[0].destination } : {}),
    job_id:          jobId,
    attempt,
  }

  return callAnthropicForChunk(payload, true, -1, signal, jobId, attempt)
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
        required: ['day', 'theme', 'neighborhood', 'anchor', 'pace', 'key_restaurant', 'key_breakfast', 'key_site'],
        properties: {
          day:            { type: 'integer' },
          theme:          { type: 'string' },
          neighborhood:   { type: 'string' },
          anchor:         { type: 'string' },
          pace:           { type: 'string' },
          key_restaurant: { type: 'string' },
          key_breakfast:  { type: 'string' },
          key_site:       { type: 'string' },
          // Optional -- only meaningfully asked of the model for multi-city
          // travel days (see the prompt branch below). Not in `required`:
          // single-city never mentions this field at all, so Haiku simply
          // omits it there, and the post-call override below hardcodes 0
          // for every non-travel day regardless of what (if anything) came
          // back.
          transfer_hours: { type: 'number' },
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
  multiCityDayPlan: MultiCityDayInfo[] | null,
): Promise<SkeletonDay[]> {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured for skeleton pass')

  const startedAt = Date.now()

  const isEN = jobInputs.locale === 'en'
  const interests = Array.isArray(jobInputs.interests) ? jobInputs.interests.join(', ') : ''

  // Multi-city: tell Haiku which city each day belongs to and which days
  // are travel days, so its theme/neighborhood/venue assignments land in
  // the RIGHT city per day instead of drifting toward whichever city
  // jobInputs.destination happens to name. city/travel_day themselves are
  // NEVER trusted from the model (see the deterministic override below) --
  // this context exists so the THINGS the model DOES decide (theme,
  // neighborhood, venues, transfer_hours) are coherent with a plan it
  // already knows is fixed, not so it re-derives the plan itself.
  const dayPlanLines = multiCityDayPlan
    ? multiCityDayPlan.map((d, i) => {
        const dayNum = i + 1
        if (!d.travelDay) {
          return isEN ? `  Day ${dayNum}: ${d.city}` : `  Día ${dayNum}: ${d.city}`
        }
        // Next city is whichever segment's day-1 comes right after this one.
        const nextCity = multiCityDayPlan[i + 1]?.city ?? d.city
        return isEN
          ? `  Day ${dayNum}: ${d.city} → ${nextCity} (TRAVEL DAY -- estimate transfer_hours realistically for this route; keep key_restaurant/key_breakfast modest and near the transfer, key_site can be light or omitted in spirit)`
          : `  Día ${dayNum}: ${d.city} → ${nextCity} (DÍA DE TRASLADO -- estima transfer_hours de forma realista para esta ruta; mantén key_restaurant/key_breakfast modestos y cerca del traslado, key_site puede ser ligero)`
      }).join('\n')
    : ''

  const multiCityBlock = multiCityDayPlan
    ? (isEN
        ? `\n\nThis is a MULTI-CITY trip. Each day belongs to a specific city -- use EXACTLY this day → city assignment, do not invent your own routing:\n${dayPlanLines}\nFor travel days, also fill transfer_hours (a realistic estimate in hours for that specific route -- your general knowledge of typical flight/bus/ferry times between these places). Leave transfer_hours at 0 (or omit it) for every non-travel day.`
        : `\n\nEste es un viaje MULTI-CIUDAD. Cada día pertenece a una ciudad específica -- usa EXACTAMENTE esta asignación día → ciudad, no inventes tu propia ruta:\n${dayPlanLines}\nPara los días de traslado, llena también transfer_hours (una estimación realista en horas para esa ruta específica -- tu conocimiento general de tiempos típicos de vuelo/autobús/ferry entre estos lugares). Deja transfer_hours en 0 (u omítelo) en cada día que no sea de traslado.`)
    : ''

  const destinationForPrompt = multiCityDayPlan ? (isEN ? 'multiple cities (see below)' : 'varias ciudades (ver abajo)') : jobInputs.destination

  const prompt = isEN
    ? `Plan a lightweight day-by-day skeleton for a ${totalDays}-day trip to ${destinationForPrompt} (traveler: ${jobInputs.traveler ?? 'n/a'}, pace: ${jobInputs.pace ?? 'n/a'}, budget: ${jobInputs.budget ?? 'n/a'}, interests: ${interests || 'general'}). For EACH day (1 to ${totalDays}), give: a short theme, the main neighborhood/area, one anchor activity or place, the pace, ONE NAMED restaurant for that day's signature lunch/dinner (key_restaurant), ONE NAMED, DIFFERENT restaurant/café/bakery for that day's breakfast (key_breakfast — every day needs its own breakfast spot too, this is NOT the same slot as key_restaurant), and ONE NAMED site/attraction for that day's key activity (key_site). All three must be real, specific place names, never a category like "a local café". You are assigning these across the WHOLE trip in one pass, so you can see every day at once: EVERY key_restaurant, EVERY key_breakfast, and EVERY key_site across all ${totalDays} days MUST be a DIFFERENT real place from every other day's — no venue of any kind may be assigned to more than one day, and key_restaurant must differ from key_breakfast within the same day too. Also vary neighborhoods and anchors across days.${multiCityBlock} Call the emit_skeleton tool with exactly ${totalDays} day entries, one per day from 1 to ${totalDays}.`
    : `Planea un esqueleto ligero día por día para un viaje de ${totalDays} días a ${destinationForPrompt} (viajero: ${jobInputs.traveler ?? 'n/a'}, ritmo: ${jobInputs.pace ?? 'n/a'}, presupuesto: ${jobInputs.budget ?? 'n/a'}, intereses: ${interests || 'generales'}). Para CADA día (1 a ${totalDays}), da: un tema breve, la zona/barrio principal, una actividad o lugar ancla, el ritmo, UN restaurante CON NOMBRE para la comida/cena principal del día (key_restaurant), UN restaurante/café/panadería CON NOMBRE, DIFERENTE, para el desayuno de ese día (key_breakfast — cada día necesita también su propio lugar de desayuno, NO es el mismo espacio que key_restaurant), y UN sitio/atracción CON NOMBRE para la actividad clave del día (key_site). Los tres deben ser lugares reales y específicos, nunca una categoría como "un café local". Estás asignando esto para TODO el viaje en una sola pasada, así que ves todos los días a la vez: CADA key_restaurant, CADA key_breakfast y CADA key_site en los ${totalDays} días DEBE ser un lugar real DIFERENTE al de cualquier otro día — ningún lugar de ningún tipo puede asignarse a más de un día, y key_restaurant debe ser distinto de key_breakfast dentro del mismo día también. Varía también zonas y anclas entre días.${multiCityBlock} Llama a la herramienta emit_skeleton con exactamente ${totalDays} entradas de día, una por cada día de 1 a ${totalDays}.`

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
    cache_read:    data.usage?.cache_read_input_tokens ?? null,
    attempt:       0,
    stop_reason:   data.stop_reason ?? null,
    ok:            data.stop_reason !== 'max_tokens',
    cost_usd:      computeCostUsd(SKELETON_MODEL, data.usage),
  })

  const toolUse = Array.isArray(data.content)
    ? data.content.find((c: any) => c?.type === 'tool_use' && c?.name === 'emit_skeleton')
    : null
  const days = toolUse?.input?.days
  if (!Array.isArray(days) || days.length === 0) {
    throw new Error('skeleton call returned no days')
  }
  // city/travel_day are ALWAYS deterministic overrides, single-city and
  // multi-city alike -- never trusted from the model, since the segment
  // list (or, for single-city, the simple fact there's only one city)
  // already answers both with certainty. transfer_hours is the one field
  // taken from the model, and only for days multiCityDayPlan itself marks
  // as a travel day -- a non-travel day gets 0 regardless of what (if
  // anything) Haiku returned for it, since only travel days ever explained
  // that field to the model in the first place (see multiCityBlock above).
  //
  // Looked up by the model's OWN `day` field (1-indexed), NOT array
  // position -- the downstream consumer (runOneUnit's
  // `skeleton!.find(s => s.day === unit + 1)`) never assumed the array
  // comes back in order either, and there's no validation anywhere forcing
  // Haiku to return exactly N entries in 1..N order. Using array index here
  // would silently pair the wrong city/travel_day with a day if the model
  // ever reorders or skips one.
  return (days as any[]).map((d) => {
    const dayNum = typeof d.day === 'number' ? d.day : null
    const planEntry = dayNum !== null ? (multiCityDayPlan?.[dayNum - 1] ?? null) : null
    const rawTransferHours = typeof d.transfer_hours === 'number' && Number.isFinite(d.transfer_hours) ? d.transfer_hours : null
    return {
      ...d,
      city:           planEntry?.city ?? jobInputs.destination,
      travel_day:     planEntry?.travelDay ?? false,
      // Fallback of 4h if the model marks a travel day but omits/garbles
      // the estimate -- better than 0 (which would tell the day-writer
      // "no transfer to account for" on a day we KNOW is one).
      transfer_hours: planEntry?.travelDay ? (rawTransferHours ?? 4) : 0,
    }
  }) as SkeletonDay[]
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

// ── Duplicate-venue detection + repair helpers ────────────────────────────
// See the call site (post-assembly, before the trips insert) for the full
// rationale. transfer/hotel blocks are excluded — legitimately recurring.
type DupeOccurrence = { dayIdx: number; blockIdx: number; day_number: number; title: string }

function findDuplicateVenueOccurrences(days: any[]): DupeOccurrence[] {
  const seen = new Map<string, number>() // title -> day_number first seen on
  const dupes: DupeOccurrence[] = []
  for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
    const day = days[dayIdx]
    const blocks = day?.blocks ?? []
    for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
      const block = blocks[blockIdx]
      if (block?.type === 'transfer' || block?.type === 'hotel') continue
      const title = typeof block?.title === 'string' ? block.title.trim() : ''
      if (!title) continue
      if (seen.has(title)) {
        dupes.push({ dayIdx, blockIdx, day_number: day.day_number, title })
      } else {
        seen.set(title, day.day_number)
      }
    }
  }
  return dupes
}

function allUsedVenueTitles(days: any[]): string[] {
  const titles: string[] = []
  for (const day of days ?? []) {
    for (const block of day?.blocks ?? []) {
      if (block?.type === 'transfer' || block?.type === 'hotel') continue
      const t = typeof block?.title === 'string' ? block.title.trim() : ''
      if (t) titles.push(t)
    }
  }
  return Array.from(new Set(titles))
}

// Calls generate-trip's single-block-regeneration path (regenerate_block:
// true — see that file's early-return branch, right after buildInput).
// Deliberately minimal payload, not the full job.inputs spread — this
// isn't a day or trip generation, just "give me one different real venue".
async function regenerateDuplicateBlock(
  jobInputs: Record<string, any>,
  dayNumber: number,
  originalBlock: any,
  avoidVenues: string[],
  signal: AbortSignal,
  jobId: string,
): Promise<{ title: string; description: string; neighborhood?: string }> {
  const payload = {
    locale:            jobInputs.locale,
    destination:       jobInputs.destination,
    regenerate_block:  true,
    block_type:        originalBlock?.type,
    block_time:        originalBlock?.time,
    day_number:        dayNumber,
    avoid_venues:      avoidVenues,
    job_id:            jobId,
  }
  const res = await callGenerateTrip(payload, signal)
  if (!res?.block?.title) throw new Error('block replacement missing title')
  return res.block
}

// ── NEW: pre-assembly integrity check ─────────────────────────────────────
// Asserts the concatenated day list is contiguous 1..N with no duplicates,
// and that front-matter (title, budget_breakdown) is present on the chunk
// that's supposed to carry it (chunk 0). Throws — caller marks the job
// failed rather than silently assembling a broken/gappy trip.
// frontmatter: for single-city (front-matter split into its own concurrent
// unit, see generateFrontmatter/FRONTMATTER_UNIT), pass it separately so
// the check runs against the actual front-matter carrier, not chunks[0]
// (which is now just a lean day with no title/budget_breakdown at all).
// Multi-city still passes null here — chunks[0] genuinely carries its own
// front-matter, unchanged.
function assertChunksIntegrity(chunks: ChunkContent[], expectedDays: number, frontmatter: ChunkContent | null): void {
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
  const first = (frontmatter ?? chunks[0]) as any
  if (!first?.title || !first?.budget_breakdown) {
    throw new Error('assertChunksIntegrity: missing front-matter (title/budget_breakdown)')
  }
}

// Strips accents, lowercases, trims, collapses whitespace -- enough to
// match "San José" against "San Jose", or "  Roma " against "roma". NOT a
// translation layer: "Panama City" vs "Ciudad de Panamá" still won't match
// on normalization alone, which is why the LODGING BY SEGMENT prompt block
// (prompt.ts) explicitly tells the model `city: "${s.destination}" <- use
// this exact value` -- the same instruction that's already proven reliable
// for single-city's own city field across this whole session's testing.
function normalizeCityForMatch(s: unknown): string {
  if (typeof s !== 'string') return ''
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ')
}

function assembleResult(chunks: ChunkContent[], jobInputs: Record<string, any>, frontmatterOverride?: ChunkContent | null): Record<string, any> {
  // Concatenate per-day outputs into a single trip_data shape matching what
  // the sync endpoint returns. Every chunk is exactly 1 day, single-city or
  // multi-city alike (multi-city's old up-to-5-day HTTP sub-chunks are gone
  // — 2026-09-29 migration). Day numbers are cumulative across the whole
  // trip so users see "Day 17" not "Segment 2 Day 7". Trip-level metadata
  // (title, subtitle, budget, accommodations) always comes from
  // frontmatterOverride now — front-matter is its own concurrent unit for
  // both city modes (see generateFrontmatter), never day-chunk 0.
  const first     = frontmatterOverride ?? chunks[0] ?? {}
  const multiCity = getTripSegments(jobInputs)
  let dayCounter = 0
  const days: any[] = []

  // Each day is generated as an independent isolated call, so the AI numbers
  // it from 1 as if it were the only day. After we bump day_number to be
  // cumulative across the trip, the AI-emitted strings ("Día 1 · Bocas del
  // Toro — ...") become inconsistent with the card header ("DÍA 6"). Rewrite
  // the leading "Día N" / "Day N" prefix in day_label + title so the
  // displayed numbers line up. Match Spanish + English; case-insensitive on
  // the day word; tolerate spaces around the dot separator.
  const dayLeadRE = /^(D[ií]a|Day)\s+\d+/i
  function renumberLeadingDay(s: unknown, n: number): string | undefined {
    if (typeof s !== 'string' || !s) return s as undefined
    return dayLeadRE.test(s)
      ? s.replace(dayLeadRE, (m) => m.replace(/\d+/, String(n)))
      : s
  }

  for (const chunk of chunks) {
    for (const day of chunkDays(chunk)) {
      dayCounter += 1
      days.push({
        ...day,
        day_number: dayCounter,
        day_label:  renumberLeadingDay((day as any).day_label, dayCounter),
        title:      renumberLeadingDay((day as any).title,     dayCounter),
      })
    }
  }

  // Accommodations — sourced ENTIRELY from front-matter now (day chunks use
  // TRIP_SCHEMA_DAYS_ONLY, which has no accommodations field at all, so
  // there's nothing to collect from `chunks` any more regardless of city
  // mode). Date rewrite: the AI is given exact checkInDate/checkOutDate/
  // nights per entry in the LODGING (single-city) / LODGING BY SEGMENT
  // (multi-city) prompt block and told to use them as-is, but they're
  // patched here deterministically anyway rather than trusted blindly.
  const rawAccommodations: any[] = Array.isArray((first as any).accommodations) ? (first as any).accommodations : []
  let accommodations: any[]
  if (multiCity) {
    // One entry per OVERNIGHT segment (nights > 0), matched by the
    // accommodationItem.city field the prompt explicitly asks the model to
    // echo back — NOT by array position, so a model miscount doesn't
    // silently attach the wrong dates to the wrong city. A same-day segment
    // (nights: 0 -- prompt.ts's sameDayNote explicitly tells the model NOT
    // to emit one) is skipped here too, so its legitimate absence can't be
    // confused with a real miss. An OVERNIGHT segment with no match FAILS
    // the job (thrown, caught by the call site) rather than shipping a
    // multi-city trip silently missing lodging for one of its cities — same
    // stance as the CRITICA accommodations-empty check below, just
    // city-aware.
    const used = new Set<number>()
    const matched: any[] = []
    const missingSegments: string[] = []
    for (const seg of multiCity.filter(s => s.nights > 0)) {
      const target = normalizeCityForMatch(seg.destination)
      let foundIdx = -1
      for (let i = 0; i < rawAccommodations.length; i++) {
        if (used.has(i)) continue
        const candidate = normalizeCityForMatch(rawAccommodations[i]?.city)
        if (candidate && (candidate === target || candidate.includes(target) || target.includes(candidate))) {
          foundIdx = i
          break
        }
      }
      if (foundIdx === -1) {
        missingSegments.push(seg.destination)
        continue
      }
      used.add(foundIdx)
      matched.push({
        ...rawAccommodations[foundIdx],
        checkInDate:  seg.startDate,
        checkOutDate: seg.endDate,
        nights:       Math.max(0, seg.nights),
      })
    }
    if (missingSegments.length > 0) {
      const returnedCities = rawAccommodations.map((a: any) => (typeof a?.city === 'string' && a.city.trim()) || '(no city)').join(', ') || '(none)'
      throw new Error(`assembleResult: no accommodation matched for segment(s) [${missingSegments.join(', ')}] -- model returned cities: [${returnedCities}]`)
    }
    accommodations = matched
  } else if (rawAccommodations.length > 0) {
    // Single-city: take the front-matter's accommodation block(s) and
    // rewrite dates/nights to the full trip span. jobInputs holds the
    // trip-level start / end / duration_days (the client passes these
    // through unchanged on /api/trips/jobs creation).
    const tripStart = typeof jobInputs.start === 'string' ? jobInputs.start : undefined
    const tripEnd   = typeof jobInputs.end   === 'string' ? jobInputs.end   : undefined
    const tripNights = (() => {
      const fromInputs = Number(jobInputs.duration_days)
      if (Number.isFinite(fromInputs) && fromInputs > 0) return Math.max(0, fromInputs - 1)
      return 0
    })()
    accommodations = rawAccommodations.map((a: any) => ({
      ...a,
      ...(tripStart ? { checkInDate:  tripStart } : {}),
      ...(tripEnd   ? { checkOutDate: tripEnd   } : {}),
      ...(tripNights > 0 ? { nights: tripNights } : {}),
    }))
  } else {
    accommodations = []
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
    if (multiCity) return countMultiCityDays(multiCity)
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
    accommodations:   accommodations.length > 0 ? accommodations : null,
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
// Credit is charged HERE — on successful job completion — not at job
// creation. app/api/trips/jobs/route.ts still gates job creation on
// checkGenerationAllowed() (so a user with 0 credits can't start a job at
// all), but no longer calls consumeOneTrip(). This replaces the old
// charge-then-refund-on-failure model: a failure anywhere in the pipeline
// (skeleton, any unit, integrity check, trips insert) now simply never
// charges, instead of charging immediately and refunding after the fact.
// Skipped entirely for regenerations (isRegenerationOfOwnedTrip already
// verified at job creation — see the tripId check at each call site) and
// for explorer-tier (unlimited) users.
// Idempotency guard added 2026-09-28 (billing-incident response, see
// generation_jobs.credit_charged_at migration and the emergency fix to
// app/api/trips/jobs/route.ts, commit 29fed3e7). Atomic claim BEFORE the
// actual entitlements decrement: an UPDATE with WHERE credit_charged_at IS
// NULL either claims the job (1 row) or finds it already claimed (0 rows)
// -- there's no read-then-write race window a concurrent/duplicate call
// for the same job_id could land in. This defends against the worker
// itself double-charging one job (retry, self-reinvoke, duplicate
// invocation) -- it does NOT relate to the separate route.ts-vs-worker
// mismatch that caused the original incident, which is fixed by removing
// the route's creation-time charge entirely, not by guarding here.
async function consumeOneTripIfApplicable(admin: any, userId: string, jobId: string): Promise<void> {
  try {
    const { data: claimed, error: claimErr } = await admin
      .from('generation_jobs')
      .update({ credit_charged_at: new Date().toISOString() })
      .eq('id', jobId)
      .is('credit_charged_at', null)
      .select('id')

    if (claimErr) {
      console.warn('[worker] credit claim failed, skipping charge to be safe:', claimErr.message)
      return
    }
    if (!claimed || claimed.length === 0) {
      console.log('[worker] job', jobId, 'already charged -- skipping duplicate credit consumption')
      return
    }

    const { data } = await admin
      .from('user_entitlements')
      .select('tier, trips_remaining, trips_used')
      .eq('user_id', userId)
      .single()

    if (!data) return
    if (data.tier === 'explorer') return

    await admin
      .from('user_entitlements')
      .update({
        trips_remaining: Math.max(0, (data.trips_remaining ?? 0) - 1),
        trips_used:      (data.trips_used ?? 0) + 1,
        updated_at:      new Date().toISOString(),
      })
      .eq('user_id', userId)
    console.log('[worker] charged credit for user:', userId, 'job:', jobId)
  } catch (e) {
    console.warn('[worker] charge failed (non-fatal -- job still completes; matches the old refund path\'s non-fatal handling):', e)
  }
}

// ── Single entry point (single-city AND multi-city) ───────────────────────
// Was two fully separate functions (runSequentialMultiCity, sequential,
// previous_day_summary continuity; runConcurrentSingleCity, concurrent,
// skeleton continuity) until the 2026-09-29 multi-city migration deleted
// the sequential one entirely. Multi-city is now just a day plan whose city
// varies per entry (planMultiCityDays) -- same retry loop, same
// concurrency batching, same persistence/progress/late-row-recovery code as
// single-city, zero duplication. Takes the shared mutable chunksByIndex map
// (read/write — resume support + progress tracking). Returns `Response` to
// short-circuit on failure, or `null` to fall through to the shared
// completion tail in serve() below.

// Unit index -1 is a sentinel for "front-matter" (title/tagline/hero_tags/
// before_you_go/budget_breakdown/accommodations, no days). 0..totalDays-1
// are day chunks. Both flow through the same concurrency/retry/persistence
// machinery below via generation_chunks.chunk_index = -1 for front-matter
// (negative integers are fine in that column; no schema change needed).
const FRONTMATTER_UNIT = -1

async function runConcurrentTrip(
  admin: any,
  job: JobRow,
  chunksByIndex: Map<number, ChunkContent>,
  startedAt: number,
): Promise<Response | null> {
  const multiCity = getTripSegments(job.inputs)
  const totalDays = multiCity
    ? countMultiCityDays(multiCity)
    : Math.max(1, Math.min(35, Number(job.inputs.duration_days) || 1))
  // Per-day city/origin/travel-day assignment, deterministic from the
  // segment list -- null for single-city. Threaded into both the skeleton
  // pass (so Haiku's theme/venue assignments land in the right city) and
  // every generateDayChunk call (so destination/origin are overridden per
  // day, not left at whatever the client's top-level jobInputs said).
  const multiCityDayInfo = multiCity ? planMultiCityDays(multiCity, job.inputs.origin) : null

  // Skeleton — compute once per job, cache on the row so a self-reinvoke
  // doesn't redo the Haiku call.
  let skeleton: SkeletonDay[] | null = Array.isArray(job.skeleton) ? job.skeleton : null
  if (!skeleton) {
    const skelCtrl = new AbortController()
    const skelTimer = setTimeout(() => skelCtrl.abort(), SC_SKELETON_TIMEOUT_MS)
    try {
      skeleton = await generateSkeleton(job.inputs, totalDays, skelCtrl.signal, job.id, multiCityDayInfo)
    } catch (e) {
      clearTimeout(skelTimer)
      console.error('[worker:sc] skeleton pass failed:', e)
      await admin
        .from('generation_jobs')
        .update({ status: 'failed', error: `skeleton: ${String(e).slice(0, 500)}` })
        .eq('id', job.id)
      // No refund here -- credit is charged on completion now, not
      // creation (see the shared completion tail in serve()), so a
      // pre-completion failure never took the user's credit in the first
      // place. Same reasoning applies to every failure path below.
      return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'skeleton' }), {
        status: 502,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }
    clearTimeout(skelTimer)
    await admin.from('generation_jobs').update({ skeleton } as any).eq('id', job.id)
  }

  const dayPlan = planChunks(totalDays)
  const missingDays = dayPlan.filter(d => !chunksByIndex.has(d))
  const missing = chunksByIndex.has(FRONTMATTER_UNIT) ? missingDays : [FRONTMATTER_UNIT, ...missingDays]

  async function runOneUnit(unit: number, signal: AbortSignal, attempt: number) {
    if (unit === FRONTMATTER_UNIT) {
      const segResult = await generateFrontmatter(job.inputs, totalDays, signal, job.id, attempt)
      return { unit, segResult }
    }
    const daySkeleton = skeleton!.find(s => s.day === unit + 1) ?? null
    const dayInfo = multiCityDayInfo?.[unit] ?? null
    const segResult = await generateDayChunk(job.inputs, unit, totalDays, daySkeleton, skeleton!, signal, job.id, attempt, dayInfo)
    return { unit, segResult }
  }

  // Per-unit retry, not batch-level. Previously a failed unit's retry only
  // started once Promise.allSettled resolved for the WHOLE batch -- so a
  // unit that failed at ~10s waited behind its slowest sibling (a
  // legitimate 25-35s call) before its own retry even began, landing
  // retries at ~55-57s against the 60s deadline. Confirmed live across
  // five separate failures (Lisboa/Tokyo/Barcelona/Medellín/Roma,
  // 2026-09-25 through 2026-09-28): every retry started right when the
  // batch's LAST successful sibling finished, never when the failing unit
  // itself actually failed. Each unit now retries independently,
  // immediately on its own failure (after backoff), computing its own
  // remaining-budget window at that moment -- moves typical retry landing
  // from ~56s to ~33s and makes the 60s deadline non-marginal regardless
  // of whatever's actually causing the underlying failure.
  async function runUnitWithRetries(unit: number): Promise<{ unit: number; segResult?: SegmentResult; permanentError?: boolean }> {
    for (let attempt = 0; attempt <= SC_MAX_RETRIES; attempt++) {
      // Measured against startedAt (true invocation start, before skeleton
      // ran) every time, not a fixed post-skeleton allowance — a slow
      // skeleton correctly eats into this budget instead of the total
      // silently overshooting 60s. Reserves SC_FINAL_OVERHEAD_RESERVE_MS
      // for the non-generation work still to come after the last attempt.
      if (attempt > 0) {
        const remaining = SC_JOB_DEADLINE_MS - (Date.now() - startedAt) - SC_FINAL_OVERHEAD_RESERVE_MS
        if (remaining < SC_MIN_RETRY_WINDOW_MS) return { unit } // not enough budget left to retry meaningfully -- fail cleanly instead of starting a doomed attempt
        await new Promise(r => setTimeout(r, SC_RETRY_BACKOFF_MS[attempt - 1] ?? 2_000))
      }

      // No fixed per-attempt cap (see the SC_JOB_DEADLINE_MS comment above
      // for why) -- every attempt, first or retry, gets whatever's left of
      // the job deadline.
      const remainingForThisAttempt = SC_JOB_DEADLINE_MS - (Date.now() - startedAt) - SC_FINAL_OVERHEAD_RESERVE_MS
      if (remainingForThisAttempt <= 0) return { unit } // out of budget entirely

      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), remainingForThisAttempt)
      try {
        const { segResult } = await runOneUnit(unit, ctrl.signal, attempt).finally(() => clearTimeout(t))
        return { unit, segResult }
      } catch (err) {
        // Error classification: 400/401/403 are permanent (bad request
        // shape, bad/expired auth, forbidden) -- retrying THIS unit won't
        // help, so stop here rather than burning its retry budget. A
        // systemic permanent error (e.g. the same auth failure) hits every
        // other unit's own first attempt independently and each stops
        // itself the same way -- no cross-unit signal needed. 429/5xx and
        // anything without a status (network errors, our own
        // AbortController timeout) are transient and retried with backoff.
        const status = (err as any)?.status
        const isPermanent = status === 400 || status === 401 || status === 403
        console.warn('[worker:sc] unit rejected', unit, 'attempt', attempt, 'status', status ?? 'n/a', String(err).slice(0, 300))
        if (isPermanent) return { unit, permanentError: true }
        // loop continues -> retries THIS unit immediately (after backoff),
        // not gated on any sibling unit's state.
      }
    }
    return { unit } // retries exhausted
  }

  for (let batchStart = 0; batchStart < missing.length; batchStart += SC_CONCURRENCY) {
    const remainingBudget = 140_000 - (Date.now() - startedAt)
    if (remainingBudget < SC_BUDGET_FLOOR_MS) break // self-reinvoke picks up the rest (long, multi-batch trips)

    const batchUnits = missing.slice(batchStart, batchStart + SC_CONCURRENCY)
    const succeeded = new Map<number, SegmentResult>()

    const unitResults = await Promise.allSettled(batchUnits.map(unit => runUnitWithRetries(unit)))
    let batch: number[] = []
    for (const r of unitResults) {
      if (r.status !== 'fulfilled') continue // runUnitWithRetries never throws -- defensive only
      if (r.value.segResult) {
        succeeded.set(r.value.unit, r.value.segResult)
      } else {
        batch.push(r.value.unit)
      }
    }

    if (batch.length > 0) {
      // Before giving up: this invocation's own view (succeeded/batch) only
      // reflects fetches THIS worker actually received a response for. An
      // attempt can finish successfully server-side after this worker's own
      // AbortController already gave up on it (the Buenos Aires case —
      // see the SC_JOB_DEADLINE_MS comment above) — generate-trip
      // self-persists that result straight into generation_chunks the
      // moment it has one, independent of whether the response ever made
      // it back here. One fresh, cheap read for exactly the still-failing
      // unit indices picks those up instead of failing a job that actually
      // has a complete result sitting in the table.
      const { data: lateRows } = await admin
        .from('generation_chunks')
        .select('chunk_index, content')
        .eq('job_id', job.id)
        .in('chunk_index', batch)
      for (const row of lateRows ?? []) {
        const idx = (row as any).chunk_index as number
        // budgetCurrencySuspect is null for a recovered row (that flag is
        // computed by generate-trip inline, not stored on the chunk row
        // itself) -- acceptable: it only feeds an internal QA signal, never
        // shown to the user, and this recovery path is expected to be rare.
        succeeded.set(idx, { chunk: (row as any).content, budgetCurrencySuspect: null })
      }
      const recoveredIdx = new Set(succeeded.keys())
      batch = batch.filter(unit => !recoveredIdx.has(unit))
      if (batch.length > 0) {
        console.warn('[worker:sc] late-row re-check found', (lateRows ?? []).length, 'of', batch.length + (lateRows ?? []).length, 'still-missing units')
      }
    }

    if (batch.length > 0) {
      // Retries exhausted (or abandoned past the wall-clock cutoff, or a
      // permanent-class error) with units still failing — a real failure,
      // not a budget timeout, so fail the job rather than looping
      // self-reinvoke forever on a possibly-deterministic error.
      await admin
        .from('generation_jobs')
        .update({ status: 'failed', error: `units failed after retries: ${batch.join(',')}` })
        .eq('id', job.id)
      return new Response(JSON.stringify({ ok: false, status: 'failed', failed_units: batch }), {
        status: 502,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

    // Whole batch succeeded — persist in unit order (frontmatter's -1 sorts
    // first naturally).
    const orderedBatch = [...succeeded.entries()].sort((a, b) => a[0] - b[0])
    for (const [unit, segResult] of orderedBatch) {
      chunksByIndex.set(unit, segResult.chunk)
      try {
        const { error: insertErr } = await admin
          .from('generation_chunks')
          .insert({ job_id: job.id, chunk_index: unit, content: segResult.chunk })
        // Unique (job_id, chunk_index) — a retried/duplicate insert for an
        // already-persisted unit is a benign no-op, not a hard failure.
        if (insertErr && insertErr.code !== '23505') {
          throw new Error(`chunks insert failed: ${insertErr.message}`)
        }
        if (unit === FRONTMATTER_UNIT) {
          await admin
            .from('generation_jobs')
            .update({ budget_currency_suspect: segResult.budgetCurrencySuspect } as any)
            .eq('id', job.id)
        }
      } catch (persistErr) {
        console.error('[worker:sc] unit persist failed at index', unit, persistErr)
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

    // Progress count: frontmatter (0 or 1) + contiguous-from-zero day count.
    // Batches are processed in ascending order so this is monotonic as long
    // as nothing above returned early.
    let dayDoneCount = 0
    while (dayDoneCount < totalDays && chunksByIndex.has(dayDoneCount)) dayDoneCount++
    const doneCount = (chunksByIndex.has(FRONTMATTER_UNIT) ? 1 : 0) + dayDoneCount

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

    // Progressive partial assembly — render finished days while the rest
    // are still generating. Tolerates missing front-matter (falls back to a
    // generic title/subtitle inside assembleResult). For multi-city, if
    // front-matter hasn't landed yet, assembleResult's new accommodation-
    // by-city matching (see its own comment) throws for every segment —
    // caught right here, same as any other assembly hiccup, so it just
    // skips writing a partial preview for this round rather than failing
    // the job. Front-matter is always in the FIRST batch (see `missing`
    // above), so this window is brief in practice.
    try {
      const frontmatter = chunksByIndex.get(FRONTMATTER_UNIT) ?? null
      const chunksOrdered: ChunkContent[] = []
      for (let idx = 0; idx < dayDoneCount; idx++) {
        const c = chunksByIndex.get(idx)
        if (c) chunksOrdered.push(c)
      }
      if (chunksOrdered.length > 0 || frontmatter) {
        const partial = assembleResult(chunksOrdered, job.inputs, frontmatter)
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

  const earlyReturn = await runConcurrentTrip(admin, job, chunksByIndex, startedAt)
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
  async function fetchChunk(idx: number): Promise<ChunkContent | null> {
    const c = chunksByIndex.get(idx)
    if (c) return c
    const { data } = await admin
      .from('generation_chunks')
      .select('content')
      .eq('job_id', job.id)
      .eq('chunk_index', idx)
      .single()
    return data ? (data as any).content : null
  }

  const orderedChunks: ChunkContent[] = []
  // chunks_total = expectedDays + 1 (front-matter unit + per-day units) for
  // BOTH city modes now — front-matter lives at chunk_index=-1, separate
  // from the day chunks, fetched on its own rather than looped with them.
  const expectedDays = multiCity
    ? countMultiCityDays(multiCity)
    : Math.max(1, Math.min(35, Number(job.inputs.duration_days) || 1))
  const frontmatter: ChunkContent | null = await fetchChunk(FRONTMATTER_UNIT)
  for (let i = 0; i < expectedDays; i++) {
    const c = await fetchChunk(i)
    if (c) orderedChunks.push(c)
  }

  try {
    assertChunksIntegrity(orderedChunks, expectedDays, frontmatter)
  } catch (integrityErr) {
    console.error('[worker] pre-assembly integrity check failed:', integrityErr)
    await admin
      .from('generation_jobs')
      .update({ status: 'failed', error: `integrity: ${String(integrityErr).slice(0, 500)}` })
      .eq('id', job.id)
    return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'integrity' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  let result: Record<string, any>
  try {
    result = assembleResult(orderedChunks, job.inputs, frontmatter)
  } catch (assembleErr) {
    // Multi-city's accommodation-by-city matching (see assembleResult's own
    // comment) throws rather than silently shipping a trip missing lodging
    // for one of its cities — same failure-not-silent-corruption stance as
    // assertChunksIntegrity right above. Single-city's assembleResult path
    // never throws, so this is a new, multi-city-only failure mode in
    // practice.
    console.error('[worker] assembleResult failed:', assembleErr)
    await admin
      .from('generation_jobs')
      .update({ status: 'failed', error: `assembly: ${String(assembleErr).slice(0, 500)}` })
      .eq('id', job.id)
    return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'assembly' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  // ── CRÍTICA rule enforcement — blocking ──────────────────────────────────
  // The system prompt's one CRÍTICA rule (generate-trip/index.ts's
  // "REGLA DE ALOJAMIENTO") requires non-empty accommodations for any
  // overnight trip. Confirmed via a live test (2026-09-23) that the model
  // can silently violate this — chunk 0 returned accommodations: [] on a
  // real 6-night trip despite the LODGING block being correctly present in
  // its prompt. That must never reach a user as a "completed" trip again:
  // fail the job here, same as any other generation failure, rather than
  // shipping a trip with no lodging recommendation.
  const nights = expectedDays > 0 ? expectedDays - 1 : 0
  if (nights > 0 && (!Array.isArray(result.accommodations) || result.accommodations.length === 0)) {
    console.error('[worker] CRITICA violation: nights > 0 but accommodations is empty', { job_id: job.id, nights })
    await admin
      .from('generation_jobs')
      .update({ status: 'failed', error: `CRITICA violation: nights=${nights} but accommodations is empty` })
      .eq('id', job.id)
    return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'accommodations_check' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  // ── Duplicate-venue detection + repair — last resort, not job failure ──
  // Confirmed live 2026-09-25, twice: (1) skeleton assigns named venues but
  // the model can still miss the no-reuse instruction on an unassigned
  // slot (breakfast wasn't covered until a second fix); (2) failing the
  // WHOLE job on any duplicate blocked 20% of a 10-city test — too blunt
  // for a product requirement of near-zero failures. Regenerate just the
  // offending block(s) instead, with the full used-venue list as context
  // so the replacement can't collide either; only fail the job if repair
  // itself can't produce something clean within a small, bounded number of
  // passes. hotel/transfer blocks are excluded from detection — a hotel
  // legitimately recurring (check-in day 1, mentioned again on checkout)
  // isn't a content bug, nor is "traslado al aeropuerto" repeating.
  const MAX_REPAIR_PASSES = 3
  for (let pass = 0; pass < MAX_REPAIR_PASSES; pass++) {
    const dupes = findDuplicateVenueOccurrences(result.days ?? [])
    if (dupes.length === 0) break
    console.warn('[worker] duplicate venue(s) found, repairing:', { job_id: job.id, pass, titles: dupes.map(d => d.title) })

    for (const dupe of dupes) {
      const day = (result.days as any[])[dupe.dayIdx]
      const block = day.blocks[dupe.blockIdx]
      const avoid = allUsedVenueTitles(result.days)
      try {
        const ctrl = new AbortController()
        const t = setTimeout(() => ctrl.abort(), 20_000)
        const replacement = await regenerateDuplicateBlock(job.inputs, dupe.day_number, block, avoid, ctrl.signal, job.id)
        clearTimeout(t)
        block.title = replacement.title
        block.description = replacement.description
        if (replacement.neighborhood) block.neighborhood = replacement.neighborhood
      } catch (repairErr) {
        // Don't fail the pass over one bad repair call -- the next pass
        // (or the final remainingDupes check below) catches it either way.
        console.warn('[worker] block repair call failed:', dupe.title, repairErr)
      }
    }
  }

  const remainingDupes = findDuplicateVenueOccurrences(result.days ?? [])
  if (remainingDupes.length > 0) {
    console.error('[worker] duplicate venue(s) survived repair:', { job_id: job.id, titles: remainingDupes.map(d => d.title) })
    await admin
      .from('generation_jobs')
      .update({ status: 'failed', error: `duplicate venues survived repair: ${remainingDupes.map(d => d.title).join('; ')}`.slice(0, 500) })
      .eq('id', job.id)
    return new Response(JSON.stringify({ ok: false, status: 'failed', stage: 'duplicate_venue_repair_exhausted' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

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

  // Charge the credit here, on real success, not at job creation. Mirrors
  // the same tripId-ownership check app/api/trips/jobs/route.ts already
  // did at creation time to decide whether to skip the entitlement gate —
  // job.inputs carries that same tripId through unchanged, so re-checking
  // it here is consistent, not a second independent judgment call.
  const isRegeneration = typeof (job.inputs as any)?.tripId === 'string' && (job.inputs as any).tripId.length > 0
  if (!isRegeneration) {
    await consumeOneTripIfApplicable(admin, job.user_id, job.id)
  }

  console.log('[worker] completed job:', job.id, '→ trip:', tripRow.id)

  return new Response(JSON.stringify({ ok: true, status: 'completed', trip_id: tripRow.id }), {
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  })
})
