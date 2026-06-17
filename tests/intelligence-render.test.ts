/**
 * tests/intelligence-render.test.ts
 *
 * Verifies that lib/intelligence produces REAL (non-trivial) output from a
 * realistic trip_data shape — the data the planner's DayFlow / HotelFit /
 * Callout badges render. This is the regression guard behind PLAN-09
 * ("intelligence badges actually render"): the engine is wired in TripResult
 * and now also fed by GET (fallback) + PATCH (recompute), so the value it
 * returns must be a populated TripIntelligence, not the empty error-fallback.
 *
 * Framework-free, same pattern as the other suites.
 *   npx tsx tests/intelligence-render.test.ts
 */

import { computeTripIntelligence } from '../lib/intelligence'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}
function expectTrue(name: string, got: boolean, detail?: string) {
  results.push({ name, pass: got, detail: got ? undefined : (detail ?? 'expected true') })
}

// Realistic CDMX trip: Polanco base, a compact day, then a spread-out day
// (Centro → Xochimilco → Coyoacán) that exercises the coordinate table.
const trip = {
  duration_days: 2,
  walking_tolerance: 'medium' as const,
  accommodations: [{ city: 'Mexico City', neighborhood: 'Polanco' }],
  days: [
    {
      day_number: 1,
      title: 'Polanco y Condesa',
      blocks: [
        { time: '10:00', title: 'Museo Soumaya', neighborhood: 'Polanco',  type: 'sightseeing' },
        { time: '13:30', title: 'Comida',        neighborhood: 'Condesa',  type: 'restaurant'  },
        { time: '17:00', title: 'Parque México', neighborhood: 'Condesa',  type: 'sightseeing' },
      ],
    },
    {
      day_number: 2,
      title: 'Centro, Xochimilco y Coyoacán',
      blocks: [
        { time: '09:00', title: 'Centro Histórico', neighborhood: 'Centro Historico', type: 'sightseeing' },
        { time: '13:00', title: 'Trajineras',       neighborhood: 'Xochimilco',       type: 'tour'        },
        { time: '18:00', title: 'Coyoacán',         neighborhood: 'Coyoacan',         type: 'sightseeing' },
      ],
    },
  ],
}

const intel = computeTripIntelligence(trip)

// ── Not the empty error-fallback ──────────────────────────────────────────────
expectEq('INT-01: computes one DayIntelligence per day', intel.days.length, 2)

// ── day_number aligns with the planner's lookup key (days.find(d.day_number === day.n)) ──
expectEq('INT-02: day_number preserved + ordered', intel.days.map(d => d.day_number), [1, 2])

// ── Labels are the real qualitative enum (what the badge renders) ──────────────
const DAY_LABELS = ['Fluido', 'Manejable', 'Pesado']
expectTrue('INT-03: each day has a valid flow label',
  intel.days.every(d => DAY_LABELS.includes(d.day_label)),
  `got ${JSON.stringify(intel.days.map(d => d.day_label))}`)

// ── Hotel-fit produces a real label (HotelFitBadge input) ─────────────────────
const HOTEL_LABELS = ['Base ideal', 'Funcional', 'Alejado']
expectTrue('INT-04: hotel_fit has a valid label',
  !!intel.hotel_fit && HOTEL_LABELS.includes(intel.hotel_fit.label),
  `got ${JSON.stringify(intel.hotel_fit)}`)

// ── Coordinate table actually ran — the spread day has real distance/movement ──
const spreadDay = intel.days[1]
expectTrue('INT-05: spread day has computed walking/transit (coords resolved)',
  (spreadDay.estimated_walking_min > 0) || (spreadDay.estimated_transit_segments > 0),
  `walking=${spreadDay.estimated_walking_min} transit=${spreadDay.estimated_transit_segments}`)

// ── Empty input → minimal-but-valid (never throws; badges hide) ────────────────
const empty = computeTripIntelligence({ days: [], accommodations: [] })
expectEq('INT-06: empty trip → no day intelligence (badges hide gracefully)', empty.days.length, 0)

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\nintelligence-render: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)
