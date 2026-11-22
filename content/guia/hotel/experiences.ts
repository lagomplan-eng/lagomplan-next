// content/guia/hotel/experiences.ts
//
// City-level experiences for the hotel edition. Up to 4 entries that book through GetYourGuide.
//
// Every tour URL below already exists in this repo (source noted on each entry); none was invented. Stored
// as the plain tour URL, like everywhere else in the repo, and given the partner ID at render time by the
// same helper the Experiencias hub and the destination guides use (lib/affiliate/gyg.ts, the one place the
// ID lives). Only `cmp` is new: it tags the clicks as coming from this edition.
//
// Only 3 Mexico City tours exist in the repo, so the guide shows those 3 with a booking button and keeps
// the 4th card without one (HOTEL_EXPERIENCES_TARGET). /admin/hoteles shows a warning until there are 4.

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
    exp({
      id: 'valquirico-puebla',
      title: { es: "Val'Quirico, Puebla y pueblos: tour gastronómico y cultural", en: "Val'Quirico, Puebla and towns: food and culture tour" },
      teaser: {
        es: 'Día completo desde la Ciudad de México: centro histórico de Puebla, cemitas, pulque artesanal y mezcal local.',
        en: 'A full day from Mexico City: Puebla’s historic center, cemitas, artisanal pulque and local mezcal.',
      },
      image: '/images/guides/chile-en-nogada.png',
      tourUrl: 'https://www.getyourguide.com/mexico-city-l194/val-quirico-puebla-mexico-walking-tour-food-and-towns-t855901/',
      source: 'lib/data/guides/chile-en-nogada/{es,en}.ts, experience "valquirico-puebla-y-ciudades-tour-gastronomico-y-cultural"',
    }),
    exp({
      id: 'ofrenda-xochimilco',
      title: { es: 'Casa-ofrenda y taller artesanal de Día de Muertos', en: 'Ofrenda house and Day of the Dead craft workshop' },
      teaser: {
        es: 'Visita guiada de 45 minutos a una casa con ofrenda y taller de artesanos, a 10 minutos de Xochimilco. Incluye pan de muerto.',
        en: 'A 45-minute guided visit to a house with an ofrenda and artisans’ workshop, 10 minutes from Xochimilco. Includes pan de muerto.',
      },
      image: '/images/guides/dia-de-muertos-cdmx-patzcuaro.png',
      tourUrl: 'https://www.getyourguide.com/mexico-city-l194/mexico-city-day-of-the-dead-house-and-craft-workshop-t819667/',
      source: 'lib/data/guides/dia-de-muertos-cdmx-patzcuaro/{es,en}.ts, experience "casa-ofrenda-y-taller-artesanal-de-dia-de-muertos-cdmx"',
    }),
  ],
}

/** True while fewer than four experiences have a booking link. Drives the admin warning. */
export function experiencesArePlaceholders(): boolean {
  return HOTEL_EXPERIENCES.items.length < HOTEL_EXPERIENCES_TARGET
}
