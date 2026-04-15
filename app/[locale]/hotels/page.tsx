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
import { getAllHotelsFromGuides }            from '../../../lib/hotels'
import HotelsClient                         from '../../../components/hotels/HotelsClient'

type Props = { params: { locale: Locale } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
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

export default function HotelsIndexPage({ params: { locale } }: Props) {
  const hotels = getAllHotelsFromGuides(locale)

  return (
    <main className="pt-[72px]">
      <HotelsClient hotels={hotels} locale={locale} />
    </main>
  )
}
