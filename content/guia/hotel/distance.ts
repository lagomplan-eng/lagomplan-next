// content/guia/hotel/distance.ts
//
// "How far" label on each zone tab. It is about GETTING THERE, not about how long to stay:
//   On foot      walkable from the hotel's zone
//   Short ride   roughly under 20 minutes by car
//   Half a day   far enough that the trip itself takes planning
// An explicit table per hotel zone (decided by the owner), not derived from the sentences under the tabs.

import type { Lang } from '../types'
import type { HotelZone } from './zones'

export type HowFar = 'walk' | 'ride' | 'day'

export const HOW_FAR_LABEL: Record<HowFar, Record<Lang, string>> = {
  walk: { en: 'On foot', es: 'A pie' },
  ride: { en: 'Short ride', es: 'Trayecto corto' },
  day: { en: 'Half a day', es: 'Medio día' },
}

export const HOW_FAR: Record<HotelZone, Record<string, HowFar>> = {
  condesa: {
    'Condesa': 'walk', 'Roma Norte': 'walk', 'San Miguel Chapultepec': 'walk',
    'Polanco': 'ride', 'Centro': 'ride', 'Coyoacán': 'day',
  },
  roma: {
    'Roma Norte': 'walk', 'Condesa': 'walk', 'San Miguel Chapultepec': 'ride',
    'Centro': 'ride', 'Polanco': 'ride', 'Coyoacán': 'day',
  },
  polanco: {
    'Polanco': 'walk', 'San Miguel Chapultepec': 'ride', 'Condesa': 'ride',
    'Roma Norte': 'ride', 'Centro': 'day', 'Coyoacán': 'day',
  },
}

export function distanceLabel(hotelZone: HotelZone, tab: string, lang: Lang): string | null {
  const how = HOW_FAR[hotelZone][tab]
  return how ? HOW_FAR_LABEL[how][lang] : null
}
