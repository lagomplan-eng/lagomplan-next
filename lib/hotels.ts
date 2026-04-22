/**
 * lib/hotels.ts
 * Extracts and normalises hotel data for the Hotels index page.
 *
 * Data sources:
 *   - lib/guides.ts       → slug_es, slug_en, cover_img, destination_*  (URL + metadata)
 *   - lib/data/guides     → hotel name, description, priceTier, affiliateUrl (bookingUrl)
 *
 * Hotels are deduplicated by generated id (guide-slug--hotel-name-slug).
 */

import { getAllGuides }    from './guides'
import { getGuidePageData } from './data/guides'
import type { Locale }    from '../i18n'

// ── Types ──────────────────────────────────────────────────────────────────────

export type HotelListing = {
  id:          string
  name:        string
  priceLevel:  '$' | '$$' | '$$$'
  description: string
  tags:        string[]
  sourceGuide: string
  destination: string
  cover_img:   string
  guideUrl:    string
  bookingUrl?: string
}

// ── Utility ────────────────────────────────────────────────────────────────────

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Returns every hotel found across all guides, deduplicated by id.
 *
 * guideUrl  → always a valid /${locale}/(guias|guides)/${slug} path
 * bookingUrl → affiliate URL from the guide data layer; absent if not set
 */
export function getAllHotelsFromGuides(locale: Locale): HotelListing[] {
  const guides    = getAllGuides(locale)
  const routeSeg  = locale === 'es' ? 'guias' : 'guides'
  const seen      = new Set<string>()
  const hotels:   HotelListing[] = []

  for (const guide of guides) {
    // Use ES locale for hotel data — hotel names/descriptions are guide-sourced,
    // not translated per locale. EN guide data simply has the same hotels.
    const guideData = getGuidePageData(guide.slug_es, 'es')
    if (!guideData) continue

    const guideSlug   = locale === 'es' ? guide.slug_es : guide.slug_en
    const guideUrl    = `/${locale}/${routeSeg}/${guideSlug}`
    const destination = locale === 'es' ? guide.destination_es : guide.destination_en

    for (const hotel of guideData.hotels.items) {
      const id = `${guide.slug_es}--${toSlug(hotel.name)}`
      if (seen.has(id)) continue
      seen.add(id)

      hotels.push({
        id,
        name:        hotel.name,
        priceLevel:  hotel.priceTier,
        description: hotel.description,
        tags:        [hotel.type, hotel.highlight].filter(Boolean),
        sourceGuide: guide.slug_es,
        destination,
        cover_img:   guide.cover_img,
        guideUrl,
        bookingUrl:  hotel.bookingUrl || undefined,
      })
    }
  }

  return hotels
}
