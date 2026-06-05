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

import { normalizeTripProgress, sanitizeAnnotation } from '../lib/planner/progress'
import { deriveChecksFromDays, type Day } from '../lib/planner/checks'

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
