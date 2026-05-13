/**
 * components/smart-finds/PainStrip.tsx
 *
 * Contained PINE-backgrounded 3-cell block. Each cell quotes the kit's
 * `painMoment` and links to the kit section below via in-page anchor.
 *
 * Layout: sits inside the page's `page-inner` container (no full-bleed
 * — the rest of the site doesn't use full-width banners). 14-px radius
 * matches the Hotels card and Planner Bridge chrome.
 *
 * Server component — no interactivity beyond the anchor link.
 */

import type { Kit } from '../../lib/smart-finds'
import { PINE, SAND, CARD_RADIUS } from './tokens'

interface Props {
  kits: Kit[]
}

export default function PainStrip({ kits }: Props) {
  return (
    <div
      className="grid grid-cols-3 max-[720px]:grid-cols-1"
      style={{
        background: PINE,
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
      }}
    >
      {kits.map((kit) => (
        <a
          key={kit.id}
          href={`#${kit.id}`}
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
            &ldquo;{kit.painMoment}&rdquo;
          </div>
          <div style={{
            fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 700,
            letterSpacing: '.14em', color: `${SAND}66`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {kit.title.toUpperCase()}
            <span style={{ color: `${SAND}40` }}>→</span>
          </div>
        </a>
      ))}
    </div>
  )
}
