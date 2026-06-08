/**
 * tests/progress.test.ts
 *
 * Smoke + regression suite for the mobile companion view's pure logic:
 *   - lib/planner/progress: normalizeTripProgress / sanitizeAnnotation
 *     (the trip_progress contract — sanitizes notes/links, drops junk).
 *   - lib/planner/checks: deriveChecksFromDays (shared check derivation,
 *     extracted from TripResult) produces stable per-day check IDs.
 *
 * Framework-free, same pattern as booking.test.ts. Run with:
 *   npx tsx tests/progress.test.ts
 * Exit 0 on all-pass, 1 if anything failed.
 */

import { normalizeTripProgress, sanitizeAnnotation, coerceCurrency } from '../lib/planner/progress'
import { deriveChecksFromDays, type Day } from '../lib/planner/checks'
import type { TripSegment } from '../lib/planner/segments'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []

function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({
    name,
    pass,
    detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`,
  })
}

// ───────── sanitizeAnnotation ─────────

expectEq('keeps trimmed note + valid https link',
  sanitizeAnnotation({ note: '  table on terrace  ', link: 'https://x.com/r' }),
  { note: 'table on terrace', link: 'https://x.com/r' })

expectEq('drops javascript: link (XSS guard), keeps note',
  sanitizeAnnotation({ note: 'hi', link: 'javascript:alert(1)' }),
  { note: 'hi' })

expectEq('empty note + no link → null (caller drops it)',
  sanitizeAnnotation({ note: '   ', link: '' }),
  null)

expectEq('non-object → null',
  sanitizeAnnotation('nope'),
  null)

// ───────── normalizeTripProgress ─────────

expectEq('garbage input → empty progress',
  normalizeTripProgress(null),
  { annotations: {}, packedItems: [] })

expectEq('dedupes + filters packedItems, drops bad indices',
  normalizeTripProgress({ packedItems: [0, 0, 2, -1, 'x', 3.5, 5] }).packedItems,
  [0, 2, 5])

expectEq('drops malformed annotation entries',
  normalizeTripProgress({
    annotations: {
      'item-1': { note: 'keep' },
      'item-2': { note: '   ' },                 // empty → dropped
      'item-3': { link: 'data:text/html,evil' }, // bad scheme → dropped
    },
  }).annotations,
  { 'item-1': { note: 'keep' } })

expectEq('caps note length at 500',
  (normalizeTripProgress({ annotations: { a: { note: 'x'.repeat(800) } } }).annotations.a.note ?? '').length,
  500)

// ───────── deriveChecksFromDays ─────────

const days: Day[] = [
  { n: 1, label: 'Day 1', title: 'Arrival', progress: 0, items: [
    { id: 'i1', type: 'restaurant', time: '20:00', name: 'El Cardenal', desc: '' },
  ] },
  { n: 2, label: 'Day 2', title: 'Explore', progress: 0, items: [
    { id: 'i2', type: 'tour', time: '10:00', name: 'Frida Kahlo', desc: '' },
    { id: 'i3', type: 'free', time: '16:00', name: 'Walk', desc: '' },
  ] },
]

const checks = deriveChecksFromDays(days, { locale: 'en' })

expectEq('restaurant item yields a stable per-day check id',
  checks.some(c => c.id === 'check-i1' && c.day === 1),
  true)

expectEq('tour item yields a per-day check on its day',
  checks.some(c => c.id === 'check-i2' && c.day === 2),
  true)

expectEq('free item yields no check',
  checks.some(c => c.id === 'check-i3'),
  false)

expectEq('multi-day trip injects the pre-trip "book hotel" check',
  checks.some(c => c.id === 'pretrip-book-hotel'),
  true)

// U-09 — multi-city injects one `pretrip-book-hotel-seg-N` per segment
// (and NOT the single-city `pretrip-book-hotel`).
const segments: TripSegment[] = [
  { destination: 'Mexico City', startDate: '2026-04-12', endDate: '2026-04-14', nights: 2 },
  { destination: 'Oaxaca',      startDate: '2026-04-14', endDate: '2026-04-17', nights: 3 },
]
const multiCityChecks = deriveChecksFromDays(days, { locale: 'en', segments })

expectEq('U-09 multi-city injects one pretrip-book-hotel-seg-N per segment',
  segments.map((_, i) => multiCityChecks.some(c => c.id === `pretrip-book-hotel-seg-${i}`)),
  [true, true])

expectEq('U-09 multi-city does NOT inject the single-city pretrip-book-hotel',
  multiCityChecks.some(c => c.id === 'pretrip-book-hotel'),
  false)

// U-10 — single-day trip injects NO pre-trip checks (the `days.length > 1`
// guard). Only per-day item checks survive.
const singleDay: Day[] = [
  { n: 1, label: 'Day 1', title: 'Day trip', progress: 0, items: [
    { id: 's1', type: 'restaurant', time: '13:00', name: 'Contramar', desc: '' },
  ] },
]
const singleDayChecks = deriveChecksFromDays(singleDay, { locale: 'en' })

expectEq('U-10 single-day trip injects no pre-trip checks',
  singleDayChecks.some(c => c.id.startsWith('pretrip-')),
  false)

expectEq('U-10 single-day trip still derives its per-day item check',
  singleDayChecks.some(c => c.id === 'check-s1' && c.day === 1),
  true)

// ───────── coerceCurrency (companion currency persistence) ─────────
// U-23: valid enums pass through; U-24: everything else → null so the
// endpoint ignores it (never a 400) and leaves currency untouched.
expectEq('U-23a coerceCurrency keeps MXN', coerceCurrency('MXN'), 'MXN')
expectEq('U-23b coerceCurrency keeps USD', coerceCurrency('USD'), 'USD')
expectEq('U-24a coerceCurrency rejects lowercase', coerceCurrency('usd'), null)
expectEq('U-24b coerceCurrency rejects unknown code', coerceCurrency('EUR'), null)
expectEq('U-24c coerceCurrency rejects empty string', coerceCurrency(''), null)
expectEq('U-24d coerceCurrency rejects null/number/object',
  [coerceCurrency(null), coerceCurrency(2), coerceCurrency({})],
  [null, null, null])

// ───────── tally + exit ─────────

const passed = results.filter(r => r.pass).length
const failed = results.length - passed
const failures = results.filter(r => !r.pass)

console.log(`\nprogress: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failures.length) {
  for (const f of failures) {
    console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  }
  console.log()
  process.exit(1)
}
process.exit(0)
