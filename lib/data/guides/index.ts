/**
 * lib/data/guides/index.ts
 *
 * Central registry for the new guide data system.
 * All 14 guides are stored as FlatGuide (docx-sourced) and adapted on lookup.
 *
 * Lookup is O(1) — slug + locale → GuidePageData | null.
 */

import type { FlatGuide, GuidePageData, GuideMeta } from './types'
import { adaptFlatGuide } from './adapter'
import { resolveGuideKey, getPublicGuideSlug, getGuideRedirectSlug } from '../../guide-slugs'

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

// International guides (September 2026 batch)
import { guide as capadociaEs } from './capadocia/es'
import { guide as capadociaEn } from './capadocia/en'
import { guide as kiotoOsakaEs } from './kioto-osaka/es'
import { guide as kiotoOsakaEn } from './kioto-osaka/en'
import { guide as marrakechEs } from './marrakech/es'
import { guide as marrakechEn } from './marrakech/en'
import { guide as chileEnNogadaEs } from './chile-en-nogada/es'
import { guide as chileEnNogadaEn } from './chile-en-nogada/en'

// International guides (October 2026 batch)
import { guide as romaEs } from './roma/es'
import { guide as romaEn } from './roma/en'
import { guide as udaipurEs } from './udaipur/es'
import { guide as udaipurEn } from './udaipur/en'
import { guide as mauricioEs } from './mauricio/es'
import { guide as mauricioEn } from './mauricio/en'
import { guide as hongKongEs } from './hong-kong/es'
import { guide as hongKongEn } from './hong-kong/en'

// Seasonal guide (Day of the Dead 2026)
import { guide as diaDeMuertosCdmxPatzcuaroEs } from './dia-de-muertos-cdmx-patzcuaro/es'
import { guide as diaDeMuertosCdmxPatzcuaroEn } from './dia-de-muertos-cdmx-patzcuaro/en'

// November 2026 batch
import { guide as houstonEs } from './houston/es'
import { guide as houstonEn } from './houston/en'
import { guide as ixtapaZihuatanejoEs } from './ixtapa-zihuatanejo/es'
import { guide as ixtapaZihuatanejoEn } from './ixtapa-zihuatanejo/en'
import { guide as nuevaYorkEs } from './nueva-york/es'
import { guide as nuevaYorkEn } from './nueva-york/en'
import { guide as puntaCanaEs } from './punta-cana/es'
import { guide as puntaCanaEn } from './punta-cana/en'

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
  // International guides (September 2026 batch)
  'capadocia':          { es: capadociaEs,          en: capadociaEn },
  'kioto-osaka':         { es: kiotoOsakaEs,          en: kiotoOsakaEn },
  'marrakech':           { es: marrakechEs,           en: marrakechEn },
  'chile-en-nogada':     { es: chileEnNogadaEs,       en: chileEnNogadaEn },
  // International guides (October 2026 batch)
  'roma':                { es: romaEs,                en: romaEn },
  'udaipur':             { es: udaipurEs,             en: udaipurEn },
  'mauricio':            { es: mauricioEs,            en: mauricioEn },
  'hong-kong':           { es: hongKongEs,            en: hongKongEn },
  // Seasonal guide (Day of the Dead 2026). One shared key for both locales for now (no per-locale slug yet).
  'dia-de-muertos-cdmx-patzcuaro': { es: diaDeMuertosCdmxPatzcuaroEs, en: diaDeMuertosCdmxPatzcuaroEn },
  // November 2026 batch. 'nueva-york' has a real per-locale slug (en: 'new-york', see LOCALE_SLUGS in lib/guide-slugs.ts).
  'houston':             { es: houstonEs,             en: houstonEn },
  'ixtapa-zihuatanejo':  { es: ixtapaZihuatanejoEs,   en: ixtapaZihuatanejoEn },
  'nueva-york':          { es: nuevaYorkEs,           en: nuevaYorkEn },
  'punta-cana':          { es: puntaCanaEs,           en: puntaCanaEn },
}

// <guide-meta:begin> generated by scripts/experiences/apply-review.ts from guides-review.csv
// Region + short names live here, not in the guide files. Keys = registry keys.
export const GUIDE_META: Record<string, GuideMeta> = {
  'cancun': { region: 'mexico', shortName: { es: 'Cancún', en: 'Cancún' } },
  'ciudad-de-mexico': { region: 'mexico', shortName: { es: 'Ciudad de México', en: 'Mexico City' } },
  'cuernavaca': { region: 'mexico', shortName: { es: 'Cuernavaca', en: 'Cuernavaca' } },
  'guadalajara': { region: 'mexico', shortName: { es: 'Guadalajara', en: 'Guadalajara' } },
  'los-cabos': { region: 'mexico', shortName: { es: 'Los Cabos', en: 'Los Cabos' } },
  'merida': { region: 'mexico', shortName: { es: 'Mérida', en: 'Mérida' } },
  'oaxaca': { region: 'mexico', shortName: { es: 'Oaxaca', en: 'Oaxaca' } },
  'puerto-vallarta': { region: 'mexico', shortName: { es: 'Puerto Vallarta', en: 'Puerto Vallarta' } },
  'queretaro': { region: 'mexico', shortName: { es: 'Querétaro', en: 'Querétaro' } },
  'riviera-maya': { region: 'mexico', shortName: { es: 'Riviera Maya', en: 'Riviera Maya' } },
  'san-miguel-de-allende': { region: 'mexico', shortName: { es: 'San Miguel de Allende', en: 'San Miguel de Allende' } },
  'tepoztlan': { region: 'mexico', shortName: { es: 'Tepoztlán', en: 'Tepoztlán' } },
  'tulum': { region: 'mexico', shortName: { es: 'Tulum', en: 'Tulum' } },
  'valle-de-bravo': { region: 'mexico', shortName: { es: 'Valle de Bravo', en: 'Valle de Bravo' } },
  'atacama': { region: 'latam', shortName: { es: 'Atacama', en: 'Atacama' } },
  'cartagena': { region: 'latam', shortName: { es: 'Cartagena', en: 'Cartagena' } },
  'cusco-machu-picchu': { region: 'latam', shortName: { es: 'Cusco y Machu Picchu', en: 'Cusco & Machu Picchu' } },
  'guanacaste': { region: 'latam', shortName: { es: 'Guanacaste', en: 'Guanacaste' } },
  'guatemala': { region: 'latam', shortName: { es: 'Guatemala', en: 'Guatemala' } },
  'norte-de-argentina': { region: 'latam', shortName: { es: 'Norte de Argentina', en: 'Northern Argentina' } },
  'rio-de-janeiro': { region: 'latam', shortName: { es: 'Río de Janeiro', en: 'Rio de Janeiro' } },
  'uruguay': { region: 'latam', shortName: { es: 'Uruguay', en: 'Uruguay' } },
  'azores': { region: 'europa', shortName: { es: 'Azores', en: 'Azores' } },
  'copenhague': { region: 'europa', shortName: { es: 'Copenhague', en: 'Copenhagen' } },
  'pais-vasco': { region: 'europa', shortName: { es: 'País Vasco', en: 'Basque Country' } },
  'albania': { region: 'europa', shortName: { es: 'Albania', en: 'Albania' } },
  'eslovenia': { region: 'europa', shortName: { es: 'Eslovenia', en: 'Slovenia' } },
  'islas-feroe': { region: 'europa', shortName: { es: 'Islas Feroe', en: 'Faroe Islands' } },
  'torres-del-paine': { region: 'latam', shortName: { es: 'Torres del Paine', en: 'Torres del Paine' } },
  'westfjords-islandia': { region: 'europa', shortName: { es: 'Westfjords', en: 'Westfjords' } },
  'ruanda': { region: 'africa', shortName: { es: 'Ruanda', en: 'Rwanda' } },
  'napa-sonoma': { region: 'norteamerica', shortName: { es: 'Napa y Sonoma', en: 'Napa & Sonoma' } },
  'alto-adigio-dolomitas': { region: 'europa', shortName: { es: 'Alto Adigio', en: 'South Tyrol' } },
  'capadocia': { region: 'asia', shortName: { es: 'Capadocia', en: 'Cappadocia' } },
  'kioto-osaka': { region: 'asia', shortName: { es: 'Kioto y Osaka', en: 'Kyoto & Osaka' } },
  'marrakech': { region: 'africa', shortName: { es: 'Marrakech', en: 'Marrakech' } },
  'chile-en-nogada': { region: 'mexico', shortName: { es: 'Puebla', en: 'Puebla' } },
  'roma': { region: 'europa', shortName: { es: 'Roma', en: 'Rome' } },
  'udaipur': { region: 'asia', shortName: { es: 'Udaipur', en: 'Udaipur' } },
  'mauricio': { region: 'africa', shortName: { es: 'Mauricio', en: 'Mauritius' } },
  'hong-kong': { region: 'asia', shortName: { es: 'Hong Kong', en: 'Hong Kong' } },
  'dia-de-muertos-cdmx-patzcuaro': { region: 'mexico', shortName: { es: 'Día de Muertos', en: 'Day of the Dead' }, hubWindow: { from: '09-15', until: '11-02' } },
  'houston': { region: 'norteamerica', shortName: { es: 'Houston', en: 'Houston' } },
  'ixtapa-zihuatanejo': { region: 'mexico', shortName: { es: 'Ixtapa-Zihuatanejo', en: 'Ixtapa-Zihuatanejo' } },
  'nueva-york': { region: 'norteamerica', shortName: { es: 'Nueva York', en: 'New York' } },
  'punta-cana': { region: 'latam', shortName: { es: 'Punta Cana', en: 'Punta Cana' } },
}
// <guide-meta:end>

// ── Public helpers ─────────────────────────────────────────────────────────────

/**
 * Returns guide data for a given slug + locale, or null if not found.
 * Accepts both canonical short slugs and locale-specific descriptive slugs
 * (via resolveGuideKey in lib/guide-slugs.ts). Falls back to 'es' if the requested locale is missing.
 */
export function getGuidePageData(slug: string, locale: string): GuidePageData | null {
  const key = resolveGuideKey(slug)
  const entry = FLAT_REGISTRY[key]
  if (!entry) return null
  const flat = entry[locale] ?? entry['es'] ?? null
  if (!flat) return null
  return adaptFlatGuide(flat)
}

/**
 * Returns all { locale, slug } pairs for generateStaticParams() and the
 * sitemap. `slug` is the PUBLIC per-locale slug (roma/rome, mauricio/mauritius,
 * otherwise the registry key) — never an alias, since aliases 301 away.
 */
export function getNewGuideParams(): Array<{ locale: string; slug: string }> {
  const params: Array<{ locale: string; slug: string }> = []
  for (const key of Object.keys(FLAT_REGISTRY)) {
    for (const locale of Object.keys(FLAT_REGISTRY[key])) {
      params.push({ locale, slug: getPublicGuideSlug(key, locale) })
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
  return resolveGuideKey(slug)
}

/**
 * Which locales have real content for a given canonical guide key, e.g.
 * getGuideLocales('capadocia') → ['es', 'en'].
 *
 * Used by generateMetadata to build hreflang alternates without inventing
 * a URL for a locale that doesn't actually have an entry — every guide
 * today happens to have both, but this stays correct if that ever changes
 * rather than silently assuming 'en' always exists.
 */
export function getGuideLocales(canonicalKey: string): string[] {
  const entry = FLAT_REGISTRY[canonicalKey]
  return entry ? Object.keys(entry) : []
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

export { getPublicGuideSlug, getGuideRedirectSlug }
export type { GuidePageData }
