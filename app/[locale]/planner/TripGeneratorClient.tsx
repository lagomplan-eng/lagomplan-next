'use client'
// TripGeneratorClient.tsx
// Handles two states:
//   1. Empty form (no searchParams.destination)
//   2. Result view with AI-generated itinerary

import Link from 'next/link'
import { useLocale } from 'next-intl'
import HeroForm from '../../../components/forms/HeroForm'
import TripResult from './TripResult'
import GuidesPreview from '../../../components/GuidesPreview'

const SHOW_QUICK_START = true
const SHOW_GUIDES = false
const SHOW_TRUST = false
const SHOW_CHIPS = false

interface Props {
  searchParams: Record<string, string>
}

export default function TripGeneratorClient({ searchParams }: Props) {
  const destination = searchParams.destination || ''
  const trip_id     = searchParams.trip_id     || ''
  const hasResult   = !!(destination || trip_id)

  if (!hasResult) {
    return <FormPage />
  }

  return <TripResult params={searchParams} />
}

// ── Full-page form ────────────────────────────────────
function FormPage() {
  const locale = useLocale() as 'es' | 'en'
  const isES   = locale === 'es'

  return (
    <main className="pt-[72px] min-h-screen bg-[#FFF9F3]">
      <div className="page-inner py-16 max-[768px]:py-10">

        {/* Tighter container for premium feel */}
        <div className="max-w-[1080px] mx-auto">

          {/* TEXT (narrower for readability) */}
          <div className="max-w-[640px]">
            <span className="sec-label mb-4">
              {isES ? 'Planificador de viajes con IA' : 'AI-powered trip planner'}
            </span>

            <h1 className="font-playfair text-[48px] max-[768px]:text-[36px] font-bold text-[#0F1A16] leading-[1.05] tracking-[-1.5px] mb-3">
              {isES ? 'Genera tu viaje' : 'Build your trip'}
              <br />
              <em>{isES ? 'personalizado.' : 'your way.'}</em>
            </h1>

            <p className="font-sans text-[15px] text-[#2D6B57] leading-[1.7] mb-12 md:mb-14">
              {isES
                ? 'Cuéntanos sobre el destino de tus sueños y nuestra IA creará un itinerario solo para ti.'
                : 'Tell us about your dream destination and our AI will craft a personalised itinerary just for you.'}
            </p>
          </div>

          {/* FORM (wider + slight offset = premium layout) */}
          <div className="max-w-[880px] mt-2 md:mt-4 md:ml-6">
            <HeroForm locale={locale} />
          </div>

          {/* SECTIONS */}
          <div className="mt-16 md:mt-20 space-y-16 md:space-y-20">
            <QuickStartSection locale={locale} />
            <GuidesPreview locale={locale} />
            <TrustStrip locale={locale} />
          </div>

        </div>
      </div>
    </main>
  )
}

function QuickStartSection({ locale }: { locale: 'es' | 'en' }) {
  const chips = locale === 'es'
    ? ['Escapada romántica', 'Viaje en familia', 'Fin de semana largo', 'Playa tranquila', 'Ciudad cultural', 'Naturaleza y descanso']
    : ['Romantic getaway', 'Family trip', 'Long weekend', 'Quiet beach', 'Cultural city', 'Nature & rest']

  return (
    <section aria-labelledby="quick-start-title">
      {SHOW_CHIPS && (
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              className="shrink-0 rounded-full border border-[#6B8F86]/35 bg-white px-4 py-2.5 text-sm text-[#0F3A33] shadow-sm transition hover:bg-[#EDE7E1] hover:shadow-md"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function InspirationSection({ locale }: { locale: 'es' | 'en' }) {
  const hrefBase = locale === 'es' ? '/es/guias' : '/en/guides'

  const guides = [
    {
      title: 'Valle de Bravo',
      subtitle: 'Tres días entre lago, bosque y calma',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      href: `${hrefBase}/valle-de-bravo`,
    },
    {
      title: 'Oaxaca',
      subtitle: 'Cultura, sabor y rincones para caminar sin prisa',
      image:
        'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80',
      href: `${hrefBase}/oaxaca`,
    },
    {
      title: 'Riviera Maya',
      subtitle: 'Playa suave, pausas largas y planes que sí fluyen',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      href: `${hrefBase}/riviera-maya`,
    },
  ]

  return (
    <section aria-labelledby="inspiration-title">
      <div className="mb-6 md:mb-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B8F86] mb-2">
          Inspiración para tu próximo viaje
        </p>
        <h2
          id="inspiration-title"
          className="text-[28px] md:text-[34px] leading-tight tracking-[-0.03em] text-[#0F3A33]"
        >
          Guías con una mirada más tranquila y mejor curada
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.title}
            href={guide.href}
            className="group overflow-hidden rounded-[22px] bg-white shadow-sm"
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#EDE7E1]">
              <img
                src={guide.image}
                alt={guide.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            </div>

            <div className="p-6">
              <h3 className="text-[22px] leading-tight tracking-[-0.02em] text-[#0F3A33] transition group-hover:text-[#2D6B57]">
                {guide.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[#35584F]">
                {guide.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function TrustStrip({ locale }: { locale: 'es' | 'en' }) {
  const isES  = locale === 'es'
  const stats = isES
    ? [
        { title: '+10,000 viajes generados',           text: 'Ideas personalizadas para empezar más rápido.' },
        { title: 'Itinerarios en menos de 30 segundos', text: 'Un primer borrador útil sin fricción innecesaria.' },
        { title: 'Recomendaciones curadas',             text: 'Pensadas para que el viaje se sienta más simple y mejor armado.' },
      ]
    : [
        { title: '+10,000 trips generated',             text: 'Personalised ideas to get you started faster.' },
        { title: 'Itineraries in under 30 seconds',     text: 'A useful first draft with zero unnecessary friction.' },
        { title: 'Curated recommendations',             text: 'Designed to make your trip feel simpler and better put together.' },
      ]

  return (
    <section
      aria-label={isES ? 'Indicadores de confianza' : 'Trust indicators'}
      className="rounded-[24px] bg-[#EEE8DF] px-6 py-8 md:px-10 md:py-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.title} className="flex flex-col items-center">
            <div className="mb-3 h-2.5 w-2.5 rounded-full bg-[#6B8F86]" />
            <h3 className="text-[18px] leading-snug tracking-[-0.02em] text-[#0F3A33] mb-2">
              {stat.title}
            </h3>
            <p className="max-w-[280px] text-[14px] leading-6 text-[#35584F]">
              {stat.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}