# Tomorrow (2026-06-03)

Active follow-ups. Refresh this file at the end of each session — items move to changelog when shipped, stay here until they are.

---

## 🔴 Priority — start of day

### Playwright regression suite (Tier 2 automation)
**Why:** 7 regressions hit prod in a single day on 2026-06-02 (Smart Finds resolver, anon trip RLS read, sample-CTA dropped query, streaming flicker, title regex, hotel date span, regen-modal not firing on prefs change). All would have been caught by automated browser tests on PR.

**Scope for the first session (~6 hours):**

1. Install + configure Playwright in the project (`npx playwright install`, `playwright.config.ts`)
2. CI wiring — GitHub Action that runs the suite on every PR to `main` (block merge on failure)
3. Test scaffolding pattern + shared fixtures (mock auth, mock Anthropic, prod-mirror seed data)
4. **First 6 tests** (covering the conversion funnel + regression hotspots):
   - **T-PW-01** — Anon visitor lands on homepage, fills HeroForm, sees waiting state, gets a generated trip
   - **T-PW-02** — Anon visitor generates → hits save wall → signs up → trip claims correctly
   - **T-PW-03** — Authed user opens a saved trip → opens prefs drawer → changes destination → confirm modal fires (the regression from today)
   - **T-PW-04** — Sample-itinerary CTA on homepage takes anon visitor to the `is_shared = true` demo trip and renders it
   - **T-PW-05** — `/es/smart-finds/familias` loads with all 7 active kits + images (catches resolver regressions)
   - **T-PW-06** — 35-day cap UI: picking 40 nights shows the amber callout, trim button works, submit blocked over cap

After lunch: ~3 more tests covering Stripe test-mode checkout + analytics event firing (verified via window listener on `gtag`/`fbq`).

**Acceptance:** suite runs in CI on every PR. A failing test blocks the merge button. Local dev can run `npm run test:e2e` and get results in <5 min.

---

## 🟣 Scheduled gates (time-bound, not optional)

### 1.4 — Pre-paid-acquisition audit (late June 2026)
**Slot:** end of Phase 1 — after 1.1 (Stay22 in plan) + 1.3 (Mobile trip view) ship. Adding as **1.4** on the external feature roadmap so it's visible alongside the journey items.

**Why this slot:** 1.1 may add affiliate scripts that affect performance; 1.3 reshapes the primary mobile conversion surface. Auditing before they ship would measure stale state. Auditing after them measures what paid traffic will actually see.

**What it gates:** paid-acquisition kickoff. Until 1.4 passes, no paid spend. After 1.4 passes, every ad dollar respects the work.

**Scope (~half day):**
- Lighthouse mobile + desktop on `/`, `/es/planificador`, `/en/planner`, `/es/hoteles`, `/es/smart-finds/familias`, top 2-3 guides
- Target: Performance ≥85 mobile, Best Practices ≥95, SEO 100, LCP <2.5s, CLS <0.1, INP <200ms
- SEO checklist per page: unique `<title>` (50-60 chars), `<meta description>` (~150 chars), OG image (1200×630 branded), canonical URL, hreflang ES↔EN, JSON-LD where it makes sense (Organization + WebSite on `/`, TouristAttraction/Article on guides, Product on pricing, TouristTrip on saved trips)

**Output:** prioritized fix list with effort estimates. Then ~3-6 hours executing the fixes.

**TODO:** add row "1.4 — Pre-traffic audit + fixes" to the external feature roadmap (the prioritized journey doc).

---

## 🟡 Carried over (sized, ready to execute)

- **Double `/api/generate-trip` POST** observed in Moscow trip console log today. Two `[TripResult] POST payload` lines before one status response. Costs an extra Anthropic call per sync gen if both actually hit. Worth investigating — race in the useEffect, or the auto-retry firing on transient failure that didn't surface in the log. ~1 hr.
- **Sample trip ID — pick a better one.** `63a755fe-7740-416d-9a5f-f76b58869aa5` is the Moscow placeholder. Replace with a polished 5–7 day trip to a well-mapped destination (CDMX / Tokyo / Lisbon — strong intelligence badges). Set `NEXT_PUBLIC_SAMPLE_TRIP_ID` in Vercel + run `UPDATE trips SET is_shared = true WHERE id = <new>` + redeploy. ~30 min.
- **Stripe test-mode on Vercel preview deploys** — production correctly uses live keys. Wire `pk_test_...` + `sk_test_...` scoped to **Preview environment only** so Playwright + manual purchase-flow verification stops costing real money. ~20 min.

## 🟢 Strategic backlog (not tomorrow)

- **Smart Finds Phase 2 personas** ("The Kid" + "General") — needs schema decision (`persona_scopes TEXT[]` migration or fold into existing personas)
- **Hotel cards inline options** — product question parked: keep neighborhood + Reservar (status quo) OR add 1–3 actual bookable Stay22 options inline?
- **Security Phase 3** (next-intl 3 → 4 major) — defer until paid acquisition launches; ideally before 1.4 gate
- **Security Phase 4** (`@supabase/ssr`) — same; ideally before 1.4 gate

## ✅ Closed today (2026-06-02)

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
- Sync-trip loading UX paper cut — `loadingKind` initialized from URL intent so `<GenerationSurface>` renders from first paint when there's a destination param (no more skeleton flash before the phased "Generating..." UI)

---

_Update this file at start/end of every session. Items shipped → move to "Closed today" section before pushing the day's last commit. Items decided → move to backlog or close._
