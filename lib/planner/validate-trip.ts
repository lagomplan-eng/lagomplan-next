/**
 * lib/planner/validate-trip.ts
 *
 * Post-AI validation gate.
 *
 * Runs after the Edge Function returns trip_data. Enforces the business
 * rule the audit identified as load-bearing:
 *
 *   overnight ⇒ accommodations.length >= 1
 *
 * On violation, returns a structured outcome the API caller uses to
 * decide between (a) one retry with a tightening hint, or (b) the
 * deterministic fallback.
 *
 * This module is intentionally pure — no fetches, no globals, no
 * side effects other than building the synthesized fallback entries.
 * Easy to unit-test.
 */

import type { Accommodation, TripDestinationContext } from './accommodations'
import { isOvernight } from './accommodations'
import { synthesizeFallbackAccommodations } from './fallback-accommodations'

/** Whatever shape `trip_data` actually has — we only read accommodations[]. */
export interface ValidatableTripData {
  accommodations?: Accommodation[]
  // Catch-all so callers can pass the raw AI response without re-typing it.
  [key: string]: unknown
}

export type ValidationStatus =
  | 'ok'              // accommodations present (or not required)
  | 'no_hotels'       // overnight but accommodations empty; first attempt → retry
  | 'fallback_used'   // exhausted retries; we injected a fallback entry

export interface ValidationResult {
  status:           ValidationStatus
  /** The trip data to ship downstream — possibly with synthesized accommodations. */
  tripData:         ValidatableTripData
  /** Count after this validation step (post-fallback if applicable). */
  accommodationsCount: number
  /** True only when `status === 'fallback_used'`. */
  fellBackToStub:   boolean
}

/**
 * Run the validation gate. Pass `attempt === 0` for the first call;
 * if it returns `'no_hotels'`, retry the AI and pass `attempt === 1`.
 * On attempt 1 failure, the gate synthesizes a fallback and returns
 * `'fallback_used'`.
 */
export function validateAccommodations(
  tripData: unknown,
  ctx:      TripDestinationContext,
  attempt:  0 | 1,
): ValidationResult {
  const safe = (tripData && typeof tripData === 'object' ? tripData : {}) as ValidatableTripData
  const overnight = isOvernight(ctx.nights)

  if (!overnight) {
    // Same-day trips: accommodations[] should be absent or empty.
    // Don't reject if AI emitted some anyway (it's not harmful).
    return {
      status: 'ok',
      tripData: safe,
      accommodationsCount: Array.isArray(safe.accommodations) ? safe.accommodations.length : 0,
      fellBackToStub: false,
    }
  }

  const aiAccommodations = Array.isArray(safe.accommodations) ? safe.accommodations : []

  if (aiAccommodations.length >= 1) {
    return {
      status: 'ok',
      tripData: safe,
      accommodationsCount: aiAccommodations.length,
      fellBackToStub: false,
    }
  }

  if (attempt === 0) {
    // First miss — return signal to caller; do not synthesize yet.
    return {
      status: 'no_hotels',
      tripData: safe,
      accommodationsCount: 0,
      fellBackToStub: false,
    }
  }

  // Second miss — synthesize a deterministic stub so the trip ships
  // with at least one bookable surface. Tag it so analytics can
  // measure how often this path runs.
  const fallback = synthesizeFallbackAccommodations(ctx)
  return {
    status: 'fallback_used',
    tripData: { ...safe, accommodations: fallback },
    accommodationsCount: fallback.length,
    fellBackToStub: true,
  }
}
