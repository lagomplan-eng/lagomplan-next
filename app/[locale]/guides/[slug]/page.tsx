/**
 * app/[locale]/guides/[slug]/page.tsx
 * Guide detail page — /es/guias/[slug] | /en/guides/[slug]
 *
 * Server component: resolves guide data + metadata, then passes to GuidePageClient.
 */

import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'

import {
  getAllGuideParams,
  getGuideBySlug,
} from '../../../../lib/guides'
import {
  buildGuideAlternates,
  buildOpenGraph,
} from '../../../../lib/seo'
import type { Locale }         from '../../../../i18n'
import { GuidePageClient }     from '../../../../components/guides/GuidePageClient'

// ── Static generation ─────────────────────────────────────────────────────────

type Props = { params: { locale: Locale; slug: string } }

export function generateStaticParams() {
  return getAllGuideParams()
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params
  const guide = getGuideBySlug(locale, slug)
  if (!guide) return { title: '404' }

  const title       = locale === 'es' ? guide.title_es   : guide.title_en
  const description = locale === 'es' ? guide.excerpt_es : guide.excerpt_en

  return {
    title,
    description,
    alternates: buildGuideAlternates(guide),
    openGraph:  buildOpenGraph(locale, {
      title,
      description,
      type:   'article',
      images: [{ url: guide.cover_img, width: 1200, height: 630, alt: title }],
    }),
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GuideDetailPage({ params }: Props) {
  const { locale, slug } = params
  const guide = getGuideBySlug(locale, slug)
  if (!guide) notFound()

  return <GuidePageClient guide={guide} locale={locale} />
}
