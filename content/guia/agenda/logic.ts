// content/guia/agenda/logic.ts
//
// Pure date / filtering logic for the stay-window agenda. No window, no fs, no clock
// reads except through arguments, so every rule is unit-testable. "Today" is always
// the calendar date in America/Mexico_City, never the visitor's or the server's zone.
// All dates are ISO "YYYY-MM-DD" strings; weekdays use 0 = Sunday … 6 = Saturday.

import type { Agenda, AgendaEvent, Category, RecurringItem } from './schema'
import { AGENDA_COPY, type AgendaCopy, type AgendaLang } from './copy'

export const MX_TZ = 'America/Mexico_City'
/** Without a valid stay in the link: today … today + 13 days. */
export const FALLBACK_DAYS = 13
/** "Más adelante" reaches this many days past the end of the stay window. */
export const AHEAD_DAYS = 30

/** YYYY-MM-DD of `now` in Mexico City. */
export function mexicoToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: MX_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)!.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

const utc = (iso: string) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)))
const toIso = (ms: number) => new Date(ms).toISOString().slice(0, 10)
export const addDays = (iso: string, n: number) => toIso(utc(iso) + n * 864e5)
export const daysBetween = (a: string, b: string) => Math.round((utc(b) - utc(a)) / 864e5)
export const weekdayOf = (iso: string) => new Date(utc(iso)).getUTCDay()
const maxIso = (a: string, b: string) => (a > b ? a : b)
const minIso = (a: string, b: string) => (a < b ? a : b)

// ── The stay window ─────────────────────────────────────────────────────────────

export interface Range { start: string; end: string }
export interface StayWindow extends Range { fromLink: boolean }

/**
 * `?llegada=YYYY-MM-DD&noches=1..60` → llegada … llegada + noches (the check-out day is
 * included: 4 nights from Oct 30 reach Nov 3). Anything else (a missing or invalid
 * param, or a window that is entirely in the past) falls back to today … today + 13.
 */
export function stayWindow(stay: { arrival?: string; nights?: number }, today: string): StayWindow {
  if (stay.arrival && stay.nights) {
    const end = addDays(stay.arrival, stay.nights)
    if (end >= today) return { start: stay.arrival, end, fromLink: true }
  }
  return { start: today, end: addDays(today, FALLBACK_DAYS), fromLink: false }
}

/**
 * Calendar weeks (Monday → Sunday) trimmed to the window. A first or last piece of a
 * single day is merged into its neighbour (two days or more stay on their own).
 * Fri Oct 30 → Tue Nov 3 = [Oct 30–Nov 1] [Nov 2–3]; Nov 1 → Nov 30 = four ranges.
 */
export function splitRanges(start: string, end: string): Range[] {
  const pieces: Range[] = []
  let cur = start
  while (cur <= end) {
    const dow = weekdayOf(cur)
    const sunday = addDays(cur, dow === 0 ? 0 : 7 - dow)
    const pieceEnd = minIso(end, sunday)
    pieces.push({ start: cur, end: pieceEnd })
    cur = addDays(pieceEnd, 1)
  }
  const len = (r: Range) => daysBetween(r.start, r.end) + 1
  if (pieces.length > 1 && len(pieces[0]) === 1) {
    pieces[1] = { start: pieces[0].start, end: pieces[1].end }
    pieces.shift()
  }
  if (pieces.length > 1 && len(pieces[pieces.length - 1]) === 1) {
    const last = pieces.pop()!
    pieces[pieces.length - 1] = { start: pieces[pieces.length - 1].start, end: last.end }
  }
  return pieces
}

/** Dates only, never "Semana 1": "2 – 3 nov", "30 oct – 1 nov" / "Nov 2 – 3", "Oct 30 – Nov 1". */
export function formatRange(r: Range, lang: AgendaLang): string {
  const c = AGENDA_COPY[lang]
  const [d1, m1] = [Number(r.start.slice(8)), Number(r.start.slice(5, 7)) - 1]
  const [d2, m2] = [Number(r.end.slice(8)), Number(r.end.slice(5, 7)) - 1]
  const mon = (m: number) => c.monthsShort[m]
  if (r.start === r.end) return lang === 'es' ? `${d1} ${mon(m1)}` : `${mon(m1)} ${d1}`
  if (m1 === m2) return lang === 'es' ? `${d1} – ${d2} ${mon(m1)}` : `${mon(m1)} ${d1} – ${d2}`
  return lang === 'es' ? `${d1} ${mon(m1)} – ${d2} ${mon(m2)}` : `${mon(m1)} ${d1} – ${mon(m2)} ${d2}`
}

// ── Rows ─────────────────────────────────────────────────────────────────────

/** Events a guest may see right now: not ended, and (verified, or unverified allowed outside Production). */
export function visibleEvents(events: readonly AgendaEvent[], today: string, showUnverified: boolean): AgendaEvent[] {
  return events.filter((e) => e.end >= today && (e.status === 'verified' || showUnverified))
}

export const overlaps = (e: Pick<AgendaEvent, 'start' | 'end'>, r: Range) => e.start <= r.end && e.end >= r.start

export function categoryLabel(c: AgendaCopy, cat: Category): string {
  return { food: c.catFood, culture: c.catCulture, sport: c.catSport, outdoors: c.catOutdoors, music: c.catMusic, city: c.catCity }[cat]
}

export interface AgendaRow {
  id: string
  kind: 'event' | 'recurring'
  /** Sort key: the first day of the row inside its range. */
  date: string
  dateLabel: string
  time: string | null
  title: string
  meta: string
  url: string | null
  toVerify: boolean
  highlight: boolean
}

export interface RowContext {
  lang: AgendaLang
  today: string
  showUnverified: boolean
  /** The whole stay window (for the highlight, which is "the first featured event of the stay"). */
  window: Range
}

const dow = (c: AgendaCopy, iso: string) => c.weekdaysShort[weekdayOf(iso)]
const day = (iso: string) => Number(iso.slice(8))

/** The first featured event of the window by date (file order breaks ties); null if none. */
export function highlightId(agenda: Pick<Agenda, 'events'>, window: Range, today: string, showUnverified: boolean): string | null {
  const featured = visibleEvents(agenda.events, today, showUnverified).filter((e) => e.featured && overlaps(e, window))
  if (!featured.length) return null
  const first = (e: AgendaEvent) => maxIso(e.start, window.start)
  return featured.reduce((best, e) => (first(e) < first(best) ? e : best)).id
}

/** "14:00", "10–19 h", "2 pm", "8am–2pm" → minutes since midnight of the FIRST time, for ordering; unknown ("Noche", none) → after every timed row. */
export function timeRank(label: string | null): number {
  const m = label?.match(/(\d{1,2})(?::(\d{2}))?\s*([ap]m)?/i)
  if (!m) return 24 * 60 + 1
  let h = Number(m[1])
  const ampm = m[3]?.toLowerCase()
  if (ampm === 'pm' && h < 12) h += 12
  if (ampm === 'am' && h === 12) h = 0
  return h * 60 + Number(m[2] ?? 0)
}

function sortRows(rows: AgendaRow[]): AgendaRow[] {
  return rows
    .map((r, i) => ({ r, i }))
    .sort((a, b) =>
      a.r.date.localeCompare(b.r.date) ||
      timeRank(a.r.time) - timeRank(b.r.time) ||
      (a.r.kind === b.r.kind ? 0 : a.r.kind === 'event' ? -1 : 1) ||
      a.i - b.i)
    .map((x) => x.r)
}

/** One list for a range: dated events that overlap it + one row per occurrence of each recurring item. */
export function rowsForRange(agenda: Pick<Agenda, 'events' | 'recurring'>, range: Range, ctx: RowContext): AgendaRow[] {
  const c = AGENDA_COPY[ctx.lang]
  const hl = highlightId(agenda, ctx.window, ctx.today, ctx.showUnverified)
  const rows: AgendaRow[] = []

  for (const e of visibleEvents(agenda.events, ctx.today, ctx.showUnverified)) {
    if (!overlaps(e, range)) continue
    const from = maxIso(e.start, range.start)
    const to = minIso(e.end, range.end)
    const highlight = e.id === hl
    const meta = [categoryLabel(c, e.category), e.place?.[ctx.lang]].filter(Boolean).join(' · ')
    rows.push({
      id: e.id,
      kind: 'event',
      date: from,
      dateLabel: from === to ? `${dow(c, from)} ${day(from)}` : `${day(from)} – ${day(to)}`,
      time: e.time?.[ctx.lang] ?? null,
      title: e.title[ctx.lang],
      meta: highlight ? `${meta} · ${c.highlight}` : meta,
      url: e.url ?? null,
      toVerify: e.status === 'to_verify',
      highlight,
    })
  }

  for (const r of agenda.recurring) {
    for (let d = range.start; d <= range.end; d = addDays(d, 1)) {
      if (!r.weekdays.includes(weekdayOf(d))) continue
      rows.push({
        id: `${r.id}@${d}`,
        kind: 'recurring',
        date: d,
        dateLabel: `${dow(c, d)} ${day(d)}`,
        time: r.time?.[ctx.lang] ?? null,
        title: r.title[ctx.lang],
        meta: `${c.everyPrefix} ${c.weekdays[weekdayOf(d)]}`,
        url: null,
        toVerify: false,
        highlight: false,
      })
    }
  }
  return sortRows(rows)
}

/** "Más adelante": events that START after the stay window ends, up to AHEAD_DAYS later. Dates carry the month. */
export function aheadRows(agenda: Pick<Agenda, 'events'>, window: Range, ctx: Omit<RowContext, 'window'>): AgendaRow[] {
  const c = AGENDA_COPY[ctx.lang]
  const limit = addDays(window.end, AHEAD_DAYS)
  const rows: AgendaRow[] = []
  for (const e of visibleEvents(agenda.events, ctx.today, ctx.showUnverified)) {
    if (!(e.start > window.end && e.start <= limit)) continue
    const mon = (iso: string) => c.monthsShort[Number(iso.slice(5, 7)) - 1].toUpperCase()
    const dateLabel = e.start === e.end
      ? `${dow(c, e.start)} ${day(e.start)} ${mon(e.start)}`
      : e.start.slice(0, 7) === e.end.slice(0, 7)
        ? `${day(e.start)} – ${day(e.end)} ${mon(e.start)}`
        : `${day(e.start)} ${mon(e.start)} – ${day(e.end)} ${mon(e.end)}`
    rows.push({
      id: e.id,
      kind: 'event',
      date: e.start,
      dateLabel,
      time: e.time?.[ctx.lang] ?? null,
      title: e.title[ctx.lang],
      meta: [categoryLabel(c, e.category), e.place?.[ctx.lang]].filter(Boolean).join(' · '),
      url: e.url ?? null,
      toVerify: e.status === 'to_verify',
      highlight: false,
    })
  }
  return sortRows(rows)
}

/** Every recurring item, for the "Cada semana en la ciudad" row (daily items included). */
export const weeklyCards = (agenda: Pick<Agenda, 'recurring'>, lang: AgendaLang) =>
  agenda.recurring.map((r: RecurringItem) => ({ id: r.id, when: r.when_label[lang], title: r.title[lang], line: r.line[lang] }))
