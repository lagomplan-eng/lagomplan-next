// content/guia/hotel/resolve.ts
//
// Server-side preparation for the hotel edition. The page is the Livin guide, so this only does what the
// standing rules need, before anything reaches the browser (GuiaClient is a client component: whatever is
// passed to it is serialized into the page source even when it never renders):
//   - held items (hold: 'confirm') are dropped, so they never render;
//   - the Insider link and number are removed from the arrival cards and from the experience cards;
//   - the matching Livin partner (one per zone) supplies the partner layer.
// Pure, no React.

import type { ArrivalItem, City, CityCopy, InlineLink, Partner } from '../types'
import type { FaqItemKey } from '../faq/types'
import { getZone } from '../zones'
import { getGuide } from '..'
import { HOTEL_FREE_EDITION, type HotelMode } from './config'
import type { HotelZone } from './zones'

/** The Livin guide each hotel zone is a copy of. */
export const HOTEL_PARTNER_SLUG: Record<HotelZone, string> = {
  condesa: 'livin_condesa',
  roma: 'livin_roma',
  polanco: 'livin_polanco',
}

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
    arrivalItems: copy.arrivalItems.filter((i) => !i.hold).map(stripInsider),
    // The experiences block shows the GetYourGuide tours (content/guia/hotel/experiences.ts) instead.
    experiences: [],
    expPartnerNote: '',
    expBookCta: '',
  }
}

export function toHotelCity(city: City): City {
  return { ...city, copy: { es: sanitizeCopy(city.copy.es), en: sanitizeCopy(city.copy.en) } }
}

/** FAQ keys whose answer, at the layer the guide would use, is still on hold. */
export function heldFaqKeys(partner: Partner, zone: HotelZone): FaqItemKey[] {
  const zoneAnswers = getZone(zone)?.answers ?? {}
  return (Object.keys(zoneAnswers) as FaqItemKey[]).filter((k) => zoneAnswers[k]?.hold && !partner.faqAnswers?.[k]?.body)
}

export function buildHotelGuideProps(zone: HotelZone): { partner: Partner; city: City; hotel: HotelMode } | null {
  const guide = getGuide(HOTEL_PARTNER_SLUG[zone])
  if (!guide) return null
  return {
    partner: guide.partner,
    city: toHotelCity(guide.city),
    hotel: { zone, edition: HOTEL_FREE_EDITION, heldFaqKeys: heldFaqKeys(guide.partner, zone) },
  }
}
