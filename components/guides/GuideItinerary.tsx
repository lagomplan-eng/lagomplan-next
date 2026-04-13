'use client'

/**
 * components/guides/GuideItinerary.tsx
 *
 * Day-by-day itinerary with collapsible accordion days.
 * First day is expanded by default. Item types are auto-detected.
 */

import { useState } from 'react'
import type { Itinerary } from '../../lib/guides'
import type { Locale }    from '../../i18n'

// ── Types ─────────────────────────────────────────────────────────────────────

type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer' | 'relax'

// ── Type detection ────────────────────────────────────────────────────────────

function detectType(text: string): ItemType {
  const t = text.toLowerCase()
  if (/hotel|hospeda|alojam|check.in|check.out|quédate|quedarse/.test(t))                                                                 return 'hotel'
  if (/desayu|almuerz|cena |come |restauran|café|cafe |mercado|taquería|taqueria|breakfast|lunch|dinner|eat\s|food/.test(t))              return 'restaurant'
  if (/transfer|aeropuert|vuelo|traslad|llegas|llegada|salida|regres|bus |taxi |automóvil/.test(t))                                       return 'transfer'
  if (/relax|descanso|spa |playa |tarde libre|noche libre|beach/.test(t))                                                                  return 'relax'
  if (/tour|visita|excurs|clase de|cata |taller|activid|renta|parque|museo|sube|recorre|camina|mirador|cenote|ruinas/.test(t))             return 'tour'
  return 'free'
}

// ── Text parsing ──────────────────────────────────────────────────────────────

function parseItem(text: string): { title: string; desc: string } {
  const em = text.indexOf(' — ')
  if (em > 0) return { title: text.slice(0, em).trim(), desc: text.slice(em + 3).trim() }
  const co = text.indexOf(': ')
  if (co > 0 && co < 42) return { title: text.slice(0, co).trim(), desc: text.slice(co + 2).trim() }
  return { title: text, desc: '' }
}

// ── Display maps ──────────────────────────────────────────────────────────────

const TYPE_INFO: Record<ItemType, { icon: string; label_es: string; label_en: string }> = {
  hotel:      { icon: '🏨', label_es: 'Hospedaje', label_en: 'Hotel'     },
  tour:       { icon: '🌊', label_es: 'Actividad', label_en: 'Activity'  },
  restaurant: { icon: '🍽', label_es: 'Comida',    label_en: 'Food'      },
  free:       { icon: '🚶', label_es: 'Libre',     label_en: 'Free time' },
  relax:      { icon: '💆', label_es: 'Relax',     label_en: 'Relax'     },
  transfer:   { icon: '🚗', label_es: 'Traslado',  label_en: 'Transfer'  },
}

const TYPE_BORDER: Record<ItemType, string> = {
  hotel:      '#0F3A33',
  tour:       '#0891B2',
  restaurant: '#D97706',
  free:       '#CEC8C0',
  relax:      '#6B8F86',
  transfer:   '#2D4F6C',
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

function bookingUrl(type: ItemType, destination: string): string {
  const q = encodeURIComponent(destination)
  if (type === 'hotel') return `https://www.booking.com/search.html?ss=${q}`
  return `https://www.viator.com/search/tours?q=${q}&pid=P00165894&mcid=42383`
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  itineraries: Itinerary[]
  locale:      Locale
  destination: string
}

export function GuideItinerary({ itineraries, locale, destination }: Props) {
  const isES = locale === 'es'
  // First day open by default
  const [openDays, setOpenDays] = useState<Set<number>>(
    new Set(itineraries.length > 0 ? [itineraries[0].day] : [])
  )

  function toggleDay(day: number) {
    setOpenDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  return (
    <section id="itinerario" className="py-12 max-[768px]:py-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-[900px] mx-auto px-7">

        {/* Section header */}
        <div className="mb-6">
          <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-1">
            {isES ? 'Tu itinerario' : 'Your itinerary'}
          </div>
          <h2
            className="font-sans font-bold text-[#0F3A33] leading-[1.1] tracking-[-0.5px]"
            style={{ fontSize: 'clamp(20px, 2.8vw, 26px)' }}
          >
            {itineraries.length}{' '}
            {isES
              ? `día${itineraries.length !== 1 ? 's' : ''} en`
              : `day${itineraries.length !== 1 ? 's' : ''} in`}{' '}
            {destination}
          </h2>
        </div>

        {/* Day cards */}
        <div className="flex flex-col gap-3.5">
          {itineraries.map((it) => {
            const dayTitle = isES ? it.title_es : it.title_en
            const items    = isES ? it.items_es : it.items_en
            const isOpen   = openDays.has(it.day)
            const dayLabel = isES
              ? `Día ${String(it.day).padStart(2, '0')}`
              : `Day ${String(it.day).padStart(2, '0')}`

            return (
              <div
                key={it.day}
                className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)] hover:shadow-[0_2px_8px_rgba(15,58,51,.07)] transition-shadow"
              >
                {/* Day header — click to toggle */}
                <button
                  type="button"
                  onClick={() => toggleDay(it.day)}
                  className="w-full text-left px-[18px] py-3.5 border-b border-[#E4DFD8] flex items-center justify-between gap-3 transition-colors hover:bg-[rgba(237,231,225,.3)]"
                  style={{ borderBottomColor: isOpen ? '#E4DFD8' : 'transparent' }}
                  aria-expanded={isOpen}
                >
                  <div>
                    <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-[3px]">
                      {dayLabel}
                    </div>
                    <div className="font-sans text-[15px] font-semibold tracking-[-0.01em] text-[#1C1C1A]">
                      {dayTitle}
                    </div>
                  </div>
                  {/* Chevron */}
                  <span
                    className="text-[#B8B5AF] transition-transform duration-200 flex-shrink-0 text-[12px]"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ▾
                  </span>
                </button>

                {/* Items — shown when open */}
                {isOpen && (
                  <div className="px-[18px] pb-1">
                    {items.map((text, idx) => {
                      const type     = detectType(text)
                      const parsed   = parseItem(text)
                      const tinfo    = TYPE_INFO[type]
                      const tbadge   = TYPE_BADGE[type]
                      const tborder  = TYPE_BORDER[type]
                      const trowbg   = TYPE_ROW_BG[type]
                      const bookable = BOOKABLE.has(type)

                      return (
                        <div
                          key={idx}
                          className="py-3.5 border-b border-[#E4DFD8] last:border-b-0 pl-2.5 -ml-2.5 border-l-[3px] hover:bg-[rgba(237,231,225,.3)] transition-colors"
                          style={{ borderLeftColor: tborder, background: trowbg }}
                        >
                          <div
                            className="grid gap-3 items-start"
                            style={{ gridTemplateColumns: bookable ? '24px 1fr auto' : '24px 1fr' }}
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

                            {/* Book CTA */}
                            {bookable && (
                              <div className="flex flex-col items-end shrink-0 pt-[10px]">
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
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
