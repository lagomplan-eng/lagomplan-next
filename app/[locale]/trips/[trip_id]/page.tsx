/**
 * app/[locale]/trips/[trip_id]/page.tsx
 * Route: /es/trips/[trip_id]  |  /en/trips/[trip_id]
 *
 * Read-mostly mobile companion view for an existing trip. Server component:
 * fetches the trip, resolves the session, enforces access, then hands a fully
 * resolved snapshot to <MobileTripClient>.
 *
 * Access model (mirrors GET /api/trips/[trip_id]):
 *   - Owner (session user === trip.user_id) → full access, edit-link to planner.
 *   - Anonymous trip (user_id null)          → accessible to anyone with the link.
 *   - Shared trip (is_shared)                → accessible to anyone (companion view).
 *   - Private, non-owner                     → redirect home (don't leak existence).
 *
 * The site header (Nav) and footer (Footer) come from app/[locale]/layout.tsx
 * which wraps every page — we don't re-render them here.
 */

import type { Metadata }      from 'next'
import { redirect }           from 'next/navigation'
import { getSupabaseServer, getSupabaseAdmin } from '../../../../lib/supabase/server'
import { getRoute }           from '../../../../lib/routes'
import type { Locale }        from '../../../../i18n'
import { normalizeTripProgress } from '../../../../lib/planner/progress'
import MobileTripClient       from './MobileTripClient'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: Locale; trip_id: string }>
}

type TripRow = {
  id:            string
  title:         string | null
  user_id:       string | null
  trip_data:     any
  trip_progress: any
  destination:   string | null
  duration_days: number | null
  travelers:     string | null
  is_shared:     boolean
}

async function loadTrip(trip_id: string): Promise<TripRow | null> {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('trips')
    .select('id, title, user_id, trip_data, trip_progress, destination, duration_days, travelers, is_shared')
    .eq('id', trip_id)
    .single()
  if (error || !data) return null
  return data as unknown as TripRow
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trip_id } = await params
  const trip = await loadTrip(trip_id)
  const title = trip?.title?.trim() || (trip?.destination ?? 'Lagomplan')
  return {
    title,
    // Companion links are private/shared by URL knowledge — keep them out of
    // search indexes (especially anonymous + shared trips).
    robots: { index: false, follow: false },
  }
}

export default async function MobileTripPage({ params }: Props) {
  const { locale, trip_id } = await params

  const trip = await loadTrip(trip_id)
  if (!trip) redirect(getRoute(locale, 'home'))

  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  const isOwner   = !!user && trip!.user_id === user.id
  const isAnon    = trip!.user_id === null
  const accessible = isOwner || isAnon || trip!.is_shared
  if (!accessible) redirect(getRoute(locale, 'home'))

  const plannerBase = getRoute(locale, 'planner')

  return (
    <MobileTripClient
      tripId={trip!.id}
      locale={locale}
      isOwner={isOwner}
      isAnonTrip={isAnon}
      title={trip!.title?.trim() || (trip!.destination ?? '')}
      destination={trip!.destination}
      travelers={trip!.travelers}
      durationDays={trip!.duration_days}
      tripData={trip!.trip_data ?? {}}
      tripProgress={normalizeTripProgress(trip!.trip_progress)}
      editPlanUrl={`${plannerBase}?trip_id=${trip!.id}&full=1`}
      planYoursUrl={plannerBase}
      loginUrl={getRoute(locale, 'login')}
      currentPath={`/${locale}/trips/${trip!.id}`}
    />
  )
}
