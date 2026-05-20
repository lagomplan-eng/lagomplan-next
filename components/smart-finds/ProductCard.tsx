'use client'

/**
 * components/smart-finds/ProductCard.tsx
 *
 * Standard product card for the Smart Finds Familias page. 72-px
 * IconZone on top, editorial body underneath (brand · name · tag ·
 * opinion · price + CTA).
 *
 * Client component because the prototype flips the border colour and
 * the "Ver" CTA fill on hover. State-driven hover (vs CSS-only) keeps
 * the implementation byte-aligned with the design source.
 */

import { useState } from 'react'
import type { Product } from '../../lib/smart-finds'
import IconZone from './IconZone'
import { PINE, SAGE, SURFACE, MUTED, BORDER, CARD_RADIUS } from './tokens'
import { toSentenceCase } from './text'
import { events } from '../../lib/analytics'
import { providerFromUrl } from '../../lib/analytics/provider'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: SURFACE,
        border: `1.5px solid ${hov ? PINE : BORDER}`,
        borderRadius: CARD_RADIUS,
        display: 'flex', flexDirection: 'column',
        transition: 'border-color .15s',
        position: 'relative',
        overflow: 'hidden',  // clips the IconZone's square corners to the rounded card
      }}
    >
      {/* Image-bearing products get a 300-px square-ish slot so the
          photo actually reads; SVG-icon products keep the compact
          72-px panel. Slot width follows the card (max ~608 px at
          desktop), so 300 px tall ≈ 2:1 landscape ratio. */}
      <IconZone product={product} height={product.image ? 300 : 72} idPrefix="d" />

      <div style={{
        padding: '20px 20px 18px',
        display: 'flex', flexDirection: 'column', flex: 1,
      }}>
        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 9, fontWeight: 700,
          letterSpacing: '.18em', color: SAGE, marginBottom: 6,
        }}>{product.brand}</div>

        <div style={{
          fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700,
          color: PINE, lineHeight: 1.2, marginBottom: 6,
        }}>{product.name}</div>

        {/* Tag — softer than the old "— ALL CAPS" treatment. Sentence
            case + Manrope reads as a product subtitle, not a marker. */}
        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 11, fontWeight: 500,
          color: MUTED, marginBottom: 12,
        }}>{toSentenceCase(product.tag)}</div>

        <div style={{
          fontFamily: "'Fraunces',serif", fontSize: 13,
          color: '#5A5754', lineHeight: 1.7, flex: 1, marginBottom: 16,
        }}>{product.opinion}</div>

        {/* Footer — no divider. The whitespace + change in alignment
            is enough rhythm; the borderTop read as print-y next to
            soft-corner cards elsewhere on the site. */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 12,
        }}>
          <div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 700,
              color: PINE,
            }}>{product.price}</div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 9, color: MUTED,
              marginTop: 2,
            }}>{product.where}</div>
          </div>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => events.affiliateClicked({
              provider: providerFromUrl(product.link),
              surface:  'smart-finds-card',
              category: 'product',
              meta:     { product_id: product.id, brand: product.brand },
            })}
            style={{
              background: hov ? PINE : 'transparent',
              color:      hov ? '#FFFFFF' : PINE,
              border: `1px solid ${PINE}`,
              borderRadius: 999,
              fontFamily: "'Manrope',sans-serif",
              fontSize: 11, fontWeight: 600,
              padding: '8px 16px', textDecoration: 'none',
              transition: 'all .14s', whiteSpace: 'nowrap',
            }}
          >Ver →</a>
        </div>
      </div>
    </div>
  )
}
