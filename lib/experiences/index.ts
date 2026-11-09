/**
 * lib/experiences/index.ts
 *
 * Data layer for the Experiencias hub. Built from the guide registry (the guide
 * files are the only source): never any GetYourGuide data beyond the link itself.
 *
 *   getExperiences('es')  → every experience whose affiliateUrl is a GYG tour page,
 *                            in editorial order (registry order, then position in guide).
 *
 * Bookable rule: isGygTourUrl(affiliateUrl). Search / location / supplier pages,
 * Stay22 redirectors, OpenTable, venue sites and empty links are not on the hub.
 */

import { getAllFlatGuides, getPublicGuideSlug, GUIDE_META } from '../data/guides'
import { buildGygBookingUrl, isGygTourUrl } from '../affiliate/gyg'
import type { Destination, Experience, Persona } from './types'

export type { Destination, Experience, Persona } from './types'

/**
 * Persona per guide. Source of truth = the ES hero.tags; the EN guide gets the same
 * set so both locales always agree (a flag in guides-review.csv checked that the EN
 * tags imply the same set today). Every other tag (Solo, Lujo, topics…) is ignored.
 */
const PERSONA_BY_ES_TAG: Record<string, Persona> = {
  'Familia': 'familia', 'Niños pequeños': 'familia', 'Familia con adolescentes': 'familia', 'Adolescentes': 'familia',
  'Pareja': 'pareja', 'Parejas': 'pareja', 'Romance': 'pareja',
  'Amigos': 'amigos', 'Amigas': 'amigos', 'Grupo de amigos': 'amigos',
}

export function personasFromEsTags(tags: string[]): Persona[] {
  const out: Persona[] = []
  for (const t of tags) {
    const p = PERSONA_BY_ES_TAG[t]
    if (p && !out.includes(p)) out.push(p)
  }
  return out
}

export function getExperiences(locale: string): Experience[] {
  const loc = locale === 'en' ? 'en' : 'es'
  const esByKey = new Map(getAllFlatGuides('es').map(g => [g.canonical, g.flat]))
  const out: Experience[] = []
  let order = 0

  for (const { canonical, flat } of getAllFlatGuides(loc)) {
    const meta = GUIDE_META[canonical]
    const personas = personasFromEsTags((esByKey.get(canonical) ?? flat).hero.tags)
    flat.experiences.forEach(e => {
      const position = order++ // editorial position counts every experience, bookable or not
      if (!isGygTourUrl(e.affiliateUrl)) return
      out.push({
        id: e.id,
        name: e.name,
        description: e.description,
        ...(e.category ? { category: e.category } : {}),
        ...(e.duration ? { duration: e.duration } : {}),
        personas,
        region: meta.region,
        destinationSlug: canonical,
        destinationName: meta.shortName[loc],
        destinationAltName: meta.shortName[loc === 'es' ? 'en' : 'es'],
        ...(flat.hero.image ? { destinationImage: flat.hero.image } : {}),
        guideSlug: getPublicGuideSlug(canonical, loc),
        guideAnchor: `exp-${e.id}`,
        bookingUrl: buildGygBookingUrl(e.affiliateUrl, { cmp: `experiencias-${canonical}` }),
        order: position,
      })
    })
  }
  return out
}

/** Every guide in registry order, with how many of its experiences are bookable on the hub. */
export function getDestinations(locale: string): Destination[] {
  const loc = locale === 'en' ? 'en' : 'es'
  return getAllFlatGuides(loc).map(({ canonical, flat }) => {
    const meta = GUIDE_META[canonical]
    return {
      slug: canonical,
      name: meta.shortName[loc],
      altName: meta.shortName[loc === 'es' ? 'en' : 'es'],
      region: meta.region,
      guideSlug: getPublicGuideSlug(canonical, loc),
      bookable: flat.experiences.filter(e => isGygTourUrl(e.affiliateUrl)).length,
    }
  })
}
