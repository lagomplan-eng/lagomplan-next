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
      className="fixed top-0 left-0 right-0 z-[400] p-3 sm:p-5 print:hidden pointer-events-none"
    >
      <div className="max-w-[680px] mx-auto bg-white border border-[#E4DFD8] rounded-[14px] shadow-[0_8px_32px_rgba(15,58,51,.15)] p-5 sm:p-6 pointer-events-auto">
        <h3 className="font-display text-[17px] font-medium text-[#1C1C1A] mb-2 tracking-[-0.01em]">
          {isES ? 'Tu privacidad importa' : 'Your privacy matters'}
        </h3>
        <p className="text-[13px] font-light text-[#5F5F5B] leading-[1.6] mb-4">
          {isES
            ? <>Usamos cookies esenciales para que el sitio funcione (sesión, preferencias) y cookies opcionales para entender cómo se usa Lagomplan (Google Analytics, Meta Pixel). Tú decides.{' '}
                <Link href="/privacy" className="underline text-[#0F3A33] hover:text-[#12453d]">Más información</Link>.</>
            : <>We use essential cookies so the site works (session, preferences) and optional cookies to understand how Lagomplan is used (Google Analytics, Meta Pixel). You decide.{' '}
                <Link href="/privacy" className="underline text-[#0F3A33] hover:text-[#12453d]">Learn more</Link>.</>}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => decide('essential')}
            className="flex-1 bg-white text-[#0F3A33] text-[13px] font-medium px-4 py-[10px] rounded-[8px] border border-[#CEC8C0] hover:bg-[#EDE7E1] transition-colors"
          >
            {isES ? 'Solo esenciales' : 'Essential only'}
          </button>
          <button
            onClick={() => decide('all')}
            className="flex-1 bg-[#0F3A33] text-white text-[13px] font-medium px-4 py-[10px] rounded-[8px] hover:bg-[#12453d] transition-colors"
          >
            {isES ? 'Aceptar todas' : 'Accept all'}
          </button>
        </div>
      </div>
    </div>
  )
}
