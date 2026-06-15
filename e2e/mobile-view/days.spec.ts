import { test, expect, type Page } from '@playwright/test'
import { gotoTrip, seedTrip, deleteTrip } from '../support/helpers'
import { TRIP_ANONYMOUS } from '../fixtures/trips'

// Day selector — QA cases E-07..E-13. See docs/qa/mobile-view-test-cases.md.
// Uses the anonymous fixture (canEdit=true, no auth). It is past-dated, so the
// "today" dot never shows — E-12 needs page.clock to pin a date inside the trip
// and stays deferred. Day pills carry a small "Día N" label + a done/total
// counter; tour+restaurant items each derive one per-day check, so the seeded
// trip yields Día1 0/2, Día2 1/2 (item-2 pre-done), Día3 0/1.
test.describe('mobile-view · day selector', () => {
  let tripId: string
  test.beforeEach(async ({ page }) => {
    tripId = await seedTrip(TRIP_ANONYMOUS)
    await gotoTrip(page, tripId)
  })
  test.afterEach(async () => { if (tripId) await deleteTrip(tripId) })

  const pill = (page: Page, n: number) =>
    page.getByRole('button').filter({ hasText: `Día ${n}` })

  test('E-07: tapping Día 3 shows Day 3 hero title', async ({ page }) => {
    await pill(page, 3).click()
    await expect(page.getByText('Coyoacán y Chapultepec')).toBeVisible()
  })

  test('E-08: day pill counter shows correct done/total for that day', async ({ page }) => {
    await expect(pill(page, 1)).toContainText('0/2')   // no day-1 tasks done
    await expect(pill(page, 2)).toContainText('1/2')   // check-item-2 pre-done
    await expect(pill(page, 3)).toContainText('0/1')   // only the tour derives a check
  })

  test('E-09: counter increments after checking a per-day task', async ({ page }) => {
    await pill(page, 1).click()
    await expect(pill(page, 1)).toContainText('0/2')
    // The "Por hacer · Día 1" list renders each derived check as a button.
    await page.getByRole('button').filter({ hasText: 'Zócalo y Templo Mayor' }).first().click()
    await expect(pill(page, 1)).toContainText('1/2')
  })

  test('E-11: active pill has a distinct visual state', async ({ page }) => {
    await pill(page, 1).click()
    await expect(pill(page, 1)).toHaveClass(/bg-\[#0F3A33\]/)   // active = dark fill
    await expect(pill(page, 2)).not.toHaveClass(/bg-\[#0F3A33\]/)
  })

  test('E-13: day selector hidden on Presupuesto & Preparativos tabs', async ({ page }) => {
    await expect(pill(page, 1)).toBeVisible()
    await page.getByRole('button', { name: 'Presupuesto' }).click()
    await expect(pill(page, 1)).toHaveCount(0)
    await page.getByRole('button', { name: 'Preparativos' }).click()
    await expect(pill(page, 1)).toHaveCount(0)
  })

  // E-12 (today dot only on current-day pill) needs page.clock to put "today"
  // inside the trip dates; E-10 (switch-day scrolls to top) is layout-height
  // dependent and not reliably observable headless. Deferred.
  test.fixme('E-10: switching day scrolls content to top', async () => {})
  test.fixme('E-12: "today" dot only on the current-day pill (today within trip)', async () => {})
})
