// content/guia/hotel/experiences.ts
//
// Experiences in the hotel edition: four cards with the guide's own illustrations and titles. Each button opens
// GetYourGuide's SEARCH RESULTS for that theme in Mexico City, with the partner ID and cmp=hotel-guide added by
// lib/affiliate/gyg.ts (the one place the ID lives). No specific tour, no tour ID, no Insider text, name or link.
//
// These are placeholders until Elena picks real tours: /admin/hoteles says so while any item here is a search.
// To swap one for a tour, replace its `query` with a `tourUrl` that already exists in the repo.

import type { Lang } from '../types'
import { buildGygBookingUrl } from '../../../lib/affiliate/gyg'

export const HOTEL_EXPERIENCES_TARGET = 4
const CMP = 'hotel-guide'

export interface HotelExperience {
  /** Same id as the experience card in content/guia/cities/cdmx.ts: the title comes from there, in both languages. */
  id: 'exp-teotihuacan' | 'exp-lucha' | 'exp-frida' | 'exp-tacos'
  /** One line that promises nothing specific to one tour. */
  teaser: Record<Lang, string>
  /** The existing illustration. */
  image: string
  /** GetYourGuide search text, in Mexico City. */
  query: string
  /** Search results with partner_id and cmp. */
  bookUrl: string
}

export function gygSearchUrl(query: string): string {
  return buildGygBookingUrl(`https://www.getyourguide.com/s/?q=${encodeURIComponent(query)}`, { cmp: CMP })
}

function exp(e: Omit<HotelExperience, 'bookUrl'>): HotelExperience {
  return { ...e, bookUrl: gygSearchUrl(e.query) }
}

export const HOTEL_EXPERIENCES: { status: 'placeholder'; items: HotelExperience[] } = {
  status: 'placeholder',
  items: [
    exp({
      id: 'exp-teotihuacan',
      teaser: {
        en: 'One of Mexico’s great archaeological sites, near Mexico City.',
        es: 'Uno de los grandes sitios arqueológicos de México, cerca de la Ciudad de México.',
      },
      image: '/images/guia/experiences/exp-teotihuacan.jpg',
      query: 'Teotihuacan Mexico City',
    }),
    exp({
      id: 'exp-lucha',
      teaser: {
        en: 'An evening of masks, acrobatics and electric atmosphere.',
        es: 'Una noche de máscaras, acrobacias y mucha energía.',
      },
      image: '/images/guia/experiences/exp-lucha.jpg',
      query: 'Lucha libre Mexico City',
    }),
    exp({
      id: 'exp-frida',
      teaser: {
        en: 'Coyoacán’s bohemian streets and the world of Frida Kahlo.',
        es: 'Las calles bohemias de Coyoacán y el mundo de Frida Kahlo.',
      },
      image: '/images/guia/experiences/exp-frida.jpg',
      query: 'Frida Kahlo Coyoacan Mexico City',
    }),
    exp({
      id: 'exp-tacos',
      teaser: {
        en: 'Neighborhood taquerías and the city’s street food culture.',
        es: 'Taquerías de barrio y la cultura de la comida callejera de la ciudad.',
      },
      image: '/images/guia/experiences/exp-tacos.jpg',
      query: 'Tacos food tour Mexico City',
    }),
  ],
}

export const HOTEL_EXPERIENCE_IDS = HOTEL_EXPERIENCES.items.map((e) => e.id)

export const HOTEL_BOOK_LABEL: Record<Lang, string> = { en: 'Book on GetYourGuide', es: 'Reservar en GetYourGuide' }

/** True while any card is a search, not a chosen tour. Drives the admin warning. */
export function experiencesArePlaceholders(): boolean {
  return HOTEL_EXPERIENCES.status === 'placeholder'
}
