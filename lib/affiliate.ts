/**
 * lib/affiliate.ts
 *
 * Consent-aware affiliate URL helpers.
 *
 * withAffiliate() — use in server components or data files where consent
 * is not available. Call the result inside <AffiliateLink> which reads
 * consent on the client and conditionally appends tracking params.
 *
 * buildAffiliateUrl() — pure function used by AffiliateLink at render time.
 * Returns a clean URL when marketing consent is absent, a tracked URL when given.
 *
 * Affiliate IDs live here as constants. Replace with real values from
 * your affiliate dashboard before going live.
 */

import type { ConsentState } from './consent'

// ── Affiliate IDs ──────────────────────────────────────────

export const AFFILIATE_IDS = {
  booking:  'YOUR_BOOKING_AID',     // Booking.com affiliate ID
  viator:   'YOUR_VIATOR_PID',      // Viator / TripAdvisor experiences
  agoda:    'YOUR_AGODA_CID',       // Agoda hotels
} as const

export type AffiliateProvider = keyof typeof AFFILIATE_IDS

// ── Param builders per provider ────────────────────────────

const PARAM_BUILDERS: Record<AffiliateProvider, (url: URL) => void> = {
  booking: (url) => {
    url.searchParams.set('aid',   AFFILIATE_IDS.booking)
    url.searchParams.set('label', 'lagomplan')
  },
  viator: (url) => {
    url.searchParams.set('pid',  AFFILIATE_IDS.viator)
    url.searchParams.set('mcid', '42383')
    url.searchParams.set('med',  'api')
  },
  agoda: (url) => {
    url.searchParams.set('cid', AFFILIATE_IDS.agoda)
  },
}

// ── Core helpers ───────────────────────────────────────────

/**
 * Returns a tracked URL if marketing consent is given, otherwise the
 * clean base URL. Safe to call with `consent = null` (no tracking appended).
 *
 * @param base      The canonical destination URL, no tracking params
 * @param provider  Which affiliate network this link belongs to
 * @param consent   Current consent state (null = no consent)
 */
export function buildAffiliateUrl(
  base:     string,
  provider: AffiliateProvider,
  consent:  ConsentState | null,
): string {
  if (!base || base === '#') return '#'
  if (!consent?.marketing)  return base

  try {
    const url = new URL(base)
    PARAM_BUILDERS[provider]?.(url)
    return url.toString()
  } catch {
    return base
  }
}

/**
 * Legacy helper — returns a ref-tagged URL unconditionally.
 * Kept for backward compatibility with existing code.
 * Prefer buildAffiliateUrl + <AffiliateLink> for new code.
 *
 * @deprecated Use buildAffiliateUrl() with consent check instead
 */
export function withRef(url: string | undefined): string {
  if (!url) return '#'
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}ref=lagomplan`
}
