/**
 * app/[locale]/guides/[slug]/page.tsx
 * Guide detail page — /es/guias/[slug] | /en/guides/[slug]
 *
 * Resolution order:
 *  1. New guide data system (/lib/data/guides) → GuidePageClientV2
 *  2. Legacy guide data (/lib/guides)          → GuidePageClient
 *  3. notFound()
 */

import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'

import { getAllGuideParams, getGuideBySlug } from '../../../../lib/guides'
import { getGuidePageData, getNewGuideParams, resolveCanonicalSlug } from '../../../../lib/data/guides/index'
import { buildGuideAlternates, buildOpenGraph } from '../../../../lib/seo'
import type { Locale }              from '../../../../i18n'
import { GuidePageClient }          from '../../../../components/guides/GuidePageClient'
import { GuidePageClientV2 }        from '../../../../components/guides/GuidePageClientV2'

// ── Static generation ─────────────────────────────────────────────────────────

type Props = { params: Promise<{ locale: Locale; slug: string }> }

export function generateStaticParams() {
  // Merge params from both data systems (deduplicated by slug+locale)
  const legacy  = getAllGuideParams()
  const newData = getNewGuideParams()

  const seen = new Set<string>()
  const all: Array<{ locale: string; slug: string }> = []

  for (const p of [...newData, ...legacy]) {
    const key = `${p.locale}:${p.slug}`
    if (!seen.has(key)) {
      seen.add(key)
      all.push(p)
    }
  }
  return all
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params

  // Try new data system first
  const newData = getGuidePageData(slug, locale)
  if (newData) {
    const title       = newData.hero.title
    const description = newData.hero.subtitle
    return {
      title,
      description,
      openGraph: buildOpenGraph(locale, {
        title,
        description,
        type:   'article',
        images: newData.hero.coverImage
          ? [{ url: newData.hero.coverImage, width: 1200, height: 630, alt: title }]
          : [],
      }),
    }
  }

  // Fall back to legacy
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

export default async function GuideDetailPage({ params }: Props) {
  const { locale, slug } = await params

  // 1. Try new guide data system
  const newData = getGuidePageData(slug, locale)
  if (newData) {
    const canonical   = resolveCanonicalSlug(slug)
    const otherLocale = locale === 'es' ? 'en' : 'es'
    const guidePrefix = otherLocale === 'es' ? 'guias' : 'guides'
    const alternateLocaleUrl = `/${otherLocale}/${guidePrefix}/${canonical}`
    return <GuidePageClientV2 data={newData} locale={locale} alternateLocaleUrl={alternateLocaleUrl} />
  }

  // 2. Fall back to legacy system
  const guide = getGuideBySlug(locale, slug)
  if (!guide) notFound()

  return <GuidePageClient guide={guide} locale={locale} />
}
