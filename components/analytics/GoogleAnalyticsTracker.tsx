'use client'

/**
 * GoogleAnalyticsTracker — App Router page_view tracker for GA4.
 *
 * The base loader in app/[locale]/layout.tsx calls
 *   gtag('config', MEASUREMENT_ID, { send_page_view: false })
 * which means GA4 does NOT auto-fire `page_view` on initial load.
 * This tracker handles all page_views — both the initial render and
 * every subsequent App Router client navigation — via usePathname /
 * useSearchParams.
 *
 * Why disable auto page_view and fire manually?
 *   gtag('config', …) only runs once per page load. App Router client
 *   navs don't re-trigger config, so the auto-fire would only ever
 *   record the first page in a session. Manual firing on every URL
 *   change captures the real virtual-page behavior of the SPA.
 *
 * Wrapped in <Suspense> because useSearchParams() opts the subtree
 * into client-side rendering and Next requires the boundary.
 */

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { gaPageView } from '../../lib/analytics/ga'

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function PageViewEmitter() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const qs   = searchParams?.toString()
    const path = qs ? `${pathname}?${qs}` : pathname
    gaPageView(path)
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalyticsTracker() {
  if (!MEASUREMENT_ID) return null
  return (
    <Suspense fallback={null}>
      <PageViewEmitter />
    </Suspense>
  )
}
