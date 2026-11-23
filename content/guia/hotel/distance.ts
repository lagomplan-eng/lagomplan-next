// content/guia/hotel/distance.ts
//
// "How far" label on each zone tab, taken from the distance sentence each zone already has in the guide
// (city layer, content/guia/cities/cdmx.ts), never invented:
//   "a 10-minute walk or less"  -> On foot      / A pie
//   "worth the trip"            -> Short ride   / Trayecto corto
//   "plan half a day"           -> Half a day   / Medio día
//
// Those sentences are written from the point of view of Condesa and Roma Norte ("one of your two closest zones"),
// so they only make a label clear for a Condesa or Roma Norte hotel. For a Polanco hotel they say nothing true
// about distance (Roma Norte would read "10-minute walk"), so no tab gets a label there until Polanco's own
// sentences are written. Nothing is guessed.

import type { Lang } from '../types'
import type { HotelZone } from './zones'

const LABEL = {
  walk: { en: 'On foot', es: 'A pie' },
  ride: { en: 'Short ride', es: 'Trayecto corto' },
  day: { en: 'Half a day', es: 'Medio día' },
} as const

const RULES: { re: RegExp; label: keyof typeof LABEL }[] = [
  { re: /10-minute walk or less|10 minutos o menos a pie/i, label: 'walk' },
  { re: /worth the trip|vale la pena el viaje/i, label: 'ride' },
  { re: /plan half a day|planea medio día/i, label: 'day' },
]

/** Hotel zones whose point of view the city-layer sentences share. */
export const DISTANCE_LABELS_FOR: HotelZone[] = ['condesa', 'roma']

export function distanceLabel(hotelZone: HotelZone, orientation: Record<Lang, string>, lang: Lang): string | null {
  if (!DISTANCE_LABELS_FOR.includes(hotelZone)) return null
  const rule = RULES.find((r) => r.re.test(orientation.en) || r.re.test(orientation.es))
  return rule ? LABEL[rule.label][lang] : null
}
