# Changelog

Human-readable record of what shipped and why. Newest at top. Updated at the end of each substantive session.

For exhaustive detail on any change, follow the commit hash — full rationale lives in commit messages.

---

## 2026-05-26 — Reliability recovery + streaming UI + QA workflow foundation

A heavy day mostly about closing reliability gaps that surfaced from yesterday's Sonnet 4.6 migration. Two latent RLS bugs unrelated to the migration also got fixed via audit. Day ended with the streaming generation UX live and the smoke-tests doc ready for a multi-agent QA workflow.

### Shipped
- **Share + claim routes — admin-client UPDATE** (`fc13a73`, `be28d2d`). Two production-breaking RLS traps fixed: both POST endpoints used the user-scoped Supabase client for UPDATEs that current RLS policies didn't permit. The writes silently succeeded with 0 rows affected — share URLs were generated and handed to clients but never persisted to DB (every recipient bounced to home), and signup-claim of anonymous trips never linked the row to the new user. Now both use admin client + explicit `eq('user_id', user.id)` ownership filters. Audited every write in `app/api/**` — these two were the only outliers, pattern is now consistent.
- **Sonnet 4.6 worker fix — SEGMENT_DAYS 10 → 7 → 5** (`ccfc8e9`, then `52cb528`). Yesterday's migration shipped without adjusting the worker's per-chunk timeout assumptions. 10-day chunks on Sonnet 4.6 take ~200s, blew the 145s worker abort + 150s Supabase Free function cap. First fix dropped to 7 days but real-world variance still pushed past 145s in production. Second iteration to 5 days (~100s/chunk, 45s margin) stabilized it. T1b 15-day async trips now complete in ~6 min reliably. Root-cause lesson logged in the commit: diagnostic script's 3-sample-per-scenario was too few; need ≥10 samples + ≥30% margin over observed mean when tuning timing constants.
- **Title day-count quirk fix** (`21c85d0`). For multi-chunk trips the worker took chunk 0's title verbatim — a 15-day Oaxaca trip displayed "5 Días en Oaxaca: Arte, Sabor y Tradición" because chunk 0 is a 5-day sub-chunk. Worker now patches the leading day count (regex match) while preserving the AI's creative subtitle (": Arte, Sabor y Tradición" stays put). Fallback title + subtitle also locale-aware now (were hardcoded Spanish for EN trips).
- **Streaming trip generation** (`0485116`). Long trips now render progressively: first 5 days appear at ~100s when chunk 1 lands, then 6-10 at ~200s, etc. Worker writes a recomputed `assembleResult()` to a new `partial_result` JSONB column after each chunk; polling endpoint surfaces it; TripResult consumes it and flips `loading=false` while keeping `tripId` null + new `isStreamingPartial` state suppressing autosave/share/regen until the canonical row exists. Visual cue: tiny "Generando más días · N/M" indicator below the day cards in existing typography tokens (no new design pieces). Same Sonnet 4.6, same prompts — pure UX, quality untouched.
- **`docs/SMOKE_TESTS.md`** (`aa58a89`). ~30 tests across 8 sections covering generation, lifecycle, consent, auth, monetization, engagement, locale parity, edge cases. Designed for a multi-agent QA workflow: QA Lead agent owns the file + runs the suite pre-merge; Dev Engineer agent automates highest-impact items as Playwright tests over time. Includes a "Recently discovered" append-only regression log so institutional memory lives in the repo across sessions.
- **8 new international guides shipped** (`8796556` + `e8d39f0`). Catalog grew from 14 → 22 destinations: Atacama (Chile), Cartagena (Colombia), Cusco & Machu Picchu (Peru), Guanacaste (Costa Rica), Guatemala, Norte de Argentina, Rio de Janeiro (Brasil), Uruguay. Each guide ships in both ES + EN with full itinerary, hotels, experiences, tips, dato curioso, checklist, transport. Content extracted faithfully from source `.docx` files via a subagent with anti-hallucination discipline — no fabricated hotels, prices, or activities. Cover images live in the `/guías` menu; detail pages render through `GuidePageClientV2` via the FlatGuide registry. Hero images for the detail-page top remain to be wired (`hero.image` field) — separate small PR. Source `.docx` + `.png` assets committed to `prototypes/original guides/june 2026/` for editorial reference.
- **Agent prompt library at `docs/agent-prompts/`** (`031445b`). Self-contained paste-able prompts for future Claude sessions: `meta-capi.md` (Meta Conversions API mirror, save for when paid ads launch) and `security-upgrades.md` (phased dependency upgrade plan for the 15 npm-audit findings — critical Next.js + next-intl + @supabase/ssr CVEs).

### Decisions
- **Quality over speed.** Picked Option 2 (streaming UI) over Option 4 (hybrid Sonnet+Haiku) when choosing how to handle the slowdown from 4.6 + smaller chunks. Sonnet 4.6 everywhere; perceived speed gained through progressive rendering, not model substitution. Lagomplan's differentiator is editorial quality, not raw gen speed.
- **Stayed on Supabase Free.** $25/mo Pro upgrade would have let us keep 10-day chunks on Sonnet 4.6 (400s function cap). Skipped for now — 5-day chunks + streaming UI gives equivalent user perception. Logged as "do when budget allows" — would also give headroom for future model migrations.
- **Removed Edge Fn internal retry.** Yesterday's migration added a one-shot internal retry on shape validation failure. Doubled execution time, couldn't fit in 150s Supabase Free cap. Now Edge Fn does ONE call, validates, returns 502 with `llm_empty_days` code. Caller (sync route's existing retry-with-retryHint path) handles re-attempts on a fresh invocation with its own 150s budget.

### Operational
- **Sonnet 4.6 stayed on after rollback + re-promotion.** Brief rollback to 4.0 mid-day while fixing the worker; flipped back via `supabase secrets set GENERATE_TRIP_MODEL=claude-sonnet-4-6` once the worker fix deployed.
- **Three Edge Function deploys today** via CLI (worker × 2 for SEGMENT_DAYS + title fix; generate-trip × 1 for migration removal). Confirms CI auto-deploy is still unreliable — every change needs manual `supabase functions deploy`.
- **Memory updated**: `project_async_generation.md` notes the new SEGMENT_DAYS=5 reality + rollback command for `GENERATE_TRIP_MODEL`. Doesn't yet have a "use ≥10 samples when sizing timeouts" memo — worth adding before the next model migration.

### Deferred (still pending)
- **Worker-level retry on chunk shape failures.** Edge Fn now returns clean 502 with `llm_empty_days` on shape failure; worker just propagates as a chunk failure. Mirror sync's retry-with-retryHint behavior in the worker so async trips also get the safety net. Separate PR.
- **Playwright smoke tests.** Manual checklist in `docs/SMOKE_TESTS.md` is the spec. Dev Engineer agent owns turning the top items into automated tests over the next 2-3 weeks.
- **Intelligence Foundation Phase 1A** (kept getting bumped by reliability work). Backend foundation: schema migration + types + `lib/intelligence.ts` engine + AI prompt extension + Edge Fn integration. ~5 hrs focused work, queued for tomorrow.
- **Hero images for the 8 new guides** — listing cards already have cover images via `/images/guides/<slug>.png`. The detail-page hero block (`hero.image` field in each FlatGuide) is still empty, so the detail page renders without a top banner. ~16 small edits, single PR.
- **Security upgrades cycle** — saved as a paste-able prompt at `docs/agent-prompts/security-upgrades.md`. ~3-4 hr focused session; addresses 1 critical (Next.js auth bypass + cache poisoning) and several high CVEs. Should ship before the next big shipping cycle to reduce attack surface.
- **Supabase Pro upgrade** ($25/mo) — would unlock 400s function cap → 10-day or 15-day chunks → faster generation + headroom for next model migration. Worth doing when budget permits.
- **DPAs walkthrough + `processors.md`** — still on the compliance backlog.

---

## 2026-05-25 — Analytics Tier 3 + QA tool + Sonnet 4.6 migration

### Shipped
- **Sonnet 4.0 → 4.6 migration** (`91e98d3`, deployed via `supabase functions deploy generate-trip`). Model now reads from Supabase secret `GENERATE_TRIP_MODEL` (default `claude-sonnet-4-6`). Edge Function validates `tool_use.input` shape and retries once internally with `retryHint=no_days_emitted` if days are empty — the failure mode that reverted the previous attempt (`bcfeea5`). 9/9 diagnostic runs passed before deploy. Polling timeout in TripResult bumped 600s → 900s (4.6 is ~50% slower per chunk).
- **Analytics QA tool** (`80afe37`). Dev-only console event logger. Enable in DevTools: `lagomplanAnalytics.debug.enable()` or `?analytics_debug=1`. Logs every gtag/fbq fire inline with timestamp, consent state, and payload.
- **Analytics Tier 3 — retention + attribution** (`23a81e3`, `18bb533`, `e68d6a7`, `982e009`)
  - First-touch attribution: utm_* / gclid / fbclid / referrer captured to localStorage on first visit, synced as GA user_properties.
  - Cohort user_properties from Supabase: `trip_count`, `days_since_signup`, `last_trip_at` set on auth.
  - `itinerary_edited` events at four edit pathways (add block, edit, remove, add day).
  - Trip completeness: live `current_completeness` user_property + `trip_completeness` event on pagehide.

### Decisions
- **Skipped Looker Studio dashboard build** mid-session — filter UI was fighting; deferred to ~tomorrow once custom dimensions propagate. Custom dimensions list documented in chat for later registration in GA4 Admin.
- **Skipped worker-level retry on shape failures** — Edge Fn internal retry covers it. Separate PR if more layers are wanted later.
- **Skipped Meta CAPI mirror** — only worth shipping when Meta ad spend is within ~30 days. Prompt saved to `docs/agent-prompts/meta-capi.md` (PR `docs/agent-prompts-meta-capi`, awaiting merge) for the future agent session.

### Operational
- **Rollback path** for Sonnet 4.6 if needed: `supabase secrets set GENERATE_TRIP_MODEL=claude-sonnet-4-20250514 --project-ref qvntwqnzvspoisaglgpp`. Propagates in ~30s, no redeploy.
- **Monitoring**: watch GA4 Realtime for `error_occurred` with `surface=planner-generate`. Spike → roll back.
- **Memory note** updated: `~/.claude/projects/.../memory/project_async_generation.md`.

### Deferred (still pending)
- DPAs walkthrough — 5 vendor dashboards (Supabase / Vercel / Anthropic / GA / Meta), ~20 min of clicking.
- `processors.md` doc — vendor inventory file for the repo.
- Looker Studio dashboard build (waiting for custom dimensions to propagate).
- Meta CAPI mirror — when ad spend is imminent (prompt ready).
- Stay22 booking postback — when hotel affiliate volume justifies it.

---

## 2026-05-23 — Analytics Tier 2 (identity + reliability)

### Shipped
- **`login` event + `user_id` identification** (`1535b9d`). New `AuthEventsBridge` client component subscribes to Supabase auth, sets `user_id` on GA + `external_id` on Meta on every auth state change, fires `events.login` on real `SIGNED_IN` transitions (skips `INITIAL_SESSION`). Fixes cross-device attribution.
- **`error_occurred` events** at TripResult catch blocks (`695a961`). Three surfaces: `planner-generate`, `planner-regenerate`, `planner-replace-trip`. Replaces silent console errors with dashboard-visible failure rate.
- **Server-side Purchase via GA4 Measurement Protocol** (`2ed5f99`). Stripe webhook fires `purchase` server-to-server with full session attribution (GA client_id threaded through Stripe metadata at checkout creation). Survives iOS ATT / Safari ITP / ad blockers / closed-tabs that drop 20–40% of browser-side events. Requires `GA_API_SECRET` env var on Vercel (set 2026-05-23).

### Decisions
- Skipped Meta CAPI in this PR — saved for later, prompt drafted.
- Browser-side `events.purchase` kept firing from success page; dedup via `transaction_id = session.id`.

---

## 2026-05-22 — Cookie consent system + GDPR audit log

### Shipped
- **`Configuración de cookies` / `Cookie settings` footer link** (`cddb2ad`). Re-opens the banner for users who want to change consent. GDPR Article 7(3) requires withdrawal to be as easy as granting.
- **Global Privacy Control auto-respect** (`cddb2ad`). Browsers signaling GPC (Brave, DuckDuckGo, Firefox strict, most privacy extensions) never see the banner — auto-recorded as `essential`. CCPA mandates honoring GPC.
- **Cookie inventory table** in `/privacy` §8.1 (`cddb2ad`). Names every cookie/storage key with provider, purpose, duration, category.
- **CCPA "Do Not Sell or Share My Personal Information" footer link** (`face4e4`). On click: persists `consent=essential`, shows inline confirmation, hard-reloads to fully unload Meta Pixel.
- **Server-side consent_log table** (`90505f3`) for GDPR Article 7(1) audit trail. `/api/consent` route, IP hashed with `CONSENT_IP_SALT` pepper, fire-and-forget POST from `setConsent()`. Migration in `supabase/migrations/20260522_consent_log.sql`.
- **Cookie banner UI polish** (`66d5502`, `bfc658d`, `3176644`). Bar at top instead of floating card, pushes nav down via `--cookie-banner-h` CSS var, brand-aligned tokens, no shadow.

### Decisions
- **Migration applied via Supabase Studio SQL editor, not CLI** — `supabase db push` is blocked by pre-existing migration history drift. Memory note added (`feedback_supabase_migrations.md`).
- **Did NOT geo-gate the CCPA link to California** — CCPA wants "clear and conspicuous" and operation is harmless for non-CA users.

### Operational
- `CONSENT_IP_SALT` env var set on Vercel (Production + Preview).
- Privacy policy at `/privacy` references the new cookie inventory section.

---

## 2026-05-21 — EN locale parity + locale-switch modal + initial cookie banner

### Shipped
- **EN locale UI parity** (`b1a3a66`, `b347b94`, `c338fa5`). ~50 hardcoded Spanish strings translated via inline `isES` ternary across TripResult.tsx, DateRangePicker.tsx, pace dropdown labels, "Ajustar preferencias" toggle. Also: redeployed stale `generate-trip` Edge Function — CI auto-deploy had silently failed, prod was running pre-locale-aware code (which is why EN trips were generating in Spanish).
- **Locale-switch confirmation modal** (`ce43fc8`) in Nav. Intercepts ES↔EN toggle when on `/planner` with unsaved gen state (form params in URL, no `trip_id`) — prevents silent credit burn from accidental regeneration.
- **Cookie banner v1 + Google Consent Mode v2 + Meta gating** (`089a143`). All analytics signals default to `denied`; GA loaded but doesn't transmit until explicit accept; Meta Pixel never injected without `consent='all'`.

### Decisions
- **Pace dropdown values stay Spanish** (`Relajado`/`Equilibrado`/`Activo`) — these are canonical keys persisted to the DB and consumed by `PACE_NORMALIZE`, the AI prompt, and autosave. Only the visible label is translated.
- **AI-generated trip content stays frozen in original language** — existing trips don't retroactively translate when locale switches. Only new generations on `/en` use the EN prompt.

### Operational
- Discovered Supabase Edge Function CI auto-deploy is unreliable. Memory note added (`feedback_supabase_migrations.md`) — verify deployed version with `supabase functions list` after every push to `main` that touches Edge Functions.

---

<!-- Add new sessions above this line, newest first. -->
