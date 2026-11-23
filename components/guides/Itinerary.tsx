/**
 * components/guides/Itinerary.tsx
 *
 * Renders the full itinerary section with expandable DayCard components.
 * First day is open by default; subsequent days are collapsed.
 */

import type { ItinerarySection } from '../../lib/data/guides/types'
import { DayCard } from './DayCard'
import { GuideSectionHeader } from './GuideSectionHeader'

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
      <GuideSectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} />

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
