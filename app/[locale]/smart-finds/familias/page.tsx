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
import { getKits }       from '../../../../lib/smart-finds'
import FilterableKits    from '../../../../components/smart-finds/FilterableKits'
import PainStrip, { type PainStripItem } from '../../../../components/smart-finds/PainStrip'
import EmailSignup       from '../../../../components/smart-finds/EmailSignup'
import {
  PINE, SAGE, SAND, CREAM, MUTED, CARD_RADIUS,
} from '../../../../components/smart-finds/tokens'

// ISR — the catalog is editorial content that changes infrequently. One-hour
// revalidation keeps Studio edits visible within an hour without thrashing
// the cache on every request. Cmd: change a product in Studio → wait ≤1 h →
// page reflects the new copy. Force a faster propagation by re-deploying or
// hitting the revalidation endpoint if/when we add one.
export const revalidate = 3600

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isES = locale === 'es'
  return {
    title: isES
      ? 'Smart Finds: Kits Curados para Viajar Bien | Lagomplan'
      : 'Smart Finds: Curated Travel Kits | Lagomplan',
    description: isES
      ? 'Nueve kits curados para viajar bien. Lo que sí llevar, por qué, y dónde conseguirlo — para familias, parejas y fans del fútbol.'
      : 'Nine curated kits for traveling well. What to actually pack, why, and where to find it — for families, couples, and football fans.',
  }
}

// Pain-strip trio — one quote per persona, fixed regardless of filter
// selection. Surfaces the audience mapping at the top of the page.
const PAIN_TRIO: PainStripItem[] = [
  { kitId: 'sin-perder-a-nadie', quote: 'El taxi no acepta la carriola'         },
  { kitId: 'en-las-gradas',      quote: 'La entrada costó lo que costó'         },
  { kitId: 'el-viaje-grande',    quote: 'Primera vez cruzando para ver un partido' },
]

export default async function Page({ params }: Props) {
  const { locale } = await params
  const isES = locale === 'es'

  // DB-backed catalog. Pulls from Supabase via the public-read RLS path —
  // see lib/smart-finds/db.ts. With revalidate=3600 the result is cached at
  // the edge for an hour; Studio edits propagate within that window.
  const kits = await getKits()

  return (
    <main
      className="pt-[100px] min-h-screen"
      style={{ background: CREAM, color: PINE }}
    >
      {/* ── MASTHEAD ─────────────────────────────────────────────────── */}
      <header>
        <div className="page-inner">

          {/* Section-label row — line-free. Spacing carries the
              relationship between the two labels; the horizontal rule
              between them was the most "magazine layout" tell on the
              whole page. */}
          <div style={{
            padding: '36px 0 0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 9, fontWeight: 700,
              letterSpacing: '.24em', color: SAGE,
            }}>{isES ? 'SMART FINDS / FAMILIAS' : 'SMART FINDS / FAMILIES'}</div>
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
                Smart<br />Finds
              </h1>
              <p style={{
                fontFamily: "'Manrope',sans-serif", fontSize: 15,
                color: '#7A7773', lineHeight: 1.65, maxWidth: 420,
              }}>
                {isES
                  ? 'Nueve kits curados para viajar bien. Lo que sí llevar, por qué, y dónde conseguirlo.'
                  : 'Nine curated kits for traveling well. What to actually pack, why, and where to find it.'}
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
                fontFamily: "'Fraunces',serif",
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

          {/* 2-metric strip — no border-top, no border-right between
              metrics. Just two stat blocks with horizontal gap. */}
          <div style={{
            display: 'flex', gap: 56,
            marginTop: 40,
            paddingBottom: 32,
          }}>
            {([
              ['09', isES ? 'kits curados'          : 'curated kits'],
              ['0',  isES ? 'patrocinios pagados'   : 'paid sponsorships'],
            ] as const).map(([n, l]) => (
              <div key={l}>
                <div style={{
                  fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 900, color: PINE,
                }}>{n}</div>
                <div style={{
                  fontFamily: "'Manrope',sans-serif", fontSize: 11, color: MUTED,
                  marginTop: 4,
                }}>{l}</div>
              </div>
            ))}
          </div>

        </div>
      </header>

      {/* ── KITS ──────────────────────────────────────────────────────── */}
      <div className="page-inner" style={{ padding: '40px 24px 100px' }}>
        {/* Pain strip — 3 curated quotes, one per persona. Stays fixed
            regardless of the FilterBar selection so the pain → audience
            mapping reads at the top of the page. */}
        <div style={{ marginBottom: 64 }}>
          <PainStrip items={PAIN_TRIO} kits={kits} />
        </div>

        {/* Filterable kit list — client island for the persona filter
            state. The masthead + planner CTA + newsletter stay server. */}
        <FilterableKits kits={kits} />

        {/* PLANNER CTA — same Pine block treatment as Hotels' PlannerBridgeCTA,
            with the site-wide 14-px radius so the corner softness reads
            consistently across surfaces. */}
        <div
          className="grid grid-cols-[1fr_auto] max-[640px]:grid-cols-1"
          style={{
            background: PINE, padding: '48px 52px', marginTop: 96,
            gap: 48, alignItems: 'center',
            borderRadius: CARD_RADIUS,
          }}
        >
          <div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
              letterSpacing: '.2em', color: SAGE, marginBottom: 12,
            }}>{isES ? 'ANTES DE EMPACAR' : 'BEFORE YOU PACK'}</div>
            <h3 style={{
              fontFamily: "'Fraunces',serif",
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
            marginTop: 72, paddingTop: 56, gap: 72, alignItems: 'center',
          }}
        >
          <div>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 8, fontWeight: 700,
              letterSpacing: '.2em', color: SAGE, marginBottom: 12,
            }}>{isES ? 'EL ITINERARIO' : 'THE NEWSLETTER'}</div>
            <h3 style={{
              fontFamily: "'Fraunces',serif",
              fontSize: 26, fontWeight: 700, color: PINE,
              lineHeight: 1.2, marginBottom: 10,
            }}>{isES
              ? <>Nuevos kits y guías,<br />directo a tu correo</>
              : <>New kits and guides,<br />straight to your inbox</>}</h3>
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
