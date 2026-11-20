// lib/hotels/links.ts — canonical URLs. The QR encodes the host that does NOT redirect (www; the apex 308s to it).
import { BASE_URL } from '../seo'
import { ZONE_SLUG, type HotelZone } from '../../content/guia/hotel/zones'

export const hotelQrUrl = (code: string) => `${BASE_URL}/g/${code}`
export const hotelCardPath = (code: string) => `/g/${code}/tarjeta`
export const hotelCardUrl = (code: string) => `${BASE_URL}${hotelCardPath(code)}`
export const zoneGuidePath = (zone: HotelZone, params: Record<string, string> = {}) => {
  const q = new URLSearchParams(params).toString()
  return `/guia/cdmx/${ZONE_SLUG[zone]}${q ? `?${q}` : ''}`
}
export const adminHotelUrl = (id: string) => `${BASE_URL}/admin/hoteles/${id}`
