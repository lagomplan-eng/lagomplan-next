'use client'
/**
 * components/hotels/PlannerBridgeCTA.tsx
 *
 * "Lagom pick" / "Cómo funciona" bridge card shown between the Hotels
 * grid and the newsletter banner. Carried forward from the v1 hotels
 * client (archived under app/[locale]/hotels/_archive/) so the visual
 * pattern stays consistent with what users already had.
 *
 * Same two-column card other planner-bridge surfaces use:
 *   Left  — Sage 'Lagom pick' eyebrow + Manrope 800 heading + body +
 *           "Planear con IA →" Pine CTA
 *   Right — Sand panel with "Cómo funciona" eyebrow + three numbered
 *           step rows.
 *
 * Bilingual via the same isES pattern other client components use.
 */

interface Props {
  locale: 'es' | 'en'
}

export default function PlannerBridgeCTA({ locale }: Props) {
  const isES = locale === 'es'
  const plannerHref = isES ? '/es/planificador' : '/en/planner'

  const steps = isES
    ? [
        { n: '01', t: 'Elige un destino',     d: 'Explora guías editoriales con criterio real.' },
        { n: '02', t: 'Selecciona tu hotel',  d: 'Opciones curadas, sin anuncios disfrazados.' },
        { n: '03', t: 'Genera tu itinerario', d: 'LagomPlan arma el plan por ti, con IA.' },
      ]
    : [
        { n: '01', t: 'Choose a destination', d: 'Browse editorial guides with real taste.' },
        { n: '02', t: 'Pick your hotel',      d: 'Curated options, no disguised ads.' },
        { n: '03', t: 'Build your itinerary', d: 'LagomPlan puts it together for you.' },
      ]

  return (
    <section style={{ padding: '56px 0 72px' }}>
      <div className="page-inner">
        <div style={{
          padding: '32px', border: '1px solid var(--border)',
          borderRadius: '32px', background: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left — pitch + CTA */}
            <div>
              <p className="sec-label">Lagom pick</p>
              <h3 style={{
                margin: '12px 0 0', fontSize: '30px', lineHeight: 1.1,
                letterSpacing: '-0.02em', fontWeight: 800,
              }}>
                {isES ? 'Convierte una guía en un plan real' : 'Turn a guide into a real plan'}
              </h3>
              <p style={{
                margin: '12px 0 0', fontSize: '14px', lineHeight: 1.9,
                color: 'rgba(15,58,51,0.68)',
              }}>
                {isES
                  ? 'Cuando un destino ya suena bien, LagomPlan te ayuda a convertirlo en hospedaje, experiencias y un itinerario limpio.'
                  : 'Once a destination feels right, LagomPlan helps you move naturally into stays, experiences, and a cleaner itinerary.'}
              </p>
              <a
                href={plannerHref}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  marginTop: '24px', borderRadius: '999px',
                  background: 'var(--pine)', color: 'white',
                  padding: '14px 22px', fontSize: '14px', fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {isES ? 'Planear con IA' : 'Plan with AI'} →
              </a>
            </div>

            {/* Right — numbered "how it works" steps on a Sand panel */}
            <div style={{
              padding: '28px', borderRadius: '22px',
              background: 'var(--sand)', border: '1px solid var(--border)',
            }}>
              <p className="sec-label" style={{ margin: 0 }}>
                {isES ? 'Cómo funciona' : 'How it works'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '22px' }}>
                {steps.map(s => (
                  <div key={s.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                      background: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 800, color: 'var(--pine)',
                    }}>
                      {s.n}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{s.t}</div>
                      <div style={{
                        fontSize: '13px', color: 'rgba(15,58,51,0.65)',
                        marginTop: '2px', lineHeight: 1.6,
                      }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
