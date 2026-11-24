// lib/hotels/links.ts — canonical URLs. The QR encodes the host that does NOT redirect (www; the apex 308s to it).
import { BASE_URL } from '../seo'
import { aliasForCode } from './aliases'
import { ZONE_SLUG, type HotelZone } from '../../content/guia/hotel/zones'

/** The QR address: ALWAYS the random code (it is printed on paper). */
export const hotelQrUrl = (code: string) => `${BASE_URL}/g/${code}`
/** The address SHOWN to a person (approval email, "Copiar enlace"): the readable alias when the hotel has one, else the random code.
 *  Not for the QR and not for the "Send this guide to my phone" link, which keep the random code. */
export const hotelShownUrl = (code: string) => `${BASE_URL}/g/${aliasForCode(code) ?? code}`
export const hotelShownCardUrl = (code: string) => `${hotelShownUrl(code)}/tarjeta`
export const hotelCardPath = (code: string) => `/g/${code}/tarjeta`
export const hotelCardUrl = (code: string) => `${BASE_URL}${hotelCardPath(code)}`
export const zoneGuidePath = (zone: HotelZone, params: Record<string, string> = {}) => {
  const q = new URLSearchParams(params).toString()
  return `/guia/cdmx/${ZONE_SLUG[zone]}${q ? `?${q}` : ''}`
}
export const adminHotelUrl = (id: string) => `${BASE_URL}/admin/hoteles/${id}`
