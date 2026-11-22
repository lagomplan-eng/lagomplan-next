// content/guia/hotel/config.ts
//
// The hotel edition, as ONE config object: which blocks render and in what
// order, which arrival cards and FAQ items show, which links are allowed.
// HotelGuideClient reads this and nothing else — no edition conditionals in
// GuiaClient. A paid edition later is a second object of the same shape
// (more blocks / items switched on), not new branches in the renderer.
//
// Held items (`hold: 'confirm'` on an ArrivalItem or FaqAnswer) are listed
// here as "show" so releasing one is just deleting its `hold` flag in the
// content file. While held they never render.

import type { Lang } from '../types'
import type { FaqItemKey } from '../faq/types'

export type HotelBlockId =
  | 'hero' | 'zone' | 'neighborhoods' | 'food' | 'moods' | 'rhythm'
  | 'experiences' | 'practical' | 'itinerary' | 'planner'

export interface HotelEdition {
  id: 'free' | 'paid'
  /** Render order. A block that is not listed does not render. */
  blocks: HotelBlockId[]
  heroEyebrow: Record<Lang, string>
  /** First-screen headline template ({zone} is replaced). The guest opens on their own zone, as the printed card says.
   *  Plain strings, because this object is a prop of a client component. */
  zoneHeadline: Record<Lang, string>
  /** Eyebrow of the own-zone section (the one right under the hero). */
  yourZoneEyebrow: Record<Lang, string>
  /** Eyebrow of the city-wide zones section, shown below the own zone: the way into the rest of Mexico City. */
  exploreEyebrow: Record<Lang, string>
  headerLabel: Record<Lang, string>
  /** The city-wide zones section. ownZoneFirst = the guest's own zone leads the tabs. */
  neighborhoods: { yourHouseTab: boolean; ownZoneFirst: boolean; /** the own zone has its own section above, so the tabs list only the others */ excludeOwnZone: boolean }
  practical: {
    /** Arrival cards to show, in order, keyed by `item.id ?? item.icon`. */
    arrival: string[]
    /** FAQ answers to show (zone layer + base defaults, never partner), in order. */
    faq: FaqItemKey[]
    /** false = strip the local booking partner's links (and the sentence that introduced them). */
    allowBookingPartnerLinks: boolean
    /** Only these outbound link names survive in arrival cards. */
    allowedLinkNames: string[]
  }
  experiences: { allowWhatsApp: boolean; ownPlanBanner: boolean }
  planner: { utmCampaign: string }
  share: boolean
  /** The tracking utm_source prefix; the hotel code is appended. */
  utmSourcePrefix: string
}

export const HOTEL_FREE_EDITION: HotelEdition = {
  id: 'free',
  blocks: ['hero', 'zone', 'neighborhoods', 'food', 'moods', 'rhythm', 'experiences', 'practical', 'itinerary', 'planner'],
  heroEyebrow: { es: 'Guía de barrio · Lagomplan', en: 'Neighborhood guide · Lagomplan' },
  zoneHeadline: { es: 'Tu guía de {zone}', en: 'Your guide to {zone}' },
  yourZoneEyebrow: { es: 'Tu zona', en: 'Your area' },
  exploreEyebrow: { es: 'Explora el resto de la ciudad', en: 'Explore the rest of Mexico City' },
  headerLabel: { es: 'Guía de barrio', en: 'Neighborhood guide' },
  neighborhoods: { yourHouseTab: false, ownZoneFirst: true, excludeOwnZone: true },
  practical: {
    arrival: [
      'plane',              // Airport — HELD (cdmx.ts CONFIRM, per zone time)
      'car',                // Transportation, without the Insider link
      'banknote',           // Money
      'wifi',               // Connectivity (Airalo link)
      'shield',             // Safety
      'droplet',            // Tap water
      'mountain',           // Altitude
      'health-pharmacies',  // Health & pharmacies (once: the FAQ copy of it is not listed below)
      'earthquakes',        // Earthquakes — HELD (cdmx.ts CONFIRM)
    ],
    faq: ['cashAtms', 'oddHours'],
    allowBookingPartnerLinks: false,
    allowedLinkNames: ['airalo'],
  },
  experiences: { allowWhatsApp: false, ownPlanBanner: false },
  planner: { utmCampaign: 'hotel_free' },
  share: true,
  utmSourcePrefix: 'hotel_',
}

/** Section ids accepted by /api/hotels/event for section_open — derived from the config, so the whitelist can't drift. */
export const HOTEL_SECTION_IDS: readonly string[] = HOTEL_FREE_EDITION.blocks

/** Outbound click ids accepted by /api/hotels/event for outbound_click. */
export const HOTEL_OUTBOUND_IDS = ['experience_book', 'airalo', 'map', 'planner', 'share'] as const
export type HotelOutboundId = (typeof HOTEL_OUTBOUND_IDS)[number]
