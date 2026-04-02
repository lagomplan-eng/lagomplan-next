'use client'

import { useEffect, useState } from 'react'
import { Link } from '../../../lib/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer' | 'relax'

interface ItineraryItem {
  id: string
  type: ItemType
  time: string
  name: string
  desc: string
  price?: string
  affiliate?: string
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

interface Props {
  params: Record<string, string>
}

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_INFO: Record<ItemType, { icon: string; label: string }> = {
  hotel:      { icon: '🏨', label: 'Hotel' },
  tour:       { icon: '🌊', label: 'Tour' },
  restaurant: { icon: '🍽', label: 'Restaurante' },
  free:       { icon: '🚶', label: 'Libre' },
  relax:      { icon: '💆', label: 'Relax' },
  transfer:   { icon: '🚗', label: 'Transfer' },
}

const TYPE_BORDER: Record<ItemType, string> = {
  hotel: '#0F3A33', tour: '#0891B2', restaurant: '#D97706',
  free: '#CEC8C0', relax: '#6B8F86', transfer: '#2D4F6C',
}

const TYPE_BADGE: Record<ItemType, { color: string; bg: string }> = {
  hotel:      { color: '#0F3A33', bg: 'rgba(15,58,51,.07)' },
  tour:       { color: '#0E7490', bg: '#ECFEFF' },
  restaurant: { color: '#92400E', bg: '#FFFBEB' },
  free:       { color: '#7A7A76', bg: '#EDE7E1' },
  relax:      { color: '#065F46', bg: '#ECFDF5' },
  transfer:   { color: '#2D4F6C', bg: '#EBF4FF' },
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

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="font-mono text-[11px] tracking-[2px] text-[#2D6B57] uppercase">
        Generating your plan…
      </p>
      <p className="font-sans text-[14px] text-[#8A8A8A] text-center">
        We are creating your personalized itinerary.
      </p>
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
    items:    rawItems.map(normalizeItem),
  }
}

function normalizeItem(raw: any, index: number): ItineraryItem {
  return {
    id:        typeof raw?.id === 'string'   ? raw.id   : `item-${index}`,
    type:      raw?.type   ?? 'free',
    time:      raw?.time   ?? '',
    name:      raw?.title  ?? raw?.name  ?? '',
    desc:      raw?.description ?? raw?.desc ?? '',
    price:     raw?.price,
    affiliate: raw?.affiliate,
  }
}

function normalizeTripData(row: any, destination: string, nights: string): TripData {
  const source = row?.trip_data ?? row?.trip ?? row?.data ?? row ?? {}
  const rawDays = Array.isArray(source.days) ? source.days : []
  return {
    title:      row?.title ?? source.title ?? `${destination} · ${parseInt(nights || '0', 10) || 3} nights`,
    subtitle:   source.subtitle ?? 'AI-generated trip plan',
    days:       rawDays.map(normalizeDay),
    checks:     Array.isArray(source.checks)     ? source.checks     : [],
    budgetRows: Array.isArray(source.budgetRows) ? source.budgetRows : [],
    packing:    Array.isArray(source.packing)    ? source.packing    : [],
  }
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function TripResult({ params }: Props) {
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
  } = params

  // ── Data state ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<any>(null)
  const [tripTitle, setTripTitle]     = useState('')
  const [tripSubtitle, setTripSubtitle] = useState('')
  const [days, setDays]         = useState<Day[]>([])
  const [checks, setChecks]     = useState<CheckItem[]>([])
  const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([])
  const [packing, setPacking]   = useState<string[]>([])

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [prefOpen, setPrefOpen]       = useState(false)
  const [collapsedDays, setCollapsedDays]     = useState<Set<number>>(new Set())
  const [collapsedCards, setCollapsedCards]   = useState<Set<string>>(new Set())
  const [collapsedDiaGroups, setCollapsedDiaGroups] = useState<Set<number>>(new Set())
  const [editModalItem, setEditModalItem]     = useState<ItineraryItem | null>(null)
  const [toast, setToast]             = useState<string | null>(null)
  const [packedSet, setPackedSet]     = useState<Set<number>>(new Set())

  // ── Pref state (prefilled from params) ──────────────────────────────────────
  const [prefOrigin, setPrefOrigin]       = useState(origin)
  const [prefDest, setPrefDest]           = useState(destination)
  const [prefStart, setPrefStart]         = useState(start)
  const [prefEnd, setPrefEnd]             = useState(end)
  const [prefTraveler, setPrefTraveler]   = useState(traveler)
  const [prefPace, setPrefPace]           = useState(pace)
  const [prefBudget, setPrefBudget]       = useState(budget)
  const [prefInterests, setPrefInterests] = useState(interests)

  // ── Original generate effect (unchanged) ────────────────────────────────────
  useEffect(() => {
    async function generate() {
      setLoading(true)
      setError(null)
      try {
        const parsedInterests = interests
          ? interests.split(',').map((i) => i.trim()).filter(Boolean)
          : []
        const payload = { destination, origin, start, end, nights, traveler, interests: parsedInterests, pace, budget }
        console.log('[TripResult] POST payload:', JSON.stringify(payload))
        const genRes  = await fetch('/api/generate-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const genData = await genRes.json().catch(() => null)
        console.log('[TripResult] POST status:', genRes.status, 'response:', genData)
        setRawResponse(genData)
        if (!genRes.ok) {
          const base   = typeof genData?.error === 'string' ? genData.error : 'Generation failed'
          const detail = genData?.detail ? `\n\n${JSON.stringify(genData.detail, null, 2)}` : ''
          throw new Error(base + detail)
        }
        const tripId = genData?.trip_id
        if (!tripId) throw new Error(`No trip_id in generation response. Got: ${JSON.stringify(genData)}`)
        console.log('[TripResult] GET /api/trips/' + tripId)
        const tripRes  = await fetch(`/api/trips/${tripId}`)
        const tripData = await tripRes.json().catch(() => null)
        console.log('[TripResult] GET status:', tripRes.status, 'response:', tripData)
        setRawResponse(tripData)
        if (!tripRes.ok) {
          throw new Error(typeof tripData?.error === 'string' ? tripData.error : 'Failed to load trip')
        }
        const normalized = normalizeTripData(tripData, destination, nights)
        setTripTitle(normalized.title)
        setTripSubtitle(normalized.subtitle)
        setDays(normalized.days)
        setChecks(normalized.checks)
        setBudgetRows(normalized.budgetRows)
        setPacking(normalized.packing)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    generate()
  }, [destination, origin, start, end, nights, traveler, interests, pace, budget])

  // ── Regenerate from pref drawer ──────────────────────────────────────────────
  async function regenerate() {
    setPrefOpen(false)
    setLoading(true)
    setError(null)
    try {
      const parsedInterests = prefInterests
        ? prefInterests.split(',').map((i) => i.trim()).filter(Boolean)
        : []
      const payload = {
        destination: prefDest, origin: prefOrigin, start: prefStart, end: prefEnd,
        nights, traveler: prefTraveler, interests: parsedInterests, pace: prefPace, budget: prefBudget,
      }
      const genRes  = await fetch('/api/generate-trip', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const genData = await genRes.json().catch(() => null)
      setRawResponse(genData)
      if (!genRes.ok) throw new Error(typeof genData?.error === 'string' ? genData.error : 'Generation failed')
      const tripId = genData?.trip_id
      if (!tripId) throw new Error(`No trip_id. Got: ${JSON.stringify(genData)}`)
      const tripRes  = await fetch(`/api/trips/${tripId}`)
      const tripData = await tripRes.json().catch(() => null)
      setRawResponse(tripData)
      if (!tripRes.ok) throw new Error(typeof tripData?.error === 'string' ? tripData.error : 'Failed to load trip')
      const normalized = normalizeTripData(tripData, prefDest, nights)
      setTripTitle(normalized.title)
      setTripSubtitle(normalized.subtitle)
      setDays(normalized.days)
      setChecks(normalized.checks)
      setBudgetRows(normalized.budgetRows)
      setPacking(normalized.packing)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // ── UI helpers ───────────────────────────────────────────────────────────────
  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function toggleDay(n: number) {
    setCollapsedDays(prev => {
      const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s
    })
  }

  function toggleCard(id: string) {
    setCollapsedCards(prev => {
      const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s
    })
  }

  function toggleDiaGroup(n: number) {
    setCollapsedDiaGroups(prev => {
      const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s
    })
  }

  function toggleCheck(id: string) {
    setChecks(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c))
  }

  function togglePacked(idx: number) {
    setPackedSet(prev => {
      const s = new Set(prev); s.has(idx) ? s.delete(idx) : s.add(idx); return s
    })
  }

  // ── Computed values ──────────────────────────────────────────────────────────
  const totalBudget  = budgetRows.reduce((sum, row) => sum + row.amount, 0)
  const nightsNum    = parseInt(nights || '0', 10) || 3
  const dateRange    = start && end ? `${start} — ${end}` : `${nightsNum} noches`
  const doneChecks   = checks.filter(c => c.done).length
  const totalChecks  = checks.length
  const progressPct  = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0
  const nextCheck    = checks.find(c => !c.done)
  const checksBefore = checks.filter(c => !c.day)
  const dayNums      = Array.from(new Set(checks.filter(c => c.day).map(c => c.day!))).sort((a, b) => a - b)

  const budgetByCategory = budgetRows.reduce<Record<string, BudgetRow[]>>((acc, row) => {
    const cat = row.category || 'Otros'
    ;(acc[cat] = acc[cat] || []).push(row)
    return acc
  }, {})

  // ── Early returns ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="pt-[64px] min-h-screen bg-[#F4F0E8]">
        <div className="page-inner"><LoadingState /></div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="pt-[64px] min-h-screen bg-[#F4F0E8]">
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
    <main className="pt-[64px] min-h-screen bg-[#FAF8F5]">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#E4DFD8] pt-12 pb-9">
        <div className="max-w-[1160px] mx-auto px-7">
          <div className="grid grid-cols-[1fr_360px] gap-[52px] items-start max-[860px]:grid-cols-1">

            {/* Hero left */}
            <div>
              {/* Eyebrow */}
              <div className="font-mono text-[10px] tracking-[.16em] uppercase text-[#6B8F86] mb-4 flex items-center gap-2.5">
                <span className="w-[22px] h-px bg-[#6B8F86] shrink-0" />
                {origin ? `${origin} → ${destination}` : 'Resultado del plan'}
              </div>

              {/* Title */}
              <h1 className="font-display text-[clamp(34px,4vw,52px)] font-normal leading-[1.06] tracking-[-0.03em] text-[#1C1C1A] mb-3.5">
                {tripTitle || `Tu viaje a`}<br />
                <em className="italic text-[#0F3A33]">{destination}</em>
              </h1>

              {/* Subtitle */}
              <p className="text-[14px] font-light leading-[1.75] text-[#7A7A76] max-w-[420px] mb-6">
                {tripSubtitle}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-1.5 mb-7">
                <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full">
                  <span>📅</span> {dateRange}
                </span>
                {destination && (
                  <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full">
                    <span>📍</span> {destination}
                  </span>
                )}
                {traveler && (
                  <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full capitalize">
                    <span>👥</span> {traveler}
                  </span>
                )}
                {pace && (
                  <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full capitalize">
                    <span>🧭</span> {pace}
                  </span>
                )}
                {budget && (
                  <span className="flex items-center gap-[5px] font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full">
                    <span>💰</span> {budget}
                  </span>
                )}
              </div>

              {/* Action row */}
              <div className="flex items-center pt-[18px] border-t border-[#E4DFD8]">
                <button
                  className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#7A7A76] pr-[15px] hover:text-[#0F3A33] transition-colors"
                  onClick={() => showToast('🔖 Guardado en mis viajes')}
                >
                  <span>🔖</span> Guardar
                </button>
                <span className="text-[#CEC8C0] pr-[15px] text-[10px]">·</span>
                <button
                  className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#7A7A76] pr-[15px] hover:text-[#0F3A33] transition-colors"
                  onClick={() => showToast('↗ Generando enlace para compartir…')}
                >
                  <span>↗</span> Compartir
                </button>
                <span className="text-[#CEC8C0] pr-[15px] text-[10px]">·</span>
                <button
                  className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#7A7A76] hover:text-[#0F3A33] transition-colors"
                  onClick={() => showToast('📄 Generando PDF…')}
                >
                  <span>⬇</span> PDF
                </button>
              </div>
            </div>

            {/* Hero right — image card */}
            <div className="max-[860px]:order-first">
              <div className="w-full aspect-[4/3] rounded-[26px] overflow-hidden relative bg-[#0F3A33]">
                <div
                  className="w-full h-full flex items-end p-[22px]"
                  style={{ background: 'linear-gradient(145deg, #0F3A33 0%, #1A5247 45%, #6B8F86 80%, #A8C4BE 100%)' }}
                >
                  <span className="font-display italic text-[24px] font-light text-white/85 tracking-[-0.01em]">
                    {destination || 'Tu destino'}
                  </span>
                </div>
                {origin && (
                  <span className="absolute top-3.5 right-3.5 font-mono text-[9px] font-medium tracking-[.12em] uppercase text-white bg-[rgba(15,58,51,.65)] backdrop-blur-sm px-2.5 py-[3px] rounded-full">
                    desde {origin}
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
      <div className="border-b border-[#E4DFD8]">
        <div
          style={{
            maxHeight: prefOpen ? '600px' : '0',
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
                  <option value="relaxed">Relajado · Pocas actividades</option>
                  <option value="moderate">Equilibrado</option>
                  <option value="active">Activo · Máx. experiencias</option>
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
                  <option value="budget">$10k–$15k</option>
                  <option value="moderate">$15k–$25k</option>
                  <option value="premium">$25k–$40k</option>
                  <option value="luxury">$40k+</option>
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

              {/* Traveler chips */}
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
              </div>

              {/* Footer */}
              <div className="col-span-3 max-[600px]:col-span-1 flex justify-end gap-2">
                <button
                  onClick={() => setPrefOpen(false)}
                  className="text-[13px] text-[#7A7A76] px-[15px] py-[7px] border border-[#E4DFD8] rounded-[6px] bg-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={regenerate}
                  className="text-[13px] font-medium text-white px-[17px] py-[7px] bg-[#0F3A33] rounded-[6px]"
                >
                  Actualizar plan
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROL BAR ───────────────────────────────────────────────────── */}
      <div className="bg-[#0F3A33]">
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
                  style={{ width: `${totalChecks > 0 ? progressPct : Math.round((days.length / Math.max(days.length, 1)) * 100)}%` }}
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
          <div>
            {/* Section header */}
            <div className="flex items-baseline justify-between mb-[18px]">
              <div>
                <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-1">
                  Tu itinerario
                </div>
                <div className="font-display text-[19px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                  {nightsNum} días en {destination || 'tu destino'}
                </div>
              </div>
              <button
                className="font-mono text-[10px] font-medium tracking-[.06em] text-[#0F3A33]"
                onClick={() => showToast('Añadir día — próximamente')}
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
                      className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)] hover:shadow-[0_2px_8px_rgba(15,58,51,.07)] transition-shadow"
                    >
                      {/* Day header */}
                      <div
                        className="flex items-center justify-between px-[18px] py-3.5 cursor-pointer select-none border-b border-[#E4DFD8]"
                        onClick={() => toggleDay(day.n)}
                      >
                        <div>
                          <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-[3px]">
                            {day.label}
                          </div>
                          <div className="font-display text-[15px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
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

                            return (
                              <div
                                key={item.id}
                                className="grid grid-cols-[28px_1fr_auto] gap-3 items-start py-3.5 border-b border-[#E4DFD8] last:border-b-0 pl-2.5 -ml-2.5 border-l-[3px] hover:bg-[rgba(237,231,225,.3)] transition-colors"
                                style={{ borderLeftColor: tborder }}
                              >
                                {/* Index */}
                                <div className="font-mono text-[10px] text-[#B8B5AF] pt-3.5">
                                  {String(idx + 1).padStart(2, '0')}
                                </div>

                                {/* Content */}
                                <div>
                                  <div className="flex items-center gap-[5px] flex-wrap mb-1">
                                    <span
                                      className="font-mono text-[9px] font-medium tracking-[.08em] uppercase px-[6px] py-[2px] rounded-[3px]"
                                      style={{ color: tbadge.color, background: tbadge.bg }}
                                    >
                                      {tinfo.icon} {tinfo.label}
                                    </span>
                                    {item.time && (
                                      <span className="font-mono text-[9px] text-[#0F3A33] border border-[rgba(15,58,51,.18)] px-[5px] py-px rounded-[3px]">
                                        {item.time}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[13px] font-medium text-[#1C1C1A] leading-[1.3] mb-[3px]">
                                    {item.name}
                                  </div>
                                  <div className="text-[11.5px] font-light text-[#7A7A76] leading-[1.6]">
                                    {item.desc}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end gap-[5px] shrink-0 pt-3">
                                  {item.price && (
                                    <div>
                                      <div className="font-mono text-[13px] font-medium text-[#1C1C1A] text-right">
                                        {item.price}
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex flex-col gap-[3px] items-end">
                                    {item.affiliate ? (
                                      <a
                                        href={item.affiliate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 font-mono text-[10px] font-medium tracking-[.06em] uppercase text-white bg-[#0F3A33] px-2.5 py-[5px] rounded-[4px] hover:bg-[#1A5247] hover:-translate-y-px transition-all whitespace-nowrap"
                                      >
                                        Ver opciones
                                      </a>
                                    ) : (
                                      <button
                                        className="flex items-center gap-1 font-mono text-[10px] font-medium tracking-[.06em] uppercase text-white bg-[#0F3A33] px-2.5 py-[5px] rounded-[4px] hover:bg-[#1A5247] transition-colors whitespace-nowrap"
                                        onClick={() => showToast('🔗 Opciones de reserva — próximamente')}
                                      >
                                        Reservar
                                      </button>
                                    )}
                                    <button
                                      className="font-mono text-[10px] text-[#B8B5AF] px-[6px] py-[3px] rounded-[4px] hover:text-[#0F3A33] hover:bg-[rgba(15,58,51,.05)] transition-all"
                                      onClick={() => setEditModalItem(item)}
                                    >
                                      Editar
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
                          onClick={() => showToast('Añadir actividad — próximamente')}
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
          <aside className="flex flex-col gap-2.5 max-[900px]:order-first">
            <div className="sticky top-[76px] flex flex-col gap-2.5">

              {/* Planning / checks card */}
              <div className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)]">
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

                    {/* Before-trip checks */}
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

                    {/* Per-day groups */}
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

              {/* Packing card */}
              {packing.length > 0 && (
                <div className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)]">
                  <div
                    className="flex items-center justify-between px-4 py-[13px] cursor-pointer select-none hover:bg-[#EDE7E1] transition-colors gap-2.5"
                    onClick={() => toggleCard('packing')}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="font-display text-[14px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                        Qué llevar
                      </span>
                      <span className="font-mono text-[9px] font-medium tracking-[.06em] text-[#6B8F86] bg-[rgba(107,143,134,.12)] px-[6px] py-px rounded-full shrink-0">
                        {packing.length}
                      </span>
                    </div>
                    <div
                      className="w-[19px] h-[19px] rounded-[4px] bg-[#EDE7E1] flex items-center justify-center text-[9px] text-[#7A7A76] shrink-0 transition-transform duration-300"
                      style={{ transform: collapsedCards.has('packing') ? 'rotate(-90deg)' : 'none' }}
                    >
                      ▾
                    </div>
                  </div>

                  <div
                    style={{
                      maxHeight: collapsedCards.has('packing') ? '0' : '800px',
                      opacity: collapsedCards.has('packing') ? 0 : 1,
                      overflow: 'hidden',
                      transition: 'max-height 0.4s ease, opacity 0.3s',
                    }}
                  >
                    <div className="border-t border-[#E4DFD8] px-4 py-3">
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
                    </div>
                  </div>
                </div>
              )}

              {/* Budget card */}
              {budgetRows.length > 0 && (
                <div className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)]">
                  <div
                    className="flex items-center justify-between px-4 py-[13px] cursor-pointer select-none hover:bg-[#EDE7E1] transition-colors"
                    onClick={() => toggleCard('budget')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[14px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                        Presupuesto
                      </span>
                      <span className="font-mono text-[12px] font-medium text-[#3D3D3A]">
                        ${totalBudget.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="text-[9px] text-[#7A7A76] transition-transform duration-300 inline-block"
                      style={{ transform: collapsedCards.has('budget') ? 'rotate(-90deg)' : 'none' }}
                    >
                      ▾
                    </div>
                  </div>

                  <div
                    style={{
                      maxHeight: collapsedCards.has('budget') ? '0' : '900px',
                      opacity: collapsedCards.has('budget') ? 0 : 1,
                      overflow: 'hidden',
                      transition: 'max-height 0.4s ease, opacity 0.3s',
                    }}
                  >
                    <div className="border-t border-[#E4DFD8]">
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
                    </div>
                  </div>
                </div>
              )}

            </div>
          </aside>

        </div>
      </div>

      {/* ── ITEM EDIT MODAL ───────────────────────────────────────────────── */}
      {editModalItem && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-[200] flex items-center justify-center p-[18px]"
          onClick={() => setEditModalItem(null)}
        >
          <div
            className="bg-[#FAF8F5] rounded-[26px] p-[26px] w-full max-w-[470px] shadow-[0_8px_40px_rgba(15,58,51,.12)]"
            style={{ animation: 'mIn 0.25s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-[18px]">
              <h2 className="font-display text-[18px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                Editar actividad
              </h2>
              <button
                className="w-6 h-6 rounded-[5px] bg-[#EDE7E1] flex items-center justify-center text-[12px] text-[#3D3D3A]"
                onClick={() => setEditModalItem(null)}
              >
                ✕
              </button>
            </div>

            <div className="mb-3">
              <label className="block font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                Nombre
              </label>
              <input
                defaultValue={editModalItem.name}
                className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
              />
            </div>

            <div className="mb-3">
              <label className="block font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                Descripción
              </label>
              <textarea
                defaultValue={editModalItem.desc}
                className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33] min-h-[65px] resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                  Hora
                </label>
                <input
                  defaultValue={editModalItem.time}
                  className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#7A7A76] mb-1.5">
                  Precio estimado
                </label>
                <input
                  defaultValue={editModalItem.price ?? ''}
                  className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-[6px] px-[11px] py-2 outline-none focus:border-[#0F3A33]"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-[18px]">
              <button
                onClick={() => setEditModalItem(null)}
                className="text-[13px] text-[#7A7A76] px-3.5 py-[7px] border border-[#E4DFD8] rounded-[6px] bg-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setEditModalItem(null); showToast('✓ Cambios guardados') }}
                className="text-[13px] font-medium text-white px-4 py-[7px] bg-[#0F3A33] rounded-[6px]"
              >
                Guardar
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

    </main>
  )
}
