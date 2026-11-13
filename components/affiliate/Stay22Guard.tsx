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
 * - Anchors marked `data-lma-managed="<url>"` are the CTAs that must open
 *   exactly our url. LetMeAllez rewrites such an anchor's href and handles
 *   its click on the anchor itself, before React, so a React onClick never
 *   runs (seen in production). The guard therefore opens the url from the
 *   attribute and stops the event; see lib/affiliate/stay22-click.ts.
 * - Plain left-click only. Modifier-clicks and middle-clicks
 *   (open-in-new-tab/window) are left to the browser, matching the
 *   prior per-anchor behavior.
 */

import { useEffect } from 'react'
import { handleStay22Click } from '../../lib/affiliate/stay22-click'

export default function Stay22Guard() {
  useEffect(() => {
    document.addEventListener('click', handleStay22Click, true)
    return () => document.removeEventListener('click', handleStay22Click, true)
  }, [])

  return null
}
