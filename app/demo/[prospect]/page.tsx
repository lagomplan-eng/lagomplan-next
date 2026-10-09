// app/demo/[prospect]/page.tsx
//
// Sales demo of the co-branded guide for one prospect. Same GuiaClient as
// /guia/[partner]; the prospect config in content/guia/demos supplies the
// branding. Never indexed, not in the sitemap, and nothing links here.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCity } from '../../../content/guia'
import { buildDemoPartner, getDemoProspect, listDemoSlugs } from '../../../content/guia/demos'
import GuiaClient from '../../guia/[partner]/GuiaClient'

export const dynamicParams = false

export function generateStaticParams() {
  return listDemoSlugs().map((prospect) => ({ prospect }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ prospect: string }> },
): Promise<Metadata> {
  const { prospect: slug } = await params
  const prospect = getDemoProspect(slug)
  return {
    title: prospect ? `${prospect.name} · Demo` : 'Demo',
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  }
}

export default async function DemoPage(
  { params }: { params: Promise<{ prospect: string }> },
) {
  const { prospect: slug } = await params
  const prospect = getDemoProspect(slug)
  if (!prospect) notFound()
  const partner = buildDemoPartner(prospect)
  const city = getCity(partner.city)
  if (!city) notFound()

  return (
    <GuiaClient partner={partner} city={city} demo={{ slug: prospect.slug, prospectName: prospect.name }}
      recordVisits={process.env.VERCEL_ENV === 'production'}
    />
  )
}
