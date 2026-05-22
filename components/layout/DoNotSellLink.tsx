'use client'

/**
 * components/layout/DoNotSellLink.tsx
 *
 * Footer link for the CCPA / CPRA "Do Not Sell or Share My Personal
 * Information" right. California residents can disable the
 * cross-context behavioral advertising that Meta Pixel (and similar
 * tags) enable. CPRA expanded "sale" to also cover "sharing" — same
 * link covers both.
 *
 * Behavior on click:
 *   1. Persist consent='essential' (same path as the banner's
 *      "Essential only" button). GA Consent Mode flips to denied
 *      and Meta Pixel won't be re-injected on the next page load.
 *   2. Show a brief inline confirmation so the click feels real.
 *   3. Hard-reload the page after the confirmation. Reload is the
 *      only way to truly unload an fbevents.js bundle that was
 *      injected during a prior 'all' session — yanking the <Script>
 *      element doesn't reverse the side effects already in memory.
 *
 * Why not gate by California IP? CCPA requires the link to be
 * "clear and conspicuous" — geo-gating adds risk of false negatives
 * (VPNs, mis-detected locations) and the link is harmless for
 * non-California users. Always-on is the safer default.
 */

import { useState }   from 'react'
import { useLocale }  from 'next-intl'
import { setConsent } from '../../lib/consent'

export default function DoNotSellLink() {
  const isES = useLocale() === 'es'
  const [confirming, setConfirming] = useState(false)

  function handleClick() {
    setConsent('essential')
    setConfirming(true)
    // Brief delay so the confirmation is readable, then reload to
    // guarantee any in-memory Meta Pixel code is torn down.
    setTimeout(() => {
      if (typeof window !== 'undefined') window.location.reload()
    }, 1200)
  }

  if (confirming) {
    return (
      <span className="font-sans text-[11px] text-[#0F3A33]">
        {isES ? '✓ Preferencia guardada' : '✓ Preference saved'}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="font-sans text-[11px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors text-left"
    >
      {isES
        ? 'No vender ni compartir mi información personal'
        : 'Do Not Sell or Share My Personal Information'}
    </button>
  )
}
