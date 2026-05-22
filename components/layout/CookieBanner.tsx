'use client'

/**
 * components/layout/CookieBanner.tsx
 *
 * First-paint cookie/RGPD consent bar. Renders only when getConsent()
 * returns null (no prior decision). Two paths:
 *
 *   - Accept all     → setConsent('all')      → ConsentSync grants GA + loads Meta Pixel
 *   - Essential only → setConsent('essential') → ConsentSync keeps both denied
 *
 * Decision persists in localStorage. To re-prompt (e.g. testing), run
 * `localStorage.removeItem('lagomplan-consent')` and reload.
 *
 * ES/EN copy via inline isES ternary — matches the pattern used across
 * recent en-locale leak fixes. Link to /privacy uses the typed Link
 * from lib/navigation so it routes through the i18n pathname table.
 */

import { useEffect, useState } from 'react'
import { useLocale }           from 'next-intl'
import { Link }                from '../../lib/navigation'
import { getConsent, setConsent } from '../../lib/consent'

export default function CookieBanner() {
  const locale = useLocale()
  const isES   = locale === 'es'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Defer the visibility check to the client — server render shouldn't
    // emit the banner since localStorage is unreachable. Once mounted,
    // show only if no decision has been recorded yet.
    if (getConsent() === null) setVisible(true)
  }, [])

  if (!visible) return null

  function decide(value: 'all' | 'essential') {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isES ? 'Aviso de cookies' : 'Cookie notice'}
      className="fixed top-0 left-0 right-0 z-[400] print:hidden bg-white border-b border-[#E4DFD8] shadow-[0_4px_20px_rgba(15,58,51,.08)]"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <p className="flex-1 text-[12.5px] sm:text-[13px] font-light text-[#5F5F5B] leading-[1.55]">
          {isES
            ? <><span className="font-medium text-[#1C1C1A]">Tu privacidad importa.</span>{' '}Usamos cookies esenciales para que el sitio funcione y cookies opcionales para entender cómo se usa Lagomplan (Google Analytics, Meta Pixel).{' '}
                <Link href="/privacy" className="underline text-[#0F3A33] hover:text-[#12453d]">Más información</Link>.</>
            : <><span className="font-medium text-[#1C1C1A]">Your privacy matters.</span>{' '}We use essential cookies so the site works and optional cookies to understand how Lagomplan is used (Google Analytics, Meta Pixel).{' '}
                <Link href="/privacy" className="underline text-[#0F3A33] hover:text-[#12453d]">Learn more</Link>.</>}
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => decide('essential')}
            className="flex-1 sm:flex-none bg-white text-[#0F3A33] text-[12.5px] font-medium px-4 py-[8px] rounded-[6px] border border-[#CEC8C0] hover:bg-[#EDE7E1] transition-colors whitespace-nowrap"
          >
            {isES ? 'Solo esenciales' : 'Essential only'}
          </button>
          <button
            onClick={() => decide('all')}
            className="flex-1 sm:flex-none bg-[#0F3A33] text-white text-[12.5px] font-medium px-4 py-[8px] rounded-[6px] hover:bg-[#12453d] transition-colors whitespace-nowrap"
          >
            {isES ? 'Aceptar todas' : 'Accept all'}
          </button>
        </div>
      </div>
    </div>
  )
}
