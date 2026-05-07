/**
 * lib/affiliate/index.ts
 *
 * Planner affiliate-link surface. Replaces the bare Stay22 shortlinks that
 * were used in `lib/booking.ts` (those are hardcoded to specific cities or
 * homepage redirects — see lib/affiliate/build.ts for the redirect-chain
 * audit that prompted this rewrite).
 *
 * Out of scope: the curated-guide hotel cards in `components/guides/` keep
 * using `withRef()` from `lib/affiliate.ts` because those URLs are
 * pre-resolved per-hotel via Stay22's dashboard (each carries its own
 * `lmaID`) and don't need user dates.
 */

export { buildAffiliateLink } from './build'
export type { AffiliateLinkContext } from './build'
export { PROVIDERS } from './providers'
export type { ProviderId, ProviderConfig, ProviderCategory } from './providers'
