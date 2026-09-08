// content/guia/zones/types.ts
//
// Tier B — destination services. Owned by Lagomplan, written once per zone,
// inherited by every partner property in that zone.

import type { FaqAnswer, ZoneFaqKey } from '../faq/types'

export type ZoneId = 'condesa' | 'roma' | 'horacio' | 'thiers' | 'polanco'

export interface Zone {
  id: ZoneId
  /** Destination-service answers only — laundry, supermarkets, currency
   *  exchange, odd-hours, coworking, group restaurants, taquizas/chefs,
   *  catering, wine/liquor, private events. Never checkout/keys/etc. */
  answers?: Partial<Record<ZoneFaqKey, FaqAnswer>>
}
