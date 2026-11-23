// content/guia/hotel/config.ts
//
// The hotel edition is the Livin guide (GuiaClient, same sections, order, components, copy and design) with a
// short list of differences, all driven by the `hotel` prop of GuiaClient:
//   1. no host letter
//   2. experiences = the GetYourGuide tours in ./experiences.ts (no Insider)
//   3. no newsletter form
//   4. the hotel welcome banner (headline "Tu guía de {zona}")
//   5. the five-zones tab that opens by default is the hotel's zone (no "Your house" tab; the title counts the tabs)
// plus the standing rules: no Insider link or number anywhere, nothing specific to the Livin property
// (see resolve.ts and rewords.ts), and scans and section/click tracking go to the hotel (never to the Livin pilot).
//
// Nothing here is a layout: section order and markup live in GuiaClient, so the hotel edition cannot drift.

import type { Lang } from '../types'
import type { FaqItemKey } from '../faq/types'
import type { HotelZone } from './zones'

export interface HotelEdition {
  id: 'free' | 'paid'
  /** Welcome banner eyebrow. */
  heroEyebrow: Record<Lang, string>
  /** Welcome banner headline template ({zone} is replaced). Plain strings: this object is a prop of a client component. */
  zoneHeadline: Record<Lang, string>
  /** Text under the banner title. */
  heroSub: Record<Lang, string>
  share: boolean
  /** The tracking utm_source prefix; the hotel code is appended. */
  utmSourcePrefix: string
  planner: { utmCampaign: string }
}

/** The month the hotel content was last reviewed, "YYYY-MM". The banner line "Updated November 2026" is built from it:
 *  change this one value when the content is reviewed. */
export const HOTEL_CONTENT_UPDATED = '2026-11'

const MONTHS: Record<Lang, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
}

export function hotelUpdatedLine(lang: Lang, updated: string = HOTEL_CONTENT_UPDATED): string {
  const [y, m] = updated.split('-')
  const month = MONTHS[lang][Number(m) - 1]
  return lang === 'es' ? `Actualizada en ${month} de ${y}` : `Updated ${month} ${y}`
}

export const HOTEL_FREE_EDITION: HotelEdition = {
  id: 'free',
  heroEyebrow: { es: 'Guía de barrio · Lagomplan', en: 'Neighborhood guide · Lagomplan' },
  zoneHeadline: { es: 'Tu guía de {zone}', en: 'Your guide to {zone}' },
  heroSub: {
    es: 'Preparada como la prepararía un amigo, no un buscador. Solo lugares verificados.',
    en: 'Prepared like a friend would prepare it, not a search engine. Verified places only.',
  },
  share: true,
  utmSourcePrefix: 'hotel_',
  planner: { utmCampaign: 'hotel_free' },
}

/**
 * The two zones only the hotel edition has. Turn one off (false) before launch if its content is not verified:
 * its tab disappears, the "N zones" title drops with it, and the place that moved out of a mood panel goes back.
 */
export const HOTEL_EXTRA_ZONES_ON: Record<'San Miguel Chapultepec' | 'Coyoacán', boolean> = {
  'San Miguel Chapultepec': true,
  'Coyoacán': true,
}

/** These two zones link to the owner's own Google Maps lists, so their map card does not state a number of places. */
export const HOTEL_MAP_CARD_NO_COUNT: Record<Lang, string> = { en: 'See the places on the map', es: 'Ver los lugares en el mapa' }

/** Distance line of the two closest zones in the hotel edition (Roma Norte and Condesa tabs, for a Condesa or Roma Norte hotel). */
export const HOTEL_CLOSE_ZONES_LINE: Record<Lang, string> = {
  en: 'One of your closest zones; most of these are a 10-minute walk or less.',
  es: 'Una de tus zonas más cercanas; casi todo queda a 10 minutos a pie o menos.',
}

/**
 * Distance sentences that replace the city layer's (which are written from Condesa's point of view), per hotel zone and
 * tab. Zones not listed keep the sentence they already have. The two hotel-only zones write theirs in extra-zones.ts.
 */
export const HOTEL_ORIENTATION: Record<'condesa' | 'roma' | 'polanco', Record<string, Record<Lang, string>>> = {
  condesa: { 'Roma Norte': HOTEL_CLOSE_ZONES_LINE, 'Condesa': HOTEL_CLOSE_ZONES_LINE },
  roma: { 'Roma Norte': HOTEL_CLOSE_ZONES_LINE, 'Condesa': HOTEL_CLOSE_ZONES_LINE },
  polanco: {
    'Polanco': { en: 'Your own neighbourhood; most of these are a short walk.', es: 'Tu propia zona; casi todo queda a una caminata corta.' },
    'Condesa': { en: 'A short ride south; pair it with Roma Norte.', es: 'A un trayecto corto al sur; combínala con la Roma Norte.' },
    'Roma Norte': { en: 'A short ride; best combined with Condesa in one outing.', es: 'A un trayecto corto; lo mejor es combinarla con la Condesa en una salida.' },
    'Centro': { en: 'The historic core; plan half a day.', es: 'El centro histórico; planea medio día.' },
  },
}

/** Zone name under a mood pick, from the owner's list. Places not listed (Masala y Maíz, Bar Federalista, Casa Franca) show none. */
export const HOTEL_PICK_ZONES: Record<string, string> = {
  'Lalo!': 'Roma Norte',
  'Taquería Orinoco': 'Roma Norte',
  'El Vilsito': 'Narvarte',
  'Quintonil': 'Polanco',
  'Café Nin': 'Juárez',
  'Nevería Roxy': 'Condesa',
  'Café Avellaneda': 'Coyoacán',
  'Museo Tamayo': 'Chapultepec',
  'Papalote Museo del Niño': 'Chapultepec',
  'Chapultepec Zoo': 'Chapultepec',
  'Casa Luis Barragán': 'Tacubaya',
  'Kurimanzutto': 'San Miguel Chapultepec',
  'Departamento': 'Roma Norte',
  'Foro Shakespeare': 'Condesa',
  'Bósforo': 'Centro',
}

/** Jump menu under the banner (existing chip style). */
export const HOTEL_JUMP: { id: string; label: Record<Lang, string> }[] = [
  { id: 'zonas', label: { en: 'Near me', es: 'Cerca de mí' } },
  { id: 'planes', label: { en: 'Plans', es: 'Planes' } },
  { id: 'experiencias', label: { en: 'Experiences', es: 'Experiencias' } },
  { id: 'bueno-saber', label: { en: 'Good to know', es: 'Bueno saber' } },
]

/** "How much time do you have?": the two plan buttons. */
export const HOTEL_PLAN_BUTTONS = { quick: { en: 'Only a few hours', es: 'Solo unas horas' }, full: { en: '48 hours', es: '48 horas' } }
export const HOTEL_PLANS_EYEBROW: Record<Lang, string> = { en: 'Plans', es: 'Planes' }

/** New mood and its panel title. The picks are places already in the guide (see resolve.ts). */
export const HOTEL_SHOP_MOOD: Record<Lang, { label: string; title: string }> = {
  en: { label: 'I want to shop', title: 'For shopping' },
  es: { label: 'Quiero ir de compras', title: 'Para ir de compras' },
}
/** Mood buttons, in order. */
export const HOTEL_MOOD_ORDER = ['hungry', 'culture', 'hidden', 'shop', 'nightlife', 'kids']

/** One more row in "Every week in Mexico City". */
export const HOTEL_MONDAY_ROW: Record<Lang, { tag: string; title: string; body: string }> = {
  en: { tag: 'Monday', title: 'Most museums are closed.', body: 'A good day for parks, markets and food.' },
  es: { tag: 'Lunes', title: 'La mayoría de los museos cierra.', body: 'Buen día para parques, mercados y comer.' },
}

/** One line in the footer. */
export const HOTEL_FOOTER_LINE: Record<Lang, string> = {
  en: 'We recommend places because we checked them. Nobody pays to be listed.',
  es: 'Recomendamos lugares porque los revisamos. Nadie paga por aparecer.',
}

/** What GuiaClient receives to switch on the hotel edition. Absent = the guide renders exactly as before. */
export interface HotelMode {
  zone: HotelZone
  edition: HotelEdition
  /** Partner-style FAQ answers that do not belong in a hotel guide (private chefs, massages): never rendered. */
  hiddenFaqKeys: FaqItemKey[]
}

/** Section ids accepted by /api/hotels/event for section_open: the sections of the guide, in order. */
export const HOTEL_SECTION_IDS: readonly string[] = [
  'hero', 'neighborhoods', 'time', 'itinerary', 'moods', 'rhythm', 'experiences', 'practical', 'planner', 'discover',
]

/** Outbound click ids accepted by /api/hotels/event for outbound_click. */
export const HOTEL_OUTBOUND_IDS = ['experience_book', 'airalo', 'map', 'planner', 'share'] as const
export type HotelOutboundId = (typeof HOTEL_OUTBOUND_IDS)[number]
