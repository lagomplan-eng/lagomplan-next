// content/guia/agenda/logic.ts
//
// Pure date / filtering logic for the month-tab agenda. No window, no fs, no clock
// reads except through arguments, so every rule is unit-testable. "Today" is always
// the calendar date in America/Mexico_City, never the visitor's or the server's zone.
// All dates are ISO "YYYY-MM-DD" strings; weekdays use 0 = Sunday … 6 = Saturday.

import type { Agenda, AgendaEvent, Category, RecurringItem } from './schema'
import { AGENDA_COPY, type AgendaCopy, type AgendaLang } from './copy'

export const MX_TZ = 'America/Mexico_City'

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

export interface Range { start: string; end: string }

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
}

export interface RowContext {
  lang: AgendaLang
  today: string
  showUnverified: boolean
}

const dow = (c: AgendaCopy, iso: string) => c.weekdaysShort[weekdayOf(iso)]
const day = (iso: string) => Number(iso.slice(8))

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
 * shows when it overlaps the month from today on (what already ended is hidden), whatever the stay.
 */
export function monthRows(agenda: Pick<Agenda, 'events'>, ym: string, ctx: RowContext): AgendaRow[] {
  const c = AGENDA_COPY[ctx.lang]
  const span = { start: maxIso(`${ym}-01`, ctx.today), end: lastDayOfMonth(`${ym}-01`) }
  const rows: AgendaRow[] = []
  for (const e of visibleEvents(agenda.events, ctx.today, ctx.showUnverified)) {
    if (!overlaps(e, span)) continue
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
    })
  }
  return sortRows(rows)
}

/** The current month (in Mexico City) and the one after it; a month without any visible event is left out. */
export function monthTabs(agenda: Pick<Agenda, 'events'>, ctx: RowContext): MonthTab[] {
  const c = AGENDA_COPY[ctx.lang]
  const first = ctx.today.slice(0, 7)
  return [first, nextMonth(first)]
    .map((ym, i) => {
      const name = c.monthsLong[Number(ym.slice(5, 7)) - 1]
      return { id: `m${i + 1}`, ym, label: name.charAt(0).toUpperCase() + name.slice(1), rows: monthRows(agenda, ym, ctx) }
    })
    .filter((t) => t.rows.length > 0)
}

/**
 * "Every week in the city": every recurring item (daily ones included) as its own group, shown right after
 * the agenda. Recurring items are NEVER rows of "Your stay" or of a month tab.
 */
export const weeklyCards = (agenda: Pick<Agenda, 'recurring'>, lang: AgendaLang) =>
  agenda.recurring.map((r) => ({ id: r.id, when: r.when_label[lang], title: r.title[lang], line: r.line[lang] }))
