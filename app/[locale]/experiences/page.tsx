/**
 * app/[locale]/experiences/page.tsx
 * Experiencias hub — /es/experiencias | /en/experiences
 *
 * Server component: builds the experience list from the guide files (bookable =
 * a GYG tour link) and hands it to the client hub, which filters it in the
 * browser. Canonical is always the unfiltered page (alternates carry no query);
 * filtered URLs additionally get X-Robots-Tag: noindex from middleware.ts.
 */

import { Suspense }            from 'react'
import type { Metadata }       from 'next'
import { getTranslations }     from 'next-intl/server'
import { getDestinations, getExperiences } from '../../../lib/experiences'
import { getPlanCatalog }      from '../../../lib/plan-catalog'
import { REGIONS }             from '../../../lib/experiences/filters'
import { buildExperiencesJsonLd, serializeJsonLd } from '../../../lib/experiences/jsonld'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale }         from '../../../i18n'
import ExperiencesHub          from '../../../components/experiences/ExperiencesHub'

type Props = { params: Promise<{ locale: Locale }> }

// A guide with a hubWindow (e.g. Día de Muertos) enters and leaves the hub on its own: re-render hourly
// so the window is evaluated against today's date, not the build date (same cadence as the guide pages).
export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experiences.meta' })
  const alternates = buildAlternates(locale, 'experiencesIndex')
  return {
    title:       t('title'),
    description: t('description'),
    alternates,
    openGraph:   buildOpenGraph(locale, { url: alternates.canonical as string }),
  }
}

export default async function ExperiencesPage({ params }: Props) {
  const { locale } = await params
  const experiences = getExperiences(locale)
  const t = await getTranslations({ locale, namespace: 'experiences' })
  const [tEs, tEn] = await Promise.all([
    getTranslations({ locale: 'es', namespace: 'experiences.filters.regions' }),
    getTranslations({ locale: 'en', namespace: 'experiences.filters.regions' }),
  ])
  const regionNames = Object.fromEntries(REGIONS.map(r => [r, { es: tEs(r), en: tEn(r) }])) as Record<(typeof REGIONS)[number], { es: string; en: string }>
  const jsonLd = buildExperiencesJsonLd(locale, experiences, {
    home: t('jsonld.home'),
    hub: t('breadcrumbRoot'),
    listName: t('jsonld.listName'),
  })
  return (
    <>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}
      <Suspense fallback={null}>
        <ExperiencesHub experiences={experiences} destinations={getDestinations(locale)} regionNames={regionNames} planCatalog={getPlanCatalog(locale)} />
      </Suspense>
    </>
  )
}
