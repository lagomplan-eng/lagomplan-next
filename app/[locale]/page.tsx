/**
 * app/[locale]/page.tsx — Homepage
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '../../lib/navigation'
import { getGuideUrl } from '../../lib/routes'
import { buildAlternates, buildOpenGraph } from '../../lib/seo'
import { getAllGuides } from '../../lib/guides'
import type { Locale } from '../../i18n'
import HeroForm from '../../components/forms/HeroForm'
import { BookOpen, ListChecks, Sparkles, Focus } from 'lucide-react'

// ── Metadata ───────────────────────────────────────────────
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
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
      'Ideas claras para decidir rápido: qué vale la pena, qué saltarte y cómo vivir el destino con buen ritmo.',
    body_en:
      "Clear ideas to decide fast: what's worth it, what to skip, and how to experience the destination at the right pace.",
  },
  itineraries: {
    title_es: 'Itinerarios simples',
    title_en: 'Simple itineraries',
    body_es:
      'Pasa de inspiración a un plan por día en minutos. Sin Excel, sin mil tabs.',
    body_en:
      'Go from inspiration to a day-by-day plan in minutes. No Excel, no endless tabs.',
  },
  personalized: {
    title_es: 'Personalizado',
    title_en: 'Personalized',
    body_es:
      'Familias, parejas, relax o aventura: sugerencias que se adaptan a tu forma de viajar.',
    body_en:
      'Families, couples, relaxed or adventurous: suggestions that adapt to your travel style.',
  },
  clarity: {
    title_es: 'Claridad total',
    title_en: 'Total clarity',
    body_es:
      'Recomendaciones concretas y ordenadas para que planificar se sienta ligero.',
    body_en:
      'Concrete, organized recommendations so planning feels effortless.',
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
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const isES = locale === 'es'
  const GUIDES = getAllGuides(locale)

  return (
    <main>
      {/* ① HERO — pt-[64px] because Nav is fixed */}
      <section className="pt-[64px]" style={{ background: '#fff9f3' }}>
        <div className="page-inner">
          <div className="grid md:grid-cols-2 gap-14 items-start py-[72px] max-[768px]:grid-cols-1 max-[768px]:py-10 max-[768px]:gap-10">
            <div>
              <span className="sec-label">
                {isES
                  ? 'Planificador de viajes con IA'
                  : 'AI-powered travel planner'}
              </span>
              <h1 className="font-sans text-[60px] max-[768px]:text-[40px] font-bold text-[#0F3A33] leading-[1.05] tracking-[-1.5px] mb-5">
                {isES
                  ? 'Tu próxima aventura comienza aquí'
                  : 'Your next adventure starts here'}
              </h1>
              <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.75] mb-7 max-w-[360px] max-[768px]:max-w-full">
                {isES
                  ? 'Escribe a dónde quieres ir. En minutos tienes tu itinerario, hoteles recomendados y presupuesto listo.'
                  : 'Tell us where you want to go. In minutes, get your itinerary, hotel picks, and budget ready.'}
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
                <p className="font-sans text-[11px] text-[#3E5F58] tracking-[.2px] ml-3">
                  <strong className="text-[#0F3A33] font-semibold">
                    {isES ? '+400 planes creados' : '+400 plans created'}
                  </strong>{' '}
                  {isES ? 'este mes' : 'this month'}
                  <br />
                  <span className="text-[#E1615B] tracking-[2.5px]">
                    ★★★★★
                  </span>
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
            {isES ? 'Planificación integrada' : 'Integrated planning'}
          </span>
          <h2 className="font-sans text-[40px] max-[768px]:text-[30px] font-bold text-[#0F3A33] leading-[1.15] mb-4">
            {isES
              ? 'Tu guía y tu plan en una sola vista.'
              : 'Your guide and plan in one view.'}
          </h2>
          <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.7] max-w-[520px] mb-14">
            {isES
              ? 'Explora recomendaciones listas para usar y conviértelas en un itinerario simple, sin complicarte.'
              : 'Explore ready-to-use recommendations and turn them into a simple itinerary, without the fuss.'}
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
                {isES ? 'Equilibrio en cada viaje.' : 'Balance in every trip.'}
              </h2>
              <p className="font-sans text-[15px] text-[#0F3A33] leading-[1.8] mb-4">
                {isES
                  ? 'En LagomPlan, no creemos en los itinerarios imposibles ni en la parálisis que genera tener demasiadas opciones. Nacimos de una premisa simple: planificar un viaje debería sentirse tan bien como el destino mismo.'
                  : "At LagomPlan, we don't believe in impossible itineraries or the paralysis that comes from too many options. We were born from a simple premise: planning a trip should feel as good as the destination itself."}
              </p>
              <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.8]">
                {isES
                  ? 'Nuestra filosofía se inspira en el concepto sueco '
                  : 'Our philosophy draws from the Swedish concept '}
                <strong className="text-[#0F3A33] font-semibold">Lagom</strong>
                {isES
                  ? ' —ni mucho, ni poco, lo justo—, buscando ese equilibrio perfecto entre la curiosidad por explorar y la necesidad de descansar.'
                  : ' —not too much, not too little, just right— seeking the perfect balance between the curiosity to explore and the need to rest.'}
              </p>
              <div className="flex gap-3.5 mt-8 flex-wrap">
                <Link href="/guides" className="btn-solid">
                  {isES ? 'Guías de viaje' : 'Travel guides'}
                </Link>
                <Link href="/about" className="btn-outline">
                  {isES ? 'Nosotras' : 'About us'}
                </Link>
              </div>
            </div>

            <div className="max-[768px]:-order-1 flex justify-end">
              <div className="w-full max-w-[420px]">
                <Image
                  src="/images/teotihuacan.jpg"
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
      <section
        className="py-24 max-[768px]:py-16"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid rgba(200,191,181,.3)',
        }}
      >
        <div className="page-inner">
          <div className="flex items-end justify-between mb-10 max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-3">
            <div>
              <span className="sec-label">
                {isES ? 'Guías curadas' : 'Curated guides'}
              </span>
              <h2 className="font-sans text-[40px] max-[768px]:text-[30px] font-bold text-[#0F3A33] leading-[1.1]">
                {isES ? 'Descubre nuestras guías.' : 'Discover our guides.'}
              </h2>
            </div>
            <Link
              href="/guides"
              className="font-sans text-[13px] font-medium text-[#0F3A33] border-b border-[#0F3A33] pb-[2px] hover:text-[#6B8F86] hover:border-[#6B8F86] transition-colors whitespace-nowrap"
            >
              {isES ? 'Ver más guías' : 'See all guides'}
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 max-[768px]:grid-cols-1 max-[1024px]:grid-cols-2">
            {GUIDES.map((g) => (
              <a
                key={g.slug_es}
                href={getGuideUrl(locale, g)}
                className="guide-card block text-[#0F3A33] no-underline"
              >
                <div className="guide-img-wrap">
                  <Image
                    src={g.cover_img}
                    alt={isES ? g.title_es : g.title_en}
                    width={480}
                    height={360}
                    className="guide-img"
                  />
                </div>
                <div className="guide-card-body">
                  <span className="font-sans text-[10px] font-medium tracking-[0.1em] text-[#3E5F58] uppercase block mb-1.5">
                    {isES ? g.tags_es?.[0] : g.tags_en?.[0]}
                  </span>
                  <p className="font-sans text-[16px] font-semibold text-[#0F3A33] leading-[1.35]">
                    {isES ? g.title_es : g.title_en}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

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
            {isES ? 'Nosotras.' : 'About us.'}
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
        className="py-24 max-[768px]:py-16 relative overflow-hidden"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid rgba(200,191,181,.3)',
        }}
      >
        <svg
          className="absolute bottom-0 left-0 right-0 h-[80px] opacity-[0.05] pointer-events-none"
          viewBox="0 0 1200 80"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden="true"
        >
          <rect x="20" y="15" width="44" height="65" fill="#0F3A33" />
          <rect x="75" y="35" width="30" height="45" fill="#0F3A33" />
          <rect x="125" y="5" width="54" height="75" fill="#0F3A33" />
          <rect x="190" y="28" width="38" height="52" fill="#0F3A33" />
          <rect x="250" y="18" width="46" height="62" fill="#0F3A33" />
          <rect x="315" y="2" width="58" height="78" fill="#0F3A33" />
          <rect x="695" y="0" width="63" height="80" fill="#0F3A33" />
          <rect x="875" y="8" width="53" height="72" fill="#0F3A33" />
        </svg>

        <div className="page-inner relative z-10">
          <span className="sec-label">{isES ? 'Reseñas' : 'Reviews'}</span>
          <h2 className="font-sans text-[40px] max-[768px]:text-[30px] font-bold text-[#0F3A33] leading-[1.1] mb-12 max-[768px]:mb-8">
            {isES ? 'Lo que dicen los viajeros.' : 'What travelers say.'}
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
            <em className="font-display" style={{ fontStyle: 'italic' }}>
              {isES ? 'tu próxima aventura.' : 'your next adventure.'}
            </em>
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
                  <em className="font-display" style={{ fontStyle: 'italic' }}>
                    lista en minutos.
                  </em>
                </>
              ) : (
                <>
                  Your getaway,{' '}
                  <em className="font-display" style={{ fontStyle: 'italic' }}>
                    ready in minutes.
                  </em>
                </>
              )}
            </h3>

            <p className="font-sans text-[15px] text-[rgba(255,249,243,0.78)] leading-[1.7] max-w-[520px]">
              {isES
                ? 'Recibe ideas de viaje curadas, nuevas guías y tips útiles para planear mejor.'
                : 'Get curated travel ideas, new guides, and useful planning tips.'}
            </p>
          </div>

          <form
            action="https://elenaferre.us13.list-manage.com/subscribe/post?u=6926f5f508747ce3ab9253cc3&id=71a26fbc9a&f_id=00c661e1f0"
            method="POST"
            target="_blank"
            noValidate
            className="flex w-full max-[640px]:flex-col"
          >
            <input
              type="email"
              name="EMAIL"
              required
              placeholder={isES ? 'Tu correo electrónico' : 'Your email address'}
              className="flex-1 font-sans text-[15px] px-5 py-4 text-[#FFF9F3] placeholder-[rgba(255,249,243,0.58)] focus:outline-none"
              style={{
                border: '1px solid rgba(255,249,243,0.18)',
                background: 'rgba(255,255,255,0.10)',
              }}
            />

            <input type="hidden" name="FNAME" value="-" />
            <input type="hidden" name="tags" value="7069222" />

            <button
              type="submit"
              className="font-sans text-[15px] font-semibold px-6 py-4 whitespace-nowrap border-none cursor-pointer transition-colors max-[640px]:mt-3"
              style={{ background: '#FFF9F3', color: '#0F3A33' }}
            >
              {isES ? 'Suscribirme' : 'Subscribe'}
            </button>

            <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
              <input
                type="text"
                name="b_6926f5f508747ce3ab9253cc3_71a26fbc9a"
                tabIndex={-1}
                defaultValue=""
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}