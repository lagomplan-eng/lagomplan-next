import { test, expect } from '@playwright/test'
import { gotoTrip, seedTrip, deleteTrip, loginAs } from '../support/helpers'
import { TRIP_ANONYMOUS, TRIP_OWNER } from '../fixtures/trips'

// Auth states (anonymous / owner) + subheader CTAs — QA cases E-49..E-56.
// The anonymous block needs no session; the logged-in block uses loginAs, which
// signs in through the real /login UI so @supabase/ssr sets cookies the server
// route reads. E-55 in particular proves SSR sees the owner (isOwner is computed
// server-side from the cookie), not just the client.

test.describe('mobile-view · auth (anonymous)', () => {
  let tripId: string
  test.beforeEach(async ({ page }) => {
    tripId = await seedTrip(TRIP_ANONYMOUS)
    await gotoTrip(page, tripId)
  })
  test.afterEach(async () => { if (tripId) await deleteTrip(tripId) })

  test('E-49: anonymous shows the "Inicia sesión" nudge', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Inicia sesión' })).toBeVisible()
  })

  test('E-50: nudge dismiss (×) hides it and it stays hidden across day switches', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Inicia sesión' })).toBeVisible()
    await page.getByRole('button', { name: 'Dismiss' }).click()
    await expect(page.getByRole('button', { name: 'Inicia sesión' })).toHaveCount(0)
    await page.getByRole('button').filter({ hasText: 'Día 1' }).click()
    await expect(page.getByRole('button', { name: 'Inicia sesión' })).toHaveCount(0)
  })

  test('E-51: nudge copy rotates on day switch', async ({ page }) => {
    await expect(page.getByText('Guarda tu progreso')).toBeVisible()
    await page.getByRole('button').filter({ hasText: 'Día 1' }).click()
    await expect(page.getByText('¿Ya reservaste algo?')).toBeVisible()
  })

  test('E-52: nudge focuses the newsletter on Itinerario, navigates to login elsewhere', async ({ page }) => {
    await page.getByRole('button', { name: 'Inicia sesión' }).click()
    await expect(page.getByPlaceholder('tu@email.com')).toBeFocused()      // Itinerario → scroll+focus
    await page.getByRole('button', { name: 'Presupuesto' }).click()
    await page.getByRole('button', { name: 'Inicia sesión' }).click()
    await page.waitForURL(/\/login/)                                       // off Itinerario → login
  })

  test('E-53: newsletter — invalid email → error toast; valid → inline confirmation', async ({ page }) => {
    const email = page.getByPlaceholder('tu@email.com')
    await email.fill('not-an-email')
    await page.getByRole('button', { name: /Suscribirse/ }).click()
    await expect(page.getByText('Ingresa un email válido')).toBeVisible()
    await email.fill('e2e@example.com')
    await page.getByRole('button', { name: /Suscribirse/ }).click()
    await expect(page.getByText(/¡Listo, estás dentro!/)).toBeVisible()
  })

  test('E-56: non-owner "Planea el tuyo →" goes to the main planner', async ({ page }) => {
    await page.getByRole('link', { name: /Planea el tuyo/ }).click()
    await page.waitForURL(/\/planificador/)
    await expect(page).not.toHaveURL(/full=1/)
  })
})

test.describe('mobile-view · auth (logged-in owner)', () => {
  let tripId: string
  test.beforeEach(async ({ page }) => {
    const userId = await loginAs(page)
    tripId = await seedTrip({ ...JSON.parse(JSON.stringify(TRIP_OWNER)), user_id: userId })
    await gotoTrip(page, tripId)
  })
  test.afterEach(async () => { if (tripId) await deleteTrip(tripId) })

  test('E-54: logged-in hides the newsletter card and the login nudge', async ({ page }) => {
    await expect(page.getByText('Fin de semana en CDMX')).toBeVisible()     // view loaded
    await expect(page.getByRole('button', { name: 'Inicia sesión' })).toHaveCount(0)
    await expect(page.getByText('¿Te gustó este plan?')).toHaveCount(0)
  })

  test('E-55: owner "Editor completo →" opens the full planner (?full=1, no redirect loop)', async ({ page }) => {
    // isOwner is server-computed — this link only appears if SSR read the cookie.
    await page.getByRole('link', { name: /Editor completo/ }).click()
    await page.waitForURL(/\/planificador\?.*full=1/)
  })
})

// I-27/I-28 (mobile-UA auto-redirect on /planner?trip_id) belong to a
// mobile-project planner spec — deferred (need a mobile UA + planner trip load).
test.fixme('I-27: mobile UA on /planner?trip_id=X → redirects to /trips/X', async () => {})
test.fixme('I-28: /planner?trip_id=X&full=1 → no redirect (full planner)', async () => {})
