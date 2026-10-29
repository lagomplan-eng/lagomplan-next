/**
 * tests/agenda-logic.test.ts — the agenda's date/filter rules (America/Mexico_City),
 * environment gating, month membership, category mix, summary line, ES/EN parity
 * of the section's strings, and the agenda:check script.
 *   npx tsx tests/agenda-logic.test.ts
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { loadAgenda } from '../content/guia/agenda'
import { AGENDA_COPY } from '../content/guia/agenda/copy'
import {
  MIN_CATEGORIES, addMonths, categoriesInFirst, mexicoToday, mixByCategory, monthBounds, monthPlans, monthTabLabel,
  plural, shortMonth, summaryLine, touchesMonth, visibleEvents,
} from '../content/guia/agenda/logic'

let failed = 0
const eq = (name: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) { failed++; console.error(`FAIL ${name}\n   got:  ${JSON.stringify(got)}\n   want: ${JSON.stringify(want)}`) }
}
const agenda = loadAgenda()
const ids = (list: any[]) => list.map((e) => e.id as string)

// ── "today" is the calendar date in America/Mexico_City (UTC−6, no DST) ──
eq('midnight boundary: 05:59:59Z is still Oct 31 in CDMX', mexicoToday(new Date('2026-11-01T05:59:59Z')), '2026-10-31')
eq('midnight boundary: 06:00:00Z is Nov 1 in CDMX', mexicoToday(new Date('2026-11-01T06:00:00Z')), '2026-11-01')
eq('noon in CDMX', mexicoToday(new Date('2026-10-28T18:00:00Z')), '2026-10-28')
eq('no DST in summer (UTC−6 all year)', mexicoToday(new Date('2026-07-01T05:30:00Z')), '2026-06-30')
eq('year boundary', mexicoToday(new Date('2027-01-01T05:59:00Z')), '2026-12-31')

// ── month arithmetic ──
eq('addMonths wraps the year', [addMonths('2026-12', 1), addMonths('2026-01', -1), addMonths('2026-10', 1)], ['2027-01', '2025-12', '2026-11'])
eq('monthBounds', [monthBounds('2026-10'), monthBounds('2026-02'), monthBounds('2028-02').last], [{ first: '2026-10-01', last: '2026-10-31' }, { first: '2026-02-01', last: '2026-02-28' }, '2028-02-29'])

// ── expired events are hidden; today's still shows ──
const ev = (start: string, end: string, extra: object = {}) => ({ id: `${start}_${end}`, category: 'food' as const, start, end, status: 'verified' as const, ...extra }) as any
eq('ended yesterday → hidden', visibleEvents([ev('2026-10-20', '2026-10-27')], '2026-10-28', true).length, 0)
eq('ends today → still visible', visibleEvents([ev('2026-10-20', '2026-10-28')], '2026-10-28', true).length, 1)
eq('seed on Nov 3: the Oct 29–Nov 2 events are gone, El Camino (to Nov 8) stays', ids(visibleEvents(agenda.events, '2026-11-03', true)).filter((i) => ['cacao-para-todos', 'gp-mexico-f1', 'ofrenda-monumental-zocalo', 'feria-no-estaban-muertos', 'el-camino-reforma'].includes(i)), ['el-camino-reforma'])
eq('seed on Dec 1: only the Nov 29 race is gone too → nothing left', visibleEvents(agenda.events, '2026-12-01', true).length, 0)

// ── environment gating: Production = verified only; Preview/local also to_verify ──
eq('Production shows verified only', ids(visibleEvents(agenda.events, '2026-10-28', false)), ['gp-mexico-f1'])
eq('Preview/local shows all 10', visibleEvents(agenda.events, '2026-10-28', true).length, 10)
eq('an unverified event never leaks into Production', visibleEvents([ev('2026-10-30', '2026-10-31', { status: 'to_verify' })], '2026-10-28', false).length, 0)

// ── an event belongs to every month it touches ──
eq('Oct 29–Nov 2 touches both months', [touchesMonth({ start: '2026-10-29', end: '2026-11-02' }, '2026-10'), touchesMonth({ start: '2026-10-29', end: '2026-11-02' }, '2026-11')], [true, true])
eq('single day only touches its month', [touchesMonth({ start: '2026-10-31', end: '2026-10-31' }, '2026-10'), touchesMonth({ start: '2026-10-31', end: '2026-10-31' }, '2026-11')], [true, false])
eq('Oct 31 → Nov 1 touches both (edge)', [touchesMonth({ start: '2026-10-31', end: '2026-11-01' }, '2026-10'), touchesMonth({ start: '2026-10-31', end: '2026-11-01' }, '2026-11')], [true, true])
eq('a November event is not in October', touchesMonth({ start: '2026-11-07', end: '2026-11-07' }, '2026-10'), false)

// ── month plans on the seed (Wed 28 Oct 2026) ──
const T = '2026-10-28'
const oct = monthPlans(agenda, '2026-10', T, true); const nov = monthPlans(agenda, '2026-11', T, true)
eq('Oct (Preview): 6 plans, the parade is featured, 5 cards', [oct.total, oct.featured?.id, oct.compact.length], [6, 'desfile-dia-de-muertos', 5])
eq('Nov (Preview): 9 plans (the 5 that cross + 4 of its own), no featured', [nov.total, nov.featured, nov.compact.length], [9, null, 9])
eq('Production Oct/Nov: just the F1 weekend, not featured', [monthPlans(agenda, '2026-10', T, false), monthPlans(agenda, '2026-11', T, false)].map((m) => [m.total, m.featured, ids(m.compact)]), [[1, null, ['gp-mexico-f1']], [1, null, ['gp-mexico-f1']]])
eq('Dec: empty month', monthPlans(agenda, '2026-12', T, true).total, 0)
eq('only ONE featured even if two are flagged (the first one)', (() => { const m = monthPlans({ events: [ev('2026-10-30', '2026-10-30', { id: 'a', featured: true }), ev('2026-10-30', '2026-10-30', { id: 'b', featured: true })] }, '2026-10', T, true); return [m.featured?.id, ids(m.compact), m.total] })(), ['a', ['b'], 2])

// ── the first 4 cards mix categories ──
eq('mixByCategory is a round-robin and stable inside a category', ids(mixByCategory([
  { id: 'c1', category: 'culture' }, { id: 'c2', category: 'culture' }, { id: 'f1', category: 'food' }, { id: 's1', category: 'sport' }, { id: 'o1', category: 'outdoors' }, { id: 'f2', category: 'food' },
] as any)), ['f1', 's1', 'o1', 'c1', 'f2', 'c2'])
eq('Oct first 4 cards (Preview) → ≥ 3 categories', [categoriesInFirst(oct.compact), categoriesInFirst(oct.compact) >= MIN_CATEGORIES], [3, true])
eq('Nov first 4 cards (Preview) → all 4 categories', categoriesInFirst(nov.compact), 4)
eq('category-mix warning fires when a month is all one category', categoriesInFirst(mixByCategory([{ category: 'culture' }, { category: 'culture' }, { category: 'culture' }, { category: 'culture' }] as any)) < MIN_CATEGORIES, true)
eq('mixing never drops or duplicates an event', ids(nov.compact).sort(), ids(agenda.events.filter((e) => touchesMonth(e, '2026-11'))).sort())

// ── labels ──
eq('tab labels', [monthTabLabel('2026-10', 'es'), monthTabLabel('2026-11', 'en'), monthTabLabel('2026-12', 'es')], ['Octubre', 'November', 'Diciembre'])
eq('short months', [shortMonth('2026-10-29', 'es'), shortMonth('2026-11-01', 'en'), shortMonth('2026-03-05', 'es')], ['OCT', 'NOV', 'MAR'])
eq('plural', [plural(1, 'plan', 'planes'), plural(0, 'plan', 'planes'), plural(6, 'plan', 'planes')], ['plan', 'planes', 'planes'])
eq('summary line ES', summaryLine(oct, nov, 'es', AGENDA_COPY.es), 'OCTUBRE · 6 PLANES · NOVIEMBRE · 9 PLANES')
eq('summary line EN', summaryLine(oct, nov, 'en', AGENDA_COPY.en), 'OCTOBER · 6 PLANS · NOVEMBER · 9 PLANS')
eq('summary line, singular + Production', summaryLine(monthPlans(agenda, '2026-10', T, false), monthPlans(agenda, '2026-11', T, false), 'es', AGENDA_COPY.es), 'OCTUBRE · 1 PLAN · NOVIEMBRE · 1 PLAN')

// ── ES / EN parity ──
eq('copy: ES and EN have exactly the same keys', Object.keys(AGENDA_COPY.es).sort(), Object.keys(AGENDA_COPY.en).sort())
eq('copy: no empty string in either language', Object.entries(AGENDA_COPY).flatMap(([l, c]) => Object.entries(c).filter(([, v]) => !String(v).trim()).map(([k]) => `${l}.${k}`)), [])
eq('copy: "see all" keeps its {n} in both', [AGENDA_COPY.es.showAll.includes('{n}'), AGENDA_COPY.en.showAll.includes('{n}')], [true, true])
eq('copy: the placeholder strings are bracketed in both languages', (['photo', 'toConfirm', 'link', 'hostPickMissing'] as const).every((k) => /^\[.+\]$/.test(AGENDA_COPY.es[k]) && /^\[.+\]$/.test(AGENDA_COPY.en[k])), true)
eq('copy: Spanish strings are not English leftovers', (['title', 'subtitle', 'open', 'tabAlways', 'tabTrips', 'emptyTitle'] as const).filter((k) => AGENDA_COPY.es[k] === AGENDA_COPY.en[k]), [])
eq('data: every bilingual field differs or is a proper name — never missing', agenda.events.every((e) => ['title', 'place', 'why', 'hours', 'dateLabel'].every((f) => (e as any)[f].es && (e as any)[f].en)), true)
eq('data: every "[placeholder]" in ES has its EN twin (and vice versa)', agenda.events.flatMap((e) => ['place', 'hours', 'cost', 'why', 'title'].filter((f) => (e as any)[f] && /\[/.test((e as any)[f].es) !== /\[/.test((e as any)[f].en)).map((f) => `${e.id}.${f}`)), [])

// ── agenda:check ──
{
  const r = spawnSync('npx', ['tsx', 'scripts/agenda-check.ts', '--today', '2026-10-28'], { encoding: 'utf8' })
  eq('agenda:check exits 0 on the seed', r.status, 0)
  eq('agenda:check lists the 9 to_verify events', /to_verify \(9\)/.test(r.stdout), true)
  eq('agenda:check lists the verified one', /verified \(1\)/.test(r.stdout) && r.stdout.includes('gp-mexico-f1'), true)
  eq('agenda:check reports no category-mix warning on the seed', r.stdout.includes('no mix warnings'), true)
  // A verified event that is still current but was verified > 14 days ago must be flagged for re-verification.
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'agenda-check-')), 'agenda.json')
  const stale = JSON.parse(fs.readFileSync('content/guia/cdmx/agenda.json', 'utf8'))
  stale.events.find((e: any) => e.id === 'gp-mexico-f1').end = '2026-12-31'
  fs.writeFileSync(tmp, JSON.stringify(stale))
  const later = spawnSync('npx', ['tsx', 'scripts/agenda-check.ts', '--today', '2026-11-20'], { encoding: 'utf8', env: { ...process.env, AGENDA_FILE: tmp } })
  eq('agenda:check flags a verification older than 14 days', /verified more than 14 days ago: 1/.test(later.stdout) && later.stdout.includes('re-verify'), true)
  const fresh = spawnSync('npx', ['tsx', 'scripts/agenda-check.ts', '--today', '2026-11-03'], { encoding: 'utf8', env: { ...process.env, AGENDA_FILE: tmp } })
  eq('…but not at 12 days', /verified more than 14 days ago: none/.test(fresh.stdout), true)
  const broken = JSON.parse(JSON.stringify(stale)); broken.events[0].category = 'nope'
  fs.writeFileSync(tmp, JSON.stringify(broken))
  const bad = spawnSync('npx', ['tsx', 'scripts/agenda-check.ts'], { encoding: 'utf8', env: { ...process.env, AGENDA_FILE: tmp } })
  eq('agenda:check fails (exit 1) and names the problem when the file is invalid', [bad.status, /events\[0\]\.category/.test(bad.stderr)], [1, true])
}

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('agenda-logic: all passed')
