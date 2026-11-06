/**
 * lib/data/guides/timely.ts
 *
 * Pure date logic for the optional "timely" block at the bottom of a guide: dated info (events,
 * closures, season notes) that is only true for a period. The block disappears on its own the day
 * after `validUntil` (no deploy, no edit); rows can also carry their own `until`.
 *
 * "Today" is always the calendar date in America/Mexico_City. All dates are ISO "YYYY-MM-DD" strings,
 * so plain string comparison orders them.
 */

import type { FlatTimely, TimelyRow } from './types'

export const MX_TZ = 'America/Mexico_City'

/** YYYY-MM-DD of `now` in Mexico City. */
export function mexicoToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: MX_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)!.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

/** The block shows through `validUntil` (inclusive) and is gone from the next day. */
export function isTimelyActive(timely: Pick<FlatTimely, 'validUntil'> | undefined, today: string): boolean {
  return !!timely && today <= timely.validUntil
}

/** Table rows that are still current: a row with no `until` lasts as long as the block. */
export function activeRows(rows: readonly TimelyRow[], today: string): TimelyRow[] {
  return rows.filter((r) => !r.until || today <= r.until)
}

/** The block as the page should render it today, or undefined when it has expired. */
export function activeTimely(timely: FlatTimely | undefined, today: string): FlatTimely | undefined {
  if (!timely || !isTimelyActive(timely, today)) return undefined
  if (!timely.table) return timely
  return { ...timely, table: { ...timely.table, rows: activeRows(timely.table.rows, today) } }
}
