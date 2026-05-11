/**
 * lib/planner/accommodations.ts
 *
 * Single source of truth for the planner's `accommodations[]` contract.
 *
 * Hotels are a first-class structured entity in the trip object — not a
 * regex extraction from free-text AI output. This module defines the
 * shape every layer (Edge Function output, validation gate, frontend
 * renderer, fallback synthesizer, analytics) agrees on.
 *
 * Why this layer exists
 *   The earlier pipeline only had `blocks[].type` with no `hotel`
 *   value in its enum, so hotels could only appear as keyword-mined
 *   free text. The audit (see commit history on this branch) showed
 *   that this caused silent monetization loss on a non-trivial
 *   share of overnight trips. The new contract makes lodging a
 *   guaranteed surface for every overnight itinerary.
 */

/** Why this hotel? Set by the AI when it recommends; `'fallback'` when synthesized. */
export type AccommodationSource = 'ai' | 'fallback'

/** Lifestyle / style tag that drives the CTA copy and Stay22 search nuance. */
export type AccommodationType =
  | 'hotel'
  | 'boutique'
  | 'hostel'
  | 'apartment'
  | 'resort'
  | 'cabin'
  | 'glamping'
  | 'unspecified'

/** Coarse price tier so we can copy-match without ever quoting a wrong price. */
export type AccommodationPriceTier = 'budget' | 'mid' | 'upscale' | 'luxury'

export interface Accommodation {
  /** Stable per-trip ID — `acc-{n}` is fine; used as React key + analytics dim. */
  id:               string
  /** City the user will sleep in. Always set deterministically from trip input. */
  city:             string
  /** Neighborhood / barrio. AI-supplied when known; can be undefined. */
  neighborhood?:    string
  /** Lifestyle tag used by the UI to choose icon + copy. */
  accommodationType: AccommodationType
  /**
   * One-sentence reason this area / style fits THIS itinerary.
   * Set by the AI in the happy path; the fallback uses a generic copy.
   */
  rationale:        string
  /** Coarse price tier; safer than a numeric estimate when AI guesses. */
  priceTier:        AccommodationPriceTier
  /** Marketing positioning hint; set when AI detects family travel context. */
  familyFriendly:   boolean
  /** ISO YYYY-MM-DD. Server-computed from the trip date range; never from AI. */
  checkInDate:      string
  /** ISO YYYY-MM-DD. Same — deterministic. */
  checkOutDate:     string
  /** checkOut - checkIn in days. Sanity-checkable in tests. */
  nights:           number
  /** Provenance — drives analytics ('ai' vs 'fallback') and UI emphasis. */
  source:           AccommodationSource
  /** Quick fallback predicate — equivalent to `source === 'fallback'`. */
  fallback:         boolean
}

/**
 * Compute integer nights between two YYYY-MM-DD strings.
 * Same logic as `daysBetween` in TripResult — kept here so it's the
 * canonical reference for server-side computation.
 */
export function computeNights(start: string, end: string): number {
  if (!start || !end) return 0
  const s = new Date(`${start}T00:00:00Z`).getTime()
  const e = new Date(`${end}T00:00:00Z`).getTime()
  if (isNaN(s) || isNaN(e) || e <= s) return 0
  // 86_400_000 ms in a day. UTC-anchored so DST doesn't shift the count.
  return Math.round((e - s) / 86_400_000)
}

/** Derived: did the user request an overnight stay? */
export function isOvernight(nights: number): boolean {
  return nights >= 1
}

/**
 * The minimal trip context every accommodation layer needs.
 * Avoids passing the whole trip object around when we only care
 * about deterministic fields.
 */
export interface TripDestinationContext {
  destination: string
  /** ISO YYYY-MM-DD. */
  start:       string
  /** ISO YYYY-MM-DD. */
  end:         string
  nights:      number
  adults?:     number
  locale?:     'es' | 'en'
}
