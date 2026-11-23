// content/guia/hotel/share.ts
//
// "Send this guide to my phone": the WhatsApp link. Pure, no window: the old version built the address from
// window.location while rendering, which is empty when the page is built, and React does not repair an attribute that
// differs between the built page and the browser, so the message went out with no link.
//
// The address always ends the message, and always uses the production host (never a preview host):
//   with a hotel code    https://www.lagomplan.com/g/{code}?lang={lang}   the hotel's short link, in the guest's language
//   without a hotel code https://www.lagomplan.com/guia/cdmx/{zone}?lang={lang}

import type { Lang } from '../types'
import { ZONE_LABEL, ZONE_SLUG, type HotelZone } from './zones'

export const SHARE_HOST = 'https://www.lagomplan.com'

export function hotelShareUrl(a: { code: string | null; zone: HotelZone; lang: Lang }): string {
  return a.code ? `${SHARE_HOST}/g/${a.code}?lang=${a.lang}` : `${SHARE_HOST}/guia/cdmx/${ZONE_SLUG[a.zone]}?lang=${a.lang}`
}

export function hotelShareText(zone: HotelZone, lang: Lang): string {
  return lang === 'es' ? `Mi guía de barrio de ${ZONE_LABEL[zone]}, de Lagomplan:` : `My ${ZONE_LABEL[zone]} neighborhood guide, from Lagomplan:`
}

/** The whole message (text, a space, the address) encoded once for wa.me. */
export function hotelShareHref(a: { code: string | null; zone: HotelZone; lang: Lang }): string {
  return `https://wa.me/?text=${encodeURIComponent(`${hotelShareText(a.zone, a.lang)} ${hotelShareUrl(a)}`)}`
}
