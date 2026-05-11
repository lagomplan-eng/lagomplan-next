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
import '../globals.css'

// Both pixels load only when configured. Set in Vercel envs
// (Production + Preview); keep unset locally so dev requests don't
// pollute production analytics.
const META_PIXEL_ID    = process.env.NEXT_PUBLIC_META_PIXEL_ID
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
            Router client navigation — via usePathname/useSearchParams. */}
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
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}

        {/* ── Meta Pixel — loads only when NEXT_PUBLIC_META_PIXEL_ID is set ──
            The base loader, init, and the initial PageView are all here.
            Subsequent App Router navigations are tracked by
            <MetaPixelTracker /> below (rendered inside the body so
            usePathname / useSearchParams work). */}
        {META_PIXEL_ID && (
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
        )}

        <NextIntlClientProvider messages={messages}>
          <SupabaseProvider>
            <PlanProvider>
              {/* Nav is position:fixed — every first section needs pt-[100px] */}
              <Nav />
              {children}
              <Footer />
              <NewsletterPopup />
              <GoogleAnalyticsTracker />
              <MetaPixelTracker />
            </PlanProvider>
          </SupabaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
