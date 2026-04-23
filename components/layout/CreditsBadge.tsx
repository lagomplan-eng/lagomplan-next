'use client'

import { useLocale } from 'next-intl'
import { useUser } from '../auth/SupabaseProvider'
import { usePlan } from '../plan/PlanProvider'
import { resolvePlanCopy, planToneClass } from '../../lib/plan/copy'

export function CreditsBadge() {
  const user = useUser()
  const { planCredits, openPaywall } = usePlan()
  const locale = useLocale() as 'es' | 'en'

  if (!user) return null

  const copy = resolvePlanCopy(planCredits, locale)
  if (!copy) return null

  const base = 'font-sans text-[12px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors'

  if (copy.state === 'empty') {
    return (
      <button
        type="button"
        onClick={openPaywall}
        className={`${base} ${planToneClass(copy.tone)} border-none`}
        aria-label={copy.label}
      >
        {copy.label}
      </button>
    )
  }

  return (
    <span className={`${base} ${planToneClass(copy.tone)}`} aria-label={copy.label}>
      {copy.label}
    </span>
  )
}
