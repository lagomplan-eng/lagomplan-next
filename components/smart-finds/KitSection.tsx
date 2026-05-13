/**
 * components/smart-finds/KitSection.tsx
 *
 * Routes a Kit to its rendering variant (FlatKit vs MochilaKit) and
 * draws the shared editorial header above: large faded numeral, kit
 * marker line, title in italic Fraunces, subtitle, scene paragraph,
 * optional "POR QUÉ NO INCLUIMOS" callout.
 *
 * Each section gets an `id` matching the kit's id so the PainStrip
 * anchor links land at the section top.
 *
 * Server component — no interactivity of its own.
 */

import type { Kit } from '../../lib/smart-finds'
import FlatKit from './FlatKit'
import MochilaKit from './MochilaKit'
import { PINE, SAGE, SAND, MUTED } from './tokens'

interface Props {
  kit:    Kit
  isLast: boolean
}

export default function KitSection({ kit, isLast }: Props) {
  return (
    <section
      id={kit.id}
      style={{
        marginBottom: isLast ? 0 : 96,
        scrollMarginTop: 80,
      }}
    >
      {/* Header — line-free. The faded big numeral on its own carries
          enough visual weight; the old horizontal divider + "KIT 02"
          marker felt brutalist next to the rest of the site. */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 9, fontWeight: 700,
          letterSpacing: '.18em', color: SAGE, marginBottom: 4,
        }}>KIT {kit.num}</div>

        <h2 style={{
          fontFamily: "'Fraunces',serif",
          fontSize: 40, fontWeight: 700, color: PINE,
          lineHeight: 1, letterSpacing: '-.02em', marginBottom: 6,
        }}>{kit.title}</h2>

        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 14,
          color: MUTED, marginBottom: 16,
        }}>{kit.subtitle}</div>

        {/* Scene — no left-bar, no italic. Sits as plain Fraunces
            body so it reads as editorial prose, not a pull-quote. */}
        <p style={{
          fontFamily: "'Fraunces',serif",
          fontSize: 15, color: '#5A5754', lineHeight: 1.7,
          maxWidth: 640,
          marginBottom: kit.omit ? 16 : 0,
        }}>{kit.scene}</p>

        {kit.omit && (
          <div style={{
            background: SAND, padding: '10px 16px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            maxWidth: 600, marginTop: 0,
          }}>
            <span style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
              letterSpacing: '.14em', color: PINE,
              flexShrink: 0, marginTop: 1,
            }}>POR QUÉ NO INCLUIMOS:</span>
            <span style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 11,
              color: '#7A7773', lineHeight: 1.6,
            }}>{kit.omit}</span>
          </div>
        )}
      </div>

      {/* Content router */}
      {kit.content.type === 'flat'    && <FlatKit    kit={kit} />}
      {kit.content.type === 'systems' && <MochilaKit kit={kit} />}
    </section>
  )
}
