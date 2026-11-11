/**
 * lib/experiences/types.ts
 *
 * Shapes for the Experiencias hub (/experiencias, /experiences). Type-only: no
 * runtime imports, so anything (middleware included) can import from here safely.
 */

import type { ExperienceCategory, ExperienceDuration, GuideRegion } from '../data/guides/types'

export type { ExperienceCategory, ExperienceDuration, GuideRegion }

/** Who an experience suits. Derived from the guide's ES hero.tags (see index.ts). */
export type Persona = 'familia' | 'pareja' | 'amigos'

/**
 * One bookable experience on the hub. Everything here comes from the guide files;
 * nothing from GetYourGuide (no price, rating, reviews, duration or images).
 */
export interface Experience {
  /** Stable id from the guide file; also the anchor `#exp-<id>` on the guide page. */
  id: string
  name: string
  description: string
  /** Absent = no category fits; renders nothing. */
  category?: ExperienceCategory
  /** Absent unless a tag states it; renders nothing. */
  duration?: ExperienceDuration
  /** May be empty (guides tagged Solo / Lujo / topics only). */
  personas: Persona[]
  region: GuideRegion
  /** Registry key of the guide, e.g. 'ciudad-de-mexico'. This is the `?destino=` value. */
  destinationSlug: string
  /** Short display name for the current locale, e.g. "Alto Adigio" / "South Tyrol". */
  destinationName: string
  /** Short name in the other locale, so the destination search matches both languages. */
  destinationAltName: string
  /** The guide's hero illustration (hero.image). Absent when the guide has none. */
  destinationImage?: string
  /** Public per-locale slug of the guide page (roma/rome, mauricio/mauritius, else the key). */
  guideSlug: string
  guideAnchor: string
  /** Direct GYG link with partner_id + cmp=experiencias-<registryKey>. */
  bookingUrl: string
  /** Editorial position: registry order, then position within the guide. 0-based, global. */
  order: number
}

/**
 * Every destination we have a guide for, bookable or not. Feeds the hub search so it
 * never comes back empty for a destination with a guide.
 */
export interface Destination {
  /** Registry key; the `?destino=` value. */
  slug: string
  name: string
  /** Short name in the other locale. */
  altName: string
  region: GuideRegion
  guideSlug: string
  /** Bookable experiences on the hub; 0 = guide only. */
  bookable: number
}
