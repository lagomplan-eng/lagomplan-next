// lib/planner/booking.ts
//
// Pure helpers for the "Ya reservé" confirmation flow. Extracted from
// app/api/trips/[trip_id]/booking-confirm/route.ts so the logic is
// testable without spinning up a Next.js server or mocking Supabase.

const MAX_BOOKING_URL_LEN  = 500
const MAX_POSITION_INDEX   = 50

/**
 * Validate + canonicalize a user-supplied booking URL. Accepts only
 * `http:` and `https:` schemes — `javascript:`, `data:`, and anything
 * else gets rejected so the "Ver en Booking" CTA can't be turned into
 * an XSS vector. Returns `undefined` for anything invalid; callers
 * should treat that as "no URL set" and fall back to the affiliate
 * search link.
 */
export function sanitizeBookingUrl(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined
  const trimmed = raw.trim().slice(0, MAX_BOOKING_URL_LEN)
  if (!trimmed) return undefined
  try {
    const u = new URL(trimmed)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return undefined
    return u.toString()
  } catch {
    return undefined
  }
}

/**
 * Resolve the array index inside `trip_data.accommodations` that a
 * given client-supplied `accommodationId` should target.
 *
 * Two client id schemes exist:
 *   - "acc-N"               position-indexed (TripResult.tsx normalizer)
 *                           when the AI emitted accommodations
 *   - "acc-fallback-{slug}" deterministic per-destination
 *                           (lib/planner/fallback-accommodations.ts)
 *                           when the AI emitted none and the client
 *                           synthesized one
 *
 * Resolution order:
 *   1. Match by stored `id` — happens when an earlier save stamped it.
 *   2. "acc-N" → array index N (capped at 50 as a tamper guard so a
 *      malicious client can't force us to pad an unbounded array).
 *   3. Anything else (e.g. "acc-fallback-…") → append. The fallback
 *      synthesizer only ever emits one entry per render, so there's
 *      no ambiguity about which row the user is confirming.
 *
 * The caller is responsible for padding the array up to the returned
 * index — this function is pure and does not mutate input.
 */
export function resolveAccommodationIndex(
  accommodations: ReadonlyArray<{ id?: string } | null | undefined>,
  accommodationId: string,
): number {
  const byId = accommodations.findIndex(a => !!a && a.id === accommodationId)
  if (byId >= 0) return byId

  const positionMatch = accommodationId.match(/^acc-(\d+)$/)
  if (positionMatch) {
    const n = parseInt(positionMatch[1], 10)
    if (Number.isFinite(n) && n >= 0 && n < MAX_POSITION_INDEX) {
      return n
    }
    // Out-of-range "acc-N" falls through to append rather than error —
    // an attacker padding to index 9999 is the real concern; a
    // legitimate trip will never need >50 accommodations.
  }

  return accommodations.length
}
