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
import { PINE, SAGE, SAND, OW, MUTED } from './tokens'

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
        border: `1px solid ${PINE}`,
        background: OW,
        marginBottom: 1,
        transition: 'border-color .15s',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{
            fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
            letterSpacing: '.2em', color: SAGE,
          }}>{product.brand}</div>
          <div style={{ background: `${PINE}0E`, padding: '3px 10px' }}>
            <span style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 7.5, fontWeight: 700,
              letterSpacing: '.16em', color: PINE,
            }}>DESTACADO</span>
          </div>
        </div>

        <div style={{
          fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700,
          color: PINE, lineHeight: 1.15, marginBottom: 6,
        }}>{product.name}</div>

        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 600,
          letterSpacing: '.1em', color: MUTED, marginBottom: 14,
        }}>— {product.tag}</div>

        <p style={{
          fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontSize: 14,
          color: '#5A5754', lineHeight: 1.75, maxWidth: 480, marginBottom: 20,
        }}>&ldquo;{product.opinion}&rdquo;</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{
              fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: PINE,
            }}>{product.price}</div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 9, color: MUTED, marginTop: 2,
            }}>{product.where}</div>
          </div>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              background: hov ? PINE : 'transparent',
              color:      hov ? SAND : PINE,
              border: `1px solid ${PINE}`,
              fontFamily: "'Manrope',sans-serif",
              fontSize: 9, fontWeight: 700, letterSpacing: '.12em',
              padding: '10px 20px', textDecoration: 'none',
              transition: 'all .14s',
            }}
          >VER EN AMAZON →</a>
        </div>
      </div>
    </div>
  )
}
