'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link, useRouter } from '../../../lib/navigation'
import { useUser } from '../../../components/auth/SupabaseProvider'
import PaywallModal from '../../../components/PaywallModal'
import { TripShareModal } from '../../../components/trips/TripShareModal'
import Image from 'next/image'
import { getBookingOptions, detectCountryGroup, trackAffiliateClick } from '../../../lib/booking'

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer'

type BookingOption = {
  id: string
  provider: string   // 'viator' | 'gyg' | 'hotels' | 'booking' | 'manual'
  name: string
  desc: string
  url: string
}

interface ItineraryItem {
  id: string
  type: ItemType
  time: string
  name: string
  desc: string
  price?: string
  affiliate?: string
  bookingOptions?: BookingOption[]
}

interface Day {
  n: number
  label: string
  title: string
  progress: number
  items: ItineraryItem[]
}

interface CheckItem {
  id: string
  icon: string
  text: string
  done: boolean
  day?: number
}

interface BudgetRow {
  id: string
  label: string
  amount: number
  category: string
}

interface TripData {
  title: string
  subtitle: string
  days: Day[]
  checks: CheckItem[]
  budgetRows: BudgetRow[]
  packing: string[]
}

interface TripVersion {
  label: string
  tripTitle: string
  tripSubtitle: string
  days: Day[]
  budgetRows: BudgetRow[]
  packing: string[]
}

interface Props {
  params: Record<string, string>
}

// ─── Display label maps ────────────────────────────────────────────────────────

// Normalises both HeroForm values ('Relajado') and legacy drawer keys ('relaxed')
const PACE_DISPLAY: Record<string, string> = {
  Relajado:    'Relajado',
  relaxed:     'Relajado',
  relajado:    'Relajado',
  Equilibrado: 'Equilibrado',
  moderate:    'Equilibrado',
  equilibrado: 'Equilibrado',
  balanceado:  'Equilibrado',
  Activo:      'Activo',
  active:      'Activo',
  activo:      'Activo',
  aventurero:  'Activo',
}

// Maps legacy internal keys → display strings; display strings pass through as-is
const BUDGET_DISPLAY: Record<string, string> = {
  budget:   '$10k–$15k',
  moderate: '$15k–$25k',
  premium:  '$25k–$40k',
  luxury:   '$40k+',
}
function budgetLabel(val: string) { return BUDGET_DISPLAY[val] ?? val }

// ─── Traveler detail types ────────────────────────────────────────────────────

const BABY_AGES = ['0-11 m', '1 año', '2 años']
const KID_AGES  = Array.from({ length: 12 }, (_, i) => `${i + 3} años`)
interface Child { id: number; type: 'baby' | 'kid'; age: string }

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_INFO: Record<ItemType, { icon: string; label: string }> = {
  hotel:      { icon: '🏨', label: 'Hotel' },
  tour:       { icon: '🌊', label: 'Tour' },
  restaurant: { icon: '🍽', label: 'Restaurante' },
  free:       { icon: '🚶', label: 'Libre' },
  transfer:   { icon: '🚗', label: 'Transfer' },
}

const TYPE_BORDER: Record<ItemType, string> = {
  hotel: '#0F3A33', tour: '#0891B2', restaurant: '#D97706',
  free: '#CEC8C0', transfer: '#2D4F6C',
}

const TYPE_ROW_BG: Record<ItemType, string> = {
  hotel:      'rgba(15,58,51,.06)',
  tour:       'rgba(8,145,178,.06)',
  restaurant: 'rgba(217,119,6,.07)',
  free:       'transparent',
  transfer:   'rgba(45,79,108,.06)',
}

const TYPE_BADGE: Record<ItemType, { color: string; bg: string }> = {
  hotel:      { color: '#0F3A33', bg: 'rgba(15,58,51,.07)' },
  tour:       { color: '#0E7490', bg: '#ECFEFF' },
  restaurant: { color: '#92400E', bg: '#FFFBEB' },
  free:       { color: '#7A7A76', bg: '#EDE7E1' },
  transfer:   { color: '#2D4F6C', bg: '#EBF4FF' },
}

// ─── Booking providers ────────────────────────────────────────────────────────

const LOGO_STYLE: Record<string, { bg: string; color: string; text: string }> = {
  viator:     { bg: '#F7F3EE', color: '#1B3A2D', text: 'VIATOR' },
  gyg:        { bg: '#FFF0E6', color: '#C04020', text: 'GYG' },
  hotels:     { bg: '#EBF4FF', color: '#004A96', text: 'Hotels\n.com' },
  booking:    { bg: '#F0F4FF', color: '#003580', text: 'book\ning' },
  expedia:    { bg: '#EEF4FF', color: '#1A4FBA', text: 'EXPE\nDIA' },
  opentable:  { bg: '#FFF0F0', color: '#DA3743', text: 'OPEN\nTABLE' },
  resy:       { bg: '#FFF5F0', color: '#C94A23', text: 'RESY' },
  thefork:    { bg: '#F0FBF7', color: '#007E5D', text: 'THE\nFORK' },
  googlemaps: { bg: '#F5F5F5', color: '#444444', text: 'G\nMaps' },
  uber:       { bg: '#1C1C1C', color: '#FFFFFF', text: 'UBER' },
  manual:     { bg: '#EDE7E1', color: '#3D3D3A', text: '✓' },
}

const BOOKING_EYEBROW: Partial<Record<ItemType, string>> = {
  hotel:      'Reservar hospedaje',
  tour:       'Reservar experiencia',
  restaurant: 'Reservar mesa',
  transfer:   'Reservar transfer',
}

// Default provider options per item type — used when item has no affiliate/bookingOptions
const DEFAULT_PROVIDERS: Partial<Record<ItemType, BookingOption[]>> = {
  hotel: [
    { id: 'dp-hotels', provider: 'hotels', name: 'Hotels.com', desc: 'Mayor selección de hoteles. Precio garantizado.', url: 'https://www.hotels.com/search/properties?q={query}' },
    { id: 'dp-booking', provider: 'booking', name: 'Booking.com', desc: 'Cancelación gratis en la mayoría de propiedades.', url: 'https://www.booking.com/search.html?ss={query}&aid=LAGOMPLAN' },
  ],
  tour: [
    { id: 'dp-viator', provider: 'viator', name: 'Viator', desc: 'Tours verificados. Cancelación gratis hasta 24 hrs.', url: 'https://www.viator.com/search/tours?q={query}&pid=P00165894&mcid=42383' },
    { id: 'dp-gyg', provider: 'gyg', name: 'GetYourGuide', desc: 'Experiencias curadas. Reserva instantánea, soporte 24/7.', url: 'https://www.getyourguide.com/s/?q={query}&partner_id=YOUR_GYG_ID' },
  ],
  restaurant: [
    { id: 'dp-viator-r', provider: 'viator', name: 'Viator Experiencias', desc: 'Cenas con chef local, maridaje y vistas.', url: 'https://www.viator.com/search/tours?q=cena+restaurante+{query}&pid=P00165894' },
  ],
  transfer: [
    { id: 'dp-viator-t', provider: 'viator', name: 'Viator Transfers', desc: 'Transfers privados y compartidos. Sin sorpresas.', url: 'https://www.viator.com/search/tours?q=transfer+{query}&pid=P00165894' },
  ],
}

function providerFromUrl(url: string): string {
  if (url.includes('viator'))       return 'viator'
  if (url.includes('getyourguide')) return 'gyg'
  if (url.includes('hotels.com'))   return 'hotels'
  if (url.includes('booking.com'))  return 'booking'
  return 'manual'
}

// ─── Helper components ────────────────────────────────────────────────────────

function CheckRow({ check, onToggle }: { check: CheckItem; onToggle: (id: string) => void }) {
  return (
    <div className="flex items-center gap-[7px] py-[7px] border-b border-[#E4DFD8] last:border-b-0">
      <button
        className="w-[15px] h-[15px] rounded-[3px] border-[1.5px] shrink-0 flex items-center justify-center transition-all"
        style={check.done
          ? { background: '#0F3A33', borderColor: '#0F3A33' }
          : { background: '#fff', borderColor: '#CEC8C0' }
        }
        onClick={() => onToggle(check.id)}
        aria-label={check.done ? 'Mark incomplete' : 'Mark complete'}
      >
        {check.done && <span className="text-[9px] text-white font-semibold leading-none">✓</span>}
      </button>
      <span className="text-[11px] shrink-0 w-4 text-center">{check.icon}</span>
      <span
        className="text-[11px] font-normal flex-1 leading-[1.3]"
        style={{ color: check.done ? '#B8B5AF' : '#3D3D3A', textDecoration: check.done ? 'line-through' : 'none' }}
      >
        {check.text}
      </span>
      <span
        className="font-mono text-[9px] font-medium tracking-[.06em] uppercase px-[5px] py-px rounded-full shrink-0 whitespace-nowrap"
        style={check.done
          ? { color: '#6B8F86', background: 'rgba(107,143,134,.12)' }
          : { color: '#B8B5AF', background: '#EDE7E1' }
        }
      >
        {check.done ? '✓ Listo' : 'Pendiente'}
      </span>
    </div>
  )
}

// ─── Loading state ─────────────────────────────────────────────────────────────

function LoadingState({ locale }: { locale: string }) {
  const es = locale !== 'en'
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="flex gap-[7px]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-[9px] h-[9px] rounded-full bg-[#0F3A33] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-[7px]">
        <p className="font-mono text-[10px] tracking-[.16em] text-[#2D6B57] uppercase">
          {es ? 'Generando tu plan…' : 'Generating your plan…'}
        </p>
        <p className="font-sans text-[13px] font-light text-[#7A7A76] text-center">
          {es
            ? 'Estamos creando tu itinerario personalizado.'
            : 'We are creating your personalized itinerary.'}
        </p>
      </div>
    </div>
  )
}

// ─── Normalize helpers ─────────────────────────────────────────────────────────

function normalizeDay(raw: any, index: number): Day {
  const rawItems: any[] = Array.isArray(raw?.items)  ? raw.items
                        : Array.isArray(raw?.blocks) ? raw.blocks
                        : []
  return {
    n:        typeof raw?.n === 'number'        ? raw.n        : index + 1,
    label:    typeof raw?.label === 'string'    ? raw.label    : `Day ${index + 1}`,
    title:    typeof raw?.title === 'string'    ? raw.title    : '',
    progress: typeof raw?.progress === 'number' ? raw.progress : 0,
    items:    rawItems.map((raw, ii) => normalizeItem(raw, ii, index)),
  }
}

// Maps raw API type strings (any language/variant) to canonical ItemType
function normalizeItemType(raw: unknown): ItemType {
  const t = String(raw ?? '').toLowerCase()
  if (t === 'hotel' || t.includes('hotel') || t.includes('hosped') || t.includes('alojam') || t.includes('lodg') || t.includes('accommod')) return 'hotel'
  if (t === 'restaurant' || t.includes('restaur') || t.includes('comida') || t.includes('cena') || t.includes('almuerz') || t.includes('desayun') || t.includes('food') || t.includes('eat') || t.includes('gastro')) return 'restaurant'
  if (t === 'tour' || t.includes('tour') || t.includes('excurs') || t.includes('activid') || t.includes('atraccion') || t.includes('activity') || t.includes('visita') || t.includes('aventura')) return 'tour'
  if (t === 'transfer' || t.includes('transfer') || t.includes('transport') || t.includes('traslad') || t.includes('vuelo') || t.includes('flight') || t.includes('bus') || t.includes('taxi') || t.includes('auto')) return 'transfer'
  if (t === 'relax' || t.includes('relax') || t.includes('descanso') || t.includes('spa') || t.includes('libre') || t.includes('playa') || t.includes('beach')) return 'free'
  return 'free'
}

function normalizeItem(raw: any, index: number, dayIndex = 0): ItineraryItem {
  return {
    id:        typeof raw?.id === 'string'   ? raw.id   : `item-d${dayIndex}-${index}`,
    type:      normalizeItemType(raw?.type),
    time:      raw?.time   ?? '',
    name:      raw?.title  ?? raw?.name  ?? '',
    desc:      raw?.description ?? raw?.desc ?? '',
    price:     raw?.price,
    affiliate: raw?.affiliate,
  }
}

function normalizeCheckItem(raw: any, index: number): CheckItem {
  if (typeof raw === 'string') {
    return { id: `check-${index}`, icon: '📋', text: raw, done: false }
  }
  return {
    id:   raw?.id   ?? `check-${index}`,
    icon: raw?.icon ?? '📋',
    text: raw?.text ?? raw?.label ?? raw?.title ?? raw?.name ?? `Tarea ${index + 1}`,
    done: raw?.done ?? raw?.completed ?? false,
    day:  raw?.day  ?? raw?.dayNumber ?? undefined,
  }
}

function normalizeBudgetRow(raw: any, index: number): BudgetRow {
  const rawAmount = raw?.amount ?? raw?.cost ?? raw?.price ?? raw?.total ?? 0
  const amount = typeof rawAmount === 'number'
    ? rawAmount
    : parseFloat(String(rawAmount).replace(/[^0-9.]/g, '')) || 0
  return {
    id:       raw?.id       ?? `budget-${index}`,
    label:    raw?.label    ?? raw?.name ?? raw?.title ?? raw?.item ?? `Item ${index + 1}`,
    amount,
    category: raw?.category ?? raw?.type ?? raw?.cat ?? 'Otros',
  }
}

function deriveBudgetFromDays(days: Day[]): BudgetRow[] {
  const rows: BudgetRow[] = []
  days.forEach(day => {
    day.items.forEach((item, ii) => {
      if (!item.price) return
      // Strip currency symbols and thousands separators, keep first numeric block
      const cleaned = String(item.price).replace(/[^0-9.,]/g, '').replace(/,/g, '')
      const amount  = parseFloat(cleaned)
      if (!isNaN(amount) && amount > 0) {
        rows.push({
          id:       `budget-${day.n}-${ii}`,
          label:    item.name || `Día ${day.n}`,
          amount,
          category: item.type.charAt(0).toUpperCase() + item.type.slice(1),
        })
      }
    })
  })
  return rows
}

function deriveChecksFromDays(days: Day[]): CheckItem[] {
  const checks: CheckItem[] = []
  const seenHotels = new Set<string>()
  const lastDayN = days.length > 0 ? days[days.length - 1].n : 0

  days.forEach(day => {
    day.items.forEach((item) => {
      const id = `check-${item.id}`   // stable: tied to item.id, not position
      switch (item.type) {
        case 'hotel':
          // Deduplicate: same hotel across multiple days → one pre-trip confirmation
          if (!seenHotels.has(item.name)) {
            seenHotels.add(item.name)
            checks.push({ id, icon: '🏨', text: `Confirmar reserva: ${item.name}`, done: false })
          }
          break
        case 'transfer':
          if (day.n === 1 || day.n === lastDayN) {
            // Arrival/departure transfer → pre-trip booking (Antes del viaje)
            checks.push({ id, icon: '🚗', text: `Reservar transfer: ${item.name}`, done: false })
          } else {
            // Mid-trip transfer → day-specific
            checks.push({ id, icon: '🚗', text: `Confirmar transfer: ${item.name}`, done: false, day: day.n })
          }
          break
        case 'tour':
          checks.push({ id, icon: '🎫', text: `Reservar: ${item.name}`, done: false, day: day.n })
          break
        case 'restaurant':
          checks.push({ id, icon: '🍽', text: `Reservar mesa: ${item.name}`, done: false, day: day.n })
          break
        // free, relax → no checklist item
      }
    })
  })
  return checks
}

function derivePackingFromTrip(destination: string, nights: string, interests: string): string[] {
  const n = parseInt(nights || '3', 10) || 3
  const base = [
    'Documentos de identidad (INE / pasaporte)',
    'Tarjeta de crédito / efectivo',
    'Teléfono y cargador',
    'Seguro de viaje',
    `Ropa para ${n} días`,
    'Artículos de higiene personal',
    'Medicamentos básicos / botiquín',
  ]
  const interestsLower = interests.toLowerCase()
  if (interestsLower.includes('playa') || interestsLower.includes('beach') || destination.toLowerCase().includes('vallarta') || destination.toLowerCase().includes('cancún') || destination.toLowerCase().includes('tulum')) {
    base.push('Traje de baño', 'Protector solar SPF 50+', 'Lentes de sol', 'Sandalias')
  }
  if (interestsLower.includes('senderismo') || interestsLower.includes('hiking') || interestsLower.includes('naturaleza')) {
    base.push('Zapatos de trekking', 'Repelente de insectos', 'Botella de agua reutilizable')
  }
  if (n >= 5) base.push('Bolsa de lavandería')
  return base
}

function normalizeTripData(row: any, destination: string, nights: string, interests = ''): TripData {
  const source = row?.trip_data ?? row?.trip ?? row?.itinerary ?? row?.data ?? row ?? {}

  // Diagnostic: log source keys so field-name mismatches are immediately visible in DevTools
  if (process.env.NODE_ENV !== 'production' && source && typeof source === 'object') {
    console.log('[normalizeTripData] source keys:', Object.keys(source))
  }

  const rawDays = Array.isArray(source.days) ? source.days : []
  const normalizedDays = rawDays.map(normalizeDay)

  // Checks — broad key coverage; fallback derives planning items from bookable itinerary entries
  const rawChecks =
    source.checks             ??
    source.checklist          ??
    source.todo               ??
    source.tasks              ??
    source.planning           ??
    source.pre_trip           ??
    source.pre_trip_checklist ??
    source.travel_checklist   ??
    source.planning_items     ??
    source.action_items       ??
    null

  const normalizedChecks: CheckItem[] = Array.isArray(rawChecks)
    ? rawChecks.map(normalizeCheckItem)
    : deriveChecksFromDays(normalizedDays)

  // Packing — broad key coverage; fallback generates a contextual list from destination/interests
  const rawPacking =
    source.packing                      ??
    source.packingList                  ??
    source.packing_list                 ??
    source.what_to_pack                 ??
    source.before_you_go?.what_to_pack  ??   // Edge Function nests this under before_you_go
    source.items_to_pack                ??
    source.what_to_bring                ??
    source.luggage                      ??
    source.baggage                      ??
    null

  const normalizedPacking: string[] = Array.isArray(rawPacking)
    ? rawPacking.map((p: any) => (typeof p === 'string' ? p : p?.item ?? p?.name ?? p?.text ?? String(p)))
    : derivePackingFromTrip(destination, nights, interests)

  // Budget — broad key coverage; also handle { category: amount } object shape
  const rawBudget =
    source.budgetRows       ??
    source.budget_rows      ??
    source.budget           ??
    source.costs            ??
    source.expenses         ??
    source.budget_breakdown ??
    source.cost_breakdown   ??
    source.estimated_costs  ??
    source.cost_estimate    ??
    source.financial_summary ??
    null

  let normalizedBudget: BudgetRow[] = []
  if (Array.isArray(rawBudget)) {
    normalizedBudget = rawBudget.map(normalizeBudgetRow)
  } else if (rawBudget && typeof rawBudget === 'object') {
    // Handle { "Hotel": 8400, "Restaurantes": 2700 } shape
    normalizedBudget = Object.entries(rawBudget).map(([key, val], i) =>
      normalizeBudgetRow({ label: key, amount: val, category: key }, i)
    )
  }

  // Fallback: derive from item prices when API returns no budget data
  if (normalizedBudget.length === 0 && normalizedDays.length > 0) {
    normalizedBudget = deriveBudgetFromDays(normalizedDays)
  }

  return {
    title:      row?.title ?? source.title ?? `${destination} · ${parseInt(nights || '0', 10) || 3} nights`,
    subtitle:   source.subtitle ?? 'AI-generated trip plan',
    days:       normalizedDays,
    checks:     normalizedChecks,
    budgetRows: normalizedBudget,
    packing:    normalizedPacking,
  }
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function TripResult({ params }: Props) {
  const locale = useLocale()
  const router = useRouter()

  const {
    destination = '',
    origin = '',
    start = '',
    end = '',
    nights = '',
    traveler = '',
    interests = '',
    pace = '',
    budget = '',
    trip_id:  savedTripId = '',
    checkout: checkoutStatus = '',   // 'success' | 'cancelled' | ''
  } = params

  // ── Data state ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<any>(null)
  const [tripId, setTripId]         = useState<string | null>(null)
  const [rawTripData, setRawTripData] = useState<any>(null)
  const authedUser = useUser()
  const [tripTitle, setTripTitle]     = useState('')
  const [tripSubtitle, setTripSubtitle] = useState('')
  const [days, setDays]         = useState<Day[]>([])
  const [doneCheckIds, setDoneCheckIds] = useState<Set<string>>(new Set())
  const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([])
  const [packing, setPacking]   = useState<string[]>([])

  // ── Version state ────────────────────────────────────────────────────────────
  const [versions, setVersions]           = useState<TripVersion[]>([])
  const [activeVersionIdx, setActiveVersionIdx] = useState(0)
  const [hasUserEdits, setHasUserEdits]   = useState(false)
  const [regenConfirmOpen, setRegenConfirmOpen] = useState(false)

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [prefOpen, setPrefOpen]             = useState(false)
  const [collapsedDays, setCollapsedDays]   = useState<Set<number>>(new Set())
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set())
  const [collapsedDiaGroups, setCollapsedDiaGroups] = useState<Set<number>>(new Set())
  const [toast, setToast]     = useState<string | null>(null)
  const [packedSet, setPackedSet] = useState<Set<number>>(new Set())
  const [bookingModal, setBookingModal] = useState<{ itemName: string; itemType: ItemType; options: BookingOption[] } | null>(null)

  // ── Edit modal state ─────────────────────────────────────────────────────────
  const [editModalItem, setEditModalItem] = useState<ItineraryItem | null>(null)
  const [editModalDayN, setEditModalDayN] = useState<number | null>(null)
  const [editIsNew, setEditIsNew]         = useState(false)
  const [editName, setEditName]           = useState('')
  const [editDesc, setEditDesc]           = useState('')
  const [editTime, setEditTime]           = useState('')
  const [editPrice, setEditPrice]         = useState('')
  const [editType, setEditType]           = useState<ItemType>('free')

  // ── Pref state — prefilled from params, updated by drawer ───────────────────
  // These drive all display after initial load AND after regeneration
  const [prefOrigin, setPrefOrigin]       = useState(origin)
  const [prefDest, setPrefDest]           = useState(destination)
  const [prefStart, setPrefStart]         = useState(start)
  const [prefEnd, setPrefEnd]             = useState(end)
  const [prefTraveler, setPrefTraveler]   = useState(traveler)
  const [prefPace, setPrefPace]           = useState(pace)
  const [prefBudget, setPrefBudget]       = useState(budget)
  const [prefInterests, setPrefInterests] = useState(interests)

  // ── Traveler detail state ────────────────────────────────────────────────────
  const [prefAdults, setPrefAdults]           = useState(2)
  const [prefChildren, setPrefChildren]       = useState<Child[]>([])
  const [prefNextKidId, setPrefNextKidId]     = useState(0)
  const [prefGroupCount, setPrefGroupCount]   = useState(2)

  // ── Paywall state ─────────────────────────────────────────────────────────────
  const [paywallOpen, setPaywallOpen]   = useState(false)
  const [shareOpen,   setShareOpen]     = useState(false)
  const [generateKey, setGenerateKey]   = useState(0)  // increment to manually retrigger generate

  // ── Autosave status ───────────────────────────────────────────────────────────
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const autoSaveTimerRef  = useRef<ReturnType<typeof setTimeout>>()
  const hasInitializedRef = useRef(false)   // prevents autosave on initial mount

  // ── Plan credits (DB-backed, replaces localStorage) ───────────────────────────
  type PlanState = { tier: string; trips_remaining: number; is_subscriber: boolean }
  const [planCredits, setPlanCredits] = useState<PlanState | null | 'loading'>('loading')

  // ── DB load effect — fires when trip_id param is present ─────────────────────
  useEffect(() => {
    if (!savedTripId) return
    async function loadFromDB() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/trips/${savedTripId}`)
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || (locale === 'es' ? 'No se pudo cargar el viaje' : 'Failed to load trip'))
        }
        const data = await res.json()
        const dest      = data.destination || ''
        const tripNights = String(data.duration_days || 3)
        const interestsStr = Array.isArray(data.interests) ? data.interests.join(',') : ''
        const normalized = normalizeTripData(data, dest, tripNights, interestsStr)
        setTripTitle(normalized.title)
        setTripSubtitle(normalized.subtitle)
        setDays(normalized.days)
        setDoneCheckIds(new Set())
        setBudgetRows(normalized.budgetRows)
        setPacking(normalized.packing)
        setVersions([{
          label: 'Versión original',
          tripTitle: normalized.title,
          tripSubtitle: normalized.subtitle,
          days: normalized.days,
          budgetRows: normalized.budgetRows,
          packing: normalized.packing,
        }])
        setActiveVersionIdx(0)
        setHasUserEdits(false)
        setPrefDest(dest)
        setTripId(savedTripId)
        setRawTripData(data.trip_data ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }
    loadFromDB()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedTripId])

  // ── Plan credits fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    if (authedUser === undefined) return  // still loading auth
    if (authedUser === null) {
      setPlanCredits(null)               // anonymous — no DB state
      return
    }
    fetch('/api/me/plan')
      .then(r => r.ok ? r.json() : null)
      .then(data => setPlanCredits(data ?? { tier: 'free', trips_remaining: 3, is_subscriber: false }))
      .catch(() => setPlanCredits({ tier: 'free', trips_remaining: 3, is_subscriber: false }))
  }, [authedUser])

  // ── Post-checkout success handler ────────────────────────────────────────────
  // When Stripe redirects back with ?checkout=success, refresh plan state and
  // retrigger generation so the user doesn't have to click anything.
  useEffect(() => {
    if (checkoutStatus !== 'success') return
    showToast(locale === 'es' ? '🎉 ¡Pago exitoso! Ya puedes generar más viajes.' : '🎉 Payment successful! You can now generate more trips.')
    fetch('/api/me/plan')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setPlanCredits(data)
          setGenerateKey(k => k + 1)  // retrigger generation with fresh credits
        }
      })
      .catch(() => {})
  // Run once on mount when checkoutStatus==='success'. showToast is stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Generate effect ──────────────────────────────────────────────────────────
  // Cache key: serialized inputs. On match, restore from sessionStorage and skip AI.
  // This prevents regeneration after login redirect (trip continuity, no token waste).
  useEffect(() => {
    async function generate() {
      // Skip AI generation when loading an existing trip from DB
      if (savedTripId) return

      // ── Auth / generation-count guard ─────────────────────────────────
      // authedUser is undefined while the session is still loading; wait for it.
      if (authedUser === undefined) return

      // ── Paywall guard (logged-in users) ───────────────────────────────
      // Wait until we've fetched plan state from the DB.
      if (authedUser !== null) {
        if (planCredits === 'loading') return  // not ready yet
        const plan = planCredits as PlanState | null
        if (plan && !plan.is_subscriber && plan.trips_remaining <= 0) {
          setPaywallOpen(true)
          return
        }
      }

      setLoading(true)
      setError(null)
      try {
        const currentInputs = { destination, origin, start, end, nights, traveler, interests, pace, budget }

        // ── 1. Restore from cache if inputs match ───────────────────────
        const cachedRaw = sessionStorage.getItem('tripCache')
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw)
            if (
              cached.tripData &&
              JSON.stringify(cached.inputs) === JSON.stringify(currentInputs)
            ) {
              console.log('[TripResult] cache hit — restoring trip, skipping AI call')
              const tripDataRaw = cached.tripData
              setRawTripData(tripDataRaw)
              const normalized = normalizeTripData({ trip_data: tripDataRaw }, destination, nights, interests)
              setTripTitle(normalized.title)
              setTripSubtitle(normalized.subtitle)
              setDays(normalized.days)
              setDoneCheckIds(new Set())
              setBudgetRows(normalized.budgetRows)
              setPacking(normalized.packing)
              setVersions([{ label: 'Versión original', tripTitle: normalized.title, tripSubtitle: normalized.subtitle, days: normalized.days, budgetRows: normalized.budgetRows, packing: normalized.packing }])
              setActiveVersionIdx(0)
              setHasUserEdits(false)
              return  // guard: no AI call
            }
          } catch {}
          // Cache invalid or inputs changed — discard
          sessionStorage.removeItem('tripCache')
        }

        // ── 2. Fresh AI generation ──────────────────────────────────────
        const parsedInterests = interests
          ? interests.split(',').map((i) => i.trim()).filter(Boolean)
          : []
        const duration_days = Math.min(Math.max(parseInt(nights || '0', 10) || 3, 1), 30)
        const payload = { destination, origin, start, end, nights, duration_days, traveler, interests: parsedInterests, pace, budget }
        console.log('[TripResult] POST payload:', JSON.stringify(payload))
        const genRes = await fetch('/api/generate-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const genData = await genRes.json().catch(() => null)
        console.log('[TripResult] POST status:', genRes.status, 'response:', genData)
        setRawResponse(genData)
        if (!genRes.ok) {
          // 401 = anonymous over-limit → redirect to login
          if (genRes.status === 401) {
            router.push({ pathname: '/login' })
            return
          }
          // 402 = authenticated user out of credits → open paywall
          if (genRes.status === 402) {
            setPaywallOpen(true)
            return
          }
          const base   = typeof genData?.error === 'string' ? genData.error : 'Generation failed'
          const detail = genData?.detail ? `\n\n${JSON.stringify(genData.detail, null, 2)}` : ''
          throw new Error(base + detail)
        }
        const tripDataRaw = genData?.trip_data
        if (!tripDataRaw) throw new Error(`No trip_data in response. Got: ${JSON.stringify(genData)}`)

        // Persist so login redirect restores this exact trip
        sessionStorage.setItem('tripCache', JSON.stringify({ tripData: tripDataRaw, inputs: currentInputs }))

        setRawTripData(tripDataRaw)
        const normalized = normalizeTripData({ trip_data: tripDataRaw }, destination, nights, interests)
        setTripTitle(normalized.title)
        setTripSubtitle(normalized.subtitle)
        setDays(normalized.days)
        setDoneCheckIds(new Set())
        setBudgetRows(normalized.budgetRows)
        setPacking(normalized.packing)
        setVersions([{ label: 'Versión original', tripTitle: normalized.title, tripSubtitle: normalized.subtitle, days: normalized.days, budgetRows: normalized.budgetRows, packing: normalized.packing }])
        setActiveVersionIdx(0)
        setHasUserEdits(false)

        // Credits are decremented server-side in /api/generate-trip.
        // Refresh plan state so the next guard check reflects the new balance.
        if (authedUser !== null) {
          fetch('/api/me/plan')
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setPlanCredits(data) })
            .catch(() => {})
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    generate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, origin, start, end, nights, traveler, interests, pace, budget, authedUser, planCredits, generateKey])

  // ── Auto-save after login (pending save) ────────────────────────────────────
  useEffect(() => {
    if (authedUser === undefined) return  // still loading
    if (!authedUser) {
      // logged out — discard any stale pending save
      sessionStorage.removeItem('pendingSave')
      return
    }
    if (!rawTripData) return
    const raw = sessionStorage.getItem('pendingSave')
    if (!raw) return
    sessionStorage.removeItem('pendingSave')
    // authedUser being non-null already guarantees a valid session exists —
    // calling getSession() here would race with SupabaseProvider's lock.
    saveTrip(authedUser.id)
  }, [authedUser, rawTripData])

  // ── Autosave — fires on any content change AFTER trip is in DB ──────────────
  useEffect(() => {
    // Skip the very first run (initial mount / initial data load).
    // hasInitializedRef resets to false on every mount so we don't autosave
    // the state that was just set by the generate or DB-load effects.
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      return
    }

    // Gate: both conditions must be true for autosave to run.
    // Read tripId / authedUser at effect time — they don't need to be deps
    // because we only want content changes to trigger autosave, not auth changes.
    if (!tripId || !authedUser || loading) return

    clearTimeout(autoSaveTimerRef.current)
    setSaveStatus('saving')

    // Capture a snapshot of the current content at the moment the effect fires.
    // The timeout reads from this snapshot, not from a stale closure.
    const savedId = tripId
    const snapshot = { title: tripTitle, subtitle: tripSubtitle, days, packing, budgetRows }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        console.log('[autosave] patching trip:', savedId)
        const res = await fetch(`/api/trips/${savedId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ title: snapshot.title, trip_data: snapshot }),
        })
        if (res.ok) {
          console.log('[autosave] saved')
          setSaveStatus('saved')
          setTimeout(() => setSaveStatus('idle'), 2000)
        } else {
          console.warn('[autosave] failed:', res.status)
          setSaveStatus('idle')
        }
      } catch (err) {
        console.warn('[autosave] error:', err)
        setSaveStatus('idle')
      }
    }, 1500)

    return () => clearTimeout(autoSaveTimerRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, packing, budgetRows, tripTitle, tripSubtitle])

  // ── Paywall close (checkout is handled inside PaywallModal) ──────────────────
  function handlePaywallClose() {
    setPaywallOpen(false)
  }

  // ── Regenerate from pref drawer ──────────────────────────────────────────────
  async function regenerate() {
    // ── Paywall guard (DB-backed) ────────────────────────────────────────
    if (authedUser !== null) {
      const plan = planCredits as PlanState | null
      if (plan && !plan.is_subscriber && plan.trips_remaining <= 0) {
        setPrefOpen(false)
        setRegenConfirmOpen(false)
        setPaywallOpen(true)
        return
      }
    }

    setPrefOpen(false)
    setRegenConfirmOpen(false)
    // Snapshot the current working state before overwriting (preserves manual edits)
    const currentSnapshot: TripVersion = {
      label: versions[activeVersionIdx]?.label ?? 'Versión original',
      tripTitle, tripSubtitle, days, budgetRows, packing,
    }
    const nextIdx = versions.length   // index the new version will occupy
    setLoading(true)
    setError(null)
    try {
      const parsedInterests = prefInterests
        ? prefInterests.split(',').map((i) => i.trim()).filter(Boolean)
        : []
      const duration_days = Math.min(Math.max(parseInt(nights || '0', 10) || 3, 1), 30)
      const payload = {
        destination: prefDest, origin: prefOrigin, start: prefStart, end: prefEnd,
        nights, duration_days, traveler: prefTraveler, interests: parsedInterests, pace: prefPace, budget: prefBudget,
      }
      const genRes  = await fetch('/api/generate-trip', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const genData = await genRes.json().catch(() => null)
      setRawResponse(genData)
      if (!genRes.ok) throw new Error(typeof genData?.error === 'string' ? genData.error : 'Generation failed')
      const tripDataRaw = genData?.trip_data
      if (!tripDataRaw) throw new Error(`No trip_data. Got: ${JSON.stringify(genData)}`)
      setRawTripData(tripDataRaw)
      setTripId(null)  // reset — new version hasn't been saved yet
      const normalized = normalizeTripData({ trip_data: tripDataRaw }, prefDest, nights, prefInterests)
      setTripTitle(normalized.title)
      setTripSubtitle(normalized.subtitle)
      setDays(normalized.days)
      setDoneCheckIds(new Set())
      setBudgetRows(normalized.budgetRows)
      setPacking(normalized.packing)
      const newLabel = `v${nextIdx + 1}${prefPace ? ' · ' + (PACE_DISPLAY[prefPace] ?? prefPace) : ''}`
      const newVersion: TripVersion = { label: newLabel, tripTitle: normalized.title, tripSubtitle: normalized.subtitle, days: normalized.days, budgetRows: normalized.budgetRows, packing: normalized.packing }
      setVersions(prev => {
        const updated = [...prev]
        updated[activeVersionIdx] = currentSnapshot   // persist edited state
        return [...updated, newVersion]
      })
      setActiveVersionIdx(nextIdx)
      setHasUserEdits(false)

      // ── Decrement remaining trips after successful regeneration ────────
      if (authedUser !== null) {
        const planType = localStorage.getItem('planType') ?? 'free'
        if (planType !== 'subscription') {
          const remaining = parseInt(localStorage.getItem('remainingTrips') ?? '2', 10)
          const next = Math.max(0, remaining - 1)
          localStorage.setItem('remainingTrips', String(next))
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // ── Save / auth gate ─────────────────────────────────────────────────────────
  async function saveTrip(userId: string) {
    console.log('[SAVE TRIP CALLED]', { userId })
    if (!rawTripData) { showToast(locale === 'es' ? 'No hay viaje para guardar' : 'No trip to save'); return }
    try {
      const duration_days = Math.min(Math.max(parseInt(nights || '0', 10) || 3, 1), 30)
      const parsedInterests = prefInterests
        ? prefInterests.split(',').map((i) => i.trim()).filter(Boolean)
        : []
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title:        tripTitle || null,
          destination:  prefDest,
          origin:       prefOrigin,
          duration_days,
          travelers:    prefTraveler,
          travel_style: prefPace,
          budget_level: prefBudget,
          interests:    parsedInterests,
          trip_data:    rawTripData,
        }),
      })
      console.log('[saveTrip] res.status:', res.status)
      const data = await res.json()
      console.log('[saveTrip] response data:', JSON.stringify(data))
      if (data.success) {
        setTripId(data.trip_id)
        sessionStorage.removeItem('tripCache')
        showToast(locale === 'es' ? '🔖 Guardado en mis viajes' : '🔖 Saved to my trips')
      } else {
        showToast(locale === 'es' ? 'No se pudo guardar. Intenta de nuevo.' : 'Could not save. Try again.')
      }
    } catch {
      showToast(locale === 'es' ? 'Error al guardar' : 'Save error')
    }
  }

  function handleSave() {
    if (tripId) {
      showToast(locale === 'es' ? '✨ Ya está en Mis viajes' : '✨ Already in My trips')
      return
    }
    console.log('[HANDLE SAVE]', {
      authedUser,
      type: typeof authedUser,
      isNull: authedUser === null,
      isUndefined: authedUser === undefined,
    })
    if (!authedUser) {
      sessionStorage.setItem('pendingSave', JSON.stringify({ tripId }))
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search)
      router.push({ pathname: '/login' })
      return
    }
    saveTrip(authedUser.id)
  }

  // ── UI helpers ───────────────────────────────────────────────────────────────
  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function toggleDay(n: number) {
    setCollapsedDays(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s })
  }

  function toggleCard(id: string) {
    setCollapsedCards(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  function toggleDiaGroup(n: number) {
    setCollapsedDiaGroups(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s })
  }

  function toggleCheck(id: string) {
    setDoneCheckIds(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  function deleteItem(itemId: string, dayN: number) {
    setDays(prev => prev.map(day =>
      day.n !== dayN ? day : { ...day, items: day.items.filter(it => it.id !== itemId) }
    ))
    setHasUserEdits(true)
    showToast(locale === 'es' ? '✓ Actividad eliminada' : '✓ Activity removed')
  }

  function loadVersion(idx: number) {
    const v = versions[idx]
    if (!v) return
    setTripTitle(v.tripTitle)
    setTripSubtitle(v.tripSubtitle)
    setDays(v.days)
    setBudgetRows(v.budgetRows)
    setPacking(v.packing)
    setDoneCheckIds(new Set())
    setActiveVersionIdx(idx)
    setHasUserEdits(false)
  }

  // Regenerate with no confirmation: clears cache so a fresh generation always runs
  async function replaceTrip() {
    console.log('CONFIRM REGENERATE CLICKED')
    setRegenConfirmOpen(false)
    // Clear ALL cache keys before generating so the generate effect cannot restore old data
    sessionStorage.removeItem('tripCache')
    sessionStorage.removeItem('tripCache_key')
    sessionStorage.removeItem('tripCache_data')
    console.log('CACHE CLEARED')
    setLoading(true)
    setError(null)
    console.log('GENERATE CALLED')
    try {
      const parsedInterests = prefInterests
        ? prefInterests.split(',').map((i) => i.trim()).filter(Boolean)
        : []
      const duration_days = Math.min(Math.max(parseInt(nights || '0', 10) || 3, 1), 30)
      const payload = {
        destination: prefDest, origin: prefOrigin, start: prefStart, end: prefEnd,
        nights, duration_days, traveler: prefTraveler, interests: parsedInterests, pace: prefPace, budget: prefBudget,
      }
      const genRes  = await fetch('/api/generate-trip', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const genData = await genRes.json().catch(() => null)
      setRawResponse(genData)
      if (!genRes.ok) throw new Error(typeof genData?.error === 'string' ? genData.error : 'Generation failed')
      const tripDataRaw = genData?.trip_data
      if (!tripDataRaw) throw new Error(`No trip_data. Got: ${JSON.stringify(genData)}`)
      setRawTripData(tripDataRaw)
      setTripId(null)
      const normalized = normalizeTripData({ trip_data: tripDataRaw }, prefDest, nights, prefInterests)
      setTripTitle(normalized.title)
      setTripSubtitle(normalized.subtitle)
      setDays(normalized.days)
      setDoneCheckIds(new Set())
      setBudgetRows(normalized.budgetRows)
      setPacking(normalized.packing)
      // Write fresh cache so a subsequent login redirect restores this new trip
      sessionStorage.setItem('tripCache', JSON.stringify({ tripData: tripDataRaw, inputs: {
        destination: prefDest, origin: prefOrigin, start: prefStart, end: prefEnd,
        nights, traveler: prefTraveler, interests: prefInterests, pace: prefPace, budget: prefBudget,
      }}))
      setHasUserEdits(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function handleRegenClick() {
    if (loading) return
    if (hasUserEdits) {
      setRegenConfirmOpen(true)
    } else {
      sessionStorage.removeItem('tripCache')
      regenerate()
    }
  }

  function openBookingModal(item: ItineraryItem) {
    // 1. Item carries explicit hand-authored booking options
    if (item.bookingOptions && item.bookingOptions.length > 0) {
      setBookingModal({ itemName: item.name, itemType: item.type, options: item.bookingOptions })
      return
    }

    // 2. Item has a single affiliate URL — wrap as one provider row
    if (item.affiliate) {
      const prov = providerFromUrl(item.affiliate)
      const meta = LOGO_STYLE[prov] ?? LOGO_STYLE.manual
      setBookingModal({
        itemName: item.name,
        itemType: item.type,
        options: [{ id: 'aff-0', provider: prov, name: meta.text.replace('\n', '.'), desc: '', url: item.affiliate }],
      })
      return
    }

    // 3. Dynamic affiliate links based on category
    const options = getBookingOptions(item, {
      city:      destination,
      country:   detectCountryGroup(destination),
      startDate: prefStart || start,
      endDate:   prefEnd   || end,
    })
    if (options.length > 0) {
      setBookingModal({ itemName: item.name, itemType: item.type, options })
    }
  }

  function togglePacked(idx: number) {
    setPackedSet(prev => { const s = new Set(prev); s.has(idx) ? s.delete(idx) : s.add(idx); return s })
  }

  function openEditModal(item: ItineraryItem, dayN: number, isNew = false) {
    setEditModalItem(item)
    setEditModalDayN(dayN)
    setEditIsNew(isNew)
    setEditType(item.type)
    setEditName(item.name)
    setEditDesc(item.desc)
    setEditTime(item.time)
    setEditPrice(item.price ?? '')
  }

  function closeEditModal() {
    setEditModalItem(null)
    setEditModalDayN(null)
    setEditIsNew(false)
  }

  function saveEditModal() {
    if (!editModalItem || editModalDayN === null) return
    const updated: ItineraryItem = {
      ...editModalItem,
      type:  editType,
      name:  editName,
      desc:  editDesc,
      time:  editTime,
      price: editPrice || undefined,
    }
    setDays(prev => prev.map(day => {
      if (day.n !== editModalDayN) return day
      if (editIsNew) return { ...day, items: [...day.items, updated] }
      return { ...day, items: day.items.map(it => it.id === updated.id ? updated : it) }
    }))
    setHasUserEdits(true)
    closeEditModal()
    showToast(locale === 'es' ? '✓ Cambios guardados' : '✓ Changes saved')
  }

  function addDay() {
    const newN = days.length > 0 ? Math.max(...days.map(d => d.n)) + 1 : 1
    const newDay: Day = {
      n:        newN,
      label:    locale === 'es' ? `Día ${String(newN).padStart(2, '0')}` : `Day ${String(newN).padStart(2, '0')}`,
      title:    locale === 'es' ? 'Nuevo día' : 'New day',
      progress: 0,
      items:    [],
    }
    setDays(prev => [...prev, newDay])
    setHasUserEdits(true)
    showToast(locale === 'es' ? `✓ Día ${newN} añadido` : `✓ Day ${newN} added`)
  }

  function addItem(dayN: number) {
    const newItem: ItineraryItem = {
      id:   `item-new-${Date.now()}`,
      type: 'free',
      time: '',
      name: '',
      desc: '',
    }
    openEditModal(newItem, dayN, true)
  }

  // ── Derived checklist — always reflects current days state ──────────────────
  const checks = useMemo(
    () => deriveChecksFromDays(days).map(c => ({ ...c, done: doneCheckIds.has(c.id) })),
    [days, doneCheckIds],
  )

  // ── Computed values ──────────────────────────────────────────────────────────
  const totalBudget = budgetRows.reduce((sum, row) => sum + row.amount, 0)
  const nightsNum   = parseInt(nights || '0', 10) || 3
  // dateRange uses pref state so it reflects the most-recently-regenerated trip
  const dateRange   = prefStart && prefEnd ? `${prefStart} — ${prefEnd}` : `${nightsNum} noches`
  const doneChecks  = checks.filter(c => c.done).length
  const totalChecks = checks.length
  const progressPct = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0
  const nextCheck   = checks.find(c => !c.done)
  const checksBefore = checks.filter(c => !c.day)
  const dayNums     = Array.from(new Set(checks.filter(c => c.day).map(c => c.day!))).sort((a, b) => a - b)

  const budgetByCategory = budgetRows.reduce<Record<string, BudgetRow[]>>((acc, row) => {
    const cat = row.category || 'Otros'
    ;(acc[cat] = acc[cat] || []).push(row)
    return acc
  }, {})

  // ── Early returns ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="pt-[72px] min-h-screen bg-[#FAF8F5]">
        <div className="page-inner"><LoadingState locale={locale} /></div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="pt-[72px] min-h-screen bg-[#F4F0E8]">
        <div className="page-inner py-10">
          <div className="max-w-[900px] mx-auto bg-white border border-[rgba(15,58,51,.12)] rounded-[12px] p-6">
            <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#B33A3A] mb-3">Generation error</p>
            <h1 className="font-sans text-[24px] font-semibold text-[#0F3A33] mb-3">
              The planner reached the API, but the response is not ready for the UI yet.
            </h1>
            <p className="font-sans text-[14px] text-[#4F6F68] mb-4">
              This is progress. We are past the original submit issue and now inspecting the real backend response.
            </p>
            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[1px] uppercase text-[#6B8F86] mb-2">Error</p>
              <pre className="bg-[#F7F3EE] text-[#0F3A33] text-[12px] p-4 rounded-[8px] overflow-auto whitespace-pre-wrap">{error}</pre>
            </div>
            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[1px] uppercase text-[#6B8F86] mb-2">Raw response</p>
              <pre className="bg-[#F7F3EE] text-[#0F3A33] text-[12px] p-4 rounded-[8px] overflow-auto whitespace-pre-wrap">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>
            <Link
              href="/planner"
              className="inline-block font-mono text-[10px] tracking-[1.2px] uppercase bg-[#0F3A33] text-[#FFF9F3] px-4 py-3 rounded-[4px]"
            >
              Back to planner
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── Happy path ───────────────────────────────────────────────────────────────
  return (
    <main className="pt-[72px] min-h-screen bg-[#FAF8F5]">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section data-trip="hero" className="border-b border-[#E4DFD8] pt-12 pb-9">
        <div className="max-w-[1160px] mx-auto px-7">
          <div className="grid grid-cols-[1fr_360px] gap-[52px] items-start max-[860px]:grid-cols-1">

            {/* Hero left */}
            <div>
              {/* Eyebrow — uses pref state so it updates after regeneration */}
              <div data-trip-hero="eyebrow" className="font-mono text-[10px] tracking-[.16em] uppercase text-[#6B8F86] mb-4 flex items-center gap-2.5">
                <span className="w-[22px] h-px bg-[#6B8F86] shrink-0" />
                {prefOrigin ? `${prefOrigin} → ${prefDest}` : 'Resultado del plan'}
              </div>

              {/* Title */}
              <h1 data-trip-hero="title" className="font-display text-[clamp(34px,4vw,52px)] font-normal leading-[1.06] tracking-[-0.03em] text-[#1C1C1A] mb-3.5">
                {tripTitle || `Tu viaje a`}<br />
                <em className="italic text-[#0F3A33]">{prefDest}</em>
              </h1>

              {/* Subtitle */}
              <p data-trip-hero="subtitle" className="text-[14px] font-light leading-[1.75] text-[#7A7A76] max-w-[420px] mb-6">
                {tripSubtitle}
              </p>

              {/* Meta pills — all from pref state so they reflect regeneration */}
              <div data-trip-hero="chips" className="flex flex-wrap gap-1.5 mb-7">
                <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full">
                  <span>📅</span> {dateRange}
                </span>
                {prefDest && (
                  <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full">
                    <span>📍</span> {prefDest}
                  </span>
                )}
                {prefTraveler && (
                  <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full capitalize">
                    <span>👥</span> {prefTraveler}
                  </span>
                )}
                {prefPace && (
                  <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full">
                    <span>🧭</span> {PACE_DISPLAY[prefPace] ?? prefPace}
                  </span>
                )}
                {prefBudget && (
                  <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full">
                    <span>💰</span> {budgetLabel(prefBudget)}
                  </span>
                )}
              </div>

              {/* Action row */}
              <div data-trip="action-row" className="flex items-center pt-[18px] border-t border-[#E4DFD8]">
                <button
                  className={`flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] pr-[15px] transition-colors ${tripId ? 'text-[#2D6B57] cursor-default' : 'text-[#7A7A76] hover:text-[#0F3A33]'}`}
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                >
                  {!tripId && <><span>🔖</span> {locale === 'es' ? 'Guardar' : 'Save'}</>}
                  {tripId && saveStatus === 'saving' && <><span className="animate-pulse">💾</span> {locale === 'es' ? 'Guardando…' : 'Saving…'}</>}
                  {tripId && saveStatus !== 'saving' && <><span>✔</span> {locale === 'es' ? 'Guardado' : 'Saved'}</>}
                </button>
                <span className="text-[#CEC8C0] pr-[15px] text-[10px]">·</span>
                <button
                  className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#7A7A76] pr-[15px] hover:text-[#0F3A33] transition-colors"
                  onClick={() => {
                    if (!tripId) {
                      showToast(locale === 'es' ? '🔖 Guarda el viaje primero para compartirlo' : '🔖 Save the trip first to share it')
                      return
                    }
                    setShareOpen(true)
                  }}
                >
                  <span>↗</span> {locale === 'es' ? 'Compartir' : 'Share'}
                </button>
                <span className="text-[#CEC8C0] pr-[15px] text-[10px]">·</span>
                <button
                  className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#7A7A76] hover:text-[#0F3A33] transition-colors"
                  onClick={() => {
                    showToast(locale === 'es' ? '📄 Generando PDF…' : '📄 Generating PDF…')
                    setTimeout(() => window.print(), 300)
                  }}
                >
                  <span>⬇</span> PDF
                </button>
              </div>
            </div>

            {/* Hero right — image card */}
            <div className="max-[860px]:order-first">
              <div className="w-full aspect-[4/3] rounded-[26px] overflow-hidden relative bg-[#0F3A33]">
                <Image
                  src="/images/guides/guides-headers/lagomplan-worldmap.jpg"
                  alt="Lagomplan world map"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 860px) 100vw, 360px"
                />
                {/* Gradient overlay so the destination label stays readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,58,51,.55)] via-transparent to-transparent" />
                <span className="absolute bottom-[22px] left-[22px] font-display italic text-[24px] font-light text-white/90 tracking-[-0.01em]">
                  {prefDest || 'Tu destino'}
                </span>
                {prefOrigin && (
                  <span className="absolute top-3.5 right-3.5 font-mono text-[9px] font-medium tracking-[.12em] uppercase text-white bg-[rgba(15,58,51,.65)] backdrop-blur-sm px-2.5 py-[3px] rounded-full">
                    desde {prefOrigin}
                  </span>
                )}
              </div>

              {/* Ajustar preferencias button */}
              <button
                className="flex items-center justify-center gap-1.5 mt-2.5 w-full font-mono text-[10px] font-medium tracking-[.08em] text-[#0F3A33] bg-transparent border border-[rgba(15,58,51,.2)] rounded-[8px] px-3.5 py-[7px] hover:bg-[rgba(15,58,51,.06)] transition-colors"
                onClick={() => setPrefOpen(v => !v)}
              >
                Ajustar preferencias{' '}
                <span
                  className="inline-block transition-transform duration-300"
                  style={{ transform: prefOpen ? 'rotate(180deg)' : 'none' }}
                >
                  ▾
                </span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── PREF DRAWER ───────────────────────────────────────────────────── */}
      <div data-trip="pref-drawer" className="border-b border-[#E4DFD8]">
        <div
          style={{
            maxHeight: prefOpen ? '900px' : '0',
            opacity: prefOpen ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.4s ease, opacity 0.3s ease',
          }}
        >
          <div className="max-w-[1160px] mx-auto px-7 py-6">
            <div className="grid grid-cols-3 gap-4 max-[600px]:grid-cols-1">

              {/* Origin */}
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#7A7A76] mb-1.5">
                  Ciudad de origen
                </label>
                <input
                  type="text"
                  value={prefOrigin}
                  onChange={e => setPrefOrigin(e.target.value)}
                  className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33] appearance-none"
                  placeholder="Ej. Ciudad de México"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#7A7A76] mb-1.5">
                  Destino
                </label>
                <input
                  type="text"
                  value={prefDest}
                  onChange={e => setPrefDest(e.target.value)}
                  className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
                  placeholder="Ej. Puerto Vallarta"
                />
              </div>

              {/* Dates */}
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#7A7A76] mb-1.5">
                  Fechas
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={prefStart}
                    onChange={e => setPrefStart(e.target.value)}
                    className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
                    placeholder="Inicio"
                  />
                  <input
                    type="text"
                    value={prefEnd}
                    onChange={e => setPrefEnd(e.target.value)}
                    className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
                    placeholder="Fin"
                  />
                </div>
              </div>

              {/* Pace */}
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#7A7A76] mb-1.5">
                  Ritmo
                </label>
                <select
                  value={prefPace}
                  onChange={e => setPrefPace(e.target.value)}
                  className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33] appearance-none"
                >
                  <option value="Relajado">Relajado · Pocas actividades</option>
                  <option value="Equilibrado">Equilibrado</option>
                  <option value="Activo">Activo · Máx. experiencias</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#7A7A76] mb-1.5">
                  Presupuesto
                </label>
                <select
                  value={prefBudget}
                  onChange={e => setPrefBudget(e.target.value)}
                  className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33] appearance-none"
                >
                  <option value="$10k–$15k">$10k–$15k</option>
                  <option value="$15k–$25k">$15k–$25k</option>
                  <option value="$25k–$40k">$25k–$40k</option>
                  <option value="$40k+">$40k+</option>
                </select>
              </div>

              {/* Interests */}
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#7A7A76] mb-1.5">
                  Intereses
                </label>
                <input
                  type="text"
                  value={prefInterests}
                  onChange={e => setPrefInterests(e.target.value)}
                  className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
                  placeholder="playa, gastronomía, cultura…"
                />
              </div>

              {/* Traveler chips + expanded detail */}
              <div className="col-span-3 max-[600px]:col-span-1">
                <label className="block font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#7A7A76] mb-1.5">
                  ¿Quién viaja?
                </label>
                <div className="grid grid-cols-4 gap-2 max-[480px]:grid-cols-2">
                  {[
                    { key: 'pareja',  icon: '💑',        label: 'Pareja' },
                    { key: 'solo',    icon: '🧳',        label: 'Solo' },
                    { key: 'familia', icon: '👨‍👩‍👧‍👦', label: 'Familia' },
                    { key: 'amigos',  icon: '🙌',        label: 'Amigos' },
                  ].map(chip => (
                    <button
                      key={chip.key}
                      onClick={() => setPrefTraveler(chip.key)}
                      className="flex flex-col items-center gap-1 py-2.5 px-1.5 border-[1.5px] rounded-[6px] font-sans text-[11px] font-normal transition-all"
                      style={prefTraveler === chip.key
                        ? { borderColor: '#0F3A33', background: 'rgba(15,58,51,.04)', color: '#0F3A33' }
                        : { borderColor: '#E4DFD8', background: '#fff', color: '#7A7A76' }
                      }
                    >
                      <span className="text-[18px]">{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>

                {/* ── Familia expanded ── */}
                {prefTraveler === 'familia' && (
                  <div className="mt-3 flex flex-col gap-2.5">
                    {/* Adults stepper */}
                    <div className="flex items-center gap-3 bg-white border border-[#E4DFD8] rounded-[10px] px-3 py-2.5">
                      <span className="font-sans text-[12px] font-medium text-[#1C1C1A] flex-1">Adultos</span>
                      <div className="flex">
                        <button
                          onClick={() => setPrefAdults(n => Math.max(1, n - 1))}
                          className="w-8 h-8 border border-[rgba(107,143,134,.28)] bg-white flex items-center justify-center text-[#0F3A33] text-[16px] hover:bg-[rgba(15,58,51,.06)] transition-colors rounded-l-[4px]"
                        >−</button>
                        <div className="w-9 h-8 border-y border-[rgba(107,143,134,.28)] bg-white flex items-center justify-center font-mono text-[12px] text-[#0F3A33]">
                          {prefAdults}
                        </div>
                        <button
                          onClick={() => setPrefAdults(n => Math.min(10, n + 1))}
                          className="w-8 h-8 border border-[rgba(107,143,134,.28)] bg-white flex items-center justify-center text-[#0F3A33] text-[16px] hover:bg-[rgba(15,58,51,.06)] transition-colors rounded-r-[4px]"
                        >+</button>
                      </div>
                    </div>
                    {/* Children ages */}
                    <div>
                      <p className="font-sans text-[12px] font-medium text-[#1C1C1A] mb-2">Edades de los niños</p>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {prefChildren.map(child => (
                          <div key={child.id} className="flex items-center gap-1.5 bg-white border border-[#E4DFD8] rounded-full px-3 py-1.5">
                            <span className="text-[12px]">{child.type === 'baby' ? '👶' : '🧒'}</span>
                            <select
                              value={child.age}
                              title="age"
                              onChange={e => setPrefChildren(prev => prev.map(c => c.id === child.id ? { ...c, age: e.target.value } : c))}
                              className="font-sans text-[11px] text-[#0F3A33] border-none bg-transparent cursor-pointer outline-none appearance-none"
                            >
                              {(child.type === 'baby' ? BABY_AGES : KID_AGES).map(age => (
                                <option key={age}>{age}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setPrefChildren(prev => prev.filter(c => c.id !== child.id))}
                              className="text-[#B8B5AF] hover:text-[#3D3D3A] text-[13px] leading-none transition-colors"
                            >×</button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setPrefChildren(prev => [...prev, { id: prefNextKidId, type: 'kid', age: '3 años' }])
                            setPrefNextKidId(n => n + 1)
                          }}
                          className="font-mono text-[10px] text-[#0F3A33] border border-dashed border-[rgba(15,58,51,.25)] rounded-full px-3 py-1.5 hover:border-[#0F3A33] hover:bg-[rgba(15,58,51,.04)] transition-all"
                        >
                          + Añadir niño
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Amigos expanded ── */}
                {prefTraveler === 'amigos' && (
                  <div className="mt-3">
                    <div className="flex items-center gap-3 bg-white border border-[#E4DFD8] rounded-[10px] px-3 py-2.5">
                      <span className="font-sans text-[12px] font-medium text-[#1C1C1A] flex-1">¿Cuántos viajan?</span>
                      <div className="flex">
                        <button
                          onClick={() => setPrefGroupCount(n => Math.max(2, n - 1))}
                          className="w-8 h-8 border border-[rgba(107,143,134,.28)] bg-white flex items-center justify-center text-[#0F3A33] text-[16px] hover:bg-[rgba(15,58,51,.06)] transition-colors rounded-l-[4px]"
                        >−</button>
                        <div className="w-9 h-8 border-y border-[rgba(107,143,134,.28)] bg-white flex items-center justify-center font-mono text-[12px] text-[#0F3A33]">
                          {prefGroupCount}
                        </div>
                        <button
                          onClick={() => setPrefGroupCount(n => Math.min(30, n + 1))}
                          className="w-8 h-8 border border-[rgba(107,143,134,.28)] bg-white flex items-center justify-center text-[#0F3A33] text-[16px] hover:bg-[rgba(15,58,51,.06)] transition-colors rounded-r-[4px]"
                        >+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="col-span-3 max-[600px]:col-span-1 flex justify-end gap-2">
                <button
                  onClick={() => setPrefOpen(false)}
                  className="text-[13px] text-[#7A7A76] px-[15px] py-[7px] border border-[#E4DFD8] rounded-[6px] bg-white"
                >
                  {locale === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleRegenClick}
                  disabled={loading}
                  className="text-[13px] font-medium text-white px-[17px] py-[7px] bg-[#0F3A33] rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? (locale === 'es' ? 'Generando...' : 'Generating...')
                    : (locale === 'es' ? 'Actualizar plan' : 'Update plan')}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROL BAR ───────────────────────────────────────────────────── */}
      <div data-trip="control-bar" className="bg-[#0F3A33]">
        <div className="max-w-[1160px] mx-auto px-7">
          <div className="flex items-center h-[50px]">

            {/* Progress */}
            <div className="flex items-center gap-[11px] pr-[22px] border-r border-white/10 shrink-0 min-w-[150px]">
              <span className="font-mono text-[11px] font-medium tracking-[.04em] text-white/90 whitespace-nowrap">
                {totalChecks > 0 ? `${doneChecks} de ${totalChecks} listos` : `${days.length} días`}
              </span>
              <div className="w-[72px] h-[3px] bg-white/15 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-[#A8C4BE] rounded-full transition-all duration-1000"
                  style={{ width: `${totalChecks > 0 ? progressPct : (days.length > 0 ? 100 : 0)}%` }}
                />
              </div>
            </div>

            {/* Next step */}
            <div className="flex items-center gap-[9px] px-[22px] flex-1 min-w-0">
              <span className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-white/40 shrink-0">
                Siguiente
              </span>
              {nextCheck ? (
                <>
                  <span className="text-[13px] shrink-0">{nextCheck.icon}</span>
                  <span className="text-[12px] text-white/80 whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
                    {nextCheck.text}
                  </span>
                </>
              ) : days.length > 0 ? (
                <span className="text-[12px] text-white/60 flex-1">
                  {days[0]?.title || `Día 1`}
                </span>
              ) : null}
            </div>

          </div>
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1160px] mx-auto px-7 pt-9 pb-20">
        <div className="grid grid-cols-[1fr_310px] gap-8 items-start max-[900px]:grid-cols-1">

          {/* ── LEFT: Itinerary ─────────────────────────────────────────── */}
          <div data-trip="itinerary">
            {/* Version switcher — only shown when multiple versions exist */}
            {versions.length > 1 && (
              <div className="flex items-center gap-[5px] flex-wrap mb-4">
                <span className="font-mono text-[8px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mr-1">Versiones</span>
                {versions.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => loadVersion(i)}
                    className="font-mono text-[9px] font-medium tracking-[.06em] uppercase px-[8px] py-[3px] rounded-full border transition-all"
                    style={i === activeVersionIdx
                      ? { color: '#0F3A33', background: 'rgba(15,58,51,.08)', borderColor: 'rgba(15,58,51,.3)' }
                      : { color: '#B8B5AF', background: 'white', borderColor: '#E4DFD8' }
                    }
                  >
                    {v.label}
                  </button>
                ))}
                {hasUserEdits && (
                  <span className="font-mono text-[8px] font-medium tracking-[.06em] uppercase text-[#D97706] bg-[rgba(217,119,6,.1)] border border-[rgba(217,119,6,.2)] px-[6px] py-px rounded-full">
                    editado
                  </span>
                )}
              </div>
            )}

            {/* Section header */}
            <div className="flex items-baseline justify-between mb-[18px]">
              <div>
                <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-1">
                  Tu itinerario
                </div>
                <div className="font-display text-[19px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                  {nightsNum} días en {prefDest || 'tu destino'}
                </div>
              </div>
              <button
                className="font-mono text-[10px] font-medium tracking-[.06em] text-[#0F3A33]"
                onClick={addDay}
              >
                + Añadir día
              </button>
            </div>

            {/* Day cards */}
            <div className="flex flex-col gap-3.5">
              {days.length === 0 ? (
                <div className="bg-white border border-[#E4DFD8] rounded-[18px] p-6">
                  <p className="font-sans text-[15px] text-[#7A7A76]">
                    The API returned successfully, but no itinerary days were found in the expected format.
                  </p>
                </div>
              ) : (
                days.map((day) => {
                  const isCollapsed = collapsedDays.has(day.n)
                  const dayNextCheck = checks.find(c => c.day === day.n && !c.done)

                  return (
                    <div
                      key={day.n}
                      data-trip-day="card"
                      className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)] hover:shadow-[0_2px_8px_rgba(15,58,51,.07)] transition-shadow"
                    >
                      {/* Day header */}
                      <div
                        data-trip-day="header"
                        className="flex items-center justify-between px-[18px] py-3.5 cursor-pointer select-none border-b border-[#E4DFD8]"
                        onClick={() => toggleDay(day.n)}
                      >
                        <div>
                          <div data-trip-day="label" className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-[3px]">
                            {day.label}
                          </div>
                          <div data-trip-day="title" className="font-display text-[15px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                            {day.title}
                          </div>
                        </div>
                        <div className="flex items-center gap-[9px]">
                          {day.progress > 0 && (
                            <span className="font-mono text-[9px] font-medium tracking-[.06em] text-[#6B8F86] bg-[rgba(107,143,134,.1)] px-[7px] py-px rounded-full">
                              {day.progress}% listo
                            </span>
                          )}
                          <div
                            className="w-5 h-5 rounded-[5px] bg-[#EDE7E1] flex items-center justify-center text-[9px] text-[#7A7A76] transition-transform duration-300"
                            style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none' }}
                          >
                            ▾
                          </div>
                        </div>
                      </div>

                      {/* Day body */}
                      <div
                        data-trip-day="body"
                        style={{
                          maxHeight: isCollapsed ? '0' : '3000px',
                          opacity: isCollapsed ? 0 : 1,
                          overflow: 'hidden',
                          transition: 'max-height 0.4s ease, opacity 0.3s',
                        }}
                      >
                        {/* Items */}
                        <div className="px-[18px] pb-1">
                          {day.items.map((item, idx) => {
                            const tinfo  = TYPE_INFO[item.type]  ?? { icon: '•', label: item.type }
                            const tbadge = TYPE_BADGE[item.type] ?? { color: '#7A7A76', bg: '#EDE7E1' }
                            const tborder= TYPE_BORDER[item.type] ?? '#CEC8C0'
                            const trowbg = TYPE_ROW_BG[item.type] ?? 'transparent'

                            return (
                              <div
                                key={item.id}
                                data-trip-item="row"
                                className="grid grid-cols-[28px_1fr_auto] gap-3 items-start py-3.5 border-b border-[#E4DFD8] last:border-b-0 pl-2.5 -ml-2.5 border-l-[3px] hover:bg-[rgba(237,231,225,.3)] transition-colors"
                                style={{ borderLeftColor: tborder, background: trowbg }}
                              >
                                {/* Index — type-color anchors the left accent rail */}
                                <div
                                  className="font-mono text-[10px] pt-3.5"
                                  style={{ color: tbadge.color, opacity: 0.75 }}
                                >
                                  {String(idx + 1).padStart(2, '0')}
                                </div>

                                {/* Content */}
                                <div data-trip-item="content">
                                  <div className="flex items-center gap-[5px] flex-wrap mb-1">
                                    <span
                                      data-trip-item="type"
                                      className="font-mono text-[9px] font-medium tracking-[.08em] uppercase px-[6px] py-[2px] rounded-[3px]"
                                      style={{ color: tbadge.color, background: tbadge.bg }}
                                    >
                                      {tinfo.icon} {tinfo.label}
                                    </span>
                                    {item.time && (
                                      <span data-trip-item="time" className="font-mono text-[9px] text-[#0F3A33] border border-[rgba(15,58,51,.18)] px-[5px] py-px rounded-[3px]">
                                        {item.time}
                                      </span>
                                    )}
                                    {/* Status dot — matches prototype .item-pending-dot */}
                                    <span
                                      className="w-[6px] h-[6px] rounded-full shrink-0"
                                      style={{ background: tbadge.color, opacity: 0.3 }}
                                      title="Pendiente"
                                    />
                                  </div>
                                  <div data-trip-item="name" className="text-[13px] font-medium text-[#1C1C1A] leading-[1.3] mb-[3px]">
                                    {item.name}
                                  </div>
                                  <div data-trip-item="desc" className="text-[11.5px] font-light text-[#7A7A76] leading-[1.6]">
                                    {item.desc}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end gap-[5px] shrink-0 pt-3">
                                  {item.price && (
                                    <div className="font-mono text-[13px] font-medium text-[#1C1C1A] text-right">
                                      {item.price}
                                    </div>
                                  )}
                                  <div className="flex flex-col gap-[3px] items-end">
                                    {/* Opens booking modal — hidden for libre/free items */}
                                    {item.type !== 'free' && (
                                    <button
                                      onClick={() => openBookingModal(item)}
                                      className="flex items-center gap-1 font-mono text-[10px] font-medium tracking-[.06em] uppercase text-white bg-[#0F3A33] px-2.5 py-[5px] rounded-[4px] hover:bg-[#1A5247] hover:-translate-y-px transition-all whitespace-nowrap"
                                    >
                                      {item.affiliate || item.bookingOptions ? 'Ver opciones' : 'Reservar'}
                                    </button>
                                    )}
                                    <button
                                      className="font-mono text-[10px] text-[#B8B5AF] px-[6px] py-[3px] rounded-[4px] hover:text-[#0F3A33] hover:bg-[rgba(15,58,51,.05)] transition-all"
                                      onClick={() => openEditModal(item, day.n)}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      className="font-mono text-[10px] text-[#B8B5AF] px-[6px] py-[3px] rounded-[4px] hover:text-[#B94030] hover:bg-[rgba(185,64,48,.05)] transition-all"
                                      onClick={() => deleteItem(item.id, day.n)}
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Next-step banner */}
                        {dayNextCheck && (
                          <div className="flex items-center gap-[7px] mx-[18px] mb-3.5 px-3 py-2.5 bg-[rgba(107,143,134,.07)] border border-[rgba(107,143,134,.2)] rounded-[6px]">
                            <div className="w-[5px] h-[5px] rounded-full bg-[#6B8F86] shrink-0 animate-pulse" />
                            <div className="text-[11px] text-[#6B8F86] leading-[1.4]">
                              <strong className="font-semibold">Siguiente paso:</strong> {dayNextCheck.text}
                            </div>
                          </div>
                        )}

                        {/* Add item row */}
                        <button
                          className="flex items-center gap-[7px] w-full px-[18px] py-3 bg-transparent border-t border-dashed border-[#E4DFD8] text-[#7A7A76] text-[12px] hover:bg-[#EDE7E1] hover:text-[#0F3A33] transition-colors"
                          onClick={() => addItem(day.n)}
                        >
                          <span className="w-[17px] h-[17px] rounded-full bg-[#E2DAD2] flex items-center justify-center text-[12px] text-[#3D3D3A] shrink-0">
                            +
                          </span>
                          Añadir al {day.label || `Día ${day.n}`}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ── RIGHT: Sidebar cards ─────────────────────────────────────── */}
          <aside data-trip="sidebar" className="flex flex-col gap-2.5 max-[900px]:order-first">
            <div className="sticky top-[76px] flex flex-col gap-2.5">

              {/* Planea tu viaje — checks */}
              <div data-trip="planning" className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)]">
                <div
                  className="flex items-center justify-between px-4 py-[13px] cursor-pointer select-none hover:bg-[#EDE7E1] transition-colors gap-2.5"
                  onClick={() => toggleCard('planning')}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="font-display text-[14px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                      Planea tu viaje
                    </span>
                    {totalChecks > 0 && (
                      <span className="font-mono text-[9px] font-medium tracking-[.06em] text-[#6B8F86] bg-[rgba(107,143,134,.12)] px-[6px] py-px rounded-full shrink-0">
                        {doneChecks} / {totalChecks}
                      </span>
                    )}
                  </div>
                  <div
                    className="w-[19px] h-[19px] rounded-[4px] bg-[#EDE7E1] flex items-center justify-center text-[9px] text-[#7A7A76] shrink-0 transition-transform duration-300"
                    style={{ transform: collapsedCards.has('planning') ? 'rotate(-90deg)' : 'none' }}
                  >
                    ▾
                  </div>
                </div>

                <div
                  style={{
                    maxHeight: collapsedCards.has('planning') ? '0' : '1200px',
                    opacity: collapsedCards.has('planning') ? 0 : 1,
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease, opacity 0.3s',
                  }}
                >
                  <div className="border-t border-[#E4DFD8] px-4 pt-3 pb-4">

                    {checksBefore.length > 0 && (
                      <>
                        <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] py-2 border-b border-[#E4DFD8]">
                          Antes del viaje
                        </div>
                        {checksBefore.map(check => (
                          <CheckRow key={check.id} check={check} onToggle={toggleCheck} />
                        ))}
                      </>
                    )}

                    {dayNums.length > 0 && (
                      <>
                        <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] py-2 border-b border-[#E4DFD8] mt-1.5">
                          Por día
                        </div>
                        {dayNums.map(dayN => {
                          const dayChecks = checks.filter(c => c.day === dayN)
                          const dayData   = days.find(d => d.n === dayN)
                          const isCollDia = collapsedDiaGroups.has(dayN)
                          const doneInDay = dayChecks.filter(c => c.done).length

                          return (
                            <div key={dayN} className="border-b border-[#E4DFD8] last:border-b-0">
                              <div
                                className="flex items-center justify-between py-[7px] cursor-pointer select-none"
                                onClick={() => toggleDiaGroup(dayN)}
                              >
                                <div className="flex items-center gap-[7px]">
                                  <span className="font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76]">
                                    Día {String(dayN).padStart(2, '0')}
                                  </span>
                                  {dayData && (
                                    <span className="text-[11.5px] font-medium text-[#1C1C1A] truncate max-w-[110px]">
                                      {dayData.title}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-[7px]">
                                  <span className="font-mono text-[9px] font-medium tracking-[.04em] text-[#6B8F86] bg-[rgba(107,143,134,.1)] px-[6px] py-px rounded-full">
                                    {doneInDay} / {dayChecks.length}
                                  </span>
                                  <span
                                    className="text-[9px] text-[#B8B5AF] transition-transform duration-300 inline-block"
                                    style={{ transform: isCollDia ? 'rotate(-90deg)' : 'none' }}
                                  >
                                    ▾
                                  </span>
                                </div>
                              </div>
                              <div
                                style={{
                                  maxHeight: isCollDia ? '0' : '500px',
                                  opacity: isCollDia ? 0 : 1,
                                  overflow: 'hidden',
                                  transition: 'max-height 0.35s ease, opacity 0.25s',
                                  paddingLeft: '4px',
                                }}
                              >
                                {dayChecks.map(check => (
                                  <CheckRow key={check.id} check={check} onToggle={toggleCheck} />
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}

                    {totalChecks === 0 && (
                      <p className="text-[11px] text-[#7A7A76] italic py-2">
                        No hay elementos de planificación.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Qué llevar — always rendered, empty state when no packing data */}
              <div data-trip="packing" className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)]">
                <div
                  className="flex items-center justify-between px-4 py-[13px] cursor-pointer select-none hover:bg-[#EDE7E1] transition-colors gap-2.5"
                  onClick={() => toggleCard('packing')}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="font-display text-[14px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                      Qué llevar
                    </span>
                    {packing.length > 0 && (
                      <span className="font-mono text-[9px] font-medium tracking-[.06em] text-[#6B8F86] bg-[rgba(107,143,134,.12)] px-[6px] py-px rounded-full shrink-0">
                        {packing.length}
                      </span>
                    )}
                  </div>
                  <div
                    className="w-[19px] h-[19px] rounded-[4px] bg-[#EDE7E1] flex items-center justify-center text-[9px] text-[#7A7A76] shrink-0 transition-transform duration-300"
                    style={{ transform: collapsedCards.has('packing') ? 'rotate(-90deg)' : 'none' }}
                  >
                    ▾
                  </div>
                </div>

                <div
                  data-trip-card="packing-body"
                  style={{
                    maxHeight: collapsedCards.has('packing') ? '0' : '800px',
                    opacity: collapsedCards.has('packing') ? 0 : 1,
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease, opacity 0.3s',
                  }}
                >
                  <div className="border-t border-[#E4DFD8] px-4 py-3">
                    {packing.length === 0 ? (
                      <p className="text-[11px] text-[#7A7A76] italic py-1">
                        El plan no incluye lista de equipaje.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-[5px]">
                        {packing.map((item, i) => (
                          <div key={`${item}-${i}`} className="flex items-center gap-[7px]">
                            <button
                              className="w-3.5 h-3.5 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 transition-all"
                              style={packedSet.has(i)
                                ? { background: '#0F3A33', borderColor: '#0F3A33' }
                                : { background: '#fff', borderColor: '#CEC8C0' }
                              }
                              onClick={() => togglePacked(i)}
                            >
                              {packedSet.has(i) && (
                                <span className="text-[9px] text-white font-semibold leading-none">✓</span>
                              )}
                            </button>
                            <span
                              className="text-[11.5px] font-normal flex-1 leading-[1.3]"
                              style={packedSet.has(i)
                                ? { textDecoration: 'line-through', color: '#B8B5AF' }
                                : { color: '#3D3D3A' }
                              }
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Presupuesto — always rendered, empty state when no budget data */}
              <div data-trip="budget" className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)]">
                <div
                  className="flex items-center justify-between px-4 py-[13px] cursor-pointer select-none hover:bg-[#EDE7E1] transition-colors"
                  onClick={() => toggleCard('budget')}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[14px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                      Presupuesto
                    </span>
                    {totalBudget > 0 && (
                      <span className="font-mono text-[12px] font-medium text-[#3D3D3A]">
                        ${totalBudget.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div
                    className="text-[9px] text-[#7A7A76] transition-transform duration-300 inline-block"
                    style={{ transform: collapsedCards.has('budget') ? 'rotate(-90deg)' : 'none' }}
                  >
                    ▾
                  </div>
                </div>

                <div
                  data-trip-card="budget-body"
                  style={{
                    maxHeight: collapsedCards.has('budget') ? '0' : '900px',
                    opacity: collapsedCards.has('budget') ? 0 : 1,
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease, opacity 0.3s',
                  }}
                >
                  <div className="border-t border-[#E4DFD8]">
                    {budgetRows.length === 0 ? (
                      <div className="px-4 py-3">
                        <p className="text-[11px] text-[#7A7A76] italic">
                          El plan no incluye desglose de presupuesto.
                        </p>
                      </div>
                    ) : (
                      <>
                        {Object.entries(budgetByCategory).map(([cat, rows]) => {
                          const catTotal = rows.reduce((s, r) => s + r.amount, 0)
                          return (
                            <div key={cat} className="border-b border-[#E4DFD8] last:border-b-0">
                              <div className="flex items-center justify-between px-4 py-[5px] bg-[#EDE7E1]">
                                <span className="font-mono text-[8px] font-medium tracking-[.12em] uppercase text-[#7A7A76]">
                                  {cat}
                                </span>
                                <span className="font-mono text-[10px] font-medium text-[#3D3D3A]">
                                  ${catTotal.toLocaleString()}
                                </span>
                              </div>
                              {rows.map(row => (
                                <div
                                  key={row.id}
                                  className="flex items-center justify-between px-4 py-2 border-b border-[#E4DFD8] last:border-b-0 hover:bg-[#EDE7E1] transition-colors"
                                >
                                  <span className="text-[11px] font-normal text-[#1C1C1A] truncate flex-1">
                                    {row.label}
                                  </span>
                                  <span className="font-mono text-[11.5px] font-medium text-[#1C1C1A] ml-2 shrink-0">
                                    ${row.amount.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )
                        })}
                        <div className="px-4 pt-2.5 pb-3 border-t-[1.5px] border-[#CEC8C0]">
                          <div className="font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                            Total estimado
                          </div>
                          <div className="font-display text-[14px] font-normal text-[#0F3A33]">
                            ${totalBudget.toLocaleString()} MXN
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* ── ITEM EDIT / ADD MODAL ─────────────────────────────────────────── */}
      {editModalItem && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-[200] flex items-center justify-center p-[18px]"
          onClick={closeEditModal}
        >
          <div
            className="bg-[#FAF8F5] rounded-[26px] p-[26px] w-full max-w-[470px] shadow-[0_8px_40px_rgba(15,58,51,.12)]"
            style={{ animation: 'mIn 0.25s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-[18px]">
              <h2 className="font-display text-[18px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                {editIsNew ? 'Añadir actividad' : 'Editar actividad'}
              </h2>
              <button
                className="w-6 h-6 rounded-[5px] bg-[#EDE7E1] flex items-center justify-center text-[12px] text-[#3D3D3A]"
                onClick={closeEditModal}
              >
                ✕
              </button>
            </div>

            {/* Type picker */}
            <div className="mb-3">
              <label className="block font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                Tipo
              </label>
              <div className="flex flex-wrap gap-[5px]">
                {(['hotel', 'tour', 'restaurant', 'transfer', 'free'] as ItemType[]).map(t => {
                  const info  = TYPE_INFO[t]
                  const badge = TYPE_BADGE[t]
                  const sel   = editType === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEditType(t)}
                      className="font-mono text-[9px] font-medium tracking-[.08em] uppercase px-[7px] py-[3px] rounded-[3px] border transition-all"
                      style={sel
                        ? { color: badge.color, background: badge.bg, borderColor: badge.color }
                        : { color: '#B8B5AF', background: 'white', borderColor: '#E4DFD8' }
                      }
                    >
                      {info.icon} {info.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mb-3">
              <label className="block font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                Nombre
              </label>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
                placeholder="Nombre de la actividad"
              />
            </div>

            <div className="mb-3">
              <label className="block font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                Descripción
              </label>
              <textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33] min-h-[65px] resize-y"
                placeholder="Descripción breve"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                  Hora
                </label>
                <input
                  value={editTime}
                  onChange={e => setEditTime(e.target.value)}
                  className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
                  placeholder="09:00"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                  Precio estimado
                </label>
                <input
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                  className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
                  placeholder="$1,200 MXN"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-[18px]">
              <button
                onClick={closeEditModal}
                className="text-[13px] text-[#7A7A76] px-3.5 py-[7px] border border-[#E4DFD8] rounded-[6px] bg-white"
              >
                {locale === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={saveEditModal}
                className="text-[13px] font-medium text-white px-4 py-[7px] bg-[#0F3A33] rounded-[6px]"
              >
                {locale === 'es' ? 'Guardar' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REGEN CONFIRM MODAL ──────────────────────────────────────────── */}
      {regenConfirmOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-[200] flex items-center justify-center p-[18px]"
          onClick={() => setRegenConfirmOpen(false)}
        >
          <div
            className="bg-[#FAF8F5] rounded-[26px] p-[26px] w-full max-w-[420px] shadow-[0_8px_40px_rgba(15,58,51,.12)]"
            style={{ animation: 'mIn .25s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-5">
              <h2 className="font-display text-[18px] font-normal tracking-[-0.01em] text-[#1C1C1A] mb-3">
                {locale === 'es' ? 'Vas a perder tus cambios' : 'You\u2019ll lose your changes'}
              </h2>
              <p className="text-[13px] font-light text-[#7A7A76] leading-[1.65]">
                {locale === 'es'
                  ? <>Si continúas, se sobrescribirá este itinerario y se eliminarán todos los cambios que hiciste.<br /><br />¿Quieres continuar o crear un nuevo viaje?</>
                  : <>If you continue, this itinerary will be overwritten and all your edits will be lost.<br /><br />Do you want to continue or start a new trip?</>}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={loading ? undefined : replaceTrip}
                disabled={loading}
                className="text-[13px] font-medium text-white px-4 py-[9px] bg-[#B91C1C] rounded-[8px] w-full hover:bg-[#991B1B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (locale === 'es' ? 'Generando...' : 'Generating...')
                  : (locale === 'es' ? 'Reemplazar viaje' : 'Replace trip')}
              </button>
              <button
                onClick={() => { setRegenConfirmOpen(false); router.push({ pathname: '/planner' }) }}
                className="text-[13px] font-medium text-[#0F3A33] px-4 py-[9px] bg-white border border-[#CEC8C0] rounded-[8px] w-full hover:bg-[#EDE7E1] transition-colors"
              >
                {locale === 'es' ? 'Crear nuevo viaje' : 'Start a new trip'}
              </button>
              <button
                onClick={() => setRegenConfirmOpen(false)}
                className="text-[13px] text-[#7A7A76] px-4 py-[7px] rounded-[8px] w-full hover:bg-[#EDE7E1] transition-colors"
              >
                {locale === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKING MODAL ────────────────────────────────────────────────── */}
      {bookingModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-[200] flex items-center justify-center p-[18px]"
          onClick={() => setBookingModal(null)}
        >
          <div
            className="bg-[#FFF9F3] rounded-[20px] w-full max-w-[400px] shadow-[0_20px_60px_rgba(15,58,51,.18)] overflow-hidden"
            style={{ animation: 'mIn .25s ease' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-[22px] pt-[18px] pb-[14px] border-b border-[#E4DFD8]">
              <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-1">
                {BOOKING_EYEBROW[bookingModal.itemType] ?? 'Reservar'}
              </div>
              <div className="font-display text-[17px] font-normal tracking-[-0.01em] text-[#1C1C1A] mb-[3px] leading-snug">
                {bookingModal.itemName}
              </div>
              <div className="text-[12px] font-light text-[#7A7A76]">
                Elige dónde buscar disponibilidad
              </div>
            </div>

            {/* Provider rows */}
            <div className="py-2">
              {bookingModal.options.map(opt => {
                const ls = LOGO_STYLE[opt.provider] ?? LOGO_STYLE.manual
                return (
                  <a
                    key={opt.id}
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[11px] px-[22px] py-[11px] bg-white border-b border-[#E4DFD8] last:border-b-0 hover:bg-[#EDE7E1] transition-colors group"
                    onClick={() => {
                      trackAffiliateClick(bookingModal.itemType, opt.provider, destination)
                      setBookingModal(null)
                    }}
                  >
                    <div
                      className="w-[38px] h-[38px] rounded-[6px] flex items-center justify-center shrink-0 font-mono font-bold text-[9px] text-center leading-[1.2] whitespace-pre"
                      style={{ background: ls.bg, color: ls.color }}
                    >
                      {ls.text}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#1C1C1A] mb-[2px]">{opt.name}</div>
                      {opt.desc && (
                        <div className="text-[11px] font-light text-[#7A7A76] leading-[1.4]">{opt.desc}</div>
                      )}
                    </div>
                    <span className="text-[13px] text-[#B8B5AF] shrink-0 group-hover:text-[#0F3A33] group-hover:translate-x-0.5 transition-all">→</span>
                  </a>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-[22px] pt-[11px] pb-[16px] border-t border-[#E4DFD8] flex items-center justify-between">
              <span className="text-[11px] font-light text-[#B8B5AF] italic">Sin costo extra para ti</span>
              <button
                className="font-mono text-[10px] font-medium tracking-[.04em] text-[#7A7A76] bg-none border-none cursor-pointer px-[7px] py-[3px] hover:text-[#0F3A33] transition-colors"
                onClick={() => setBookingModal(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-[26px] left-1/2 -translate-x-1/2 bg-[#1C1C1A] text-white font-sans text-[13px] font-medium px-[17px] py-2.5 rounded-full shadow-[0_8px_40px_rgba(15,58,51,.12)] z-[300] whitespace-nowrap pointer-events-none">
          {toast}
        </div>
      )}

      {/* Modal animation */}
      <style>{`@keyframes mIn { from { opacity:0; transform:translateY(8px) scale(.98) } to { opacity:1; transform:none } }`}</style>

      {/* ── PAYWALL ──────────────────────────────────────────────────────── */}
      <PaywallModal open={paywallOpen} locale={locale} onClose={handlePaywallClose} />

      {/* ── SHARE TRIP ───────────────────────────────────────────────────── */}
      {tripId && (
        <TripShareModal
          tripId={tripId}
          destination={destination}
          duration={Number(nights) || null}
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}

    </main>
  )
}
