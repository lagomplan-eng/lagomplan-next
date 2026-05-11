/**
 * lib/seo.ts
 *
 * Metadata helpers for canonical URLs, hreflang alternates, and Open Graph.
 * All functions return objects compatible with Next.js Metadata['alternates'].
 *
 * URL structure: https://lagomplan.com/{locale}/{localizedSegment}/{slug?}
 *
 * Moved here from i18n.ts (which only carries routing config now).
 */

import type { Metadata }     from 'next'
import type { Locale }       from '../i18n'
import { getRoute, getGuideUrl, getDestinationUrl, getHotelUrl, getSmartFindUrl }
  from './routes'
import type { LocalizedEntity, RouteKey } from './routes'

/**
 * Production canonical host. Must include `www` because that's the host
 * Vercel serves and the host the SSL cert covers; without `www`, every
 * canonical and hreflang would point to a host Google sees as a separate
 * site, splitting authority. Also re-exported so app/sitemap.ts and
 * app/robots.ts use the same source of truth.
 */
export const BASE_URL = 'https://www.lagomplan.com'

// ── Canonical ─────────────────────────────────────────────

/**
 * Returns the canonical URL for a page.
 * Spanish is canonical (first in hreflang, passed to <link rel="canonical">).
 *
 * buildCanonical('es', 'planner')   → 'https://lagomplan.com/es/planificador'
 * buildCanonical('en', 'planner')   → 'https://lagomplan.com/en/planner'
 */
export function buildCanonical(locale: Locale, routeKey: RouteKey): string {
  return `${BASE_URL}${getRoute(locale, routeKey)}`
}

// ── Alternates for static pages (no entity slug) ──────────

/**
 * Generates hreflang alternates for any non-entity page.
 *
 * buildAlternates('planner') → {
 *   languages: {
 *     'es': 'https://lagomplan.com/es/planificador',
 *     'en': 'https://lagomplan.com/en/planner',
 *     'x-default': 'https://lagomplan.com/es/planificador',
 *   }
 * }
 */
export function buildAlternates(routeKey: RouteKey): NonNullable<Metadata['alternates']> {
  return {
    canonical: `${BASE_URL}${getRoute('es', routeKey)}`,
    languages: {
      'es':        `${BASE_URL}${getRoute('es', routeKey)}`,
      'en':        `${BASE_URL}${getRoute('en', routeKey)}`,
      'x-default': `${BASE_URL}${getRoute('es', routeKey)}`,
    },
  }
}

// ── Alternates for entity detail pages ─────────────────────

/**
 * Generates hreflang alternates for a guide detail page.
 * Handles different slugs per locale.
 *
 * buildGuideAlternates(guide) → {
 *   languages: {
 *     'es': 'https://lagomplan.com/es/guias/valle-de-bravo',
 *     'en': 'https://lagomplan.com/en/guides/valley-of-bravo',
 *     'x-default': 'https://lagomplan.com/es/guias/valle-de-bravo',
 *   }
 * }
 */
export function buildGuideAlternates(entity: LocalizedEntity): NonNullable<Metadata['alternates']> {
  const esUrl = `${BASE_URL}${getGuideUrl('es', entity)}`
  const enUrl = `${BASE_URL}${getGuideUrl('en', entity)}`
  return {
    canonical: esUrl,
    languages: { 'es': esUrl, 'en': enUrl, 'x-default': esUrl },
  }
}

export function buildDestinationAlternates(entity: LocalizedEntity): NonNullable<Metadata['alternates']> {
  const esUrl = `${BASE_URL}${getDestinationUrl('es', entity)}`
  const enUrl = `${BASE_URL}${getDestinationUrl('en', entity)}`
  return {
    canonical: esUrl,
    languages: { 'es': esUrl, 'en': enUrl, 'x-default': esUrl },
  }
}

export function buildHotelAlternates(entity: LocalizedEntity): NonNullable<Metadata['alternates']> {
  const esUrl = `${BASE_URL}${getHotelUrl('es', entity)}`
  const enUrl = `${BASE_URL}${getHotelUrl('en', entity)}`
  return {
    canonical: esUrl,
    languages: { 'es': esUrl, 'en': enUrl, 'x-default': esUrl },
  }
}

export function buildSmartFindAlternates(entity: LocalizedEntity): NonNullable<Metadata['alternates']> {
  const esUrl = `${BASE_URL}${getSmartFindUrl('es', entity)}`
  const enUrl = `${BASE_URL}${getSmartFindUrl('en', entity)}`
  return {
    canonical: esUrl,
    languages: { 'es': esUrl, 'en': enUrl, 'x-default': esUrl },
  }
}

// ── Base Open Graph config ────────────────────────────────

export function buildOpenGraph(
  locale: Locale,
  overrides?: Partial<NonNullable<Metadata['openGraph']>>,
): NonNullable<Metadata['openGraph']> {
  return {
    siteName: 'Lagomplan',
    locale:   locale === 'es' ? 'es_MX' : 'en_US',
    type:     'website',
    ...overrides,
  }
}

// ── Robots metadata for private / functional pages ────────
//
// Use `noIndex` on pages that should never appear in Google's index:
// auth flows (signup/login), authenticated dashboards (my-trips, account),
// and personal share URLs (/trips/share/[shareId]).
//
// Even with robots.txt disallowing the same paths, this adds defense in
// depth — robots.txt only stops crawling; if Google discovers a URL via
// backlinks, it can still index a "blocked" URL with no snippet. The
// noindex meta tag prevents that case entirely.

/**
 * Returns a Metadata.robots block that tells Google + Bing to neither
 * index nor follow links from this page.
 */
export const NO_INDEX: NonNullable<Metadata['robots']> = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
}

// ── JSON-LD structured data ───────────────────────────────
//
// Renders into a <script type="application/ld+json"> tag. Keep schemas
// minimal and accurate — Google penalises over-claimed structured data
// (e.g. inflated review counts) more than missing markup.

/**
 * Organization schema for the homepage. Establishes the Lagomplan brand
 * entity in the Knowledge Graph and links the site to its social
 * profiles. Without this, "Lagomplan" remains an unrecognised string in
 * Google's eyes regardless of how many backlinks the site earns.
 */
export const ORGANIZATION_SCHEMA = {
  '@context':     'https://schema.org',
  '@type':        'Organization',
  name:           'Lagomplan',
  url:            BASE_URL,
  logo:           `${BASE_URL}/images/logo.png`,
  sameAs: [
    'https://www.instagram.com/lagomplantravel/',
    'https://www.facebook.com/profile.php?id=61582151266836',
    'https://www.linkedin.com/company/lagomplan/',
  ],
} as const

/**
 * WebSite schema. Eligible for the Google sitelinks searchbox when the
 * site grows enough to qualify; cheap to include now. The locale
 * defaults to ES because Spanish is the canonical language per
 * `buildAlternates`.
 */
export const WEBSITE_SCHEMA = {
  '@context':      'https://schema.org',
  '@type':         'WebSite',
  name:            'Lagomplan',
  url:             BASE_URL,
  inLanguage:      ['es-MX', 'en-US'],
  publisher:       { '@id': `${BASE_URL}#organization` },
} as const
