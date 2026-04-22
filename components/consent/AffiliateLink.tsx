'use client'

/**
 * components/consent/AffiliateLink.tsx
 *
 * Drop-in replacement for any outbound booking / affiliate anchor.
 *
 * Behavior:
 *  - marketing consent = true  → href gets affiliate tracking params appended
 *  - marketing consent = false → href is the clean canonical URL (no tracking)
 *  - isReady = false (hydrating) → renders the clean URL, updates after mount
 *
 * The user always reaches the destination. Tracking is the only difference.
 * Renders `rel="sponsored"` per Google's requirements for affiliate links.
 *
 * Usage:
 *   <AffiliateLink
 *     href="https://www.booking.com/hotel/mx/condesa-df.html"
 *     provider="booking"
 *     className="btn-solid"
 *   >
 *     Ver disponibilidad
 *   </AffiliateLink>
 */

import type { ReactNode } from 'react'
import { useConsent }         from '../../hooks/useConsent'
import { buildAffiliateUrl, type AffiliateProvider } from '../../lib/affiliate'

type Props = {
  href:      string
  provider:  AffiliateProvider
  children:  ReactNode
  className?: string
  onClick?:  () => void
}

export function AffiliateLink({ href, provider, children, className, onClick }: Props) {
  const { consent } = useConsent()

  const url = buildAffiliateUrl(href, provider, consent)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  )
}
