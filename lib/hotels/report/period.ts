// lib/hotels/report/period.ts — calendar months and dates in Mexico City time (UTC-6, no DST since 2022).
import { monthStartMx, weekStartMx } from '../stats'

export const DAY = 86_400_000
export const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/
export const DATE_RE = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

/** The first day each kind of data was being counted (Mexico City date). Before it, "no data" means "not counted", never zero. */
export const PLACES_COUNTED_FROM = '2026-11-25' // PR #159: which place a tap belongs to
export const OPENS_COUNTED_FROM = '2026-11-26' // PR #160: which mood, zone tab or plan a guest opens

export function isMonth(v: unknown): v is string { return typeof v === 'string' && MONTH_RE.test(v) }
export function isDate(v: unknown): v is string { return typeof v === 'string' && DATE_RE.test(v) }

/** [start, end) of a "YYYY-MM" month, as epoch ms, built on monthStartMx. */
export function monthRange(month: string): { start: number; end: number } {
  const [, y, m] = MONTH_RE.exec(month)!
  const yy = Number(y), mm = Number(m)
  return { start: monthStartMx(Date.UTC(yy, mm - 1, 15)), end: monthStartMx(Date.UTC(yy, mm, 15)) }
}
export function prevMonth(month: string): string {
  const [, y, m] = MONTH_RE.exec(month)!
  const d = new Date(Date.UTC(Number(y), Number(m) - 2, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}
export function monthOf(t: number): string {
  const mx = new Date(t - 6 * 3600_000)
  return `${mx.getUTCFullYear()}-${String(mx.getUTCMonth() + 1).padStart(2, '0')}`
}
/** Midnight (Mexico City) at the start of a "YYYY-MM-DD" date. */
export function dateStartMx(date: string): number {
  const [, y, m, d] = DATE_RE.exec(date)!
  return Date.UTC(Number(y), Number(m) - 1, Number(d), 6, 0, 0)
}
/** The Mexico City calendar date of an instant, "YYYY-MM-DD". */
export function dateOfMx(t: number): string {
  return new Date(t - 6 * 3600_000).toISOString().slice(0, 10)
}
/** The Mondays of the weeks that touch [start, end). */
export function weeksIn(start: number, end: number): number[] {
  const out: number[] = []
  for (let w = weekStartMx(start); w < end; w += 7 * DAY) out.push(w)
  return out
}
