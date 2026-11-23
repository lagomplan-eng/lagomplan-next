// content/guia/hotel/time.ts
//
// "How much time do you have?" (hotel edition). Two plans: a short one, only where it has been written, and the
// 48 hours itinerary (the existing one, from the city layer, unchanged).
//
// The short plan exists for Condesa only. Roma Norte and Polanco show only the 48 hours plan; do not reuse this one there.

import type { Lang } from '../types'
import type { HotelZone } from './zones'

export interface QuickStop {
  name: string
  /** Street address as given, or the area for a park/museum/avenue. */
  where: string
  note: Record<Lang, string>
  /** Per-stop flag, when it differs from the plan's. */
  verify?: string
}

export interface QuickPlan {
  zones: HotelZone[]
  /** Button label. */
  title: Record<Lang, string>
  /** Left column of the dark band, same structure as the 48 hours one: eyebrow (the itinerary's), title, line. */
  band: { title: Record<Lang, string>; line: Record<Lang, string> }
  stops: QuickStop[]
  /** Closing note, in the band's italic note style. */
  note: Record<Lang, string>
  /** Not shown to guests. Anything here has not been checked yet. */
  verify: string
}

export const HOTEL_TIME_TITLE: Record<Lang, string> = { es: '¿Cuánto tiempo tienes?', en: 'How much time do you have?' }

const VERIFY_NEW = 'to verify: address, opening days and hours'

export const HOTEL_QUICK_PLAN: QuickPlan = {
  zones: ['condesa'],
  title: { es: 'Solo unas horas', en: 'Only a few hours' },
  band: {
    title: { es: 'Unas horas', en: 'A few hours' },
    line: { es: 'Cuatro paradas, una tarde.', en: 'Four stops, one afternoon.' },
  },
  // to verify: opening days and hours (all four stops; the last two also the address)
  verify: 'to verify: opening days and hours',
  stops: [
    {
      name: 'Museo de Arte Moderno',
      where: 'Chapultepec',
      note: {
        en: 'Mexican modern art and a sculpture garden, inside Chapultepec.',
        es: 'Arte moderno mexicano y un jardín de esculturas, dentro de Chapultepec.',
      },
    },
    {
      name: 'Niddo',
      where: 'Dresde 2, Juárez',
      note: {
        en: 'Coffee from Chiapas and fresh baked goods on a quiet, tree-lined street a block behind Reforma.',
        es: 'Café de Chiapas y pan recién horneado en una calle tranquila y arbolada, a una cuadra de Reforma.',
      },
    },
    {
      name: 'Avenida Ámsterdam',
      where: 'Condesa',
      verify: VERIFY_NEW,
      note: {
        en: 'The oval avenue under the trees, laid out on an old racetrack. Walk a loop at golden hour.',
        es: 'La avenida ovalada bajo los árboles, trazada sobre un antiguo hipódromo. Camina una vuelta al atardecer.',
      },
    },
    {
      name: 'Lindy',
      where: 'Av. México 31, Condesa',
      verify: VERIFY_NEW,
      note: {
        en: 'A drink across from Parque México. Lucky, the rooftop bar, is upstairs.',
        es: 'Una copa frente al Parque México. Arriba está Lucky, el bar de la azotea.',
      },
    },
  ],
  note: {
    en: 'Not on Mondays. Short rides at the start; the last two stops are a walk apart.',
    es: 'No en lunes. Trayectos cortos al inicio; las dos últimas paradas están a unos pasos.',
  },
}

export function quickPlanFor(zone: HotelZone): QuickPlan | null {
  return HOTEL_QUICK_PLAN.zones.includes(zone) ? HOTEL_QUICK_PLAN : null
}

/** Google Maps search link for a stop, in the format the repo already uses for place links. */
export function stopMapUrl(stop: QuickStop): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stop.name}, ${stop.where}, Ciudad de México`)}`
}

/** Google Maps search link from a place name and, when there is one, its address (name alone otherwise). */
export function placeMapUrl(name: string, where?: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name, where, 'Ciudad de México'].filter(Boolean).join(', '))}`
}
