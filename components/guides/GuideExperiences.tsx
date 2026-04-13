/**
 * components/guides/GuideExperiences.tsx
 *
 * Bookable experiences grid — replaces the old read-only experience cards.
 * Each card matches the TripResult item style and includes a "Book" CTA
 * linking to Viator with the experience name as the search query.
 */

import type { Experience } from '../../lib/guides'
import type { Locale }     from '../../i18n'

interface Props {
  experiences: Experience[]
  locale:      Locale
  destination: string
}

export function GuideExperiences({ experiences, locale, destination }: Props) {
  const isES = locale === 'es'
  if (experiences.length === 0) return null

  return (
    <section id="experiencias" className="py-12 max-[768px]:py-8 border-t border-[#E4DFD8]" style={{ background: '#EDE7E1' }}>
      <div className="max-w-[900px] mx-auto px-7">

        <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-1">
          {isES ? 'Qué hacer' : 'What to do'}
        </div>
        <h2
          className="font-sans font-bold text-[#0F3A33] tracking-[-0.5px] mb-6"
          style={{ fontSize: 'clamp(18px, 2.4vw, 22px)' }}
        >
          {isES ? 'Experiencias imperdibles' : 'Must-have experiences'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {experiences.map((exp, i) => {
            const expTitle = isES ? exp.title_es       : exp.title_en
            const expDesc  = isES ? exp.description_es : exp.description_en
            const expBadge = isES ? exp.badge_es       : exp.badge_en
            const bookUrl  = `https://www.viator.com/search/tours?q=${encodeURIComponent(expTitle)}&pid=P00165894&mcid=42383`

            return (
              <div
                key={i}
                className="bg-white rounded-[14px] p-5 border border-[#E4DFD8] shadow-[0_1px_2px_rgba(15,58,51,.05)] flex flex-col hover:shadow-[0_2px_8px_rgba(15,58,51,.08)] transition-shadow"
              >
                {/* Badge */}
                <span
                  className="inline-block font-mono text-[9px] font-medium tracking-[.1em] uppercase px-[6px] py-[3px] rounded-[3px] mb-3 self-start"
                  style={{ background: 'rgba(107,143,134,.14)', color: '#6B8F86' }}
                >
                  {expBadge}
                </span>

                {/* Title */}
                <h3 className="font-sans text-[14px] font-semibold text-[#0F3A33] mb-2 leading-[1.3] flex-1">
                  {expTitle}
                </h3>

                {/* Description */}
                <p className="font-sans text-[12px] leading-[1.7] text-[#7A7A76] mb-4">
                  {expDesc}
                </p>

                {/* CTA */}
                <a
                  href={bookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] font-medium tracking-[.06em] uppercase text-white bg-[#0F3A33] px-3 py-[7px] rounded-[6px] hover:bg-[#1A5247] transition-colors text-center"
                >
                  {isES ? 'Reservar' : 'Book'} →
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
