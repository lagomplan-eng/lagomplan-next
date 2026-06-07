import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for the mobile trip view E2E suite.
 *
 * Not wired into the Vercel build — `e2e/` is excluded from tsconfig and no
 * Playwright dependency is committed. To run locally:
 *
 *   npm i -D @playwright/test
 *   npx playwright install
 *   PLAYWRIGHT_BASE_URL="https://<preview>.vercel.app" npx playwright test
 *
 * Default baseURL targets a local dev server (`npm run dev`).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    locale: 'es-MX',
  },
  projects: [
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },      // primary mobile target (WebKit)
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },        // Android engine
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },// entry-point + responsive checks
  ],
})
