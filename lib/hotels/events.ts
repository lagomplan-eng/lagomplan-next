// lib/hotels/events.ts — validation of /api/hotels/event bodies. Pure. Accepts only whitelisted ids.
import { HOTEL_OUTBOUND_IDS, HOTEL_SECTION_IDS } from '../../content/guia/hotel/config'
import { HOTEL_PLACE_SOURCES } from '../../content/guia/hotel/places'
import { KNOWN_PLACE_IDS } from '../../content/guia/hotel/place-registry'
import { isValidHotelCode } from './codes'

export interface HotelEventInput {
  code: string
  type: 'section_open' | 'outbound_click'
  section: string
  lang: 'es' | 'en'
  /** outbound_click only: the stable id of the place the link belongs to (a known id from our own content). */
  place?: string
  /** outbound_click only: where in the guide the tap happened (from a fixed list). */
  source?: string
}

/** place and source are optional; when present they must be known values, or the whole event is refused (nothing is stored). */
export function parseHotelEvent(body: unknown): HotelEventInput | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Record<string, unknown>
  if (!isValidHotelCode(b.code)) return null
  if (b.lang !== 'es' && b.lang !== 'en') return null
  if (b.type === 'section_open' && typeof b.section === 'string' && HOTEL_SECTION_IDS.includes(b.section)) {
    if (b.place !== undefined || b.source !== undefined) return null // only a tap on a link has a place and a source
    return { code: b.code, type: 'section_open', section: b.section, lang: b.lang }
  }
  if (b.type === 'outbound_click' && typeof b.section === 'string' && (HOTEL_OUTBOUND_IDS as readonly string[]).includes(b.section)) {
    const out: HotelEventInput = { code: b.code, type: 'outbound_click', section: b.section, lang: b.lang }
    if (b.place !== undefined) {
      if (typeof b.place !== 'string' || !KNOWN_PLACE_IDS.has(b.place)) return null
      out.place = b.place
    }
    if (b.source !== undefined) {
      if (typeof b.source !== 'string' || !HOTEL_PLACE_SOURCES.includes(b.source)) return null
      out.source = b.source
    }
    return out
  }
  return null
}
