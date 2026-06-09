import { test } from '@playwright/test'

// Hotel card — QA cases E-23..E-29. See docs/qa/mobile-view-test-cases.md.
test.describe('mobile-view · hotel card', () => {
  test.fixme('E-23: unconfirmed → "Reservar para este viaje" + "¿Ya reservaste? Agregar confirmación"', async () => {})
  test.fixme('E-24: "Reservar…" opens the Stay22 link in a new tab (verify host, not Booking.com hijack)', async () => {})
  test.fixme('E-25: "Agregar confirmación" opens the inline form (code required)', async () => {})
  test.fixme('E-26: submitting flips card to "✓ Reservado" with code + check-in; persists after reload', async () => {})
  test.fixme('E-27: confirmed card shows Editar + Ver en Booking (when URL saved)', async () => {})
  test.fixme('E-28: trip with NO accommodations still shows the hotel card + Reservar CTA (fallback)', async () => {})
  test.fixme('E-29: multi-city — segment-1 day shows CDMX hotel; segment-2 day shows Oaxaca hotel', async () => {})
})
