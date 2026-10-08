/**
 * app/[locale]/my-trips/page.tsx
 * Route ES: /es/mis-viajes  EN: /en/my-trips
 */
import type { Metadata }              from 'next'
import { buildAlternates, buildOpenGraph, NO_INDEX } from '../../../lib/seo'
import type { Locale }               from '../../../i18n'
import MyTripsClient                 from './MyTripsClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildAlternates(locale, 'myTrips')
  return {
    title:       locale === 'es' ? 'Mis viajes' : 'My trips',
    alternates,
    openGraph:  buildOpenGraph(locale, { url: alternates.canonical as string }),
    robots:      NO_INDEX,
  }
}

export default function Page() {
  return (
    <main className="pt-[100px]">
      <MyTripsClient />
    </main>
  )
}
