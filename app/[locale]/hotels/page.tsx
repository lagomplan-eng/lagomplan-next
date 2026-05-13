/**
 * app/[locale]/hotels/page.tsx
 * Hotels index — /es/hoteles | /en/hotels
 *
 * Server component: extracts hotel data from guides, passes it to
 * HotelsClient (client component) which handles search, filtering, and layout.
 */

import type { Metadata }                    from 'next'
import { buildAlternates, buildOpenGraph }  from '../../../lib/seo'
import type { Locale }                      from '../../../i18n'
import { getAllHotels }                     from '../../../lib/hotels'
import { getRenderableCityNeighborhoods }   from '../../../lib/hotels-neighborhoods'
import HotelsClient                         from '../../../components/hotels/HotelsClient'
import NeighborhoodsSection                 from '../../../components/hotels/NeighborhoodsSection'
import PlannerBridgeCTA                     from '../../../components/hotels/PlannerBridgeCTA'
import NewsletterEndOfGuide                 from '../../../components/newsletter/NewsletterEndOfGuide'

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
  // Combined feed: curated guides + worldcup city stays. Both corpora are
  // the only authoritative sources of hotel records.
  const hotels        = getAllHotels(locale)
  const neighborhoods = getRenderableCityNeighborhoods(locale)

  return (
    // #FFF9F3 — same warm cream the planner, signup, and guide pages
    // use. var(--sand) (#EDE7E1) was a different, darker bucket and
    // made the Hotels page visually disconnected from the rest of
    // the site. Set on <main> so bridge CTA + newsletter inherit.
    <main className="pt-[100px] bg-[#FFF9F3]">
      <HotelsClient hotels={hotels} locale={locale} />
      <NeighborhoodsSection cities={neighborhoods} locale={locale} />
      <PlannerBridgeCTA locale={locale} />
      <div className="page-inner">
        <NewsletterEndOfGuide />
      </div>
    </main>
  )
}
