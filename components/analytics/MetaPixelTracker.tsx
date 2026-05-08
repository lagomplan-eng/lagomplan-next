'use client'

/**
 * MetaPixelTracker — App Router PageView tracker for Meta Pixel.
 *
 * Meta's recommended snippet (rendered in app/[locale]/layout.tsx) calls
 * `fbq('init', PIXEL_ID); fbq('track', 'PageView')` once on initial load.
 * App Router client navs don't trigger that snippet again, so we have to
 * fire `PageView` ourselves on every URL change.
 *
 * Two correctness rules to avoid duplicate events in Meta Events Manager:
 *
 *   1. Skip the very first effect run — the inline init script already
 *      fired the initial PageView. `useRef` flag, not state, so it
 *      survives re-renders without retriggering.
 *
 *   2. Only fire when `fbq` is actually loaded. The fbevents.js script
 *      is `strategy="afterInteractive"`, so on a slow connection it
 *      may still be downloading when the tracker mounts. Guard the call.
 *
 * Wrapped in <Suspense> because `useSearchParams()` opts the subtree
 * into client-side rendering and Next requires the boundary.
 */

import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { metaPageView } from '../../lib/analytics/meta'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

function PageViewEmitter() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const isFirstRun   = useRef(true)

  useEffect(() => {
    // The base script's `fbq('track', 'PageView')` already covered the
    // initial load. Skip this run; capture every subsequent client nav.
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    metaPageView()
  }, [pathname, searchParams])

  return null
}

export function MetaPixelTracker() {
  if (!META_PIXEL_ID) return null
  return (
    <Suspense fallback={null}>
      <PageViewEmitter />
    </Suspense>
  )
}
