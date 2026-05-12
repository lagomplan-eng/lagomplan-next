/**
 * lib/affiliate/build.ts
 *
 * Builds canonical Stay22 Allez URLs for the planner's hotel + activity CTAs.
 *
 * Why the canonical Allez form (not a subdomain shortlink):
 *   The previously-used `booking.stay22.com/lagomplan/{slug}` shortlinks have
 *   their destination baked into the slug at link-creation time — Stay22
 *   forwards appended `address=` params but the underlying provider URL still
 *   resolves to the slug's hardcoded city. The canonical form documented at
 *     https://community.stay22.com/allez-deep-links-everything-you-need-to-know
 *   accepts `address`, `checkin`, `checkout` etc. at request time and is
 *   the correct surface for runtime trip data.
 *
 *   Verified by redirect-chain tracing on 2026-05-07:
 *     - booking.stay22.com/lagomplan/tupscQswKK → DoubleTree Guadalajara (any city in)
 *     - hotelscom.stay22.com/lagomplan/ulAbEA6Vbn → hotels.com homepage
 *     - getyourguide.stay22.com/lagomplan/vP_T4j_a5L → getyourguide.com homepage
 *     - expedia.stay22.com/lagomplan/B03L4axuky → expedia.com homepage
 *
 * The function is intentionally pure / synchronous: it can run server- or
 * client-side and never throws on user input. On invalid inputs it degrades
 * gracefully (drops dates rather than emitting a malformed link).
 */

import { PROVIDERS, type ProviderId } from './providers'

const BASE = 'https://www.stay22.com/allez'
const AID  = 'lagomplan'   // Stay22 publisher ID. Public; safe to embed client-side.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export interface AffiliateLinkContext {
  /** User-facing destination (free-form text). Required for SRP routing. */
  city:      string
  /** YYYY-MM-DD. Both must be set + valid + checkout > checkin or both are dropped. */
  startDate?: string
  endDate?:   string
  /** Forwarded as `adults`. Stay22 maps to provider-specific group size. */
  adults?:    number
  /** Drives the default campaign label. */
  locale?:    'es' | 'en'
  /** Where the click originates — used in the campaign label for attribution. */
  surface?:   'planner' | 'guide' | 'worldcup'
  /** Override the auto-generated campaign label. */
  campaign?:  string
}

/**
 * Returns a canonical Stay22 Allez URL for the given provider + context.
 * Never throws; on missing/invalid context it omits the offending param.
 */
export function buildAffiliateLink(
  providerId: ProviderId,
  ctx:        AffiliateLinkContext,
): string {
  const provider = PROVIDERS[providerId]
  // We control the providerId space (TypeScript enforces) so this should
  // never trip in practice. Fall back to a bare base URL rather than throw.
  if (!provider) return BASE

  const params = new URLSearchParams()
  params.set('aid', AID)
  params.set('campaign', ctx.campaign ?? defaultCampaign(ctx))

  const cleanCity = (ctx.city ?? '').trim()
  if (cleanCity.length >= 2) {
    params.set('address', cleanCity)
  }

  if (validDateRange(ctx.startDate, ctx.endDate)) {
    params.set('checkin',  ctx.startDate as string)
    params.set('checkout', ctx.endDate   as string)
  }

  if (typeof ctx.adults === 'number' && ctx.adults >= 1 && ctx.adults <= 30) {
    params.set('adults', String(Math.floor(ctx.adults)))
  }

  return `${BASE}/${provider.allezSlug}?${params.toString()}`
}

/**
 * `lagomplan-{surface}-{locale}`. Falls back if surface/locale missing so
 * we always emit *something* attributable in Stay22 reports.
 */
function defaultCampaign(ctx: AffiliateLinkContext): string {
  const surface = ctx.surface ?? 'planner'
  const locale  = ctx.locale  ?? 'es'
  return `lagomplan-${surface}-${locale}`
}

/**
 * Both dates must be present, parseable as YYYY-MM-DD, and checkout strictly
 * after checkin (Booking rejects same-day stays with a generic error). Any
 * failure → drop both dates so the link still works as a destination-only SRP.
 */
function validDateRange(start?: string, end?: string): boolean {
  if (!start || !end) return false
  if (!DATE_RE.test(start) || !DATE_RE.test(end)) return false
  // Compare as strings — YYYY-MM-DD is lex-sortable.
  return start < end
}
