/**
 * tests/readiness.test.ts
 *
 * Unit suite for lib/planner/readiness.computeTripReadiness — the shared
 * trip-readiness summary used by the /my-trips cards (reuses the same
 * deriveChecksFromDays + selectNextCheck primitives as the planner/mobile).
 * Framework-free; `npx tsx tests/readiness.test.ts`.
 */

import { computeTripReadiness } from '../lib/planner/readiness'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}
function expectTrue(name: string, got: boolean, detail?: string) {
  results.push({ name, pass: got, detail: got ? undefined : (detail ?? 'expected true') })
}

// 3-day CDMX trip: tour + restaurant per day → per-day checks; plus pre-trip
// checks (book-hotel + pack/docs/offline/devices). Mirrors TRIP_ANONYMOUS.
const tripData = {
  days: [
    { n: 1, label: 'DÍA 01', title: 'A', items: [
      { id: 'i0', type: 'tour',       name: 'Zócalo',   time: '16:00' },
      { id: 'i1', type: 'restaurant', name: 'Cardenal', time: '21:00' },
    ]},
    { n: 2, label: 'DÍA 02', title: 'B', items: [
      { id: 'i2', type: 'restaurant', name: 'Contramar', time: '13:30' },
    ]},
  ],
  accommodations: [{ id: 'acc-0', city: 'Mexico City', checkInDate: '2026-04-12', checkOutDate: '2026-04-15', nights: 3 }],
  doneChecks: ['pretrip-book-hotel', 'check-i2'],
}

const r = computeTripReadiness(tripData, 'es')

expectTrue('RD-01: total counts derived checks (>0)', r.total > 0, `total=${r.total}`)
expectEq('RD-02: done counts the two done checks', r.done, 2)
expectEq('RD-03: pct = round(done/total*100)', r.pct, Math.round((2 / r.total) * 100))
expectTrue('RD-04: not ready (steps remain)', r.ready === false)
expectTrue('RD-05: surfaces a next incomplete step', r.nextCheck !== null, JSON.stringify(r.nextCheck))
expectTrue('RD-06: next step is NOT an already-done check',
  r.nextCheck ? !['pretrip-book-hotel', 'check-i2'].includes(r.nextCheck.id) : false,
  JSON.stringify(r.nextCheck))

// All done → ready, no next step
const doneAll = {
  ...tripData,
  doneChecks: ['pretrip-book-hotel', 'pretrip-pack', 'pretrip-documents', 'pretrip-offline', 'pretrip-devices', 'check-i0', 'check-i1', 'check-i2'],
}
const rd = computeTripReadiness(doneAll, 'es')
expectEq('RD-07: all checks done → 100%', rd.pct, 100)
expectTrue('RD-08: all done → ready + no next step', rd.ready === true && rd.nextCheck === null)

// Empty / malformed input → safe 0% summary, never throws
expectEq('RD-09: empty trip_data → 0/0', computeTripReadiness({}, 'es'), { pct: 0, done: 0, total: 0, nextCheck: null, ready: false })
expectEq('RD-10: null trip_data → 0/0 (no throw)', computeTripReadiness(null, 'en').total, 0)

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\nreadiness: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)
