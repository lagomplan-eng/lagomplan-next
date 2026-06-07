import { test } from '@playwright/test'
import { TRIP_OWNER } from '../fixtures/trips'

// Day selector — QA cases E-07..E-13. See docs/qa/mobile-view-test-cases.md.
test.describe('mobile-view · day selector', () => {
  test.fixme('E-07: tapping Día 3 shows Day 3 hero title', async () => {})
  test.fixme('E-08: day pill counter shows correct done/total for that day', async () => {})
  test.fixme('E-09: counter increments after checking a per-day task', async () => {})
  test.fixme('E-10: switching day scrolls content to top', async () => {})
  test.fixme('E-11: active pill has a distinct visual state', async () => {})
  test.fixme('E-12: "today" dot only on the current-day pill (today within trip)', async () => {})
  test.fixme('E-13: day selector hidden on Presupuesto & Preparativos tabs', async () => {})
  void TRIP_OWNER
})
