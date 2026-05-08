/**
 * lib/analytics/meta.ts
 *
 * Typed wrapper around Meta's Pixel global (`window.fbq`).
 *
 * The base loader + `init` + first PageView are emitted by the inline
 * <Script> in app/[locale]/layout.tsx. After that, every event goes
 * through this module. Two reasons to centralize:
 *
 *   1. Call sites stay declarative — `metaTrack('Lead', { value: 199 })`
 *      not `(window as any).fbq(...)`. TypeScript catches typos.
 *   2. If we ever swap to a different vendor or add Conversions API
 *      mirroring, only this file changes.
 *
 * All functions are no-ops when:
 *   - executed during SSR (`window` undefined)
 *   - the loader hasn't initialized yet (`fbq` not present)
 *   - the env var is unset (loader never runs)
 *
 * Standard event reference:
 *   https://developers.facebook.com/docs/meta-pixel/reference#events
 */

declare global {
  interface Window {
    fbq?:  (command: string, ...args: unknown[]) => void
    _fbq?: unknown
  }
}

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

/** True when the Pixel is configured for this build. */
export const isMetaEnabled = !!META_PIXEL_ID

/**
 * Standard Meta event names. Mapping from common Lagomplan actions:
 *   ViewContent          — guide / itinerary / pricing page view
 *   Search               — planner form submission
 *   Lead                 — newsletter signup, signup form complete
 *   InitiateCheckout     — Stripe checkout session created
 *   CompleteRegistration — auth signup completed
 *   Purchase             — Stripe webhook fulfillment (server-side later via CAPI)
 *   Contact              — contact form submission
 */
export type MetaStandardEvent =
  | 'ViewContent'
  | 'Search'
  | 'Lead'
  | 'InitiateCheckout'
  | 'CompleteRegistration'
  | 'Purchase'
  | 'Contact'
  | 'AddToCart'
  | 'AddPaymentInfo'
  | 'Subscribe'

/**
 * Fire one of Meta's standard events with optional parameters.
 *
 * Param type is `object` rather than `Record<string, unknown>` so
 * call-site interfaces with optional fields — e.g. `{ value?: number }`
 * — are assignable without a cast. TS treats those interfaces as
 * missing the implicit index signature that `Record<string, unknown>`
 * requires under strict mode.
 */
export function metaTrack(
  event:  MetaStandardEvent,
  params?: object,
): void {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  if (params && Object.keys(params).length > 0) {
    window.fbq('track', event, params)
  } else {
    window.fbq('track', event)
  }
}

/** Fire a custom event (anything not in MetaStandardEvent). */
export function metaTrackCustom(
  event:  string,
  params?: object,
): void {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  if (params && Object.keys(params).length > 0) {
    window.fbq('trackCustom', event, params)
  } else {
    window.fbq('trackCustom', event)
  }
}

/**
 * Fire a manual PageView. The `<MetaPixelTracker>` calls this on every
 * App Router route change. The first PageView for the initial page load
 * is emitted by the inline base script in layout.tsx, so the tracker
 * skips its first effect run to avoid duplication.
 */
export function metaPageView(): void {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  window.fbq('track', 'PageView')
}
