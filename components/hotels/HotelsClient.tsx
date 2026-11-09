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
import {
  CatalogCard, Chip, DestinationBanner, FilterPanel, PageHeader, PlanButton, ResultsBar, type FilterRow,
} from '../catalog'
import PlanTray from '../catalog/PlanTray'
import { usePlan } from '../catalog/usePlan'
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

  const setFilters = useCallback((next: HotelFilters) => {
    const qs = serializeHotelFilters(next)
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname)
    trackHotelFilter(lang, filters, next, filterHotels(hotels, next).length)
  }, [hotels, filters, lang])
  const set = (patch: Partial<HotelFilters>) => setFilters({ ...filters, ...patch })

  // ── plan ───────────────────────────────────────────────────────────────────
  const plan = usePlan()
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
  const rows: FilterRow[] = [{
    id: 'price',
    label: t('filters.price'),
    chips: (
      <>
        <Chip label={t('filters.priceAll')} selected={filters.price === null} onClick={() => set({ price: null })} />
        {PRICE_FILTER_IDS.map(p => (
          <Chip key={p} label={t(`filters.prices.${p}`)} selected={filters.price === p} onClick={() => set({ price: filters.price === p ? null : p })} />
        ))}
      </>
    ),
  }]
  const travelers = travelerOptions(hotels, filters)
  if (travelers.length > 0) {
    rows.push({
      id: 'traveler',
      label: t('filters.traveler'),
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
        <PageHeader eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

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
              rows={rows}
            />
          </section>

          <section aria-label={t('results.count', { count: visible.length })} className="flex flex-col gap-5">
            <ResultsBar count={countLabel} orderLabel={t('results.order')} trustText={t('trust')} />

            {single && single.cover_img && (
              <DestinationBanner
                name={single.destination}
                illustration={single.cover_img}
                {...(single.guideUrl !== '#' ? { guideHref: single.guideUrl } : {})}
              />
            )}

            {visible.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line-btn px-6 py-12 text-center">
                <p className="m-0 text-[17px] font-bold">{t('empty.title')}</p>
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_HOTEL_FILTERS)}
                  className="inline-flex min-h-[48px] items-center rounded-full border border-line-btn bg-transparent px-6 text-[15px] font-semibold text-pine hover:border-pine"
                >
                  {t('empty.clear')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-[14px] md:gap-6 md:[grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
                {visible.map((h, i) => {
                  const tier = t(`filters.tier.${priceBucket(h.priceLevel)}`)
                  const traveler = h.travelers[0] ? t(`filters.travelers.${h.travelers[0]}`) : undefined
                  const hasGuide = !!h.guideUrl && h.guideUrl !== '#'
                  return (
                    <CatalogCard
                      key={h.id}
                      id={`hotel-${h.id}`}
                      data-hotel={h.id}
                      className="scroll-mt-32"
                      {...(single ? { meta: `${h.priceLevel} · ${tier}` } : {
                        ...(h.cover_img ? { thumb: { src: h.cover_img } } : {}),
                        eyebrow: `${h.destination} · ${h.priceLevel}`,
                        onEyebrowClick: () => set({ destino: h.destinationKey }),
                        eyebrowAriaLabel: t('card.filterByDestination', { name: h.destination }),
                      })}
                      title={h.name}
                      titleAs={single ? 'h3' : 'h2'}
                      description={h.description || undefined}
                      tags={[h.tags[0], traveler].filter((x): x is string => !!x).slice(0, 2)}
                      {...(h.bookingUrl ? { primary: { label: t('card.book'), href: h.bookingUrl, external: true, onClick: () => trackHotelBook(h, i + 1, lang) } } : {})}
                      {...(hasGuide ? { secondary: { label: t('card.seeGuide'), href: h.guideUrl } } : {})}
                      {...(h.bookingUrl ? { providerLine: t('card.provider', { provider: tc(`provider.${h.provider}`) }) } : {})}
                      planButton={<PlanButton pressed={inPlan.has(h.id)} onClick={() => togglePlan(h.id)} name={h.name} />}
                    />
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

      <PlanTray
        items={planItems}
        onRemove={removeFromPlan}
        onClear={plan.clear}
        onBook={(x, pos) => trackPlanBook(x, pos, lang)}
        onHandoff={(slug, count, mixed) => trackPlanHandoff(slug, count, mixed, 'panel', lang)}
      />
    </div>
  )
}
