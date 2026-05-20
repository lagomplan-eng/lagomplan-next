'use client'

/**
 * components/planner/TripReadinessBar.tsx
 *
 * Trip Readiness System — the sticky Pine bar at the top of the
 * planner result page. Phase 1 of the "trip operating system" rework.
 *
 * Three zones on desktop (≥820 px):
 *   LEFT    — emotional readiness %: "Tu viaje está 20% listo · te
 *             faltan 5 pasos" + visual progress bar
 *   CENTER  — 5 milestone pills (Itinerario / Hospedaje / Traslados /
 *             Reservas / Listos), each marked done / pending / n-a
 *   RIGHT   — next-step label + the next pending check + CTA arrow
 *
 * On mobile (<820 px):
 *   - Collapsed pill: `20% · Reservar hotel  ⌄`
 *   - Tap to expand → full vertical stack
 *
 * Pure presentational; the upstream caller computes readinessPct,
 * milestones, and nextCheck and passes them down. No data fetching,
 * no side-effects beyond local expand/collapse state on mobile.
 */

import { useEffect, useRef, useState } from 'react'
import type { Milestone, MilestoneState } from '../../lib/planner/milestones'

interface NextCheckInfo {
  id:   string
  text: string
  icon: string
}

interface Props {
  /** 0–100 ratio of doneChecks / totalChecks. */
  readinessPct: number
  totalChecks:  number
  doneChecks:   number
  /** Convenience — totalChecks - doneChecks. Passed to keep the bar dumb. */
  pendingCount: number
  milestones:   Milestone[]
  nextCheck:    NextCheckInfo | null
  daysCount:    number
  locale:       'es' | 'en'
  /** ISO YYYY-MM-DD trip start date. Drives the time-to-trip urgency line
   *  under the readiness %. Optional — bar omits the line if absent or
   *  unparseable. */
  tripStart?:   string
  /** ISO YYYY-MM-DD trip end date. Used to detect "trip in progress" and
   *  "trip ended" states for the urgency line. */
  tripEnd?:     string
  /** Toggle handler — the bar calls this with the next check's ID when the
   *  user clicks the CTA (mark done) or Deshacer (undo). Same handler
   *  handles both directions; toggleCheck in TripResult is idempotent. */
  onToggleCheck?: (checkId: string) => void
}

// Days from today to a target ISO date. Uses UTC midnight to avoid the
// "off by one when the user is past midnight in their local timezone but
// the server hasn't ticked over" issue. Returns null on malformed input.
function daysFromToday(iso: string | undefined): number | null {
  if (!iso) return null
  const target = new Date(`${iso}T00:00:00Z`).getTime()
  if (Number.isNaN(target)) return null
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.round((target - today) / 86_400_000)
}

export default function TripReadinessBar({
  readinessPct, totalChecks, doneChecks, pendingCount,
  milestones, nextCheck, daysCount, locale, tripStart, tripEnd, onToggleCheck,
}: Props) {
  const isES = locale === 'es'
  const [mobileOpen, setMobileOpen] = useState(false)

  // Time-to-trip urgency. Three windows:
  //   future (≤ 14 days): "Sales en N días" → "Sales mañana" → "Hoy"
  //   in-progress (start ≤ today ≤ end): "Estás viajando"
  //   past:    suppressed entirely (the bar of a finished trip shouldn't
  //            keep harping; the user is looking at a memory at that point)
  // ≤ 3 days → coral accent (#E1615B, same as the CTA), nudging without
  // shouting. Otherwise sage tint so it reads as informational.
  const daysToStart = daysFromToday(tripStart)
  const daysToEnd   = daysFromToday(tripEnd)
  const urgency = (() => {
    if (daysToStart === null) return null
    // Trip ended: don't show urgency. The page is essentially a record at
    // this point.
    if (daysToEnd !== null && daysToEnd < 0) return null
    // In-progress: between start and end (inclusive).
    if (daysToStart <= 0 && (daysToEnd === null || daysToEnd >= 0)) {
      if (daysToStart === 0) {
        return { text: isES ? '¡Hoy es el día!' : 'Today is the day!', tone: 'urgent' as const }
      }
      return { text: isES ? 'Estás viajando' : 'You’re traveling', tone: 'info' as const }
    }
    // Future, within the 14-day window.
    if (daysToStart > 14) return null
    if (daysToStart === 1) {
      return { text: isES ? 'Sales mañana' : 'You leave tomorrow', tone: 'urgent' as const }
    }
    if (daysToStart <= 3) {
      return { text: isES ? `Sales en ${daysToStart} días` : `You leave in ${daysToStart} days`, tone: 'urgent' as const }
    }
    return { text: isES ? `Sales en ${daysToStart} días` : `You leave in ${daysToStart} days`, tone: 'info' as const }
  })()
  const urgencyColor = urgency?.tone === 'urgent' ? '#E1615B' : '#A8C4BE'

  // Inline-undo banner: when the user marks the next check done, the right
  // zone shifts to a "✓ Reservado · Deshacer" affordance for 4 s. The
  // banner's data is snapshotted at click time so it survives the cascade
  // re-render that moves nextCheck to a different check.
  const [recent, setRecent] = useState<{
    id:   string
    text: string
    icon: string
  } | null>(null)
  const undoTimer = useRef<number | null>(null)

  function clearUndoTimer() {
    if (undoTimer.current != null) {
      window.clearTimeout(undoTimer.current)
      undoTimer.current = null
    }
  }

  function handleMarkDone() {
    if (!nextCheck || !onToggleCheck) return
    onToggleCheck(nextCheck.id)
    setRecent({ id: nextCheck.id, text: nextCheck.text, icon: nextCheck.icon })
    clearUndoTimer()
    undoTimer.current = window.setTimeout(() => {
      setRecent(null)
      undoTimer.current = null
    }, 4000)
  }

  function handleUndo() {
    if (!recent || !onToggleCheck) return
    onToggleCheck(recent.id)
    clearUndoTimer()
    setRecent(null)
  }

  // Cancel pending timer on unmount so a route change mid-undo doesn't
  // try to setState on an unmounted component.
  useEffect(() => () => clearUndoTimer(), [])

  const tripReady   = totalChecks > 0 && pendingCount === 0
  const hasItinerary = daysCount > 0

  // ── Copy ────────────────────────────────────────────────────────────────
  const headline = tripReady
    ? (isES ? '✓ Tu viaje está listo'                : '✓ Your trip is ready')
    : totalChecks === 0
      ? (isES ? `${daysCount} ${daysCount === 1 ? 'día' : 'días'} planificados` : `${daysCount} ${daysCount === 1 ? 'day' : 'days'} planned`)
      : (isES ? `Tu viaje está ${readinessPct}% listo` : `Your trip is ${readinessPct}% ready`)

  const sub = tripReady
    ? (isES ? 'Todo confirmado'                    : 'All confirmed')
    : totalChecks === 0
      ? (isES ? 'Listo para empezar'              : 'Ready to plan')
      : pendingCount === 1
        ? (isES ? 'Te falta 1 paso para viajar'   : '1 step to go')
        : (isES ? `Te faltan ${pendingCount} pasos para viajar` : `${pendingCount} steps to go`)

  const nextLabel = isES ? 'Siguiente' : 'Next'

  // Contextual CTA verb — pulled from the leading word of nextCheck.text.
  // E.g. "Reservar hotel" → "Reservar →"; "Confirmar reserva: X" → "Confirmar →".
  // Falls back to generic "Hacer / Do now" when the verb isn't recognised.
  const ctaLabel = (() => {
    if (!nextCheck) return isES ? 'Hacer →' : 'Do now →'
    const first = nextCheck.text.split(/\s+/)[0]
    const knownVerbs = new Set(['Reservar', 'Confirmar', 'Empacar', 'Book', 'Confirm', 'Pack'])
    if (knownVerbs.has(first)) return `${first} →`
    return isES ? 'Hacer →' : 'Do now →'
  })()

  return (
    <>
      {/* ─────────────────────────── DESKTOP (≥820 px) ─────────────────── */}
      <div className="hidden min-[820px]:flex items-center h-[64px] gap-6">

        {/* LEFT — readiness % + sub + progress bar + urgency strip */}
        <div className="flex flex-col justify-center min-w-[220px] max-w-[280px] pr-5 border-r border-white/10">
          <div className="font-sans text-[13px] font-semibold text-white leading-tight">
            {headline}
          </div>
          <div className="font-sans text-[11px] text-white/55 mt-[2px]">
            {sub}
          </div>
          {totalChecks > 0 && (
            <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mt-[6px]">
              <div
                className="h-full bg-[#A8C4BE] rounded-full transition-all duration-700"
                style={{ width: `${readinessPct}%` }}
              />
            </div>
          )}
          {urgency && (
            <div
              className="font-mono text-[10px] font-medium tracking-[.08em] uppercase mt-[6px] flex items-center gap-1.5"
              style={{ color: urgencyColor }}
            >
              <span className="inline-block w-1 h-1 rounded-full" style={{ background: urgencyColor }} aria-hidden />
              {urgency.text}
            </div>
          )}
        </div>

        {/* CENTER — milestone pills */}
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto scrollbar-none">
          {milestones.map(m => (
            <MilestonePill
              key={m.id}
              label={isES ? m.labelES : m.labelEN}
              state={m.state}
              progress={m.matchedChecks > 0 ? `${m.doneChecks}/${m.matchedChecks}` : null}
            />
          ))}
        </div>

        {/* RIGHT — undo banner / next step / all-done */}
        {recent ? (
          <div className="flex items-center gap-3 pl-5 border-l border-white/10 shrink-0 max-w-[340px]">
            <div className="flex flex-col text-right min-w-0">
              <span className="font-mono text-[9px] font-medium tracking-[.14em] uppercase text-[#A8C4BE]">
                {isES ? '✓ Reservado' : '✓ Booked'}
              </span>
              <span className="font-sans text-[12px] text-white/55 truncate flex items-center gap-1.5 justify-end mt-[2px]">
                <span aria-hidden>{recent.icon}</span>
                <span className="truncate">{recent.text}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleUndo}
              className="font-sans text-[12px] font-semibold text-white bg-transparent hover:bg-white/10 transition-colors px-3.5 py-2 rounded-[4px] whitespace-nowrap shrink-0 border border-white/25"
            >
              {isES ? 'Deshacer' : 'Undo'}
            </button>
          </div>
        ) : nextCheck ? (
          <div className="flex items-center gap-3 pl-5 border-l border-white/10 shrink-0 max-w-[340px]">
            <div className="flex flex-col text-right min-w-0">
              <span className="font-mono text-[9px] font-medium tracking-[.14em] uppercase text-white/40">
                {nextLabel}
              </span>
              <span className="font-sans text-[12px] text-white/85 truncate flex items-center gap-1.5 justify-end mt-[2px]">
                <span aria-hidden>{nextCheck.icon}</span>
                <span className="truncate">{nextCheck.text}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleMarkDone}
              className="font-sans text-[12px] font-semibold text-white bg-[#E1615B] hover:bg-[#C94F49] transition-colors px-3.5 py-2 rounded-[4px] whitespace-nowrap shrink-0"
            >
              {ctaLabel}
            </button>
          </div>
        ) : hasItinerary ? (
          <div className="font-sans text-[12px] text-white/55 pl-5 border-l border-white/10 shrink-0">
            {tripReady
              ? (isES ? '¡Buen viaje! ✈️' : 'Safe travels ✈️')
              : (isES ? 'Sin pasos pendientes' : 'No pending steps')}
          </div>
        ) : null}
      </div>

      {/* ─────────────────────────── MOBILE (<820 px) ──────────────────── */}
      <div className="min-[820px]:hidden">
        {/* Collapsed pill */}
        <button
          type="button"
          onClick={() => setMobileOpen(o => !o)}
          aria-expanded={mobileOpen}
          className="flex items-center justify-between w-full h-[50px] gap-3 text-left"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="font-sans text-[13px] font-semibold text-white shrink-0">
              {totalChecks > 0 ? `${readinessPct}%` : ''}
            </span>
            <span className="font-sans text-[12px] text-white/70 truncate">
              {nextCheck
                ? `${nextCheck.icon} ${nextCheck.text}`
                : tripReady
                  ? (isES ? '✓ Tu viaje está listo' : '✓ Your trip is ready')
                  : headline}
            </span>
          </div>
          <span
            className={`text-white/60 text-[14px] transition-transform shrink-0 ${mobileOpen ? 'rotate-180' : ''}`}
            aria-hidden
          >⌄</span>
        </button>

        {/* Expanded panel — overlays content below; tap pill again to collapse */}
        {mobileOpen && (
          <div className="pt-1 pb-4 flex flex-col gap-3 border-t border-white/10">
            <div>
              <div className="font-sans text-[14px] font-semibold text-white">
                {headline}
              </div>
              <div className="font-sans text-[11px] text-white/55 mt-[2px]">
                {sub}
              </div>
              {totalChecks > 0 && (
                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-[#A8C4BE] rounded-full transition-all duration-700"
                    style={{ width: `${readinessPct}%` }}
                  />
                </div>
              )}
              {urgency && (
                <div
                  className="font-mono text-[10px] font-medium tracking-[.08em] uppercase mt-2 flex items-center gap-1.5"
                  style={{ color: urgencyColor }}
                >
                  <span className="inline-block w-1 h-1 rounded-full" style={{ background: urgencyColor }} aria-hidden />
                  {urgency.text}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {milestones.map(m => (
                <MilestonePill
                  key={m.id}
                  label={isES ? m.labelES : m.labelEN}
                  state={m.state}
                  progress={m.matchedChecks > 0 ? `${m.doneChecks}/${m.matchedChecks}` : null}
                />
              ))}
            </div>

            {recent ? (
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-mono text-[9px] font-medium tracking-[.14em] uppercase text-[#A8C4BE]">
                    {isES ? '✓ Reservado' : '✓ Booked'}
                  </span>
                  <span className="font-sans text-[13px] text-white/55 truncate flex items-center gap-1.5 mt-[2px]">
                    <span aria-hidden>{recent.icon}</span>
                    <span className="truncate">{recent.text}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="font-sans text-[12px] font-semibold text-white bg-transparent hover:bg-white/10 transition-colors px-3.5 py-2 rounded-[4px] whitespace-nowrap shrink-0 border border-white/25"
                >
                  {isES ? 'Deshacer' : 'Undo'}
                </button>
              </div>
            ) : nextCheck && (
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-mono text-[9px] font-medium tracking-[.14em] uppercase text-white/40">
                    {nextLabel}
                  </span>
                  <span className="font-sans text-[13px] text-white/85 truncate flex items-center gap-1.5 mt-[2px]">
                    <span aria-hidden>{nextCheck.icon}</span>
                    <span className="truncate">{nextCheck.text}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleMarkDone}
                  className="font-sans text-[12px] font-semibold text-white bg-[#E1615B] hover:bg-[#C94F49] transition-colors px-3.5 py-2 rounded-[4px] whitespace-nowrap shrink-0"
                >
                  {ctaLabel}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

// ── Milestone pill ─────────────────────────────────────────────────────────

function MilestonePill({
  label, state, progress,
}: {
  label:    string
  state:    MilestoneState
  progress: string | null
}) {
  // Visual treatment by state (aligned with StatusPill's whisper-or-solid
  // language, inverted for the Pine bar background):
  //   done    — sage fill on Pine, Pine text (moment of completion stays loud)
  //   pending — transparent, white/85 text, hairline ring (whisper)
  //   na      — transparent, white/30 text (almost invisible — dimmed)
  // Glyphs (● / ○ / ·) dropped — matches StatusPill xs default.
  const styles = state === 'done'
    ? 'bg-[#A8C4BE] text-[#0F3A33] border-transparent'
    : state === 'pending'
      ? 'bg-transparent text-white/85 border-white/20'
      : 'bg-transparent text-white/30 border-white/10'

  return (
    <div
      className={[
        'flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors shrink-0',
        styles,
      ].join(' ')}
    >
      <span className="font-sans text-[11px] font-medium whitespace-nowrap">{label}</span>
      {progress && state === 'pending' && (
        <span className="font-mono text-[9px] text-white/40 tabular-nums">{progress}</span>
      )}
    </div>
  )
}
