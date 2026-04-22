/**
 * app/[locale]/trips/share/[shareId]/page.tsx
 * Route: /es/trips/share/[shareId]  |  /en/trips/share/[shareId]
 *
 * Server component — checks auth before any data is exposed.
 *
 * Flow:
 *   1. Fetch public trip preview by share_id (admin client, no RLS bypass risk
 *      because we only return safe fields and validate is_shared).
 *   2. If trip not found or not shared → redirect home.
 *   3. If user IS authenticated → redirect to planner with trip_id.
 *   4. If user is NOT authenticated → render TripShareWall (auth gate UI).
 */

import { redirect }          from 'next/navigation'
import { getSupabaseServer, getSupabaseAdmin } from '../../../../../lib/supabase/server'
import { getRoute }          from '../../../../../lib/routes'
import type { Locale }       from '../../../../../i18n'
import TripShareWall         from '../../../../../components/trips/TripShareWall'

type Props = {
  params: Promise<{ locale: Locale; shareId: string }>
}

export default async function TripSharePage({ params }: Props) {
  const { locale, shareId } = await params

  // ── 1. Fetch public trip preview ─────────────────────────────────────────────
  // Use admin client to bypass RLS and look up by share_id.
  // Only safe fields are selected — trip_data is deliberately excluded.
  const admin = getSupabaseAdmin()
  const { data: raw, error } = await admin
    .from('trips')
    .select('id, title, destination, duration_days, is_shared')
    .eq('share_id' as any, shareId)
    .single()

  const trip = raw as {
    id: string
    title: string | null
    destination: string | null
    duration_days: number | null
    is_shared: boolean
  } | null

  if (error || !trip || !trip.is_shared) {
    redirect(getRoute(locale, 'home'))
  }

  // ── 2. Check authentication ──────────────────────────────────────────────────
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Authenticated: send directly to the planner so they see the full trip.
    // The planner's /api/trips/[trip_id] GET has no auth requirement, so any
    // authenticated user can view a shared trip without ownership.
    const plannerBase = getRoute(locale, 'planner')
    redirect(`${plannerBase}?trip_id=${trip.id}`)
  }

  // ── 3. Unauthenticated: show share wall ──────────────────────────────────────
  // Pass only the safe preview fields — trip_data never leaves the server here.
  const currentPath = `/${locale}/trips/share/${shareId}`

  return (
    <TripShareWall
      locale={locale}
      destination={trip.destination ?? (locale === 'es' ? 'Viaje compartido' : 'Shared trip')}
      duration={trip.duration_days}
      currentPath={currentPath}
    />
  )
}
