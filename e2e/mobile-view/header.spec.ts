import { test, expect } from '@playwright/test'
import { gotoTrip, seedTrip, deleteTrip, loginAs, captureWindowOpen } from '../support/helpers'
import { TRIP_ANONYMOUS, TRIP_OWNER } from '../fixtures/trips'

// Progress bar + Save/Share/PDF toolbar — QA cases E-43..E-48.
// See docs/qa/mobile-view-test-cases.md.
//
// TRIP_ANONYMOUS seeds 10 derived checks, 2 done (pretrip-book-hotel +
// check-item-2) → the Trip Readiness header starts at "Tu viaje está 20% listo
// · Te faltan 8 pasos". Readiness is CHECKS-only (parity with the planner bar);
// the packing list has its own counter in Preparativos and does NOT move the
// readiness number. The header lives in the trip subheader (above the tabs) so
// it stays attached across tab switches. "Guardado" is owner-only; Compartir +
// PDF show for everyone.
test.describe('mobile-view · header & toolbar', () => {
  const created: string[] = []
  async function seed(fixture: Parameters<typeof seedTrip>[0]) {
    const id = await seedTrip(fixture)
    created.push(id)
    return id
  }
  test.afterEach(async () => {
    while (created.length) await deleteTrip(created.pop() as string)
  })

  test('E-43: readiness header shows the % and remaining steps', async ({ page }) => {
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await expect(page.getByText('Tu viaje está 20% listo')).toBeVisible()
    await expect(page.getByText(/Te faltan 8 pasos/)).toBeVisible()
  })

  test('E-44: readiness aggregates checks (per-day + pre-trip), not packing', async ({ page }) => {
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    const sub = page.getByText(/Te faltan \d+ pasos/)
    await expect(sub).toContainText('8')
    // per-day check (Itinerario, day 1) → readiness drops a step
    await page.getByRole('button').filter({ hasText: 'Reservar mesa: Cena en El Cardenal' }).click()
    await expect(sub).toContainText('7')
    // pre-trip check (Preparativos) → also counts
    await page.getByRole('button', { name: 'Preparativos' }).click()
    await page.getByRole('button').filter({ hasText: 'Empacar maleta' }).first().click()
    await expect(sub).toContainText('6')
    // packing item toggles its own counter but NOT readiness (checks-only)
    await page.getByRole('button').filter({ hasText: 'Paraguas' }).click()
    await expect(sub).toContainText('6')
  })

  test('E-45: owner sees Guardado + Compartir + PDF', async ({ page }) => {
    const ownerId = await loginAs(page)
    const id = await seed({ ...TRIP_OWNER, user_id: ownerId })
    await gotoTrip(page, id)
    await expect(page.getByText('Guardado')).toBeVisible()
    await expect(page.getByRole('button', { name: /Compartir/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /PDF/ })).toBeVisible()
  })

  test('E-46: a non-owner sees Compartir + PDF but no Guardado', async ({ page }) => {
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await expect(page.getByRole('button', { name: /Compartir/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /PDF/ })).toBeVisible()
    await expect(page.getByText('Guardado')).toHaveCount(0)
  })

  test('E-47: Compartir (owner) opens the share-link modal', async ({ page }) => {
    const ownerId = await loginAs(page)
    const id = await seed({ ...TRIP_OWNER, user_id: ownerId })
    await gotoTrip(page, id)
    await page.getByRole('button', { name: /Compartir/ }).click()
    // Scope to the share dialog (a cookie-consent banner is also role=dialog).
    await expect(page.getByRole('dialog', { name: /Compartir viaje/ })).toBeVisible()
  })

  test('E-48: PDF opens the planner print layout (full=1&print=1) in a new tab', async ({ page }) => {
    const opened = await captureWindowOpen(page)   // stub window.open before navigation
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByRole('button', { name: /PDF/ }).click()
    const url = await opened.last()
    expect(url).toContain(`/planner?trip_id=${id}`)
    expect(url).toContain('full=1')
    expect(url).toContain('print=1')
  })
})
