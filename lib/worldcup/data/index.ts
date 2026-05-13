/**
 * lib/worldcup/data/index.ts
 *
 * Aggregate exporter for all worldcup city guides. Each per-city file
 * exports `es` and (optionally) `en` as CityGuide records — this barrel
 * re-exports them as a single map so consumers like the Hotels index
 * can iterate all cities without hard-coding the list at each call site.
 *
 * To add a new city: drop a `<slug>.ts` next to this file with the
 * standard `export const es: CityGuide = {...}` shape, then add it to
 * the imports + map below.
 */

import type { CityGuide } from '../types'

import * as atlanta       from './atlanta'
import * as boston        from './boston'
import * as cdmx          from './cdmx'
import * as dallas        from './dallas'
import * as guadalajara   from './guadalajara'
import * as houston       from './houston'
import * as kansas        from './kansas'
import * as losAngeles    from './los-angeles'
import * as miami         from './miami'
import * as monterrey     from './monterrey'
import * as newYork       from './new-york'
import * as philadelphia  from './philadelphia'
import * as sanFrancisco  from './san-francisco'
import * as seattle       from './seattle'
import * as toronto       from './toronto'
import * as vancouver     from './vancouver'

// City id → module map. The id matches the filename stem; consumers can
// build URLs as `/<locale>/<mundial|worldcup>/<id>`.
const CITY_MODULES: Record<string, { es: CityGuide; en?: CityGuide }> = {
  atlanta,
  boston,
  cdmx,
  dallas,
  guadalajara,
  houston,
  kansas,
  'los-angeles':   losAngeles,
  miami,
  monterrey,
  'new-york':      newYork,
  philadelphia,
  'san-francisco': sanFrancisco,
  seattle,
  toronto,
  vancouver,
}

/**
 * Returns every city guide in the requested locale, falling back to ES
 * for cities that haven't been translated to EN yet. Caller gets back
 * a `[cityId, CityGuide]` tuple list for easy iteration.
 */
export function getAllCityGuides(locale: 'es' | 'en'): Array<[string, CityGuide]> {
  const out: Array<[string, CityGuide]> = []
  for (const [id, mod] of Object.entries(CITY_MODULES)) {
    const guide = locale === 'en' && mod.en ? mod.en : mod.es
    if (guide) out.push([id, guide])
  }
  return out
}

/**
 * Maps a worldcup city id to its hero image path in `/public`.
 * The filenames in the WC images directory don't all match the city ids
 * (CDMX is "CDMX.png", New York is "NYC_NJ.png", etc.) — this is the
 * canonical lookup. Unknown ids return null so consumers can fall back.
 */
export function getCityHeroImage(cityId: string): string | null {
  const map: Record<string, string> = {
    atlanta:         '/images/WC images/Atlanta.png',
    boston:          '/images/WC images/Boston.png',
    cdmx:            '/images/WC images/CDMX.png',
    dallas:          '/images/WC images/Dallas.png',
    guadalajara:     '/images/WC images/Guadalajara.png',
    houston:         '/images/WC images/Houston.png',
    kansas:          '/images/WC images/Kansas City.png',
    'los-angeles':   '/images/WC images/Los Angeles.png',
    miami:           '/images/WC images/Miami.png',
    monterrey:       '/images/WC images/Monterrey.png',
    'new-york':      '/images/WC images/NYC_NJ.png',
    philadelphia:    '/images/WC images/Filadelfia.png',
    'san-francisco': '/images/WC images/San Francisco.png',
    seattle:         '/images/WC images/Seattle.png',
    toronto:         '/images/WC images/Toronto.png',
    vancouver:       '/images/WC images/Vancouver.png',
  }
  return map[cityId] ?? null
}
