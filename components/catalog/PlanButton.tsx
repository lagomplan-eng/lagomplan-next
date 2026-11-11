'use client'

/**
 * components/catalog/PlanButton.tsx
 *
 * "+ Mi plan" ↔ "✓ En mi plan". `name` is the item it acts on, so a screen reader
 * hears which card the button belongs to.
 */

import { useTranslations } from 'next-intl'

interface Props {
  pressed: boolean
  onClick: () => void
  name?: string
}

export default function PlanButton({ pressed, onClick, name }: Props) {
  const t = useTranslations('catalog.plan')
  const label = pressed ? t('added') : t('add')
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={name ? `${label}: ${name}` : undefined}
      onClick={onClick}
      className={[
        'inline-flex min-h-[44px] flex-none items-center whitespace-nowrap rounded-full border px-4 text-[14px] font-bold transition-colors',
        pressed ? 'border-pine bg-pine text-cream' : 'border-line-btn bg-white text-pine hover:border-pine',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
