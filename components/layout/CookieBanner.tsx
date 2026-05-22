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

import { useEffect, useRef, useState } from 'react'
import { useLocale }           from 'next-intl'
import { Link }                from '../../lib/navigation'
import { getConsent, setConsent, onConsentChange, isGPCEnabled } from '../../lib/consent'

export default function CookieBanner() {
  const locale = useLocale()
  const isES   = locale === 'es'
  const [visible, setVisible] = useState(false)
  const barRef                = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Defer the visibility check to the client — server render shouldn't
    // emit the banner since localStorage is unreachable.
    if (getConsent() === null) {
      // Honor Global Privacy Control silently. Browsers like Firefox,
      // Brave, DuckDuckGo and most privacy extensions send this signal
      // to mean "I do not want to be tracked." CCPA mandates honoring
      // it; EU regulators treat it as a valid withdrawal of consent.
      // We record an 'essential' decision so the banner never appears
      // for this user — they explicitly told us their preference via
      // the browser.
      if (isGPCEnabled()) {
        setConsent('essential')
        return
      }
      setVisible(true)
    }
    // React to clearConsent() from the footer link: when state goes back
    // to null, re-open the banner. The same subscription also catches
    // setConsent() events but those flip the state to a non-null value,
    // which means the user just chose — keep the banner hidden.
    return onConsentChange(state => setVisible(state === null))
  }, [])

  // While visible, publish the bar's height as a CSS variable on <html>.
  // Nav reads it for its `top` offset and body uses it as padding-top so
  // every page shifts down by the bar's height — making the bar truly
  // sit ABOVE the nav rather than overlay it. ResizeObserver keeps the
  // var in sync on viewport changes (mobile 2-row layout, copy edits).
  useEffect(() => {
    if (!visible) return
    const el = barRef.current
    if (!el) return
    const update = () => {
      document.documentElement.style.setProperty('--cookie-banner-h', `${el.offsetHeight}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty('--cookie-banner-h')
    }
  }, [visible])

  if (!visible) return null

  function decide(value: 'all' | 'essential') {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div
      ref={barRef}
      role="dialog"
      aria-live="polite"
      aria-label={isES ? 'Aviso de cookies' : 'Cookie notice'}
      className="fixed top-0 left-0 right-0 z-[400] print:hidden bg-white border-b border-[rgba(107,143,134,.2)]"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-2 sm:py-[10px] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
        <p className="flex-1 font-sans text-[11.5px] sm:text-[12px] font-light text-[#5F5F5B] leading-[1.5]">
          {isES
            ? <><span className="font-medium text-[#0F3A33]">Tu privacidad importa.</span>{' '}Usamos cookies esenciales para que el sitio funcione y cookies opcionales para entender cómo se usa Lagomplan (Google Analytics, Meta Pixel).{' '}
                <Link href="/privacy" className="underline text-[#0F3A33] hover:text-[#12453d]">Más información</Link>.</>
            : <><span className="font-medium text-[#0F3A33]">Your privacy matters.</span>{' '}We use essential cookies so the site works and optional cookies to understand how Lagomplan is used (Google Analytics, Meta Pixel).{' '}
                <Link href="/privacy" className="underline text-[#0F3A33] hover:text-[#12453d]">Learn more</Link>.</>}
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => decide('essential')}
            className="flex-1 sm:flex-none bg-white text-[#0F3A33] text-[11.5px] font-medium px-3.5 py-[6px] rounded-[6px] border border-[#C0D5CE] hover:bg-[#E4EFEC] transition-colors whitespace-nowrap"
          >
            {isES ? 'Solo esenciales' : 'Essential only'}
          </button>
          <button
            onClick={() => decide('all')}
            className="flex-1 sm:flex-none bg-[#0F3A33] text-white text-[11.5px] font-medium px-3.5 py-[6px] rounded-[6px] hover:bg-[#12453d] transition-colors whitespace-nowrap"
          >
            {isES ? 'Aceptar todas' : 'Accept all'}
          </button>
        </div>
      </div>
    </div>
  )
}
