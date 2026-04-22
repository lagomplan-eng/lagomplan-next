import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildOpenGraph } from '../../../../lib/seo'
import type { Locale } from '../../../../i18n'

// ── Guide page components ──────────────────────────────────────────────────────
// Full prototype guides (579+ lines, complete editorial content)

import Vancouver     from '../../../../prototypes/guías mundial/guia_wc_vancouver_template'
import Atlanta       from '../../../../prototypes/guías mundial/guia_wc_atlanta'
import Cdmx          from '../../../../prototypes/guías mundial/guia_wc_cdmx'
import Dallas        from '../../../../prototypes/guías mundial/guia_wc_dallas'
import Guadalajara   from '../../../../prototypes/guías mundial/guia_wc_guadalajara'
import Monterrey     from '../../../../prototypes/guías mundial/guia_wc_monterrey'
import Kansas        from '../../../../prototypes/guías mundial/guia_wc_kansas'
import Houston       from '../../../../prototypes/guías mundial/guia_wc_houston'
import Boston        from '../../../../prototypes/guías mundial/guia_wc_boston'

// ── Vancouver-template-style component for remaining 7 cities ─────────────────
import WorldcupCityPage from '../../../../components/worldcup/WorldcupCityPage'
import { GUIDES } from '../../../../lib/worldcup-guides'

// ── Slug → prototype component map ────────────────────────────────────────────
// Only full/complete prototypes live here.
// Incomplete or stub cities fall through to WorldcupDetailClient + worldcup-guides data.

const PROTOTYPE_MAP: Record<string, React.ComponentType> = {
  van:  Vancouver,
  atl:  Atlanta,
  cdmx: Cdmx,
  dal:  Dallas,
  gdl:  Guadalajara,
  mty:  Monterrey,
  kc:   Kansas,
  hou:  Houston,
  bos:  Boston,
}

// ── Static generation ──────────────────────────────────────────────────────────

type Props = { params: Promise<{ locale: Locale; slug: string }> }

export function generateStaticParams() {
  return Object.keys(GUIDES).map(slug => ({ slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const exists = slug in PROTOTYPE_MAP || slug in GUIDES
  return {
    title: exists
      ? `Mundial 2026 · Guía de campo · Lagomplan`
      : 'Mundial 2026 · Lagomplan',
    openGraph: buildOpenGraph(locale),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function WorldcupDetailPage({ params }: Props) {
  const { slug, locale } = await params

  // Full prototype guides take priority
  const Guide = PROTOTYPE_MAP[slug]
  if (Guide) return <Guide />

  // Remaining 7 cities (la, mia, nyc, sf, sea, phi, tor) use the Vancouver-template layout
  const guide = GUIDES[slug]
  if (!guide) notFound()
  return <WorldcupCityPage guide={guide} />
}
