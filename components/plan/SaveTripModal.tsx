'use client'

/**
 * Post-generation save prompt for anonymous users. Triggers the existing
 * `pendingSave` round-trip through /login on the primary CTA — that flow
 * already handles redirect-back + trip persistence on auth, so this
 * component is purely the UI surface.
 *
 * Tone: emotional, not gating. Per spec: "soft conversion, not aggressive
 * paywall". The user has just received their trip — we frame saving as
 * progress, not as a wall.
 */

import { useEffect } from 'react'

interface Props {
  open: boolean
  locale: 'es' | 'en'
  onSave: () => void
  onDismiss: () => void
}

export function SaveTripModal({ open, locale, onSave, onDismiss }: Props) {
  const isES = locale === 'es'

  // Lock body scroll while open. Important on mobile to prevent the underlying
  // page from scrolling behind the modal.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // ESC to dismiss — same as a soft cancel. Keeps keyboard UX sane.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onDismiss])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-trip-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={isES ? 'Cerrar' : 'Close'}
        onClick={onDismiss}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="relative w-full max-w-[460px] bg-[#FFF9F3] rounded-2xl shadow-[0_24px_60px_rgba(15,58,51,0.18)] p-8 md:p-10">
        <div className="text-[44px] mb-3" aria-hidden="true">✈️</div>
        <h2
          id="save-trip-modal-title"
          className="font-display text-[26px] md:text-[28px] font-semibold text-[#0F3A33] leading-tight mb-3"
        >
          {isES ? 'No pierdas tu viaje' : 'Don’t lose your trip'}
        </h2>
        <p className="font-sans text-[15px] text-[#5A4A3B] leading-relaxed mb-8">
          {isES
            ? 'Guárdalo para acceder cuando quieras y seguir planificando.'
            : 'Save it to access anytime and keep planning.'}
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onSave}
            className="w-full px-5 py-3 rounded-full bg-[#0F3A33] text-white font-sans text-[15px] font-medium hover:bg-[#1A4A40] transition-colors"
          >
            {isES ? 'Guardar mi viaje' : 'Save my trip'}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full px-5 py-3 rounded-full bg-transparent text-[#5A4A3B] font-sans text-[14px] hover:text-[#0F3A33] transition-colors"
          >
            {isES ? 'Continuar sin guardar' : 'Continue without saving'}
          </button>
        </div>
      </div>
    </div>
  )
}
