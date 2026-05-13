'use client'
/**
 * components/hotels/HotelsClient.tsx
 *
 * Hotels page client — v2 (revamp).
 *
 * Implements the prototype's Hero + filter rows + curated hotels grid.
 * Pulls from the combined `getAllHotels(locale)` feed (guides + worldcup),
 * which is the only source of truth — no synthesized records.
 *
 * Scope of this revision:
 *   - Hero with section label, headline, sub, search input
 *   - Filter row 1: price (Todos / $ / $$ / $$$)
 *   - Filter row 2: archetype (Todos / Familias / Parejas / próx. pills)
 *   - Single curated grid of all filtered hotels using the prototype card spec
 *
 * Out of scope here (Phase B):
 *   - Neighborhoods section (no data)
 *   - Curated vs Inventory split (everything is curated today)
 *   - Smart Finds section (no data)
 *   - Dedicated PlannerBanner / NewsletterBanner (existing NewsletterEndOfGuide
 *     is rendered by the page wrapper)
 */

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  type HotelListing,
  type ArchetypeId,
  type ArchetypeFilter,
  ARCHETYPE_FILTERS,
  PRICE_FILTERS,
  matchesArchetype,
  matchesPrice,
  matchesSearch,
  matchesDestination,
  listDestinations,
} from '../../lib/hotels'
import type { CityNeighborhoods } from '../../lib/hotels-neighborhoods'
import NeighborhoodsSection from './NeighborhoodsSection'

// ── Visual tokens — locked to the prototype + the production design system ──
// Inline so the component is self-contained and matches the prototype 1:1.
// Same hex values used by other planner/guide surfaces.
const PINE   = '#0F3A33'
const SAGE   = '#6B8F86'
const SAND   = '#EDE7E1'
const WHITE  = '#FFFFFF'
const NK     = '#131313'
const MU     = '#8A8480'
const BD     = '#DDD8D2'

// Gradient fallbacks used when a hotel has no cover image (worldcup stays
// derive their image from the city hero; if that's missing too, a
// category-tinted gradient ships instead of an empty box). Pulled from the
// prototype.
const CATEGORY_GRAD: Record<string, string> = {
  Lujo:           'linear-gradient(170deg, #1a4a6e 0%, #2d7a8a 40%, #3a9a8a 70%, #2d6a5a 100%)',
  Boutique:       'linear-gradient(170deg, #1B4D3E 0%, #2d7a5a 40%, #4a9a6a 70%, #2d5a44 100%)',
  Familiar:       'linear-gradient(170deg, #5a3a1a 0%, #8a5a2a 40%, #b4803a 70%, #8a6030 100%)',
  'Design Hotel': 'linear-gradient(170deg, #1a2a5e 0%, #2d4a8a 40%, #4a6aaa 70%, #2d3a6a 100%)',
  Budget:         'linear-gradient(170deg, #2d4a3a 0%, #4a7a5a 40%, #6a9a7a 70%, #4a6a5a 100%)',
}
const DEFAULT_GRAD = CATEGORY_GRAD.Boutique

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  hotels:        HotelListing[]
  neighborhoods: CityNeighborhoods[]
  locale:        'es' | 'en'
}

export default function HotelsClient({ hotels, neighborhoods, locale }: Props) {
  const isES = locale === 'es'

  const [searchVal,         setSearchVal]         = useState('')
  // null = "Todos" pill. Same convention as the prototype's "Todos" sentinel.
  const [priceFilter,       setPriceFilter]       = useState<'$' | '$$' | '$$$' | null>(null)
  const [archetypeFilter,   setArchetypeFilter]   = useState<ArchetypeId>('Todos')
  const [destinationFilter, setDestinationFilter] = useState<string | null>(null)
  const [destinationsOpen,  setDestinationsOpen]  = useState(false)
  const [comingSoonToast,   setComingSoonToast]   = useState<string | null>(null)

  // Destination list is stable for a given hotel set — compute once.
  const destinations = useMemo(() => listDestinations(hotels), [hotels])

  const filtered = useMemo(
    () => hotels.filter(h =>
      matchesPrice(h, priceFilter) &&
      matchesArchetype(h, archetypeFilter) &&
      matchesDestination(h, destinationFilter) &&
      matchesSearch(h, searchVal)
    ),
    [hotels, priceFilter, archetypeFilter, destinationFilter, searchVal],
  )

  // Neighborhoods are contextual — surface only the picked city's barrios.
  // Two paths land here:
  //   1. Explicit destination filter pill — exact match on cityName.
  //   2. Search input narrows the visible hotels to a single destination
  //      (e.g. typing "cdmx" or "mexico" matches CDMX hotels only) — fall
  //      through to inferring the city from the filtered set.
  // If filters span more than one city, the section stays hidden.
  const selectedNeighborhoods = useMemo(() => {
    if (destinationFilter) {
      return neighborhoods.filter(n => n.cityName === destinationFilter)
    }
    const dests = new Set(filtered.map(h => h.destination))
    if (dests.size === 1) {
      const only = dests.values().next().value as string
      return neighborhoods.filter(n => n.cityName === only)
    }
    return []
  }, [neighborhoods, destinationFilter, filtered])

  const handleArchetypeClick = (f: ArchetypeFilter) => {
    if (f.comingSoon) {
      const label = isES ? f.labelES : f.labelEN
      setComingSoonToast(label)
      setTimeout(() => setComingSoonToast(null), 2400)
      return
    }
    setArchetypeFilter(f.id)
  }

  // ── L10N strings (inline — keeps the component standalone) ────────────────
  const L = {
    eyebrow:     isES ? 'Dónde quedarse'                                   : 'Where to stay',
    headline:    isES ? 'Hoteles que\nelegimos bien'                       : 'Hotels we\npick well',
    sub:         isES ? 'Seleccionados por carácter, ubicación y valor real — no por patrocinio.'
                      : 'Picked for character, location, and honest value — not commission.',
    searchPlaceholder: isES ? 'ej. méxico, cancún, nueva york…'            : 'e.g. mexico, cancun, new york…',
    travelerLabel:     isES ? 'Viajero'                                    : 'Traveler',
    pricePillAll:      isES ? 'Todos'                                      : 'All',
    sectionLabel:      isES ? 'Hoteles curados'                            : 'Curated hotels',
    sectionHeadline:   isES ? 'Dónde quedarse bien'                        : 'Where to stay, well',
    countOne:          isES ? 'hotel'                                      : 'hotel',
    countMany:         isES ? 'hoteles'                                    : 'hotels',
    emptyHeadline:     isES ? 'Sin coincidencias'                          : 'No matches',
    emptyBody:         isES ? 'Probá quitar un filtro o cambiar la búsqueda.'
                            : 'Try removing a filter or clearing the search.',
    bookCta:           isES ? 'Ver disponibilidad'                         : 'See availability',
    guideCta:          isES ? 'Ver guía →'                                 : 'See guide →',
    proxBadge:         isES ? 'próx.'                                      : 'soon',
    comingSoonSuffix:  isES ? '— próximamente 🙌'                          : '— coming soon 🙌',
    saveLabel:         isES ? 'Guardar'                                    : 'Save',
  }

  return (
    // No local background — the page wrapper sets var(--sand) on <main>
    // so the bridge CTA and newsletter below the client inherit cleanly.
    <div>
      {/* ─────── HERO ─────── */}
      <section style={{ padding: '64px 0 40px' }}>
        {/* Hero uses the same page-inner container as the curated grid
            below so the left edge of "DÓNDE QUEDARSE" / "Hoteles que…"
            aligns with "HOTELES CURADOS" — no maxWidth override here. */}
        <div className="page-inner">
        <p style={sectionLabelStyle}>{L.eyebrow}</p>

        <h1 style={{
          fontFamily: "'Manrope', sans-serif", fontWeight: 800,
          fontSize: 'clamp(36px, 5.5vw, 56px)',
          color: NK, lineHeight: 1.05, letterSpacing: '-1px',
          marginBottom: 16, whiteSpace: 'pre-line',
          // Headline-only constraint so it doesn't read across the
          // full 1280px container.
          maxWidth: 720,
        }}>{L.headline}</h1>

        <p style={{
          fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 400,
          color: MU, lineHeight: 1.65, marginBottom: 40, maxWidth: 420,
        }}>{L.sub}</p>

        {/* Search + filter card */}
        <div style={{
          background: WHITE, borderRadius: 14, border: `1.5px solid ${BD}`,
          padding: '16px 20px', position: 'relative',
        }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: SAND, borderRadius: 10, padding: '12px 18px',
            marginBottom: 14, border: `1.5px solid ${BD}`,
          }}>
            <span aria-hidden style={{ color: MU, fontSize: 16, flexShrink: 0 }}>🔍</span>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder={L.searchPlaceholder}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: 15, fontWeight: 500, color: NK,
                fontFamily: "'Manrope', sans-serif", outline: 'none',
              }}
            />
            {searchVal && (
              <button
                onClick={() => setSearchVal('')}
                aria-label={isES ? 'Limpiar búsqueda' : 'Clear search'}
                style={{ border: 'none', background: 'transparent', color: MU, fontSize: 18, cursor: 'pointer' }}
              >×</button>
            )}
          </div>

          {/* Row 1 — price filters + destinations expander */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {/* "Todos" sentinel */}
            <button
              onClick={() => setPriceFilter(null)}
              style={pillStyle(priceFilter === null)}
            >{L.pricePillAll}</button>
            {PRICE_FILTERS.map(p => (
              <button
                key={p.id}
                onClick={() => setPriceFilter(p.id)}
                style={pillStyle(priceFilter === p.id)}
              >
                {p.id} · {isES ? p.labelES : p.labelEN}
              </button>
            ))}
            {/* "+ Destinos" expander — toggles the destination chip row.
                When a destination is selected, the pill goes active and
                shows the picked city for visibility. */}
            <button
              onClick={() => setDestinationsOpen(o => !o)}
              style={pillStyle(destinationFilter !== null)}
              aria-expanded={destinationsOpen}
            >
              {destinationFilter
                ? `📍 ${destinationFilter}`
                : (isES ? '+ Destinos' : '+ Destinations')}
            </button>
          </div>

          {/* Row 1a — destinations chip row (expander) */}
          {destinationsOpen && (
            <div style={{
              display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10,
              paddingBottom: 4,
            }}>
              <button
                onClick={() => { setDestinationFilter(null); setDestinationsOpen(false) }}
                style={pillStyle(destinationFilter === null)}
              >{L.pricePillAll}</button>
              {destinations.map(d => (
                <button
                  key={d}
                  onClick={() => { setDestinationFilter(d); setDestinationsOpen(false) }}
                  style={pillStyle(destinationFilter === d)}
                >{d}</button>
              ))}
            </div>
          )}

          {/* Row 2 — archetype filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontFamily: "'Manrope', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: '1px', textTransform: 'uppercase', color: MU,
              marginRight: 4, whiteSpace: 'nowrap',
            }}>{L.travelerLabel}</span>

            {ARCHETYPE_FILTERS.map(f => {
              const isActive = archetypeFilter === f.id && !f.comingSoon
              const label = isES ? f.labelES : f.labelEN
              return (
                <button
                  key={f.id}
                  onClick={() => handleArchetypeClick(f)}
                  title={f.comingSoon ? L.comingSoonSuffix.replace('— ', '') : undefined}
                  style={{
                    fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 600,
                    padding: '6px 16px', borderRadius: 100,
                    display: 'flex', alignItems: 'center', gap: 5,
                    border: isActive ? 'none' : `1.5px solid ${f.comingSoon ? '#E8E4DE' : BD}`,
                    background: isActive ? PINE : f.comingSoon ? '#F5F2EE' : 'transparent',
                    color:      isActive ? WHITE : f.comingSoon ? '#BDB8B2' : NK,
                    cursor: f.comingSoon ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {f.icon && <span style={{ fontSize: 13 }}>{f.icon}</span>}
                  {label}
                  {f.comingSoon && (
                    <span style={{
                      fontFamily: "'Manrope', sans-serif", fontSize: 8, fontWeight: 700,
                      letterSpacing: '0.8px', textTransform: 'uppercase',
                      background: '#E8E4DE', color: '#A8A4A0',
                      padding: '1px 5px', borderRadius: 100, marginLeft: 2,
                    }}>{L.proxBadge}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Coming-soon toast (anchored above the filter card) */}
          {comingSoonToast && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
              transform: 'translateX(-50%)',
              background: NK, color: WHITE, padding: '8px 18px',
              borderRadius: 100, fontFamily: "'Manrope', sans-serif",
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 10,
            }}>
              {comingSoonToast} {L.comingSoonSuffix}
            </div>
          )}
        </div>
        </div>
      </section>

      {/* ─────── CURATED GRID ─────── */}
      <section style={{ padding: '0 0 64px' }}>
        <div className="page-inner">
        <div style={{ marginBottom: 28 }}>
          <p style={sectionLabelStyle}>{L.sectionLabel}</p>
          <h2 style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 30, fontWeight: 800,
            color: NK, marginBottom: 4,
          }}>{L.sectionHeadline}</h2>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 13, color: MU,
          }}>
            {filtered.length} {filtered.length === 1 ? L.countOne : L.countMany}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div style={{
            background: WHITE, borderRadius: 14, border: `1.5px solid ${BD}`,
            padding: '40px 32px', textAlign: 'center',
          }}>
            <h3 style={{
              fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 800,
              color: NK, marginBottom: 6,
            }}>{L.emptyHeadline}</h3>
            <p style={{
              fontFamily: "'Manrope', sans-serif", fontSize: 14, color: MU,
            }}>{L.emptyBody}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {filtered.map(h => (
              <HotelCard key={h.id} hotel={h} locale={locale} saveLabel={L.saveLabel} bookCta={L.bookCta} guideCta={L.guideCta} />
            ))}
          </div>
        )}
        </div>
      </section>

      {/* ─────── NEIGHBORHOODS · contextual to picked destination ───────
          Only renders when the user has chosen a destination AND that
          city has at least one neighborhood with editorial body copy.
          Otherwise stays hidden. Hides itself again the moment the
          destination filter resets to Todos. */}
      {selectedNeighborhoods.length > 0 && (
        <NeighborhoodsSection cities={selectedNeighborhoods} locale={locale} />
      )}
    </div>
  )
}

// ── HotelCard — matches the prototype spec ───────────────────────────────────

interface CardProps {
  hotel:     HotelListing
  locale:    'es' | 'en'
  saveLabel: string
  bookCta:   string
  guideCta:  string
}

function HotelCard({ hotel, saveLabel, bookCta, guideCta }: CardProps) {
  const hasImage = !!hotel.cover_img
  const hasBooking = !!hotel.bookingUrl
  const hasGuide = !!hotel.guideUrl && hotel.guideUrl !== '#'

  return (
    <article
      style={{
        background: WHITE, borderRadius: 14,
        border: `1.5px solid ${BD}`,
        overflow: 'hidden', transition: 'border-color .2s, transform .2s',
        display: 'flex', flexDirection: 'column', height: '100%',
      }}
      className="group hover:-translate-y-[2px] hover:border-[#0F3A33]"
    >
      {/* ── Photo area ───────────────────────────────────────────────── */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {hasImage ? (
          <div style={{ position: 'relative', width: '100%', height: 220 }}>
            <Image
              src={hotel.cover_img}
              alt={hotel.name}
              fill
              style={{ objectFit: 'cover', display: 'block' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div style={{
            height: 220,
            background: DEFAULT_GRAD,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Initial watermark for visual interest on gradient fallback */}
            <div aria-hidden style={{
              position: 'absolute', bottom: -20, right: 8,
              fontFamily: "'Manrope', sans-serif", fontSize: 130, fontWeight: 800,
              color: 'rgba(255,255,255,0.06)', lineHeight: 1, userSelect: 'none',
            }}>{hotel.name.charAt(0)}</div>
          </div>
        )}

        {/* Pinterest-style Save button — top left. Visual stub for now (no real
            Pinterest integration); matches the prototype's affordance so the
            card reads as bookmarkable. */}
        <button
          type="button"
          aria-label={saveLabel}
          style={{
            position: 'absolute', top: 12, left: 12,
            background: '#E60023', color: WHITE, border: 'none',
            padding: '5px 12px 5px 8px', borderRadius: 100, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 700,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
          {saveLabel}
        </button>

        {/* Price pill — top right */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: WHITE, color: NK, padding: '4px 12px',
          borderRadius: 100, fontFamily: "'Manrope', sans-serif",
          fontSize: 13, fontWeight: 700,
        }}>{hotel.priceLevel}</div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{
          fontFamily: "'Manrope', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '1.5px', textTransform: 'uppercase', color: SAGE,
          marginBottom: 7,
        }}>{hotel.destination.toUpperCase()}</p>

        <h3 style={{
          fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 800,
          color: NK, lineHeight: 1.2, marginBottom: 10,
        }}>{hotel.name}</h3>

        {hotel.description && (
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontSize: 14, color: MU,
            lineHeight: 1.6, marginBottom: 16,
          }}>{hotel.description}</p>
        )}

        {hotel.tags.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <span style={{
              fontFamily: "'Manrope', sans-serif", fontSize: 12, fontWeight: 600,
              padding: '5px 14px', borderRadius: 100,
              border: `1.5px solid ${BD}`, color: NK, background: 'transparent',
            }}>{hotel.tags[0]}</span>
          </div>
        )}

        {/* CTAs — primary 60% / guide 38% per prototype. "Ver guía" hides
            if there's no guideUrl to avoid a dead link. */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <a
            href={hasBooking ? hotel.bookingUrl! : '#'}
            {...(hasBooking ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})}
            style={{
              flex: hasGuide ? '0 0 calc(60% - 4px)' : 1,
              display: 'block', background: PINE, color: WHITE,
              padding: '11px 0', borderRadius: 100, textAlign: 'center',
              fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 700,
              textDecoration: 'none',
            }}
          >{bookCta}</a>

          {hasGuide && (
            <a
              href={hotel.guideUrl}
              style={{
                flex: '0 0 calc(38% - 4px)', display: 'block',
                border: `1.5px solid ${BD}`, color: NK,
                padding: '11px 0', borderRadius: 100, textAlign: 'center',
                fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600,
                background: 'transparent', textDecoration: 'none',
              }}
            >{guideCta}</a>
          )}
        </div>
      </div>
    </article>
  )
}

// ── Reusable style fragments ─────────────────────────────────────────────────

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 11, fontWeight: 600,
  letterSpacing: '1.5px', textTransform: 'uppercase',
  color: SAGE, marginBottom: 8,
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600,
    padding: '7px 18px', borderRadius: 100, cursor: 'pointer',
    border: active ? 'none' : `1.5px solid ${BD}`,
    background: active ? PINE : 'transparent',
    color:      active ? WHITE : NK,
    transition: 'all 0.15s',
  }
}
