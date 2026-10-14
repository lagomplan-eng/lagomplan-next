/**
 * app/puente-noviembre/layout.tsx
 *
 * Standalone root layout for the "puente de noviembre" landing. Lives OUTSIDE
 * app/[locale]; mirrors app/checklist-viajar-con-bebe/layout.tsx (brand
 * fonts, GA4 Consent Mode v2 defaults, ConsentSync + page_view tracker).
 * Spanish-only, no site Nav/Footer.
 */

import type { Metadata } from 'next'
import Script from 'next/script'
import { Manrope, Fraunces, DM_Mono } from 'next/font/google'
import { BASE_URL } from '../../lib/seo'
import ConsentSync from '../../components/analytics/ConsentSync'
import { GoogleAnalyticsTracker } from '../../components/analytics/GoogleAnalyticsTracker'
import AttributionCapture from '../../components/analytics/AttributionCapture'
import '../globals.css'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

const manrope = Manrope({
  subsets: ['latin'], variable: '--font-sans', display: 'swap', weight: ['400', '500', '700'],
})
const fraunces = Fraunces({
  subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600'], style: ['normal', 'italic'],
})
const dmMono = DM_Mono({
  subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400'],
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function PuenteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${fraunces.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Google Analytics 4 — same Consent Mode v2 defaults as the main
            layout: loads but stays denied until the visitor accepts (shared
            'lagomplan-consent' key), so a guest who consented on the main
            domain is tracked; a brand-new guest stays denied until consent.
            send_page_view:false — <GoogleAnalyticsTracker> fires page_view. */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-puente-noviembre" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  ad_storage:         'denied',
                  ad_user_data:       'denied',
                  ad_personalization: 'denied',
                  analytics_storage:  'denied',
                  wait_for_update:    500
                });
                try {
                  if (window.localStorage.getItem('lagomplan-consent') === 'all') {
                    gtag('consent', 'update', { analytics_storage: 'granted' });
                  }
                } catch(e){}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}

        {children}

        <ConsentSync />
        <AttributionCapture />
        <GoogleAnalyticsTracker />
      </body>
    </html>
  )
}
