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
import { getGuidePageData, getNewGuideParams, resolveCanonicalSlug, getGuideLocales } from '../../../../lib/data/guides/index'
import { buildGuideAlternates, buildOpenGraph, BASE_URL } from '../../../../lib/seo'
import { getRoute } from '../../../../lib/routes'
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

    // Slug is identical across locales in this system (only the segment
    // translates, guias↔guides) — but a requested slug might be a legacy
    // descriptive alias (e.g. "oaxaca-guia-esencial") that resolves to a
    // shorter canonical key ("oaxaca"). Alternates always point at the
    // canonical key so an alias URL's canonical consolidates onto the
    // short slug instead of self-referencing the alias — same slug the
    // sitemap already treats as the winner when deduping.
    const canonicalKey     = resolveCanonicalSlug(slug)
    const availableLocales = getGuideLocales(canonicalKey)
    const languages: Record<string, string> = {}
    for (const loc of availableLocales) {
      languages[loc] = `${BASE_URL}${getRoute(loc as Locale, 'guideDetail')}/${canonicalKey}`
    }
    // Omit a locale's hreflang entirely if that guide has no real content
    // there — never invent a URL. x-default only when an ES version
    // actually exists (site convention: ES is the default language).
    const canonicalUrl = languages[locale]
      ?? `${BASE_URL}${getRoute(locale, 'guideDetail')}/${canonicalKey}`

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          ...languages,
          ...(languages.es ? { 'x-default': languages.es } : {}),
        },
      },
      openGraph: buildOpenGraph(locale, {
        title,
        description,
        type:   'article',
        url:    canonicalUrl,
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
  const alternates  = buildGuideAlternates(locale, guide)

  return {
    title,
    description,
    alternates,
    openGraph:  buildOpenGraph(locale, {
      title,
      description,
      type:   'article',
      url:    alternates.canonical as string,
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
