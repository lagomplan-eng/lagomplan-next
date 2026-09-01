# Mexico City Pilot — Event Taxonomy

Authoritative mapping between the B2B2C pilot's KPI vocabulary and the
actual GA4 event names fired by the app. **No existing event was renamed
or duplicated** — this doc exists so Looker Studio config, and anyone
reading the pilot brief, can translate between the two vocabularies
without guessing.

Reusable across future partners/pilots — nothing here is Mexico-City-
specific except the example values.

## Attribution parameters (present on every funnel event below, when known)

| Param | Source | Example |
|---|---|---|
| `partner_id` | `utm_source` (only when `utm_medium=partner`) | `livin_roma` |
| `pilot_id` | `utm_campaign` | `mxcity_pilot` |
| `distribution_channel` | `utm_content` | `guest_guide`, `prearrival`, `qr_code`, `whatsapp`, `booking_confirmation` |

Captured client-side by `lib/analytics/partner-attribution.ts`, persisted
in `localStorage` (no TTL, first-party, non-PII), and merged automatically
into the events below by `lib/analytics/events.ts` — no call site had to
change.

**Reporting source of truth: EVENT-scoped GA4 custom dimensions on these
event parameters — not user properties.** The app also sets
`partner_id`/`pilot_id`/`distribution_channel` as GA4 user_properties via
`components/analytics/PartnerAttributionCapture.tsx` (mounted on both
`app/[locale]/layout.tsx` and `app/guia/layout.tsx`), but user properties
are sticky — once set, they persist into that browser's later, unrelated
organic sessions with no expiry. **Do not register user-scoped custom
dimensions for these fields, and do not use the user_properties as a
funnel-reporting source** — only the event-scoped dimensions, sourced
from the actual parameter value at each event's fire time, are accurate
for pilot funnel measurement. See `mxcity-pilot-dashboard.md` §3 and §11.

These params are absent (not sent as empty strings) when no partner touch
is stored — i.e. for normal organic/B2C traffic. That's the mechanism
that keeps B2C traffic from being misclassified as partner traffic.

## Event taxonomy

| Pilot concept (brief vocabulary) | Actual GA4 event name | Fires at | Attribution params? | Notes |
|---|---|---|---|---|
| **Partner distribution / acquisition ("Partner Visits")** | **`partner_visit`** | `lib/analytics/partner-attribution.ts`, `capturePartnerTouch()` — fires exactly once per genuinely NEW partner touch (fresh `utm_medium=partner`+`utm_source` whose resulting `partner_id`/`pilot_id`/`distribution_channel` differ from whatever's already stored) | ✅ `partner_id`, `pilot_id`, `distribution_channel` + `landing_path` | The event-scoped source of truth for Partner Visits — NOT session count, NOT the user_property. Does not fire again on re-renders, plain navigation, or a repeat visit via the identical already-stored touch. Fires again if a *different* partner/pilot/channel touch is detected (e.g. partner A's link, then later partner B's link) |
| `trip_started` | `search` + `generate_lead` | `HeroForm.tsx` submit, before `router.push` | ✅ | Fires without `trip_id` — none exists yet at this point for anyone, partner or organic |
| `trip_generated` (upstream diagnostic, not a pilot KPI) | `itinerary_generated` | `TripResult.tsx`, AI response validated | ❌ (not added) | Can fire without persistence (user never saves); NOT the `trip_completed` signal — see decision below |
| **`trip_completed`** | **`trip_saved`** | `TripResult.tsx`, first successful DB persist (fires exactly once per trip) | ✅ | Chosen over `itinerary_generated` per your explicit decision: "use the reliable DB-success point" |
| `trip_saved` | `trip_saved` | *(same as above — already correctly named)* | ✅ | |
| `trip_edited` | `itinerary_edited` | Any add/remove/edit/add_day action, per-action (not sampled) | ✅ | Finer-grained than the brief's spec (has an `action` param) — a strict superset |
| `hotel_click` | `planner_hotel_clicked` | `PlannerHotelsSection.tsx` click, before navigation | ✅ | Also cascades into `affiliate_clicked` (see below) for cross-surface rollups |
| `activity_click` | `affiliate_clicked` (filtered `category != 'hotel'`) | Day-block "Book" modal, `TripResult.tsx` | ✅ | Same underlying event as hotel rollup — disambiguate by `category`/`surface` in the dashboard, not a separate event |
| `booking_click` | `affiliate_clicked` (any category) **or** `planner_hotel_clicked` | — | ✅ | Reported as a computed union in Looker Studio (sum of both events), not a new literal event — firing a 3rd event for the same click would violate "don't duplicate" |
| `booking_confirmed` | `hotel_booking_confirmed` | `PlannerHotelsSection.tsx` / `MobileTripClient.tsx`, guest-submitted "Ya reservé" form | ✅ + `confirmation_type: 'self_reported'` | **Not verified** — no webhook/PMS/payment source of truth exists. Always report this labeled as self-reported, never blended into a generic "bookings" number |
| `email_signup` | `waitlist_signup` (general site) / `mobile_view_newsletter_captured` (mobile companion) | Newsletter form submit success | ✅ | The partner guide's own `NewsletterSignup.tsx` is a separate, already-instrumented surface (`host_guide_*` events), out of this taxonomy |
| `return_trip_created` | *(not implemented)* | — | — | No reliable signal exists. `trip_reopened` means "reloaded the same trip," not "a returning user created a NEW trip." Would require a DB lookup ("does this user already own a trip?") that doesn't exist today. Documented gap, not fabricated. |

## Guest-guide-specific events (unchanged, already live)

These fire only on `/guia/[partner]` and were already instrumented before
this pilot; unaffected by the taxonomy above except that
`host_guide_planner_click`'s destination link now carries the pilot's UTM
scheme (see `mxcity-pilot-links.md`).

| Event | Fires at |
|---|---|
| `host_guide_view` | Guide page load |
| `host_guide_insiders_view` | Insiders section enters viewport (published partners only) |
| `host_guide_planner_click` | Planner CTA click |
| `host_guide_map_click` | "See all N places on the map" click |

## Why events were mapped, not duplicated

The brief's own instruction (§17) is explicit: don't build a parallel,
Mexico-City-specific tracking system. `lib/analytics/events.ts` already
had ~35 events covering nearly every funnel step under different,
equally valid names — some already GA4-recommended names
(`generate_lead`, `search`), some Lagomplan-specific
(`itinerary_edited`, `planner_hotel_clicked`). Firing a second event for
the same user action would inflate counts, confuse "which event is the
source of truth," and contradict the brief's own "do NOT create
meaningless duplicate events" instruction (§17, §6). This table is the
translation layer instead.
