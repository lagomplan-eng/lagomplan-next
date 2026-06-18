/**
 * lib/planner/readiness.ts
 *
 * Single source of truth for a trip's readiness summary, derived from the SAME
 * primitives the planner bar and mobile companion use — `deriveChecksFromDays`
 * + `selectNextCheck` over `trip_data.days`, with completion read from
 * `trip_data.doneChecks` (where both surfaces persist it via the companion
 * route). Use this anywhere a trip's % / next-step is needed (e.g. the
 * /my-trips cards) so the number can never drift from what the trip view shows.
 *
 * Pure: no I/O, no React. Never throws — bad input yields a 0% empty summary.
 */

import { deriveChecksFromDays, type Day as LibDay } from './checks'
import { selectNextCheck } from './milestones'

export interface TripReadiness {
  /** 0–100 doneChecks / totalChecks (0 when the trip has no checks yet). */
  pct:   number
  done:  number
  total: number
  /** The milestone-ordered first incomplete step, or null when none remain. */
  nextCheck: { id: string; text: string; icon: string } | null
  /** True when the trip has checks and they're all done. */
  ready: boolean
}

export function computeTripReadiness(tripData: unknown, locale: 'es' | 'en'): TripReadiness {
  const td = (tripData ?? {}) as Record<string, unknown>
  const days     = Array.isArray(td.days)     ? (td.days as LibDay[])      : []
  const segments = Array.isArray(td.segments) ? (td.segments as any[])     : []
  const doneSet  = new Set<string>(Array.isArray(td.doneChecks) ? (td.doneChecks as string[]) : [])

  let raw
  try {
    raw = deriveChecksFromDays(days, { locale, segments: segments as any })
  } catch {
    raw = []
  }
  const checks = raw.map((c) => ({ id: c.id, text: c.text, icon: c.icon, done: doneSet.has(c.id) }))

  const total = checks.length
  const done  = checks.filter((c) => c.done).length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  const nr = total > 0 ? selectNextCheck(checks) : null
  const nextCheck = nr ? { id: nr.check.id, text: nr.check.text, icon: nr.check.icon } : null

  return { pct, done, total, nextCheck, ready: total > 0 && done === total }
}
