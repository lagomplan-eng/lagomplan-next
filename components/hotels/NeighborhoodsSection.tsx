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

const PINE  = '#0F3A33'
const SAGE  = '#6B8F86'
const NK    = '#131313'
const MU    = '#8A8480'
const BD    = '#DDD8D2'
const WHITE = '#FFFFFF'

// Color tokens for the three editorial kinds. `scaffold` items aren't
// rendered (filtered upstream) but the type ships for completeness.
const KIND_COLOR: Record<NeighborhoodItem['kind'], string> = {
  recommended: '#1A6B5A',  // active pine — positive
  alternative: '#6B8F86',  // sage — neutral
  avoid:       '#B45A3C',  // warm red-brown — warning
  scaffold:    '#BDB8B2',  // muted — should not render
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
    <section style={{ padding: '0 0 64px' }}>
      <div className="page-inner">
        {/* Section header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            color: SAGE, marginBottom: 8,
          }}>{L.eyebrow}</p>
          <h2 style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 30, fontWeight: 800,
            color: NK, marginBottom: 8, lineHeight: 1.1,
            maxWidth: 720,
          }}>{L.headline}</h2>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 14, color: MU,
            lineHeight: 1.6, maxWidth: 560,
          }}>{L.sub}</p>
        </div>

        {/* Per-city blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
    <article style={{
      background: WHITE, borderRadius: 14, border: `1.5px solid ${BD}`,
      padding: '28px 28px 24px',
    }}>
      {/* City + optional intro */}
      <h3 style={{
        fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 800,
        color: NK, marginBottom: city.intro ? 10 : 18, lineHeight: 1.2,
      }}>{city.cityName}</h3>

      {city.intro && (
        <p style={{
          fontFamily: "'Manrope', sans-serif", fontSize: 14, color: MU,
          lineHeight: 1.6, marginBottom: 22, maxWidth: 720,
        }}>{city.intro}</p>
      )}

      {/* Neighborhood items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {renderableItems.map(item => (
          <div key={item.id} style={{
            paddingLeft: 16,
            borderLeft: `3px solid ${KIND_COLOR[item.kind]}`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
              flexWrap: 'wrap',
            }}>
              {kindLabel[item.kind] && (
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontSize: 9, fontWeight: 700,
                  letterSpacing: '1.2px', textTransform: 'uppercase',
                  color: KIND_COLOR[item.kind],
                }}>{kindLabel[item.kind]}</span>
              )}
              <h4 style={{
                fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700,
                color: NK, lineHeight: 1.3,
              }}>{item.title}</h4>
            </div>
            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: 14, color: MU,
              lineHeight: 1.65,
            }}>{item.body}</p>
          </div>
        ))}
      </div>
    </article>
  )
}
