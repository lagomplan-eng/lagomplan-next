'use client'

/**
 * components/analytics/AttributionCapture.tsx
 *
 * Captures first-touch attribution on every page load and syncs it
 * into GA4 user_properties so subsequent events automatically carry
 * the original acquisition signal — even for purchases that happen
 * weeks after the initial visit.
 *
 * Mount order matters: this component must mount BEFORE any event
 * fires so the user_properties land on the first page_view. Sits
 * alongside ConsentSync / AuthEventsBridge inside the providers.
 *
 * Consent posture: gtag('set', 'user_properties', …) respects Consent
 * Mode v2 just like every other gtag call — if the user hasn't
 * accepted analytics_storage, the call is queued and dropped. When
 * they accept later, ConsentSync triggers a fresh page_view and the
 * user_properties go with it. No special consent gating needed here.
 */

import { useEffect } from 'react'
import { captureFirstTouch, type FirstTouch } from '../../lib/analytics/attribution'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function AttributionCapture() {
  useEffect(() => {
    // 1. Capture on first arrival; idempotent on subsequent visits
    //    (returns the pre-existing record unchanged).
    const firstTouch = captureFirstTouch()
    if (!firstTouch) return
    if (typeof window === 'undefined') return
    if (typeof window.gtag !== 'function') return
    if (!GA_MEASUREMENT_ID) return

    // 2. Sync into GA user_properties. These persist server-side per
    //    user (or per gtag client_id when no user_id is set yet) and
    //    flow with every subsequent event in GA's reports.
    //
    //    GA4 user_property name length limit: 24 chars. Our keys are
    //    safe (utm_source = 10 chars, captured_at = 11, longest is
    //    landing_path at 12) but worth noting if we add more.
    const userProps: Record<string, string> = {}
    const keys: (keyof FirstTouch)[] = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'gclid', 'fbclid', 'referrer', 'landing_path', 'captured_at',
    ]
    for (const k of keys) {
      const v = firstTouch[k]
      // GA4 user_property value length limit: 36 chars. Truncate
      // referrer / landing_path which can blow it (URLs).
      if (typeof v === 'string' && v.length > 0) {
        userProps[k] = v.length > 36 ? v.slice(0, 36) : v
      }
    }
    window.gtag('set', 'user_properties', userProps)
  }, [])

  return null
}
