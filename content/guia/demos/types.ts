// content/guia/demos/types.ts
//
// Constants shared by the demo schema and the loader. The demo.json TYPE is
// inferred from the Zod schema (schema.ts) so there is a single source of truth.

import type { ZoneId } from '../zones/types'

export type { Lang } from '../types'

/** Zones a demo can use today: the ones that exist in the cdmx city layer. */
export const DEMO_ZONES = ['condesa', 'roma', 'polanco'] as const satisfies readonly ZoneId[]
export type DemoZone = (typeof DEMO_ZONES)[number]

/** Zone id → key of City.neighborhoods (the tab it selects). */
export const ZONE_TAB: Record<DemoZone, string> = {
  condesa: 'Condesa',
  roma: 'Roma Norte',
  polanco: 'Polanco',
}

export type { DemoConfig, DemoTour, Bilingual } from './schema'
