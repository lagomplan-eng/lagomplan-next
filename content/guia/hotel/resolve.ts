// content/guia/hotel/resolve.ts
//
// Server-side preparation for the hotel edition. The page is the Livin guide, so this only does what the
// standing rules need, before anything reaches the browser (GuiaClient is a client component: whatever is
// passed to it is serialized into the page source even when it never renders):
//   - the Insider link and number are removed from the arrival cards and from the experience cards;
//   - everything that belongs to the Livin property is taken out of the partner layer (name, "Your house" address,
//     check-out time, private chefs, massages, host letter, pilot id);
//   - the matching Livin partner (one per zone) supplies the rest of the partner layer.
// Items that were once held for confirmation (airport, earthquakes, cash and ATMs) now render like in the Livin guides.
// Pure, no React.

import type { ArrivalItem, City, CityCopy, InlineLink, Partner } from '../types'
import type { FaqItemKey } from '../faq/types'
import { getGuide } from '..'
import { HOTEL_FREE_EDITION, type HotelMode } from './config'
import { ZONE_NEIGHBORHOOD, type HotelZone } from './zones'

/** The Livin guide each hotel zone is a copy of. */
export const HOTEL_PARTNER_SLUG: Record<HotelZone, string> = {
  condesa: 'livin_condesa',
  roma: 'livin_roma',
  polanco: 'livin_polanco',
}

/** FAQ answers that only make sense for the Livin property. */
export const HOTEL_HIDDEN_FAQ_KEYS: FaqItemKey[] = ['chefsAtHome', 'massages']

const INSIDER_HREF = /wa\.me\/525539149062/i

function isInsiderLink(l: InlineLink): boolean {
  return l.linkName === 'insider' || INSIDER_HREF.test(l.href)
}

/** Arrival card without its Insider link; the body is cut back to the last complete sentence before the link. */
function stripInsider(item: ArrivalItem): ArrivalItem {
  if (!item.link || !isInsiderLink(item.link)) return item
  const cut = item.body.lastIndexOf('.')
  const { link: _removed, ...rest } = item
  return { ...rest, body: cut > 0 ? item.body.slice(0, cut + 1) : item.body }
}

function sanitizeCopy(copy: CityCopy): CityCopy {
  return {
    ...copy,
    arrivalItems: copy.arrivalItems.map(stripInsider),
    // The experiences block shows the GetYourGuide tours (content/guia/hotel/experiences.ts) instead.
    experiences: [],
    expPartnerNote: '',
    expBookCta: '',
    // The host letter is not rendered in the hotel edition; its copy does not travel either.
    hostLetter: { ...copy.hostLetter, quote: '', body: '' },
  }
}

export function toHotelCity(city: City): City {
  return { ...city, copy: { es: sanitizeCopy(city.copy.es), en: sanitizeCopy(city.copy.en) } }
}

/** The Livin partner layer without anything that belongs to the Livin property. */
export function toHotelPartner(partner: Partner, city: City, zone: HotelZone): Partner {
  const faqAnswers = { ...partner.faqAnswers }
  for (const k of HOTEL_HIDDEN_FAQ_KEYS) delete faqAnswers[k]
  return {
    ...partner,
    slug: `hotel_${zone}`,
    displayName: 'Lagomplan',
    hostName: 'Lagomplan',
    // The "Your house" tab is not shown; this keeps the type satisfied with the zone's own data, not Livin's address.
    yourHouse: city.neighborhoods[ZONE_NEIGHBORHOOD[zone]],
    pilotId: HOTEL_FREE_EDITION.planner.utmCampaign,
    edition: undefined,
    atAGlance: undefined,
    hostLetter: undefined,
    hostLetterSignature: undefined,
    stayGlance: undefined,
    operatorWhatsApp: undefined,
    ownTours: undefined,
    insiders: undefined,
    faqAnswers,
  }
}

export function buildHotelGuideProps(zone: HotelZone): { partner: Partner; city: City; hotel: HotelMode } | null {
  const guide = getGuide(HOTEL_PARTNER_SLUG[zone])
  if (!guide) return null
  return {
    partner: toHotelPartner(guide.partner, guide.city, zone),
    city: toHotelCity(guide.city),
    hotel: { zone, edition: HOTEL_FREE_EDITION, hiddenFaqKeys: HOTEL_HIDDEN_FAQ_KEYS },
  }
}
