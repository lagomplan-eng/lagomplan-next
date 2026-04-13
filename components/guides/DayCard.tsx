'use client'

/**
 * components/guides/DayCard.tsx
 *
 * Single expandable day card inside the Itinerary section.
 * Manages its own open/closed state; parent can seed initial value via `defaultOpen`.
 */

import { useState } from 'react'
import type { ItineraryDay } from '../../lib/data/guides/types'

interface Props {
  day: ItineraryDay
  dayOrdinalLabel: string  // e.g. "Día 01" / "Day 01"
  defaultOpen?: boolean
}

export function DayCard({ day, dayOrdinalLabel, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white border border-[#E2DDD5] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,58,51,.06),0_1px_2px_rgba(0,0,0,.04)] hover:shadow-[0_4px_16px_rgba(15,58,51,.08),0_1px_3px_rgba(0,0,0,.05)] transition-shadow">

      {/* ── Header ── */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="w-full text-left flex items-center justify-between px-6 py-5 pb-[18px] border-b border-[#E2DDD5] cursor-pointer select-none transition-colors hover:bg-[rgba(15,58,51,.02)]"
        style={{ borderBottomWidth: isOpen ? 1 : 0 }}
      >
        <div>
          <div className="font-mono text-[10px] font-medium tracking-[.12em] uppercase text-[#8A8A8A] mb-1">
            {dayOrdinalLabel} · {day.dayLabel}
          </div>
          <div className="font-display text-[18px] font-normal tracking-[-0.01em] text-[#1A1A1A]">
            {day.title}
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <span className="font-mono text-[10px] font-medium text-[#6B8F86] bg-[rgba(107,143,134,.1)] px-2 py-[3px] rounded-full tracking-[.04em]">
            {day.items.length} {day.items.length === 1 ? 'momento' : 'momentos'}
          </span>
          <div
            className="w-6 h-6 rounded-md bg-[#EDE7E1] flex items-center justify-center text-[11px] text-[#8A8A8A] transition-transform duration-300"
            style={{ transform: isOpen ? 'none' : 'rotate(-90deg)' }}
            aria-hidden="true"
          >
            ▾
          </div>
        </div>
      </button>

      {/* ── Body ── */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-400"
        style={{
          maxHeight: isOpen ? '2000px' : '0',
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.4s ease, opacity 0.3s',
        }}
      >
        <div className="px-6 pb-2">
          {day.items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[48px_1fr] gap-4 items-start py-[18px] border-b border-[#E2DDD5] last:border-0"
            >
              {/* Time */}
              <div className="font-mono text-[11px] font-medium text-[#0F3A33] tracking-[.02em] pt-0.5 whitespace-nowrap">
                {item.time}
              </div>
              {/* Content */}
              <div>
                <div className="text-[14px] font-medium text-[#1A1A1A] mb-1 leading-[1.4]">
                  {item.title}
                </div>
                <div className="text-[12.5px] font-light text-[#4A4A4A] leading-[1.6]">
                  {item.description}
                </div>
                {item.badges && item.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.badges.map((badge) => (
                      <span
                        key={badge}
                        className="font-mono text-[10px] tracking-[.04em] text-[#8A8A8A] bg-[#EDE7E1] px-2 py-[3px] rounded-full border border-[#E2DDD5]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
