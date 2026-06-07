import { test, expect } from '@playwright/test'
import { gotoTrip, captureGaEvents } from '../support/helpers'
import { TRIP_OWNER } from '../fixtures/trips'

// Mobile-view load & routing — QA cases E-01..E-06.
// Stubs use test.fixme (skipped) until seedTrip/loginAs + selectors are wired.
// See docs/qa/mobile-view-test-cases.md for the full plan.

test.describe('mobile-view · load & route', () => {
  // test.beforeEach(async ({ page }) => { await seedTrip(page, TRIP_OWNER) })

  test.fixme('E-01: trip title shows in the subheader', async ({ page }) => {
    await gotoTrip(page, TRIP_OWNER.id)
    await expect(page.getByText('Fin de semana en CDMX')).toBeVisible()
  })

  test.fixme('E-02: Itinerario tab active by default', async ({ page }) => {
    await gotoTrip(page, TRIP_OWNER.id)
    // TODO: assert the Itinerario tab has the active style (border-b + pine text)
  })

  test.fixme('E-03: the "today" day pill is highlighted (today within trip)', async ({ page }) => {
    // TODO: set a clock within the trip dates (page.clock) then assert active pill
  })

  test.fixme('E-04: unknown trip_id redirects to the locale home', async ({ page }) => {
    await gotoTrip(page, 'does-not-exist')
    await expect(page).toHaveURL(/\/es\/?$/)
  })

  test.fixme('E-05: renders on WebKit without layout breaks', async () => {
    // Run under the `mobile-safari` project; assert no horizontal scroll, no overlap
  })

  test.fixme('E-06: renders on Chromium desktop (single column)', async () => {
    // Run under `desktop-chrome`
  })

  test.fixme('E-58: mobile_view_opened fires with trip_id/is_owner/day_index', async ({ page }) => {
    const ga = await captureGaEvents(page)
    await gotoTrip(page, TRIP_OWNER.id)
    expect(await ga.find('mobile_view_opened')).toMatchObject({ trip_id: TRIP_OWNER.id })
  })
})
