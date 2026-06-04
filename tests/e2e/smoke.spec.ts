/**
 * tests/e2e/smoke.spec.ts
 *
 * Tier-2 infrastructure smoke. If this fails, Playwright + the dev
 * server + the locale routing are broken — bail before running the
 * funnel tests.
 *
 * Lands as part of Phase 0 (Playwright suite kickoff). Does NOT cover
 * any specific regression — its only job is to prove the harness boots.
 */

import { test, expect } from '@playwright/test'

test('homepage loads and renders an h1', async ({ page }) => {
  await page.goto('/es')
  // The locale root always renders something at the top of the document;
  // we don't pin the exact text so copy edits don't break this test.
  await expect(page.locator('h1').first()).toBeVisible()
})

test('locale switch from /es to /en lands on the English homepage', async ({ page }) => {
  await page.goto('/en')
  await expect(page).toHaveURL(/\/en/)
  await expect(page.locator('h1').first()).toBeVisible()
})
