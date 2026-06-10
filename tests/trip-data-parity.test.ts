/**
 * tests/trip-data-parity.test.ts
 *
 * Web↔mobile data-parity contract. The desktop planner persists trip_data via a
 * WHOLESALE overwrite, so any field the mobile companion needs must be present
 * in the desktop bundle or it gets silently wiped on the next desktop save.
 * This locks that contract: buildPlannerTripData() must include every key in
 * MOBILE_REQUIRED_TRIP_DATA_KEYS, and pass values through unchanged.
 *
 * Run: npx tsx tests/trip-data-parity.test.ts  (exit 0 all-pass, 1 on failure)
 *
 * If this fails, a desktop save just started dropping a field mobile reads —
 * exactly the class of bug that wiped currency. Do NOT "fix" it by deleting the
 * assertion; restore the field to buildPlannerTripData (lib/planner/persist).
 */

import { buildPlannerTripData, MOBILE_REQUIRED_TRIP_DATA_KEYS } from '../lib/planner/persist'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function check(name: string, pass: boolean, detail?: string) { results.push({ name, pass, detail }) }
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  check(name, pass, pass ? undefined : `got ${JSON.stringify(got)} want ${JSON.stringify(expected)}`)
}

const sample = {
  title: 'Trip',
  subtitle: 'Subtitle',
  days: [{ n: 1, title: 'Arrival', items: [{ id: 'i1', name: 'Mercado' }] }],
  packing: ['socks', 'passport'],
  budgetRows: [{ id: 'b1', label: 'Hotel', aiEst: 1000, userEst: 800, actual: 950 }],
  doneChecks: ['check-i1', 'pretrip-pack'],
  segments: [{ destination: 'CDMX', startDate: '2026-01-01', endDate: '2026-01-03', nights: 2 }],
  accommodations: [{ id: 'acc-0', city: 'CDMX', booking: { confirmed: true, code: 'BK-1' } }],
}

const bundle = buildPlannerTripData(sample)

// ── Contract: every mobile-required key survives the wholesale save ──
for (const key of MOBILE_REQUIRED_TRIP_DATA_KEYS) {
  check(`desktop bundle includes mobile-required key "${key}"`,
    key in bundle && bundle[key] !== undefined,
    `bundle keys: ${JSON.stringify(Object.keys(bundle))}`)
}

// ── Values pass through unchanged (no transformation / loss) ──
expectEq('days pass through untouched', bundle.days, sample.days)
expectEq('packing passes through untouched', bundle.packing, sample.packing)
expectEq('budgetRows pass through (preserves userEst/actual the mobile view writes)',
  bundle.budgetRows, sample.budgetRows)
expectEq('accommodations pass through (preserves the "Ya reservé" booking)',
  bundle.accommodations, sample.accommodations)
expectEq('doneChecks pass through (mobile + desktop share these)',
  bundle.doneChecks, sample.doneChecks)
expectEq('segments pass through when present (multi-city)', bundle.segments, sample.segments)

// ── Empty segments are omitted (single-city trips don't carry an empty array) ──
const single = buildPlannerTripData({ ...sample, segments: [] })
expectEq('empty segments omitted', single.segments, undefined)
check('single-city bundle still includes all other mobile-required keys',
  MOBILE_REQUIRED_TRIP_DATA_KEYS.filter(k => k !== 'segments').every(k => k in single && single[k] !== undefined),
  `single keys: ${JSON.stringify(Object.keys(single))}`)

// ── currency is intentionally NOT in the trip_data bundle (top-level column) ──
check('currency is NOT in the trip_data bundle (desktop writes it top-level; mobile reads top-level)',
  !('currency' in bundle),
  `bundle keys: ${JSON.stringify(Object.keys(bundle))}`)

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
const failures = results.filter(r => !r.pass)
console.log(`\ntrip-data-parity: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failures.length) {
  for (const f of failures) console.log(`  ✗ ${f.name}${f.detail ? `\n      ${f.detail}` : ''}`)
  console.log()
  process.exit(1)
}
process.exit(0)
