/**
 * components/guides/RightColumn/PlanCTA.tsx
 *
 * Pine-background conversion module — the "convert this guide to a trip" CTA.
 * Placed after Tips so the user sees value before the ask.
 */

import type { PlanCtaSection } from '../../../lib/data/guides/types'

interface Props {
  data: PlanCtaSection
  plannerHref: string
}

export function PlanCTA({ data, plannerHref }: Props) {
  return (
    <div data-guide="plan-cta" className="bg-[#0F3A33] border-transparent rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,58,51,.06)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 pb-[14px] border-b border-[rgba(255,255,255,.12)]">
        <div>
          <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[rgba(255,255,255,.5)] mb-0.5">
            {data.eyebrow}
          </div>
          <div className="font-sans text-[16px] font-semibold tracking-[-0.01em] text-white">
            {data.title}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 pb-5">
        <p className="text-[12.5px] font-light text-[rgba(255,255,255,.7)] leading-[1.55] mb-4">
          {data.description}
        </p>
        <a
          href={plannerHref}
          className="flex items-center justify-center gap-2 w-full font-mono text-[11px] font-medium tracking-[.1em] uppercase text-[#0F3A33] bg-[#EDE7E1] px-5 py-3 rounded-lg transition-all hover:bg-white hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,.12)]"
        >
          {data.buttonText}
        </a>
      </div>
    </div>
  )
}
