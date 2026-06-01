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
import { BookOpen, ListChecks, Sparkles, Focus } from 'lucide-react'

// ── Metadata ───────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('home'),
    openGraph: buildOpenGraph(locale),
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
      'The platform is incredibly intuitive — three clicks and we went from idea to the perfect itinerary. Essential for organizing our trip with total clarity and calm.',
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
      'Destinos reales, sin relleno. Lo que vale la pena y lo que no — directo.',
    body_en:
      "Real destinations, no filler. What's worth it and what isn't — straight to the point.",
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
      'Familia, pareja, ritmo relajado o intenso — el plan se adapta a cómo viajas tú.',
    body_en:
      'Family, couple, relaxed or intense pace — the plan adapts to how you travel.',
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
  <div
    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
    style={{ backgroundColor: '#0F3A33' }}
  >
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
      <section className="pt-[100px]" style={{ background: '#fff9f3' }}>
        <div className="page-inner">
          <div className="grid md:grid-cols-2 gap-14 items-start py-[72px] max-[768px]:grid-cols-1 max-[768px]:py-10 max-[768px]:gap-10">
            <div>
              <span className="sec-label">
                {isES
                  ? 'Planificador de viajes'
                  : 'Trip planner'}
              </span>
              <h1 className="font-sans text-[60px] max-[768px]:text-[40px] font-bold text-[#0F3A33] leading-[1.05] tracking-[-1.5px] mb-5">
                {isES
                  ? 'Viaja bien. Planea menos.'
                  : 'Travel well. Plan less.'}
              </h1>
              <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.75] mb-7 max-w-[360px] max-[768px]:max-w-full">
                {isES
                  ? 'Describe tu viaje — destino, días, quién va — y en 30 segundos tienes un itinerario completo con hoteles, actividades y presupuesto. En español.'
                  : "Describe your trip — destination, days, who's going — and in 30 seconds you get a complete itinerary with hotels, activities, and budget."}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex">
                  {REVIEWS.map((r) => (
                    <div
                      key={r.name}
                      className="w-[30px] h-[30px] rounded-full border-[2.5px] overflow-hidden -mr-[9px] bg-[#C0D5CE] flex-shrink-0"
                      style={{ borderColor: '#EDE7E1' }}
                    >
                      <Image
                        src={r.img}
                        alt={r.name}
                        width={30}
                        height={30}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="font-sans text-[11px] text-[#3E5F58] tracking-[.2px] ml-3 leading-[1.55]">
                  <strong className="text-[#0F3A33] font-semibold">
                    {isES ? '+400 itinerarios creados' : '+400 itineraries created'}
                  </strong>{' '}
                  {isES ? 'este mes' : 'this month'}
                  <br />
                  {isES
                    ? 'parejas, familias y fans del Mundial'
                    : 'couples, families, and World Cup fans'}
                </p>
              </div>
            </div>

            <HeroForm locale={locale} />
          </div>
        </div>
      </section>

      {/* ② FEATURES */}
      <section
        className="py-24 max-[768px]:py-16"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid rgba(200,191,181,.3)',
        }}
      >
        <div className="page-inner">
          <span className="sec-label">
            {isES ? 'Cómo funciona' : 'How it works'}
          </span>
          <h2 className="font-sans text-[40px] max-[768px]:text-[30px] font-bold text-[#0F3A33] leading-[1.15] mb-4">
            {isES
              ? 'Del destino al itinerario en 30 segundos.'
              : 'From destination to itinerary in 30 seconds.'}
          </h2>
          <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.7] max-w-[520px] mb-14">
            {isES
              ? 'Sin pestañas abiertas, sin hojas de cálculo, sin horas de investigación.'
              : 'No open tabs, no spreadsheets, no hours of research.'}
          </p>

          <div className="grid grid-cols-4 max-[768px]:grid-cols-2 gap-6 max-[768px]:gap-6">
            {FEATURES.map((f) => {
              const labels = FEATURE_LABELS[f.key]

              return (
                <div key={f.key} className="flex flex-col items-start">
                  <div className="mb-5">
                    {f.key === 'curated' && (
                      <FeatureIcon>
                        <BookOpen size={22} color="white" />
                      </FeatureIcon>
                    )}
                    {f.key === 'itineraries' && (
                      <FeatureIcon>
                        <ListChecks size={22} color="white" />
                      </FeatureIcon>
                    )}
                    {f.key === 'personalized' && (
                      <FeatureIcon>
                        <Sparkles size={22} color="white" />
                      </FeatureIcon>
                    )}
                    {f.key === 'clarity' && (
                      <FeatureIcon>
                        <Focus size={22} color="white" />
                      </FeatureIcon>
                    )}
                  </div>

                  <p className="font-sans text-[15px] font-semibold text-[#0F3A33] mt-1 mb-2">
                    {isES ? labels.title_es : labels.title_en}
                  </p>
                  <p className="font-sans text-[13px] text-[#6B8F86] leading-[1.7] max-w-[240px] min-h-[72px]">
                    {isES ? labels.body_es : labels.body_en}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ③ PHILOSOPHY */}
      <section
        className="py-24 max-[768px]:py-16"
        style={{
          background: '#FFF9F3',
          borderTop: '1px solid rgba(200,191,181,.3)',
        }}
      >
        <div className="page-inner">
          <div className="grid md:grid-cols-2 gap-20 items-center max-[768px]:grid-cols-1 max-[768px]:gap-9">
            <div>
              <h2 className="font-sans text-[42px] max-[768px]:text-[32px] font-bold text-[#0F3A33] leading-[1.12] mb-6">
                {isES ? 'Ni demasiado, ni muy poco.' : 'Not too much, not too little.'}
              </h2>
              <p className="font-sans text-[15px] text-[#0F3A33] leading-[1.8] mb-4">
                {isES
                  ? 'Planificar un viaje no debería tomar más tiempo que el viaje mismo. Creemos que el mejor plan es el que llega justo — suficiente estructura para no perderse nada, suficiente espacio para dejarse sorprender.'
                  : "Planning a trip shouldn't take longer than the trip itself. We believe the best plan is one that lands just right — enough structure to miss nothing, enough room to be surprised."}
              </p>
              <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.8]">
                {isES
                  ? 'El nombre viene del sueco: '
                  : 'The name comes from Swedish: '}
                <strong className="text-[#0F3A33] font-semibold">lagom</strong>
                {isES
                  ? '. Ni mucho, ni poco — lo justo. Eso es lo que hacemos con cada viaje: encontrar el punto exacto entre explorar todo y no agotarse en el intento.'
                  : ". Not too much, not too little — just right. That's what we do with every trip: find the exact point between seeing everything and burning out trying."}
              </p>
              <div className="flex gap-3.5 mt-8 flex-wrap">
                <Link href="/guides" className="btn-solid">
                  {isES ? 'Explorar destinos' : 'Explore destinations'}
                </Link>
                <a href="#nosotras" className="btn-outline">
  {isES ? 'Quiénes somos' : 'About us'}
</a>
              </div>
            </div>

            <div className="max-[768px]:-order-1 flex justify-end">
              <div className="w-full max-w-[420px]">
                <Image
                  src="/images/guides/teotihuacan.jpg"
                  alt={isES ? 'Teotihuacán, México' : 'Teotihuacan, Mexico'}
                  width={580}
                  height={725}
                  className="w-full object-cover rounded-[12px] max-[768px]:aspect-[3/2]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ④ GUIDES */}
      <GuidesPreview locale={locale} />

      {/* ⑤ NOSOTRAS */}
      <section
        id="nosotras"
        className="py-24 max-[768px]:py-16"
        style={{
          background: '#FFF9F3',
          borderTop: '1px solid rgba(200,191,181,.3)',
        }}
      >
        <div className="page-inner">
          <h2 className="font-sans text-[40px] max-[768px]:text-[30px] font-bold text-[#0F3A33] leading-[1.1] mb-14 max-[768px]:mb-9">
            {isES ? 'Nosotras' : 'About us'}
          </h2>

          <div className="grid md:grid-cols-2 gap-14 max-[768px]:grid-cols-1 max-[768px]:gap-10">
            {[
              {
                name: 'Elena',
                img: '/images/founders/elena.png',
                bio_es:
                  'Profesional creativa con años de experiencia gestionando proyectos complejos, Elena es la mente estratégica detrás de LagomPlan. Casada con un sueco y viajera incansable, aplica el concepto de lagom (la medida justa) para transformar ideas en experiencias reales. Ha vivido en 5 países y visitado más de 40. Su superpoder es la comunicación: cree firmemente que el éxito de cualquier viaje radica en los mensajes claros y las conexiones auténticas.',
                bio_en:
                  'A creative professional with years of experience managing complex projects, Elena is the strategic mind behind LagomPlan. Married to a Swede and an tireless traveler, she applies the concept of lagom — the right measure — to turn ideas into real experiences. She has lived in 5 countries and visited more than 40. Her superpower is communication: she strongly believes that the success of any trip lies in clear messages and authentic connections.',
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
              <div
                key={f.name}
                className="flex items-start gap-6 max-[480px]:flex-col max-[480px]:items-center"
              >
                <div className="relative w-[96px] h-[96px] min-w-[96px] rounded-full overflow-hidden bg-[#EDE7E1] border border-[#EDE7E1]">
                  <Image
                    src={f.img}
                    alt={f.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-sans text-[18px] font-semibold text-[#0F3A33] mb-3">
                    {f.name}
                  </p>
                  <p className="font-sans text-[15px] text-[#0F3A33] leading-[1.8]">
                    {isES ? f.bio_es : f.bio_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ REVIEWS */}
      <section
        className="py-24 max-[768px]:py-16 relative"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid rgba(200,191,181,.3)',
        }}
      >
        <div className="page-inner relative z-10">
          <span className="sec-label">{isES ? 'Reseñas' : 'Reviews'}</span>
          <h2 className="font-sans text-[40px] max-[768px]:text-[30px] font-bold text-[#0F3A33] leading-[1.1] mb-12 max-[768px]:mb-8">
            {isES ? 'Lo que dicen los viajeros' : 'What travelers say'}
          </h2>
          <div className="grid grid-cols-3 gap-6 max-[768px]:grid-cols-1 max-[1024px]:grid-cols-2">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="rounded-[12px] p-9 max-[768px]:p-7"
                style={{
                  background: '#FFF9F3',
                  border: '1px solid rgba(200,191,181,.22)',
                }}
              >
                <p className="font-sans text-[15px] text-[#0F3A33] leading-[1.8] mb-6">
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
                  <div>
                    <p className="font-sans text-[13px] font-semibold text-[#0F3A33]">
                      {r.name}
                    </p>
                    <p className="font-sans text-[10px] tracking-[2px] text-[#E1615B]">
                      ★★★★★
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑦ CTA */}
      <section
        className="py-24 max-[768px]:py-16 text-center"
        style={{
          background: '#FFF9F3',
          borderTop: '1px solid rgba(200,191,181,.3)',
        }}
      >
        <div className="page-inner">
          <h2 className="font-sans text-[50px] max-[768px]:text-[34px] font-bold text-[#0F3A33] leading-[1.08] mb-4">
            {isES ? 'Empieza a planificar' : 'Start planning'}
            <br />
            <span className="font-sans">
              {isES ? 'tu próxima aventura' : 'your next adventure'}
            </span>
          </h2>
          <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.7] max-w-[420px] mx-auto mb-10">
            {isES
              ? 'Explora guías curadas y conviértelas en un plan simple por día, en minutos.'
              : 'Explore curated guides and turn them into a simple day-by-day plan, in minutes.'}
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap max-[768px]:flex-col max-[768px]:items-center">
            <Link
              href="/planner"
              className="btn-solid max-[768px]:w-full max-[768px]:text-center"
            >
              {isES ? 'Planificar' : 'Plan my trip'}
            </Link>
            <Link
              href="/guides"
              className="btn-outline max-[768px]:w-full max-[768px]:text-center"
            >
              {isES ? 'Explorar guías' : 'Explore guides'}
            </Link>
          </div>
        </div>
      </section>

      {/* ⑧ NEWSLETTER */}
      <div className="py-14 max-[768px]:py-10" style={{ background: '#0F3A33' }}>
        <div className="page-inner grid grid-cols-[1.1fr_1fr] gap-10 items-center max-[900px]:grid-cols-1 max-[900px]:gap-6">
          <div>
            <h3 className="font-sans text-[30px] max-[768px]:text-[24px] font-bold text-[#FFF9F3] leading-[1.2] mb-3">
              {isES ? (
                <>
                  Tu escapada,{' '}
                  <span className="font-sans">
                    lista en minutos
                  </span>
                </>
              ) : (
                <>
                  Your getaway,{' '}
                  <span className="font-sans">
                    ready in minutes
                  </span>
                </>
              )}
            </h3>

            <p className="font-sans text-[15px] text-[rgba(255,249,243,0.78)] leading-[1.7] max-w-[520px]">
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