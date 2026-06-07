// e2e/support/helpers.ts
//
// Shared helpers for the mobile-view E2E suite. Most are thin wrappers; the
// TODO-marked ones depend on your test infra (how trips are seeded + how a
// session is established) and must be filled in by the tester — see
// e2e/README.md.

import type { Page } from '@playwright/test'

export const LOCALE = 'es'

/** Navigate to the mobile companion view for a trip id. */
export async function gotoTrip(page: Page, tripId: string) {
  await page.goto(`/${LOCALE}/trips/${tripId}`)
}

/**
 * Capture GA4 events. Stubs window.gtag BEFORE any app script runs and records
 * every call into window.__gaEvents. Returns a reader.
 *
 * Usage:
 *   const ga = await captureGaEvents(page)
 *   await gotoTrip(page, TRIP_OWNER.id)
 *   expect(await ga.find('mobile_view_opened')).toMatchObject({ is_owner: true })
 */
export async function captureGaEvents(page: Page) {
  await page.addInitScript(() => {
    ;(window as any).__gaEvents = []
    ;(window as any).gtag = (...args: any[]) => { (window as any).__gaEvents.push(args) }
    // dataLayer fallback some GA wrappers use
    ;(window as any).dataLayer = (window as any).dataLayer || []
  })
  return {
    /** All ['event', name, params] tuples recorded so far. */
    all: async () => page.evaluate(() => (window as any).__gaEvents ?? []),
    /** First params object logged for a given GA event name, or null. */
    find: async (name: string) =>
      page.evaluate((n) => {
        const ev = ((window as any).__gaEvents ?? []).find((a: any[]) => a[0] === 'event' && a[1] === n)
        return ev ? ev[2] ?? {} : null
      }, name),
  }
}

/**
 * TODO(tester): seed a trip row into the test Supabase project so the route
 * can load it. Options: (a) insert via the service-role client against a
 * dedicated test DB, then delete in afterEach; (b) intercept the trip read
 * with page.route() and fulfil with the fixture (no DB needed — good for pure
 * UI assertions). Pick one and implement.
 */
export async function seedTrip(_page: Page, _fixture: unknown): Promise<void> {
  throw new Error('seedTrip not implemented — see e2e/README.md')
}

/**
 * TODO(tester): establish a logged-in session for the given user id (set the
 * Supabase auth cookies, or sign in via the UI once and reuse storageState).
 * Leave unauthenticated for anonymous/companion cases.
 */
export async function loginAs(_page: Page, _userId: string): Promise<void> {
  throw new Error('loginAs not implemented — see e2e/README.md')
}
