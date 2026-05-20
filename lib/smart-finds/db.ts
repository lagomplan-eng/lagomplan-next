/**
 * lib/smart-finds/db.ts
 *
 * Supabase-backed Smart Finds catalog fetchers. Returns data in the SAME
 * shape as the static TS exports in ./kits and ./products — so consumers
 * that today import { KITS, PRODUCTS } can migrate to the async fetchers
 * without changing how they iterate.
 *
 * Why a parallel file (rather than gutting index.ts):
 *   - Page components currently import KITS as a static value. Replacing
 *     index.ts with async fetchers would force every consumer to migrate
 *     in one go.
 *   - This file is additive: callers swap to it page-by-page once the
 *     DB seed is verified.
 *
 * After the page swaps over, mark ./kits.ts + ./products.ts as deprecated
 * (header comment) and delete in a follow-up commit.
 *
 * Caching: this module makes 2 queries (one for kits + sections, one for
 * the junction). Wrap calls in React `cache()` if the same page calls
 * multiple times in a render — for now the page calls once.
 *
 * ISR / revalidation: opt in at the route level with
 *   export const revalidate = 3600  // 1 hour
 * on whichever page consumes this. Don't add it here — keeps the module
 * stack-agnostic.
 */

import { createClient } from '@supabase/supabase-js'
import type { Kit, Product, KitProductRef, System, SubSection } from './types'

// ── Client (server-side, anon key + public read RLS) ────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } },
)

// ── DB row shapes (snake_case from Postgres) ────────────────────────────────

interface ProductRow {
  id:            string
  brand:         string
  name:          string
  tag:           string
  opinion:       string
  price:         string
  where_to_buy:  string
  link:          string
  icon:          string | null
  image:         string | null
  emoji:         string | null
  aside:         string | null
  category:      string | null
  surfaces:      string[]
}

interface KitRow {
  id:           string
  num:          string
  title:        string
  subtitle:     string
  pain_moment:  string
  scene:        string
  omit:         string | null
  persona:      'familias' | 'parejas' | 'fan'
  situations:   string[]
  content_type: 'flat' | 'systems'
  sort_order:   number
}

interface SectionRow {
  id:       string
  kit_id:   string
  position: number
  label:    string
  note:     string | null
}

interface SubsectionRow {
  id:         string
  section_id: string
  position:   number
  label:      string
}

interface JunctionRow {
  kit_id:        string
  section_id:    string | null
  subsection_id: string | null
  product_id:    string
  position:      number
  is_hero:       boolean
}

// ── Row → TS-shape mappers ──────────────────────────────────────────────────

function rowToProduct(r: ProductRow): Product {
  const product: Product = {
    id:      r.id,
    brand:   r.brand,
    name:    r.name,
    tag:     r.tag,
    opinion: r.opinion,
    price:   r.price,
    where:   r.where_to_buy,
    link:    r.link,
  }
  if (r.icon)     product.icon     = r.icon as Product['icon']
  if (r.image)    product.image    = r.image
  if (r.emoji)    product.emoji    = r.emoji
  if (r.aside)    product.aside    = r.aside
  if (r.category) product.category = r.category as Product['category']
  if (r.surfaces.length > 0) product.surfaces = r.surfaces as Product['surfaces']
  return product
}

function refFromJunction(j: JunctionRow): KitProductRef {
  return j.is_hero
    ? { productId: j.product_id, hero: true }
    : { productId: j.product_id }
}

/**
 * Assemble a Kit's content (flat | systems) from the section + subsection +
 * junction rows that belong to it. Junction rows are partitioned by their
 * (section_id, subsection_id) tuple:
 *   - (null, null)     → flat kit's product list
 *   - (sectId, null)   → system section's direct product list
 *   - (sectId, subId)  → system subsection's product list
 *
 * The function returns the discriminated union shape used by the rendering
 * layer (Kit['content']).
 */
function assembleKitContent(
  kit: KitRow,
  sections: SectionRow[],
  subsections: SubsectionRow[],
  junctions: JunctionRow[],
): Kit['content'] {
  if (kit.content_type === 'flat') {
    const flatJunctions = junctions
      .filter(j => j.section_id === null && j.subsection_id === null)
      .sort((a, b) => a.position - b.position)
    return { type: 'flat', products: flatJunctions.map(refFromJunction) }
  }

  // systems
  const systems: System[] = sections
    .sort((a, b) => a.position - b.position)
    .map(sect => {
      const sectionDirectProducts = junctions
        .filter(j => j.section_id === sect.id && j.subsection_id === null)
        .sort((a, b) => a.position - b.position)
        .map(refFromJunction)

      const subSections: SubSection[] = subsections
        .filter(s => s.section_id === sect.id)
        .sort((a, b) => a.position - b.position)
        .map(sub => {
          const subProducts = junctions
            .filter(j => j.subsection_id === sub.id)
            .sort((a, b) => a.position - b.position)
            .map(refFromJunction)
          return { label: sub.label, products: subProducts }
        })

      const sys: System = { id: sect.id, label: sect.label }
      if (sect.note) sys.note = sect.note
      if (sectionDirectProducts.length > 0) sys.products    = sectionDirectProducts
      if (subSections.length > 0)           sys.subSections = subSections
      return sys
    })
  return { type: 'systems', systems }
}

function assembleKit(
  kit: KitRow,
  sections: SectionRow[],
  subsections: SubsectionRow[],
  junctions: JunctionRow[],
): Kit {
  const out: Kit = {
    id:         kit.id,
    num:        kit.num,
    title:      kit.title,
    subtitle:   kit.subtitle,
    painMoment: kit.pain_moment,
    scene:      kit.scene,
    persona:    kit.persona,
    situations: kit.situations,
    content:    assembleKitContent(kit, sections, subsections, junctions),
  }
  if (kit.omit) out.omit = kit.omit
  return out
}

// ── Public fetchers ─────────────────────────────────────────────────────────

/**
 * Fetch every active product as a flat array, ordered by ID.
 * Used by anything that needs the catalog without kit context
 * (e.g. the Hotels-page Smart Finds strip).
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('sf_products')
    .select('*')
    .eq('is_active', true)
    .order('id')
  if (error) throw new Error(`getProducts failed: ${error.message}`)
  return (data ?? []).map(rowToProduct)
}

/**
 * Fetch every active kit in sort_order, with each kit's content[] fully
 * resolved from sections + subsections + junctions. Mirrors the shape of
 * the static `KITS` array.
 *
 * One round-trip per kind of row (4 queries total). Acceptable for an
 * editorial catalog that revalidates hourly.
 */
export async function getKits(): Promise<Kit[]> {
  const [kitsRes, sectionsRes, subsectionsRes, junctionsRes] = await Promise.all([
    supabase.from('sf_kits')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
    supabase.from('sf_kit_sections').select('*'),
    supabase.from('sf_kit_subsections').select('*'),
    supabase.from('sf_kit_section_products').select('*'),
  ])

  if (kitsRes.error)        throw new Error(`getKits (kits): ${kitsRes.error.message}`)
  if (sectionsRes.error)    throw new Error(`getKits (sections): ${sectionsRes.error.message}`)
  if (subsectionsRes.error) throw new Error(`getKits (subsections): ${subsectionsRes.error.message}`)
  if (junctionsRes.error)   throw new Error(`getKits (junctions): ${junctionsRes.error.message}`)

  const kits        = (kitsRes.data        ?? []) as KitRow[]
  const sections    = (sectionsRes.data    ?? []) as SectionRow[]
  const subsections = (subsectionsRes.data ?? []) as SubsectionRow[]
  const junctions   = (junctionsRes.data   ?? []) as JunctionRow[]

  return kits.map(k => {
    const kitSections = sections.filter(s => s.kit_id === k.id)
    const kitSectionIds = new Set(kitSections.map(s => s.id))
    const kitSubsections = subsections.filter(sub => kitSectionIds.has(sub.section_id))
    const kitJunctions = junctions.filter(j => j.kit_id === k.id)
    return assembleKit(k, kitSections, kitSubsections, kitJunctions)
  })
}

/**
 * Fetch a single kit by ID. Convenience wrapper around getKits() — for a
 * catalog this size, fetching all and filtering is cheaper than a custom
 * server-side join for one kit.
 */
export async function getKitById(id: string): Promise<Kit | null> {
  const kits = await getKits()
  return kits.find(k => k.id === id) ?? null
}

/**
 * Fetch all kits whose persona matches. The TS resolver uses a flat .filter
 * on the static array; this mirrors that contract.
 */
export async function getKitsByPersona(persona: Kit['persona']): Promise<Kit[]> {
  const kits = await getKits()
  return kits.filter(k => k.persona === persona)
}
