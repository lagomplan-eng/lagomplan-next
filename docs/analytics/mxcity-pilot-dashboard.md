# Mexico City Pilot — Dashboard Spec

This is a **specification**, not a built dashboard. Looker Studio has no
API this codebase can drive — everything below must be assembled by hand
in the Looker Studio UI, following this doc. See §11–12 for the manual
setup steps.

## 1. Dashboard objective

Prove (or disprove) the funnel:

```
PARTNER DISTRIBUTION → TRAVELER VISIT → TRIP START → COMPLETED TRIP →
BOOKING INTENT → BOOKING → RETENTION
```

September 2026 = baseline measurement. No targets or "good conversion
rate" benchmarks are encoded anywhere in this spec or in code — the pilot
establishes its own baseline first (per your instruction: Sept = measure,
Oct = improve, Nov = benchmark, Dec = repeat).

Primary KPI: **trips generated per partner-exposed traveler**
(`completed trips / exposed travelers` — see §6, and note this can only
be computed once the partner supplies exposure data; see §6's explicit
"pending" state).

## 2. Data sources

| Source | What it provides | Owner |
|---|---|---|
| GA4 property (existing, `NEXT_PUBLIC_GA_MEASUREMENT_ID`) | All events in `docs/analytics/mxcity-pilot-taxonomy.md`, including `partner_visit` (the Partner Visits source of truth — see §3, §6) | Already live |
| Partner-supplied exposure data | Guests exposed, email recipients, QR scans, guide viewers (if the partner's own tools report these) | **Not automatable — partner must provide** |

GA4 cannot measure how many guests were exposed to the partner's guest
guide, pre-arrival email, or QR code — only how many actually clicked
through to Lagomplan. Do not fabricate an exposure number from GA4 data.

## 3. Required GA4 dimensions

Custom dimensions to register in GA4 Admin (see §11) — only these three,
deliberately not more (per your instruction: "do not create custom
dimensions for everything"):

| Dimension | Scope | Source event parameter |
|---|---|---|
| `partner_id` | **Event only** | present on every event in the taxonomy table, including `partner_visit` |
| `pilot_id` | **Event only** | same |
| `distribution_channel` | **Event only** | same |

**Register event-scoped only. Do not register user-scoped custom
dimensions for these three fields, and do not use the existing
`partner_id`/`pilot_id`/`distribution_channel` user_properties as a
source of truth for pilot funnel reporting.** User properties are sticky
— once set on a GA4 client, they persist into that client's later,
unrelated organic sessions with no expiry, which makes them unsuitable
for counting partner-attributed activity precisely. The code still sets
them (`components/analytics/PartnerAttributionCapture.tsx` — untouched,
harmless to leave running, no PII), but this dashboard's reporting is
built entirely on the event-scoped dimensions above, sourced from actual
event parameters at fire time. See §6 for how `partner_visit` in
particular replaces "sessions with partner_id" as the Partner Visits
metric for exactly this reason.

Destination, trip duration, and traveler type were considered and
**excluded** — they're useful for product analysis generally, but the
pilot's dashboard doesn't need them as registered custom dimensions; they
can be read ad hoc from event parameters in GA4's own UI (Explore) without
burning one of the 50 event-scoped custom dimension slots GA4 allows per
property.

## 4. Required GA4 metrics

Standard GA4 metrics, no custom metric registration needed:
- Event count (filtered per event name — see taxonomy)
- `partner_visit` event count, by `partner_id` / `pilot_id` / `distribution_channel` (via the event-scoped custom dimensions above) — this IS the Partner Visits metric, not a generic session count

## 5. Required calculated fields (Looker Studio)

Create these as calculated fields in the Looker Studio data source, not
in code:

```
Partner Visits           = COUNT(Event) FILTER WHERE Event name = "partner_visit"
Trip Starts              = COUNT(Event) FILTER WHERE Event name = "search" AND partner_id IS NOT NULL
Completed Trips          = COUNT(Event) FILTER WHERE Event name = "trip_saved" AND partner_id IS NOT NULL
Booking Clicks           = COUNT(Event) FILTER WHERE Event name = "planner_hotel_clicked" AND partner_id IS NOT NULL
                            +
                            COUNT(Event) FILTER WHERE Event name = "affiliate_clicked" AND surface != "planner-hotels" AND partner_id IS NOT NULL
Self-Reported Bookings   = COUNT(Event) FILTER WHERE Event name = "hotel_booking_confirmed" AND partner_id IS NOT NULL
Email Opt-ins            = COUNT(Event) FILTER WHERE Event name IN ("waitlist_signup", "mobile_view_newsletter_captured") AND partner_id IS NOT NULL
```

**Booking Clicks is a sum of two mutually-exclusive filters, not a
single `IN (...)` filter.** `planner_hotel_clicked` fires paired with an
internal `affiliate_clicked` (`surface: "planner-hotels"`) for every
hotel click — see `lib/analytics/events.ts`'s `plannerHotelClicked()`.
Counting both event names with an `IN (...)` filter double-counts every
hotel click (once under each name) while activity clicks — which only
ever fire `affiliate_clicked` with a different `surface` — count once.
The `surface != "planner-hotels"` exclusion on the `affiliate_clicked`
leg is what prevents this. Do not "simplify" this back to an `IN (...)`
filter.

**`Partner Visits` no longer counts sessions.** It counts the
`partner_visit` event, which fires exactly once per genuinely new
partner touch (`lib/analytics/partner-attribution.ts`) — not once per
pageview, and not once per session. This is the event-scoped
replacement for the earlier session-based definition, and does not
depend on any user-scoped custom dimension (see §3).

## 6. Funnel definitions

```
Guests Exposed  →  Partner Visits  →  Trip Starts  →  Completed Trips  →  Booking Clicks  →  Self-Reported Bookings
   (partner-       (GA4:               (GA4:              (GA4:              (GA4: see §5's         (GA4: hotel_booking_
    provided,        "partner_visit"     "search")          "trip_saved")      2-part sum)            confirmed, labeled
    see §2)          event count)                                                                      self-reported)
```

**"Guests Exposed" has NO GA4 source.** Until the partner provides it,
every chart and scorecard that needs it must display the literal string
**"Exposure data pending partner input"** — never a computed placeholder,
never a GA4 approximation. This is enforced in the dashboard build (§12),
not in code (there's no code path that invents this number).

## Metric formulas (documented, not benchmarked)

```
Partner activation rate        = partner visits / exposed travelers            [blocked until exposure data exists]
Trip start rate                = trip starts / partner visits
Trip completion rate           = completed trips / trip starts
Booking intent rate            = booking clicks / completed trips
Trip generation per exposed traveler = completed trips / exposed travelers     [blocked until exposure data exists]
Booking conversion             = confirmed bookings / completed trips          [NOT computed — no verified booking
                                                                                  source exists; see taxonomy doc]
```

Booking conversion is intentionally **not** included as a chart in §7 —
computing it would require treating `hotel_booking_confirmed`
(self-reported) as a verified booking, which the taxonomy doc explicitly
says not to do. If you want a directional, clearly-labeled
"self-reported booking rate" instead, that's `Self-Reported Bookings /
Completed Trips` — build it only if you want it, and label the chart
"Self-reported, not verified" in its title.

## 7. Recommended charts, by page

**Page 1 — Pilot Overview**
Scorecards: Partner Visits, Trip Starts, Completed Trips, Booking Clicks,
Email Opt-ins. Guests Exposed scorecard shows the pending-data string
until the partner supplies a number. Date range selector defaulted to
September 2026.

**Page 2 — Guest Funnel**
Funnel chart: Partner Visits → Trip Starts → Completed Trips → Booking
Clicks. Table below with the rate formulas from §6 (excluding the two
exposure-blocked ones, shown separately with the pending label).

**Page 3 — Distribution Channels**
Bar chart: sessions/trip starts by `distribution_channel`
(guest_guide / prearrival / booking_confirmation / qr_code / whatsapp).
Table: same breakdown by `partner_id` for when more than one partner is
live.

**Page 4 — Guest Behavior / Trip Intelligence**
Top destinations searched (event parameter `search_term` on the `search`
event, filtered to partner sessions). Itinerary edit activity
(`itinerary_edited` count per completed trip — engagement depth, not a
funnel step).

**Page 5 — Commercial Intent**
Booking Clicks by category (`affiliate_clicked.category`) and by surface.
Self-Reported Bookings, clearly subtitled "self-reported, not verified."

**Page 6 — Pilot Learnings**
Static text/table — 3–5 qualitative learnings written by hand each
month, not derived from a query. This page has no charts by design.

## 8. Filters

Every page should support filtering by:
- Date range
- `partner_id`
- `distribution_channel`

Global page-level filter recommended: `pilot_id = mxcity_pilot` (or
whichever pilot is being viewed), so the internal command center can be
reused for future pilots by swapping this one filter.

## 9. Partner-facing view

A **separate, much simpler** Looker Studio report (or a filtered
copy/view of the internal one — see §12 for which approach). Contents:

- Headline funnel only: Guests Exposed → Visits → Trips Started →
  Completed Trips → Booking Clicks → Bookings (if measurable, labeled
  self-reported)
- Activation rate, trip creation rate, trip completion rate, booking
  intent rate
- Top destinations/interests (aggregated, no individual traveler data)
- 3–5 pilot learnings (from Page 6 above)

**Must NOT show:** other partners' data, overall Lagomplan traffic,
internal company metrics, affiliate economics/revenue figures, raw GA4
technical metrics (bounce rate, engagement time, etc.), or anything
traveler-identifying. Filter this report to `partner_id = <that partner>`
at the data-source level, not just per-chart, so there's no way to
accidentally expose another partner's row.

Framing test before publishing anything to a partner: it should read as
"here's what happened when your guests used Lagomplan," not "here are our
Google Analytics statistics."

## 10. Internal view

The full 6-page structure in §7, unfiltered by partner (with
`partner_id`/`distribution_channel` as interactive filters, not
hardcoded), available to the Lagomplan team only.

## 11. Manual GA4 Admin setup (you must do this — not automatable from code)

1. **Register 3 EVENT-SCOPED custom dimensions only** (GA4 Admin → Data
   display → Custom definitions → Create custom dimension → scope =
   Event):
   - `partner_id`
   - `pilot_id`
   - `distribution_channel`
   Use the exact parameter name shown (case-sensitive, matches the code:
   `partner_id`, `pilot_id`, `distribution_channel`). **Do not also
   register these as user-scoped custom dimensions** — the app does set
   them as user_properties too (harmless, left running, no PII), but
   they are intentionally not used as this dashboard's source of truth
   (sticky across unrelated later sessions — see §3) and registering a
   user-scoped dimension for them would make it too easy to
   accidentally build a chart on the wrong one.
2. **Verify events are being received** — GA4 Admin → DebugView, or
   Realtime report, filtering for `partner_visit`, `trip_saved`,
   `search`, `affiliate_clicked`, `planner_hotel_clicked`,
   `hotel_booking_confirmed`, `waitlist_signup` — confirm `partner_id`
   appears as a parameter once you test a link with `utm_medium=partner`,
   and confirm `partner_visit` fires exactly once even if you navigate
   around the site afterward on the same tagged link.
3. **Custom dimensions take ~24-48h to backfill in standard reports**
   after registration — DebugView/Realtime show data immediately,
   standard reports and Looker Studio will not show historical data
   captured before the dimension was registered.
4. No GTM setup needed — this app doesn't use GTM, only direct gtag.

## 12. Manual Looker Studio setup (you must do this)

1. Create a new Looker Studio report, add a **Google Analytics data
   source** connected to the GA4 property.
2. Confirm the 3 custom dimensions from §11 appear in the field picker
   (only after they've backfilled — see §11.3).
3. Build the calculated fields from §5 in the data source (or per-chart).
4. Build Pages 1–6 per §7.
5. For the partner-facing report: either (a) duplicate the report and
   delete/hide everything except the partner-facing content in §9, then
   add a fixed filter `partner_id = <partner>` at the page or
   report level, or (b) use Looker Studio's native filter-controls +
   "View" permissions if you want one shared report with a locked filter
   per partner (still create a genuinely separate report if there's any
   risk a partner could remove the filter — don't rely on a UI filter a
   viewer could clear).
6. For "Guests Exposed": add a manual scorecard or table backed by a
   Google Sheet you update by hand with partner-provided numbers (guests
   exposed, email recipients, QR scans) — do NOT connect it to a GA4
   query. Until the partner provides a number, put the literal text
   "Exposure data pending partner input" in that cell.
7. Re-share/re-publish the partner-facing report each period (or set up
   scheduled email delivery from Looker Studio) — this is a manual send,
   not automated.
