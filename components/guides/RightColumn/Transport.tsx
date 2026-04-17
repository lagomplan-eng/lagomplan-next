'use client'

/**
 * components/guides/RightColumn/Transport.tsx
 *
 * "How to get there" accordion module — collapsed by default.
 * Expand reveals transport options with descriptions and tips.
 */

import { useState } from 'react'
import type { TransportSection } from '../../../lib/data/guides/types'

interface Props {
  data: TransportSection
}

export function Transport({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div data-guide="transport" className="bg-white border border-[#E2DDD5] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,58,51,.06)]">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="w-full text-left flex items-center justify-between px-5 py-4 pb-[14px] border-b border-[#E2DDD5] cursor-pointer select-none hover:bg-[rgba(15,58,51,.02)] transition-colors"
        style={{ borderBottomWidth: isOpen ? 1 : 0 }}
      >
        <div>
          <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#BDBDBD] mb-0.5">
            {data.eyebrow}
          </div>
          <div className="font-display text-[16px] font-normal tracking-[-0.01em] text-[#1A1A1A]">
            {data.title}
          </div>
        </div>
        <span
          className="font-mono text-[10px] font-medium tracking-[.06em] text-[#8A8A8A] inline-block transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {/* Body */}
      <div
        className="overflow-hidden"
        style={{
          maxHeight: isOpen ? '800px' : '0',
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.4s ease, opacity 0.3s',
        }}
      >
        {data.options.map((opt, i) => (
          <div
            key={i}
            data-transport="option"
            className="px-5 py-4 border-b border-[#E2DDD5] last:border-0"
          >
            {/* Option header */}
            <div data-transport="header" className="flex items-center gap-2 mb-2">
              <span data-transport="icon" className="text-[15px]">{opt.icon}</span>
              <span data-transport="name" className="text-[13px] font-medium text-[#1A1A1A] flex-1">
                {opt.name}
              </span>
              <span data-transport="badge" className="font-mono text-[9px] font-medium tracking-[.08em] uppercase text-[#8A8A8A] bg-[#EDE7E1] px-[7px] py-[2px] rounded-full border border-[#E2DDD5]">
                {opt.badge}
              </span>
            </div>
            {/* Description */}
            <p data-transport="description" className="text-[12px] font-light text-[#4A4A4A] leading-[1.6]">
              {opt.description}
            </p>
            {/* Tip callout */}
            {opt.tip && (
              <div data-transport="tip" className="mt-2.5 p-[8px_12px] bg-[#E8F0EE] border-l-2 border-[#6B8F86] rounded-r-[4px] text-[11px] font-normal text-[#2D6B5A] leading-[1.5]">
                {opt.tip}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
