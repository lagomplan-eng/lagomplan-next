'use client'

/**
 * components/consent/ConsentProvider.tsx
 *
 * Root provider that:
 *  1. Holds consent state + modal-open state
 *  2. Renders the banner when consent is absent
 *  3. Renders the preferences modal when triggered
 *  4. Listens for the 'openCookieSettings' CustomEvent so the footer
 *     button (a Server Component) can open the modal without prop drilling
 *
 * Place <ConsentProvider> at the top of app/[locale]/layout.tsx,
 * wrapping all children.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { ConsentState, ConsentChoices } from '../../lib/consent'
import { buildConsent, allAccepted, allRejected, persistConsent } from '../../lib/consent'
import { useConsent }        from '../../hooks/useConsent'
import { CookieBanner }      from './CookieBanner'
import { PreferencesModal }  from './PreferencesModal'

// ── Context ────────────────────────────────────────────────

type ConsentContextValue = {
  consent:      ConsentState | null
  isReady:      boolean
  openSettings: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export function useConsentContext(): ConsentContextValue {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsentContext must be used inside <ConsentProvider>')
  return ctx
}

// ── Provider ───────────────────────────────────────────────

export function ConsentProvider({ children }: { children: ReactNode }) {
  const { consent, isReady, acceptAll, rejectAll, saveChoices } = useConsent()

  const [modalOpen, setModalOpen] = useState(false)
  const showBanner = isReady && consent === null && !modalOpen

  const openSettings  = useCallback(() => setModalOpen(true),  [])
  const closeSettings = useCallback(() => setModalOpen(false), [])

  // Listen for custom event fired by CookieSettingsButton (footer)
  useEffect(() => {
    const handler = () => setModalOpen(true)
    window.addEventListener('openCookieSettings', handler)
    return () => window.removeEventListener('openCookieSettings', handler)
  }, [])

  const handleAcceptAll = useCallback(() => {
    acceptAll()
    setModalOpen(false)
  }, [acceptAll])

  const handleRejectAll = useCallback(() => {
    rejectAll()
    setModalOpen(false)
  }, [rejectAll])

  const handleSave = useCallback(
    (choices: ConsentChoices) => {
      saveChoices(choices)
      setModalOpen(false)
    },
    [saveChoices],
  )

  return (
    <ConsentContext.Provider value={{ consent, isReady, openSettings }}>
      {children}

      {showBanner && (
        <CookieBanner
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          onCustomize={openSettings}
        />
      )}

      {modalOpen && (
        <PreferencesModal
          current={consent}
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          onSave={handleSave}
          onClose={closeSettings}
        />
      )}
    </ConsentContext.Provider>
  )
}
