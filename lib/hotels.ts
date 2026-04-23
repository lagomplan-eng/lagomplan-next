/**
 * lib/hotels.ts
 * Builds the Hotels index from the curated FlatGuide dataset
 * (lib/data/guides), which is the only source that carries the
 * affiliate booking URL for each hotel.
 *
 * The older guides-data.ts source has hotel records too, but it does NOT
 * contain affiliate URLs — that's why "Ver disponibilidad" fell through to
 * '#' on the Hotels index before this file was rewired.
 *
 * Enrichment comes from lib/guides.ts (rich guides with cover_img +
 * bilingual destination + canonical URL).
 *
 * Usage:
 *   const hotels = getAllHotelsFromGuides('es')
 */

import { getAllGuides }                        from './guides'
import { getGuideUrl }                         from './routes'
import { getAllFlatGuides, resolveCanonicalSlug } from './data/guides'
import type { Locale }                         from '../i18n'

// ── Types ──────────────────────────────────────────────────────────────────────

export type HotelListing = {
  id:          string
  name:        string
  priceLevel:  '$' | '$$' | '$$$'
  description: string
  tags:        string[]          // highlight pills from raw data
  sourceGuide: string            // canonical guide key (e.g. 'cancun')
  destination: string            // localised city/state label
  cover_img:   string            // borrowed from rich guide
  guideUrl:    string            // link to the parent guide detail page
  bookingUrl?: string            // direct booking link (affiliate URL)
}

// ── Utility ────────────────────────────────────────────────────────────────────

function slugifyHotelName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')  // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Returns every hotel from the curated FlatGuide dataset for the given locale,
 * deduplicated by (canonical guide, hotel name), enriched with cover image,
 * destination label, and guide URL from lib/guides.ts.
 *
 * `bookingUrl` is populated from each hotel's `affiliateUrl` so the Hotels
 * index cards can link straight to the booking provider.
 */
export function getAllHotelsFromGuides(locale: Locale): HotelListing[] {
  // Build a lookup from canonical slug (e.g. 'oaxaca') → rich Guide so we can
  // reuse the bilingual destination label, cover image, and canonical URL.
  const richGuides = getAllGuides(locale)
  const richByCanonical = new Map<string, typeof richGuides[number]>()
  for (const g of richGuides) {
    const canonical = resolveCanonicalSlug(g.slug_es)
    richByCanonical.set(canonical, g)
  }

  const seen   = new Set<string>()
  const hotels: HotelListing[] = []

  for (const { canonical, flat } of getAllFlatGuides(locale)) {
    const richGuide = richByCanonical.get(canonical)
    const destination = richGuide
      ? (locale === 'es' ? richGuide.destination_es : richGuide.destination_en)
      : flat.hero.title

    for (const h of flat.hotels) {
      const id = `${canonical}-${slugifyHotelName(h.name)}`
      if (seen.has(id)) continue
      seen.add(id)

      hotels.push({
        id,
        name:        h.name,
        priceLevel:  h.priceTier,
        description: h.description,
        tags:        h.tag ? [h.tag] : [],
        sourceGuide: canonical,
        destination,
        cover_img:   richGuide?.cover_img ?? flat.hero.image,
        guideUrl:    richGuide ? getGuideUrl(locale, richGuide) : '#',
        bookingUrl:  h.affiliateUrl || undefined,
      })
    }
  }

  return hotels
}
