/**
 * components/smart-finds/IconZone.tsx
 *
 * Shared icon surface used by both ProductCard and HeroCard. Renders
 * the SAND-coloured panel with a dotted PINE pattern overlay and the
 * product's SVG glyph centred on top.
 *
 * Pure render — safe in Server Components.
 */

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
