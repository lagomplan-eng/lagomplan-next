// lib/booking.ts
// Affiliate link generation and click tracking for itinerary items.
// Used by the booking modal in TripResult.tsx.
//
// Architecture:
//   Hotels   → Stay22 Allez deep link (canonical — destination/dates honored)
//   Tours    → Stay22 Allez deep link (canonical — destination honored)
//   Dining   → OpenTable / TheFork / Google Maps (direct search)
//   Transfer → Uber / Google Maps (direct deep-link)
//
// Hotel + tour links go through `buildAffiliateLink` in lib/affiliate/.
// Restaurants and transfers continue to use direct search URLs because
// no Stay22 partner serves them.

import { buildAffiliateLink } from './affiliate'

export type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer'

export interface BookingOption {
  id: string
  provider: string
  name: string
  desc: string
  url: string
}

export interface BookingContext {
  city: string       // trip destination
  country: string    // 'US' | 'europe' | 'other'
  startDate: string  // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
  adults?: number    // guest count (defaults to 2 if absent)
  locale?: 'es' | 'en'  // drives campaign label for Stay22 attribution
}

// ── Country detection ─────────────────────────────────────────────────────────

const US_KEYWORDS = [
  'new york', 'los angeles', 'chicago', 'houston', 'miami',
  'las vegas', 'san francisco', 'seattle', 'boston', 'denver',
  'usa', 'united states',
]
const EU_KEYWORDS = [
  'paris', 'london', 'barcelona', 'madrid', 'rome', 'amsterdam',
  'berlin', 'lisbon', 'milan', 'vienna', 'prague', 'brussels',
]

export function detectCountryGroup(destination: string): 'US' | 'europe' | 'other' {
  const lower = destination.toLowerCase()
  if (US_KEYWORDS.some(k => lower.includes(k))) return 'US'
  if (EU_KEYWORDS.some(k => lower.includes(k))) return 'europe'
  return 'other'
}

// ── Main helper ───────────────────────────────────────────────────────────────

export function getBookingOptions(
  item: { type: ItemType; name: string },
  ctx: BookingContext,
): BookingOption[] {
  const { city, country } = ctx
  const encoded = encodeURIComponent(item.name)

  switch (item.type) {

    case 'hotel': {
      const linkCtx = {
        city,
        startDate: ctx.startDate,
        endDate:   ctx.endDate,
        adults:    ctx.adults,
        locale:    ctx.locale,
        surface:   'planner' as const,
      }
      return [
        {
          id:       'booking',
          provider: 'booking',
          name:     'Booking.com',
          desc:     'Cancelación gratis en la mayoría de las propiedades.',
          url:      buildAffiliateLink('booking', linkCtx),
        },
        {
          id:       'hotelscom',
          provider: 'hotels',
          name:     'Hotels.com',
          desc:     'Mayor selección de hoteles. Precio garantizado.',
          url:      buildAffiliateLink('hotelscom', linkCtx),
        },
      ]
    }

    case 'tour': {
      const linkCtx = {
        city,
        locale:  ctx.locale,
        surface: 'planner' as const,
      }
      return [
        {
          id:       'gyg',
          provider: 'gyg',
          name:     'GetYourGuide',
          desc:     'Experiencias verificadas. Cancelación gratis hasta 24 hrs.',
          url:      buildAffiliateLink('getyourguide', linkCtx),
        },
        {
          id:       'expedia',
          provider: 'expedia',
          name:     'Expedia Actividades',
          desc:     'Tours y actividades con soporte 24/7.',
          url:      buildAffiliateLink('expedia', linkCtx),
        },
      ]
    }

    case 'restaurant':
      if (country === 'US') {
        return [
          {
            id:       'opentable',
            provider: 'opentable',
            name:     'OpenTable',
            desc:     'Reserva de mesa online. Confirmación inmediata.',
            url:      `https://www.opentable.com/s/?term=${encoded}`,
          },
          {
            id:       'resy',
            provider: 'resy',
            name:     'Resy',
            desc:     'Restaurantes exclusivos. Reserva en segundos.',
            url:      `https://resy.com/cities/${encodeURIComponent(city.toLowerCase())}`,
          },
        ]
      }
      if (country === 'europe') {
        return [
          {
            id:       'thefork',
            provider: 'thefork',
            name:     'TheFork',
            desc:     'El líder en reservas de restaurantes en Europa.',
            url:      `https://www.thefork.com/search?text=${encoded}`,
          },
          {
            id:       'googlemaps',
            provider: 'googlemaps',
            name:     'Google Maps',
            desc:     'Busca el restaurante y reserva directo.',
            url:      `https://www.google.com/maps/search/?api=1&query=${encoded}+${encodeURIComponent(city)}`,
          },
        ]
      }
      // Default (Mexico + rest of world)
      return [
        {
          id:       'opentable',
          provider: 'opentable',
          name:     'OpenTable',
          desc:     'Reserva de mesa online. Confirmación inmediata.',
          url:      `https://www.opentable.com/s/?term=${encoded}`,
        },
        {
          id:       'thefork',
          provider: 'thefork',
          name:     'TheFork',
          desc:     'Reserva tu mesa en segundos.',
          url:      `https://www.thefork.com/search?text=${encoded}`,
        },
        {
          id:       'googlemaps',
          provider: 'googlemaps',
          name:     'Google Maps',
          desc:     'Busca el restaurante y reserva directo.',
          url:      `https://www.google.com/maps/search/?api=1&query=${encoded}+${encodeURIComponent(city)}`,
        },
      ]

    case 'transfer': {
      const loc = encodeURIComponent(item.name)
      return [
        {
          id:       'uber',
          provider: 'uber',
          name:     'Uber',
          desc:     'Solicita un viaje al instante.',
          url:      `https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${loc}`,
        },
        {
          id:       'googlemaps-dir',
          provider: 'googlemaps',
          name:     'Google Maps',
          desc:     'Ver ruta y opciones de transporte.',
          url:      `https://www.google.com/maps/dir/?api=1&destination=${loc}`,
        },
      ]
    }

    case 'free':
      return []
  }
}

// ── Click tracking ────────────────────────────────────────────────────────────

export function trackAffiliateClick(category: string, provider: string, city: string) {
  try {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', 'affiliate_click', {
        event_category: category,
        event_label: provider,
        city,
      })
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('[affiliate_click]', { category, provider, city })
    }
  } catch {
    // never throw from tracking
  }
}
