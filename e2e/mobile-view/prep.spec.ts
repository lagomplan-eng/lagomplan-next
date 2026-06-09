import { test } from '@playwright/test'

// Preparativos (pre-trip checklist + packing) — QA cases E-37..E-42.
// See docs/qa/mobile-view-test-cases.md.
test.describe('mobile-view · preparativos', () => {
  test.fixme('E-37: tab "Preparativos" shows "Antes de salir" + "Qué llevar" sections', async () => {})
  test.fixme('E-38: "Antes de salir" lists pre-trip checks (Reservar hotel, Empacar maleta, …)', async () => {})
  test.fixme('E-39: checking a pre-trip item persists and updates the header progress bar', async () => {})
  test.fixme('E-40: packing items render; tapping toggles packed; counter X/Y updates', async () => {})
  test.fixme('E-41: packing/pre-trip state persists after reload (owner)', async () => {})
  test.fixme('E-42: empty packing list → packing section omitted (no crash)', async () => {})
})
