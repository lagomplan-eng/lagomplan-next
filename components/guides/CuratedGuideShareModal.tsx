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
import { Button } from '../design'

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
        background: 'rgb(var(--pine-rgb) / .48)',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        className="w-full max-w-[390px] rounded-[26px] overflow-hidden"
        style={{
          background: 'var(--white)',
          boxShadow: 'var(--shadow-pop)',
          animation: 'mIn .24s ease',
        }}
      >

        {/* ── Hero card (pine gradient) ─────────────────────────── */}
        <div
          className="relative overflow-hidden px-7 pt-7 pb-8"
          style={{ background: 'linear-gradient(145deg, var(--pine) 0%, var(--pine-hover) 100%)' }}
        >
          {/* Watermark */}
          <span
            aria-hidden
            className="absolute right-2 bottom-[-22px] font-sans select-none pointer-events-none leading-none"
            style={{ fontSize: 104, fontWeight: 800, color: 'rgb(var(--white-rgb) / .05)' }}
          >
            {watermark}
          </span>

          {/* Close button */}
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
        </div>

      </div>
    </div>
  )
}
