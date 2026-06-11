/**
 * e2e/smoke.spec.ts
 *
 * Infrastructure smoke (harvested + hardened from the #62 first cut). Proves the
 * Playwright harness + the built app boot, AND that the production build renders
 * WITHOUT the client-side env/Supabase fatal that took down preview deploys.
 *
 * In CI this runs against `npm run start` (a real production build), so it catches
 * build-only failures — e.g. NEXT_PUBLIC inlining (`process.env[name]` dynamic
 * lookup) — that `npm run dev` never reproduces. Covers no feature; it's the
 * bail signal for the rest of the suite.
 */
import { test, expect } from '@playwright/test'

// The client-side fatal this guards against (see lib/supabase/env.ts +
// docs/qa/MASTER-TEST-PLAN.md §0): a missing/uninlined NEXT_PUBLIC var throws
// in SupabaseProvider's useEffect → error boundary swaps in the fatal page.
const FATAL = /FATAL ERROR|Missing env var|URL and Key are required|supabaseUrl is required/i

for (const path of ['/es', '/en']) {
  test(`E-SMOKE: ${path} renders without a fatal/env error`, async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (e) => pageErrors.push(e.message))

    await page.goto(path, { waitUntil: 'networkidle' })
    // Let SupabaseProvider's useEffect run — that's where the client is created
    // and where the env guard would throw if a var didn't inline.
    await page.waitForTimeout(1500)

    const body = await page.evaluate(() => document.body.innerText)
    expect(body, 'no fatal error visible on screen').not.toMatch(FATAL)
    expect(pageErrors.join('\n'), 'no env/supabase page errors').not.toMatch(FATAL)
    await expect(page.locator('nav').first()).toBeVisible()
  })
}

test('E-SMOKE: a static content page (World Cup city) renders', async ({ page }) => {
  await page.goto('/es/mundial/cdmx', { waitUntil: 'networkidle' })
  const body = await page.evaluate(() => document.body.innerText)
  expect(body, 'no fatal error on a static content page').not.toMatch(FATAL)
})
