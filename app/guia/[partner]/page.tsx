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
  // Page defaults to Spanish (matches the design's lang: 'es').
  const title = `${partner.displayName} · Guía de tu estancia`
  const description =
    `Tu guía de estancia en la Ciudad de México, curada por ${partner.hostName} y potenciada por Lagomplan.`

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
