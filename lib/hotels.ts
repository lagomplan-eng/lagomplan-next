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
import { getAllCityGuides, getCityHeroImage }  from './worldcup/data'
import type { Locale }                         from '../i18n'

// ── Types ──────────────────────────────────────────────────────────────────────

export type HotelListing = {
  id:          string
  name:        string
  priceLevel:  '$' | '$$' | '$$$' | '$$$$'
  description: string
  tags:        string[]          // highlight pills from raw data
  sourceGuide: string            // canonical guide key (e.g. 'cancun', 'cdmx')
  source:      'guide' | 'worldcup'  // which corpus the record came from
  destination: string            // localised city/state label
  cover_img:   string            // borrowed from rich guide or worldcup city hero
  guideUrl:    string            // link to the parent guide / city page
  bookingUrl?: string            // direct booking link (affiliate URL)
  archetypes?: string[]          // traveler archetypes (Familias, Parejas, …)
}

// ── Archetype filter config ───────────────────────────────────────────────────
// One source of truth for the Hotels-page archetype filter row. Active filters
// drive the actual filtering logic. `comingSoon` filters render in the UI as
// disabled `próx.` pills — clicking shows a toast instead of filtering.

export type ArchetypeId =
  | 'Todos'
  | 'Familias'
  | 'Parejas'
  | 'Pet Friendly'
  | 'LGBTQ+ Friendly'

export interface ArchetypeFilter {
  id:         ArchetypeId
  /** localised label */
  labelES:    string
  labelEN:    string
  icon:       string
  active:     boolean       // false = render in row but don't filter
  comingSoon: boolean
}

export const ARCHETYPE_FILTERS: ArchetypeFilter[] = [
  { id: 'Todos',           labelES: 'Todos',          labelEN: 'All',              icon: '',    active: true,  comingSoon: false },
  { id: 'Familias',        labelES: 'Con niños',      labelEN: 'With kids',        icon: '👨‍👩‍👧', active: true,  comingSoon: false },
  { id: 'Parejas',         labelES: 'Parejas',        labelEN: 'Couples',          icon: '💑',  active: true,  comingSoon: false },
  { id: 'Pet Friendly',    labelES: 'Pet Friendly',   labelEN: 'Pet Friendly',     icon: '🐾',  active: false, comingSoon: true  },
  { id: 'LGBTQ+ Friendly', labelES: 'LGBTQ+ Friendly', labelEN: 'LGBTQ+ Friendly', icon: '🏳️‍🌈', active: false, comingSoon: true  },
]

// Price filter buckets — same trick: locale-aware label, single source.
export interface PriceFilter {
  id:      '$' | '$$' | '$$$'
  labelES: string
  labelEN: string
}

export const PRICE_FILTERS: PriceFilter[] = [
  { id: '$',   labelES: 'Económico',  labelEN: 'Budget'    },
  { id: '$$',  labelES: 'Intermedio', labelEN: 'Mid-range' },
  { id: '$$$', labelES: 'Lujo',       labelEN: 'Luxury'    },
]

// ── Filter helpers ────────────────────────────────────────────────────────────

export function matchesArchetype(hotel: HotelListing, archetype: ArchetypeId): boolean {
  if (archetype === 'Todos') return true
  return !!hotel.archetypes?.includes(archetype)
}

export function matchesPrice(hotel: HotelListing, price: '$' | '$$' | '$$$' | null): boolean {
  if (!price) return true
  // $$$ catches both $$$ and $$$$ ranges (luxury bucket).
  if (price === '$$$') return hotel.priceLevel === '$$$' || hotel.priceLevel === '$$$$'
  return hotel.priceLevel === price
}

export function matchesSearch(hotel: HotelListing, search: string): boolean {
  if (!search) return true
  const q = search.toLowerCase().trim()
  return (
    hotel.name.toLowerCase().includes(q) ||
    hotel.destination.toLowerCase().includes(q) ||
    hotel.sourceGuide.toLowerCase().includes(q)
  )
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
        source:      'guide',
        destination,
        cover_img:   richGuide?.cover_img ?? flat.hero.image,
        guideUrl:    richGuide ? getGuideUrl(locale, richGuide) : '#',
        bookingUrl:  h.affiliateUrl || undefined,
        archetypes:  h.archetypes,
      })
    }
  }

  return hotels
}

/**
 * Returns every stay from the worldcup city guides as a HotelListing. Each
 * stay's affiliate URL comes from `stay.url` (Stay22 / Booking links the
 * editorial team curated). Cover image falls back to the city's hero
 * illustration in `/public/images/WC images/` since stays don't carry
 * per-hotel imagery.
 */
export function getAllHotelsFromWorldcup(locale: Locale): HotelListing[] {
  const out: HotelListing[] = []
  const seen = new Set<string>()
  const mundialSegment = locale === 'es' ? 'mundial' : 'worldcup'

  for (const [cityId, city] of getAllCityGuides(locale)) {
    const hero = getCityHeroImage(cityId) ?? ''
    const cityUrl = `/${locale}/${mundialSegment}/${cityId}`
    for (const stay of city.stays ?? []) {
      const id = `wc-${cityId}-${slugifyHotelName(stay.name)}`
      if (seen.has(id)) continue
      seen.add(id)

      // Worldcup `price` is one of '$' / '$$' / '$$$' / '$$$$'. Normalize to
      // the HotelListing union (which now allows $$$$). Anything else falls
      // back to '$$'.
      const rawPrice = stay.price?.trim() as HotelListing['priceLevel']
      const priceLevel: HotelListing['priceLevel'] =
        rawPrice === '$' || rawPrice === '$$' || rawPrice === '$$$' || rawPrice === '$$$$'
          ? rawPrice
          : '$$'

      out.push({
        id,
        name:        stay.name,
        priceLevel,
        description: stay.note,
        tags:        Array.isArray(stay.tags) ? stay.tags.slice(0, 3) : [],
        sourceGuide: cityId,
        source:      'worldcup',
        destination: city.city,
        cover_img:   hero,
        guideUrl:    cityUrl,
        bookingUrl:  stay.url || stay.hotel_link || undefined,
        archetypes:  stay.archetypes,
      })
    }
  }

  return out
}

/**
 * Combined hotel feed for the Hotels index page. Pulls from the curated
 * guides corpus + the worldcup city guides corpus and returns them as a
 * single deduped list. The two corpora are the only sources of truth —
 * no hallucinated or synthesized records.
 */
export function getAllHotels(locale: Locale): HotelListing[] {
  return [
    ...getAllHotelsFromGuides(locale),
    ...getAllHotelsFromWorldcup(locale),
  ]
}
