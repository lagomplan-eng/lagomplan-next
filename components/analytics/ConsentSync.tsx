'use client'

/**
 * components/analytics/ConsentSync.tsx
 *
 * The runtime bridge between the cookie banner's stored decision and
 * the analytics scripts. Two jobs:
 *
 *   1. Google Analytics 4 — Consent Mode v2.
 *      The inline GA loader in app/[locale]/layout.tsx queues a default
 *      `gtag('consent', 'default', { analytics_storage: 'denied', … })`
 *      so GA loads but never writes cookies or fires hits until consent
 *      is granted. When consent flips to 'all' (either on mount with a
 *      prior decision, or via the banner), this component calls
 *      `gtag('consent', 'update', { analytics_storage: 'granted' })`
 *      to flip the switch. Re-fires the current page_view since the
 *      initial one was suppressed.
 *
 *   2. Meta Pixel — conditional load.
 *      Meta has no built-in consent mode equivalent; the only way to
 *      stay compliant is to NOT load fbevents.js until consent. This
 *      component renders the Pixel base loader + init + first PageView
 *      as a `<Script>` only when consent === 'all'. Subsequent App
 *      Router navs are tracked by <MetaPixelTracker> as before.
 *
 * Mounted from the root layout; no props.
 */

import Script              from 'next/script'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense }        from 'react'
import { getConsent, onConsentChange } from '../../lib/consent'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const META_PIXEL_ID     = process.env.NEXT_PUBLIC_META_PIXEL_ID

function ConsentSyncInner() {
  const [granted, setGranted] = useState(false)
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  // Mount + subscribe: hydrate from storage immediately, then react to
  // every banner click. The subscribe handler also re-runs the GA
  // consent.update path so a same-session accept flips immediately
  // without a reload.
  useEffect(() => {
    const initial = getConsent() === 'all'
    setGranted(initial)
    return onConsentChange(state => setGranted(state === 'all'))
  }, [])

  // Flip GA Consent Mode + replay page_view when the user accepts.
  // The initial page_view that GoogleAnalyticsTracker fires on first
  // mount was queued under `analytics_storage: denied` and dropped by
  // GA — so we re-fire it here once consent is granted to recover the
  // landing-page hit.
  useEffect(() => {
    if (!granted)                       return
    if (typeof window === 'undefined')  return
    if (typeof window.gtag !== 'function') return
    window.gtag('consent', 'update', {
      analytics_storage:  'granted',
      ad_storage:         'denied',
      ad_user_data:       'denied',
      ad_personalization: 'denied',
    })
    if (GA_MEASUREMENT_ID && pathname) {
      const qs   = searchParams?.toString()
      const path = qs ? `${pathname}?${qs}` : pathname
      window.gtag('event', 'page_view', {
        page_path:     path,
        page_location: window.location.href,
        page_title:    document.title,
        send_to:       GA_MEASUREMENT_ID,
      })
    }
  }, [granted, pathname, searchParams])

  // Meta Pixel — only loads when user has explicitly accepted analytics.
  // Snippet is identical to Meta's standard base code; once mounted,
  // <MetaPixelTracker> takes over for subsequent PageViews.
  if (!granted || !META_PIXEL_ID) return null
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}

export default function ConsentSync() {
  // useSearchParams() opts the subtree into client rendering — wrap in
  // Suspense so Next doesn't bail on the static prerender.
  return (
    <Suspense fallback={null}>
      <ConsentSyncInner />
    </Suspense>
  )
}
