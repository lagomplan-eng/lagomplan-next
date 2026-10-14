// content/guia/demos/types.ts
//
// Shape of content/demos/<slug>/demo.json. It mimics the columns of the future
// partners / properties / guides tables (partner = operator + brand, property =
// the house, guide = what is published), plus `kind` so demos and real partner
// guides can share one table later. `schema_version` lets old files migrate.

import type { ZoneId } from '../zones/types'

export type Lang = 'es' | 'en'
export type Bilingual = Record<Lang, string>

/** Zones a demo can use today: the ones that exist in the cdmx city layer. */
export const DEMO_ZONES = ['condesa', 'roma', 'polanco'] as const satisfies readonly ZoneId[]
export type DemoZone = (typeof DEMO_ZONES)[number]

/** Zone id → key of City.neighborhoods (the tab it selects). */
export const ZONE_TAB: Record<DemoZone, string> = {
  condesa: 'Condesa',
  roma: 'Roma Norte',
  polanco: 'Polanco',
}

export interface DemoTour {
  name: string // stays in English in both languages
  description: Bilingual
  price: string // "[precio]" renders highlighted
  url: string
  /** Own Lagomplan illustration (public path). Missing ⇒ highlighted "[imagen]". */
  image?: string
  how_to_book?: Bilingual
  min_booking_time?: string
}

export interface DemoConfig {
  schema_version: 1
  kind: 'demo'
  /** Must equal the folder name. */
  slug: string
  /** Where this demo is served. Default: both. `["preview"]` ⇒ 404 on Production (VERCEL_ENV=production). */
  environments?: ('preview' | 'production')[]
  city: 'cdmx'
  /** Editorial review; filled after the reviewer's OK. */
  review: { by: string; date: string } | null
  partner: {
    name: string
    /** File inside the demo folder, e.g. "logo.png". */
    logo?: string
    logo_source_url?: string
    /** #rgb | #rrggbb */
    brand_color?: string
    brand_color_provisional?: boolean
    brand_color_note?: string
    contact?: {
      email?: string
      whatsapp?: { label?: Bilingual; href?: string }
      /** "@handle" */
      instagram?: string
    }
  }
  property: {
    /** First zone = initial tab and the FAQ zone (known limitation: FAQ uses only the first). */
    zones: DemoZone[]
    check_out?: string
    rules?: string
  }
  guide?: {
    /** Header/letter/stay-card co-brand layout. Needs partner.logo. */
    cobrand?: boolean
    host_letter?: Partial<Record<Lang, { paragraphs: string[]; link?: { text: string; href: string } }>>
    tours?: DemoTour[]
    tours_partner_note?: Bilingual
  }
}
