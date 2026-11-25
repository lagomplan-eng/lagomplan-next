// content/guia/hotel/places.ts
//
// Stable ids for the places of the hotel guide, and the fixed list of "where in the guide" a tap on a place can come from.
// Pure and light (the browser imports it): the list of every KNOWN id, which the events API checks against, is built from the
// same content on the server (./place-registry.ts).
//
// An id is the slug of the place's name as the guide spells it ("Maleza" -> "maleza", "Taquería Orinoco" -> "taqueria_orinoco").
// A place that appears in two spots (a zone tab and a mood, say) is the same name, so it has ONE id; `source` tells the spots apart.
// The ids are pinned by a fixture (__tests__/fixtures/hotel-place-ids.json): renaming a place changes its id, the test fails, and
// the decision is made on purpose: keep the old id with PLACE_ID_OVERRIDES (below) or accept the new one.

import { HOTEL_MOOD_ORDER } from './config'
import { ZONE_TAB_ORDER } from './zones'

/** The English spelling of a place that differs from the Spanish one -> the Spanish name (the one id is made from it). */
export const PLACE_NAME_ALIASES: Record<string, string> = {
  'Jardín Centenario and Plaza Hidalgo': 'Jardín Centenario y Plaza Hidalgo',
}

/** Pin an id when a place is renamed: canonical name -> the id it already had. Empty today. */
export const PLACE_ID_OVERRIDES: Record<string, string> = {}

export function slugPlace(name: string): string {
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // accents off
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/** The stable id of a place by its name in either language; null for a name that cannot make one. */
export function placeIdOf(name: string): string | null {
  const canonical = PLACE_NAME_ALIASES[name] ?? name
  const id = PLACE_ID_OVERRIDES[canonical] ?? slugPlace(canonical)
  return id.length > 0 && id.length <= PLACE_ID_MAX ? id : null
}

export const PLACE_ID_MAX = 64
/** What the database accepts in hotel_guide_events.place (see the migration). */
export const PLACE_ID_PATTERN = /^[a-z0-9_]{1,64}$/

// ── source: where in the guide the tap happened ────────────────────────────────────────────────────────────────────

export const SOURCE_PATTERN = /^[a-z0-9_]{1,32}$/

/** A tap inside a mood panel ("I'm hungry", "I want to shop"...). */
export const moodSource = (moodId: string) => `mood_${slugPlace(moodId)}`
/** A tap on a zone tab card. */
export const zoneSource = (tabKey: string) => `zone_${slugPlace(tabKey)}`
export const PLAN_QUICK_SOURCE = 'plan_quick'
export const PLAN_48H_SOURCE = 'plan_48h'

/** The fixed list: every value the events API accepts as `source`. */
export const HOTEL_PLACE_SOURCES: readonly string[] = [
  ...HOTEL_MOOD_ORDER.map(moodSource),
  ...[...new Set(Object.values(ZONE_TAB_ORDER).flat())].map(zoneSource),
  PLAN_QUICK_SOURCE,
  PLAN_48H_SOURCE,
]
