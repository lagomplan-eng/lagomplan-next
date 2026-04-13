/**
 * middleware.ts
 *
 * localePrefix: 'always' — both locales have explicit prefixes.
 *   /es/planificador  → app/[locale]/planner/page.tsx  (ES)
 *   /en/planner       → app/[locale]/planner/page.tsx  (EN)
 *
 * Old URLs (/guias/slug, /trip-generator) are 301-redirected here
 * so any existing links / Webflow crawls remain valid.
 */

import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale, pathnames } from './i18n'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  pathnames,
})

// Legacy URL redirects (Webflow → Next.js migration)
const LEGACY_REDIRECTS: Record<string, string> = {
  '/guias':           '/es/guias',
  '/hoteles':         '/es/hoteles',
  '/trip-generator':  '/es/planificador',
  '/nosotros':        '/es/nosotras',
  '/nosotras':        '/es/nosotras',
  '/contacto':        '/es/contacto',
  '/mis-viajes':      '/es/mis-viajes',
  '/iniciar-sesion':  '/es/login',
  '/crear-cuenta':    '/es/crear-cuenta',
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 301 legacy redirects — check exact match first, then prefix match for slugs
  if (LEGACY_REDIRECTS[pathname]) {
    return NextResponse.redirect(
      new URL(LEGACY_REDIRECTS[pathname], req.url),
      { status: 301 },
    )
  }

  // Legacy slug pages: /guias/some-slug → /es/guias/some-slug
  if (pathname.startsWith('/guias/')) {
    return NextResponse.redirect(
      new URL(pathname.replace('/guias/', '/es/guias/'), req.url),
      { status: 301 },
    )
  }

  // Hand off to next-intl
  return intlMiddleware(req)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)).*)',
  ],
}
