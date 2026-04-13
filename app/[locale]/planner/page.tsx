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
  params: { locale },
}: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title:       locale === 'es' ? 'Planificador de viajes' : 'Trip planner',
    description: t('description'),
    alternates:  buildAlternates('planner'),
    openGraph:   buildOpenGraph(locale),
  }
}

export default function PlannerPage({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  return <TripGeneratorClient searchParams={searchParams} />
}
