// lib/booking.ts
// Affiliate link generation and click tracking for itinerary items.
// Used by the booking modal in TripResult.tsx.

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
}

// ── Stay22 ───────────────────────────────────────────────────────────────────

function generateStay22Link({ city, keyword, dates }: {
  city: string
  keyword: string
  dates?: { start?: string; end?: string }
}): string {
  const base  = 'https://www.stay22.com/embed/gm'
  const query = `${city} ${keyword}`
  return `${base}?aid=lagomplan&address=${encodeURIComponent(query)}${
    dates?.start ? `&checkin=${dates.start}`   : ''
  }${
    dates?.end   ? `&checkout=${dates.end}` : ''
  }`
}

const STAY22_COMMON_PARAMS = 'aid=lagomplan&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&source=direct'

function generateActivityLink(base: string, city: string): string {
  return `${base}?${STAY22_COMMON_PARAMS}&address=${encodeURIComponent(city)}`
}

// ── Country detection ─────────────────────────────────────────────────────────
// Simple keyword heuristic — good enough for a travel planner context.

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
  const { city, startDate, endDate } = ctx
  const encoded = encodeURIComponent(item.name)

  const dates = { start: startDate, end: endDate }

  switch (item.type) {
    case 'tour':
      return [
        {
          id:       'gyg',
          provider: 'gyg',
          name:     'GetYourGuide',
          desc:     'Experiencias verificadas. Cancelación gratis hasta 24 hrs.',
          url:      generateActivityLink('https://getyourguide.stay22.com/lagomplan/vP_T4j_a5L', city),
        },
        {
          id:       'expedia',
          provider: 'expedia',
          name:     'Expedia',
          desc:     'Tours y actividades con soporte 24/7.',
          url:      generateActivityLink('https://expedia.stay22.com/lagomplan/B03L4axuky', city),
        },
      ]

    case 'hotel':
      return [
        {
          id:       'stay22-h',
          provider: 'hotels',
          name:     'Hotels.com',
          desc:     'Mayor selección de hoteles. Precio garantizado.',
          url:      generateStay22Link({ city, keyword: 'hotels', dates }),
        },
        {
          id:       'stay22-b',
          provider: 'booking',
          name:     'Booking.com',
          desc:     'Cancelación gratis en la mayoría de propiedades.',
          url:      generateStay22Link({ city, keyword: 'hotels', dates }),
        },
      ]

    case 'restaurant':
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
