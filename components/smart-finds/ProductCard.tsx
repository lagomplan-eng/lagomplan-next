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
import { PINE, SAGE, SAND, OW, MUTED, BORDER } from './tokens'

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
        background: OW,
        border: `1px solid ${hov ? PINE : BORDER}`,
        display: 'flex', flexDirection: 'column',
        transition: 'border-color .15s',
        position: 'relative',
      }}
    >
      <IconZone product={product} height={72} idPrefix="d" />

      <div style={{
        padding: '18px 18px 16px',
        display: 'flex', flexDirection: 'column', flex: 1,
      }}>
        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
          letterSpacing: '.2em', color: SAGE, marginBottom: 4,
        }}>{product.brand}</div>

        <div style={{
          fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700,
          color: PINE, lineHeight: 1.2, marginBottom: 5,
        }}>{product.name}</div>

        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 600,
          letterSpacing: '.1em', color: MUTED, marginBottom: 12,
        }}>— {product.tag}</div>

        <div style={{
          fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontSize: 12,
          color: '#5A5754', lineHeight: 1.7, flex: 1, marginBottom: 14,
        }}>&ldquo;{product.opinion}&rdquo;</div>

        <div style={{
          borderTop: `1px solid ${BORDER}`, paddingTop: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700,
              color: PINE,
            }}>{product.price}</div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 8, color: MUTED,
              marginTop: 2,
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
              fontSize: 8, fontWeight: 700, letterSpacing: '.1em',
              padding: '7px 12px', textDecoration: 'none',
              transition: 'all .14s',
            }}
          >VER →</a>
        </div>
      </div>
    </div>
  )
}
