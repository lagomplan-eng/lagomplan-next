// app/demo/[prospect]/page.tsx
//
// Sales demo of the co-branded guide for one prospect. Same GuiaClient as
// /guia/[partner]; the prospect config in content/demos/<slug>/demo.json supplies
// the branding. Never indexed, not in the sitemap, and nothing links here.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCity } from '../../../content/guia'
import { buildDemoPartner, getDemoProspect, listDemoSlugs } from '../../../content/guia/demos'
import { loadAgenda } from '../../../content/guia/agenda'
import { agendaPageProps } from '../../../content/guia/agenda/public'
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
  const robots = { index: false, follow: false, googleBot: { index: false, follow: false } }
  if (!prospect) return { title: 'Demo', robots }

  // Same title/description/preview pattern as /guia/[partner]. The page stays
  // noindex,nofollow; the og:image is only for link previews when it's shared.
  const city = getCity(buildDemoPartner(prospect).city)
  const title = `${prospect.partner.name} · Your stay guide`
  const description =
    `Your guest guide to Mexico City, curated by ${prospect.partner.name} and powered by Lagomplan.`
  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(city ? { images: [{ url: city.heroImage }] } : {}),
    },
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
    <GuiaClient partner={partner} city={city} demo={{ slug: prospect.slug, prospectName: prospect.partner.name }}
      recordVisits={process.env.VERCEL_ENV === 'production'}
      // Dated agenda ("Mientras estás aquí"): only for demos that opt in. The props are page data sent to
      // every visitor, so they go through agendaPageProps(): Production gets verified events only, and no
      // environment gets the internal notes (see content/guia/agenda/public.ts).
      {...(partner.agenda ? agendaPageProps(loadAgenda(), process.env.VERCEL_ENV) : {})}
    />
  )
}
