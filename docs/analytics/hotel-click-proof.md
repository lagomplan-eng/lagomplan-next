# hotel_booking: real-browser proof (2026-11)

Production builds (`next build` + `next start`) of main and of the fix, the real Stay22 LetMeAllez script loading from
the network, analytics consent granted, GA requests aborted (nothing sent), the hotel link activated 5 s after load,
a fresh visitor per trial. "fired" = `partner_link_click` with `link_name=hotel_booking` pushed to `dataLayer`;
"proceeded" = the click still tried to open the partner page (an external document request after the click).

| | Stay22 loaded | before: fired | after: fired (exactly once) | link proceeded (before / after) |
|---|---|---|---|---|
| `/es/hoteles`, desktop click | 8/8 | 0/8 | **8/8** (8/8) | 8/8 / 8/8 |
| `/es/hoteles`, mobile tap | 8/8 | 0/8 | **8/8** (8/8) | 8/8 / 8/8 |
| `/es/guias/roma` hotel link, desktop click | 8/8 | 0/8 | **8/8** (8/8) | 8/8 / 8/8 |
| `/es/guias/roma` hotel link, mobile tap | 8/8 | 0/8 | **8/8** (8/8) | 8/8 / 8/8 |

Event parameters after the fix:

- `/es/hoteles`: `{ section: "hotels_index", position: 1, hotel_id: "nizuc-resort-spa", destination_slug: "cancun", provider: "booking", partner_slug: "booking", lang: "es" }` (plus `link_name`, `destination` = host): the same set as before the fix.
- guide: `{ section: "guide_hotels", position: 1, hotel_id: "casa-monti-roma", destination_slug: "roma", provider: "booking", partner_slug: "booking", lang: "es" }`.

The same measurement on production (before the fix, Stay22 loading) gave 0/8 per cell; with Stay22 blocked, `/es/hoteles` fired 8/8 and the guide 0/8 (it had no tracking).
