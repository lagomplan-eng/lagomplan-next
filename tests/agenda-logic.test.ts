/**
 * tests/agenda-logic.test.ts — the month-tab agenda: "today" (America/Mexico_City), the
 * current-month + next-month tabs, the row lists, the weekly group, environment gating,
 * ES/EN parity of every string, and agenda:check.
 *   npx tsx tests/agenda-logic.test.ts
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { loadAgenda } from '../content/guia/agenda'
import { AGENDA_COPY } from '../content/guia/agenda/copy'
import {
  addDays, daysBetween, mexicoToday, monthRows, monthTabs,
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
const N = '2026-11-05' // Thursday, Nov 5

// ── "today" is the date in America/Mexico_City (UTC−6, no DST) ──
eq('today: 05:59:59Z is still Oct 31 in CDMX', mexicoToday(new Date('2026-11-01T05:59:59Z')), '2026-10-31')
eq('today: 06:00:00Z is Nov 1 in CDMX', mexicoToday(new Date('2026-11-01T06:00:00Z')), '2026-11-01')
eq('today: year boundary', mexicoToday(new Date('2027-01-01T05:59:00Z')), '2026-12-31')
eq('date helpers', [addDays('2026-10-30', 4), addDays('2026-12-30', 5), daysBetween('2026-10-30', '2026-11-03'), weekdayOf('2026-10-30'), weekdayOf('2026-11-01')], ['2026-11-03', '2027-01-04', 4, 5, 0])

const cx = (showUnverified: boolean, lang: 'es' | 'en' = 'es', today = T) => ({ lang, today, showUnverified })

// ── "Every week in the city": its own group, never rows of a tab ──
eq('weekly group: all four recurring items (the sunset viewpoint included)', weeklyCards(agenda, 'es').map((w) => w.id), ['muevete-en-bici', 'lucha-libre-arena-mexico', 'bazar-sabado-san-angel', 'mirador-torre-latinoamericana'])
eq('weekly group (English): card = when_label + title + one line', weeklyCards(agenda, 'en')[0], { id: 'muevete-en-bici', when: 'Sundays · 8am–2pm', title: 'Muévete en Bici, Reforma', line: 'Reforma closes to cars for cyclists, runners and free bike loans.' })
eq('weekly group: no Spanish label in the English cards (days, "Noche", "Cada…")', weeklyCards(agenda, 'en').flatMap((w) => [w.when, w.line]).some((t) => /Domingos|Martes|Sábados|Al atardecer|Cada |Noche|cierra|Arte y/.test(t)), false)
eq('weekly group: ES and EN differ for every card (translated, not copied)', weeklyCards(agenda, 'es').every((w, i) => w.when !== weeklyCards(agenda, 'en')[i].when && w.line !== weeklyCards(agenda, 'en')[i].line), true)
eq('recurring items are in no month tab (ES and EN, Preview)', (['es', 'en'] as const).every((l) => monthTabs(agenda, cx(true, l, N)).every((m) => m.rows.every((r) => !agenda.recurring.some((x) => r.id.startsWith(x.id))))), true)

// ── month tabs: the current month + the next one, from today on ──
const mP = monthTabs(agenda, cx(false, 'es', N)), mV = monthTabs(agenda, cx(true, 'es', N))
eq('month tabs (Production, Nov 5): November and December (both have verified events)', mP.map((m) => m.label), ['Noviembre', 'Diciembre'])
eq('month tabs (Preview, Nov 5): November, then December', mV.map((m) => m.label), ['Noviembre', 'Diciembre'])
eq('month tabs: labels in English', monthTabs(agenda, cx(true, 'en', N)).map((m) => m.label), ['November', 'December'])
eq('month tabs: the tabs follow today, not a stay (Oct 29 → Oct + Nov)', monthTabs(agenda, cx(true, 'es', '2026-10-29')).map((m) => m.label), ['Octubre', 'Noviembre'])
eq('month tabs: Dec 20 → December only (Jan has no event, hidden)', monthTabs(agenda, cx(true, 'es', '2026-12-20')).map((m) => m.label), ['Diciembre'])
eq('month tabs: Dec 31 rolls over to Jan without throwing', monthTabs(agenda, cx(true, 'es', '2026-12-31')).map((m) => m.ym), ['2026-12'])
const nov = mP[0].rows, novV = mV[0].rows, decV = mV[1].rows
eq('November (Production): the verified events from today on, sorted by start, each once', [nov.map((r) => r.id), new Set(nov.map((r) => r.id)).size === nov.length], [['el-camino-reforma', 'nba-mexico-city-game', 'pinatas-map', 'karol-g', 'puente-de-la-revolucion', 'corona-capital'], true])
eq('November (Preview): all November events, to_verify flagged, sorted by start', [novV.length, novV.every((r, i) => i === 0 || novV[i - 1].date <= r.date), novV.filter((r) => r.toVerify).length], [16, true, 10])
eq('November: events already over today are hidden', novV.some((r) => ['desfile-dia-de-muertos', 'cacao-para-todos', 'ofrenda-monumental-zocalo'].includes(r.id)), false)
eq('November: compact rows = date range + title + category only (no venue line)', nov.find((r) => r.id === 'karol-g')!.meta, 'Música')
eq('November: date ranges', nov.map((r) => r.dateLabel), ['23 OCT – 8 NOV', 'SÁB 7 NOV', '7 NOV – 13 DIC', 'VIE 13 NOV', '14 – 16 NOV', '20 – 22 NOV'])
eq('December (Preview): every December event, sorted by start, all verified (no pill)', [decV.map((r) => r.id), decV.every((r) => !r.toVerify)], [['pinatas-map', 'munal-mexico-ruta-y-destino', 'bruno-mars-gnp-3-4-dic', 'bruno-mars-gnp-7-8-dic', 'concierto-navidad-bellas-artes-11-dic', 'los-bukis-gnp', 'concierto-navidad-bellas-artes-13-dic', 'santa-run-la-mexicana', 'marvel-run-2026', 'mana-gnp'], true])
eq('December (Production): the same ten events, none flagged', [monthRows(agenda, '2026-12', cx(false, 'es', N)).map((r) => r.id), monthRows(agenda, '2026-12', cx(false, 'es', N)).some((r) => r.toVerify)], [decV.map((r) => r.id), false])
eq('an event that spans two months is listed once in each tab, with its own full range', [novV, decV].map((rows) => rows.find((r) => r.id === 'pinatas-map')!.dateLabel), ['7 NOV – 13 DIC', '7 NOV – 13 DIC'])
eq('November: recurring items never appear', novV.some((r) => agenda.recurring.some((x) => r.id.startsWith(x.id))), false)
eq('month rule: events already over today are hidden (Nov 20)', monthRows(agenda, '2026-11', cx(true, 'es', '2026-11-20')).some((r) => ['karol-g', 'puente-de-la-revolucion'].includes(r.id)), false)
eq('Production gating: a month tab only ever holds verified events', visibleEvents(agenda.events, T, false).every((e) => e.status === 'verified') && nov.every((r) => agenda.events.find((e) => e.id === r.id)!.status === 'verified'), true)
eq('no event renders twice inside one tab, in Preview, ES and EN', (['es', 'en'] as const).every((l) => monthTabs(agenda, cx(true, l, N)).every((m) => new Set(m.rows.map((r) => r.id)).size === m.rows.length)), true)
eq('English tabs list the same ids in the same order as Spanish', monthTabs(agenda, cx(true, 'en', N)).map((m) => m.rows.map((r) => r.id)), mV.map((m) => m.rows.map((r) => r.id)))
// time ordering helper
eq('timeRank handles 24h, ranges, am/pm and unknowns', [timeRank('14:00'), timeRank('10–19 h'), timeRank('2 pm'), timeRank('8am–2pm'), timeRank('12 am'), timeRank('Noche'), timeRank(null)].map((n) => n), [840, 600, 840, 480, 0, 1441, 1441])

// ── ES / EN parity ──
eq('copy: the weekly group title (ES, EN)', [AGENDA_COPY.es.weeklyTitle, AGENDA_COPY.en.weeklyTitle], ['Cada semana en la ciudad', 'Every week in the city'])
eq('copy: group titles and the neutral labels (ES, EN)', [AGENDA_COPY.es.tripsTitle, AGENDA_COPY.en.tripsTitle, AGENDA_COPY.es.rangesLabel, AGENDA_COPY.en.rangesLabel], ['Escapadas de un día', 'Day trips', 'Mes', 'Month'])
eq('copy: the removed stay-window strings are gone', ['tabStay', 'allThrough', 'afterStay', 'seeAll', 'highlight', 'trips'].some((k) => k in AGENDA_COPY.es || k in AGENDA_COPY.en), false)
eq('copy: ES and EN have exactly the same keys', Object.keys(AGENDA_COPY.es).sort(), Object.keys(AGENDA_COPY.en).sort())
eq('copy: no empty string in either language', Object.entries(AGENDA_COPY).flatMap(([l, c]) => Object.entries(c).filter(([, v]) => !String(v).replace(/,/g, '').trim()).map(([k]) => `${l}.${k}`)), [])
eq('copy: weekday and month lists have 7 / 12 entries in both languages', (['es', 'en'] as const).map((l) => [AGENDA_COPY[l].weekdays.length, AGENDA_COPY[l].weekdaysShort.length, AGENDA_COPY[l].monthsShort.length]), [[7, 7, 12], [7, 7, 12]])
eq('copy: the section subtitle and the quiet state (ES, EN)', [AGENDA_COPY.es.subtitle, AGENDA_COPY.en.subtitle, AGENDA_COPY.es.quietTitle, AGENDA_COPY.en.quietTitle],
  ['Lo que pasa en la ciudad este mes y el siguiente.', "What's happening in the city this month and next.", 'Días tranquilos en la ciudad', 'Quiet days in the city'])
eq('copy: the neutral pill names no operator', [AGENDA_COPY.es.toConfirm, AGENDA_COPY.en.toConfirm], ['Por confirmar', 'To confirm'])
eq('data: every event and recurring item has both languages', [...agenda.events.map((e) => e.title), ...agenda.recurring.map((r) => r.title), ...agenda.recurring.map((r) => r.when_label), ...agenda.recurring.map((r) => r.line)].every((t) => t.es && t.en), true)
eq('data: every event with a time has it in both languages', agenda.events.filter((e) => e.time).every((e) => e.time!.es && e.time!.en), true)

// ── agenda:check ──
{
  const run = (extra: string[], env: Record<string, string> = {}) => spawnSync('npx', ['tsx', 'scripts/agenda-check.ts', ...extra], { encoding: 'utf8', env: { ...process.env, ...env } })
  const r = run(['--today', '2026-11-05'])
  eq('agenda:check exits 0 on the seed', r.status, 0)
  eq('agenda:check lists the 10 to_verify and the 15 verified events still to come (Nov 5)', /to_verify \(10\)/.test(r.stdout) && /verified \(15\)/.test(r.stdout) && r.stdout.includes('karol-g') && r.stdout.includes('mana-gnp'), true)
  eq('agenda:check reports no leftover placeholders', r.stdout.includes('left in any string: none'), true)
  eq('agenda:check lists the recurring items and the viewpoint that has no weekdays', r.stdout.includes('mirador-torre-latinoamericana') && r.stdout.includes('no weekdays'), true)
  eq('agenda:check flags the month with no verified event', /Production hides this month tab/.test(r.stdout), true)
  eq('agenda:check reports that no live event carries a link (links were removed on purpose)', r.stdout.includes('live events with a link (rows are plain text by decision): none'), true)
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
