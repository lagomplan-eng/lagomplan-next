/**
 * app/[locale]/examples/page.tsx — /ejemplos (ES) · /examples (EN)
 *
 * Showcases 3 real, previously-generated trips as public read-only examples
 * (trips.is_public_example = true) so new visitors can see what the product
 * produces without generating their own. Card links intentionally always
 * point at /es/planificador regardless of page locale — the 3 trips
 * themselves are Spanish-language content (see PASO 0/2 task notes).
 */

import type { Metadata } from 'next'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale } from '../../../i18n'
import ExampleCard from '../../../components/examples/ExampleCard'

const EXAMPLES = [
  {
    id: 'copenhague',
    tripId: 'f27f61eb-9f6f-4eb1-b874-11e0b04d33e7',
    title_es: 'Copenhague · 5 días · grupo de amigos',
    title_en: 'Copenhagen · 5 days · group of friends',
    body_es: 'Fíjate en el presupuesto desglosado por categoría, y en que cada actividad ya trae su horario y su porqué.',
    body_en: 'Notice the budget broken down by category, and how every activity already comes with its time and its reasoning.',
  },
  {
    id: 'cartagena',
    tripId: 'b0fef49b-5049-46ed-9b4f-40dc9c56a613',
    title_es: 'Cartagena · en familia',
    title_en: 'Cartagena · with family',
    body_es: 'Este trae el itinerario adaptado al ritmo de una familia y la checklist completa de qué reservar antes de llegar.',
    body_en: 'This one adapts the itinerary to a family\'s pace, plus the full checklist of what to book before arriving.',
  },
  {
    id: 'ensenada',
    tripId: 'aa134594-e4c9-42e3-a10b-bfb395c37674',
    title_es: 'Ensenada · en pareja',
    title_en: 'Ensenada · as a couple',
    body_es: 'Un fin de semana corto y bien resuelto — nota cómo el plan organiza tiempos cortos sin sentirse apretado.',
    body_en: 'A short, well-organized weekend — notice how the plan handles tight timing without feeling rushed.',
  },
] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title:      locale === 'es' ? 'Esto es lo que recibes' : 'This is what you get',
    alternates: buildAlternates('examples'),
    openGraph:  buildOpenGraph(locale),
  }
}

export default async function ExamplesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const isES = locale === 'es'

  return (
    <main className="pt-[100px] min-h-screen" style={{ background: '#FFF9F3' }}>
      <div className="page-inner py-24 max-[768px]:py-16">
        <span className="sec-label">
          {isES ? 'Ejemplos' : 'Examples'}
        </span>
        <h1 className="font-sans text-[40px] max-[768px]:text-[30px] font-bold text-[#0F3A33] leading-[1.1] mb-5 [text-wrap:balance]">
          {isES ? 'Esto es lo que recibes.' : 'This is what you get.'}
        </h1>
        <p className="font-sans text-[15px] text-[#3E5F58] leading-[1.7] max-w-[640px] mb-14 [text-wrap:pretty]">
          {isES
            ? 'No es una lista de ideas. Es tu viaje completo: itinerario día por día con horarios, hotel recomendado y por qué, presupuesto desglosado, y todo lo que falta reservar, en orden. Estos son planes reales que ya generamos — míralos, y si quieres el tuyo, es gratis para los primeros 3 viajes.'
            : "It's not a list of ideas. It's your complete trip: a day-by-day itinerary with times, a recommended hotel and why, a broken-down budget, and everything left to book, in order. These are real plans we already generated — take a look, and if you want your own, it's free for your first 3 trips."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {EXAMPLES.map((ex) => (
            <ExampleCard
              key={ex.id}
              ctaId={`examples_view_plan_${ex.id}`}
              title={isES ? ex.title_es : ex.title_en}
              body={isES ? ex.body_es : ex.body_en}
              ctaLabel={isES ? 'Ver el plan completo →' : 'See the full plan →'}
              href={`/es/planificador?trip_id=${ex.tripId}`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
