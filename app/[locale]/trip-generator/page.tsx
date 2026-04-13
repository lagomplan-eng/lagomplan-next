// app/[locale]/trip-generator/page.tsx
// Two states:
//   1. No ?destination param → show full form (same as HeroForm but full-page)
//   2. ?destination param present → show result layout

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { type Locale } from '../../../i18n'
import { buildAlternates } from '../../../lib/seo'
import TripGeneratorClient from './TripGeneratorClient'

export async function generateMetadata({
  params: { locale },
}: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title:      'Planificador de viajes',
    description: t('description'),
    alternates: buildAlternates('planner'),
  }
}

export default function TripGeneratorPage({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  return <TripGeneratorClient searchParams={searchParams} />
}
