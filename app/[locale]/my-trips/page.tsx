/**
 * app/[locale]/my-trips/page.tsx
 * Route ES: /es/mis-viajes  EN: /en/my-trips
 */
import type { Metadata }              from 'next'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale }               from '../../../i18n'
import MyTripsClient                 from './MyTripsClient'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  return {
    title:       locale === 'es' ? 'Mis viajes' : 'My trips',
    alternates:  buildAlternates('myTrips'),
    openGraph:   buildOpenGraph(locale),
  }
}

export default function Page() {
  return (
    <main className="pt-[72px]">
      <MyTripsClient />
    </main>
  )
}
