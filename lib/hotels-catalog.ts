/**
 * lib/hotels-catalog.ts
 *
 * Pure part of the Hoteles page: the listing shape, the traveler-type key set and the
 * map that normalizes both languages onto it, the booking provider derived from the
 * link, and the filters. No registry or guide imports, so client components can use it
 * without bundling the guide data (lib/hotels.ts builds the feed).
 */

/** Slug used for hotel ids (scripts/hotels/add-ids.ts writes it into the data). */
export const slugifyHotelName = (name: string): string =>
  name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export type PriceLevel = '$' | '$$' | '$$$' | '$$$$'

// ── traveler types ───────────────────────────────────────────────────────────

export const TRAVELER_KEYS = ['ninos', 'parejas', 'solo', 'negocios', 'aventura', 'bienestar', 'workation', 'eco'] as const
export type TravelerKey = (typeof TRAVELER_KEYS)[number]

/**
 * Every label the data uses, in both languages (keys are lower-case). The guide files mix
 * both: English guides carry some Spanish labels and some English ones.
 */
export const TRAVELER_LABEL_MAP: Readonly<Record<string, TravelerKey>> = {
  familias: 'ninos', families: 'ninos',
  parejas: 'parejas', couples: 'parejas',
  solo: 'solo',
  negocios: 'negocios', business: 'negocios',
  aventura: 'aventura', adventure: 'aventura',
  bienestar: 'bienestar', wellness: 'bienestar',
  workation: 'workation',
  eco: 'eco',
}

export function normalizeTravelers(raw: readonly string[] | undefined): { keys: TravelerKey[]; unmapped: string[] } {
  const keys: TravelerKey[] = []
  const unmapped: string[] = []
  for (const label of raw ?? []) {
    const k = TRAVELER_LABEL_MAP[label.trim().toLowerCase()]
    if (!k) unmapped.push(label)
    else if (!keys.includes(k)) keys.push(k)
  }
  return { keys, unmapped }
}

/** A Viajero chip shows only if at least this many hotels in the result set have it. */
export const MIN_TRAVELER_HOTELS = 5

// ── booking provider ─────────────────────────────────────────────────────────

/** 'hotel-site' = the hotel's own site; 'other' = a link we can't attribute. */
export type HotelProvider = 'booking' | 'expedia' | 'hotelscom' | 'kayak' | 'hotel-site' | 'other'

const STAY22_HOSTS: Record<string, HotelProvider> = {
  'booking.stay22.com': 'booking',
  'expedia.stay22.com': 'expedia',
  'hotelscom.stay22.com': 'hotelscom',
  'kayak.stay22.com': 'kayak',
}

export function hotelProviderFromUrl(url: string | undefined): HotelProvider {
  if (!url) return 'other'
  let host: string
  try { host = new URL(url).hostname.toLowerCase() } catch { return 'other' }
  if (STAY22_HOSTS[host]) return STAY22_HOSTS[host]
  if (host === 'booking.com' || host.endsWith('.booking.com')) return 'booking'
  if (host === 'stay22.com' || host.endsWith('.stay22.com')) return 'other' // a Stay22 product we don't recognise
  if (/(^|\.)(expedia|hotels|kayak|agoda|airbnb|getyourguide|viator)\./.test(host)) return 'other'
  return 'hotel-site'
}

// ── listing ──────────────────────────────────────────────────────────────────

export interface HotelListing {
  /** Stable id: slug of the Spanish name, the same in ES and EN. */
  id: string
  name: string
  /** The hotel's name in the other locale (search only). */
  altName: string
  priceLevel: PriceLevel
  description: string
  /** Highlight pills from the raw data. */
  tags: string[]
  source: 'guide' | 'worldcup'
  /** Guide registry key when the destination has a guide; else `wc-<city>`. The `?destino=` value. */
  destinationKey: string
  /** Short destination name for the current locale. */
  destination: string
  /** Label the neighborhoods data uses for this city (current locale). */
  cityLabel: string
  /** The guide's (or World Cup city's) hero illustration. */
  cover_img: string
  guideUrl: string
  bookingUrl?: string
  provider: HotelProvider
  travelers: TravelerKey[]
}

/** A destination the search can offer: every hotel destination, plus guides without hotels. */
export interface HotelDestination {
  key: string
  name: string
  altName: string
  hotels: number
  /** Public guide slug when the destination has a guide page (guide-only search hits link to it). */
  guideSlug?: string
}

// ── filters ──────────────────────────────────────────────────────────────────

export const PRICE_FILTER_IDS = ['economico', 'intermedio', 'lujo'] as const
export type PriceFilterId = (typeof PRICE_FILTER_IDS)[number]

export interface HotelFilters {
  price: PriceFilterId | null
  viajero: TravelerKey | null
  /** Destination key, or null for all. */
  destino: string | null
}

export const EMPTY_HOTEL_FILTERS: HotelFilters = { price: null, viajero: null, destino: null }

/** Query params the page reads. Their presence on a URL means "filtered" (-> noindex). */
export const HOTEL_FILTER_PARAMS = ['destino', 'precio', 'viajero'] as const

/** $ → Económico, $$ → Intermedio, $$$ and $$$$ → Lujo. */
export function priceBucket(level: PriceLevel): PriceFilterId {
  return level === '$' ? 'economico' : level === '$$' ? 'intermedio' : 'lujo'
}

export function matchesHotel(h: HotelListing, f: HotelFilters, skip?: keyof HotelFilters): boolean {
  if (skip !== 'price' && f.price && priceBucket(h.priceLevel) !== f.price) return false
  if (skip !== 'viajero' && f.viajero && !h.travelers.includes(f.viajero)) return false
  if (skip !== 'destino' && f.destino && h.destinationKey !== f.destino) return false
  return true
}

export const filterHotels = (all: HotelListing[], f: HotelFilters): HotelListing[] => all.filter(h => matchesHotel(h, f))

/** Viajero chips to show: types with >= 5 hotels among the hotels passing the OTHER filters; a selected one always stays. */
export function travelerOptions(all: HotelListing[], f: HotelFilters, min = MIN_TRAVELER_HOTELS): TravelerKey[] {
  const pool = all.filter(h => matchesHotel(h, f, 'viajero'))
  return TRAVELER_KEYS.filter(k => k === f.viajero || pool.filter(h => h.travelers.includes(k)).length >= min)
}

export function parseHotelFilters(sp: { get(name: string): string | null }, validDestinations?: ReadonlySet<string>): HotelFilters {
  const price = sp.get('precio')
  const viajero = sp.get('viajero')
  const destino = sp.get('destino')
  return {
    price: (PRICE_FILTER_IDS as readonly string[]).includes(price ?? '') ? (price as PriceFilterId) : null,
    viajero: (TRAVELER_KEYS as readonly string[]).includes(viajero ?? '') ? (viajero as TravelerKey) : null,
    destino: destino && (!validDestinations || validDestinations.has(destino)) ? destino : null,
  }
}

/** Stable-order query string (no leading '?'). */
export function serializeHotelFilters(f: HotelFilters): string {
  const p: string[] = []
  if (f.destino) p.push(`destino=${encodeURIComponent(f.destino)}`)
  if (f.price) p.push(`precio=${f.price}`)
  if (f.viajero) p.push(`viajero=${f.viajero}`)
  return p.join('&')
}
