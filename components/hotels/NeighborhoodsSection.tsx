/**
 * components/hotels/NeighborhoodsSection.tsx
 *
 * "Dónde quedarse — por barrio" panel for the Hotels index.
 * Renders one card per city that has at least one neighborhood with
 * editorial body copy. Cities that only have scaffolds (extracted names
 * with no body yet) stay hidden until the body is filled in.
 *
 * Data source: getRenderableCityNeighborhoods() — same two-corpora
 * rule as the rest of the page (curated guides + worldcup cities only).
 */

import type { CityNeighborhoods, NeighborhoodItem } from '../../lib/hotels-neighborhoods'
import { CardTitle, InfoCard, SectionTitle } from '../design'

// The three editorial kinds, on the shared tokens (the `scaffold` kind is filtered upstream).
const KIND_BORDER: Record<NeighborhoodItem['kind'], string> = {
  recommended: 'border-pine',
  alternative: 'border-sage',
  avoid:       'border-coral',
  scaffold:    'border-line-soft',
}
const KIND_TEXT: Record<NeighborhoodItem['kind'], string> = {
  recommended: 'text-pine',
  alternative: 'text-sage-text',
  avoid:       'text-coral',
  scaffold:    'text-label',
}

interface Props {
  cities: CityNeighborhoods[]
  locale: 'es' | 'en'
}

export default function NeighborhoodsSection({ cities, locale }: Props) {
  if (cities.length === 0) return null
  const isES = locale === 'es'

  const L = {
    eyebrow:    isES ? 'Por barrio'                        : 'By neighborhood',
    headline:   isES ? 'El barrio importa más que el hotel' : 'The neighborhood matters more than the hotel',
    sub:        isES
      ? 'Dónde basarte cambia el viaje. Esto es lo que recomendamos por ciudad.'
      : 'Where you base yourself shapes the whole trip. Here\'s what we recommend per city.',
    kindLabel:  {
      recommended: isES ? 'Recomendado'  : 'Recommended',
      alternative: isES ? 'Alternativa'  : 'Alternative',
      avoid:       isES ? 'Evitar'       : 'Avoid',
      scaffold:    '',
    } satisfies Record<NeighborhoodItem['kind'], string>,
  }

  return (
    <section className="pb-16">
      <div className="page-inner">
        <div className="mb-7">
          <SectionTitle eyebrow={L.eyebrow} lede={L.sub}>{L.headline}</SectionTitle>
        </div>

        <div className="flex flex-col gap-6">
          {cities.map(city => (
            <CityBlock key={city.cityId} city={city} kindLabel={L.kindLabel} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Per-city block ──────────────────────────────────────────────────────────

interface CityBlockProps {
  city:      CityNeighborhoods
  kindLabel: Record<NeighborhoodItem['kind'], string>
}

function CityBlock({ city, kindLabel }: CityBlockProps) {
  // Filter out scaffold items at the item level too — defensive in case a
  // city has SOME items with bodies and SOME without.
  const renderableItems = city.items.filter(it => it.body.trim().length > 0)
  if (renderableItems.length === 0) return null

  return (
    <InfoCard as="article" tone="white">
      <CardTitle as="h3" className={city.intro ? 'mb-3' : 'mb-5'}>{city.cityName}</CardTitle>

      {city.intro && <p className="m-0 mb-6 max-w-[720px] font-sans text-small text-ink-body">{city.intro}</p>}

      <div className="flex flex-col gap-4">
        {renderableItems.map(item => (
          <div key={item.id} className={`border-l-[3px] pl-4 ${KIND_BORDER[item.kind]}`}>
            <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
              {kindLabel[item.kind] && (
                <span className={`font-sans text-micro font-bold uppercase tracking-[.12em] ${KIND_TEXT[item.kind]}`}>{kindLabel[item.kind]}</span>
              )}
              <h4 className="m-0 font-sans text-h5 text-pine">{item.title}</h4>
            </div>
            <p className="m-0 font-sans text-small text-ink-body">{item.body}</p>
          </div>
        ))}
      </div>
    </InfoCard>
  )
}
