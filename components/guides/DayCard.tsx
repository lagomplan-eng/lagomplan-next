'use client'

/**
 * components/guides/DayCard.tsx
 *
 * Single expandable day card inside the Itinerary section.
 * Manages its own open/closed state; parent can seed initial value via `defaultOpen`.
 */

import { useEffect, useState } from 'react'
import type { ItineraryDay } from '../../lib/data/guides/types'
import { CardTitle, Eyebrow, InfoCard, Tag } from '../design'

interface Props {
  day: ItineraryDay
  dayOrdinalLabel: string  // e.g. "Día 01" / "Day 01"
  defaultOpen?: boolean
}

export function DayCard({ day, dayOrdinalLabel, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  // "dia-01", "dia-02", …: anchor target of the seasonal edition's day strip (and of any #dia-NN link).
  const anchorId = `dia-${String(day.dayNumber).padStart(2, '0')}`

  // A link to #dia-NN opens that day (days are collapsed except the first).
  useEffect(() => {
    const openIfTargeted = () => { if (window.location.hash === `#${anchorId}`) setIsOpen(true) }
    openIfTargeted()
    window.addEventListener('hashchange', openIfTargeted)
    return () => window.removeEventListener('hashchange', openIfTargeted)
  }, [anchorId])

  return (
    <InfoCard size="flush" id={anchorId} data-day="card" className="scroll-mt-28">
      {/* ── Header ── */}
      <button
        data-day="header"
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer select-none items-center justify-between border-b border-line-soft px-6 py-5 text-left transition-colors hover:bg-sand/40"
        style={{ borderBottomWidth: isOpen ? 1 : 0 }}
      >
        <div>
          <Eyebrow as="div" data-day="ordinal" className="!mb-1">
            {dayOrdinalLabel} · {day.dayLabel}
          </Eyebrow>
          <CardTitle as="div" data-day="title" className="!text-[20px] !leading-[1.2]">
            {day.title}
          </CardTitle>
        </div>
        {/* Chevron — hidden in print */}
        <div className="ml-4 flex flex-shrink-0 items-center gap-3 print:hidden">
          <div
            className="flex size-7 items-center justify-center rounded-full bg-sand text-tiny text-label transition-transform duration-300"
            style={{ transform: isOpen ? 'none' : 'rotate(-90deg)' }}
            aria-hidden="true"
          >
            ▾
          </div>
        </div>
      </button>

      {/* ── Body (forced open in print via CSS) ── */}
      <div
        data-day="body"
        className="overflow-hidden"
        style={{
          maxHeight: isOpen ? '2000px' : '0',
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.4s ease, opacity 0.3s',
        }}
      >
        <div className="px-6 pb-2">
          {day.items.map((item, i) => (
            <div
              data-day="item"
              key={i}
              className="grid grid-cols-[48px_1fr] items-start gap-4 border-b border-line-soft py-[18px] last:border-0"
            >
              {/* Time */}
              <div data-day="time" className="whitespace-nowrap pt-0.5 font-sans text-small font-bold text-pine">
                {item.time}
              </div>
              {/* Content */}
              <div>
                <div data-day="item-title" className="mb-1 text-body font-semibold text-pine">
                  {item.title}
                </div>
                {item.description && (
                  <div data-day="item-desc" className="text-small text-ink-2">
                    {item.description}
                  </div>
                )}
                {item.badges && item.badges.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 print:hidden">
                    {item.badges.map((badge) => (
                      <Tag key={badge}>{badge}</Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </InfoCard>
  )
}
