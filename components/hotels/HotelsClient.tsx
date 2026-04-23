'use client'
/**
 * components/hotels/HotelsClient.tsx
 * Client shell for the Hotels index page.
 * Mirrors GuidesClient exactly: same layout, card structure, filter bar, and
 * bridge CTA. Adapted for hotel-specific data (price level, destination).
 */

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { HotelListing } from '../../lib/hotels'

// ── Filter config ──────────────────────────────────────────────────────────────

type PriceFilter = { id: '$' | '$$' | '$$$'; labelES: string; labelEN: string }

const PRICE_FILTERS: PriceFilter[] = [
  { id: '$',   labelES: 'Económico', labelEN: 'Budget'    },
  { id: '$$',  labelES: 'Intermedio', labelEN: 'Mid-range' },
  { id: '$$$', labelES: 'Lujo',      labelEN: 'Luxury'    },
]

// ── HotelCard ──────────────────────────────────────────────────────────────────

function HotelCard({ hotel, isES }: { hotel: HotelListing; isES: boolean }) {
  const bookingHref = hotel.bookingUrl ?? '#'

  return (
    <article
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        overflow: 'hidden', border: '1px solid var(--border)',
        borderRadius: '28px', background: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'transform .2s ease, box-shadow .2s ease',
      }}
      className="group hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,58,51,0.06)]"
    >
      {/* Image — links to guide */}
      <a href={hotel.guideUrl} className="block no-underline" style={{ flexShrink: 0 }}>
        <div style={{
          position: 'relative', width: '100%', height: '220px',
          background: 'linear-gradient(180deg, #acd0e8 0%, #bfd1bc 58%, #4c6659 100%)',
          overflow: 'hidden',
        }}>
          <Image
            src={hotel.cover_img}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Price level badge */}
          <div style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 2,
            padding: '6px 14px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            color: 'var(--pine)', fontSize: '13px', fontWeight: 800,
            letterSpacing: '0.06em',
          }}>
            {hotel.priceLevel}
          </div>
        </div>
      </a>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: '22px 24px 24px' }}>
        {/* Destination label */}
        <div style={{
          fontSize: '10px', textTransform: 'uppercase',
          letterSpacing: '0.16em', color: 'var(--sage)', fontWeight: 700,
        }}>
          {hotel.destination}
        </div>

        {/* Hotel name */}
        <h3 style={{
          margin: '10px 0 0', fontSize: '20px', lineHeight: 1.2,
          letterSpacing: '-0.02em', fontWeight: 800,
        }}>
          {hotel.name}
        </h3>

        {/* Description */}
        <p style={{
          margin: '12px 0 0', minHeight: '50px',
          fontSize: '14px', lineHeight: 1.75, color: 'rgba(15,58,51,0.68)',
        }}>
          {hotel.description}
        </p>

        {/* Tags */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px',
          marginTop: '16px',
        }}>
          {hotel.tags.map(tag => (
            <span key={tag} style={{
              padding: '6px 10px', border: '1px solid var(--border)',
              borderRadius: '999px', background: 'var(--sand)',
              color: 'rgba(15,58,51,0.72)', fontSize: '11px', fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '8px', alignItems: 'center',
          marginTop: 'auto', paddingTop: '20px',
        }}>
          {/* Primary: Ver disponibilidad */}
          <a
            href={bookingHref}
            {...(hotel.bookingUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px 16px', borderRadius: '999px',
              background: 'var(--pine)', color: '#FFFFFF',
              fontSize: '12px', fontWeight: 700, textDecoration: 'none',
              whiteSpace: 'nowrap', transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {isES ? 'Ver disponibilidad' : 'Check availability'}
          </a>

          {/* Secondary: Ver guía */}
          <a
            href={hotel.guideUrl}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px 14px', borderRadius: '999px',
              border: '1px solid var(--border)', background: 'var(--white)',
              color: 'var(--pine)', fontSize: '12px', fontWeight: 700,
              textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(15,58,51,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--white)')}
          >
            {isES ? 'Ver guía →' : 'View guide →'}
          </a>
        </div>
      </div>
    </article>
  )
}

// ── BridgeCTA ──────────────────────────────────────────────────────────────────

function BridgeCTA({ isES }: { isES: boolean }) {
  const plannerHref = isES ? '/es/planificador' : '/en/planner'

  const steps = isES
    ? [
        { n: '01', t: 'Elige un destino',     d: 'Explora guías editoriales con criterio real.' },
        { n: '02', t: 'Selecciona tu hotel',  d: 'Opciones curadas, sin anuncios disfrazados.' },
        { n: '03', t: 'Genera tu itinerario', d: 'LagomPlan arma el plan por ti, con IA.' },
      ]
    : [
        { n: '01', t: 'Choose a destination', d: 'Browse editorial guides with real taste.' },
        { n: '02', t: 'Pick your hotel',      d: 'Curated options, no disguised ads.' },
        { n: '03', t: 'Build your itinerary', d: 'LagomPlan puts it together for you.' },
      ]

  return (
    <section style={{ padding: '56px 0 72px' }}>
      <div className="page-inner">
        <div style={{
          padding: '32px', border: '1px solid var(--border)',
          borderRadius: '32px', background: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: copy */}
            <div>
              <p className="sec-label">Lagom pick</p>
              <h3 style={{ margin: '12px 0 0', fontSize: '30px', lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 800 }}>
                {isES ? 'Convierte una guía en un plan real' : 'Turn a guide into a real plan'}
              </h3>
              <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: 1.9, color: 'rgba(15,58,51,0.68)' }}>
                {isES
                  ? 'Cuando un destino ya suena bien, LagomPlan te ayuda a convertirlo en hospedaje, experiencias y un itinerario limpio.'
                  : 'Once a destination feels right, LagomPlan helps you move naturally into stays, experiences, and a cleaner itinerary.'}
              </p>
              <a
                href={plannerHref}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  marginTop: '24px', borderRadius: '999px', background: 'var(--pine)',
                  color: 'white', padding: '14px 22px', fontSize: '14px', fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {isES ? 'Planear con IA' : 'Plan with AI'} →
              </a>
            </div>

            {/* Right: how it works */}
            <div style={{
              padding: '28px', borderRadius: '22px',
              background: 'var(--sand)', border: '1px solid var(--border)',
            }}>
              <p className="sec-label" style={{ margin: 0 }}>
                {isES ? 'Cómo funciona' : 'How it works'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '22px' }}>
                {steps.map(s => (
                  <div key={s.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                      background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 800, color: 'var(--pine)',
                    }}>
                      {s.n}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{s.t}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(15,58,51,0.65)', marginTop: '2px', lineHeight: 1.6 }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

type Props = {
  hotels: HotelListing[]
  locale: string
}

export default function HotelsClient({ hotels, locale }: Props) {
  const isES = locale === 'es'

  const [search,      setSearch]      = useState('')
  const [activePrice, setActivePrice] = useState<string | null>(null)
  const [activeDest,  setActiveDest]  = useState<string | null>(null)
  const [showDests,   setShowDests]   = useState(false)

  // All unique destinations — sorted for consistent ordering
  const destinations = useMemo(
    () => Array.from(new Set(hotels.map(h => h.destination))).sort(),
    [hotels],
  )

  // Filtered hotel list
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return hotels.filter(h => {
      const matchesSearch = !q ||
        h.name.toLowerCase().includes(q) ||
        h.destination.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      const matchesPrice = !activePrice || h.priceLevel === activePrice
      const matchesDest  = !activeDest  || h.destination === activeDest
      return matchesSearch && matchesPrice && matchesDest
    })
  }, [hotels, search, activePrice, activeDest])

  const isFiltered = activePrice !== null || activeDest !== null

  return (
    <div className="bg-[#F7F4EF] min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--border)', paddingTop: '68px', paddingBottom: '76px' }}>
        <div className="page-inner">

          {/* Headline */}
          <div style={{ maxWidth: '56ch' }}>
            <p className="sec-label">{isES ? 'Dónde quedarse' : 'Where to stay'}</p>
            <h1 style={{
              margin: 0, lineHeight: 0.92,
              letterSpacing: '-0.04em', fontWeight: 800,
              fontSize: 'clamp(44px, 7vw, 72px)',
            }}>
              {isES
                ? <>Hoteles que<br /><span style={{ fontWeight: 800 }}>elegimos bien</span></>
                : <>Hotels we<br /><span style={{ fontWeight: 800 }}>choose well</span></>}
            </h1>
            <p style={{ margin: '28px 0 0', maxWidth: '38ch', fontSize: '18px', lineHeight: 1.75, color: 'rgba(15,58,51,0.72)' }}>
              {isES
                ? 'Seleccionados por carácter, ubicación y valor real — no por patrocinio.'
                : 'Selected for character, location, and honest value — not for sponsorship.'}
            </p>
          </div>

          {/* Filters bar — identical structure to GuidesClient */}
          <div style={{
            marginTop: '48px', padding: '20px',
            border: '1px solid var(--border)', borderRadius: '26px',
            background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">

              {/* Search input */}
              <label style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 20px', border: '1px solid var(--border)',
                borderRadius: '999px', background: '#FFFDF9', cursor: 'text',
              }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--sage)', flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={isES ? 'Buscar hotel, destino o estilo' : 'Search hotel, destination, or style'}
                  style={{
                    flex: 1, border: 0, outline: 0, background: 'transparent',
                    color: 'var(--pine)', fontFamily: 'inherit', fontSize: '14px',
                  }}
                />
              </label>

              {/* Filter chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                {/* Primary: All + price level */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    onClick={() => { setActivePrice(null); setActiveDest(null) }}
                    style={{
                      padding: '10px 16px', borderRadius: '999px', border: '1px solid',
                      borderColor: !isFiltered ? 'var(--pine)' : 'var(--border)',
                      background:  !isFiltered ? 'var(--pine)' : 'var(--sand)',
                      color:       !isFiltered ? 'white' : 'rgba(15,58,51,0.8)',
                      fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
                    }}
                  >
                    {isES ? 'Todos' : 'All'}
                  </button>

                  {PRICE_FILTERS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setActivePrice(activePrice === f.id ? null : f.id)}
                      style={{
                        padding: '10px 16px', borderRadius: '999px', border: '1px solid',
                        borderColor: activePrice === f.id ? 'var(--pine)' : 'var(--border)',
                        background:  activePrice === f.id ? 'var(--pine)' : 'var(--sand)',
                        color:       activePrice === f.id ? 'white' : 'rgba(15,58,51,0.8)',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        whiteSpace: 'nowrap', transition: 'all .15s',
                      }}
                    >
                      {f.id} · {isES ? f.labelES : f.labelEN}
                    </button>
                  ))}

                  {/* Destinations toggle */}
                  <button
                    onClick={() => setShowDests(v => !v)}
                    style={{
                      padding: '10px 16px', borderRadius: '999px', border: '1px solid',
                      borderColor: showDests || activeDest ? 'var(--pine)' : 'var(--border)',
                      background:  showDests || activeDest ? 'rgba(15,58,51,0.07)' : 'var(--sand)',
                      color: 'rgba(15,58,51,0.8)',
                      fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                      whiteSpace: 'nowrap', transition: 'all .15s',
                    }}
                  >
                    {showDests
                      ? (isES ? '− Destinos' : '− Destinations')
                      : (isES ? '+ Destinos' : '+ Destinations')}
                  </button>
                </div>

                {/* Secondary: destination chips */}
                {showDests && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {destinations.map(dest => (
                      <button
                        key={dest}
                        onClick={() => setActiveDest(activeDest === dest ? null : dest)}
                        style={{
                          padding: '10px 16px', borderRadius: '999px', border: '1px solid',
                          borderColor: activeDest === dest ? 'var(--pine)' : 'var(--border)',
                          background:  activeDest === dest ? 'var(--pine)' : 'var(--sand)',
                          color:       activeDest === dest ? 'white' : 'rgba(15,58,51,0.8)',
                          fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                          whiteSpace: 'nowrap', transition: 'all .15s',
                        }}
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Hotels grid ───────────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0 0' }}>
        <div className="page-inner">

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <div>
              <p className="sec-label">{isES ? 'Hoteles curados' : 'Curated hotels'}</p>
              <h2 style={{ margin: 0, fontSize: '36px', lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 800 }}>
                {isES ? 'Dónde quedarse bien' : 'Where to stay right'}
              </h2>
            </div>
            <span style={{ fontSize: '14px', color: 'rgba(15,58,51,0.58)' }}>
              {filtered.length}{' '}
              {isES
                ? filtered.length === 1 ? 'hotel' : 'hoteles'
                : filtered.length === 1 ? 'hotel' : 'hotels'}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filtered.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} isES={isES} />
              ))}
            </div>
          ) : (
            <div style={{
              padding: '64px 0', textAlign: 'center',
              color: 'rgba(15,58,51,0.48)', fontSize: '15px',
            }}>
              {isES
                ? 'No hay hoteles que coincidan con tu búsqueda.'
                : 'No hotels match your search.'}
            </div>
          )}
        </div>
      </section>

      {/* ── Bridge CTA ────────────────────────────────────────────────────── */}
      <BridgeCTA isES={isES} />

    </div>
  )
}
