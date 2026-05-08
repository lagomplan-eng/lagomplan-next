/**
 * lib/affiliate/index.ts
 *
 * Single public surface for the affiliate layer.
 *
 * Two distinct call paths share this module:
 *
 *   • Planner (AI-generated trips): `buildAffiliateLink(provider, ctx)`
 *     returns a canonical Stay22 Allez URL with destination + dates +
 *     occupancy resolved at request time. See `./build.ts` for the
 *     redirect-chain audit that prompted the original rewrite.
 *
 *   • Curated guides: `withRef(url)` appends a `ref=lagomplan` query
 *     param to the per-hotel Stay22 URLs that ship pre-resolved in the
 *     guide data. Those URLs already carry their own `aid` + `address`
 *     baked in via Stay22's dashboard (`lmaID`), so they don't need
 *     buildAffiliateLink's runtime composition.
 *
 * Note on module resolution:
 *
 *   Earlier the project had both `lib/affiliate.ts` (hosting `withRef`)
 *   and `lib/affiliate/` (the new directory). Node's resolver prefers
 *   the file over the directory of the same name, so `import … from
 *   './affiliate'` from `lib/booking.ts` was silently picking the
 *   legacy file and missing `buildAffiliateLink`. Consolidating both
 *   exports here removes that ambiguity once and for all.
 */

// ── Planner-side runtime link builder ──────────────────────────────────────────
export { buildAffiliateLink } from './build'
export type { AffiliateLinkContext } from './build'
export { PROVIDERS } from './providers'
export type { ProviderId, ProviderConfig, ProviderCategory } from './providers'

// ── Guide-side passthrough used by HotelsSection / ExperiencesSection ──────────
const REF_ID = 'lagomplan'

/**
 * Append `ref=lagomplan` to outbound booking/experience URLs that
 * already carry their own affiliate identifiers (Stay22 `aid`,
 * GetYourGuide `partner_id`, etc.). The `ref` value is a Lagomplan-side
 * tag we keep for our own funnel attribution; downstream providers
 * ignore unknown query parameters.
 */
export function withRef(url: string | undefined): string {
  if (!url) return '#'
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}ref=${REF_ID}`
}
