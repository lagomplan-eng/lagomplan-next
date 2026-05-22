'use client'

/**
 * components/layout/CookieSettingsLink.tsx
 *
 * Footer link that lets users re-open the cookie banner and change
 * their previous decision. Required by GDPR Article 7(3): withdrawal
 * of consent must be as easy as granting it.
 *
 * Implementation: clearConsent() removes the stored decision and
 * dispatches the change event. CookieBanner subscribes to that event
 * and shows itself again.
 *
 * Footer is a server component, so this client component is mounted
 * inline within it. Self-contained — no props.
 */

import { useLocale } from 'next-intl'
import { clearConsent } from '../../lib/consent'

export default function CookieSettingsLink() {
  const isES = useLocale() === 'es'
  return (
    <button
      type="button"
      onClick={() => clearConsent()}
      className="font-sans text-[11px] text-[#6B8F86] hover:text-[#0F3A33] transition-colors"
    >
      {isES ? 'Configuración de cookies' : 'Cookie settings'}
    </button>
  )
}
