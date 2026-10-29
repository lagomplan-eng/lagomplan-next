/**
 * tests/agenda-logic.test.ts — the stay-window agenda: the window (America/Mexico_City),
 * the Mon–Sun range split, the row list, recurring occurrences, "Más adelante", the
 * highlight, environment gating, ES/EN parity of every string, and agenda:check.
 *   npx tsx tests/agenda-logic.test.ts
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { loadAgenda } from '../content/guia/agenda'
import { AGENDA_COPY } from '../content/guia/agenda/copy'
import {
  addDays, aheadRows, daysBetween, formatRange, highlightId, mexicoToday, rowsForRange, splitRanges, stayWindow,
  timeRank, visibleEvents, weekdayOf, weeklyCards,
} from '../content/guia/agenda/logic'

let failed = 0
const eq = (name: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) { failed++; console.error(`FAIL ${name}\n   got:  ${JSON.stringify(got)}\n   want: ${JSON.stringify(want)}`) }
}
const agenda = loadAgenda()
const R = (start: string, end: string) => ({ start, end })
const show = (rs: { start: string; end: string }[]) => rs.map((r) => `${r.start}→${r.end}`)
const T = '2026-10-29' // Thursday

// ── "today" is the date in America/Mexico_City (UTC−6, no DST) ──
eq('today: 05:59:59Z is still Oct 31 in CDMX', mexicoToday(new Date('2026-11-01T05:59:59Z')), '2026-10-31')
eq('today: 06:00:00Z is Nov 1 in CDMX', mexicoToday(new Date('2026-11-01T06:00:00Z')), '2026-11-01')
eq('today: year boundary', mexicoToday(new Date('2027-01-01T05:59:00Z')), '2026-12-31')
eq('date helpers', [addDays('2026-10-30', 4), addDays('2026-12-30', 5), daysBetween('2026-10-30', '2026-11-03'), weekdayOf('2026-10-30'), weekdayOf('2026-11-01')], ['2026-11-03', '2027-01-04', 4, 5, 0])

// ── the stay window ──
eq('window: llegada + noches, check-out day included (Fri Oct 30 + 4 = Tue Nov 3)', stayWindow({ arrival: '2026-10-30', nights: 4 }, T), { start: '2026-10-30', end: '2026-11-03', fromLink: true })
eq('window: no params → today … today+13', stayWindow({}, T), { start: '2026-10-29', end: '2026-11-11', fromLink: false })
eq('window: llegada without noches → fallback', stayWindow({ arrival: '2026-10-30' }, T).fromLink, false)
eq('window: noches without llegada → fallback', stayWindow({ nights: 3 }, T).fromLink, false)
eq('window: entirely in the past → fallback', stayWindow({ arrival: '2026-10-20', nights: 3 }, T), { start: '2026-10-29', end: '2026-11-11', fromLink: false })
eq('window: ends today → still valid', stayWindow({ arrival: '2026-10-27', nights: 2 }, T), { start: '2026-10-27', end: '2026-10-29', fromLink: true })
eq('window: started already but not over → kept as given', stayWindow({ arrival: '2026-10-27', nights: 4 }, T), { start: '2026-10-27', end: '2026-10-31', fromLink: true })
eq('window: 60 nights', stayWindow({ arrival: '2026-11-01', nights: 60 }, T).end, '2026-12-31')

// ── range split: calendar weeks Mon–Sun, trimmed; only 1-day first/last pieces merge ──
eq('split: 1 night (Fri→Sat) = one range', show(splitRanges('2026-10-30', '2026-10-31')), ['2026-10-30→2026-10-31'])
eq('split: Fri Oct 30 → Tue Nov 3 = two ranges (the 2-day tail stays)', show(splitRanges('2026-10-30', '2026-11-03')), ['2026-10-30→2026-11-01', '2026-11-02→2026-11-03'])
eq('split: 7 nights Fri→Fri', show(splitRanges('2026-10-30', '2026-11-06')), ['2026-10-30→2026-11-01', '2026-11-02→2026-11-06'])
eq('split: 7 nights Mon→Mon merges the 1-day tail', show(splitRanges('2026-11-02', '2026-11-09')), ['2026-11-02→2026-11-09'])
eq('split: 29 nights, Nov 1 → Nov 30 = the four ranges of the brief', show(splitRanges('2026-11-01', '2026-11-30')), ['2026-11-01→2026-11-08', '2026-11-09→2026-11-15', '2026-11-16→2026-11-22', '2026-11-23→2026-11-30'])
eq('split: crossing a month', show(splitRanges('2026-10-28', '2026-11-05')), ['2026-10-28→2026-11-01', '2026-11-02→2026-11-05'])
eq('split: crossing a year (2-day tail stays)', show(splitRanges('2026-12-30', '2027-01-05')), ['2026-12-30→2027-01-03', '2027-01-04→2027-01-05'])
eq('split: crossing a year, one full week', show(splitRanges('2026-12-28', '2027-01-03')), ['2026-12-28→2027-01-03'])
eq('split: Sunday-only head merges forward', show(splitRanges('2026-11-01', '2026-11-04')), ['2026-11-01→2026-11-04'])
eq('split: 1-day head AND 1-day tail', show(splitRanges('2026-11-01', '2026-11-09')), ['2026-11-01→2026-11-09'])
eq('split: Sun→Mon (1 night) collapses to a single range', show(splitRanges('2026-11-01', '2026-11-02')), ['2026-11-01→2026-11-02'])
eq('split: fallback window today+13 (Thu Oct 29 → Wed Nov 11)', show(splitRanges('2026-10-29', '2026-11-11')), ['2026-10-29→2026-11-01', '2026-11-02→2026-11-08', '2026-11-09→2026-11-11'])
{ // property: every window is covered exactly once, in order, with no gaps and no 1-day edge piece
  let bad = 0
  for (let a = 0; a < 40; a++) for (const n of [1, 2, 3, 4, 5, 6, 7, 10, 14, 20, 29, 45, 60]) {
    const start = addDays('2026-10-25', a), end = addDays(start, n)
    const rs = splitRanges(start, end)
    const contiguous = rs.every((r, i) => (i === 0 ? r.start === start : r.start === addDays(rs[i - 1].end, 1)) && r.start <= r.end) && rs[rs.length - 1].end === end
    const noTinyEdge = rs.length === 1 || (daysBetween(rs[0].start, rs[0].end) > 0 && daysBetween(rs[rs.length - 1].start, rs[rs.length - 1].end) > 0)
    if (!contiguous || !noTinyEdge) bad++
  }
  eq('split: 520 windows are covered exactly once, no gaps, no 1-day edge pieces', bad, 0)
}

// ── labels: dates only, never "Semana 1" ──
eq('label ES: same month', formatRange(R('2026-11-02', '2026-11-03'), 'es'), '2 – 3 nov')
eq('label ES: two months', formatRange(R('2026-10-30', '2026-11-01'), 'es'), '30 oct – 1 nov')
eq('label EN: same month', formatRange(R('2026-11-02', '2026-11-03'), 'en'), 'Nov 2 – 3')
eq('label EN: two months', formatRange(R('2026-10-30', '2026-11-01'), 'en'), 'Oct 30 – Nov 1')
eq('label: across a year', formatRange(R('2026-12-30', '2027-01-03'), 'es'), '30 dic – 3 ene')
eq('label: a single day', [formatRange(R('2026-11-02', '2026-11-02'), 'es'), formatRange(R('2026-11-02', '2026-11-02'), 'en')], ['2 nov', 'Nov 2'])
eq('labels never say "semana"/"week"', ['es', 'en'].every((l) => splitRanges('2026-11-01', '2026-11-30').every((r) => !/semana|week/i.test(formatRange(r, l as 'es' | 'en')))), true)

// ── rows ──
const win = R('2026-10-30', '2026-11-03')
const ctx = (showUnverified: boolean, lang: 'es' | 'en' = 'es', w = win) => ({ lang, today: T, showUnverified, window: w })
const r1 = rowsForRange(agenda, R('2026-10-30', '2026-11-01'), ctx(true))
const r2 = rowsForRange(agenda, R('2026-11-02', '2026-11-03'), ctx(true))
eq('range 1 (Preview): 6 dated events overlapping + 3 weekly occurrences', [r1.filter((r) => r.kind === 'event').length, r1.filter((r) => r.kind === 'recurring').length], [6, 3])
eq('range 2 (Preview): the events that end Nov 2 + Tuesday lucha libre', r2.map((r) => r.id), ['cacao-para-todos', 'feria-no-estaban-muertos', 'ofrenda-monumental-zocalo', 'el-camino-reforma', 'lucha-libre-arena-mexico@2026-11-03'])
eq('overlap: an event ending the day before the range is not listed', rowsForRange(agenda, R('2026-11-02', '2026-11-03'), ctx(true)).some((r) => r.id === 'gp-mexico-f1'), false)
eq('overlap: an event starting the day after the range is not listed', rowsForRange(agenda, R('2026-10-30', '2026-10-30'), ctx(true)).some((r) => r.id === 'desfile-dia-de-muertos'), false)
eq('overlap: touching either edge counts', ['2026-10-31', '2026-10-30'].map((d) => rowsForRange(agenda, R(d, d), ctx(true)).some((r) => r.id === 'desfile-dia-de-muertos')), [true, false])
eq('sorted by date, then time: first rows of range 1', r1.slice(0, 5).map((r) => r.id), ['cacao-para-todos', 'feria-no-estaban-muertos', 'gp-mexico-f1', 'ofrenda-monumental-zocalo', 'el-camino-reforma'])
eq('sorted: dates never go backwards', r1.every((r, i) => i === 0 || r1[i - 1].date <= r.date), true)
eq('sorted: within a day, timed rows come before untimed ones', (() => { const rows = rowsForRange(agenda, R('2026-10-30', '2026-11-01'), ctx(true)).filter((r) => r.date === '2026-10-30'); return rows.map((r) => r.time) })(), ['10–19 h', '11–19 h', null, null, null, 'Noche'])
eq('left column: single day = "SÁB 31", multi-day clipped to the range = "30 – 1"', [r1.find((r) => r.id === 'desfile-dia-de-muertos')!.dateLabel, r1.find((r) => r.id === 'cacao-para-todos')!.dateLabel, r2.find((r) => r.id === 'cacao-para-todos')!.dateLabel], ['SÁB 31', '30 – 1', 'LUN 2'])
eq('left column: time under the date', [r1.find((r) => r.id === 'desfile-dia-de-muertos')!.time, r1.find((r) => r.id === 'gp-mexico-f1')!.time], ['14:00', null])
eq('right column: "Categoría · lugar"', r1.find((r) => r.id === 'gp-mexico-f1')!.meta, 'Deporte · Autódromo Hermanos Rodríguez')
eq('right column: an event with no venue shows only the category', rowsForRange(agenda, R('2026-11-14', '2026-11-16'), ctx(true, 'es', R('2026-11-13', '2026-11-16'))).find((r) => r.id === 'puente-de-la-revolucion')!.meta, 'Ciudad')
// recurring
eq('recurring: one row per occurrence (Sunday Nov 1)', r1.find((r) => r.id === 'muevete-en-bici@2026-11-01'), { id: 'muevete-en-bici@2026-11-01', kind: 'recurring', date: '2026-11-01', dateLabel: 'DOM 1', time: '8–14 h', title: 'Muévete en Bici, Reforma', meta: 'Cada domingo', url: null, toVerify: false, highlight: false })
eq('recurring: two weekdays = two rows (Tue and Fri)', rowsForRange(agenda, R('2026-11-02', '2026-11-08'), ctx(true)).filter((r) => r.id.startsWith('lucha')).map((r) => r.dateLabel), ['MAR 3', 'VIE 6'])
eq('recurring: lucha libre shows "Noche" / "Evening", never a clock time', [r1.find((r) => r.id.startsWith('lucha'))!.time, rowsForRange(agenda, R('2026-10-30', '2026-11-01'), ctx(true, 'en')).find((r) => r.id.startsWith('lucha'))!.time], ['Noche', 'Evening'])
eq('recurring: the sunset viewpoint is NEVER an occurrence, even over 60 days', rowsForRange(agenda, R('2026-11-01', '2026-12-31'), ctx(true, 'es', R('2026-11-01', '2026-12-31'))).some((r) => r.id.startsWith('mirador')), false)
eq('recurring: …but it is in the "Cada semana" row', weeklyCards(agenda, 'es').map((w) => w.id), ['muevete-en-bici', 'lucha-libre-arena-mexico', 'bazar-sabado-san-angel', 'mirador-torre-latinoamericana'])
eq('recurring: card = when_label + title + one line', weeklyCards(agenda, 'en')[0], { id: 'muevete-en-bici', when: 'Sundays · 8am–2pm', title: 'Muévete en Bici, Reforma', line: 'Reforma closes to cars for cyclists, runners and free bike loans.' })
// empty range
eq('empty range: Wed–Thu has no event and no weekly occurrence', rowsForRange(agenda, R('2026-12-09', '2026-12-10'), ctx(true, 'es', R('2026-12-09', '2026-12-10'))), [])
eq('NOT empty: Thu–Sun still has the Fri/Sat/Sun weekly things', rowsForRange(agenda, R('2026-12-10', '2026-12-13'), ctx(true, 'es', R('2026-12-10', '2026-12-13'))).map((r) => r.id), ['lucha-libre-arena-mexico@2026-12-11', 'bazar-sabado-san-angel@2026-12-12', 'muevete-en-bici@2026-12-13'])
// highlight
eq('highlight: the featured Desfile inside the stay', highlightId(agenda, win, T, true), 'desfile-dia-de-muertos')
eq('highlight: label is appended to its row only', [r1.find((r) => r.id === 'desfile-dia-de-muertos')!.meta, r1.filter((r) => r.highlight).length], ['Cultura · Paseo de la Reforma → Zócalo · lo más grande de tu estancia', 1])
eq('highlight EN label', rowsForRange(agenda, R('2026-10-30', '2026-11-01'), ctx(true, 'en')).find((r) => r.highlight)!.meta.endsWith('· the highlight of your stay'), true)
eq('highlight: with two featured events in the stay, only the FIRST by date', highlightId(agenda, R('2026-10-30', '2026-11-25'), T, true), 'desfile-dia-de-muertos')
eq('highlight: a stay with only Corona Capital highlights it', highlightId(agenda, R('2026-11-18', '2026-11-24'), T, true), 'corona-capital')
eq('highlight: none when the stay has no featured event', highlightId(agenda, R('2026-11-02', '2026-11-12'), T, true), null)
eq('highlight: a to_verify featured event is not a highlight in Production (it is hidden)', highlightId(agenda, win, T, false), null)
// environment gating
eq('Production: verified only → range 1 = F1 + 3 weekly, range 2 = 1 weekly', [rowsForRange(agenda, R('2026-10-30', '2026-11-01'), ctx(false)).map((r) => r.id), rowsForRange(agenda, R('2026-11-02', '2026-11-03'), ctx(false)).map((r) => r.id)], [['gp-mexico-f1', 'lucha-libre-arena-mexico@2026-10-30', 'bazar-sabado-san-angel@2026-10-31', 'muevete-en-bici@2026-11-01'], ['lucha-libre-arena-mexico@2026-11-03']])
eq('Production: nothing is flagged toVerify', [rowsForRange(agenda, R('2026-10-30', '2026-11-01'), ctx(false)).some((r) => r.toVerify), r1.filter((r) => r.toVerify).length], [false, 5])
eq('gating: an unverified event never leaks into Production', visibleEvents(agenda.events, T, false).map((e) => e.id), ['gp-mexico-f1'])
eq('expired events are hidden (Nov 3: the Oct 29–Nov 2 ones are gone)', rowsForRange(agenda, R('2026-11-03', '2026-11-08'), { lang: 'es', today: '2026-11-03', showUnverified: true, window: R('2026-11-03', '2026-11-08') }).filter((r) => r.kind === 'event').map((r) => r.id), ['el-camino-reforma', 'food-wine-mirando-al-sur', 'nba-mexico-city-game'])
// Más adelante
const ahead = aheadRows(agenda, win, { lang: 'es', today: T, showUnverified: true })
eq('ahead: events that START after the window ends, up to +30 days', ahead.map((r) => r.id), ['food-wine-mirando-al-sur', 'nba-mexico-city-game', 'karol-g', 'puente-de-la-revolucion', 'letape-cdmx', 'corona-capital', 'carrera-del-ring'])
eq('ahead: dates carry the month', ahead.map((r) => r.dateLabel), ['7 – 8 NOV', 'SÁB 7 NOV', 'VIE 13 NOV', '14 – 16 NOV', 'DOM 15 NOV', '20 – 22 NOV', 'DOM 29 NOV'])
eq('ahead: nothing already shown in the window is repeated', ahead.some((r) => ['desfile-dia-de-muertos', 'el-camino-reforma', 'cacao-para-todos'].includes(r.id)), false)
eq('ahead: stops at +30 days', aheadRows(agenda, R('2026-10-30', '2026-10-31'), { lang: 'es', today: T, showUnverified: true }).some((r) => r.id === 'carrera-del-ring'), true)
eq('ahead: …and not beyond (window ends Nov 1 → limit Dec 1 includes Nov 29, window ends Oct 1-2 would not)', aheadRows(agenda, R('2026-10-01', '2026-10-02'), { lang: 'es', today: '2026-10-01', showUnverified: true }).some((r) => r.id === 'carrera-del-ring'), false)
eq('ahead: empty (button hidden) for a stay that covers all of November', aheadRows(agenda, R('2026-11-01', '2026-11-30'), { lang: 'es', today: T, showUnverified: true }), [])
eq('ahead: empty in Production (nothing verified starts later)', aheadRows(agenda, win, { lang: 'es', today: T, showUnverified: false }), [])
// time ordering helper
eq('timeRank handles 24h, ranges, am/pm and unknowns', [timeRank('14:00'), timeRank('10–19 h'), timeRank('2 pm'), timeRank('8am–2pm'), timeRank('12 am'), timeRank('Noche'), timeRank(null)].map((n) => n), [840, 600, 840, 480, 0, 1441, 1441])
eq('EN and ES order the same rows the same way', ['es', 'en'].map((l) => rowsForRange(agenda, R('2026-10-30', '2026-11-01'), ctx(true, l as 'es' | 'en')).map((r) => r.id)).reduce((a, b) => (JSON.stringify(a) === JSON.stringify(b) ? a : ['MISMATCH'])).length > 1, true)

// ── ES / EN parity ──
eq('copy: ES and EN have exactly the same keys', Object.keys(AGENDA_COPY.es).sort(), Object.keys(AGENDA_COPY.en).sort())
eq('copy: no empty string in either language', Object.entries(AGENDA_COPY).flatMap(([l, c]) => Object.entries(c).filter(([, v]) => !String(v).replace(/,/g, '').trim()).map(([k]) => `${l}.${k}`)), [])
eq('copy: weekday and month lists have 7 / 12 entries in both languages', (['es', 'en'] as const).map((l) => [AGENDA_COPY[l].weekdays.length, AGENDA_COPY[l].weekdaysShort.length, AGENDA_COPY[l].monthsShort.length]), [[7, 7, 12], [7, 7, 12]])
eq('copy: the brief\'s exact strings', [AGENDA_COPY.es.subtitle, AGENDA_COPY.en.subtitle, AGENDA_COPY.es.weeklyTitle, AGENDA_COPY.en.weeklyTitle, AGENDA_COPY.es.ahead, AGENDA_COPY.en.ahead, AGENDA_COPY.es.trips, AGENDA_COPY.en.trips, AGENDA_COPY.es.quietTitle, AGENDA_COPY.en.quietTitle, AGENDA_COPY.es.highlight, AGENDA_COPY.en.highlight],
  ['Lo que pasa en la ciudad durante tu estancia.', "What's happening in the city during your stay.", 'Cada semana en la ciudad', 'Every week in the city', 'Más adelante →', 'Coming up →', 'Escapadas de un día →', 'Day trips →', 'Días tranquilos en la ciudad', 'Quiet days in the city', 'lo más grande de tu estancia', 'the highlight of your stay'])
eq('copy: the neutral pill names no operator', [AGENDA_COPY.es.toConfirm, AGENDA_COPY.en.toConfirm], ['Por confirmar', 'To confirm'])
eq('data: every event and recurring item has both languages', [...agenda.events.map((e) => e.title), ...agenda.recurring.map((r) => r.title), ...agenda.recurring.map((r) => r.when_label), ...agenda.recurring.map((r) => r.line)].every((t) => t.es && t.en), true)
eq('data: every event with a time has it in both languages', agenda.events.filter((e) => e.time).every((e) => e.time!.es && e.time!.en), true)

// ── agenda:check ──
{
  const run = (extra: string[], env: Record<string, string> = {}) => spawnSync('npx', ['tsx', 'scripts/agenda-check.ts', ...extra], { encoding: 'utf8', env: { ...process.env, ...env } })
  const r = run(['--today', T])
  eq('agenda:check exits 0 on the seed', r.status, 0)
  eq('agenda:check lists the 12 to_verify events and the 1 verified', /to_verify \(12\)/.test(r.stdout) && /verified \(1\)/.test(r.stdout) && r.stdout.includes('gp-mexico-f1'), true)
  eq('agenda:check reports no leftover placeholders', r.stdout.includes('left in any string: none'), true)
  eq('agenda:check lists the recurring items and the viewpoint that has no weekdays', r.stdout.includes('mirador-torre-latinoamericana') && r.stdout.includes('only in "Cada semana en la ciudad"'), true)
  eq('agenda:check flags the weeks with no verified event', /no verified event/.test(r.stdout), true)
  eq('agenda:check flags the event with no link', r.stdout.includes('puente-de-la-revolucion') && r.stdout.includes('not tappable'), true)
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'agenda-check-')), 'agenda.json')
  const stale = JSON.parse(fs.readFileSync('content/guia/cdmx/agenda.json', 'utf8'))
  stale.events.find((e: any) => e.id === 'gp-mexico-f1').end = '2026-12-31'
  fs.writeFileSync(tmp, JSON.stringify(stale))
  const later = run(['--today', '2026-11-20'], { AGENDA_FILE: tmp })
  eq('agenda:check flags a verification older than 14 days', /verified more than 14 days ago: 1/.test(later.stdout) && later.stdout.includes('re-verify'), true)
  const fresh = run(['--today', '2026-11-03'], { AGENDA_FILE: tmp })
  eq('…but not at 12 days', /verified more than 14 days ago: none/.test(fresh.stdout), true)
  stale.events[0].title.es = 'Mal [lugar]'
  fs.writeFileSync(tmp, JSON.stringify(stale))
  eq('agenda:check catches a placeholder in a string', /left in any string: 1/.test(run([], { AGENDA_FILE: tmp }).stdout), true)
  stale.events[0].category = 'nope'
  fs.writeFileSync(tmp, JSON.stringify(stale))
  const bad = run([], { AGENDA_FILE: tmp })
  eq('agenda:check fails (exit 1) and names the problem when the file is invalid', [bad.status, /events\[0\]\.category/.test(bad.stderr)], [1, true])
}

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('agenda-logic: all passed')
