/**
 * lib/hotels.ts
 * Extracts and normalises hotel data from the guides-data.ts dataset.
 *
 * Hotels live inside guides (structuredData.hotels). This utility traverses
 * all guides, deduplicates by hotel ID, and enriches each hotel with the
 * cover image and bilingual destination from the richer guides.ts dataset.
 *
 * Usage:
 *   const hotels = getAllHotelsFromGuides('es')
 */

import { guides as rawGuides } from './guides-data'
import { getAllGuides }        from './guides'
import { getGuideUrl }         from './routes'
import type { Locale }         from '../i18n'

// ── Slug bridge ────────────────────────────────────────────────────────────────
// guides-data.ts uses different slug conventions from guides.ts.
// This map connects them so we can look up cover_img + bilingual destination.

const SLUG_MAP: Record<string, string> = {
  'cancun-family-value-edition':               'cancun-guia-familiar',
  'ciudad-de-mexico-arte-mesa':                'ciudad-de-mexico-guia-de-parejas',
  'guadalajara-foodies-adventure':             'guadalajara-guia-de-amigos',
  'los-cabos-relax-spa-edition':               'los-cabos-relax-entre-amigas',
  'merida-selva-aventura-familiar':            'merida-familia-aventurera',
  'oaxaca-tradicion-en-familia':               'oaxaca-guia-esencial',
  'queretaro-amigos-estilo':                   'queretaro-guia-de-amigos',
  'cuernavaca-refugio-de-primavera-estilo':    'cuernavaca-refugio-de-primavera-estilo',
  'puerto-vallarta-romance-relax':             'puerto-vallarta-guia-romantica',
  'riviera-maya-roadtrip-de-semana-santa':     'riviera-maya-roadtrip-de-semana-santa',
  'valle-de-bravo-avandaro-aventura-en-familia':'valle-de-bravo-avandaro-aventura-en-familia',
  'san-miguel-de-allende-parejas-terrazas':    'san-miguel-de-allende-viaje-de-parejas',
  'tepoztlan-romantic-edition':                'tepoztlan-escapada-en-pareja',
  'tulum-solo-social-edition':                 'tulum-guia-viaje-solo',
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type HotelListing = {
  id:          string
  name:        string
  priceLevel:  '$' | '$$' | '$$$'
  description: string
  tags:        string[]          // highlight pills from raw data
  sourceGuide: string            // slug in guides-data.ts
  destination: string            // localised city/state label
  cover_img:   string            // borrowed from source guide
  guideUrl:    string            // link to the parent guide detail page
  bookingUrl?: string            // direct booking link (affiliate URL)
}

// ── Utility ────────────────────────────────────────────────────────────────────

/**
 * Returns every hotel found across all guides, deduplicated by id.
 * Enriched with cover image and localised destination from guides.ts.
 */
export function getAllHotelsFromGuides(locale: Locale): HotelListing[] {
  // Build a lookup: slug_es → rich Guide (with cover_img, destination, slugs)
  const richGuides    = getAllGuides(locale)
  const guideBySlugEs = new Map(richGuides.map(g => [g.slug_es, g]))

  const seen   = new Set<string>()
  const hotels: HotelListing[] = []

  for (const guide of rawGuides) {
    const richSlugEs = SLUG_MAP[guide.slug] ?? guide.slug
    const richGuide  = guideBySlugEs.get(richSlugEs)

    for (const hotel of guide.structuredData.hotels) {
      if (seen.has(hotel.id)) continue
      seen.add(hotel.id)

      // Destination: prefer bilingual guides.ts value; fall back to raw title
      const destination = richGuide
        ? (locale === 'es' ? richGuide.destination_es : richGuide.destination_en)
        : guide.content.title.replace('LagomPlan — ', '').split(' (')[0]

      hotels.push({
        id:          hotel.id,
        name:        hotel.name,
        priceLevel:  hotel.priceLevel,
        description: hotel.description,
        tags:        hotel.tags.filter(Boolean),
        sourceGuide: guide.slug,
        destination,
        cover_img:   richGuide?.cover_img ?? '/images/guides/riviera-maya.jpg',
        guideUrl:    richGuide ? getGuideUrl(locale, richGuide) : '#',
      })
    }
  }

  return hotels
}
