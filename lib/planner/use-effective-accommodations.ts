/**
 * lib/planner/use-effective-accommodations.ts
 *
 * Single function that resolves what `accommodations[]` to render
 * regardless of whether the trip came from the new pipeline (Phase 1
 * shipped) or from a legacy DB row generated before the contract
 * existed.
 *
 * Decision table:
 *   trip has accommodations[].length >= 1   → use them (AI or fallback source)
 *   trip is same-day (nights === 0)         → []
 *   trip is overnight + no accommodations   → synthesize a stub here at view
 *                                              time, tagged `source: 'fallback'`
 *
 * This keeps a single render path in the UI: the section reads from
 * `useEffectiveAccommodations` and never branches on legacy vs new.
 *
 * Why a plain function and not a React hook
 *   The output is fully derived from inputs (trip + ctx). Calling this
 *   on every render is cheap; wrapping it in `useMemo` is a caller
 *   concern. Keeping it framework-agnostic also lets server components
 *   call it directly.
 */

import type { Accommodation, TripDestinationContext } from './accommodations'
import { isOvernight } from './accommodations'
import { synthesizeFallbackAccommodations } from './fallback-accommodations'

export function effectiveAccommodations(
  tripAccommodations: Accommodation[] | undefined | null,
  ctx: TripDestinationContext,
): Accommodation[] {
  if (Array.isArray(tripAccommodations) && tripAccommodations.length > 0) {
    return tripAccommodations
  }
  if (!isOvernight(ctx.nights)) return []
  return synthesizeFallbackAccommodations(ctx)
}
