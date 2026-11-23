// content/guia/hotel/time.ts
//
// "How much time do you have?" (hotel edition). Two plans: a short one, only where it has been written, and the
// 48 hours itinerary (the existing one, from the city layer, unchanged).
//
// The short plan exists for Condesa only. Roma Norte and Polanco show only the 48 hours plan; do not reuse this one there.

import type { IconKey, Lang } from '../types'
import type { HotelZone } from './zones'

export interface QuickStop {
  name: string
  /** Street address as given, or the area for a park/museum. */
  where: string
  icon: IconKey
  note: Record<Lang, string>
}

export interface QuickPlan {
  zones: HotelZone[]
  title: Record<Lang, string>
  stops: QuickStop[]
  line: Record<Lang, string>
  /** Not shown to guests. Anything here has not been checked yet. */
  verify: string
}

export const HOTEL_TIME_TITLE: Record<Lang, string> = { es: '¿Cuánto tiempo tienes?', en: 'How much time do you have?' }

export const HOTEL_QUICK_PLAN: QuickPlan = {
  zones: ['condesa'],
  title: { es: 'Solo unas horas', en: 'Only a few hours' },
  // to verify: opening days and hours (all three stops)
  verify: 'to verify: opening days and hours',
  stops: [
    {
      name: 'Museo de Arte Moderno',
      where: 'Chapultepec',
      icon: 'landmark',
      note: {
        en: 'Mexican modern art and a sculpture garden, inside Chapultepec.',
        es: 'Arte moderno mexicano y un jardín de esculturas, dentro de Chapultepec.',
      },
    },
    {
      name: 'Niddo',
      where: 'Dresde 2, Juárez',
      icon: 'coffee',
      note: {
        en: 'Coffee from Chiapas and fresh baked goods on a quiet, tree-lined street a block behind Reforma.',
        es: 'Café de Chiapas y pan recién horneado en una calle tranquila y arbolada, a una cuadra de Reforma.',
      },
    },
    {
      name: 'Maleza',
      where: 'Cuernavaca 4, Condesa',
      icon: 'utensilsSm',
      note: {
        en: 'Locally sourced cooking from small producers of the Valley of Mexico, and good drinks. A hidden gem in Condesa.',
        es: 'Cocina con ingredientes de pequeños productores del Valle de México y buenos tragos. Una joya escondida en la Condesa.',
      },
    },
  ],
  line: {
    en: 'Best Wednesday to Saturday. Take a short ride between stops.',
    es: 'Mejor de miércoles a sábado. Entre paradas, un trayecto corto.',
  },
}

export function quickPlanFor(zone: HotelZone): QuickPlan | null {
  return HOTEL_QUICK_PLAN.zones.includes(zone) ? HOTEL_QUICK_PLAN : null
}

/** Google Maps search link for a stop, in the format the repo already uses for place links. */
export function stopMapUrl(stop: QuickStop): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stop.name}, ${stop.where}, Ciudad de México`)}`
}
