/**
 * lib/analytics/partner-attribution.ts
 *
 * B2B2C partner-distribution attribution. Separate from — and
 * complementary to — lib/analytics/attribution.ts's whole-account
 * FIRST-touch marketing attribution.
 *
 * The distinction matters: FirstTouch answers "what originally brought
 * this browser to Lagomplan, ever" (never overwritten, for marketing
 * ROI). PartnerTouch answers "was this browser most recently referred
 * by a B2B2C partner, and through which channel" — updated every time
 * a fresh partner-tagged URL is seen, so a guest who first found us
 * organically months ago but clicks a partner's guest-guide link today
 * still gets correctly attributed to that partner's funnel.
 *
 * Recognition rule: a URL is a partner touch only when utm_medium is
 * exactly 'partner' AND utm_source is present. Generic marketing UTMs
 * (utm_medium=cpc, email, social, ...) are ignored here — they're
 * FirstTouch's job.
 *
 * Reusable across partners/pilots by construction: partner_id comes
 * from utm_source, pilot_id from utm_campaign, distribution_channel
 * from utm_content. Nothing here is specific to Mexico City or any
 * one partner — the Mexico City pilot is simply the first campaign
 * that populates these fields.
 *
 * Persistence: localStorage, no TTL (same posture as FirstTouch — a
 * first-party record of the user's own URL params, not a tracking
 * cookie). "Last partner touch wins, but only on a fresh signal":
 * navigating the app WITHOUT partner UTMs never erases a previously
 * captured record, so attribution survives landing page → planner →
 * trip generation → trip result → booking click.
 *
 * No PII: partner_id/pilot_id/distribution_channel are business/
 * campaign identifiers (slugs, constants), never traveler data.
 *
 * partner_visit event: fired here (via gaTrack directly, NOT through
 * lib/analytics/events.ts) exactly once per genuinely NEW partner touch
 * — i.e. only when the freshly-parsed partner_id/pilot_id/
 * distribution_channel differ from whatever's already stored. This is
 * the event-scoped, non-sticky source of truth for "Partner Visits" in
 * the pilot dashboard (deliberately NOT relying on the sticky user
 * property set by PartnerAttributionCapture, which persists into later,
 * unrelated organic sessions and is unsuitable as a visit-count source).
 * Fired directly via gaTrack rather than through events.ts to avoid a
 * circular import — events.ts already imports this module for
 * getPartnerAttributionParams().
 */

import { gaTrack } from './ga'

export interface PartnerTouch {
  /** From utm_source — the partner's slug (e.g. 'livin_roma'). */
  partner_id: string
  /** From utm_campaign — the pilot/campaign id (e.g. 'mxcity_pilot'). */
  pilot_id?: string
  /** From utm_content — the distribution mechanism (e.g. 'guest_guide'). */
  distribution_channel?: string
  utm_source: string
  utm_medium: string
  utm_campaign?: string
  utm_content?: string
  captured_at: string
}

/** Subset actually attached to funnel event params — GA4 custom
 *  dimensions per docs/analytics/mxcity-pilot-taxonomy.md. Deliberately
 *  excludes the raw utm_* fields (those already live as FirstTouch
 *  user_properties; repeating them on every event would be redundant). */
export interface PartnerAttributionParams {
  partner_id?: string
  pilot_id?: string
  distribution_channel?: string
}

const STORAGE_KEY = 'lagomplan-partner-touch'

// GA4 user_property value length limit.
const MAX_VALUE_LEN = 36

/**
 * Reads the stored partner touch. Returns null when nothing has been
 * captured yet OR when localStorage is unavailable (private mode).
 */
export function getPartnerTouch(): PartnerTouch | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PartnerTouch
    if (parsed && typeof parsed === 'object' && typeof parsed.partner_id === 'string') {
      return parsed
    }
  } catch {
    // Malformed JSON or storage denied — treat as no record.
  }
  return null
}

/**
 * Inspects the current URL for a partner touch (utm_medium=partner +
 * utm_source). If found AND it's genuinely NEW (its partner_id/pilot_id/
 * distribution_channel differ from whatever's already stored — or
 * nothing was stored yet), captures/overwrites the record and fires
 * `partner_visit` exactly once for this touch. If the URL's values are
 * IDENTICAL to what's already stored — e.g. a re-render or a duplicate
 * effect invocation for the same tagged URL — this is a no-op: no
 * storage write, no event. If the URL carries no partner signal at all,
 * returns whatever was already stored (no-op), so attribution persists
 * across navigation to pages/routes that don't carry UTM params.
 *
 * This dedup-by-value is what keeps partner_visit from firing on every
 * pageview or every re-render of the same partner-tagged URL, while
 * still firing again for a genuinely different touch (e.g. partner A's
 * link, then later partner B's link, in the same browser).
 */
export function capturePartnerTouch(): PartnerTouch | null {
  if (typeof window === 'undefined') return null

  const url = new URL(window.location.href)
  const utm_source = url.searchParams.get('utm_source')
  const utm_medium = url.searchParams.get('utm_medium')

  if (!(utm_medium === 'partner' && utm_source)) {
    // No fresh partner signal on this URL — preserve whatever's stored.
    return getPartnerTouch()
  }

  const previous = getPartnerTouch()

  const captured: PartnerTouch = {
    partner_id: utm_source.slice(0, 60),
    utm_source: utm_source.slice(0, 60),
    utm_medium: utm_medium.slice(0, 60),
    captured_at: new Date().toISOString(),
  }
  const utm_campaign = url.searchParams.get('utm_campaign')
  const utm_content = url.searchParams.get('utm_content')
  if (utm_campaign) {
    captured.pilot_id = utm_campaign.slice(0, 60)
    captured.utm_campaign = utm_campaign.slice(0, 60)
  }
  if (utm_content) {
    captured.distribution_channel = utm_content.slice(0, 60)
    captured.utm_content = utm_content.slice(0, 60)
  }

  const isSameTouch =
    !!previous &&
    previous.partner_id === captured.partner_id &&
    previous.pilot_id === captured.pilot_id &&
    previous.distribution_channel === captured.distribution_channel

  if (isSameTouch) {
    // Same partner/pilot/channel as what's already stored — not a new
    // touch. Leave the original record (and its original captured_at)
    // untouched, and don't re-fire partner_visit.
    return previous
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(captured))
  } catch {
    // Storage denied — still fire the event + return the captured
    // record anyway so the caller can use it for this page load.
  }

  gaTrack('partner_visit', {
    partner_id: captured.partner_id,
    pilot_id: captured.pilot_id,
    distribution_channel: captured.distribution_channel,
    landing_path: url.pathname.slice(0, 200),
  })

  return captured
}

/**
 * Reads the stored partner touch (without re-inspecting the URL) and
 * shapes it into the params merged onto funnel events by
 * lib/analytics/events.ts. Truncated to GA4's user_property value
 * length limit for consistency, even though these are event params
 * (event param values allow more, but consistent truncation keeps the
 * value that also gets set as a user_property in sync).
 */
export function getPartnerAttributionParams(): PartnerAttributionParams {
  const touch = getPartnerTouch()
  if (!touch) return {}
  const params: PartnerAttributionParams = {}
  if (touch.partner_id) params.partner_id = touch.partner_id.slice(0, MAX_VALUE_LEN)
  if (touch.pilot_id) params.pilot_id = touch.pilot_id.slice(0, MAX_VALUE_LEN)
  if (touch.distribution_channel) params.distribution_channel = touch.distribution_channel.slice(0, MAX_VALUE_LEN)
  return params
}
