// lib/booking.ts
// Affiliate link generation and click tracking for itinerary items.
// Used by the booking modal in TripResult.tsx.
//
// Architecture:
//   Hotels   → Stay22 Booking.com redirect widget (clean URL — no extra params)
//   Tours    → Stay22 GYG / Expedia redirect widgets (address + q for pre-fill)
//   Dining   → OpenTable / TheFork / Google Maps (direct search)
//   Transfer → Uber / Google Maps (direct deep-link)

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
}

// ── Stay22 redirect links ─────────────────────────────────────────────────────
// Three variants:
//   stay22Redirect  — bare widget URL, no extra params. Use only as a last-
//                     resort fallback (lands on the provider homepage).
//   stay22Search    — appends address + q for activity search pre-fill (GYG, Expedia).
//   stay22Hotel     — appends address + checkin + checkout + adults so the
//                     downstream OTA opens with destination + dates pre-filled.
//                     Significantly improves conversion vs landing on homepage.

function stay22Redirect(widgetUrl: string): string {
  return widgetUrl
}

function stay22Search(widgetUrl: string, city: string, itemName?: string): string {
  const params = new URLSearchParams()
  params.set('address', city)
  if (itemName) params.set('q', itemName)
  return `${widgetUrl}?${params.toString()}`
}

function stay22Hotel(
  widgetUrl: string,
  ctx: { city: string; startDate?: string; endDate?: string; adults?: number },
): string {
  const params = new URLSearchParams()
  if (ctx.city) params.set('address', ctx.city)
  // Stay22 widgets ignore unknown / empty params, so it's safe to omit dates
  // when they aren't set. The URL still routes to the partner homepage.
  if (ctx.startDate) params.set('checkin', ctx.startDate)
  if (ctx.endDate)   params.set('checkout', ctx.endDate)
  params.set('adults', String(ctx.adults ?? 2))
  const qs = params.toString()
  return qs ? `${widgetUrl}?${qs}` : widgetUrl
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
      const hotelCtx = {
        city,
        startDate: ctx.startDate,
        endDate:   ctx.endDate,
        adults:    ctx.adults,
      }
      return [
        {
          id:       'booking',
          provider: 'booking',
          name:     'Booking.com',
          desc:     'Cancelación gratis en la mayoría de las propiedades.',
          url:      stay22Hotel('https://booking.stay22.com/lagomplan/tupscQswKK', hotelCtx),
        },
        {
          id:       'hotelscom',
          provider: 'hotels',
          name:     'Hotels.com',
          desc:     'Mayor selección de hoteles. Precio garantizado.',
          url:      stay22Hotel('https://hotelscom.stay22.com/lagomplan/ulAbEA6Vbn', hotelCtx),
        },
      ]
    }

    case 'tour':
      return [
        {
          id:       'gyg',
          provider: 'gyg',
          name:     'GetYourGuide',
          desc:     'Experiencias verificadas. Cancelación gratis hasta 24 hrs.',
          url:      stay22Search('https://getyourguide.stay22.com/lagomplan/vP_T4j_a5L', city, item.name),
        },
        {
          id:       'expedia',
          provider: 'expedia',
          name:     'Expedia Actividades',
          desc:     'Tours y actividades con soporte 24/7.',
          url:      stay22Search('https://expedia.stay22.com/lagomplan/B03L4axuky', city, item.name),
        },
      ]

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
