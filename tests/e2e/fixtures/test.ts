/**
 * tests/e2e/fixtures/test.ts
 *
 * Extended Playwright `test` object — auto-wires the Phase 1 mock
 * stack and exposes page objects + auth helpers. Specs import from
 * here instead of `@playwright/test` directly.
 *
 * Conventions:
 *   - Every test gets the third-party block + Supabase mock + trips
 *     API stub + generate-trip mock by default.
 *   - Tests can disable a layer per-test via `test.use({...})` flags
 *     OR by registering a more specific `page.route()` after
 *     `installAllMocks` returns (Playwright stacks routes LIFO).
 *   - For authed-user tests, replace `context` via `authedContext`
 *     inside the test body — fixture-level context creation can't
 *     access the per-test `browser` fixture cleanly.
 */

import { test as base, expect } from '@playwright/test'
import { installAllMocks, type GenerationMockOptions } from './network-mocks'
import { HeroForm, TripResult } from './page-objects'

export type LagomplanFixtures = {
  /** Set on `test.use({ mocks: ... })` to customise the generation
   *  mock (e.g. swap to the Oaxaca fixture for the regen test). */
  mocks: GenerationMockOptions
  hero:  HeroForm
  trip:  TripResult
}

export const test = base.extend<LagomplanFixtures>({
  mocks: [{} as GenerationMockOptions, { option: true }],

  // Auto-fixture — runs before each test, no `use` call needed in
  // specs. Installs the mock stack on the test's page.
  page: async ({ page, mocks }, use) => {
    await installAllMocks(page, mocks)
    await use(page)
  },

  hero: async ({ page }, use) => {
    await use(new HeroForm(page))
  },

  trip: async ({ page }, use) => {
    await use(new TripResult(page))
  },
})

export { expect }
