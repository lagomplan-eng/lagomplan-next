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
 * Each entry emits BOTH locales' URLs (es + en) and an `alternates.languages`
 * map so Google reads the hreflang alternates directly from the sitemap
 * (in addition to the <link rel="alternate"> tags in the HTML).
 *
 * Excluded by design (per the SEO audit):
 *   - my-trips / cuenta / account — authenticated dashboards
 *   - signup / login              — functional, not content
 *   - /trips/share/[shareId]      — private share URLs
 *   - destinations/[slug] / hotels/[slug] / smart-finds/[slug]
 *     — these routes exist but have no `generateStaticParams`, so the
 *       slug surface isn't enumerable today; revisit when those entity
 *       systems ship structured content.
 *
 * Future migration: when entity counts exceed ~5,000 we'll split into a
 * sitemap index (sitemap-static.xml, sitemap-guides.xml, etc.) per
 * Google's 50,000-URL-per-file guidance. Single file is correct now.
 */

import type { MetadataRoute } from 'next'
import { BASE_URL } from '../lib/seo'
import { ROUTE_MAP, type RouteKey } from '../lib/routes'
import { getNewGuideParams } from '../lib/data/guides/index'
import { getAllGuideParams } from '../lib/guides'
import type { Locale } from '../i18n'

const LOCALES: Locale[] = ['es', 'en']

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

/**
 * Build the segment of a route on the current locale.
 * Mirrors `getRoute` in lib/routes.ts but without the BASE_URL prefix
 * so we can compose alternates uniformly.
 */
function localizedPath(locale: Locale, key: RouteKey): string {
  const segment = ROUTE_MAP[key][locale]
  return segment ? `/${locale}/${segment}` : `/${locale}`
}

/**
 * Build a sitemap entry for a static route, with both locales as
 * hreflang alternates. Spanish is x-default to match the canonical
 * convention used elsewhere in the codebase.
 */
function staticEntry(key: RouteKey, lastModified = new Date()): MetadataRoute.Sitemap[number] {
  const esUrl = `${BASE_URL}${localizedPath('es', key)}`
  const enUrl = `${BASE_URL}${localizedPath('en', key)}`
  return {
    url:          esUrl,
    lastModified,
    changeFrequency: 'weekly',
    priority:        key === 'home' ? 1.0 : 0.7,
    alternates: {
      languages: { es: esUrl, en: enUrl, 'x-default': esUrl },
    },
  }
}

/**
 * Build paired sitemap entries for an entity that has different
 * slugs per locale (currently only guides do — worldcup uses the
 * same slug for both locales).
 */
function entityEntry(
  segmentEs: string,
  segmentEn: string,
  slugEs:    string,
  slugEn:    string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
  priority:        number = 0.6,
): MetadataRoute.Sitemap[number] {
  const esUrl = `${BASE_URL}/es/${segmentEs}/${slugEs}`
  const enUrl = `${BASE_URL}/en/${segmentEn}/${slugEn}`
  return {
    url:          esUrl,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: { es: esUrl, en: enUrl, 'x-default': esUrl },
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // 1. Static routes (one entry per route, with hreflang)
  for (const key of SITEMAP_ROUTES) {
    entries.push(staticEntry(key))
  }

  // 2. Guides — V2 system pairs ES/EN slugs by canonical slug.
  //    The ES version is what `getNewGuideParams` lists for `locale: 'es'`;
  //    the EN version uses the same slug today (per resolveCanonicalSlug
  //    in lib/data/guides/index.ts). When EN-localized slugs land,
  //    refactor here to pair via the canonical slug map.
  const v2Slugs = new Set(
    getNewGuideParams()
      .filter(p => p.locale === 'es')
      .map(p => p.slug),
  )
  for (const slug of v2Slugs) {
    entries.push(entityEntry('guias', 'guides', slug, slug))
  }

  // 3. Legacy guides — same slug across locales.
  //    Filter out anything already emitted by the V2 path so we don't
  //    duplicate URLs (and dilute Google's understanding of canonical).
  const legacyEsSlugs = new Set(
    getAllGuideParams()
      .filter(p => p.locale === 'es')
      .map(p => p.slug),
  )
  for (const slug of legacyEsSlugs) {
    if (v2Slugs.has(slug)) continue
    entries.push(entityEntry('guias', 'guides', slug, slug))
  }

  // 4. World Cup city detail pages — same slug across locales.
  //    These are core long-tail traffic for Mundial 2026.
  for (const slug of WORLDCUP_CITY_SLUGS) {
    entries.push(entityEntry('mundial', 'worldcup', slug, slug, 'weekly', 0.7))
  }

  return entries
}
