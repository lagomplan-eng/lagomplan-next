/**
 * lib/affiliate/gyg.ts
 *
 * GetYourGuide direct-link helpers. The ONE place the partner ID lives.
 *
 * Stored links are plain tour URLs: https://www.getyourguide.com/<place>-l<n>/<tour>-t<n>/
 * — no query params and no locale prefix (GYG then serves each visitor's own
 * language). The partner_id and cmp tracking params are added at render time by
 * buildGygBookingUrl; nothing stores them.
 *
 * Pure: no React, no Next, no env. Importable from scripts and tests.
 */

export const GYG_PARTNER_ID = 'X71QPE5'

const GYG_HOST = 'www.getyourguide.com'

/** Leading locale segment GYG puts on its URLs: /es-mx/, /en-gb/, /es-es/, /de/ … */
const LOCALE_PREFIX = /^\/[a-z]{2}(?:-[a-z]{2,4})?(?=\/)/i

/** A tour page ends in -t<number>/ (trailing slash optional). Locations (-l), suppliers (-s) and search (/s/) are not tours. */
const TOUR_PATH = /-t\d+\/?$/

function parse(url: string | null | undefined): URL | null {
  if (!url) return null
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u : null
  } catch {
    return null
  }
}

/** True for a GetYourGuide tour page, with or without a locale prefix or query params. */
export function isGygTourUrl(url: string | null | undefined): boolean {
  const u = parse(url)
  if (!u || u.host.toLowerCase() !== GYG_HOST) return false
  return TOUR_PATH.test(u.pathname.replace(LOCALE_PREFIX, ''))
}

/**
 * The canonical stored form of a GYG tour URL: https, no query, no fragment,
 * no locale prefix. Returns null when the input is not a GYG tour URL.
 */
export function normalizeGygTourUrl(url: string | null | undefined): string | null {
  if (!isGygTourUrl(url)) return null
  const u = parse(url)!
  return `https://${GYG_HOST}${u.pathname.replace(LOCALE_PREFIX, '')}`
}

/**
 * The link a visitor is sent to: the tour URL with any existing query params
 * (and locale prefix) stripped, then partner_id and cmp added. Idempotent, and
 * partner_id is never duplicated whatever the input carried.
 *
 * Only call for GYG tour URLs (see isGygTourUrl). Unparseable input is
 * returned as given rather than throwing in a render path.
 */
export function buildGygBookingUrl(url: string, opts: { cmp: string }): string {
  const u = parse(url)
  if (!u) return url
  const path = u.pathname.replace(LOCALE_PREFIX, '')
  const qs = new URLSearchParams({ partner_id: GYG_PARTNER_ID, cmp: opts.cmp })
  return `https://${u.host}${path}?${qs.toString()}`
}
