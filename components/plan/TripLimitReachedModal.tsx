'use client'

import { useLocale } from 'next-intl'
import { FREE_TRIPS_LIMIT } from '../../lib/plan/limits'

/**
 * Celebratory transition modal shown immediately AFTER a free-tier user
 * completes their final free trip. The trip itself is already generated and
 * visible behind this modal — we don't block the result, we celebrate it and
 * prime the upgrade.
 *
 * This is distinct from PaywallModal, which only fires when a new generation
 * is actually blocked (i.e. the user clicks "generate" with 0 credits).
 */
export function TripLimitReachedModal({
  open,
  onUpgrade,
  onClose,
}: {
  open: boolean
  onUpgrade: () => void
  onClose: () => void
}) {
  const isES = useLocale() !== 'en'
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[55] bg-black/40 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[420px] bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,.18)] overflow-hidden">
        <div className="bg-[#0F3A33] px-6 pt-8 pb-6 text-center">
          <div className="text-[44px] mb-2">🎉</div>
          <h2 className="font-sans text-[24px] font-bold text-white leading-tight tracking-[-0.5px]">
            {isES
              ? `Has creado tus ${FREE_TRIPS_LIMIT} viajes gratis`
              : `You've created your ${FREE_TRIPS_LIMIT} free trips`}
          </h2>
          <p className="font-sans text-[13px] text-[#A8C5BE] mt-2 leading-relaxed">
            {isES
              ? 'Desbloquea viajes ilimitados para seguir planeando sin límites.'
              : 'Unlock unlimited planning to keep going without limits.'}
          </p>
        </div>

        <div className="px-6 pt-6 pb-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full font-sans text-[13px] font-semibold bg-[#0F3A33] text-white py-3.5 rounded-[10px] hover:bg-[#12453d] transition-colors"
          >
            {isES ? 'Ver planes' : 'See plans'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full font-sans text-[13px] font-medium text-[#0F3A33] bg-white border border-[#CEC8C0] py-3 rounded-[10px] hover:bg-[#EDE7E1] transition-colors"
          >
            {isES ? 'Seguir viendo mi viaje' : 'Keep viewing my trip'}
          </button>
        </div>
      </div>
    </div>
  )
}
