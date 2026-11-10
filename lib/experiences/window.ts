/**
 * lib/experiences/window.ts
 *
 * Recurring annual window for a guide on the Experiencias hub (GuideMeta.hubWindow).
 * "Today" is the calendar date in America/Mexico_City, via the same helper the guides'
 * "timely" block uses (lib/data/guides/timely.ts), so the hub and the guides agree on
 * when a day starts. Pure and import-safe.
 */

import { mexicoToday } from '../data/guides/timely'
import type { HubWindow } from '../data/guides/types'

/** "MM-DD" of `now` in Mexico City. */
export function mexicoMonthDay(now: Date = new Date()): string {
  return mexicoToday(now).slice(5)
}

/**
 * True when `monthDay` ("MM-DD") is inside the window, both ends inclusive.
 * No window = always in. from > until wraps the year end (11-15 .. 01-10 covers 12-25 and 01-10).
 */
export function isInHubWindow(window: HubWindow | undefined, monthDay: string): boolean {
  if (!window) return true
  const { from, until } = window
  return from <= until
    ? monthDay >= from && monthDay <= until
    : monthDay >= from || monthDay <= until
}

export interface HubOptions {
  /** Clock override (tests). Defaults to the real clock. */
  now?: Date
  /** Skip hubWindow filtering. For callers that must resolve every id (the saved-plan catalog). */
  ignoreWindow?: boolean
}
