'use client'
// components/DateRangePicker.tsx — sin dependencias externas
// FIX: el DOM del calendario se construye UNA SOLA VEZ por cambio de mes.
// Hover y click solo actualizan clases CSS en las celdas existentes.
// Esto elimina el bug donde drRender() en mouseover destruía los event
// listeners antes de que el click pudiera completarse.

import { useState, useEffect, useRef, useCallback } from 'react'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
                'Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS   = ['Lu','Ma','Mi','Ju','Vi','Sá','Do']

function startOfDay(d: Date) {
  const c = new Date(d); c.setHours(0,0,0,0); return c
}
function sameDay(a: Date | null, b: Date | null) {
  return !!a && !!b && a.getTime() === b.getTime()
}
function nightsBetween(a: Date, b: Date) {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / 86_400_000)
}
function fmtDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}. ${d.getFullYear()}`
}

export interface DateRange {
  start:  Date | null
  end:    Date | null
  nights: number
}

interface Props {
  value:    DateRange
  onChange: (r: DateRange) => void
  minDate?: Date
}

// ── Single month grid ────────────────────────────────────────────
// Renders cells and returns them with date metadata.
// Callers update classes without rebuilding.

interface Cell {
  date:    Date
  el:      HTMLDivElement
  isEmpty: boolean
  isPast:  boolean
}

function buildMonthGrid(
  container: HTMLDivElement,
  year: number,
  month: number,
  minDate: Date
): Cell[] {
  const firstDay    = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today       = startOfDay(new Date())

  container.innerHTML = ''

  // Day-of-week header
  const header = document.createElement('div')
  header.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:4px;'
  DAYS.forEach(d => {
    const s = document.createElement('span')
    s.textContent = d
    s.style.cssText = 'font-family:"DM Mono",monospace;font-size:9px;letter-spacing:1px;color:#A0A0A0;text-align:center;padding:3px 0;text-transform:uppercase;display:block;'
    header.appendChild(s)
  })
  container.appendChild(header)

  // Days grid
  const grid = document.createElement('div')
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);gap:1px;'
  container.appendChild(grid)

  const cells: Cell[] = []

  // Empty leading cells
  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement('div')
    el.style.cssText = 'height:30px;'
    grid.appendChild(el)
    cells.push({ date: new Date(0), el, isEmpty: true, isPast: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = startOfDay(new Date(year, month, d))
    const isPast = date < minDate
    const isToday = sameDay(date, today)

    const el = document.createElement('div')
    el.dataset.ts = String(date.getTime())
    el.style.cssText = [
      'height:30px;display:flex;align-items:center;justify-content:center;',
      'font-family:"DM Mono",monospace;font-size:11px;border-radius:2px;',
      'position:relative;user-select:none;transition:background .08s,color .08s;',
      isPast ? 'color:#D0CBC2;cursor:default;' : 'color:#0F1A16;cursor:pointer;',
    ].join('')
    el.textContent = String(d)
    if (isToday && !isPast) el.style.outline = '1px solid #C8D9D3'

    grid.appendChild(el)
    cells.push({ date, el, isEmpty: false, isPast })
  }

  return cells
}

// ── Apply visual classes to all cells based on current state ─────
function applyClasses(
  cells: Cell[],
  start:   Date | null,
  end:     Date | null,
  hover:   Date | null,
  phase:   'start' | 'end'
) {
  const rangeEnd = end ?? (hover && phase === 'end' ? hover : null)
  const lo = start && rangeEnd ? (start < rangeEnd ? start : rangeEnd) : null
  const hi = start && rangeEnd ? (start < rangeEnd ? rangeEnd : start)  : null

  cells.forEach(({ date, el, isEmpty, isPast }) => {
    if (isEmpty || isPast) return

    const isS   = sameDay(date, start)
    const isE   = sameDay(date, end)
    const inRng = lo && hi && date > lo && date < hi

    // Reset to base
    el.style.background = ''
    el.style.color       = isPast ? '#D0CBC2' : '#0F1A16'
    el.style.fontWeight  = ''
    el.style.borderRadius = '2px'
    el.style.zIndex      = ''
    // Remove pseudo-element overrides
    el.classList.remove('dc-s','dc-e','dc-ir','dc-hv')

    // Hover feedback on regular days
    if (!isS && !isE) {
      el.onmouseenter = () => { if (!isPast) el.style.background = '#E8F0EE'; el.style.color = '#1B4D3E' }
      el.onmouseleave = () => { if (!inRng) { el.style.background = ''; el.style.color = '#0F1A16' } }
    } else {
      el.onmouseenter = null
      el.onmouseleave = null
    }

    if (isS || isE) {
      el.style.background  = '#1B4D3E'
      el.style.color       = '#F4F0E8'
      el.style.fontWeight  = '500'
      el.style.borderRadius = '2px'
      el.style.zIndex      = '1'
    } else if (inRng) {
      el.style.background  = '#E8F0EE'
      el.style.color       = '#1B4D3E'
      el.style.borderRadius = '0'
    }

    // Half-cell connectors via box-shadow trick (no pseudo-elements in inline JS)
    // We use a thin right/left bg extension via outline instead
  })
}

// ── Main component ───────────────────────────────────────────────
export default function DateRangePicker({ value, onChange, minDate }: Props) {
  const min     = startOfDay(minDate ?? new Date())
  const now     = new Date()

  const [vy, setVy] = useState(now.getFullYear())
  const [vm, setVm] = useState(now.getMonth())
  const [hover,  setHover]  = useState<Date | null>(null)
  const [phase,  setPhase]  = useState<'start' | 'end'>('start')
  const [open,   setOpen]   = useState(false)

  const popupRef = useRef<HTMLDivElement>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)
  const cal0Ref  = useRef<HTMLDivElement>(null)
  const cal1Ref  = useRef<HTMLDivElement>(null)
  const cells0Ref = useRef<Cell[]>([])
  const cells1Ref = useRef<Cell[]>([])

  // Always-current snapshot so click/hover handlers never read stale closures
  const latestRef = useRef({ value, phase })
  useEffect(() => { latestRef.current = { value, phase } })

  // Second month
  const vm2 = vm + 1 > 11 ? 0  : vm + 1
  const vy2 = vm + 1 > 11 ? vy + 1 : vy

  // Build DOM grids when month view changes or calendar opens
  useEffect(() => {
    if (!open) return
    if (!cal0Ref.current || !cal1Ref.current) return

    cells0Ref.current = buildMonthGrid(cal0Ref.current, vy, vm, min)
    cells1Ref.current = buildMonthGrid(cal1Ref.current, vy2, vm2, min)

    const allCells = [...cells0Ref.current, ...cells1Ref.current]

    // Attach click + hover listeners ONCE after build
    allCells.forEach(cell => {
      if (cell.isEmpty || cell.isPast) return

      cell.el.addEventListener('click', () => {
        const { value: lv, phase: lp } = latestRef.current
        setHover(null)
        if (lp === 'start' || (lv.start && cell.date <= lv.start)) {
          onChange({ start: cell.date, end: null, nights: 0 })
          setPhase('end')
        } else {
          const nights = lv.start ? nightsBetween(lv.start, cell.date) : 0
          onChange({ start: lv.start, end: cell.date, nights })
          setPhase('start')
        }
      })

      cell.el.addEventListener('mouseenter', () => {
        const { value: lv, phase: lp } = latestRef.current
        if (lp === 'end' && lv.start) setHover(cell.date)
      })
      cell.el.addEventListener('mouseleave', () => setHover(null))
    })

    // Apply initial classes
    applyClasses(allCells, value.start, value.end, hover, phase)
  }, [open, vy, vm]) // rebuild only when month changes or opens

  // Update classes whenever state changes (no DOM rebuild)
  useEffect(() => {
    const allCells = [...cells0Ref.current, ...cells1Ref.current]
    if (allCells.length > 0) {
      applyClasses(allCells, value.start, value.end, hover, phase)
    }
  }, [value.start, value.end, hover, phase])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function navMonth(dir: number) {
    const nm = vm + dir
    if (nm > 11) { setVm(0);  setVy(y => y + 1) }
    else if (nm < 0) { setVm(11); setVy(y => y - 1) }
    else setVm(nm)
  }

  function clearDates() {
    onChange({ start: null, end: null, nights: 0 })
    setPhase('start')
    setHover(null)
  }

  const hint = !value.start
    ? 'Selecciona la fecha de salida'
    : !value.end
      ? 'Ahora elige la fecha de regreso'
      : `${value.nights} ${value.nights === 1 ? 'noche seleccionada' : 'noches seleccionadas'}`

  const triggerCls = [
    'w-full flex items-center gap-2 text-left font-sans text-[13px]',
    'border bg-white px-3 py-2 rounded-[2px] transition-all',
    open || (value.start && value.end)
      ? 'border-[#1B4D3E] shadow-[0_0_0_3px_rgba(27,77,62,.06)]'
      : 'border-[#C8D9D3] hover:border-[#1B4D3E]',
  ].join(' ')

  return (
    <div ref={wrapRef} className="relative">

      {/* Trigger */}
      <button type="button" className={triggerCls} onClick={() => setOpen(o => !o)}>
        {value.start && value.end ? (
          <>
            <span className="flex-1 text-[#0F1A16]">
              {fmtDate(value.start)} — {fmtDate(value.end)}
            </span>
            <span className="font-mono text-[9px] text-[#2D6B57] bg-[#E8F0EE] border border-[rgba(27,77,62,.2)] px-2 py-0.5 rounded-full whitespace-nowrap">
              {value.nights} {value.nights === 1 ? 'noche' : 'noches'}
            </span>
          </>
        ) : (
          <span className="flex-1 text-[#BDBDBD]">Selecciona tus fechas</span>
        )}
        <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${open ? 'text-[#1B4D3E]' : 'text-[#C8D9D3]'}`} viewBox="0 0 16 16" fill="currentColor">
          <path d="M5 1a1 1 0 00-1 1v1H3a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-1V2a1 1 0 00-2 0v1H6V2a1 1 0 00-1-1zM2 7h12v7H2V7z"/>
        </svg>
      </button>

      {/* Popup */}
      {open && (
        <div
          ref={popupRef}
          onClick={e => e.stopPropagation()}
          className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 bg-[#FDFCF9] border border-[#C8D9D3] rounded-[3px] shadow-[0_8px_28px_rgba(27,77,62,.14)] z-50 w-[560px] max-md:w-full max-md:left-0 max-md:translate-x-0"
        >
          {/* Nav */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8E0D0]">
            <button type="button" onClick={() => navMonth(-1)}
              className="w-7 h-7 border border-[#C8D9D3] bg-white rounded-[2px] flex items-center justify-center text-[14px] text-[#2D6B57] hover:border-[#1B4D3E] hover:text-[#1B4D3E] transition-colors"
            >‹</button>
            <div className="flex gap-6">
              <span className="font-sans text-[14px] font-semibold text-[#0F1A16]">{MONTHS[vm]} {vy}</span>
              <span className="font-sans text-[14px] font-semibold text-[#0F1A16] max-md:hidden">{MONTHS[vm2]} {vy2}</span>
            </div>
            <button type="button" onClick={() => navMonth(1)}
              className="w-7 h-7 border border-[#C8D9D3] bg-white rounded-[2px] flex items-center justify-center text-[14px] text-[#2D6B57] hover:border-[#1B4D3E] hover:text-[#1B4D3E] transition-colors"
            >›</button>
          </div>

          {/* Two months — DOM containers, grids built imperatively */}
          <div className="flex max-md:flex-col divide-x divide-[#E8E0D0]">
            <div ref={cal0Ref} className="flex-1 p-4" />
            <div ref={cal1Ref} className="flex-1 p-4 max-md:hidden" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#E8E0D0]">
            <span className="font-mono text-[9px] text-[#A0A0A0] tracking-[.3px]">{hint}</span>
            <div className="flex gap-2">
              <button type="button" onClick={clearDates}
                className="font-mono text-[9px] tracking-[1px] text-[#2D6B57] border border-[#C8D9D3] px-3 py-1.5 rounded-[2px] hover:border-[#1B4D3E] transition-colors"
              >Borrar</button>
              <button type="button" onClick={() => setOpen(false)}
                className="font-mono text-[9px] tracking-[1px] text-[#F4F0E8] bg-[#1B4D3E] px-4 py-1.5 rounded-[2px] hover:bg-[#2D6B57] transition-colors"
              >Confirmar →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
