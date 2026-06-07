import { test, expect } from '@playwright/test'
import { gotoTrip, captureGaEvents } from '../support/helpers'
import { TRIP_OWNER } from '../fixtures/trips'

// Entry point + GA4 analytics — QA cases E-57..E-65.
// See docs/qa/mobile-view-test-cases.md.
test.describe('mobile-view · entry point & analytics', () => {
  test.fixme('E-57: desktop plan-result header "📱 Vista móvil" opens the mobile route', async () => {
    // Run under desktop-chrome; from /es/planificador?trip_id=… click the link
  })

  test.fixme('E-59: mobile_view_day_switched fires on pill tap', async ({ page }) => {
    const ga = await captureGaEvents(page)
    await gotoTrip(page, TRIP_OWNER.id)
    // TODO: tap a day pill, then:
    expect(await ga.find('mobile_view_day_switched')).not.toBeNull()
  })

  test.fixme('E-60: mobile_view_tab_switched with tab itin/budget/packing (Preparativos id = "packing")', async () => {})
  test.fixme('E-61: mobile_view_activity_expanded on expand', async () => {})
  test.fixme('E-62: mobile_view_note_saved with has_note/has_link flags', async () => {})
  test.fixme('E-63: mobile_view_task_completed with task_id on check', async () => {})
  test.fixme('E-64: mobile_view_newsletter_captured on valid email submit', async () => {})
  test.fixme('E-65: booking drawer option fires affiliate_click + AffiliateClicked', async () => {})
})
