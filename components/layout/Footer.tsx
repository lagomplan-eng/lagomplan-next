/**
 * components/layout/Footer.tsx
 *
 * Changes vs previous version:
 *  All hardcoded hrefs (/guias, /hoteles, /trip-generator, /nosotros, /contacto,
 *  /politicas-de-privacidad) replaced with Link from lib/navigation.ts
 *  using internal path keys. next-intl resolves to the correct localized URL.
 */

import Image                        from 'next/image'
import NextLink                    from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link }                    from '../../lib/navigation'
import { CookieSettingsButton }    from '../consent/CookieSettingsButton'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

export default async function Footer() {
  const [t, locale] = await Promise.all([
    getTranslations('footer'),
    getLocale(),
  ])
  const year = new Date().getFullYear()

  const exploreLinks = [
    { key: '/guides',  labelKey: 'links.guides'  },
    { key: '/hotels',  labelKey: 'links.hotels'  },
    { key: '/planner', labelKey: 'links.planner' },
  ] as const

  const connectLinks = [
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
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Lagomplan"
                width={120} height={22}
                className="h-[22px] w-auto mb-3"
              />
            </Link>
            <p className="font-sans text-[13px] text-[#6B8F86] leading-[1.65] max-w-[220px] mb-3">
              {t('tagline')}
            </p>
            <p className="font-mono text-[10px] text-[#6B8F86] mb-4">
              {t('email')}
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/lagomplantravel/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-[18px] h-[18px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61582151266836"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-[18px] h-[18px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/company/lagomplan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-[18px] h-[18px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors" />
              </a>
            </div>
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
            {/* Nosotras → homepage anchor, not a separate page */}
            <NextLink
              href={`/${locale}#nosotras`}
              className="block font-sans text-[13px] text-[#0F3A33] mb-2 hover:text-[#6B8F86] transition-colors"
            >
              {t('links.about')}
            </NextLink>
            {connectLinks.map(({ key, labelKey }) => (
              <Link
                key={key}
                href={key}
                className="block font-sans text-[13px] text-[#0F3A33] mb-2 hover:text-[#6B8F86] transition-colors"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="pt-5 flex items-center justify-between flex-wrap gap-3"
          style={{ borderTop: '1px solid rgba(107,143,134,.25)' }}
        >
          <p className="font-sans text-[11px] text-[#6B8F86]">
            {t('copyright', { year })}
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="font-sans text-[11px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors"
            >
              {t('terms')}
            </Link>
            <Link
              href="/privacy"
              className="font-sans text-[11px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/cookies"
              className="font-sans text-[11px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors"
            >
              {t('cookies')}
            </Link>
            <CookieSettingsButton
              label={locale === 'es' ? 'Configuración de cookies' : 'Cookie settings'}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
