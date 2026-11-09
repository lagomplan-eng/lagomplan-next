/**
 * lib/experiences/filters.ts
 *
 * Pure filter logic for the Experiencias hub: URL <-> state, matching, facet
 * counts and the "does this filter group have enough data" rule. No React, no
 * Next, no registry imports (middleware imports FILTER_PARAMS from here).
 *
 * Rules (Elena, 2026-10-30):
 *  - Groups combine with AND.
 *  - An experience missing a field matches only that filter's default value
 *    (Para quién = Todos, Tipo = none selected, Duración = Cualquiera).
 *  - A group renders only if >= 50% of the hub's bookable experiences have that field.
 *  - A value with zero matches doesn't render as a chip (unless it is selected).
 *  - Order is never changed by filtering.
 */

import { normSearch, searchCatalog } from '../catalog-search'
import type { Destination, Experience, ExperienceCategory, ExperienceDuration, GuideRegion, Persona } from './types'

/** Query params the hub reads. Their presence on a URL means "filtered" (-> noindex). */
export const FILTER_PARAMS = ['region', 'destino', 'para', 'tipo', 'duracion'] as const

export const REGIONS: readonly GuideRegion[] = ['mexico', 'latam', 'norteamerica', 'europa', 'asia', 'africa', 'oceania']
export const PERSONAS: readonly Persona[] = ['familia', 'pareja', 'amigos']
export const CATEGORIES: readonly ExperienceCategory[] = ['comida', 'cultura', 'naturaleza', 'aventura', 'excursion', 'bienestar']
export const DURATIONS: readonly ExperienceDuration[] = ['corto', 'medio', 'completo']

/** A group renders only when at least this share of bookable experiences carry its field. */
export const MIN_COVERAGE = 0.5

export interface FilterState {
  region: GuideRegion | null
  destinos: string[]
  para: Persona | null
  tipos: ExperienceCategory[]
  duracion: ExperienceDuration | null
}

export const EMPTY_FILTERS: FilterState = { region: null, destinos: [], para: null, tipos: [], duracion: null }

export type FilterGroup = 'region' | 'destino' | 'para' | 'tipo' | 'duracion'

// ── URL <-> state ──────────────────────────────────────────────────────────────

const pickOne = <T extends string>(v: string | null | undefined, allowed: readonly T[]): T | null =>
  v && (allowed as readonly string[]).includes(v) ? (v as T) : null

const pickMany = <T extends string>(v: string | null | undefined, allowed: readonly T[] | null): T[] => {
  if (!v) return []
  const out: T[] = []
  for (const part of v.split(',')) {
    const s = part.trim() as T
    if (s && (allowed === null || (allowed as readonly string[]).includes(s)) && !out.includes(s)) out.push(s)
  }
  return out
}

export function parseFilters(sp: { get(name: string): string | null }): FilterState {
  return {
    region: pickOne(sp.get('region'), REGIONS),
    destinos: pickMany<string>(sp.get('destino'), null),
    para: pickOne(sp.get('para'), PERSONAS),
    tipos: pickMany(sp.get('tipo'), CATEGORIES),
    duracion: pickOne(sp.get('duracion'), DURATIONS),
  }
}

/** Stable-order query string (no leading '?'). Empty string when nothing is selected. */
export function serializeFilters(s: FilterState): string {
  const p: string[] = []
  if (s.region) p.push(`region=${s.region}`)
  if (s.destinos.length) p.push(`destino=${s.destinos.map(encodeURIComponent).join(',')}`)
  if (s.para) p.push(`para=${s.para}`)
  if (s.tipos.length) p.push(`tipo=${s.tipos.join(',')}`)
  if (s.duracion) p.push(`duracion=${s.duracion}`)
  return p.join('&')
}

/** True when any filter param is present in a URLSearchParams-like (used by middleware). */
export function hasFilterParams(sp: { has(name: string): boolean }): boolean {
  return FILTER_PARAMS.some(k => sp.has(k))
}

/**
 * Drop values that cannot match anything: unknown destinations, and destinations
 * outside the selected region (changing region narrows the destination choice).
 */
export function sanitizeFilters(s: FilterState, all: Experience[]): FilterState {
  const regionOf = new Map(all.map(e => [e.destinationSlug, e.region]))
  return {
    ...s,
    destinos: s.destinos.filter(d => regionOf.has(d) && (!s.region || regionOf.get(d) === s.region)),
  }
}

export function activeFilterCount(s: FilterState): number {
  return (s.region ? 1 : 0) + s.destinos.length + (s.para ? 1 : 0) + s.tipos.length + (s.duracion ? 1 : 0)
}

// ── matching ───────────────────────────────────────────────────────────────────

/** Does `e` pass every active group except (optionally) `skip`? */
export function matches(e: Experience, s: FilterState, skip?: FilterGroup): boolean {
  if (skip !== 'region' && s.region && e.region !== s.region) return false
  if (skip !== 'destino' && s.destinos.length && !s.destinos.includes(e.destinationSlug)) return false
  if (skip !== 'para' && s.para && !e.personas.includes(s.para)) return false
  if (skip !== 'tipo' && s.tipos.length && !(e.category && s.tipos.includes(e.category))) return false
  if (skip !== 'duracion' && s.duracion && e.duration !== s.duracion) return false
  return true
}

/** Filtering never reorders: the input order (editorial) is preserved. */
export function filterExperiences(all: Experience[], s: FilterState): Experience[] {
  return all.filter(e => matches(e, s))
}

// ── data coverage + facets ───────────────────────────────────────────────────

export type CoverageField = 'personas' | 'category' | 'duration'

/** Share of experiences that carry the field (0..1). */
export function coverage(all: Experience[], field: CoverageField): number {
  if (!all.length) return 0
  const has = (e: Experience) => (field === 'personas' ? e.personas.length > 0 : Boolean(e[field]))
  return all.filter(has).length / all.length
}

/** Should the filter group for this field render, given the hub's full bookable set? */
export function groupVisible(all: Experience[], field: CoverageField): boolean {
  return coverage(all, field) >= MIN_COVERAGE
}

/**
 * How many experiences each value of `group` would show, given every OTHER
 * active group. Selected values are always kept (so they can be deselected).
 */
export function facetCounts(all: Experience[], s: FilterState, group: FilterGroup): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const e of all) {
    if (!matches(e, s, group)) continue
    const keys: string[] =
      group === 'region' ? [e.region] :
      group === 'destino' ? [e.destinationSlug] :
      group === 'para' ? e.personas :
      group === 'tipo' ? (e.category ? [e.category] : []) :
      (e.duration ? [e.duration] : [])
    for (const k of keys) counts[k] = (counts[k] ?? 0) + 1
  }
  return counts
}

export interface DestinationOption { slug: string; name: string; region: GuideRegion }

/** Unique destinations in editorial (first-appearance) order. */
export function destinationOptions(all: Experience[]): DestinationOption[] {
  const seen = new Map<string, DestinationOption>()
  for (const e of all) if (!seen.has(e.destinationSlug)) seen.set(e.destinationSlug, { slug: e.destinationSlug, name: e.destinationName, region: e.region })
  return [...seen.values()]
}

// ── hub search ───────────────────────────────────────────────────────────────

export { normSearch }

export type SearchHit =
  | { kind: 'region'; region: GuideRegion }
  | { kind: 'destination'; slug: string }
  | { kind: 'guide-only'; slug: string }

/**
 * Hub search: regions (both locales' names) first, then destinations (both locales'
 * names). A destination with bookable experiences is a filter option; one without is
 * a "guide only" hit. Thin wrapper over the shared lib/catalog-search.ts.
 */
export function searchHub(
  query: string,
  destinations: Destination[],
  regionNames: Record<GuideRegion, { es: string; en: string }>,
  regionsWithExperiences: ReadonlySet<GuideRegion>,
  excludeSlugs: readonly string[] = [],
  limit = 10,
): SearchHit[] {
  return searchCatalog<GuideRegion>(query, {
    destinations: destinations.map(d => ({ slug: d.slug, name: d.name, altName: d.altName, count: d.bookable })),
    regionNames, regionsWithItems: regionsWithExperiences, excludeSlugs, limit,
  }) as SearchHit[]
}
