'use client'

/**
 * components/guides/RightColumn/Checklist.tsx
 *
 * Interactive packing checklist with progress bar.
 * Items toggle on click; full completion triggers a toast.
 */

import { useState, useCallback } from 'react'
import type { ChecklistSection } from '../../../lib/data/guides/types'

interface Props {
  data: ChecklistSection
  onToast?: (msg: string) => void
  completionMessage?: string
}

export function Checklist({ data, onToast, completionMessage }: Props) {
  const total = data.items.length
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const toggle = useCallback(
    (index: number) => {
      setChecked((prev) => {
        const next = new Set(prev)
        if (next.has(index)) {
          next.delete(index)
        } else {
          next.add(index)
          if (next.size === total && completionMessage) {
            onToast?.(completionMessage)
          }
        }
        return next
      })
    },
    [total, completionMessage, onToast],
  )

  const reset = () => setChecked(new Set())
  const doneCount = checked.size
  const progress = total > 0 ? (doneCount / total) * 100 : 0

  return (
    <div data-guide="checklist" className="bg-white border border-[#E2DDD5] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,58,51,.06)]">
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
        {/* Progress bar */}
        <div className="flex items-center gap-2.5 mb-3.5 pb-3 border-b border-[#E2DDD5]">
          <span className="font-mono text-[11px] font-medium text-[#0F3A33] tracking-[.04em]">
            {doneCount} / {total}
          </span>
          <div className="flex-1 h-[3px] bg-[#E2DDD5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6EBD9F] rounded-full"
              style={{ width: `${progress}%`, transition: 'width 0.4s ease' }}
            />
          </div>
          <button
            type="button"
            onClick={reset}
            className="font-mono text-[9px] font-medium tracking-[.08em] uppercase text-[#BDBDBD] hover:text-[#8A8A8A] transition-colors py-[3px]"
          >
            Reset
          </button>
        </div>

        {/* Items */}
        <div className="flex flex-col">
          {data.items.map((item, i) => {
            const done = checked.has(i)
            return (
              <div
                key={i}
                data-check="item"
                role="checkbox"
                aria-checked={done}
                tabIndex={0}
                onClick={() => toggle(i)}
                onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? toggle(i) : undefined}
                className="flex items-center gap-2.5 py-[9px] border-b border-[#E2DDD5] last:border-0 cursor-pointer select-none hover:bg-[rgba(15,58,51,.03)] rounded-sm -mx-1 px-1 transition-colors"
              >
                {/* Checkbox */}
                <div
                  data-check="box"
                  className="w-[17px] h-[17px] rounded-[4px] border border-[#C8C2B8] flex items-center justify-center flex-shrink-0 transition-all"
                  style={done ? { background: '#0F3A33', borderColor: '#0F3A33' } : { background: 'white' }}
                >
                  {done && (
                    <span className="text-[9px] text-white font-bold leading-none">✓</span>
                  )}
                </div>
                {/* Emoji */}
                <span data-check="emoji" className="text-[13px] flex-shrink-0 w-[18px] text-center">
                  {item.emoji}
                </span>
                {/* Label */}
                <span
                  data-check="label"
                  className="text-[12.5px] font-light flex-1 leading-[1.35] transition-colors"
                  style={done ? { color: '#BDBDBD', textDecoration: 'line-through' } : { color: '#4A4A4A' }}
                >
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
