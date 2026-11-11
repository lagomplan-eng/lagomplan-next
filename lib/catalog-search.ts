/**
 * lib/catalog-search.ts
 *
 * The search shared by Experiencias and Hoteles (pure; no React, no registry). It matches,
 * accent- and case-insensitively, by substring in both locales' names:
 *
 *   regions       (only those the page can filter by, and that have items)
 *   destinations  with items on the page → a filter option
 *                 without items          → "guide only" (name + link to the guide)
 *   items         (Hoteles: hotel names) → picking one selects its destination and scrolls to it
 *
 * Order of hits: regions, destinations, items. Search never comes back empty for a
 * destination we have a guide for.
 */

export const normSearch = (v: string): string => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export interface SearchDestination {
  slug: string
  name: string
  /** Name in the other locale. */
  altName: string
  /** Items on the page for this destination; 0 = guide only. */
  count: number
}

export interface SearchItem {
  id: string
  name: string
  altName?: string
  destinationSlug: string
}

export type CatalogHit<R extends string = string> =
  | { kind: 'region'; region: R }
  | { kind: 'destination'; slug: string }
  | { kind: 'guide-only'; slug: string }
  | { kind: 'item'; id: string; destinationSlug: string }

export interface CatalogSearchInput<R extends string = string> {
  destinations: SearchDestination[]
  /** Region names in both locales; omit when the page has no region filter. */
  regionNames?: Record<R, { es: string; en: string }>
  regionsWithItems?: ReadonlySet<R>
  items?: SearchItem[]
  /** Destinations already chosen. */
  excludeSlugs?: readonly string[]
  limit?: number
}

export function searchCatalog<R extends string = string>(query: string, input: CatalogSearchInput<R>): CatalogHit<R>[] {
  const q = normSearch(query.trim())
  if (!q) return []
  const { destinations, regionNames, regionsWithItems, items = [], excludeSlugs = [], limit = 10 } = input
  const hits: CatalogHit<R>[] = []

  if (regionNames && regionsWithItems) {
    for (const r of Object.keys(regionNames) as R[]) {
      if (!regionsWithItems.has(r)) continue
      const n = regionNames[r]
      if (normSearch(n.es).includes(q) || normSearch(n.en).includes(q)) hits.push({ kind: 'region', region: r })
    }
  }
  for (const d of destinations) {
    if (excludeSlugs.includes(d.slug)) continue
    if (normSearch(d.name).includes(q) || normSearch(d.altName).includes(q)) hits.push({ kind: d.count > 0 ? 'destination' : 'guide-only', slug: d.slug })
  }
  for (const it of items) {
    if (normSearch(it.name).includes(q) || (it.altName && normSearch(it.altName).includes(q))) {
      hits.push({ kind: 'item', id: it.id, destinationSlug: it.destinationSlug })
    }
  }
  return hits.slice(0, limit)
}
