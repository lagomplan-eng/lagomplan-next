import { test } from '@playwright/test'

// Presupuesto — QA cases E-30..E-36. See docs/qa/mobile-view-test-cases.md.
test.describe('mobile-view · budget', () => {
  test.fixme('E-30: three totals — IA estimó / Tu estimado / Confirmado', async () => {})
  test.fixme('E-31: Total default; Por persona divides by parsed traveler count (rounded int)', async () => {})
  test.fixme('E-32: each row has TWO editable inputs — Tu (userEst) and Real (actual)', async () => {})
  test.fixme('E-33: editing Real updates Confirmado total + category subtotal', async () => {})
  test.fixme('E-34: editing Tu updates Tu estimado total; both persist after reload (owner)', async () => {})
  test.fixme('E-35: read-only viewer sees values as text, no inputs', async () => {})
  test.fixme('E-36: site footer visible at bottom', async () => {})
})
