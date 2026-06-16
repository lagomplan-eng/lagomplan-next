import { test, expect } from '@playwright/test'
import {
  gotoTrip, seedTrip, deleteTrip, loginAs, captureWindowOpen,
} from '../support/helpers'
import {
  TRIP_ANONYMOUS, TRIP_OWNER, TRIP_OWNER_BOOKED, TRIP_MULTICITY, TRIP_NO_ACCOMMODATIONS,
} from '../fixtures/trips'

// Hotel card — QA cases E-23..E-29. See docs/qa/mobile-view-test-cases.md.
//
// The card lives in the Itinerary tab under "Dónde quedarse" for the current
// day's accommodation. Confirmed bookings are read back from
// trip_data.accommodations[].booking, so TRIP_OWNER_BOOKED renders confirmed
// without any persistence round-trip. The reserve CTA is an <a> (role=link)
// that opens a Stay22 deep link via window.open; "Agregar confirmación" /
// "Editar" toggle the inline confirmation form.
test.describe('mobile-view · hotel card', () => {
  const created: string[] = []
  async function seed(fixture: Parameters<typeof seedTrip>[0]) {
    const id = await seedTrip(fixture)
    created.push(id)
    return id
  }
  test.afterEach(async () => {
    while (created.length) await deleteTrip(created.pop() as string)
  })

  test('E-23: an unconfirmed hotel shows the reserve CTA + "Agregar confirmación"', async ({ page }) => {
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await expect(page.getByRole('link', { name: /Reservar para este viaje/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Agregar confirmación/ })).toBeVisible()
  })

  test('E-24: Reservar opens the Stay22 link in a new tab (no Booking.com hijack)', async ({ page }) => {
    const opened = await captureWindowOpen(page)   // stub window.open before navigation
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByRole('link', { name: /Reservar para este viaje/ }).click()
    const url = await opened.last()
    expect(url).toContain('stay22.com')
    expect(url).not.toContain('booking.com')
  })

  test('E-25: "Agregar confirmación" opens the inline form; the code is required', async ({ page }) => {
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByRole('button', { name: /Agregar confirmación/ }).click()
    await expect(page.getByPlaceholder('BK-483920')).toBeVisible()
    // Submitting with an empty code is rejected with a validation message.
    await page.getByRole('button', { name: 'Guardar confirmación' }).click()
    await expect(page.getByText('El nº de confirmación es obligatorio.')).toBeVisible()
  })

  test('E-26: submitting the form flips the card to Reservado and persists after reload (owner)', async ({ page }) => {
    const ownerId = await loginAs(page)
    const id = await seed({ ...TRIP_OWNER, user_id: ownerId })
    await gotoTrip(page, id)
    await page.getByRole('button', { name: /Agregar confirmación/ }).click()
    await page.getByPlaceholder('BK-483920').fill('BK-998877')
    await page.getByPlaceholder('15:00').fill('14:00')
    const saved = page.waitForResponse(
      (r) => r.url().includes('/booking-confirm') && r.request().method() === 'PATCH' && r.ok(),
    )
    await page.getByRole('button', { name: 'Guardar confirmación' }).click()
    await saved
    await expect(page.getByText('✓ Reservado').first()).toBeVisible()
    await expect(page.getByText('BK-998877')).toBeVisible()
    await page.reload()
    await expect(page.getByText('✓ Reservado').first()).toBeVisible()
    await expect(page.getByText(/BK-998877.*Check-in 14:00/)).toBeVisible()
  })

  test('E-27: a confirmed card shows Editar + "Ver en Booking" (booking URL saved)', async ({ page }) => {
    const id = await seed({ ...TRIP_OWNER_BOOKED, user_id: null })   // anonymous → canEdit, confirmed via trip_data
    await gotoTrip(page, id)
    await expect(page.getByText('✓ Reservado').first()).toBeVisible()
    await expect(page.getByText('BK-483920')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Editar' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Ver en Booking/ })).toBeVisible()
  })

  test('E-28: a trip with no accommodations still renders the fallback hotel card + reserve CTA', async ({ page }) => {
    const id = await seed({ ...TRIP_NO_ACCOMMODATIONS, user_id: null })
    await gotoTrip(page, id)
    await expect(page.getByText('Dónde quedarse')).toBeVisible()
    await expect(page.getByRole('link', { name: /Reservar para este viaje/ })).toBeVisible()
  })

  test('E-29: multi-city shows the segment hotel for each day (CDMX → Oaxaca)', async ({ page }) => {
    const id = await seed({ ...TRIP_MULTICITY, user_id: null })
    await gotoTrip(page, id)
    // The trip is past-dated, so the view opens on the last day — select days
    // explicitly. Match the day pill by its anchored name ("Día N <weekday>
    // <done>/<total>") so it doesn't collide with the editable day-title button.
    // (exact:true scopes the city to the hotel-card title, not the header
    // subtitle "Mexico City · pareja · 5 días".)
    await page.getByRole('button', { name: /^Día 1 / }).click()
    await expect(page.getByText('Mexico City', { exact: true })).toBeVisible()   // CDMX stay
    await page.getByRole('button', { name: /^Día 4 / }).click()
    await expect(page.getByText('Oaxaca', { exact: true })).toBeVisible()        // Oaxaca stay
    await expect(page.getByText('Mexico City', { exact: true })).toHaveCount(0)
  })
})
