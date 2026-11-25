# Lagomplan product audit, code vs spec (24 Nov 2026)

Read-only audit of `lagomplan-next` against the 68 rules in the product spec.

## 0. Provenance and limits (read first)

- **Branch moved during the audit.** The audit began on `feat/hotel-place-clicks` (`a6e04b0`, one commit ahead of `origin/main`). The reflog shows `HEAD` was then switched to `feat/paid-hotel-demo` (`e9078b5`) while four read-only agents were reading. The payments/platform and inventory agents report `feat/paid-hotel-demo`; the content/guest-guide agent reports `feat/hotel-place-clicks`; the planner agent did not record a branch. Planner, payments and platform code is shared by both branches, so those verdicts should hold. **Hotel and guest-guide verdicts (CNT-02, CNT-03, GG-*, Q5, Q6) may differ between branches. Re-run those on `main` before turning them into tests.** Nothing was checked out or modified by this audit.
- Method: static reading only. No network, no Anthropic calls, no database queries, no secret values read. Hotel data defects were computed with read-only scripts printing to stdout.
- Line numbers marked `~` are approximate. Quoted code is kept to a minimum.
- Production-state questions (Stripe prices, RLS in prod, Stripe dunning, pg_cron purges) cannot be answered from code. The query that would answer each is named.
- Not a code-verifiable fact: spec section 1 claims about the live site.

## 1. Summary table (verdicts per area)

| Area | Rules | PASS | PARTIAL | FAIL | NOT BUILT |
|---|---|---|---|---|---|
| Planner (PLN) | 15 | 4 | 8 | 2 | 1 |
| Payments (PAY) | 10 | 1 | 8 | 1 | 0 |
| Content (CNT) | 10 | 4 | 1 | 5 | 0 |
| Guest guides (GG) | 12 | 6 | 6 | 0 | 0 |
| Concierge (CON) | 7 | 0 | 0 | 0 | 7 |
| Platform (PLT) | 7 | 1 | 3 | 3 | 0 |
| Intelligence (INT) | 7 | 0 | 1 | 2 | 4 |
| **Total** | **68** | **16** | **27** | **13** | **12** |

CANNOT TELL FROM CODE was not used as a verdict; the unknowns are noted inside PARTIAL rows.

## 2. The ten findings that most affect revenue or trust

1. **Itineraries are model knowledge only; "verified plan" is not true.** The prompts receive form fields only. No guide, hotel catalog, experience or Places data is injected (`supabase/functions/generate-trip/prompt.ts` ~1018; worker skeleton ~`generate-trip-worker/index.ts:905`). No Places call exists anywhere (PLN-08, INT-01, INT-02). A comment at worker ~140 says "Places-equivalent context is already in the prompt"; it is not.
2. **Buying Explorer wipes unused pack credits.** The webhook and `/api/checkout/fulfill` upsert `trips_remaining: 0` on subscription (`app/api/stripe-webhook/route.ts`, `app/api/checkout/fulfill/route.ts`). Cancelling sets `tier='free'` with 0 credits (PAY-05).
3. **Credit grant is not idempotent or atomic.** Guard is `last_session_id === session.id` (remembers only the latest session); grant is read-then-write; the webhook and `/fulfill` can race; DB errors are logged but the handler returns 200 so Stripe never retries (PAY-04, `stripe-webhook/route.ts`, `checkout/fulfill/route.ts`).
4. **Unauthenticated cost exposure.** No rate limit on `/api/generate-trip`, `/api/trips/jobs`, `/api/checkout`, `/api/contact`, `/api/subscribe` (PLT-03). The anonymous gate is one httpOnly cookie `anon_gen_count` (`app/api/generate-trip/route.ts`), reset by clearing cookies. The sync route has no duration check, so an anonymous direct POST of a long trip is not blocked (the >5-day gate is client-side, `TripResult.tsx:1734`). Prompt inputs are interpolated unsanitised (`prompt.ts:599,822,834,945`; PLT-04). Sync route `maxDuration = 300`, ~$0.13-0.21 per trip.
5. **Subscription lifecycle is incomplete.** No `invoice.payment_failed`, `customer.subscription.updated` or `past_due` handler, so a failed renewal keeps `explorer` (unlimited) until Stripe's dunning deletes it. No `billingPortal`, no cancel control, yet the FAQ says "Cancel from your account" (`messages/en.json:320`) (PAY-07).
6. **Affiliate revenue leaks in hotel data.** 72 of 80 booking.com links have no `aid`; 68 carry only `ref=lagomplan`, which is not an affiliate ID (`lib/affiliate/index.ts:48`). 6 pairs of hotels share one link (section 4, CNT-02); Los Cabos links all 3 hotels to a Dolores Hidalgo, Guanajuato address (`lib/data/guides/los-cabos/es.ts:104,114,124`). Airalo Smart Finds cards link to `#` (`lib/smart-finds/products.ts:447,597,710`) (CNT-02, PAY-10).
7. **No affiliate disclosure on most affiliate pages.** Present only on Hoteles, Experiencias (`messages/*.json:413,483`), Smart Finds familias (`familias/page.tsx:169`) and the booking modal (`TripResult.tsx:5405`). Missing on guides (`components/guides/HotelsSection.tsx`, `ExperiencesSection.tsx`, `GuideHotelsTeaser.tsx`), World Cup pages, planner hotel section, mobile trip view, `/guia/*` (PAY-09).
8. **Anthropic billing/quota errors reach users raw, and nothing alerts.** Upstream body is forwarded in `detail` (`generate-trip/index.ts:382-388`) and appended to the visible error (`TripResult.tsx:1783-1785`). No alerting in code (PLT-06).
9. **Anonymous results are not stored; the "7 days" promise is not enforced.** The sync route persists nothing; result lives in `sessionStorage.tripCache`. Anon-to-account migration works only in the same tab (`TripResult.tsx:1969-1984`); `/api/trips/[trip_id]/claim` exists but nothing calls it (PAY-08, Q2).
10. **The 60 s requirement and 6-block cap are not enforced on the default path.** On Sonnet 5.5 the worker strips `maxItems`/`maxLength` from the schema (`worker ~163-171`), so the cap is prompt-only (PLN-03). `generation_metrics` is write-only; nothing asserts the 60 s target (PLN-01).

Next tier: guest-guide waitlist hotels cannot be approved from the admin (GG-11); pending hotels still reach the public zone guide (GG-11); Google OAuth and account deletion are not built (Q4); "+400 itinerarios" is hardcoded (`HeroForm.tsx:818`, Q9).

## 3. Inventory

### Routes and locale handling
- `i18n.ts`: locales `es` (default), `en`; `pathnames` map localized segments (e.g. `/planner` = `/es/planificador`, `/en/planner`). `middleware.ts`: next-intl, `localePrefix: 'always'`.
- Bypass next-intl (no locale prefix): `/guia/*`, `/demo/*`, `/g/*`, `/admin/*`, `/dev/*`, `/checklist-viajar-con-bebe`, `/puente-noviembre` (the last two ES-only).
- 301s: guide alias slugs; legacy ES paths (`/guias`, `/hoteles`, `/trip-generator`, `/nosotros`, `/contacto`, `/para-hoteles`, `/mis-viajes`, `/iniciar-sesion`, `/crear-cuenta`). `noindex, follow` on filtered Experiencias/Hoteles.
- `app/[locale]/`: home, about, account, contact, examples, experiences, for-hotels, destinations (+`[slug]`), guides (+`[slug]`), hotels (+`[slug]`), login, my-trips, planner, pricing, privacy, signup, smart-finds (+`[slug]`, `familias`), terms, trips/`[trip_id]`, trips/share/`[shareId]`, worldcup (+`[slug]`).
- Outside locale: `app/admin/hoteles` (+`[id]`), `app/guia/[partner]`, `app/guia/cdmx/[zone]`, `app/guia/demo` (+`tarjeta`), `app/demo/[prospect]`, `app/g/[code]/route.ts` (+`tarjeta`), `app/dev/design`, the two lead-magnet pages, `robots.ts`, `sitemap.ts`.
- API routes: `admin/hotels/[id]/action`, `admin/hotels/export`, `checkout`, `checkout/fulfill`, `consent`, `contact`, `generate-trip`, `hotels/event`, `hotels/signup`, `lead-magnet`, `me/plan`, `stripe-webhook`, `subscribe`, `test-supabase`, `trips`, `trips/[trip_id]` (+`booking-confirm`, `claim`, `companion`, `share`), `trips/jobs` (+`[id]`, `reconcile`), `trips/share/[shareId]`.
- `vercel.json` is `{}`: no Vercel crons.

### Edge functions
- `supabase/functions/generate-trip` (index, logic, prompt, wc-2026-calendar): sync generation and chunk prompts; writes `generation_chunks` and `generation_metrics`.
- `supabase/functions/generate-trip-worker`: re-entrant async worker keyed by `job_id`; Haiku skeleton, concurrent day-writers, repair loop, credit charge on success.
- Deno env names: `ANTHROPIC_API_KEY`, `GENERATE_TRIP_MODEL`, `GENERATE_TRIP_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`; also `SKELETON_MODEL`, `GENERATE_TRIP_DAY_MODEL`.

### Tables (migrations vs code)
- Baseline creates: `click_events`, `consent_log`, `generation_chunks`, `generation_jobs`, `kit_products`, `kits`, `kpi_monthly`, `kpi_weekly`, `plans`, `products`, `profiles`, `sf_*` (kits, kit_sections, kit_subsections, kit_section_products, products), `trips`, `user_entitlements`.
- Later migrations: `generation_metrics`, `lead_magnet_attempts`, `guide_visits`, `demo_visits`, `hotel_partners`, `hotel_guide_events`, and on `feat/paid-hotel-demo` `hotel_clients`, `hotel_reports` (three files dated 20261125, header "NOT applied yet"). On `feat/hotel-place-clicks` there is a file dated 20261126 (`hotel_events_place_source`). Both are future-dated relative to today; see Q11.
- RLS: every created table has `ENABLE ROW LEVEL SECURITY`; no table disables it. Tables with RLS and no policy (service-role only): hotel tables, `lead_magnet_attempts`, `hotel_clients`, `hotel_reports`.
- Code-referenced with no migration: `contact_messages` (`app/api/contact/route.ts:58`). `.rpc()` is never used. `trip_feedback` is in neither code nor migrations.

### GA4 and analytics events (name, call site)
- `planner_started` `HeroForm.tsx:156`; `search`/`generate_lead` `HeroForm.tsx:343-344`; `itinerary_generated` `TripResult.tsx:1806`; `trip_saved` `:1839,1894,2674`; `trip_shared` `TripShareModal.tsx:138`; `trip_reopened` `:1476`; `regenerate_requested` `:2389,2837`; `itinerary_edited` `:2794,3266,3291`; `error_occurred` `:1951,2630,3063`; `purchase` client `:1528`, server `stripe-webhook/route.ts:159`.
- `affiliate_clicked` `TripResult.tsx:5374`, `MobileTripClient.tsx:798`, `smart-finds/HeroCard.tsx:115`, `ProductCard.tsx:97`; `planner_hotel_clicked` `PlannerHotelsSection.tsx:398`; `hotel_booking_confirmed` `MobileTripClient.tsx:749`, `PlannerHotelsSection.tsx:575`.
- `partner_link_click` via `trackOutboundLink` (`lib/analytics/ga.ts:120`): `/guia` (`GuiaClient.tsx:202,244,302,345,734`, `PracticalSection.tsx:166`), `lib/catalog-analytics.ts:59`, `lib/experiences/analytics.ts:54`.
- Catalog: `plan_add`/`plan_remove`/`plan_handoff`/`planner_cta_click`/`hotel_filter` (`lib/catalog-analytics.ts`), `experience_list_view`/`experience_filter`/`experience_guide_click` (`lib/experiences/analytics.ts`), `partner_visit` (`lib/analytics/partner-attribution.ts:168`).
- Guest guide: `host_guide_*` events renamed by edition prefix at `GuiaClient.tsx:419-424` (`hotel_guide_*`, `paid_guide_*`, `demo_guide_*`).
- Leads: `waitlist_signup` `NewsletterPopup.tsx:133`, `NewsletterPdfPrompt.tsx:92`; `form_start`/`generate_lead`/`lead_magnet_download` `LeadMagnetForm.tsx`; `sign_up` `SignupForm.tsx:47`; `login` `AuthEventsBridge.tsx:144`.
- Defined, no call site found: `begin_checkout`, `contact`, `hotel_affiliate_click`, `outbound_partner_click`, `guide_download`, `planner_fallback_used`, `planner_hotel_rendered`.
- DB-side: `POST /api/hotels/event` writes `hotel_guide_events` (`section_open`, `outbound_click`).

### Affiliate link builders
- `lib/affiliate/build.ts:53` `buildAffiliateLink` (Stay22 Allez, `aid=lagomplan`; providers booking, hotelscom, getyourguide, expedia in `providers.ts:27`). Callers: `lib/booking.ts:81,88,105,112`, `PlannerHotelsSection.tsx:370`, `components/guides/HotelsSection.tsx:32`, `MobileTripClient.tsx:1544`.
- `lib/affiliate/index.ts:45` `withRef` (`ref=lagomplan`). `lib/affiliate/gyg.ts:71` `buildGygBookingUrl` (`partner_id=X71QPE5`, `cmp`). `lib/guia/links.ts:27` `withPilotUtm` (UTM only; Airalo deliberately excluded). `Stay22Loader`/`Stay22Guard` mounted at `app/[locale]/layout.tsx:39-40`.
- Hardcoded: Airalo short link (`content/guia/cities/cdmx.ts:218,421`), Amazon `amzn.to` (`lib/smart-finds/products.ts:52,64`), Viator `pid=P00165894` (`GuidePageClient.tsx:111`), many direct Booking/Hotels.com URLs in guide data.

### Tests and CI
- Jest (`__tests__/**/*.jest.test.*`): hotel guide, hotel alias, hotel signup form, guia frozen/unchanged snapshots, guia demo paid, guide GYG/affiliate fallback, stay22 click, trip guard, seasonal edition, agenda, design components, login reason copy.
- tsx scripts (`tests/*.test.ts`, run by CI loop): affiliate, booking, catalog analytics, classify-block, design tokens/migration/fonts, experiences (4), generate-trip logic (2), guia (3), guide (5), gyg, hotels, intelligence-render, itinerary-edit, lead-magnet-form, mobile-view, newsletter, partner-attribution, plan, progress, readiness (2), ref-source, saved-plan-flag, seo-slugs-sitemap, trip-data-parity, demo pipeline (5). Standalone: `tests/page-data-leak.mjs`, `tests/seo-validate.mjs` (not in CI).
- Playwright: `e2e/` (smoke, design-system, design-migration, guia-parity, `mobile-view/*`; the planner flow specs are `test.fixme` per the planner agent).
- Workflows: `ci.yml` (PR/push to main: tsc, tsx tests, jest, build, placeholder-inlining guard; no lint step), `e2e.yml` (PR/push to main, desktop-chrome only), `deploy-supabase-functions.yml` (push to main), `reconcile-stuck-jobs.yml` (cron every 5 min against production).

### Env variable names
- Server-only: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_TRIP_1`, `STRIPE_PRICE_TRIP_5`, `STRIPE_PRICE_TRIP_10`, `STRIPE_PRICE_EXPLORER`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` (edge only), `GENERATE_TRIP_SECRET`, `RESEND_API_KEY`, `MAILCHIMP_*`, `GA_API_SECRET`, `CONSENT_IP_SALT`, `CRON_SECRET`, `HOTEL_SIGNUP_NOTIFY_TO`, `HOTEL_RATELIMIT_SALT`, `ADMIN_EMAILS`.
- `NEXT_PUBLIC_*`: `SITE_URL`, `SAMPLE_TRIP_ID`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GOOGLE_MAPS_API_KEY` (browser key; needs referrer restriction in Google Cloud, not checkable here), `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `FEATURE_SAVED_PLAN`. None is a server secret.

## 4. Rule-by-rule verdicts

Columns: ID | verdict | evidence | rule as actually implemented.

### Planner
| ID | Verdict | Evidence | As implemented |
|---|---|---|---|
| PLN-01 | PARTIAL | worker `SC_JOB_DEADLINE_MS=60_000`, `SC_CONCURRENCY=8`, `SC_MAX_RETRIES=2` (~266-342) | Whole job has a 60 s deadline incl. skeleton and retries; fails cleanly on overrun. Measured values only in code comments (22 s Sonnet 5.5, 37 s Sonnet 4.6). `generation_metrics` has no reader. Anonymous sync route has no latency target. |
| PLN-02 | PASS | worker `:1789-1791` | `getTripSegments` decides: 2+ segments run `runSequentialMultiCity`; single-city runs the concurrent pipeline. |
| PLN-03 | PARTIAL | `prompt.ts:187` (`maxItems:6`), `:1035`; worker `toStrictSchema` ~163-171 | Cap in prompt and schema; on the default Sonnet 5.5 path the schema keyword is stripped, so prompt-only. No truncation anywhere. Retry text at `prompt.ts:852` says "4-7 blocks". |
| PLN-04 | PASS | worker `:1903-1912`, `:575-595` | Hard fail (`status:'failed'`) when nights>0 and accommodations empty; payload sets `nights = totalDays-1`. Non-worker paths retry once then insert a fallback stub (`lib/planner/fallback-accommodations.ts`). No direct test of the gate or the override. |
| PLN-05 | PARTIAL | worker `findDuplicateVenueOccurrences` ~1001, repair loop `:1928-1962` | Venue repeats: detected and repaired up to 3 passes, then job fails (hotel/transfer exempt). Day-opening variety is prompt-only (`prompt.ts:733-736`). |
| PLN-06 | PASS | worker `:1225-1239`; `TripResult.tsx:920-940` | Regex `/\b\d+\s+d[ií]as?\b/i` (ES) / `/\b\d+\s+days?\b/i` (EN), first match replaced; no match returns title unchanged. Untested. |
| PLN-07 | FAIL | `TripResult.tsx:3896,4388,936-937,743-758,799-801,3248`; `PlannerHotelsSection.tsx` ~430-450; `lib/planner/checks.ts` | Many fallbacks: "Tu destino", default title/subtitle, invented packing list and budget, "Ítem", "Otros", "Tarea N", fallback hotel stub. Only `lib/intelligence.ts` returns null on thin data. |
| PLN-08 | NOT BUILT | no Places call or `place_id` in app, lib or supabase | Nothing verifies venues. |
| PLN-09 | PARTIAL | `lib/intelligence.ts` ~551-640 | Display score and flags (activity count, walking minutes from a static coordinate table, transit segments). Not a gate. Meal, time-order and opening-hours checks not built. |
| PLN-10 | PARTIAL | `prompt.ts:117-131`; `PlannerHotelsSection.tsx` ~444-497 | `rationale` exists only for accommodations (AI-written). Itinerary blocks have no reason field. |
| PLN-11 | PARTIAL | `HeroForm.tsx:65,361,385-402,414,566,714`; `:829` | Inline `role="alert"` errors, `noValidate`. Submit is `disabled={generating}`. Silent return when `exceedsMax`. |
| PLN-12 | PARTIAL | `TripResult.tsx:1076-1078,2254-2262`; `jobs/route.ts` | Loading and error states exist. No resume from client: `jobId` not in URL or storage. Server dedupe window 15 min is the only resume-like path. `HARD_TIMEOUT_MS=900_000` but copy says "4 minutes". |
| PLN-13 | PASS | `HeroForm.tsx:143,239-243,309`; `TripResult.tsx:1201,1699`; `prompt.ts:994,1046` | Currency carries to prompt and stored trip. Gap: `inputsFingerprint` in `jobs/route.ts` omits `currency`, so a currency-only change can dedupe to the old job. |
| PLN-14 | FAIL | `PlanTray.tsx:7-9`, `GuideActions.tsx:31` | Guides hand over `destination` only; item names are never sent. |
| PLN-15 | PARTIAL | `TripResult.tsx:2781,3299,2365,2817` | Add, edit, delete, add day, regenerate, versions exist. No reorder, no Kanban. |

### Payments
| ID | Verdict | Evidence | As implemented |
|---|---|---|---|
| PAY-01 | PARTIAL | `lib/plan/limits.ts:13,21`; `app/api/generate-trip/route.ts`; `messages/en.json:311-313` | Anonymous: 1 trip (`ANON_TRIP_LIMIT=1`). Account: 3 lifetime free (`FREE_TRIPS_LIMIT=3`); anonymous trip does not count, so total 4 (copy implies 3). Gate triggers: anon count >=1; trip >5 days or multi-city (`ASYNC_THRESHOLD=5`, client-side, `TripResult.tsx:1734`); save and share need auth (401). Rule is >5 days, not >7. |
| PAY-02 | PARTIAL | `app/api/generate-trip/route.ts` cookie `anon_gen_count`; `lib/entitlements.ts` `checkGenerationAllowed` | Server-side, cookie only (httpOnly, 30 days, set after success). No IP or fingerprint. Cleared by clearing cookies or incognito. Account check reads `user_entitlements` (402 `no_credits`, 503 on infra error). |
| PAY-03 | PASS | `app/api/checkout/route.ts` (~59) | Four plans map to env names `STRIPE_PRICE_TRIP_1/5/10`, `STRIPE_PRICE_EXPLORER`; packs `mode=payment`, Explorer `mode=subscription`; cards only; auth required. Currency comes from the Stripe Price (code never sets it); whether prices match 39/149/249/199 MXN is unverifiable from code. |
| PAY-04 | PARTIAL | `stripe-webhook/route.ts`; `checkout/fulfill/route.ts` | `constructEvent` on raw body (400 on bad signature). Idempotency is a last-session compare only; read-then-write; webhook/fulfill race; upsert errors still return 200. |
| PAY-05 | PARTIAL | `lib/entitlements.ts` `consumeOneTrip`; worker `:1318` | Credits are an integer with no expiry; one decrement per new trip. Defects: Explorer purchase zeroes credits; cancel leaves 0; packs share tier `per_trip`; sync decrement not atomic. `current_period_end` never written. |
| PAY-06 | PARTIAL | worker `:2035`; migration `20260928020000_generation_jobs_credit_charged_at.sql` | Async: charged only after the trip row is inserted, with an atomic claim. Sync: charged after validation. Residual: charge errors are swallowed after the claim (free trip); claim and decrement are not one transaction. A stale comment in `generate-trip/route.ts` says the credit is already consumed. |
| PAY-07 | PARTIAL | `stripe-webhook/route.ts` | Only `customer.subscription.deleted` handled (sets `free`). No `payment_failed`/`updated`/`past_due`. No billing portal or cancel UI despite FAQ. |
| PAY-08 | PARTIAL | `messages/*.json:311`; `TripResult.tsx:1128` | 7-day claim not enforced anywhere; anonymous results are never stored server-side; saved trips have no TTL. "PDF" is `window.print()`, not gated by tier, though Explorer copy lists it as a perk (`messages/en.json:123,131`). Purge by pg_cron cannot be ruled out (not in migrations). |
| PAY-09 | FAIL | see finding 7 | Disclosure is per-page strings, not a component; missing on guides, World Cup, planner hotels, mobile view, `/guia/*`. |
| PAY-10 | PARTIAL | `lib/affiliate/build.ts:63`, `gyg.ts`, `index.ts:48`; `GuidePageClient.tsx:110,397`; `GuideHotelsTeaser.tsx:24,30` | IDs added by Stay22 (`aid`), GYG (`X71QPE5`), Amazon shortlinks, Viator pid. No ID: direct Booking/Hotels.com links, Insiders `wa.me`, Airalo short link, Smart Finds Airalo `#`; GetYourGuide inside Stay22 carries only the Stay22 `aid`. New-tab: `_blank` + `noopener` in planner, Stay22Guard and checked anchors; World Cup hrefs not fully checked. |

### Content
| ID | Verdict | Evidence | As implemented |
|---|---|---|---|
| CNT-01 | PASS | `guides/[slug]/page.tsx:46-77`; `middleware.ts:84-97` | 46 registry keys, 92 key/locale pairs resolve; canonical + es/en/x-default; aliases 301. Routes outside the locale tree listed in section 3. |
| CNT-02 | FAIL | `tulum/es.ts:144,154`; `los-cabos/es.ts:104,114,124`; `worldcup/data/cdmx.ts:72`, `guadalajara.ts:79` | Confirmed identical URLs: Dune/Astral (Tulum), Tierra Viva/El MaPi (Cusco), Wyndham/Capitan Suizo (Guanacaste), Casa Palopo/Meson Panza Verde (Guatemala). Hacienda Encantada (Los Cabos) and Centro Oaxaca share a Stay22 ID but differ in query string. New: St. Regis CDMX and Hotel Demetria Guadalajara share a URL; Post Oak Houston appears as two cards. Four hotels (Ruanda x3, Kioto) use a generic booking search page. Los Cabos: all 3 hotels carry a Dolores Hidalgo, Guanajuato address. No validation exists. |
| CNT-03 | PARTIAL | `lib/hotels-catalog.ts:127`; `merida/es.ts:157` | No rule ties tier to copy. Spec correction: Casa Blanca 7 and Hacienda de Cortes are `$$` ("Intermedio"), not `$`. True `$` items with luxury copy: Las Brisas (Merida), Hilton DoubleTree Centro Historico ("premium"); `$$` with luxury copy also includes Dune, Habitas Tulum, Cityhub Copenhagen. |
| CNT-04 | PASS | `HotelsClient.tsx:168-170`; `ExperiencesHub.tsx:197-199` | ICU plural over `visible.length`. Hardcoded "16 guias" exists on World Cup pages. No render test. |
| CNT-05 | PASS | `HotelsClient.tsx:214-224`; `ExperiencesHub.tsx:238-247` | Titled empty state with clear-filters button. Smart Finds `FilterableKits.tsx:93-99` shows text only, no clear button. |
| CNT-06 | PASS | `lib/experiences/index.ts:70`; `ExperiencesSection.tsx:46` | 88 ES and 88 EN cards: 0 missing, 0 duplicate anchors. Hotel "Ver guia" links go to the guide page with no anchor. |
| CNT-07 | FAIL | `CatalogCard.tsx:47`; `FilterableKits.tsx:55-70` | Hoteles and Experiencias share `components/catalog/*`; Smart Finds shares none and `/smart-finds` index is a stub. Pills (`rounded-full`), 20/24 px legacy radii, hardcoded `#2D6B5A`; Smart Finds uses inline styles, 14 px radius and Fraunces. Home token is 8 px buttons. |
| CNT-08 | FAIL | `components/catalog/FilterPanel.tsx:2-4`; `components/design/FilterPanel.tsx:154-168` | "Filtros (n)" bottom sheet exists only in the design FilterPanel used by `/guias`. Hoteles/Experiencias still use chip strips. |
| CNT-09 | FAIL | `messages/*.json:212,236`; `worldcup/page.tsx:13,16-17`; `WorldcupClient.tsx:225,354,377,430`; `HeroForm.tsx:823` | Many strings present the tournament as upcoming (popup eyebrow, sidebar, metadata, future-tense copy, city data closing text, `lib/smart-finds/products.ts:681-684`). Nav link already hidden (`Nav.tsx:137`); sitemap still lists the pages (`sitemap.ts:135-137`). |
| CNT-10 | FAIL | `messages/*.json:4,19,150`; `page.tsx:135-136`; `planner/page.tsx:26`; `TripGeneratorClient.tsx:71`; `TripResult.tsx:3619`; `worldcup/ui-strings.ts:66` | "Planificador de viajes con IA" / "AI travel planner" in titles and CTAs. No "planeador". Route slug `/es/planificador` also hardcoded in several files. |

### Guest guides
| ID | Verdict | Evidence | As implemented |
|---|---|---|---|
| GG-01 | PASS | `content/guia/faq/resolve.ts:51-56` | Partner > Zone > base per item per language, for the FAQ module only. Arrival cards and `yourHouse` use omit/override, not the 3-tier resolver. No resolver unit test. |
| GG-02 | PASS | `faq/resolve.ts:44-46,59,63` | Missing item renders no row; empty group dropped. |
| GG-03 | PARTIAL | comments in `zones/roma.ts:88`, `polanco.ts:108`, `cities/cdmx.ts:203,220,225`; flags ignored per `content/guia/types.ts:55` | No CONFIRM/TODO text in resolved strings (scanned). But `hold:'confirm'` flags are ignored by renderers, so unverified content is live (`zones/roma.ts:95`, `polanco.ts:92`, `cities/cdmx.ts:214,222,417,425`). Demo pages (`/demo/*`) render "[bracket]" placeholders and "Por confirmar" pills. |
| GG-04 | PASS | `content/guia/hotel/resolve.ts:33-41,200-222`; `GuiaClient.tsx:581,607,1312` | All listed items hidden or blanked; name becomes "Lagomplan"/"tu hotel". Applied at render, so the data is still in the client bundle. Tested. |
| GG-05 | PASS | `hotel/zones.ts:38-48`; `GuiaClient.tsx:405,581,860` | Hotel zone first and open; count derived from enabled tabs. Tested. |
| GG-06 | PASS | `GuiaClient.tsx:1092-1116` | One band visible at a time (both in DOM, hidden one `inert`). Only Condesa has a short plan (`time.ts:27`); Roma Norte and Polanco have no choice. |
| GG-07 | PARTIAL | `hotel/mood-picks.ts`; `hotel/resolve.ts:121-137` | No repeats within the six mood panels; every pick has an address. Same places recur in zone tabs, the 48-hour itinerary and weekly rows (e.g. Proyecto Rufina, Licoreria Limantour, Maximo, Rosetta). Rule enforced only within moods. |
| GG-08 | PARTIAL | `app/g/[code]/route.ts:20-48`; `lib/hotels/aliases.ts:7-9`; `app/robots.ts:35` | Code and alias run the same handler (307 to `/guia/cdmx/{zone}?h=`). Aliases are one hand-edited TS object (one entry). Redirect responses carry no `X-Robots-Tag`; only `robots.txt Disallow: /g/`. Targets are noindex. |
| GG-09 | PARTIAL | `GuiaClient.tsx:416-418,735,843`; `lib/analytics/ga.ts:120-133` | Same `trackOutboundLink`, same keys. Hotel code travels in `partner_slug` (from `?h=`, falls back to `zone_<zone>`); no separate hotel identifier param. Untested. |
| GG-10 | PASS | `HotelSignupForm.tsx:105-112,167,222`; `lib/hotels/signup-form.ts:63-92` | Required marked, per-field messages, focus on first error, nothing sent on invalid. Tested. |
| GG-11 | PARTIAL | `hotels/signup/route.ts:46`; `app/g/[code]/route.ts:35`; `admin/hotels/[id]/action/route.ts:31-34,67` | Signup inserts `pending` (or `waitlist` with zone NULL). Only `approved` gets tracked redirect, events and email. Gaps: `/guia/cdmx/{zone}` is public so a pending hotel's link still lands on the guide; waitlist hotels cannot be approved (no zone action in admin UI). |
| GG-12 | PARTIAL | `content/guia/partners/demo.ts:1-8`; `livin_*` partner files; `app/guia/demo/page.tsx` | One `GuiaClient`, one city layer, one FAQ schema. Copied per partner: `demo` partner is a clone of `livin_condesa`; `chefsAtHome` text duplicated in three Livin partners, `massages` in two. `app/guia/demo/page.tsx` (Casa Lagom paid demo) shadows the registered `demo` partner at `/guia/demo`. |

### Concierge
| ID | Verdict | Evidence | As implemented |
|---|---|---|---|
| CON-01 to CON-07 | NOT BUILT | no route, table, prompt or function | Only a marketing "concierge block" in `ExperiencesHub.tsx:277-288` linking to `/planner?destination=` and a `source:'concierge'` analytics label in `lib/catalog-analytics.ts:31`. |

### Platform
| ID | Verdict | Evidence | As implemented |
|---|---|---|---|
| PLT-01 | PARTIAL | `Nav.tsx:93-109`; `middleware.ts:36-62` | Switcher swaps the prefix and keeps the query, relying on next-intl to localise the slug; the alternate-URL input exists only for guides. Seven route groups sit outside the locale tree; the two lead magnets are ES-only with no switcher. Whether `/en/planificador` redirects correctly: CANNOT TELL FROM CODE. |
| PLT-02 | PASS | `lib/supabase/env.ts`, `lib/supabase/server.ts` | Service role used only server-side; no client file imports a server module; no secret-named `NEXT_PUBLIC_*`. No `import 'server-only'` guard and no leak test. |
| PLT-03 | FAIL | `lib/lead-magnet/rate-limit.ts`; `lib/hotels/ratelimit.ts` | Limits only on lead-magnet (5/IP/10 min, 3/email/24 h, DB-backed, fails open) and hotel signup/event (in-memory, per-instance, 90 per 60 s). None on generation, jobs, checkout, contact, subscribe. Spec's 5 per hour is not implemented. |
| PLT-04 | FAIL | `prompt.ts:599,822,834,945`; `generate-trip/route.ts` | No sanitisation; no length limits server-side; free text interpolated into prompts. Forced tool schema constrains output shape only. |
| PLT-05 | PARTIAL | baseline; `20260804000000_fix_trips_public_read_policy.sql` | `trips_select_own` restricts to owner, plus `authenticated_read_shared_trips` lets any signed-in user read shared trips. Baseline grants give `anon`/`authenticated` ALL on tables, so safety rests entirely on RLS. `contact_messages` RLS unknown. Prod check: `select tablename, rowsecurity from pg_tables where schemaname='public'` and `select * from pg_policies where tablename='trips'`. |
| PLT-06 | FAIL | `generate-trip/index.ts:382-388`; `TripResult.tsx:1783-1785` | No billing/quota branch; upstream body surfaced to users; failures only in `generation_metrics`; no alerting. The 5-minute reconcile workflow does not check Anthropic credit. |
| PLT-07 | PARTIAL | `lib/analytics/events.ts:266`; `TripResult.tsx:1806`; `NewsletterPopup.tsx:133` | `planner_started` exists (param `source` never passed). `plan_generated` = `itinerary_generated` (no `trip_id`; async-path firing unconfirmed). `email_signup` = `waitlist_signup` (two call sites only). Affiliate clicks fire on planner, mobile, Smart Finds; guide-page Stay22/GYG links carry no click event. |

### Intelligence
| ID | Verdict | Evidence | As implemented |
|---|---|---|---|
| INT-01 | FAIL | `prompt.ts` ~1018; worker skeleton ~905 | Venue names come from the model; Haiku skeleton invents one restaurant, breakfast and site per day. No curated or Places data in the prompt. |
| INT-02 | FAIL | no guide import in `supabase/functions` | Existing guide for the destination does not affect generation. |
| INT-03 | NOT BUILT | `lib/data/guides/types.ts`, `lib/hotels/types.ts` | No stored reason on curated items; only AI `rationale` on accommodations. |
| INT-04 | PARTIAL | `HeroForm.tsx:313`; `TripResult.tsx:1699` | Reach the prompt: destination, origin, dates, nights, travelers and headcount, pace (as `travel_style`), budget + currency, interests (incl. free-text extra), segments, locale. Collected but unused by generation: `walkingTolerance` (used only for energy warnings in `lib/intelligence.ts`). |
| INT-05 | NOT BUILT | none | Nearest signals: duplicate-venue repair warnings and the budget-currency flag. |
| INT-06 | NOT BUILT | none | No accept/swap/remove storage; `trips.travelers` enum is the only traveler-type data. |
| INT-07 | NOT BUILT | none | No Destination Index table or loader. Guide types carry `verifiedAt`/`verifiedNote` (`lib/data/guides/types.ts:246,288`) but nothing reads them. |

## 5. Answers to Q1 to Q11

**Q1. Result page features**
| Feature | Verdict | Rule |
|---|---|---|
| Share URL | EXISTS | Share button opens `TripShareModal`; requires a saved trip and login (`/api/trips/[trip_id]/share` returns 401 otherwise); public page `trips/share/[shareId]`. Link expiry not implemented. |
| Save to account | EXISTS | Autosave when signed in; anonymous users get a save modal and are sent to login (`pendingSave` in `sessionStorage`). |
| PDF download | EXISTS, print-based | `window.print()` via `?print=1` (`TripResult.tsx:1128`); not tier-gated; no server PDF. |
| WhatsApp export | NOT BUILT | WhatsApp appears only in guest-guide code. |
| Regenerate | EXISTS | Confirm modal if edited; free for an owned trip, but blocked by the paywall when `trips_remaining<=0` and not subscribed (`replaceTrip`, `TripResult.tsx:2817-2826`). |
| trip_feedback survey | NOT BUILT | No `trip_feedback` in code or migrations. |
| Readiness checklist | EXISTS | `components/planner/TripReadinessBar.tsx`, `lib/planner/readiness.ts`; tested. |
| Per-trip OG tags | NOT BUILT | `trips/[trip_id]/page.tsx:66-77` returns title and `NO_INDEX` only; share page `:30` only robots. |
| Hotel links in itinerary | EXISTS | Hand-authored options first, else Stay22 via `getBookingOptions`; AI-supplied URLs ignored. |
| Post-generation email capture | NOT BUILT | Newsletter block only on the pre-generation landing (`TripGeneratorClient.tsx:97`). |

**Q2.** Yes, only client-side and fragile: the cached anonymous trip is saved after login in the same tab; lost across tabs, devices or email-confirmation links. `claim` route exists, unused. New account still gets 3 free credits.
**Q3.** Regenerating an owned trip does not consume a credit or the free tier (`isRegenerationOfOwnTrip` in `jobs/route.ts` and `generate-trip/route.ts`; worker `consumeOneTripIfApplicable` ~2018-2025). It still inserts a new `trips` row and the client replaces the old one.
**Q4.** Neither Google OAuth nor account deletion is built (no `signInWithOAuth`, no callback route, no delete UI or `deleteUser`). `privacy/page.tsx:236` promises deletion within 30 days, a manual process.
**Q5.** One admin screen, hotels only: `/admin/hoteles` and `/admin/hoteles/[id]` (access via `ADMIN_EMAILS`). Filters, totals, CSV export; approve (needs zone, sends email), reject, pause, resend email, notes, scan charts. Cannot create or edit hotels, set a zone on a waitlist hotel, or touch guide content.
**Q6.** Free hotel guide in Condesa, Roma Norte or Polanco: a data row in `hotel_partners` plus approval, no deploy (optional readable alias is a one-line code change in `lib/hotels/aliases.ts`). Other zones: waitlist, then code for a new zone. Partner guide `/guia/<slug>`: code change plus deploy (`content/guia/partners/<slug>.ts` and `PARTNERS` registry). Sales demo: a config file `content/demos/<slug>/demo.json`. Paid client: code (`content/guia/paid/<client>.ts`); no live paid route exists.
**Q7.** Yes: `TripSegment` in `lib/planner/segments.ts` (destination, dates, nights); stored in `trip_data.segments[]`. The user allocates nights per segment via the form dates; the model does not. `MC_SEGMENT_DAYS=5` sub-chunks long segments.
**Q8.** Skeleton: `SKELETON_MODEL` default `claude-haiku-4-5-20251001`, no thinking or effort. Day-writer and front-matter (single-city): `GENERATE_TRIP_DAY_MODEL` default `claude-sonnet-5-5`, `thinking: { type: 'between_tools' }` and `effort: 'low'` unless a `test_effort` request field overrides it (both `test_*` fields are temporary hooks). Fallback: one retry on `claude-sonnet-4-6` with no effort. Multi-city, sync route and duplicate-block repair: `GENERATE_TRIP_MODEL` default `claude-sonnet-4-6`, forced tool choice, no effort.
**Q9.** Hardcoded: `components/forms/HeroForm.tsx:818` and `app/[locale]/page.tsx:352-353`. True count would be `select count(*) from trips` (plus completed `generation_jobs`).
**Q10.** NOT BUILT. No "vigia" anywhere. Only scheduled workflow is the 5-minute reconcile call. `docs/SMOKE_TESTS.md` is a manual checklist; `e2e/smoke.spec.ts` checks that `/es` and `/en` render and is not scheduled against production.
**Q11.** Code table with no migration: `contact_messages`. `trip_feedback` is in neither. Migrations with no `.from()` in app code: `hotel_clients`, `hotel_reports`, `click_events`, `kpi_monthly`, `kpi_weekly`, `plans`, `profiles`, `products`, `kits`, `kit_products` (and `generation_metrics`, `guide_visits`, `demo_visits`, written by edge functions or helpers). Future-dated migrations: three files dated 20261125 (`hotel_clients`, `hotel_partners_client_id`, `hotel_reports`; `hotel_clients` header says "NOT applied yet") on `feat/paid-hotel-demo`, and `20261126000000_hotel_events_place_source.sql` on `feat/hotel-place-clicks`. Both sort after any migration created before then, so `supabase db push` may need `--include-all`. Columns of `trips` used in code were not diffed against migrations.

## 6. Rules with no covering test

- **Planner:** PLN-01 to PLN-15 effectively untested (PLN-13 only via `buildInput` helpers; PLN-15 only the mobile edit sanitizer). Missing: worker timing, retries, fallback; CRITICA accommodations gate; duplicate repair; `patchTitleDayCount` (both copies); 6-block cap; `validateAccommodations`; HeroForm validation and disabled submit; jobs route (auth, dedupe, regeneration no-charge); sync route; `normalizeTripData` fallbacks. Planner e2e specs are `test.fixme`.
- **Payments:** PAY-02 to PAY-09 (PAY-01 only the large-trip guard; PAY-10 covers builders, not no-ID link types or `target`).
- **Content:** CNT-02, 03, 04 and 05 (data-level only), 06, 07, 08, 09, 10.
- **Guest guides:** GG-01, 02 (no resolver test), 03 (no rendered-output scan), 08 (no robots assertions), 09, 11 (no pending/rejected/paused test), 12 (structure parity only); GG-06 partial.
- **Platform:** PLT-02 (no leak test), 03, 04, 06; PLT-01, 05, 07 only partial.
- **Intelligence and Concierge:** all INT and CON rules.
- **Environment gaps:** no staging environment; `ci.yml` has no lint step; Jest only matches `__tests__/**/*.jest.test.*` while `tests/*.ts` run through a tsx loop in CI; `tests/page-data-leak.mjs` and `tests/seo-validate.mjs` are not in CI.

Covered by tests: CNT-01, GG-04, GG-05, GG-10, most of GG-07 (moods only).

## 7. Spec corrections suggested by this audit

- Gate is 1 anonymous + 3 account trips (4 total) and >5 days, not >7; free-tier copy and code disagree three ways, not two.
- `$` luxury examples: Casa Blanca 7 and Hacienda de Cortes are `$$` in data.
- Hacienda Encantada / Centro Oaxaca share a Stay22 ID, not a full URL.
- `plan_generated` and `email_signup` are named `itinerary_generated` and `waitlist_signup` in code.
- `trip_feedback` does not exist in code or migrations (spec says "built per plan").
- Stray files to check are ignored: `.TripResult.tsx.swp` variants and `MyTripsClient.tsx.bak` in the planner folder; `tailwind.config.ts.bak`, `tmp-timing-experiment.mjs`, `test.txt` at repo root.
