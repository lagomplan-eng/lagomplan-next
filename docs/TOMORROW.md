# Tomorrow (2026-06-03)

Active follow-ups carried from 2026-06-02. Refresh this file at the end of each session — items move to changelog when shipped, or stay here until they are.

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

## 🟡 Carried over from today

- **Sample trip ID** — pick polished demo, set `NEXT_PUBLIC_SAMPLE_TRIP_ID` in Vercel + redeploy. SQL `UPDATE trips SET is_shared = true` already ran for `63a755fe-7740-416d-9a5f-f76b58869aa5`, so that one works as the placeholder until you pick something better.
- **Manual smoke sweep** (11 human-interaction tests in `docs/SMOKE_TESTS.md`) — not done. Lower priority once Playwright covers the funnel, but worth running once on prod before any paid acquisition.
- **Double `/api/generate-trip` POST** observed in Moscow trip console log today. Two `[TripResult] POST payload` lines before one status response. Costs an extra Anthropic call per sync gen if both actually hit. Worth investigating — race in the useEffect, or the auto-retry firing on transient failure that didn't surface.
- **Analytics live verification** — Meta Pixel + GA DebugView walkthrough for the 10-step conversion path. Pixel ID `112397688953186` is now loading correctly post-consent; need to confirm each event lands as expected. Can be folded into the Playwright work since the assertions are programmable.
- **Loading-state UX paper cut on sync trips** — chrome appears before content, looks like a result page rather than a clear "generating, please wait" overlay. Backlog item; add a sync-path GenerationSurface variant.

## 🟢 Strategic backlog (not tomorrow)

- **Smart Finds Phase 2 personas** ("The Kid" + "General") — needs schema decision (`persona_scopes TEXT[]` migration or fold into existing personas)
- **Hotel cards inline options** — product question parked: keep neighborhood + Reservar (status quo) OR add 1–3 actual bookable Stay22 options inline?
- **Security Phase 3** (next-intl 3 → 4 major) — defer until paid acquisition launches
- **Security Phase 4** (`@supabase/ssr`) — same
- **Pre-paid-acquisition Lighthouse + SEO audit** — page-load perf on `/`, `/planner`, `/hoteles`, `/smart-finds/familias`; OG image + JSON-LD per page

---

_Update this file at start/end of every session. Items shipped → strike or remove. Items decided → move to backlog or close._
