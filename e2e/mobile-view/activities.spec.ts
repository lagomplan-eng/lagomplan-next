import { test, expect } from '@playwright/test'
import {
  gotoTrip, seedTrip, deleteTrip, loginAs, createTestUser, captureWindowOpen,
} from '../support/helpers'
import { TRIP_ACTIVITIES } from '../fixtures/trips'

// Activities + booking drawer — QA cases E-14..E-22.
// See docs/qa/mobile-view-test-cases.md.
//
// Uses TRIP_ACTIVITIES (anonymous → canEdit=true, no login) whose single day
// carries one of each itinerary type:
//   act-tour  (tour)       → reserve verb "Reservar tour",     per-day check
//   act-rest  (restaurant) → reserve verb "Reservar mesa",     per-day check
//   act-transfer (transfer)→ reserve verb "Reservar traslado"; a day-1 transfer
//                            is a PRE-TRIP check (Preparativos), not per-day
//   act-free  (free)       → no reserve verb,                  no check
//
// A reserve CTA reads "Reservar <verb> →"; the per-day task buttons read
// "Reservar: <name>" / "Reservar mesa: <name>" — the trailing "→" disambiguates
// the CTA from the look-alike task button.
test.describe('mobile-view · activities & booking drawer', () => {
  const created: string[] = []
  async function seed(fixture: Parameters<typeof seedTrip>[0]) {
    const id = await seedTrip(fixture)
    created.push(id)
    return id
  }
  test.afterEach(async () => {
    while (created.length) await deleteTrip(created.pop() as string)
  })

  test('E-14: tapping an activity expands it; Guardar collapses it', async ({ page }) => {
    const id = await seed(TRIP_ACTIVITIES)
    await gotoTrip(page, id)
    await page.getByText('Comida en Pujol', { exact: true }).click()
    await expect(page.getByRole('button', { name: /Reservar mesa →/ })).toBeVisible()
    // The header stays open while editing — the single Guardar is the collapse.
    await page.getByRole('button', { name: 'Guardar', exact: true }).click()
    await expect(page.getByRole('button', { name: /Reservar mesa →/ })).toHaveCount(0)
  })

  test('E-15: reserve verb matches the activity type', async ({ page }) => {
    const id = await seed(TRIP_ACTIVITIES)
    await gotoTrip(page, id)
    await page.getByText('Tour a Teotihuacán', { exact: true }).click()
    await expect(page.getByRole('button', { name: /Reservar tour →/ })).toBeVisible()
    await page.getByText('Comida en Pujol', { exact: true }).click()
    await expect(page.getByRole('button', { name: /Reservar mesa →/ })).toBeVisible()
    await page.getByText('Traslado al aeropuerto', { exact: true }).click()
    await expect(page.getByRole('button', { name: /Reservar traslado →/ })).toBeVisible()
  })

  test('E-16: a free activity has no Reservar CTA', async ({ page }) => {
    const id = await seed(TRIP_ACTIVITIES)
    await gotoTrip(page, id)
    await page.getByText('Caminata por la Roma', { exact: true }).click()
    // It expanded (editor present) but offers no reserve CTA.
    await expect(page.getByRole('button', { name: 'Guardar', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: /Reservar .* →/ })).toHaveCount(0)
  })

  test('E-17: Reservar opens the booking drawer with provider options', async ({ page }) => {
    const id = await seed(TRIP_ACTIVITIES)
    await gotoTrip(page, id)
    await page.getByText('Tour a Teotihuacán', { exact: true }).click()
    await page.getByRole('button', { name: /Reservar tour →/ }).click()
    await expect(page.getByText('Elige dónde buscar disponibilidad')).toBeVisible()
    await expect(page.getByRole('button', { name: /GetYourGuide/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Expedia Actividades/ })).toBeVisible()
  })

  test('E-18: a drawer option opens its provider URL in a new tab (no Booking.com hijack) and closes the drawer', async ({ page }) => {
    const opened = await captureWindowOpen(page)   // must stub window.open before navigation
    const id = await seed(TRIP_ACTIVITIES)
    await gotoTrip(page, id)
    await page.getByText('Tour a Teotihuacán', { exact: true }).click()
    await page.getByRole('button', { name: /Reservar tour →/ }).click()
    await page.getByRole('button', { name: /GetYourGuide/ }).click()
    // Opened the Stay22 affiliate deep link in a new tab — NOT a Booking.com hijack.
    const url = await opened.last()
    expect(url).toContain('stay22.com')
    expect(url).not.toContain('booking.com')
    // Drawer closes after picking a provider.
    await expect(page.getByText('Elige dónde buscar disponibilidad')).toHaveCount(0)
  })

  test('E-19: confirm-done ticks the matching task in the day list', async ({ page }) => {
    const id = await seed(TRIP_ACTIVITIES)
    await gotoTrip(page, id)
    const tourTask = page.getByRole('button').filter({ hasText: 'Reservar: Tour a Teotihuacán' })
    await expect(tourTask).not.toContainText('✓')
    await page.getByText('Tour a Teotihuacán', { exact: true }).click()
    await page.getByRole('button', { name: /Tengo entrada/ }).click()
    await expect(tourTask).toContainText('✓')
  })

  test('E-20: a single Guardar saves both the note and the link', async ({ page }) => {
    const id = await seed(TRIP_ACTIVITIES)
    await gotoTrip(page, id)
    await page.getByText('Comida en Pujol', { exact: true }).click()
    await page.getByPlaceholder('Pedir mesa en terraza, llevar efectivo…').fill('Mesa junto a la ventana')
    await page.getByPlaceholder('https://…').fill('https://pujol.com.mx')
    await page.getByRole('button', { name: 'Guardar', exact: true }).click()
    await expect(page.getByText('Guardado ✓')).toBeVisible()
    // Collapsed row surfaces the saved note + a link indicator.
    await expect(page.getByText('📝 Mesa junto a la ventana')).toBeVisible()
    await expect(page.getByText('🔗')).toBeVisible()
  })

  test('E-21: saved note + link persist after reload (owner)', async ({ page }) => {
    const ownerId = await loginAs(page)
    const id = await seed({ ...TRIP_ACTIVITIES, user_id: ownerId })
    await gotoTrip(page, id)
    await page.getByText('Comida en Pujol', { exact: true }).click()
    await page.getByPlaceholder('Pedir mesa en terraza, llevar efectivo…').fill('Reservé a las 14h')
    await page.getByPlaceholder('https://…').fill('https://pujol.com.mx')
    const saved = page.waitForResponse(
      (r) => r.url().includes('/companion') && r.request().method() === 'PATCH' && r.ok(),
    )
    await page.getByRole('button', { name: 'Guardar', exact: true }).click()
    await saved
    await page.reload()
    await expect(page.getByText('📝 Reservé a las 14h')).toBeVisible()
  })

  test('E-22: a read-only viewer has no note/link/confirm controls, but the drawer still works', async ({ page }) => {
    const ownerId = await createTestUser('e2e-owner-shared@test.local')
    const id = await seed({ ...TRIP_ACTIVITIES, user_id: ownerId, is_shared: true })
    await loginAs(page, 'e2e-viewer@test.local')   // logged in as a NON-owner
    await gotoTrip(page, id)
    await page.getByText('Tour a Teotihuacán', { exact: true }).click()
    // No editing affordances…
    await expect(page.getByRole('button', { name: 'Guardar', exact: true })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Tengo entrada/ })).toHaveCount(0)
    await expect(page.getByPlaceholder('https://…')).toHaveCount(0)
    // …but the reserve CTA + drawer are still available.
    await page.getByRole('button', { name: /Reservar tour →/ }).click()
    await expect(page.getByText('Elige dónde buscar disponibilidad')).toBeVisible()
  })
})
