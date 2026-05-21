/**
 * app/[locale]/layout.tsx
 *
 * Root layout for all locales.
 *
 * Font corrections (brand guide):
 *   Manrope  → --font-sans    (UI body + headings, replaces DM Sans)
 *   Fraunces → --font-display (hero emphasis + pull quotes, replaces Playfair Display)
 *   DM Mono  → --font-mono    (utility labels, not in brand guide but kept functionally)
 */
export const dynamic = 'force-dynamic'

import type { Metadata }              from 'next'
import Script                         from 'next/script'
import { Manrope, Fraunces, DM_Mono } from 'next/font/google'
import { notFound }                   from 'next/navigation'
import { NextIntlClientProvider }     from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { locales, type Locale }       from '../../i18n'
import {
  BASE_URL,
  buildAlternates,
  buildOpenGraph,
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
} from '../../lib/seo'
import Nav    from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import { SupabaseProvider } from '../../components/auth/SupabaseProvider'
import { PlanProvider } from '../../components/plan/PlanProvider'
import NewsletterPopup from '../../components/newsletter/NewsletterPopup'
import { MetaPixelTracker } from '../../components/analytics/MetaPixelTracker'
import { GoogleAnalyticsTracker } from '../../components/analytics/GoogleAnalyticsTracker'
import ConsentSync from '../../components/analytics/ConsentSync'
import CookieBanner from '../../components/layout/CookieBanner'
import '../globals.css'

// GA4 loader stays in the layout (with Consent Mode v2 defaults set
// inline so it loads but doesn't emit hits until the user accepts).
// Meta Pixel now lives in ConsentSync — only injected when consent
// is explicitly 'all'. Both env vars: set in Vercel for Production +
// Preview; keep unset locally so dev requests don't pollute analytics.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// ── Fonts ──────────────────────────────────────────────────
const manrope = Manrope({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
  weight:   ['400', '500', '700'],
})

const fraunces = Fraunces({
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
  weight:   ['500', '600'],
  style:    ['normal', 'italic'],
})

const dmMono = DM_Mono({
  subsets:  ['latin'],
  variable: '--font-mono',
  display:  'swap',
  weight:   ['400'],
})

// ── Static params ──────────────────────────────────────────
export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

// ── Metadata ───────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    // metadataBase resolves all relative URLs (OG/Twitter images, etc.)
    // against production. Without it, Next renders relative URLs against
    // localhost in dev/preview and emits a warning.
    metadataBase: new URL(BASE_URL),
    title:       { default: t('title'), template: `%s — Lagomplan` },
    description: t('description'),
    alternates:  buildAlternates('home'),
    openGraph:   buildOpenGraph(locale),
    twitter: {
      card:        'summary_large_image',
      site:        '@lagomplantravel',
      creator:     '@lagomplantravel',
    },
  }
}

// ── Layout ─────────────────────────────────────────────────
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${fraunces.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* ── JSON-LD: Organization + WebSite (site-wide schemas) ───────
            Establishes the brand entity in Google's Knowledge Graph and
            makes the site eligible for the sitelinks searchbox once
            authority threshold is reached. Cheap to include site-wide;
            Google deduplicates equivalent schemas across pages. */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ '@id': `${BASE_URL}#organization`, ...ORGANIZATION_SCHEMA }),
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ '@id': `${BASE_URL}#website`, ...WEBSITE_SCHEMA }),
          }}
        />

        {/* ── Google Analytics 4 — loads only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set ──
            send_page_view: false disables gtag's auto page_view (which only
            fires once per script load). The <GoogleAnalyticsTracker> below
            handles every page_view manually — initial load + every App
            Router client navigation — via usePathname/useSearchParams.

            Consent Mode v2: all storage signals default to denied so GA
            loads but doesn't write cookies or transmit hits until the
            user accepts via CookieBanner. If a prior 'all' decision is
            already in localStorage, we update analytics_storage to
            'granted' inline so the landing page_view fires immediately
            (avoids waiting for ConsentSync to mount). ad_* signals stay
            denied — Lagomplan doesn't run Google Ads. */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
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

        {/* ── Stay22 LetMeAllez — passive monetization middleware ──────
            Auto-monetizes any outbound travel link the team adds in
            future (Booking/Hotels.com/Agoda/etc.) without needing to
            route it through buildAffiliateLink. Async load, lmaID
            fixed on the Stay22 dashboard. The CTAs we generate
            through lib/affiliate/build.ts already carry our `aid`
            so LetMeAllez is supplementary — not the source of truth. */}
        <Script id="stay22-letmeallez" strategy="afterInteractive">
          {`
            (function (s, t, a, y, twenty, two) {
              s.Stay22 = s.Stay22 || {};
              s.Stay22.params = { lmaID: '69b992c248666aca4133dbbe' };
              twenty = t.createElement(a);
              two = t.getElementsByTagName(a)[0];
              twenty.async = 1;
              twenty.src = y;
              two.parentNode.insertBefore(twenty, two);
            })(window, document, 'script', 'https://scripts.stay22.com/letmeallez.js');
          `}
        </Script>

        {/* ── Meta Pixel — gated behind cookie consent ──
            The Pixel base loader + init + first PageView are emitted by
            <ConsentSync> only after the user accepts non-essential
            cookies. Subsequent App Router navigations are tracked by
            <MetaPixelTracker> below; it no-ops when fbq is undefined,
            so an Essential-only user never sends a beacon. */}

        <NextIntlClientProvider messages={messages}>
          <SupabaseProvider>
            <PlanProvider>
              {/* Nav is position:fixed — every first section needs pt-[100px] */}
              <Nav />
              {children}
              <Footer />
              <NewsletterPopup />
              <CookieBanner />
              <ConsentSync />
              <GoogleAnalyticsTracker />
              <MetaPixelTracker />
            </PlanProvider>
          </SupabaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
