/**
 * app/[locale]/guides/page.tsx
 * Guides index: /es/guias | /en/guides
 */

import type { Metadata }         from 'next'
import Image                      from 'next/image'
import { getAllGuides }            from '../../../lib/guides'
import { getGuideUrl }            from '../../../lib/routes'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale }            from '../../../i18n'

type Props = { params: { locale: Locale } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return {
    title:       locale === 'es' ? 'Guías de viaje' : 'Travel guides',
    description: locale === 'es'
      ? 'Guías editoriales para viajeros con criterio. Destinos, itinerarios y tips sin ruido.'
      : 'Editorial guides for travelers with taste. Destinations, itineraries, and noise-free tips.',
    alternates:  buildAlternates('guidesIndex'),
    openGraph:   buildOpenGraph(locale),
  }
}

export default function GuidesIndexPage({ params: { locale } }: Props) {
  const guides = getAllGuides()
  const isES   = locale === 'es'

  return (
    <main className="pt-[64px] min-h-screen" style={{ background: '#EDE7E1' }}>
      <div className="page-inner py-16 max-[768px]:py-10">

        {/* Header */}
        <div className="mb-14 max-w-[560px]">
          <span className="sec-label">{isES ? 'Guías de viaje' : 'Travel guides'}</span>
          <h1 className="font-sans text-[48px] max-[768px]:text-[34px] font-bold text-[#0F3A33] leading-[1.05] tracking-[-1.5px] mb-4">
            {isES
              ? <>Destinos que<br /><em className="font-display" style={{ fontStyle: 'italic' }}>conocemos bien.</em></>
              : <>Destinations we<br /><em className="font-display" style={{ fontStyle: 'italic' }}>know well.</em></>}
          </h1>
          <p className="font-sans text-[15px] text-[#6B8F86] leading-[1.7]">
            {isES
              ? 'Guías editoriales con criterio real — sin listas genéricas ni ads disfrazados de contenido.'
              : 'Editorial guides with real taste — no generic lists or ads disguised as content.'}
          </p>
        </div>

        {/* Guide grid */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-14 max-[768px]:grid-cols-1 max-[1024px]:grid-cols-2">
          {guides.map(guide => {
            const title = isES ? guide.title_es : guide.title_en
            const tags  = isES ? guide.tags_es  : guide.tags_en
            const dest  = isES ? guide.destination_es : guide.destination_en
            const url   = getGuideUrl(locale, guide)

            return (
              <a key={guide.slug_es} href={url} className="guide-card block group text-[#0F3A33] no-underline">
                <div className="guide-img-wrap mb-4">
                  <Image
                    src={guide.cover_img}
                    alt={title}
                    width={480} height={320}
                    className="guide-img"
                  />
                </div>
                <p className="font-sans text-[11px] font-medium tracking-[0.08em] uppercase text-[#6B8F86] mb-1.5">
                  {dest}
                </p>
                <p className="font-sans text-[18px] font-semibold text-[#0F3A33] leading-[1.3] mb-2">
                  {title}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="font-sans text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(107,143,134,.12)', color: '#6B8F86' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </main>
  )
}
