/**
 * components/guides/GuideHero.tsx
 *
 * Guide detail hero — side-by-side layout: text (left) + image (right).
 * Matches the prototype layout from preview.html.
 */

import Image from 'next/image'
import type { Guide } from '../../lib/guides'
import type { Locale } from '../../i18n'

interface Props {
  guide:  Guide
  locale: Locale
}

export function GuideHero({ guide, locale }: Props) {
  const isES        = locale === 'es'
  const title       = isES ? guide.title_es       : guide.title_en
  const excerpt     = isES ? guide.excerpt_es     : guide.excerpt_en
  const destination = isES ? guide.destination_es : guide.destination_en
  const tags        = isES ? guide.tags_es        : guide.tags_en

  return (
    <section
      className="border-b"
      style={{ background: '#FAF8F5', borderColor: 'rgba(200,191,181,0.5)' }}
    >
      <div className="max-w-[900px] mx-auto px-7 py-12 max-[768px]:py-8">

        {/* Two-column grid: text left, image right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

          {/* Left — text */}
          <div>
            {/* Destination eyebrow */}
            <span className="font-mono text-[9px] font-medium tracking-[.16em] uppercase text-[#6B8F86] block mb-4">
              {destination}
            </span>

            {/* Title */}
            <h1
              className="font-sans font-bold text-[#0F3A33] leading-[1.05] tracking-[-1px] mb-5"
              style={{ fontSize: 'clamp(28px, 4.5vw, 44px)' }}
            >
              {title}
            </h1>

            {/* Excerpt */}
            <p className="font-sans text-[15px] leading-[1.75] text-[#4A4A46] mb-6 max-w-[440px]">
              {excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 5).map(tag => (
                <span
                  key={tag}
                  className="font-sans text-[11px] font-medium px-3 py-1 rounded-full"
                  style={{ background: 'rgba(107,143,134,.13)', color: '#6B8F86' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div
            className="relative w-full overflow-hidden rounded-[22px] border"
            style={{
              aspectRatio: '4/3',
              borderColor: 'rgba(200,191,181,0.5)',
              boxShadow: '0 2px 12px rgba(15,58,51,.08)',
            }}
          >
            <Image
              src={guide.cover_img}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
