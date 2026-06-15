import { test, expect } from '@playwright/test'
import { gotoTrip, seedTrip, deleteTrip } from '../support/helpers'
import { TRIP_ANONYMOUS } from '../fixtures/trips'

// Mobile-view load & routing — QA cases E-01..E-06, E-58.
// Seeds an ANONYMOUS trip (accessible without auth) into the test DB; the row is
// server-side-loaded by the route, so it must really exist. Owner-only behaviour
// lives in the activities/auth specs (which use loginAs).
test.describe('mobile-view · load & route', () => {
  let tripId: string
  test.beforeEach(async () => { tripId = await seedTrip(TRIP_ANONYMOUS) })
  test.afterEach(async () => { if (tripId) await deleteTrip(tripId) })

  test('E-01: trip title shows in the subheader', async ({ page }) => {
    await gotoTrip(page, tripId)
    await expect(page.getByText('Fin de semana en CDMX')).toBeVisible()
  })

  test('E-02: Itinerario is the default tab (hotel + itinerary content shown)', async ({ page }) => {
    await gotoTrip(page, tripId)
    // Day-independent Itinerario content (the trip is past-dated, so "today"
    // clamps to the last day — don't assert a specific day's title).
    await expect(page.getByText('Reservar para este viaje').first()).toBeVisible()
  })

  test('E-04: unknown trip_id redirects to the locale home', async ({ page }) => {
    await gotoTrip(page, '00000000-0000-0000-0000-000000000000')
    await expect(page).toHaveURL(/\/es\/?(\?|$)/)
  })

  // E-58 (mobile_view_opened) is consent-gated + needs NEXT_PUBLIC_GA_MEASUREMENT_ID;
  // verify it in an analytics-focused spec that grants consent first.
  test.fixme('E-58: mobile_view_opened fires with the trip_id', async () => {})

  // E-03 needs page.clock to pin "today" inside the trip dates; E-05/E-06 are
  // cross-engine render checks driven by the project matrix. Deferred.
  test.fixme('E-03: the "today" day pill is highlighted (today within trip)', async () => {})
  test.fixme('E-05: renders on WebKit without layout breaks', async () => {})
  test.fixme('E-06: renders on Chromium desktop (single column)', async () => {})
})
