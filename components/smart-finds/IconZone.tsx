/**
 * components/smart-finds/IconZone.tsx
 *
 * Shared icon surface used by both ProductCard and HeroCard. Renders
 * the SAND-coloured panel with a dotted PINE pattern overlay and the
 * product's SVG glyph centred on top.
 *
 * Pure render — safe in Server Components.
 */

import Image from 'next/image'
import type { Product } from '../../lib/smart-finds'
import { ICONS } from '../../lib/smart-finds'
import { PINE, SAND } from './tokens'

interface Props {
  product: Product
  height?: number
  /** Background color for the panel — defaults to SAND. HeroCard
   *  overrides this on hover via a wrapper. */
  background?: string
  /** Prefix for the SVG pattern ID so two zones for the same product
   *  on the same page don't collide (e.g. hero + grid). */
  idPrefix?:   string
}

export default function IconZone({
  product,
  height = 72,
  background = SAND,
  idPrefix = 'd',
}: Props) {
  const renderIcon = product.icon ? ICONS[product.icon] : null
  const patternId  = `${idPrefix}${product.id}`

  // Real product photo — replaces the SVG glyph + dotted pattern.
  // Object-cover so the image fills the slot edge-to-edge; assumes
  // Amazon-style centred product shots where light cropping is safe.
  // Pair with a generous height (≥180 px on ProductCard) to keep the
  // crop honest.
  if (product.image) {
    return (
      <div style={{
        width: '100%', height, background,
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}>
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1140px) 50vw, 360px"
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div style={{
      width: '100%', height, background,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      transition: 'background .2s',
    }}>
      {/* Dotted PINE pattern overlay — gives the panel a printed,
          editorial feel without competing with the icon. */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .3 }}>
        <defs>
          <pattern id={patternId} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r=".6" fill={`${PINE}30`} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {renderIcon && (
        <div style={{ position: 'relative', opacity: .78 }}>
          {renderIcon(PINE)}
        </div>
      )}
    </div>
  )
}
