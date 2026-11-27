// lib/hotels/report/labels.ts — the readable name of a stored id (mood_hungry, zone_roma_norte, plan_48h, a place id).
// SERVER ONLY: place names come from the place registry, which builds the guide.
import { HOTEL_MOOD_ORDER } from '../../../content/guia/hotel/config'
import { ZONE_TAB_ORDER } from '../../../content/guia/hotel/zones'
import { buildHotelGuideProps } from '../../../content/guia/hotel/resolve'
import { HOTEL_PLACES } from '../../../content/guia/hotel/place-registry'
import { PLAN_48H_SOURCE, PLAN_QUICK_SOURCE, moodSource, zoneSource } from '../../../content/guia/hotel/places'
import type { Lang } from './types'

const moods = (lang: Lang) => buildHotelGuideProps('condesa')!.city.copy[lang].moods
const ZONES = [...new Set(Object.values(ZONE_TAB_ORDER).flat())]
const PLACE_NAMES = new Map(HOTEL_PLACES.map((p) => [p.id, p.name]))

export function moodLabel(source: string, lang: Lang): string {
  const id = HOTEL_MOOD_ORDER.find((m) => moodSource(m) === source)
  return (id && moods(lang).find((m) => m.id === id)?.label) || source
}
export function zoneLabel(source: string): string { return ZONES.find((z) => zoneSource(z) === source) ?? source }
export function planLabel(source: string, lang: Lang): string {
  if (source === PLAN_QUICK_SOURCE) return lang === 'es' ? 'Plan corto (pocas horas)' : 'Short plan (a few hours)'
  if (source === PLAN_48H_SOURCE) return lang === 'es' ? 'Plan de 48 horas' : '48-hour plan'
  return source
}
export function placeName(id: string): string { return PLACE_NAMES.get(id) ?? id }
/** Where in the guide a place's Map link was tapped. */
export function whereLabel(source: string, lang: Lang): string {
  if (source.startsWith('mood_')) return `${lang === 'es' ? 'Ánimo' : 'Mood'}: ${moodLabel(source, lang)}`
  if (source.startsWith('zone_')) return `${lang === 'es' ? 'Zona' : 'Zone'}: ${zoneLabel(source)}`
  if (source.startsWith('plan_')) return planLabel(source, lang)
  return source
}
