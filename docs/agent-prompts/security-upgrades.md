# Agent prompt — Security upgrades cycle

Paste the prompt below into a fresh Claude Code session when you have ~3 hours focused for a dependency security upgrade pass. Self-contained — the future agent re-establishes context from the prompt alone.

## Why this exists

As of 2026-05-26, `npm audit` reports 15 vulnerabilities across the dependency tree, including 1 critical (Next.js) and 6 high-severity issues. Most are real-world concerns: auth bypass, cache poisoning, SSRF, open redirect. `npm audit fix --force` would auto-bump Next.js, next-intl, and @supabase/ssr to versions flagged as breaking changes — running it without testing will explode prod. This needs a deliberate cycle with smoke tests as backup.

## When to ship

- ✅ Ship soon. Next.js critical CVEs include real attack vectors (auth bypass on middleware, cache poisoning of image optimization, SSRF via middleware redirects).
- ⚠️ Not the same session as other major work — this needs full attention and time to run smoke tests post-upgrade.
- 🛑 Don't run `npm audit fix --force` blindly.

## The vulnerable packages, in priority order

| Severity | Package | Current → Target | Breaking? |
|---|---|---|---|
| 🚨 critical | next | 14.x older → 14.2.35 | Yes (within 14.x) |
| ⚠️ moderate | next-intl | older → 4.12.0 | Yes (major bump) |
| ⚠️ moderate | @supabase/ssr | older → 0.10.3 | Yes |
| ⚠️ high | eslint-config-next | older → 16.2.6 | Yes (major bump, ESLint only — dev dep) |
| ⚠️ moderate | postcss | <8.5.10 → latest | Transitive via next |
| ⚠️ moderate | uuid, ws | older → latest | No (safe to npm audit fix) |
| ⚠️ moderate | glob, minimatch | older → latest | Transitive via typescript-eslint |

## What's actually at risk for Lagomplan

- **Next.js auth bypass on middleware** → directly relevant since `middleware.ts` exists for i18n routing
- **Next.js cache poisoning via image optimization** → relevant since `next/image` is used heavily
- **Next.js SSRF via middleware redirects** → relevant if any user-controlled URL hits middleware (unlikely but possible)
- **next-intl open redirect via locale routing** → directly relevant — we use locale params in routing
- **@supabase/ssr cookie OOB chars** → relevant since every auth flow touches Supabase cookies

The middleware + locale issues are the ones most likely to be exploitable in Lagomplan's actual codebase.

---

## The prompt

```
Ship the security upgrades cycle for Lagomplan. Goal: clear all critical
and high CVEs from `npm audit` while not breaking prod.

PREREQUISITES:
  • Working tree clean, on main
  • Ability to run smoke tests post-upgrade (see docs/SMOKE_TESTS.md)
  • ~3 hours focused — this is not a quick task

WHAT'S VULNERABLE (as of 2026-05-26):
  Run `npm audit` to confirm. Expected findings:
    • next.js (critical + multiple high) — auth bypass, cache poisoning,
      SSRF via middleware
    • next-intl (moderate) — open redirect, prototype pollution
    • @supabase/ssr (moderate) — cookie name/path OOB chars
    • postcss, glob, minimatch, uuid, ws (various) — transitive

EXECUTION PLAN:

Phase 1 — Safe non-breaking fixes (~10 min)
  npm audit fix
  This handles `uuid` and `ws` only. Should NOT bump anything else.
  Run smoke test §1 (generation core) after — should pass with no changes.
  Commit as separate PR.

Phase 2 — Next.js to 14.2.35 (~1 hr)
  In package.json: bump `next` to `14.2.35` (or current 14.x latest if
  newer). Note: `14.2.35` is outside the stated dependency range — this
  IS a meaningful bump within the 14.x major.
  
  Run:
    npm install
    npm run build         (catches build-time issues)
    npx tsc --noEmit      (catches typing changes)
  
  Smoke tests after build is clean:
    §1 — Generation (sync + async + multi-city)
    §2 — Trip lifecycle (claim + share)
    §3 — Consent + privacy (cookie banner, GPC, CCPA)
    §4 — Auth (sign-up, login, locale switch)
    §6 — Engagement signals (first-touch, edits, completeness)
  
  Deploy to preview first, run smoke tests, then merge.

Phase 3 — next-intl to 4.12.0 (~45 min)
  Major-version bump. Read the next-intl 4.x migration guide first.
  Likely API breaks:
    • Server-component locale helpers may have renamed
    • `getMessages` / `getTranslations` signatures
    • Middleware setup
  
  Check every usage:
    grep -rn "next-intl" app/ components/ lib/
  
  Fix any TS errors. Smoke test specifically:
    §7 — Locale parity (run full suite — every page in both ES and EN)
    Verify language toggle still works
    Verify cookie banner copy still in correct locale

Phase 4 — @supabase/ssr to 0.10.3 (~30 min)
  Bump in package.json, run install.
  Likely changes: cookie handling API.
  Check:
    lib/supabase/server.ts
    lib/supabase/client.ts
    Any direct cookies() usage in API routes
  
  Smoke test:
    §2 — Trip lifecycle (every auth-gated path)
    §4 — Auth (login/signup/locale)
    §5 — Stripe (checkout requires cookie roundtrip)

Phase 5 — eslint-config-next to 16.2.6 (~15 min)
  Dev dependency only. Bump. Run `npm run lint`. Fix any new
  lint errors. This may be deferred if the new lint rules are
  noisy — it's a quality concern, not a runtime security one.

VERIFICATION AT END:
  npm audit → all critical + high should be cleared
  npm run build → clean
  npx tsc --noEmit → clean
  Full smoke test pass (§1 - §7)
  Deploy to preview, hand off to QA Lead for sweep

ROLLBACK PLAN:
  Keep each phase as a separate PR. If a phase fails smoke tests,
  revert that PR specifically — don't try to fix forward under
  pressure. The deferred phases can wait.

DO NOT:
  • Run `npm audit fix --force` blindly — it skips reading the
    breaking-change implications
  • Bump everything in one PR — debugging will be impossible
  • Skip smoke tests after any phase — these upgrades are exactly
    what the smoke test discipline was built for
  • Touch any non-dependency code unless required by the upgrade

ASK BEFORE STARTING IF:
  • The Next.js version range in package.json is ambiguous
  • The smoke test doc shows tests that haven't been verified working
    recently — fix those first
```

---

## Related context

- Smoke test catalog: [`docs/SMOKE_TESTS.md`](../SMOKE_TESTS.md) — every test you'll need to run post-upgrade
- Existing patterns to preserve: `middleware.ts` (next-intl routing), `lib/supabase/server.ts` + `client.ts` (auth)
- Vercel deployment is automatic on push-to-main — use preview deploys for verification

## Estimated effort

~3 hours focused work + ~1 hour for the QA Lead smoke test sweep at the end. Plan a half-day for this.
