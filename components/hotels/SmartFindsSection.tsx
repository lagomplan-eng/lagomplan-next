/**
 * components/hotels/SmartFindsSection.tsx
 *
 * "Smart finds" panel on the Hotels index. Horizontal scrolling row of
 * editorial product cards lifted from lib/smart-finds.ts. Same visual
 * language as the rest of the Hotels page — same eyebrow + headline
 * pattern, same outlined card chrome.
 *
 * Card anatomy (top to bottom):
 *   · Category eyebrow (Manrope mono-ish, sage, uppercase)
 *   · Emoji glyph (large, visual anchor)
 *   · Brand name (uppercase, mono, sage)
 *   · Product name (Manrope 800)
 *   · Outlined tag pill
 *   · Opinion paragraph (truncated by line-height)
 *   · Price · where + "Ver →" CTA
 *
 * Bilingual: only the section headers + the CTA flip locales. Product
 * copy stays in Spanish until EN translations are added — same pattern
 * as the worldcup-stays data on the same page.
 */

import {
  getProductsBySurface,
  type Product as SmartFind,
  type SmartFindCategory,
} from '../../lib/smart-finds'

// Pre-resolve on import — server-component evaluation, no per-render cost.
const SMART_FINDS = getProductsBySurface('hotels-strip')

const PINE  = '#0F3A33'
const SAGE  = '#6B8F86'
const NK    = '#131313'
const MU    = '#8A8480'
const BD    = '#DDD8D2'
const WHITE = '#FFFFFF'

const CATEGORY_LABEL: Record<SmartFindCategory, { es: string; en: string }> = {
  avion:      { es: 'El kit del avión',          en: 'The flight kit'            },
  organizado: { es: 'El sistema',                en: 'The system'                },
  conectado:  { es: 'Internet y corriente',      en: 'Power and connectivity'    },
  familia:    { es: 'Viajar con niños',          en: 'Traveling with kids'       },
}

interface Props {
  locale: 'es' | 'en'
}

export default function SmartFindsSection({ locale }: Props) {
  const isES = locale === 'es'

  const L = {
    eyebrow:   isES ? 'Smart finds'                                       : 'Smart finds',
    headline:  isES ? 'Cosas que sí usamos en cada viaje'                 : 'Things we actually use every trip',
    sub:       isES
      ? 'Productos de viaje que pasamos por nuestros propios viajes — no listas patrocinadas.'
      : 'Travel products that survived our own trips — not sponsored lists.',
    cta:       isES ? 'Ver →'                                             : 'View →',
  }

  return (
    <section style={{ padding: '0 0 64px' }}>
      <div className="page-inner">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            color: SAGE, marginBottom: 8,
          }}>{L.eyebrow}</p>
          <h2 style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 30, fontWeight: 800,
            color: NK, marginBottom: 8, lineHeight: 1.1, maxWidth: 720,
          }}>{L.headline}</h2>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 14, color: MU,
            lineHeight: 1.6, maxWidth: 560,
          }}>{L.sub}</p>
        </div>

        {/* Horizontal-scroll card row.
            Why horizontal: 9 products is too many for a grid without
            crowding the rest of the page. Scroll keeps the section
            compact + invites browsing. */}
        <div style={{
          display: 'flex', gap: 16, overflowX: 'auto',
          paddingBottom: 12, scrollSnapType: 'x mandatory',
        }}>
          {SMART_FINDS.map(p => (
            <SmartFindCard
              key={p.id}
              product={p}
              categoryLabel={CATEGORY_LABEL[p.category ?? 'organizado'][locale]}
              cta={L.cta}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────

interface CardProps {
  product:       SmartFind
  categoryLabel: string
  cta:           string
}

function SmartFindCard({ product, categoryLabel, cta }: CardProps) {
  const hasLink = product.link && product.link !== '#'

  return (
    <article style={{
      flex: '0 0 280px',
      background: WHITE, borderRadius: 14, border: `1.5px solid ${BD}`,
      padding: '20px 22px 22px',
      display: 'flex', flexDirection: 'column',
      scrollSnapAlign: 'start',
      transition: 'border-color .2s, transform .2s',
    }}
      className="hover:-translate-y-[2px] hover:border-[#0F3A33]"
    >
      {/* Category */}
      <p style={{
        fontFamily: "'Manrope', sans-serif", fontSize: 9, fontWeight: 700,
        letterSpacing: '1.5px', textTransform: 'uppercase', color: SAGE,
        marginBottom: 14,
      }}>{categoryLabel}</p>

      {/* Emoji + brand + name */}
      {product.emoji && (
        <div style={{ fontSize: 32, marginBottom: 12, lineHeight: 1 }}>
          {product.emoji}
        </div>
      )}
      <p style={{
        fontFamily: "'Manrope', sans-serif", fontSize: 10, fontWeight: 700,
        letterSpacing: '1.2px', textTransform: 'uppercase', color: SAGE,
        marginBottom: 4,
      }}>{product.brand}</p>
      <h3 style={{
        fontFamily: "'Manrope', sans-serif", fontSize: 17, fontWeight: 800,
        color: NK, lineHeight: 1.25, marginBottom: 12,
      }}>{product.name}</h3>

      {/* Tag pill */}
      <div style={{ marginBottom: 14 }}>
        <span style={{
          display: 'inline-block',
          fontFamily: "'Manrope', sans-serif", fontSize: 11, fontWeight: 600,
          padding: '4px 12px', borderRadius: 100,
          border: `1.5px solid ${BD}`, color: NK, background: 'transparent',
        }}>{product.tag}</span>
      </div>

      {/* Opinion — clamp to 5 lines so cards stay roughly the same height */}
      <p style={{
        fontFamily: "'Manrope', sans-serif", fontSize: 13, color: MU,
        lineHeight: 1.55, marginBottom: 16,
        display: '-webkit-box',
        WebkitLineClamp: 5, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{product.opinion}</p>

      {/* Footer: price · where + CTA */}
      <div style={{
        marginTop: 'auto', paddingTop: 12,
        borderTop: `1px solid ${BD}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12,
      }}>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 700,
            color: NK, lineHeight: 1.2,
          }}>{product.price}</p>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 10, fontWeight: 600,
            letterSpacing: '0.8px', textTransform: 'uppercase', color: MU,
            marginTop: 2,
          }}>{product.where}</p>
        </div>
        <a
          href={hasLink ? product.link : '#'}
          {...(hasLink ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})}
          style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 700,
            color: PINE, textDecoration: 'none', whiteSpace: 'nowrap',
          }}
        >{cta}</a>
      </div>
    </article>
  )
}
