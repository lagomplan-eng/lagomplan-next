import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildOpenGraph } from '../../../../lib/seo'
import type { Locale } from '../../../../i18n'

// ── Guide page components ──────────────────────────────────────────────────────
// Each file is a self-contained, standalone guide page.
// Slugs match the IDs used by WorldcupClient (lib/worldcup-guides ROSTER).

import Vancouver     from '../../../../prototypes/guías mundial/guia_wc_vancouver_template'
import Atlanta       from '../../../../prototypes/guías mundial/guia_wc_atlanta'
import Cdmx          from '../../../../prototypes/guías mundial/guia_wc_cdmx'
import Dallas        from '../../../../prototypes/guías mundial/guia_wc_dallas'
import Guadalajara   from '../../../../prototypes/guías mundial/guia_wc_guadalajara'
import Monterrey     from '../../../../prototypes/guías mundial/guia_wc_monterrey'
import Kansas        from '../../../../prototypes/guías mundial/guia_wc_kansas'
import LosAngeles    from '../../../../prototypes/guías mundial/guia_wc_losangeles'
import Miami         from '../../../../prototypes/guías mundial/guia_wc_miami'
import NewYork       from '../../../../prototypes/guías mundial/guia_wc_newyork'
import Philadelphia  from '../../../../prototypes/guías mundial/guia_wc_philadelphia'
import SanFrancisco  from '../../../../prototypes/guías mundial/guia_wc_sanfrancisco'
import Seattle       from '../../../../prototypes/guías mundial/guia_wc_seattle'
import Toronto       from '../../../../prototypes/guías mundial/guia_wc_toronto'
import Houston       from '../../../../prototypes/guías mundial/guia_wc_houston'
import Boston        from '../../../../prototypes/guías mundial/guia_wc_boston'

// ── Slug → component map ───────────────────────────────────────────────────────
// Keys are ROSTER IDs from WorldcupClient — do not change without updating links.

const GUIDE_MAP: Record<string, React.ComponentType> = {
  van: Vancouver,
  atl: Atlanta,
  cdmx: Cdmx,
  dal: Dallas,
  gdl: Guadalajara,
  mty: Monterrey,
  kc:  Kansas,
  la:  LosAngeles,
  mia: Miami,
  nyc: NewYork,
  phi: Philadelphia,
  sf:  SanFrancisco,
  sea: Seattle,
  tor: Toronto,
  hou: Houston,
  bos: Boston,
}

// ── Static generation ──────────────────────────────────────────────────────────
// Parent [locale] layout provides locale dimension; we only need slugs here.

type Props = { params: Promise<{ locale: Locale; slug: string }> }

export function generateStaticParams() {
  return Object.keys(GUIDE_MAP).map(slug => ({ slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const exists = slug in GUIDE_MAP
  return {
    title: exists
      ? `Mundial 2026 · Guía de campo · Lagomplan`
      : 'Mundial 2026 · Lagomplan',
    openGraph: buildOpenGraph(locale),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function WorldcupDetailPage({ params }: Props) {
  const { slug } = await params
  const Guide = GUIDE_MAP[slug]
  if (!Guide) notFound()
  return <Guide />
}
