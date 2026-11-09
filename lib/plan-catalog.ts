/**
 * lib/plan-catalog.ts
 *
 * Every item that can be in the traveler's plan, for one locale: the hub's bookable
 * experiences and every hotel. Built on the server and handed to both pages, so the
 * plan bar and panel show the whole plan wherever the traveler is.
 */

import { getExperiences } from './experiences'
import { getAllHotels } from './hotels'
import type { PlanEntry } from './plan'

export function getPlanCatalog(locale: string): PlanEntry[] {
  const loc = locale === 'en' ? 'en' : 'es'
  return [
    ...getExperiences(loc).map((e): PlanEntry => ({
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
