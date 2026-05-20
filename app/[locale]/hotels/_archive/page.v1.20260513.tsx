// ARCHIVED — Hotels page v1, parked on 2026-05-13
// Reason: Hotels redesign (see app/[locale]/hotels/page.tsx for the v2 build)
// Safe to delete after 30 days if v2 is stable in prod.
//
// Note: the underscore-prefixed `_archive` directory is treated as a private
// folder by the Next.js App Router — it does NOT generate a route.
// Imports point at the locally-archived client copy so this file keeps
// type-checking even after the live `components/hotels/HotelsClient.tsx`
// is rewritten in the v2 work.

import type { Metadata }                    from 'next'
import { buildAlternates, buildOpenGraph }  from '../../../../lib/seo'
import type { Locale }                      from '../../../../i18n'
import { getAllHotelsFromGuides }            from '../../../../lib/hotels'
import HotelsClient                         from './HotelsClient.v1.20260513'
import NewsletterEndOfGuide                 from '../../../../components/newsletter/NewsletterEndOfGuide'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Hoteles curados' : 'Curated hotels',
    description:
      locale === 'es'
        ? 'Hoteles seleccionados con criterio editorial — por carácter, ubicación y valor real, no por comisión.'
        : 'Hotels selected with editorial taste — for character, location, and honest value, not commission.',
    alternates: buildAlternates('hotelsIndex'),
    openGraph:  buildOpenGraph(locale),
  }
}

export default async function HotelsIndexPage({ params }: Props) {
  const { locale } = await params
  const hotels = getAllHotelsFromGuides(locale)

  return (
    <main className="pt-[100px]">
      <HotelsClient hotels={hotels} locale={locale} />
      <div className="page-inner">
        <NewsletterEndOfGuide />
      </div>
    </main>
  )
}
