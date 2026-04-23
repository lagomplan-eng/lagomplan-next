import type { PlanState } from '../../components/plan/PlanProvider'

export type PlanUiState = 'subscriber' | 'plenty' | 'last' | 'empty'
export type PlanTone = 'celebratory' | 'neutral' | 'soft-warn' | 'action'

export type PlanCopy = {
  state: PlanUiState
  label: string
  tone: PlanTone
}

export function resolvePlanCopy(
  plan: PlanState | null | 'loading',
  locale: 'es' | 'en',
): PlanCopy | null {
  if (!plan || plan === 'loading') return null
  const isES = locale === 'es'

  if (plan.is_subscriber) {
    return {
      state: 'subscriber',
      label: isES ? '✨ Ilimitado' : '✨ Unlimited',
      tone: 'celebratory',
    }
  }

  const n = plan.trips_remaining

  if (n === 0) {
    return {
      state: 'empty',
      label: isES ? '🔒 Sin viajes — desbloquea más' : '🔒 No trips — get more',
      tone: 'action',
    }
  }

  if (n === 1) {
    return {
      state: 'last',
      label: isES ? '🎒 Te queda 1 viaje' : '🎒 1 trip left',
      tone: 'soft-warn',
    }
  }

  return {
    state: 'plenty',
    label: isES ? `🎒 ${n} viajes disponibles` : `🎒 ${n} trips available`,
    tone: 'neutral',
  }
}

const TONE_CLASSES: Record<PlanTone, string> = {
  celebratory: 'text-[#0F3A33] bg-[#E4EFEC]',
  neutral:     'text-[#0F3A33] bg-[#EDE7E1]',
  'soft-warn': 'text-[#0F3A33] bg-[#F4EAD6]',
  action:      'text-[#7A4A13] bg-[#F7E7C9] hover:bg-[#F0DAAE] cursor-pointer',
}

export function planToneClass(tone: PlanTone): string {
  return TONE_CLASSES[tone]
}

/**
 * Success-toast copy for actions that consume (or don't) a trip credit.
 * Call with the PlanState AFTER the server-side decrement.
 */
export function buildPostGenerateToast(
  plan: PlanState | null,
  locale: 'es' | 'en',
): string {
  const isES = locale === 'es'
  if (!plan || plan.is_subscriber) {
    return isES ? '✨ Viaje creado' : '✨ Trip created'
  }
  const n = plan.trips_remaining
  if (n === 0) {
    return isES
      ? '✨ Viaje creado — fue tu último viaje. Recarga para seguir explorando.'
      : '✨ Trip created — that was your last trip. Top up to keep exploring.'
  }
  if (n === 1) {
    return isES
      ? '✨ Viaje creado — te queda 1 viaje. Recarga cuando quieras.'
      : '✨ Trip created — 1 trip left. Top up anytime.'
  }
  return isES
    ? `✨ Viaje creado — te quedan ${n} viajes`
    : `✨ Trip created — ${n} trips left`
}
