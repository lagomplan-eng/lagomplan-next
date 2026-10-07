// content/guia/demos/index.ts
//
// Sales-demo prospects for /demo/[prospect]. Each prospect becomes a Partner
// (so the demo reuses GuiaClient unchanged) via buildDemoPartner(). Demos are
// noindex, never in the sitemap, and nothing links to them.
//
// Adding a prospect = add an entry to PROSPECTS. Only `slug` and `name` are
// required; everything else is optional and omitted sections simply don't render.

import type { Lang, OwnTour, Partner } from '../types'
import type { ZoneId } from '../zones/types'
import { getZone } from '../zones'
import { cdmx } from '../cities/cdmx'

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
  /** City zones to browse, first is default. Defaults to ['Condesa']. */
  neighborhoods?: string[]
  /** Check-out time shown in the practical section, e.g. "11:00". */
  checkOut?: string
  /** Operator's own tours; replace the Insider experiences section. */
  ownTours?: Partial<Record<Lang, OwnTour[]>>
}

// NOTE: names below are placeholders from the sales brief — confirm the exact
// brand spelling, logo and accent before sending each demo link.
const PROSPECTS: Record<string, DemoProspect> = {
  'host-me-tender': {
    slug: 'host-me-tender',
    name: 'Host Me Tender',
  },
  'dave-nat': {
    slug: 'dave-nat',
    name: 'Dave & Nat',
  },
}

const DEFAULT_NEIGHBORHOODS = ['Condesa']
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

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

export function buildDemoPartner(p: DemoProspect): Partner {
  const neighborhoods = (p.neighborhoods?.length ? p.neighborhoods : DEFAULT_NEIGHBORHOODS)
    .filter((n) => n in cdmx.neighborhoods)
  const zones = neighborhoods.length ? neighborhoods : DEFAULT_NEIGHBORHOODS
  const home = zones[0]

  return {
    // Prefixed so demo traffic is distinguishable from real partners in
    // utm_source / partner_link_click.
    slug: `demo_${p.slug}`,
    displayName: p.name,
    hostName: p.name,
    city: 'cdmx',
    homeNeighborhood: home,
    // Required by the type; unused because `neighborhoods` replaces the tab.
    yourHouse: cdmx.neighborhoods[home],
    neighborhoods: zones,
    pilotId: 'mxcity_demo',
    zone: zoneFor(home),
    noindex: true,
    ...(p.hostLetter ? { hostLetterSignature: p.name, hostLetter: p.hostLetter } : {}),
    ...(p.checkOut
      ? {
          atAGlance: { checkOut: p.checkOut },
          faqAnswers: {
            checkinCheckout: {
              body: {
                es: `La salida es a las ${p.checkOut}.`,
                en: `Check-out is at ${p.checkOut}.`,
              },
            },
          },
        }
      : {}),
    ...(p.ownTours ? { ownTours: p.ownTours } : {}),
    brand: {
      logo: p.logo,
      accent: p.accent && HEX.test(p.accent) ? p.accent : undefined,
    },
  }
}
