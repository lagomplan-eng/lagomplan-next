/**
 * app/[locale]/smart-finds/familias/page.tsx
 *
 * Smart Finds — Vol. 01 · Familias.
 *
 * Static segment that takes precedence over the generic
 * /smart-finds/[slug] stub. Renders the masthead, pain strip, three
 * kit sections, planner CTA, and the inline newsletter capture.
 *
 * Nav + Footer are inherited from app/[locale]/layout.tsx — we don't
 * remount them here.
 */

import type { Metadata } from 'next'
import type { Locale }   from '../../../../i18n'
import { KITS }          from '../../../../lib/smart-finds'
import KitSection        from '../../../../components/smart-finds/KitSection'
import PainStrip         from '../../../../components/smart-finds/PainStrip'
import EmailSignup       from '../../../../components/smart-finds/EmailSignup'
import { PINE, SAGE, SAND, OW, MUTED, BORDER } from '../../../../components/smart-finds/tokens'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isES = locale === 'es'
  return {
    title: isES
      ? 'Smart Finds: Kits Curados para Viajar con Niños | Lagomplan'
      : 'Smart Finds: Curated Kits for Traveling With Kids | Lagomplan',
    description: isES
      ? 'Tres kits curados para viajar con niños pequeños. Lo que sí llevar, por qué, y dónde conseguirlo — desde la perspectiva de alguien que viaja con bebés.'
      : 'Three curated kits for traveling with young kids. What to actually pack, why, and where to find it — from someone who travels with babies.',
  }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const isES = locale === 'es'

  return (
    <main style={{
      background: OW, minHeight: '100vh', color: PINE,
      paddingTop: 100, // clearance for the sticky site Nav
    }}>
      {/* ── MASTHEAD ─────────────────────────────────────────────────── */}
      <header style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 40px' }}>

          {/* Section-label row */}
          <div style={{
            padding: '36px 0 0',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 9, fontWeight: 700,
              letterSpacing: '.24em', color: SAGE,
            }}>{isES ? 'SMART FINDS / FAMILIAS' : 'SMART FINDS / FAMILIES'}</div>
            <div style={{ flex: 1, minWidth: 40, height: 1, background: BORDER }} />
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 9,
              letterSpacing: '.14em', color: MUTED,
            }}>VOL. 01 · 2026</div>
          </div>

          {/* Title + editor's note split */}
          <div
            className="grid grid-cols-[5fr_3fr] max-[820px]:grid-cols-1"
            style={{
              padding: '28px 0 0', gap: 72, alignItems: 'end',
            }}
          >
            <div>
              <h1 style={{
                fontFamily: "'Fraunces',serif", fontWeight: 900,
                color: PINE, lineHeight: .88, letterSpacing: '-.03em',
                marginBottom: 20, fontSize: 76,
              }}
                className="max-[640px]:!text-[52px]"
              >
                Smart<br /><em>{isES ? 'Finds.' : 'Finds.'}</em>
              </h1>
              <p style={{
                fontFamily: "'Manrope',sans-serif", fontSize: 15,
                color: '#7A7773', lineHeight: 1.65, maxWidth: 420,
              }}>
                {isES
                  ? 'Tres kits curados para viajar con niños pequeños. Lo que sí llevar, por qué, y dónde conseguirlo.'
                  : 'Three curated kits for traveling with young kids. What to actually pack, why, and where to find it.'}
              </p>
            </div>

            {/* Editor's note */}
            <div style={{
              borderLeft: `2px solid ${PINE}`, paddingLeft: 24, paddingBottom: 6,
            }}>
              <div style={{
                fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
                letterSpacing: '.2em', color: PINE, opacity: .35, marginBottom: 12,
              }}>{isES ? 'NOTA DE LA EDITORA' : 'EDITOR’S NOTE'}</div>
              <p style={{
                fontFamily: "'Fraunces',serif", fontStyle: 'italic',
                fontSize: 14, color: PINE, lineHeight: 1.75, marginBottom: 14,
              }}>{isES
                ? '“Viajar con un toddler y un bebé no es un viaje más difícil. Es una categoría distinta. Esta selección la construimos para eso.”'
                : '“Traveling with a toddler and a baby isn’t a harder trip. It’s a different category. This selection was built for that.”'}</p>
              <div style={{
                fontFamily: "'Manrope',sans-serif", fontSize: 9, color: MUTED,
              }}>{isES
                ? '✱ Usamos enlaces de afiliados. Sin costo para ti.'
                : '✱ Affiliate links. No cost to you.'}</div>
            </div>
          </div>

          {/* 2-metric strip */}
          <div style={{
            display: 'flex',
            borderTop: `1px solid ${BORDER}`,
            marginTop: 32,
          }}>
            {([
              ['03', isES ? 'kits curados'          : 'curated kits'],
              ['0',  isES ? 'patrocinios pagados'   : 'paid sponsorships'],
            ] as const).map(([n, l], i) => (
              <div key={l} style={{
                padding: '14px 0',
                paddingLeft: i > 0 ? 32 : 0,
                borderRight: i === 0 ? `1px solid ${BORDER}` : 'none',
                marginRight: i === 0 ? 32 : 0,
              }}>
                <div style={{
                  fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 900, color: PINE,
                }}>{n}</div>
                <div style={{
                  fontFamily: "'Manrope',sans-serif", fontSize: 9, color: MUTED,
                  letterSpacing: '.1em', marginTop: 2,
                }}>{l}</div>
              </div>
            ))}
          </div>

        </div>
      </header>

      {/* ── PAIN STRIP ────────────────────────────────────────────────── */}
      <PainStrip kits={KITS} />

      {/* ── KITS ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 40px 100px' }}>
        {KITS.map((kit, i) => (
          <div key={kit.id}>
            <KitSection kit={kit} isLast={i === KITS.length - 1} />
            {i < KITS.length - 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                margin: '80px 0',
              }}>
                <div style={{ height: 1, flex: 1, background: BORDER }} />
                <div style={{
                  fontFamily: "'Manrope',sans-serif", fontSize: 9, color: MUTED,
                }}>✦</div>
                <div style={{ height: 1, flex: 1, background: BORDER }} />
              </div>
            )}
          </div>
        ))}

        {/* PLANNER CTA */}
        <div
          className="grid grid-cols-[1fr_auto] max-[640px]:grid-cols-1"
          style={{
            background: PINE, padding: '48px 52px', marginTop: 96,
            gap: 48, alignItems: 'center',
          }}
        >
          <div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
              letterSpacing: '.2em', color: SAGE, marginBottom: 12,
            }}>{isES ? 'ANTES DE EMPACAR' : 'BEFORE YOU PACK'}</div>
            <h3 style={{
              fontFamily: "'Fraunces',serif", fontStyle: 'italic',
              fontSize: 28, fontWeight: 700, color: SAND,
              lineHeight: 1.1, marginBottom: 12,
            }}>{isES ? '¿Ya tienes el itinerario?' : 'Got the itinerary?'}</h3>
            <p style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 13,
              color: `${SAND}75`, lineHeight: 1.6, maxWidth: 440,
            }}>{isES
              ? 'El mejor kit de viaje no sirve de nada si no sabes adónde vas. Genera tu plan completo en 30 segundos.'
              : 'The best travel kit is useless without a plan. Generate your full itinerary in 30 seconds.'}</p>
          </div>
          <a
            href={isES ? '/es/planificador' : '/en/planner'}
            style={{
              background: SAND, color: PINE,
              fontFamily: "'Manrope',sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: '.14em',
              padding: '16px 28px', whiteSpace: 'nowrap',
              textDecoration: 'none', display: 'inline-block',
              justifySelf: 'start',
            }}
          >{isES ? 'PLANEA CON IA →' : 'PLAN WITH AI →'}</a>
        </div>

        {/* EMAIL */}
        <div
          className="grid grid-cols-2 max-[820px]:grid-cols-1"
          style={{
            borderTop: `1px solid ${BORDER}`,
            marginTop: 72, paddingTop: 56, gap: 72, alignItems: 'center',
          }}
        >
          <div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
              letterSpacing: '.2em', color: SAGE, marginBottom: 12,
            }}>{isES ? 'EL ITINERARIO' : 'THE NEWSLETTER'}</div>
            <h3 style={{
              fontFamily: "'Fraunces',serif", fontStyle: 'italic',
              fontSize: 26, fontWeight: 700, color: PINE,
              lineHeight: 1.2, marginBottom: 10,
            }}>{isES
              ? <>Nuevos kits y guías,<br />directo a tu correo.</>
              : <>New kits and guides,<br />straight to your inbox.</>}</h3>
            <p style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 13,
              color: MUTED, lineHeight: 1.65,
            }}>{isES
              ? 'Sin spam. Una vez por semana, desde la perspectiva de alguien que viaja con niños.'
              : 'No spam. Once a week, from someone who travels with kids.'}</p>
          </div>
          <div>
            <EmailSignup locale={isES ? 'es' : 'en'} />
          </div>
        </div>
      </div>
    </main>
  )
}
