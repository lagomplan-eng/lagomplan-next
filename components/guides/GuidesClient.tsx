'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'

// ── Types ─────────────────────────────────────────────────────────────────────

export type GuideListing = {
  slug: string
  title: string
  excerpt: string
  destination: string
  tags: string[]
  cover_img: string
  url: string
}

type FilterDef = {
  id: string
  labelEN: string
  labelES: string
  tagsEN: string[]
  tagsES: string[]
}

// ── Filter config ─────────────────────────────────────────────────────────────
// Each filter maps to one or more raw guide tag strings per locale.
// Add new filters here — no changes needed elsewhere.

const PRIMARY_FILTERS: FilterDef[] = [
  { id: 'beach',   labelEN: 'Beach',   labelES: 'Playa',         tagsEN: ['Beach'],                         tagsES: ['Playa'] },
  { id: 'city',    labelEN: 'City',    labelES: 'Ciudad',        tagsEN: ['City', 'Urban'],                 tagsES: ['Ciudad', 'Urbano'] },
  { id: 'nature',  labelEN: 'Nature',  labelES: 'Naturaleza',    tagsEN: ['Nature'],                        tagsES: ['Naturaleza'] },
  { id: 'weekend', labelEN: 'Weekend', labelES: 'Fin de semana', tagsEN: ['Weekend', 'Long weekend'],       tagsES: ['Fin de semana', 'Largo fin de semana'] },
  { id: 'family',  labelEN: 'Family',  labelES: 'Familia',       tagsEN: ['Family'],                        tagsES: ['Familia'] },
]

const SECONDARY_FILTERS: FilterDef[] = [
  { id: 'food',      labelEN: 'Food',      labelES: 'Gastronomía', tagsEN: ['Food', 'Gastronomy'],            tagsES: ['Gastronomía'] },
  { id: 'culture',   labelEN: 'Culture',   labelES: 'Cultura',     tagsEN: ['Culture'],                       tagsES: ['Cultura'] },
  { id: 'adventure', labelEN: 'Adventure', labelES: 'Aventura',    tagsEN: ['Adventure'],                     tagsES: ['Aventura'] },
  { id: 'wellness',  labelEN: 'Wellness',  labelES: 'Bienestar',   tagsEN: ['Wellness', 'Spa'],               tagsES: ['Bienestar', 'Spa'] },
  { id: 'luxury',    labelEN: 'Luxury',    labelES: 'Lujo',        tagsEN: ['Luxury'],                        tagsES: ['Lujo'] },
  { id: 'roadtrip',  labelEN: 'Road trip', labelES: 'Roadtrip',    tagsEN: ['Road trip'],                     tagsES: ['Roadtrip'] },
  { id: 'romantic',  labelEN: 'Romantic',  labelES: 'Romance',     tagsEN: ['Romance', 'Couples'],            tagsES: ['Parejas', 'Romance'] },
]

// ── Feature flags ─────────────────────────────────────────────────────────────

const SHOW_COLLECTIONS = false

// ── FeaturedGuideCard ─────────────────────────────────────────────────────────

function FeaturedGuideCard({ guide, isES }: { guide: GuideListing; isES: boolean }) {
  return (
    <a href={guide.url} className="block no-underline" style={{ color: 'var(--pine)' }}>
      <article style={{
        overflow: 'hidden',
        border: '1px solid var(--border)',
        borderRadius: '30px',
        background: 'var(--cream)',
        boxShadow: '0 1px 0 rgba(15,58,51,0.03)',
      }}>
        {/* Image */}
        <div style={{
          position: 'relative',
          height: '250px',
          background: 'linear-gradient(160deg, #7ab0be 0%, #2f6c87 35%, #4ca29b 65%, #d7d4be 100%)',
          overflow: 'hidden',
        }}>
          <Image
            src={guide.cover_img}
            alt={guide.title}
            fill
            className="object-cover"
            sizes="(max-width: 1180px) 100vw, 500px"
          />
          {/* bottom gradient */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to top, rgba(15,58,51,0.45), rgba(15,58,51,0.03) 55%)',
          }} />
          {/* Badge */}
          <div style={{
            position: 'absolute', top: '20px', right: '20px', zIndex: 2,
            padding: '8px 12px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)',
            color: 'white', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>
            {isES ? 'Guía destacada' : 'Featured guide'}
          </div>
          {/* Overlay text */}
          <div style={{ position: 'absolute', left: '24px', right: '24px', bottom: '24px', zIndex: 2, color: 'white' }}>
            <div style={{
              fontSize: '10px', textTransform: 'uppercase',
              letterSpacing: '0.16em', color: 'rgba(255,255,255,0.74)', fontWeight: 700,
            }}>
              {guide.destination}
            </div>
            <div style={{
              marginTop: '8px', fontSize: '38px', lineHeight: 0.98,
              fontFamily: 'var(--font-display), Georgia, serif',
              fontStyle: 'italic', fontWeight: 600, maxWidth: '10ch',
            }}>
              {guide.title}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, maxWidth: '34ch', fontSize: '13px', lineHeight: 1.7, color: 'rgba(15,58,51,0.68)' }}>
            {guide.excerpt}
          </p>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            width: 'fit-content', borderRadius: '999px',
            background: 'var(--pine)', color: 'white',
            padding: '14px 20px', fontSize: '14px', fontWeight: 700,
          }}>
            {isES ? 'Ver guía destacada' : 'Read featured guide'} →
          </span>
        </div>
      </article>
    </a>
  )
}

// ── GuideCard ─────────────────────────────────────────────────────────────────

function GuideCard({ guide }: { guide: GuideListing }) {
  return (
    <a href={guide.url} className="block no-underline group" style={{ color: 'var(--pine)', height: '100%' }}>
      <article style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        overflow: 'hidden', border: '1px solid var(--border)',
        borderRadius: '28px', background: 'var(--cream)',
        boxShadow: '0 1px 0 rgba(15,58,51,0.03)',
        transition: 'transform .2s ease, box-shadow .2s ease',
      }}
        className="hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,58,51,0.06)]"
      >
        {/* Image */}
        <div style={{
          position: 'relative', width: '100%', height: '220px', flexShrink: 0,
          background: 'linear-gradient(180deg, #acd0e8 0%, #bfd1bc 58%, #4c6659 100%)',
          overflow: 'hidden',
        }}>
          <Image
            src={guide.cover_img}
            alt={guide.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: '22px 24px 24px' }}>
          <div style={{
            fontSize: '10px', textTransform: 'uppercase',
            letterSpacing: '0.16em', color: 'var(--sage)', fontWeight: 700,
          }}>
            {guide.destination}
          </div>
          <h3 style={{
            margin: '10px 0 0', fontSize: '22px', lineHeight: 1.15,
            letterSpacing: '-0.02em', fontWeight: 800,
          }}>
            {guide.title}
          </h3>
          <p style={{
            margin: '12px 0 0', minHeight: '50px',
            fontSize: '14px', lineHeight: 1.75, color: 'rgba(15,58,51,0.68)',
          }}>
            {guide.excerpt}
          </p>
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto', paddingTop: '20px' }}>
            {guide.tags.map(tag => (
              <span key={tag} style={{
                padding: '6px 10px', border: '1px solid var(--border)',
                borderRadius: '999px', background: 'var(--sand)',
                color: 'rgba(15,58,51,0.72)', fontSize: '11px', fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </a>
  )
}

// ── CollectionsSection (hidden behind flag) ────────────────────────────────────

function CollectionsSection({ isES }: { isES: boolean }) {
  const collections = isES
    ? [
        { title: 'Escapadas de fin de semana', desc: 'Destinos donde el valor está en salir rápido, descansar mejor y volver con energía.' },
        { title: 'Playas tranquilas', desc: 'Guías para viajar al mar con mejor ritmo, menos ruido y recomendaciones más útiles.' },
        { title: 'Viajes con niños', desc: 'Lugares donde la logística importa tanto como el encanto visual del destino.' },
        { title: 'Food trips', desc: 'Ciudades y escapadas donde comer bien es parte central del viaje, no un bonus.' },
      ]
    : [
        { title: 'Weekend getaways', desc: 'Destinations where the value is in getting out fast, resting better, and returning energized.' },
        { title: 'Quiet beaches', desc: 'Guides for going to the sea with a better pace, less noise, and more useful recommendations.' },
        { title: 'Trips with kids', desc: 'Places where logistics matter as much as the visual appeal of the destination.' },
        { title: 'Food trips', desc: 'Cities and getaways where eating well is central to the trip, not a bonus.' },
      ]

  return (
    <section style={{ padding: '52px 0 0' }}>
      <div className="page-inner">
        <div style={{ marginBottom: '32px' }}>
          <p className="sec-label">{isES ? 'Explora por estado de ánimo' : 'Explore by mood'}</p>
          <h2 style={{ margin: 0, fontSize: '36px', lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 800 }}>
            {isES ? 'Colecciones para explorar mejor' : 'Collections that make browsing easier'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map(col => (
            <article key={col.title} style={{
              display: 'flex', flexDirection: 'column', height: '100%',
              padding: '28px', border: '1px solid var(--border)',
              borderRadius: '28px', background: 'var(--cream)',
              boxShadow: '0 1px 0 rgba(15,58,51,0.03)',
            }}>
              <p className="sec-label" style={{ margin: 0 }}>
                {isES ? 'Colección' : 'Collection'}
              </p>
              <h3 style={{ margin: '12px 0 0', fontSize: '24px', lineHeight: 1.12, letterSpacing: '-0.02em', fontWeight: 800 }}>
                {col.title}
              </h3>
              <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: 1.9, color: 'rgba(15,58,51,0.68)' }}>
                {col.desc}
              </p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                marginTop: 'auto', paddingTop: '24px',
                color: 'var(--fjord)', fontSize: '14px', fontWeight: 700,
              }}>
                {isES ? 'Explorar' : 'Explore'} →
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── BridgeCTA ─────────────────────────────────────────────────────────────────

function BridgeCTA({ isES }: { isES: boolean }) {
  const plannerHref = isES ? '/es/planner' : '/en/planner'

  const stats = [
    {
      icon: '✦',
      title: isES ? '3 hoteles' : '3 hotels',
      body: isES ? 'Más cerca de tu estilo de viaje' : 'Closer to your travel style',
    },
    {
      icon: '✦',
      title: isES ? '2 experiencias' : '2 experiences',
      body: isES ? 'Buena combinación para el destino' : 'Good fit for this destination',
    },
    {
      icon: '✦',
      title: isES ? '1 smart find' : '1 smart find',
      body: isES ? 'Útil para este tipo de viaje' : 'Useful for this type of trip',
    },
  ]

  return (
    <section style={{ padding: '56px 0 72px' }}>
      <div className="page-inner">
        <div style={{
          padding: '32px', border: '1px solid var(--border)',
          borderRadius: '32px', background: 'var(--cream)',
          boxShadow: '0 1px 0 rgba(15,58,51,0.03)',
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
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

            {/* Right: stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(stat => (
                <div key={stat.title} style={{
                  display: 'flex', flexDirection: 'column', height: '100%',
                  padding: '20px', border: '1px solid var(--border)',
                  borderRadius: '22px', background: 'var(--sand)',
                }}>
                  <div style={{
                    width: '40px', height: '40px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    borderRadius: '16px', background: 'var(--cream)',
                    color: 'var(--pine)', fontWeight: 700,
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{ marginTop: '14px', fontSize: '16px', fontWeight: 800, letterSpacing: '-0.01em' }}>
                    {stat.title}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.7, color: 'rgba(15,58,51,0.65)' }}>
                    {stat.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = {
  guides: GuideListing[]
  featured: GuideListing
  locale: string
}

export default function GuidesClient({ guides, featured, locale }: Props) {
  const isES = locale === 'es'

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [showSecondary, setShowSecondary] = useState(false)

  // Resolve the active FilterDef (if any)
  const activeFilterDef = useMemo(() => {
    if (!activeFilter) return null
    return (
      PRIMARY_FILTERS.find(f => f.id === activeFilter) ??
      SECONDARY_FILTERS.find(f => f.id === activeFilter) ??
      null
    )
  }, [activeFilter])

  // Filter guides by search + active curated filter
  const filtered = useMemo(() => {
    return guides.filter(g => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.destination.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      const matchesFilter = !activeFilterDef || g.tags.some(t =>
        isES
          ? activeFilterDef.tagsES.includes(t)
          : activeFilterDef.tagsEN.includes(t)
      )
      return matchesSearch && matchesFilter
    })
  }, [guides, search, activeFilterDef, isES])

  return (
    <div style={{ background: 'var(--sand)', minHeight: '100vh' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--border)', paddingTop: '68px', paddingBottom: '76px' }}>
        <div className="page-inner">

          {/* Two-column hero grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px] gap-14 items-center">
            {/* Left: copy */}
            <div>
              <p className="sec-label">{isES ? 'Guías de viaje' : 'Travel guides'}</p>
              <h1 style={{
                margin: 0, lineHeight: 0.92,
                letterSpacing: '-0.04em', fontWeight: 800,
                fontSize: 'clamp(44px, 7vw, 72px)',
              }}>
                {isES
                  ? <>Destinos que<br /><em style={{ fontFamily: 'var(--font-display), Georgia, serif', fontStyle: 'italic', fontWeight: 600 }}>conocemos bien.</em></>
                  : <>Destinations we<br /><em style={{ fontFamily: 'var(--font-display), Georgia, serif', fontStyle: 'italic', fontWeight: 600 }}>know well.</em></>}
              </h1>
              <p style={{ margin: '28px 0 0', maxWidth: '36ch', fontSize: '18px', lineHeight: 1.75, color: 'rgba(15,58,51,0.72)' }}>
                {isES
                  ? 'Guías editoriales con criterio real — sin listas genéricas ni ads disfrazados de contenido.'
                  : 'Editorial guides with real taste — no generic lists, no filler, and no ads disguised as recommendations.'}
              </p>
            </div>

            {/* Right: featured card */}
            <div className="mt-10 lg:mt-0">
              <FeaturedGuideCard guide={featured} isES={isES} />
            </div>
          </div>

          {/* Filters bar */}
          <div style={{
            marginTop: '48px', padding: '20px',
            border: '1px solid var(--border)', borderRadius: '26px',
            background: 'var(--cream)', boxShadow: '0 1px 0 rgba(15,58,51,0.03)',
          }}>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
              {/* Search */}
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
                  placeholder={isES ? 'Buscar destino, región o estilo' : 'Search destination, region, or style'}
                  style={{
                    flex: 1, border: 0, outline: 0, background: 'transparent',
                    color: 'var(--pine)', fontFamily: 'inherit', fontSize: '14px',
                  }}
                />
              </label>

              {/* Filter chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Primary filters (always visible) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {/* All */}
                  <button
                    onClick={() => setActiveFilter(null)}
                    style={{
                      padding: '10px 16px', borderRadius: '999px', border: '1px solid',
                      borderColor: activeFilter === null ? 'var(--pine)' : 'var(--border)',
                      background: activeFilter === null ? 'var(--pine)' : 'var(--sand)',
                      color: activeFilter === null ? 'white' : 'rgba(15,58,51,0.8)',
                      fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
                    }}
                  >
                    {isES ? 'Todos' : 'All'}
                  </button>

                  {PRIMARY_FILTERS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
                      style={{
                        padding: '10px 16px', borderRadius: '999px', border: '1px solid',
                        borderColor: activeFilter === f.id ? 'var(--pine)' : 'var(--border)',
                        background: activeFilter === f.id ? 'var(--pine)' : 'var(--sand)',
                        color: activeFilter === f.id ? 'white' : 'rgba(15,58,51,0.8)',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        whiteSpace: 'nowrap', transition: 'all .15s',
                      }}
                    >
                      {isES ? f.labelES : f.labelEN}
                    </button>
                  ))}

                  {/* More toggle */}
                  <button
                    onClick={() => setShowSecondary(v => !v)}
                    style={{
                      padding: '10px 16px', borderRadius: '999px', border: '1px solid',
                      borderColor: showSecondary ? 'var(--pine)' : 'var(--border)',
                      background: showSecondary ? 'rgba(15,58,51,0.07)' : 'var(--sand)',
                      color: 'rgba(15,58,51,0.8)',
                      fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                      whiteSpace: 'nowrap', transition: 'all .15s',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    {showSecondary
                      ? (isES ? '− Menos' : '− Less')
                      : (isES ? '+ Más' : '+ More')}
                  </button>
                </div>

                {/* Secondary filters (revealed on demand) */}
                {showSecondary && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SECONDARY_FILTERS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
                        style={{
                          padding: '10px 16px', borderRadius: '999px', border: '1px solid',
                          borderColor: activeFilter === f.id ? 'var(--pine)' : 'var(--border)',
                          background: activeFilter === f.id ? 'var(--pine)' : 'var(--sand)',
                          color: activeFilter === f.id ? 'white' : 'rgba(15,58,51,0.8)',
                          fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                          whiteSpace: 'nowrap', transition: 'all .15s',
                        }}
                      >
                        {isES ? f.labelES : f.labelEN}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Guides grid ───────────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0 0' }}>
        <div className="page-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <div>
              <p className="sec-label">{isES ? 'Guías' : 'Guides'}</p>
              <h2 style={{ margin: 0, fontSize: '36px', lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 800 }}>
                {isES ? 'Destinos curados' : 'Curated destinations'}
              </h2>
            </div>
            <span style={{ fontSize: '14px', color: 'rgba(15,58,51,0.58)' }}>
              {filtered.length} {isES ? (filtered.length === 1 ? 'destino' : 'destinos') : (filtered.length === 1 ? 'destination' : 'destinations')}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filtered.map(guide => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          ) : (
            <div style={{
              padding: '64px 0', textAlign: 'center',
              color: 'rgba(15,58,51,0.48)', fontSize: '15px',
            }}>
              {isES ? 'No hay guías que coincidan con tu búsqueda.' : 'No guides match your search.'}
            </div>
          )}
        </div>
      </section>

      {/* ── Collections (feature-flagged) ─────────────────────────────────── */}
      {SHOW_COLLECTIONS && <CollectionsSection isES={isES} />}

      {/* ── Bridge CTA ────────────────────────────────────────────────────── */}
      <BridgeCTA isES={isES} />

    </div>
  )
}
