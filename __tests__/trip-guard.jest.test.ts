/**
 * __tests__/trip-guard.jest.test.ts
 *
 * Unit tests for shouldRequireAuthForLargeTrip (lib/plan/limits.ts) — the
 * pre-flight guard TripResult.tsx calls before generate/regenerate/replaceTrip
 * to keep an anonymous caller from falling through to the sync endpoint on a
 * trip only the (auth-only) async/chunked pipeline can safely handle.
 *
 * Assertions are written relative to ASYNC_THRESHOLD, not hardcoded day
 * counts, so raising the threshold later (see project notes on a 7-day
 * anon-visible limit) doesn't require touching this file.
 */
import { shouldRequireAuthForLargeTrip, ASYNC_THRESHOLD } from '../lib/plan/limits'

describe('shouldRequireAuthForLargeTrip', () => {
  it('blocks an anonymous user requesting a trip longer than ASYNC_THRESHOLD', () => {
    expect(
      shouldRequireAuthForLargeTrip(false, { duration_days: ASYNC_THRESHOLD + 1, isMultiCity: false })
    ).toBe(true)
  })

  it('blocks an anonymous user requesting a multi-city trip regardless of duration', () => {
    expect(
      shouldRequireAuthForLargeTrip(false, { duration_days: 1, isMultiCity: true })
    ).toBe(true)
  })

  it('allows an anonymous user at or under the threshold, single-city', () => {
    expect(
      shouldRequireAuthForLargeTrip(false, { duration_days: ASYNC_THRESHOLD, isMultiCity: false })
    ).toBe(false)
  })

  it('never blocks an authenticated user, regardless of size', () => {
    expect(
      shouldRequireAuthForLargeTrip(true, { duration_days: ASYNC_THRESHOLD + 25, isMultiCity: true })
    ).toBe(false)
  })
})
