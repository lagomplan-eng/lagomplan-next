# Tomorrow (2026-06-05)

Active follow-ups. Refresh this file at the end of each session — items move to changelog when shipped, stay here until they are.

---

## 🔴 Priority — start of day

### Playwright regression suite — Phase 2 completion

Phase 0/1/2-first-cut shipped on 2026-06-04 (branch `feat/playwright-e2e-suite`, 3 commits). **5 tests passing, 3 skipped with path-forward notes, ~10s runtime.** What's left:

1. **T-PW-02 — anon → save wall → signup → claim** (~45 min)
   - Mock Supabase signup at `/auth/v1/signup` returning a session
   - Mock `/api/trips/[trip_id]/claim` returning success
   - Drive the "Guarda tu viaje" prompt → email/password form → assert the trip claims correctly post-signup
   - Most complex remaining test because of the multi-step state changes

2. **T-PW-06 — 35-day cap UI** (~20 min)
   - Add a minimal `data-testid` to `DateRangePicker`'s trigger so the test can drive a >35-day range
   - Assert the amber callout appears and submit is blocked

3. **T-PW-05 — `/es/smart-finds/familias` kits** (~30 min)
   - Extend `tests/e2e/fixtures/network-mocks.ts` with a Supabase kits/products fixture
   - OR fold this into the Phase 3 real-test-Supabase work — decide before starting

4. **T-PW-04 — sample-itinerary CTA** (~10 min)
   - Unblocked by setting `NEXT_PUBLIC_SAMPLE_TRIP_ID` in dev (also a carry-over below)
   - Test asserts the href contains `trip_id=` (the actual 2026-06-02 regression class)

5. **Promote CI to required check** — only after ~7 days of green runs on the warning-only workflow. Branch-protection toggle, no code change.

**Acceptance:** all 6 T-PW-* tests passing on every PR, CI required.

---

## 🟣 Scheduled gates (time-bound, not optional)

### 1.4 — Pre-paid-acquisition audit (late June 2026)
**Slot:** end of Phase 1 — after 1.1 (Stay22 in plan) + 1.3 (Mobile trip view) ship. Auditing before they ship would measure stale state.

**Scope (~half day):** Lighthouse mobile + desktop on `/`, `/es/planificador`, `/en/planner`, `/es/hoteles`, `/es/smart-finds/familias`, top 2-3 guides. Targets: Performance ≥85 mobile, Best Practices ≥95, SEO 100, LCP <2.5s, CLS <0.1, INP <200ms. SEO checklist per page.

**Output:** prioritized fix list with effort estimates, then ~3-6 hours executing the fixes.

---

## 🟡 Carried over (sized, ready to execute)

- **Double `/api/generate-trip` POST** observed in Moscow trip console log 2026-06-02. Two `[TripResult] POST payload` lines before one status response. Costs an extra Anthropic call per sync gen if both actually hit. Worth investigating — race in the useEffect, or the auto-retry firing on transient failure that didn't surface in the log. ~1 hr.
- **Sample trip ID — pick a better one.** `63a755fe-7740-416d-9a5f-f76b58869aa5` is the Moscow placeholder. Replace with a polished 5–7 day trip to a well-mapped destination (CDMX / Tokyo / Lisbon — strong intelligence badges). Set `NEXT_PUBLIC_SAMPLE_TRIP_ID` in Vercel + run `UPDATE trips SET is_shared = true WHERE id = <new>` + redeploy. Also unblocks T-PW-04. ~30 min.
- **Stripe test-mode on Vercel preview deploys** — production correctly uses live keys. Wire `pk_test_...` + `sk_test_...` scoped to **Preview environment only** so Playwright + manual purchase-flow verification stops costing real money. ~20 min.

## 🟢 Strategic backlog (not tomorrow)

- **Real test Supabase project (Phase 3 of the e2e suite)** — current Phase 1 is network-mocked, which won't catch RLS or SSR-cookie races. Wire a dedicated project, seed kits + sample trips, swap `installAllMocks` for a real-network mode behind a `TEST_REAL_SUPABASE=1` env flag. Unblocks T-PW-05 properly and adds real auth coverage for T-PW-02.
- **Smart Finds Phase 2 personas** ("The Kid" + "General") — needs schema decision (`persona_scopes TEXT[]` migration or fold into existing personas).
- **Hotel cards inline options** — product question parked: keep neighborhood + Reservar (status quo) OR add 1–3 actual bookable Stay22 options inline?
- **Security Phase 3** (next-intl 3 → 4 major) — defer until paid acquisition launches; ideally before 1.4 gate.
- **Security Phase 4** (`@supabase/ssr`) — same; ideally before 1.4 gate.

## ✅ Closed today (2026-06-04)

- **Playwright e2e suite — Phase 0 + Phase 1 + Phase 2 first cut.** Branch `feat/playwright-e2e-suite`, 3 commits. Infrastructure (config, CI workflow, smoke tests), fixtures (network mocks, auth helper, page objects), and the two highest-value funnel tests: T-PW-01 (anon URL → generated trip) and T-PW-03 (the actual 2026-06-02 regression — prefs-drawer regenerate must fire the confirm modal). 5 passing, 3 skipped with clear path-forward notes, ~10s end-to-end.
- **A11y improvement:** regen confirm modal gets `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title. The codebase's print CSS already expected this pattern (globals.css:995). Drives Playwright selector stability AND helps screen readers.

## ✅ Closed 2026-06-03

- "Ya reservé" inline booking-confirmation flow — original PR #60 (3ca36d2, 93e6f05) + follow-up PR with persistence, edit, custom URL, milestone tick, PDF print polish, booking helpers extraction, 29 smoke tests
- Memory entries written: plan-before-acting, trip-data wholesale overwrite landmine, Stay22 LetMeAllez click-hijack, test convention

## ✅ Closed 2026-06-02

- Smart Finds Phase 1 launch (nav flag flipped on after broader release deployed clean)
- Long-trip pipeline reliability fixes (streaming-lock target, regen-modal on prefs change)
- Sample-itinerary CTA wiring (plain `<a>` instead of next-intl typed Link)
- Anonymous trip reads via `is_shared = true` (RLS bypass with explicit auth gate in route)
- Auto-retry once on transient 5xx + 529 from generation
- Manual smoke sweep — all 10 tests passed on prod
- Analytics live verification: Pixel `112397688953186` firing, `Purchase` confirmed via real Stripe charge ($0.50 fee, refunded)
- Tag `v-jun-2-2026` pushed for rollback safety
- Memory refresh + `project_smart_finds.md` written
- TOMORROW.md scaffolded
- Sync-trip loading UX paper cut — `loadingKind` initialized from URL intent so `<GenerationSurface>` renders from first paint when there's a destination param

---

_Update this file at start/end of every session. Items shipped → move to "Closed today" section before pushing the day's last commit. Items decided → move to backlog or close._
