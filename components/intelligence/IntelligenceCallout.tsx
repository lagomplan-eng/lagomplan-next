/**
 * components/intelligence/IntelligenceCallout.tsx
 *
 * Renders the actionable Intelligence Foundation flags below a day's
 * activity list. Filters to severity 'warning' and 'critical' — 'info'
 * flags are deliberately suppressed (they'd add noise without changing
 * user behaviour).
 *
 * Design constraints (from spec):
 *   - Manrope only.
 *   - Tone: calm + informational. Even 'critical' should feel like
 *     thoughtful advice from a knowledgeable friend, never alarm.
 *   - Max 2 callouts per day — if the engine emits more, the rest are
 *     silently dropped. Two is the cap because real users skim and a
 *     wall of cautions becomes invisible.
 *   - No icons that read as alarms (no ❌, ⛔, 🚨). Subtle dot + soft
 *     left border carry the visual weight instead.
 *   - Mobile-first; renders at 375px.
 *
 * Color tokens:
 *   warning  → amber-tinted border, sand-tinted background
 *   critical → soft coral border + tint
 *
 * Usage:
 *   <IntelligenceCallout flags={day.flags} />
 *
 * Returns null when there are no warning/critical flags — the caller
 * can render it unconditionally and the layout collapses naturally.
 */

import type { DayFlag } from '../../types/intelligence'

interface IntelligenceCalloutProps {
  flags: DayFlag[]
}

const SEVERITY_TOKENS: Record<'warning' | 'critical', {
  bg: string
  borderLeft: string
  dot: string
  ink: string
  inkSoft: string
}> = {
  // Amber wash with a sand border. Reads as "considered note", not "alarm".
  warning: {
    bg:         'bg-[rgba(218,165,32,.06)]',
    borderLeft: 'border-l-[#D4A35E]',
    dot:        'bg-[#B88A4B]',
    ink:        'text-[#5A4423]',
    inkSoft:    'text-[#6F5634]',
  },
  // Soft coral. Same family as the Pesado day label so the visual language
  // is consistent across the intelligence surface.
  critical: {
    bg:         'bg-[rgba(225,97,91,.06)]',
    borderLeft: 'border-l-[#E1615B]',
    dot:        'bg-[#C24A45]',
    ink:        'text-[#8E2C26]',
    inkSoft:    'text-[#A03B35]',
  },
}

export default function IntelligenceCallout({ flags }: IntelligenceCalloutProps) {
  // Filter to actionable severities + cap at 2. The order respects whatever
  // the engine emitted — typically the most important flag first.
  const visible = flags
    .filter(f => f.severity === 'warning' || f.severity === 'critical')
    .slice(0, 2)

  if (visible.length === 0) return null

  return (
    <div className="flex flex-col gap-2 mt-3">
      {visible.map((flag, i) => {
        const t = SEVERITY_TOKENS[flag.severity as 'warning' | 'critical']
        return (
          <div
            key={`${flag.type}-${i}`}
            className={[
              'flex gap-2.5 px-3 py-2.5 rounded-r-[8px] border-l-[3px]',
              t.bg, t.borderLeft,
            ].join(' ')}
            role="note"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${t.dot} shrink-0 mt-[7px]`}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className={`font-sans text-[12px] leading-[1.5] ${t.ink}`}>
                {flag.message}
              </p>
              {flag.suggestion && (
                <p className={`font-sans text-[11px] leading-[1.5] mt-0.5 ${t.inkSoft} opacity-90`}>
                  {flag.suggestion}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
