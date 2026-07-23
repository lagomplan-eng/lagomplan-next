// lib/attribution/ref-source.ts
//
// Partner referral attribution ("which partner guide sent this trip").
// The co-branded guest guide (/guia/[partner]) drops a first-party
// `lagom_ref` cookie = "host:<slug>". Trip-creation routes read it
// server-side and stamp `trips.ref_source`, so partner reporting/payouts
// can query it directly (WHERE ref_source = 'host:lupito').
//
// Server-side capture (cookie) is deliberate: it's a single choke point per
// route, so it can't drift as new client-side "create trip" paths are added.

/** Cookie + trip-column name for the partner referral stamp. */
export const REF_COOKIE = 'lagom_ref'

// Bounded, lowercase "host:<slug>" only. Anything else → null, so an arbitrary
// cookie value can't inject junk into the trips table or reporting.
const REF_PATTERN = /^host:[a-z0-9][a-z0-9_-]{0,39}$/

/**
 * Validate a raw referral value (from the cookie). Returns the normalized
 * value, or null when absent/malformed. Never throws.
 */
export function sanitizeRefSource(raw: string | undefined | null): string | null {
  if (!raw) return null
  const v = raw.trim().toLowerCase()
  return REF_PATTERN.test(v) ? v : null
}
