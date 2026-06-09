import { test } from '@playwright/test'

// Auth states (anonymous / owner / companion) + auto-redirect — QA cases
// E-49..E-56 and I-27..I-30. See docs/qa/mobile-view-test-cases.md.
test.describe('mobile-view · auth states', () => {
  test.fixme('E-49: anonymous shows "Inicia sesión"; logged-in shows avatar', async () => {})
  test.fixme('E-50: login nudge visible (anon); dismiss with ×; stays dismissed across day switches', async () => {})
  test.fixme('E-51: nudge copy rotates on day switch', async () => {})
  test.fixme('E-52: nudge "Inicia sesión" scrolls to newsletter on Itinerario; triggers login elsewhere', async () => {})
  test.fixme('E-53: newsletter card (anon) — valid email → inline confirmation; invalid → error toast', async () => {})
  test.fixme('E-54: logged-in hides newsletter + nudge', async () => {})
  test.fixme('E-55: owner "Editar plan →" → full planner (?full=1, no redirect loop)', async () => {})
  test.fixme('E-56: non-owner "Planea el tuyo →" → main planner', async () => {})

  // Mobile auto-redirect (planner page)
  test.fixme('I-27: mobile UA on /planner?trip_id=X → redirects to /trips/X', async () => {})
  test.fixme('I-28: /planner?trip_id=X&full=1 → no redirect (full planner)', async () => {})
})
