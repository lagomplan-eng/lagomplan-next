/**
 * lib/guide-slugs.ts
 *
 * Single source of truth for guide URL slugs. Deliberately dependency-free
 * (no guide content imports) so middleware.ts can use it without bundling
 * every guide into the edge runtime.
 *
 * Three concepts:
 *   - registry key       canonical internal id, e.g. 'oaxaca', 'roma'
 *   - public slug        what the URL shows per locale. Equal to the key except
 *                        for LOCALE_SLUGS (roma/rome, mauricio/mauritius)
 *   - alias              any other spelling that resolves to a key (legacy
 *                        descriptive slugs, cross-locale spellings). Aliases are
 *                        NEVER served: middleware 301s them to the public slug,
 *                        and they never appear in the sitemap.
 */

// Descriptive legacy slugs (from lib/guides.ts) → registry key.
// Add a line here whenever a guide gets a new descriptive URL slug.
export const SLUG_ALIASES: Record<string, string> = {
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

// Guides whose public slug genuinely differs per locale. 'roma' / 'mauricio'
// are the registry keys; the EN spelling is a real slug, not an alias.
export const LOCALE_SLUGS: Record<string, { es: string; en: string }> = {
  roma:     { es: 'roma',     en: 'rome' },
  mauricio: { es: 'mauricio', en: 'mauritius' },
}

// EN spellings that resolve to a key (so lookups by the real EN slug work).
const LOCALE_SLUG_TO_KEY: Record<string, string> = {
  rome: 'roma',
  mauritius: 'mauricio',
}

export function resolveGuideKey(slug: string): string {
  return SLUG_ALIASES[slug] ?? LOCALE_SLUG_TO_KEY[slug] ?? slug
}

/** The one public slug for a registry key in a locale. */
export function getPublicGuideSlug(key: string, locale: string): string {
  const override = LOCALE_SLUGS[key]
  return override ? override[locale === 'en' ? 'en' : 'es'] : key
}

/**
 * If `slug` is not the public slug for this locale, returns the slug to 301
 * to; otherwise null. Only acts on slugs we know (aliases and locale-slug
 * spellings) — unknown slugs fall through to the page's 404.
 *
 *   ('es','oaxaca-guia-esencial') → 'oaxaca'
 *   ('en','oaxaca-essential-guide') → 'oaxaca'
 *   ('en','roma') → 'rome'      ('es','rome') → 'roma'
 */
export function getGuideRedirectSlug(locale: string, slug: string): string | null {
  const known = slug in SLUG_ALIASES || slug in LOCALE_SLUG_TO_KEY || slug in LOCALE_SLUGS
  if (!known) return null
  const target = getPublicGuideSlug(resolveGuideKey(slug), locale)
  return target === slug ? null : target
}
