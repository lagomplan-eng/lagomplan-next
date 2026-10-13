/**
 * app/checklist-viajar-con-bebe/page.tsx
 *
 * Lead-magnet landing: "Qué preguntarle al hotel antes de viajar con bebé".
 * Mobile-first (Instagram Stories traffic), Spanish-only. Own root layout
 * (see layout.tsx), minimal header/footer like /guia — no site nav.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { BASE_URL } from '../../lib/seo'
import LeadMagnetForm from '../../components/forms/LeadMagnetForm'
import { getLeadMagnet, toPublic } from '../../lib/lead-magnets'
import styles from './editorial.module.css'

const MAGNET = toPublic(getLeadMagnet('checklist-baby')!)
const PATH = '/checklist-viajar-con-bebe'
const TITLE = 'Qué preguntarle al hotel antes de viajar con bebé | Lagomplan'
const DESCRIPTION =
  '24 preguntas para hacerle al hotel antes de reservar con bebé: cuna, alberca, comida y traslados. Descarga el checklist gratis.'

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

const INCLUDES = [
  ['01', 'Dónde duerme el bebé'],
  ['02', 'Seguridad'],
  ['03', 'Comida'],
  ['04', 'Llegar y moverse'],
  ['05', 'Kids club y niñera'],
  ['06', 'Lo que nadie pregunta'],
] as const

const QUESTIONS = [
  {
    q: '¿La cuna está garantizada o es “sujeta a disponibilidad”?',
    a: 'Si es lo segundo, pide que la confirmen por escrito para tus fechas.',
  },
  {
    q: '¿A qué hora abren los restaurantes para cenar?',
    a: 'Si el primer servicio es a las 8 pm, la cena del niño se vuelve un problema diario.',
  },
  {
    q: '¿El traslado incluye silla de auto?',
    a: 'No lo asumas. Pregunta y, si no, decide si llevas la tuya.',
  },
]

export default function ChecklistLanding() {
  return (
    <div className={`${styles.editorial} min-h-screen bg-cream font-sans text-pine`}>
      {/* ── Header: wordmark only ── */}
      <header className="mx-auto flex max-w-5xl items-center px-5 py-4 sm:px-8">
        <Link href="https://www.lagomplan.com" className="font-mono text-sm font-medium uppercase tracking-[0.3em] text-pine focus:outline-none focus-visible:ring-2 focus-visible:ring-pine">
          Lagomplan
        </Link>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="mx-auto grid max-w-5xl gap-8 px-5 pb-14 pt-2 sm:px-8 md:grid-cols-2 md:items-start md:gap-14 md:pt-10">
          <div>
            <p className={LABEL}>Checklist para familias · N.º 02</p>
            <h1 className="mt-3 font-display text-[2.15rem] font-medium leading-[1.08] sm:text-5xl">
              Qué preguntarle al hotel <em className="italic">antes de ir con bebé</em>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-pine/80 sm:text-lg">
              24 preguntas que separan un viaje tranquilo de tres noches sin dormir. Te mandamos el checklist a tu correo.
            </p>
          </div>
          <div id="checklist-form">
            <LeadMagnetForm magnet={MAGNET} position="hero" />
          </div>
        </section>

        {/* Hairline between hero and body (replaces the former illustration slot) */}
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="border-t border-pine/15" />
        </div>

        {/* ── Por qué existe ── */}
        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
            Por qué <em className="italic">existe</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pine/85 sm:text-lg">
            “Tenemos cunas” puede significar tres cosas: una cuna garantizada, un corral portátil, o “si queda alguna cuando llegues”. Lo mismo con la alberca infantil, las sillas altas y el traslado. Este checklist reúne las preguntas que conviene hacer antes de pagar, no al llegar.
          </p>
        </section>

        {/* ── Qué incluye ── */}
        <section className="bg-sand/60 py-14">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
              Qué <em className="italic">incluye</em>
            </h2>
            <ul className="mt-6 divide-y divide-pine/15 border-y border-pine/15">
              {INCLUDES.map(([n, label]) => (
                <li key={n} className="flex items-baseline gap-4 py-3.5">
                  <span className="font-mono text-xs tracking-[0.18em] text-pine/80">{n}</span>
                  <span className="text-base sm:text-lg">{label}</span>
                </li>
              ))}
              <li className="flex items-baseline gap-4 py-3.5">
                <span className="font-mono text-xs tracking-[0.18em] text-pine">+</span>
                <span className="text-base font-bold sm:text-lg">
                  Un mensaje listo para mandarle al hotel por WhatsApp o correo.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Tres preguntas ── */}
        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
            Tres preguntas <em className="italic">para empezar</em>
          </h2>
          <div className="mt-6 space-y-7">
            {QUESTIONS.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-display text-xl font-medium leading-snug sm:text-2xl">{q}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-pine/80">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cierre + second form ── */}
        <section className="bg-sand/60 py-14">
          <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-8 md:grid-cols-2 md:items-start md:gap-14">
            <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
              Las otras 21 <em className="italic">están en el checklist.</em>
            </h2>
            <LeadMagnetForm magnet={MAGNET} position="footer" />
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
