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

import { useState } from 'react'
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
  /** Optional CTA handler; if absent, the button still renders but is inert. */
  onNextStepClick?: () => void
}

export default function TripReadinessBar({
  readinessPct, totalChecks, doneChecks, pendingCount,
  milestones, nextCheck, daysCount, locale, onNextStepClick,
}: Props) {
  const isES = locale === 'es'
  const [mobileOpen, setMobileOpen] = useState(false)

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

        {/* LEFT — readiness % + sub + progress bar */}
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

        {/* RIGHT — next step + CTA */}
        {nextCheck ? (
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
              onClick={onNextStepClick}
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

            {nextCheck && (
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
                  onClick={onNextStepClick}
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
