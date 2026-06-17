import { test, expect } from '@playwright/test'
import { gotoTrip, seedTrip, deleteTrip, loginAs, captureWindowOpen } from '../support/helpers'
import { TRIP_ANONYMOUS, TRIP_OWNER } from '../fixtures/trips'

// Progress bar + Save/Share/PDF toolbar — QA cases E-43..E-48.
// See docs/qa/mobile-view-test-cases.md.
//
// TRIP_ANONYMOUS seeds 10 derived checks + a 4-item packing list, 4 done
// (pretrip-book-hotel + check-item-2 + packed [0,2]) → header starts at
// "29% · 4/14 tareas". The progress bar lives in the trip subheader (above the
// tabs) so it stays visible across tab switches. The "Guardado" indicator is
// owner-only; Compartir + PDF show for everyone.
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

  test('E-43: progress bar shows the label, percentage and done/total', async ({ page }) => {
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await expect(page.getByText('Progreso del viaje')).toBeVisible()
    await expect(page.getByText(/% · \d+\/\d+ tareas/)).toContainText('29% · 4/14 tareas')
  })

  test('E-44: progress aggregates per-day + pre-trip + packing into one counter', async ({ page }) => {
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    const stat = page.getByText(/% · \d+\/\d+ tareas/)
    await expect(stat).toContainText('4/14')
    // per-day check (Itinerario, day 1)
    await page.getByRole('button').filter({ hasText: 'Reservar mesa: Cena en El Cardenal' }).click()
    await expect(stat).toContainText('5/14')
    // pre-trip check + packing item (Preparativos) — same header counter
    await page.getByRole('button', { name: 'Preparativos' }).click()
    await page.getByRole('button').filter({ hasText: 'Empacar maleta' }).first().click()
    await expect(stat).toContainText('6/14')
    await page.getByRole('button').filter({ hasText: 'Paraguas' }).click()
    await expect(stat).toContainText('7/14')
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
