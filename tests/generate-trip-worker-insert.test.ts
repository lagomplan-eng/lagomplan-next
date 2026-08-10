/**
 * tests/generate-trip-worker-insert.test.ts
 *
 * Regression suite for supabase/functions/generate-trip-worker/logic.ts —
 * normalizeJobInputsForTripsInsert(), the function that turns a
 * generation_jobs.inputs blob (the client's original async-generation
 * request, stored verbatim) into the columns the worker's `trips` insert
 * needs.
 *
 * Bug: `currency` was completely absent from this normalization. The
 * client payload always carries it (TripResult.tsx sends `currency` in
 * every generation payload, sync or async), and it genuinely lands in
 * job.inputs (app/api/trips/jobs/route.ts spreads the full body into
 * `inputs`) — but the worker's trips insert (generate-trip-worker/index.ts)
 * only ever read `travelers` and `travel_style` out of it. So every
 * async-generated trip (any authenticated user's trip over
 * ASYNC_THRESHOLD=5 days, or any multi-city trip) silently fell back to
 * the `currency` column's DB default, regardless of what the user actually
 * selected in the MXN/USD toggle. Not an AI-drift bug like the sync-path
 * currency issue — the app never even tried to save the user's choice.
 *
 * These tests start from a raw, client-shaped `jobInputs` object (using
 * the field names the client actually sends) so a regression in the
 * normalization — currency dropped again, or the travelers/travel_style
 * enum validation broken — fails the test, not just re-checks already
 * correct data.
 *
 * Run with:
 *
 *   npx tsx tests/generate-trip-worker-insert.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import { normalizeJobInputsForTripsInsert } from '../supabase/functions/generate-trip-worker/logic'

let passed = 0
let failed = 0
const failures: string[] = []

function check(label: string, got: unknown, expected: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(expected)
  if (ok) {
    passed++
  } else {
    failed++
    failures.push(`  ✗ ${label}\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(got)}`)
  }
}

// ── Currency: the bug this suite exists for ──────────────────────────────
check(
  'currency USD passes through',
  normalizeJobInputsForTripsInsert({ traveler: 'pareja', currency: 'USD' }).currency,
  'USD',
)
check(
  'currency MXN passes through',
  normalizeJobInputsForTripsInsert({ traveler: 'pareja', currency: 'MXN' }).currency,
  'MXN',
)
check(
  'currency omitted defaults to MXN (matches HeroForm client default)',
  normalizeJobInputsForTripsInsert({ traveler: 'pareja' }).currency,
  'MXN',
)
check(
  'currency invalid value falls back to MXN rather than passing through raw',
  normalizeJobInputsForTripsInsert({ traveler: 'pareja', currency: 'EUR' }).currency,
  'MXN',
)

// ── Travelers / travel_style: pre-existing behavior, guarded so this ─────
// ── refactor (inline logic -> shared logic.ts) didn't change it ──────────
check(
  'valid traveler category passes through lowercased',
  normalizeJobInputsForTripsInsert({ traveler: 'Familia', currency: 'MXN' }).travelers,
  'familia',
)
check(
  'invalid traveler category becomes null (DB enum would reject it)',
  normalizeJobInputsForTripsInsert({ traveler: 'nomads', currency: 'MXN' }).travelers,
  null,
)
check(
  'missing traveler becomes null',
  normalizeJobInputsForTripsInsert({ currency: 'MXN' }).travelers,
  null,
)
check(
  'valid pace passes through lowercased',
  normalizeJobInputsForTripsInsert({ traveler: 'pareja', pace: 'Equilibrado', currency: 'MXN' }).travel_style,
  'equilibrado',
)
check(
  'invalid pace becomes null',
  normalizeJobInputsForTripsInsert({ traveler: 'pareja', pace: 'chill', currency: 'MXN' }).travel_style,
  null,
)

// ── Realistic full payloads, matching what TripResult.tsx actually sends ──
{
  const familiaMxnPayload = {
    destination: 'Oaxaca',
    traveler: 'familia',
    traveler_details: { adults: 2, children: [{ type: 'kid', age: '8' }] },
    pace: 'relajado',
    currency: 'MXN',
    nights: 7,
    duration_days: 8,
  }
  const normalized = normalizeJobInputsForTripsInsert(familiaMxnPayload)
  check('realistic familia/MXN payload: travelers', normalized.travelers, 'familia')
  check('realistic familia/MXN payload: travel_style', normalized.travel_style, 'relajado')
  check('realistic familia/MXN payload: currency', normalized.currency, 'MXN')
}
{
  const parejaUsdPayload = {
    destination: 'Torres del Paine',
    traveler: 'pareja',
    pace: 'activo',
    currency: 'USD',
    nights: 7,
    duration_days: 8,
  }
  const normalized = normalizeJobInputsForTripsInsert(parejaUsdPayload)
  check('realistic pareja/USD payload: travelers', normalized.travelers, 'pareja')
  check('realistic pareja/USD payload: travel_style', normalized.travel_style, 'activo')
  check('realistic pareja/USD payload: currency', normalized.currency, 'USD')
}

const total = passed + failed
console.log(`\ngenerate-trip-worker insert normalization: ${passed}/${total} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failures.length) {
  console.log(failures.join('\n\n'))
  console.log()
  process.exit(1)
}
process.exit(0)
