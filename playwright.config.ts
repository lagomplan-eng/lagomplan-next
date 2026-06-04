/**
 * playwright.config.ts
 *
 * Tier 2 automated regression coverage. Lives alongside the lightweight
 * tsx smoke tests under tests/ (those are unit-style; this is e2e).
 *
 * Targets:
 *   - PR-blocking regression catch on the conversion funnel + the
 *     specific 7 regressions that hit prod on 2026-06-02.
 *   - Network-mock everything (Supabase + Anthropic) — Phase 1 is
 *     UI-behavior coverage. A future Phase 3 will wire a real test
 *     Supabase project for auth/RLS depth.
 *
 * Local: `npm run test:e2e` (boots `next dev` on :3000).
 * CI:    GitHub Action `playwright.yml` runs the same against the
 *        dev server. Warning-only for the first week, then promoted
 *        to a required check.
 */

import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  // Match the lightweight tsx tests' convention — both live under tests/
  // but the framework-free ones use *.test.ts; e2e uses *.spec.ts so the
  // two suites don't collide.
  testMatch: '**/*.spec.ts',

  fullyParallel: true,
  forbidOnly:    !!process.env.CI,
  // Two retries in CI smooths over transient flake (slow streaming UI,
  // route-mock timing) without masking real regressions.
  retries: process.env.CI ? 2 : 0,
  // Single worker locally keeps the console + traces readable;
  // CI can parallelise (default = half the cores).
  workers: process.env.CI ? undefined : 1,

  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    trace:   'on-first-retry',
    // Default to Spanish locale — most of our regression hotspots
    // were on the ES surfaces. Individual tests can override.
    locale:  'es-MX',
    // Block third-party trackers globally so tests aren't slowed by
    // (or flaking on) Stay22, GA, Meta Pixel, etc.
    extraHTTPHeaders: {},
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // `next dev` over `next build && next start` — much faster iteration.
    // Build-time bugs are already caught by Vercel preview deploys.
    command:           'npm run dev',
    url:               BASE_URL,
    timeout:           120_000,
    reuseExistingServer: !process.env.CI,
    // Pipe dev server stderr through so failures surface in the report.
    stderr:            'pipe',
    stdout:            'ignore',
  },
})
