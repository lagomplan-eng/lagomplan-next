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
  /** Only in "coming up": the event starts after check-out. */
  afterStay?: boolean
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

/** "7 – 8 NOV", "29 OCT – 4 NOV": the full range of a multi-day event (one label wherever it is listed). */
function spanLabel(c: AgendaCopy, e: Pick<AgendaEvent, 'start' | 'end'>): string {
  const mon = (iso: string) => c.monthsShort[Number(iso.slice(5, 7)) - 1].toUpperCase()
  return e.start.slice(0, 7) === e.end.slice(0, 7)
    ? `${day(e.start)} – ${day(e.end)} ${mon(e.start)}`
    : `${day(e.start)} ${mon(e.start)} – ${day(e.end)} ${mon(e.end)}`
}

const monthShort = (c: AgendaCopy, iso: string) => c.monthsShort[Number(iso.slice(5, 7)) - 1].toUpperCase()

/** Does the event cover every night of the stay (arrival … the night before check-out)? */
export function coversEveryNight(e: Pick<AgendaEvent, 'start' | 'end'>, stay: Range): boolean {
  const lastNight = stay.end > stay.start ? addDays(stay.end, -1) : stay.start
  return e.start <= stay.start && e.end >= lastNight
}

/** A line of the "All through your stay" group: title · area. */
export interface AllThroughLine { id: string; title: string; area: string | null; url: string | null; toVerify: boolean }

export interface StayTab {
  /** Featured event first (with the highlight label), then the dated events by start. */
  rows: AgendaRow[]
  /** Events that cover every night of the stay, as compact lines. */
  allThrough: AllThroughLine[]
}

/**
 * The "Your stay" tab. Recurring items never appear here (nor in any dated tab).
 *  a) the first featured event of the stay first (with "lo más grande de tu estancia");
 *  b) the other dated events that overlap the stay and do NOT span all of it, by start;
 *  c) the events that cover every night of the stay go to the "All through your stay" group.
 * Each event is listed once.
 */
export function stayTabRows(agenda: Pick<Agenda, 'events'>, stay: Range, ctx: Omit<RowContext, 'window'>): StayTab {
  const c = AGENDA_COPY[ctx.lang]
  const hl = highlightId(agenda, stay, ctx.today, ctx.showUnverified)
  const inStay = visibleEvents(agenda.events, ctx.today, ctx.showUnverified).filter((e) => overlaps(e, stay))
  const rows: AgendaRow[] = []
  const allThrough: AllThroughLine[] = []
  for (const e of inStay) {
    const highlight = e.id === hl
    if (!highlight && coversEveryNight(e, stay)) {
      allThrough.push({ id: e.id, title: e.title[ctx.lang], area: e.place?.[ctx.lang] ?? null, url: e.url ?? null, toVerify: e.status === 'to_verify' })
      continue
    }
    const from = maxIso(e.start, stay.start)
    const meta = [categoryLabel(c, e.category), e.place?.[ctx.lang]].filter(Boolean).join(' · ')
    rows.push({
      id: e.id,
      kind: 'event',
      date: from,
      dateLabel: e.start === e.end ? `${dow(c, from)} ${day(from)}` : spanLabel(c, e), // the event's own dates
      time: e.time?.[ctx.lang] ?? null,
      title: e.title[ctx.lang],
      meta: highlight ? `${meta} · ${c.highlight}` : meta,
      url: e.url ?? null,
      toVerify: e.status === 'to_verify',
      highlight,
    })
  }
  const sorted = sortRows(rows)
  const first = sorted.findIndex((r) => r.highlight)
  if (first > 0) sorted.unshift(...sorted.splice(first, 1))
  return { rows: sorted, allThrough }
}

// ── Month tabs ───────────────────────────────────────────────────────────────

const lastDayOfMonth = (iso: string) => {
  const y = Number(iso.slice(0, 4)), m = Number(iso.slice(5, 7))
  return toIso(Date.UTC(y, m, 1) - 864e5)
}
const nextMonth = (ym: string) => {
  const y = Number(ym.slice(0, 4)), m = Number(ym.slice(5, 7))
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`
}

export interface MonthTab { id: string; ym: string; label: string; rows: AgendaRow[] }

/**
 * One month's events as compact rows (date range · title · category, no venue), by start. An event
 * shows when it overlaps the month from today on and ends on/after max(today, check-in). Rows that
 * start after check-out carry `afterStay`. A date label never repeats an event inside one tab.
 */
export function monthRows(agenda: Pick<Agenda, 'events'>, stay: Range, ym: string, ctx: Omit<RowContext, 'window'>): AgendaRow[] {
  const c = AGENDA_COPY[ctx.lang]
  const span = { start: maxIso(`${ym}-01`, ctx.today), end: lastDayOfMonth(`${ym}-01`) }
  const rows: AgendaRow[] = []
  for (const e of visibleEvents(agenda.events, ctx.today, ctx.showUnverified)) {
    if (!overlaps(e, span)) continue
    if (e.end < maxIso(ctx.today, stay.start)) continue // over before the guest is here
    rows.push({
      id: e.id,
      kind: 'event',
      date: e.start,
      dateLabel: e.start === e.end ? `${dow(c, e.start)} ${day(e.start)} ${monthShort(c, e.start)}` : spanLabel(c, e),
      time: null,
      title: e.title[ctx.lang],
      meta: categoryLabel(c, e.category),
      url: e.url ?? null,
      toVerify: e.status === 'to_verify',
      highlight: false,
      afterStay: e.start > stay.end,
    })
  }
  return sortRows(rows)
}

/** The checkout month and the one after it; a month without any visible event is left out. */
export function monthTabs(agenda: Pick<Agenda, 'events'>, stay: Range, ctx: Omit<RowContext, 'window'>): MonthTab[] {
  const c = AGENDA_COPY[ctx.lang]
  const first = stay.end.slice(0, 7)
  return [first, nextMonth(first)]
    .map((ym, i) => {
      const name = c.monthsLong[Number(ym.slice(5, 7)) - 1]
      return { id: `m${i + 1}`, ym, label: name.charAt(0).toUpperCase() + name.slice(1), rows: monthRows(agenda, stay, ym, ctx) }
    })
    .filter((t) => t.rows.length > 0)
}

/**
 * "Every week in the city": every recurring item (daily ones included) as its own group, shown right after
 * the agenda. Recurring items are NEVER rows of "Your stay" or of a month tab.
 */
export const weeklyCards = (agenda: Pick<Agenda, 'recurring'>, lang: AgendaLang) =>
  agenda.recurring.map((r) => ({ id: r.id, when: r.when_label[lang], title: r.title[lang], line: r.line[lang] }))
