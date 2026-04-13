'use client'

/**
 * components/guides/GuideFloatingCTA.tsx
 *
 * Floating "Guardar guía" button fixed at the bottom right.
 * Matches the primary CTA style from Trip Results.
 */

import { useState } from 'react'
import type { Locale } from '../../i18n'

interface Props {
  destination: string
  locale:      Locale
}

export function GuideFloatingCTA({ destination, locale }: Props) {
  const isES = locale === 'es'
  const [saved, setSaved] = useState(false)

  return (
    <button
      onClick={() => setSaved(v => !v)}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 font-sans text-[13px] font-semibold text-white px-5 py-3.5 rounded-full transition-all shadow-[0_4px_16px_rgba(15,58,51,.25)] hover:shadow-[0_6px_20px_rgba(15,58,51,.32)] hover:-translate-y-0.5 active:translate-y-0"
      style={{ background: saved ? '#1A5247' : '#0F3A33' }}
      aria-label={isES ? 'Guardar guía' : 'Save guide'}
    >
      <span className="text-[15px]">{saved ? '✔' : '🔖'}</span>
      {saved
        ? (isES ? 'Guía guardada' : 'Guide saved')
        : (isES ? 'Guardar guía' : 'Save guide')}
    </button>
  )
}
