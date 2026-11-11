/**
 * lib/experiences/jsonld.ts
 *
 * Structured data for /experiencias · /experiences: a BreadcrumbList and an
 * ItemList of the experiences, in editorial order. Each list item points at its
 * own place in OUR guide (the page that describes it), never at GetYourGuide.
 *
 * Deliberately NOT emitted: Product, Offer, AggregateRating, Review. We show no
 * price and no rating, and markup for content the page does not display is a
 * Search Console violation.
 */

import { BASE_URL } from '../seo'
import { getRoute } from '../routes'
import type { Locale } from '../../i18n'
import type { Experience } from './types'

export function buildExperiencesJsonLd(
  locale: Locale,
  experiences: Experience[],
  labels: { home: string; hub: string; listName: string },
) {
  const hubUrl = `${BASE_URL}${getRoute(locale, 'experiencesIndex')}`
  const guidesBase = `${BASE_URL}${getRoute(locale, 'guidesIndex')}`

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: labels.home, item: `${BASE_URL}/${locale}` },
        { '@type': 'ListItem', position: 2, name: labels.hub, item: hubUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: labels.listName,
      numberOfItems: experiences.length,
      itemListElement: experiences.map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: e.name,
        url: `${guidesBase}/${e.guideSlug}#${e.guideAnchor}`,
      })),
    },
  ]
}

/** JSON for a <script type="application/ld+json">: "<" is escaped so no text can close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
