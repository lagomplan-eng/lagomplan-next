// content/guia/paid/edition.ts
//
// The paid edition of the hotel guide. Same shape as HOTEL_FREE_EDITION (content/guia/hotel/config.ts, untouched).
// `share` is on, but the paid page shares the PROPERTY's own link (content/guia/paid/share.ts), never the free zone link.

import type { HotelEdition } from '../hotel/config'

export const HOTEL_PAID_EDITION: HotelEdition = {
  id: 'paid',
  heroEyebrow: { es: 'Guía de barrio', en: 'Neighborhood guide' },
  zoneHeadline: { es: 'Tu guía de {zone}', en: 'Your guide to {zone}' },
  heroSub: {
    es: 'Preparada como la prepararía un amigo, no un buscador. Solo lugares verificados.',
    en: 'Prepared like a friend would prepare it, not a search engine. Verified places only.',
  },
  share: true,
  utmSourcePrefix: 'paid_',
  planner: { utmCampaign: 'hotel_paid' },
}

/** The small line at the very bottom of the page, always present on a paid guide. */
export const PAID_FOOTER_TEXT = { en: 'powered by Lagomplan', es: 'con tecnología de Lagomplan' } as const

/** The labels that mark host-supplied content as sample in the demo. */
export const PAID_SAMPLE_LABEL = { en: 'Sample', es: 'Ejemplo' } as const
export const PAID_SAMPLE_BANNER = {
  en: 'Demo. Casa Lagom is an invented hotel; the letter, contact and host details on this page are sample content.',
  es: 'Demo. Casa Lagom es un hotel inventado; la carta, el contacto y los datos del anfitrión de esta página son contenido de ejemplo.',
} as const
