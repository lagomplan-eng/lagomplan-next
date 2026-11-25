'use client'

/**
 * components/experiences/ExperiencesHub.tsx
 *
 * /experiencias · /experiences. Filtering is client-side over the experiences the
 * server passed in; the URL is the single source of truth for filter state
 * (?region= ?destino= ?para= ?tipo= ?duracion=) and is updated with
 * history.replaceState, so a filter change never triggers a server round trip.
 *
 * Order is editorial and never changes: filtering only removes cards.
 *
 * The plan ("+ Mi plan" on each card, sticky bar, panel) is kept in localStorage and is
 * hidden unless NEXT_PUBLIC_FEATURE_SAVED_PLAN=true (lib/feature-flags.ts). Its only
 * handoff is ?destination=<name>.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Link, getPathname } from '../../lib/navigation'
import type { Destination, Experience, GuideRegion } from '../../lib/experiences/types'
import {
  CATEGORIES, EMPTY_FILTERS, PERSONAS, REGIONS, destinationOptions, facetCounts, filterExperiences, groupVisible,
  parseFilters, sanitizeFilters, searchHub, serializeFilters, type FilterState,
} from '../../lib/experiences/filters'
import { Button, CardTitle, Chip, DestinationCard, FilterPanel, InfoCard, PageTitle, type ActiveFilter, type FilterGroup } from '../design'
import { PlanButton, ResultsBar } from '../catalog'
import PlanTray from '../catalog/PlanTray'
import { usePlan } from '../catalog/usePlan'
import { isSavedPlanEnabled } from '../../lib/feature-flags'
import { planDestination, resolvePlan, type PlanEntry, type PlanRef } from '../../lib/plan'
import { trackBookClick, trackFilterChange, trackGuideClick, trackListView } from '../../lib/experiences/analytics'
import { trackPlanBook, trackPlanChange, trackPlanHandoff, trackPlannerCta } from '../../lib/catalog-analytics'

interface Props {
  experiences: Experience[]
  /** Every guide we have, bookable or not (search never comes back empty for one). */
  destinations: Destination[]
  /** Region names in both locales, for the search. */
  regionNames: Record<GuideRegion, { es: string; en: string }>
  /** Everything that can be in the plan (experiences and hotels), so the tray shows all of it. */
  planCatalog: PlanEntry[]
}

export default function ExperiencesHub({ experiences, destinations, regionNames, planCatalog }: Props) {
  const t = useTranslations('experiences')
  const tc = useTranslations('catalog')
  const lang = useLocale()
  const searchParams = useSearchParams()

  // URL → state. Sanitized so a stale/hand-edited link can't select a destination that doesn't exist.
  const filters = useMemo(
    () => sanitizeFilters(parseFilters(searchParams), experiences),
    [searchParams, experiences],
  )
  const visible = useMemo(() => filterExperiences(experiences, filters), [experiences, filters])

  // The visible list grouped by destination. Destinations follow guide order (the `destinations` list), items keep
  // their guide order inside a destination; `pos` stays the 1-based index in the overall visible list (it is what
  // the analytics report), whatever the grouping.
  const groups = useMemo(() => {
    const rank = new Map(destinations.map((d, i) => [d.slug, i]))
    const by = new Map<string, { slug: string; items: { e: Experience; pos: number }[] }>()
    visible.forEach((e, i) => {
      const g = by.get(e.destinationSlug) ?? { slug: e.destinationSlug, items: [] }
      g.items.push({ e, pos: i + 1 })
      by.set(e.destinationSlug, g)
    })
    return [...by.values()].sort((a, b) => (rank.get(a.slug) ?? 1e6) - (rank.get(b.slug) ?? 1e6))
  }, [visible, destinations])

  // ── plan ───────────────────────────────────────────────────────────────────
  const planEnabled = isSavedPlanEnabled()
  const plan = usePlan(planEnabled)
  const planItems = useMemo(() => resolvePlan(plan.items, planCatalog), [plan.items, planCatalog])
  const inPlan = useMemo(() => new Set(plan.items.filter(i => i.type === 'experience').map(i => i.id)), [plan.items])

  // The concierge block hands the planner a destination only: the plan's, else the one
  // destination being browsed. With neither it opens the planner empty.
  const conciergeDestination = useMemo(() => {
    const fromPlan = planDestination(planItems)
    if (fromPlan) return { slug: fromPlan.slug, name: fromPlan.name }
    if (filters.destinos.length === 1) {
      const e = experiences.find(x => x.destinationSlug === filters.destinos[0])
      if (e) return { slug: e.destinationSlug, name: e.destinationName }
    }
    return null
  }, [planItems, filters.destinos, experiences])

  const trackPlan = useCallback((ref: PlanRef, was: boolean, next: PlanRef[]) => {
    const entry = planCatalog.find(x => x.type === ref.type && x.id === ref.id)
    const now = next.some(i => i.type === ref.type && i.id === ref.id)
    if (entry && was !== now) trackPlanChange(now ? 'add' : 'remove', entry, next.length, lang)
  }, [planCatalog, lang])

  const togglePlan = useCallback((id: string) => {
    const ref: PlanRef = { type: 'experience', id }
    const was = plan.items.some(i => i.type === ref.type && i.id === id)
    trackPlan(ref, was, plan.toggle(ref))
  }, [plan, trackPlan])

  const removeFromPlan = useCallback((ref: PlanRef) => {
    plan.remove(ref)
    trackPlan(ref, true, plan.items.filter(i => !(i.type === ref.type && i.id === ref.id)))
  }, [plan, trackPlan])

  const setFilters = useCallback((next: FilterState) => {
    const clean = sanitizeFilters(next, experiences)
    const qs = serializeFilters(clean)
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname)
    trackFilterChange(lang, filters, clean, filterExperiences(experiences, clean).length)
  }, [experiences, filters, lang])

  // One list view per page load, not per filter change.
  const listViewSent = useRef(false)
  useEffect(() => {
    if (listViewSent.current) return
    listViewSent.current = true
    trackListView(lang, experiences.length)
  }, [lang, experiences.length])

  // ── filter panel ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const options = useMemo(() => destinationOptions(experiences), [experiences])
  const nameOf = (slug: string) => options.find(o => o.slug === slug)?.name ?? slug

  const guideHref = (slug: string, hash?: string) =>
    getPathname({ href: { pathname: '/guides/[slug]', params: { slug } }, locale: lang }) + (hash ? `#${hash}` : '')

  const regionsWithExperiences = useMemo(() => new Set(experiences.map(e => e.region)), [experiences])
  const suggestions = useMemo(() => {
    const dest = new Map(destinations.map(d => [d.slug, d]))
    return searchHub(search, destinations, regionNames, regionsWithExperiences, filters.destinos).map(hit => {
      if (hit.kind === 'region') {
        return { key: `region:${hit.region}`, label: t(`filters.regions.${hit.region}`), hint: t('filters.regionTag') }
      }
      const d = dest.get(hit.slug)!
      if (hit.kind === 'guide-only') {
        return {
          key: `guide:${d.slug}`, label: d.name, hint: t('filters.noExperiences'),
          link: { label: t('filters.guideLink'), href: guideHref(d.guideSlug) },
        }
      }
      return { key: `dest:${d.slug}`, label: d.name, hint: t(`filters.regions.${d.region}`) }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, destinations, regionNames, regionsWithExperiences, filters.destinos, t, lang])

  // Picking a destination replaces the selection; a region that doesn't contain it is dropped.
  const pickDestination = useCallback((slug: string) => {
    const o = options.find(x => x.slug === slug)
    if (!o) return
    setFilters({ ...filters, destinos: [slug], region: filters.region === o.region ? filters.region : null })
  }, [options, filters, setFilters])

  const set = (patch: Partial<FilterState>) => setFilters({ ...filters, ...patch })
  const toggleTipo = (c: (typeof CATEGORIES)[number]) =>
    set({ tipos: filters.tipos.includes(c) ? filters.tipos.filter(x => x !== c) : [...filters.tipos, c] })

  const filterGroups: FilterGroup[] = []
  const activeFilters: ActiveFilter[] = []
  const remove = (name: string) => tc('sheet.remove', { name })
  if (new Set(experiences.map(e => e.region)).size >= 2) {
    const counts = facetCounts(experiences, filters, 'region')
    filterGroups.push({
      id: 'region',
      label: t('filters.region'),
      activeCount: filters.region ? 1 : 0,
      chips: (
        <>
          <Chip label={t('filters.regionAll')} selected={filters.region === null} onClick={() => set({ region: null })} />
          {REGIONS.filter(r => (counts[r] ?? 0) > 0 || filters.region === r).map(r => (
            <Chip key={r} label={t(`filters.regions.${r}`)} selected={filters.region === r} onClick={() => set({ region: filters.region === r ? null : r })} />
          ))}
        </>
      ),
    })
    if (filters.region) {
      const r = filters.region
      activeFilters.push({ key: `region:${r}`, label: t(`filters.regions.${r}`), removeLabel: remove(t(`filters.regions.${r}`)), onRemove: () => set({ region: null }) })
    }
  }
  if (groupVisible(experiences, 'personas')) {
    const counts = facetCounts(experiences, filters, 'para')
    filterGroups.push({
      id: 'para',
      label: t('filters.para'),
      activeCount: filters.para ? 1 : 0,
      chips: (
        <>
          <Chip label={t('filters.paraAll')} selected={filters.para === null} onClick={() => set({ para: null })} />
          {PERSONAS.filter(p => (counts[p] ?? 0) > 0 || filters.para === p).map(p => (
            <Chip key={p} label={t(`filters.para_${p}`)} selected={filters.para === p} onClick={() => set({ para: filters.para === p ? null : p })} />
          ))}
        </>
      ),
    })
    if (filters.para) {
      const p = filters.para
      activeFilters.push({ key: `para:${p}`, label: t(`filters.para_${p}`), removeLabel: remove(t(`filters.para_${p}`)), onRemove: () => set({ para: null }) })
    }
  }
  if (groupVisible(experiences, 'category')) {
    const counts = facetCounts(experiences, filters, 'tipo')
    filterGroups.push({
      id: 'tipo',
      label: t('filters.tipo'),
      activeCount: filters.tipos.length,
      chips: (
        <>
          {CATEGORIES.filter(c => (counts[c] ?? 0) > 0 || filters.tipos.includes(c)).map(c => (
            <Chip key={c} label={t(`filters.categories.${c}`)} selected={filters.tipos.includes(c)} onClick={() => toggleTipo(c)} />
          ))}
        </>
      ),
    })
    for (const c of filters.tipos) {
      activeFilters.push({ key: `tipo:${c}`, label: t(`filters.categories.${c}`), removeLabel: remove(t(`filters.categories.${c}`)), onRemove: () => toggleTipo(c) })
    }
  }

  // ── one destination chosen → banner, and cards drop the thumbnail + eyebrow ─
  const single = filters.destinos.length === 1
    ? experiences.find(e => e.destinationSlug === filters.destinos[0]) ?? null
    : null
  const countLabel = single
    ? t('results.countIn', { count: visible.length, name: single.destinationName })
    : t('results.count', { count: visible.length })

  return (
    <main className="min-h-screen bg-cream pt-[100px] text-pine">
      <div className="mx-auto max-w-[1280px] px-[18px] pb-28 pt-8 md:px-6">
        <PageTitle eyebrow={t('eyebrow')} title={t('title')} lede={t('subtitle')} />

        <div className="mt-8 flex flex-col gap-6 md:mt-10">
          <section aria-label={t('filters.title')}>
            <FilterPanel
              search={{
                label: t('filters.destinoLabel'),
                placeholder: t('filters.destinoSearch'),
                value: search,
                onChange: setSearch,
                tokens: filters.destinos.map(slug => ({ key: slug, label: nameOf(slug), removeLabel: t('filters.destinoRemove', { name: nameOf(slug) }) })),
                onRemoveToken: slug => set({ destinos: filters.destinos.filter(d => d !== slug) }),
                suggestions,
                onPick: key => {
                  if (key.startsWith('region:')) set({ region: key.slice(7) as GuideRegion })
                  else if (key.startsWith('dest:')) pickDestination(key.slice(5))
                },
                noResultsText: t('filters.destinoNone'),
              }}
              groups={filterGroups}
              activeFilters={activeFilters}
              resultsCount={visible.length}
              onClear={() => set({ region: null, para: null, tipos: [] })}
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
                <Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>{t('empty.clear')}</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {groups.map(g => {
                  const first = g.items[0].e
                  return (
                    <section key={g.slug} aria-label={first.destinationName} className="flex flex-col gap-4">
                      <DestinationCard
                        data-destination={g.slug}
                        headingLevel={2}
                        row
                        {...(first.destinationImage ? { image: { src: first.destinationImage, alt: '' } } : {})}
                        eyebrow={tc('banner.eyebrow')}
                        title={first.destinationName}
                        excerpt={t('results.countIn', { count: g.items.length, name: first.destinationName })}
                        actions={
                          <>
                            <Button size="sm" className="!whitespace-normal !px-3 !py-1.5 text-left" href={guideHref(first.guideSlug)}>{tc('banner.guide')}</Button>
                            {!single && <Button size="sm" variant="ghost" className="!whitespace-normal !px-3 !py-1.5 text-left" onClick={() => pickDestination(g.slug)}>{t('card.filterByDestination', { name: first.destinationName })}</Button>}
                          </>
                        }
                      />
                      <div className="grid grid-cols-1 gap-4 md:[grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
                        {g.items.map(({ e, pos }) => (
                          <DestinationCard
                            key={e.id}
                            data-experience={e.id}
                            title={e.name}
                            headingLevel={3}
                            excerpt={e.description || undefined}
                            excerptLines={3}
                            tags={[
                              ...e.personas.map(p => t(`card.personas.${p}`)),
                              ...(e.category ? [t(`filters.categories.${e.category}`)] : []),
                            ]}
                            aside={planEnabled ? <PlanButton pressed={inPlan.has(e.id)} onClick={() => togglePlan(e.id)} name={e.name} /> : undefined}
                            actions={
                              <>
                                <Button href={e.bookingUrl} target="_blank" rel="sponsored noopener" onClick={() => trackBookClick(e, pos, lang)}>{t('card.book')}</Button>
                                <Button variant="secondary" href={guideHref(e.guideSlug, e.guideAnchor)} onClick={() => trackGuideClick(e, pos, lang)}>{t('card.seeGuide')}</Button>
                                <p className="m-0 basis-full font-sans text-tiny text-label">{t('card.provider')}</p>
                              </>
                            }
                          />
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}

            {/* Concierge block */}
            <InfoCard tone="cream" className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex min-w-[260px] flex-1 flex-col gap-2">
                  <CardTitle as="h2">{t('concierge.title')}</CardTitle>
                  <p className="m-0 font-sans text-body text-ink-body">{t('concierge.body')}</p>
                </div>
                <Button
                  as={Link}
                  href={(conciergeDestination ? { pathname: '/planner', query: { destination: conciergeDestination.name } } : '/planner') as unknown as string}
                  onClick={() => trackPlannerCta(conciergeDestination?.slug ?? null, 'experience_hub', lang)}
                >
                  {t('concierge.cta')}
                </Button>
              </div>
            </InfoCard>

            <p className="m-0 mt-2 font-sans text-tiny text-label">{t('finePrint')}</p>
          </section>
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
    </main>
  )
}
