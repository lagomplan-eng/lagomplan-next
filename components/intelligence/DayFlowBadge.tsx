/**
 * components/intelligence/DayFlowBadge.tsx
 *
 * Renders in the day header of the itinerary. Shows the day's qualitative
 * "flow" label (Fluido / Manejable / Pesado) alongside a calm metadata
 * line — walking minutes + transit segment count.
 *
 * Design constraints (from the Intelligence Foundation spec):
 *   - Manrope only; no Fraunces.
 *   - Numeric score (0-100) NEVER shown — only the label.
 *   - Tone: calm + informational; no alarm.
 *   - Mobile-first; renders cleanly at 375px.
 *   - Color tokens map to existing design system:
 *       Fluido    → sage  (#6B8F86 family)  · subtle green
 *       Manejable → sand  (#EDE7E1 family)  · neutral
 *       Pesado    → coral (#E1615B family)  · gentle warning
 *
 * Usage:
 *   <DayFlowBadge label="Fluido" walkingMin={32} transitSegments={1} />
 *
 * Locale: not a prop — labels are server-rendered Spanish from the
 * Intelligence engine. The metadata line auto-localizes via the locale
 * prop because "min caminando" / "tramo" change per language.
 */

import type { DayLabel } from '../../types/intelligence'

interface DayFlowBadgeProps {
  label:           DayLabel
  walkingMin:      number
  transitSegments: number
  locale?:         'es' | 'en'
}

// Per-label visual tokens. Three discrete states; no gradient or scoring
// expressed in color. Each token is a self-contained Tailwind ruleset
// keeping the badge atomic / no parent CSS dependency.
const LABEL_TOKENS: Record<DayLabel, { bg: string; border: string; dot: string; ink: string }> = {
  // Sage / subtle green — the calm "this day works" state.
  'Fluido':    { bg: 'bg-[rgba(107,143,134,.10)]', border: 'border-[rgba(107,143,134,.30)]', dot: 'bg-[#6B8F86]', ink: 'text-[#0F3A33]' },
  // Sand / neutral — "doable, no concerns either way."
  'Manejable': { bg: 'bg-[#EDE7E1]',                border: 'border-[rgba(189,168,140,.45)]', dot: 'bg-[#B89F7D]', ink: 'text-[#5B4F3F]' },
  // Soft coral — gentle warning, never alarm. Coral is muted to ~70%.
  'Pesado':    { bg: 'bg-[rgba(225,97,91,.10)]',    border: 'border-[rgba(225,97,91,.35)]',  dot: 'bg-[#E1615B]', ink: 'text-[#8E2C26]' },
}

export default function DayFlowBadge({
  label,
  walkingMin,
  transitSegments,
  locale = 'es',
}: DayFlowBadgeProps) {
  const t = LABEL_TOKENS[label]
  const isES = locale === 'es'

  // Build the metadata line — drop pieces that are zero so days with no
  // detected movement read cleanly ("Día fluido" alone, no trailing dots).
  const parts: string[] = []
  if (walkingMin > 0) parts.push(`${walkingMin} min ${isES ? 'caminando' : 'walking'}`)
  if (transitSegments > 0) {
    parts.push(
      isES
        ? `${transitSegments} ${transitSegments === 1 ? 'tramo' : 'tramos'}`
        : `${transitSegments} ${transitSegments === 1 ? 'transit leg' : 'transit legs'}`,
    )
  }

  // Day prefix matches existing day-card chrome: "Día fluido" / "Día manejable" /
  // "Día pesado". Keeps the qualitative framing in the user's vocabulary instead
  // of a stand-alone tag that would feel detached.
  const dayPrefix = isES ? 'Día' : 'Day'
  const labelLower = isES
    ? label.toLowerCase()
    : ({ 'Fluido': 'flowing', 'Manejable': 'manageable', 'Pesado': 'heavy' }[label])

  return (
    <div
      className={[
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border',
        t.bg, t.border,
        'font-sans text-[10px] font-medium tracking-[0.02em]',
        t.ink,
      ].join(' ')}
      // a11y: announce the label distinctly from the metadata so screen
      // readers don't mash "fluido 32 min caminando 1 tramo" together.
      aria-label={`${dayPrefix} ${labelLower}${parts.length ? `, ${parts.join(', ')}` : ''}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${t.dot} shrink-0`} aria-hidden="true" />
      <span className="whitespace-nowrap">
        {dayPrefix} {labelLower}
      </span>
      {parts.length > 0 && (
        <>
          <span aria-hidden="true" className="opacity-50">·</span>
          <span className="whitespace-nowrap font-normal opacity-80">
            {parts.join(' · ')}
          </span>
        </>
      )}
    </div>
  )
}
