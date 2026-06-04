/**
 * tests/e2e/regen-confirm-modal.spec.ts
 *
 * T-PW-03 — the regression test for the 2026-06-02 bug where the
 * "Vas a perder tus cambios" confirm modal silently failed to fire
 * when a user opened the prefs drawer, changed the destination, and
 * clicked "Actualizar plan". A second AI call would launch + a credit
 * would burn + the saved itinerary would be overwritten, with no
 * warning.
 *
 * The fix made the modal fire whenever `prefOpen || hasUserEdits` is
 * true at click time (TripResult.tsx:handleRegenClick). This spec
 * guards that exact code path.
 *
 * Stack note: the test loads a saved trip via the mocked
 * /api/trips/[id] GET so we start at "post-generation" state without
 * needing to drive the generator. The prefs drawer open state is the
 * only signal `handleRegenClick` cares about — we don't actually need
 * to change the destination value to trigger the modal.
 */

import { test, expect } from './fixtures/test'
import { TEST_TRIP_ID } from './fixtures/network-mocks'

test.describe('T-PW-03 — prefs-drawer regenerate fires confirm modal', () => {
  test('opening prefs + clicking "Actualizar plan" opens the modal', async ({
    page, trip,
  }) => {
    // Land on the planner with a known trip_id — the mocked /api/trips/
    // route returns our canned Mexico City trip so the hero renders
    // before we touch the drawer.
    await page.goto(`/es/planner?trip_id=${TEST_TRIP_ID}`)
    await expect(trip.hero).toBeVisible({ timeout: 15_000 })

    // Open the prefs drawer.
    await trip.prefDrawerToggle().click()
    await expect(trip.prefDrawer()).toBeVisible({ timeout: 5_000 })

    // Click "Actualizar plan". The modal should appear immediately —
    // no network round-trip required, the gate is purely client state.
    await page.getByRole('button', { name: /actualizar plan|update plan/i }).click()

    // The modal copy is the canonical assertion: "Vas a perder tus
    // cambios" / "You'll lose your changes". If this assertion fires
    // 0 elements found, the 2026-06-02 regression is back.
    await expect(trip.regenConfirmModal()).toBeVisible({ timeout: 5_000 })
  })

  test('"Cancelar" closes the modal without regenerating', async ({ page, trip }) => {
    await page.goto(`/es/planner?trip_id=${TEST_TRIP_ID}`)
    await expect(trip.hero).toBeVisible({ timeout: 15_000 })
    await trip.prefDrawerToggle().click()
    await page.getByRole('button', { name: /actualizar plan|update plan/i }).click()
    await expect(trip.regenConfirmModal()).toBeVisible()

    // The modal has three actions:
    //   "Reemplazar viaje"  (red, destructive)
    //   "Crear nuevo viaje" (white outline → /planner)
    //   "Cancelar"          (text-only, dismiss)
    // Scope inside the dialog — "Cancelar" also exists on the prefs
    // drawer and on the (mounted-but-hidden) booking form.
    const dialog = page.getByRole('dialog', { name: /vas a perder|lose your changes/i })
    await dialog.getByRole('button', { name: /^cancelar$|^cancel$/i }).click()
    await expect(trip.regenConfirmModal()).toBeHidden({ timeout: 3_000 })

    // Drawer should still be open — user can keep editing.
    await expect(trip.prefDrawer()).toBeVisible()
  })
})
