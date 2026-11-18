'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Link } from '../../../lib/navigation'
import { useUser } from '../../../components/auth/SupabaseProvider'
import { getSupabaseBrowser } from '../../../lib/supabase/client'
import type { Trip } from '../../../lib/supabase/types'
import type { Locale } from '../../../i18n'
import GuidesPreview from '../../../components/GuidesPreview'
import { computeTripReadiness } from '../../../lib/planner/readiness'

// ─── Brand cover gradient — single consistent tone ────────────────────────────

const COVER_GRADIENT = 'linear-gradient(160deg, #2A6352 0%, var(--pine) 55%, #0F3328 100%)'

// ─── Chip derivation ──────────────────────────────────────────────────────────

const TRAVELER_LABEL: Record<string, string> = {
  solo: 'Solo',
  pareja: 'Pareja',
  familia: 'Familia',
  amigos: 'Amigos',
}

const STYLE_LABEL: Record<string, string> = {
  relajado: 'Relajado',
  equilibrado: 'Equilibrado',
  activo: 'Activo',
}

function deriveChips(trip: Trip): string[] {
  const chips: string[] = []
  if (trip.travelers && TRAVELER_LABEL[trip.travelers]) chips.push(TRAVELER_LABEL[trip.travelers])
  if (trip.interests?.length) chips.push(trip.interests[0])
  if (trip.travel_style && STYLE_LABEL[trip.travel_style]) chips.push(STYLE_LABEL[trip.travel_style])
  return chips.slice(0, 3)
}

// ─── TripCard ─────────────────────────────────────────────────────────────────

interface TripCardProps {
  trip: Trip
  isActive: boolean
  locale: 'es' | 'en'
  onClick: () => void
}

function TripCard({ trip, isActive, locale, onClick }: TripCardProps) {
  const name      = trip.destination || 'Viaje'
  const days      = trip.duration_days ? `${trip.duration_days} días` : ''
  const tagline   = isActive ? 'En progreso' : 'Itinerario guardado'
  const chips     = deriveChips(trip)
  const initials  = name.substring(0, 2).toUpperCase()
  // Reuse the canonical readiness summary — same deriveChecksFromDays +
  // selectNextCheck the planner bar / mobile header use, never a parallel formula.
  const readiness = computeTripReadiness((trip as { trip_data?: unknown }).trip_data, locale)

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col rounded-2xl overflow-hidden bg-[#FDFCF9] border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:border-[#A8C4BB] ${
        isActive
          ? 'border-pine/30 shadow-sm'
          : 'border-[#C8D9D3] shadow-sm'
      }`}
    >
      {/* TOP LINE — active only */}
      {isActive && <div className="h-[3px] w-full bg-pine" />}

      {/* COVER */}
      <div className="relative h-44 overflow-hidden">
        <div className="w-full h-full" style={{ background: COVER_GRADIENT }} />

        {/* Dot texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '6px 6px',
          }}
        />

        {/* Bottom gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Initials */}
        <div className="absolute bottom-4 left-5 text-white/90 font-sans text-3xl">
          {initials}
        </div>

        {/* "Último viaje" badge */}
        {isActive && (
          <div className="absolute top-3 right-3 bg-white text-pine text-xs px-2 py-1 rounded-full shadow-sm">
            Último viaje
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-sans text-lg">{name}</h3>
        {(days || tagline) && (
          <p className="text-xs text-pine/70">
            {[days, tagline].filter(Boolean).join(' • ')}
          </p>
        )}

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px] mt-1">
            {chips.map((chip) => (
              <span
                key={chip}
                className="px-2 py-1 border rounded-full bg-[#F8F5EF] border-[#E5E0D6]"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* TRIP READINESS — re-engagement (Zeigarnik): show how close this trip
            is to ready + a one-tap path back to the first incomplete step.
            Readiness is reused from computeTripReadiness (same as the trip view). */}
        {readiness.total > 0 ? (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-pine">
                {readiness.ready
                  ? (locale === 'es' ? '✓ Listo para viajar' : '✓ Ready to go')
                  : (locale === 'es' ? `${readiness.pct}% listo` : `${readiness.pct}% ready`)}
              </span>
              <span className="text-[11px] text-[#6B7280]">{readiness.done}/{readiness.total}</span>
            </div>
            <div className="h-[5px] bg-[#E5E0D6] rounded-full overflow-hidden">
              <div
                className="h-full bg-pine rounded-full transition-[width] duration-500"
                style={{ width: `${readiness.pct}%` }}
              />
            </div>

            {!readiness.ready && readiness.nextCheck ? (
              <>
                <p className="text-[11px] text-[#6B7280] mt-2 truncate">
                  {locale === 'es' ? 'Siguiente' : 'Next'}: {readiness.nextCheck.icon} {readiness.nextCheck.text}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); onClick() }}
                  className="mt-2 w-full text-center bg-pine text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#163d31] transition"
                >
                  {locale === 'es' ? 'Continuar planeando →' : 'Continue planning →'}
                </button>
              </>
            ) : (
              <p className="text-sm text-pine/70 mt-2">
                {locale === 'es' ? 'Ver itinerario →' : 'View itinerary →'}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-[#6B7280] mt-1">
            {locale === 'es' ? 'Ver itinerario →' : 'View itinerary →'}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MyTripsClient() {
  const user   = useUser()
  const locale = useLocale()
  const router = useRouter()

  const [trips, setTrips]     = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  // Display name: full_name > email prefix > fallback
  const displayName =
    (user as any)?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'viajero'

  // ── Fetch user's trips ────────────────────────────────────────────────────
  useEffect(() => {
    if (user === undefined) return  // still loading auth
    if (user === null) {
      setLoading(false)
      return
    }

    const supabase = getSupabaseBrowser()
    supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError('No se pudieron cargar tus viajes.')
        } else {
          setTrips((data as Trip[]) ?? [])
        }
        setLoading(false)
      })
  }, [user])

  // ── Navigation ────────────────────────────────────────────────────────────
  function goToTrip(trip: Trip) {
    const plannerBase = locale === 'es' ? '/es/planificador' : '/en/planner'
    router.push(`${plannerBase}?trip_id=${trip.id}`)
  }

  function goToNewTrip() {
    const plannerBase = locale === 'es' ? '/es/planificador' : '/en/planner'
    router.push(plannerBase)
  }

  // ── Redirect to login if unauthenticated ──────────────────────────────────
  if (user === null) {
    return (
      <div className="min-h-screen bg-[#F4F0E8] text-pine font-sans">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="text-[#6B7280] mb-6">Inicia sesión para ver tus viajes guardados.</p>
          <Link
            href="/login"
            className="inline-block bg-pine text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#163d31] transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-pine font-sans">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-sans mb-2">
          Hola, {displayName} 👋
        </h1>
        <p className="text-[#6B7280]">Tus viajes y todo lo que necesitas para mejorarlos</p>
      </div>

      {/* YOUR TRIPS */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-sans">Tus viajes</h2>
          <button
            onClick={goToNewTrip}
            className="text-sm underline cursor-pointer"
          >
            + Nuevo viaje
          </button>
        </div>

        {/* Loading */}
        {(loading || user === undefined) && (
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
                <div className="h-44 bg-[#E5E0D6]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-[#E5E0D6] rounded w-1/2" />
                  <div className="h-3 bg-[#E5E0D6] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Empty state */}
        {!loading && !error && trips.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-[#6B7280] mb-4">Aún no tienes viajes guardados.</p>
            <button
              onClick={goToNewTrip}
              className="bg-pine text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#163d31] transition"
            >
              + Crear mi primer viaje
            </button>
          </div>
        )}

        {/* Trip grid */}
        {!loading && !error && trips.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {trips.map((trip, i) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isActive={i === 0}
                locale={locale === 'es' ? 'es' : 'en'}
                onClick={() => goToTrip(trip)}
              />
            ))}
          </div>
        )}
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="h-px bg-[#E5E0D6]" />
      </div>

      {/* GUIDES */}
      <GuidesPreview locale={locale as Locale} />

    </div>
  )
}
