/**
 * lib/guia/visit.ts
 *
 * Builds the privacy-safe row inserted into guide_visits / demo_visits (see
 * supabase/migrations/20261008000000_guide_demo_visits.sql). Pure: no window,
 * no network. Never stores the raw user agent, an IP, or param VALUES —
 * only which params were present, a device:browser bucket, and an optional
 * regex-restricted ?ref= tag. Every output must satisfy the table CHECKs.
 */

export const VISIT_PARAMS = ['lang', 'llegada', 'noches', 'adultos', 'ninos', 'ref'] as const

export interface VisitRow {
  slug: string
  lang: 'es' | 'en'
  params_present: string[]
  ua_summary: string
  ref: string | null
}

/** ?ref= tag: lowercased, must match ^[a-z0-9_-]{1,32}$ else dropped. */
export function sanitizeRef(raw: string | null): string | null {
  if (raw === null) return null
  const v = raw.trim().toLowerCase()
  return /^[a-z0-9_-]{1,32}$/.test(v) ? v : null
}

/** "device:browser" bucket, e.g. "mobile:safari". Never the raw UA. */
export function summarizeUserAgent(ua: string): string {
  if (!ua) return 'unknown:other'
  if (/bot|crawl|spider|slurp|headless|preview|facebookexternalhit|whatsapp|lighthouse/i.test(ua)) return 'bot:other'
  const device =
    /ipad|tablet/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua)) ? 'tablet'
    : /mobi|iphone|android/i.test(ua) ? 'mobile'
    : 'desktop'
  const browser =
    /edg(e|a|ios)?\//i.test(ua) ? 'edge'
    : /samsungbrowser/i.test(ua) ? 'samsung'
    : /firefox|fxios/i.test(ua) ? 'firefox'
    : /chrome|crios/i.test(ua) ? 'chrome'
    : /safari/i.test(ua) ? 'safari'
    : 'other'
  return `${device}:${browser}`
}

export function buildVisit(slug: string, search: string | URLSearchParams, userAgent: string): VisitRow {
  const p = typeof search === 'string' ? new URLSearchParams(search) : search
  const requested = p.get('lang')
  return {
    slug,
    lang: requested === 'es' ? 'es' : 'en',
    params_present: VISIT_PARAMS.filter((name) => p.has(name)),
    ua_summary: summarizeUserAgent(userAgent),
    ref: sanitizeRef(p.get('ref')),
  }
}
