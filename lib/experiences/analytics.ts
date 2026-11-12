/**
 * lib/experiences/analytics.ts
 *
 * GA4 events for the Experiencias hub. One place, so the event names and
 * parameters stay in step with the custom dimensions registered in GA4:
 *
 *   experience_list_view     lang, experiences_total
 *   experience_filter        lang, filter_group, filter_value, results_count
 *   partner_link_click       link_name=gyg_experience, section=experience_hub (card) or
 *                            experience_plan (plan panel), experience_id, position, provider=gyg,
 *                            destination_slug (destination stays the hostname, as for every partner link)
 *   experience_guide_click   lang, experience_id, destination_slug, position
 *

 * The plan events (plan_add / plan_remove / plan_handoff) are shared with Hoteles: see
 * lib/catalog-analytics.ts.
 *
 * No prices, names of experiences or free text are sent: ids and registry keys only.
 */

import { gaTrack, trackOutboundLink } from '../analytics/ga'
import type { Experience } from './types'
import type { FilterState } from './filters'

export type FilterGroup = 'region' | 'destino' | 'para' | 'tipo' | 'duracion'

export function trackListView(lang: string, total: number) {
  gaTrack('experience_list_view', { lang, experiences_total: total })
}

/** One event per filter group that changed. Values are the URL values, joined by commas for multi-select. */
export function trackFilterChange(lang: string, prev: FilterState, next: FilterState, resultsCount: number) {
  const changes: Array<[FilterGroup, string]> = []
  const str = (v: string | null) => v ?? ''
  if (str(prev.region) !== str(next.region)) changes.push(['region', str(next.region)])
  if (prev.destinos.join(',') !== next.destinos.join(',')) changes.push(['destino', next.destinos.join(',')])
  if (str(prev.para) !== str(next.para)) changes.push(['para', str(next.para)])
  if (prev.tipos.join(',') !== next.tipos.join(',')) changes.push(['tipo', next.tipos.join(',')])
  if (str(prev.duracion) !== str(next.duracion)) changes.push(['duracion', str(next.duracion)])
  for (const [group, value] of changes) {
    gaTrack('experience_filter', { lang, filter_group: group, filter_value: value || '(cleared)', results_count: resultsCount })
  }
}

/** Where the click happened: a hub card, or the plan panel. Position is within that list. */
export type ExperienceBookSection = 'experience_hub' | 'experience_plan'

export function trackBookClick(
  e: Pick<Experience, 'id' | 'bookingUrl' | 'destinationSlug'>,
  position: number,
  lang: string,
  section: ExperienceBookSection = 'experience_hub',
) {
  trackOutboundLink({
    linkName: 'gyg_experience',
    href: e.bookingUrl,
    partnerSlug: 'getyourguide',
    lang,
    section,
    experienceId: e.id,
    position,
    provider: 'gyg',
    destinationSlug: e.destinationSlug,
  })
}

export function trackGuideClick(e: Experience, position: number, lang: string) {
  gaTrack('experience_guide_click', { lang, experience_id: e.id, destination_slug: e.destinationSlug, position })
}
