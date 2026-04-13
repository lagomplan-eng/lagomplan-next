/**
 * components/guides/RightColumn/Tips.tsx
 *
 * Lagom Tips module — curated advice list + optional fun fact callout.
 * First module in the right column (builds trust before the CTA).
 */

import type { TipsSection } from '../../../lib/data/guides/types'

interface Props {
  data: TipsSection
}

export function Tips({ data }: Props) {
  return (
    <div className="bg-white border border-[#E2DDD5] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,58,51,.06)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 pb-[14px] border-b border-[#E2DDD5]">
        <div>
          <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#BDBDBD] mb-0.5">
            {data.eyebrow}
          </div>
          <div className="font-display text-[16px] font-normal tracking-[-0.01em] text-[#1A1A1A]">
            {data.title}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 pb-5">
        <div className="flex flex-col">
          {data.items.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 py-[11px] border-b border-[#E2DDD5] last:border-0 text-[12.5px] font-light text-[#4A4A4A] leading-[1.55]"
            >
              <span className="w-[5px] h-[5px] rounded-full bg-[#6B8F86] flex-shrink-0 mt-[7px]" />
              {tip}
            </div>
          ))}
        </div>

        {/* Fun fact callout */}
        {data.funFact && (
          <div className="mt-3 bg-[rgba(107,143,134,.06)] border border-[rgba(107,143,134,.2)] rounded-lg p-[14px_16px]">
            <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#6B8F86] mb-1.5">
              {data.funFact.eyebrow}
            </div>
            <p className="text-[12px] font-light text-[#4A4A4A] leading-[1.6] italic">
              {data.funFact.text}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
