/**
 * lib/catalog-analytics.ts
 *
 * GA4 events shared by the catalog pages (Experiencias, Hoteles): the plan, and the
 * Hoteles filter and booking events. Ids and registry keys only; no names or free text.
 * Every plan_* event and the plan-panel booking click is a no-op while the saved-plan
 * flag is off (lib/feature-flags.ts).
 *
 *   plan_add / plan_remove  lang, item_type (experience|hotel), item_id, destination_slug, plan_size
 *   plan_handoff            lang, destination_slug, plan_size, mixed, source (panel|concierge)
 *   hotel_filter            lang, filter_group (destino|precio|viajero), filter_value, result_count
 *   partner_link_click      link_name=hotel_booking, section=hotels_index, hotel_id, position,
 *                           provider, destination_slug (destination stays the hostname)
 *                           (plan-panel clicks on experiences use link_name=gyg_experience)
 */

import { gaTrack, trackOutboundLink } from './analytics/ga'
import { trackBookClick } from './experiences/analytics'
import type { PlanEntry } from './plan'
import { isSavedPlanEnabled } from './feature-flags'
import type { HotelFilters, HotelListing } from './hotels-catalog'

export function trackPlanChange(kind: 'add' | 'remove', e: Pick<PlanEntry, 'type' | 'id' | 'destinationSlug'>, planSize: number, lang: string) {
  if (!isSavedPlanEnabled()) return
  gaTrack(`plan_${kind}`, { lang, item_type: e.type, item_id: e.id, destination_slug: e.destinationSlug, plan_size: planSize })
}

export function trackPlanHandoff(destinationSlug: string | null, planSize: number, mixed: boolean, source: 'panel' | 'concierge', lang: string) {
  if (!isSavedPlanEnabled()) return
  gaTrack('plan_handoff', {
    lang, plan_size: planSize, mixed, source,
    ...(destinationSlug ? { destination_slug: destinationSlug } : {}),
  })
}

/**
 * The "Planear mi viaje" CTA on the catalog pages (the planner handoff, destination only).
 * Not a plan_* event: it fires whether or not the saved plan is shown.
 *   planner_cta_click  lang, section (experience_hub|hotels_index), destination_slug (omitted when none)
 */
export type PlannerCtaSection = 'experience_hub' | 'hotels_index'
export function trackPlannerCta(destinationSlug: string | null, section: PlannerCtaSection, lang: string) {
  gaTrack('planner_cta_click', { lang, section, ...(destinationSlug ? { destination_slug: destinationSlug } : {}) })
}

export function trackHotelBook(h: Pick<HotelListing, 'id' | 'bookingUrl' | 'provider' | 'destinationKey'>, position: number, lang: string) {
  if (!h.bookingUrl) return
  trackOutboundLink({
    linkName: 'hotel_booking',
    href: h.bookingUrl,
    partnerSlug: h.provider,
    lang,
    section: 'hotels_index',
    hotelId: h.id,
    position,
    provider: h.provider,
    destinationSlug: h.destinationKey,
  })
}

/** A booking link clicked inside the plan panel, whichever kind of item it is. */
export function trackPlanBook(e: PlanEntry, position: number, lang: string) {
  if (!isSavedPlanEnabled() || !e.bookingUrl) return
  if (e.type === 'hotel') {
    trackHotelBook({ id: e.id, bookingUrl: e.bookingUrl, provider: e.provider as HotelListing['provider'], destinationKey: e.destinationSlug }, position, lang)
  } else {
    trackBookClick({ id: e.id, bookingUrl: e.bookingUrl, destinationSlug: e.destinationSlug }, position, lang)
  }
}

/** One event per filter group that changed. */
export function trackHotelFilter(lang: string, prev: HotelFilters, next: HotelFilters, resultCount: number) {
  const changes: Array<['destino' | 'precio' | 'viajero', string]> = []
  if ((prev.destino ?? '') !== (next.destino ?? '')) changes.push(['destino', next.destino ?? ''])
  if ((prev.price ?? '') !== (next.price ?? '')) changes.push(['precio', next.price ?? ''])
  if ((prev.viajero ?? '') !== (next.viajero ?? '')) changes.push(['viajero', next.viajero ?? ''])
  for (const [group, value] of changes) {
    gaTrack('hotel_filter', { lang, filter_group: group, filter_value: value || '(cleared)', result_count: resultCount })
  }
}
