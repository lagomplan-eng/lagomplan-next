/**
 * components/layout/Footer.tsx
 *
 * Changes vs previous version:
 *  All hardcoded hrefs (/guias, /hoteles, /trip-generator, /nosotros, /contacto,
 *  /politicas-de-privacidad) replaced with Link from lib/navigation.ts
 *  using internal path keys. next-intl resolves to the correct localized URL.
 */

import Image                 from 'next/image'
import { getTranslations }   from 'next-intl/server'
import { Link }              from '../../lib/navigation'

export default async function Footer() {
  const t    = await getTranslations('footer')
  const year = new Date().getFullYear()

  const exploreLinks = [
    { key: '/guides',  labelKey: 'links.guides'  },
    { key: '/hotels',  labelKey: 'links.hotels'  },
    { key: '/planner', labelKey: 'links.planner' },
  ] as const

  const connectLinks = [
    { key: '/about',   labelKey: 'links.about'   },
    { key: '/contact', labelKey: 'links.contact' },
  ] as const

  return (
    <footer
      className="pt-12 pb-6"
      style={{ background: '#FFFFFF', borderTop: '1px solid rgba(107,143,134,.25)' }}
    >
      <div className="page-inner">
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-10 mb-10">

          {/* Brand column */}
          <div>
            <Image
              src="/images/logo.png"
              alt="Lagomplan"
              width={120} height={22}
              className="h-[22px] w-auto mb-3"
            />
            <p className="font-sans text-[13px] text-[#6B8F86] leading-[1.65] max-w-[220px] mb-3">
              {t('tagline')}
            </p>
            <p className="font-mono text-[10px] text-[#6B8F86]">
              {t('email')}
            </p>
          </div>

          {/* Explore column */}
          <div>
            <p className="font-sans text-[11px] font-medium tracking-[0.1em] text-[#6B8F86] uppercase mb-4">
              {t('explore')}
            </p>
            {exploreLinks.map(({ key, labelKey }) => (
              <Link
                key={key}
                href={key}
                className="block font-sans text-[13px] text-[#0F3A33] mb-2 hover:text-[#6B8F86] transition-colors"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>

          {/* Connect column */}
          <div>
            <p className="font-sans text-[11px] font-medium tracking-[0.1em] text-[#6B8F86] uppercase mb-4">
              {t('connect')}
            </p>
            {connectLinks.map(({ key, labelKey }) => (
              <Link
                key={key}
                href={key}
                className="block font-sans text-[13px] text-[#0F3A33] mb-2 hover:text-[#6B8F86] transition-colors"
              >
                {t(labelKey)}
              </Link>
            ))}
            <a
              href="https://instagram.com/lagomplantravel"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-sans text-[13px] text-[#0F3A33] mb-2 hover:text-[#6B8F86] transition-colors"
            >
              {t('links.instagram')}
            </a>
          </div>
        </div>

        <div
          className="pt-5 flex items-center justify-between flex-wrap gap-3"
          style={{ borderTop: '1px solid rgba(107,143,134,.25)' }}
        >
          <p className="font-sans text-[11px] text-[#6B8F86]">
            {t('copyright', { year })}
          </p>
          <Link
            href="/privacy"
            className="font-sans text-[11px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
