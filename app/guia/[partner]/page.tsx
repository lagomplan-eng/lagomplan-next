// app/guia/[partner]/page.tsx
//
// Statically-generated co-branded guest guide, one page per partner.
// Live: https://www.lagomplan.com/guia/<slug>  (e.g. /guia/lupito)

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGuide, listPartnerSlugs } from '../../../content/guia'
import GuiaClient from './GuiaClient'

// Only known partner slugs are built; anything else 404s.
export const dynamicParams = false

export function generateStaticParams() {
  return listPartnerSlugs().map((partner) => ({ partner }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ partner: string }> },
): Promise<Metadata> {
  const { partner: slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}

  const { partner } = guide
  // Page defaults to English (in-page toggle switches to Spanish).
  const title = `${partner.displayName} · Your stay guide`
  const description =
    `Your guest guide to Mexico City, curated by ${partner.hostName} and powered by Lagomplan.`

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: guide.city.heroImage }],
    },
  }
}

export default async function GuiaPartnerPage(
  { params }: { params: Promise<{ partner: string }> },
) {
  const { partner: slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  return <GuiaClient partner={guide.partner} city={guide.city} />
}
