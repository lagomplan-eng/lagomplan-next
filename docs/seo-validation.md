# SEO validation (canonical / hreflang / og:url)

`tests/seo-validate.mjs` checks the **rendered HTML** of a running production
build, so it catches what unit tests can't (metadata inheritance between
layout and page, redirects, the sitemap actually served).

## Run

```bash
npx next build
npx next start -p 3200 &        # production server, not `next dev`
node tests/seo-validate.mjs http://localhost:3200
# optional: also validate a real shared trip, rendered
node tests/seo-validate.mjs http://localhost:3200 --share=/es/trips/share/<shareId>
kill %1
```

Prints one row per URL (`OK` / `FAIL` / `n/a`) and exits non-zero if anything
failed. `n/a` means the route doesn't exist on the current branch (e.g. `/demo`)
or no `--share` link was given.

## What it asserts

- Sample: `/es`, `/en`, Roma (`roma`/`rome`), Mauricio (`mauricio`/`mauritius`),
  Kioto, Oaxaca, guides index, smart-finds familias/families.
  Each has exactly one canonical equal to its own `https://www.lagomplan.com…`
  URL, hreflang es/en → 200, reciprocal, same page in the other language,
  x-default = es, `og:url` = canonical.
- Wrong-locale and alias slugs 301 to the real slug.
- `trips/share` (with `--share`) and `/demo/*`: noindex, no canonical to home.
- `/guia/[partner]` robots are per-partner (`Partner.noindex`) — not forced.
- Whole sitemap: every `<loc>` is 200, self-canonical, unique, and carries
  es/en/x-default alternates including itself.

`tests/seo-slugs-sitemap.test.ts` (`npx tsx …`) covers the slug/sitemap logic
without a server.
