/**
 * components/hotels/SmartFindsSection.tsx
 *
 * "Smart finds" panel on the Hotels index. Horizontal scrolling row of
 * editorial product cards lifted from lib/smart-finds.ts. Same visual
 * language as the rest of the Hotels page — same eyebrow + headline
 * pattern, same outlined card chrome.
 *
 * Card anatomy (top to bottom):
 *   · Category eyebrow (Manrope mono-ish, sage, uppercase)
 *   · Emoji glyph (large, visual anchor)
 *   · Brand name (uppercase, mono, sage)
 *   · Product name (Manrope 800)
 *   · Outlined tag pill
 *   · Opinion paragraph (truncated by line-height)
 *   · Price · where + "Ver →" CTA
 *
 * Bilingual: only the section headers + the CTA flip locales. Product
 * copy stays in Spanish until EN translations are added — same pattern
 * as the worldcup-stays data on the same page.
 */

import Image from 'next/image'
import {
  getProducts,
  type Product as SmartFind,
  type SmartFindCategory,
} from '../../lib/smart-finds'
import { CardTitle, Eyebrow, InfoCard, SectionTitle, Tag } from '../design'

const CATEGORY_LABEL: Record<SmartFindCategory, { es: string; en: string }> = {
  avion:      { es: 'El kit del avión',          en: 'The flight kit'            },
  organizado: { es: 'El sistema',                en: 'The system'                },
  conectado:  { es: 'Internet y corriente',      en: 'Power and connectivity'    },
  familia:    { es: 'Viajar con niños',          en: 'Traveling with kids'       },
}

interface Props {
  locale: 'es' | 'en'
}

export default async function SmartFindsSection({ locale }: Props) {
  const isES = locale === 'es'

  // Pull every active product, then filter to the hotels-strip surface.
  // Replaces the static `getProductsBySurface('hotels-strip')` call —
  // editorial control now lives in Supabase Studio (toggle the
  // `surfaces` array on sf_products to add/remove from this strip).
  const allProducts = await getProducts()
  const SMART_FINDS = allProducts.filter(p => p.surfaces?.includes('hotels-strip'))

  const L = {
    eyebrow:   isES ? 'Smart finds'                                       : 'Smart finds',
    headline:  isES ? 'Cosas que sí usamos en cada viaje'                 : 'Things we actually use every trip',
    sub:       isES
      ? 'Productos de viaje que pasamos por nuestros propios viajes — no listas patrocinadas.'
      : 'Travel products that survived our own trips — not sponsored lists.',
    cta:       isES ? 'Ver →'                                             : 'View →',
  }

  return (
    <section className="pb-16">
      <div className="page-inner">
        <div className="mb-7">
          <SectionTitle eyebrow={L.eyebrow} lede={L.sub}>{L.headline}</SectionTitle>
        </div>

        {/* Horizontal-scroll card row.
            Why horizontal: 9 products is too many for a grid without
            crowding the rest of the page. Scroll keeps the section
            compact + invites browsing. */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
          {SMART_FINDS.map(p => (
            <SmartFindCard
              key={p.id}
              product={p}
              categoryLabel={CATEGORY_LABEL[p.category ?? 'organizado'][locale]}
              cta={L.cta}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────

interface CardProps {
  product:       SmartFind
  categoryLabel: string
  cta:           string
}

function SmartFindCard({ product, categoryLabel, cta }: CardProps) {
  const hasLink = product.link && product.link !== '#'

  return (
    <InfoCard as="article" size="sm" className="w-[280px] flex-none snap-start transition-transform hover:-translate-y-0.5">
      <div className="flex h-full flex-col">
        <Eyebrow className="!mb-3.5">{categoryLabel}</Eyebrow>

        {/* Image / emoji glyph. New DB-seeded products carry `image`
            (white-bg product shot); legacy hotels-strip products fall
            back to the emoji glyph from the static catalog. */}
        {product.image ? (
          <div className="relative mb-3.5 h-[140px] w-full overflow-hidden bg-white">
            <Image
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              fill
              sizes="280px"
              className="object-contain p-3"
            />
          </div>
        ) : product.emoji ? (
          <div className="mb-3 text-[32px] leading-none">{product.emoji}</div>
        ) : null}
        <p className="m-0 mb-1 font-sans text-micro font-bold uppercase tracking-[.12em] text-sage-text">{product.brand}</p>
        <CardTitle as="h3" className="mb-3 !text-h4">{product.name}</CardTitle>

        <div className="mb-3.5"><Tag>{product.tag}</Tag></div>

        {/* Opinion — clamp to 5 lines so cards stay roughly the same height */}
        <p className="m-0 mb-4 line-clamp-5 font-sans text-small text-ink-body">{product.opinion}</p>

        {/* Footer: price · where + CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-soft pt-3">
          <div className="min-w-0">
            <p className="m-0 font-sans text-small font-semibold text-pine">{product.price}</p>
            <p className="m-0 mt-0.5 font-sans text-micro font-semibold uppercase tracking-[.08em] text-label">{product.where}</p>
          </div>
          <a
            href={hasLink ? product.link : '#'}
            {...(hasLink ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})}
            className="whitespace-nowrap font-sans text-button-sm font-semibold text-pine no-underline"
          >{cta}</a>
        </div>
      </div>
    </InfoCard>
  )
}
