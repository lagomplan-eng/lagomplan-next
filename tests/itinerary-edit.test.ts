/**
 * tests/itinerary-edit.test.ts
 *
 * Smoke + regression suite for lib/planner/itinerary-edit — the sanitizer that
 * guards the mobile inline itinerary editor's write into trip_data.days. Same
 * framework-free pattern as booking.test.ts. Run with:
 *
 *   npx tsx tests/itinerary-edit.test.ts
 *
 * Exit code 0 on all-pass, 1 if anything failed.
 *
 * The invariant under test is the wholesale-overwrite trap: the editor only
 * touches text fields, so the sanitizer MUST preserve every other field —
 * especially item `id` (done-checks are keyed `check-${item.id}`) and
 * price/affiliate/bookingOptions/type — while clamping lengths and capping
 * counts against a tampered payload.
 */

import {
  sanitizeItineraryDays,
  MAX_DAYS,
  MAX_ITEMS_PER_DAY,
  MAX_TITLE_LEN,
  MAX_TIME_LEN,
} from '../lib/planner/itinerary-edit'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []

function check(name: string, pass: boolean, detail?: string) {
  results.push({ name, pass, detail })
}
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  check(name, pass, pass ? undefined : `got ${JSON.stringify(got)} want ${JSON.stringify(expected)}`)
}

// ── non-array → null (caller 400s) ──
expectEq('null input → null', sanitizeItineraryDays(null), null)
expectEq('object input → null', sanitizeItineraryDays({ days: [] }), null)
expectEq('string input → null', sanitizeItineraryDays('nope'), null)
expectEq('empty array → []', sanitizeItineraryDays([]), [])

// ── preserves id + unmodeled fields, edits text ──
{
  const input = [{
    n: 1,
    label: 'Día 1',
    title: 'Llegada',
    progress: 0,
    items: [{
      id: 'item-abc',
      type: 'food',
      time: '09:00',
      name: 'Mercado',
      desc: 'Desayuno',
      price: '$$',
      affiliate: 'https://x.stay22.com/lagomplan/Z',
      bookingOptions: [{ id: 'o1', provider: 'booking', name: 'B', desc: '', url: 'u' }],
    }],
  }]
  const out = sanitizeItineraryDays(input)!
  const item = out[0].items as Record<string, unknown>[]
  check('preserves item.id (done-checks stay matched)', item[0].id === 'item-abc', `id=${item[0].id}`)
  check('preserves item.type', item[0].type === 'food')
  check('preserves item.price', item[0].price === '$$')
  check('preserves item.affiliate', item[0].affiliate === 'https://x.stay22.com/lagomplan/Z')
  check('preserves item.bookingOptions', Array.isArray(item[0].bookingOptions) && (item[0].bookingOptions as unknown[]).length === 1)
  check('preserves day.n', out[0].n === 1)
  check('preserves day.progress', out[0].progress === 0)
}

// ── edits flow through (changed text is kept) ──
{
  const out = sanitizeItineraryDays([{
    title: '  Nuevo título  ',
    items: [{ id: 'i1', name: '  Renombrada  ', desc: 'd', time: '10:30' }],
  }])!
  expectEq('day title trimmed', out[0].title, 'Nuevo título')
  expectEq('item name trimmed', (out[0].items as any)[0].name, 'Renombrada')
  expectEq('item time kept', (out[0].items as any)[0].time, '10:30')
}

// ── clamps overlong strings ──
{
  const longName = 'x'.repeat(MAX_TITLE_LEN + 50)
  const longTime = 't'.repeat(MAX_TIME_LEN + 10)
  const out = sanitizeItineraryDays([{ title: longName, items: [{ id: 'i', name: longName, time: longTime, desc: 'd' }] }])!
  check('day title clamped to MAX_TITLE_LEN', (out[0].title as string).length === MAX_TITLE_LEN)
  check('item name clamped to MAX_TITLE_LEN', ((out[0].items as any)[0].name as string).length === MAX_TITLE_LEN)
  check('item time clamped to MAX_TIME_LEN', ((out[0].items as any)[0].time as string).length === MAX_TIME_LEN)
}

// ── non-string text → '' ──
{
  const out = sanitizeItineraryDays([{ title: 42, items: [{ id: 'i', name: null, desc: undefined, time: {} }] }])!
  expectEq('non-string day title → ""', out[0].title, '')
  expectEq('non-string item name → ""', (out[0].items as any)[0].name, '')
  expectEq('non-string item desc → ""', (out[0].items as any)[0].desc, '')
}

// ── caps counts against tampering ──
{
  const manyDays = Array.from({ length: MAX_DAYS + 20 }, (_, i) => ({ title: `D${i}`, items: [] }))
  expectEq('day count capped at MAX_DAYS', sanitizeItineraryDays(manyDays)!.length, MAX_DAYS)

  const manyItems = [{ title: 'D', items: Array.from({ length: MAX_ITEMS_PER_DAY + 20 }, (_, i) => ({ id: `i${i}`, name: 'n', desc: '', time: '' })) }]
  expectEq('item count capped at MAX_ITEMS_PER_DAY', (sanitizeItineraryDays(manyItems)![0].items as unknown[]).length, MAX_ITEMS_PER_DAY)
}

// ── tolerates malformed days/items ──
{
  const out = sanitizeItineraryDays([null, 'str', { items: [null, 7, { id: 'ok', name: 'n', desc: '', time: '' }] }])!
  check('malformed days tolerated (3 entries)', out.length === 3)
  check('malformed items tolerated (3 entries)', (out[2].items as unknown[]).length === 3)
  check('valid nested item still preserved', (out[2].items as any)[2].id === 'ok')
}

// ── days with non-array items → empty items ──
expectEq('non-array items → []', (sanitizeItineraryDays([{ title: 'd', items: 'nope' }])![0].items as unknown[]), [])

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
const failures = results.filter(r => !r.pass)

console.log(`\nitinerary-edit: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failures.length) {
  for (const f of failures) console.log(`  ✗ ${f.name}${f.detail ? `\n      ${f.detail}` : ''}`)
  console.log()
  process.exit(1)
}
process.exit(0)
