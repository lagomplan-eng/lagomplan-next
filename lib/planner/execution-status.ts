/**
 * lib/planner/execution-status.ts
 *
 * Unified execution-status taxonomy for the planner. Every bookable or
 * trackable item on the trip — hotels, restaurant reservations, tours,
 * transport, checklist items — eventually flips through one of these
 * states. Speaking the same dialect across surfaces is the whole point
 * of Phase 2 (per the trip-OS rework brief).
 *
 * The 7 states map to specific moments in the booking lifecycle:
 *
 *   recommended  — AI suggested it. Default state for AI-emitted items.
 *   saved        — User flagged it for the trip but hasn't booked yet.
 *   pending      — Booking action started but not complete.
 *   in_progress  — Mid-flight (active payment, confirmation email
 *                  pending, etc.).
 *   booked       — Action complete, confirmation received.
 *   confirmed    — Booked AND verified (e.g. confirmation number on
 *                  file, check-in window open).
 *   completed    — Done in the real world (already stayed, ate the
 *                  meal, took the tour).
 *
 * Phase 3 uses just `recommended` + `booked` on hotel cards. The rest
 * become useful as more surfaces adopt the taxonomy.
 */

export type ExecutionStatus =
  | 'recommended'
  | 'saved'
  | 'pending'
  | 'in_progress'
  | 'booked'
  | 'confirmed'
  | 'completed'

export type StatusTone = 'neutral' | 'progress' | 'done'

interface StatusConfig {
  /** Spanish label shown in the pill. */
  labelES: string
  /** English label shown in the pill. */
  labelEN: string
  /** Emoji glyph — matches the brief's icon spec verbatim. */
  glyph:   string
  /** Bucket for color treatment (neutral / progress / done). */
  tone:    StatusTone
}

export const STATUS_CONFIG: Record<ExecutionStatus, StatusConfig> = {
  recommended: { labelES: 'Recomendado', labelEN: 'Recommended', glyph: '⭐', tone: 'neutral'  },
  saved:       { labelES: 'Guardado',    labelEN: 'Saved',       glyph: '📍', tone: 'neutral'  },
  pending:     { labelES: 'Pendiente',   labelEN: 'Pending',     glyph: '⏳', tone: 'progress' },
  in_progress: { labelES: 'En progreso', labelEN: 'In progress', glyph: '🔄', tone: 'progress' },
  booked:      { labelES: 'Reservado',   labelEN: 'Booked',      glyph: '✅', tone: 'done'     },
  confirmed:   { labelES: 'Confirmado',  labelEN: 'Confirmed',   glyph: '🔒', tone: 'done'     },
  completed:   { labelES: 'Completo',    labelEN: 'Complete',    glyph: '✅', tone: 'done'     },
}

/**
 * Return the localised label for a status. Tiny helper kept here so
 * call sites don't repeat the locale branch.
 */
export function statusLabel(status: ExecutionStatus, locale: 'es' | 'en'): string {
  const cfg = STATUS_CONFIG[status]
  return locale === 'es' ? cfg.labelES : cfg.labelEN
}
