'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '../../lib/navigation'
import { useUser } from '../auth/SupabaseProvider'
import { resolveCanonicalSlug } from '../../lib/data/guides'
import {
  getGuideAccessState,
  markGuideSeen,
  type GuideAccessState,
} from '../../lib/plan/guideViews'

/**
 * Transparent top-of-guide banner that surfaces the freemium state for
 * anonymous users. Never blocks the content — we inform, we nudge.
 *
 *   first-free   → "🎒 1 guía gratis · Crea tu cuenta para ilimitado"
 *   revisit      → silent (they're re-reading a guide they already saw)
 *   over-limit   → "🔒 Has usado tu guía gratis · Crea tu cuenta para seguir" + CTA
 *
 * Logged-in users render nothing.
 *
 * Side effect: marks this slug as seen on mount for anonymous users on their
 * first-ever view, so the next distinct guide will correctly register as
 * "over-limit".
 */
export function GuideFreeIndicator({ slug }: { slug: string }) {
  const user = useUser()
  const isES = useLocale() !== 'en'

  // Access state is computed on the client after hydration to avoid a
  // hydration mismatch (server can't read localStorage).
  const [state, setState] = useState<GuideAccessState | null>(null)

  useEffect(() => {
    if (user === undefined) return               // auth resolving
    if (user !== null) { setState(null); return } // logged in — no banner

    // Normalize so the same guide across locales (e.g. cancun-guia-familiar vs
    // cancun-family-guide) counts as a single view.
    const canonical = resolveCanonicalSlug(slug)
    const s = getGuideAccessState(canonical)
    setState(s)

    // Record this guide as seen so future visits to a different guide
    // correctly evaluate as 'over-limit'. 'revisit' is a no-op inside
    // markGuideSeen. We do NOT record an 'over-limit' view — the user
    // hasn't "used" another free credit because there isn't one.
    if (s.kind === 'first-free') markGuideSeen(canonical)
  }, [user, slug])

  if (!state) return null
  if (state.kind === 'revisit') return null

  if (state.kind === 'first-free') {
    return (
      <div className="w-full bg-[#EDE7E1] border-b border-[#E4DFD8]">
        <div className="page-inner py-2 flex items-center justify-center gap-3 text-center">
          <span className="font-sans text-[12px] font-medium text-[#0F3A33]">
            {isES
              ? '🎒 1 guía gratis · Crea tu cuenta para acceder a todas'
              : '🎒 1 free guide · Create an account to unlock all guides'}
          </span>
          <Link
            href="/signup"
            className="font-sans text-[11px] font-semibold text-[#0F3A33] underline underline-offset-2 hover:text-[#12453d] whitespace-nowrap"
          >
            {isES ? 'Crear cuenta' : 'Sign up'}
          </Link>
        </div>
      </div>
    )
  }

  // over-limit
  return (
    <div className="w-full bg-[#F7E7C9] border-b border-[#EBD8A8]">
      <div className="page-inner py-3 flex items-center justify-center gap-4 text-center flex-wrap">
        <span className="font-sans text-[12px] font-medium text-[#7A4A13]">
          {isES
            ? '🔒 Has usado tu guía gratis · Crea tu cuenta gratis para seguir explorando'
            : '🔒 You’ve used your free guide · Create a free account to keep exploring'}
        </span>
        <Link
          href="/signup"
          className="font-sans text-[12px] font-semibold bg-[#0F3A33] text-white px-3 py-1.5 rounded-full hover:bg-[#12453d] transition-colors whitespace-nowrap"
        >
          {isES ? 'Crear cuenta gratis' : 'Sign up free'}
        </Link>
        <Link
          href="/login"
          className="font-sans text-[11px] font-medium text-[#7A4A13] underline underline-offset-2 hover:text-[#4A2B06] whitespace-nowrap"
        >
          {isES ? 'Iniciar sesión' : 'Log in'}
        </Link>
      </div>
    </div>
  )
}
