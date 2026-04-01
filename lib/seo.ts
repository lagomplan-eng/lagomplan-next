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

const BASE_URL = 'https://lagomplan.com'

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
