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
import { PINE, SAGE, SAND, MUTED, BORDER } from './tokens'

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
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
        }}>
          <div style={{
            fontFamily: "'Fraunces',serif", fontStyle: 'italic',
            fontSize: 56, fontWeight: 900,
            color: `${PINE}0D`, lineHeight: 1, flexShrink: 0,
          }}>{kit.num}</div>
          <div style={{ flex: 1, height: 1, background: BORDER }} />
          <div style={{
            fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
            letterSpacing: '.2em', color: MUTED,
          }}>KIT {kit.num}</div>
        </div>

        <h2 style={{
          fontFamily: "'Fraunces',serif", fontStyle: 'italic',
          fontSize: 40, fontWeight: 700, color: PINE,
          lineHeight: 1, letterSpacing: '-.02em', marginBottom: 5,
        }}>{kit.title}</h2>

        <div style={{
          fontFamily: "'Manrope',sans-serif", fontSize: 13,
          color: SAGE, marginBottom: 20,
        }}>{kit.subtitle}</div>

        <p style={{
          fontFamily: "'Fraunces',serif", fontStyle: 'italic',
          fontSize: 14, color: '#7A7773', lineHeight: 1.8,
          borderLeft: `2px solid ${BORDER}`, paddingLeft: 18,
          maxWidth: 600,
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
