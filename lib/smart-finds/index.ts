/**
 * lib/smart-finds/index.ts
 *
 * Public barrel for the Smart Finds module. Anything outside this
 * directory should import from here, not from the individual files —
 * keeps internal organization free to change.
 */

export type {
  Product,
  Kit,
  KitContent,
  KitProductRef,
  System,
  SubSection,
  SurfaceTag,
  SmartFindCategory,
  Persona,
} from './types'

export type { IconKey } from './icons'
export { ICONS } from './icons'

export { PRODUCTS, getProduct, getProductsBySurface } from './products'
export { KITS, getKit, getKitsByPersona } from './kits'

import type { Product, Kit, KitProductRef } from './types'
import { getProduct } from './products'

// ── Resolution helpers ───────────────────────────────────────────────────
// Components render best when they receive resolved Product records,
// not productId strings. These helpers do that resolution at the page
// boundary so the catalog stays the single source of truth.

export interface ResolvedProductRef {
  product: Product
  hero?:   boolean
}

/**
 * Resolve a list of KitProductRef into hydrated products. The optional
 * `hero` flag carries through so the card row can pick which entry
 * renders as HeroCard.
 */
export function resolveProductRefs(refs: KitProductRef[]): ResolvedProductRef[] {
  return refs.map(ref => ({
    product: getProduct(ref.productId),
    hero:    ref.hero === true,
  }))
}

/**
 * For a flat kit: returns { hero, rest } where `hero` is the single
 * product flagged hero:true (or the first product if none flagged) and
 * `rest` is the remaining products in declaration order.
 *
 * For a systems kit: throws — callers must resolve per-system using
 * resolveProductRefs() inside each system.
 */
export function resolveFlatKit(kit: Kit): { hero: Product; rest: Product[] } {
  if (kit.content.type !== 'flat') {
    throw new Error(`[smart-finds] resolveFlatKit called on non-flat kit '${kit.id}'`)
  }
  const refs   = kit.content.products
  const heroIx = refs.findIndex(r => r.hero) >= 0 ? refs.findIndex(r => r.hero) : 0
  const hero   = getProduct(refs[heroIx].productId)
  const rest   = refs
    .filter((_, i) => i !== heroIx)
    .map(r => getProduct(r.productId))
  return { hero, rest }
}
