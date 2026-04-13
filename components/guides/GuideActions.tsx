'use client'

/**
 * components/guides/GuideActions.tsx
 *
 * Quick action bar rendered below the hero — mirrors the TripResult action row.
 * Save (local state), Share (clipboard), Generate similar trip (link to planner).
 */

import { useState } from 'react'
import { Link }     from '../../lib/navigation'
import type { Locale } from '../../i18n'

interface Props {
  destination: string
  locale:      Locale
}

export function GuideActions({ destination, locale }: Props) {
  const isES  = locale === 'es'
  const [saved,  setSaved]  = useState(false)
  const [copied, setCopied] = useState(false)

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }).catch(() => {})
  }

  const plannerHref = `/planner?destination=${encodeURIComponent(destination)}` as any

  return (
    <div className="border-b border-[#E4DFD8] bg-white">
      <div className="max-w-[900px] mx-auto px-7 py-3 flex items-center">

        <button
          onClick={() => setSaved(v => !v)}
          className={`flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] pr-[15px] transition-colors ${
            saved ? 'text-[#2D6B57]' : 'text-[#7A7A76] hover:text-[#0F3A33]'
          }`}
        >
          <span>{saved ? '✔' : '🔖'}</span>
          {saved
            ? (isES ? 'Guardado' : 'Saved')
            : (isES ? 'Guardar'  : 'Save')}
        </button>

        <span className="text-[#CEC8C0] pr-[15px] text-[10px]">·</span>

        <button
          onClick={handleShare}
          className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] pr-[15px] text-[#7A7A76] hover:text-[#0F3A33] transition-colors"
        >
          <span>↗</span>
          {copied
            ? (isES ? '¡Copiado!' : 'Copied!')
            : (isES ? 'Compartir' : 'Share')}
        </button>

        <span className="text-[#CEC8C0] pr-[15px] text-[10px]">·</span>

        <Link
          href={plannerHref}
          className="flex items-center gap-[5px] font-mono text-[11px] tracking-[.06em] text-[#7A7A76] hover:text-[#0F3A33] transition-colors"
        >
          <span>✦</span>
          {isES ? 'Generar viaje similar' : 'Generate similar trip'}
        </Link>

      </div>
    </div>
  )
}
