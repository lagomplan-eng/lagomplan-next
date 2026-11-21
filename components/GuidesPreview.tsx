import { Link } from '../lib/navigation'
import { getAllGuides } from '../lib/guides'
import { getGuideUrl } from '../lib/routes'
import type { Locale } from '../i18n'
import { Button, DestinationCard, SectionTitle } from './design'

export default function GuidesPreview({ locale }: { locale: Locale }) {
  const guides = getAllGuides(locale).slice(0, 3)

  return (
    <section className="page-inner py-16">
      <div className="flex items-end justify-between gap-6 mb-8">
        <SectionTitle className="max-w-3xl" eyebrow={locale === 'es' ? 'Destinos' : 'Destinations'}>
          {locale === 'es'
            ? 'Los destinos que vale la pena conocer, y cómo vivirlos bien.'
            : 'The destinations worth knowing, and how to experience them right.'}
        </SectionTitle>

        <Button as={Link} href="/guides" variant="ghost" className="hidden md:inline-flex">
          {locale === 'es' ? 'Ver más guías →' : 'See more guides →'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {guides.map((guide) => (
          <DestinationCard
            key={guide.slug}
            href={getGuideUrl(locale, guide)}
            image={{ src: guide.cover_img, alt: guide.title }}
            title={guide.title}
            excerpt={guide.excerpt}
          />
        ))}
      </div>

      <div className="mt-8 md:hidden">
        <Button as={Link} href="/guides" variant="ghost">
          {locale === 'es' ? 'Ver más guías →' : 'See more guides →'}
        </Button>
      </div>
    </section>
  )
}
