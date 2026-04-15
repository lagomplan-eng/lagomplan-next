'use client'
/**
 * components/trips/TripShareModal.tsx
 *
 * Share modal for saved trips. Mirrors CuratedGuideShareModal's structure,
 * layout, and icons — adapted for trip data and the share-link API.
 *
 * On first open it calls POST /api/trips/[tripId]/share to generate (or
 * retrieve) the share_id, then displays the full share URL for copying.
 *
 * Usage:
 *   <TripShareModal
 *     tripId={tripId}
 *     destination="Cancún"
 *     duration={4}
 *     isOpen={open}
 *     onClose={() => setOpen(false)}
 *   />
 */

import { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'

// ── Icons (identical to CuratedGuideShareModal) ────────────────────────────────

function IconCopy() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <rect x="1" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M4 4V3a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path
        d="M2 6.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
      <path
        d="M1 1l9 9M10 1L1 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface Props {
  tripId:      string        // saved trip UUID — required to generate share link
  destination: string
  duration:    number | null // days
  isOpen:      boolean
  onClose:     () => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export function TripShareModal({ tripId, destination, duration, isOpen, onClose }: Props) {
  const locale = useLocale() as 'es' | 'en'
  const isES   = locale === 'es'

  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [copied,   setCopied]   = useState(false)

  const sheetRef = useRef<HTMLDivElement>(null)

  // ── Generate share link on first open ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !tripId || shareUrl) return

    setLoading(true)
    setApiError(null)

    fetch(`/api/trips/${tripId}/share`, { method: 'POST' })
      .then(r => r.json())
      .then(({ shareId, error: err }) => {
        if (err || !shareId) {
          setApiError(err ?? (isES ? 'Error al generar el enlace' : 'Error generating link'))
          return
        }
        setShareUrl(`${window.location.origin}/${locale}/trips/share/${shareId}`)
      })
      .catch(() => setApiError(isES ? 'Error de red' : 'Network error'))
      .finally(() => setLoading(false))
  }, [isOpen, tripId, shareUrl, locale, isES])

  // ── ESC closes ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  // ── Scroll lock ───────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) onClose()
  }

  function handleCopy() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  // Watermark: first 2 initials of destination
  const watermark = destination
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')

  if (!isOpen) return null

  const durationLabel = duration
    ? `${duration} ${isES ? (duration === 1 ? 'día' : 'días') : (duration === 1 ? 'day' : 'days')}`
    : null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isES ? `Compartir viaje: ${destination}` : `Share trip: ${destination}`}
      className="fixed inset-0 z-[300] flex items-center justify-center px-4"
      style={{
        background: 'rgba(10,18,15,0.48)',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        className="w-full max-w-[390px] rounded-[26px] overflow-hidden"
        style={{
          background: '#FAF8F5',
          boxShadow: '0 20px 60px rgba(15,58,51,.18), 0 2px 8px rgba(0,0,0,.06)',
          animation: 'mIn .24s ease',
        }}
      >

        {/* ── Hero card ────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden px-7 pt-7 pb-8"
          style={{ background: 'linear-gradient(145deg, #0e352e 0%, #1c4f45 100%)' }}
        >
          {/* Watermark */}
          <span
            aria-hidden
            className="absolute right-2 bottom-[-22px] font-display italic select-none pointer-events-none leading-none"
            style={{ fontSize: 104, color: 'rgba(255,255,255,.05)' }}
          >
            {watermark}
          </span>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-[26px] h-[26px] flex items-center justify-center rounded-[6px] transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)' }}
            aria-label={isES ? 'Cerrar' : 'Close'}
          >
            <IconClose />
          </button>

          {/* Eyebrow */}
          <p
            className="font-mono text-[9px] tracking-[.2em] uppercase mb-5 select-none"
            style={{ color: 'rgba(255,255,255,.38)' }}
          >
            Lagomplan · {isES ? 'Tu viaje' : 'Your trip'}
          </p>

          {/* Destination */}
          <h2
            className="font-display italic font-normal leading-[1.05] tracking-[-0.02em] text-white mb-3"
            style={{ fontSize: 'clamp(26px, 6.5vw, 34px)' }}
          >
            {destination}
          </h2>

          {/* Duration */}
          {durationLabel && (
            <p className="font-mono text-[11px] tracking-[.06em]" style={{ color: 'rgba(255,255,255,.52)' }}>
              {durationLabel}
            </p>
          )}
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <div className="px-7 pt-6 pb-2">

          <p
            className="font-mono text-[9px] tracking-[.18em] uppercase mb-4"
            style={{ color: '#6B8F86' }}
          >
            {isES ? 'Enlace para compartir' : 'Share link'}
          </p>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#C8D9D3] border-t-[#0F3A33] rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {!loading && apiError && (
            <p className="text-[13px] py-4" style={{ color: '#C0392B' }}>{apiError}</p>
          )}

          {/* Link ready */}
          {!loading && shareUrl && (
            <>
              {/* Read-only URL row */}
              <div
                className="flex items-center gap-2 rounded-[10px] px-4 py-3 mb-3.5"
                style={{ background: '#F0EDE8' }}
              >
                <span
                  className="font-mono text-[11px] truncate flex-1 select-all cursor-text"
                  style={{ color: '#8A8680' }}
                >
                  {shareUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 transition-colors cursor-pointer"
                  style={{ color: copied ? '#2F7D46' : '#6B8F86' }}
                  aria-label={isES ? 'Copiar enlace' : 'Copy link'}
                >
                  {copied ? <IconCheck /> : <IconCopy />}
                </button>
              </div>

              {/* Primary copy button */}
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2.5 font-mono text-[12px] tracking-[.07em] text-white rounded-[12px] py-[13px] cursor-pointer"
                style={{
                  background: copied ? '#2F7D46' : '#0F3A33',
                  transition: 'background .3s ease',
                }}
              >
                {copied ? (
                  <><IconCheck /> {isES ? 'Copiado' : 'Copied'}</>
                ) : (
                  <><IconCopy /> {isES ? 'Copiar enlace del viaje' : 'Copy trip link'}</>
                )}
              </button>
            </>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <div
          className="px-7 py-5 flex items-center justify-between gap-4 mt-1"
          style={{ borderTop: '1px solid #EDEBE6' }}
        >
          <p
            className="font-sans text-[12px] leading-snug"
            style={{ color: '#B8B5AF', maxWidth: 210 }}
          >
            {isES
              ? 'Solo quienes tengan el enlace podrán verlo ✨'
              : 'Only people with the link can view this trip ✨'}
          </p>
          <button
            onClick={onClose}
            className="font-mono text-[11px] tracking-[.04em] transition-colors cursor-pointer flex-shrink-0"
            style={{ color: '#A09C97' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0F3A33')}
            onMouseLeave={e => (e.currentTarget.style.color = '#A09C97')}
          >
            {isES ? 'Cancelar' : 'Cancel'}
          </button>
        </div>

      </div>
    </div>
  )
}
