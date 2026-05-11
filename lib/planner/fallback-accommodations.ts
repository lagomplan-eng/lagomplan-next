/**
 * lib/planner/fallback-accommodations.ts
 *
 * Deterministic last-resort synthesizer.
 *
 * Contract: never let an overnight trip ship with zero monetization
 * surface. If the AI emits no accommodations and a retry fails, we
 * synthesize at least one structured Accommodation here. The resulting
 * entry is intentionally generic — its purpose is to act as a guaranteed
 * "Find stays in {destination}" CTA backed by the same Stay22 Allez
 * affiliate URL builder the AI-emitted entries use. Telemetry tags it
 * with `source: 'fallback'` so we can measure how often it fires.
 *
 * What this module is NOT
 *   - It is not a recommendation engine. It does not call partners.
 *   - It does not invent hotel names. It points to a city-level SRP.
 *   - It does not fan out per-night for multi-city — single-destination
 *     is the only model the current planner supports.
 */

import type {
  Accommodation,
  TripDestinationContext,
} from './accommodations'
import { computeNights, isOvernight } from './accommodations'

/**
 * Build a single deterministic Accommodation entry for the given trip
 * context. Always emits 1 entry covering the full date range; multi-
 * city fan-out is intentionally out of scope.
 *
 * Returns `[]` for same-day trips so the same call site can stay
 * symmetric regardless of overnight status.
 */
export function synthesizeFallbackAccommodations(
  ctx: TripDestinationContext,
): Accommodation[] {
  if (!isOvernight(ctx.nights)) return []

  // Re-compute nights from dates as a sanity guard. If the caller passed
  // an inconsistent value, dates win — they're the actual constraint.
  const nights = ctx.nights || computeNights(ctx.start, ctx.end)
  if (nights < 1) return []

  const id = `acc-fallback-${ctx.destination
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`

  return [
    {
      id,
      city:              ctx.destination.trim(),
      // No neighborhood — the fallback doesn't pretend to know one.
      accommodationType: 'unspecified',
      // Generic but truthful. Localized variants live in copy; this is
      // the structural rationale that gets shown if nothing else is.
      rationale:         'Recomendaciones de alojamiento en tu destino, listas para reservar.',
      priceTier:         'mid',
      familyFriendly:    false,
      checkInDate:       ctx.start,
      checkOutDate:      ctx.end,
      nights,
      source:            'fallback',
      fallback:          true,
    },
  ]
}
