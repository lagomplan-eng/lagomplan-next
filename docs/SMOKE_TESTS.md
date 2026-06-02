# Smoke Tests

Manual verification checklist for critical user flows. Run this **before merging any non-trivial PR** that touches the planner, auth, trip lifecycle, payments, or consent system. ~10-15 minutes to run the full suite.

## Who runs this

- **QA Lead agent** owns this doc. It's their checklist + the place they add tests when new bugs are found.
- **You (orchestrator)** run the manual clicks while QA Lead directs and interprets.
- **Dev Engineer agent** turns the highest-impact items into Playwright tests over time (Tier 2 — automated CI).
- **Main session (me)** updates this doc when shipping features, but QA Lead is the source of truth for what's tested.

## How to use it

For each test:
1. Read the **Pre-condition** (auth state, browser context, etc.)
2. Click through the **Steps**
3. Verify against the **Pass criteria**
4. If anything fails, log to the bottom under "Recently discovered" with date + PR/commit

A test "passes" only when ALL pass criteria are met. Partial passes are failures with details.

Run the whole suite when:
- Before merging a PR that touches anything in this file's scope
- Once per week as a regression sweep
- After any Sonnet model migration or worker change

Run the relevant subset when:
- PR touches a specific area (e.g., touch consent → run §3 only)

---

## §1 — Generation core

### T1-1: Short trip, sync path (~1 min)

**Pre-condition:** Logged in, has ≥1 trip credit.

**Steps:**
1. Go to `/es/planner`
2. Fill: origin=Monterrey, destination=CDMX, dates=3 days from today, 2 people, cultural, medio
3. Submit

**Pass criteria:**
- Loading screen appears within 2s
- Trip generates in <2 min
- Result page shows: trip title, subtitle "3 días", 3 day cards with 4-7 blocks each, accommodations list with ≥1 hotel
- Logs (Supabase Studio → generate-trip → Logs): one `[generate-trip]` entry with `model: "claude-sonnet-4-6"`, `stop_reason: "tool_use"`, ms <90000
- DB: row in `trips` with `user_id` set, `trip_data` populated, `duration_days = 3`

---

### T1-2: Long trip, async path with streaming UI (~6 min)

**Pre-condition:** Logged in, has ≥1 trip credit.

**Steps:**
1. Go to `/es/planner`
2. Fill: origin=CDMX, destination=Oaxaca, dates=15 days from today, 2 people, cultural, medio
3. Submit

**Pass criteria:**
- Initial loading screen appears
- **Header subtitle, itinerary section ("15 días en Oaxaca"), and trip title all show the FINAL day count (15) from the first paint — no flicker upward as chunks land.** Same for the hotel card: shows the full 14-night span from the moment the first card appears, not chunk-0's 4-night sub-range.
- At ~100s: first 5 day cards appear with `Generando · 5 de 15 días listos` indicator below (day-count format — chunk-count format was retired 2026-06-01)
- At ~200s: days 6-10 appear, indicator updates to `Generando · 10 de 15 días listos`
- At ~300s: days 11-15 appear, indicator disappears
- Final state: full 15 days, all in Spanish, accommodations have entries, trip saved (trip_id present in URL)
- Title reads "Oaxaca en 15 días: …" — NOT "Oaxaca en 5 días" (chunk-0 day count leak — should be patched by both worker `patchTitleDayCount` AND client-side defensive patch in `normalizeTripData`)
- Logs (`generate-trip-worker`): three sequential invocations with chunks landing
- DB: `generation_jobs` row reaches `status='completed'`, `chunks_done=3, chunks_total=3`, `partial_result` exists (and is overwritten on completion by `result`)

**Common failure modes:**
- Job aborts at chunk 0 → worker per-chunk timeout. Check `SEGMENT_DAYS` constant (currently 5; was 10 pre-2026-05-26).
- Days appear all at once at the end → `partial_result` write is failing. Check worker logs for partial assembly warnings.
- Indicator stuck at "5 de 15 días listos" forever → polling endpoint isn't returning `partial_result`. Check `/api/trips/jobs/[id]/route.ts`.
- Surfaces flicker through partial counts ("5 → 10 → 15 días") as chunks land → streaming-lock target broke. Verify `nightsNum` + accommodation patch + title patch in TripResult.tsx use `Math.max(days.length, durationDaysFromNights(nights))`, not `days.length` alone.

---

### T1-3: Multi-city trip (~5 min)

**Pre-condition:** Logged in, has ≥1 trip credit.

**Steps:**
1. Go to `/es/planner`
2. Fill main row: origin=CDMX, destination=CDMX, 3 nights
3. Click "+ Añadir ciudad" → add segment 2: from=CDMX, to=Oaxaca, 3 nights
4. Click "+ Añadir ciudad" again → segment 3: from=Oaxaca, to=Mérida, 3 nights
5. Submit

**Pass criteria:**
- Async path triggers (multi-city always async, regardless of duration)
- Generates without errors
- Final trip has 9 days total
- Accommodations array has exactly 3 entries (one per city)
- Each city's days are mapped correctly (Days 1-3 in CDMX, 4-6 in Oaxaca, 7-9 in Mérida)
- Day-to-city mapping shows in the day card chrome (chips or labels)

---

### T1-4: Generation failure surfaces an error (controlled break)

**Pre-condition:** Don't break prod. Use a preview deployment with a temporarily-bad config.

This test verifies the **failure path** works cleanly. Skip in routine smoke runs; run after changes to the error-handling pipeline.

**Steps:**
1. On a preview deploy, set `GENERATE_TRIP_MODEL=nonexistent-model-id` via Supabase secrets
2. Go to `/es/planner`
3. Generate a 3-day trip

**Pass criteria:**
- User sees an error message in the UI (not a blank loading screen forever)
- DB: `trips` row NOT created (or job marked `failed`)
- Credit is refunded (`user_entitlements.trips_remaining` is unchanged from pre-test)
- GA fires `error_occurred` event with `surface: planner-generate`

**Cleanup:** flip the secret back to `claude-sonnet-4-6`.

---

### T1-5: 35-day cap enforcement (~45s, no live generation needed for steps 1-4)

**Pre-condition:** Fresh visitor on `/es/` or `/en/` — steps 1-4 don't need a live AI call. Step 5 (follow-through) does.

**Steps:**
1. Open the homepage; the planner form is in the right column of the hero
2. Fill origin + destination
3. Open the date picker → pick a range spanning **40 nights**
4. Click submit
5. **Follow-through:** click the trim button → submit → confirm generation actually proceeds and lands on a result page

**Pass criteria:**
- Under the segment(s), an amber callout appears with the exact text:
  - ES: *"Por ahora generamos itinerarios de hasta 35 días. Tu rango cubre 40 noches."*
  - EN: *"We currently plan trips of up to 35 days. Your range covers 40 nights."*
- Single-city: a button labeled **"Ajustar a 35 días"** (ES) / **"Trim to 35 days"** (EN) appears below the callout. Clicking it snaps the end date so total = 35 nights and the callout disappears.
- Multi-city (add an extra segment so total still >35): the callout shows the **total summed across all tramos** (e.g. *"Total del viaje: 38 noches sumando los 2 tramos."*) and the trim button is HIDDEN (multi-city users should shorten individual segments themselves).
- Submit is hard-blocked while over cap — no navigation, no spinner, no `/api/generate-trip` POST in the Network tab.
- Dropping to ≤35 nights → submit unlocks normally.
- **Follow-through (step 5):** after trim + submit, generation proceeds end-to-end and the result page shows 35 days. No silent off-by-one (where the user thinks 35 but only 34 are generated).
- **Mobile (375px):** the callout's left-border accent + button stack vertically below the text without overflow. Resize DevTools to 375px and re-trigger step 3.

**Also check the prefs drawer post-generation.** After a saved trip, opening "Ajustar preferencias" exposes editable date / nights. The cap should hold there too — pushing dates past 35 should block the regenerate.

**Common failure modes:**
- Submit fires anyway → the `exceedsMax` guard in `HeroForm.submit()` is broken.
- Callout shows the wrong total → multi-city sum is reading the main segment only.
- Callout text says "35 días" but UI generates 34 (off-by-one) → `MAX_TRIP_DAYS` constant disagreement between HeroForm + backend.
- Trim button visible on multi-city → the `additionalSegments.length === 0` guard on the trim button has regressed.
- Mobile layout breaks → the inline `style={{ marginTop: 0, marginBottom: 16 }}` on the social-proof block isn't honored, or the callout's flex layout is missing wrap behavior.

---

### T1-6: Confidence gate suppresses badges on unmapped destinations (~3 min)

**Pre-condition:** Logged in, has ≥1 trip credit. DevTools console open. Access to Supabase Studio.

**Picking an unmapped destination — don't trust a static list.** Coverage expands over time, so before running this test, grep both tables to pick a city that's still uncovered:
```
grep -E "^\s*'<city>'" lib/intelligence.ts
```
A city that returns zero hits in `NEIGHBORHOOD_COORDS` AND `CITY_CENTROIDS` is a valid test target. Reasonable candidates as of 2026-06-01: **Riga, Tbilisi, Sarajevo, Yerevan, Vilnius, Tallinn, Bratislava**. Confirm with grep before relying on any of them.

**Steps:**
1. Pick an unmapped destination per the grep above
2. Generate a 5-day trip to that destination, walking tolerance = medium
3. Wait for generation to complete
4. Inspect DB: in Supabase Studio → SQL Editor:
   ```sql
   SELECT id, destination, intelligence
   FROM trips
   ORDER BY created_at DESC
   LIMIT 1;
   ```

**Pass criteria:**
- Result page renders normally (title, days, hotel section — everything visible)
- **DayFlowBadge, IntelligenceCallout, and HotelFitBadge are ALL absent** — no qualitative labels on day headers, no notes below day items, no pill above hotels
- Console contains a single warning of the exact shape:
  ```
  [intelligence] coverage below threshold — suppressing badges
    { resolvedBlocks: <small number>, totalBlocks: <larger number>, ratio: <0.NN> }
  ```
- DB query returns `intelligence: null` (literal null, not `{}` and not an object with zero days)

**Counter-test (separate run, must also pass):** Generate a 5-day trip to **Tokyo** (well-mapped after Phase 2 — Shinjuku, Shibuya, Ginza, Asakusa all in NEIGHBORHOOD_COORDS).

**Counter-test pass criteria:**
- All three badges (DayFlow, Callout if applicable, HotelFit) render with qualitative labels
- **No** `[intelligence] coverage below threshold` warning in console
- DB query returns `intelligence` as a populated object with `days: [...]`, `hotel_fit: {...}`, `computed_at: <ISO timestamp>`

**Mixed-coverage edge case (optional, more nuanced):** Generate a trip to a **partially-mapped** city — e.g. Marrakech (in CITY_CENTROIDS but no specific medina/Gueliz entries). Expected: badges DO render because the centroid fallback resolves every block to the same point. Intra-day walking distances may read as 0 km; that's the documented trade-off, not a bug.

**Common failure modes:**
- Badges appear with "Funcional"/"Manejable" defaults on the unmapped city → confidence gate not firing. Check thresholds (`MIN_COVERAGE_RATIO`, `MIN_RESOLVED_BLOCKS`) in `lib/intelligence.ts`.
- No badges on a covered destination → engine is being too aggressive about suppression. Likely the AI emitted block.neighborhood as something that doesn't substring-match the table; check `console.warn` payload for which `totalBlocks` count is being computed.
- DB `intelligence` column is `{}` or has empty `days: []` rather than `null` → the try/catch in `app/api/trips/route.ts` POST is catching too broadly or the engine's null return isn't propagating.
- Counter-test fires the suppression warning → an expected covered city has dropped out of NEIGHBORHOOD_COORDS / CITY_CENTROIDS — grep + add the entry back.

---

## §2 — Trip lifecycle

### T2-1: Sign-up claims anonymous trip

**Pre-condition:** Logged OUT.

**Steps:**
1. Go to `/es/` (homepage), generate a 3-day trip while not logged in
2. After it generates, click "Save" or hit the auth wall
3. Sign up with a fresh email
4. After email confirmation, return to the app

**Pass criteria:**
- Trip appears in "Mis viajes" / "My Trips" list
- DB: the trip row's `user_id` is now set to the new user (was NULL pre-claim)
- Logs (`/api/trips/[trip_id]/claim`): line `[claim] linked trip: ... to user: ...`

**Regression watch (2026-05-26):** This silently failed for a while when the claim route used user-scoped Supabase client + RLS blocked the UPDATE. Fix in `be28d2d`.

---

### T2-2: Share a trip → recipient lands on share wall

**Pre-condition:** Logged in, has a saved trip.

**Steps:**
1. Open the trip on `/es/planner?trip_id=...`
2. Click "Share" → modal opens
3. Copy the share URL
4. Open URL in **incognito window** (logged out)

**Pass criteria:**
- Share URL has format `/es/trips/share/<uuid>`
- Incognito page renders the **share wall** (preview + sign-up prompt) — NOT a redirect to home
- DB: row exists with `share_id = <the uuid>` AND `is_shared = true`

**Regression watch (2026-05-26):** This silently failed when the share-creation UPDATE used user-scoped client + RLS blocked it. Fix in `fc13a73`.

---

### T2-3: Regenerate trip preserves user edits prompt

**Pre-condition:** Logged in, has a saved trip with user-added items.

**Steps:**
1. Open trip
2. Add a custom item to Day 1 (manual entry)
3. Open "Ajustar preferencias" drawer
4. Change a pref (e.g., destination to a different city)
5. Click "Regenerar"

**Pass criteria:**
- Confirmation modal appears: "Vas a perder tus cambios"
- Three options: Replace / Crear nuevo viaje / Cancelar
- Clicking Replace → regenerates, replaces current trip, custom item gone
- Clicking Crear nuevo viaje → routes to fresh planner with the new prefs as a brand-new trip

---

### T2-4: Trip reopen after time gap

**Pre-condition:** Logged in, has a trip created >1 day ago.

**Steps:**
1. Sign in
2. Go to "Mis viajes"
3. Click an old trip

**Pass criteria:**
- Trip loads (DB hydration, not regeneration)
- All days, accommodations, packing, budget rows render
- Pref drawer shows the original travelers/pace/budget
- GA fires `trip_reopened` event with `days_since_creation > 1`

---

## §3 — Consent + privacy

### T3-1: First-time visitor sees cookie banner

**Pre-condition:** Fresh incognito window (no localStorage).

**Steps:**
1. Go to `/es/`

**Pass criteria:**
- Cookie banner appears at the **top** of the viewport (above the nav)
- Two buttons visible: "Solo esenciales" + "Aceptar todas"
- Link to `/privacy` in the body text
- Banner does NOT bump the nav-content out of position visually (CSS variable `--cookie-banner-h` shifts everything down cleanly)

---

### T3-2: Accept all → GA + Meta both load

**Pre-condition:** T3-1 banner visible.

**Steps:**
1. Click "Aceptar todas"

**Pass criteria:**
- Banner disappears
- DevTools console: `window.gtag` is a function, `window.fbq` is a function
- DevTools Network: requests to `google-analytics.com` + `connect.facebook.net` fire
- localStorage: `lagomplan-consent = 'all'`
- DB (consent_log table): new row with `choice='all'`, `user_id` (if authed) or null, `ip_hash` populated, `gpc=false`

---

### T3-3: Essential only → GA denied, Meta never loads

**Pre-condition:** Fresh incognito.

**Steps:**
1. Go to `/es/`
2. Click "Solo esenciales"

**Pass criteria:**
- Banner disappears
- DevTools console: `window.gtag` exists (gtag still loads, Consent Mode v2 just denies), `window.fbq` is `undefined`
- DevTools Network: NO requests to `facebook.net` or `facebook.com`
- localStorage: `lagomplan-consent = 'essential'`
- DB consent_log: row with `choice='essential'`

---

### T3-4: GPC signal honored

**Pre-condition:** Use a browser with GPC enabled (Brave, or Firefox with `privacy.globalprivacycontrol.enabled = true`, or a privacy extension). Fresh incognito.

**Steps:**
1. Open DevTools console, verify `navigator.globalPrivacyControl === true`
2. Go to `/es/`

**Pass criteria:**
- **No cookie banner shown** (banner is silently suppressed)
- localStorage: `lagomplan-consent = 'essential'` (auto-recorded)
- DB consent_log: row with `choice='essential', gpc=true`

---

### T3-5: CCPA "Do Not Sell" link works

**Pre-condition:** Logged in with `consent='all'` (so Meta Pixel is loaded).

**Steps:**
1. Scroll to footer
2. Click "No vender ni compartir mi información personal"

**Pass criteria:**
- Inline confirmation: "✓ Preferencia guardada"
- After ~1.2s, page hard-reloads
- After reload: `window.fbq` is `undefined`, localStorage `consent='essential'`
- DB consent_log: new row with `choice='essential'`

---

### T3-6: Cookie settings link re-opens banner

**Pre-condition:** Cookie consent previously set to anything.

**Steps:**
1. Scroll to footer
2. Click "Configuración de cookies"

**Pass criteria:**
- Banner re-appears at top of viewport
- localStorage `lagomplan-consent` is cleared (key removed)
- Picking either option in the banner re-persists + writes a new consent_log row

---

## §4 — Auth + identity

### T4-1: Sign-up fires both completeRegistration + login events

**Pre-condition:** Fresh email, ready to sign up.

**Steps:**
1. Go to `/es/signup`
2. Sign up with email + password
3. Confirm email (or skip if Supabase confirmation is disabled)

**Pass criteria:**
- GA Realtime / DebugView: both `sign_up` AND `login` events fire (in that order)
- After signup, GA events include `user_id` (the Supabase UUID)
- localStorage `_ga` cookie exists (if consent='all')

---

### T4-2: Returning user login event fires

**Pre-condition:** Existing account, currently logged out.

**Steps:**
1. Sign in
2. Watch GA DebugView

**Pass criteria:**
- `login` event fires (NOT `sign_up`)
- Event has `user_id` populated
- INITIAL_SESSION events do NOT fire as `login` (only real SIGNED_IN transitions)

---

### T4-3: Locale switch on planner with unsaved trip shows confirmation

**Pre-condition:** Logged in, generated but unsaved trip showing on `/es/planner?destination=...&start=...` (no trip_id in URL).

**Steps:**
1. Click EN in the nav language toggle

**Pass criteria:**
- Confirmation modal appears: "Switch language to English?"
- Mentions credit cost in the body
- Cancel → stays on ES, no regen
- Confirm → reloads to `/en/planner?...` with fresh generation, 1 credit consumed

**Pass criteria for SAVED trip (`trip_id` in URL):**
- NO confirmation modal — locale just switches normally

---

## §5 — Monetization

### T5-1: Stripe checkout end-to-end

**Pre-condition:** Stripe test mode OR willing to spend ~$5 and refund.

**Steps:**
1. Go to `/es/planner`, trigger paywall (generate past quota OR click Buy)
2. Choose `trip-1` plan
3. Complete checkout with test card `4242 4242 4242 4242`
4. Land on success URL `/es/planner?checkout=success&session_id=...`

**Pass criteria:**
- DB `user_entitlements.trips_remaining` incremented by 1
- DB consent_log: no change (purchase is contractual, no consent needed)
- GA Realtime: TWO `purchase` events with the same `transaction_id` (one browser-side from success page, one server-side from webhook with `source: 'webhook'`)
- Browser: `events.purchase` fires from TripResult success path
- Server: Stripe webhook log shows `[stripe-webhook] +1 credits` + `gaServerEvent` success

---

### T5-2: Affiliate click attribution

**Pre-condition:** Logged in, has a trip with hotel recommendations.

**Steps:**
1. Open a trip with accommodations
2. Click a hotel "Book" button → opens external Stay22 URL

**Pass criteria:**
- GA Realtime: `affiliate_clicked` event fires with `provider`, `surface: planner-hotels`, `trip_id`
- Network: outbound URL has Stay22 affiliate parameters

---

## §6 — Engagement signals (Tier 3 analytics)

### T6-1: First-touch attribution captured on landing

**Pre-condition:** Fresh incognito.

**Steps:**
1. Go to `/es/?utm_source=newsletter&utm_medium=email&utm_campaign=may2026`
2. Accept all cookies
3. Open DevTools console: `localStorage.getItem('lagomplan-first-touch')`

**Pass criteria:**
- Returns JSON with `utm_source: 'newsletter'`, `utm_medium: 'email'`, `utm_campaign: 'may2026'`, `captured_at: <today>`
- GA user_property `first_touch_source = 'newsletter'` set (visible in DebugView side panel)

---

### T6-2: Editing itinerary fires the event

**Pre-condition:** Logged in, trip showing.

**Steps:**
1. Add a custom item to Day 1
2. Edit an existing item
3. Delete an item
4. Click "+ Añadir día"

**Pass criteria:**
- GA fires four `itinerary_edited` events with `action`: `add`, `edit`, `remove`, `add_day`
- Each event has correct `day_number` and `item_type` (where applicable)

---

### T6-3: Trip completeness updates on check toggle

**Pre-condition:** Trip showing with checks visible.

**Steps:**
1. Toggle 3 checks done
2. Open GA DebugView, expand any event after the toggles
3. Look for user_property `current_completeness`

**Pass criteria:**
- `current_completeness` reflects the percentage done (e.g., `15` if 3/20 checks done)
- Closing the tab fires `trip_completeness` event with the final percentage

---

## §7 — Locale parity

### T7-1: EN-locale planner has no Spanish leaks

**Pre-condition:** Fresh visitor on `/en/`.

**Steps:**
1. Generate a 3-day trip in EN
2. Open the result page
3. Open "Ajustar preferencias" drawer
4. Scroll through every UI element

**Pass criteria:**
- Every label is in English
- Pace dropdown options: "Relaxed · Few activities" / "Balanced" / "Active · Max. experiences"
- Day card buttons: "Edit", "Remove", "Add to Day N"
- Sidebar card titles: "Plan your trip", "Before the trip", "By day", "What to pack", "Budget"
- Edit modal: "Add/Edit activity"
- Currency labels: "Estimated", "Confirmed"
- Date picker months: January, February, etc.

---

## §8 — Critical edge cases

### T8-1: Anonymous user generates → signs up → trip auto-claims

This is essentially T2-1 but worth running as a separate critical-path test because it's the most common new-user flow and historically fragile.

### T8-2: Two browsers, same user → trip syncs

**Pre-condition:** Same account logged in on 2 devices/browsers.

**Steps:**
1. Browser A: generate + save a trip
2. Browser B: refresh "Mis viajes"

**Pass criteria:**
- Trip appears in Browser B without manual sync
- Both browsers can edit; last-write-wins (autosave is debounced ~6s, conflicts not handled — known limitation)

### T8-3: Network drops mid-generation

**Pre-condition:** Logged in, ready to generate a long trip.

**Steps:**
1. Start generating a 15-day trip (uses async + streaming)
2. After chunk 1 lands, disable network (DevTools → Network → Offline) for 30s
3. Re-enable network

**Pass criteria:**
- Polling resumes once network is back
- No duplicate jobs created
- Generation completes (worker continues server-side regardless of client connection)
- Final state is correct

---

## Recently discovered (regression log)

Append-only. Format: `YYYY-MM-DD · short description · fix commit · new test added (if any)`.

### 2026-05-26
- **Share creation silently failed.** RLS blocked the `is_shared = true` UPDATE in the user-scoped Supabase client. Share URLs were generated but never persisted to DB. Fix: `fc13a73`. → Added **T2-2**.
- **Claim route silently failed for the same reason.** Anonymous-to-authed trip linking never worked. Fix: `be28d2d`. → Added **T2-1**.
- **Sonnet 4.6 worker timeout.** 10-day chunks took ~200s on 4.6, exceeded the 145s worker timeout + 150s Supabase Free function cap. All long async trips broke. Fix: dropped `SEGMENT_DAYS` 10→7→5 across two iterations. → Added **T1-2**, **T1-4**.
- **Title quirk: chunk 0's day count leaked to whole trip.** A 30-day trip with 5-day chunks displayed "5 Días en X" because the assembler took chunk 0's title verbatim. Fix: `21c85d0` patches the leading day count. → Covered by **T1-2** pass criteria.

### 2026-06-01
- **Title regex was anchored to start-of-string.** Patcher only matched "5 Días en X" (number-first), missed "X en 5 días" (city-first — the AI alternates between styles). PR #49 changes regex to word-boundary `\b\d+\s+d[ií]as?\b`. → Reflected in **T1-2** pass criteria.
- **Accommodation dates came from chunk 0's sub-range.** "2026-07-01 → 2026-07-05 · 4 noches" on a 19-day Lisbon trip. Two-layer fix: worker rewrites at gen-time (PR #49) + client defensive patch in `normalizeTripData` self-heals existing DB rows at render-time (PRs #47, #48). → Reflected in **T1-2** pass criteria.
- **Streaming flicker — surfaces tick up "5 → 10 → 15 días" as chunks land.** Hotel nights, itinerary section header, and AI-emitted title all read partial state during async streaming. Fix: lock to `Math.max(days.length, durationDaysFromNights(nights))` so target wins during streaming (PR pending — `fix/streaming-lock-target-duration`). → Added explicit "first paint" check to **T1-2** pass criteria.
- **30-day cap rejected legitimate 35-day requests.** Lifted to 35 days end-to-end (6 clamps), added friendly HeroForm warning + trim affordance. → Added **T1-5**.
- **Intelligence engine emitted misleading defaults for unmapped destinations.** Tokyo/Kyoto blocks resolved no coords → engine wrote "Funcional"/"Fluido" defaults that looked confident. Phase 2 fix: expanded NEIGHBORHOOD_COORDS (~50 international entries), added CITY_CENTROIDS fallback, plus a confidence gate that returns `null` when coverage < 30%. → Added **T1-6**.
- **Streaming indicator showed chunk count, not days.** "Generando más días · 1/3" was an internal-implementation leak. Now reads "Generando · 5 de 15 días listos". → Reflected in **T1-2** pass criteria.

---

## Out of scope (don't run here)

Things this doc deliberately doesn't cover, because they belong elsewhere:

- **Visual / pixel-level regression** — needs Percy or Chromatic, separate concern
- **Performance benchmarks** — Lighthouse runs, separate cycle
- **Accessibility audit** — separate cadence, axe / Lighthouse a11y
- **Cross-browser matrix** — assume Chrome unless we hit a Safari-specific bug, then add a test here

---

## Notes for the QA Lead agent

When you find a new bug (or a category of bugs we keep missing), don't just fix-and-forget. Add a test here in the **Recently discovered** section. Over time this becomes the institutional memory we lose between sessions.

When you run a sweep:
1. Skim §1 → §7 by category
2. Run the tests matching the PR's scope
3. Spot-check 2-3 random tests outside that scope (catches incidental breaks)
4. Report findings as: `✓ T1-1, ✓ T1-2, ✗ T3-3 (banner stuck), ✓ T7-1`

When something fails:
- Capture the actual vs expected behavior
- Note the URL, browser, timestamp
- Hand back to dev/main with that context
