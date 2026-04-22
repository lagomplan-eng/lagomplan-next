export const dynamic = 'force-dynamic'

import type { Metadata }              from 'next'
import { Manrope, Fraunces, DM_Mono } from 'next/font/google'
import { notFound }                   from 'next/navigation'
import { NextIntlClientProvider }     from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { locales, type Locale }       from '../../i18n'
import { buildAlternates, buildOpenGraph } from '../../lib/seo'
import Nav    from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import { SupabaseProvider }   from '../../components/auth/SupabaseProvider'
import { ConsentProvider }    from '../../components/consent/ConsentProvider'
import { Analytics }          from '../../components/consent/Analytics'
import '../globals.css'

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
  weight:   ['600'],
  style:    ['italic'],
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
    title:       { default: t('title'), template: `%s — Lagomplan` },
    description: t('description'),
    alternates:  buildAlternates('home'),
    openGraph:   buildOpenGraph(locale),
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
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <SupabaseProvider>
            <ConsentProvider>
              <Nav />
              {children}
              <Footer />
              <Analytics />
            </ConsentProvider>
          </SupabaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}