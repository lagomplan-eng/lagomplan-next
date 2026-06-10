# Lagomplan

[![CI](https://github.com/lagomplan-eng/lagomplan-next/actions/workflows/ci.yml/badge.svg)](https://github.com/lagomplan-eng/lagomplan-next/actions/workflows/ci.yml)

AI trip planner — **Next.js 14** (App Router) + **Supabase** + **Stripe**, deployed on
**Vercel**. Bilingual (es/en): an AI itinerary generator (web planner) plus a read-mostly
**mobile companion** for using the trip on the road.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

Env lives in `.env.local` (Supabase, Stripe, Mailchimp, …). On Vercel, set vars for
**Production AND every Preview** — see `CLAUDE.md` for the env-scope gotchas.

## Test

```bash
# unit (framework-free tsx) — run every suite
for f in tests/*.ts; do npx tsx "$f"; done

npx tsc --noEmit   # typecheck
npm run build      # production build — catches build-only failures (e.g. NEXT_PUBLIC inlining)
```

**CI runs all of the above on every PR** (`.github/workflows/ci.yml`) and blocks merge on
failure, including a guard that `NEXT_PUBLIC_*` vars still inline into the client bundle.

## Docs

| | |
|---|---|
| 🧪 **Master test plan & playbook** | [`docs/qa/MASTER-TEST-PLAN.md`](docs/qa/MASTER-TEST-PLAN.md) |
| 📊 **Test coverage tracker** (matrix) | [`docs/qa/trip-planner-test-coverage.md`](docs/qa/trip-planner-test-coverage.md) |
| 📋 **Roadmap board** (live) | [Issue #74](https://github.com/lagomplan-eng/lagomplan-next/issues/74) |
| 📐 **Product spec** | [`docs/product/trip-planner-product-spec.md`](docs/product/trip-planner-product-spec.md) |
| 📱 **Mobile companion test cases** | [`docs/qa/mobile-view-test-cases.md`](docs/qa/mobile-view-test-cases.md) |
| 🛠 **Engineering conventions** | [`CLAUDE.md`](CLAUDE.md) |
