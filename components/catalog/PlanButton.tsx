'use client'

/**
 * components/catalog/PlanButton.tsx
 *
 * "+ Mi plan" ↔ "✓ En mi plan": the shared Chip. `name` is the item it acts on, so a screen reader
 * hears which card the button belongs to.
 */

import { useTranslations } from 'next-intl'
import { Chip } from '../design'

interface Props {
  pressed: boolean
  onClick: () => void
  name?: string
}

export default function PlanButton({ pressed, onClick, name }: Props) {
  const t = useTranslations('catalog.plan')
  const label = pressed ? t('added') : t('add')
  return <Chip label={label} selected={pressed} onClick={onClick} ariaLabel={name ? `${label}: ${name}` : undefined} />
}
