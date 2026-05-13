/**
 * components/smart-finds/FlatKit.tsx
 *
 * Renders a 'flat' kit: one HeroCard on top, the remaining products
 * in a 2-column grid below. The grid stacks to 1 column on mobile via
 * the responsive flex layout in HeroCard's wrapper and the explicit
 * media-query class below.
 *
 * Server component — no interaction state of its own.
 */

import type { Kit } from '../../lib/smart-finds'
import { resolveFlatKit } from '../../lib/smart-finds'
import HeroCard from './HeroCard'
import ProductCard from './ProductCard'

interface Props {
  kit: Kit
}

export default function FlatKit({ kit }: Props) {
  if (kit.content.type !== 'flat') return null
  const { hero, rest } = resolveFlatKit(kit)

  return (
    <div>
      <HeroCard product={hero} />
      {/* 2-col grid on desktop, 1-col below 720px. Real gap (16px) +
          transparent background because the card chrome is now rounded
          — the old gap:1 + BORDER bg trick read as a hairline divider
          between square-cornered tiles, which clashes with the rounded
          radius. */}
      <div
        className="grid grid-cols-2 max-[720px]:grid-cols-1"
        style={{ gap: 16 }}
      >
        {rest.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
