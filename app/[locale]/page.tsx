/**
 * app/[locale]/page.tsx — Homepage
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '../../lib/navigation'
import { buildAlternates, buildOpenGraph } from '../../lib/seo'
import type { Locale } from '../../i18n'
import HeroForm from '../../components/forms/HeroForm'
import NewsletterForm from '../../components/forms/NewsletterForm'
import GuidesPreview from '../../components/GuidesPreview'
import ExamplesCta from '../../components/examples/ExamplesCta'
import { Button, CardTitle, InfoCard, PageTitle, SectionTitle } from '../../components/design'
import { BookOpen, ListChecks, Sparkles, Focus } from 'lucide-react'

// ── Metadata ───────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  const alternates = buildAlternates(locale, 'home')
  return {
    title: t('title'),
    description: t('description'),
    alternates,
    openGraph:  buildOpenGraph(locale, { url: alternates.canonical as string }),
  }
}

// ── Static content ─────────────────────────────────────────
const REVIEWS = [
  {
    quote_es:
      'Soltamos el teléfono para conectar con lo real. Caminatas, helado artesanal y comida deliciosa. Un tiempo de calidad donde todo se sintió en su medida justa. Volvimos renovados.',
    quote_en:
      'We put down our phones to connect with what was real. Hikes, artisanal ice cream, amazing food. Quality time where everything felt just right.',
    name: 'Jorge',
    img: '/images/reviews/jorge.png',
  },
  {
    quote_es:
      'Buen vino y arquitectura con historia. Encontramos el punto medio entre aventura y descanso total. Una experiencia curada con un gusto impecable.',
    quote_en:
      'Good wine and architecture with history. We found the sweet spot between adventure and total rest. An experience curated with impeccable taste.',
    name: 'Julia',
    img: '/images/reviews/julia.png',
  },
  {
    quote_es:
      'La plataforma es súper intuitiva; en tres clics pasamos de la idea al itinerario perfecto. Fue esencial para organizar nuestro viaje con total claridad y calma.',
    quote_en:
      'The platform is incredibly intuitive; three clicks and we went from idea to the perfect itinerary. Essential for organizing our trip with total clarity and calm.',
    name: 'Ana',
    img: '/images/reviews/ana.png',
  },
]

const FEATURES = [
  { icon: '/images/icons/guides.svg', key: 'curated' },
  { icon: '/images/icons/itin.svg', key: 'itineraries' },
  { icon: '/images/icons/adaptable.svg', key: 'personalized' },
  { icon: '/images/icons/clarity.svg', key: 'clarity' },
]

const FEATURE_LABELS: Record<
  string,
  { title_es: string; title_en: string; body_es: string; body_en: string }
> = {
  curated: {
    title_es: 'Guías curadas',
    title_en: 'Curated guides',
    body_es:
      'Destinos reales, sin relleno. Lo que vale la pena y lo que no, directo.',
    body_en:
      "Real destinations, no filler. What's worth it and what isn't, straight to the point.",
  },
  itineraries: {
    title_es: 'Itinerario día por día',
    title_en: 'Day-by-day itinerary',
    body_es:
      'De inspiración a plan concreto. Tiempos, orden, qué hacer en cada momento.',
    body_en:
      'From inspiration to a concrete plan. Times, order, what to do at each moment.',
  },
  personalized: {
    title_es: 'Hecho para ti',
    title_en: 'Made for you',
    body_es:
      'Familia, pareja, ritmo relajado o intenso. El plan se adapta a cómo viajas tú.',
    body_en:
      'Family, couple, relaxed or intense pace. The plan adapts to how you travel.',
  },
  clarity: {
    title_es: 'Sin parálisis',
    title_en: 'No decision paralysis',
    body_es:
      'Una recomendación clara, no 47 opciones. Planear se siente ligero.',
    body_en:
      'One clear recommendation, not 47 options. Planning feels light.',
  },
}

const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 flex size-12 items-center justify-center rounded-info bg-pine">
    {children}
  </div>
)

// ── Page ───────────────────────────────────────────────────
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const isES = locale === 'es'

  return (
    <main>
      {/* ① HERO — pt-[100px] because Nav is fixed */}
      <section className="bg-cream pt-[100px]">
        <div className="page-inner">
          <div className="grid md:grid-cols-2 gap-14 items-start py-[72px] max-[768px]:grid-cols-1 max-[768px]:py-10 max-[768px]:gap-10">
            <PageTitle
              eyebrow={isES ? 'Planificador de viajes' : 'Trip planner'}
              title={isES ? 'Viaja bien. Planea menos.' : 'Travel well. Plan less.'}
              lede={isES
                ? 'Describe tu viaje: destino, días, quién va y en 60 segundos tienes el itinerario día por día, dónde quedarte y todo lo que falta reservar. Con lugares que no están en la lista de siempre.'
                : "Describe your trip: destination, days, who's going, and in 60 seconds you get the day-by-day itinerary, where to stay, and everything left to book. With places that aren't on the usual list."}
            >
              <div className="mt-7">
                <ExamplesCta label={isES ? 'Mira un plan completo →' : 'See a full plan →'} />
              </div>
            </PageTitle>

            <HeroForm locale={locale} />
          </div>
        </div>
      </section>

      {/* ② FEATURES */}
      <section className="border-t border-line-soft bg-white py-24 max-[768px]:py-16">
        <div className="page-inner">
          <SectionTitle
            className="mb-14"
            eyebrow={isES ? 'Cómo funciona' : 'How it works'}
            lede={isES
              ? 'Sin pestañas abiertas, sin hojas de cálculo, sin horas de investigación.'
              : 'No open tabs, no spreadsheets, no hours of research.'}
          >
            {isES
              ? 'Del destino al itinerario en 60 segundos.'
              : 'From destination to itinerary in 60 seconds.'}
          </SectionTitle>

          <div className="grid grid-cols-4 max-[768px]:grid-cols-2 gap-6 max-[768px]:gap-6">
            {FEATURES.map((f) => {
              const labels = FEATURE_LABELS[f.key]
              const Icon = { curated: BookOpen, itineraries: ListChecks, personalized: Sparkles, clarity: Focus }[f.key]!

              return (
                <InfoCard key={f.key} title={isES ? labels.title_es : labels.title_en} className="h-full">
                  <FeatureIcon>
                    <Icon size={22} color="white" />
                  </FeatureIcon>
                  {isES ? labels.body_es : labels.body_en}
                </InfoCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* ③ PHILOSOPHY */}
      <section className="border-t border-line-soft bg-cream py-24 max-[768px]:py-16">
        <div className="page-inner">
          <div className="grid md:grid-cols-2 gap-20 items-center max-[768px]:grid-cols-1 max-[768px]:gap-9">
            <div>
              <SectionTitle className="mb-6">
                {isES ? 'Ni demasiado, ni muy poco.' : 'Not too much, not too little.'}
              </SectionTitle>
              <p className="m-0 mb-4 text-body text-pine">
                {isES
                  ? 'Planificar un viaje no debería tomar más tiempo que el viaje mismo. Creemos que el mejor plan es el que llega justo: suficiente estructura para no perderse nada, suficiente espacio para dejarse sorprender.'
                  : "Planning a trip shouldn't take longer than the trip itself. We believe the best plan is one that lands just right: enough structure to miss nothing, enough room to be surprised."}
              </p>
              <p className="m-0 text-body text-ink-2">
                {isES
                  ? 'El nombre viene del sueco: '
                  : 'The name comes from Swedish: '}
                <strong className="font-semibold text-pine">lagom</strong>
                {isES
                  ? '. Ni mucho, ni poco: lo justo. Eso es lo que hacemos con cada viaje: encontrar el punto exacto entre explorar todo y no agotarse en el intento.'
                  : ". Not too much, not too little: just right. That's what we do with every trip: find the exact point between seeing everything and burning out trying."}
              </p>
              <div className="flex gap-3.5 mt-8 flex-wrap">
                <Button as={Link} href="/guides">
                  {isES ? 'Explorar destinos' : 'Explore destinations'}
                </Button>
                <Button href="#nosotras" variant="secondary">
                  {isES ? 'Quiénes somos' : 'About us'}
                </Button>
              </div>
            </div>

            <div className="max-[768px]:-order-1 flex justify-end">
              <div className="w-full max-w-[420px]">
                <Image
                  src="/images/guides/teotihuacan.jpg"
                  alt={isES ? 'Teotihuacán, México' : 'Teotihuacan, Mexico'}
                  width={580}
                  height={725}
                  className="w-full rounded-info object-cover max-[768px]:aspect-[3/2]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ④ GUIDES */}
      <GuidesPreview locale={locale} />

      {/* ⑤ NOSOTRAS */}
      <section id="nosotras" className="border-t border-line-soft bg-cream py-24 max-[768px]:py-16">
        <div className="page-inner">
          <SectionTitle className="mb-14 max-[768px]:mb-9">
            {isES ? 'Quiénes somos' : 'Who we are'}
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-6 max-[768px]:grid-cols-1">
            {[
              {
                name: 'Elena',
                img: '/images/founders/elena.png',
                bio_es:
                  'Profesional creativa con años de experiencia gestionando proyectos complejos, Elena es la mente estratégica detrás de LagomPlan. Casada con un sueco y viajera incansable, aplica el concepto de lagom (la medida justa) para transformar ideas en experiencias reales. Ha vivido en 5 países y visitado más de 40. Su superpoder es la comunicación: cree firmemente que el éxito de cualquier viaje radica en los mensajes claros y las conexiones auténticas.',
                bio_en:
                  'A creative professional with years of experience managing complex projects, Elena is the strategic mind behind LagomPlan. Married to a Swede and an tireless traveler, she applies the concept of lagom (the right measure) to turn ideas into real experiences. She has lived in 5 countries and visited more than 40. Her superpower is communication: she strongly believes that the success of any trip lies in clear messages and authentic connections.',
              },
              {
                name: 'Pilar',
                img: '/images/founders/pilar.png',
                bio_es:
                  'Después de vivir en 10 países y explorar más de 90, Pilar aprendió que el viaje perfecto no es el que más lugares abarca, sino el que mejor se equilibra. Con una trayectoria como editora de Travel + Leisure México y colaboradora en diversos medios internacionales, ha dedicado su carrera a descifrar qué hace que un destino sea memorable. En LagomPlan, utiliza ese ojo editorial para filtrar el ruido y diseñar planes donde el estilo, la cultura y la logística conviven en armonía.',
                bio_en:
                  'After living in 10 countries and exploring more than 90, Pilar learned that the perfect trip is not the one that covers the most ground, but the one that feels most balanced. With a career as an editor at Travel + Leisure México and contributor to various international media, she has devoted her work to understanding what makes a destination truly memorable. At LagomPlan, she uses that editorial eye to filter out the noise and design plans where style, culture, and logistics live in harmony.',
              },
            ].map((f) => (
              <InfoCard key={f.name}>
                <div className="flex items-start gap-6 max-[480px]:flex-col max-[480px]:items-center">
                  <div className="relative size-24 min-w-24 overflow-hidden rounded-full bg-sand">
                    <Image
                      src={f.img}
                      alt={f.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <CardTitle className="mb-3">{f.name}</CardTitle>
                    <p className="m-0 text-body text-pine [text-wrap:pretty]">
                      {isES ? f.bio_es : f.bio_en}
                    </p>
                  </div>
                </div>
              </InfoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ REVIEWS */}
      <section className="relative border-t border-line-soft bg-white py-24 max-[768px]:py-16">
        <div className="page-inner relative z-10">
          <SectionTitle
            className="mb-12 max-[768px]:mb-8"
            eyebrow={isES ? 'Reseñas' : 'Reviews'}
            lede={isES
              ? 'Más de 400 planes creados. Esto es lo que nos cuentan.'
              : "Over 400 plans created. Here's what people tell us."}
          >
            {isES ? 'Lo que dicen los viajeros' : 'What travelers say'}
          </SectionTitle>
          <div className="grid grid-cols-3 gap-6 max-[768px]:grid-cols-1 max-[1024px]:grid-cols-2">
            {REVIEWS.map((r) => (
              <InfoCard key={r.name} tone="sand" className="h-full">
                <p className="m-0 mb-6 text-body text-pine [text-wrap:pretty]">
                  &ldquo;{isES ? r.quote_es : r.quote_en}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={r.img}
                      alt={r.name}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="m-0 text-small font-semibold text-pine">{r.name}</p>
                </div>
              </InfoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ⑦ CTA */}
      <section className="border-t border-line-soft bg-cream py-24 text-center max-[768px]:py-16">
        <div className="page-inner">
          <SectionTitle
            className="mb-10 items-center"
            lede={isES
              ? 'Gratis, sin tarjeta. Describe a dónde vas y la plataforma hace el resto.'
              : "Free, no card needed. Describe where you're going and the platform does the rest."}
          >
            {isES
              ? 'Tu próximo viaje puede estar listo en 60 segundos.'
              : 'Your next trip can be ready in 60 seconds.'}
          </SectionTitle>
          <div className="flex gap-3.5 justify-center flex-wrap max-[768px]:flex-col max-[768px]:items-center">
            <Button as={Link} href="/planner" className="max-[768px]:w-full">
              {isES ? 'Planear mi viaje gratis →' : 'Plan my trip free →'}
            </Button>
            {/* Sample-itinerary link. Set NEXT_PUBLIC_SAMPLE_TRIP_ID in Vercel
                to any saved trip's UUID to feature it here. Anonymous visitors
                can view it read-only because GET /api/trips/[trip_id] has no
                auth requirement. When unset, falls back to the planner form.
                Uses a plain <a> because next-intl's typed <Link> silently
                drops the `query` field — we need the trip_id to actually
                reach the URL. The localized path is composed inline. */}
            {(() => {
              const sampleTripId = process.env.NEXT_PUBLIC_SAMPLE_TRIP_ID
              const plannerPath  = isES ? '/es/planificador' : '/en/planner'
              const sampleHref   = sampleTripId
                ? `${plannerPath}?trip_id=${encodeURIComponent(sampleTripId)}`
                : plannerPath
              return (
                <Button href={sampleHref} variant="secondary" className="max-[768px]:w-full">
                  {isES ? 'Ver ejemplo de itinerario' : 'See a sample itinerary'}
                </Button>
              )
            })()}
          </div>
        </div>
      </section>

      {/* ⑧ NEWSLETTER */}
      <div className="bg-pine py-14 max-[768px]:py-10">
        <div className="page-inner grid grid-cols-[1.1fr_1fr] gap-10 items-center max-[900px]:grid-cols-1 max-[900px]:gap-6">
          <div>
            <CardTitle className="mb-3 !text-cream">
              {isES ? 'Tu escapada, lista en minutos' : 'Your getaway, ready in minutes'}
            </CardTitle>

            <p className="m-0 max-w-[520px] text-body text-cream/80">
              {isES
                ? 'Recibe ideas de viaje curadas, nuevas guías y tips útiles para planear mejor.'
                : 'Get curated travel ideas, new guides, and useful planning tips.'}
            </p>
          </div>

          <NewsletterForm locale={locale} />
        </div>
      </div>
    </main>
  )
}
