import { test, expect } from '@playwright/test'
import {
  gotoTrip, seedTrip, deleteTrip, captureGaEvents, captureWindowOpen,
} from '../support/helpers'
import { TRIP_ANONYMOUS } from '../fixtures/trips'

// Entry point + GA4 analytics — QA cases E-57..E-65.
// See docs/qa/mobile-view-test-cases.md.
//
// captureGaEvents stubs window.gtag before load, so events.* → gaTrack →
// window.gtag are recorded regardless of the real consent-gated loader.
// TRIP_ANONYMOUS (canEdit, no auth) is past-dated, so it opens on day 1
// (index 0) — see getTodayDayIndex.
test.describe('mobile-view · entry point & analytics', () => {
  const created: string[] = []
  async function seed(fixture: Parameters<typeof seedTrip>[0]) {
    const id = await seedTrip(fixture)
    created.push(id)
    return id
  }
  test.afterEach(async () => {
    while (created.length) await deleteTrip(created.pop() as string)
  })

  // E-57 (desktop planner "Vista móvil" entry link) is deferred: the link lives
  // on the heavy planner result page and only becomes a real anchor once its
  // `tripId` state hydrates after the trip loads/streams — too load-state-
  // dependent to drive reliably here. It's a planner entry-point case, not part
  // of the mobile view; the mobile route itself is covered by load.spec.
  test.fixme('E-57: planner "Vista móvil" link opens the mobile route in a new tab', async () => {})

  test('E-59: mobile_view_day_switched fires on pill tap (with day_index)', async ({ page }) => {
    const ga = await captureGaEvents(page)
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByRole('button', { name: /^Día 3 / }).click()
    expect(await ga.find('mobile_view_day_switched')).toMatchObject({ trip_id: id, day_index: 2 })
  })

  test('E-60: mobile_view_tab_switched fires per tab (Preparativos id = "packing")', async ({ page }) => {
    const ga = await captureGaEvents(page)
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByRole('button', { name: 'Presupuesto' }).click()
    await page.getByRole('button', { name: 'Preparativos' }).click()
    const tabs = (await ga.all())
      .filter((a: any[]) => a[1] === 'mobile_view_tab_switched')
      .map((a: any[]) => a[2]?.tab)
    expect(tabs).toContain('budget')
    expect(tabs).toContain('packing')
  })

  test('E-61: mobile_view_activity_expanded fires on expand', async ({ page }) => {
    const ga = await captureGaEvents(page)
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByText('Cena en El Cardenal', { exact: true }).click()
    expect(await ga.find('mobile_view_activity_expanded')).toMatchObject({
      trip_id: id, activity_type: 'restaurant', day_index: 0,
    })
  })

  test('E-62: mobile_view_note_saved fires with has_note/has_link flags', async ({ page }) => {
    const ga = await captureGaEvents(page)
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByText('Cena en El Cardenal', { exact: true }).click()
    await page.getByPlaceholder('Pedir mesa en terraza, llevar efectivo…').fill('Reservé mesa')
    await page.getByPlaceholder('https://…').fill('https://restaurante.com')
    await page.getByRole('button', { name: 'Guardar', exact: true }).click()
    expect(await ga.find('mobile_view_note_saved')).toMatchObject({
      trip_id: id, has_note: true, has_link: true,
    })
  })

  test('E-63: mobile_view_task_completed fires with task_id on check', async ({ page }) => {
    const ga = await captureGaEvents(page)
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByRole('button').filter({ hasText: 'Reservar mesa: Cena en El Cardenal' }).click()
    expect(await ga.find('mobile_view_task_completed')).toMatchObject({
      trip_id: id, task_id: 'check-item-1',
    })
  })

  test('E-64: mobile_view_newsletter_captured fires on a valid email submit', async ({ page }) => {
    const ga = await captureGaEvents(page)
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByPlaceholder('tu@email.com').fill('e2e-news@test.local')
    await page.getByRole('button', { name: /Suscribirse/ }).click()
    // submitNewsletter awaits the /api/subscribe POST before firing the event +
    // flipping to the done state — wait for that so find() doesn't race it.
    await expect(page.getByText('¡Listo, estás dentro! 🌿')).toBeVisible()
    expect(await ga.find('mobile_view_newsletter_captured')).toMatchObject({ trip_id: id })
  })

  test('E-65: a booking-drawer option fires affiliate_clicked', async ({ page }) => {
    const ga = await captureGaEvents(page)
    await captureWindowOpen(page)   // swallow the provider tab the option opens
    const id = await seed(TRIP_ANONYMOUS)
    await gotoTrip(page, id)
    await page.getByText('Zócalo y Templo Mayor', { exact: true }).click()   // tour, day 1
    await page.getByRole('button', { name: /Reservar tour →/ }).click()
    await page.getByRole('button', { name: /GetYourGuide/ }).click()
    expect(await ga.find('affiliate_clicked')).toMatchObject({
      provider: 'gyg', surface: 'mobile-view', category: 'tour', trip_id: id,
    })
  })
})
