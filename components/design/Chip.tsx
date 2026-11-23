'use client'
/**
 * components/design/Chip.tsx
 *
 * Chip: a toggle (aria-pressed). Colours are home's chip: white fill, 1px sage/22% border, sage-text text (home's sage darkened to 4.5:1), full radius;
 * selected = mint fill, pine/20% border, pine text; hover darkens the border.
 *   size="sm"  exactly home's interest chip (10px text, 24px high)
 *   size="md"  DERIVED for filters and touch: same shape and colours at 13px text, 44px high (the home pace toggle's height)
 * Tag (below) is DERIVED: the small non-interactive label on cards, in the chip colours.
 */
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

interface ChipProps {
  label: ReactNode
  selected: boolean
  onClick: () => void
  count?: number
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function Chip({ label, selected, onClick, count, disabled, size = 'md', className }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'inline-flex flex-none items-center gap-2 whitespace-nowrap rounded-full border font-sans transition-all',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fjord',
        size === 'sm' ? 'px-3 py-1.5 text-micro leading-none' : 'h-chip px-4 text-small',
        selected ? 'border-pine/20 bg-mint text-pine' : 'border-line-sage bg-white text-sage-text hover:border-pine/20',
        disabled && 'pointer-events-none opacity-45',
        className,
      )}
    >
      {label}
      {count !== undefined && <span className={cx('font-semibold', selected ? 'text-pine/70' : 'text-label')}>{count}</span>}
    </button>
  )
}

/** Small non-interactive label (card tags): the chip, unselected, at the sm size. */
export function Tag({ children, className, ...rest }: { children: ReactNode; className?: string } & Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children'>) {
  return (
    <span {...rest} className={cx('inline-flex items-center rounded-full border border-line-sage bg-white px-3 py-1.5 font-sans text-micro leading-none text-sage-text', className)}>
      {children}
    </span>
  )
}
