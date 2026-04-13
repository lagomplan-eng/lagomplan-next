import Image from 'next/image'
import { Link } from '../lib/navigation'
import { getAllGuides } from '../lib/guides'
import type { Locale } from '../i18n'

export default function GuidesPreview({ locale }: { locale: Locale }) {
  const guides = getAllGuides(locale).slice(0, 3)

  return (
    <section className="page-inner py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B8F86] mb-2">
            {locale === 'es'
              ? 'Inspiración para tu próximo viaje'
              : 'Inspiration for your next trip'}
          </p>
          <h2 className="text-[28px] md:text-[34px] leading-tight tracking-[-0.03em] text-[#0F3A33]">
            {locale === 'es'
              ? 'Guías con una mirada más tranquila y mejor curada'
              : 'Guides with a calmer, more curated point of view'}
          </h2>
        </div>

        <Link
          href="/guides"
          className="hidden md:inline-flex text-[13px] font-medium text-[#0F3A33] hover:text-[#6B8F86] transition-colors"
        >
          {locale === 'es' ? 'Ver más guías →' : 'See more guides →'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={{ pathname: '/guides/[slug]', params: { slug: guide.slug } }}
            className="group overflow-hidden rounded-[22px] bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#EDE7E1] relative">
              <Image
                src={guide.cover_img}
                alt={guide.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="p-6">
              <h3 className="text-[22px] leading-tight tracking-[-0.02em] text-[#0F3A33] transition group-hover:text-[#2D6B57]">
                {guide.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[#35584F]">
                {guide.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 md:hidden">
        <Link
          href="/guides"
          className="inline-flex text-[13px] font-medium text-[#0F3A33] hover:text-[#6B8F86] transition-colors"
        >
          {locale === 'es' ? 'Ver más guías →' : 'See more guides →'}
        </Link>
      </div>
    </section>
  )
}