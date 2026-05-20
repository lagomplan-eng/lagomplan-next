/**
 * components/smart-finds/PainStrip.tsx
 *
 * Contained PINE-backgrounded 3-cell block. Each cell shows a curated
 * pain quote and anchors to its kit section. The page picks which 3
 * quotes to surface (one per persona on the Familias-volume layout),
 * so this component is data-driven and doesn't hardcode kit choices.
 *
 * Layout: contained block (no full-bleed), 14-px radius — matches the
 * Hotels card and Planner Bridge chrome.
 *
 * Server component — no interactivity beyond the anchor link.
 */

import type { Kit } from '../../lib/smart-finds'
import { PINE, SAND, CARD_RADIUS } from './tokens'

export interface PainStripItem {
  /** Kit ID to anchor-link to (#<id>). */
  kitId: string
  /** Curated pain quote — does not have to match kit.painMoment. */
  quote: string
}

interface Props {
  items: PainStripItem[]
  /** Full kit list — used to resolve titles for the marker line. */
  kits:  Kit[]
}

export default function PainStrip({ items, kits }: Props) {
  const byId = new Map(kits.map(k => [k.id, k]))

  return (
    <div
      className="grid grid-cols-3 max-[720px]:grid-cols-1"
      style={{
        background: PINE,
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
      }}
    >
      {items.map((item) => {
        const kit = byId.get(item.kitId)
        return (
          <a
            key={item.kitId}
            href={`#${item.kitId}`}
            style={{
              padding: '32px 28px',
              display: 'flex', flexDirection: 'column', gap: 12,
              textDecoration: 'none',
              transition: 'background .18s',
            }}
            className="hover:bg-[rgba(237,231,225,0.04)]"
          >
            <div style={{
              fontFamily: "'Fraunces',serif",
              fontSize: 19, fontWeight: 700, color: SAND, lineHeight: 1.25,
            }}>
              &ldquo;{item.quote}&rdquo;
            </div>
            {kit && (
              <div style={{
                fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 700,
                letterSpacing: '.14em', color: `${SAND}66`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {kit.title.toUpperCase()}
                <span style={{ color: `${SAND}40` }}>→</span>
              </div>
            )}
          </a>
        )
      })}
    </div>
  )
}
