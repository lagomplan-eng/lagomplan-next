// content/guia/paid/resolve.ts
//
// Props for a paid guide: the sanitized hotel guide of the client's zone (buildHotelGuideProps: nothing of the Livin
// property reaches the page data) with the paid edition and the client layer on top. Pure, no React.

import type { City, Partner } from '../types'
import type { HotelMode } from '../hotel/config'
import type { HotelZone } from '../hotel/zones'
import { buildHotelGuideProps } from '../hotel/resolve'
import { HOTEL_PAID_EDITION } from './edition'
import type { PaidClient } from './types'

export function buildPaidGuideProps(client: PaidClient, zone: HotelZone): { partner: Partner; city: City; hotel: HotelMode; paid: PaidClient } | null {
  const base = buildHotelGuideProps(zone)
  if (!base) return null
  return {
    ...base,
    partner: { ...base.partner, slug: `paid_${client.id}`, displayName: client.name, hostName: client.name, pilotId: HOTEL_PAID_EDITION.planner.utmCampaign },
    hotel: { ...base.hotel, edition: HOTEL_PAID_EDITION },
    paid: client,
  }
}
