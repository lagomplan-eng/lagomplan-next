/**
 * app/puente-noviembre/page.tsx
 *
 * Landing: "Puente de noviembre 2026" — four 3-day escapadas from CDMX for
 * couples. Mobile-first, Spanish-only. Own root layout (see layout.tsx),
 * minimal header/footer like /checklist-viajar-con-bebe.
 *
 * Hero, final CTA and the closing line link to the plain planner; each card
 * links to a plan that generates immediately (lib/puente-noviembre.ts). No UTMs
 * on internal links — clicks fire GA4 `planner_cta_click` (PlannerLink).
 * The email form uses the shared lead-magnet system ('puente-noviembre').
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { BASE_URL } from '../../lib/seo'
import LeadMagnetForm from '../../components/forms/LeadMagnetForm'
import { getLeadMagnet, toPublic } from '../../lib/lead-magnets'
import { PLANNER_PATH, PUENTE_DESTINATIONS, puentePlannerPath } from '../../lib/puente-noviembre'
import PlannerLink from './PlannerLink'
import styles from './editorial.module.css'

const MAGNET = toPublic(getLeadMagnet('puente-noviembre')!)
const PATH = '/puente-noviembre'
const TITLE = 'Puente de noviembre 2026: 4 escapadas de 3 días desde CDMX'
const DESCRIPTION =
  'Sábado 14 a lunes 16 de noviembre. Cuatro escapadas en pareja desde CDMX, con el plan armado en 60 segundos: dónde dormir, comer y qué hacer.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}${PATH}` },
  openGraph: {
    type: 'website',
    url: `${BASE_URL}${PATH}`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Lagomplan',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lagomplantravel',
    creator: '@lagomplantravel',
    title: TITLE,
    description: DESCRIPTION,
  },
}

const LABEL = 'font-mono text-[11px] uppercase tracking-[0.2em] text-pine/70'
const H2 = 'font-display text-3xl font-medium leading-tight sm:text-4xl'
const FOCUS = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 focus-visible:ring-offset-cream'
const PRIMARY_BTN =
  `inline-block rounded-full bg-pine px-7 py-4 text-center font-sans text-base font-bold text-cream transition-opacity hover:opacity-90 ${FOCUS}`
const CARD_BTN =
  `mt-5 inline-block w-fit rounded-full border border-pine px-5 py-3 font-sans text-base font-bold text-pine transition-colors hover:bg-pine hover:text-cream ${FOCUS}`

const STEPS = [
  ['01', 'Elige a dónde.', 'Uno de estos cuatro, o el que ya traían en mente.'],
  ['02', 'Dinos cómo les gusta viajar.', 'Comer bien, nada de madrugar, un día libre. Lo que sea.'],
  ['03', 'Mándaselo a tu pareja.', 'El plan llega completo. Solo falta que diga que sí.'],
] as const

export default function PuenteNoviembreLanding() {
  return (
    <div className={`${styles.editorial} min-h-screen overflow-x-clip bg-cream font-sans text-pine`}>
      {/* ── Header: wordmark only ── */}
      <header className="mx-auto flex max-w-5xl items-center px-5 py-4 sm:px-8">
        <Link href="https://www.lagomplan.com" className="font-mono text-sm font-medium uppercase tracking-[0.3em] text-pine focus:outline-none focus-visible:ring-2 focus-visible:ring-pine">
          Lagomplan
        </Link>
      </header>

      <main>
        {/* ── Hero ── (button above the fold at 375px) */}
        <section className="mx-auto max-w-5xl px-5 pb-14 pt-2 sm:px-8 md:pt-10">
          <p className={LABEL}>PUENTE DE NOVIEMBRE · SÁB 14 – LUN 16</p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.15rem] font-medium leading-[1.08] sm:text-5xl md:text-6xl">
            El puente de noviembre, <em className="italic">ya planeado.</em>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-pine/80 sm:text-lg">
            Tres días, cuatro escapadas desde CDMX. Elige una y Lagomplan arma el plan en 60 segundos — dónde dormir, dónde comer y qué hacer, sin apretar el día.
          </p>
          <div className="mt-6">
            <PlannerLink href={PLANNER_PATH} destination="hero" className={PRIMARY_BTN}>
              Planear mi puente →
            </PlannerLink>
            <p className="mt-3 text-xs leading-relaxed text-pine/70">
              Gratis. Tu plan queda guardado en tu cuenta.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="border-t border-pine/15" />
        </div>

        {/* ── Cuatro escapadas ── */}
        <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <h2 className={H2}>Cuatro escapadas de 3 días</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
            {PUENTE_DESTINATIONS.map(d => (
              <li key={d.id} className="flex flex-col rounded-2xl border border-pine/15 bg-white/60 p-6">
                <h3 className="font-display text-2xl font-medium leading-tight sm:text-3xl">{d.name}</h3>
                <p className="mt-1.5 font-mono text-xs uppercase tracking-[0.16em] text-pine/75">{d.distance}</p>
                <p className="mt-3 flex-1 text-base leading-relaxed text-pine/85">{d.blurb}</p>
                <PlannerLink
                  href={puentePlannerPath(d)}
                  destination={d.id}
                  className={CARD_BTN}
                >
                  Armar este plan<span className="sr-only">: {d.name}</span> →
                </PlannerLink>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-base leading-relaxed text-pine/85">
            ¿Tienen otro destino en mente?{' '}
            <PlannerLink href={PLANNER_PATH} destination="closing" className={`font-bold underline underline-offset-4 ${FOCUS}`}>
              El planner
            </PlannerLink>{' '}
            funciona con cualquiera.
          </p>
        </section>

        {/* ── Cómo funciona ── */}
        <section className="bg-sand/60 py-14">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 className={H2}>Cómo funciona</h2>
            <ol className="mt-6 max-w-3xl divide-y divide-pine/15 border-y border-pine/15">
              {STEPS.map(([n, title, text]) => (
                <li key={n} className="flex items-baseline gap-4 py-4">
                  <span className="font-mono text-xs tracking-[0.18em] text-pine/80">{n}</span>
                  <p className="text-base leading-relaxed sm:text-lg">
                    <strong className="font-bold">{title}</strong>{' '}
                    <span className="text-pine/85">{text}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Email form ── */}
        <section className="mx-auto grid max-w-5xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-start md:gap-14">
          <div>
            <h2 className={H2}>¿Todavía no deciden?</h2>
            <p className="mt-4 text-base leading-relaxed text-pine/85 sm:text-lg">
              Te mandamos las cuatro escapadas a tu correo para que se las enseñes a tu pareja.
            </p>
          </div>
          <LeadMagnetForm magnet={MAGNET} position="body" />
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-sand/60 py-14">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 className={H2}>
              Faltan pocas semanas. <em className="italic">Mejor decidir hoy.</em>
            </h2>
            <div className="mt-6">
              <PlannerLink href={PLANNER_PATH} destination="final" className={PRIMARY_BTN}>
                Planear mi puente →
              </PlannerLink>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-8 sm:px-8">
        <p className={LABEL}>© {new Date().getFullYear()} Lagomplan</p>
        <Link href="/es/privacidad" className="text-sm text-pine underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine">
          Privacidad
        </Link>
      </footer>
    </div>
  )
}
