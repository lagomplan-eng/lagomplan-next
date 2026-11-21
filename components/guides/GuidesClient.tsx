'use client'

import { useState, useMemo } from 'react'
import {
  Button, Chip, CardTitle, DestinationCard, Eyebrow, FilterPanel, InfoCard, PageTitle, SearchInput, SectionTitle,
} from '../design'
import type { FilterGroup } from '../design'

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
    <section className="pt-section">
      <div className="page-inner">
        <SectionTitle className="mb-8" eyebrow={isES ? 'Explora por estado de ánimo' : 'Explore by mood'}>
          {isES ? 'Colecciones para explorar mejor' : 'Collections that make browsing easier'}
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map(col => (
            <InfoCard key={col.title} eyebrow={isES ? 'Colección' : 'Collection'} title={col.title} className="h-full">
              {col.desc}
              <span className="mt-6 block font-bold text-fjord">{isES ? 'Explorar' : 'Explore'} →</span>
            </InfoCard>
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
      title: isES ? '3 hoteles' : '3 hotels',
      body: isES ? 'Más cerca de tu estilo de viaje' : 'Closer to your travel style',
    },
    {
      title: isES ? '2 experiencias' : '2 experiences',
      body: isES ? 'Buena combinación para el destino' : 'Good fit for this destination',
    },
    {
      title: isES ? '1 smart find' : '1 smart find',
      body: isES ? 'Útil para este tipo de viaje' : 'Useful for this type of trip',
    },
  ]

  return (
    <section className="pb-section pt-14">
      <div className="page-inner">
        <InfoCard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div>
              <Eyebrow>Lagom pick</Eyebrow>
              <CardTitle>{isES ? 'Convierte una guía en un plan real' : 'Turn a guide into a real plan'}</CardTitle>
              <p className="m-0 mt-3 text-body text-ink-2">
                {isES
                  ? 'Cuando un destino ya suena bien, LagomPlan te ayuda a convertirlo en hospedaje, experiencias y un itinerario limpio.'
                  : 'Once a destination feels right, LagomPlan helps you move naturally into stays, experiences, and a cleaner itinerary.'}
              </p>
              <Button href={plannerHref} className="mt-6" iconAfter="→">
                {isES ? 'Planear con IA' : 'Plan with AI'}
              </Button>
            </div>

            {/* Right: stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map(stat => (
                <InfoCard key={stat.title} tone="sand" size="sm" title={stat.title} headingLevel={4} className="h-full">
                  {stat.body}
                </InfoCard>
              ))}
            </div>
          </div>
        </InfoCard>
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

  const labelOf = (f: FilterDef) => (isES ? f.labelES : f.labelEN)
  const toggle = (id: string) => setActiveFilter(activeFilter === id ? null : id)
  const chip = (f: FilterDef) => (
    <Chip key={f.id} label={labelOf(f)} selected={activeFilter === f.id} onClick={() => toggle(f.id)} />
  )

  // One filter at a time (as before): "Todos" clears it. Primary and secondary filters are two labelled rows.
  const groups: FilterGroup[] = [
    {
      id: 'type',
      label: isES ? 'Tipo de viaje' : 'Trip type',
      activeCount: PRIMARY_FILTERS.some(f => f.id === activeFilter) ? 1 : 0,
      chips: [
        <Chip key="all" label={isES ? 'Todos' : 'All'} selected={activeFilter === null} onClick={() => setActiveFilter(null)} />,
        ...PRIMARY_FILTERS.map(chip),
      ],
    },
    {
      id: 'interest',
      label: isES ? 'Intereses' : 'Interests',
      activeCount: SECONDARY_FILTERS.some(f => f.id === activeFilter) ? 1 : 0,
      chips: SECONDARY_FILTERS.map(chip),
    },
  ]
  const activeFilters = activeFilterDef
    ? [{
        key: activeFilterDef.id,
        label: labelOf(activeFilterDef),
        removeLabel: `${isES ? 'Quitar' : 'Remove'} ${labelOf(activeFilterDef)}`,
        onRemove: () => setActiveFilter(null),
      }]
    : []

  const noun = (n: number) => (isES ? (n === 1 ? 'destino' : 'destinos') : (n === 1 ? 'destination' : 'destinations'))

  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-line-strong pb-20 pt-16">
        <div className="page-inner">

          {/* Two-column hero grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px] gap-14 items-center">
            {/* Left: copy */}
            <PageTitle
              eyebrow={isES ? 'Guías de viaje' : 'Travel guides'}
              title={isES
                ? <>Destinos que<br />conocemos bien</>
                : <>Destinations we<br />know well</>}
              lede={isES
                ? 'Guías editoriales con criterio real — sin listas genéricas ni ads disfrazados de contenido.'
                : 'Editorial guides with real taste — no generic lists, no filler, and no ads disguised as recommendations.'}
            />

            {/* Right: featured card */}
            <div className="mt-10 lg:mt-0">
              <DestinationCard
                featured
                headingLevel={2}
                href={featured.url}
                image={{ src: featured.cover_img, alt: featured.title }}
                badge={isES ? 'Guía destacada' : 'Featured guide'}
                eyebrow={featured.destination}
                title={featured.title}
                excerpt={featured.excerpt}
                cta={isES ? 'Ver guía destacada' : 'Read featured guide'}
              />
            </div>
          </div>

          {/* Search + filters: inline chips on desktop, "Filtros (n)" sheet on mobile */}
          <div className="mt-12 flex flex-col gap-4">
            <SearchInput
              label={isES ? 'Buscar destino, región o estilo' : 'Search destination, region, or style'}
              placeholder={isES ? 'Buscar destino, región o estilo' : 'Search destination, region, or style'}
              value={search}
              onChange={setSearch}
              clearLabel={isES ? 'Borrar búsqueda' : 'Clear search'}
            />
            <FilterPanel
              groups={groups}
              activeFilters={activeFilters}
              resultsCount={filtered.length}
              onClear={() => setActiveFilter(null)}
              labels={{
                filters: isES ? 'Filtros' : 'Filters',
                showResults: n => (isES ? `Ver ${n ?? ''} ${noun(n ?? 0)}` : `Show ${n ?? ''} ${noun(n ?? 0)}`).replace('  ', ' '),
                clear: isES ? 'Limpiar' : 'Clear',
                close: isES ? 'Cerrar' : 'Close',
              }}
            />
          </div>

        </div>
      </section>

      {/* ── Guides grid ───────────────────────────────────────────────────── */}
      <section className="pt-section">
        <div className="page-inner">
          <div className="mb-8 flex flex-col gap-3">
            <SectionTitle eyebrow={isES ? 'Guías' : 'Guides'}>
              {isES ? 'Destinos curados' : 'Curated destinations'}
            </SectionTitle>
            <span className="text-small text-label">
              {filtered.length} {noun(filtered.length)}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filtered.map(guide => (
                <DestinationCard
                  key={guide.slug}
                  href={guide.url}
                  image={{ src: guide.cover_img, alt: guide.title }}
                  eyebrow={guide.destination}
                  title={guide.title}
                  excerpt={guide.excerpt}
                  tags={guide.tags}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-body text-label">
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
