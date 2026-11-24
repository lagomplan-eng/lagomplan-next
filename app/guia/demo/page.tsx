// app/guia/demo/page.tsx
//
// The paid white-label demo: "Casa Lagom", an invented boutique hotel in Condesa. A dedicated route (a static segment wins
// over /guia/[partner]) so the shared [partner] page, and with it the Livin guides, is not touched. All host content is
// sample content and labelled as such; always noindex.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CASA_LAGOM } from '../../../content/guia/paid/casa-lagom'
import { buildPaidGuideProps } from '../../../content/guia/paid/resolve'
import { getCity } from '../../../content/guia'
import GuiaClient from '../[partner]/GuiaClient'

export function generateMetadata(): Metadata {
  const city = getCity('cdmx')
  const title = `${CASA_LAGOM.name} · Your stay guide`
  return {
    title,
    description: `Demo of a white-label guest guide for a hotel in Condesa, powered by Lagomplan. ${CASA_LAGOM.name} is an invented hotel.`,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: { title, type: 'website', ...(city ? { images: [{ url: city.heroImage }] } : {}) },
  }
}

export default function PaidDemoPage() {
  const props = buildPaidGuideProps(CASA_LAGOM, 'condesa')
  if (!props) notFound()
  return <GuiaClient {...props} />
}
