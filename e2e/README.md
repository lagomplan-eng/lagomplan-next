# E2E — Mobile Trip View (Playwright scaffold)

Runnable stubs for the mobile companion view, mapped 1:1 to the case IDs in
`docs/qa/mobile-view-test-cases.md`. **Playwright is intentionally NOT a
committed dependency** (keeps it out of the Vercel build; `e2e/` is excluded
from `tsconfig`). The tester installs it locally.

## Install (once)

```bash
npm i -D @playwright/test
npx playwright install        # browser binaries
```

## Run

```bash
# against a local dev server
npm run dev            # in one terminal
npm run e2e            # in another  (alias for: playwright test)

# against a deployed preview
PLAYWRIGHT_BASE_URL="https://<preview>.vercel.app" npm run e2e

# single project / file / UI mode
npm run e2e -- --project=mobile-safari e2e/mobile-view/load.spec.ts
npm run e2e:ui
```

Projects (see `playwright.config.ts`): `mobile-safari` (iPhone 14 / WebKit — primary),
`mobile-chrome` (Pixel 7), `desktop-chrome` (entry-point + responsive).

## Status of the stubs

Every test is declared with `test.fixme(...)` → it shows as **skipped**, so the
suite is green out of the box and nothing blocks CI. Convert each `test.fixme`
to `test` as you implement it. Start with `e2e/mobile-view/load.spec.ts` — it
has the most fleshed-out examples (`gotoTrip`, `captureGaEvents`).

## Two things you must wire first (`e2e/support/helpers.ts`)

Both throw until implemented:

1. **`seedTrip(page, fixture)`** — make the route able to load a fixture. Two viable approaches:
   - **DB seed** (most realistic): insert the row into a *dedicated test* Supabase project with the service-role client, delete in `afterEach`. Set test env vars; never point at production.
   - **Network stub** (fast, no DB): `page.route('**/rest/v1/trips*', …)` (or the trip read path) and fulfil with the fixture JSON. Good for pure UI assertions; can't exercise real persistence.
2. **`loginAs(page, userId)`** — establish a Supabase session (set auth cookies, or sign in via the UI once and reuse `storageState`). Leave unauthenticated for anonymous/companion cases.

Fixtures live in `e2e/fixtures/trips.ts` (mirrors the QA doc). `captureGaEvents`
already works — it stubs `window.gtag` before load and records events.

## Selector guidance

The component currently styles with Tailwind utility classes, not `data-testid`s.
Prefer role/text selectors (`getByRole('button', { name: 'Reservar mesa' })`,
`getByText('Fin de semana en CDMX')`). If a few cases are hard to target
reliably, add minimal `data-testid`s to `MobileTripClient.tsx` (e.g. on the
tab buttons, day pills, progress bar) — keep them few and semantic.

## Coverage map

| Spec file | Cases |
|-----------|-------|
| `load.spec.ts` | E-01..E-06, E-58 |
| `days.spec.ts` | E-07..E-13 |
| `activities.spec.ts` | E-14..E-22 |
| `hotel.spec.ts` | E-23..E-29 |
| `budget.spec.ts` | E-30..E-36 |
| `prep.spec.ts` | E-37..E-42 |
| `header.spec.ts` | E-43..E-48 |
| `auth.spec.ts` | E-49..E-56, I-27..I-30 |
| `entry-and-analytics.spec.ts` | E-57, E-59..E-65 |
