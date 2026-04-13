'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Link } from '../../../lib/navigation'
import { useUser } from '../../../components/auth/SupabaseProvider'
import { getSupabaseBrowser } from '../../../lib/supabase/client'
import type { Trip } from '../../../lib/supabase/types'

// ─── Gradient palette — deterministic by destination name ─────────────────────

const GRADIENTS = [
  'linear-gradient(135deg, #2E5E4E 0%, #6E9F8F 100%)',
  'linear-gradient(135deg, #A67C52 0%, #E6C7A3 100%)',
  'linear-gradient(135deg, #2C3E50 0%, #6C8EA4 100%)',
  'linear-gradient(135deg, #4A3560 0%, #8B6FAA 100%)',
  'linear-gradient(135deg, #5C4033 0%, #A07060 100%)',
  'linear-gradient(135deg, #1A4A4A 0%, #4A8A7A 100%)',
]

function getGradient(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0x7fffffff
  }
  return GRADIENTS[hash % GRADIENTS.length]
}

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

// ─── Mock guides (no real guides table yet) ───────────────────────────────────

const MOCK_GUIDES = [
  'Guía Tokyo con niños',
  'Itinerario 5 días Oaxaca',
  'Top barrios CDMX',
]

// ─── TripCard ─────────────────────────────────────────────────────────────────

interface TripCardProps {
  trip: Trip
  isActive: boolean
  onClick: () => void
}

function TripCard({ trip, isActive, onClick }: TripCardProps) {
  const name     = trip.destination || 'Viaje'
  const days     = trip.duration_days ? `${trip.duration_days} días` : ''
  const tagline  = isActive ? 'En progreso' : 'Itinerario guardado'
  const chips    = deriveChips(trip)
  const gradient = getGradient(name)
  const initials = name.substring(0, 2).toUpperCase()

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col rounded-2xl overflow-hidden bg-white transition cursor-pointer ${
        isActive ? 'shadow-md' : 'hover:shadow-lg'
      }`}
    >
      {/* TOP LINE — active only */}
      {isActive && <div className="h-[3px] w-full bg-[#1B4D3E]" />}

      {/* COVER */}
      <div className="relative h-44 overflow-hidden">
        <div className="w-full h-full" style={{ background: gradient }} />

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
        <div className="absolute bottom-4 left-5 text-white/90 font-serif text-3xl">
          {initials}
        </div>

        {/* "Último viaje" badge */}
        {isActive && (
          <div className="absolute top-3 right-3 bg-white text-[#1B4D3E] text-xs px-2 py-1 rounded-full shadow-sm">
            Último viaje
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-serif text-lg">{name}</h3>
        <p className="text-sm text-[#6B7280]">Ver itinerario →</p>
        {(days || tagline) && (
          <p className="text-xs text-[#1B4D3E]/70">
            {[days, tagline].filter(Boolean).join(' • ')}
          </p>
        )}

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px] mt-2">
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
      <div className="min-h-screen bg-[#F4F0E8] text-[#1B4D3E] font-sans">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="text-[#6B7280] mb-6">Inicia sesión para ver tus viajes guardados.</p>
          <Link
            href="/login"
            className="inline-block bg-[#1B4D3E] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#163d31] transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-[#1B4D3E] font-sans">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif mb-2">
          Hola, {displayName} 👋
        </h1>
        <p className="text-[#6B7280]">Tus viajes y todo lo que necesitas para mejorarlos</p>
      </div>

      {/* YOUR TRIPS */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif">Tus viajes</h2>
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
              className="bg-[#1B4D3E] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#163d31] transition"
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
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-8">
          <h3 className="font-serif text-2xl">Guías</h3>
          <Link href="/guides" className="text-sm underline">
            Ver todos
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_GUIDES.map((g) => (
            <div
              key={g}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="h-28 bg-gradient-to-br from-[#C7D2FE] to-[#A5B4FC]" />
              <div className="p-4">
                <p className="text-[10px] text-[#6B7280] uppercase tracking-wide mb-1">Guía</p>
                <h4 className="font-serif text-sm leading-snug">{g}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
