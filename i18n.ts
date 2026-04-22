/**
 * i18n.ts — next-intl configuration.
 * Exports locales, defaultLocale, pathnames, getRequestConfig.
 * buildAlternates / buildCanonical moved to lib/seo.ts.
 */

import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
}

export const localeConfig: Record<
  Locale,
  { dateLocale: string; currency: string; currencyLocale: string }
> = {
  es: { dateLocale: 'es-MX', currency: 'MXN', currencyLocale: 'es-MX' },
  en: { dateLocale: 'en-US', currency: 'MXN', currencyLocale: 'en-US' },
}

// Keys = internal folder paths (app/[locale]/<key>/)
// Values = localized external segments per locale
export const pathnames = {
  '/': '/',
  '/planner': { es: '/planificador', en: '/planner' },
  '/guides': { es: '/guias', en: '/guides' },
  '/guides/[slug]': { es: '/guias/[slug]', en: '/guides/[slug]' },
  '/destinations': { es: '/destinos', en: '/destinations' },
  '/destinations/[slug]': { es: '/destinos/[slug]', en: '/destinations/[slug]' },
  '/hotels': { es: '/hoteles', en: '/hotels' },
  '/hotels/[slug]': { es: '/hoteles/[slug]', en: '/hotels/[slug]' },
  '/smart-finds': { es: '/productos-viaje', en: '/smart-finds' },
  '/smart-finds/[slug]': { es: '/productos-viaje/[slug]', en: '/smart-finds/[slug]' },
  '/about': { es: '/nosotras', en: '/about' },
  '/contact': { es: '/contacto', en: '/contact' },
  '/my-trips': { es: '/mis-viajes', en: '/my-trips' },
  '/account': { es: '/cuenta', en: '/account' },
  '/signup': { es: '/crear-cuenta', en: '/signup' },
  '/login': '/login',
  '/privacy': { es: '/privacidad', en: '/privacy' },
  '/terms':   { es: '/terminos',   en: '/terms'   },
  '/cookies': '/cookies',
  '/worldcup':        { es: '/mundial',         en: '/worldcup'         },
  '/worldcup/[slug]': { es: '/mundial/[slug]',  en: '/worldcup/[slug]'  },
} as const

export type AppPathnames = typeof pathnames

export default getRequestConfig(async (request) => {
  const locale = await request.requestLocale

  // if (!locale || !locales.includes(locale as Locale)) notFound()

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})