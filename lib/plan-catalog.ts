/**
 * lib/plan-catalog.ts
 *
 * Every item that can be in the traveler's plan, for one locale: every bookable experience
 * (also those whose guide is outside its hub window) and every hotel. Built on the server and handed to both pages, so the
 * plan bar and panel show the whole plan wherever the traveler is.
 */

import { getExperiences } from './experiences'
import { getAllHotels } from './hotels'
import type { PlanEntry } from './plan'

export function getPlanCatalog(locale: string): PlanEntry[] {
  const loc = locale === 'en' ? 'en' : 'es'
  return [
    // ignoreWindow: a saved plan must keep resolving an item after its guide's hub window closes.
    ...getExperiences(loc, { ignoreWindow: true }).map((e): PlanEntry => ({
      type: 'experience', id: e.id, name: e.name,
      destinationSlug: e.destinationSlug, destinationName: e.destinationName,
      bookingUrl: e.bookingUrl, provider: 'gyg',
    })),
    ...getAllHotels(loc).map((h): PlanEntry => ({
      type: 'hotel', id: h.id, name: h.name,
      destinationSlug: h.destinationKey, destinationName: h.destination,
      ...(h.bookingUrl ? { bookingUrl: h.bookingUrl } : {}), provider: h.provider,
    })),
  ]
}
