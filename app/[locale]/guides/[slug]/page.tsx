import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Link } from '../../../../lib/navigation'
import { getGuideBySlug, getAllGuideParams } from '../../../../lib/guides'
import { buildGuideAlternates, buildOpenGraph } from '../../../../lib/seo'
import { getGuideUrl } from '../../../../lib/routes'
import type { Locale } from '../../../../i18n'

type Props = {
  params: { locale: Locale; slug: string }
}

export function generateStaticParams() {
  return getAllGuideParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params
  const guide = getGuideBySlug(locale, slug)

  if (!guide) return { title: '404' }

  const title = locale === 'es' ? guide.title_es : guide.title_en
  const description = locale === 'es' ? guide.excerpt_es : guide.excerpt_en
  const alternates = buildGuideAlternates(guide)

  return {
    title,
    description,
    alternates,
    openGraph: buildOpenGraph(locale, {
      title,
      description,
      type: 'article',
      images: [{ url: guide.cover_img, width: 1200, height: 630, alt: title }],
    }),
  }
}

export default function GuideDetailPage({ params }: Props) {
  const { locale, slug } = params
  const guide = getGuideBySlug(locale, slug)

  if (!guide) notFound()

  const isES = locale === 'es'
  const title = isES ? guide.title_es : guide.title_en
  const excerpt = isES ? guide.excerpt_es : guide.excerpt_en
  const destination = isES ? guide.destination_es : guide.destination_en
  const tags = isES ? guide.tags_es : guide.tags_en

  const alternateLang: Locale = isES ? 'en' : 'es'
  const alternateUrl = getGuideUrl(alternateLang, guide)

  return (
    <main className="pt-[64px] min-h-screen" style={{ background: '#EDE7E1' }}>
      <input type="hidden" id="__alternate_locale_url" value={alternateUrl} />

      <div style={{ background: '#EDE7E1' }}>
        <div className="page-inner pt-12 pb-0 max-[768px]:pt-8">
          <nav className="flex items-center gap-2 mb-8" aria-label="breadcrumb">
            <Link
              href="/guides"
              className="font-sans text-[12px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors"
            >
              {isES ? 'Guías' : 'Guides'}
            </Link>
            <span className="text-[#6B8F86] text-[12px]">/</span>
            <span className="font-sans text-[12px] text-[#0F3A33]">{title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="font-sans text-[11px] font-medium tracking-[0.1em] uppercase text-[#6B8F86]">
              {destination}
            </span>
            <span className="text-[#C8BFB5]">·</span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-sans text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(107,143,134,.12)', color: '#0F3A33' }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-sans text-[48px] max-[768px]:text-[34px] font-bold text-[#0F3A33] leading-[1.05] tracking-[-1.5px] mb-5">
            {title}
          </h1>

          <p className="font-sans text-[17px] max-[768px]:text-[15px] text-[#6B8F86] leading-[1.7] max-w-[640px] mb-10">
            {excerpt}
          </p>
        </div>

        <div className="page-inner pb-0">
          <div
            className="w-full overflow-hidden relative"
            style={{ borderRadius: '12px 12px 0 0', aspectRatio: '16/7' }}
          >
            <Image
              src={guide.cover_img}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1160px"
            />
          </div>
        </div>
      </div>

      <div className="page-inner py-14 max-[768px]:py-10">
        <div
          className="grid max-[1024px]:grid-cols-1"
          style={{ gridTemplateColumns: '1fr 300px', gap: '56px', alignItems: 'start' }}
        >
          <article>
            {guide.sections.map((section, i) => {
              const heading = isES ? section.heading_es : section.heading_en
              const body = isES ? section.body_es : section.body_en
              const tip = isES ? section.tip_es : section.tip_en

              return (
                <section
                  key={i}
                  className={i > 0 ? 'pt-10 mt-10' : ''}
                  style={i > 0 ? { borderTop: '1px solid rgba(107,143,134,.2)' } : undefined}
                >
                  <h2 className="font-sans text-[22px] font-bold text-[#0F3A33] mb-4 leading-[1.2]">
                    {heading}
                  </h2>
                  <p className="font-sans text-[15px] text-[#0F3A33] leading-[1.8]">
                    {body}
                  </p>

                  {tip && (
                    <div
                      className="mt-5 flex gap-3 px-4 py-4 rounded-[8px]"
                      style={{ background: 'rgba(107,143,134,.1)', borderLeft: '3px solid #6B8F86' }}
                    >
                      <span className="text-[16px] flex-shrink-0 mt-0.5">💡</span>
                      <p className="font-sans text-[13px] text-[#0F3A33] leading-[1.65]">
                        <strong className="font-semibold">
                          {isES ? 'Lagom tip:' : 'Lagom tip:'}
                        </strong>{' '}
                        {tip}
                      </p>
                    </div>
                  )}
                </section>
              )
            })}

            <div
              className="mt-14 pt-10"
              style={{ borderTop: '1px solid rgba(107,143,134,.2)' }}
            >
              <Link
                href="/guides"
                className="font-sans text-[13px] font-medium text-[#0F3A33] hover:text-[#6B8F86] transition-colors inline-flex items-center gap-2"
              >
                ← {isES ? 'Ver todas las guías' : 'See all guides'}
              </Link>
            </div>
          </article>

          <aside
            className="flex flex-col gap-5 max-[1024px]:hidden"
            style={{ position: 'sticky', top: '88px' }}
          >
            <SidebarBlock
              eyebrow={isES ? 'Hoteles en ' + destination : 'Hotels in ' + destination}
              headline={isES ? 'Dónde quedarse' : 'Where to stay'}
              body={isES
                ? 'Selección curada de alojamiento en este destino.'
                : 'Curated accommodation selection for this destination.'}
              cta={isES ? 'Ver hoteles' : 'See hotels'}
              href="/hotels"
              accent="#2D4F6C"
            />

            <SidebarBlock
              eyebrow={isES ? 'Actividades' : 'Experiences'}
              headline={isES ? 'Tours y experiencias' : 'Tours & experiences'}
              body={isES
                ? 'Reserva tours locales con guías expertos.'
                : 'Book local tours with expert guides.'}
              cta={isES ? 'Ver actividades' : 'See experiences'}
              href="/planner"
              accent="#6B8F86"
              note="Via Viator · GetYourGuide"
            />

            <SidebarBlock
              eyebrow={isES ? 'Productos de viaje' : 'Smart finds'}
              headline={isES ? 'Lo que llevarías nosotras' : "What we'd pack"}
              body={isES
                ? 'Selección editorial de productos para este tipo de viaje.'
                : 'Editorial selection of products for this type of trip.'}
              cta={isES ? 'Ver selección' : 'See selection'}
              href="/smart-finds"
              accent="#E1615B"
            />
          </aside>
        </div>
      </div>
    </main>
  )
}

function SidebarBlock({
  eyebrow,
  headline,
  body,
  cta,
  href,
  accent,
  note,
}: {
  eyebrow: string
  headline: string
  body: string
  cta: string
  href: string
  accent: string
  note?: string
}) {
  return (
    <div
      className="rounded-[12px] p-5"
      style={{ background: '#FFF9F3', border: '1px solid rgba(107,143,134,.18)' }}
    >
      <p
        className="font-sans text-[10px] font-medium tracking-[0.1em] uppercase mb-2"
        style={{ color: accent }}
      >
        {eyebrow}
      </p>
      <p className="font-sans text-[14px] font-semibold text-[#0F3A33] mb-1.5 leading-[1.3]">
        {headline}
      </p>
      <p className="font-sans text-[12px] text-[#6B8F86] leading-[1.6] mb-3">
        {body}
      </p>
      <Link
        href={href as any}
        className="font-sans text-[12px] font-semibold inline-flex items-center gap-1 transition-colors"
        style={{ color: accent }}
      >
        {cta} →
      </Link>
      {note && (
        <p className="font-sans text-[10px] mt-2" style={{ color: 'rgba(107,143,134,.6)' }}>
          {note}
        </p>
      )}
    </div>
  )
}
