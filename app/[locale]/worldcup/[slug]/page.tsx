import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildOpenGraph } from '../../../../lib/seo'
import type { Locale } from '../../../../i18n'

// Per-city editorial components. Each is a self-contained client component
// with the real rewritten content. Add/replace entries here to ship new
// cities or promote stubs to full guides.
import Cdmx           from '../../../../components/worldcup/cities/cdmx'
import Guadalajara    from '../../../../components/worldcup/cities/guadalajara'
import Monterrey      from '../../../../components/worldcup/cities/monterrey'
import LosAngeles     from '../../../../components/worldcup/cities/los-angeles'
import Miami          from '../../../../components/worldcup/cities/miami'
import Dallas         from '../../../../components/worldcup/cities/dallas'
import Houston        from '../../../../components/worldcup/cities/houston'
import Kansas         from '../../../../components/worldcup/cities/kansas'
import Atlanta        from '../../../../components/worldcup/cities/atlanta'
import Boston         from '../../../../components/worldcup/cities/boston'
import Vancouver      from '../../../../components/worldcup/cities/vancouver'
// Stubs — render a "Guía en construcción" card. Replace with full content
// by overwriting the matching file under components/worldcup/cities/.
import NewYork        from '../../../../components/worldcup/cities/new-york'
import Philadelphia   from '../../../../components/worldcup/cities/philadelphia'
import SanFrancisco   from '../../../../components/worldcup/cities/san-francisco'
import Seattle        from '../../../../components/worldcup/cities/seattle'
import Toronto        from '../../../../components/worldcup/cities/toronto'

const CITY_MAP: Record<string, React.ComponentType<{ locale?: Locale }>> = {
  cdmx: Cdmx,
  gdl:  Guadalajara,
  mty:  Monterrey,
  la:   LosAngeles,
  mia:  Miami,
  nyc:  NewYork,
  dal:  Dallas,
  sf:   SanFrancisco,
  hou:  Houston,
  sea:  Seattle,
  kc:   Kansas,
  atl:  Atlanta,
  phi:  Philadelphia,
  bos:  Boston,
  tor:  Toronto,
  van:  Vancouver,
}

// Labels for metadata <title>. Keeps everything in one file; the city
// components themselves hold the real copy.
const CITY_LABEL: Record<string, string> = {
  cdmx: 'Ciudad de México',
  gdl:  'Guadalajara',
  mty:  'Monterrey',
  la:   'Los Ángeles',
  mia:  'Miami',
  nyc:  'Nueva York',
  dal:  'Dallas',
  sf:   'San Francisco',
  hou:  'Houston',
  sea:  'Seattle',
  kc:   'Kansas City',
  atl:  'Atlanta',
  phi:  'Filadelfia',
  bos:  'Boston',
  tor:  'Toronto',
  van:  'Vancouver',
}

// ── Static generation ──────────────────────────────────────────────────────────

type Props = { params: Promise<{ locale: Locale; slug: string }> }

export function generateStaticParams() {
  return Object.keys(CITY_MAP).map(slug => ({ slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const label = CITY_LABEL[slug]
  return {
    title: label
      ? `${label} · Mundial 2026 · Lagomplan`
      : 'Mundial 2026 · Lagomplan',
    openGraph: buildOpenGraph(locale),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function WorldcupDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const Guide = CITY_MAP[slug]
  if (!Guide) notFound()
  return <Guide locale={locale} />
}
