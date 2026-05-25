/**
 * lib/analytics/attribution.ts
 *
 * First-touch attribution capture. The model: a user arrives on
 * Lagomplan once with a known source (UTM tags, referrer, an ad
 * click ID). They may bounce, return weeks later, and convert.
 * Without first-touch capture, GA4's default last-touch attribution
 * credits whatever channel they came back through — usually "direct"
 * or "organic" — and the campaign that actually drove the user
 * appears to have zero ROI.
 *
 * What we capture (on first arrival only — never overwritten):
 *   - utm_source / utm_medium / utm_campaign / utm_term / utm_content
 *   - gclid (Google Ads click ID — needed to match Google Ads to GA conversions)
 *   - fbclid (Meta click ID — same role for Meta Ads)
 *   - referrer (document.referrer at first visit — captures organic traffic source)
 *   - landing_path (path the user first landed on — content attribution)
 *   - captured_at (ISO timestamp)
 *
 * Persistence: localStorage with no TTL. Cleared if the user does a
 * full localStorage wipe (browser settings, clear-site-data). A 90-day
 * cookie would be more conventional but localStorage is consent-neutral
 * (it's first-party storage of the user's own URL params, not a
 * tracking cookie — same legal footing as the consent banner's
 * `lagomplan-consent` key).
 *
 * Reading: getFirstTouch() returns the stored record or null. The
 * AttributionCapture client component sets these as gtag
 * user_properties on every page load, so the values flow with every
 * subsequent GA event automatically — including events that fire
 * weeks after the original visit.
 */

export interface FirstTouch {
  utm_source?:   string
  utm_medium?:   string
  utm_campaign?: string
  utm_term?:     string
  utm_content?:  string
  gclid?:        string
  fbclid?:       string
  referrer?:     string
  landing_path?: string
  captured_at:   string
}

const STORAGE_KEY = 'lagomplan-first-touch'

// All known acquisition params, in the order we read them from the URL.
const PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const

/**
 * Reads stored first-touch data. Returns null when nothing has been
 * captured yet OR when localStorage is unavailable (private mode).
 */
export function getFirstTouch(): FirstTouch | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as FirstTouch
    // Defensive: minimal shape check.
    if (parsed && typeof parsed === 'object' && typeof parsed.captured_at === 'string') {
      return parsed
    }
  } catch {
    // Malformed JSON or storage denied — treat as no record.
  }
  return null
}

/**
 * Captures first-touch attribution IF nothing is stored yet. No-op
 * when a record already exists — that's the "first-touch" contract.
 *
 * Returns the resulting record (newly captured OR pre-existing) for
 * convenience; returns null only when nothing meaningful was found
 * AND nothing was stored before.
 *
 * Captures even when ZERO utm/gclid/fbclid params are present — the
 * landing_path + referrer alone are useful for organic/direct
 * attribution. The only case we DON'T capture is direct/no-referrer
 * landings on the root path, which carry zero attribution signal.
 */
export function captureFirstTouch(): FirstTouch | null {
  if (typeof window === 'undefined') return null

  const existing = getFirstTouch()
  if (existing) return existing

  const url = new URL(window.location.href)
  const captured: FirstTouch = { captured_at: new Date().toISOString() }

  for (const key of PARAM_KEYS) {
    const value = url.searchParams.get(key)
    if (value) (captured as unknown as Record<string, string>)[key] = value.slice(0, 200)
  }

  // document.referrer is empty for direct visits, type-ins, bookmarks,
  // and most cross-origin link clicks where the referrer is stripped
  // by browser policy. When non-empty it's the previous page's URL.
  if (document.referrer) {
    try {
      const refUrl = new URL(document.referrer)
      // Skip self-referrals — they happen on internal navigations that
      // somehow trigger first-touch capture (race conditions), and
      // attributing the user to themselves is meaningless.
      if (refUrl.origin !== window.location.origin) {
        captured.referrer = document.referrer.slice(0, 500)
      }
    } catch {
      // Malformed referrer URL — keep raw value, truncated.
      captured.referrer = document.referrer.slice(0, 500)
    }
  }

  captured.landing_path = url.pathname.slice(0, 200)

  // Skip storing when the record carries zero signal beyond the
  // landing_path on the root. Reduces noise from direct-to-homepage
  // bookmarks reloading repeatedly.
  const hasSignal =
    PARAM_KEYS.some(k => (captured as unknown as Record<string, string>)[k]) ||
    captured.referrer ||
    captured.landing_path !== '/'
  if (!hasSignal) return null

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(captured))
  } catch {
    // Storage denied — return the captured record anyway so the caller
    // can still set user_properties for this session.
  }
  return captured
}
