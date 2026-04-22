'use client'

/**
 * components/consent/PreferencesModal.tsx
 *
 * Second-layer cookie preferences panel. All non-essential toggles default
 * to OFF on first open. Strictly necessary is always ON and non-interactive.
 * Focus is trapped inside the modal while open (accessibility).
 */

import { useState, useEffect, useRef, type KeyboardEvent } from 'react'
import type { ConsentState, ConsentChoices } from '../../lib/consent'

// ── Toggle switch ──────────────────────────────────────────

function Toggle({
  id,
  checked,
  onChange,
  disabled = false,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent',
        'transition-colors duration-200 ease-in-out',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3A33]',
        checked ? 'bg-[#0F3A33]' : 'bg-neutral-200',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        aria-hidden
        className={[
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow',
          'ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}

// ── Category row ───────────────────────────────────────────

function CategoryRow({
  label,
  description,
  toggleId,
  checked,
  onChange,
  badge,
  disabled = false,
}: {
  label:       string
  description: string
  toggleId:    string
  checked:     boolean
  onChange:    (v: boolean) => void
  badge?:      string
  disabled?:   boolean
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-5 border-b border-[rgba(200,191,181,.35)] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <label
            htmlFor={toggleId}
            className="font-sans text-[14px] font-semibold text-[#0F3A33] cursor-pointer"
          >
            {label}
          </label>
          {badge && (
            <span className="font-sans text-[10px] font-semibold tracking-wide uppercase text-[#6B8F86] bg-[#EAF2F0] px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="font-sans text-[13px] text-[#6B8F86] leading-[1.6]">
          {description}
        </p>
      </div>
      <div className="shrink-0 pt-0.5">
        <Toggle
          id={toggleId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

// ── Modal ──────────────────────────────────────────────────

type Props = {
  current:       ConsentState | null
  onAcceptAll:   () => void
  onRejectAll:   () => void
  onSave:        (choices: ConsentChoices) => void
  onClose:       () => void
}

export function PreferencesModal({
  current,
  onAcceptAll,
  onRejectAll,
  onSave,
  onClose,
}: Props) {
  const [analytics,   setAnalytics]   = useState(current?.analytics   ?? false)
  const [marketing,   setMarketing]   = useState(current?.marketing   ?? false)
  const [preferences, setPreferences] = useState(current?.preferences ?? false)

  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on Escape (dismissal without saving — does NOT record consent)
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Trap focus inside modal
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]

    const trap = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    el.addEventListener('keydown', trap)
    first?.focus()
    return () => el.removeEventListener('keydown', trap)
  }, [])

  const handleSave = () =>
    onSave({ analytics, marketing, preferences })

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center"
      aria-modal="true"
      aria-label="Cookie preferences"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl"
        style={{ boxShadow: '0 24px 64px rgba(15,58,51,0.18)' }}
      >

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[rgba(200,191,181,.35)] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-sans text-[16px] font-semibold text-[#0F3A33]">
              Cookie preferences
            </h2>
            <p className="font-sans text-[12px] text-[#6B8F86] mt-0.5">
              Strictly necessary cookies are always active.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#6B8F86] hover:bg-[#F7F4EF] hover:text-[#0F3A33] transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="px-6">
          <CategoryRow
            label="Strictly necessary"
            description="Required for the platform to function — session management, security, and your saved consent choice. Cannot be disabled."
            toggleId="toggle-necessary"
            checked={true}
            onChange={() => {}}
            badge="Always active"
            disabled
          />
          <CategoryRow
            label="Analytics"
            description="Helps us understand which guides are read and how the platform is used. Data is pseudonymized and used only to improve LagomPlan. Provider: Google Analytics."
            toggleId="toggle-analytics"
            checked={analytics}
            onChange={setAnalytics}
          />
          <CategoryRow
            label="Marketing & affiliate tracking"
            description="When you click or book through our travel recommendations, these cookies let affiliate partners (e.g. Booking.com) attribute the referral and pay us a commission — at no cost to you. Declining this doesn't affect the prices you see or the links you can access."
            toggleId="toggle-marketing"
            checked={marketing}
            onChange={setMarketing}
          />
          <CategoryRow
            label="Preferences"
            description="Saves your settings such as language choice so you don't have to reselect them each visit. Declining resets your preferences on every visit."
            toggleId="toggle-preferences"
            checked={preferences}
            onChange={setPreferences}
          />
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white border-t border-[rgba(200,191,181,.35)] px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onRejectAll}
              className="flex-1 font-sans text-[12px] font-semibold text-[#0F3A33] bg-transparent border border-[rgba(200,191,181,.8)] rounded-full px-4 py-2.5 hover:bg-[#F7F4EF] transition-colors cursor-pointer"
            >
              Reject all
            </button>
            <button
              onClick={handleSave}
              className="flex-1 font-sans text-[12px] font-semibold text-[#0F3A33] bg-transparent border border-[rgba(200,191,181,.8)] rounded-full px-4 py-2.5 hover:bg-[#F7F4EF] transition-colors cursor-pointer"
            >
              Save preferences
            </button>
            <button
              onClick={onAcceptAll}
              className="flex-1 font-sans text-[12px] font-semibold text-white bg-[#0F3A33] border border-[#0F3A33] rounded-full px-4 py-2.5 hover:bg-[#1a4d44] transition-colors cursor-pointer"
            >
              Accept all
            </button>
          </div>
          <p className="font-sans text-[11px] text-[#6B8F86] text-center mt-3">
            You can update your preferences anytime via Cookie Settings in the footer.
          </p>
        </div>

      </div>
    </div>
  )
}
