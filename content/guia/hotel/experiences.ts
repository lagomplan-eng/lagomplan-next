// content/guia/hotel/experiences.ts
//
// City-level experiences for the hotel edition. Up to 4 entries that book through GetYourGuide.
//
// Every tour URL below already exists in this repo (source noted on each entry); none was invented. Stored
// as the plain tour URL, like everywhere else in the repo, and given the partner ID at render time by the
// same helper the Experiencias hub and the destination guides use (lib/affiliate/gyg.ts, the one place the
// ID lives). Only `cmp` is new: it tags the clicks as coming from this edition.
//
// For launch only Casa Luis Barragán is listed. The Val'Quirico (Puebla day trip) and Día de Muertos workshop
// tours were taken out of this edition; they stay untouched in their own guides. The guide shows exactly the
// tours listed here, each with a booking button, and no filler cards. /admin/hoteles shows a warning until
// there are HOTEL_EXPERIENCES_TARGET (4).

import type { Lang } from '../types'
import { buildGygBookingUrl } from '../../../lib/affiliate/gyg'

export const HOTEL_EXPERIENCES_TARGET = 4

export interface HotelExperience {
  id: string
  title: Record<Lang, string>
  teaser: Record<Lang, string>
  /** Public path under /public. */
  image: string
  /** The stored tour URL, as it already appears elsewhere in the repo (no partner ID). */
  tourUrl: string
  /** Where tourUrl comes from in the repo. Not shown to guests. */
  source: string
  /** The link guests are sent to: tourUrl + partner ID + cmp. */
  bookUrl: string
}

const CMP = 'hotel-guide'

function exp(e: Omit<HotelExperience, 'bookUrl'>): HotelExperience {
  return { ...e, bookUrl: buildGygBookingUrl(e.tourUrl, { cmp: CMP }) }
}

export const HOTEL_EXPERIENCES: { items: HotelExperience[] } = {
  items: [
    exp({
      id: 'casa-luis-barragan',
      title: { es: 'Casa Luis Barragán', en: 'Casa Luis Barragán' },
      teaser: {
        es: 'Una lección de luz, color y silencio. Es indispensable reservar con meses de antelación.',
        en: 'A lesson in light, color and silence. Essential to book months in advance.',
      },
      image: '/images/guides/guides-headers/Bellas%20Artes.png',
      tourUrl: 'https://www.getyourguide.com/mexico-city-l194/mexico-city-casa-ortega-by-luis-barragan-architectural-tour-t998831/',
      source: 'lib/data/guides/ciudad-de-mexico/{es,en}.ts, experience "casa-luis-barragan" (the Experiencias hub reads it from there)',
    }),
  ],
}

/** True while fewer than four experiences have a booking link. Drives the admin warning. */
export function experiencesArePlaceholders(): boolean {
  return HOTEL_EXPERIENCES.items.length < HOTEL_EXPERIENCES_TARGET
}
