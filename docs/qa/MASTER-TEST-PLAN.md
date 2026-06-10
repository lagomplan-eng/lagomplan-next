# Lagomplan — Master Test Plan & Execution Playbook

**What this is:** the single source of truth for testing Lagomplan end to end — what
the product is, what's tested today, the full target test suite (all types, full-site),
a **planner-first** roadmap, how to track progress, and **how to hand this to Claude**
to execute in safe chunks.

**Read alongside:**
- `docs/product/trip-planner-product-spec.md` — requirement-by-requirement product spec (21 domains, ~80 REQs)
- `docs/qa/trip-planner-test-coverage.md` — current feature × coverage × risk matrix
- `docs/qa/mobile-view-test-cases.md` — 164 manual mobile cases
- `docs/qa/stay22-attribution-validation.md` — affiliate validation method

---

## 0. Principles (read first — these are non-negotiable)

1. **The test pyramid.** Many fast unit tests, fewer integration tests, a focused set of
   e2e flows, targeted visual/a11y/perf. Don't invert it (don't e2e what a unit test can cover).
2. **Test behavior at its surface, not internals.** A route's surface is an HTTP request; a
   helper's is its export; a page's is the rendered DOM.
3. **`next build` is part of "passing."** Dev does not reproduce build-time failures
   (e.g. `NEXT_PUBLIC` inlining). CI builds; local verification must too.
4. **Every test must run in CI** or it doesn't count — a test nobody runs is documentation.
5. **One PR per chunk**, each leaving CI green. Small, reviewable, reversible.
6. **Update the tracker in the same PR** as the tests. The matrix is the map; keep it true.

---

## 1. Product surface — what exists to test

The whole product, grouped. **★ = planner core (highest priority).** Full detail in the
product spec; this is the testable inventory.

| Area | Key surfaces / flows |
|---|---|
| ★ **Generation** | Form → AI itinerary; multi-city; async long-trip jobs (chunk/poll/rescue); typed errors + retries |
| ★ **Planner editing** | Inline edit (days/items/budget/packing); **wholesale `trip_data` autosave**; version history/restore; regenerate (prefs drawer) |
| ★ **Persistence & web↔mobile parity** | `trip_data` (planner) vs `trip_progress` (companion); RMW vs wholesale; currency dual-store; booking-confirm merge |
| ★ **Mobile companion** | Read/nav/today; inline itinerary editing; notes/links; packing; done-checks/progress; "Ya reservé" |
| ★ **Budget & currency** | 3 totals (AI/user/actual); per-person; currency relabel + persistence + parity |
| **Access & sharing** | Owner/anon/shared gates; share link; claim-on-signup; noindex |
| **Entitlements & payments** | Anon limit; credits; paywall; Stripe checkout; webhook idempotency; fulfill fallback |
| **Affiliate** | Stay22 link build; LetMeAllez guard (no hijack); booking storage; click analytics |
| **Content** | Guides; World Cup (16 cities); Smart Finds; hotels listing |
| **Newsletter** | One subscribe route across 7 surfaces; Mailchimp config |
| **Analytics & consent** | GA4 + Pixel event catalog; consent gating; GPC |
| **i18n / SEO / PDF** | es/en routing + alt slugs; sitemap/robots/JSON-LD; print layouts |
| **Reliability** | Async jobs; reconcile cron; sync/async time bounds |

---

## 2. Current test coverage (2026-06-10)

| Layer | State |
|---|---|
| **Unit** (`tests/*.ts`, framework-free tsx) | **7 suites, 156 assertions** — `booking`, `progress`, `itinerary-edit`, `mobile-view`, `newsletter`, `classify-block`, `trip-data-parity` |
| **Contract/parity** | `trip-data-parity` (desktop bundle ⊇ mobile-required keys); `resolveTripCurrency` |
| **Integration / route** | **0** |
| **Component** | **0** |
| **E2E** (Playwright) | 9 mobile-view files, **68 cases — all `test.fixme` (stubbed)**; fixtures + helpers scaffolded; `@playwright/test` **not** a committed dep |
| **Visual / a11y / perf** | **0** |
| **CI** (`.github/workflows/ci.yml`) | ✅ typecheck + unit + `next build` + NEXT_PUBLIC inlining guard, on every PR |

**Reality:** good unit coverage of pure helpers; nothing on routes, components, flows, or
the money/access layers; e2e exists only as stubs.

---

## 3. Target test architecture (the full suite)

| Layer | Tooling | Covers | Status |
|---|---|---|---|
| **L1 Unit** | framework-free `tsx` (existing) | pure helpers in `lib/**` | ✅ established |
| **L2 Contract** | `tsx` | trip_data shape, web↔mobile field parity, API response shapes | 🟡 started |
| **L3 Integration (route)** | **Playwright `request`** against a running app + **test Supabase project** | `/api/**` handlers: status, auth gates, RMW, idempotency | ❌ **decision needed** (test DB) |
| **L4 Component** | *(optional)* Vitest + React Testing Library | editable rows, budget table, forms in isolation | ❌ optional — adds a framework |
| **L5 E2E** | Playwright (commit the dep) | full flows, multi-browser, web↔mobile round-trip | ⬜ stubbed |
| **L6 Visual regression** | Playwright screenshots | design consistency (e.g. italic-heading drift) | ❌ later |
| **L7 Accessibility** | `@axe-core/playwright` | WCAG on key pages | ❌ later |
| **L8 Performance** | Lighthouse CI | the 1.4 pre-acquisition gate | ❌ later |

### Decisions to lock before L3/L5 (call these out to the owner)
- **Test database:** a dedicated **Supabase "test" project** (seeded + reset per run) vs. mocking the Supabase client. *Recommendation: a real test project* — the bugs live in RLS/auth/RMW, which mocks hide.
- **Commit `@playwright/test`** to `devDependencies` + add `npx playwright install --with-deps chromium` to a CI e2e job.
- **Component layer (L4):** include only if isolated component bugs become common; otherwise rely on L5 e2e. Defaults to *skip for now*.

---

## 4. Roadmap — planner-first, phased

Each phase ends with CI green and the tracker updated. **P0/P1 = do first.**

### Phase 0 — Foundation  *(mostly done)*
- [x] CI gating (typecheck + unit + build + inlining guard)
- [x] Parity contract test
- [ ] Commit `@playwright/test`; add CI e2e job (build → start → run e2e)
- [ ] Stand up the test Supabase project + seed/reset script + `e2e/fixtures` wired to it

### Phase 1 — ★ Planner core  *(P0)*
- [ ] **L3** route integration: `trips POST/PATCH` (wholesale save includes all fields; intelligence non-blocking), `companion PATCH` (RMW preserves fields; auth gate; itinerary sanitize; currency dual-write), `booking-confirm` (RMW merge; URL sanitize), `claim` (idempotent, only-when-null)
- [ ] **L1/L2** generation validation gate (overnight ≥1 hotel; same-day none; fallback), multi-city day→city mapping
- [ ] **L5** e2e happy path: generate → inline-edit → autosave → reload (web)
- [ ] **L5** e2e: **web→mobile round-trip** (edit on web, open mobile, data matches — the parity goal)

### Phase 2 — ★ Mobile companion  *(P1)*
- [ ] Un-stub the 68 `e2e/mobile-view/*` cases (load, days, activities, budget, prep, hotel, auth, header, analytics)
- [ ] e2e: mobile inline edit → web reload preserves bookings/budget/packing
- [ ] e2e: currency set on either surface sticks on both

### Phase 3 — Money & access  *(P1)*
- [ ] L3: checkout session shape; webhook idempotency (`last_session_id`); fulfill fallback; out-of-credits 402
- [ ] L3: access gates — owner/anon/shared read+write; private→redirect (no existence leak); share preview safe-fields-only
- [ ] L5: anon generate → save-wall → signup → claim (conversion funnel)
- [ ] L5 + committed: Stay22 guard (no hijack; attribution preserved) — promote the ad-hoc validation

### Phase 4 — Content & supporting  *(P2)*
- [ ] Guides/World Cup/Smart Finds render + affiliate links; newsletter 7-surface; consent gating; i18n alt-slug; sitemap/robots/JSON-LD

### Phase 5 — Cross-cutting  *(P2/P3)*
- [ ] L6 visual snapshots on key pages (planner result, mobile view, a guide)
- [ ] L7 axe on the conversion path
- [ ] L8 Lighthouse CI (the 1.4 gate)

---

## 5. Tracking

**The matrix is the board.** `docs/qa/trip-planner-test-coverage.md` is the live tracker —
extend it to whole-site. Each row = a feature/flow with: surface, target layers, status, risk.

**Status legend:** 🔴 none · 🟡 partial · 🟢 covered · ⬜ stubbed · ✅ covered+in-CI

**Test ID scheme** (reuse the existing `e2e/` convention):
- `U-###` unit · `C-###` contract · `I-###` integration · `E-###` e2e · `V-###` visual
- Put the ID in the test name and in the matrix row so they cross-reference.

**Definition of Done (per test chunk):**
1. Tests written at the right layer, named with IDs
2. Pass locally **and** the CI-equivalent: `npx tsc --noEmit` + all `tests/*.ts` + `npm run build` (+ e2e if applicable)
3. CI green on the PR
4. Tracker row(s) flipped, in the same PR
5. If it guards a known bug, a one-line comment says which

**Enforcement:** CI blocks merge on any failure. New layers (e2e, visual) get their own CI job
as they're added.

---

## 6. Running this with Claude — execution playbook

**Hand Claude one chunk at a time** (one phase item / one route / one flow), not the whole plan.
Each chunk is a self-contained PR. Use this template:

> **Task:** Write `<layer>` tests for `<feature/route/flow>` (Plan §<phase>, ID `<X-###>`).
> **Cover:** `<explicit cases — happy path + the auth/edge/regression cases>`.
> **Follow conventions:** `docs/qa/MASTER-TEST-PLAN.md` §0 + §7. Match the existing pattern in
> `tests/<closest>.ts` (unit) or `e2e/mobile-view/<closest>.spec.ts` (e2e).
> **Verify:** run the test + `npx tsc --noEmit` + `npm run build`; confirm CI-green.
> **Then:** update the matrix row(s) in `docs/qa/trip-planner-test-coverage.md` and open one PR.

**Good first chunks to give Claude (in order):**
1. "Commit `@playwright/test` + add a CI e2e job that builds, starts, and runs `e2e/`." (unblocks L5)
2. "Stand up the test Supabase project wiring + a seed/reset helper in `e2e/fixtures`." (unblocks L3)
3. "Write I-tests for `companion PATCH` (Plan §Phase 1): RMW preserves untouched fields; owner/anon/forbidden auth; itinerary sanitize; currency dual-write."
4. "Un-stub `e2e/mobile-view/load.spec.ts` + `days.spec.ts` against the seeded trip."

**Guardrails to remind Claude of every time:**
- Verify with `next build`, not just dev (build-only failures exist).
- Don't delete a failing assertion to make CI green — fix the code or the test honestly.
- Keep PRs small; leave CI green; update the tracker in the same PR.
- For anything touching `NEXT_PUBLIC_*` / env: confirm client-side inlining (CI guard covers it).

---

## 7. Conventions

- **Unit/contract (L1/L2):** framework-free `tsx` under `tests/`, run `npx tsx tests/<f>.ts`,
  exit 0/1, results pushed to a `results[]` array, summary line + non-zero exit on failure.
  Mirror `tests/progress.test.ts`.
- **Integration/e2e (L3/L5):** Playwright under `e2e/`, IDs in `test()` titles, fixtures in
  `e2e/fixtures`, shared helpers in `e2e/support`. Run against a build (`next start`), not dev,
  for parity with production.
- **Naming:** `<area>.<layer>.test.ts` (unit) / `<area>.spec.ts` (e2e).
- **No flaky waits:** assert on state/role, not `waitForTimeout`, in e2e.

---

## Appendix — open tooling decisions (owner)
1. Test Supabase project (recommended) vs. mocking — **needed for L3/L5**.
2. Commit `@playwright/test` to devDeps + CI e2e job — **needed for L5**.
3. Component layer (L4) — include or skip (default skip).
4. Visual/a11y/perf (L6–L8) — when (suggest after Phase 3).

*Generated 2026-06-10. This file is the plan; the matrix is the tracker; CI is the enforcer.*
