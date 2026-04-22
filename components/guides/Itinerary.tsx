/**
 * components/guides/Itinerary.tsx
 *
 * Renders the full itinerary section with expandable DayCard components.
 * First day is open by default; subsequent days are collapsed.
 */

import type { ItinerarySection } from '../../lib/data/guides/types'
import { DayCard } from './DayCard'

interface Props {
  data: ItinerarySection
  locale: string
}

function padDay(n: number): string {
  return String(n).padStart(2, '0')
}

function dayLabel(n: number, locale: string): string {
  return locale === 'es' ? `Día ${padDay(n)}` : `Day ${padDay(n)}`
}

export function Itinerary({ data, locale }: Props) {
  return (
    <div data-guide="itinerary" className="mb-14">
      {/* Section header */}
      <div className="mb-6">
        <div data-section="eyebrow" className="font-mono text-[10px] font-medium tracking-[.12em] uppercase text-[#8A8A8A] mb-1.5">
          {data.eyebrow}
        </div>
        <div data-section="title" className="font-sans text-[22px] font-semibold tracking-[-0.01em] text-[#0F3A33]">
          {data.title}
        </div>
        {data.description && (
          <div className="text-[13px] font-light text-[#4A4A4A] leading-[1.6] mt-1.5">
            {data.description}
          </div>
        )}
      </div>

      {/* Day cards */}
      <div className="flex flex-col gap-4">
        {data.days.map((day, i) => (
          <DayCard
            key={day.dayNumber}
            day={day}
            dayOrdinalLabel={dayLabel(day.dayNumber, locale)}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  )
}
