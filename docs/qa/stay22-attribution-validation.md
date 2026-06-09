# Stay22 Affiliate Attribution — Validation Plan

**Question being validated:** When the LetMeAllez script hijacks a click on a
link that is *already* a `stay22.com/lagomplan/...` affiliate link, what is the
actual cost — lost money, or only lost attribution detail? And does the new
`Stay22Guard` (see `components/affiliate/Stay22Guard.tsx`) preserve full
attribution?

**Answer (validated 2026-06-09):** The hijack costs **campaign-level
attribution detail, not money** — the destination and publisher (`aid`/`lmaID`)
survive, but the per-link `campaign` tag is flattened. The guard preserves the
link byte-for-byte, so attribution is intact. The one remaining check that
needs the **Stay22 dashboard** (Test D) is whether `aid=lagomplan` and `lmaID
69b992…` pay into the same account — code can't see that.

---

## Background — our links are NOT uniform

Attribution params differ by surface. Confirmed live:

| Surface | Example link | aid | campaign | lmaID | other |
|---|---|---|---|---|---|
| **Planner** (runtime, `build.ts`) | `www.stay22.com/allez/booking?aid=lagomplan&campaign=lagomplan-planner-es&address=…` | ✅ | `lagomplan-{surface}-{locale}` | ❌ | checkin/checkout/adults |
| **Guide — booking** (`/es/guias/oaxaca`) | `booking.stay22.com/lagomplan/Y5O4MyDD2s?aid=lagomplan&campaign=lagomplan-oaxacatradicionenfamilia&lmaID=69b992…&sid22=…&ref22=…` | ✅ | per-guide | ✅ | sid22, ref22, pageCategory |
| **Guide — getyourguide** | `getyourguide.stay22.com/lagomplan/Ks1TFH0f9j?ref=lagomplan` | ❌ | ❌ | ❌ | `ref=lagomplan` only |
| **World Cup** (`/es/mundial/cdmx`) | `hotelscom.stay22.com/lagomplan/-3nIgm0dd7` | ❌ | ❌ | ❌ | none — attribution is in the slug |

> ⚠️ Finding: campaign attribution is inconsistent across content. Planner and
> guide-booking links are richly tagged; getyourguide and World Cup links carry
> little/none. This is orthogonal to the guard (the guard preserves whatever a
> link carries) but worth a content cleanup pass if campaign reporting matters.

---

## Test A — Link inventory (what attribution each link carries)

**A1 — Planner builder (pure function).** From repo root:
```bash
npx tsx -e "import {buildAffiliateLink} from './lib/affiliate/build'; \
console.log(buildAffiliateLink('booking',{city:'Oaxaca',startDate:'2026-07-10',endDate:'2026-07-14',adults:2,locale:'es',surface:'planner'}))"
```
- **Expected / observed:** `…/allez/booking?aid=lagomplan&campaign=lagomplan-planner-es&address=Oaxaca&checkin=…&checkout=…&adults=2` — `aid=lagomplan`, `campaign` present, **no `lmaID`**. ✅

**A2 / A3 — Rendered links.** Boot `npm run dev`, then in a browser open
`/es/guias/oaxaca` and `/es/mundial/cdmx`, inspect each hotel CTA's `href`.
- **Observed:** matches the table above. ✅

---

## Test B — Guard preserves attribution (regression guarantee)

**Purpose:** prove the guard opens the *exact* rendered URL, dropping/adding no
params, on every surface.

**Procedure (Playwright, route-abort stay22 so no external hit):**
1. Load the page, wait for hydration (guard's `useEffect` attaches).
2. Stub `window.open` to record calls.
3. Click the first `a[href*="stay22.com"]`.
4. Assert: exactly **1** `window.open` call; its URL is **byte-equal** to the
   anchor `href`; every query param matches.

- **Observed 2026-06-09** (`/es/mundial/cdmx` and `/es/guias/oaxaca`):
  `opened count = 1 | byte-equal href = true | params intact = true` on both. ✅
- See the broader guard behavior suite in the verification log: scope (non-stay22
  ignored), `data-lma-managed` skip (no double-open), modifier-click deferral.

---

## Test C — Cost of the hijack (real LetMeAllez, guard off)

**Purpose:** observe what the LetMeAllez script actually does to a click on an
already-`lagomplan` link when nothing intercepts first.

**Procedure:** load the real `https://scripts.stay22.com/letmeallez.js` with
`Stay22.params = { lmaID: '69b992c248666aca4133dbbe' }`, put a plain
`<a target="_blank">` whose href is a fully-tagged `booking.stay22.com/lagomplan/…?campaign=lagomplan-test&…`,
click it, and capture the resulting popup URL + LetMeAllez's `/ext/partner/load`
telemetry. (Requires live network to Stay22.)

- **Observed 2026-06-09:**
  - Popup resolved to `https://www.booking.com/hotel/mx/camino-real-oaxaca.html`
    → **destination preserved** (correct hotel). ✅
  - LetMeAllez fired `…/ext/partner/load?lmaID=69b992…&aid=lagomplan&campaign=-blank…`
    and `ref22=nullblank` → the link's `campaign=lagomplan-test` was **dropped**
    (`campaign=-blank`). ❌ attribution flattened.
  - Same `lmaID` (`69b992…`), `aid=lagomplan` retained.
- **Conclusion:** the hijack does **not** misroute money to a different
  destination/stranger; it **collapses the per-campaign tag**. The guard (Test B)
  prevents this by opening the exact tagged URL itself.
- **Caveat:** run in an isolated synthetic page, so `campaign=-blank` partly
  reflects empty page-level config. Re-confirm on a real preview deploy with
  DevTools (below) if you want production-context certainty.

**Manual production version (DevTools, on a Preview/Prod deploy):**
1. Open a guide page, DevTools → Network, filter `stay22`, check **Preserve log**.
2. Temporarily disable the guard (or use a pre-fix deploy) and click a hotel CTA.
3. Find the `ext/partner/load` request — read its `campaign=` and `aid=` values.
4. Repeat with the guard enabled — the navigation should go straight to the
   anchor's tagged URL with `campaign=` intact (no `campaign=-blank`).

---

## Test D — Stay22 dashboard (YOUR action — code can't see this)

Log into the Stay22 partner dashboard for `lmaID 69b992c248666aca4133dbbe` and
confirm:

1. **Same account / payout:** `aid=lagomplan` (publisher id) and the LetMeAllez
   `lmaID` belong to the **same** Stay22 account and pay into the same balance.
   - If **same** → historical hijacks cost only reporting granularity. ✅ low urgency.
   - If **different** → hijacked clicks were crediting a different account →
     escalate; the guard fix becomes financially material, not just cosmetic.
2. **Clicks register:** recent test clicks appear in the dashboard at all.
3. **Campaign breakdown:** the `campaign=` values (`lagomplan-planner-es`,
   `lagomplan-oaxacatradicionenfamilia`, …) show up as distinct rows — i.e. the
   campaign tags we send are actually used in reporting. If they don't appear
   even with the guard, the tagging is cosmetic and the content-consistency
   finding above is moot.

---

## Summary

| Test | What it checks | Result |
|---|---|---|
| A | What attribution each link form carries | ✅ inventoried; inconsistent across surfaces |
| B | Guard preserves the exact tagged URL | ✅ byte-equal, params intact, all surfaces |
| C | Cost of the hijack (real LetMeAllez) | ✅ destination kept, **campaign flattened** (not money lost) |
| D | Same account / payout (dashboard) | ⏳ **pending — your dashboard check** |

The engineering side is validated. The only open item is **Test D**, which only
the Stay22 dashboard can answer.
