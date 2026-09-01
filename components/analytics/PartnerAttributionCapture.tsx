'use client'

/**
 * components/analytics/PartnerAttributionCapture.tsx
 *
 * Captures B2B2C partner-distribution touches (see
 * lib/analytics/partner-attribution.ts) on every page load and syncs
 * them into GA4 user_properties, so any event — not just the ones
 * explicitly instrumented with partner params — can be segmented by
 * partner_id / pilot_id / distribution_channel in reporting.
 *
 * Mounted in BOTH app/[locale]/layout.tsx (normal site + planner) and
 * app/guia/layout.tsx (partner guest guide) — a partner journey starts
 * on /guia, so attribution must be captured there too, not just on the
 * marketing site.
 *
 * Consent posture: identical to AttributionCapture — gtag('set',
 * 'user_properties', …) respects Consent Mode v2; queued/dropped until
 * the visitor accepts analytics_storage.
 */

import { useEffect } from 'react'
import { capturePartnerTouch, type PartnerTouch } from '../../lib/analytics/partner-attribution'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function PartnerAttributionCapture() {
  useEffect(() => {
    // Re-checks the URL on every page load, unlike first-touch capture
    // — a fresh partner-tagged URL should always update the stored
    // touch. See capturePartnerTouch()'s doc. Same mount-once-per-load
    // posture as AttributionCapture: client-side route transitions
    // within the same root layout don't remount this, so a UTM change
    // via client-side navigation alone (not a real partner link click,
    // which is always a fresh page load) wouldn't be re-captured.
    const touch = capturePartnerTouch()
    if (!touch) return
    if (typeof window === 'undefined') return
    if (typeof window.gtag !== 'function') return
    if (!GA_MEASUREMENT_ID) return

    const userProps: Record<string, string> = {}
    const keys: (keyof PartnerTouch)[] = ['partner_id', 'pilot_id', 'distribution_channel']
    for (const k of keys) {
      const v = touch[k]
      if (typeof v === 'string' && v.length > 0) {
        userProps[k] = v
      }
    }
    if (Object.keys(userProps).length > 0) {
      window.gtag('set', 'user_properties', userProps)
    }
  }, [])

  return null
}
