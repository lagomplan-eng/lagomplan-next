'use client'

/**
 * components/guides/CuratedGuideShareModal.tsx
 *
 * Lightweight share modal for curated guides.
 * Shows a summary card (title, subtitle, tags, day titles) and a copy-link action.
 *
 * Usage:
 *   <CuratedGuideShareModal guide={guideShare} isOpen={open} onClose={() => setOpen(false)} />
 */

import { useState, useEffect, useRef } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

export type GuideShare = {
  title: string
  subtitle: string
  tags: string[]
  days: { day: number; title: string }[]
  shareUrl: string
}

interface Props {
  guide: GuideShare
  isOpen: boolean
  onClose: () => void
}

// ── Icons (inline SVG — no icon library dependency) ───────────────────────────

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

// ── Component ──────────────────────────────────────────────────────────────────

export function CuratedGuideShareModal({ guide, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  // ESC closes modal
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else        document.body.style.overflow = ''
    return ()  => { document.body.style.overflow = '' }
  }, [isOpen])

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  function handleCopy() {
    if (typeof navigator === 'undefined') return
    navigator.clipboard.writeText(guide.shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  // Watermark: first 2 initials of the destination title
  const watermark = guide.title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Compartir guía: ${guide.title}`}
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

        {/* ── Hero card (pine gradient) ─────────────────────────── */}
        <div
          className="relative overflow-hidden px-7 pt-7 pb-8"
          style={{ background: 'linear-gradient(145deg, #0e352e 0%, #1c4f45 100%)' }}
        >
          {/* Watermark */}
          <span
            aria-hidden
            className="absolute right-2 bottom-[-22px] font-display select-none pointer-events-none leading-none"
            style={{ fontSize: 104, color: 'rgba(255,255,255,.05)' }}
          >
            {watermark}
          </span>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-[26px] h-[26px] flex items-center justify-center rounded-[6px] transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)' }}
            aria-label="Cerrar"
          >
            <IconClose />
          </button>

          {/* Eyebrow */}
          <p
            className="font-mono text-[9px] tracking-[.2em] uppercase mb-5 select-none"
            style={{ color: 'rgba(255,255,255,.38)' }}
          >
            Lagomplan · Guía curada
          </p>

          {/* Title */}
          <h2
            className="font-sans font-bold leading-[1.05] tracking-[-0.02em] text-white mb-3"
            style={{ fontSize: 'clamp(26px, 6.5vw, 34px)' }}
          >
            {guide.title}
          </h2>

          {/* Subtitle — capped at 90 chars */}
          <p
            className="text-[13px] font-light leading-[1.65] mb-6"
            style={{ color: 'rgba(255,255,255,.58)', maxWidth: 290 }}
          >
            {guide.subtitle.length > 90
              ? guide.subtitle.slice(0, 90).trimEnd() + '…'
              : guide.subtitle}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-[7px]">
            {guide.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-[10px] tracking-[.03em] px-3 py-[5px] rounded-full"
                style={{ background: 'rgba(255,255,255,.09)', color: 'rgba(255,255,255,.7)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────── */}
        <div className="px-7 pt-6 pb-2">

          {/* Section label */}
          <p
            className="font-mono text-[9px] tracking-[.18em] uppercase mb-4"
            style={{ color: '#6B8F86' }}
          >
            Lo que incluye
          </p>

          {/* Day list */}
          <div>
            {guide.days.slice(0, 5).map((d, i, arr) => (
              <div key={d.day}>
                <div className="flex items-baseline gap-4 py-[11px]">
                  <span
                    className="font-mono text-[10px] tracking-[.06em] flex-shrink-0 tabular-nums"
                    style={{ color: '#C0BCB6', minWidth: 38 }}
                  >
                    Día {String(d.day).padStart(2, '0')}
                  </span>
                  <span className="font-sans text-[13px] leading-snug" style={{ color: '#1C1C1A' }}>
                    {d.title}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ height: 1, background: '#EDEBE6' }} />
                )}
              </div>
            ))}
          </div>

          {/* ── Share section ───────────────────────────────────── */}
          <div className="mt-5 pt-5" style={{ borderTop: '1px solid #EDEBE6' }}>

            {/* Read-only URL row */}
            <div
              className="flex items-center gap-2 rounded-[10px] px-4 py-3 mb-3.5"
              style={{ background: '#F0EDE8' }}
            >
              <span
                className="font-mono text-[11px] truncate flex-1 select-all cursor-text"
                style={{ color: '#8A8680' }}
              >
                {guide.shareUrl}
              </span>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 transition-colors cursor-pointer"
                style={{ color: copied ? '#2F7D46' : '#6B8F86' }}
                aria-label="Copiar enlace"
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
                <>
                  <IconCheck />
                  Copiado
                </>
              ) : (
                <>
                  <IconCopy />
                  Copiar enlace del viaje
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div
          className="px-7 py-5 flex items-center justify-between gap-4 mt-1"
          style={{ borderTop: '1px solid #EDEBE6' }}
        >
          <p
            className="font-sans text-[12px] leading-snug"
            style={{ color: '#B8B5AF', maxWidth: 210 }}
          >
            Comparte esta guía con quien viajarías ✨
          </p>
          <button
            onClick={onClose}
            className="font-mono text-[11px] tracking-[.04em] transition-colors cursor-pointer flex-shrink-0"
            style={{ color: '#A09C97' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0F3A33')}
            onMouseLeave={e => (e.currentTarget.style.color = '#A09C97')}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}
