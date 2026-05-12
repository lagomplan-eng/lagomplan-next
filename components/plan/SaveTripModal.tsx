'use client'

/**
 * Post-generation save prompt for anonymous users. Triggers the existing
 * `pendingSave` round-trip through /login on the primary CTA — that flow
 * already handles redirect-back + trip persistence on auth, so this
 * component is purely the UI surface.
 *
 * Styled to match TripLimitReachedModal: dark-green header with hero icon,
 * white body with primary/secondary CTA stack.
 */

import { useEffect } from 'react'
import { useLocale } from 'next-intl'

interface Props {
  open: boolean
  onSave: () => void
  onDismiss: () => void
}

export function SaveTripModal({ open, onSave, onDismiss }: Props) {
  const isES = useLocale() !== 'en'

  // Lock body scroll while open. Important on mobile to prevent the underlying
  // page from scrolling behind the modal.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // ESC to dismiss — same as a soft cancel.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onDismiss])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[55] bg-black/40 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-trip-modal-title"
    >
      <div className="w-full max-w-[420px] bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,.18)] overflow-hidden">
        <div className="bg-[#0F3A33] px-6 pt-8 pb-6 text-center">
          <div className="text-[44px] mb-2" aria-hidden="true">✈️</div>
          <h2
            id="save-trip-modal-title"
            className="font-sans text-[24px] font-bold text-white leading-tight tracking-[-0.5px]"
          >
            {isES ? 'No pierdas tu viaje' : 'Don’t lose your trip'}
          </h2>
          <p className="font-sans text-[13px] text-[#A8C5BE] mt-2 leading-relaxed">
            {isES
              ? 'Guárdalo para acceder cuando quieras y seguir planificando.'
              : 'Save it to access anytime and keep planning.'}
          </p>
        </div>

        <div className="px-6 pt-6 pb-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onSave}
            className="w-full font-sans text-[13px] font-semibold bg-[#0F3A33] text-white py-3.5 rounded-[10px] hover:bg-[#12453d] transition-colors"
          >
            {isES ? 'Guardar mi viaje' : 'Save my trip'}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full font-sans text-[13px] font-medium text-[#0F3A33] bg-white border border-[#CEC8C0] py-3 rounded-[10px] hover:bg-[#EDE7E1] transition-colors"
          >
            {isES ? 'Continuar sin guardar' : 'Continue without saving'}
          </button>
        </div>
      </div>
    </div>
  )
}
