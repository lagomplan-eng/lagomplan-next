/**
 * components/intelligence/HotelFitBadge.tsx
 *
 * Renders on the hotel/accommodation card to summarize how well the
 * hotel location fits the itinerary's activity geography. Two parts:
 *
 *   1. Small pill — the qualitative label ("Base ideal" / "Funcional"
 *      / "Alejado") with a colored dot. Sits inline near the hotel name.
 *   2. One-line note below — human-readable distance summary
 *      ("A 0.8 km promedio de tus actividades.").
 *
 * Design constraints (from spec):
 *   - Manrope only.
 *   - Numeric score (0-100) NEVER shown — only the label + the note.
 *     The note may surface concrete numbers (distance, walking minutes)
 *     because those are user-meaningful, but not as a score.
 *   - Tone: practical, not judgmental. "Alejado" reads as "here's the
 *     tradeoff" not "bad choice".
 *   - Mobile-first; renders at 375px.
 *
 * Usage:
 *   <HotelFitBadge label="Base ideal" note="A 0.8 km promedio de tus actividades." />
 */

import type { HotelFitLabel } from '../../types/intelligence'

interface HotelFitBadgeProps {
  label: HotelFitLabel
  note:  string
}

// Same color family as DayFlowBadge so the intelligence visual language
// reads as one system across the result page.
const LABEL_TOKENS: Record<HotelFitLabel, { bg: string; border: string; dot: string; ink: string }> = {
  'Base ideal': { bg: 'bg-[rgba(107,143,134,.10)]', border: 'border-[rgba(107,143,134,.30)]', dot: 'bg-[#6B8F86]', ink: 'text-[#0F3A33]' },
  'Funcional':  { bg: 'bg-[#EDE7E1]',                border: 'border-[rgba(189,168,140,.45)]', dot: 'bg-[#B89F7D]', ink: 'text-[#5B4F3F]' },
  'Alejado':    { bg: 'bg-[rgba(225,97,91,.10)]',    border: 'border-[rgba(225,97,91,.35)]',  dot: 'bg-[#E1615B]', ink: 'text-[#8E2C26]' },
}

export default function HotelFitBadge({ label, note }: HotelFitBadgeProps) {
  const t = LABEL_TOKENS[label]

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={[
          'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border',
          t.bg, t.border,
          'font-sans text-[10px] font-medium tracking-[0.02em]',
          t.ink,
          'self-start',
        ].join(' ')}
        aria-label={`Hotel: ${label}, ${note}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${t.dot} shrink-0`} aria-hidden="true" />
        <span className="whitespace-nowrap">{label}</span>
      </div>
      <p className="font-sans text-[11px] leading-[1.5] text-[#5F5F5B] max-w-prose">
        {note}
      </p>
    </div>
  )
}
