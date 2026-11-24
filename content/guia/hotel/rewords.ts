// content/guia/hotel/rewords.ts
//
// Hotel edition only. The Livin guides are written for one property ("your host", "the apartment", "the property");
// a hotel guest reads the same copy with the smallest changes that make it true for a hotel. Applied at render time
// to the resolved text, so the Livin, Host Me Tender and demo guides keep their text untouched.
//
// Rules: change as few words as possible, invent no new fact (a claim about the property is dropped, not replaced).

import type { Lang } from '../types'

export interface Reword { lang: Lang; before: string; after: string }

export const HOTEL_REWORDS: Reword[] = [
  // Connectivity (arrival card): the property's wifi is a claim about one property.
  { lang: 'en', before: 'Wi-Fi is reliable at the property and most cafés.', after: 'Wi-Fi is reliable at most cafés.' },
  { lang: 'es', before: 'El wifi es confiable en la propiedad y en la mayoría de los cafés.', after: 'El wifi es confiable en la mayoría de los cafés.' },
  // Tap water (arrival card): "your unit" / "tu departamento".
  { lang: 'en', before: 'If your unit has purified water available', after: 'If your hotel has purified water available' },
  { lang: 'es', before: 'Si tu departamento cuenta con agua purificada', after: 'Si tu hotel cuenta con agua purificada' },
  // Health & pharmacies (arrival card AND the Take care answer in faq/base.ts).
  { lang: 'en', before: 'ask your host for a nearby clinic', after: 'ask at reception for a nearby clinic' },
  { lang: 'es', before: 'pide a tu anfitrión una clínica cercana', after: 'pregunta en recepción por una clínica cercana' },
  // Delivery apps (Condesa, Roma and Polanco zone answers; the Spanish text never says "apartment").
  { lang: 'en', before: 'leaving the apartment', after: 'leaving the hotel' },
  // Polanco haircuts: "on your own street" is a claim about one address.
  { lang: 'en', before: 'is on your own street and open seven days', after: 'is open seven days' },
  { lang: 'es', before: 'está sobre tu misma calle y abre', after: 'abre' },
]

export function hotelReword(text: string, lang: Lang): string {
  let out = text
  for (const r of HOTEL_REWORDS) if (r.lang === lang) out = out.split(r.before).join(r.after)
  return out
}

/** Replaces the host name ("Livin") wherever the copy has the {host} token. */
export const HOTEL_HOST_NAME: Record<Lang, string> = { es: 'tu hotel', en: 'your hotel' }

const WORDS: Record<Lang, string[]> = {
  es: ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'],
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
}

/** "Five zones, five ways to experience the city" with the number taken from how many zone tabs there are. */
export function zonesHeading(lang: Lang, count: number): string {
  const w = WORDS[lang][count] ?? String(count)
  const cap = w.charAt(0).toUpperCase() + w.slice(1)
  return lang === 'es' ? `${cap} zonas, ${w} maneras de vivir la ciudad` : `${cap} zones, ${w} ways to experience the city`
}
