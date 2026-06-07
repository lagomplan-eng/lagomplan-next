import { test } from '@playwright/test'

// Progress bar + Save/Share/PDF toolbar — QA cases E-43..E-48.
// See docs/qa/mobile-view-test-cases.md.
test.describe('mobile-view · header & toolbar', () => {
  test.fixme('E-43: prominent progress bar with "Progreso del viaje", NN%, done/total', async () => {})
  test.fixme('E-44: progress counts per-day + pre-trip checks + packing', async () => {})
  test.fixme('E-45: owner sees Guardado + Compartir + PDF', async () => {})
  test.fixme('E-46: non-owner sees Compartir + PDF (no Guardado)', async () => {})
  test.fixme('E-47: Compartir (owner) opens the share-link modal', async () => {})
  test.fixme('E-48: PDF opens /planner?...&full=1&print=1 in a new tab (print dialog is MANUAL)', async () => {})
})
