// app/guia/cdmx/[zone]/page.tsx
//
// The zone guide the hotel QR lands on: base + zone content only, Lagomplan branding, no hotel name.
// Static per zone (condesa, roma-norte, polanco); the hotel code (?h=) and language (?lang=) are read in the
// browser, so every hotel shares these three pages. noindex for now, including the plain zone URL; the
// canonical is always the plain zone guide.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCity } from '../../../../content/guia'
import { HOTEL_ZONES, ZONE_LABEL, ZONE_SLUG, zoneFromSlug } from '../../../../content/guia/hotel/zones'
import { buildHotelGuideProps } from '../../../../content/guia/hotel/resolve'
import GuiaClient from '../../[partner]/GuiaClient'

export const dynamicParams = false

export function generateStaticParams() {
  return HOTEL_ZONES.map((z) => ({ zone: ZONE_SLUG[z] }))
}

export async function generateMetadata({ params }: { params: Promise<{ zone: string }> }): Promise<Metadata> {
  const zone = zoneFromSlug((await params).zone)
  if (!zone) return {}
  const city = getCity('cdmx')
  const title = `Tu guía de ${ZONE_LABEL[zone]} · Your ${ZONE_LABEL[zone]} guide`
  return {
    title,
    description: 'Lagomplan · Guía de barrio · Neighborhood guide',
    robots: { index: false, follow: false },
    alternates: { canonical: `/guia/cdmx/${ZONE_SLUG[zone]}` },
    openGraph: { title, type: 'website', ...(city ? { images: [{ url: city.heroImage }] } : {}) },
  }
}

export default async function HotelZoneGuidePage({ params }: { params: Promise<{ zone: string }> }) {
  const zone = zoneFromSlug((await params).zone)
  const props = zone ? buildHotelGuideProps(zone) : null
  if (!props) notFound()
  // The hotel edition IS the Livin guide (GuiaClient) with the `hotel` differences; recordVisits stays off.
  return <GuiaClient {...props} />
}
