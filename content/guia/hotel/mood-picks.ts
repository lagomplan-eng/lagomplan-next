// content/guia/hotel/mood-picks.ts
//
// Mood panels of the hotel edition: which places each mood has, in order (MOODS_PLAN), the details of the places that are
// new to the guide (NEW_PLACES), and the address of every pick (shown on the zone line, with a Map link built from name + address).
//
// RULES
//  - A NEW place that already appears in a zone tab or in a plan of the hotel edition is NOT added (SKIPPED_NEW_PLACES lists them
//    and why), so a mood can have fewer than 7 places until the owner decides.
//  - Every new place is "to verify: opening days and hours" (addresses were checked on Google Maps on 23 Nov 2026).
//  - Every ranking label or mention (Michelin, 50 Best) lives in HOTEL_RANKINGS with its year, so it is easy to update.
//  - Nothing here states hours or prices.

import type { Lang } from '../types'

export const VERIFY = 'to verify: address, opening days and hours'        // places added in earlier rounds
export const VERIFY_HOURS = 'to verify: opening days and hours'            // new places (address checked 23 Nov 2026)
export const VERIFY_OPEN = 'to verify: still open to the public'            // Casa Lamm, on top of the hours

/**
 * Every Michelin and 50 Best label or mention, with its year. Update each May (Michelin) / when the lists change.
 * `michelin.year` is the year of the Michelin guide the labels refer to; `mentions` are the years used inside place texts
 * ({year} in a note is replaced by the place's year here).
 */
export const HOTEL_RANKINGS = {
  michelin: {
    year: 2026,
    labels: {
      one: { en: 'One Michelin star', es: 'Una estrella Michelin' },
      two: { en: 'Two Michelin stars', es: 'Dos estrellas Michelin' },
      green: { en: 'Michelin Green Star', es: 'Estrella Verde Michelin' },
      bib: { en: 'Bib Gourmand', es: 'Bib Gourmand' },
    },
  },
  /** Year quoted in a place's text. Gaba: the Michelin year above. */
  mentions: { 'Gaba': 2026, 'Tlecān': 2026, 'Bar Mauro': 2026, 'Handshake Speakeasy': 2024 } as Record<string, number>,
}
/** Kept under its old name: the labels are used by the dinner mood and the tests. */
export const HOTEL_MICHELIN = HOTEL_RANKINGS.michelin

export type Badge = 'one' | 'two' | 'green' | 'bib' | 'gem'
export const BADGE_LABEL: Record<Badge, Record<Lang, string>> = {
  ...HOTEL_RANKINGS.michelin.labels,
  gem: { en: 'Hidden gem', es: 'Joya escondida' },
}

export type MoodId = 'dinner' | 'shop' | 'culture' | 'hidden' | 'hungry' | 'nightlife'

export const HOTEL_DINNER_MOOD: Record<Lang, { label: string; title: string }> = {
  en: { label: 'A special dinner', title: 'For a special dinner' },
  es: { label: 'Una cena especial', title: 'Para una cena especial' },
}

export interface NewPick {
  name: string
  /** Own text ({year} = the ranking year above); absent = reuse the existing text of a place already in the guide, word for word. */
  note?: Record<Lang, string>
  /** Street address (no zone). Empty = none yet. */
  address: string
  zone: string
  /** Small label above the name. */
  badge?: Badge
  verify: string[]
}

const H = [VERIFY_HOURS]
const OLD = [VERIFY]

export const NEW_PLACES: Record<string, NewPick> = {
  // ── A special dinner
  'Gaba': { name: 'Gaba', address: 'Av. Mazatlán 190', zone: 'Condesa', badge: 'one', verify: H,
    note: { en: "Condesa's own starred restaurant, awarded in {year}. Book ahead.", es: 'El restaurante con estrella de la Condesa, reconocido en {year}. Reserva con tiempo.' } },
  'Esquina Común': { name: 'Esquina Común', address: 'Fernando Montes de Oca 86', zone: 'Condesa', badge: 'one', verify: H,
    note: { en: 'A small Condesa terrace with a short menu to share. Book ahead.', es: 'Una terraza pequeña en la Condesa con una carta corta para compartir. Reserva con tiempo.' } },
  'Em': { name: 'Em', address: 'Ámsterdam 76', zone: 'Hipódromo Condesa', badge: 'one', verify: H,
    note: { en: "Lucho Martínez's tasting menu in a small house on Ámsterdam. Book ahead.", es: 'El menú degustación de Lucho Martínez en una casa pequeña sobre Ámsterdam. Reserva con tiempo.' } },
  'Máximo': { name: 'Máximo', address: 'Av. Álvaro Obregón 65 Bis', zone: 'Roma Norte', badge: 'one', verify: OLD,
    note: { en: 'Seasonal, product-led cooking in an elegant dining room; a city institution. Book ahead.', es: 'Cocina de temporada y de producto en un salón elegante; una institución de la ciudad. Reserva con tiempo.' } },
  'Rosetta': { name: 'Rosetta', address: 'Colima 166', zone: 'Roma Norte', badge: 'one', verify: OLD,
    note: { en: "Elena Reygadas's restaurant in a Roma townhouse. Book ahead.", es: 'El restaurante de Elena Reygadas en una casona de la Roma. Reserva con tiempo.' } },
  'Quintonil': { name: 'Quintonil', address: 'Av. Isaac Newton 55', zone: 'Polanco', badge: 'two', verify: OLD }, // existing text, word for word
  'Pujol': { name: 'Pujol', address: 'Tennyson 133', zone: 'Polanco', badge: 'two', verify: OLD,
    note: { en: "Enrique Olvera's tasting menu, the city's best-known table. Book weeks ahead.", es: 'El menú degustación de Enrique Olvera, la mesa más conocida de la ciudad. Reserva con semanas de anticipación.' } },
  // ── I want to shop
  'Onora': { name: 'Onora', address: 'Lope de Vega 330', zone: 'Polanco', verify: OLD,
    note: { en: 'Mexican textiles, objects and homeware made with artisans.', es: 'Textiles, objetos y piezas para la casa hechos con artesanos mexicanos.' } },
  'Carla Fernández': { name: 'Carla Fernández', address: 'Marsella 72', zone: 'Juárez', verify: OLD,
    note: { en: "One of Mexico's leading fashion labels: geometric cuts and Mexican textiles.", es: 'Una de las firmas de moda más reconocidas de México: cortes geométricos y textiles mexicanos.' } },
  'Utilitario Mexicano': { name: 'Utilitario Mexicano', address: 'Marsella 3A', zone: 'Juárez', verify: H,
    note: { en: 'Thoughtfully chosen everyday Mexican homeware.', es: 'Objetos mexicanos de uso diario para la casa, bien elegidos.' } },
  'Mercado de Artesanías La Ciudadela': { name: 'Mercado de Artesanías La Ciudadela', address: 'Balderas', zone: 'Centro', verify: OLD,
    note: { en: "The city's crafts market, with stalls from all over Mexico.", es: 'El mercado de artesanías de la ciudad, con puestos de todo México.' } },
  // ── I want culture
  'Castillo de Chapultepec': { name: 'Castillo de Chapultepec', address: 'Bosque de Chapultepec, 1ª Sección', zone: 'Chapultepec', verify: H,
    note: { en: 'The hilltop castle in Chapultepec, with the national history museum and a wide view of the city.', es: 'El castillo en lo alto de Chapultepec, con el museo nacional de historia y una gran vista de la ciudad.' } },
  'OMR': { name: 'OMR', address: 'Córdoba 100', zone: 'Roma Norte', verify: H,
    note: { en: "One of the city's leading contemporary art galleries.", es: 'Una de las galerías de arte contemporáneo más importantes de la ciudad.' } },
  'Casa Lamm': { name: 'Casa Lamm', address: 'Av. Álvaro Obregón 99', zone: 'Roma Norte', verify: [VERIFY_HOURS, VERIFY_OPEN],
    note: { en: 'A Porfirian mansion turned cultural centre, with galleries and a garden.', es: 'Una casona porfiriana convertida en centro cultural, con galerías y jardín.' } },
  // ── Hidden places
  'Audiorama': { name: 'Audiorama', address: 'Calzada del Rey, Bosque de Chapultepec', zone: 'Chapultepec', verify: H,
    note: { en: 'A quiet garden inside Chapultepec with music, benches and books.', es: 'Un jardín tranquilo dentro de Chapultepec con música, bancas y libros.' } },
  'Museo Anahuacalli': { name: 'Museo Anahuacalli', address: 'Museo 150', zone: 'Coyoacán', verify: H,
    note: { en: "Diego Rivera's volcanic-stone museum for his pre-Hispanic collection.", es: 'El museo de piedra volcánica de Diego Rivera para su colección prehispánica.' } },
  'Kiosko Morisco': { name: 'Kiosko Morisco', address: 'Jaime Torres Bodet 152', zone: 'Santa María la Ribera', verify: H,
    note: { en: 'A Moorish-style iron pavilion in the park of Santa María la Ribera.', es: 'Un pabellón de hierro de estilo morisco en la alameda de Santa María la Ribera.' } },
  // ── I'm hungry
  'Maleza': { name: 'Maleza', address: 'Cuernavaca 4', zone: 'Condesa', badge: 'gem', verify: H,
    note: { en: 'Locally sourced cooking from small producers of the Valley of Mexico, and good drinks.', es: 'Cocina con ingredientes de pequeños productores del Valle de México y buenos tragos.' } },
  'Baldío': { name: 'Baldío', address: 'Antonio Sola 26', zone: 'Condesa', badge: 'green', verify: H,
    note: { en: 'Zero-waste Mexican cooking with produce from the chinampas.', es: 'Cocina mexicana de cero desperdicio con producto de las chinampas.' } },
  'Plonk': { name: 'Plonk', address: 'Plaza Luis Cabrera 7', zone: 'Roma Norte', badge: 'bib', verify: H,
    note: { en: 'A wine bar with a short menu of small plates.', es: 'Un bar de vinos con una carta corta de platos pequeños.' } },
  'Mi Compa Chava': { name: 'Mi Compa Chava', address: 'Zacatecas 172', zone: 'Roma Norte', verify: H,
    note: { en: 'Sinaloa-style seafood for a long lunch. Expect a wait.', es: 'Mariscos estilo Sinaloa para una comida larga. Suele haber espera.' } },
  // ── I want nightlife
  'Baltra Bar': { name: 'Baltra Bar', address: 'Iztaccíhuatl 36D', zone: 'Condesa', verify: H,
    note: { en: 'A small, relaxed cocktail bar on a quiet Condesa corner.', es: 'Un bar de coctelería pequeño y relajado en una esquina tranquila de la Condesa.' } },
  'Tlecān': { name: 'Tlecān', address: 'Av. Álvaro Obregón 228', zone: 'Roma Norte', verify: H,
    note: { en: "A mezcal bar, ranked 5 in North America's 50 Best Bars {year}.", es: "Un bar de mezcal, número 5 en North America's 50 Best Bars {year}." } },
  'Bar Mauro': { name: 'Bar Mauro', address: 'Tabasco 149', zone: 'Roma Norte', verify: H,
    note: { en: 'An Italian-style aperitivo bar, named the best bar in Mexico in {year} by 50 Best.', es: 'Un bar de aperitivo a la italiana, nombrado el mejor bar de México en {year} por 50 Best.' } },
  'Hanky Panky': { name: 'Hanky Panky', address: 'Turín 52', zone: 'Juárez', verify: H,
    note: { en: 'A speakeasy hidden behind a taquería. Book ahead.', es: 'Un speakeasy escondido detrás de una taquería. Reserva con tiempo.' } },
  'Handshake Speakeasy': { name: 'Handshake Speakeasy', address: 'Amberes 65', zone: 'Juárez', verify: H,
    note: { en: "Named the world's best bar in {year}. Book well ahead.", es: 'Nombrado el mejor bar del mundo en {year}. Reserva con mucha anticipación.' } },
}

/** The places of each mood, in order. A name not in NEW_PLACES is a place that already has a text in the guide. */
export const MOODS_PLAN: Record<MoodId, string[]> = {
  dinner: ['Gaba', 'Esquina Común', 'Em', 'Máximo', 'Rosetta', 'Quintonil', 'Pujol'],
  shop: ['Proyecto Rufina', 'Librería El Péndulo', 'Bazar Sábado', 'Onora', 'Carla Fernández', 'Utilitario Mexicano', 'Mercado de Artesanías La Ciudadela'],
  culture: ['Museo Tamayo', 'Casa Luis Barragán', 'Castillo de Chapultepec', 'OMR', 'Casa Lamm'],
  hidden: ['Foro Shakespeare', 'Bósforo', 'Casa Franca', 'Audiorama', 'Museo Anahuacalli', 'Kiosko Morisco'],
  hungry: ['Maleza', 'Baldío', 'Plonk', 'Mi Compa Chava', 'Taquería Orinoco', 'Café Nin'],
  nightlife: ['Licorería Limantour', 'Departamento', 'Baltra Bar', 'Tlecān', 'Bar Mauro', 'Hanky Panky', 'Handshake Speakeasy'],
}

/** A mood has 7 places. These NEW places were asked for but already appear in a zone tab or a plan, so they were not added. */
export const MOOD_SIZE = 7
export const SKIPPED_NEW_PLACES: { mood: MoodId; name: string; because: string }[] = [
  { mood: 'culture', name: 'Museo Jumex', because: 'already in the Polanco tab, in the card "Soumaya + Jumex"' },
  { mood: 'culture', name: 'Palacio de Bellas Artes', because: 'already in the Centro tab ("Templo Mayor + Bellas Artes") and in the 48 hours plan' },
  { mood: 'hidden', name: 'Casa Gilardi', because: 'already in the San Miguel Chapultepec tab' },
  { mood: 'hungry', name: 'Expendio de Maíz', because: 'already named in the 48 hours plan (day two, 20:00)' },
]

/** Craving label the hotel edition changes on an existing pick. */
export const HOTEL_CRAVING_LABEL: Record<string, string> = { 'Café Nin': 'Brunch' }

/** Street address of the existing picks, without the zone. `repo: true` = already in the repo before this round. */
export const ADDRESSES: Record<string, { address: string; repo?: boolean }> = {
  'Taquería Orinoco': { address: 'Av. Insurgentes Sur 253' },
  'Café Nin': { address: 'Havre 73' },
  'Museo Tamayo': { address: 'Paseo de la Reforma 51', repo: true }, // content/guia/partners/livin_polanco.ts
  'Casa Luis Barragán': { address: 'General Francisco Ramírez 12-14' },
  'Foro Shakespeare': { address: 'Zamora 7', repo: true }, // "Zamora 7, esq. Veracruz" in content/guia/partners/livin_condesa.ts
  'Bósforo': { address: 'Luis Moya 31' },
  'Casa Franca': { address: 'Mérida 109' },
  'Bazar Sábado': { address: 'Plaza San Jacinto 11' },
  'Departamento': { address: 'Álvaro Obregón 154' },
  // Proyecto Rufina, Librería El Péndulo and Licorería Limantour: the address in their zone tab card.
}
