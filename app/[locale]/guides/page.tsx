/**
 * app/[locale]/guides/page.tsx
 * Guides index — /es/guias | /en/guides
 *
 * Server component: fetches and resolves guide data, then passes it to
 * the GuidesClient (client) component which handles search, filtering, and layout.
 */

import type { Metadata }  from 'next'
import { getAllGuides }    from '../../../lib/guides'
import { getGuideUrl }    from '../../../lib/routes'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale }    from '../../../i18n'
import GuidesClient, { type GuideListing } from '../../../components/guides/GuidesClient'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Guías de viaje' : 'Travel guides',
    description:
      locale === 'es'
        ? 'Guías editoriales para viajeros con criterio. Destinos, itinerarios y tips sin ruido.'
        : 'Editorial guides for travelers with taste. Destinations, itineraries, and noise-free tips.',
    alternates: buildAlternates('guidesIndex'),
    openGraph:  buildOpenGraph(locale),
  }
}

type PageProps = { params: Promise<{ locale: Locale }> }

export default async function GuidesIndexPage({ params }: PageProps) {
  const { locale } = await params
  const isES   = locale === 'es'
  const guides = getAllGuides(locale)

  // Resolve all guide data to serializable plain objects for the client component
  const listings: GuideListing[] = guides.map(guide => ({
    slug:        isES ? guide.slug_es : guide.slug_en,
    title:       isES ? guide.title_es : guide.title_en,
    excerpt:     isES ? guide.excerpt_es : guide.excerpt_en,
    destination: isES ? guide.destination_es : guide.destination_en,
    tags:        isES ? guide.tags_es : guide.tags_en,
    cover_img:   guide.cover_img,
    url:         getGuideUrl(locale, guide),
  }))

  // Featured guide: first with featured:true, otherwise first in list
  const featured = listings.find((g: GuideListing & { featured?: boolean }) => (g as any).featured) ?? listings[0]

  return (
    <main className="pt-[72px]">
      <GuidesClient guides={listings} featured={featured} locale={locale} />
    </main>
  )
}
