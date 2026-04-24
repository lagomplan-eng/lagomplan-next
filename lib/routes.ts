/**
 * lib/routes.ts
 * Single source of truth for every public URL in Lagomplan.
 *
 * RULES
 * ──────────────────────────────────────────────────────────
 * 1. No raw href strings anywhere in the codebase.
 *    Components call helpers here or use Link from lib/navigation.ts.
 * 2. Every public page has an entry in ROUTE_MAP.
 * 3. Entity pages always receive both slug_es + slug_en.
 * 4. The locale prefix (/es/ or /en/) is always explicit — no `as-needed`.
 */

import type { Locale } from '../i18n'

// ── Route map ─────────────────────────────────────────────
// Values are the path segment AFTER the locale prefix.
// Empty string "" = root of that locale (e.g. /es/ or /en/).

export const ROUTE_MAP = {
  home:               { es: '',                  en: ''              },
  guidesIndex:        { es: 'guias',             en: 'guides'        },
  guideDetail:        { es: 'guias',             en: 'guides'        },
  destinationsIndex:  { es: 'destinos',          en: 'destinations'  },
  destinationDetail:  { es: 'destinos',          en: 'destinations'  },
  hotelsIndex:        { es: 'hoteles',           en: 'hotels'        },
  hotelDetail:        { es: 'hoteles',           en: 'hotels'        },
  planner:            { es: 'planificador',      en: 'planner'       },
  smartFindsIndex:    { es: 'productos-viaje',   en: 'smart-finds'   },
  smartFindDetail:    { es: 'productos-viaje',   en: 'smart-finds'   },
  about:              { es: 'nosotras',          en: 'about'         },
  contact:            { es: 'contacto',          en: 'contact'       },
  myTrips:            { es: 'mis-viajes',        en: 'my-trips'      },
  account:            { es: 'cuenta',            en: 'account'       },
  signup:             { es: 'crear-cuenta',      en: 'signup'        },
  login:              { es: 'login',             en: 'login'         },
  privacy:            { es: 'privacidad',        en: 'privacy'       },
  terms:              { es: 'terminos',          en: 'terms'         },
  worldcupIndex:      { es: 'mundial',           en: 'worldcup'      },
  worldcupDetail:     { es: 'mundial',           en: 'worldcup'      },
} as const

export type RouteKey = keyof typeof ROUTE_MAP

// ── Localized entity shape ────────────────────────────────
// All CMS entities (guides, destinations, hotels, smart-finds)
// must carry both locale slugs and can carry localized fields.
export interface LocalizedEntity {
  slug_es: string
  slug_en: string
  [key: string]: unknown
}

// ── Core helpers ─────────────────────────────────────────

/**
 * Returns the full absolute path for a given locale + route key.
 * No entity/slug — use entity helpers for detail pages.
 *
 * getRoute('es', 'planner')       → '/es/planificador'
 * getRoute('en', 'guidesIndex')   → '/en/guides'
 * getRoute('es', 'home')          → '/es'
 */
export function getRoute(locale: Locale, key: RouteKey): string {
  // Defensive: if a caller passes a key that's not (yet) in ROUTE_MAP, log it
  // and fall back to /<locale> instead of throwing
  // `Cannot read properties of undefined (reading 'es')`.
  const entry = ROUTE_MAP[key] as { es: string; en: string } | undefined
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[routes] Unknown route key: ${String(key)} — falling back to /${locale}`)
    }
    return `/${locale}`
  }
  const segment = entry[locale] ?? entry.en ?? ''
  return segment ? `/${locale}/${segment}` : `/${locale}`
}

/**
 * Returns the localized slug for an entity.
 * getLocalizedSlug(guide, 'es') → guide.slug_es
 */
export function getLocalizedSlug(entity: LocalizedEntity, locale: Locale): string {
  return locale === 'es' ? entity.slug_es : entity.slug_en
}

/**
 * Returns a localized field from an entity.
 * Falls back to base field name if localized version not found.
 *
 * getLocalizedField(guide, 'es', 'title')
 * → guide.title_es ?? guide.title ?? ''
 */
export function getLocalizedField(
  entity: Record<string, unknown>,
  locale: Locale,
  base: string,
): string {
  const localized = entity[`${base}_${locale}`]
  const fallback  = entity[base]
  return String(localized ?? fallback ?? '')
}

/**
 * Finds an entity by its localized slug, regardless of which locale's
 * slug is in the URL. Used in [slug] pages to resolve the entity.
 *
 * resolveEntityBySlug(guides, 'en', 'valley-of-bravo')
 * → guide where guide.slug_en === 'valley-of-bravo'
 */
export function resolveEntityBySlug<T extends LocalizedEntity>(
  items: T[],
  locale: Locale,
  slug: string,
): T | undefined {
  return items.find(item =>
    locale === 'es' ? item.slug_es === slug : item.slug_en === slug,
  )
}

// ── Entity URL builders ───────────────────────────────────

/**
 * getGuideUrl('es', guide)    → '/es/guias/valle-de-bravo'
 * getGuideUrl('en', guide)    → '/en/guides/valley-of-bravo'
 */
export function getGuideUrl(locale: Locale, entity: LocalizedEntity): string {
  const segment = ROUTE_MAP.guideDetail[locale]
  const slug    = getLocalizedSlug(entity, locale)
  return `/${locale}/${segment}/${slug}`
}

/**
 * getDestinationUrl('es', destination) → '/es/destinos/ciudad-de-mexico'
 * getDestinationUrl('en', destination) → '/en/destinations/mexico-city'
 */
export function getDestinationUrl(locale: Locale, entity: LocalizedEntity): string {
  const segment = ROUTE_MAP.destinationDetail[locale]
  const slug    = getLocalizedSlug(entity, locale)
  return `/${locale}/${segment}/${slug}`
}

/**
 * getHotelUrl('es', hotel) → '/es/hoteles/hotel-boutique-oaxaca'
 * getHotelUrl('en', hotel) → '/en/hotels/hotel-boutique-oaxaca-en'
 */
export function getHotelUrl(locale: Locale, entity: LocalizedEntity): string {
  const segment = ROUTE_MAP.hotelDetail[locale]
  const slug    = getLocalizedSlug(entity, locale)
  return `/${locale}/${segment}/${slug}`
}

/**
 * getSmartFindUrl('es', item) → '/es/productos-viaje/mochila-ligera'
 * getSmartFindUrl('en', item) → '/en/smart-finds/lightweight-backpack'
 */
export function getSmartFindUrl(locale: Locale, entity: LocalizedEntity): string {
  const segment = ROUTE_MAP.smartFindDetail[locale]
  const slug    = getLocalizedSlug(entity, locale)
  return `/${locale}/${segment}/${slug}`
}

// ── Language switcher URL ────────────────────────────────

/**
 * Returns the equivalent URL for a page in the target locale.
 * Used by the language switcher in Nav.
 *
 * Simple page:
 *   getSwitchLocaleUrl('en', 'planner')           → '/en/planner'
 *   getSwitchLocaleUrl('es', 'home')              → '/es'
 *
 * Entity detail page:
 *   getSwitchLocaleUrl('en', 'guideDetail', guide) → '/en/guides/slug-en'
 *   getSwitchLocaleUrl('es', 'guideDetail', guide) → '/es/guias/slug-es'
 */
export function getSwitchLocaleUrl(
  targetLocale: Locale,
  routeKey: RouteKey,
  entity?: LocalizedEntity,
): string {
  const segment = ROUTE_MAP[routeKey][targetLocale]

  if (!entity) {
    return segment ? `/${targetLocale}/${segment}` : `/${targetLocale}`
  }

  const slug = getLocalizedSlug(entity, targetLocale)
  return `/${targetLocale}/${segment}/${slug}`
}

// ── Internal path helpers (for next-intl Link/useRouter) ──

/**
 * Maps a RouteKey to the internal Next.js folder path used as
 * the href in <Link> from lib/navigation.ts.
 *
 * internalPath('planner')       → '/planner'
 * internalPath('guidesIndex')   → '/guides'
 * internalPath('home')          → '/'
 *
 * These match the folder names inside app/[locale]/.
 */
export const INTERNAL_PATHS: Record<RouteKey, string> = {
  home:               '/',
  guidesIndex:        '/guides',
  guideDetail:        '/guides/[slug]',
  destinationsIndex:  '/destinations',
  destinationDetail:  '/destinations/[slug]',
  hotelsIndex:        '/hotels',
  hotelDetail:        '/hotels/[slug]',
  planner:            '/planner',
  smartFindsIndex:    '/smart-finds',
  smartFindDetail:    '/smart-finds/[slug]',
  about:              '/about',
  contact:            '/contact',
  myTrips:            '/my-trips',
  account:            '/account',
  signup:             '/signup',
  login:              '/login',
  privacy:            '/privacy',
  terms:              '/terms',
  worldcupIndex:      '/worldcup',
  worldcupDetail:     '/worldcup/[slug]',
}

export function internalPath(key: RouteKey): string {
  return INTERNAL_PATHS[key]
}
