'use client'

/**
 * components/guides/GuidePageClient.tsx
 *
 * Guide detail page — layout mirrors the AI Planner (TripResult.tsx).
 *
 * Structure:
 *   1. Hero       — kicker · title · excerpt · tags · "Convertir en viaje" CTA
 *   2. Info bar   — dark-pine strip with guide quick-info (duration, best time, type, budget)
 *   3. 2-col body — 1fr left content  +  310px sticky sidebar
 *      Left:   Itinerario (expandable day accordions) → Alojamientos → Experiencias → Logística
 *      Right:  Lagom Tips (first) → Convert-to-trip CTA → Packing list
 *
 * Design tokens match TripResult.tsx:
 *   bg #FAF8F5 · cards white / #E4DFD8 border · pine #0F3A33 · sage #6B8F86
 *   font-display (Fraunces) · font-mono (JetBrains Mono)
 */

import { useState } from 'react'
import Image        from 'next/image'
import { Link }     from '../../lib/navigation'
import type {
  Guide,
  Itinerary,
  Experience,
  Hotel,
  GuideSection as GuideSectionData,
} from '../../lib/guides'
import type { Locale } from '../../i18n'
import { GuideFreeIndicator } from './GuideFreeIndicator'

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer' | 'relax'

interface Props {
  guide:  Guide
  locale: Locale
}

// ─── Type detection ───────────────────────────────────────────────────────────

function detectType(text: string): ItemType {
  const t = text.toLowerCase()
  if (/hotel|hospeda|alojam|check.in|check.out|quédate|quedarse/.test(t))                                                      return 'hotel'
  if (/desayu|almuerz|cena |come |restauran|café|cafe |mercado|taquería|taqueria|breakfast|lunch|dinner|eat\s|food/.test(t))   return 'restaurant'
  if (/transfer|aeropuert|vuelo|traslad|llegas|llegada|salida|regres|bus |taxi |automóvil/.test(t))                            return 'transfer'
  if (/relax|descanso|spa |playa |tarde libre|noche libre|beach/.test(t))                                                      return 'relax'
  if (/tour|visita|excurs|clase de|cata |taller|activid|renta|parque|museo|sube|recorre|camina|mirador|cenote|ruinas/.test(t)) return 'tour'
  return 'free'
}

const TYPE_INFO: Record<ItemType, { icon: string; label_es: string; label_en: string }> = {
  hotel:      { icon: '🏨', label_es: 'Hospedaje', label_en: 'Hotel'     },
  tour:       { icon: '🌊', label_es: 'Actividad',  label_en: 'Activity'  },
  restaurant: { icon: '🍽', label_es: 'Comida',     label_en: 'Food'      },
  free:       { icon: '🚶', label_es: 'Libre',      label_en: 'Free time' },
  relax:      { icon: '💆', label_es: 'Relax',      label_en: 'Relax'     },
  transfer:   { icon: '🚗', label_es: 'Traslado',   label_en: 'Transfer'  },
}

const TYPE_BORDER: Record<ItemType, string> = {
  hotel: '#0F3A33', tour: '#0891B2', restaurant: '#D97706',
  free: '#CEC8C0', relax: '#6B8F86', transfer: '#2D4F6C',
}

const TYPE_ROW_BG: Record<ItemType, string> = {
  hotel:      'rgba(15,58,51,.04)',
  tour:       'rgba(8,145,178,.04)',
  restaurant: 'rgba(217,119,6,.05)',
  free:       'transparent',
  relax:      'rgba(107,143,134,.04)',
  transfer:   'rgba(45,79,108,.04)',
}

const TYPE_BADGE: Record<ItemType, { color: string; bg: string }> = {
  hotel:      { color: '#0F3A33', bg: 'rgba(15,58,51,.07)' },
  tour:       { color: '#0E7490', bg: '#ECFEFF'            },
  restaurant: { color: '#92400E', bg: '#FFFBEB'            },
  free:       { color: '#7A7A76', bg: '#EDE7E1'            },
  relax:      { color: '#065F46', bg: '#ECFDF5'            },
  transfer:   { color: '#2D4F6C', bg: '#EBF4FF'            },
}

const BOOKABLE = new Set<ItemType>(['hotel', 'tour', 'relax'])

// ─── Item parser ──────────────────────────────────────────────────────────────

/** Extract { time, title, desc } from guide itinerary item strings like "15:00: Activity — detail" */
function parseItineraryItem(text: string): { time: string; title: string; desc: string } {
  const timeMatch = text.match(/^(\d{1,2}:\d{2})[:\s]+(.+)$/)
  if (timeMatch) {
    const rest = timeMatch[2]
    const dash = rest.indexOf(' — ')
    if (dash > 0) return { time: timeMatch[1], title: rest.slice(0, dash).trim(), desc: rest.slice(dash + 3).trim() }
    return { time: timeMatch[1], title: rest.trim(), desc: '' }
  }
  // No time prefix — plain colon split
  const co = text.indexOf(': ')
  if (co > 0 && co < 40) return { time: '', title: text.slice(0, co).trim(), desc: text.slice(co + 2).trim() }
  return { time: '', title: text, desc: '' }
}

// ─── Booking URL ───────────────────────────────────────────────────────────────

function bookingUrl(type: ItemType, destination: string): string {
  const q = encodeURIComponent(destination)
  if (type === 'hotel') return `https://www.booking.com/search.html?ss=${q}`
  return `https://www.viator.com/search/tours?q=${q}&pid=P00165894&mcid=42383`
}

// ─── Packing derivation ────────────────────────────────────────────────────────

function derivePacking(guide: Guide, isES: boolean): string[] {
  const tags   = (isES ? guide.tags_es : guide.tags_en).map(t => t.toLowerCase())
  const type   = (isES ? guide.quick_info?.trip_type_es : guide.quick_info?.trip_type_en)?.toLowerCase() ?? ''
  const beach  = tags.some(t => /playa|beach|carib|mar/.test(t))
  const nature = tags.some(t => /naturaleza|nature|selva|jungle|sierr|montaña|mountain/.test(t))
  const family = tags.some(t => /famil/.test(t)) || /famil/.test(type)
  const city   = tags.some(t => /ciudad|city|urban/.test(t))
  const base   = isES
    ? ['Pasaporte / identificación', 'Adaptador de corriente', 'Botiquín de primeros auxilios', 'Efectivo local']
    : ['Passport / ID', 'Power adapter', 'First-aid kit', 'Local cash']
  const extra: string[] = []
  if (beach)  extra.push(...(isES
    ? ['Bloqueador solar SPF 50+', 'Traje de baño', 'Sandalias de agua', 'Antirrepelente']
    : ['Sunscreen SPF 50+', 'Swimsuit', 'Water sandals', 'Bug repellent']))
  if (nature) extra.push(...(isES
    ? ['Zapatos de trekking', 'Impermeable', 'Repelente de insectos', 'Botella de agua reutilizable']
    : ['Trekking shoes', 'Rain jacket', 'Insect repellent', 'Reusable water bottle']))
  if (family) extra.push(...(isES
    ? ['Protector solar para niños', 'Snacks de viaje', 'Entretenimiento offline']
    : ['Kids sunscreen', 'Travel snacks', 'Offline entertainment']))
  if (city && !beach && !nature) extra.push(...(isES
    ? ['Calzado cómodo para caminar', 'Bolsa cruzada antirrobo']
    : ['Comfortable walking shoes', 'Anti-theft crossbody bag']))
  return Array.from(new Set([...base, ...extra])).slice(0, 8)
}

// ─── Shared: Section header ───────────────────────────────────────────────────

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-[3px]">
        {eyebrow}
      </div>
      <h2
        className="font-display font-normal text-[#0F3A33] leading-[1.1] tracking-[-0.5px]"
        style={{ fontSize: 'clamp(18px, 2.2vw, 22px)' }}
      >
        {title}
      </h2>
    </div>
  )
}

// ─── Section: Itinerario ──────────────────────────────────────────────────────

function ItinerarioSection({
  itineraries, locale, destination,
}: {
  itineraries: Itinerary[]
  locale:      Locale
  destination: string
}) {
  const isES = locale === 'es'

  // First day open by default
  const [openDays, setOpenDays] = useState<Set<number>>(
    new Set(itineraries.length > 0 ? [itineraries[0].day] : [])
  )

  function toggleDay(day: number) {
    setOpenDays(prev => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }

  if (itineraries.length === 0) {
    return (
      <div className="bg-white border border-[#E4DFD8] rounded-[18px] p-8 text-center shadow-[0_1px_2px_rgba(15,58,51,.05)]">
        <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-2">
          {isES ? 'Planificación' : 'Planning'}
        </div>
        <h3 className="font-sans text-[18px] font-bold text-[#0F3A33] tracking-[-0.4px] mb-3">
          {isES
            ? `Genera tu itinerario para ${destination}`
            : `Generate your ${destination} itinerary`}
        </h3>
        <p className="font-sans text-[13px] text-[#7A7A76] leading-[1.7] mb-5 max-w-[380px] mx-auto">
          {isES
            ? 'Personaliza fechas, viajeros e intereses para obtener un plan a tu medida en minutos.'
            : 'Customize dates, travelers, and interests for a plan tailored to you in minutes.'}
        </p>
        <Link
          href={`/planner?destination=${encodeURIComponent(destination)}` as any}
          className="inline-block font-mono text-[10px] font-medium tracking-[.08em] uppercase text-white bg-[#0F3A33] px-5 py-3 rounded-[8px] hover:bg-[#1A5247] transition-colors"
        >
          {isES ? 'Generar mi plan →' : 'Generate my plan →'}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {itineraries.map((it) => {
        const dayTitle = isES ? it.title_es : it.title_en
        const items    = isES ? it.items_es : it.items_en
        const isOpen   = openDays.has(it.day)
        const label    = isES
          ? `Día ${String(it.day).padStart(2, '0')}`
          : `Day ${String(it.day).padStart(2, '0')}`

        return (
          <div
            key={it.day}
            className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)] hover:shadow-[0_2px_8px_rgba(15,58,51,.07)] transition-shadow"
          >
            {/* ── Day header ── */}
            <button
              type="button"
              onClick={() => toggleDay(it.day)}
              className="w-full text-left flex items-center justify-between px-[18px] py-3.5 transition-colors hover:bg-[rgba(237,231,225,.3)]"
              style={{ borderBottom: isOpen ? '1px solid #E4DFD8' : 'none' }}
              aria-expanded={isOpen}
            >
              <div>
                <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-[3px]">
                  {label}
                </div>
                <div className="font-display text-[15px] font-normal tracking-[-0.01em] text-[#1C1C1A]">
                  {dayTitle}
                </div>
              </div>
              <div
                className="w-5 h-5 rounded-[5px] bg-[#EDE7E1] flex items-center justify-center text-[9px] text-[#7A7A76] transition-transform duration-300 flex-shrink-0"
                style={{ transform: isOpen ? 'none' : 'rotate(-90deg)' }}
              >
                ▾
              </div>
            </button>

            {/* ── Day body ── */}
            <div
              style={{
                maxHeight:  isOpen ? '3000px' : '0',
                opacity:    isOpen ? 1 : 0,
                overflow:   'hidden',
                transition: 'max-height 0.45s ease, opacity 0.3s',
              }}
            >
              <div className="px-[18px] pb-1">
                {items.map((text, idx) => {
                  const parsed  = parseItineraryItem(text)
                  const type    = detectType(text)
                  const tinfo   = TYPE_INFO[type]
                  const tbadge  = TYPE_BADGE[type]
                  const tborder = TYPE_BORDER[type]
                  const trowbg  = TYPE_ROW_BG[type]
                  const bookable = BOOKABLE.has(type)

                  return (
                    <div
                      key={idx}
                      className="py-3.5 border-b border-[#E4DFD8] last:border-b-0 pl-2.5 -ml-2.5 border-l-[3px] hover:bg-[rgba(237,231,225,.3)] transition-colors"
                      style={{ borderLeftColor: tborder, background: trowbg }}
                    >
                      <div
                        className="grid gap-3 items-start"
                        style={{ gridTemplateColumns: bookable ? '28px 1fr auto' : '28px 1fr' }}
                      >
                        {/* Index */}
                        <div
                          className="font-mono text-[10px] pt-[14px]"
                          style={{ color: tbadge.color, opacity: 0.7 }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </div>

                        {/* Content */}
                        <div>
                          <div className="flex items-center gap-[5px] flex-wrap mb-1.5">
                            <span
                              className="font-mono text-[9px] font-medium tracking-[.08em] uppercase px-[6px] py-[2px] rounded-[3px]"
                              style={{ color: tbadge.color, background: tbadge.bg }}
                            >
                              {tinfo.icon} {isES ? tinfo.label_es : tinfo.label_en}
                            </span>
                            {parsed.time && (
                              <span className="font-mono text-[9px] text-[#0F3A33] border border-[rgba(15,58,51,.18)] px-[5px] py-px rounded-[3px]">
                                {parsed.time}
                              </span>
                            )}
                          </div>
                          <div className="text-[13px] font-medium text-[#1C1C1A] leading-[1.3] mb-[3px]">
                            {parsed.title}
                          </div>
                          {parsed.desc && (
                            <div className="text-[11.5px] font-light text-[#7A7A76] leading-[1.6]">
                              {parsed.desc}
                            </div>
                          )}
                        </div>

                        {/* Book button */}
                        {bookable && (
                          <div className="flex flex-col items-end shrink-0 pt-3">
                            <a
                              href={bookingUrl(type, destination)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[10px] font-medium tracking-[.06em] uppercase text-white bg-[#0F3A33] px-2.5 py-[5px] rounded-[4px] hover:bg-[#1A5247] hover:-translate-y-px transition-all whitespace-nowrap"
                            >
                              {isES ? 'Reservar' : 'Book'}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Section: Alojamientos ────────────────────────────────────────────────────

function AlojamientosSection({
  hotels, destination, locale,
}: {
  hotels:      Hotel[]
  destination: string
  locale:      Locale
}) {
  const isES = locale === 'es'
  const q    = encodeURIComponent(destination)

  if (hotels.length === 0) {
    const providers = [
      {
        name: 'Booking.com', badge: 'book\ning',
        desc: isES ? 'Cancelación gratis en la mayoría de propiedades.' : 'Free cancellation on most properties.',
        url: `https://www.booking.com/search.html?ss=${q}`, bg: '#F0F4FF', color: '#003580',
      },
      {
        name: 'Hotels.com', badge: 'hotels\n.com',
        desc: isES ? 'Mayor selección. Precio garantizado.' : 'Largest selection. Best price guarantee.',
        url: `https://www.hotels.com/search/properties?q=${q}`, bg: '#EBF4FF', color: '#004A96',
      },
    ]
    return (
      <div className="flex flex-wrap gap-3">
        {providers.map(p => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white border border-[#E4DFD8] rounded-[16px] px-4 py-4 hover:shadow-[0_2px_8px_rgba(15,58,51,.09)] hover:-translate-y-px transition-all group flex-1 min-w-[200px] max-w-[280px]"
          >
            <div
              className="w-10 h-10 rounded-[8px] flex items-center justify-center text-center flex-shrink-0 font-bold whitespace-pre-line leading-tight"
              style={{ background: p.bg, color: p.color, fontSize: '8px' }}
            >
              {p.badge}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-[13px] font-semibold text-[#0F3A33] mb-0.5">{p.name}</div>
              <div className="font-sans text-[11px] text-[#7A7A76] leading-[1.4]">{p.desc}</div>
            </div>
            <span className="text-[#B8B5AF] group-hover:text-[#0F3A33] transition-colors text-[12px] flex-shrink-0">→</span>
          </a>
        ))}
      </div>
    )
  }

  // Price labels — cycle through for visual variety
  const priceLabels = ['$$', '$', '$$$', '$$', '$']

  return (
    <div className="flex flex-col gap-4">
      {hotels.slice(0, 3).map((hotel, i) => {
        const name  = isES ? hotel.name_es        : hotel.name_en
        const desc  = isES ? hotel.description_es : hotel.description_en
        const url   = hotel.booking_url ?? `https://www.booking.com/search.html?ss=${encodeURIComponent(name)}`
        const price = priceLabels[i] ?? '$$'

        return (
          <div
            key={i}
            className="bg-white border border-[#E4DFD8] rounded-[18px] p-5 shadow-[0_1px_2px_rgba(15,58,51,.05)] hover:shadow-[0_2px_8px_rgba(15,58,51,.08)] transition-shadow"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[9px] font-medium tracking-[.1em] uppercase text-[#B8B5AF]">
                  {isES ? `Opción ${i + 1}` : `Option ${i + 1}`}
                </span>
                <span
                  className="font-mono text-[9px] font-medium tracking-[.06em] px-[6px] py-[2px] rounded-[3px]"
                  style={{ color: '#6B8F86', background: 'rgba(107,143,134,.12)' }}
                >
                  {price}
                </span>
              </div>
              {hotel.image && (
                <div className="w-14 h-14 rounded-[10px] overflow-hidden flex-shrink-0">
                  <Image src={hotel.image} alt={name} width={56} height={56} className="object-cover w-full h-full" />
                </div>
              )}
            </div>

            <h3 className="font-sans text-[15px] font-semibold text-[#0F3A33] mb-1.5 leading-[1.3]">
              {name}
            </h3>
            <p className="font-sans text-[12px] text-[#7A7A76] leading-[1.75] mb-4">
              {desc}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-[10px] font-medium tracking-[.06em] uppercase text-white bg-[#0F3A33] px-3 py-[6px] rounded-[6px] hover:bg-[#1A5247] transition-colors"
            >
              {isES ? 'Ver disponibilidad →' : 'Check availability →'}
            </a>
          </div>
        )
      })}
    </div>
  )
}

// ─── Section: Experiencias ────────────────────────────────────────────────────

function ExperienciasSection({
  experiences, destination, locale,
}: {
  experiences: Experience[]
  destination: string
  locale:      Locale
}) {
  const isES = locale === 'es'

  if (experiences.length === 0) {
    const url = `https://www.viator.com/search/tours?q=${encodeURIComponent(destination)}&pid=P00165894&mcid=42383`
    return (
      <div className="bg-white border border-[#E4DFD8] rounded-[18px] p-7 text-center shadow-[0_1px_2px_rgba(15,58,51,.05)]">
        <p className="font-sans text-[13px] text-[#7A7A76] mb-4">
          {isES ? `Descubre qué hacer en ${destination}` : `Discover things to do in ${destination}`}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-mono text-[10px] font-medium tracking-[.08em] uppercase text-white bg-[#0F3A33] px-5 py-3 rounded-[8px] hover:bg-[#1A5247] transition-colors"
        >
          {isES ? 'Ver en Viator →' : 'Browse on Viator →'}
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {experiences.map((exp, i) => {
        const title   = isES ? exp.title_es       : exp.title_en
        const desc    = isES ? exp.description_es : exp.description_en
        const badge   = isES ? exp.badge_es       : exp.badge_en
        const bookUrl = `https://www.viator.com/search/tours?q=${encodeURIComponent(title)}&pid=P00165894&mcid=42383`

        return (
          <div
            key={i}
            className="bg-white rounded-[16px] p-5 border border-[#E4DFD8] shadow-[0_1px_2px_rgba(15,58,51,.05)] flex flex-col hover:shadow-[0_2px_8px_rgba(15,58,51,.08)] transition-shadow"
          >
            <span
              className="inline-block font-mono text-[9px] font-medium tracking-[.1em] uppercase px-[6px] py-[3px] rounded-[4px] mb-3 self-start"
              style={{ background: 'rgba(107,143,134,.14)', color: '#6B8F86' }}
            >
              {badge}
            </span>
            <h3 className="font-sans text-[14px] font-semibold text-[#0F3A33] mb-2 leading-[1.3] flex-1">
              {title}
            </h3>
            <p className="font-sans text-[12px] leading-[1.75] text-[#7A7A76] mb-4">
              {desc}
            </p>
            <a
              href={bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] font-medium tracking-[.06em] uppercase text-white bg-[#0F3A33] px-3 py-[7px] rounded-[6px] hover:bg-[#1A5247] transition-colors text-center"
            >
              {isES ? 'Reservar →' : 'Book →'}
            </a>
          </div>
        )
      })}
    </div>
  )
}

// ─── Section: Logística ───────────────────────────────────────────────────────

function LogisticaSection({ sections, locale }: { sections: GuideSectionData[]; locale: Locale }) {
  const isES = locale === 'es'

  if (sections.length === 0) {
    return (
      <p className="font-sans text-[14px] text-[#7A7A76]">
        {isES ? 'Información logística próximamente.' : 'Logistics info coming soon.'}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((sec, i) => {
        const heading = isES ? sec.heading_es : sec.heading_en
        const body    = isES ? sec.body_es    : sec.body_en
        const tip     = isES ? sec.tip_es     : sec.tip_en

        return (
          <div
            key={i}
            className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)] hover:shadow-[0_2px_8px_rgba(15,58,51,.07)] transition-shadow"
          >
            <div className="px-6 pt-5 pb-4">
              <h3
                className="font-sans font-bold text-[#0F3A33] leading-[1.1] tracking-[-0.4px]"
                style={{ fontSize: 'clamp(15px, 1.8vw, 18px)' }}
              >
                {heading}
              </h3>
            </div>
            <div className="border-t border-[#E4DFD8]" />
            <div className="px-6 pt-4 pb-5 font-sans text-[14px] leading-[1.8] text-[#4A4A46]">
              <p>{body}</p>
            </div>
            {tip && (
              <div className="px-6 pb-5 -mt-1">
                <div
                  className="flex gap-3 px-4 py-3.5 rounded-[10px] border"
                  style={{ background: 'rgba(107,143,134,.08)', borderColor: 'rgba(107,143,134,.22)' }}
                >
                  <div
                    className="flex-shrink-0 w-[3px] rounded-full self-stretch"
                    style={{ background: '#6B8F86', minHeight: '36px' }}
                  />
                  <p className="font-sans text-[12.5px] text-[#0F3A33] leading-[1.75]">
                    <span className="mr-1.5">💡</span>{tip}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function GuideSidebar({
  guide, locale, destination,
}: {
  guide:       Guide
  locale:      Locale
  destination: string
}) {
  const isES      = locale === 'es'
  const tips      = (isES ? guide.tips_content_es : guide.tips_content_en) ?? []
  const packing   = derivePacking(guide, isES)
  const plannerUrl = `/planner?destination=${encodeURIComponent(destination)}`

  return (
    <aside className="flex flex-col gap-5">

      {/* ── 1. Lagom Tips — ALWAYS FIRST ─────────────────────────────────── */}
      {tips.length > 0 && (
        <div
          className="rounded-[18px] p-5 border"
          style={{ background: 'rgba(107,143,134,.08)', borderColor: 'rgba(107,143,134,.22)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[15px]">💡</span>
            <span className="font-mono text-[9px] font-semibold tracking-[.14em] uppercase text-[#6B8F86]">
              Lagom Tips
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="flex-shrink-0 w-[2px] rounded-full self-stretch"
                  style={{ background: '#6B8F86', minHeight: '32px' }}
                />
                <p className="font-sans text-[12px] text-[#0F3A33] leading-[1.7]">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. Convert to trip CTA ────────────────────────────────────────── */}
      <div
        className="rounded-[18px] p-5 border"
        style={{ background: '#0F3A33', borderColor: '#0F3A33' }}
      >
        <div className="font-mono text-[9px] font-medium tracking-[.14em] uppercase text-[rgba(255,255,255,.45)] mb-2">
          {isES ? 'IA · Lagomplan' : 'AI · Lagomplan'}
        </div>
        <p className="font-sans text-[15px] font-semibold text-white leading-[1.35] mb-1.5">
          {isES ? `¿Viajas a ${destination}?` : `Traveling to ${destination}?`}
        </p>
        <p className="font-sans text-[12px] text-[rgba(255,255,255,.6)] leading-[1.55] mb-4">
          {isES
            ? 'Convierte esta guía en un itinerario personalizado con IA en 60 segundos.'
            : 'Turn this guide into a personalized AI itinerary in 60 seconds.'}
        </p>
        <Link
          href={plannerUrl as any}
          className="block w-full font-mono text-[10px] font-semibold tracking-[.08em] uppercase text-[#0F3A33] bg-white px-4 py-3 rounded-[10px] hover:bg-[#F7F3EF] transition-colors text-center"
        >
          {isES ? 'Convertir en viaje →' : 'Plan my trip →'}
        </Link>
      </div>

      {/* ── 3. Packing list ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-[18px] p-5 border border-[#E4DFD8] shadow-[0_1px_2px_rgba(15,58,51,.05)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[15px]">🎒</span>
          <span className="font-mono text-[9px] font-semibold tracking-[.14em] uppercase text-[#0F3A33]">
            {isES ? 'Qué llevar' : 'What to pack'}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {packing.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{ background: '#6B8F86' }}
              />
              <span className="font-sans text-[12px] text-[#4A4A46] leading-[1.5]">{item}</span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GuidePageClient({ guide, locale }: Props) {
  const isES        = locale === 'es'
  const title       = isES ? guide.title_es       : guide.title_en
  const excerpt     = isES ? guide.excerpt_es     : guide.excerpt_en
  const destination = isES ? guide.destination_es : guide.destination_en
  const tags        = isES ? guide.tags_es        : guide.tags_en
  const itineraries = guide.itineraries ?? []
  const experiences = guide.experiences ?? []
  const hotels      = guide.hotels      ?? []
  const tips        = (isES ? guide.tips_content_es : guide.tips_content_en) ?? []
  const qi          = guide.quick_info

  const tripType  = isES ? qi?.trip_type_es : qi?.trip_type_en
  const kicker    = tripType
    ? `${isES ? 'Guía curada' : 'Curated guide'} · ${tripType}`
    : (isES ? 'Guía curada' : 'Curated guide')

  const plannerUrl = `/planner?destination=${encodeURIComponent(destination)}`

  const [saved, setSaved]   = useState(false)
  const [copied, setCopied] = useState(false)

  function handleShare() {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {})
    }
  }

  const itineraryDays = itineraries.length

  return (
    <main className="pt-[64px] min-h-screen pb-24" style={{ background: '#FAF8F5' }}>

      {/* Freemium transparency banner — anonymous users only */}
      <GuideFreeIndicator slug={isES ? guide.slug_es : guide.slug_en} />

      {/* Exposes the correct alternate-locale URL for the Nav language switcher.
          Guides have different slugs per locale, so the Nav reads this value
          instead of reusing the current slug in the target locale's URL space. */}
      <input
        type="hidden"
        id="__alternate_locale_url"
        value={isES ? `/en/guides/${guide.slug_en}` : `/es/guias/${guide.slug_es}`}
      />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#E4DFD8] pt-12 pb-9" style={{ background: '#FAF8F5' }}>
        <div className="max-w-[1160px] mx-auto px-7">
          <div className="grid grid-cols-[1fr_360px] gap-[52px] items-start max-[860px]:grid-cols-1">

            {/* Left — text */}
            <div>
              {/* Kicker */}
              <div className="font-mono text-[10px] tracking-[.16em] uppercase text-[#6B8F86] mb-4 flex items-center gap-2.5">
                <span className="w-[22px] h-px bg-[#6B8F86] shrink-0" />
                {kicker}
              </div>

              {/* Title */}
              <h1
                className="font-display font-normal leading-[1.06] tracking-[-0.03em] text-[#1C1C1A] mb-3.5"
                style={{ fontSize: 'clamp(34px, 4vw, 52px)' }}
              >
                {title}
              </h1>

              {/* Subtitle */}
              <p className="text-[14px] font-light leading-[1.75] text-[#7A7A76] max-w-[420px] mb-6">
                {excerpt}
              </p>

              {/* Tags as pills */}
              <div className="flex flex-wrap gap-1.5 mb-7">
                {tags.slice(0, 5).map(tag => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-[.04em] text-[#3D3D3A] px-2.5 py-1 bg-[#EDE7E1] border border-[#E4DFD8] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action row — matches TripResult style */}
              <div className="flex items-center pt-[18px] border-t border-[#E4DFD8]">
                <button
                  className={`flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] pr-[15px] transition-colors ${saved ? 'text-[#2D6B57] cursor-default' : 'text-[#7A7A76] hover:text-[#0F3A33]'}`}
                  onClick={() => setSaved(s => !s)}
                >
                  {saved ? <><span>★</span> {isES ? 'Guardada' : 'Saved'}</> : <><span>☆</span> {isES ? 'Guardar' : 'Save'}</>}
                </button>
                <span className="text-[#CEC8C0] pr-[15px] text-[10px]">·</span>
                <button
                  className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#7A7A76] pr-[15px] hover:text-[#0F3A33] transition-colors"
                  onClick={handleShare}
                >
                  <span>↗</span> {copied ? (isES ? '¡Copiado!' : 'Copied!') : (isES ? 'Compartir' : 'Share')}
                </button>
                <span className="text-[#CEC8C0] pr-[15px] text-[10px]">·</span>
                {/* Primary CTA — "Convert to trip" */}
                <Link
                  href={plannerUrl as any}
                  className="flex items-center gap-[6px] font-mono text-[10px] font-medium tracking-[.08em] uppercase text-white bg-[#0F3A33] px-3.5 py-2.5 rounded-[8px] hover:bg-[#1A5247] hover:-translate-y-px transition-all"
                >
                  <span>✦</span>
                  {isES ? 'Convertir en viaje' : 'Plan my trip'}
                </Link>
              </div>
            </div>

            {/* Right — cover image */}
            <div className="max-[860px]:order-first">
              <div
                className="relative w-full overflow-hidden rounded-[22px] border"
                style={{
                  aspectRatio: '4/3',
                  borderColor: 'rgba(200,191,181,0.5)',
                  boxShadow:   '0 2px 16px rgba(15,58,51,.09)',
                }}
              >
                <Image
                  src={guide.cover_img}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 860px) 100vw, 360px"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── INFO BAR (dark pine — mirrors TripResult control bar) ─────────── */}
      {qi && (
        <div className="bg-[#0F3A33]">
          <div className="max-w-[1160px] mx-auto px-7">
            <div className="flex items-center h-[50px] gap-0 overflow-x-auto scrollbar-none">
              {[
                { icon: '📅', value: isES ? qi.duration_es  : qi.duration_en  },
                { icon: '☀️', value: isES ? qi.best_time_es : qi.best_time_en },
                { icon: '🧭', value: isES ? qi.trip_type_es : qi.trip_type_en },
                { icon: '💰', value: isES ? qi.budget_es    : qi.budget_en    },
              ].map((item, i) => (
                <div key={i} className="flex items-center flex-shrink-0">
                  {i > 0 && <span className="w-px h-[18px] bg-white/10 mx-[18px]" />}
                  <div className="flex items-center gap-[7px]">
                    <span className="text-[14px] leading-none">{item.icon}</span>
                    <span className="font-mono text-[10px] font-medium tracking-[.04em] text-white/80 whitespace-nowrap">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN GRID ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1160px] mx-auto px-7 pt-9 pb-20">
        <div className="grid grid-cols-[1fr_310px] gap-8 items-start max-[900px]:grid-cols-1">

          {/* ── LEFT: Stacked content sections ───────────────────────────── */}
          <div className="flex flex-col gap-10">

            {/* 1. Itinerario */}
            <div id="itinerario">
              <SectionHeader
                eyebrow={isES ? 'Itinerario' : 'Itinerary'}
                title={
                  itineraryDays > 0
                    ? (isES ? `${itineraryDays} días en ${destination}` : `${itineraryDays} days in ${destination}`)
                    : (isES ? `Tu plan en ${destination}` : `Your plan in ${destination}`)
                }
              />
              <ItinerarioSection
                itineraries={itineraries}
                locale={locale}
                destination={destination}
              />
            </div>

            {/* 2. Alojamientos */}
            <div id="hoteles" className="border-t border-[#E4DFD8] pt-8">
              <SectionHeader
                eyebrow={isES ? 'Dónde quedarse' : 'Where to stay'}
                title={isES ? `Alojamientos ideales en ${destination}` : `Best stays in ${destination}`}
              />
              <AlojamientosSection
                hotels={hotels}
                destination={destination}
                locale={locale}
              />
            </div>

            {/* 3. Experiencias */}
            <div id="experiencias" className="border-t border-[#E4DFD8] pt-8">
              <SectionHeader
                eyebrow={isES ? 'Qué hacer' : 'Things to do'}
                title={isES ? `Experiencias en ${destination}` : `Experiences in ${destination}`}
              />
              <ExperienciasSection
                experiences={experiences}
                destination={destination}
                locale={locale}
              />
            </div>

            {/* 4. Logística */}
            <div id="logistica" className="border-t border-[#E4DFD8] pt-8">
              <SectionHeader
                eyebrow={isES ? 'Planificación' : 'Getting there'}
                title={isES ? 'Cómo llegar y moverse' : 'Getting around'}
              />
              <LogisticaSection sections={guide.sections} locale={locale} />
            </div>

            {/* 5. Tips — mobile only (sidebar shows on desktop) */}
            {tips.length > 0 && (
              <div id="tips" className="border-t border-[#E4DFD8] pt-8 lg:hidden">
                <SectionHeader
                  eyebrow={isES ? 'Consejos' : 'Tips'}
                  title={isES ? `Lagom Tips para ${destination}` : `Lagom Tips for ${destination}`}
                />
                <div
                  className="rounded-[18px] p-5 border"
                  style={{ background: 'rgba(107,143,134,.08)', borderColor: 'rgba(107,143,134,.22)' }}
                >
                  <div className="flex flex-col gap-4">
                    {tips.map((tip, i) => (
                      <div key={i} className="flex gap-3">
                        <div
                          className="flex-shrink-0 w-[2px] rounded-full self-stretch"
                          style={{ background: '#6B8F86', minHeight: '32px' }}
                        />
                        <p className="font-sans text-[12px] text-[#0F3A33] leading-[1.7]">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile-only: Convert to trip CTA */}
            <div className="lg:hidden border-t border-[#E4DFD8] pt-8">
              <div
                className="rounded-[18px] p-6 border"
                style={{ background: '#0F3A33', borderColor: '#0F3A33' }}
              >
                <p className="font-sans text-[15px] font-semibold text-white leading-[1.35] mb-2">
                  {isES ? `¿Viajas a ${destination}?` : `Traveling to ${destination}?`}
                </p>
                <p className="font-sans text-[12px] text-[rgba(255,255,255,.6)] leading-[1.55] mb-4">
                  {isES
                    ? 'Convierte esta guía en un itinerario personalizado con IA.'
                    : 'Turn this guide into a personalized AI itinerary.'}
                </p>
                <Link
                  href={plannerUrl as any}
                  className="block w-full font-mono text-[10px] font-semibold tracking-[.08em] uppercase text-[#0F3A33] bg-white px-4 py-3 rounded-[10px] hover:bg-[#F7F3EF] transition-colors text-center"
                >
                  {isES ? 'Convertir en viaje →' : 'Plan my trip →'}
                </Link>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Sticky sidebar (desktop only) ─────────────────────── */}
          <div
            className="hidden lg:block flex-shrink-0 sticky"
            style={{ top: 'calc(64px + 32px)' }}
          >
            <GuideSidebar
              guide={guide}
              locale={locale}
              destination={destination}
            />
          </div>

        </div>
      </div>

    </main>
  )
}
