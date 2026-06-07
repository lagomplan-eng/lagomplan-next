/**
 * tests/mobile-view.test.ts
 *
 * Unit suite for lib/planner/mobile-view — the pure helpers extracted from
 * MobileTripClient (today-day detection + traveler-count parsing). Covers
 * QA cases U-11..U-18. Framework-free, same pattern as the other suites.
 *
 *   npx tsx tests/mobile-view.test.ts
 */

import { getTodayDayIndex, parsePeopleCount } from '../lib/planner/mobile-view'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}

// ───────── getTodayDayIndex (U-11..U-15) ─────────
const START = '2026-04-12'      // 3-day trip → dayCount 3

expectEq('U-11: today == start → day 0, isToday',
  getTodayDayIndex(START, 3, new Date('2026-04-12T09:00:00')),
  { dayIndex: 0, isToday: true })

expectEq('U-12: today == start+1 → day 1, isToday',
  getTodayDayIndex(START, 3, new Date('2026-04-13T23:30:00')),
  { dayIndex: 1, isToday: true })

expectEq('U-13: before the trip → clamp day 0, not today',
  getTodayDayIndex(START, 3, new Date('2026-04-01T12:00:00')),
  { dayIndex: 0, isToday: false })

expectEq('U-14: after the trip → clamp last day, not today',
  getTodayDayIndex(START, 3, new Date('2026-04-20T12:00:00')),
  { dayIndex: 2, isToday: false })

expectEq('U-15: late-evening local time on start day stays day 0 (no off-by-one)',
  getTodayDayIndex(START, 3, new Date('2026-04-12T23:59:00')),
  { dayIndex: 0, isToday: true })

expectEq('U-15b: 7-day trip mid-trip → correct index',
  getTodayDayIndex('2026-04-12', 7, new Date('2026-04-16T08:00:00')),
  { dayIndex: 4, isToday: true })

expectEq('U-15c: no derivable start → day 0, not today',
  getTodayDayIndex(null, 3, new Date('2026-04-13T08:00:00')),
  { dayIndex: 0, isToday: false })

expectEq('U-15d: dayCount 0 → day 0, not today (no crash)',
  getTodayDayIndex(START, 0, new Date('2026-04-13T08:00:00')),
  { dayIndex: 0, isToday: false })

// ───────── parsePeopleCount (U-16..U-18) ─────────
expectEq('U-16a: pareja → 2', parsePeopleCount('pareja'), 2)
expectEq('U-16b: couple → 2', parsePeopleCount('couple'), 2)
expectEq('U-16c: numeric "3" → 3', parsePeopleCount('3'), 3)
expectEq('U-17a: familia → 4', parsePeopleCount('familia'), 4)
expectEq('U-17b: family → 4', parsePeopleCount('family'), 4)
expectEq('U-17c: solo → 1', parsePeopleCount('solo'), 1)
expectEq('U-18a: unknown → default 2', parsePeopleCount('whatever'), 2)
expectEq('U-18b: empty → default 2 (never 0)', parsePeopleCount(''), 2)
expectEq('U-18c: null → default 2 (never 0)', parsePeopleCount(null), 2)

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\nmobile-view: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)
