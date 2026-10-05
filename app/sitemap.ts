/**
 * app/sitemap.ts
 *
 * Next.js App Router File-based Metadata: served at /sitemap.xml.
 *
 * Architecture: single sitemap, dynamically composed from three sources:
 *
 *   1. Static routes that exist for both locales (home, planner,
 *      pricing, guides index, hotels index, worldcup index, about,
 *      contact, privacy, terms). Pulled from `ROUTE_MAP` in lib/routes.ts.
 *
 *   2. Guide detail pages, enumerated via:
 *        - getNewGuideParams()  — V2 guide system (lib/data/guides)
 *        - getAllGuideParams()  — legacy guide system (lib/guides)
 *
 *   3. World Cup city detail pages — hardcoded list mirrors `CITY_MAP`
 *      in app/[locale]/worldcup/[slug]/page.tsx (16 confirmed host cities).
 *
 * Every URL (es and en) is its OWN <url> entry, and each entry carries the
 * full alternates set (es, en, x-default) including itself, as Google's
 * hreflang spec requires (reciprocal, self-referencing). x-default = ES.
 * Guide URLs use the per-locale public slug (roma/rome, mauricio/mauritius);
 * legacy alias slugs are 301'd by middleware and never listed here.
 *
 * Excluded by design (per the SEO audit):
 *   - my-trips / cuenta / account — authenticated dashboards
 *   - signup / login              — functional, not content
 *   - /trips/share/[shareId]      — private share URLs
 *   - destinations/[slug] / hotels/[slug] / smart-finds/[slug]
 *     — these dynamic routes exist but have no `generateStaticParams`,
 *       so the slug surface isn't enumerable today; revisit when those
 *       entity systems ship structured content. Smart Finds today has
 *       one real static-segment kit page (familias / families) — that
 *       single URL is included explicitly below.
 *
 * Future migration: when entity counts exceed ~5,000 we'll split into a
 * sitemap index (sitemap-static.xml, sitemap-guides.xml, etc.) per
 * Google's 50,000-URL-per-file guidance. Single file is correct now.
 */

import type { MetadataRoute } from 'next'
import { BASE_URL } from '../lib/seo'
import { ROUTE_MAP, type RouteKey } from '../lib/routes'
import { getNewGuideParams, getGuideLocales, resolveCanonicalSlug, getPublicGuideSlug } from '../lib/data/guides/index'
import { getAllGuides } from '../lib/guides'
import type { Locale } from '../i18n'

// Static routes that should appear in the sitemap, in source order.
// Excluded RouteKeys: account, signup, login, myTrips (private/functional).
const SITEMAP_ROUTES: RouteKey[] = [
  'home',
  'planner',
  'pricing',
  'guidesIndex',
  'hotelsIndex',
  'worldcupIndex',
  'about',
  'contact',
  'privacy',
  'terms',
]

// World Cup city slugs — must stay in sync with CITY_MAP in
// app/[locale]/worldcup/[slug]/page.tsx. Both locales share the same
// slug set (the route is locale-prefixed but the slug isn't translated).
const WORLDCUP_CITY_SLUGS = [
  'cdmx', 'gdl', 'mty',                    // Mexico
  'la',  'mia', 'nyc', 'dal', 'sf',
  'hou', 'sea', 'kc',  'atl', 'phi', 'bos', // USA
  'tor', 'van',                             // Canada
] as const

/** `/es/<segment>` or `/es` for the empty (home) segment. */
function localizedPath(locale: Locale, key: RouteKey): string {
  const segment = ROUTE_MAP[key][locale]
  return segment ? `/${locale}/${segment}` : `/${locale}`
}

/**
 * Emit one sitemap entry per locale URL, each with the complete alternates
 * set. Order: es, en.
 */
function pairEntries(
  esPath: string,
  enPath: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
  lastModified = new Date(),
): MetadataRoute.Sitemap {
  const esUrl = `${BASE_URL}${esPath}`
  const enUrl = `${BASE_URL}${enPath}`
  const alternates = { languages: { es: esUrl, en: enUrl, 'x-default': esUrl } }
  return [esUrl, enUrl].map(url => ({
    url,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: { ...alternates.languages } },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // 1. Static routes
  for (const key of SITEMAP_ROUTES) {
    entries.push(...pairEntries(
      localizedPath('es', key), localizedPath('en', key),
      'weekly', key === 'home' ? 1.0 : 0.7,
    ))
  }

  // 2. Guides — registry keys, each with its per-locale public slug.
  const registryKeys = new Set(
    getNewGuideParams().filter(p => p.locale === 'es').map(p => resolveCanonicalSlug(p.slug)),
  )
  for (const key of registryKeys) {
    // Guard: a guide missing a locale gets no entry for it and no hreflang
    // to it — never invent a URL.
    if (!getGuideLocales(key).includes('es') || !getGuideLocales(key).includes('en')) continue
    entries.push(...pairEntries(
      `/es/guias/${getPublicGuideSlug(key, 'es')}`,
      `/en/guides/${getPublicGuideSlug(key, 'en')}`,
      'monthly', 0.6,
    ))
  }

  // 3. Legacy-only guides (no V2 registry entry): their own slug_es/slug_en.
  for (const g of getAllGuides('es')) {
    if (getGuideLocales(resolveCanonicalSlug(g.slug_es)).length > 0) continue
    entries.push(...pairEntries(`/es/guias/${g.slug_es}`, `/en/guides/${g.slug_en}`, 'monthly', 0.6))
  }

  // 4. World Cup city detail pages — same slug across locales.
  for (const slug of WORLDCUP_CITY_SLUGS) {
    entries.push(...pairEntries(`/es/mundial/${slug}`, `/en/worldcup/${slug}`, 'weekly', 0.7))
  }

  // 5. Smart Finds — only the Familias kit has a real static segment.
  //    EN segment is 'families' (i18n.ts pathnames), not 'familias'.
  entries.push(...pairEntries('/es/smart-finds/familias', '/en/smart-finds/families', 'monthly', 0.6))

  return entries
}
