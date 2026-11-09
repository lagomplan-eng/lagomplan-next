'use client'

/**
 * components/catalog/Chip.tsx
 *
 * Filter chip shared by Experiencias, Hoteles and Smart Finds. A toggle: it
 * carries aria-pressed. No emoji and no disabled "coming soon" chips; a value
 * that can't be chosen simply isn't rendered.
 */

interface Props {
  label: string
  selected: boolean
  onClick: () => void
}

export default function Chip({ label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        'inline-flex min-h-[44px] flex-none items-center whitespace-nowrap rounded-full border px-[18px] text-[15px] font-semibold transition-colors',
        selected
          ? 'border-pine bg-pine text-cream'
          : 'border-line-chip bg-white text-pine hover:border-pine',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
