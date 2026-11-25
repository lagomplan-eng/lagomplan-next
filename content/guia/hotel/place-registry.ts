// content/guia/hotel/place-registry.ts
//
// Every place of the hotel guide and its stable id, read from the same content the page is built from: the mood picks, the zone
// tab cards (all zones, both languages) and the stops of the short plan. SERVER ONLY (it builds the guide for each zone): the
// events API checks a place id against KNOWN_PLACE_IDS, so nothing outside our own content can be written.
// The 48 hours itinerary is free text with no link per place, so it has no ids.

import { buildHotelGuideProps } from './resolve'
import { HOTEL_QUICK_PLAN } from './time'
import { HOTEL_ZONES } from './zones'
import { placeIdOf, PLACE_ID_PATTERN } from './places'

export interface PlaceEntry { id: string; name: string; spots: string[] }

function collect(): PlaceEntry[] {
  const byId = new Map<string, PlaceEntry>()
  const add = (name: string, spot: string) => {
    const id = placeIdOf(name)
    if (!id || !PLACE_ID_PATTERN.test(id)) throw new Error(`hotel place "${name}" cannot make a valid id`)
    const e = byId.get(id) ?? { id, name, spots: [] }
    if (!e.spots.includes(spot)) e.spots.push(spot)
    byId.set(id, e)
  }
  for (const zone of HOTEL_ZONES) {
    const p = buildHotelGuideProps(zone)!
    for (const lang of ['es', 'en'] as const) {
      for (const m of p.city.copy[lang].moods) for (const it of m.items) add(it.name, `mood:${m.id}`)
      for (const [key, nb] of Object.entries(p.city.neighborhoods)) for (const s of nb.spots[lang]) add(s.name, `zone:${key}`)
    }
  }
  for (const s of HOTEL_QUICK_PLAN.stops) add(s.name, 'plan:quick')
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id))
}

export const HOTEL_PLACES: PlaceEntry[] = collect()
export const KNOWN_PLACE_IDS: ReadonlySet<string> = new Set(HOTEL_PLACES.map((p) => p.id))
