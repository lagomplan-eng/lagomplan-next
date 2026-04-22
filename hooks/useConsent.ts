'use client'

/**
 * hooks/useConsent.ts
 *
 * Core consent hook. Reads from localStorage first (synchronous, avoids
 * flicker), falls back to the first-party cookie. On every mount it
 * validates version + TTL and evicts stale consent so the banner
 * re-surfaces automatically.
 *
 * isReady === false while hydrating — gate ALL non-essential scripts on it.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  ConsentState,
  ConsentChoices,
  buildConsent,
  allAccepted,
  allRejected,
  readConsentLS,
  readConsentCookie,
  persistConsent,
  clearConsent,
} from '../lib/consent'

export type UseConsentReturn = {
  consent:     ConsentState | null   // null = no valid consent stored
  isReady:     boolean               // false until hydration complete
  acceptAll:   () => void
  rejectAll:   () => void
  saveChoices: (choices: ConsentChoices) => void
}

export function useConsent(): UseConsentReturn {
  const [consent, setConsent]   = useState<ConsentState | null>(null)
  const [isReady, setIsReady]   = useState(false)

  useEffect(() => {
    // Try localStorage first (synchronous), then cookie
    const stored = readConsentLS() ?? readConsentCookie()
    setConsent(stored)       // null if absent, expired, or wrong version
    setIsReady(true)
  }, [])

  const persist = useCallback((state: ConsentState) => {
    persistConsent(state)
    setConsent(state)
  }, [])

  const acceptAll = useCallback(() => persist(allAccepted()), [persist])

  const rejectAll = useCallback(() => persist(allRejected()), [persist])

  const saveChoices = useCallback(
    (choices: ConsentChoices) => persist(buildConsent(choices)),
    [persist],
  )

  return { consent, isReady, acceptAll, rejectAll, saveChoices }
}
