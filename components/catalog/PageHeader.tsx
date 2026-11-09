/**
 * components/catalog/PageHeader.tsx
 *
 * Eyebrow + H1 + subtitle, with an optional aside (right on desktop, below on mobile).
 */

import type { ReactNode } from 'react'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  aside?: ReactNode
}

export default function PageHeader({ eyebrow, title, subtitle, aside }: Props) {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
      <div className="flex min-w-0 max-w-[760px] flex-col gap-3">
        <p className="m-0 text-[13px] font-bold uppercase tracking-[.16em] text-label">{eyebrow}</p>
        <h1 className="m-0 text-[34px] font-extrabold leading-[1.04] tracking-[-0.035em] text-pine md:text-[56px]">{title}</h1>
        {subtitle && <p className="m-0 text-[16px] leading-[1.55] text-ink-2 md:text-[18px]">{subtitle}</p>}
      </div>
      {aside && <div className="min-w-0 md:max-w-[360px] md:flex-none">{aside}</div>}
    </header>
  )
}
