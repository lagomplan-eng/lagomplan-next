// content/guia/index.ts
//
// Registry for the co-branded guest guide. The system supports many partners
// and cities; today only "lupito" (partner) and "cdmx" (city) are filled.
// Adding a partner = add a file under partners/ and register it here.

import type { City, Partner } from './types'
import { cdmx } from './cities/cdmx'
import { lupito } from './partners/lupito'

const CITIES: Record<string, City> = {
  cdmx,
}

const PARTNERS: Record<string, Partner> = {
  lupito,
}

/** All partner slugs, for generateStaticParams. */
export function listPartnerSlugs(): string[] {
  return Object.keys(PARTNERS)
}

export function getPartner(slug: string): Partner | null {
  return PARTNERS[slug] ?? null
}

export function getCity(id: string): City | null {
  return CITIES[id] ?? null
}

/** Resolve a partner + its city together, or null if either is missing. */
export function getGuide(slug: string): { partner: Partner; city: City } | null {
  const partner = getPartner(slug)
  if (!partner) return null
  const city = getCity(partner.city)
  if (!city) return null
  return { partner, city }
}
