import type { Metadata } from 'next'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale } from '../../../i18n'
import WorldcupClient from '../../../components/worldcup/WorldcupClient'
import NewsletterEndOfGuide from '../../../components/newsletter/NewsletterEndOfGuide'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'Guías de campo · Mundial 2026' : 'Field guides · World Cup 2026',
    description:
      locale === 'es'
        ? '16 guías de campo para las sedes del Mundial 2026. Ciudad de México, Los Ángeles, Nueva York, Miami, Toronto y más.'
        : '16 field guides for the 2026 World Cup host cities. Mexico City, Los Angeles, New York, Miami, Toronto and more.',
    alternates: buildAlternates('worldcupIndex'),
    openGraph: buildOpenGraph(locale),
  }
}

export default async function WorldcupIndexPage({ params }: Props) {
  const { locale } = await params
  return (
    <main className="pt-[88px]" style={{ minHeight: '100vh' }}>
      <WorldcupClient locale={locale} />
      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 32px' }}>
        <NewsletterEndOfGuide />
      </div>
    </main>
  )
}
