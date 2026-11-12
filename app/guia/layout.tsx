/**
 * app/guia/layout.tsx
 *
 * Standalone root layout for the co-branded guest guide (/guia/[partner]).
 *
 * This route lives OUTSIDE app/[locale], so it is its own root layout — it
 * supplies <html>/<body> and the brand fonts, independent of the localized
 * marketing site. Deliberately minimal: no site Nav/Footer (white-label
 * guest page), no Supabase/Plan providers. It reuses the existing GA4 setup
 * (same Consent Mode v2 posture and shared 'lagomplan-consent' key) so the
 * host_guide_* events flow through the same analytics as the rest of the site.
 */

import type { Metadata } from 'next'
import Script from 'next/script'
import { fontVariables } from '../../lib/fonts'
import { BASE_URL } from '../../lib/seo'
import ConsentSync from '../../components/analytics/ConsentSync'
import { GoogleAnalyticsTracker } from '../../components/analytics/GoogleAnalyticsTracker'
import PartnerAttributionCapture from '../../components/analytics/PartnerAttributionCapture'
import '../globals.css'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID


export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function GuiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={fontVariables}
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
            <Script id="ga-guia" strategy="afterInteractive">
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
        <PartnerAttributionCapture />
        <GoogleAnalyticsTracker />
      </body>
    </html>
  )
}
