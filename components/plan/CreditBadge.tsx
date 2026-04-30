'use client'

import { useLocale } from 'next-intl'
import { usePlan } from './PlanProvider'

/**
 * Persistent visibility of remaining trips for authed users on the planner.
 * Reads from the existing PlanProvider — refreshes automatically after each
 * generation since TripResult.tsx already calls refreshPlanCredits() on
 * success.
 *
 * Hidden when:
 *  - plan state is still loading (avoid flicker)
 *  - user is anonymous (PlanProvider returns null until auth resolves)
 *  - user is on the explorer (subscriber) tier — they have unlimited trips,
 *    no number to display
 *
 * At zero remaining we show a subtle upgrade prompt next to the count rather
 * than going quiet, per the spec's "make it visible but not stressful" rule.
 */
export function CreditBadge({ onUpgradeClick }: { onUpgradeClick?: () => void } = {}) {
  const locale = useLocale() as 'es' | 'en'
  const isES = locale === 'es'
  const { planCredits } = usePlan()

  if (planCredits === 'loading' || planCredits === null) return null
  if (planCredits.is_subscriber) return null

  const remaining = planCredits.trips_remaining
  const label = isES
    ? `${remaining} ${remaining === 1 ? 'viaje disponible' : 'viajes disponibles'}`
    : `${remaining} ${remaining === 1 ? 'trip left' : 'trips left'}`

  const isZero = remaining <= 0

  return (
    <div
      className={[
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'font-mono text-[11px] tracking-[.08em] uppercase',
        'border',
        isZero
          ? 'bg-[#FCE8E0] border-[#E89B7C] text-[#7A2B0F]'
          : 'bg-[#F2EAE0] border-[#D8C9B6] text-[#5A4A3B]',
      ].join(' ')}
      aria-live="polite"
    >
      <span className={isZero ? 'opacity-90' : 'opacity-80'}>•</span>
      <span>{label}</span>
      {isZero && onUpgradeClick && (
        <button
          type="button"
          onClick={onUpgradeClick}
          className="ml-2 underline decoration-dotted underline-offset-2 hover:opacity-80"
        >
          {isES ? 'Recargar' : 'Upgrade'}
        </button>
      )}
    </div>
  )
}
