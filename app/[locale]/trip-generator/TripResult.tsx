'use client'
// TripResult.tsx
// The full trip planner result layout
// Left: itinerary days (collapsible)
// Right: Estado del Viaje + Budget + Packing + Booking

import { useState, useEffect, useCallback } from 'react'
import Link from 'next-intl/link'

// ── Types ──────────────────────────────────────────────
type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer' | 'relax'

interface ItineraryItem {
  id:       string
  type:     ItemType
  time:     string
  name:     string
  desc:     string
  price?:   string
  affiliate?: string
}

interface Day {
  n:        number
  label:    string
  title:    string
  progress: number
  items:    ItineraryItem[]
}

interface CheckItem {
  id:    string
  icon:  string
  text:  string
  done:  boolean
  day?:  number
}

interface BudgetRow {
  id:       string
  label:    string
  amount:   number
  category: string
}

interface Props {
  params: Record<string, string>
}

// ── Type accent colors ─────────────────────────────────
const TYPE_COLOR: Record<ItemType, string> = {
  hotel:      '#1B4D3E',
  tour:       '#0891B2',
  restaurant: '#D97706',
  free:       '#C8C2B8',
  transfer:   '#7C3AED',
  relax:      '#059669',
}
const TYPE_LABEL: Record<ItemType, string> = {
  hotel:      'Hotel',
  tour:       'Tour',
  restaurant: 'Restaurante',
  free:       'Libre',
  transfer:   'Traslado',
  relax:      'Descanso',
}

// ── Loading skeleton ───────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#1B4D3E] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <p className="font-mono text-[11px] tracking-[2px] text-[#2D6B57] uppercase">
        Generando tu plan…
      </p>
      <p className="font-sans text-[13px] text-[#A0A0A0] max-w-[280px] text-center leading-relaxed">
        La IA está creando tu itinerario personalizado. Esto toma unos segundos.
      </p>
    </div>
  )
}

// ── Main result component ──────────────────────────────
export default function TripResult({ params }: Props) {
  const { destination, origin, start, end, nights, traveler, interests, pace, budget } = params

  const [loading,      setLoading]      = useState(true)
  const [days,         setDays]         = useState<Day[]>([])
  const [checks,       setChecks]       = useState<CheckItem[]>([])
  const [budgetRows,   setBudgetRows]   = useState<BudgetRow[]>([])
  const [packing,      setPacking]      = useState<string[]>([])
  const [collapsed,    setCollapsed]    = useState<Record<number, boolean>>({})
  const [budgetOpen,   setBudgetOpen]   = useState(false)
  const [packingOpen,  setPackingOpen]  = useState(false)
  const [bookingOpen,  setBookingOpen]  = useState(false)
  const [shareOpen,    setShareOpen]    = useState(false)
  const [tripTitle,    setTripTitle]    = useState('')
  const [tripSubtitle, setTripSubtitle] = useState('')

  // Generate trip via Edge Function (or local mock in dev)
  useEffect(() => {
    async function generate() {
      setLoading(true)
      try {
        // Call Supabase Edge Function
        const res = await fetch('/api/generate-trip', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination, origin, start, end, nights, traveler, interests, pace, budget }),
        })
        if (!res.ok) throw new Error('Generation failed')
        const data = await res.json()
        applyResult(data)
      } catch {
        // Fallback to mock data in dev / when API unavailable
        applyResult(getMockData(destination, nights))
      } finally {
        setLoading(false)
      }
    }
    generate()
  }, [destination])

  function applyResult(data: ReturnType<typeof getMockData>) {
    setTripTitle(data.title)
    setTripSubtitle(data.subtitle)
    setDays(data.days)
    setChecks(data.checks)
    setBudgetRows(data.budgetRows)
    setPacking(data.packing)
  }

  function toggleDay(n: number) {
    setCollapsed(p => ({ ...p, [n]: !p[n] }))
  }

  function toggleCheck(id: string) {
    setChecks(p => p.map(c => c.id === id ? { ...c, done: !c.done } : c))
  }

  const totalBudget  = budgetRows.reduce((s, r) => s + r.amount, 0)
  const doneChecks   = checks.filter(c => c.done).length
  const totalChecks  = checks.length
  const progress     = totalChecks ? Math.round((doneChecks / totalChecks) * 100) : 0

  const nightsNum = parseInt(nights) || 3
  const dateRange = start && end ? `${start} — ${end}` : `${nightsNum} noches`

  if (loading) {
    return (
      <main className="pt-[64px] min-h-screen bg-[#F4F0E8]">
        <div className="page-inner">
          <LoadingState />
        </div>
      </main>
    )
  }

  return (
    <main className="pt-[64px] min-h-screen bg-[#F4F0E8]">

      {/* ── Trip header ── */}
      <div className="bg-[#1B4D3E] py-8 max-[768px]:py-6">
        <div className="page-inner">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-[9px] tracking-[2px] text-[#6EBD9F] uppercase mb-2">
                {origin ? `${origin} → ${destination}` : destination}
              </p>
              <h1 className="font-playfair text-[32px] max-[768px]:text-[24px] font-bold text-[#F4F0E8] leading-[1.1] mb-1">
                {tripTitle}
              </h1>
              <p className="font-sans text-[14px] text-[#C8D9D3]">{tripSubtitle}</p>
              <div className="flex gap-3 mt-3 flex-wrap">
                {dateRange && (
                  <span className="font-mono text-[9px] tracking-[1px] bg-[rgba(255,255,255,.1)] text-[#C8D9D3] px-3 py-1.5 rounded-full">
                    {dateRange}
                  </span>
                )}
                {traveler && (
                  <span className="font-mono text-[9px] tracking-[1px] bg-[rgba(255,255,255,.1)] text-[#C8D9D3] px-3 py-1.5 rounded-full capitalize">
                    {traveler}
                  </span>
                )}
                {pace && (
                  <span className="font-mono text-[9px] tracking-[1px] bg-[rgba(255,255,255,.1)] text-[#C8D9D3] px-3 py-1.5 rounded-full capitalize">
                    Ritmo {pace}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setShareOpen(true)}
                className="font-mono text-[9px] tracking-[1.2px] uppercase bg-[rgba(255,255,255,.12)] text-[#F4F0E8] px-4 py-2.5 hover:bg-[rgba(255,255,255,.2)] transition-colors rounded-[2px] border border-[rgba(255,255,255,.15)]">
                Compartir
              </button>
              <Link href="/trip-generator"
                className="font-mono text-[9px] tracking-[1.2px] uppercase bg-[#F4F0E8] text-[#1B4D3E] px-4 py-2.5 hover:bg-[#C8D9D3] transition-colors rounded-[2px]">
                Nuevo plan
              </Link>
            </div>
          </div>

          {/* Global progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9px] tracking-[1px] text-[#6EBD9F] uppercase">Progreso del viaje</span>
              <span className="font-mono text-[9px] text-[#6EBD9F]">{doneChecks} / {totalChecks} listo</span>
            </div>
            <div className="h-1.5 bg-[rgba(255,255,255,.15)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6EBD9F] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout: left itinerary / right modules ── */}
      <div className="page-inner py-8">
        <div className="grid grid-cols-[1fr_340px] gap-6 items-start max-[1024px]:grid-cols-1">

          {/* ── LEFT: Itinerary days ── */}
          <div className="flex flex-col gap-3">
            {days.map(day => (
              <div key={day.n}
                className="bg-[#FDFCF9] rounded-[10px] overflow-hidden border border-[rgba(200,217,211,.5)]">

                {/* Day header — clickable to collapse */}
                <button
                  onClick={() => toggleDay(day.n)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#F4F0E8] transition-colors">
                  <div className="flex-shrink-0">
                    <p className="font-mono text-[9px] tracking-[1.5px] text-[#2D6B57] uppercase">
                      {day.label}
                    </p>
                    <p className="font-playfair text-[18px] text-[#0F1A16] font-normal leading-snug">
                      {day.title}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-3 flex-shrink-0">
                    <span className="font-mono text-[9px] text-[#6EBD9F] tracking-wide">
                      {day.progress}% listo
                    </span>
                    <div className="w-16 h-1 bg-[#E8E0D0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6EBD9F] rounded-full" style={{ width: `${day.progress}%` }} />
                    </div>
                    <svg
                      className={`w-4 h-4 text-[#C8D9D3] transition-transform ${collapsed[day.n] ? '-rotate-90' : ''}`}
                      viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>

                {/* Day items */}
                {!collapsed[day.n] && (
                  <div className="border-t border-[#E8E0D0]">
                    {day.items.map(item => (
                      <div key={item.id}
                        className="flex gap-4 px-5 py-4 border-b border-[#F0EDE6] last:border-0"
                        style={{ borderLeft: `3px solid ${TYPE_COLOR[item.type]}` }}>
                        <div className="flex-shrink-0 pt-0.5">
                          <p className="font-mono text-[10px] text-[#A0A0A0]">{item.time}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-mono text-[8px] tracking-[1px] uppercase px-2 py-[2px] rounded-full border flex-shrink-0"
                              style={{ color: TYPE_COLOR[item.type], borderColor: `${TYPE_COLOR[item.type]}40`, background: `${TYPE_COLOR[item.type]}10` }}>
                              {TYPE_LABEL[item.type]}
                            </span>
                            {item.price && (
                              <span className="font-mono text-[10px] text-[#2D6B57] ml-auto flex-shrink-0">
                                {item.price}
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-[14px] font-medium text-[#0F1A16] mb-1">{item.name}</p>
                          <p className="font-sans text-[13px] text-[#2D6B57] leading-[1.55]">{item.desc}</p>
                          {item.affiliate && (
                            <a href={item.affiliate} target="_blank" rel="noopener sponsored"
                              className="inline-flex items-center gap-1.5 mt-2 font-mono text-[9px] tracking-[1px] uppercase text-[#1B4D3E] border border-[rgba(27,77,62,.25)] px-3 py-1.5 rounded-full hover:bg-[#E8F0EE] transition-colors">
                              Ver disponibilidad →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── RIGHT: Modules ── */}
          <div className="flex flex-col gap-4 sticky top-[80px] max-[1024px]:static">

            {/* 01 — Estado del Viaje */}
            <div className="bg-[#FDFCF9] rounded-[10px] border border-[rgba(200,217,211,.5)] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E8E0D0]">
                <span className="font-mono text-[9px] text-[#6EBD9F] tracking-[2px]">01</span>
                <span className="font-sans text-[14px] font-medium text-[#0F1A16]">Estado del viaje</span>
              </div>
              <div className="px-5 py-4 flex flex-col gap-0">
                <p className="font-mono text-[8px] tracking-[1.5px] text-[#2D6B57] uppercase mb-2">
                  Antes del viaje
                </p>
                {checks.filter(c => !c.day).map(check => (
                  <CheckRow key={check.id} check={check} onToggle={toggleCheck} />
                ))}
                {Array.from(new Set(checks.filter(c => c.day).map(c => c.day!))).map(dayN => (
                  <div key={dayN} className="mt-3">
                    <p className="font-mono text-[8px] tracking-[1.5px] text-[#2D6B57] uppercase mb-1.5">
                      Día {String(dayN).padStart(2,'0')}
                    </p>
                    {checks.filter(c => c.day === dayN).map(check => (
                      <CheckRow key={check.id} check={check} onToggle={toggleCheck} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 02 — Presupuesto (collapsible) */}
            <div className="bg-[#FDFCF9] rounded-[10px] border border-[rgba(200,217,211,.5)] overflow-hidden">
              <button onClick={() => setBudgetOpen(o => !o)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F4F0E8] transition-colors">
                <span className="font-mono text-[9px] text-[#6EBD9F] tracking-[2px]">02</span>
                <span className="font-sans text-[14px] font-medium text-[#0F1A16] flex-1">Presupuesto</span>
                <span className="font-mono text-[11px] text-[#1B4D3E] font-medium">
                  ${totalBudget.toLocaleString()} MXN
                </span>
                <svg className={`w-4 h-4 text-[#C8D9D3] transition-transform ${budgetOpen ? '' : '-rotate-90'}`}
                  viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </button>
              {budgetOpen && (
                <div className="border-t border-[#E8E0D0] px-5 py-4">
                  {budgetRows.map(row => (
                    <div key={row.id} className="flex items-center justify-between py-2 border-b border-[#F0EDE6] last:border-0">
                      <span className="font-sans text-[13px] text-[#2D6B57]">{row.label}</span>
                      <span className="font-mono text-[11px] text-[#0F1A16]">
                        ${row.amount.toLocaleString()} MXN
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 mt-1">
                    <span className="font-mono text-[9px] tracking-[1px] text-[#2D6B57] uppercase">Total estimado</span>
                    <span className="font-mono text-[13px] font-medium text-[#1B4D3E]">
                      ${totalBudget.toLocaleString()} MXN
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 03 — Packing list (collapsible) */}
            <div className="bg-[#FDFCF9] rounded-[10px] border border-[rgba(200,217,211,.5)] overflow-hidden">
              <button onClick={() => setPackingOpen(o => !o)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F4F0E8] transition-colors">
                <span className="font-mono text-[9px] text-[#6EBD9F] tracking-[2px]">03</span>
                <span className="font-sans text-[14px] font-medium text-[#0F1A16] flex-1">Qué llevar</span>
                <span className="font-mono text-[9px] text-[#A0A0A0]">{packing.length} items</span>
                <svg className={`w-4 h-4 text-[#C8D9D3] transition-transform ${packingOpen ? '' : '-rotate-90'}`}
                  viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </button>
              {packingOpen && (
                <div className="border-t border-[#E8E0D0] px-5 py-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {packing.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8D9D3] flex-shrink-0" />
                        <span className="font-sans text-[13px] text-[#2D6B57]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 04 — Booking (Viator / GYG) */}
            <div className="bg-[#FDFCF9] rounded-[10px] border border-[rgba(200,217,211,.5)] overflow-hidden">
              <button onClick={() => setBookingOpen(o => !o)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F4F0E8] transition-colors">
                <span className="font-mono text-[9px] text-[#6EBD9F] tracking-[2px]">04</span>
                <span className="font-sans text-[14px] font-medium text-[#0F1A16] flex-1">Reservar</span>
                <span className="font-mono text-[9px] text-[#A0A0A0]">Hoteles &amp; tours</span>
                <svg className={`w-4 h-4 text-[#C8D9D3] transition-transform ${bookingOpen ? '' : '-rotate-90'}`}
                  viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </button>
              {bookingOpen && (
                <div className="border-t border-[#E8E0D0] px-5 py-4 flex flex-col gap-3">
                  {[
                    { id: 'viator',  label: 'Viator',         sub: 'Tours y experiencias', color: '#1B3A2D', bg: '#F7F3EE',
                      href: `https://www.viator.com/searchResults/all?text=${encodeURIComponent(destination)}&pid=P00165894` },
                    { id: 'gyg',     label: 'GetYourGuide',   sub: 'Actividades locales',   color: '#C04020', bg: '#FFF0E6',
                      href: `https://www.getyourguide.com/s/?q=${encodeURIComponent(destination)}&partner_id=YOUR_ID` },
                    { id: 'hotels',  label: 'Hoteles',        sub: 'Alojamiento curado',    color: '#004A96', bg: '#EBF4FF',
                      href: `/hoteles?destino=${encodeURIComponent(destination)}` },
                  ].map(p => (
                    <a key={p.id} href={p.href} target={p.id !== 'hotels' ? '_blank' : undefined}
                      rel={p.id !== 'hotels' ? 'noopener sponsored' : undefined}
                      className="flex items-center gap-3 p-3 rounded-[8px] border border-[rgba(200,217,211,.5)] hover:border-[#C8D9D3] transition-colors group">
                      <div className="w-9 h-9 rounded-[6px] flex items-center justify-center flex-shrink-0 font-mono text-[8px] font-medium"
                        style={{ background: p.bg, color: p.color }}>
                        {p.id === 'viator' ? 'V' : p.id === 'gyg' ? 'G' : 'H'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[13px] font-medium text-[#0F1A16]">{p.label}</p>
                        <p className="font-mono text-[9px] text-[#A0A0A0] tracking-wide">{p.sub}</p>
                      </div>
                      <svg className="w-3.5 h-3.5 text-[#C8D9D3] group-hover:text-[#1B4D3E] transition-colors"
                        viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 8h10M9 4l4 4-4 4"/>
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Explorer upsell — subtle, after value is delivered */}
            <div className="bg-[#1B4D3E] rounded-[10px] px-5 py-5">
              <p className="font-mono text-[8px] tracking-[2px] text-[#6EBD9F] uppercase mb-2">Explorer</p>
              <p className="font-playfair text-[16px] text-[#F4F0E8] mb-1 font-normal">
                <em>Guarda este plan.</em><br />Accede siempre.
              </p>
              <p className="font-sans text-[12px] text-[#C8D9D3] mb-4 leading-relaxed">
                Con Explorer guardas todos tus viajes, descargas el PDF y los compartes por WhatsApp.
              </p>
              <Link href="/precios"
                className="block text-center font-mono text-[9px] tracking-[1.2px] uppercase bg-[#F4F0E8] text-[#1B4D3E] px-4 py-2.5 hover:bg-[#C8D9D3] transition-colors rounded-[2px]">
                Ver Explorer — $199 MXN/mes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Share modal ── */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(15,26,22,.5)] backdrop-blur-sm"
          onClick={() => setShareOpen(false)}>
          <div className="bg-[#FDFCF9] rounded-[16px_16px_0_0] w-full max-w-[480px] p-6 pb-10"
            onClick={e => e.stopPropagation()}>
            <div className="w-8 h-1 bg-[#C8D9D3] rounded-full mx-auto mb-6" />
            <h3 className="font-playfair text-[22px] text-[#0F1A16] mb-1">Comparte tu plan</h3>
            <p className="font-sans text-[13px] text-[#2D6B57] mb-6">{tripTitle} · {dateRange}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); setShareOpen(false) }}
                className="w-full font-mono text-[10px] tracking-[1.2px] uppercase bg-[#1B4D3E] text-[#F4F0E8] py-3.5 rounded-[2px] hover:bg-[#2D6B57] transition-colors">
                Copiar link
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Mi plan para ${destination}: ${window?.location?.href || ''}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full font-mono text-[10px] tracking-[1.2px] uppercase bg-[#25D366] text-white py-3.5 rounded-[2px] hover:bg-[#1FB855] transition-colors text-center block">
                Compartir por WhatsApp
              </a>
              <p className="font-mono text-[9px] text-[#A0A0A0] text-center tracking-wide">
                PDF disponible con Explorer
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

// ── Check row component ────────────────────────────────
function CheckRow({ check, onToggle }: { check: CheckItem; onToggle: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[#F0EDE6] last:border-0">
      <button onClick={() => onToggle(check.id)}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
          ${check.done ? 'bg-[#1B4D3E] border-[#1B4D3E]' : 'bg-white border-[#C8D9D3] hover:border-[#1B4D3E]'}`}>
        {check.done && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4l3 3 5-6"/>
          </svg>
        )}
      </button>
      <span className="text-[11px]">{check.icon}</span>
      <span className={`font-sans text-[13px] flex-1 ${check.done ? 'line-through text-[#A0A0A0]' : 'text-[#0F1A16]'}`}>
        {check.text}
      </span>
      {check.done && (
        <span className="font-mono text-[8px] tracking-[1px] text-[#6EBD9F] uppercase">Listo</span>
      )}
    </div>
  )
}

// ── Mock data (used when Edge Function unavailable) ────
function getMockData(destination: string, nights: string) {
  const n = parseInt(nights) || 3
  return {
    title:    `${destination} · ${n} noches`,
    subtitle: 'Itinerario personalizado generado con IA',
    days: Array.from({ length: n }, (_, i) => ({
      n:        i + 1,
      label:    `Día ${String(i+1).padStart(2,'0')}`,
      title:    i === 0 ? 'Llegada y primer sabor' : i === n-1 ? 'Último día y partida' : `Explorando ${destination}`,
      progress: Math.floor(Math.random() * 60) + 20,
      items: [
        {
          id:        `d${i+1}-hotel`,
          type:      'hotel' as ItemType,
          time:      '15:00',
          name:      'Hotel recomendado',
          desc:      `Alojamiento curado para tu estancia en ${destination}. Check-in a las 3pm.`,
          price:     '$1,800 MXN',
          affiliate: `https://www.viator.com/searchResults/all?text=${encodeURIComponent(destination)}&pid=P00165894`,
        },
        {
          id:   `d${i+1}-resto`,
          type: 'restaurant' as ItemType,
          time: '20:00',
          name: 'Restaurante local',
          desc: 'La gastronomía local es parte esencial del destino. Reserva con anticipación.',
          price: '$450 MXN',
        },
        ...(i > 0 ? [{
          id:        `d${i+1}-tour`,
          type:      'tour' as ItemType,
          time:      '10:00',
          name:      `Tour por ${destination}`,
          desc:      'Experiencia guiada con expertos locales. Incluye transporte y material.',
          price:     '$680 MXN',
          affiliate: `https://www.viator.com/searchResults/all?text=${encodeURIComponent(destination)}&pid=P00165894`,
        }] : []),
      ],
    })),
    checks: [
      { id: 'vuelos',   icon: '✈️', text: 'Vuelos confirmados',     done: false },
      { id: 'traslado', icon: '🚗', text: 'Traslado aeropuerto',    done: false },
      { id: 'docs',     icon: '🪪', text: 'Documentos listos',      done: false },
      { id: 'hotel-r',  icon: '🏨', text: 'Hotel reservado',        done: false, day: 1 },
      { id: 'cena-r',   icon: '🍽', text: 'Cena reservada',         done: false, day: 1 },
      ...(n > 1 ? [{ id: 'tour-r', icon: '🎯', text: 'Tour reservado', done: false, day: 2 }] : []),
    ],
    budgetRows: [
      { id: 'vuelos',     label: 'Vuelos',        amount: 2800, category: 'transporte' },
      { id: 'hotel',      label: 'Alojamiento',   amount: 1800 * n, category: 'hospedaje' },
      { id: 'comida',     label: 'Comida',        amount: 500 * n,  category: 'alimentos' },
      { id: 'actividades',label: 'Actividades',   amount: 680 * (n - 1), category: 'entretenimiento' },
      { id: 'traslados',  label: 'Traslados',     amount: 400,  category: 'transporte' },
    ],
    packing: [
      'Pasaporte / INE', 'Ropa ligera', 'Bloqueador solar', 'Zapatos cómodos',
      'Adaptador de corriente', 'Cámara', 'Efectivo local', 'Seguro de viaje',
      'Medicamentos básicos', 'Cargador portátil',
    ],
  }
}
