# Lagomplan — Trip Planner Product Specification (Validation Spec)

**Purpose:** A complete, requirement-by-requirement specification of the Lagomplan product, written to be **validated against the running product**. Every requirement has acceptance criteria and a current implementation status grounded in the codebase.

**How to use:** Walk each REQ, exercise the acceptance criteria against the app, and mark Pass/Fail. The "Status" column is *my read of the code* as of 2026-06-08 — it is a hypothesis to confirm, not ground truth. Where code and intent disagree, that's a finding.

**Status legend**
- ✅ **Implemented** — code present and appears to satisfy the requirement
- 🔵 **Verified live** — exercised in a running app during this work (2026-06-08)
- ⚠️ **Partial / verify** — present but incomplete, or a code/intent discrepancy worth checking
- ❌ **Gap / stub** — not implemented or an explicit placeholder

**Scope:** Whole product — AI generation, desktop planner, persistence, access & sharing, entitlements & payments, mobile companion view, budget/currency, hotels & affiliate, content (guides / World Cup / smart finds / hotels), newsletter, analytics, consent, i18n, SEO, PDF, reliability.

> **Source-of-truth note:** Counts (e.g. "22 guides", "16 World Cup cities") came from automated code exploration and include some legacy/new-system overlap — treat exact numbers as *verify* items, called out where relevant.

---

## 1. Plan Generation (AI)

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| GEN-01 | The system generates a trip itinerary from form inputs via an LLM. | Submitting a complete form produces a structured plan (days, items, accommodations, budget, packing). | ✅ | `app/api/generate-trip/route.ts`; `supabase/functions/generate-trip/index.ts` |
| GEN-02 | Generation uses Claude via structured tool output. | Model returns JSON via an `emit_trip` tool against a fixed schema; default model `claude-sonnet-4-6`, overridable via `GENERATE_TRIP_MODEL`. | ✅ | `supabase/functions/generate-trip/index.ts:989,1026-1034` |
| GEN-03 | Nights/overnight are computed server-side, never trusted from the client. | Accommodation dates always align to server-computed nights. | ✅ | `app/api/generate-trip/route.ts:146-162` |
| GEN-04 | Overnight trips MUST include ≥1 accommodation covering all nights; same-day trips MUST have none. | Validation gate enforces this; violation triggers one retry with a tightened prompt. | ✅ | `app/api/generate-trip/route.ts:221-244` |
| GEN-05 | If accommodations are still missing after retry, the server synthesizes a fallback hotel. | A plan never renders overnight with zero hotels; fallback flagged `source:'fallback'`. | ✅ | `lib/planner/validate-trip.ts`; `route.ts:246-293` |
| GEN-06 | Empty `days[]` after retry is unrecoverable and surfaced as an error. | Returns 502 `no_days_after_retry`; user can regenerate. | ✅ | `app/api/generate-trip/route.ts:303-320` |
| GEN-07 | Prompt is context-aware: season, hemisphere, weekday, jet-lag, World Cup overlap. | Generated content reflects travel dates/season. | ✅ | `supabase/functions/generate-trip/index.ts:255-385,490-555` |
| GEN-08 | Multi-city trips lock each day to one city with transfer blocks and per-segment accommodations. | Day→city mapping holds; transitions include transfers. | ✅ | `supabase/functions/generate-trip/index.ts:387-488` |
| GEN-09 | Long/multi-city trips (>10 days) generate asynchronously in ~5-day chunks with progress. | Job is queued, polled, partial results stream into the UI. | ✅ | `app/api/trips/jobs/route.ts`; `TripResult.tsx:2133-2191` |
| GEN-10 | Generation errors are typed and surfaced to the user. | Codes: `claude_upstream_failed`, `llm_truncated`, `llm_no_tool_use`, `llm_empty_days`, `timeout`, `anon_limit_reached`, `no_credits`. | ✅ | `route.ts:200-219`; `index.ts:1038-1091` |
| GEN-11 | Transient failures (500/502/503/504) auto-retry once client-side; 529 overload shown immediately. | One silent retry after 1.5s; 529 not retried. | ✅ | `TripResult.tsx:131-156` |

---

## 2. Input Form (HeroForm)

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| FORM-01 | Required inputs: origin, destination, dates, traveler type, pace. | Submit blocked with per-field errors until all present. | ✅ | `components/forms/HeroForm.tsx:228-241` |
| FORM-02 | Traveler types: solo / pareja / familia / amigos, with detail sub-forms. | Familia → adults (1–10) + children (baby 0–2 / kid 3–14); amigos → group count (2–30). | ✅ | `HeroForm.tsx:508-625` |
| FORM-03 | Optional inputs: interests (8 chips + free text), budget amount, currency (MXN/USD), walking tolerance. | All feed the prompt; budget is a string like "20,000 MXN". | ✅ | `HeroForm.tsx:627-767` |
| FORM-04 | Multi-city: up to 4 added cities; each leg has from/to/dates; total capped at 35 days. | Over-cap warns + offers trim. | ✅ | `HeroForm.tsx:172,212-226,441-506` |
| FORM-05 | Form state serializes to URL params (clean for solo/pareja). | Familia/amigos add detail params; solo/pareja don't. | ✅ | `HeroForm.tsx:322-332` |

---

## 3. Desktop Planner (editing, autosave, versions)

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| PLAN-01 | User can edit day titles, item name/description/time, packing items, budget rows. | Edits persist via autosave. | ✅ | `TripResult.tsx:1884-1975` |
| PLAN-02 | Autosave fires ~1500ms after any change; identical content is a no-op. | No redundant PATCH when nothing changed. | ✅ | `TripResult.tsx:1896-1966` |
| PLAN-03 | Autosave PATCH is a **wholesale `trip_data` overwrite** — every persisted field must be bundled. | Accommodations + segments included each save so bookings/multi-city survive edits. | ✅ ⚠️ | `TripResult.tsx:1908-1922`; risk documented in memory `project_trip-data-wholesale-overwrite` |
| PLAN-04 | Failed saves retry with backoff (0.5s/1.5s/4.5s), then show an error + manual retry. | After 3 fails, status=error. | ✅ | `TripResult.tsx:1927-1975` |
| PLAN-05 | A final dirty-save flushes on tab close via `pagehide` + `keepalive`. | Closing the tab mid-edit still persists. | ✅ | `TripResult.tsx:2002-2038` |
| PLAN-06 | First generation POSTs to create the row; URL updates without reload. | `trip_id` returned, `history.replaceState` used. | ✅ | `TripResult.tsx:1720-1771` |
| PLAN-07 | Regeneration preserves a version history; user can restore prior versions. | Snapshots stored on regenerate. | ✅ ⚠️ | `TripResult.tsx:2207-2240` (verify restore UX) |
| PLAN-08 | Anonymous-generated trips are cached and saved to the account on login. | `sessionStorage` pendingSave/tripCache flushed post-auth. | ✅ | `TripResult.tsx:1539-1567,1833-1848` |
| PLAN-09 | "Intelligence" (day load, hotel fit, flags) computed at save from `walking_tolerance`. | `intelligence` JSONB populated; failure is non-blocking (null). | ⚠️ | `app/api/trips/route.ts:122-136`; UI badge status to verify |
| PLAN-10 | Planner exposes Save status, Share, PDF, and "Vista móvil". | All four actions present in the result header. | ⚠️ | Header actions referenced; verify each renders |

---

## 4. Data Model & Persistence

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| DATA-01 | `trips` row holds: id, slug, title, user_id (null=anon), trip_data, trip_progress, destination, origin, duration_days(0–35), travelers, travel_style, budget_level, interests[], traveler_adults/children/group_count, currency, intelligence, walking_tolerance, share_id, is_shared. | Schema matches. | ✅ | `supabase/migrations/*` |
| DATA-02 | `trip_data` (planner-owned blob) and `trip_progress` (companion-owned blob) are separate columns. | Planner never writes trip_progress; companion never writes plan structure. | ✅ 🔵 | `companion/route.ts:4-17`; `lib/planner/progress.ts` |
| DATA-03 | `currency` lives in BOTH the top-level column (desktop reads) and `trip_data.currency` (mobile reads), always written together. | Both copies stay in sync after any currency write. | 🔵 | Verified live: owner DB round-trip 2026-06-08; `companion/route.ts:119`; migration `20260512100000` |
| DATA-04 | Companion writes are read-modify-write into `trip_data` for doneChecks/budget, wholesale for trip_progress. | Other `trip_data` fields preserved on a companion save. | ✅ | `companion/route.ts:113-162` |
| DATA-05 | Booking confirmations merge into `trip_data.accommodations[idx]` via `booking-confirm`. | Accommodation resolved by id, `acc-N` index, or appended fallback. | ✅ | `booking-confirm/route.ts:137-144` |

---

## 5. Access Control & Sharing

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| ACC-01 | Owner has full read/write on their trip. | Session user == `user_id` → full access. | ✅ | `app/[locale]/trips/[trip_id]/page.tsx:77-80` |
| ACC-02 | Anonymous trip (`user_id` null) is readable/writable by anyone with the link. | URL-knowledge-gated; companion + booking writes allowed without auth. | ✅ | `companion/route.ts:94-101` |
| ACC-03 | Shared trip (`is_shared`) is readable by others; logged-in non-owner is read-only on the companion view. | `canEdit = isOwner || isAnonTrip`. | ✅ | `MobileTripClient.tsx:258` |
| ACC-04 | Private, non-owner access → redirect to locale home (no existence leak). | 404→redirect, not 403. | ✅ | `page.tsx:79-80`; `[trip_id]/route.ts:49-56` |
| ACC-05 | Share link: owner generates a `share_id`; public preview returns safe fields only (never `trip_data`). | `GET /trips/share/[shareId]` → {trip_id,title,destination,duration_days}. | ✅ | `share/[shareId]/route.ts:45-50` |
| ACC-06 | Anonymous trip can be claimed by a user after signup (idempotent). | `POST /claim` sets user_id only when currently null. | ✅ | `claim/route.ts:50-58` |
| ACC-07 | Companion/private/account pages are `noindex`. | robots meta present; robots.txt disallows `/trips/`, account, my-trips. | ✅ | `lib/seo.ts:139-150`; `app/robots.ts:28-46` |

---

## 6. Entitlements, Quotas & Payments

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| PAY-01 | Anonymous users get 1 free generation (cookie-tracked, 30-day). | 2nd anon attempt → 401 `anon_limit_reached`. | ✅ | `lib/plan/limits.ts:21`; `generate-trip/route.ts:120-129` |
| PAY-02 | New signups get tier `free` with 3 trips (auto-provisioned). | Trigger creates entitlement row on signup. | ✅ | migration `20260415000000:32-45` |
| PAY-03 | Regenerating an owned trip is free (no credit consumed). | Credit count unchanged after regenerate. | ✅ | `generate-trip/route.ts:100-103` |
| PAY-04 | Out-of-credit generation returns 402 and opens the paywall. | Paywall modal shown with plans. | ✅ | `route.ts:106-115`; `PaywallModal.tsx` |
| PAY-05 | Products: trip-1 ($39), trip-5 ($149), trip-10 ($249), Explorer subscription ($199/mo) — MXN. | Pricing page + paywall show these. | ⚠️ | `pricing/page.tsx:96-153` (verify prices/labels live) |
| PAY-06 | Checkout creates a Stripe session (payment or subscription) with user_id + ga_client_id metadata. | Redirects to Stripe; success → `?checkout=success`. | ✅ | `api/checkout/route.ts:74-105` |
| PAY-07 | Webhook grants entitlements idempotently. | `checkout.session.completed` → add credits / set explorer; `last_session_id` prevents double-grant. | ✅ | `api/stripe-webhook/route.ts:55-140,75-84` |
| PAY-08 | Subscription cancel reverts to free. | `customer.subscription.deleted` → tier=free. | ✅ | `stripe-webhook/route.ts:173-209` |
| PAY-09 | Fallback fulfillment if webhook is late. | `POST /api/checkout/fulfill` mirrors webhook, idempotent. | ✅ | `checkout/fulfill/route.ts:72-137` |
| PAY-10 | `GET /api/me/plan` returns the user's plan state. | {tier, trips_remaining, trips_used, is_subscriber}. | ✅ | `api/me/plan/route.ts:12-28` |
| PAY-11 | Account / billing page (plan, subscription mgmt). | Self-serve plan view + cancel. | ❌ | `app/[locale]/account/page.tsx:4` is a stub ("Coming soon") |
| PAY-ENV | Required env: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_TRIP_1/5/10`, `STRIPE_PRICE_EXPLORER`, `STRIPE_WEBHOOK_SECRET`. | Missing → checkout 503. | ✅ | `api/checkout/route.ts:53-63` |

---

## 7. Mobile Companion View (`/[locale]/trips/[trip_id]`)

> Detailed cases in `docs/qa/mobile-view-test-cases.md` (164 cases). Highlights below.

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| MOB-01 | Read-mostly companion with 3 tabs: Itinerario / Presupuesto / Preparativos. | Tabs switch; day selector only on Itinerario. | ✅ | `MobileTripClient.tsx` |
| MOB-02 | Mobile user-agent hitting `/planner?trip_id=` redirects to `/trips/[id]` (unless `full=1`). | Redirect happens; `full=1` escapes it. | ✅ | `app/[locale]/planner/page.tsx:42-52` |
| MOB-03 | "Today" day is auto-selected from trip start, clamped to range. | Correct day highlighted within trip dates. | ✅ | `lib/planner/mobile-view.ts` (unit-tested U-11..U-15) |
| MOB-04 | Per-activity note + link save (sanitized), packing check-off → `trip_progress`. | Persist for owner (DB) / anon (localStorage). | ✅ | `progress.ts`; `companion/route.ts` |
| MOB-05 | Saving a note collapses the activity row and shows a 📝/🔗 indicator. | Row closes; indicator on collapsed row; "Guardado ✓" toast. | 🔵 | Verified live 2026-06-08 |
| MOB-06 | Activity "done" state is visually unambiguous and ticks the matching day task. | Filled green + checkbox; per-day counter +1. | 🔵 | Verified live 2026-06-08 |
| MOB-07 | Preparativos sections ("Antes de salir", "Qué llevar") collapse/expand. | Header toggles hide/show rows. | 🔵 | Verified live 2026-06-08 |
| MOB-08 | Progress bar counts all checks (per-day + pre-trip) + packing. | NN% and done/total accurate. | ✅ | `MobileTripClient.tsx:425-430` |
| MOB-09 | Hotel card: always shows a "Reservar" CTA; multi-city shows the day's city hotel. | Fallback hotel synthesized when no accommodations. | ✅ | `lib/planner/use-effective-accommodations.ts` |
| MOB-10 | PDF action opens the desktop print layout (`?full=1&print=1`). | New tab fires print of the desktop document. | ✅ ⚠️ | memory `project_mobile-view-trip-progress`; verify print fires |
| MOB-11 | Owner sees Guardado + Compartir + PDF; non-owner read-only (no edit controls). | Read-only viewer has no note/confirm inputs. | ✅ | spec §Edit permission |

---

## 8. Budget & Currency

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| BUD-01 | Budget shows three totals: IA estimó / Tu estimado / Confirmado. | Totals computed; priority actual>userEst>aiEst. | ✅ | `MobileTripClient.tsx:1290-1294`; `TripResult.tsx:3128-3131` |
| BUD-02 | Budget editable on mobile: per-row "Tu" (userEst) and "Real" (actual), persisted. | Owner→DB, anon→localStorage. | ✅ | `companion/route.ts` budgetActuals/UserEsts |
| BUD-03 | "Total" vs "Por persona" view divides by parsed traveler count (never /0). | Per-person = total/people, rounded. | ✅ | `lib/planner/mobile-view.ts` parsePeopleCount (U-16..U-18) |
| BUD-04 | Currency is one trip-wide setting (MXN/USD), **no conversion** — relabel only. | Flipping currency does not change numbers. | 🔵 | Verified live; `MobileTripClient.tsx` + desktop parity |
| BUD-05 | Currency choice persists and is identical on web and mobile. | Set on either surface → sticks on reload, both surfaces agree. | 🔵 | Verified live (owner DB + anon localStorage) 2026-06-08 |
| BUD-06 | Invalid currency values are ignored (not a 400). | Endpoint coerces; bad value leaves currency untouched. | ✅ | `lib/planner/progress.ts coerceCurrency`; tests U-23/24 |

---

## 9. Hotels, Booking & Affiliate

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| AFF-01 | Affiliate links use the canonical Stay22 `allez` form with address/dates/adults/campaign. | Built via `buildAffiliateLink`; never throws on bad input. | ✅ | `lib/affiliate/build.ts:28-91` |
| AFF-02 | Providers: booking, hotels.com, getyourguide, expedia. | Each maps to an allez slug + category. | ✅ | `lib/affiliate/providers.ts:27-52` |
| AFF-03 | Stay22 LetMeAllez auto-intercept loads site-wide; **every** app-owned `stay22.com` link is protected globally so LetMeAllez can never re-wrap it. | Owned links land on intended `lagomplan` URL with full campaign attribution, not the bare site `lmaID`; no double-tab; non-stay22 + modifier clicks unaffected. | ✅ 🔵 | `components/affiliate/Stay22Guard.tsx` (capture-phase site-wide guard, mounted in `layout.tsx`); supersedes the per-anchor pattern. **Verified live 2026-06-09** (Playwright: cdmx + oaxaca surfaces, guard won the race vs a simulated bubble-phase interceptor; probes for scope/skip-marker/modifier-click passed). memory `project_stay22-letmeallez-intercept` |
| AFF-04 | Booking confirmation ("Ya reservé") stored with code/checkin/notes/url (url sanitized). | Confirmed card shows code; bad URL scheme stripped. | ✅ | `booking-confirm/route.ts:77-82` |
| AFF-05 | Affiliate clicks emit `affiliateClicked` (+ hotel-specific events). | provider/surface/category/trip_id captured. | ✅ | `lib/analytics/events.ts:380-407` |

---

## 10. Content — Guides

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| GUI-01 | Destination guides with hero, itinerary, hotels, experiences, tips, fun fact, checklist, transport — bilingual (en/es). | Guide detail renders all sections in both locales. | ✅ | `lib/data/guides/types.ts:200-212` |
| GUI-02 | Guides index lists guides with title/excerpt/tags/cover + featured. | `/[locale]/guides` renders the grid. | ✅ | `app/[locale]/guides/page.tsx:37-54` |
| GUI-03 | Detail route prefers new `FlatGuide` system, falls back to legacy `lib/guides.ts`. | Both render paths work. | ✅ ⚠️ | `guides/[slug]/page.tsx:92-106` (dual system) |
| GUI-04 | Guide hotels/experiences carry Stay22/GetYourGuide affiliate links. | Booking/activity CTAs are affiliate URLs. | ✅ | `lib/data/guides/adapter.ts:146` |
| GUI-05 | Destination coverage count. | Expected set of destinations present in both locales. | ⚠️ | Exploration reported ~22 (legacy+new mixed); **verify exact live count** — only a subset have new `en.ts/es.ts` folders |

---

## 11. Content — World Cup 2026

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| WC-01 | Host-city field guides: stadium, matches, stay neighborhoods, hotels, food, experiences, match-day logistics, tips. | City detail renders all sections. | ✅ | `lib/worldcup/types.ts:167-213`; `data/cdmx.ts` |
| WC-02 | World Cup index lists all host cities. | `/[locale]/(mundial|worldcup)` grid. | ✅ | `app/[locale]/worldcup/page.tsx:22-32` |
| WC-03 | City hotels/experiences use Stay22/Booking/GetYourGuide affiliate links. | Affiliate CTAs present. | ✅ | `lib/worldcup/types.ts:67-68,122` |
| WC-04 | All host cities have full editorial content. | No "Guía en construcción" stubs. | ❌ | ~5 of 16 cities are stubs | `app/[locale]/worldcup/[slug]/page.tsx:20-26` |

---

## 12. Content — Smart Finds

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| SF-01 | Curated packing/product kits by persona (familias / parejas / fan). | Kits render products with brand/price/opinion/link. | ⚠️ | Only **familias** is live; parejas/fan not rendered | `app/[locale]/smart-finds/familias/page.tsx` |
| SF-02 | Smart Finds index + per-kit `[slug]` routing. | Index lists kits; each kit has its own page. | ❌ | Index is "Coming soon"; `[slug]` not implemented | `smart-finds/page.tsx:1-40` |
| SF-03 | Catalog is Supabase-backed with ISR. | Studio edits appear within revalidation window. | ⚠️ | DB + deprecated static `kits.ts/products.ts` both active | `lib/smart-finds/db.ts` |

---

## 13. Content — Hotels listing & Destinations

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| HOT-01 | Aggregated hotels page combining guide + World Cup hotels, searchable/filterable. | Filter by archetype/price/destination; search by name. | ✅ | `lib/hotels.ts:157-261`; `app/[locale]/hotels/page.tsx` |
| HOT-02 | Per-hotel detail pages. | `/[locale]/hotels/[slug]` renders a hotel. | ❌ | `[slug]` subdir empty; listing only |
| HOT-03 | Some archetype filters (Pet Friendly, LGBTQ+) are "coming soon". | Disabled filters labeled. | ⚠️ | `lib/hotels.ts:69-81` |
| DST-01 | Destinations section (listing + detail). | `/[locale]/destinations` shows destinations. | ❌ | Stub "Coming soon"; no data layer | `app/[locale]/destinations/page.tsx:23-39` |

---

## 14. Newsletter (Mailchimp)

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| NL-01 | All newsletter forms (popup, footer, sidebar, end-of-guide, PDF prompt, smart-finds, mobile view) subscribe via one route. | `POST /api/subscribe` shared by all 7 surfaces. | ✅ 🔵 | `app/api/subscribe/route.ts`; callers enumerated |
| NL-02 | Email is validated (trim/lowercase, basic RFC check). | Invalid → 422 "Valid email required". | ✅ 🔵 | `lib/newsletter.ts isValidNewsletterEmail`; tests N-01..N-04b |
| NL-03 | Missing/empty Mailchimp config returns a clear 500. | No `MAILCHIMP_API_KEY`/`LIST_ID` → "Server configuration error". | ✅ 🔵 | `lib/newsletter.ts readMailchimpConfig`; tests N-05..N-09 |
| NL-04 | "Member Exists" is treated as success. | Re-subscribe is a smooth 200. | ✅ | `subscribe/route.ts:84-87` |
| NL-05 | **Required env (`MAILCHIMP_*`) must be present on ALL Vercel environments incl. every Preview branch.** | Newsletter works on feature-branch previews, not just main/prod. | 🔵 | **Fixed 2026-06-08** — vars were scoped to `Preview (main)`+Production only; now added for all Preview. memory `project_newsletter-mailchimp-env-scope` |
| NL-06 | Subscribe emits `waitlistSignup`/`lead` with surface attribution. | Event fires on success. | ✅ | `lib/analytics/events.ts:432-435` |

---

## 15. Analytics & Tracking

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| AN-01 | GA4 + Meta Pixel with a defined event catalog. | Events fire at the documented moments. | ✅ | `lib/analytics/events.ts` |
| AN-02 | Funnel events: plannerStarted, search, itineraryGenerated, tripSaved, tripShared, regenerateRequested, affiliateClicked, purchase. | Each fires once per logical action (sampled where noted). | ✅ | `events.ts` (per-event) |
| AN-03 | Mobile companion events: opened/day/tab/activity/note/task/newsletter. | Fire on the matching interactions. | ✅ | `events.ts:558-617` |
| AN-04 | Page views fire on every App Router route change (GA + Pixel). | SPA navigations tracked. | ✅ | `lib/analytics/ga.ts:57-68` |
| AN-05 | Analytics are consent-gated (see §16). | No Pixel load / no GA storage until consent='all' / 'analytics granted'. | ✅ | `components/analytics/ConsentSync.tsx` |

---

## 16. Consent & Privacy

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| CON-01 | Cookie banner shown until a choice is made; choices = all / essential. | Banner only when consent is null. | ✅ | `components/layout/CookieBanner.tsx:25-82` |
| CON-02 | GA loads in Consent Mode v2 denied-by-default; granted only on "all". | `gtag('consent','update')` flips analytics_storage. | ✅ | `layout.tsx:153-180`; `ConsentSync.tsx:53-77` |
| CON-03 | Meta Pixel not injected at all unless consent='all'. | Essential users get no Pixel. | ✅ | `ConsentSync.tsx:80-110` |
| CON-04 | Global Privacy Control auto-sets 'essential' silently. | GPC browser → no banner, essential. | ✅ | `lib/consent.ts:96-99` |
| CON-05 | Every consent decision is audit-logged (hashed IP + UA + locale + GPC + policy version). | `POST /api/consent` writes `consent_log`. | ✅ | `api/consent/route.ts:42-86`; migration `20260522000000` |
| CON-06 | Consent is withdrawable (re-open banner from footer). | `clearConsent()` re-shows banner. | ✅ | `lib/consent.ts:79-85` |
| CON-ENV | `CONSENT_IP_SALT` required for IP hashing. | Present in env. | ✅ | migration + route |

---

## 17. i18n & Routing

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| I18N-01 | Two locales (es default, en); every route carries an explicit `/es/` or `/en/` prefix. | `localePrefix: 'always'`. | ✅ | `i18n.ts:10-12`; `middleware.ts:16-20` |
| I18N-02 | Route segments are localized per locale (e.g., planner↔planificador). | `getRoute(locale,key)` returns the right path. | ✅ | `lib/routes.ts:20-78` |
| I18N-03 | Locale switch on entity pages resolves the correct alternate slug. | Switching language keeps you on the same content. | ✅ | `lib/routes.ts:178-191`; `Nav.tsx:89-100` |
| I18N-04 | Legacy Webflow URLs 301-redirect to localized routes. | Old `/guias/...` → `/es/guias/...`. | ✅ | `middleware.ts:24-53` |

---

## 18. SEO & Metadata

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| SEO-01 | Dynamic sitemap incl. static routes + guide/worldcup/smart-finds pages with hreflang pairs. | `/sitemap.xml` complete; es x-default canonical. | ✅ ⚠️ | `app/sitemap.ts` (destinations/hotels detail not yet enumerated) |
| SEO-02 | robots.txt disallows private/functional routes; private pages `noindex`. | `/trips/`, account, my-trips blocked. | ✅ | `app/robots.ts:28-46`; `lib/seo.ts:139-150` |
| SEO-03 | OpenGraph + hreflang alternates per route; JSON-LD Organization + WebSite site-wide. | Tags present in head. | ✅ | `lib/seo.ts:116-190`; `layout.tsx:120-138` |
| SEO-04 | Canonical host is `https://www.lagomplan.com`. | Canonicals use www. | ✅ | `lib/seo.ts:25` |

---

## 19. PDF / Print

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| PDF-01 | Planner produces a print-tuned A4 document via `?print=1`, auto-firing `window.print()`. | Print dialog opens with the magazine layout. | ✅ ⚠️ | `app/globals.css` @media print; verify auto-fire timing |
| PDF-02 | Guide pages have a separate print stylesheet (force-open accordions, A4 margins). | Guide PDF renders cleanly. | ✅ | `app/globals.css` guide @media print |
| PDF-03 | Opening print view fires `guideDownload`. | Event recorded. | ✅ | `events.ts:441-444` |

---

## 20. Reliability — Async Jobs & Cron

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| REL-01 | Async generation jobs persist status/progress and stream partial results. | `generation_jobs` row tracks chunks_total/done, partial_result. | ✅ | `api/trips/jobs/*`; migrations |
| REL-02 | Stuck jobs self-rescue when polled (>180s stale → re-invoke worker). | A stalled job resumes on next poll. | ✅ | `jobs/[id]/route.ts:56-81` |
| REL-03 | A reconcile endpoint re-invokes stale jobs (>2min), secured by `CRON_SECRET`. | `GET /jobs/reconcile` re-runs up to 10. | ✅ ⚠️ | `jobs/reconcile/route.ts`; **`vercel.json` has no cron entry — verify the schedule is wired** |
| REL-ENV | `CRON_SECRET` set; worker reachable at Supabase Edge `generate-trip-worker`. | Reconcile authorized; worker invoked. | ✅ | `reconcile/route.ts:18-23` |

---

## 21. Non-Functional / Platform

| REQ | Requirement | Acceptance criteria | Status | Evidence |
|-----|-------------|---------------------|--------|----------|
| NF-01 | Secrets only in server env (never `NEXT_PUBLIC_*` or git). | Stripe/Mailchimp/service-role keys server-side. | ✅ | route guards; `.env.local` gitignored |
| NF-02 | Env parity across Vercel environments (Production / Preview-all / Development). | No feature silently breaks on preview branches. | ⚠️ 🔵 | Newsletter regression (NL-05) was exactly this class; also `NEXT_PUBLIC_SUPABASE_FUNCTION_URL` is `Preview (main)`-scoped — **verify** |
| NF-03 | Admin (service-role) client used only where RLS must be bypassed, always with an explicit ownership guard. | No unguarded admin writes. | ✅ | every admin route pairs `.eq('user_id', …)` |
| NF-04 | Sync generation bounded at 290s; async at 900s; poll 2s. | No request exceeds platform limits. | ✅ | `generate-trip/route.ts:174`; `TripResult.tsx:2102-2103` |

---

## Validation Summary

| Domain | ✅/🔵 | ⚠️ | ❌ |
|--------|------|----|----|
| Plan generation | 11 | 0 | 0 |
| Input form | 5 | 0 | 0 |
| Desktop planner | 7 | 3 | 0 |
| Data & persistence | 5 | 0 | 0 |
| Access & sharing | 7 | 0 | 0 |
| Entitlements & payments | 9 | 1 | 1 |
| Mobile companion | 9 | 2 | 0 |
| Budget & currency | 6 | 0 | 0 |
| Hotels & affiliate | 5 | 0 | 0 |
| Content: guides | 4 | 1 | 0 |
| Content: world cup | 3 | 0 | 1 |
| Content: smart finds | 0 | 2 | 1 |
| Hotels listing / destinations | 1 | 1 | 2 |
| Newsletter | 5 | 0 | 0 |
| Analytics | 5 | 0 | 0 |
| Consent | 7 | 0 | 0 |
| i18n | 4 | 0 | 0 |
| SEO | 3 | 1 | 0 |
| PDF | 2 | 1 | 0 |
| Reliability | 3 | 1 | 0 |
| Non-functional | 3 | 1 | 0 |

### Top gaps & stubs (prioritized)
1. ❌ **Account / billing page** is a stub (PAY-11) — users can't see/manage their plan or subscription.
2. ❌ **Smart Finds** — only `familias` lives; index + `[slug]` routing unbuilt (SF-01/02).
3. ❌ **Destinations** section is a "Coming soon" stub (DST-01).
4. ❌ **Hotel detail pages** don't exist; **World Cup** has ~5 stub cities (HOT-02, WC-04).
5. ⚠️ **Env parity (NF-02)** — the newsletter outage was a `Preview (main)`-only scoping bug (now fixed); `NEXT_PUBLIC_SUPABASE_FUNCTION_URL` has the same scoping and should be checked.
6. ⚠️ **`vercel.json` has no cron entry** (REL-03) — confirm the reconcile schedule is actually wired, or stale jobs rely only on client-poll rescue.

### Things this spec asserts but you should confirm live
- Exact **guide destination count** and which use the new vs legacy system (GUI-05).
- **Pricing** numbers/labels on the live pricing page + paywall (PAY-05).
- **Version-history restore** UX in the planner (PLAN-07).
- **Intelligence badges** actually render in the planner (PLAN-09).
- **PDF auto-print** timing on desktop + mobile (PDF-01 / MOB-10).

### Verified live this session (🔵)
Mobile UX fixes (done-state, note-save-collapse, prep collapse), **currency persistence** across web+mobile (owner DB + anon localStorage round-trips), and the **newsletter** diagnosis + fix (config guard behavior + Vercel preview-scope). See `docs/qa/mobile-view-test-cases.md` and the memory files.

---

*Generated 2026-06-08 from a code-grounded exploration of the repository. Treat every Status as a claim to validate, not a guarantee.*
