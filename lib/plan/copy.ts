import type { PlanState } from '../../components/plan/PlanProvider'
import { FREE_TRIPS_LIMIT } from './limits'

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

  // Unlimited subscribers — ambient celebratory pill.
  if (plan.is_subscriber) {
    return {
      state: 'subscriber',
      label: isES ? '✨ Ilimitado' : '✨ Unlimited',
      tone: 'celebratory',
    }
  }

  const remaining = plan.trips_remaining

  // Out of trips — call-to-action (clickable badge opens paywall).
  if (remaining === 0) {
    return {
      state: 'empty',
      label: isES ? '🔒 Sin viajes — desbloquea más' : '🔒 No trips — get more',
      tone: 'action',
    }
  }

  // Free tier shows progressive "used / limit" so the user always sees how
  // much of their free allowance they've burned. Paid per-trip users see a
  // remaining-countdown since they don't have a fixed cap.
  const isFreeTier = plan.tier === 'free'

  if (isFreeTier) {
    const used = Math.max(0, FREE_TRIPS_LIMIT - remaining)
    // Last free trip: keep soft-warn tone so it stands out visually.
    if (remaining === 1) {
      return {
        state: 'last',
        label: isES
          ? `🎒 ${used} / ${FREE_TRIPS_LIMIT} · último viaje gratis`
          : `🎒 ${used} / ${FREE_TRIPS_LIMIT} · last free trip`,
        tone: 'soft-warn',
      }
    }
    return {
      state: 'plenty',
      label: isES
        ? `🎒 ${used} / ${FREE_TRIPS_LIMIT} viajes usados`
        : `🎒 ${used} / ${FREE_TRIPS_LIMIT} trips used`,
      tone: 'neutral',
    }
  }

  // Paid per-trip balance (no fixed cap) — countdown format.
  if (remaining === 1) {
    return {
      state: 'last',
      label: isES ? '🎒 Te queda 1 viaje' : '🎒 1 trip left',
      tone: 'soft-warn',
    }
  }

  return {
    state: 'plenty',
    label: isES ? `🎒 ${remaining} viajes disponibles` : `🎒 ${remaining} trips available`,
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
      ? '✨ Viaje creado — fue tu último viaje gratis. Desbloquea viajes ilimitados para seguir.'
      : '✨ Trip created — that was your last free trip. Unlock unlimited trips to keep going.'
  }
  if (n === 1) {
    return isES
      ? '✨ Viaje creado — te queda 1 viaje gratis.'
      : '✨ Trip created — 1 free trip left.'
  }
  return isES
    ? `✨ Viaje creado — te quedan ${n} viajes gratis`
    : `✨ Trip created — ${n} free trips remaining`
}
