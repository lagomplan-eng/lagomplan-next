'use client'

/**
 * components/smart-finds/MochilaKit.tsx
 *
 * Renders a 'systems' kit (currently only Kit 02 "La mochila"): tab
 * row at top, active system body below. Tab state is local; switching
 * tabs is instant — no transition / no fetch.
 *
 * On mobile (<640px) the tab row scrolls horizontally instead of
 * wrapping so the visual rhythm stays a single line of pills.
 *
 * Client component for the tab state.
 */

import { useState } from 'react'
import type { Kit, System } from '../../lib/smart-finds'
import { resolveProductRefs } from '../../lib/smart-finds'
import ProductCard from './ProductCard'
import HeroCard from './HeroCard'
import { PINE, MUTED, BORDER } from './tokens'
import type { Product } from '../../lib/smart-finds'

interface Props {
  kit: Kit
}

export default function MochilaKit({ kit }: Props) {
  if (kit.content.type !== 'systems') return null
  const systems = kit.content.systems
  const [activeId, setActiveId] = useState(systems[0]?.id ?? '')
  const active = systems.find(s => s.id === activeId) ?? systems[0]

  return (
    <div>
      {/* Tab bar — horizontal scroll on narrow viewports */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${BORDER}`,
        marginBottom: 32,
        gap: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {systems.map(s => {
          const isActive = s.id === active.id
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              style={{
                padding: '12px 24px', border: 'none', background: 'transparent',
                cursor: 'pointer',
                fontFamily: "'Manrope',sans-serif", fontSize: 9, fontWeight: 700,
                letterSpacing: '.16em',
                color: isActive ? PINE : MUTED,
                borderBottom: isActive ? `2px solid ${PINE}` : '2px solid transparent',
                marginBottom: -1,
                transition: 'color .15s, border-color .15s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Active system body */}
      <SystemContent system={active} />
    </div>
  )
}

// ── System body ─────────────────────────────────────────────────────────────

function SystemContent({ system }: { system: System }) {
  // Flat products at the system level
  const flatProducts = system.products
    ? resolveProductRefs(system.products)
    : []

  // Sub-grouped products
  const subSections = system.subSections ?? []

  return (
    <div>
      {system.note && (
        <p style={{
          fontFamily: "'Fraunces',serif",
          fontSize: 13, color: MUTED, marginBottom: 20,
        }}>{system.note}</p>
      )}

      {flatProducts.length > 0 && (
        <ProductRow products={flatProducts} />
      )}

      {subSections.map(sub => {
        const products = resolveProductRefs(sub.products)
        return (
          <div key={sub.label} style={{ marginBottom: 28 }}>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
              letterSpacing: '.16em', color: MUTED,
              paddingBottom: 10, marginBottom: 16,
              borderBottom: `1px solid ${BORDER}`,
            }}>{sub.label}</div>
            <ProductRow products={products} />
          </div>
        )
      })}
    </div>
  )
}

// ── Resolved-product row ───────────────────────────────────────────────────
// Picks the hero (if any) and renders it as HeroCard above, with the
// remaining products in a 1/2/3-column grid that collapses on mobile.

function ProductRow({ products }: { products: { product: Product; hero?: boolean }[] }) {
  const heroIx = products.findIndex(p => p.hero)
  const hero   = heroIx >= 0 ? products[heroIx] : null
  const rest   = heroIx >= 0
    ? products.filter((_, i) => i !== heroIx)
    : products

  // Cap at 3 columns to match the prototype; 1 column when there's
  // only one product (avoids a left-aligned narrow card on a wide grid).
  const cols = Math.min(rest.length || 1, 3)
  const colClass =
    cols === 3 ? 'grid grid-cols-3 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1' :
    cols === 2 ? 'grid grid-cols-2 max-[640px]:grid-cols-1' :
                 'grid grid-cols-1'

  return (
    <div>
      {hero && (
        <div style={{ marginBottom: rest.length > 0 ? 16 : 0 }}>
          <HeroCard product={hero.product} />
        </div>
      )}
      {rest.length > 0 && (
        <div className={colClass} style={{ gap: 16 }}>
          {rest.map(p => <ProductCard key={p.product.id} product={p.product} />)}
        </div>
      )}
    </div>
  )
}
