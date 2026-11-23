'use client'

/**
 * components/guides/RightColumn/Transport.tsx
 *
 * "How to get there" accordion module — collapsed by default.
 * Expand reveals transport options with descriptions and tips.
 */

import { useState } from 'react'
import type { TransportSection } from '../../../lib/data/guides/types'
import { CardTitle, Eyebrow, InfoCard, Tag } from '../../design'

interface Props {
  data: TransportSection
}

export function Transport({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <InfoCard size="flush" data-guide="transport">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer select-none items-center justify-between border-b border-line-soft px-5 py-4 text-left transition-colors hover:bg-sand/40"
        style={{ borderBottomWidth: isOpen ? 1 : 0 }}
      >
        <div>
          <Eyebrow as="div" data-pl="mod-eyebrow" className="!mb-1">
            {data.eyebrow}
          </Eyebrow>
          <CardTitle as="div" data-pl="mod-title" className="!text-[20px] !leading-[1.2]">
            {data.title}
          </CardTitle>
        </div>
        <span
          className="inline-block text-tiny text-label transition-transform duration-300"
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
            className="border-b border-line-soft px-5 py-4 last:border-0"
          >
            {/* Option header */}
            <div data-transport="header" className="mb-2 flex items-center gap-2">
              <span data-transport="icon" className="text-body">{opt.icon}</span>
              <span data-transport="name" className="flex-1 text-small font-semibold text-pine">
                {opt.name}
              </span>
              <Tag data-transport="badge">{opt.badge}</Tag>
            </div>
            {/* Description */}
            <p data-transport="description" className="m-0 text-small text-ink-2">
              {opt.description}
            </p>
            {/* Tip callout */}
            {opt.tip && (
              <div data-transport="tip" className="mt-2.5 rounded-r-lg border-l-2 border-sage bg-mint px-3 py-2 text-tiny text-ink-2">
                {opt.tip}
              </div>
            )}
          </div>
        ))}
      </div>
    </InfoCard>
  )
}
