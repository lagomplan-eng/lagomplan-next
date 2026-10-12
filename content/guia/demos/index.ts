// content/guia/demos/index.ts
//
// Sales-demo prospects for /demo/[prospect]. Each prospect becomes a Partner
// (so the demo reuses GuiaClient unchanged) via buildDemoPartner(). Demos are
// noindex, never in the sitemap, and nothing links to them.
//
// A demo is the /guia/livin_condesa template 1:1 — same components, sections,
// tabs, zones and city layers. Only the PROPERTY layer changes (brand, host
// letter, tours, stay facts). Every property fact we don't have yet is a
// "[bracketed]" placeholder, which renders highlighted: nothing is invented.
//
// Adding a prospect = add an entry to PROSPECTS. Only `slug` and `name` are
// required.

import type { Lang, Neighborhood, OwnTour, Partner } from '../types'
import type { ZoneId } from '../zones/types'
import { getZone } from '../zones'
import hostMeTenderJson from '../../../B2B demos/host-me-tender.json'

export interface DemoProspect {
  /** URL segment: /demo/<slug>. Lowercase letters, digits, hyphens. */
  slug: string
  /** Display name, e.g. "Host Me Tender". */
  name: string
  /** Logo: public path or https URL. */
  logo?: string
  /** Accent color as #rgb or #rrggbb. Invalid values are ignored. */
  accent?: string
  /** Host letter. Renders only when provided. */
  hostLetter?: Partial<Record<Lang, { quote?: string; body: string; roleLabel?: string }>>
  /** Check-out time for the practical strip. Default: the "[check-out]" placeholder. */
  checkOut?: string
  /** Operator's own tours; replace the Insider experience cards. */
  ownTours?: Partial<Record<Lang, OwnTour[]>>
  /** Section-level attribution under the experiences heading. */
  experiencesPartnerNote?: Partial<Record<Lang, string>>
}

interface TourJson {
  name: string
  description: { es: string; en: string }
  price: string
  url: string
}

// Our own illustrations that genuinely fit a tour (no third-party images).
// Tours without one get a highlighted "[imagen]" placeholder.
const TOUR_IMAGES: Record<string, string> = {
  'tour-3': '/images/guia/experiences/exp-frida.jpg', // Coyoacán food tour
  'tour-4': '/images/guia/experiences/exp-tacos.jpg', // taco tour
}

/** JSON tour → OwnTour. Prices stay as-is ("[precio]" renders highlighted). */
function toTour(t: TourJson, lang: Lang, i: number): OwnTour {
  const id = `tour-${i + 1}`
  return {
    id,
    title: t.name, // tour names stay in English in both languages
    teaser: t.description[lang],
    price: t.price,
    image: TOUR_IMAGES[id],
    howToBook: lang === 'es'
      ? 'Reserva en línea con el botón «Reservar».'
      : 'Book online with the "Book" button.',
    minBookingTime: '[tiempo mínimo de reserva]',
    bookHref: t.url,
    bookLabel: lang === 'es' ? 'Reservar' : 'Book',
  }
}

// PROVISIONAL wording — to be reviewed by Pili.
const SABORES_NOTE: Record<Lang, string> = {
  es: 'Reservas con Sabores México, nuestro aliado local.',
  en: 'Booked through Sabores México, our local partner.',
}

// NOTE: names below are placeholders from the sales brief — confirm the exact
// brand spelling, logo and accent before sending each demo link.
const PROSPECTS: Record<string, DemoProspect> = {
  'host-me-tender': {
    slug: 'host-me-tender',
    name: hostMeTenderJson.name,
    // PROVISIONAL accent, not a brand-guide value: sampled from their logo
    // (hostmetender.com …/secundario2-verdeselva.png) — the most frequent
    // fully-opaque pixel colour (≈ the flat fill; antialiased edges are
    // lighter, core median was #1e4737). Replace with the real "verde selva"
    // hex from their brand guide once we have it. The JSON's own brandColor
    // is still the placeholder "[hex verde selva]".
    accent: '#194332',
    // Local copy of hostMeTenderJson.logoUrl (don't hotlink their site).
    logo: '/images/demos/host-me-tender-logo.png',
    // Their own letter replaces the city-level one; quote '' hides the
    // generic Lagomplan quote so it isn't attributed to them.
    hostLetter: {
      es: { quote: '', body: hostMeTenderJson.hostLetter.es },
      en: { quote: '', body: hostMeTenderJson.hostLetter.en },
    },
    // Still the literal placeholder "[check-out]" — rendered highlighted.
    checkOut: hostMeTenderJson.checkout,
    ownTours: {
      es: hostMeTenderJson.tours.map((t, i) => toTour(t, 'es', i)),
      en: hostMeTenderJson.tours.map((t, i) => toTour(t, 'en', i)),
    },
    experiencesPartnerNote: SABORES_NOTE,
  },
  'dave-nat': {
    slug: 'dave-nat',
    name: 'Dave & Nat',
  },
}

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const PROPERTY = '[nombre de la propiedad]'

export function listDemoSlugs(): string[] {
  return Object.keys(PROSPECTS)
}

export function getDemoProspect(slug: string): DemoProspect | null {
  return Object.prototype.hasOwnProperty.call(PROSPECTS, slug) ? PROSPECTS[slug] : null
}

/** Zone ids that have FAQ data; matched by lowercase neighborhood name. */
function zoneFor(neighborhood: string): ZoneId | undefined {
  const id = neighborhood.toLowerCase().split(' ')[0] as ZoneId
  return getZone(id) ? id : undefined
}

/**
 * The "Your house" tab: the same slot Livin fills with its street-level list.
 * We don't have the property's, so the name and exactly three spots are
 * highlighted placeholders.
 */
function placeholderHouse(): Neighborhood {
  const spot = (icon: 'coffee' | 'utensilsSm' | 'trees') => ({
    icon,
    name: '[lugar cercano]',
    distance: '[dirección]',
    note: '[descripción del lugar]',
  })
  const spots = [spot('coffee'), spot('utensilsSm'), spot('trees')]
  return {
    name: PROPERTY,
    tabLabel: { es: 'Tu casa', en: 'Your house' },
    mapUrl: '', // no Maps list yet → the card renders as plain text
    tagline: { es: `A pasos de ${PROPERTY}`, en: `Steps from ${PROPERTY}` },
    orientation: { es: '[distancia a pie desde la propiedad]', en: '[walking distance from the property]' },
    spots: { es: spots, en: spots },
  }
}

export function buildDemoPartner(p: DemoProspect): Partner {
  const home = 'Condesa' // default zone for every demo
  const checkOut = p.checkOut ?? '[check-out]'

  return {
    // Prefixed so demo traffic is distinguishable from real partners in
    // utm_source / partner_link_click.
    slug: `demo_${p.slug}`,
    displayName: p.name,
    hostName: p.name,
    city: 'cdmx',
    homeNeighborhood: home,
    yourHouse: placeholderHouse(),
    defaultNeighborhood: home,
    pilotId: 'mxcity_demo',
    zone: zoneFor(home),
    noindex: true,
    ...(p.hostLetter ? { hostLetterSignature: p.name, hostLetter: p.hostLetter } : {}),
    atAGlance: { checkOut },
    // Same omission Livin applies: "Health & Pharmacies" lives under
    // Everyday errands, not duplicated under Before you arrive.
    arrivalItemsOmit: ['health-pharmacies'],
    faqAnswers: {
      checkinCheckout: {
        body: {
          es: `La salida es a las ${checkOut}.`,
          en: `Check-out is at ${checkOut}.`,
        },
      },
      // We must not promise a service on the operator's behalf: these two
      // cards stay placeholders until the operator confirms what they offer.
      chefsAtHome: {
        body: { es: '[servicio de chef del operador]', en: '[servicio de chef del operador]' },
      },
      massages: {
        body: { es: '[masaje recomendado]', en: '[masaje recomendado]' },
      },
    },
    operatorWhatsApp: {
      label: { es: '[WhatsApp del operador]', en: '[operator WhatsApp]' },
    },
    ...(p.ownTours ? { ownTours: p.ownTours } : {}),
    ...(p.experiencesPartnerNote ? { experiencesPartnerNote: p.experiencesPartnerNote } : {}),
    brand: {
      logo: p.logo,
      accent: p.accent && HEX.test(p.accent) ? p.accent : undefined,
    },
  }
}
