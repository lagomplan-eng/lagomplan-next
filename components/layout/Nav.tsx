/**
 * components/layout/Nav.tsx
 *
 * Changes vs previous version:
 * ─────────────────────────────────────────────────────────
 * 1. useRouter + usePathname now imported from lib/navigation.ts (typed, pathnames-aware)
 *    — the old manual /en strip/add regex is completely removed.
 *
 * 2. Language switcher uses router.replace(pathname, { locale }) from next-intl.
 *    For entity detail pages that need a different slug in the target locale,
 *    pages should render <input type="hidden" id="__alternate_locale_url" value="..." />
 *    and this component reads it before falling back to router.replace.
 *
 * 3. All nav hrefs use Link from lib/navigation.ts (typed internal paths).
 *    No hardcoded /guias, /hoteles, /planificador, /iniciar-sesion, /crear-cuenta.
 *
 * 4. Colors updated to brand guide: Pine #0F3A33, Sand #EDE7E1, Pine #0f3a33.
 *    CTA uses Pine #0F3A33 text-white hover:bg-[#0c2f29].
 */

'use client'

import { useState, useEffect }       from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Image                          from 'next/image'
import { Link, usePathname, useRouter } from '../../lib/navigation'
import type { Locale }               from '../../i18n'

export default function Nav() {
  const t        = useTranslations('nav')
  const locale   = useLocale() as Locale
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  // Close mobile drawer on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // ── Language switcher ──────────────────────────────────
  // Uses next-intl's router.replace which understands the pathnames map.
  // For entity detail pages that expose an alternate-locale URL via a
  // hidden input (set by the page itself), we navigate there directly.
  function switchLocale(target: Locale) {
    if (target === locale) return

    // Check if the current page has provided an explicit alternate URL
    // (entity detail pages with different slugs per locale set this)
    if (typeof document !== 'undefined') {
      const el = document.getElementById('__alternate_locale_url') as HTMLInputElement | null
      if (el?.value) {
        router.push(el.value as any)
        return
      }
    }

    // Default: let next-intl translate the current path to the target locale
    router.replace(pathname as any, { locale: target })
  }

  // ── Nav links (internal paths → next-intl translates) ─
  const navLinks = [
    { key: 'planner' as const,     label: t('planner') },
    { key: 'guidesIndex' as const, label: t('guides')  },
    { key: 'hotelsIndex' as const, label: t('hotels')  },
  ]

  // Internal paths for Link href (must match pathnames keys in i18n.ts)
  const LINK_PATHS = {
    planner:     '/planner',
    guidesIndex: '/guides',
    hotelsIndex: '/hotels',
    login:       '/login',
    signup:      '/signup',
  } as const

  // ── Reusable lang toggle ───────────────────────────────
  const LangToggle = ({ compact = false }) => (
    <div
      className={`flex overflow-hidden border rounded-sm ${
        compact ? 'border-[rgba(200,215,209,.4)]' : 'border-[#C0D5CE]'
      }`}
    >
      {(['es', 'en'] as Locale[]).map((loc, i) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={[
            'text-[9px] tracking-[1.5px] uppercase px-3 py-[5px]',
            'cursor-pointer border-none transition-colors font-sans font-medium',
            i > 0 ? 'border-l border-[#C0D5CE]' : '',
            locale === loc
              ? 'bg-[#0F3A33] text-[#EDE7E1]'
              : 'bg-transparent text-[#0f3a33] hover:bg-[#E4EFEC]',
          ].join(' ')}
          aria-label={`Switch to ${loc === 'es' ? 'Español' : 'English'}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height:             64,
        background:         'rgba(255,255,255,1)',
        backdropFilter:     'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom:       '1px solid rgba(107,143,134,.2)',
      }}
    >
      <div className="page-inner h-full flex items-center justify-between gap-6">

        {/* ── Logo ──────────────────────────────────────── */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <Image
            src="/images/logo.png"
            alt="Lagomplan"
            width={140}
            height={28}
            className="h-7 w-auto"
            priority
            onError={e => {
              const img = e.currentTarget as HTMLImageElement
              img.style.display = 'none'
              const fallback = img.nextSibling as HTMLElement | null
              if (fallback) fallback.style.display = 'block'
            }}
          />
          {/* Text fallback until logo.png is placed in /public/images/ */}
          <span
            style={{ display: 'none' }}
            className="font-display italic text-[20px] font-semibold text-[#0F3A33] tracking-[-0.5px]"
          >
            lagomplan
          </span>
        </Link>

        {/* ── Desktop links ─────────────────────────────── */}
        <div className="hide-mobile flex items-center gap-8 ml-10 mr-auto">
          {navLinks.map(({ key, label }) => (
            <Link
              key={key}
              href={LINK_PATHS[key as keyof typeof LINK_PATHS]}
              className="font-sans text-[13px] font-medium text-[#0F3A33] hover:text-[#0f3a33] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Desktop right ─────────────────────────────── */}
        <div className="hide-mobile flex items-center gap-3 flex-shrink-0">
          <LangToggle />
          <Link
            href={LINK_PATHS.login}
            className="font-sans text-[13px] font-medium text-[#0f3a33] px-2 py-1 hover:text-[#0F3A33] transition-colors"
          >
            {t('login')}
          </Link>
          <Link
            href={LINK_PATHS.signup}
            className="font-sans text-[13px] font-semibold bg-[#0f3a33] text-white px-4 py-2 rounded-md hover:bg-[#12453d] transition-colors"
          >
            {t('signup')}
          </Link>
        </div>

        {/* ── Mobile hamburger ──────────────────────────── */}
        <button
          className={`nav-hamburger show-mobile-only ${open ? 'open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile drawer ─────────────────────────────── */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 bg-white px-5 py-5 flex flex-col z-50"
          style={{ borderBottom: '1px solid rgba(107,143,134,.2)', boxShadow: '0 4px 20px rgba(15,58,51,.07)' }}
        >
          {navLinks.map(({ key, label }) => (
            <Link
              key={key}
              href={LINK_PATHS[key as keyof typeof LINK_PATHS]}
              className="font-sans text-[15px] font-medium text-[#0F3A33] py-3.5 border-b border-[rgba(107,143,134,.2)] last:border-0"
            >
              {label}
            </Link>
          ))}

          <div className="flex gap-3 mt-5">
            <Link
              href={LINK_PATHS.login}
              className="flex-1 font-sans text-[13px] font-medium text-[#0F3A33] border border-[#C0D5CE] py-3 text-center rounded-md"
            >
              {t('login')}
            </Link>
            <Link
              href={LINK_PATHS.signup}
              className="flex-1 font-sans text-[13px] font-semibold bg-[#0F3A33] text-white py-3 text-center rounded-md hover:bg-[#6B8F86]"
            >
              {t('signup')}
            </Link>
          </div>

          <div className="mt-5 pt-4 border-t border-[rgba(107,143,134,.2)] flex items-center justify-between">
            <span className="font-sans text-[11px] font-medium tracking-[0.08em] text-[#0f3a33] uppercase">
              Idioma / Language
            </span>
            <LangToggle />
          </div>
        </div>
      )}
    </nav>
  )
}
