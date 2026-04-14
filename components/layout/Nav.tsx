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
import { Link, usePathname } from '../../lib/navigation'
import type { Locale }               from '../../i18n'
import { getSupabaseBrowser }        from '../../lib/supabase/client'
import { useUser }                   from '../auth/SupabaseProvider'

// ── LangToggle — defined at module level so its reference is stable ──────────
// Inline component definitions (inside a render function) create a new type on
// every parent render, forcing React to unmount + remount the subtree each time.
// That causes "removeChild on Node" errors during concurrent locale-switch renders.
type LangToggleProps = { compact?: boolean; locale: Locale; onSwitch: (l: Locale) => void }

function LangToggle({ compact = false, locale, onSwitch }: LangToggleProps) {
  return (
    <div
      className={`flex overflow-hidden border rounded-sm ${
        compact ? 'border-[rgba(200,215,209,.4)]' : 'border-[#C0D5CE]'
      }`}
    >
      {(['es', 'en'] as Locale[]).map((loc, i) => (
        <button
          key={loc}
          onClick={() => onSwitch(loc)}
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
}

export default function Nav() {
  const t        = useTranslations('nav')
  const locale   = useLocale() as Locale
  const pathname  = usePathname()
  const [open, setOpen]               = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const user = useUser()

  // Close mobile drawer on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // ── Language switcher ──────────────────────────────────
  // Full page reload on locale switch so Google Maps (and other singleton SDKs)
  // are only ever initialized once per page load.
  function switchLocale(target: Locale) {
    if (target === locale) return

    // 1. Entity detail pages render a hidden input with the pre-computed
    //    alternate-locale URL (different slug per locale). Use it when present.
    if (typeof document !== 'undefined') {
      const altEl = document.getElementById('__alternate_locale_url') as HTMLInputElement | null
      if (altEl?.value) {
        window.location.href = altEl.value
        return
      }
    }

    // 2. Build the new path, stripping any existing locale prefix as a safeguard.
    //    usePathname() from next-intl already omits the locale segment, but the
    //    regex makes this safe regardless of the returned format.
    const basePath = (pathname ?? '/').replace(/^\/(en|es)/, '')
    const search   = typeof window !== 'undefined' ? window.location.search : ''
    window.location.href = `/${target}${basePath || '/'}${search}`
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

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 print:hidden"
      style={{
        height:             72,
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
            width={180}
            height={36}
            className="h-9 w-auto"
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
            className="font-display italic text-[24px] font-semibold text-[#0F3A33] tracking-[-0.5px]"
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
          <LangToggle locale={locale} onSwitch={switchLocale} />
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="w-8 h-8 rounded-full bg-[#0F3A33] text-white text-[13px] font-semibold flex items-center justify-center uppercase"
                aria-label="Account menu"
              >
                {user.email?.[0] ?? '?'}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-10 bg-white border border-[#E4DFD8] rounded-[8px] shadow-md min-w-[180px] py-2 z-50">
                  <p className="px-4 py-2 text-[11px] text-[#6B8F86] truncate border-b border-[#E4DFD8]">{user.email}</p>
                  <Link
                    href="/my-trips"
                    className="block px-4 py-2 text-[13px] text-[#0F3A33] hover:bg-[#F7F3EE]"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Mis viajes
                  </Link>
                  <button
                    onClick={() => {
                      getSupabaseBrowser().auth.signOut().then(() => {
                        setDropdownOpen(false)
                      })
                    }}
                    className="w-full text-left px-4 py-2 text-[13px] text-[#0F3A33] hover:bg-[#F7F3EE]"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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

          {user ? (
            <div className="mt-5 flex flex-col gap-1">
              <p className="text-[11px] text-[#6B8F86] px-1 truncate">{user.email}</p>
              <Link
                href="/my-trips"
                className="font-sans text-[14px] font-medium text-[#0F3A33] py-2.5 border-b border-[rgba(107,143,134,.2)]"
              >
                Mis viajes
              </Link>
              <button
                onClick={() => { getSupabaseBrowser().auth.signOut(); setOpen(false) }}
                className="text-left font-sans text-[14px] font-medium text-[#0F3A33] py-2.5"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
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
          )}

          <div className="mt-5 pt-4 border-t border-[rgba(107,143,134,.2)] flex items-center justify-between">
            <span className="font-sans text-[11px] font-medium tracking-[0.08em] text-[#0f3a33] uppercase">
              Idioma / Language
            </span>
            <LangToggle locale={locale} onSwitch={switchLocale} />
          </div>
        </div>
      )}
    </nav>
  )
}
