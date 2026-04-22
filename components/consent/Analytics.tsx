'use client'

/**
 * components/consent/Analytics.tsx
 *
 * Conditionally loads Google Analytics ONLY after analytics consent is given.
 * Uses next/script with strategy="afterInteractive" so it never fires during
 * SSR or before hydration.
 *
 * isReady guard prevents the scripts from rendering during hydration even if
 * localStorage already has a consent record — there is a tick before React
 * has confirmed the consent state from client storage.
 *
 * Add NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX to your .env.local.
 */

import Script from 'next/script'
import { useConsent } from '../../hooks/useConsent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function Analytics() {
  const { consent, isReady } = useConsent()

  if (!isReady)              return null
  if (!consent?.analytics)   return null
  if (!GA_ID)                return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=Lax;Secure'
          });
        `}
      </Script>
    </>
  )
}
