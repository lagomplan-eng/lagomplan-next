/**
 * lib/analytics/ga-server.ts
 *
 * Server-side GA4 event firing via the Measurement Protocol. Use this
 * when an event needs to land even if the user's browser tab is closed
 * — webhooks, background jobs, server-validated conversions.
 *
 * Browser-side events should keep going through lib/analytics/ga.ts
 * (the gtag wrapper). This module is for server contexts ONLY.
 *
 * Required env:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID  — already set for the browser loader
 *   GA_API_SECRET                  — create in GA4 Admin → Data Streams
 *                                    → Web stream → "Measurement
 *                                    Protocol API secrets" → Create.
 *                                    Server-only, never expose to client.
 *
 * Why client_id is required:
 *   GA4 attributes events to a user-session via `client_id` — normally
 *   the `_ga` cookie value the browser sets. If we fire from the server
 *   with a NEW client_id, GA treats it as a brand new visitor with no
 *   prior session context — session-level attribution is lost.
 *
 *   So we capture the `_ga` client_id during browser-initiated actions
 *   (e.g. checkout creation in app/api/checkout/route.ts reads the
 *   cookie, extracts the client_id, and passes it forward in Stripe
 *   session metadata). The webhook handler retrieves it from metadata
 *   and uses it here — session attribution survives the round-trip.
 *
 *   When no client_id is available (e.g. user was Essential-only and
 *   `_ga` cookie was never set), the helper returns early without
 *   firing — Essential-only users haven't consented to analytics_storage,
 *   so we mustn't synthesize a phantom client_id for them.
 */

interface GAServerEventParams {
  /** GA client_id captured from the browser's `_ga` cookie (format: `<first>.<second>`). */
  clientId: string | null | undefined
  /** Authenticated user_id when available — improves cross-device attribution. */
  userId?:  string | null
  /** Event name (e.g. 'purchase'). Same vocabulary as gaTrack. */
  name:     string
  /** Event parameters (transaction_id, value, currency, …). */
  params?:  Record<string, string | number | boolean | undefined>
}

/**
 * Fire one event to GA4 via the Measurement Protocol. Returns true if
 * the request was sent (200 OK from Google) or false on any error or
 * skip — callers should not block on the result.
 *
 * Silent fail-safe: a missing api_secret, a missing client_id, or a
 * 4xx/5xx from Google all return false without throwing. The webhook
 * (and any other caller) should never have its primary path broken
 * because analytics couldn't be delivered.
 */
export async function gaServerEvent(p: GAServerEventParams): Promise<boolean> {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const apiSecret     = process.env.GA_API_SECRET

  if (!measurementId || !apiSecret) {
    console.warn('[ga-server] skipping: NEXT_PUBLIC_GA_MEASUREMENT_ID or GA_API_SECRET missing')
    return false
  }

  if (!p.clientId) {
    // Essential-only users (or any pre-consent browser) didn't set the
    // _ga cookie, so we have no anchor to attribute the event to. Don't
    // fabricate one — that creates phantom users with no traffic source
    // and skews "new user" metrics permanently.
    console.log('[ga-server] skipping: no client_id (likely essential-only consent)')
    return false
  }

  // Strip undefined values — GA's collect endpoint rejects them.
  const cleanParams: Record<string, string | number | boolean> = {}
  if (p.params) {
    for (const [k, v] of Object.entries(p.params)) {
      if (v !== undefined) cleanParams[k] = v
    }
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`
  const body = {
    client_id: p.clientId,
    ...(p.userId ? { user_id: p.userId } : {}),
    events: [{ name: p.name, params: cleanParams }],
  }

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[ga-server] mp/collect returned ${res.status}: ${text.slice(0, 200)}`)
      return false
    }
    return true
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[ga-server] fetch failed:', msg)
    return false
  }
}

/**
 * Extracts the GA client_id from a `_ga` cookie value. Returns null
 * when the cookie is absent or malformed.
 *
 * Cookie format: `GA1.1.<part1>.<part2>` or `GA1.2.<part1>.<part2>`.
 * The client_id is the last two dot-separated segments joined: `<part1>.<part2>`.
 */
export function parseGaClientId(gaCookieValue: string | null | undefined): string | null {
  if (!gaCookieValue) return null
  const segments = gaCookieValue.split('.')
  if (segments.length < 4) return null
  return `${segments[segments.length - 2]}.${segments[segments.length - 1]}`
}
