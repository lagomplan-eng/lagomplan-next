'use client'

/**
 * components/guides/RightColumn/Checklist.tsx
 *
 * Interactive packing checklist with progress bar.
 * Items toggle on click; full completion triggers a toast.
 */

import { useState, useCallback } from 'react'
import type { ChecklistSection } from '../../../lib/data/guides/types'
import { Button, CardTitle, Eyebrow, InfoCard } from '../../design'

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
    <InfoCard size="flush" data-guide="checklist">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
        <div>
          <Eyebrow as="div" className="!mb-1">
            {data.eyebrow}
          </Eyebrow>
          <CardTitle as="div" className="!text-[20px] !leading-[1.2]">
            {data.title}
          </CardTitle>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 pt-4">
        {/* Progress bar */}
        <div className="mb-3.5 flex items-center gap-2.5 border-b border-line-soft pb-3">
          <span className="text-tiny font-bold text-pine">
            {doneCount} / {total}
          </span>
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-line-soft">
            <div
              className="h-full rounded-full bg-sage"
              style={{ width: `${progress}%`, transition: 'width 0.4s ease' }}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset
          </Button>
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
                className="-mx-1 flex cursor-pointer select-none items-center gap-2.5 rounded-sm border-b border-line-soft px-1 py-[9px] transition-colors last:border-0 hover:bg-sand/40"
              >
                {/* Checkbox */}
                <div
                  data-check="box"
                  className={`flex size-[17px] flex-shrink-0 items-center justify-center rounded-[4px] border transition-all ${done ? 'border-pine bg-pine' : 'border-line-strong bg-white'}`}
                >
                  {done && (
                    <span className="text-[9px] font-bold leading-none text-white">✓</span>
                  )}
                </div>
                {/* Emoji */}
                <span data-check="emoji" className="w-[18px] flex-shrink-0 text-center text-small">
                  {item.emoji}
                </span>
                {/* Label */}
                <span
                  data-check="label"
                  className={`flex-1 text-small transition-colors ${done ? 'text-label line-through' : 'text-ink-2'}`}
                >
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </InfoCard>
  )
}
