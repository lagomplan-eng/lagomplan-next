# Trip Planner — Features, Flows & Test Coverage

**Goal:** the desktop planner (web) and the mobile companion view stay **consistent in
data, consistent in content, complete, and working** — and regressions can't ship
silently.

**How to use:** this is a living tracker. When you add a test, flip the cell. When you
ship a feature, add its row. Statuses are grounded in the repo as of **2026-06-10**.

**Status legend** — 🟢 unit tests · 🟡 partial (helpers only) · 🔴 none · ⬜ e2e stubbed (`test.fixme`)

---

## 1. Test landscape (what runs today)

| Kind | Where | Count | Runs in CI? |
|---|---|---|---|
| **Unit** (framework-free `tsx`, run via `npx tsx tests/<f>.ts`, exit 0/1) | `tests/*.ts` | 6 files, ~116 assertions | ❌ no |
| **Integration / API-route** | — | **0** | — |
| **E2E** (Playwright) | `e2e/mobile-view/*.spec.ts` | 9 files, **68 cases — all `test.fixme`** | ❌ no |
| **CI** | `.github/workflows/` | only Supabase-deploy + reconcile cron | — |

### Unit test files (what each covers)
| File | Module | ~Assertions | Notes |
|---|---|---|---|
| `booking.test.ts` | `lib/planner/booking` | 30 | `sanitizeBookingUrl` (XSS scheme allowlist), `resolveAccommodationIndex` |
| `progress.test.ts` | `lib/planner/progress` + `checks` | 31 | `normalizeTripProgress`, `sanitizeAnnotation`, `coerceCurrency`, **`resolveTripCurrency`**, `deriveChecksFromDays` |
| `itinerary-edit.test.ts` | `lib/planner/itinerary-edit` | 26 | mobile inline-edit sanitizer — preserves id/unmodeled fields, clamps, caps |
| `mobile-view.test.ts` | `lib/planner/mobile-view` | 18 | today-day selection, `parsePeopleCount`, per-person math |
| `newsletter.test.ts` | `lib/newsletter` | 17 | email validation, Mailchimp config |
| `classify-block.test.ts` | `lib/planner/classify-block` | 6 | block/milestone categorizer |

> **Reality:** unit coverage is real but only on **pure helpers** (`lib/planner/*`,
> `lib/newsletter`). No route, no flow, no end-to-end path is covered, and **nothing
> runs on a PR**.

---

## 2. Feature × coverage × risk

### Generation (web only — mobile never generates)
| Feature | Surface | Coverage | Risk |
|---|---|---|---|
| AI trip generation (form → itinerary) | Web | 🔴 | **High** — core path; route + validation gate untested |
| Multi-city generation (day→city mapping) | Web | 🔴 | High |
| Async / long-trip jobs (chunk, poll, rescue) | Web | 🔴 | High |
| Error typing + retries (529 / transient) | Web | 🔴 | Med — source of June-2 regressions |
| Milestone categorizer | Web | 🟡 `classify-block` | Low |

### Planner editing & persistence
| Feature | Surface | Coverage | Risk |
|---|---|---|---|
| Inline edit (days/items/budget/packing) | Web | 🔴 | Med |
| **Autosave — wholesale `trip_data` overwrite** | Web | 🔴 | **Highest** — one dropped field = silent data loss; no guard |
| Mobile inline editing — persistence/sanitizer | Mobile | 🟢 `itinerary-edit` | Low |
| Mobile inline editing — UI flow | Mobile | ⬜ stubbed | Med — never run on a real trip |
| Version history / restore | Web | 🔴 | Med |
| Regenerate (prefs drawer) | Web | 🔴 | Med |

### Data parity (web ↔ mobile) — the core goal
| Feature | Surface | Coverage | Risk |
|---|---|---|---|
| Currency parity (top-level vs trip_data) | Both | 🟢 `resolveTripCurrency` | Low (unit) — **end-to-end untested** |
| `trip_progress` contract (notes/packed) | Mobile | 🟢 `progress` | Low |
| Done-checks derivation | Both | 🟢 `deriveChecksFromDays` | Low |
| **Field-set parity** (desktop bundle ⊇ mobile writes) | Both | 🔴 | **High** — how currency broke; no test keeps the bundles in sync |
| Booking-confirm merge (RMW) | Both | 🟡 helpers only | Med — route untested |

### Budget / currency
| Feature | Surface | Coverage | Risk |
|---|---|---|---|
| Today-day + per-person math | Mobile | 🟢 `mobile-view` | Low |
| coerceCurrency / relabel (no conversion) | Both | 🟢 `progress` | Low |
| Budget totals (ai / user / actual priority) | Both | 🔴 | Med |

### Access, sharing, affiliate, payments
| Feature | Surface | Coverage | Risk |
|---|---|---|---|
| Owner / anon / shared access gate | Both | 🔴 | **High** — security-sensitive |
| Share link / claim-on-signup | Both | 🔴 | High — 2 silent-fail regressions in May |
| Stay22 link build + LetMeAllez guard | Both | 🔴 (verified ad-hoc only) | **High** — revenue; guard has no committed test |
| Entitlements / credits / paywall / checkout / webhook | Web | 🔴 | **High** — money |
| Newsletter subscribe (7 surfaces) | Both | 🟢 `newsletter` | Low |
| Consent / analytics gating | Both | 🔴 | Med |

---

## 3. Key user flows & their coverage

| Flow | Steps | Coverage |
|---|---|---|
| **Generate → edit → reload (web)** | form → AI → inline edit → autosave → reopen | 🔴 none |
| **Anon generate → save-wall → signup → claim** | the conversion funnel | 🔴 none (e2e T-PW-02 stubbed) |
| **Web → mobile round-trip (parity)** | edit on web → open mobile → data matches | 🔴 none — *the goal flow* |
| **Mobile edit → web reload (parity)** | edit day/activity/currency on mobile → desktop preserves | 🟡 sanitizer + currency unit-tested; flow untested |
| **Book a hotel ("Ya reservé") on either surface** | reserve → confirm → shows on both | 🟡 helpers only |
| **Affiliate click lands correctly (not hijacked)** | click → Stay22 → provider, attribution intact | 🔴 (ad-hoc Playwright only — see `stay22-attribution-validation.md`) |
| **Pay → webhook grants credits** | checkout → Stripe → entitlement | 🔴 none |
| **Long trip generates without truncation** | >10 days → async chunks → full plan | 🔴 none |

---

## 4. Top risks (prioritized)

1. **No CI runs any test** — regressions merge freely (proven twice this week: the env-inlining bug + the June-2 batch). *Highest leverage to fix.*
2. **Wholesale-overwrite + field parity untested** — the core "consistent data" goal has no automated guard. Currency already broke this way.
3. **Zero integration/route tests** — the whole persistence + auth + payments layer is hand-verified only.
4. **All e2e stubbed** — no end-to-end proof any flow works on either surface.
5. **Generation, payments, sharing, affiliate** — highest-value/most-complex paths, ~no coverage.
6. **Build-time-only failures invisible to dev** — e.g. NEXT_PUBLIC inlining ([[project-next-public-env-inlining]]); only `next build` catches them. CI must build, not just `tsx`.

---

## 5. Prioritized test roadmap

- [ ] **#1 — CI gating.** GitHub Action on every PR: run all `tests/*.ts` (unit) + `tsc --noEmit` + `next build`. Block merge on failure. *(Was the June-3 priority; never landed.)*
- [ ] **#2 — Web↔mobile parity contract test.** Extract the desktop autosave `trip_data` bundle into a pure function; assert it includes every field mobile reads/writes. Directly serves "consistent data."
- [ ] **#3 — Integration tests for the 4 persistence routes** (`trips PATCH`, `companion`, `booking-confirm`, `claim`): RMW preserves untouched fields; auth gates hold; wholesale overwrite includes all fields.
- [ ] **#4 — Un-stub mobile-view e2e** (68 cases) + a desktop generate→edit→reload happy path + the web↔mobile round-trip.
- [ ] **#5 — Affiliate + Stay22 guard committed e2e** (promote the ad-hoc validation to a real test).
- [ ] **#6 — Payments path** (checkout session shape, webhook idempotency) — at least unit/integration on the pure parts.

---

*Generated 2026-06-10. Pair with `docs/product/trip-planner-product-spec.md` (the requirement-by-requirement spec) and `docs/qa/mobile-view-test-cases.md` (the 164 manual cases).*
