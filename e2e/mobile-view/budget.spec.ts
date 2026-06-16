import { test, expect, type Locator } from '@playwright/test'
import { gotoTrip, seedTrip, deleteTrip } from '../support/helpers'
import { TRIP_ANONYMOUS } from '../fixtures/trips'

// Presupuesto — QA cases E-30..E-36. Anonymous fixture (canEdit=true, two
// inputs per row, localStorage persistence). Seeded budget: ai total 6900,
// confirmed 1180 (only Contramar has an actual), travelers "pareja" → 2.
// E-35 (read-only viewer) needs a logged-in non-owner on a shared trip → owner
// spec.
test.describe('mobile-view · budget', () => {
  let tripId: string
  test.beforeEach(async ({ page }) => {
    tripId = await seedTrip(TRIP_ANONYMOUS)
    await gotoTrip(page, tripId)
    await page.getByRole('button', { name: 'Presupuesto' }).click()
  })
  test.afterEach(async () => { if (tripId) await deleteTrip(tripId) })

  // A budget row by its label → its two number inputs (nth0 = Tu, nth1 = Real).
  const row = (page: import('@playwright/test').Page, label: string): Locator =>
    page.locator('div').filter({ has: page.locator('input[type="number"]') }).filter({ hasText: label }).last()

  test('E-30: three totals — IA estimó / Tu estimado / Confirmado', async ({ page }) => {
    await expect(page.getByText('IA estimó').first()).toBeVisible()
    await expect(page.getByText('Tu estimado')).toBeVisible()
    await expect(page.getByText('Confirmado')).toBeVisible()
  })

  // The Confirmado *total* cell — scoped because $1,180 also appears as the
  // Gastronomía subtotal (that category's single row carries the only actual).
  const confirmedTotal = (page: import('@playwright/test').Page): Locator =>
    page.getByText('Confirmado', { exact: true }).locator('..')

  test('E-31: Total default; Por persona divides by traveler count', async ({ page }) => {
    await expect(confirmedTotal(page)).toContainText('$1,180')   // total view
    await page.getByRole('button', { name: 'Por persona' }).click()
    await expect(confirmedTotal(page)).toContainText('$590')     // 1180 / 2
  })

  test('E-32: each row has TWO editable inputs — Tu and Real', async ({ page }) => {
    await expect(page.locator('input[type="number"]')).toHaveCount(8)        // 4 rows × 2
  })

  test('E-33: editing Real updates the Confirmado total', async ({ page }) => {
    await expect(confirmedTotal(page)).toContainText('$1,180')
    const real = row(page, 'Uber').locator('input[type="number"]').nth(1)
    await real.fill('820')
    await real.blur()
    await expect(confirmedTotal(page)).toContainText('$2,000')    // 1180 + 820
  })

  test('E-34: editing Tu updates Tu estimado total; persists after reload', async ({ page }) => {
    const tu = row(page, 'Frida Kahlo').locator('input[type="number"]').nth(0)
    await tu.fill('1000')
    await tu.blur()
    await expect(page.getByText('$7,400', { exact: true })).toBeVisible()    // 4500+1200+1000+700
    await page.waitForTimeout(1000)   // debounced localStorage write (700ms)
    await page.reload()
    await page.getByRole('button', { name: 'Presupuesto' }).click()
    await expect(page.getByText('$7,400', { exact: true })).toBeVisible()
  })

  test('E-36: site footer visible at bottom', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  // Read-only viewer (values as text, no inputs) requires a logged-in non-owner
  // on a shared trip — lives in the owner/auth spec that uses loginAs.
  test.fixme('E-35: read-only viewer sees values as text, no inputs', async () => {})
})
