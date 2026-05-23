'use client'

/**
 * components/analytics/AuthEventsBridge.tsx
 *
 * Wires Supabase auth state into the analytics layer:
 *
 *   1. Fires `events.login` on every real SIGNED_IN event (skips
 *      INITIAL_SESSION which fires on subscribe regardless of whether
 *      the user actually just signed in).
 *
 *   2. Sets `user_id` on GA4 (via gtag config) and `external_id` on
 *      Meta Pixel (via fbq init) whenever an authenticated session
 *      exists. Clears both on SIGNED_OUT. This fixes the cross-device
 *      attribution gap — without `user_id`, GA treats a user's mobile
 *      session and desktop session as two unrelated visitors.
 *
 * Why not put this inside SupabaseProvider? Keeping it in a sibling
 * component means auth + analytics are decoupled — SupabaseProvider
 * stays a pure auth surface, and a future replacement of GA/Meta with
 * something else only touches this file.
 *
 * Mount once in app/[locale]/layout.tsx alongside the other client
 * components inside the providers. No props.
 */

import { useEffect, useRef } from 'react'
import { getSupabaseBrowser } from '../../lib/supabase/client'
import { events } from '../../lib/analytics'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const META_PIXEL_ID     = process.env.NEXT_PUBLIC_META_PIXEL_ID

export default function AuthEventsBridge() {
  // INITIAL_SESSION fires on every subscribe (page load with a stored
  // session). We must NOT treat that as a login event — it's just
  // hydration. This ref tracks whether we've consumed the initial
  // session signal so the first SIGNED_IN we forward is a true login.
  const initialSessionConsumed = useRef(false)

  useEffect(() => {
    const supabase = getSupabaseBrowser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const userId = session?.user?.id ?? null

      // ── Identity wiring (every state change) ──────────────────────────────
      // GA4: set user_id on the config. Subsequent gtag('event', ...)
      // calls carry it automatically. Setting to undefined clears.
      if (typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
        window.gtag('config', GA_MEASUREMENT_ID, { user_id: userId ?? undefined })
      }

      // Meta Pixel: re-init with external_id. fbq is only loaded when
      // consent === 'all' (see ConsentSync), so this is a no-op for
      // Essential-only users — exactly the privacy posture we want.
      // Repeated init calls update the matching params, they don't
      // double-load fbevents.js.
      if (typeof window !== 'undefined' && typeof window.fbq === 'function' && META_PIXEL_ID) {
        // userId is a Supabase UUID — not directly PII, but Meta
        // recommends hashing or omitting it for advanced matching.
        // We pass it as-is since the UUID alone can't be reversed to
        // a real identity without DB access.
        window.fbq('init', META_PIXEL_ID, userId ? { external_id: userId } : {})
      }

      // ── Login event (only on actual SIGNED_IN transitions) ────────────────
      if (event === 'INITIAL_SESSION') {
        initialSessionConsumed.current = true
        return
      }
      if (event === 'SIGNED_IN' && initialSessionConsumed.current) {
        // Method is unknown at this layer (could be email, OAuth, magic
        // link). The signup form fires completeRegistration with method
        // already; this login event covers the broader "session started"
        // signal — method is left optional.
        events.login()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}
