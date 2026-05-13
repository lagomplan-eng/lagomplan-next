/**
 * lib/smart-finds/types.ts
 *
 * Single source of truth for Smart Finds entity shapes. Designed to map
 * 1:1 onto future Supabase tables when the catalog grows past what's
 * comfortable in a TS file:
 *
 *   PRODUCTS                 → products table
 *   KITS                     → kits table
 *   kit.content.systems[]    → kit_sections table (kit_id, position, label, …)
 *   system.subSections[]     → kit_subsections (section_id, position, label)
 *   *.productIds[]           → kit_section_products join (section_id, product_id, position, is_hero)
 *
 * Why a normalized shape: a product can appear in multiple kits without
 * duplication, and the Hotels-page strip can pull from the same catalog
 * via the `surfaces` field instead of traversing kit structure.
 */

import type { IconKey } from './icons'

// ── Surfaces ─────────────────────────────────────────────────────────────────
// Where a product is allowed to appear, independent of kit membership.
// Today only 'hotels-strip' is meaningful — kits manage their own product
// references explicitly. Add new tags here as new surfaces ship.

export type SurfaceTag = 'hotels-strip'

// ── Categories ───────────────────────────────────────────────────────────────
// Display grouping used by the Hotels-page strip. Optional on Product —
// not every product belongs to a strip category.

export type SmartFindCategory = 'avion' | 'organizado' | 'conectado' | 'familia'

// ── Product ──────────────────────────────────────────────────────────────────
// Atomic catalog entry. Kit references happen through string IDs in KITS,
// not through inlining the product. Migrating to a DB later means each
// field maps to a column.

export interface Product {
  id:        string
  brand:     string
  name:      string
  tag:       string
  opinion:   string
  price:     string
  where:     string
  link:      string
  /** SVG icon key — used by kit cards (Familias page). */
  icon?:     IconKey
  /** Display emoji — used by the Hotels-page strip cards. */
  emoji?:    string
  /** Editorial connective shown under the opinion on some strip cards. */
  aside?:    string
  /** Strip display category. Only meaningful when 'hotels-strip' is in surfaces. */
  category?: SmartFindCategory
  /** Where this product is allowed to surface outside of kit membership. */
  surfaces?: SurfaceTag[]
}

// ── Kit content shapes ───────────────────────────────────────────────────────
// A kit is either a flat list of products (with one hero) or a tabbed set
// of systems. The discriminated union keeps the rendering logic simple
// while the underlying products live in the catalog.

export interface KitProductRef {
  productId: string
  /** True = render as HeroCard. Only one hero per render container. */
  hero?: boolean
}

export interface SubSection {
  label:    string
  products: KitProductRef[]
}

export interface System {
  id:           string
  label:        string
  /** Optional editorial intro shown above the products. */
  note?:        string
  /** Flat list of products at the section level. */
  products?:    KitProductRef[]
  /** OR sub-grouped products (e.g. "A — early flight / B — mid / C — backup"). */
  subSections?: SubSection[]
}

export type KitContent =
  | { type: 'flat';    products: KitProductRef[] }
  | { type: 'systems'; systems:  System[]        }

// ── Kit ──────────────────────────────────────────────────────────────────────
// Top-level container with editorial metadata. `content` carries the
// product references; resolution to actual Product records happens at the
// render boundary via resolveKitProducts(kit, PRODUCTS).

export interface Kit {
  id:         string
  num:        string
  title:      string
  subtitle:   string
  /** Pain quote shown in the masthead PainStrip and as the section opener. */
  painMoment: string
  /** Two-sentence editorial scene-setter shown under the H2. */
  scene:      string
  /** Optional "POR QUÉ NO INCLUIMOS" callout (currently only on La mochila). */
  omit?:      string
  content:    KitContent
}
