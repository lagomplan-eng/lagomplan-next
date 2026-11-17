// content/guia/hotel/experiences.ts
//
// City-level experiences for the hotel edition: 4 entries that book through
// GetYourGuide affiliate links. Elena supplies the four. Until then
// status === 'placeholder' and the guide shows the existing four experience
// cards with NO booking button and NO Insider/WhatsApp link; /admin/hoteles
// shows a warning while the status is 'placeholder'.
//
// To go live: set status to 'ready' and fill `items` (exactly 4).

import type { Lang } from '../types'

export interface HotelExperience {
  id: string
  title: Record<Lang, string>
  teaser: Record<Lang, string>
  /** Public path under /public. */
  image: string
  /** GetYourGuide affiliate URL. */
  bookUrl: string
}

export const HOTEL_EXPERIENCES: { status: 'placeholder' | 'ready'; items: HotelExperience[] } = {
  status: 'placeholder',
  items: [],
}

export function experiencesArePlaceholders(): boolean {
  return HOTEL_EXPERIENCES.status !== 'ready' || HOTEL_EXPERIENCES.items.length === 0
}
