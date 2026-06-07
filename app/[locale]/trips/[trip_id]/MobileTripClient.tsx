'use client'

/**
 * app/[locale]/trips/[trip_id]/MobileTripClient.tsx
 *
 * The mobile companion view — a read-mostly, phone-first rendering of an
 * existing trip with three tabs (Itinerario / Presupuesto / Qué llevar). The
 * site header (Nav) and footer (Footer) come from the locale layout; this
 * component renders only the trip body + a fixed bottom login nudge.
 *
 * Persistence (see lib/planner/progress.ts + /api/trips/[trip_id]/companion):
 *   - Plan-structure progress that the desktop planner already round-trips —
 *     task completion (doneChecks) and budget actuals — is written back into
 *     trip_data via the companion endpoint.
 *   - Companion-only annotations (per-activity notes/links, packing check-off)
 *     live in the trip_progress column so the planner's wholesale trip_data
 *     autosave can never clobber them.
 *   - Logged-in owners persist to the DB; anonymous-trip viewers fall back to
 *     localStorage (same model as the "Ya reservé" booking flow).
 *
 * Edit permission: owners and anonymous-trip viewers can edit; a logged-in
 * non-owner viewing a *shared* trip is strictly read-only.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../../../components/auth/SupabaseProvider'
import { events } from '../../../../lib/analytics'
import { deriveChecksFromDays, type Day as LibDay, type CheckItem } from '../../../../lib/planner/checks'
import type { TripProgress, ItemAnnotation } from '../../../../lib/planner/progress'
import { buildAffiliateLink } from '../../../../lib/affiliate/build'
import { getBookingOptions, detectCountryGroup, trackAffiliateClick, type BookingOption } from '../../../../lib/booking'
import { effectiveAccommodations } from '../../../../lib/planner/use-effective-accommodations'
import type { Accommodation as LibAccommodation } from '../../../../lib/planner/accommodations'
import { parsePeopleCount, getTodayDayIndex } from '../../../../lib/planner/mobile-view'
import { TripShareModal } from '../../../../components/trips/TripShareModal'

// ── Local structural types (mirror the trip_data JSONB contract) ──────────────
type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer'

interface ItineraryItem {
  id: string
  type: ItemType
  time: string
  name: string
  desc: string
  price?: string
  affiliate?: string
  bookingOptions?: { id: string; provider: string; name: string; desc: string; url: string }[]
}

interface Day {
  n: number
  label: string
  title: string
  progress: number
  items: ItineraryItem[]
}

interface BudgetRow {
  id: string
  label: string
  category: string
  icon?: string
  aiEst: number
  userEst: number | null
  actual: number | null
}

interface Booking {
  confirmed: boolean
  code: string
  checkinTime?: string
  notes?: string
  bookingUrl?: string
}

interface Accommodation {
  id?: string
  city?: string
  neighborhood?: string
  priceTier?: string
  checkInDate?: string
  checkOutDate?: string
  nights?: number
  booking?: Booking
}

// Same localStorage key the desktop "Ya reservé" flow uses, so a booking
// confirmed on either surface shows on both (per device, for anon trips).
const lsBookingKey = (tripId: string, accId: string) => `lagomplan_booking_${tripId}_${accId}`

interface Segment { destination: string; startDate: string; endDate: string; nights: number }

type Tab = 'itin' | 'budget' | 'packing'

interface Props {
  tripId: string
  locale: 'es' | 'en'
  isOwner: boolean
  isAnonTrip: boolean
  title: string
  destination: string | null
  travelers: string | null
  durationDays: number | null
  tripData: any
  tripProgress: TripProgress
  editPlanUrl: string
  planYoursUrl: string
  loginUrl: string
  currentPath: string
}

// ── Copy ──────────────────────────────────────────────────────────────────────
const T = {
  es: {
    tabItin: 'Itinerario', tabBudget: 'Presupuesto', tabPacking: 'Qué llevar', tabPrep: 'Preparativos', beforeYouGo: 'Antes de salir',
    itinOfDay: 'Itinerario del día', whereToStay: 'Dónde quedarse',
    toDo: 'Por hacer', booked: '✓ Reservado', pending: 'Pendiente',
    note: 'Nota', link: 'Enlace', save: 'Guardar', saved: 'Guardado ✓',
    notePlaceholder: 'Pedir mesa en terraza, llevar efectivo…',
    linkPlaceholder: 'https://…',
    bookTable: 'Reservar mesa', getTickets: 'Comprar boletos', bookTransfer: 'Reservar transfer',
    seeBooking: 'Ver en Booking →', addLink: 'Agrega un enlace primero',
    reserve: 'Reservar para este viaje', alreadyBooked: '¿Ya reservaste? Agregar confirmación →', edit: 'Editar',
    bkCode: 'Nº de confirmación', bkCodePh: 'BK-483920', bkTime: 'Hora de check-in', bkTimePh: '15:00',
    bkNotes: 'Nota (opcional)', bkNotesPh: 'Pedir habitación alta', bkUrl: 'Enlace de la reserva (opcional)', bkUrlPh: 'https://booking.com/...',
    bkSave: 'Guardar confirmación', bkCancel: 'Cancelar', bkCheckin: 'Check-in',
    bkCodeRequired: 'El nº de confirmación es obligatorio.', bkInvalidUrl: 'Ese enlace no parece válido. Pega una URL https://.', bkSaveFailed: 'No pudimos guardar. Intenta de nuevo.',
    confirmDoneRestaurant: '✓ Ya reservé', confirmDoneTour: '✓ Tengo entrada', confirmDoneGeneric: '✓ Listo',
    budget: 'Presupuesto', aiEstimated: 'IA estimó', yourEstimate: 'Tu estimado', confirmed: 'Confirmado',
    view: 'Ver:', total: 'Total', perPerson: 'Por persona', real: 'Real', estShort: 'Tu',
    packingList: 'Lista de equipaje', packed: 'empacado',
    newsletterEyebrow: '¿Te gustó este plan?', newsletterTitle: 'Recibe ideas así cada semana',
    newsletterSub: 'Destinos, guías y rutas para parejas y familias en México y LATAM — sin spam.',
    emailPlaceholder: 'tu@email.com', subscribe: 'Suscribirse →',
    newsletterDone: '¡Listo, estás dentro! 🌿', newsletterDoneSub: 'Cada semana, un destino nuevo en tu correo. Sin spam.',
    invalidEmail: 'Ingresa un email válido',
    editPlan: 'Editar plan →', planYours: 'Planea el tuyo →',
    today: 'Hoy', tasks: 'tareas',
    tripSaved: 'Guardado', share: 'Compartir', pdf: 'PDF', progressLabel: 'Progreso del viaje',
    chooseProvider: 'Elige dónde buscar disponibilidad', book: 'Reservar', linkCopied: 'Enlace copiado ✓',
    nudge: [
      ['Guarda tu progreso', 'inicia sesión para no perder nada'],
      ['¿Ya reservaste algo?', 'inicia sesión para registrar la confirmación'],
      ['Tus tareas no se guardan', 'inicia sesión para mantener tu avance'],
      ['Registra tus gastos', 'inicia sesión para seguir el presupuesto en tiempo real'],
    ] as [string, string][],
    login: 'Inicia sesión',
  },
  en: {
    tabItin: 'Itinerary', tabBudget: 'Budget', tabPacking: 'What to pack', tabPrep: 'Prep', beforeYouGo: 'Before you go',
    itinOfDay: "Today's itinerary", whereToStay: 'Where to stay',
    toDo: 'To do', booked: '✓ Booked', pending: 'Pending',
    note: 'Note', link: 'Link', save: 'Save', saved: 'Saved ✓',
    notePlaceholder: 'Ask for a terrace table, bring cash…',
    linkPlaceholder: 'https://…',
    bookTable: 'Book table', getTickets: 'Get tickets', bookTransfer: 'Book transfer',
    seeBooking: 'View on Booking →', addLink: 'Add a link first',
    reserve: 'Book for this trip', alreadyBooked: 'Already booked? Add confirmation →', edit: 'Edit',
    bkCode: 'Confirmation #', bkCodePh: 'BK-483920', bkTime: 'Check-in time', bkTimePh: '15:00',
    bkNotes: 'Note (optional)', bkNotesPh: 'Ask for a higher floor', bkUrl: 'Booking link (optional)', bkUrlPh: 'https://booking.com/...',
    bkSave: 'Save confirmation', bkCancel: 'Cancel', bkCheckin: 'Check-in',
    bkCodeRequired: 'Confirmation number is required.', bkInvalidUrl: 'That link doesn’t look valid. Paste a https:// URL.', bkSaveFailed: "We couldn't save it. Try again.",
    confirmDoneRestaurant: '✓ Booked', confirmDoneTour: '✓ Got tickets', confirmDoneGeneric: '✓ Done',
    budget: 'Budget', aiEstimated: 'AI estimated', yourEstimate: 'Your estimate', confirmed: 'Confirmed',
    view: 'View:', total: 'Total', perPerson: 'Per person', real: 'Actual', estShort: 'Est.',
    packingList: 'Packing list', packed: 'packed',
    newsletterEyebrow: 'Liked this plan?', newsletterTitle: 'Get ideas like this every week',
    newsletterSub: 'Destinations, guides and routes for couples and families across Mexico & LATAM — no spam.',
    emailPlaceholder: 'you@email.com', subscribe: 'Subscribe →',
    newsletterDone: "You're in! 🌿", newsletterDoneSub: 'A new destination in your inbox every week. No spam.',
    invalidEmail: 'Enter a valid email',
    editPlan: 'Edit plan →', planYours: 'Plan yours →',
    today: 'Today', tasks: 'tasks',
    tripSaved: 'Saved', share: 'Share', pdf: 'PDF', progressLabel: 'Trip progress',
    chooseProvider: 'Choose where to check availability', book: 'Book', linkCopied: 'Link copied ✓',
    nudge: [
      ['Save your progress', 'log in so you never lose anything'],
      ['Booked something already?', 'log in to record the confirmation'],
      ["Your tasks aren't saved", 'log in to keep your progress'],
      ['Track your spending', 'log in to follow the budget in real time'],
    ] as [string, string][],
    login: 'Log in',
  },
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function asArray<T>(v: unknown): T[] { return Array.isArray(v) ? (v as T[]) : [] }

function tripStartDate(accommodations: Accommodation[], segments: Segment[]): Date | null {
  const iso = accommodations[0]?.checkInDate || segments[0]?.startDate
  if (!iso) return null
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  return isNaN(d.getTime()) ? null : d
}

function actionForType(type: ItemType, t: typeof T['es']): { label: string | null; confirm: string } {
  switch (type) {
    case 'restaurant': return { label: t.bookTable, confirm: t.confirmDoneRestaurant }
    case 'tour':       return { label: t.getTickets, confirm: t.confirmDoneTour }
    case 'transfer':   return { label: t.bookTransfer, confirm: t.confirmDoneGeneric }
    default:           return { label: null, confirm: t.confirmDoneGeneric }
  }
}

const ITEM_ICON: Record<ItemType, string> = {
  restaurant: '🍽', tour: '🎫', transfer: '🚗', hotel: '🏨', free: '📍',
}

// Booking-option provider chips — same palette/labels as the desktop modal.
const LOGO_STYLE: Record<string, { bg: string; color: string; text: string }> = {
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

// "Reservar X" CTA copy per type (mirrors the desktop action-verb labels).
const RESERVE_VERB: Record<'es' | 'en', Partial<Record<ItemType, string>>> = {
  es: { hotel: 'Reservar hotel', tour: 'Reservar tour', restaurant: 'Reservar mesa', transfer: 'Reservar traslado' },
  en: { hotel: 'Book hotel', tour: 'Book tour', restaurant: 'Book table', transfer: 'Book transfer' },
}

type BookingDrawerState = { itemName: string; itemType: ItemType; options: BookingOption[] } | null

function providerFromUrl(url: string): string {
  const u = url.toLowerCase()
  if (u.includes('getyourguide')) return 'gyg'
  if (u.includes('booking.com')) return 'booking'
  if (u.includes('hotels.com')) return 'hotels'
  if (u.includes('expedia')) return 'expedia'
  if (u.includes('opentable')) return 'opentable'
  if (u.includes('resy')) return 'resy'
  if (u.includes('thefork')) return 'thefork'
  if (u.includes('uber')) return 'uber'
  if (u.includes('google.')) return 'googlemaps'
  return 'manual'
}

export default function MobileTripClient(props: Props) {
  const { tripId, locale, isOwner, isAnonTrip, title, travelers, editPlanUrl, planYoursUrl, loginUrl, currentPath } = props
  const t = T[locale]
  const router = useRouter()
  const user = useUser()
  const loggedIn = !!user

  // Owners and anonymous-trip viewers can edit; a logged-in non-owner on a
  // shared trip is read-only.
  const canEdit = isOwner || isAnonTrip

  // ── Parse trip_data once ───────────────────────────────────────────────────
  const days     = useMemo(() => asArray<Day>(props.tripData?.days), [props.tripData])
  const packing  = useMemo(() => asArray<string>(props.tripData?.packing), [props.tripData])
  const segments = useMemo(() => asArray<Segment>(props.tripData?.segments), [props.tripData])
  const people   = useMemo(() => parsePeopleCount(travelers), [travelers])
  const rawAccommodations = useMemo(() => asArray<Accommodation>(props.tripData?.accommodations), [props.tripData])
  // Mirror the desktop: synthesize a fallback hotel for overnight trips with no
  // structured accommodations, so the "Reservar" CTA always shows (web parity).
  const accommodations = useMemo<Accommodation[]>(() => {
    const nights = Math.max(0, (props.durationDays ?? days.length) - 1)
    const start = rawAccommodations[0]?.checkInDate || segments[0]?.startDate || ''
    const end = rawAccommodations[rawAccommodations.length - 1]?.checkOutDate || segments[segments.length - 1]?.endDate || ''
    return effectiveAccommodations(rawAccommodations as unknown as LibAccommodation[], {
      destination: props.destination ?? rawAccommodations[0]?.city ?? '',
      start, end, nights, adults: people, locale,
    }) as unknown as Accommodation[]
  }, [rawAccommodations, days.length, segments, props.durationDays, props.destination, people, locale])
  const baseBudget = useMemo(() => asArray<BudgetRow>(props.tripData?.budgetRows), [props.tripData])
  const checks = useMemo(
    () => deriveChecksFromDays(days as unknown as LibDay[], { locale, segments: segments as any }),
    [days, locale, segments],
  )

  // ── State ──────────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>('itin')
  const [currentDay, setCurrentDay] = useState(0)        // index into days
  const [todayIndex, setTodayIndex] = useState(-1)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [doneCheckIds, setDoneCheckIds] = useState<Set<string>>(
    () => new Set(asArray<string>(props.tripData?.doneChecks)),
  )
  const [packedItems, setPackedItems] = useState<Set<number>>(
    () => new Set(props.tripProgress.packedItems),
  )
  const [annotations, setAnnotations] = useState<Record<string, ItemAnnotation>>(
    () => ({ ...props.tripProgress.annotations }),
  )
  const [budgetActuals, setBudgetActuals] = useState<Record<string, number | null>>(
    () => Object.fromEntries(baseBudget.map(r => [r.id, r.actual])),
  )
  const [budgetEstimates, setBudgetEstimates] = useState<Record<string, number | null>>(
    () => Object.fromEntries(baseBudget.map(r => [r.id, r.userEst])),
  )
  const [budgetView, setBudgetView] = useState<'total' | 'persona'>('total')
  const [nudgeDismissed, setNudgeDismissed] = useState(false)
  const [nudgeIdx, setNudgeIdx] = useState(0)
  const [toast, setToast] = useState('')
  const [newsletterDone, setNewsletterDone] = useState(false)
  const [bookings, setBookings] = useState<Record<string, Booking>>(() => {
    const init: Record<string, Booking> = {}
    for (const a of accommodations) if (a.id && a.booking?.confirmed) init[a.id] = a.booking
    return init
  })
  const [bookingDrawer, setBookingDrawer] = useState<BookingDrawerState>(null)
  const [shareOpen, setShareOpen] = useState(false)

  const captureRef = useRef<HTMLInputElement | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const persistTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Latest persistable state, read by the debounced writer to avoid stale closures.
  const stateRef = useRef({ annotations, packedItems, doneCheckIds, budgetActuals, budgetEstimates })
  useEffect(() => {
    stateRef.current = { annotations, packedItems, doneCheckIds, budgetActuals, budgetEstimates }
  })

  // ── Mount: default day from today, nudge dismiss state, localStorage rehydrate, open event ──
  useEffect(() => {
    // Default day: today relative to trip start (see lib/planner/mobile-view).
    const startISO = accommodations[0]?.checkInDate || segments[0]?.startDate || null
    const { dayIndex: dayIdx, isToday } = getTodayDayIndex(startISO, days.length, new Date())
    if (isToday) setTodayIndex(dayIdx)
    setCurrentDay(dayIdx)

    // Session-scoped nudge dismissal.
    try {
      if (sessionStorage.getItem(`lagomplan_nudge_dismissed_${tripId}`) === '1') setNudgeDismissed(true)
    } catch { /* ignore */ }

    // Anonymous-trip viewers persist to localStorage — rehydrate it over the
    // (empty) server state.
    if (canEdit && !loggedIn) {
      try {
        const raw = localStorage.getItem(`lagomplan_companion_${tripId}`)
        if (raw) {
          const saved = JSON.parse(raw) as {
            progress?: TripProgress; doneChecks?: string[]; budgetActuals?: Record<string, number | null>
          }
          if (saved.progress?.annotations) setAnnotations(saved.progress.annotations)
          if (Array.isArray(saved.progress?.packedItems)) setPackedItems(new Set(saved.progress!.packedItems))
          if (Array.isArray(saved.doneChecks)) setDoneCheckIds(new Set(saved.doneChecks))
          if (saved.budgetActuals) setBudgetActuals(prev => ({ ...prev, ...saved.budgetActuals }))
        }
      } catch { /* ignore */ }

      // Rehydrate anon hotel bookings (same localStorage key the desktop
      // "Ya reservé" flow uses).
      const bRe: Record<string, Booking> = {}
      for (const a of accommodations) {
        if (!a.id || a.booking?.confirmed) continue
        try {
          const raw = localStorage.getItem(lsBookingKey(tripId, a.id))
          if (!raw) continue
          const pr = JSON.parse(raw)
          if (pr && pr.confirmed === true && typeof pr.code === 'string') {
            bRe[a.id] = {
              confirmed: true,
              code: String(pr.code),
              checkinTime: typeof pr.checkinTime === 'string' ? pr.checkinTime : '',
              notes: typeof pr.notes === 'string' ? pr.notes : '',
              ...(typeof pr.bookingUrl === 'string' && pr.bookingUrl ? { bookingUrl: pr.bookingUrl } : {}),
            }
          }
        } catch { /* ignore single-card parse failures */ }
      }
      if (Object.keys(bRe).length) setBookings(prev => ({ ...prev, ...bRe }))
    }

    events.mobileViewOpened({ tripId, isOwner, dayIndex: dayIdx })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Toast ──────────────────────────────────────────────────────────────────
  function showToast(msg: string) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2000)
  }

  // ── Persistence ─────────────────────────────────────────────────────────────
  function persistNow() {
    if (!canEdit) return
    const s = stateRef.current
    const payload = {
      progress: { annotations: s.annotations, packedItems: Array.from(s.packedItems) } as TripProgress,
      doneChecks: Array.from(s.doneCheckIds),
      budgetActuals: s.budgetActuals,
      budgetUserEsts: s.budgetEstimates,
    }
    if (loggedIn && isOwner) {
      fetch(`/api/trips/${encodeURIComponent(tripId)}/companion`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      }).catch(() => { /* best-effort; UI is optimistic */ })
    } else {
      try {
        localStorage.setItem(`lagomplan_companion_${tripId}`, JSON.stringify(payload))
      } catch { /* quota/private mode — ignore */ }
    }
  }
  function schedulePersist() {
    if (!canEdit) return
    clearTimeout(persistTimer.current)
    persistTimer.current = setTimeout(persistNow, 700)
  }

  // ── Derived counts ──────────────────────────────────────────────────────────
  const dayChecks = (dayN: number) => checks.filter(c => c.day === dayN)
  const dayCounts = (dayN: number) => {
    const list = dayChecks(dayN)
    return { done: list.filter(c => doneCheckIds.has(c.id)).length, total: list.length }
  }
  // Pre-trip prep checks (book hotel, pack, documents, arrival/departure
  // transfers) carry no day — surfaced in the Preparativos tab.
  const prepChecks = useMemo(() => checks.filter(c => typeof c.day !== 'number'), [checks])
  const progress = useMemo(() => {
    const total = checks.length + packing.length
    const done = checks.filter(c => doneCheckIds.has(c.id)).length + packedItems.size
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { total, done, pct }
  }, [checks, packing.length, doneCheckIds, packedItems])

  // ── Interactions ─────────────────────────────────────────────────────────────
  function switchTab(next: Tab) {
    setTab(next)
    events.mobileViewTabSwitched({ tripId, tab: next })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  function switchDay(idx: number) {
    setCurrentDay(idx)
    setNudgeIdx(i => i + 1)
    events.mobileViewDaySwitched({ tripId, dayIndex: idx })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  function toggleExpand(item: ItineraryItem) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(item.id)) next.delete(item.id)
      else {
        next.add(item.id)
        events.mobileViewActivityExpanded({ tripId, activityType: item.type, dayIndex: currentDay })
      }
      return next
    })
  }
  function toggleCheck(id: string, dayIndex: number) {
    if (!canEdit) return
    setDoneCheckIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else { next.add(id); events.mobileViewTaskCompleted({ tripId, taskId: id, dayIndex }) }
      return next
    })
    schedulePersist()
  }
  function togglePacked(i: number) {
    if (!canEdit) return
    setPackedItems(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
    schedulePersist()
  }
  function setBudgetActual(id: string, raw: string) {
    if (!canEdit) return
    const v = raw.trim() === '' ? null : Math.max(0, Math.round(Number(raw)))
    setBudgetActuals(prev => ({ ...prev, [id]: Number.isFinite(v as number) ? v : null }))
    schedulePersist()
  }
  function setBudgetUserEst(id: string, raw: string) {
    if (!canEdit) return
    const v = raw.trim() === '' ? null : Math.max(0, Math.round(Number(raw)))
    setBudgetEstimates(prev => ({ ...prev, [id]: Number.isFinite(v as number) ? v : null }))
    schedulePersist()
  }
  function saveAnnotation(itemId: string, note: string, link: string) {
    if (!canEdit) return
    const clean: ItemAnnotation = {}
    if (note.trim()) clean.note = note.trim()
    if (link.trim()) clean.link = link.trim()
    setAnnotations(prev => {
      const next = { ...prev }
      if (clean.note || clean.link) next[itemId] = clean
      else delete next[itemId]
      return next
    })
    schedulePersist()
    events.mobileViewNoteSaved({ tripId, activityId: itemId, hasNote: !!clean.note, hasLink: !!clean.link })
    showToast(t.saved)
  }
  function openLink(url: string | undefined) {
    if (!url) { showToast(t.addLink); return }
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  function confirmBooking(accId: string, city: string, booking: Booking) {
    if (!canEdit) return
    const wasConfirmed = !!bookings[accId]?.confirmed
    setBookings(prev => ({ ...prev, [accId]: booking }))
    // Reuse the existing booking-confirm endpoint (read-modify-write into
    // trip_data.accommodations) for owners; localStorage for anon — exactly
    // the desktop "Ya reservé" persistence model.
    if (loggedIn && isOwner) {
      fetch(`/api/trips/${encodeURIComponent(tripId)}/booking-confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ accommodationId: accId, booking }),
      }).catch(() => { /* optimistic; UI already updated */ })
    } else {
      try { localStorage.setItem(lsBookingKey(tripId, accId), JSON.stringify(booking)) } catch { /* ignore */ }
    }
    if (!wasConfirmed) {
      events.hotelBookingConfirmed({ tripId, accommodationId: accId, city, provider: 'booking' })
    }
  }

  // ── Multi-city: map a day → its date → the accommodation covering that night ──
  function dateForDayIndex(i: number): Date | null {
    const s = tripStartDate(accommodations, segments)
    return s ? new Date(s.getTime() + i * 86400000) : null
  }
  function accommodationForDayIndex(i: number): Accommodation | undefined {
    if (accommodations.length <= 1) return accommodations[0]
    const d = dateForDayIndex(i)
    if (!d) return accommodations[0]
    const ms = d.getTime()
    let fallback: Accommodation | undefined  // latest stay already ended → checkout / last day
    for (const a of accommodations) {
      if (!a.checkInDate) continue
      const ci = new Date(a.checkInDate + 'T00:00:00').getTime()
      const co = a.checkOutDate
        ? new Date(a.checkOutDate + 'T00:00:00').getTime()
        : ci + (a.nights ?? 1) * 86400000
      if (ms >= ci && ms < co) return a
      if (ms >= co) fallback = a
    }
    return fallback ?? accommodations[0]
  }

  // ── Booking options drawer (per itinerary item — same resolution as desktop) ──
  function openBookingDrawer(item: ItineraryItem) {
    const dayAcc = accommodationForDayIndex(currentDay)
    const city = dayAcc?.city || props.destination || ''
    const startISO = dayAcc?.checkInDate || accommodations[0]?.checkInDate || segments[0]?.startDate || ''
    const endISO = dayAcc?.checkOutDate || accommodations[accommodations.length - 1]?.checkOutDate || segments[segments.length - 1]?.endDate || ''
    const ctx = { city, country: detectCountryGroup(city), startDate: startISO, endDate: endISO, adults: people, locale }
    let options: BookingOption[] = []
    if (item.bookingOptions && item.bookingOptions.length > 0) {
      options = item.bookingOptions                                   // hand-authored (guide system)
    } else if (item.type === 'hotel' || item.type === 'tour') {
      options = getBookingOptions(item, ctx)                          // Stay22 affiliate links
    } else if (item.affiliate) {
      options = [{ id: 'aff-0', provider: providerFromUrl(item.affiliate), name: item.name, desc: '', url: item.affiliate }]
    } else {
      options = getBookingOptions(item, ctx)                          // restaurant/transfer search links
    }
    if (options.length === 0) { showToast(t.addLink); return }
    setBookingDrawer({ itemName: item.name, itemType: item.type, options })
  }
  function onBookingOptionClick(opt: BookingOption, itemType: ItemType, itemName: string) {
    const city = props.destination || accommodations[0]?.city || ''
    events.affiliateClicked({
      provider: opt.provider, surface: 'mobile-view', category: itemType,
      destination: city, trip_id: tripId, meta: { item_name: itemName },
    })
    trackAffiliateClick(itemType, opt.provider, city)
    setBookingDrawer(null)
    window.open(opt.url, '_blank', 'noopener,noreferrer')
  }

  // ── Save / Share / PDF toolbar ───────────────────────────────────────────────
  function shareTrip() {
    if (isOwner) { setShareOpen(true); return }
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, url }).catch(() => { /* user cancelled */ })
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast(t.linkCopied)).catch(() => { /* ignore */ })
    }
  }
  function printPdf() {
    // Route through the desktop planner's print-tuned layout (full=1 skips the
    // mobile redirect; print=1 makes that page auto-open the print dialog).
    showToast(locale === 'es' ? '📄 Abriendo versión imprimible…' : '📄 Opening printable version…')
    window.open(`/${locale}/planner?trip_id=${encodeURIComponent(tripId)}&full=1&print=1`, '_blank', 'noopener,noreferrer')
  }
  function dismissNudge() {
    setNudgeDismissed(true)
    try { sessionStorage.setItem(`lagomplan_nudge_dismissed_${tripId}`, '1') } catch { /* ignore */ }
  }
  function goLogin() {
    try { sessionStorage.setItem('redirectAfterLogin', currentPath) } catch { /* ignore */ }
    router.push(loginUrl)
  }
  function nudgeAction() {
    if (tab === 'itin' && captureRef.current) {
      captureRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => captureRef.current?.focus(), 400)
    } else {
      goLogin()
    }
  }
  async function submitNewsletter() {
    const email = captureRef.current?.value.trim() ?? ''
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      captureRef.current?.focus()
      showToast(t.invalidEmail)
      return
    }
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch { /* treat as success — capture is best-effort */ }
    events.mobileViewNewsletterCaptured({ tripId })
    setNewsletterDone(true)
  }

  // ── Budget math ──────────────────────────────────────────────────────────────
  const fmt = (n: number | null) => {
    if (n == null) return '—'
    const v = budgetView === 'persona' ? Math.round(n / people) : n
    return '$' + v.toLocaleString(locale === 'es' ? 'es-MX' : 'en-US')
  }
  const effectiveActual = (r: BudgetRow) =>
    budgetActuals[r.id] !== undefined ? budgetActuals[r.id] : r.actual
  const effectiveEstimate = (r: BudgetRow) =>
    budgetEstimates[r.id] !== undefined ? budgetEstimates[r.id] : r.userEst
  const budgetTotals = useMemo(() => {
    let ai = 0, usr = 0, act = 0, hasUser = false, hasActual = false
    baseBudget.forEach(r => {
      ai += r.aiEst
      const est = effectiveEstimate(r)
      usr += est != null ? est : r.aiEst
      if (est != null) hasUser = true
      const a = effectiveActual(r)
      if (a != null) { act += a; hasActual = true }
    })
    return { ai, usr, act, hasUser, hasActual }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseBudget, budgetActuals, budgetEstimates])
  const budgetCategories = useMemo(() => {
    const map = new Map<string, BudgetRow[]>()
    baseBudget.forEach(r => {
      const key = r.category || 'Otros'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(r)
    })
    return Array.from(map.entries())
  }, [baseBudget])

  const day = days[currentDay]
  const dayAcc = accommodationForDayIndex(currentDay)
  const showNudge = !loggedIn && !nudgeDismissed
  const nudgeCopy = t.nudge[nudgeIdx % t.nudge.length]

  return (
    <main className="min-h-screen bg-[#F4F0E8] pt-[100px] pb-[80px]">
      {/* ── Trip subheader (scrolls away; tabs + day pills stay pinned) ── */}
      <div className="bg-[#FFF9F3] border-b border-[#E2DDD5] px-[18px] pt-[10px] pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-display text-[15px] font-medium text-[#1A1A1A] leading-[1.3] truncate">{title}</div>
            <div className="font-mono text-[9px] text-[#8A8A8A] tracking-[.03em] mt-[2px]">
              {[props.destination, travelers, props.durationDays ? `${props.durationDays}${locale === 'es' ? ' días' : ' days'}` : null]
                .filter(Boolean).join(' · ')}
            </div>
          </div>
          {/* preventDefault + router.push bypasses the Stay22 click interceptor,
              which otherwise rewrites raw anchor clicks to Booking.com. */}
          <a
            href={isOwner ? editPlanUrl : planYoursUrl}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(isOwner ? editPlanUrl : planYoursUrl) }}
            className="shrink-0 font-mono text-[10px] font-medium text-[#0F3A33] border border-[#6B8F86] rounded-[6px] px-[10px] py-[4px] whitespace-nowrap hover:bg-[#E4EFEC] transition-colors cursor-pointer"
          >
            {isOwner ? t.editPlan : t.planYours}
          </a>
        </div>
        {/* progress — prominent label + percentage + thicker bar */}
        <div className="mt-[8px]">
          <div className="flex items-center justify-between mb-[4px]">
            <span className="font-mono text-[9px] tracking-[.08em] uppercase text-[#8A8A8A]">{t.progressLabel}</span>
            <span className="font-mono text-[10px] font-medium text-[#0F3A33]">{progress.pct}% · {progress.done}/{progress.total} {t.tasks}</span>
          </div>
          <div className="h-[5px] bg-[#EDE7E1] rounded-full overflow-hidden">
            <div className="h-full bg-[#0F3A33] rounded-full transition-[width] duration-500" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>

        {/* actions — Save status / Share / PDF (hidden in print) */}
        <div className="flex items-center gap-[16px] mt-[10px] print:hidden">
          {isOwner && (
            <span className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#2D6B57]">
              <span>✔</span> {t.tripSaved}
            </span>
          )}
          <button onClick={shareTrip} className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#7A7A76] hover:text-[#0F3A33] transition-colors">
            <span>↗</span> {t.share}
          </button>
          <button onClick={printPdf} className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#7A7A76] hover:text-[#0F3A33] transition-colors">
            <span>⬇</span> {t.pdf}
          </button>
        </div>
      </div>

      {/* ── Section tabs ── */}
      <div className="sticky top-[100px] z-[39] flex border-b border-[#E2DDD5] bg-[#FFF9F3]">
        {(['itin', 'budget', 'packing'] as Tab[]).map(tb => (
          <button
            key={tb}
            onClick={() => switchTab(tb)}
            className={`flex-1 py-[10px] px-1 font-mono text-[10px] font-medium tracking-[.04em] uppercase border-b-2 transition-colors ${
              tab === tb ? 'text-[#0F3A33] border-[#0F3A33]' : 'text-[#8A8A8A] border-transparent hover:text-[#0F3A33]'
            }`}
          >
            {tb === 'itin' ? t.tabItin : tb === 'budget' ? t.tabBudget : t.tabPrep}
          </button>
        ))}
      </div>

      {/* ── Day selector (Itinerario only) ── */}
      {tab === 'itin' && days.length > 0 && (
        <div className="sticky top-[139px] z-[38] bg-[#FFF9F3] border-b border-[#E2DDD5]">
          <div className="flex gap-[6px] px-[18px] py-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map((d, i) => {
              const c = dayCounts(d.n)
              const active = i === currentDay
              return (
                <button
                  key={d.n}
                  onClick={() => switchDay(i)}
                  className={`relative flex flex-col items-center gap-[2px] px-[10px] py-[6px] rounded-[9px] border shrink-0 min-w-[54px] transition-colors ${
                    active ? 'bg-[#0F3A33] border-[#0F3A33]' : 'bg-[#FFF9F3] border-[#E2DDD5] hover:border-[#6B8F86] hover:bg-[#F4F0E8]'
                  }`}
                >
                  {i === todayIndex && (
                    <span className={`absolute top-[4px] right-[5px] w-[4px] h-[4px] rounded-full ${active ? 'bg-white/70' : 'bg-[#E1615B]'}`} />
                  )}
                  <span className={`font-mono text-[8px] tracking-[.05em] uppercase ${active ? 'text-white/50' : 'text-[#BDBDBD]'}`}>
                    {locale === 'es' ? 'Día' : 'Day'} {d.n}
                  </span>
                  <span className={`text-[12px] font-medium ${active ? 'text-white' : 'text-[#1A1A1A]'}`}>{shortLabel(d, i, segments, accommodations, locale)}</span>
                  <span className={`font-mono text-[8px] mt-[1px] ${
                    active ? (c.done > 0 ? 'text-white/75' : 'text-white/45') : (c.done > 0 ? 'text-[#2D6B57]' : 'text-[#BDBDBD]')
                  }`}>{c.done}/{c.total}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div>
        {tab === 'itin' && day && (
          <ItineraryTab
            day={day}
            dayIndex={currentDay}
            isToday={currentDay === todayIndex}
            t={t}
            locale={locale}
            canEdit={canEdit}
            accommodation={dayAcc}
            booking={dayAcc?.id ? bookings[dayAcc.id] : undefined}
            people={people}
            checks={dayChecks(day.n)}
            doneCheckIds={doneCheckIds}
            expanded={expanded}
            annotations={annotations}
            loggedIn={loggedIn}
            newsletterDone={newsletterDone}
            captureRef={captureRef}
            onToggleExpand={toggleExpand}
            onToggleCheck={(id) => toggleCheck(id, currentDay)}
            onSaveAnnotation={saveAnnotation}
            onOpenLink={openLink}
            onBook={openBookingDrawer}
            onConfirmBooking={confirmBooking}
            onSubmitNewsletter={submitNewsletter}
          />
        )}

        {tab === 'budget' && (
          <BudgetTab
            t={t} categories={budgetCategories} totals={budgetTotals}
            budgetView={budgetView} setBudgetView={setBudgetView}
            fmt={fmt} effectiveActual={effectiveActual} effectiveEstimate={effectiveEstimate} canEdit={canEdit}
            onSetActual={setBudgetActual} onSetEstimate={setBudgetUserEst}
          />
        )}

        {tab === 'packing' && (
          <PrepTab
            t={t} canEdit={canEdit}
            prepChecks={prepChecks} doneCheckIds={doneCheckIds}
            onToggleCheck={(id) => toggleCheck(id, -1)}
            packing={packing} packedItems={packedItems} onTogglePacked={togglePacked}
          />
        )}
      </div>

      {/* ── Persistent login nudge ── */}
      {showNudge && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0F3A33] px-[18px] py-2 flex items-center gap-[10px] print:hidden">
          <div className="flex-1 text-[11px] text-white/80 leading-[1.4]">
            <strong className="text-white font-semibold">{nudgeCopy[0]}</strong> — {nudgeCopy[1]}
          </div>
          <button onClick={nudgeAction} className="font-mono text-[10px] font-medium text-white bg-white/15 border border-white/25 rounded-[6px] px-[10px] py-[5px] whitespace-nowrap hover:bg-white/25 transition-colors">
            {t.login}
          </button>
          <button onClick={dismissNudge} aria-label="Dismiss" className="text-[14px] text-white/40 leading-none px-[2px] hover:text-white/80 transition-colors">×</button>
        </div>
      )}

      {/* ── Booking options drawer (bottom sheet) ── */}
      {bookingDrawer && (
        <div className="fixed inset-0 z-[80] flex flex-col justify-end print:hidden" onClick={() => setBookingDrawer(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-[#FFF9F3] rounded-t-[20px] max-h-[75vh] overflow-y-auto shadow-[0_-12px_40px_rgba(15,58,51,.18)]" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#FFF9F3] px-[20px] pt-[12px] pb-[12px] border-b border-[#E2DDD5]">
              <div className="w-[36px] h-[4px] bg-[#E2DDD5] rounded-full mx-auto mb-[12px]" />
              <div className="font-display text-[16px] text-[#1A1A1A] leading-snug">{bookingDrawer.itemName}</div>
              <div className="text-[12px] text-[#8A8A8A] mt-[2px]">{t.chooseProvider}</div>
            </div>
            <div className="pb-[20px]">
              {bookingDrawer.options.map(opt => {
                const ls = LOGO_STYLE[opt.provider] ?? LOGO_STYLE.manual
                return (
                  <button
                    key={opt.id}
                    onClick={() => onBookingOptionClick(opt, bookingDrawer.itemType, bookingDrawer.itemName)}
                    className="w-full text-left flex items-center gap-[11px] px-[20px] py-[12px] border-b border-[#E2DDD5] last:border-b-0 hover:bg-[#EDE7E1] transition-colors"
                  >
                    <span className="w-[38px] h-[38px] rounded-[6px] flex items-center justify-center shrink-0 font-mono font-bold text-[9px] text-center leading-[1.2] whitespace-pre" style={{ background: ls.bg, color: ls.color }}>{ls.text}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-medium text-[#1A1A1A]">{opt.name}</span>
                      {opt.desc && <span className="block text-[11px] text-[#8A8A8A] leading-[1.4]">{opt.desc}</span>}
                    </span>
                    <span className="text-[13px] text-[#BDBDBD] shrink-0">→</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Share modal (owners generate a proper share link) ── */}
      {isOwner && (
        <TripShareModal
          tripId={tripId}
          destination={props.destination ?? ''}
          duration={props.durationDays}
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-[70px] left-1/2 -translate-x-1/2 z-[90] bg-[#1A1A1A] text-white text-[11px] font-medium px-[14px] py-[7px] rounded-[20px] whitespace-nowrap shadow-lg">
          {toast}
        </div>
      )}
    </main>
  )
}

// ── Day short label (weekday from derived date, else "D{n}") ───────────────────
function shortLabel(d: Day, i: number, segments: Segment[], accommodations: Accommodation[], locale: 'es' | 'en'): string {
  const start = tripStartDate(accommodations, segments)
  if (start) {
    const date = new Date(start.getTime() + i * 86400000)
    const wd = date.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', { weekday: 'short' })
    return wd.charAt(0).toUpperCase() + wd.slice(1, 3)
  }
  return d.label?.split(' ').slice(-1)[0] || `${d.n}`
}

// ════════════════════════════════════════════════════════════════════════════
// Itinerary tab
// ════════════════════════════════════════════════════════════════════════════
function ItineraryTab(p: {
  day: Day; dayIndex: number; isToday: boolean; t: typeof T['es']; locale: 'es' | 'en'; canEdit: boolean
  accommodation?: Accommodation; booking?: Booking; people: number
  checks: CheckItem[]; doneCheckIds: Set<string>
  expanded: Set<string>; annotations: Record<string, ItemAnnotation>; loggedIn: boolean
  newsletterDone: boolean; captureRef: React.RefObject<HTMLInputElement | null>
  onToggleExpand: (item: ItineraryItem) => void
  onToggleCheck: (id: string) => void
  onSaveAnnotation: (itemId: string, note: string, link: string) => void
  onOpenLink: (url: string | undefined) => void
  onBook: (item: ItineraryItem) => void
  onConfirmBooking: (accId: string, city: string, booking: Booking) => void
  onSubmitNewsletter: () => void
}) {
  const { day, t, locale, canEdit } = p
  const acc = p.accommodation
  const card = 'border border-[#E2DDD5] rounded-[12px] overflow-hidden bg-[#FFF9F3]'
  const secLbl = 'font-mono text-[9px] font-medium text-[#BDBDBD] tracking-[.12em] uppercase px-[18px] pt-4 pb-2'

  return (
    <>
      {/* Day hero */}
      <div className="px-[18px] pt-1 pb-3 border-b border-[#E2DDD5]">
        <div className="font-mono text-[9px] text-[#E1615B] tracking-[.1em] uppercase mb-[3px]">
          {p.isToday ? `● ${t.today} · ` : ''}{day.label}
        </div>
        <div className="font-display text-[17px] italic text-[#1A1A1A] leading-[1.25]">{day.title}</div>
      </div>

      {/* Activities */}
      <div className={secLbl}>{t.itinOfDay}</div>
      <div className="px-[18px]">
        {day.items.map(item => (
          <ActivityRow
            key={item.id} item={item} t={t} locale={locale} canEdit={canEdit}
            open={p.expanded.has(item.id)}
            done={p.doneCheckIds.has(`check-${item.id}`)}
            annotation={p.annotations[item.id]}
            onToggleExpand={() => p.onToggleExpand(item)}
            onConfirm={() => p.onToggleCheck(`check-${item.id}`)}
            onSave={(note, link) => p.onSaveAnnotation(item.id, note, link)}
            onOpenLink={p.onOpenLink}
            onBook={() => p.onBook(item)}
          />
        ))}
      </div>

      {/* Hotel */}
      {acc && (
        <>
          <div className={secLbl}>{t.whereToStay}</div>
          <div className="px-[18px] pb-3">
            <HotelCard
              acc={acc}
              booking={p.booking}
              t={t} locale={locale} canEdit={canEdit} people={p.people}
              onConfirm={(b) => { if (acc.id) p.onConfirmBooking(acc.id, acc.city ?? '', b) }}
              onOpenLink={p.onOpenLink}
            />
          </div>
        </>
      )}

      {/* Per-day tasks */}
      {p.checks.length > 0 && (
        <>
          <div className={secLbl}>{t.toDo} · {locale === 'es' ? 'Día' : 'Day'} {day.n}</div>
          <div className="px-[18px] pb-[14px]">
            <div className={card}>
              {p.checks.map(c => {
                const done = p.doneCheckIds.has(c.id)
                return (
                  <button
                    key={c.id} disabled={!canEdit}
                    onClick={() => p.onToggleCheck(c.id)}
                    className={`w-full text-left flex items-start gap-[10px] px-[14px] py-[10px] border-b border-[#E2DDD5] last:border-b-0 transition-colors ${
                      canEdit ? 'hover:bg-[#F4F0E8] cursor-pointer' : 'cursor-default'
                    } ${done ? 'opacity-50' : ''}`}
                  >
                    <span className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] shrink-0 flex items-center justify-center text-[10px] text-white mt-[1px] ${
                      done ? 'bg-[#0F3A33] border-[#0F3A33]' : 'border-[#E2DDD5]'
                    }`}>{done ? '✓' : ''}</span>
                    <span className="flex-1 min-w-0">
                      <span className={`block text-[12px] font-medium leading-[1.3] ${done ? 'line-through text-[#BDBDBD]' : 'text-[#1A1A1A]'}`}>
                        {c.icon} {c.text}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Newsletter capture — anonymous only, end of itinerary */}
      {!p.loggedIn && (
        <div className="mx-[18px] mt-2 mb-1 bg-[#0F3A33] rounded-[14px] px-4 pt-4 pb-[14px] overflow-hidden">
          {p.newsletterDone ? (
            <>
              <div className="font-display text-[15px] italic text-white mb-1">{t.newsletterDone}</div>
              <div className="text-[11px] text-white/70 leading-[1.5]">{t.newsletterDoneSub}</div>
            </>
          ) : (
            <>
              <div className="font-mono text-[9px] text-white/50 tracking-[.1em] uppercase mb-[6px]">{t.newsletterEyebrow}</div>
              <div className="font-display text-[16px] italic text-white leading-[1.3] mb-1">{t.newsletterTitle}</div>
              <div className="text-[11px] text-white/65 leading-[1.5] mb-3">{t.newsletterSub}</div>
              <div className="flex gap-[6px]">
                <input
                  ref={p.captureRef} type="email" placeholder={t.emailPlaceholder}
                  onKeyDown={(e) => { if (e.key === 'Enter') p.onSubmitNewsletter() }}
                  className="flex-1 min-w-0 px-[10px] py-2 rounded-[7px] text-[12px] bg-white/12 text-white placeholder:text-white/50 outline-none focus:bg-white/[.18]"
                />
                <button onClick={p.onSubmitNewsletter}
                  className="px-[12px] py-2 bg-white text-[#0F3A33] rounded-[7px] text-[12px] font-semibold whitespace-nowrap hover:opacity-85 transition-opacity">
                  {t.subscribe}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

function ActivityRow(p: {
  item: ItineraryItem; t: typeof T['es']; locale: 'es' | 'en'; canEdit: boolean; open: boolean; done: boolean
  annotation?: ItemAnnotation
  onToggleExpand: () => void; onConfirm: () => void
  onSave: (note: string, link: string) => void; onOpenLink: (url: string | undefined) => void
  onBook: () => void
}) {
  const { item, t, locale, canEdit, open, done } = p
  const action = actionForType(item.type, t)
  const reserveLabel = RESERVE_VERB[locale][item.type]   // undefined for 'free'
  const [note, setNote] = useState(p.annotation?.note ?? '')
  const [link, setLink] = useState(p.annotation?.link ?? '')

  return (
    <div className={`flex gap-[10px] py-[11px] border-b border-[#E2DDD5] last:border-b-0 ${open ? '' : 'cursor-pointer'}`}
         onClick={() => { if (!open) p.onToggleExpand() }}>
      <div className="font-mono text-[10px] text-[#BDBDBD] min-w-[36px] pt-[1px] text-right shrink-0">{item.time}</div>
      <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-[12px] shrink-0 bg-[#EDE7E1]">{ITEM_ICON[item.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-[#1A1A1A] mb-[2px] leading-[1.3]">{item.name}</div>
        <div className={`text-[11px] text-[#8A8A8A] leading-[1.5] ${open ? '' : 'line-clamp-2'}`}>{item.desc}</div>
        {item.price && (
          <div className="inline-flex items-center gap-1 font-mono text-[9px] font-medium px-[6px] py-[2px] rounded-[4px] mt-[5px] bg-[#EDE7E1] text-[#4A4A4A]">{item.price}</div>
        )}

        {open && (
          <div className="pt-[10px] mt-2 border-t border-[#E2DDD5]" onClick={(e) => e.stopPropagation()}>
            {(reserveLabel || canEdit) && (
              <div className="flex gap-[6px] mb-2 flex-wrap">
                {reserveLabel && (
                  <button onClick={p.onBook}
                    className="font-sans text-[11px] font-medium px-[12px] py-[7px] rounded-[7px] bg-[#0F3A33] text-white hover:bg-[#2D6B57] transition-colors whitespace-nowrap">
                    {reserveLabel} →
                  </button>
                )}
                {canEdit && (
                  <button onClick={p.onConfirm}
                    className={`font-sans text-[11px] font-medium px-[12px] py-[7px] rounded-[7px] border border-[#0F3A33]/20 bg-[#E4EFEC] text-[#0F3A33] hover:bg-[#d4eae4] transition-colors whitespace-nowrap ${done ? 'opacity-60' : ''}`}>
                    {action.confirm}
                  </button>
                )}
              </div>
            )}

            {canEdit ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-[3px]">
                  <label className="font-mono text-[9px] font-medium text-[#BDBDBD] tracking-[.08em] uppercase">{t.note}</label>
                  <textarea
                    value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder={t.notePlaceholder}
                    className="px-[9px] py-[6px] border border-[#E2DDD5] rounded-[7px] text-[11px] text-[#1A1A1A] bg-[#F4F0E8] outline-none resize-none leading-[1.4] focus:border-[#6B8F86]"
                  />
                </div>
                <div className="flex flex-col gap-[3px]">
                  <label className="font-mono text-[9px] font-medium text-[#BDBDBD] tracking-[.08em] uppercase">{t.link}</label>
                  <div className="flex gap-[6px] items-center">
                    <input
                      value={link} onChange={(e) => setLink(e.target.value)} type="url" placeholder={t.linkPlaceholder}
                      className="flex-1 min-w-0 px-[9px] py-[6px] border border-[#E2DDD5] rounded-[7px] text-[11px] text-[#1A1A1A] bg-[#F4F0E8] outline-none focus:border-[#6B8F86]"
                    />
                    <button onClick={() => p.onOpenLink(link.trim() || item.affiliate)}
                      className="w-[30px] h-[30px] shrink-0 flex items-center justify-center bg-[#E4EFEC] border border-[#6B8F86] rounded-[7px] text-[13px] text-[#0F3A33] hover:bg-[#0F3A33] hover:text-white transition-colors">↗</button>
                  </div>
                </div>
                <button onClick={() => p.onSave(note, link)}
                  className="self-start mt-[2px] font-mono text-[10px] font-medium text-[#0F3A33] px-[14px] py-[6px] border border-[#6B8F86] rounded-[7px] hover:bg-[#E4EFEC] transition-colors">
                  {t.save}
                </button>
              </div>
            ) : (
              (p.annotation?.note || p.annotation?.link) && (
                <div className="flex flex-col gap-1 text-[11px] text-[#4A4A4A]">
                  {p.annotation?.note && <div>{p.annotation.note}</div>}
                  {p.annotation?.link && (
                    <a href={p.annotation.link}
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); p.onOpenLink(p.annotation?.link) }}
                       className="text-[#0F3A33] underline break-all cursor-pointer">{p.annotation.link}</a>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
      <div className={`text-[10px] text-[#BDBDBD] mt-[2px] shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}>›</div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Hotel card — confirmed state, "Reservar" CTA, and inline "Ya reservé" form
// ════════════════════════════════════════════════════════════════════════════
function HotelCard(p: {
  acc: Accommodation; booking?: Booking; t: typeof T['es']; locale: 'es' | 'en'
  canEdit: boolean; people: number
  onConfirm: (booking: Booking) => void
  onOpenLink: (url?: string) => void
}) {
  const { acc, booking, t, locale, canEdit } = p
  const [formOpen, setFormOpen] = useState(false)
  const confirmed = !!booking?.confirmed
  const card = 'border border-[#E2DDD5] rounded-[12px] overflow-hidden bg-[#FFF9F3]'

  // Same Stay22 Allez deep link the desktop hotel card uses.
  const reserveHref = buildAffiliateLink('booking', {
    city:      acc.city ?? '',
    startDate: acc.checkInDate,
    endDate:   acc.checkOutDate,
    adults:    p.people,
    locale,
    surface:   'planner',
  })

  return (
    <div className={card}>
      <div className="flex justify-between items-center px-[14px] py-[10px] border-b border-[#E2DDD5]">
        <span className={`font-mono text-[9px] font-medium px-[8px] py-[3px] rounded-[4px] tracking-[.04em] uppercase ${
          confirmed ? 'bg-[#E4EFEC] text-[#0F3A33]' : 'bg-[#EDE7E1] text-[#8A8A8A]'
        }`}>{confirmed ? t.booked : t.pending}</span>
        {acc.priceTier && <span className="font-mono text-[11px] text-[#8A8A8A]">{tierGlyph(acc.priceTier)}</span>}
      </div>

      <div className="font-display text-[15px] font-medium text-[#1A1A1A] px-[14px] pt-[10px] pb-[2px]">
        {acc.city || (locale === 'es' ? 'Alojamiento' : 'Accommodation')}
      </div>
      {(acc.neighborhood || acc.nights) && (
        <div className="text-[11px] text-[#8A8A8A] px-[14px] pb-[10px]">
          {[acc.neighborhood, acc.nights ? `${acc.nights} ${locale === 'es' ? 'noches' : 'nights'}` : null].filter(Boolean).join(' · ')}
        </div>
      )}

      {confirmed && booking && (
        <div className="mx-[14px] mb-[10px] px-[10px] py-[8px] bg-[#E4EFEC] rounded-[8px]">
          <div className="flex items-center justify-between mb-[2px]">
            <span className="font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#0F3A33]">{t.booked}</span>
            {canEdit && (
              <button onClick={() => setFormOpen(o => !o)} className="font-sans text-[11px] text-[#0F3A33]/70 hover:text-[#0F3A33] underline-offset-2 hover:underline">{t.edit}</button>
            )}
          </div>
          <div className="font-mono text-[10px] text-[#0F3A33] leading-[1.7]">
            {booking.code}{booking.checkinTime ? ` · ${t.bkCheckin} ${booking.checkinTime}` : ''}
            {booking.notes ? <><br />{booking.notes}</> : null}
          </div>
        </div>
      )}

      <div className="px-[14px] pb-[14px] flex flex-col gap-[8px]">
        {confirmed ? (
          booking?.bookingUrl && (
            <a href={booking.bookingUrl}
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); p.onOpenLink(booking?.bookingUrl) }}
               className="block text-center px-[12px] py-[9px] bg-transparent border border-[#0F3A33]/25 text-[#0F3A33] rounded-[8px] text-[12px] font-medium hover:bg-[rgba(15,58,51,.06)] transition-colors cursor-pointer">
              {t.seeBooking}
            </a>
          )
        ) : (
          <>
            {/* window.open bypasses the Stay22 anchor interceptor */}
            <a href={reserveHref}
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(reserveHref, '_blank', 'noopener,noreferrer') }}
               className="block text-center px-[14px] py-[11px] bg-[#0F3A33] text-white rounded-[9px] text-[13px] font-semibold hover:opacity-85 transition-opacity cursor-pointer">
              {t.reserve} →
            </a>
            {canEdit && !formOpen && (
              <button onClick={() => setFormOpen(true)} className="text-[12px] text-[#2D6B57] hover:text-[#0F3A33] transition-colors text-left">
                {t.alreadyBooked}
              </button>
            )}
          </>
        )}
      </div>

      {canEdit && formOpen && (
        <MobileBookingForm
          t={t} initial={booking}
          onCancel={() => setFormOpen(false)}
          onSave={(b) => { p.onConfirm(b); setFormOpen(false) }}
        />
      )}
    </div>
  )
}

function MobileBookingForm(p: {
  t: typeof T['es']; initial?: Booking
  onCancel: () => void
  onSave: (booking: Booking) => void
}) {
  const { t } = p
  const [code, setCode] = useState(p.initial?.code ?? '')
  const [checkinTime, setCheckinTime] = useState(p.initial?.checkinTime ?? '')
  const [notes, setNotes] = useState(p.initial?.notes ?? '')
  const [bookingUrl, setBookingUrl] = useState(p.initial?.bookingUrl ?? '')
  const [error, setError] = useState<string | null>(null)

  function isValidUrl(raw: string): boolean {
    const v = raw.trim()
    if (!v) return true
    try { const u = new URL(v); return u.protocol === 'https:' || u.protocol === 'http:' } catch { return false }
  }
  function submit() {
    setError(null)
    const c = code.trim()
    if (!c) { setError(t.bkCodeRequired); return }
    const u = bookingUrl.trim()
    if (u && !isValidUrl(u)) { setError(t.bkInvalidUrl); return }
    p.onSave({
      confirmed:   true,
      code:        c.slice(0, 50),
      checkinTime: checkinTime.trim().slice(0, 10),
      notes:       notes.trim().slice(0, 280),
      ...(u ? { bookingUrl: u.slice(0, 500) } : {}),
    })
  }

  const field = 'w-full bg-white border border-[#E2DDD5] rounded-[7px] px-[10px] py-[7px] text-[12px] text-[#1A1A1A] outline-none focus:border-[#0F3A33]'
  const lbl = 'font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#BDBDBD] block mb-[3px]'

  return (
    <div className="mx-[14px] mb-[14px] rounded-[10px] bg-[#F4F0E8] border border-[#E2DDD5] p-[12px]">
      <label className="block mb-[8px]">
        <span className={lbl}>{t.bkCode}</span>
        <input className={`${field} font-mono`} value={code} onChange={e => setCode(e.target.value)} placeholder={t.bkCodePh} maxLength={50} />
      </label>
      <label className="block mb-[8px]">
        <span className={lbl}>{t.bkTime}</span>
        <input className={`${field} font-mono`} value={checkinTime} onChange={e => setCheckinTime(e.target.value)} placeholder={t.bkTimePh} maxLength={10} />
      </label>
      <label className="block mb-[8px]">
        <span className={lbl}>{t.bkNotes}</span>
        <input className={field} value={notes} onChange={e => setNotes(e.target.value)} placeholder={t.bkNotesPh} maxLength={280} />
      </label>
      <label className="block mb-[8px]">
        <span className={lbl}>{t.bkUrl}</span>
        <input className={`${field} font-mono`} type="url" inputMode="url" value={bookingUrl} onChange={e => setBookingUrl(e.target.value)} placeholder={t.bkUrlPh} maxLength={500} />
      </label>
      {error && <p className="text-[12px] text-[#B94030] mb-[8px] leading-snug">{error}</p>}
      <div className="flex gap-[8px]">
        <button onClick={submit} className="flex-1 px-[12px] py-[8px] bg-[#0F3A33] text-white rounded-[7px] text-[12px] font-medium hover:opacity-85 transition-opacity">{t.bkSave}</button>
        <button onClick={p.onCancel} className="px-[12px] py-[8px] bg-[#EDE7E1] text-[#4A4A4A] rounded-[7px] font-mono text-[10px] font-medium hover:bg-[#E2DDD5] transition-colors">{t.bkCancel}</button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Budget tab
// ════════════════════════════════════════════════════════════════════════════
function BudgetTab(p: {
  t: typeof T['es']; categories: [string, BudgetRow[]][]
  totals: { ai: number; usr: number; act: number; hasUser: boolean; hasActual: boolean }
  budgetView: 'total' | 'persona'; setBudgetView: (v: 'total' | 'persona') => void
  fmt: (n: number | null) => string
  effectiveActual: (r: BudgetRow) => number | null
  effectiveEstimate: (r: BudgetRow) => number | null
  canEdit: boolean
  onSetActual: (id: string, raw: string) => void
  onSetEstimate: (id: string, raw: string) => void
}) {
  const { t, totals, fmt } = p
  const card = 'border border-[#E2DDD5] rounded-[12px] overflow-hidden bg-[#FFF9F3]'
  return (
    <>
      <div className="font-mono text-[9px] font-medium text-[#BDBDBD] tracking-[.12em] uppercase px-[18px] pt-4 pb-2">{t.budget}</div>
      <div className="px-[18px] pb-[14px]">
        <div className={card}>
          {/* totals */}
          <div className="px-[14px] py-3 border-b border-[#E2DDD5]">
            <div className="grid grid-cols-3">
              <Total lbl={t.aiEstimated} amt={fmt(totals.ai)} cls="text-[#8A8A8A]" border />
              <Total lbl={t.yourEstimate} amt={totals.hasUser ? fmt(totals.usr) : '—'} cls={totals.hasUser ? 'text-[#2D6B57]' : 'text-[#BDBDBD]'} border />
              <Total lbl={t.confirmed} amt={totals.hasActual ? fmt(totals.act) : '—'} cls={totals.hasActual ? 'text-[#0F3A33]' : 'text-[#BDBDBD]'} />
            </div>
          </div>
          {/* view toggle */}
          <div className="flex gap-2 px-[14px] py-2 border-b border-[#E2DDD5] items-center">
            <span className="font-mono text-[9px] text-[#BDBDBD] tracking-[.06em] uppercase mr-1">{t.view}</span>
            {(['total', 'persona'] as const).map(v => (
              <button key={v} onClick={() => p.setBudgetView(v)}
                className={`font-mono text-[9px] font-medium px-[8px] py-[3px] rounded-[4px] border transition-colors ${
                  p.budgetView === v ? 'bg-[#0F3A33] text-white border-[#0F3A33]' : 'border-[#E2DDD5] text-[#8A8A8A]'
                }`}>{v === 'total' ? t.total : t.perPerson}</button>
            ))}
          </div>
          {/* categories */}
          {p.categories.map(([cat, rows]) => {
            const catTotal = rows.reduce((s, r) => s + (p.effectiveActual(r) ?? p.effectiveEstimate(r) ?? r.aiEst), 0)
            return (
              <div key={cat} className="border-b border-[#E2DDD5] last:border-b-0">
                <div className="flex justify-between items-center px-[14px] py-2 bg-[#F4F0E8]">
                  <span className="font-mono text-[9px] font-medium text-[#4A4A4A] tracking-[.06em] uppercase">{cat}</span>
                  <span className="font-mono text-[10px] text-[#4A4A4A]">{fmt(catTotal)}</span>
                </div>
                {rows.map(r => (
                  <div key={r.id} className="px-[14px] py-2 border-t border-[#E2DDD5]">
                    <div className="flex items-center gap-2 mb-[6px]">
                      {r.icon && <span className="text-[13px] shrink-0">{r.icon}</span>}
                      <span className="text-[11px] text-[#1A1A1A] flex-1 min-w-0 truncate">{r.label}</span>
                      <span className="font-mono text-[9px] text-[#BDBDBD] shrink-0">{t.aiEstimated} {fmt(r.aiEst)}</span>
                    </div>
                    {p.canEdit ? (
                      <div className="flex gap-[8px] pl-[21px]">
                        <label className="flex items-center gap-[5px]">
                          <span className="font-mono text-[8px] tracking-[.06em] uppercase text-[#BDBDBD]">{t.estShort}</span>
                          <input type="number" inputMode="numeric" placeholder="—"
                            defaultValue={p.effectiveEstimate(r) ?? ''}
                            onBlur={(e) => p.onSetEstimate(r.id, e.target.value)}
                            className="w-[64px] px-[6px] py-1 border border-[#E2DDD5] rounded-[5px] font-mono text-[10px] text-[#2D6B57] bg-[#FFF9F3] outline-none text-right focus:border-[#6B8F86]" />
                        </label>
                        <label className="flex items-center gap-[5px]">
                          <span className="font-mono text-[8px] tracking-[.06em] uppercase text-[#BDBDBD]">{t.real}</span>
                          <input type="number" inputMode="numeric" placeholder="—"
                            defaultValue={p.effectiveActual(r) ?? ''}
                            onBlur={(e) => p.onSetActual(r.id, e.target.value)}
                            className="w-[64px] px-[6px] py-1 border border-[#E2DDD5] rounded-[5px] font-mono text-[10px] text-[#0F3A33] bg-[#FFF9F3] outline-none text-right focus:border-[#6B8F86]" />
                        </label>
                      </div>
                    ) : (
                      <div className="flex gap-[14px] pl-[21px] font-mono text-[10px]">
                        <span className="text-[#2D6B57]">{t.estShort} {fmt(p.effectiveEstimate(r))}</span>
                        <span className="text-[#0F3A33]">{t.real} {fmt(p.effectiveActual(r))}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function Total(p: { lbl: string; amt: string; cls: string; border?: boolean }) {
  return (
    <div className={`px-3 py-2 text-center ${p.border ? 'border-r border-[#E2DDD5]' : ''}`}>
      <span className="block font-mono text-[8px] text-[#BDBDBD] tracking-[.06em] uppercase mb-[3px]">{p.lbl}</span>
      <span className={`font-mono text-[13px] font-medium ${p.cls}`}>{p.amt}</span>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Preparativos tab — pre-trip checklist (book hotel / pack / documents /
// arrival-departure transfers) + the packing list
// ════════════════════════════════════════════════════════════════════════════
function PrepTab(p: {
  t: typeof T['es']; canEdit: boolean
  prepChecks: CheckItem[]; doneCheckIds: Set<string>; onToggleCheck: (id: string) => void
  packing: string[]; packedItems: Set<number>; onTogglePacked: (i: number) => void
}) {
  const { t, canEdit } = p
  const card = 'border border-[#E2DDD5] rounded-[12px] overflow-hidden bg-[#FFF9F3]'
  const secLbl = 'font-mono text-[9px] font-medium text-[#BDBDBD] tracking-[.12em] uppercase px-[18px] pt-4 pb-2'
  const cardHeader = 'flex justify-between items-center px-[14px] py-[10px] bg-[#F4F0E8] border-b border-[#E2DDD5]'
  const headerTitle = 'font-mono text-[10px] font-medium text-[#4A4A4A] tracking-[.06em] uppercase'
  const headerCount = 'font-mono text-[10px] text-[#BDBDBD]'
  const prepDone = p.prepChecks.filter(c => p.doneCheckIds.has(c.id)).length

  return (
    <>
      {/* Pre-trip checklist */}
      {p.prepChecks.length > 0 && (
        <>
          <div className={secLbl}>{t.beforeYouGo}</div>
          <div className="px-[18px] pb-[6px]">
            <div className={card}>
              <div className={cardHeader}>
                <span className={headerTitle}>{t.beforeYouGo}</span>
                <span className={headerCount}>{prepDone}/{p.prepChecks.length}</span>
              </div>
              {p.prepChecks.map(c => {
                const done = p.doneCheckIds.has(c.id)
                return (
                  <button key={c.id} disabled={!canEdit} onClick={() => p.onToggleCheck(c.id)}
                    className={`w-full text-left flex items-start gap-[10px] px-[14px] py-[10px] border-b border-[#E2DDD5] last:border-b-0 transition-colors ${
                      canEdit ? 'hover:bg-[#F4F0E8] cursor-pointer' : 'cursor-default'
                    } ${done ? 'opacity-50' : ''}`}>
                    <span className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] shrink-0 flex items-center justify-center text-[10px] text-white mt-[1px] ${
                      done ? 'bg-[#0F3A33] border-[#0F3A33]' : 'border-[#E2DDD5]'
                    }`}>{done ? '✓' : ''}</span>
                    <span className={`flex-1 text-[12px] font-medium leading-[1.3] ${done ? 'line-through text-[#BDBDBD]' : 'text-[#1A1A1A]'}`}>{c.icon} {c.text}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Packing list */}
      {p.packing.length > 0 && (
        <>
          <div className={secLbl}>{t.tabPacking}</div>
          <div className="px-[18px] pb-[14px]">
            <div className={card}>
              <div className={cardHeader}>
                <span className={headerTitle}>{t.packingList}</span>
                <span className={headerCount}>{p.packedItems.size}/{p.packing.length} {t.packed}</span>
              </div>
              {p.packing.map((item, i) => {
                const checked = p.packedItems.has(i)
                return (
                  <button key={i} disabled={!canEdit} onClick={() => p.onTogglePacked(i)}
                    className={`w-full text-left flex items-center gap-[10px] px-[14px] py-[9px] border-b border-[#E2DDD5] last:border-b-0 transition-colors ${
                      canEdit ? 'hover:bg-[#F4F0E8] cursor-pointer' : 'cursor-default'
                    }`}>
                    <span className={`w-[16px] h-[16px] rounded-[4px] border-[1.5px] shrink-0 flex items-center justify-center text-[9px] text-white transition-colors ${
                      checked ? 'bg-[#0F3A33] border-[#0F3A33]' : 'border-[#E2DDD5]'
                    }`}>{checked ? '✓' : ''}</span>
                    <span className={`text-[12px] flex-1 ${checked ? 'line-through text-[#BDBDBD]' : 'text-[#1A1A1A]'}`}>{item}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}

// ── Misc ───────────────────────────────────────────────────────────────────
function tierGlyph(tier: string): string {
  switch (tier) {
    case 'budget': return '$'
    case 'mid': return '$$'
    case 'upscale': return '$$$'
    case 'luxury': return '$$$$'
    default: return tier
  }
}
