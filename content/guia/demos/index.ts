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

import fs from 'node:fs'
import path from 'node:path'
import type { Lang, Neighborhood, OwnTour, Partner } from '../types'
import type { ZoneId } from '../zones/types'
import { getZone } from '../zones'
import { ZONE_TAB, DEMO_ZONES, type DemoConfig, type DemoTour } from './types'

export type { DemoConfig } from './types'

const DEMOS_DIR = path.join(process.cwd(), 'content', 'demos')
const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const PROPERTY = '[nombre de la propiedad]'

let cache: Record<string, DemoConfig> | null = null

/** Minimal structural checks with readable errors (the full Zod schema comes next). */
function check(cfg: DemoConfig, folder: string): DemoConfig {
  const where = `content/demos/${folder}/demo.json`
  const fail = (field: string, msg: string): never => { throw new Error(`${where} › ${field}: ${msg}`) }
  if (cfg.slug !== folder) fail('slug', `must equal the folder name "${folder}" (got "${cfg.slug}")`)
  if (!SLUG.test(cfg.slug)) fail('slug', 'lowercase letters, digits and hyphens only')
  if (cfg.kind !== 'demo') fail('kind', 'must be "demo"')
  if (cfg.city !== 'cdmx') fail('city', 'must be "cdmx"')
  if (!cfg.partner?.name) fail('partner.name', 'required')
  if (!Array.isArray(cfg.property?.zones) || cfg.property.zones.length === 0) fail('property.zones', 'at least one zone is required')
  for (const z of cfg.property.zones) if (!(DEMO_ZONES as readonly string[]).includes(z)) fail('property.zones', `"${z}" is not one of ${DEMO_ZONES.join(', ')}`)
  return cfg
}

function load(): Record<string, DemoConfig> {
  if (cache) return cache
  const out: Record<string, DemoConfig> = {}
  const folders = fs.existsSync(DEMOS_DIR)
    ? fs.readdirSync(DEMOS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
    : []
  for (const folder of folders) {
    const file = path.join(DEMOS_DIR, folder, 'demo.json')
    if (!fs.existsSync(file)) continue
    let raw: DemoConfig
    try { raw = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) {
      throw new Error(`content/demos/${folder}/demo.json › invalid JSON: ${(e as Error).message}`)
    }
    const cfg = check(raw, folder)
    const logo = cfg.partner.logo
    if (logo && !fs.existsSync(path.join(DEMOS_DIR, folder, logo))) {
      console.warn(`[demos] ${folder}: partner.logo "${logo}" not found in content/demos/${folder}/ — the header will fall back to the name`)
    }
    out[cfg.slug] = cfg
  }
  return (cache = out)
}

export function listDemoSlugs(): string[] {
  return Object.keys(load())
}

export function getDemoProspect(slug: string): DemoConfig | null {
  const all = load()
  return Object.prototype.hasOwnProperty.call(all, slug) ? all[slug] : null
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
    price: t.price,
    image: t.image,
    howToBook: t.how_to_book?.[lang] ?? (lang === 'es'
      ? 'Reserva en línea con el botón «Reservar».'
      : 'Book online with the "Book" button.'),
    minBookingTime: t.min_booking_time ?? '[tiempo mínimo de reserva]',
    bookHref: t.url,
    bookLabel: lang === 'es' ? 'Reservar' : 'Book',
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
    yourHouse: placeholderHouse(),
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
        body: { es: '[servicio de chef del operador]', en: '[servicio de chef del operador]' },
      },
      massages: {
        body: { es: '[masaje recomendado]', en: '[masaje recomendado]' },
      },
    },
    operatorWhatsApp: {
      label: contact?.whatsapp?.label ?? { es: '[WhatsApp del operador]', en: '[operator WhatsApp]' },
      ...(contact?.whatsapp?.href ? { href: contact.whatsapp.href } : {}),
    },
    ...(stayGlance ? { stayGlance } : {}),
    ...(tours?.length ? { ownTours: { es: tours.map((t, i) => toTour(t, 'es', i)), en: tours.map((t, i) => toTour(t, 'en', i)) } } : {}),
    ...(note ? { experiencesPartnerNote: note } : {}),
    brand: {
      logo,
      accent: accent && HEX.test(accent) ? accent : undefined,
    },
  }
}
