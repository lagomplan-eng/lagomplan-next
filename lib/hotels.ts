/**
 * lib/hotels.ts
 * Builds the hotel feed (server side; the pure filters, keys and provider logic live in
 * lib/hotels-catalog.ts so client components don't bundle the guide data).
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
import { getAllFlatGuides, getPublicGuideSlug, GUIDE_META, resolveCanonicalSlug } from './data/guides'
import { getAllCityGuides, getCityHeroImage }  from './worldcup/data'
import { normSearch }                          from './catalog-search'
import {
  hotelProviderFromUrl, normalizeTravelers,
  type HotelDestination, type HotelListing, type PriceLevel, type TravelerKey,
} from './hotels-catalog'
import type { Locale }                         from '../i18n'

export * from './hotels-catalog'

const other = (l: Locale): Locale => (l === 'es' ? 'en' : 'es')

/**
 * World Cup city → guide registry key when the destination has a guide (matched by short
 * name), so a city's hotels and its guide share one `?destino=` value and one name.
 */
function destinationForCity(cityId: string, cityName: Record<Locale, string>): { key: string; name: Record<Locale, string> } {
  const target = normSearch(cityName.es)
  for (const [key, meta] of Object.entries(GUIDE_META)) {
    if (normSearch(meta.shortName.es) === target) return { key, name: meta.shortName }
  }
  return { key: `wc-${cityId}`, name: cityName }
}

/**
 * Guides' hotels: id, price, booking link and (Spanish) traveler types come from the same
 * record in both locales; text comes from the requested locale.
 */
export function getAllHotelsFromGuides(locale: Locale): HotelListing[] {
  const richByCanonical = new Map<string, ReturnType<typeof getAllGuides>[number]>()
  for (const g of getAllGuides(locale)) richByCanonical.set(resolveCanonicalSlug(g.slug_es), g)

  const esByKey = new Map(getAllFlatGuides('es').map(g => [g.canonical, g.flat]))
  const altByKey = new Map(getAllFlatGuides(other(locale)).map(g => [g.canonical, g.flat]))
  const out: HotelListing[] = []

  for (const { canonical, flat } of getAllFlatGuides(locale)) {
    const rich = richByCanonical.get(canonical)
    const meta = GUIDE_META[canonical]
    const esFlat = esByKey.get(canonical)
    const cityLabel = rich ? (locale === 'es' ? rich.destination_es : rich.destination_en) : flat.hero.title

    flat.hotels.forEach((h, i) => {
      const es = esFlat?.hotels[i]
      const sameHotel = !!es && normSearch(es.name) === normSearch(h.name)
      // The English files carry fewer traveler labels: when it is the same hotel, merge both.
      const { keys } = normalizeTravelers([...(h.archetypes ?? []), ...(sameHotel ? es!.archetypes ?? [] : [])])
      out.push({
        id:          h.id,
        name:        h.name,
        altName:     altByKey.get(canonical)?.hotels[i]?.name ?? h.name,
        priceLevel:  h.priceTier as PriceLevel,
        description: h.description,
        tags:        h.tag ? [h.tag] : [],
        source:      'guide',
        destinationKey: canonical,
        destination: meta.shortName[locale],
        cityLabel,
        cover_img:   rich?.cover_img ?? flat.hero.image,
        guideUrl:    rich ? getGuideUrl(locale, rich) : '#',
        bookingUrl:  h.affiliateUrl || undefined,
        provider:    hotelProviderFromUrl(h.affiliateUrl),
        travelers:   keys,
      })
    })
  }
  return out
}

export function getAllHotelsFromWorldcup(locale: Locale): HotelListing[] {
  const out: HotelListing[] = []
  const mundialSegment = locale === 'es' ? 'mundial' : 'worldcup'
  const esCities = new Map(getAllCityGuides('es'))
  const altCities = new Map(getAllCityGuides(other(locale)))

  for (const [cityId, city] of getAllCityGuides(locale)) {
    const hero = getCityHeroImage(cityId) ?? ''
    const cityUrl = `/${locale}/${mundialSegment}/${cityId}`
    const esCity = esCities.get(cityId)
    const dest = destinationForCity(cityId, { es: esCity?.city ?? city.city, en: (locale === 'en' ? city.city : altCities.get(cityId)?.city) ?? city.city })

    ;(city.stays ?? []).forEach((stay, i) => {
      const es = esCity?.stays?.[i]
      const sameHotel = !!es && normSearch(es.name) === normSearch(stay.name)
      const alt = altCities.get(cityId)?.stays?.[i]
      const { keys } = normalizeTravelers([...(stay.archetypes ?? []), ...(sameHotel ? es!.archetypes ?? [] : [])])
      // Worldcup `price` is '$'..'$$$$'; anything else falls back to '$$'.
      const raw = stay.price?.trim()
      const priceLevel: PriceLevel = raw === '$' || raw === '$$' || raw === '$$$' || raw === '$$$$' ? raw : '$$'
      const url = stay.url || stay.hotel_link || undefined
      out.push({
        id:          stay.id,
        name:        stay.name,
        altName:     alt?.name ?? stay.name,
        priceLevel,
        description: stay.note,
        tags:        Array.isArray(stay.tags) ? stay.tags.slice(0, 3) : [],
        source:      'worldcup',
        destinationKey: dest.key,
        destination: dest.name[locale],
        cityLabel:   city.city,
        cover_img:   hero,
        guideUrl:    cityUrl,
        bookingUrl:  url,
        provider:    hotelProviderFromUrl(url),
        travelers:   keys,
      })
    })
  }
  return out
}

/** Combined feed: curated guides + World Cup city stays, the only authoritative sources. */
export function getAllHotels(locale: Locale): HotelListing[] {
  return [...getAllHotelsFromGuides(locale), ...getAllHotelsFromWorldcup(locale)]
}

/**
 * Every destination the search can offer, in the current and the other locale's name:
 * the hotels' destinations plus any guide without hotels (search never comes back empty
 * for a destination we have a guide for).
 */
export function getHotelDestinations(locale: Locale): HotelDestination[] {
  const hotels = getAllHotels(locale)
  const altName = new Map<string, string>()
  for (const h of getAllHotels(other(locale))) altName.set(h.destinationKey, h.destination)
  const seen = new Map<string, HotelDestination>()
  for (const h of hotels) {
    const d = seen.get(h.destinationKey)
    if (d) d.hotels++
    else seen.set(h.destinationKey, {
      key: h.destinationKey, name: h.destination, altName: altName.get(h.destinationKey) ?? h.destination, hotels: 1,
      ...(h.destinationKey in GUIDE_META ? { guideSlug: getPublicGuideSlug(h.destinationKey, locale) } : {}),
    })
  }
  for (const [key, meta] of Object.entries(GUIDE_META)) {
    if (!seen.has(key)) seen.set(key, { key, name: meta.shortName[locale], altName: meta.shortName[other(locale)], hotels: 0, guideSlug: getPublicGuideSlug(key, locale) })
  }
  return [...seen.values()]
}

export type { TravelerKey }
