# Mexico City Pilot — Tracking Links

How to build a partner-distribution link for any channel, and what each
one is for. This structure is reusable for future partners/pilots —
Mexico City is simply the first `pilot_id`.

## UTM structure

```
utm_source   = <partner slug>       e.g. livin_roma
utm_medium   = partner              (always this literal value — signals "B2B2C partner traffic" to the attribution layer)
utm_campaign = <pilot id>           e.g. mxcity_pilot
utm_content  = <distribution channel>
```

`utm_medium=partner` is load-bearing: `lib/analytics/partner-attribution.ts`
only recognizes a URL as partner traffic when `utm_medium` is exactly
`partner`. Using any other value (e.g. `guia`, `referral`) means the visit
is captured by the normal marketing first-touch system instead, and will
NOT show up as partner traffic in the pilot dashboard.

Partner slugs currently registered (`content/guia/index.ts`), both on
pilot `mxcity_pilot`:

| Partner slug | Property |
|---|---|
| `livin_condesa` | Livin Condesa |
| `livin_roma` | Livin Roma |

`livin_condesa` was renamed from the retired slug `livin` now that a
second Livin property exists. The old URL `/guia/livin` permanently
redirects to `/guia/livin_condesa` — including rewriting stale
`utm_source=livin` tracking links to `utm_source=livin_condesa`, so old
links in circulation don't misattribute to the retired slug. See
`next.config.mjs`'s `redirects()`. **Never issue new links using the
`livin` slug — always use `livin_condesa`.**

## Where each link should point

Two starting points, depending on the channel:

1. **The guest guide** (`/guia/<partner_slug>`) — for channels where you
   want the guest to see the co-branded guide first. The guide's own
   planner CTA already appends the correct UTM scheme automatically
   (`app/guia/[partner]/GuiaClient.tsx`) — you only need to tag the link
   INTO the guide, not the link the guide generates onward.
2. **The planner directly** (`https://www.lagomplan.com/<locale>/planner`,
   e.g. `/en/planner` or `/es/planificador`) — for channels that should
   skip the guide and send guests straight into trip planning.

## Channel table

| Channel | Purpose | `utm_content` | Points to | Expected user behavior | Primary KPI |
|---|---|---|---|---|---|
| Guest guide | Guide embedded/linked in the partner's own welcome material | `guest_guide` | `/guia/<partner_slug>` (no UTMs needed here — the guide's outbound planner link carries them) | Browses the guide, clicks "Personalize my trip in 60 seconds" | Guide→planner click-through rate |
| Pre-arrival email | Sent by the partner before check-in | `prearrival` | `/guia/<partner_slug>?utm_source=<partner_slug>&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=prearrival` | Opens email, clicks through to the guide or planner | `trip_started` rate from this channel |
| Booking confirmation | Embedded in the partner's own booking-confirmation email/page | `booking_confirmation` | Same pattern, `utm_content=booking_confirmation` | Clicks shortly after booking, while travel is top of mind | `trip_started` rate, time-to-click |
| QR code | Printed in the property (welcome book, fridge, entryway) | `qr_code` | Same pattern, `utm_content=qr_code` | Scans on-site, mobile session | Mobile `trip_started` rate |
| WhatsApp | Partner's guest-communication WhatsApp thread | `whatsapp` | Same pattern, `utm_content=whatsapp` | Taps link from chat | Click-through + `trip_started` rate |

## Example links

Guest guide (UTMs generated automatically by the app — just share the bare link):
```
https://www.lagomplan.com/guia/livin_roma
```

Pre-arrival email:
```
https://www.lagomplan.com/guia/livin_roma?utm_source=livin_roma&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=prearrival
```

Booking confirmation:
```
https://www.lagomplan.com/guia/livin_roma?utm_source=livin_roma&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=booking_confirmation
```

QR code (encode this URL):
```
https://www.lagomplan.com/guia/livin_roma?utm_source=livin_roma&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=qr_code
```

WhatsApp:
```
https://www.lagomplan.com/guia/livin_roma?utm_source=livin_roma&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=whatsapp
```

For the Livin Condesa property (original, Veracruz 85 — slug
`livin_condesa`), swap `livin_roma` for `livin_condesa` throughout:

```
https://www.lagomplan.com/guia/livin_condesa
https://www.lagomplan.com/guia/livin_condesa?utm_source=livin_condesa&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=prearrival
https://www.lagomplan.com/guia/livin_condesa?utm_source=livin_condesa&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=booking_confirmation
https://www.lagomplan.com/guia/livin_condesa?utm_source=livin_condesa&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=qr_code
https://www.lagomplan.com/guia/livin_condesa?utm_source=livin_condesa&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=whatsapp
```

## Adding a new partner or pilot

1. Register the partner in `content/guia/index.ts` / `content/guia/partners/<slug>.ts` (see `docs/` for the guide-authoring flow — unrelated to this doc).
2. Set `pilotId` on the `Partner` object (`content/guia/types.ts`) — reuse an existing pilot id if this partner belongs to the same pilot/cohort, or introduce a new one.
3. Build links using the table above with the new `utm_source`/`utm_campaign`.
4. No code changes needed — attribution capture, event params, and GA4 custom dimensions are all driven by the UTM values, not hardcoded partner names.
