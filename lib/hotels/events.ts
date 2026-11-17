// lib/hotels/events.ts — validation of /api/hotels/event bodies. Pure. Accepts only whitelisted ids.
import { HOTEL_OUTBOUND_IDS, HOTEL_SECTION_IDS } from '../../content/guia/hotel/config'
import { isValidHotelCode } from './codes'

export interface HotelEventInput {
  code: string
  type: 'section_open' | 'outbound_click'
  section: string
  lang: 'es' | 'en'
}

export function parseHotelEvent(body: unknown): HotelEventInput | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Record<string, unknown>
  if (!isValidHotelCode(b.code)) return null
  if (b.lang !== 'es' && b.lang !== 'en') return null
  if (b.type === 'section_open' && typeof b.section === 'string' && HOTEL_SECTION_IDS.includes(b.section)) {
    return { code: b.code, type: 'section_open', section: b.section, lang: b.lang }
  }
  if (b.type === 'outbound_click' && typeof b.section === 'string' && (HOTEL_OUTBOUND_IDS as readonly string[]).includes(b.section)) {
    return { code: b.code, type: 'outbound_click', section: b.section, lang: b.lang }
  }
  return null
}
