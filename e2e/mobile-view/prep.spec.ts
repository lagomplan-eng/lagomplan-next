import { test, expect } from '@playwright/test'
import { gotoTrip, seedTrip, deleteTrip } from '../support/helpers'
import { TRIP_ANONYMOUS } from '../fixtures/trips'

// Preparativos (pre-trip checklist + packing) — QA cases E-37..E-42.
// Anonymous fixture: canEdit=true, persistence is localStorage (same browser
// context survives reload). The seeded trip derives 5 pre-trip checks
// (book-hotel pre-done → 1/5) and a 4-item packing list with [0,2] pre-packed
// → 2/4. The Trip Readiness header (checks-only) starts at 20% · "Te faltan 8
// pasos" (10 checks, 2 done); the packing list has its own counter and does NOT
// move readiness. E-41's owner/DB persistence is covered via the anon path.
test.describe('mobile-view · preparativos', () => {
  let tripId: string
  test.beforeEach(async ({ page }) => {
    tripId = await seedTrip(TRIP_ANONYMOUS)
    await gotoTrip(page, tripId)
    await page.getByRole('button', { name: 'Preparativos' }).click()
  })
  test.afterEach(async () => { if (tripId) await deleteTrip(tripId) })

  test('E-37: tab "Preparativos" shows "Antes de salir" + packing sections', async ({ page }) => {
    await expect(page.getByText('Antes de salir').first()).toBeVisible()
    await expect(page.getByText('Lista de equipaje')).toBeVisible()
  })

  test('E-38: "Antes de salir" lists pre-trip checks (book hotel, pack, …)', async ({ page }) => {
    // Scope to the prep card — "1/5" also appears in the readiness milestone pills.
    const card = page.getByTestId('prep-before')
    await expect(card.getByText('Reservar hotel')).toBeVisible()
    await expect(card.getByText('1/5')).toBeVisible()   // 5 pre-trip checks, 1 pre-done
  })

  test('E-39: checking a pre-trip item updates the readiness header', async ({ page }) => {
    const sub = page.getByTestId('readiness').getByText(/Te faltan \d+ pasos/)
    await expect(sub).toContainText('8')   // 10 checks, 2 done
    // "Reservar hotel" is pre-done; toggle an unchecked item so done increments.
    await page.getByRole('button').filter({ hasText: 'Empacar maleta' }).first().click()
    await expect(sub).toContainText('7')
  })

  test('E-40: packing items render; tapping toggles packed; counter X/Y updates', async ({ page }) => {
    await expect(page.getByText('2/4 empacado')).toBeVisible()
    await page.getByRole('button').filter({ hasText: 'Paraguas' }).click()   // index 1, unpacked
    await expect(page.getByText('3/4 empacado')).toBeVisible()
  })

  test('E-41: packing state persists after reload (anon → localStorage)', async ({ page }) => {
    await page.getByRole('button').filter({ hasText: 'Paraguas' }).click()
    await expect(page.getByText('3/4 empacado')).toBeVisible()
    await page.waitForTimeout(1000)   // debounced localStorage write (700ms)
    await page.reload()
    await page.getByRole('button', { name: 'Preparativos' }).click()
    await expect(page.getByText('3/4 empacado')).toBeVisible()
  })

  test('E-42: empty packing list → packing section omitted (no crash)', async ({ page }) => {
    const noPacking = JSON.parse(JSON.stringify(TRIP_ANONYMOUS))
    noPacking.trip_data.packing = []
    const id = await seedTrip(noPacking)
    try {
      await gotoTrip(page, id)
      await page.getByRole('button', { name: 'Preparativos' }).click()
      await expect(page.getByText('Antes de salir').first()).toBeVisible()   // still renders
      await expect(page.getByText('Lista de equipaje')).toHaveCount(0)        // packing omitted
    } finally {
      await deleteTrip(id)
    }
  })
})
