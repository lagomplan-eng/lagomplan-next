/**
 * scripts/seed-smart-finds.ts
 *
 * Reads the existing static catalog (lib/smart-finds/{kits,products}.ts)
 * and writes it to Supabase via the service-role key. Idempotent — safe
 * to re-run; existing rows are upserted by their string ID and any kit's
 * sections + subsections + junctions are replaced clean each time so the
 * source TS file stays the source of truth during the cutover window.
 *
 * Run:
 *   npm run seed:smart-finds
 *   # or:
 *   npx tsx scripts/seed-smart-finds.ts
 *
 * Requires (in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run AFTER the migration has been applied:
 *   supabase migration up --project-ref qvntwqnzvspoisaglgpp
 */

import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { resolve } from 'node:path'

import { KITS } from '../lib/smart-finds/kits'
import { PRODUCTS } from '../lib/smart-finds/products'
import type { Kit, Product } from '../lib/smart-finds/types'

// ── Env ─────────────────────────────────────────────────────────────────────

loadEnv({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// ── Seed: products ──────────────────────────────────────────────────────────

async function seedProducts(products: Product[]): Promise<void> {
  console.log(`\nSeeding ${products.length} products…`)
  for (const p of products) {
    const { error } = await supabase
      .from('sf_products')
      .upsert({
        id:           p.id,
        brand:        p.brand,
        name:         p.name,
        tag:          p.tag,
        opinion:      p.opinion,
        price:        p.price,
        where_to_buy: p.where,
        link:         p.link,
        icon:         p.icon     ?? null,
        image:        p.image    ?? null,
        emoji:        p.emoji    ?? null,
        aside:        p.aside    ?? null,
        category:     p.category ?? null,
        surfaces:     p.surfaces ?? [],
        is_active:    true,
      }, { onConflict: 'id' })

    if (error) {
      console.error(`  ✗ ${p.id}: ${error.message}`)
      process.exit(1)
    }
    console.log(`  ✓ ${p.id}`)
  }
}

// ── Seed: kits + sections + subsections + junction ─────────────────────────
// Each kit is upserted; then its sections are wiped (cascade deletes
// subsections + junctions) and re-inserted from scratch. This keeps the
// re-run shape clean if the source TS file shrinks or reorders products.

async function seedKits(kits: Kit[]): Promise<void> {
  console.log(`\nSeeding ${kits.length} kits…`)
  for (let i = 0; i < kits.length; i++) {
    const k = kits[i]

    // 1. Kit header row
    const { error: kitErr } = await supabase
      .from('sf_kits')
      .upsert({
        id:           k.id,
        num:          k.num,
        title:        k.title,
        subtitle:     k.subtitle,
        pain_moment:  k.painMoment,
        scene:        k.scene,
        omit:         k.omit ?? null,
        persona:      k.persona,
        situations:   k.situations,
        content_type: k.content.type,
        sort_order:   i,
        is_active:    true,
      }, { onConflict: 'id' })

    if (kitErr) {
      console.error(`  ✗ kit ${k.id}: ${kitErr.message}`)
      process.exit(1)
    }

    // 2. Wipe existing sections (cascades to subsections + junctions)
    //    AND wipe top-level junctions for flat kits separately.
    const { error: delSecErr } = await supabase
      .from('sf_kit_sections').delete().eq('kit_id', k.id)
    if (delSecErr) {
      console.error(`  ✗ kit ${k.id} (delete sections): ${delSecErr.message}`)
      process.exit(1)
    }
    const { error: delJuncErr } = await supabase
      .from('sf_kit_section_products').delete().eq('kit_id', k.id)
    if (delJuncErr) {
      console.error(`  ✗ kit ${k.id} (delete junctions): ${delJuncErr.message}`)
      process.exit(1)
    }

    // 3. Rebuild content
    if (k.content.type === 'flat') {
      const rows = k.content.products.map((ref, pos) => ({
        kit_id:        k.id,
        section_id:    null as string | null,
        subsection_id: null as string | null,
        product_id:    ref.productId,
        position:      pos,
        is_hero:       ref.hero === true,
      }))
      if (rows.length > 0) {
        const { error } = await supabase.from('sf_kit_section_products').insert(rows)
        if (error) {
          console.error(`  ✗ kit ${k.id} (flat junction): ${error.message}`)
          process.exit(1)
        }
      }
    } else {
      // systems — insert each section, then any subsections + junctions
      for (let s = 0; s < k.content.systems.length; s++) {
        const sys = k.content.systems[s]

        const { data: sectData, error: sectErr } = await supabase
          .from('sf_kit_sections')
          .insert({
            kit_id:   k.id,
            position: s,
            label:    sys.label,
            note:     sys.note ?? null,
          })
          .select('id')
          .single()

        if (sectErr || !sectData) {
          console.error(`  ✗ kit ${k.id} section[${s}]: ${sectErr?.message ?? 'no id returned'}`)
          process.exit(1)
        }
        const sectionId = sectData.id

        // Section-direct products (no subsection)
        if (sys.products && sys.products.length > 0) {
          const rows = sys.products.map((ref, pos) => ({
            kit_id:        k.id,
            section_id:    sectionId,
            subsection_id: null as string | null,
            product_id:    ref.productId,
            position:      pos,
            is_hero:       ref.hero === true,
          }))
          const { error } = await supabase.from('sf_kit_section_products').insert(rows)
          if (error) {
            console.error(`  ✗ kit ${k.id} section[${s}] junction: ${error.message}`)
            process.exit(1)
          }
        }

        // Subsections
        if (sys.subSections && sys.subSections.length > 0) {
          for (let sub = 0; sub < sys.subSections.length; sub++) {
            const subSec = sys.subSections[sub]
            const { data: subData, error: subErr } = await supabase
              .from('sf_kit_subsections')
              .insert({
                section_id: sectionId,
                position:   sub,
                label:      subSec.label,
              })
              .select('id')
              .single()

            if (subErr || !subData) {
              console.error(`  ✗ kit ${k.id} section[${s}] sub[${sub}]: ${subErr?.message ?? 'no id'}`)
              process.exit(1)
            }
            const subId = subData.id

            const rows = subSec.products.map((ref, pos) => ({
              kit_id:        k.id,
              section_id:    sectionId,
              subsection_id: subId,
              product_id:    ref.productId,
              position:      pos,
              is_hero:       ref.hero === true,
            }))
            if (rows.length > 0) {
              const { error } = await supabase.from('sf_kit_section_products').insert(rows)
              if (error) {
                console.error(`  ✗ kit ${k.id} sub[${sub}] junction: ${error.message}`)
                process.exit(1)
              }
            }
          }
        }
      }
    }

    console.log(`  ✓ ${k.id} (${k.content.type})`)
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`Smart Finds catalog → Supabase`)
  console.log(`URL: ${SUPABASE_URL}`)
  console.log(`Service-role key: ${SERVICE_KEY!.slice(0, 10)}… (len=${SERVICE_KEY!.length})`)

  // PRODUCTS is exported as Record<id, Product>; flatten for the seeder.
  const productList = Object.values(PRODUCTS)

  await seedProducts(productList)
  await seedKits(KITS)

  console.log(`\n✓ Done. Seeded ${productList.length} products and ${KITS.length} kits.`)
}

main().catch(err => {
  console.error('\n✗ Seed failed:', err)
  process.exit(1)
})
