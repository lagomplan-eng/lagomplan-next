/**
 * lib/analytics/ga.ts
 *
 * Typed wrapper around Google Analytics 4's `window.gtag` global.
 *
 * The base loader + `gtag('config', …)` are emitted by the inline
 * <Script> in app/[locale]/layout.tsx. After that, every event goes
 * through this module — same rationale as the Meta wrapper next door.
 *
 * Notes on the App Router fix this enables:
 *
 *   GA4's gtag('config', GA_ID) auto-fires `page_view` once when the
 *   library loads. App Router client navs do NOT re-trigger config, so
 *   subsequent virtual page changes are missed by default. The base
 *   <Script> sends `send_page_view: false` to disable the auto-fire,
 *   and `<GoogleAnalyticsTracker>` fires `page_view` on every URL
 *   change (including the initial load) via usePathname/useSearchParams.
 */

declare global {
  interface Window {
    gtag?:      (command: string, ...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/** True when GA4 is configured for this build. */
export const isGAEnabled = !!MEASUREMENT_ID

/** Fire any GA4 event with optional parameters. */
export function gaTrack(
  event:  string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  if (params && Object.keys(params).length > 0) {
    window.gtag('event', event, params)
  } else {
    window.gtag('event', event)
  }
}

/** Fire a page_view event. Called by the route-change tracker. */
export function gaPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  if (!MEASUREMENT_ID) return
  window.gtag('event', 'page_view', {
    page_path:     path,
    page_location: typeof window !== 'undefined' ? window.location.href : path,
    page_title:    title ?? (typeof document !== 'undefined' ? document.title : ''),
    send_to:       MEASUREMENT_ID,
  })
}
