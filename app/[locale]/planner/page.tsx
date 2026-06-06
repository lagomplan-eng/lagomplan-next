/**
 * app/[locale]/planner/page.tsx
 *
 * Replaces app/[locale]/trip-generator/page.tsx.
 * Route: /es/planificador | /en/planner
 *
 * The UI components (TripGeneratorClient, TripResult, HeroForm) are unchanged.
 * Only the route path and metadata wiring change.
 */

import type { Metadata }      from 'next'
import { headers }            from 'next/headers'
import { redirect }           from 'next/navigation'
import { getTranslations }    from 'next-intl/server'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale }        from '../../../i18n'
import TripGeneratorClient    from './TripGeneratorClient'

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title:       locale === 'es' ? 'Planificador de viajes' : 'Trip planner',
    description: t('description'),
    alternates:  buildAlternates('planner'),
    openGraph:   buildOpenGraph(locale),
  }
}

export default async function PlannerPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<Record<string, string>>
}) {
  const { locale } = await params
  const resolvedParams = await searchParams

  // Opening a SAVED trip on a phone → send them to the mobile companion view
  // instead of the desktop planner. Only fires on a genuine server load of
  // ?trip_id= (My Trips, a shared link, a refresh); the generation flow sets
  // trip_id via history.replaceState (no server roundtrip), so a phone user
  // creating a trip stays in the full planner. `?full=1` is the escape hatch
  // the mobile view's "Editar plan" link uses to force the desktop planner.
  if (resolvedParams.trip_id && resolvedParams.full !== '1') {
    const ua = (await headers()).get('user-agent') ?? ''
    if (/Mobi/i.test(ua)) {
      redirect(`/${locale}/trips/${resolvedParams.trip_id}`)
    }
  }

  return <TripGeneratorClient searchParams={resolvedParams} />
}
