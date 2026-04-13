/**
 * components/guides/GuideSection.tsx
 *
 * Single editorial section rendered as a Trip-style card.
 * Wraps heading + body in a rounded white card matching the GuideItinerary
 * day-card style. Accepts an optional inline Lagom tip callout.
 */

import type { ReactNode } from 'react'

interface Props {
  label?:    string       // eyebrow label (e.g. "Gastronomía")
  heading:   string       // section heading
  children:  ReactNode    // body content
  tip?:      string       // optional Lagom tip (inline callout)
  className?: string
}

export function GuideSection({ label, heading, children, tip, className = '' }: Props) {
  return (
    <div
      className={`bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)] hover:shadow-[0_2px_8px_rgba(15,58,51,.07)] transition-shadow ${className}`}
    >
      {/* Card header */}
      <div className="px-6 pt-5 pb-4">
        {label && (
          <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-[5px]">
            {label}
          </div>
        )}
        <h2
          className="font-sans font-bold text-[#0F3A33] leading-[1.1] tracking-[-0.4px]"
          style={{ fontSize: 'clamp(16px, 2.2vw, 20px)' }}
        >
          {heading}
        </h2>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E4DFD8]" />

      {/* Body */}
      <div className="px-6 pt-4 pb-5 font-sans text-[14px] leading-[1.8] text-[#4A4A46]">
        {children}
      </div>

      {/* Lagom tip — only shown when tip text is provided */}
      {tip && (
        <div className="px-6 pb-5 -mt-1">
          <div
            className="flex gap-3 px-4 py-3.5 rounded-[10px] border"
            style={{
              background: 'rgba(107,143,134,.08)',
              borderColor: 'rgba(107,143,134,.22)',
            }}
          >
            {/* Left accent rail */}
            <div
              className="flex-shrink-0 w-[3px] rounded-full self-stretch"
              style={{ background: '#6B8F86', minHeight: '36px' }}
            />
            <p className="font-sans text-[12.5px] text-[#0F3A33] leading-[1.75]">
              <span className="mr-1.5">💡</span>
              {tip}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
