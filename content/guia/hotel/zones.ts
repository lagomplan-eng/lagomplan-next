// content/guia/hotel/zones.ts
//
// Hotel edition zones. Public URL slugs differ from the internal zone ids
// (roma-norte → 'roma'). Pure data, safe to import from client and server.

import type { ZoneId } from '../zones/types'

export const HOTEL_ZONES = ['condesa', 'roma', 'polanco'] as const
export type HotelZone = (typeof HOTEL_ZONES)[number] & ZoneId

/** Public slug in /guia/cdmx/[zone]. */
export const ZONE_SLUG: Record<HotelZone, string> = {
  condesa: 'condesa',
  roma: 'roma-norte',
  polanco: 'polanco',
}

/** Key of the matching entry in city.neighborhoods (content/guia/cities/cdmx.ts). */
export const ZONE_NEIGHBORHOOD: Record<HotelZone, string> = {
  condesa: 'Condesa',
  roma: 'Roma Norte',
  polanco: 'Polanco',
}

/** Guest-facing zone name, as printed on the card headline. */
export const ZONE_LABEL: Record<HotelZone, string> = {
  condesa: 'Condesa',
  roma: 'Roma Norte',
  polanco: 'Polanco',
}

export function isHotelZone(v: unknown): v is HotelZone {
  return typeof v === 'string' && (HOTEL_ZONES as readonly string[]).includes(v)
}

export function zoneFromSlug(slug: string): HotelZone | null {
  return HOTEL_ZONES.find((z) => ZONE_SLUG[z] === slug) ?? null
}

/**
 * Zone tabs for each hotel zone: the hotel's own zone first (and open), then the others from nearest to farthest.
 * Keys are the neighborhood names of the city layer (content/guia/cities/cdmx.ts) or of the hotel-only zones
 * (content/guia/hotel/extra-zones.ts). A zone switched off in config.ts drops out of the tabs.
 */
export const ZONE_TAB_ORDER: Record<HotelZone, string[]> = {
  condesa: ['Condesa', 'Roma Norte', 'San Miguel Chapultepec', 'Polanco', 'Centro', 'Coyoacán'],
  roma: ['Roma Norte', 'Condesa', 'San Miguel Chapultepec', 'Centro', 'Polanco', 'Coyoacán'],
  polanco: ['Polanco', 'San Miguel Chapultepec', 'Condesa', 'Roma Norte', 'Centro', 'Coyoacán'],
}
