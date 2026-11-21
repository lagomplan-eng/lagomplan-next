'use client'
/**
 * components/design/Chip.tsx
 *
 * Filter chip: a toggle (aria-pressed), 44px, pill. Selected = pine fill.
 * Tag (below) is its non-interactive sibling: the small label on cards.
 */
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

interface ChipProps {
  label: ReactNode
  selected: boolean
  onClick: () => void
  count?: number
  disabled?: boolean
  className?: string
}

export default function Chip({ label, selected, onClick, count, disabled, className }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'inline-flex h-chip flex-none items-center gap-2 whitespace-nowrap rounded-full border px-[18px] font-sans text-[15px] font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fjord',
        selected ? 'border-pine bg-pine text-cream' : 'border-line-chip bg-white text-pine hover:border-pine',
        disabled && 'pointer-events-none opacity-45',
        className,
      )}
    >
      {label}
      {count !== undefined && <span className={cx('text-[13px] font-bold', selected ? 'text-cream/80' : 'text-label')}>{count}</span>}
    </button>
  )
}

/** Small non-interactive label (card tags). */
export function Tag({ children, className, ...rest }: { children: ReactNode; className?: string } & Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children'>) {
  return (
    <span {...rest} className={cx('inline-flex items-center rounded-full border border-line-strong bg-sand px-2.5 py-1.5 font-sans text-[11px] font-medium leading-none text-pine/70', className)}>
      {children}
    </span>
  )
}
