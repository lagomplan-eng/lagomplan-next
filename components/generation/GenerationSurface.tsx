'use client'

// components/generation/GenerationSurface.tsx
// Pure-render surface for trip generation. Consumes the output of
// useTripGeneration. Does not fetch or time anything itself.

import { useEffect, useState } from 'react'
import type { Phase, GenError } from '../../hooks/useTripGeneration'
import type { Tier } from '../../lib/generation/messages'

export type GenerationSurfaceProps = {
  destination?: string | null
  durationDays?: number | null
  travelers?: string | null
  phase: Phase
  progress: number                // 0..1
  message: string
  stage: Tier | null
  error: GenError | null
  locale?: 'es' | 'en'
  onRetry?: () => void
  onAdjust?: () => void
}

const STAGE_LABELS: Record<'es' | 'en', Record<Tier, string>> = {
  es: {
    understanding: 'Entendiendo',
    constructing:  'Diseñando',
    refining:      'Afinando',
  },
  en: {
    understanding: 'Understanding',
    constructing:  'Designing',
    refining:      'Refining',
  },
}

export function GenerationSurface({
  destination,
  durationDays,
  travelers,
  phase,
  progress,
  message,
  stage,
  error,
  locale = 'es',
  onRetry,
  onAdjust,
}: GenerationSurfaceProps) {
  const isES  = locale === 'es'
  const labels = STAGE_LABELS[isES ? 'es' : 'en']

  // Cross-fade the message: keep the previous text visible during fade-out.
  const [shown,   setShown]   = useState(message)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (message === shown) return
    setVisible(false)
    const t = setTimeout(() => {
      setShown(message)
      setVisible(true)
    }, 280)
    return () => clearTimeout(t)
  }, [message, shown])

  const isFailed = phase === 'failed' && error

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4">
      {/* Trip anchor */}
      <div className="flex flex-col items-center gap-2">
        <div className="font-mono text-[10px] tracking-[.18em] text-[#2D6B57] uppercase">
          {isES ? 'Tu plan' : 'Your plan'}
        </div>
        <div className="font-display text-[28px] md:text-[34px] font-semibold text-[#0F3A33] leading-tight text-center">
          {destination ?? (isES ? 'Tu próximo viaje' : 'Your next trip')}
        </div>
        <div className="font-sans text-[13px] text-[#7A7A76] text-center">
          {[
            typeof durationDays === 'number' && durationDays > 0
              ? (isES ? `${durationDays} días` : `${durationDays} days`)
              : null,
            travelers ? travelers : null,
          ].filter(Boolean).join(' · ') || (isES ? 'Preparando tu viaje' : 'Preparing your trip')}
        </div>
      </div>

      {/* Body: stage + bar + message — or failure block */}
      {!isFailed ? (
        <div className="flex flex-col items-center gap-6 w-full max-w-[460px]">
          {/* Stage dots */}
          <div className="flex items-center gap-4 font-mono text-[9px] tracking-[.14em] uppercase">
            {(['understanding','constructing','refining'] as Tier[]).map((t, i, arr) => {
              const active = stage === t
              const passed =
                stage === 'refining' ? true
                : stage === 'constructing' && t !== 'refining' ? true
                : t === 'understanding'
              return (
                <div key={t} className="flex items-center gap-3">
                  <span
                    className="transition-colors duration-300"
                    style={{
                      color: active ? '#0F3A33' : passed ? '#6B8F86' : '#B8B6AE',
                      fontWeight: active ? 700 : 400,
                    }}
                  >
                    {labels[t]}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="w-[6px] h-[6px] rounded-full"
                      style={{ background: passed ? '#6B8F86' : '#D9D2C9' }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full h-[2px] bg-[#E6E2D8] overflow-hidden">
            <div
              className="h-full bg-[#0F3A33]"
              style={{
                width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                transition: 'width 500ms linear',
              }}
            />
          </div>

          {/* Rotating message */}
          <p
            className="font-display italic text-[15px] md:text-[16px] text-[#4F6F68] leading-relaxed text-center min-h-[48px]"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 400ms ease' }}
          >
            {shown}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 w-full max-w-[460px]">
          <p className="font-display italic text-[16px] text-[#4F6F68] leading-relaxed text-center">
            {error?.kind === 'paywall'
              ? (isES
                  ? 'Necesitas un crédito para generar este viaje.'
                  : 'You need a credit to generate this trip.')
              : error?.kind === 'auth'
              ? (isES
                  ? 'Inicia sesión para continuar con tu plan.'
                  : 'Please sign in to continue with your plan.')
              : (isES
                  ? 'Algo no salió como esperábamos con este plan.'
                  : 'Something didn’t quite come together for this plan.')}
          </p>
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="font-mono text-[10px] tracking-[.12em] uppercase px-5 py-3 bg-[#0F3A33] text-[#FAF8F5] hover:opacity-90 transition-opacity"
              >
                {isES ? 'Reintentar' : 'Try again'}
              </button>
            )}
            {onAdjust && (
              <button
                onClick={onAdjust}
                className="font-mono text-[10px] tracking-[.12em] uppercase px-5 py-3 border border-[#0F3A33] text-[#0F3A33] hover:bg-[#0F3A33] hover:text-[#FAF8F5] transition-colors"
              >
                {isES ? 'Ajustar el viaje' : 'Adjust the trip'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
