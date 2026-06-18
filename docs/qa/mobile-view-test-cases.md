# Test Cases — Mobile Trip View (revised)
## lagomplan · `feat/mobile-trip-view` (PR #65)

**Status:** Ready for QA Lead review → tester execution
**Route under test:** `/{locale}/trips/{trip_id}` (e.g. `/es/trips/<uuid>`)
**Last revised:** 2026-06-07 — reconciled against the shipped implementation.

> **Read this first — what changed vs. the original draft.** The draft was written against an earlier plan. The shipped feature differs in ways that change assertions, so several original cases were wrong. Key corrections, all reflected below:
>
> 1. **Route is by `trip_id` (UUID), not `slug`.** There is no slug-based mobile route.
> 2. **Not-found / no-access → `redirect` to the locale home page** (HTTP redirect). There is **no 404 page** and **no trip "expiry"** concept — those draft cases were removed.
> 3. **Persistence is one endpoint:** `PATCH /api/trips/{trip_id}/companion` (+ the pre-existing `/booking-confirm` for hotels). There are no per-concern endpoints.
> 4. **Plan vs. progress split:** companion-only data (per-activity **notes/links**, **packing** check-off) is written to a separate **`trip_progress`** JSONB column. Plan-shared data (**task completion `doneChecks`**, **budget `actual` + `userEst`**) is read-modify-written into **`trip_data`**. Nothing is stored at `days[i].items[j].userNote`, and there is **no stored `checks` array** — checks are *derived* from the itinerary; only their done-IDs persist.
> 5. **Anonymous vs. logged-in writes:** logged-in **owners** persist to the DB; **anonymous-trip** viewers persist to **localStorage** (`lagomplan_companion_<tripId>`, and `lagomplan_booking_<tripId>_<accId>`).
> 6. **Edit permission = `canEdit = isOwner || isAnonTrip`.** A logged-in **non-owner** viewing a **shared** trip is **read-only** (no edit controls).
> 7. **Third tab renamed** "Qué llevar" → **"Preparativos"**, containing two sections: **"Antes de salir"** (the previously-hidden pre-trip checklist) and **"Qué llevar"** (packing). Internal tab id / GA value is still `packing`.
> 8. **Booking is now a drawer.** Each bookable activity has a **"Reservar …"** button that opens a **bottom-sheet of provider options** (Booking, Hotels.com, OpenTable, Uber, …). Transfers DO get a "Reservar traslado" button; only `free` items have none.
> 9. **New surfaces to test:** Save/Share/PDF toolbar, mobile auto-redirect, multi-city per-day hotel, editable "Tu estimado", prominent progress bar, Stay22 link-bypass.
> 10. **Validation is lenient:** bad budget/packing values are **coerced** (negative/non-numeric → `null`, out-of-range packing index → dropped). They do **not** return 400.

---

## Key implementation facts the tester must know

- **Edit permission:** owners and anonymous-trip viewers can edit; logged-in non-owners of a shared trip are read-only. Newsletter card + login nudge show only when **not logged in**.
- **Derived check IDs** (these are what land in `trip_data.doneChecks`): pre-trip checks `pretrip-book-hotel` (single-city) / `pretrip-book-hotel-seg-N` (multi-city), `pretrip-pack`, `pretrip-documents`, `pretrip-offline`, `pretrip-devices`; per-day checks `check-<itemId>` (tours/restaurants carry a `day`; arrival/departure transfers do not). Pre-trip checks only generate when the trip has **> 1 day**.
- **Per-day task counter** counts checks whose `day === dayNumber`. Pre-trip checks (no day) appear only in the **Preparativos → Antes de salir** section, not in any day pill.
- **Progress bar** counts **all** checks (per-day + pre-trip) **plus** packing items.
- **Today / default day** is computed **client-side after mount** from the first accommodation `checkInDate` (or first segment `startDate`); clamped to `[0, lastDay]`; falls back to day 0 and no "today" dot if no start date is derivable.
- **Multi-city:** the hotel card and the activity booking drawer use the accommodation **covering the selected day** (`checkIn ≤ dayDate < checkOut`, with checkout/last-day fallback), not always the first.
- **Stay22:** every internal/booking link the view owns uses `preventDefault` + `window.open`/`router.push`. A regression here sends the user to Booking.com — explicitly test that links land on the intended destination.
- **PDF** opens `/{locale}/planner?trip_id=…&full=1&print=1` in a new tab; the planner auto-fires the print dialog once rendered (you get the desktop print layout, not the mobile layout).
- **Auto-redirect:** a **mobile user-agent** hitting `/{locale}/planner?trip_id=…` is redirected to `/{locale}/trips/{id}`, **unless** `full=1` is present.

---

## Fixtures

```typescript
// fixtures/trips.ts
// NOTE: trips are loaded by `id` (UUID). `trip_data.checks` is NOT stored —
// only `trip_data.doneChecks` (string[] of derived check IDs). Companion
// notes/links/packing live in the separate `trip_progress` column.

export const TRIP_OWNER = {
  id: 'uuid-owner-1',
  slug: 'fin-de-semana-cdmx',          // present but not used for routing
  user_id: 'user-abc',
  destination: 'Mexico City',
  duration_days: 3,
  travelers: 'pareja',                  // per-person divisor is parsed from this (pareja→2)
  is_shared: false,
  trip_data: {
    title: 'Fin de semana en CDMX',
    subtitle: '',
    days: [
      { n: 1, label: 'DÍA 01', title: 'Llegada y primer sabor', progress: 0, items: [
        { id: 'item-0', type: 'tour',       name: 'Zócalo y Templo Mayor', time: '16:00', price: '$90 MXN' },
        { id: 'item-1', type: 'restaurant', name: 'Cena en El Cardenal',   time: '21:00', price: '$400 MXN' },
      ]},
      { n: 2, label: 'DÍA 02', title: 'Murales y la Roma–Condesa', progress: 0, items: [
        { id: 'item-2', type: 'restaurant', name: 'Contramar',      time: '13:30', price: '$600 MXN' },
        { id: 'item-3', type: 'restaurant', name: 'Máximo Bistrot', time: '20:00', price: '$800 MXN' },
      ]},
      { n: 3, label: 'DÍA 03', title: 'Coyoacán y Chapultepec', progress: 0, items: [
        { id: 'item-4', type: 'tour', name: 'Museo Frida Kahlo', time: '10:30', price: '$250 MXN' },
        { id: 'item-5', type: 'free', name: 'Paseo por Coyoacán', time: '13:00' },
      ]},
    ],
    accommodations: [
      { id: 'acc-0', city: 'Mexico City', neighborhood: 'Centro', checkInDate: '2026-04-12',
        checkOutDate: '2026-04-15', nights: 3, priceTier: 'mid' /* booking omitted → unconfirmed */ },
    ],
    budgetRows: [
      { id: 'b0', category: 'Hospedaje',  label: 'Hotel',       aiEst: 4500, userEst: 4500, actual: null },
      { id: 'b1', category: 'Gastronomía',label: 'Contramar',   aiEst: 1200, userEst: null, actual: 1180 },
      { id: 'b2', category: 'Actividades',label: 'Frida Kahlo',  aiEst: 500,  userEst: null, actual: null },
      { id: 'b3', category: 'Traslados',  label: 'Uber',        aiEst: 700,  userEst: null, actual: null },
    ],
    packing: ['Ropa ligera', 'Paraguas', 'Tenis cómodos', 'Bloqueador solar'],
    doneChecks: ['pretrip-book-hotel', 'check-item-2'],   // IDs of derived checks already done
  },
  trip_progress: {
    annotations: { 'item-2': { note: 'Pedir terraza', link: 'https://contramar.com.mx' } },
    packedItems: [0, 2],
  },
};

// Confirmed-hotel variant
export const TRIP_OWNER_BOOKED = structuredClone(TRIP_OWNER);
TRIP_OWNER_BOOKED.id = 'uuid-owner-booked';
TRIP_OWNER_BOOKED.trip_data.accommodations[0].booking =
  { confirmed: true, code: 'BK-483920', checkinTime: '15:00', notes: 'Vista al patio', bookingUrl: 'https://booking.com/r/abc' };

// Anonymous trip (user_id null) — accessible to anyone, editable (writes to localStorage)
export const TRIP_ANONYMOUS = { ...structuredClone(TRIP_OWNER), id: 'uuid-anon', user_id: null, slug: 'viaje-anonimo' };

// Shared trip viewed by a non-owner → read-only
export const TRIP_SHARED = { ...structuredClone(TRIP_OWNER), id: 'uuid-shared', is_shared: true };

// Multi-city: CDMX → Oaxaca, two accommodations + segments
export const TRIP_MULTICITY = {
  id: 'uuid-multicity', slug: 'cdmx-oaxaca', user_id: 'user-abc',
  destination: 'Mexico City', duration_days: 5, travelers: 'pareja', is_shared: false,
  trip_data: {
    title: 'CDMX y Oaxaca', subtitle: '',
    segments: [
      { destination: 'Mexico City', startDate: '2026-04-12', endDate: '2026-04-14', nights: 2 },
      { destination: 'Oaxaca',      startDate: '2026-04-14', endDate: '2026-04-17', nights: 3 },
    ],
    days: [ /* 5 days, items per day */ ],
    accommodations: [
      { id: 'acc-0', city: 'Mexico City', checkInDate: '2026-04-12', checkOutDate: '2026-04-14', nights: 2, priceTier: 'mid' },
      { id: 'acc-1', city: 'Oaxaca',      checkInDate: '2026-04-14', checkOutDate: '2026-04-17', nights: 3, priceTier: 'mid' },
    ],
    budgetRows: [], packing: [], doneChecks: [],
  },
  trip_progress: { annotations: {}, packedItems: [] },
};

// Trip with no structured accommodations (overnight) — exercises the fallback hotel
export const TRIP_NO_ACCOMMODATIONS = (() => {
  const t = structuredClone(TRIP_OWNER); t.id = 'uuid-noacc'; t.trip_data.accommodations = []; return t;
})();
```

---

## 1 — Unit tests

> **Scope note for the QA Lead:** the genuinely pure/unit-testable logic lives in `lib/planner/` and already has a suite (`tests/progress.test.ts`, run with `npx tsx`). The **today-detection** and **per-person budget** logic currently live **inline in `MobileTripClient.tsx`** and are *not* separately exported — they're covered by E2E below. If you want them as true unit tests (recommended), file a small refactor to extract `getTodayDayIndex()` and `parsePeopleCount()` into `lib/planner/`; the cases below are written assuming that extraction.

### 1.1 `lib/planner/progress.ts` — already implemented (`tests/progress.test.ts`)
| ID | Test | Type |
|----|------|------|
| U-01 | `sanitizeAnnotation` keeps trimmed note + valid https link | Auto ✅ |
| U-02 | `sanitizeAnnotation` drops `javascript:`/`data:` links (XSS guard), keeps note | Auto ✅ |
| U-03 | `sanitizeAnnotation` returns null when note empty & no link | Auto ✅ |
| U-04 | `normalizeTripProgress` dedupes/filters `packedItems`, drops bad indices | Auto ✅ |
| U-05 | `normalizeTripProgress` drops malformed annotations, caps note at 500 chars | Auto ✅ |

### 1.2 `lib/planner/checks.ts` — derived task list (`tests/progress.test.ts`)
| ID | Test | Type |
|----|------|------|
| U-06 | `deriveChecksFromDays` emits `check-<itemId>` (day-tagged) for tour/restaurant | Auto ✅ |
| U-07 | `free` items emit no check | Auto ✅ |
| U-08 | Multi-day trip injects `pretrip-book-hotel` + Listos pre-trip checks | Auto ✅ |
| U-09 | Multi-city injects one `pretrip-book-hotel-seg-N` per segment | Auto (add) |
| U-10 | Single-day trip injects **no** pre-trip checks | Auto (add) |

### 1.3 Today detection — *requires extraction* (`getTodayDayIndex(startISO, durationDays, now)`)
| ID | Test | Type |
|----|------|------|
| U-11 | Returns 0 when today == start | Auto* |
| U-12 | Returns 1 when today == start + 1 day | Auto* |
| U-13 | Clamps to 0 before the trip starts | Auto* |
| U-14 | Clamps to last day after the trip ends | Auto* |
| U-15 | No off-by-one across timezones (parse as local midnight) | Auto* |

### 1.4 Per-person budget — *requires extraction* (`parsePeopleCount(travelers)`)
| ID | Test | Type |
|----|------|------|
| U-16 | `'pareja'`/`'couple'`/`'2'` → 2 | Auto* |
| U-17 | `'familia'`/`'family'` → 4; `'solo'`/`'1'` → 1 | Auto* |
| U-18 | Unrecognized / empty → default 2 (never 0 → **no divide-by-zero**) | Auto* |

### 1.5 `isOwner` resolution (server route logic)
| ID | Test | Type |
|----|------|------|
| U-19 | `isOwner = true` when session user == `trip.user_id` | Auto |
| U-20 | `isOwner = false` when user mismatches | Auto |
| U-21 | `isOwner = false` for anonymous trip (`user_id = null`) — but `canEdit = true` | Auto |
| U-22 | `isOwner = false` when no session | Auto |

### 1.6 `lib/planner/progress.ts` — `coerceCurrency` (`tests/progress.test.ts`)
| ID | Test | Type |
|----|------|------|
| U-23 | `coerceCurrency` keeps `'MXN'` / `'USD'` unchanged | Auto ✅ |
| U-24 | `coerceCurrency` returns null for anything else (`'usd'`, `'EUR'`, `''`, null, number, object) → endpoint ignores it, no 400 | Auto ✅ |

---

## 2 — Integration tests (API)

### 2.1 `PATCH /api/trips/{trip_id}/companion`
**Body:** `{ progress?, doneChecks?, budgetActuals?, budgetUserEsts? }` (send only what changed).

| ID | Test | Expected |
|----|------|----------|
| I-01 | `progress.annotations['item-2'] = { note, link }` persists to **`trip_progress`** | 200; column updated |
| I-02 | `progress.packedItems = [0,2]` persists to `trip_progress` | 200 |
| I-03 | `doneChecks: ['check-item-2']` writes to **`trip_data.doneChecks`** | 200 |
| I-04 | `budgetActuals: { b1: 1180 }` sets `trip_data.budgetRows[b1].actual` | 200 |
| I-05 | `budgetUserEsts: { b1: 1200 }` sets `trip_data.budgetRows[b1].userEst` | 200 |
| I-06 | Write **preserves** all other `trip_data` fields (days/packing/etc.) — read-modify-write | unchanged fields intact |
| I-07 | `trip_progress` is **not** clobbered by a `doneChecks`-only call, and vice-versa | both columns independent |
| I-08 | Anonymous trip (`user_id = null`) → write succeeds **without** auth | 200 |
| I-09 | Owned trip, wrong/absent user → **403** | `{ error: 'forbidden' }` |
| I-10 | Unknown `trip_id` → **404** (`trip_not_found`) | 404 |
| I-11 | Empty body / no recognized fields → **400** (`invalid_payload`) | 400 |
| I-12 | Negative or non-numeric budget value → **coerced to `null`** (NOT 400) | 200; value null |
| I-13 | `packedItems` out-of-range / non-integer entries → **silently dropped** (NOT 400) | 200; filtered |
| I-14 | Note > 500 chars → **truncated**; bad link scheme → **dropped** | 200; sanitized |
| I-15 | Unknown annotation key (item id not in itinerary) → **stored as-is** (no validation/404) | 200 |

### 2.2 `PATCH /api/trips/{trip_id}/booking-confirm` (reused by the hotel card)
**Body:** `{ accommodationId, booking: { confirmed, code, checkinTime, notes, bookingUrl? } }`

| ID | Test | Expected |
|----|------|----------|
| I-16 | Valid `code` merges `booking` into `trip_data.accommodations[idx]` | 200 |
| I-17 | Missing `code` → **400** (`invalid_payload`) | 400 |
| I-18 | `bookingUrl` with `javascript:`/non-http scheme → **stripped** | 200; no bookingUrl |
| I-19 | `accommodationId = 'acc-fallback-…'` (synthesized hotel) → **appended** (resolveAccommodationIndex) | 200 |
| I-20 | Anonymous trip → succeeds without auth; owned wrong-user → 403 | 200 / 403 |

### 2.3 Route access (server component → redirect, not JSON)
| ID | Test | Expected |
|----|------|----------|
| I-21 | Owner opens own trip | renders; `isOwner=true` |
| I-22 | Anyone opens **anonymous** trip (`user_id=null`) | renders; `isAnonTrip=true` |
| I-23 | Anyone opens **shared** trip (`is_shared=true`) | renders; read-only if logged-in non-owner |
| I-24 | Logged-in **non-owner** opens a **private** trip | **redirect to `/{locale}` home** |
| I-25 | Unknown `trip_id` | **redirect to `/{locale}` home** (no 404 page) |
| I-26 | Companion pages carry `robots: noindex` | meta present |

### 2.4 Mobile auto-redirect (`app/[locale]/planner/page.tsx`)
| ID | Test | Expected |
|----|------|----------|
| I-27 | Mobile UA → `/{locale}/planner?trip_id=X` | **redirect** to `/{locale}/trips/X` |
| I-28 | Mobile UA → `/{locale}/planner?trip_id=X&full=1` | **no redirect** (full planner loads) |
| I-29 | Desktop UA → `/{locale}/planner?trip_id=X` | no redirect |
| I-30 | Mobile UA → `/{locale}/planner` (no trip_id, creating) | no redirect |

### 2.5 Currency persistence — `PATCH /api/trips/{trip_id}/companion`
Currency is one trip-wide setting **shared with the desktop planner**. The desktop reads the top-level **`currency` column** on hydrate; the mobile view reads **`trip_data.currency`**. The endpoint writes **both together** so they can never drift. **Auto: not implemented** (no API integration harness yet — `seedTrip` is unwired). **Manually verified live on 2026-06-08** (owner login + real trip `a0ff75bc…`): flip→USD set both copies to `USD`, restore→MXN set both to `MXN`; a trip that began with `column=MXN, trip_data.currency=undefined` ended up in sync.
| ID | Test | Expected | Status |
|----|------|----------|--------|
| I-31 | `currency: 'USD'` writes the top-level **`currency` column** | 200; column = `'USD'` | Manual ✅ / Auto ⬜ |
| I-32 | `currency: 'USD'` mirrors into **`trip_data.currency`** via read-modify-write (other trip_data fields preserved) | 200; both copies `'USD'`, days/budgetRows intact | Manual ✅ / Auto ⬜ |
| I-33 | Invalid currency (`'EUR'`, `'usd'`, number) → **ignored, not 400**; any other fields in the body still save | 200; currency untouched | Auto ✅ (unit U-24) + Manual |
| I-34 | Currency-only body (no progress/doneChecks/budget) → still a valid write | 200; both copies updated | Manual ✅ / Auto ⬜ |
| I-35 | Column and `trip_data.currency` are **always written together** (never one without the other) → web + mobile always agree | both equal after any write | Manual ✅ / Auto ⬜ |

---

## 3 — E2E (Playwright)

**Viewport:** 390×844 (iPhone 14) unless marked Desktop. **Also run WebKit** (Safari engine) for the load + links specs.

### 3.1 Load & route — `e2e/mobile-view/load.spec.ts`
| ID | Test | Viewport |
|----|------|----------|
| E-01 | Trip title shows in the trip subheader | Mobile |
| E-02 | Itinerario tab active by default | Mobile |
| E-03 | The "today" day pill is highlighted (within trip dates) | Mobile |
| E-04 | Unknown `trip_id` → lands on the locale **home page** (redirect) | Mobile |
| E-05 | Renders on WebKit without layout breaks | Mobile |
| E-06 | Renders on Chromium desktop viewport (responsive, single column) | Desktop |

### 3.2 Day selector — `days.spec.ts`
| ID | Test |
|----|------|
| E-07 | Tapping Día 3 shows Day 3 hero title |
| E-08 | Day pill counter shows correct `done/total` for that day's checks |
| E-09 | Counter increments after checking a per-day task |
| E-10 | Switching day scrolls content to top |
| E-11 | Active pill has distinct visual state |
| E-12 | "Today" dot appears only on the current-day pill (and only if today ∈ trip) |
| E-13 | Day selector visible on Itinerario, **hidden** on Presupuesto/Preparativos |

### 3.3 Activities + booking drawer — `activities.spec.ts`
| ID | Test |
|----|------|
| E-14 | Tapping an activity expands it; tapping again collapses |
| E-15 | Restaurant shows **"Reservar mesa →"**; tour shows **"Reservar tour →"**; transfer shows **"Reservar traslado →"** |
| E-16 | `free` item shows **no** Reservar button |
| E-17 | Tapping "Reservar …" opens the **bottom-sheet drawer** with provider options |
| E-18 | Drawer option tap opens the provider URL in a **new tab** (not Booking.com hijack) and closes the drawer |
| E-19 | Confirm-done button toggles done state and **ticks the matching task** in the day list |
| E-20 | Note textarea + Link input are editable; single **Guardar** persists both |
| E-21 | Save shows a "Guardado ✓" toast; values persist after reload (owner) |
| E-22 | Read-only viewer (logged-in non-owner of shared trip): **no** note/link/confirm controls; Reservar drawer still available |

### 3.4 Hotel card — `hotel.spec.ts`
| ID | Test |
|----|------|
| E-23 | Unconfirmed hotel shows **"Reservar para este viaje →"** (prominent) + **"¿Ya reservaste? Agregar confirmación →"** |
| E-24 | "Reservar…" opens the Stay22 link in a new tab (verify URL host, not Booking.com hijack) |
| E-25 | "Agregar confirmación" opens the inline form (code required, check-in, note, URL) |
| E-26 | Submitting the form flips the card to **"✓ Reservado"** with code + check-in; persists after reload |
| E-27 | Confirmed card shows **Editar** (reopens form) and **Ver en Booking** (if URL saved) |
| E-28 | Trip with **no accommodations** still shows the hotel card + Reservar CTA (fallback) |
| E-29 | **Multi-city:** day in segment 1 shows the CDMX hotel; switching to a segment-2 day shows the **Oaxaca** hotel |

### 3.5 Presupuesto — `budget.spec.ts`
| ID | Test |
|----|------|
| E-30 | Three totals: IA estimó / Tu estimado / Confirmado |
| E-31 | "Total" active by default; "Por persona" divides totals by parsed traveler count (rounded int) |
| E-32 | Each row has **two** editable inputs: **Tu** (userEst) and **Real** (actual) |
| E-33 | Editing "Real" updates the Confirmado total + category subtotal |
| E-34 | Editing "Tu" updates the Tu estimado total; both persist after reload (owner) |
| E-35 | Read-only viewer sees values as text, no inputs |
| E-36 | Site footer visible at the bottom |

### 3.6 Preparativos — `prep.spec.ts`
| ID | Test |
|----|------|
| E-37 | Tab labeled **"Preparativos"**; shows **"Antes de salir"** section + **"Qué llevar"** section |
| E-38 | "Antes de salir" lists pre-trip checks (Reservar hotel, Empacar maleta, Confirmar pasaporte…) |
| E-39 | Checking a pre-trip item persists and updates the header progress bar |
| E-40 | Packing items render; tapping toggles packed; counter `X/Y empacado` updates |
| E-41 | Packing/pre-trip state persists after reload (owner) |
| E-42 | Empty packing list → packing section omitted (no crash, no empty-state text) |

### 3.7 Progress + toolbar — `header.spec.ts`
| ID | Test |
|----|------|
| E-43 | Header shows a prominent progress bar with "Progreso del viaje", `NN%`, and `done/total` |
| E-44 | Progress counts per-day + pre-trip checks + packing |
| E-45 | Owner sees **Guardado** status + **Compartir** + **PDF** |
| E-46 | Non-owner sees **Compartir** + **PDF** (no Guardado) |
| E-47 | **Compartir** (owner) opens the share-link modal |
| E-48 | **PDF** opens a new tab at `/{locale}/planner?...&full=1&print=1` and the print dialog appears [partly MANUAL] |

### 3.8 Auth states — `auth.spec.ts`
| ID | Test |
|----|------|
| E-49 | Anonymous: site header shows "Inicia sesión"; logged-in: avatar |
| E-50 | Anonymous: bottom **login nudge** visible; dismiss with × ; stays dismissed across day switches (session) |
| E-51 | Nudge copy **rotates** on day switch |
| E-52 | Nudge "Inicia sesión" on Itinerario **scrolls to** the newsletter capture; on other tabs triggers login |
| E-53 | Anonymous: **newsletter card** at end of Itinerario; valid email → inline confirmation; invalid → error toast |
| E-54 | Logged-in: newsletter card + nudge **not** shown |
| E-55 | Owner: **"Editar plan →"** in subheader → navigates to full planner (`?...&full=1`, no redirect loop) |
| E-56 | Non-owner: **"Planea el tuyo →"** → main planner |

### 3.9 Entry point + analytics — `entry-and-analytics.spec.ts`
| ID | Test | Viewport |
|----|------|----------|
| E-57 | Desktop plan result header has **"📱 Vista móvil"**; click opens the mobile route (new tab) | Desktop |
| E-58 | `mobile_view_opened` fires on load with `trip_id`, `is_owner`, `day_index` | Mobile |
| E-59 | `mobile_view_day_switched` on pill tap | Mobile |
| E-60 | `mobile_view_tab_switched` with `tab` ∈ `itin`/`budget`/**`packing`** (Preparativos id = `packing`) | Mobile |
| E-61 | `mobile_view_activity_expanded` on expand | Mobile |
| E-62 | `mobile_view_note_saved` with `has_note`/`has_link` flags | Mobile |
| E-63 | `mobile_view_task_completed` with `task_id` on check | Mobile |
| E-64 | `mobile_view_newsletter_captured` on valid email submit | Mobile |
| E-65 | Booking drawer option tap fires `affiliate_clicked` (GA) + `AffiliateClicked` (Meta) | Mobile |

### 3.10 UX-fix regressions (2026-06-08 batch) — across specs
Behaviors added/fixed this batch. **Playwright stubs: not yet written** (suite still gated on `seedTrip`/`loginAs`). All were **manually verified live on 2026-06-08** via a throwaway fixture page + a real owner-login run at iPhone 14 viewport.
| ID | Test | Status |
|----|------|--------|
| E-66 | Activity confirm-done button shows a **distinct filled state** (solid green + ✓ checkbox) when done vs light/outlined when not; toggling also ticks the matching day task (counter +1) | Manual ✅ / Auto ⬜ |
| E-67 | Saving a note/link **collapses the activity row** and shows a 📝/🔗 **indicator** on the collapsed row; "Guardado ✓" toast appears | Manual ✅ / Auto ⬜ |
| E-68 | Budget shows **"Montos en {MXN\|USD} · sin conversión"** + a MXN/USD toggle; flipping **relabels only — totals unchanged** (no conversion) | Manual ✅ / Auto ⬜ |
| E-69 | Preparativos **"Antes de salir"** and **"Qué llevar"** sections **collapse/expand** via their headers (chevron) | Manual ✅ / Auto ⬜ |
| E-70 | Currency choice **persists across reload**: anonymous → localStorage, owner → DB (round-trip confirmed) | Manual ✅ / Auto ⬜ |
| E-71 | Currency set on mobile is the **same value desktop reads** (both `currency` column and `trip_data.currency` updated) | Manual ✅ / Auto ⬜ |

---

## 4 — Manual [MANUAL]

| ID | Test | Device | Notes |
|----|------|--------|-------|
| M-01 | Sticky tabs + day pills stay pinned under the fixed nav while the subheader scrolls away | iPhone Safari | sticky offsets at 100/139px |
| M-02 | Day selector scrolls horizontally on a 5+ day trip; active pill reachable | iPhone Safari | no clipping |
| M-03 | Note textarea doesn't cause page jump when iOS keyboard opens | iPhone Safari | |
| M-04 | Link input shows URL keyboard; "Real"/"Tu" inputs show numeric keyboard | iPhone + Android | |
| M-05 | Booking drawer bottom-sheet is tap-dismissible and not clipped on iPhone SE | iPhone SE | smallest |
| M-06 | **PDF**: new tab opens the desktop planner and the print/share-to-PDF sheet appears; output is the desktop layout | iPhone + Android | core of the PDF gap fix |
| M-07 | Newsletter submit reaches Mailchimp | Real device | |
| M-08 | Links (Reservar, Ver en Booking, drawer options, Editar plan) open the **intended** URL — none silently go to Booking.com | iPhone Safari + Android | Stay22 regression guard |
| M-09 | Smooth scrolling, no jank, on a low-end Android | Android | Presupuesto especially |
| M-10 | Spanish + English copy correct, no truncation | Any | both locales |
| M-11 | Confirmed hotel with a long code renders without overflow | iPhone 14 | |
| M-12 | All three tabs reachable without horizontal scroll | iPhone SE | |
| M-13 | Multi-city: switching across days shows the correct city's hotel + correct booking-drawer city | iPhone | core of multi-city fix |
| M-14 | Back button after "Editar plan →" returns to the mobile view | iPhone Safari | |

---

## 5 — Edge cases

| ID | Test | Type | Notes |
|----|------|------|-------|
| X-01 | 1-day trip → no day pills, single day, **no pre-trip checks** | Auto | |
| X-02 | 10-day trip → day pills scroll | Auto+Manual | |
| X-03 | No packing (`packing: []`) → packing section omitted | Auto | no empty-state copy by design |
| X-04 | No budget rows (`budgetRows: []`) → totals show 0 / "—", no crash | Auto | |
| X-05 | All checks + packing done → progress 100% | Auto | |
| X-06 | No checks & no packing → progress 0%, no divide-by-zero | Auto | |
| X-07 | 80+ char trip title doesn't break the subheader | Manual | truncates |
| X-08 | Item with no `time` renders without an empty time column gap | Auto | |
| X-09 | Confirmation code with special chars (`BK/483#A`) renders fine | Auto | |
| X-10 | Link field with non-URL value → Save still works; open button toasts/warns | Auto | |
| X-11 | Anonymous edits survive reload via **localStorage** (no DB write) | Auto | `lagomplan_companion_<id>` |
| X-12 | Trip with no derivable start date → defaults to Day 1, no "today" dot | Auto | |

---

## 6 — Regression (existing planner)

| ID | Test | Type |
|----|------|------|
| R-01 | Full plan result page still loads | Auto (existing) |
| R-02 | Desktop header still has Guardado · Compartir · PDF (+ new **Vista móvil**) | Auto |
| R-03 | "Vista móvil" addition doesn't shift existing header actions | Manual |
| R-04 | Stay22 hotel CTA on the planner still fires `plannerHotelClicked` | Auto (existing) |
| R-05 | Existing shareable plan URL (`/trips/share/[shareId]`) still resolves | Auto (existing) |
| R-06 | Desktop PDF export still works; **new**: `?print=1` auto-fires print once rendered | Manual |
| R-07 | `deriveChecksFromDays` extraction didn't change desktop checklist behavior | Auto (`tests/booking`, `classify-block`, `progress`) |
| R-08 | `supabase db push` is clean (migration history normalized) | Manual / CI |

---

## Summary

| Layer | Cases | Auto | Manual | Notes |
|-------|-------|------|--------|-------|
| Unit | 24 | 24 | 0 | U-01..U-10 in `progress.test.ts`; U-11..U-18 in `mobile-view.test.ts`; U-23..U-24 (`coerceCurrency`) |
| Integration | 35 | 30 | 5 | I-31..I-35 (currency) manually verified live, not yet automated (`seedTrip` unwired) |
| E2E | 71 | 64 | 7 | E-48 part-manual; E-66..E-71 (2026-06-08 batch) manually verified, stubs pending |
| Manual | 14 | 0 | 14 | |
| Edge | 12 | 10 | 2 | |
| Regression | 8 | 6 | 2 | |
| **Total** | **164** | **134** | **30** | |

> **Automation status (2026-06-08):** the only *currently-running* automated suites are the framework-free unit tests under `tests/` (`progress` 22/22, `mobile-view` 17/17, `booking`, `classify-block`) — run with `npx tsx`. Every "Auto" mark in the Integration/E2E layers is *intended* automation; those suites are still `test.fixme` stubs gated on `seedTrip`/`loginAs`. The 2026-06-08 currency + UX-fix batch was verified by **live runtime observation** (Playwright drive + direct DB assertions), not by committed automated tests.

**Removed from the original draft (no longer valid):** slug-based routing, 404 page, trip "expiry" (no such concept), `days[i].items[j].userNote` storage, stored `checks[]` array, per-concern PATCH endpoints (save/tasks/packing/budget), "transfer has no action button", "hotel note textarea on confirmed card", budget-validation-returns-400.
