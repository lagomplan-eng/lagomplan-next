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
  addDays, coversEveryNight, daysBetween, highlightId, mexicoToday, monthRows, monthTabs, stayTabRows, stayWindow,
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

// ── stay tabs: "Your stay" + checkout month + the following month ──
const stay = stayWindow({ arrival: '2026-10-30', nights: 4 }, T) // Fri Oct 30 → Tue Nov 3 (checkout)
const cx = (showUnverified: boolean, lang: 'es' | 'en' = 'es', today = T) => ({ lang, today, showUnverified })
const tabP = stayTabRows(agenda, stay, cx(false)) // Production
const tabV = stayTabRows(agenda, stay, cx(true)) // Preview
eq('covers every night: start ≤ arrival and end ≥ the night before check-out', [
  coversEveryNight({ start: '2026-10-23', end: '2026-11-08' }, stay), // El Camino
  coversEveryNight({ start: '2026-10-29', end: '2026-11-02' }, stay), // ends on the last night (Nov 2)
  coversEveryNight({ start: '2026-10-29', end: '2026-11-01' }, stay), // misses the Nov 2 night
  coversEveryNight({ start: '2026-10-31', end: '2026-11-08' }, stay), // starts after arrival
], [true, true, false, false])
eq('Your stay (Production): the featured parade first, then the dated events by start', tabP.rows.map((r) => r.id), ['desfile-dia-de-muertos', 'cacao-para-todos', 'gp-mexico-f1'])
eq('Your stay: "All through your stay" = the events that cover every night, as title · area lines', tabP.allThrough.map((l) => `${l.title} · ${l.area}`), [
  'Ofrenda monumental del Zócalo · Centro Histórico',
  'Feria «No estaban muertos, andaban de parranda» · Museo Nacional de Culturas Populares, Coyoacán',
  'El Camino · iluminación de Día de Muertos · Paseo de la Reforma',
  'La Puerta entre dos mundos · Bosque de Chapultepec, 2ª sección',
  'Iluminación del Zócalo y el Centro Histórico · Zócalo y Centro Histórico',
])
eq('Your stay: the "highlight of your stay" label is on the featured row only', tabP.rows.filter((r) => r.meta.includes('lo más grande de tu estancia')).map((r) => r.id), ['desfile-dia-de-muertos'])
eq('Your stay: multi-day events keep their own dates; single day = "SÁB 31"', tabP.rows.map((r) => r.dateLabel), ['SÁB 31', '29 OCT – 1 NOV', '30 OCT – 1 NOV'])
eq('Your stay: dated rows are sorted by start (after the featured one)', tabP.rows.slice(1).every((r, i, a) => i === 0 || a[i - 1].date <= r.date), true)
eq('Your stay: the event shows once — in the rows OR in the group, never both', (() => { const ids = [...tabV.rows.map((r) => r.id), ...tabV.allThrough.map((l) => l.id)]; return new Set(ids).size === ids.length })(), true)
eq('Your stay: recurring items never appear (rows or group)', [...tabV.rows.map((r) => r.id), ...tabV.allThrough.map((l) => l.id)].some((id) => agenda.recurring.some((r) => id.startsWith(r.id))), false)
eq('Your stay: only events that overlap the stay', tabV.rows.concat().every((r) => agenda.events.find((e) => e.id === r.id)!.start <= stay.end && agenda.events.find((e) => e.id === r.id)!.end >= stay.start), true)
eq('Your stay (Preview): to_verify events carry the flag; Production has none', [tabV.rows.some((r) => r.toVerify) || tabV.allThrough.some((l) => l.toVerify), tabP.rows.some((r) => r.toVerify) || tabP.allThrough.some((l) => l.toVerify)], [false, false])
eq('Your stay: a featured event that spans the whole stay still goes first, not into the group', (() => { const a = { events: agenda.events.filter((e) => e.id !== 'desfile-dia-de-muertos').map((e) => (e.id === 'el-camino-reforma' ? { ...e, featured: true } : e)) }; const t = stayTabRows(a, stay, cx(false)); return [t.rows[0].id, t.allThrough.some((l) => l.id === 'el-camino-reforma')] })(), ['el-camino-reforma', false])
eq('Your stay: no events at all → empty rows and no group', stayTabRows({ events: [] }, stay, cx(false)), { rows: [], allThrough: [] })
eq('Your stay (English): same ids in the same order as Spanish', stayTabRows(agenda, stay, cx(true, 'en')).rows.map((r) => r.id), tabV.rows.map((r) => r.id))
eq('Your stay (English): highlight label', stayTabRows(agenda, stay, cx(false, 'en')).rows[0].meta.endsWith('· the highlight of your stay'), true)
eq('Your stay: a no-params stay (today … +13) works the same way', stayTabRows(agenda, stayWindow({}, T), cx(false)).rows.map((r) => r.id).includes('desfile-dia-de-muertos'), true)

// ── "Every week in the city": its own group, never rows of a tab ──
eq('weekly group: all four recurring items (the sunset viewpoint included)', weeklyCards(agenda, 'es').map((w) => w.id), ['muevete-en-bici', 'lucha-libre-arena-mexico', 'bazar-sabado-san-angel', 'mirador-torre-latinoamericana'])
eq('weekly group (English): card = when_label + title + one line', weeklyCards(agenda, 'en')[0], { id: 'muevete-en-bici', when: 'Sundays · 8am–2pm', title: 'Muévete en Bici, Reforma', line: 'Reforma closes to cars for cyclists, runners and free bike loans.' })
eq('weekly group: no Spanish label in the English cards (days, "Noche", "Cada…")', weeklyCards(agenda, 'en').flatMap((w) => [w.when, w.line]).some((t) => /Domingos|Martes|Sábados|Al atardecer|Cada |Noche|cierra|Arte y/.test(t)), false)
eq('weekly group: ES and EN differ for every card (translated, not copied)', weeklyCards(agenda, 'es').every((w, i) => w.when !== weeklyCards(agenda, 'en')[i].when && w.line !== weeklyCards(agenda, 'en')[i].line), true)
eq('recurring items are in no tab: not in the stay rows/group nor in any month tab (ES and EN, Preview)', (['es', 'en'] as const).every((l) => { const ids = [...stayTabRows(agenda, stay, cx(true, l)).rows.map((r) => r.id), ...stayTabRows(agenda, stay, cx(true, l)).allThrough.map((x) => x.id), ...monthTabs(agenda, stay, cx(true, l)).flatMap((m) => m.rows.map((r) => r.id))]; return !ids.some((id) => agenda.recurring.some((r) => id.startsWith(r.id))) }), true)

// ── month tabs ──
const mP = monthTabs(agenda, stay, cx(false)), mV = monthTabs(agenda, stay, cx(true))
eq('month tabs: checkout month (Nov); Dec has no event → hidden (Production and Preview)', [mP.map((m) => m.label), mV.map((m) => m.label)], [['Noviembre'], ['Noviembre']])
eq('month tabs: labels in English', monthTabs(agenda, stay, cx(true, 'en')).map((m) => m.label), ['November'])
eq('month tabs: a month with events shows (checkout Oct 31 → Oct + Nov)', monthTabs(agenda, stayWindow({ arrival: '2026-10-29', nights: 2 }, T), cx(true)).map((m) => m.label), ['Octubre', 'Noviembre'])
eq('month tabs: checkout in Dec → the next month is Jan (year rollover) and is hidden when empty', monthTabs(agenda, { start: '2026-12-09', end: '2026-12-10' }, cx(true, 'es', '2026-12-01')).map((m) => m.label), [])
const nov = mP[0].rows, novV = mV[0].rows
eq('November (Production): sorted by start, each event once', [nov.map((r) => r.id), new Set(nov.map((r) => r.id)).size === nov.length], [['el-camino-reforma', 'cacao-para-todos', 'ofrenda-monumental-zocalo', 'feria-no-estaban-muertos', 'festival-chapultepec-dia-de-muertos', 'iluminacion-zocalo', 'gp-mexico-f1', 'nba-mexico-city-game', 'karol-g', 'puente-de-la-revolucion', 'corona-capital'], true])
eq('November (Preview): the researched, unverified events are in, also sorted by start', [novV.length, novV.every((r, i) => i === 0 || novV[i - 1].date <= r.date), novV.filter((r) => r.toVerify).length], [21 - 0, true, 10])
eq('November: compact rows = date range + title + category only (no venue line)', nov.find((r) => r.id === 'karol-g')!.meta, 'Música')
eq('November: date ranges', nov.map((r) => r.dateLabel), ['23 OCT – 8 NOV', '29 OCT – 1 NOV', '29 OCT – 2 NOV', '29 OCT – 2 NOV', '29 OCT – 4 NOV', '29 OCT – 4 NOV', '30 OCT – 1 NOV', 'SÁB 7 NOV', 'VIE 13 NOV', '14 – 16 NOV', '20 – 22 NOV'])
eq('November: "after your stay" only on events that start after check-out (Nov 3)', nov.filter((r) => r.afterStay).map((r) => r.id), ['nba-mexico-city-game', 'karol-g', 'puente-de-la-revolucion', 'corona-capital'])
eq('November: recurring items never appear', novV.some((r) => agenda.recurring.some((x) => r.id.startsWith(x.id))), false)
eq('month rule: events that end before max(today, check-in) are not listed (stay Nov 20–23, today Nov 1)', monthRows(agenda, { start: '2026-11-20', end: '2026-11-23' }, '2026-11', cx(true, 'es', '2026-11-01')).map((r) => r.id), ['corona-capital', 'time-warp-mexico', 'nfl-mexico-city-game', 'flow-fest', 'carrera-del-ring'])
eq('month rule: …so neither the parade nor the Ofrenda are there', monthRows(agenda, { start: '2026-11-20', end: '2026-11-23' }, '2026-11', cx(true, 'es', '2026-11-01')).some((r) => ['desfile-dia-de-muertos', 'ofrenda-monumental-zocalo'].includes(r.id)), false)
eq('month rule: events already over today are hidden (Nov 3)', monthRows(agenda, { start: '2026-11-03', end: '2026-11-05' }, '2026-11', cx(true, 'es', '2026-11-03')).some((r) => ['cacao-para-todos', 'ofrenda-monumental-zocalo'].includes(r.id)), false)
eq('Production gating: a month tab only ever holds verified events', visibleEvents(agenda.events, T, false).every((e) => e.status === 'verified') && nov.every((r) => agenda.events.find((e) => e.id === r.id)!.status === 'verified'), true)
eq('no event renders twice in any tab (stay, months) in Preview, ES and EN', (['es', 'en'] as const).every((l) => { const t = stayTabRows(agenda, stay, cx(true, l)); const ids = [...t.rows.map((r) => r.id), ...t.allThrough.map((x) => x.id)]; return new Set(ids).size === ids.length && monthTabs(agenda, stay, cx(true, l)).every((m) => new Set(m.rows.map((r) => r.id)).size === m.rows.length) }), true)
eq('highlight: the first featured event of the stay', highlightId(agenda, stay, T, false), 'desfile-dia-de-muertos')
eq('highlight: none when the stay has no featured event', highlightId(agenda, { start: '2026-11-02', end: '2026-11-12' }, T, true), null)
eq('highlight: a stay with only Corona Capital highlights it', highlightId(agenda, { start: '2026-11-18', end: '2026-11-24' }, T, true), 'corona-capital')
// time ordering helper
eq('timeRank handles 24h, ranges, am/pm and unknowns', [timeRank('14:00'), timeRank('10–19 h'), timeRank('2 pm'), timeRank('8am–2pm'), timeRank('12 am'), timeRank('Noche'), timeRank(null)].map((n) => n), [840, 600, 840, 480, 0, 1441, 1441])

// ── ES / EN parity ──
eq('copy: the weekly group title (ES, EN)', [AGENDA_COPY.es.weeklyTitle, AGENDA_COPY.en.weeklyTitle], ['Cada semana en la ciudad', 'Every week in the city'])
eq('copy: tab / group / tag strings (ES, EN)', [AGENDA_COPY.es.tabStay, AGENDA_COPY.en.tabStay, AGENDA_COPY.es.allThrough, AGENDA_COPY.en.allThrough, AGENDA_COPY.es.afterStay, AGENDA_COPY.en.afterStay, AGENDA_COPY.es.seeAll, AGENDA_COPY.en.seeAll], ['Tu estancia', 'Your stay', 'Durante toda tu estancia', 'All through your stay', 'después de tu estancia', 'after your stay', 'Ver todos los {n} →', 'See all {n} →'])
eq('copy: the removed "coming up" button leaves no string', ['ahead' in AGENDA_COPY.es, 'ahead' in AGENDA_COPY.en], [false, false])
eq('copy: ES and EN have exactly the same keys', Object.keys(AGENDA_COPY.es).sort(), Object.keys(AGENDA_COPY.en).sort())
eq('copy: no empty string in either language', Object.entries(AGENDA_COPY).flatMap(([l, c]) => Object.entries(c).filter(([, v]) => !String(v).replace(/,/g, '').trim()).map(([k]) => `${l}.${k}`)), [])
eq('copy: weekday and month lists have 7 / 12 entries in both languages', (['es', 'en'] as const).map((l) => [AGENDA_COPY[l].weekdays.length, AGENDA_COPY[l].weekdaysShort.length, AGENDA_COPY[l].monthsShort.length]), [[7, 7, 12], [7, 7, 12]])
eq('copy: the brief\'s exact strings', [AGENDA_COPY.es.subtitle, AGENDA_COPY.en.subtitle, AGENDA_COPY.es.trips, AGENDA_COPY.en.trips, AGENDA_COPY.es.quietTitle, AGENDA_COPY.en.quietTitle, AGENDA_COPY.es.highlight, AGENDA_COPY.en.highlight],
  ['Lo que pasa en la ciudad durante tu estancia.', "What's happening in the city during your stay.", 'Escapadas de un día →', 'Day trips →', 'Días tranquilos en la ciudad', 'Quiet days in the city', 'lo más grande de tu estancia', 'the highlight of your stay'])
eq('copy: the neutral pill names no operator', [AGENDA_COPY.es.toConfirm, AGENDA_COPY.en.toConfirm], ['Por confirmar', 'To confirm'])
eq('data: every event and recurring item has both languages', [...agenda.events.map((e) => e.title), ...agenda.recurring.map((r) => r.title), ...agenda.recurring.map((r) => r.when_label), ...agenda.recurring.map((r) => r.line)].every((t) => t.es && t.en), true)
eq('data: every event with a time has it in both languages', agenda.events.filter((e) => e.time).every((e) => e.time!.es && e.time!.en), true)

// ── agenda:check ──
{
  const run = (extra: string[], env: Record<string, string> = {}) => spawnSync('npx', ['tsx', 'scripts/agenda-check.ts', ...extra], { encoding: 'utf8', env: { ...process.env, ...env } })
  const r = run(['--today', T])
  eq('agenda:check exits 0 on the seed', r.status, 0)
  eq('agenda:check lists the 10 to_verify events and the 12 verified', /to_verify \(10\)/.test(r.stdout) && /verified \(12\)/.test(r.stdout) && r.stdout.includes('gp-mexico-f1'), true)
  eq('agenda:check reports no leftover placeholders', r.stdout.includes('left in any string: none'), true)
  eq('agenda:check lists the recurring items and the viewpoint that has no weekdays', r.stdout.includes('mirador-torre-latinoamericana') && r.stdout.includes('no weekdays'), true)
  eq('agenda:check flags the month with no verified event', /Production hides this month tab/.test(r.stdout), true)
  eq('agenda:check flags the event with no link', r.stdout.includes('puente-de-la-revolucion') && r.stdout.includes('not tappable'), true)
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'agenda-check-')), 'agenda.json')
  const stale = JSON.parse(fs.readFileSync('content/guia/cdmx/agenda.json', 'utf8'))
  stale.events.find((e: any) => e.id === 'gp-mexico-f1').end = '2026-12-31'
  fs.writeFileSync(tmp, JSON.stringify(stale))
  const later = run(['--today', '2026-11-20'], { AGENDA_FILE: tmp })
  eq('agenda:check flags a verification older than 14 days', /verified more than 14 days ago: \d+/.test(later.stdout) && /gp-mexico-f1 \(verified 2026-10-22, 29 days ago\)/.test(later.stdout) && later.stdout.includes('re-verify'), true)
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
