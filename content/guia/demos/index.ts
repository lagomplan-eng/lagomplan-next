// content/guia/demos/index.ts
//
// Sales-demo loader for /demo/[prospect]. Demos are DATA, not code: every
// folder content/demos/<slug>/ with a demo.json is a demo (logo next to it).
// Adding one needs no TypeScript change. Each demo becomes a Partner so the
// page reuses GuiaClient unchanged. Demos are noindex, never in the sitemap,
// and nothing links to them.
//
// A demo is the /guia/livin_condesa template 1:1 — same components, sections,
// tabs, zones and city layers. Only the PROPERTY layer changes. Every fact we
// don't have is a "[bracketed]" placeholder, which renders highlighted.
//
// Server-only (reads the filesystem at build time).

import type { Lang, Neighborhood, OwnTour, Partner } from '../types'
import type { ZoneId } from '../zones/types'
import { getZone } from '../zones'
import { ZONE_TAB, type DemoConfig, type DemoTour } from './types'
import { formatReport, listDemoFolders, validateDemoFolder } from './validate'

export type { DemoConfig } from './types'

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const PROPERTY = '[nombre de la propiedad]'

let cache: Record<string, DemoConfig> | null = null

function load(): Record<string, DemoConfig> {
  if (cache) return cache
  const out: Record<string, DemoConfig> = {}
  const failures: string[] = []
  for (const folder of listDemoFolders()) {
    const report = validateDemoFolder(folder) // placeholders are fine; errors fail the build
    if (report.errors.length || !report.config) { failures.push(formatReport(report)); continue }
    out[report.config.slug] = report.config
  }
  // A broken demo fails the build with every problem listed, before anything is published.
  if (failures.length) throw new Error(`Invalid demo config:\n${failures.join('\n')}`)
  return (cache = out)
}

/** Demos that opt out of Production (environments: ["preview"]) 404 there. */
function visibleHere(cfg: DemoConfig): boolean {
  if (process.env.VERCEL_ENV !== 'production') return true
  return (cfg.environments ?? ['preview', 'production']).includes('production')
}

export function listDemoSlugs(): string[] {
  const all = load()
  return Object.keys(all).filter((s) => visibleHere(all[s]))
}

export function getDemoProspect(slug: string): DemoConfig | null {
  const all = load()
  return Object.prototype.hasOwnProperty.call(all, slug) && visibleHere(all[slug]) ? all[slug] : null
}

/** Public URL of the demo's logo (copied to public/demos/<slug>/ by scripts/sync-demo-assets.mjs). */
export function demoLogoSrc(cfg: DemoConfig): string | undefined {
  return cfg.partner.logo ? `/demos/${cfg.slug}/${cfg.partner.logo}` : undefined
}

function toTour(t: DemoTour, lang: Lang, i: number): OwnTour {
  return {
    id: `tour-${i + 1}`,
    title: t.name,
    teaser: t.description[lang],
    price: typeof t.price === 'string' ? t.price : t.price[lang],
    image: t.image,
    howToBook: t.how_to_book?.[lang] ?? (lang === 'es'
      ? 'Reserva en línea con el botón «Reservar».'
      : 'Book online with the "Book" button.'),
    minBookingTime: t.min_booking_time ?? '[tiempo mínimo de reserva]',
    bookHref: t.url,
    bookLabel: lang === 'es' ? 'Reservar' : 'Book',
  }
}

/** The "Your house" tab from demo.json, or highlighted placeholders when absent. */
function houseFor(p: DemoConfig): Neighborhood {
  const h = p.property.house
  if (!h) return placeholderHouse()
  return {
    name: h.name,
    tabLabel: { es: 'Tu casa', en: 'Your house' },
    mapUrl: h.map_url ?? '',
    tagline: h.tagline ?? { es: `A pasos de ${h.name}`, en: `Steps from ${h.name}` },
    orientation: h.orientation ?? { es: '[distancia a pie desde la propiedad]', en: '[walking distance from the property]' },
    spots: h.spots,
  }
}

/** The "Your house" tab: the same slot Livin fills with its street-level list. */
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

export function buildDemoPartner(p: DemoConfig): Partner {
  const zone = p.property.zones[0] as ZoneId
  const home = ZONE_TAB[p.property.zones[0]]
  const checkOut = p.property.check_out ?? '[check-out]'
  const contact = p.partner.contact
  const letter = p.guide?.host_letter
  const tours = p.guide?.tours
  const note = p.guide?.tours_partner_note
  const logo = demoLogoSrc(p)
  const accent = p.partner.brand_color

  const hostLetter: Partner['hostLetter'] | undefined = letter && (Object.keys(letter) as Lang[]).length
    ? Object.fromEntries((Object.keys(letter) as Lang[]).map((l) => [l, {
        quote: '', // hides the generic Lagomplan quote so it isn't attributed to the prospect
        body: letter[l]!.paragraphs.join('\n'), // fallback for the classic layout
        paragraphs: letter[l]!.paragraphs,
        ...(letter[l]!.link ? { link: letter[l]!.link } : {}),
      }]))
    : undefined

  const stayGlance: Partner['stayGlance'] | undefined =
    p.property.rules || contact?.email || contact?.instagram
      ? {
          ...(p.property.rules ? { rules: p.property.rules } : {}),
          ...(contact?.email ? { email: contact.email } : {}),
          ...(contact?.instagram
            ? { instagram: { handle: contact.instagram, href: `https://www.instagram.com/${contact.instagram.replace('@', '')}/` } }
            : {}),
        }
      : undefined

  return {
    // Prefixed so demo traffic is distinguishable from real partners in
    // utm_source / partner_link_click.
    slug: `demo_${p.slug}`,
    displayName: p.partner.name,
    hostName: p.partner.name,
    city: p.city,
    homeNeighborhood: home,
    yourHouse: houseFor(p),
    defaultNeighborhood: home,
    pilotId: 'mxcity_demo',
    cobrand: !!p.guide?.cobrand,
    zone: getZone(zone) ? zone : undefined,
    noindex: true,
    ...(hostLetter ? { hostLetterSignature: p.partner.name, hostLetter } : {}),
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
        body: p.guide?.faq?.chefs_at_home ?? { es: '[servicio de chef del operador]', en: '[servicio de chef del operador]' },
        ...(p.guide?.faq?.chefs_at_home_links ? { links: p.guide.faq.chefs_at_home_links } : {}),
      },
      massages: {
        body: p.guide?.faq?.massages ?? { es: '[masaje recomendado]', en: '[masaje recomendado]' },
      },
    },
    operatorWhatsApp: {
      label: contact?.whatsapp?.label ?? { es: '[WhatsApp del operador]', en: '[operator WhatsApp]' },
      ...(contact?.whatsapp?.href ? { href: contact.whatsapp.href } : {}),
    },
    ...(stayGlance ? { stayGlance } : {}),
    ...(tours?.length ? { ownTours: { es: tours.map((t, i) => toTour(t, 'es', i)), en: tours.map((t, i) => toTour(t, 'en', i)) } } : {}),
    ...(note ? { experiencesPartnerNote: note } : {}),
    ...(p.guide?.display?.placeholder_pill ? { placeholderPill: p.guide.display.placeholder_pill } : {}),
    ...(p.guide?.display?.hide_newsletter ? { hideNewsletter: true } : {}),
    brand: {
      logo,
      accent: accent && HEX.test(accent) ? accent : undefined,
    },
  }
}
