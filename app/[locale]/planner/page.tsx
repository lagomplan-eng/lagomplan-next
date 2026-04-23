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
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const resolvedParams = await searchParams
  return <TripGeneratorClient searchParams={resolvedParams} />
}
