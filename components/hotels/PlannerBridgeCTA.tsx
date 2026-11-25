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

import { Button, CardTitle, Eyebrow, InfoCard } from '../design'

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
    <section className="pb-[72px] pt-14">
      <div className="page-inner">
        <InfoCard tone="white">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {/* Left — pitch + CTA */}
            <div>
              <Eyebrow>Lagom pick</Eyebrow>
              <CardTitle as="h3" className="!text-[30px]">
                {isES ? 'Convierte una guía en un plan real' : 'Turn a guide into a real plan'}
              </CardTitle>
              <p className="m-0 mt-3 font-sans text-small text-ink-body">
                {isES
                  ? 'Cuando un destino ya suena bien, LagomPlan te ayuda a convertirlo en hospedaje, experiencias y un itinerario limpio.'
                  : 'Once a destination feels right, LagomPlan helps you move naturally into stays, experiences, and a cleaner itinerary.'}
              </p>
              <Button href={plannerHref} className="mt-6">
                {isES ? 'Planear con IA' : 'Plan with AI'} →
              </Button>
            </div>

            {/* Right — numbered "how it works" steps */}
            <InfoCard tone="mint">
              <Eyebrow className="!mb-0">{isES ? 'Cómo funciona' : 'How it works'}</Eyebrow>
              <div className="mt-5 flex flex-col gap-[18px]">
                {steps.map(s => (
                  <div key={s.n} className="flex items-start gap-4">
                    <div className="flex size-8 flex-none items-center justify-center rounded-btn bg-white font-sans text-micro font-bold text-pine">{s.n}</div>
                    <div>
                      <div className="font-sans text-small font-semibold text-pine">{s.t}</div>
                      <div className="mt-0.5 font-sans text-tiny text-ink-body">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>
        </InfoCard>
      </div>
    </section>
  )
}
