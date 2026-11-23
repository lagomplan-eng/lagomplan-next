// content/guia/hotel/tab-spots.ts
//
// Changes to the zone tabs of the city layer, for the hotel edition only (the Livin guides keep their tabs).
// Every place here is NEW and "to verify: address, opening days and hours" (VERIFY).

import type { IconKey, Lang } from '../types'
import type { HotelZone } from './zones'

export const VERIFY = 'to verify: address, opening days and hours'

export interface TabSpot {
  name: string
  where: string
  icon: IconKey
  note: Record<Lang, string>
  verify: typeof VERIFY
}

/** Polanco tab, Condesa and Roma Norte hotels: Siembra Tortillería replaces El Turix. The Polanco hotel keeps El Turix. */
export const POLANCO_SWAP: { replace: string; except: HotelZone; spot: TabSpot } = {
  replace: 'El Turix',
  except: 'polanco',
  spot: {
    name: 'Siembra Tortillería', where: 'Av. Isaac Newton 256', icon: 'utensilsSm', verify: VERIFY,
    note: { en: 'Tacos and tortillas made with native Mexican corn.', es: 'Tacos y tortillas de maíz nativo mexicano.' },
  },
}

/** Centro tab, all hotels: added right after Mercado de San Juan (which stays). Also joins "I want to shop". */
export const CENTRO_ADDITION: { after: string; spot: TabSpot } = {
  after: 'Mercado de San Juan',
  spot: {
    name: 'Mercado de Artesanías La Ciudadela', where: 'Balderas', icon: 'basket', verify: VERIFY,
    note: { en: "The city's crafts market, with stalls from all over Mexico.", es: 'El mercado de artesanías de la ciudad, con puestos de todo México.' },
  },
}
