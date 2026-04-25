/**
 * lib/plan/limits.ts
 *
 * Single source of truth for all freemium limits. Never hardcode these numbers
 * elsewhere — read from here so product can tune limits in one place.
 */

/**
 * Lifetime free trips for a signed-up user before the paywall is enforced.
 * Existing users keep whatever `trips_remaining` they were seeded with;
 * this value only applies to newly-created entitlement rows.
 */
export const FREE_TRIPS_LIMIT = 5

/**
 * Free trip generations for an anonymous user (cookie-tracked) before the
 * sign-up wall. After this limit the user is redirected to /signup.
 */
export const ANON_TRIP_LIMIT = 1

/**
 * Free guide detail-page views for an anonymous user before the soft login
 * prompt ("create an account to explore more guides"). Tracked in
 * localStorage; clearing storage resets (acceptable for now).
 */
export const FREE_GUIDE_VIEWS = 1

/**
 * Duration threshold (in days) above which trip generation is routed through
 * the async job pipeline instead of the synchronous /api/generate-trip
 * endpoint. Short trips stay on sync (fast path); long trips use the
 * chunked worker + polling flow which scales reliably with duration.
 *
 * Set to Infinity to route everything back to the sync endpoint (rollback lever).
 * Start conservative; lower over time as confidence grows.
 */
export const ASYNC_THRESHOLD = 10

/**
 * Given a PlanState-ish object, returns the number of trips the user has
 * used out of FREE_TRIPS_LIMIT. Always floors at 0.
 */
export function tripsUsed(trips_used: number | undefined): number {
  return Math.max(0, trips_used ?? 0)
}

/**
 * True when a free-tier user has consumed all their free trips.
 * Paid users (per_trip, explorer) always return false.
 */
export function isFreeTierExhausted(
  tier: string,
  trips_remaining: number,
): boolean {
  return tier === 'free' && trips_remaining <= 0
}
