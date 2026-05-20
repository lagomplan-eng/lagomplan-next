'use client'

/**
 * components/smart-finds/HeroCard.tsx
 *
 * Full-width horizontal hero card for the featured product in each kit
 * section. 200-px IconZone on the left, editorial body on the right.
 * Reads as the editorial anchor for the kit; the 2×2 grid below
 * supports it.
 *
 * Client component for the same border-flip hover behaviour as
 * ProductCard. Stacks vertically below 720px so the icon zone doesn't
 * crush on mobile.
 */

import { useState } from 'react'
import type { Product } from '../../lib/smart-finds'
import IconZone from './IconZone'
import { PINE, SAGE, SAND, SURFACE, MUTED, BORDER, CARD_RADIUS } from './tokens'
import { toSentenceCase } from './text'
import { events } from '../../lib/analytics'
import { providerFromUrl } from '../../lib/analytics/provider'

interface Props {
  product: Product
}

export default function HeroCard({ product }: Props) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        border: `1.5px solid ${hov ? PINE : BORDER}`,
        borderRadius: CARD_RADIUS,
        background: SURFACE,
        marginBottom: 16,                // separates hero from the grid below
        transition: 'border-color .15s',
        overflow: 'hidden',              // clips IconZone corners to the rounded card
      }}
    >
      {/* Icon zone — left column, fixed 200px on desktop. On mobile the
          parent flex-wraps and this becomes full-width on top. */}
      <div style={{
        width: 200, minWidth: 200, flexShrink: 0,
        background: hov ? `${PINE}08` : SAND,
        transition: 'background .2s',
        flexGrow: 1, // lets it span when wrapped on mobile
      }}>
        <IconZone product={product} height={220} background="transparent" idPrefix="h" />
      </div>

      {/* Content — right column */}
      <div style={{
        flex: 1, minWidth: 280,
        padding: '28px 32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            fontFamily: "'Manrope',sans-serif", fontSize: 9, fontWeight: 700,
            letterSpacing: '.18em', color: SAGE,
          }}>{product.brand}</div>
          {/* DESTACADO — proper rounded pill instead of the square Pine-tinted
              chip; matches the archetype pill chrome on Hotels. */}
          <div style={{
            background: `${PINE}10`,
            borderRadius: 999,
            padding: '3px 10px',
          }}>
            <span style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 9, fontWeight: 700,
              letterSpacing: '.12em', color: PINE,
            }}>Destacado</span>
          </div>
        </div>

        <div style={{
          fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700,
          color: PINE, lineHeight: 1.15, marginBottom: 8,
        }}>{product.name}</div>

        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 11, fontWeight: 500,
          color: MUTED, marginBottom: 14, letterSpacing: 0,
        }}>{toSentenceCase(product.tag)}</div>

        <p style={{
          fontFamily: "'Fraunces',serif", fontSize: 15,
          color: '#5A5754', lineHeight: 1.75, maxWidth: 480, marginBottom: 22,
        }}>{product.opinion}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 16, fontWeight: 700, color: PINE,
            }}>{product.price}</div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 11, color: MUTED, marginTop: 2,
            }}>{product.where}</div>
          </div>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => events.affiliateClicked({
              provider: providerFromUrl(product.link),
              surface:  'smart-finds-hero',
              category: 'product',
              meta:     { product_id: product.id, brand: product.brand },
            })}
            style={{
              background: hov ? PINE : 'transparent',
              color:      hov ? '#FFFFFF' : PINE,
              border: `1px solid ${PINE}`,
              borderRadius: 999,
              fontFamily: "'Manrope',sans-serif",
              fontSize: 13, fontWeight: 600,
              padding: '10px 22px', textDecoration: 'none',
              transition: 'all .14s', whiteSpace: 'nowrap',
            }}
          >Ver en Amazon →</a>
        </div>
      </div>
    </div>
  )
}
