/**
 * lib/data/guides/index.ts
 *
 * Central registry for the new guide data system.
 * All 14 guides are stored as FlatGuide (docx-sourced) and adapted on lookup.
 *
 * Lookup is O(1) — slug + locale → GuidePageData | null.
 */

import type { FlatGuide, GuidePageData } from './types'
import { adaptFlatGuide } from './adapter'

// ── Guide imports ──────────────────────────────────────────────────────────────

import { guide as cancunEs } from './cancun/es'
import { guide as cancunEn } from './cancun/en'
import { guide as ciudadDeMexicoEs } from './ciudad-de-mexico/es'
import { guide as ciudadDeMexicoEn } from './ciudad-de-mexico/en'
import { guide as cuernavacaEs } from './cuernavaca/es'
import { guide as cuernavacaEn } from './cuernavaca/en'
import { guide as guadalajaraEs } from './guadalajara/es'
import { guide as guadalajaraEn } from './guadalajara/en'
import { guide as losCabosEs } from './los-cabos/es'
import { guide as losCabosEn } from './los-cabos/en'
import { guide as meridaEs } from './merida/es'
import { guide as meridaEn } from './merida/en'
import { guide as oaxacaEs } from './oaxaca/es'
import { guide as oaxacaEn } from './oaxaca/en'
import { guide as puertoVallartaEs } from './puerto-vallarta/es'
import { guide as puertoVallartaEn } from './puerto-vallarta/en'
import { guide as querétaroEs } from './queretaro/es'
import { guide as querétaroEn } from './queretaro/en'
import { guide as rivieraMayaEs } from './riviera-maya/es'
import { guide as rivieraMayaEn } from './riviera-maya/en'
import { guide as sanMiguelDeAllendeEs } from './san-miguel-de-allende/es'
import { guide as sanMiguelDeAllendeEn } from './san-miguel-de-allende/en'
import { guide as tepoztlanEs } from './tepoztlan/es'
import { guide as tepoztlanEn } from './tepoztlan/en'
import { guide as tulumEs } from './tulum/es'
import { guide as tulumEn } from './tulum/en'
import { guide as valledeBravoEs } from './valle-de-bravo/es'
import { guide as valledeBravoEn } from './valle-de-bravo/en'

// International guides (June 2026 batch — alphabetized for scannability)
import { guide as atacamaEs } from './atacama/es'
import { guide as atacamaEn } from './atacama/en'
import { guide as cartagenaEs } from './cartagena/es'
import { guide as cartagenaEn } from './cartagena/en'
import { guide as cuscoMachuPicchuEs } from './cusco-machu-picchu/es'
import { guide as cuscoMachuPicchuEn } from './cusco-machu-picchu/en'
import { guide as guanacasteEs } from './guanacaste/es'
import { guide as guanacasteEn } from './guanacaste/en'
import { guide as guatemalaEs } from './guatemala/es'
import { guide as guatemalaEn } from './guatemala/en'
import { guide as norteDeArgentinaEs } from './norte-de-argentina/es'
import { guide as norteDeArgentinaEn } from './norte-de-argentina/en'
import { guide as rioDeJaneiroEs } from './rio-de-janeiro/es'
import { guide as rioDeJaneiroEn } from './rio-de-janeiro/en'
import { guide as uruguayEs } from './uruguay/es'
import { guide as uruguayEn } from './uruguay/en'

// International guides (July 2026 batch — Europe)
import { guide as azoresEs } from './azores/es'
import { guide as azoresEn } from './azores/en'
import { guide as copenhagueEs } from './copenhague/es'
import { guide as copenhagueEn } from './copenhague/en'
import { guide as paisVascoEs } from './pais-vasco/es'
import { guide as paisVascoEn } from './pais-vasco/en'
import { guide as albaniaEs } from './albania/es'
import { guide as albaniaEn } from './albania/en'
import { guide as esloveniaEs } from './eslovenia/es'
import { guide as esloveniaEn } from './eslovenia/en'
import { guide as islasFeroeEs } from './islas-feroe/es'
import { guide as islasFeroeEn } from './islas-feroe/en'

// International guides (August 2026 batch)
import { guide as torresDelPaineEs } from './torres-del-paine/es'
import { guide as torresDelPaineEn } from './torres-del-paine/en'
import { guide as westfjordsIslandiaEs } from './westfjords-islandia/es'
import { guide as westfjordsIslandiaEn } from './westfjords-islandia/en'
import { guide as ruandaEs } from './ruanda/es'
import { guide as ruandaEn } from './ruanda/en'
import { guide as napaSonomaEs } from './napa-sonoma/es'
import { guide as napaSonomaEn } from './napa-sonoma/en'
import { guide as altoAdigioDolomitasEs } from './alto-adigio-dolomitas/es'
import { guide as altoAdigioDolomitasEn } from './alto-adigio-dolomitas/en'

// ── Registry ───────────────────────────────────────────────────────────────────
// { [slug]: { [locale]: FlatGuide } }

const FLAT_REGISTRY: Record<string, Record<string, FlatGuide>> = {
  'cancun': { es: cancunEs, en: cancunEn },
  'ciudad-de-mexico': { es: ciudadDeMexicoEs, en: ciudadDeMexicoEn },
  'cuernavaca': { es: cuernavacaEs, en: cuernavacaEn },
  'guadalajara': { es: guadalajaraEs, en: guadalajaraEn },
  'los-cabos': { es: losCabosEs, en: losCabosEn },
  'merida': { es: meridaEs, en: meridaEn },
  'oaxaca': { es: oaxacaEs, en: oaxacaEn },
  'puerto-vallarta': { es: puertoVallartaEs, en: puertoVallartaEn },
  'queretaro': { es: querétaroEs, en: querétaroEn },
  'riviera-maya': { es: rivieraMayaEs, en: rivieraMayaEn },
  'san-miguel-de-allende': { es: sanMiguelDeAllendeEs, en: sanMiguelDeAllendeEn },
  'tepoztlan': { es: tepoztlanEs, en: tepoztlanEn },
  'tulum': { es: tulumEs, en: tulumEn },
  'valle-de-bravo': { es: valledeBravoEs, en: valledeBravoEn },
  // International guides (June 2026 batch)
  'atacama':            { es: atacamaEs,           en: atacamaEn },
  'cartagena':          { es: cartagenaEs,         en: cartagenaEn },
  'cusco-machu-picchu': { es: cuscoMachuPicchuEs,  en: cuscoMachuPicchuEn },
  'guanacaste':         { es: guanacasteEs,        en: guanacasteEn },
  'guatemala':          { es: guatemalaEs,         en: guatemalaEn },
  'norte-de-argentina': { es: norteDeArgentinaEs,  en: norteDeArgentinaEn },
  'rio-de-janeiro':     { es: rioDeJaneiroEs,      en: rioDeJaneiroEn },
  'uruguay':            { es: uruguayEs,           en: uruguayEn },
  // International guides (July 2026 batch — Europe)
  'azores':             { es: azoresEs,            en: azoresEn },
  'copenhague':         { es: copenhagueEs,         en: copenhagueEn },
  'pais-vasco':         { es: paisVascoEs,          en: paisVascoEn },
  'albania':            { es: albaniaEs,            en: albaniaEn },
  'eslovenia':          { es: esloveniaEs,          en: esloveniaEn },
  'islas-feroe':        { es: islasFeroeEs,         en: islasFeroeEn },
  // International guides (August 2026 batch)
  'torres-del-paine':   { es: torresDelPaineEs,     en: torresDelPaineEn },
  'westfjords-islandia': { es: westfjordsIslandiaEs, en: westfjordsIslandiaEn },
  'ruanda':              { es: ruandaEs,             en: ruandaEn },
  'napa-sonoma':         { es: napaSonomaEs,         en: napaSonomaEn },
  'alto-adigio-dolomitas': { es: altoAdigioDolomitasEs, en: altoAdigioDolomitasEn },
}

// ── Slug aliases ───────────────────────────────────────────────────────────────
// Maps locale-specific URL slugs (from lib/guides.ts) → canonical registry key.
// Add new entries here whenever a guide gets a new descriptive URL slug.

const SLUG_ALIASES: Record<string, string> = {
  // Valle de Bravo
  'valle-de-bravo-avandaro-aventura-en-familia': 'valle-de-bravo',
  'valle-de-bravo-avandaro-family-adventure':    'valle-de-bravo',
  // Riviera Maya
  'riviera-maya-roadtrip-de-semana-santa': 'riviera-maya',
  'riviera-maya-easter-road-trip':         'riviera-maya',
  // Oaxaca
  'oaxaca-guia-esencial':  'oaxaca',
  'oaxaca-essential-guide': 'oaxaca',
  // Cuernavaca
  'cuernavaca-refugio-de-primavera-estilo': 'cuernavaca',
  'cuernavaca-spring-getaway-and-style':    'cuernavaca',
  // Cancún
  'cancun-guia-familiar': 'cancun',
  'cancun-family-guide':  'cancun',
  // Ciudad de México
  'ciudad-de-mexico-guia-de-parejas': 'ciudad-de-mexico',
  'mexico-city-couples-guide':        'ciudad-de-mexico',
  // Guadalajara
  'guadalajara-guia-de-amigos': 'guadalajara',
  'guadalajara-friends-guide':  'guadalajara',
  // Los Cabos
  'los-cabos-relax-entre-amigas': 'los-cabos',
  'los-cabos-girls-getaway':      'los-cabos',
  // Mérida
  'merida-familia-aventurera': 'merida',
  'merida-adventurous-family': 'merida',
  // Querétaro
  'queretaro-guia-de-amigos': 'queretaro',
  'queretaro-friends-guide':  'queretaro',
  // Puerto Vallarta
  'puerto-vallarta-guia-romantica': 'puerto-vallarta',
  'puerto-vallarta-romantic-guide': 'puerto-vallarta',
  // San Miguel de Allende
  'san-miguel-de-allende-viaje-de-parejas': 'san-miguel-de-allende',
  'san-miguel-de-allende-couples-trip':     'san-miguel-de-allende',
  // Tepoztlán
  'tepoztlan-escapada-en-pareja': 'tepoztlan',
  'tepoztlan-couple-escape':      'tepoztlan',
  // Tulum
  'tulum-guia-viaje-solo':  'tulum',
  'tulum-solo-trip-guide':  'tulum',
}

// ── Public helpers ─────────────────────────────────────────────────────────────

/**
 * Returns guide data for a given slug + locale, or null if not found.
 * Accepts both canonical short slugs and locale-specific descriptive slugs
 * (via SLUG_ALIASES). Falls back to 'es' if the requested locale is missing.
 */
export function getGuidePageData(slug: string, locale: string): GuidePageData | null {
  const key = SLUG_ALIASES[slug] ?? slug
  const entry = FLAT_REGISTRY[key]
  if (!entry) return null
  const flat = entry[locale] ?? entry['es'] ?? null
  if (!flat) return null
  return adaptFlatGuide(flat)
}

/**
 * Returns all { locale, slug } pairs for generateStaticParams().
 */
export function getNewGuideParams(): Array<{ locale: string; slug: string }> {
  const params: Array<{ locale: string; slug: string }> = []
  for (const slug of Object.keys(FLAT_REGISTRY)) {
    for (const locale of Object.keys(FLAT_REGISTRY[slug])) {
      params.push({ locale, slug })
    }
  }
  return params
}

/**
 * Given any slug (descriptive or canonical), returns the canonical registry key.
 * Used by guide pages to compute the alternate-locale URL.
 *
 * resolveCanonicalSlug('oaxaca-guia-esencial') → 'oaxaca'
 * resolveCanonicalSlug('oaxaca')               → 'oaxaca'
 */
export function resolveCanonicalSlug(slug: string): string {
  return SLUG_ALIASES[slug] ?? slug
}

/**
 * Returns every FlatGuide for the given locale, each tagged with its canonical
 * registry key (e.g. 'cancun', 'oaxaca'). Falls back to 'es' when the locale
 * is missing for a given guide.
 *
 * Used by the Hotels index to enumerate all curated hotels + their affiliate
 * booking URLs, which only exist on the FlatGuide data source.
 */
export function getAllFlatGuides(locale: string): Array<{ canonical: string; flat: FlatGuide }> {
  const out: Array<{ canonical: string; flat: FlatGuide }> = []
  for (const [canonical, entry] of Object.entries(FLAT_REGISTRY)) {
    const flat = entry[locale] ?? entry['es']
    if (flat) out.push({ canonical, flat })
  }
  return out
}

export type { GuidePageData }
