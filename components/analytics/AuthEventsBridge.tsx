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

/**
 * Queries Supabase for cohort-relevant user stats and sets them as
 * GA4 user_properties. Once set they flow with every subsequent
 * event in GA's reports — enabling cohort segments like "users with
 * trip_count > 3" or "users who signed up in the last 7 days."
 *
 * Triggered once per page load (NOT on every TOKEN_REFRESHED event)
 * so we don't hammer Supabase. RLS on the trips table restricts the
 * query to the user's own rows.
 */
async function setUserCohortProperties(userId: string, signupISO: string | undefined) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  if (!GA_MEASUREMENT_ID) return

  try {
    const supabase = getSupabaseBrowser()

    // trip count via head:true so we don't transfer any rows.
    const { count: tripCount } = await (supabase as any)
      .from('trips')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    // last_trip_at — only the timestamp, single row.
    const { data: lastTripRow } = await (supabase as any)
      .from('trips')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const lastTripAt: string | undefined = (lastTripRow as { created_at?: string } | null)?.created_at

    const daysSinceSignup = signupISO
      ? Math.floor((Date.now() - new Date(signupISO).getTime()) / 86_400_000)
      : undefined

    window.gtag('set', 'user_properties', {
      trip_count:        typeof tripCount === 'number' ? tripCount : 0,
      days_since_signup: daysSinceSignup ?? 0,
      // ISO truncated to date (10 chars) to fit GA's 36-char value limit
      // and to avoid PII concerns about an exact second-level timestamp.
      last_trip_at:      lastTripAt ? lastTripAt.slice(0, 10) : '',
    })
  } catch (err) {
    // RLS may block the query for edge-case auth states (e.g.
    // intermediate token refresh races). Don't break — cohort props
    // can be re-set on the next event.
    console.warn('[AuthEventsBridge] cohort props failed:', err)
  }
}

export default function AuthEventsBridge() {
  // INITIAL_SESSION fires on every subscribe (page load with a stored
  // session). We must NOT treat that as a login event — it's just
  // hydration. This ref tracks whether we've consumed the initial
  // session signal so the first SIGNED_IN we forward is a true login.
  const initialSessionConsumed = useRef(false)
  // Cohort properties fetch is one round-trip to Supabase — gate it
  // to once per page load so TOKEN_REFRESHED / USER_UPDATED events
  // don't repeatedly re-query.
  const cohortPropsFetched = useRef(false)

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

      // ── Cohort user_properties (once per page load) ───────────────────────
      // Fires for INITIAL_SESSION when there's an authed user, AND for
      // SIGNED_IN events. Doesn't refire on TOKEN_REFRESHED or
      // USER_UPDATED — those don't change trip_count meaningfully and
      // we don't want to spam Supabase on every token refresh.
      if (userId && !cohortPropsFetched.current && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) {
        cohortPropsFetched.current = true
        setUserCohortProperties(userId, session?.user?.created_at)
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
