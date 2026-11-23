// content/guia/hotel/mood-picks.ts
//
// Mood panels of the hotel edition: the new "A special dinner" mood, the three added shopping places, and the street
// address of every pick (shown on the zone line, with a Map link built from name + address).
//
// FLAGS. Every NEW place below is "to verify: address, opening days and hours" (VERIFY). An address that came with this
// round but is not already in the repo is flagged the same way (see ADDRESSES). Nothing here states hours or prices.

import type { Lang } from '../types'

export const VERIFY = 'to verify: address, opening days and hours'

/**
 * Michelin ratings, in ONE place, with the year. Update the year and the stars each May (the guide shows the labels only).
 */
export const HOTEL_MICHELIN: { year: number; labels: Record<'one' | 'two', Record<Lang, string>> } = {
  year: 2026,
  labels: {
    one: { en: 'One Michelin star', es: 'Una estrella Michelin' },
    two: { en: 'Two Michelin stars', es: 'Dos estrellas Michelin' },
  },
}

export const HOTEL_DINNER_MOOD: Record<Lang, { label: string; title: string }> = {
  en: { label: 'A special dinner', title: 'For a special dinner' },
  es: { label: 'Una cena especial', title: 'Para una cena especial' },
}

export interface NewPick {
  name: string
  /** Own text; absent = reuse the existing text of a place already in the guide, word for word. */
  note?: Record<Lang, string>
  /** Street address (no zone). Empty = to confirm. */
  address: string
  zone: string
  stars?: 'one' | 'two'
  verify: typeof VERIFY
}

/** "A special dinner", in this order. */
export const DINNER_PICKS: NewPick[] = [
  {
    name: 'Gaba', address: '', zone: 'Condesa', stars: 'one', verify: VERIFY, // address to confirm: the line stays empty
    note: { en: "Condesa's own starred restaurant, awarded in 2026. Book ahead.", es: 'El restaurante con estrella de la Condesa, reconocido en 2026. Reserva con tiempo.' },
  },
  {
    name: 'Máximo', address: 'Av. Álvaro Obregón 65 Bis', zone: 'Roma Norte', stars: 'one', verify: VERIFY,
    note: {
      en: 'Seasonal, product-led cooking in an elegant dining room; a city institution. Book ahead.',
      es: 'Cocina de temporada y de producto en un salón elegante; una institución de la ciudad. Reserva con tiempo.',
    },
  },
  {
    name: 'Rosetta', address: 'Colima 166', zone: 'Roma Norte', stars: 'one', verify: VERIFY,
    note: { en: "Elena Reygadas's restaurant in a Roma townhouse. Book ahead.", es: 'El restaurante de Elena Reygadas en una casona de la Roma. Reserva con tiempo.' },
  },
  // Quintonil: reuses its existing text word for word (and leaves "I'm hungry").
  { name: 'Quintonil', address: 'Av. Isaac Newton 55', zone: 'Polanco', stars: 'two', verify: VERIFY },
  {
    name: 'Pujol', address: 'Tennyson 133', zone: 'Polanco', stars: 'two', verify: VERIFY,
    note: {
      en: "Enrique Olvera's tasting menu, the city's best-known table. Book weeks ahead.",
      es: 'El menú degustación de Enrique Olvera, la mesa más conocida de la ciudad. Reserva con semanas de anticipación.',
    },
  },
]

/** "I want to shop": four places added after the existing four (the last one also has a card in the Centro tab). */
export const SHOP_NEW_PICKS: NewPick[] = [
  {
    name: 'Onora', address: 'Lope de Vega 330', zone: 'Polanco', verify: VERIFY,
    note: { en: 'Mexican textiles, objects and homeware made with artisans.', es: 'Textiles, objetos y piezas para la casa hechos con artesanos mexicanos.' },
  },
  {
    name: 'Carla Fernández', address: 'Marsella 72', zone: 'Juárez', verify: VERIFY,
    note: {
      en: "One of Mexico's leading fashion labels: geometric cuts and Mexican textiles.",
      es: 'Una de las firmas de moda más reconocidas de México: cortes geométricos y textiles mexicanos.',
    },
  },
  {
    name: 'Utilitario Mexicano', address: 'Calle Marsella', zone: 'Juárez', verify: VERIFY, // street number to confirm
    note: { en: 'Thoughtfully chosen everyday Mexican homeware.', es: 'Objetos mexicanos de uso diario para la casa, bien elegidos.' },
  },
  {
    name: 'Mercado de Artesanías La Ciudadela', address: 'Balderas', zone: 'Centro', verify: VERIFY,
    note: { en: "The city's crafts market, with stalls from all over Mexico.", es: 'El mercado de artesanías de la ciudad, con puestos de todo México.' },
  },
]

/**
 * Street address of the existing picks, without the zone (the zone is shown next to it). `repo: true` = the address was
 * already in the repo (a zone tab or a Livin partner file); every other one came with this round and is to verify.
 */
export const ADDRESSES: Record<string, { address: string; repo?: boolean }> = {
  'Lalo!': { address: 'Zacatecas 173' },
  'Taquería Orinoco': { address: 'Av. Insurgentes Sur 253' },
  'El Vilsito': { address: 'Petén 248' },
  'Café Nin': { address: 'Havre 73' },
  'Nevería Roxy': { address: 'Fernando Montes de Oca 89' },
  'Maleza': { address: 'Cuernavaca 4' },
  'Museo Tamayo': { address: 'Paseo de la Reforma 51', repo: true }, // content/guia/partners/livin_polanco.ts
  'Casa Luis Barragán': { address: 'General Francisco Ramírez 12-14' },
  'Foro Shakespeare': { address: 'Zamora 7', repo: true }, // "Zamora 7, esq. Veracruz" in content/guia/partners/livin_condesa.ts
  'Bósforo': { address: 'Luis Moya 31' },
  'Casa Franca': { address: 'Mérida 109' },
  'Bazar Sábado': { address: 'Plaza San Jacinto 11' },
  'Departamento': { address: 'Álvaro Obregón 154' },
  // no address yet: Masala y Maíz, Bar Federalista (and Gaba above). Their Map link is built from the name alone.
}
export const ADDRESS_VERIFY = VERIFY
