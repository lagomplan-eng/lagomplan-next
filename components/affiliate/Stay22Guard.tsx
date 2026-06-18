'use client'

/**
 * components/affiliate/Stay22Guard.tsx
 *
 * Site-wide guarantee: a click on any link that already points at
 * stay22.com is opened by us, directly, before anything else can touch
 * it — so our `lagomplan` affiliate attribution is never rewritten.
 *
 * The problem it fixes
 * --------------------
 * The Stay22 LetMeAllez script (loaded in app/[locale]/layout.tsx)
 * attaches a document-level click interceptor that re-routes outbound
 * travel-link clicks through its OWN affiliate id (the site-wide
 * `lmaID`). That is intentional for plain Booking.com / Hotels.com /
 * Expedia links a future contributor might add by hand — LetMeAllez
 * monetizes them automatically. But it also grabs the CTAs we already
 * built through lib/affiliate/build.ts, which carry our per-campaign
 * `lagomplan` id. When LetMeAllez re-wraps those, the commission is
 * attributed to the account-level id instead of our campaign.
 *
 * The historical fix was per-anchor: `e.preventDefault();
 * e.stopPropagation(); window.open(url)` on each booking link (see the
 * marked anchors in MobileTripClient / PlannerHotelsSection). That
 * never scaled — only a handful of the ~25 booking surfaces carried it,
 * so every guide and World Cup hotel link was still hijacked, and any
 * new link was hijacked by default. This guard makes the rule global
 * and permanent: written once, covers every current and future
 * stay22.com link.
 *
 * Design notes
 * ------------
 * - CAPTURE phase: we run before the anchor's own React onClick AND
 *   before LetMeAllez's document listener, so we win the click.
 * - We DON'T stopImmediatePropagation: the anchor's own onClick still
 *   fires, so per-click analytics (events.affiliateClicked) keep
 *   working. We only neutralize the default navigation, which is what
 *   LetMeAllez piggybacks on.
 * - We skip clicks an anchor already manages itself (it calls
 *   window.open in its own handler) via the `data-lma-managed`
 *   attribute, so those don't open twice. Today only the mobile
 *   "Reservar" CTA needs it.
 * - Plain left-click only. Modifier-clicks and middle-clicks
 *   (open-in-new-tab/window) are left to the browser, matching the
 *   prior per-anchor behavior.
 */

import { useEffect } from 'react'

const STAY22_HOST = /(^|\.)stay22\.com$/i

export default function Stay22Guard() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Another handler (or a modifier-click) already owns this click.
      if (e.defaultPrevented) return
      // Left button, no modifiers — let the browser handle the rest.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const target = e.target as Element | null
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      // The anchor opens itself in its own handler — don't double-open.
      if (anchor.dataset.lmaManaged != null) return

      let host: string
      try {
        host = new URL(anchor.href).hostname
      } catch {
        return
      }
      if (!STAY22_HOST.test(host)) return

      // Take over: open our exact URL ourselves so LetMeAllez can't
      // re-wrap the navigation. The anchor's own onClick still runs
      // (we didn't stop propagation), so analytics fire normally.
      e.preventDefault()
      window.open(anchor.href, '_blank', 'noopener,noreferrer')
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
