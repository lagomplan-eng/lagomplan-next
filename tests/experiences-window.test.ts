/**
 * tests/experiences-window.test.ts — run: npx tsx tests/experiences-window.test.ts
 *
 * GuideMeta.hubWindow: a recurring annual MM-DD window (Mexico City time) that keeps a guide's
 * experiences and destination off the Experiencias hub outside the window. Guides without a
 * window behave exactly as before.
 */
import { getDestinations, getExperiences } from '../lib/experiences'
import { isInHubWindow, mexicoMonthDay } from '../lib/experiences/window'
import { GUIDE_META } from '../lib/data/guides'
import { getPlanCatalog } from '../lib/plan-catalog'

let pass = 0, fail = 0
function eq(a: unknown, b: unknown, msg: string) {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++
  else { fail++; console.error(`FAIL ${msg}\n  got      ${JSON.stringify(a)}\n  expected ${JSON.stringify(b)}`) }
}
const ok = (c: boolean, msg: string) => eq(c, true, msg)

// ── pure window logic ─────────────────────────────────────────────────────────
const dm = { from: '09-15', until: '11-02' }
eq(isInHubWindow(undefined, '06-01'), true, 'no window: always in')
eq(isInHubWindow(undefined, '12-31'), true, 'no window: always in (year end)')
eq(isInHubWindow(dm, '10-20'), true, 'in window: mid')
eq(isInHubWindow(dm, '09-15'), true, 'in window: from is inclusive')
eq(isInHubWindow(dm, '11-02'), true, 'in window: until is inclusive')
eq(isInHubWindow(dm, '09-14'), false, 'out of window: day before from')
eq(isInHubWindow(dm, '11-03'), false, 'out of window: day after until')
eq(isInHubWindow(dm, '01-01'), false, 'out of window: January')
eq(isInHubWindow(dm, '07-04'), false, 'out of window: summer')

const wrap = { from: '11-15', until: '01-10' } // crosses the year end
eq(isInHubWindow(wrap, '11-15'), true, 'wrap: from inclusive')
eq(isInHubWindow(wrap, '12-25'), true, 'wrap: December')
eq(isInHubWindow(wrap, '12-31'), true, 'wrap: last day of the year')
eq(isInHubWindow(wrap, '01-01'), true, 'wrap: first day of the year')
eq(isInHubWindow(wrap, '01-10'), true, 'wrap: until inclusive')
eq(isInHubWindow(wrap, '01-11'), false, 'wrap: day after until')
eq(isInHubWindow(wrap, '06-01'), false, 'wrap: mid year')
eq(isInHubWindow(wrap, '11-14'), false, 'wrap: day before from')
eq(isInHubWindow({ from: '12-24', until: '12-24' }, '12-24'), true, 'single-day window: that day')
eq(isInHubWindow({ from: '12-24', until: '12-24' }, '12-25'), false, 'single-day window: next day')

// ── Mexico City time, not UTC and not the server's zone ───────────────────────
eq(mexicoMonthDay(new Date('2026-11-03T05:30:00Z')), '11-02', 'Nov 2 23:30 in Mexico City (05:30Z) is still Nov 2')
eq(mexicoMonthDay(new Date('2026-11-03T06:30:00Z')), '11-03', 'Nov 3 00:30 in Mexico City (06:30Z) is Nov 3')
eq(mexicoMonthDay(new Date('2026-09-15T05:59:00Z')), '09-14', 'Sep 14 23:59 in Mexico City (05:59Z) is Sep 14')

// ── real registry: Día de Muertos has the window, Houston does not ─────────────
const DDM = 'dia-de-muertos-cdmx-patzcuaro'
eq(GUIDE_META[DDM].hubWindow, { from: '09-15', until: '11-02' }, 'GUIDE_META: Día de Muertos window')
eq(GUIDE_META['houston'].hubWindow, undefined, 'GUIDE_META: Houston has no window')
eq(Object.entries(GUIDE_META).filter(([, m]) => m.hubWindow).map(([k]) => k), [DDM], 'GUIDE_META: only Día de Muertos has a window')

const inWin = new Date('2026-10-20T18:00:00Z')
const outWin = new Date('2026-11-09T18:00:00Z')
const all = getExperiences('es', { ignoreWindow: true })
for (const loc of ['es', 'en'] as const) {
  const inE = getExperiences(loc, { now: inWin }), outE = getExperiences(loc, { now: outWin })
  const ddmIn = inE.filter(e => e.destinationSlug === DDM), ddmOut = outE.filter(e => e.destinationSlug === DDM)
  eq(ddmIn.length, 3, `${loc}: in window → 3 Día de Muertos experiences`)
  eq(ddmOut.length, 0, `${loc}: out of window → none`)
  eq(inE.length, all.length, `${loc}: in window the hub equals the unwindowed list`)
  eq(outE.length, all.length - 3, `${loc}: out of window the hub is exactly 3 smaller`)
  eq(outE.map(e => e.id), inE.filter(e => e.destinationSlug !== DDM).map(e => e.id), `${loc}: everything else untouched, same order`)
  eq(outE.filter(e => e.destinationSlug === 'houston').length, 2, `${loc}: Houston (no window) stays on the hub out of window`)
  // editorial order is a property of the registry, not of the window
  eq(outE.map(e => e.order), inE.filter(e => e.destinationSlug !== DDM).map(e => e.order), `${loc}: order values do not shift when a guide leaves`)

  const dIn = getDestinations(loc, { now: inWin }), dOut = getDestinations(loc, { now: outWin })
  ok(dIn.some(d => d.slug === DDM && d.bookable === 3), `${loc}: in window → destination listed with 3 bookable`)
  ok(!dOut.some(d => d.slug === DDM), `${loc}: out of window → destination not listed`)
  eq(dOut.length, dIn.length - 1, `${loc}: only that destination disappears`)
  eq(getDestinations(loc, { now: outWin, ignoreWindow: true }).length, dIn.length, `${loc}: ignoreWindow lists every destination`)
}

// boundaries through the real clock path
eq(getExperiences('es', { now: new Date('2026-11-03T05:30:00Z') }).some(e => e.destinationSlug === DDM), true, 'Nov 2 23:30 Mexico City: still on the hub')
eq(getExperiences('es', { now: new Date('2026-11-03T06:30:00Z') }).some(e => e.destinationSlug === DDM), false, 'Nov 3 00:30 Mexico City: gone')
eq(getExperiences('es', { now: new Date('2027-09-15T06:00:00Z') }).some(e => e.destinationSlug === DDM), true, 'Sep 15 next year: back, no deploy needed')
eq(getExperiences('es', { now: new Date('2027-09-14T20:00:00Z') }).some(e => e.destinationSlug === DDM), false, 'Sep 14: not yet')

// guides without a window: the default call equals ignoreWindow for every one of them
const otherSlugs = new Set(all.map(e => e.destinationSlug).filter(s => s !== DDM))
const dflt = getExperiences('es', { now: outWin }).filter(e => otherSlugs.has(e.destinationSlug))
eq(dflt.map(e => e.id), all.filter(e => otherSlugs.has(e.destinationSlug)).map(e => e.id), 'windowless guides behave exactly as before')

// ── saved plan keeps resolving after the window closes ────────────────────────
const plan = getPlanCatalog('es')   // real clock; today is outside the window in the default case too
ok(all.filter(e => e.destinationSlug === DDM).every(e => plan.some(p => p.type === 'experience' && p.id === e.id)),
   'plan catalog includes Día de Muertos experiences regardless of the window')
eq(plan.filter(p => p.type === 'experience').length, all.length, 'plan catalog = every bookable experience')

console.log(`${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
