# Changelog

Human-readable record of what shipped and why. Newest at top. Updated at the end of each substantive session.

For exhaustive detail on any change, follow the commit hash — full rationale lives in commit messages.

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
