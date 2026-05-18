/**
 * components/planner/StatusPill.tsx
 *
 * Reusable execution-status pill. Renders one of the 7 ExecutionStatus
 * values as a small rounded chip with a tone-appropriate palette + the
 * brief's glyph.
 *
 * Three sizes:
 *   xs — top-bar inline use (10 px text, tight padding)
 *   sm — card eyebrow use (11 px text)  — DEFAULT
 *   md — prominent placement (13 px text)
 *
 * Pure render — safe in Server Components. No interaction state.
 */

import type { ExecutionStatus, StatusTone } from '../../lib/planner/execution-status'
import { STATUS_CONFIG } from '../../lib/planner/execution-status'

type Size = 'xs' | 'sm' | 'md'

interface Props {
  status: ExecutionStatus
  locale: 'es' | 'en'
  size?:  Size
  /** Hide the glyph (used when space is tight or the parent already shows one). */
  glyphless?: boolean
}

// Tone → palette. PINE family for done-states; SAND-warm for neutrals;
// SAGE-tinted for in-flight. Keeps Lagomplan's editorial minimalism.
const TONE_STYLES: Record<StatusTone, { bg: string; fg: string; border: string }> = {
  neutral:  { bg: '#FFF9F3', fg: '#0F3A33', border: '#DDD8D2' },   // CREAM bg, PINE fg
  progress: { bg: '#FBEFD8', fg: '#7A5A14', border: '#EFE0B8' },   // amber tint
  done:     { bg: '#0F3A33', fg: '#FFFFFF', border: '#0F3A33' },   // solid PINE
}

const SIZE_STYLES: Record<Size, { fontSize: number; padX: number; padY: number; gap: number; radius: number; glyphSize: number }> = {
  xs: { fontSize: 10, padX: 8,  padY: 2,   gap: 4, radius: 999, glyphSize: 10 },
  sm: { fontSize: 11, padX: 10, padY: 3,   gap: 5, radius: 999, glyphSize: 11 },
  md: { fontSize: 13, padX: 12, padY: 5,   gap: 6, radius: 999, glyphSize: 13 },
}

export default function StatusPill({ status, locale, size = 'sm', glyphless }: Props) {
  const cfg     = STATUS_CONFIG[status]
  const palette = TONE_STYLES[cfg.tone]
  const sz      = SIZE_STYLES[size]
  const label   = locale === 'es' ? cfg.labelES : cfg.labelEN

  return (
    <span style={{
      display:        'inline-flex',
      alignItems:     'center',
      gap:            sz.gap,
      padding:        `${sz.padY}px ${sz.padX}px`,
      borderRadius:   sz.radius,
      border:         `1px solid ${palette.border}`,
      background:     palette.bg,
      color:          palette.fg,
      fontFamily:     "'Manrope', sans-serif",
      fontSize:       sz.fontSize,
      fontWeight:     600,
      lineHeight:     1,
      whiteSpace:     'nowrap',
      letterSpacing:  cfg.tone === 'done' ? '.04em' : 0,
      // Smooth color transition when status flips (recommended → booked,
      // pending → completed, etc). Calm, sub-300 ms — enough to register
      // the state change without distracting from the page.
      transition:     'background-color .22s ease, color .22s ease, border-color .22s ease',
    }}>
      {!glyphless && (
        <span aria-hidden style={{ fontSize: sz.glyphSize, lineHeight: 1 }}>{cfg.glyph}</span>
      )}
      <span>{label}</span>
    </span>
  )
}
