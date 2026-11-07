/**
 * lib/data/guides/seasonal.ts
 *
 * Pure logic of a guide's seasonal edition: active/expired in the destination's timezone, the labels of the
 * band, the day columns, and the Booking.com date params. No fs, no window, no clock reads except through the
 * `now` argument, so every rule is unit-testable. Dates are ISO "YYYY-MM-DD" strings.
 */

import type { FlatSeasonalEdition } from './types'

export type SeasonalState = 'active' | 'expired'
export type SeasonalLocale = 'es' | 'en'

const WEEKDAYS_SHORT = { es: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'], en: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] }
const MONTHS_SHORT = {
  es: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
  en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
}
const VERIFIED = { es: 'VERIFICADO', en: 'VERIFIED' }

/** YYYY-MM-DD of `now` in the given IANA timezone. */
export function todayIn(timezone: string, now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)!.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

/** `active` through windowEnd (inclusive) in the edition's timezone, `expired` from the next day. */
export function seasonalState(se: Pick<FlatSeasonalEdition, 'windowEnd' | 'timezone'>, now: Date): SeasonalState {
  return todayIn(se.timezone, now) <= se.windowEnd ? 'active' : 'expired'
}

const utc = (iso: string) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)))
export const addDays = (iso: string, n: number) => new Date(utc(iso) + n * 864e5).toISOString().slice(0, 10)
const weekdayOf = (iso: string) => new Date(utc(iso)).getUTCDay()
const day = (iso: string) => Number(iso.slice(8))
const mon = (iso: string, l: SeasonalLocale) => MONTHS_SHORT[l][Number(iso.slice(5, 7)) - 1]

/** "25/30 NOV" (same month) or "28 OCT/3 NOV". */
export function windowLabel(start: string, end: string, l: SeasonalLocale): string {
  return start.slice(0, 7) === end.slice(0, 7) ? `${day(start)}/${day(end)} ${mon(end, l)}` : `${day(start)} ${mon(start, l)}/${day(end)} ${mon(end, l)}`
}

/** "EDICIÓN THANKSGIVING 2026 — 25/30 NOV — VERIFICADO 23 OCT" */
export function bandLabel(se: FlatSeasonalEdition, l: SeasonalLocale): string {
  return `${se.label.toUpperCase()} — ${windowLabel(se.windowStart, se.windowEnd, l)} — ${VERIFIED[l]} ${day(se.verifiedAt)} ${mon(se.verifiedAt, l)}`
}

export interface DayColumn {
  n: number
  /** "dia-03": the id of the itinerary day this column links to. */
  id: string
  /** "03" */
  label: string
  /** "VIE" */
  weekday: string
  /** "27 NOV" */
  date: string
  /** "27" */
  dayOfMonth: string
  /** The itinerary day's own title (existing copy, never written here). */
  title: string
  events: Array<{ title: string; detail?: string }>
}

/**
 * One column per itinerary day: its date is windowStart + n - 1, its title is the itinerary day's title, its
 * events are the dayEvents with that dayIndex (a day with none has none: no empty cell, no placeholder).
 */
export function dayColumns(se: FlatSeasonalEdition, days: ReadonlyArray<{ dayNumber: number; title: string }>, l: SeasonalLocale): DayColumn[] {
  return days.map(({ dayNumber: n, title }) => {
    const date = addDays(se.windowStart, n - 1)
    return {
      n,
      id: `dia-${String(n).padStart(2, '0')}`,
      label: String(n).padStart(2, '0'),
      weekday: WEEKDAYS_SHORT[l][weekdayOf(date)],
      date: `${day(date)} ${mon(date, l)}`,
      dayOfMonth: String(day(date)),
      title,
      events: (se.dayEvents ?? []).filter((e) => e.dayIndex === n).map((e) => ({ title: e.title, detail: e.detail })),
    }
  })
}

/**
 * Booking.com links carry the suggested dates while the edition is active and none once it has expired.
 * Other hosts and guides without an edition are untouched.
 */
export function withBookingDates(url: string | undefined, bookingDates: FlatSeasonalEdition['bookingDates'], state: SeasonalState): string | undefined {
  if (!url) return url
  let u: URL
  try { u = new URL(url) } catch { return url }
  if (!/(^|\.)booking\.com$/.test(u.hostname)) return url
  if (state === 'active' && bookingDates) {
    u.searchParams.set('checkin', bookingDates.checkin)
    u.searchParams.set('checkout', bookingDates.checkout)
  } else {
    u.searchParams.delete('checkin')
    u.searchParams.delete('checkout')
  }
  return u.toString()
}

/** WCAG 2.x contrast ratio between two #RRGGBB colours (used to keep the edition's text AA on its backgrounds). */
export function contrastRatio(fg: string, bg: string): number {
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const [a, c] = [lum(fg), lum(bg)].sort((x, y) => y - x)
  return (a + 0.05) / (c + 0.05)
}
