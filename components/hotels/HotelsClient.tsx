'use client'

/**
 * components/hotels/HotelsClient.tsx
 *
 * Hoteles page on the shared catalog components (same system as Experiencias).
 * Filtering is client-side over the hotels the server passed in; the URL is the source
 * of truth for filter state (?destino= ?precio= ?viajero=), updated with
 * history.replaceState. Order is editorial (guides, then World Cup stays) and never
 * changes: filtering only removes cards.
 *
 * The search offers destinations, hotels (picking one selects its destination and
 * scrolls to its card) and guides without hotels. The plan is shared with Experiencias.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { getPathname } from '../../lib/navigation'
import {
  EMPTY_HOTEL_FILTERS, PRICE_FILTER_IDS, filterHotels, parseHotelFilters, priceBucket, serializeHotelFilters, travelerOptions,
  type HotelDestination, type HotelFilters, type HotelListing, type TravelerKey,
} from '../../lib/hotels-catalog'
import { searchCatalog } from '../../lib/catalog-search'
import { resolvePlan, type PlanEntry, type PlanRef } from '../../lib/plan'
import { trackHotelBook, trackHotelFilter, trackPlanBook, trackPlanChange, trackPlanHandoff } from '../../lib/catalog-analytics'
import type { CityNeighborhoods } from '../../lib/hotels-neighborhoods'
import { Button, Chip, DestinationCard, FilterPanel, PageTitle, type ActiveFilter, type FilterGroup } from '../design'
import { PlanButton, ResultsBar } from '../catalog'
import PlanTray from '../catalog/PlanTray'
import { usePlan } from '../catalog/usePlan'
import { isSavedPlanEnabled } from '../../lib/feature-flags'
import NeighborhoodsSection from './NeighborhoodsSection'

interface Props {
  hotels: HotelListing[]
  destinations: HotelDestination[]
  neighborhoods: CityNeighborhoods[]
  locale: 'es' | 'en'
  /** Everything that can be in the plan (experiences and hotels), so the tray shows all of it. */
  planCatalog: PlanEntry[]
}

export default function HotelsClient({ hotels, destinations, neighborhoods, locale, planCatalog }: Props) {
  const t = useTranslations('hotels')
  const tc = useTranslations('catalog')
  const lang = useLocale()
  const searchParams = useSearchParams()

  const validDestinations = useMemo(() => new Set(destinations.filter(d => d.hotels > 0).map(d => d.key)), [destinations])
  const filters = useMemo(() => parseHotelFilters(searchParams, validDestinations), [searchParams, validDestinations])
  const visible = useMemo(() => filterHotels(hotels, filters), [hotels, filters])

  // The visible list grouped by destination. Destinations follow the order of the `destinations` list (guides, then
  // World Cup), hotels keep their order inside a destination; `pos` stays the 1-based index in the overall visible
  // list (it is what the analytics report), whatever the grouping.
  const groups = useMemo(() => {
    const rank = new Map(destinations.map((d, i) => [d.key, i]))
    const by = new Map<string, { key: string; items: { h: HotelListing; pos: number }[] }>()
    visible.forEach((h, i) => {
      const g = by.get(h.destinationKey) ?? { key: h.destinationKey, items: [] }
      g.items.push({ h, pos: i + 1 })
      by.set(h.destinationKey, g)
    })
    return [...by.values()].sort((a, b) => (rank.get(a.key) ?? 1e6) - (rank.get(b.key) ?? 1e6))
  }, [visible, destinations])

  const setFilters = useCallback((next: HotelFilters) => {
    const qs = serializeHotelFilters(next)
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname)
    trackHotelFilter(lang, filters, next, filterHotels(hotels, next).length)
  }, [hotels, filters, lang])
  const set = (patch: Partial<HotelFilters>) => setFilters({ ...filters, ...patch })

  // ── plan ───────────────────────────────────────────────────────────────────
  const planEnabled = isSavedPlanEnabled()
  const plan = usePlan(planEnabled)
  const planItems = useMemo(() => resolvePlan(plan.items, planCatalog), [plan.items, planCatalog])
  const inPlan = useMemo(() => new Set(plan.items.filter(i => i.type === 'hotel').map(i => i.id)), [plan.items])

  const trackPlan = useCallback((ref: PlanRef, was: boolean, next: PlanRef[]) => {
    const entry = planCatalog.find(x => x.type === ref.type && x.id === ref.id)
    const now = next.some(i => i.type === ref.type && i.id === ref.id)
    if (entry && was !== now) trackPlanChange(now ? 'add' : 'remove', entry, next.length, lang)
  }, [planCatalog, lang])

  const togglePlan = useCallback((id: string) => {
    const ref: PlanRef = { type: 'hotel', id }
    const was = plan.items.some(i => i.type === 'hotel' && i.id === id)
    trackPlan(ref, was, plan.toggle(ref))
  }, [plan, trackPlan])

  const removeFromPlan = useCallback((ref: PlanRef) => {
    plan.remove(ref)
    trackPlan(ref, true, plan.items.filter(i => !(i.type === ref.type && i.id === ref.id)))
  }, [plan, trackPlan])

  // ── search ─────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [pendingScroll, setPendingScroll] = useState<string | null>(null)
  const nameOf = (key: string) => destinations.find(d => d.key === key)?.name ?? key
  const guideHref = (slug: string) => getPathname({ href: { pathname: '/guides/[slug]', params: { slug } }, locale: lang })

  const suggestions = useMemo(() => {
    const byKey = new Map(destinations.map(d => [d.key, d]))
    const byId = new Map(hotels.map(h => [h.id, h]))
    return searchCatalog(search, {
      destinations: destinations.map(d => ({ slug: d.key, name: d.name, altName: d.altName, count: d.hotels })),
      items: hotels.map(h => ({ id: h.id, name: h.name, altName: h.altName, destinationSlug: h.destinationKey })),
      excludeSlugs: filters.destino ? [filters.destino] : [],
    }).map(hit => {
      if (hit.kind === 'item') {
        const h = byId.get(hit.id)!
        return { key: `hotel:${h.id}`, label: h.name, hint: `${h.destination} · ${t('filters.hotelTag')}` }
      }
      if (hit.kind === 'region') return { key: '', label: '' } // no region filter on this page
      const d = byKey.get(hit.slug)!
      if (hit.kind === 'guide-only') {
        return {
          key: `guide:${d.key}`, label: d.name, hint: t('filters.noHotels'),
          ...(d.guideSlug ? { link: { label: t('filters.guideLink'), href: guideHref(d.guideSlug) } } : {}),
        }
      }
      return { key: `dest:${d.key}`, label: d.name, hint: t('results.count', { count: d.hotels }) }
    }).filter(s => s.key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, destinations, hotels, filters.destino, t, lang])

  const onPick = (key: string) => {
    if (key.startsWith('dest:')) set({ destino: key.slice(5) })
    else if (key.startsWith('hotel:')) {
      const id = key.slice(6)
      const h = hotels.find(x => x.id === id)
      if (!h) return
      setFilters({ ...filters, destino: h.destinationKey })
      setPendingScroll(id)
    }
  }

  // After a hotel pick the grid re-renders; scroll to its card once it exists.
  useEffect(() => {
    if (!pendingScroll) return
    const el = document.getElementById(`hotel-${pendingScroll}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setPendingScroll(null)
    }
  }, [pendingScroll, visible])

  // ── filter rows ────────────────────────────────────────────────────────────
  const filterGroups: FilterGroup[] = [{
    id: 'price',
    label: t('filters.price'),
    activeCount: filters.price ? 1 : 0,
    chips: (
      <>
        <Chip label={t('filters.priceAll')} selected={filters.price === null} onClick={() => set({ price: null })} />
        {PRICE_FILTER_IDS.map(p => (
          <Chip key={p} label={t(`filters.prices.${p}`)} selected={filters.price === p} onClick={() => set({ price: filters.price === p ? null : p })} />
        ))}
      </>
    ),
  }]
  const activeFilters: ActiveFilter[] = []
  const remove = (name: string) => tc('sheet.remove', { name })
  if (filters.price) {
    const p = filters.price
    activeFilters.push({ key: `price:${p}`, label: t(`filters.prices.${p}`), removeLabel: remove(t(`filters.prices.${p}`)), onRemove: () => set({ price: null }) })
  }
  const travelers = travelerOptions(hotels, filters)
  if (travelers.length > 0) {
    filterGroups.push({
      id: 'traveler',
      label: t('filters.traveler'),
      activeCount: filters.viajero ? 1 : 0,
      chips: (
        <>
          <Chip label={t('filters.travelerAll')} selected={filters.viajero === null} onClick={() => set({ viajero: null })} />
          {travelers.map((k: TravelerKey) => (
            <Chip key={k} label={t(`filters.travelers.${k}`)} selected={filters.viajero === k} onClick={() => set({ viajero: filters.viajero === k ? null : k })} />
          ))}
        </>
      ),
    })
  }
  if (filters.viajero) {
    const k = filters.viajero
    activeFilters.push({ key: `viajero:${k}`, label: t(`filters.travelers.${k}`), removeLabel: remove(t(`filters.travelers.${k}`)), onRemove: () => set({ viajero: null }) })
  }

  // ── one destination chosen → banner, and cards drop the thumbnail + eyebrow ─
  const single = filters.destino ? hotels.find(h => h.destinationKey === filters.destino) ?? null : null
  const countLabel = single
    ? t('results.countIn', { count: visible.length, name: single.destination })
    : t('results.count', { count: visible.length })

  // Neighborhoods are contextual: only the chosen destination's barrios.
  const selectedNeighborhoods = useMemo(() => {
    if (!filters.destino) return []
    const labels = new Set(hotels.filter(h => h.destinationKey === filters.destino).map(h => h.cityLabel))
    return neighborhoods.filter(n => labels.has(n.cityName))
  }, [neighborhoods, hotels, filters.destino])


  return (
    <div className="bg-cream text-pine">
      <div className="mx-auto max-w-[1280px] px-[18px] pb-16 pt-8 md:px-6">
        <PageTitle eyebrow={t('eyebrow')} title={t('title')} lede={t('subtitle')} />

        <div className="mt-8 flex flex-col gap-6 md:mt-10">
          <section aria-label={t('filters.title')}>
            <FilterPanel
              search={{
                label: t('filters.searchLabel'),
                placeholder: t('filters.search'),
                value: search,
                onChange: setSearch,
                tokens: filters.destino ? [{ key: filters.destino, label: nameOf(filters.destino), removeLabel: t('filters.destinoRemove', { name: nameOf(filters.destino) }) }] : [],
                onRemoveToken: () => set({ destino: null }),
                suggestions,
                onPick,
                noResultsText: t('filters.searchNone'),
              }}
              groups={filterGroups}
              activeFilters={activeFilters}
              resultsCount={visible.length}
              onClear={() => set({ price: null, viajero: null })}
              labels={{
                filters: tc('sheet.filters'),
                showResults: n => (n === undefined ? tc('sheet.showResultsNone') : tc('sheet.showResults', { count: n })),
                clear: tc('sheet.clear'),
                close: tc('sheet.close'),
              }}
            />
          </section>

          <section aria-label={t('results.count', { count: visible.length })} className="flex flex-col gap-5">
            <ResultsBar count={countLabel} orderLabel={t('results.order')} trustText={t('trust')} />

            {visible.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-info border border-dashed border-line-sage px-6 py-12 text-center">
                <p className="m-0 font-sans text-h4">{t('empty.title')}</p>
                <Button variant="secondary" onClick={() => setFilters(EMPTY_HOTEL_FILTERS)}>{t('empty.clear')}</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {groups.map(g => {
                  const first = g.items[0].h
                  const guide = first.guideUrl && first.guideUrl !== '#' ? first.guideUrl : null
                  return (
                    <section key={g.key} aria-label={first.destination} className="flex flex-col gap-4">
                      <DestinationCard
                        data-destination={g.key}
                        headingLevel={2}
                        row
                        {...(first.cover_img ? { image: { src: first.cover_img, alt: '' } } : {})}
                        eyebrow={tc('banner.eyebrow')}
                        title={first.destination}
                        excerpt={t('results.countIn', { count: g.items.length, name: first.destination })}
                        actions={(guide || !single) ? (
                          <>
                            {guide && <Button size="sm" className="!whitespace-normal !px-3 !py-1.5 text-left" href={guide}>{tc('banner.guide')}</Button>}
                            {!single && <Button size="sm" variant="ghost" className="!whitespace-normal !px-3 !py-1.5 text-left" onClick={() => set({ destino: g.key })}>{t('card.filterByDestination', { name: first.destination })}</Button>}
                          </>
                        ) : undefined}
                      />
                      <div className="grid grid-cols-1 gap-4 md:[grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
                        {g.items.map(({ h, pos }) => {
                          const tier = t(`filters.tier.${priceBucket(h.priceLevel)}`)
                          const traveler = h.travelers[0] ? t(`filters.travelers.${h.travelers[0]}`) : undefined
                          const hasGuide = !!h.guideUrl && h.guideUrl !== '#'
                          return (
                            <DestinationCard
                              key={h.id}
                              id={`hotel-${h.id}`}
                              data-hotel={h.id}
                              className="scroll-mt-32"
                              eyebrow={`${h.priceLevel} · ${tier}`}
                              title={h.name}
                              headingLevel={3}
                              excerpt={h.description || undefined}
                              excerptLines={3}
                              tags={[h.tags[0], traveler].filter((x): x is string => !!x).slice(0, 2)}
                              aside={planEnabled ? <PlanButton pressed={inPlan.has(h.id)} onClick={() => togglePlan(h.id)} name={h.name} /> : undefined}
                              actions={(h.bookingUrl || hasGuide) ? (
                                <>
                                  {h.bookingUrl && <Button href={h.bookingUrl} target="_blank" rel="sponsored noopener" onClick={() => trackHotelBook(h, pos, lang)}>{t('card.book')}</Button>}
                                  {hasGuide && <Button variant="secondary" href={h.guideUrl}>{t('card.seeGuide')}</Button>}
                                  {h.bookingUrl && <p className="m-0 basis-full font-sans text-tiny text-label">{t('card.provider', { provider: tc(`provider.${h.provider}`) })}</p>}
                                </>
                              ) : undefined}
                            />
                          )
                        })}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </section>

          {selectedNeighborhoods.length > 0 && (
            <NeighborhoodsSection cities={selectedNeighborhoods} locale={locale} />
          )}
        </div>
      </div>

      {planEnabled && (
        <PlanTray
          items={planItems}
          onRemove={removeFromPlan}
          onClear={plan.clear}
          onBook={(x, pos) => trackPlanBook(x, pos, lang)}
          onHandoff={(slug, count, mixed) => trackPlanHandoff(slug, count, mixed, 'panel', lang)}
        />
      )}
    </div>
  )
}
