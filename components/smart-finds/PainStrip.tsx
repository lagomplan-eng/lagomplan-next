/**
 * components/smart-finds/PainStrip.tsx
 *
 * PINE-backgrounded 3-column strip below the masthead. Each cell quotes
 * the kit's `painMoment` in italic Fraunces, with the kit title as a
 * small underline that anchors to the kit section below.
 *
 * Columns stack on mobile so each pain quote keeps full width and
 * readable size.
 *
 * Server component — no interactivity beyond the anchor link.
 */

import type { Kit } from '../../lib/smart-finds'
import { PINE, SAND } from './tokens'

interface Props {
  kits: Kit[]
}

export default function PainStrip({ kits }: Props) {
  return (
    <div style={{ background: PINE }}>
      <div
        className="grid grid-cols-3 max-[720px]:grid-cols-1"
        style={{ maxWidth: 1140, margin: '0 auto', padding: '0 40px' }}
      >
        {kits.map((kit, i) => (
          <a
            key={kit.id}
            href={`#${kit.id}`}
            style={{
              padding: '36px 32px',
              display: 'flex', flexDirection: 'column', gap: 14,
              textDecoration: 'none',
              borderRight: i < kits.length - 1 ? `1px solid ${SAND}15` : 'none',
              transition: 'background .18s',
            }}
            className="hover:bg-[rgba(237,231,225,0.04)]"
          >
            <div style={{
              fontFamily: "'Fraunces',serif", fontStyle: 'italic',
              fontSize: 20, fontWeight: 700, color: SAND, lineHeight: 1.2,
            }}>
              &ldquo;{kit.painMoment}&rdquo;
            </div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 9, fontWeight: 700,
              letterSpacing: '.14em', color: `${SAND}55`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {kit.title.toUpperCase().replace(/\./g, '')}
              <span style={{ color: `${SAND}30` }}>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
