import { test } from '@playwright/test'

// Activities + booking drawer — QA cases E-14..E-22 (+ E-61..E-65 analytics).
// See docs/qa/mobile-view-test-cases.md.
test.describe('mobile-view · activities & booking drawer', () => {
  test.fixme('E-14: tapping an activity expands; tapping again collapses', async () => {})
  test.fixme('E-15: restaurant→"Reservar mesa", tour→"Reservar tour", transfer→"Reservar traslado"', async () => {})
  test.fixme('E-16: free item shows no Reservar button', async () => {})
  test.fixme('E-17: "Reservar…" opens the bottom-sheet drawer with provider options', async () => {})
  test.fixme('E-18: drawer option opens provider URL in a new tab (NOT Booking.com hijack); drawer closes', async () => {})
  test.fixme('E-19: confirm-done toggles state and ticks the matching task in the day list', async () => {})
  test.fixme('E-20: single Guardar persists note + link', async () => {})
  test.fixme('E-21: save shows "Guardado ✓" toast; values persist after reload (owner)', async () => {})
  test.fixme('E-22: read-only viewer has no note/link/confirm controls; drawer still available', async () => {})
})
