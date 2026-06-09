// lib/planner/mobile-view.ts
//
// Pure helpers for the mobile companion view (app/[locale]/trips/[trip_id]).
// Extracted from MobileTripClient so they can be unit-tested in isolation
// (see tests/mobile-view.test.ts).

/**
 * Best-effort traveler count, parsed from the free-text `travelers` field.
 * Drives the budget "Por persona" divisor. Never returns 0 (so callers can
 * divide safely) — unknown/empty falls back to 2.
 */
export function parsePeopleCount(travelers: string | null | undefined): number {
  if (!travelers) return 2
  const num = parseInt(travelers, 10)
  if (!isNaN(num) && num > 0) return num
  const t = travelers.toLowerCase()
  if (/(solo|sola|single)/.test(t)) return 1
  if (/(pareja|couple)/.test(t)) return 2
  if (/(familia|family|group|grupo|amigos|friends)/.test(t)) return 4
  return 2
}

/**
 * Parse a trip date. Accepts a bare `YYYY-MM-DD` (interpreted as LOCAL
 * midnight, not UTC — avoids the classic off-by-one) or a full ISO string.
 * Returns null for empty/invalid input.
 */
export function parseTripDate(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Resolve which day to open on load, relative to today.
 *
 *   today before the trip  → day 0,            isToday: false
 *   today within the trip  → that day index,   isToday: true
 *   today after the trip   → last day,         isToday: false
 *   no derivable start     → day 0,            isToday: false
 *
 * Both dates are normalized to local midnight before differencing, so the
 * result is unaffected by time-of-day or DST. `dayCount` is the number of
 * days in the itinerary; the returned index is clamped to [0, dayCount-1].
 */
export function getTodayDayIndex(
  startISO: string | null | undefined,
  dayCount: number,
  now: Date,
): { dayIndex: number; isToday: boolean } {
  const start = parseTripDate(startISO)
  if (!start || dayCount <= 0) return { dayIndex: 0, isToday: false }

  const startMid = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const nowMid   = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const diff = Math.floor((nowMid - startMid) / 86400000)

  if (diff < 0) return { dayIndex: 0, isToday: false }
  if (diff >= dayCount) return { dayIndex: dayCount - 1, isToday: false }
  return { dayIndex: diff, isToday: true }
}
