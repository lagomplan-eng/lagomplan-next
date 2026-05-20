/**
 * lib/hotels-neighborhoods.ts
 *
 * Source-of-truth aggregator for the "Dónde quedarse — por barrio"
 * section on the Hotels index. Mirrors the same two-corpora rule the
 * hotel feed uses: data only comes from curated guides + worldcup city
 * guides, no synthesized records.
 *
 * Resolution order per city:
 *   1. Worldcup `stayNeighborhoods` (10 cities have rich, opinionated
 *      editorial copy already — recommended / alternative / avoid items
 *      with intro + body). Used as-is.
 *   2. Scaffold from hotel `type` / `area` fields — extracts unique
 *      neighborhood names so the editorial team can fill body copy
 *      later. Empty bodies are filtered out at render time so a
 *      scaffold doesn't ship as a blank card.
 */

import { getAllCityGuides }                       from './worldcup/data'
import { getAllFlatGuides, resolveCanonicalSlug } from './data/guides'
import type { StayNeighborhoodItem }              from './worldcup/types'
import type { Locale }                            from '../i18n'

// ── Public types ─────────────────────────────────────────────────────────────

export interface NeighborhoodItem {
  id:    string                              // stable slug for the item
  kind:  'recommended' | 'alternative' | 'avoid' | 'scaffold'
  title: string                              // e.g. "Base recomendada: Condesa / Roma Norte"
  body:  string                              // long-form editorial paragraph
}

export interface CityNeighborhoods {
  cityId:    string                          // matches the hotel `sourceGuide` ids
  cityName:  string                          // localized display label
  intro:     string                          // optional one-paragraph framing
  items:     NeighborhoodItem[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Pulls neighborhood names out of FlatGuide hotel records by reading the
 * `type` field, which conventionally encodes "<kind> · <neighborhood>"
 * (e.g. "Hotel boutique · Roma Norte"). Returns unique names in the
 * order they first appear in the hotel list.
 */
function extractGuideNeighborhoodNames(hotelTypes: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const t of hotelTypes) {
    const parts = (t ?? '').split('·')
    if (parts.length < 2) continue
    const name = parts.slice(1).join('·').trim()
    if (!name) continue
    if (seen.has(name)) continue
    seen.add(name)
    out.push(name)
  }
  return out
}

/**
 * Same idea, but for worldcup `Stay.area` strings — used as a fallback
 * for the 6 worldcup cities that don't carry a curated `stayNeighborhoods`
 * block (atlanta, houston, los-angeles, new-york, philadelphia, toronto).
 */
function extractWorldcupNeighborhoodNames(areas: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const a of areas) {
    const name = (a ?? '').trim()
    if (!name) continue
    if (seen.has(name)) continue
    seen.add(name)
    out.push(name)
  }
  return out
}

// ── Aggregation ──────────────────────────────────────────────────────────────

/**
 * Returns every city's neighborhood block. Cities whose data is purely
 * scaffolds (no editorial body filled in) come back with `items: []` so
 * the caller can decide whether to render them — the section component
 * skips empty cities to keep blank cards off the page.
 */
export function getAllCityNeighborhoods(locale: Locale): CityNeighborhoods[] {
  const out: CityNeighborhoods[] = []

  // ── Worldcup cities ────────────────────────────────────────────────────────
  for (const [cityId, city] of getAllCityGuides(locale)) {
    if (city.stayNeighborhoods && city.stayNeighborhoods.items.length > 0) {
      // Layer 1 — rich editorial content already in the city guide.
      out.push({
        cityId,
        cityName: city.city,
        intro:    city.stayNeighborhoods.intro ?? '',
        items:    city.stayNeighborhoods.items.map((it: StayNeighborhoodItem, i: number) => ({
          id:    `${cityId}-${slugify(it.title)}-${i}`,
          kind:  it.kind,
          title: it.title,
          body:  it.body,
        })),
      })
    } else {
      // Layer 2 (worldcup, no stayNeighborhoods) — scaffold from stay `area`.
      const names = extractWorldcupNeighborhoodNames(
        (city.stays ?? []).map(s => s.area),
      )
      out.push({
        cityId,
        cityName: city.city,
        intro:    '',
        items: names.map(name => ({
          id:    `${cityId}-${slugify(name)}`,
          kind:  'scaffold',
          title: name,
          body:  '',
        })),
      })
    }
  }

  // ── Curated guide cities ───────────────────────────────────────────────────
  for (const { canonical, flat } of getAllFlatGuides(locale)) {
    // Skip if a worldcup entry already used this slug (no overlap today, but
    // defensive — keeps the list deduped if a city ever appears in both).
    if (out.some(c => c.cityId === canonical)) continue

    const names = extractGuideNeighborhoodNames(flat.hotels.map(h => h.type))
    out.push({
      cityId:   resolveCanonicalSlug(canonical),
      cityName: flat.hero.title,
      intro:    '',
      items: names.map(name => ({
        id:    `${canonical}-${slugify(name)}`,
        kind:  'scaffold',
        title: name,
        body:  '',
      })),
    })
  }

  return out
}

/**
 * Convenience filter: returns only cities with at least one neighborhood
 * item whose `body` is non-empty. That's what the section component
 * renders — scaffold-only cities stay hidden until the editorial team
 * fills body copy.
 */
export function getRenderableCityNeighborhoods(locale: Locale): CityNeighborhoods[] {
  return getAllCityNeighborhoods(locale).filter(
    c => c.items.some(it => it.body.trim().length > 0),
  )
}
