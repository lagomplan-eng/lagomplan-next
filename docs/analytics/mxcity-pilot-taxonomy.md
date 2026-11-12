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
| `host_guide_discover_click` | "Discover more" destination card click (added when those cards were wired to real lagomplan.com guide links — previously unlinked, undocumented here until now) |
| `partner_link_click` | Click on an outbound third-party partner link (Insider, Airalo) or a catalog booking link (GetYourGuide experiences, hotels) — see below |

### `partner_link_click`

Fires from one shared helper (`trackOutboundLink` in `lib/analytics/ga.ts`),
called from separate render sites that mean different things — kept
distinct via `section` rather than collapsed into one bucket (the four guide
sections below, plus the catalog pages: see "Catalog events"):

| Param | Values | Notes |
|---|---|---|
| `link_name` | `insider` \| `airalo` \| `chef_whatsapp` \| `chef_take_a_chef` \| `massage_book` \| `massage_whatsapp` \| `massage_map` \| `gyg_experience` \| `hotel_booking` | `gyg_experience` / `hotel_booking` are the catalog booking links (below). Extend the union in `content/guia/types.ts` (`PartnerLinkName`) when a new outbound partner link is added |
| `partner_slug` | `livin_condesa` \| `livin_roma` \| `livin_polanco` \| `demo`; catalog: `getyourguide`, or the hotel booking provider (`booking`, `expedia`, `hotelscom`, `kayak`, `hotel-site`, `other`) | Explicit param, not inferred from `page_location` — that URL carries the inbound distribution UTMs from Livin and is unreliable to segment on |
| `zone` | `condesa` \| `roma` \| `polanco` | Absent when the partner has no zone |
| `lang` | `es` \| `en` | |
| `section` | `before_you_arrive` \| `experience_book` \| `experience_details` \| `services_contact` \| `experience_hub` \| `experience_plan` \| `hotels_index` \| `hotels_plan` | `before_you_arrive` = the Transportation/Connectivity arrival-item link; `experience_book` = the experience card's "Book" button (highest-intent action on the page); `experience_details` = the how-to-book link inside an expanded experience card; `services_contact` (added 2026-09-28) = the Take care tab's chef and massage links (WhatsApp, Book online, Mapa, Take a Chef) — `link_name` distinguishes which action within this section; the four catalog values are in "Catalog events" |
| `destination` | e.g. `wa.me`, `airalo.tpm.li`, `www.getyourguide.com` | Hostname only, never the full URL (for every `link_name`) |
| `experience_name` | e.g. `exp-teotihuacan`'s title | Only present on `experience_book` / `experience_details` — absent on `before_you_arrive` / `services_contact` and on the catalog sections |
| `experience_id` | e.g. `parque-xcaret` | Catalog only, `link_name=gyg_experience`. Stable id from the guide file |
| `hotel_id` | e.g. `hotel-clermont` | Catalog only, `link_name=hotel_booking`. Stable id (slug of the Spanish name) |
| `position` | `1`, `2`, … | Catalog only. 1-based position in the list the traveler clicked in: the card list, or the plan panel for the `*_plan` sections |
| `provider` | `gyg`; or `booking`, `expedia`, … | Catalog only. The booking provider |
| `destination_slug` | e.g. `ciudad-de-mexico` | Catalog only. Registry key of the place. Kept apart from `destination`, which stays the outbound hostname |

**Custom dimensions to register in GA4 (event-scoped, not user-scoped —
same rule as `partner_id`/`pilot_id`/`distribution_channel` above):**
`link_name`, `partner_slug`, `zone`, `section`, `destination`, `experience_name`.
Catalog additions: see "Custom dimensions to register for the catalog events" below.

**UTMs on outbound hrefs:** Insider links (`wa.me/...`) get
`utm_source=lagomplan&utm_medium=guide&utm_campaign=<partner.pilotId>`
appended at render time (`lib/guia/links.ts`, `withPilotUtm`) — reuses
`pilotId`, the same value already used for the planner CTA's
`utm_campaign`, rather than `partner_slug`, to avoid two different values
under the same param name on the same page. **Airalo's href is
deliberately left untouched** — it's a live affiliate short-link
(`airalo.tpm.li`) and untested for how it handles extra query params on
its redirect; it still fires `partner_link_click`, just with its original
URL.

## Catalog events (Experiencias hub, Hoteles, shared plan)

Fired from `lib/experiences/analytics.ts` and `lib/catalog-analytics.ts` (one place, so event
names and parameters stay in step with the custom dimensions below). **Ids and registry keys
only — no prices, ratings, experience or hotel names, or free text.** These are product events
for the catalog pages (`/es/experiencias`, `/en/experiences`, `/es/hoteles`, `/en/hotels`), not
pilot KPIs: they are sent with `gaTrack` directly and do **not** get the partner attribution
params. All parameters are **event-scoped**. `tests/catalog-analytics.test.ts` pins every event's
exact parameter set, and checks this section names each of them.

| Event | Fires when | Parameters (example) |
|---|---|---|
| `experience_list_view` | Once per hub page load (not per filter change) | `lang` (`es`), `experiences_total` (`88`) |
| `experience_filter` | One event per filter group that changed (one click can fire several) | `lang`, `filter_group` (`region` \| `destino` \| `para` \| `tipo` \| `duracion`), `filter_value` (`europa`; multi-select comma-joined `cancun,tulum`; `(cleared)`), `results_count` (`24`) |
| `experience_guide_click` | "Ver en la guía" button on a hub card | `lang`, `experience_id` (`parque-xcaret`), `destination_slug` (`cancun`), `position` (`3`) |
| `hotel_filter` | One event per filter group that changed, on Hoteles | `lang`, `filter_group` (`destino` \| `precio` \| `viajero`), `filter_value`, `results_count` (`12`) |
| `plan_add` / `plan_remove` | An item is added to / removed from the plan, on either page | `lang`, `item_type` (`experience` \| `hotel`), `plan_item_id` (`parque-xcaret`), `destination_slug`, `plan_size` (`3`, the size after the change) |
| `plan_handoff` | "Plan this trip" from the plan panel | `lang`, `plan_size`, `mixed` (`true` when the plan has both experiences and hotels), `source` (`panel`; the `concierge` value is no longer sent, see `planner_cta_click`), `destination_slug` (omitted when there is none) |
| `planner_cta_click` | The "Planear mi viaje" CTA in the "¿Lo armamos por ti?" block is clicked. **Not gated by the saved-plan flag**; fires whether or not the plan is shown | `lang`, `section` (`experience_hub` \| `hotels_index`), `destination_slug` (the destination being browsed; omitted when there is none). Today only the hub has the CTA, so only `experience_hub` is sent; `hotels_index` is reserved for a Hoteles CTA |
| `partner_link_click` | A booking link is clicked | see below |

`hotel_filter` and `experience_filter` use the same count parameter, `results_count`.

**The saved plan is behind a flag.** `plan_add`, `plan_remove`, `plan_handoff` and the plan-panel
booking clicks (`partner_link_click` with `section` = `experience_plan` / `hotels_plan`) are sent
**only when `NEXT_PUBLIC_FEATURE_SAVED_PLAN=true`**. The flag is off by default (the plan is hidden
until account-based "Guardados" ships), and it is read at build time, so a change needs a redeploy.
While it is off none of those events exist in GA4, and `planner_cta_click` is the only plan-related
signal. Don't read a drop to zero in `plan_*` as a tracking fault. Card-level booking clicks
(`experience_hub`, `hotels_index`) are not affected.

### Catalog `partner_link_click`

`section` says where the click happened, and `position` is the position within *that* list:

| `section` | `link_name` | Where |
|---|---|---|
| `experience_hub` | `gyg_experience` | Booking link on a card of the Experiencias hub |
| `experience_plan` | `gyg_experience` | Booking link for an experience, inside the plan panel |
| `hotels_index` | `hotel_booking` | Booking link on a card of the Hoteles page |
| `hotels_plan` | `hotel_booking` | Booking link for a hotel, inside the plan panel |

Parameters, experiences: `link_name`, `partner_slug` (`getyourguide`), `lang`, `section`, `destination`
(`www.getyourguide.com`), `experience_id`, `position`, `provider` (`gyg`), `destination_slug`.
Hotels: the same with `partner_slug` and `provider` set to the booking provider, and `hotel_id` instead
of `experience_id`.

### Custom dimensions to register for the catalog events

Admin → Custom definitions → Custom dimensions → Create custom dimension. **Scope: Event** for all;
the event parameter must match exactly (case-sensitive). GA4 allows one dimension per parameter name,
so if one already exists (several of these names are used by other events), reuse it and filter by
event name. Registration is not retroactive.

| Dimension name | Scope | Event parameter | Used by |
|---|---|---|---|
| Experience ID | Event | `experience_id` | `experience_guide_click`, `partner_link_click` |
| Hotel ID | Event | `hotel_id` | `partner_link_click` |
| Destination slug | Event | `destination_slug` | guide click, `partner_link_click`, plan events |
| Filter group | Event | `filter_group` | `experience_filter`, `hotel_filter` |
| Filter value | Event | `filter_value` | `experience_filter`, `hotel_filter` |
| Plan item ID | Event | `plan_item_id` | `plan_add`, `plan_remove` |
| Plan item type | Event | `item_type` | `plan_add`, `plan_remove` |
| Plan includes hotels and experiences | Event | `mixed` | `plan_handoff` |
| Plan handoff source | Event | `source` | `plan_handoff` |
| Destination slug (above) / `section` / `lang` | Event | (existing) | `planner_cta_click` reuses `destination_slug`, `section` and `lang`; no new dimension is needed |
| Provider | Event | `provider` | `partner_link_click` |
| Click position | Event | `position` | `experience_guide_click`, `partner_link_click` |

Also needed, from the sections above (check they exist): `link_name`, `partner_slug`, `section`,
`destination`, `lang`.

Optional custom **metrics** (Scope: Event, Unit: Standard), only to sum or average in the GA4 UI:
`experiences_total`, `results_count`, `plan_size`.

`filter_value` can be a comma-joined combination, so its cardinality can be high; standard reports may
group the long tail under "(other)". The raw parameters are always in the BigQuery export.

### Changes to catalog parameters

The catalog went live in production on 2026-11-12. Events sent before the change below carry the old names.

- `partner_link_click.section`: added `experience_plan` and `hotels_plan`. Plan-panel clicks were
  previously reported as `experience_hub` / `hotels_index`, indistinguishable from card clicks.
- `hotel_filter`: `result_count` is now `results_count`.
- `plan_*` events and plan-panel booking clicks are now sent only when `NEXT_PUBLIC_FEATURE_SAVED_PLAN=true` (off by default). New event `planner_cta_click`. The concierge CTA no longer sends `plan_handoff` with `source=concierge`.
- `plan_add` / `plan_remove`: `item_id` is now `plan_item_id`. Other events that use `item_id`
  (the planner and trip-result events) are unchanged.

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
