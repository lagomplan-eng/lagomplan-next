/**
 * components/design/Typography.tsx
 *
 * Eyebrow, PageTitle, SectionTitle (H2), CardTitle (H3), Lede.
 * The page title is the /guias H1 (clamp 44-72px, 800, -0.04em, line-height .92, pine); H2, H3 and the
 * eyebrow are derived from the same page. Sizes come from the --fs-* / --lh-* / --ls-* tokens.
 */
import type { ElementType, ReactNode } from 'react'
import { cx } from './cx'

export function Eyebrow({ children, className, as: Tag = 'p' }: { children: ReactNode; className?: string; as?: ElementType }) {
  return <Tag className={cx('m-0 mb-3 block font-sans text-eyebrow uppercase text-sage-text', className)}>{children}</Tag>
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('m-0 max-w-[36ch] font-sans text-lede text-[color:var(--text-lede)]', className)}>{children}</p>
}

interface PageTitleProps {
  title: ReactNode
  eyebrow?: ReactNode
  lede?: ReactNode
  className?: string
  /** Extra content under the lede (actions, search…). */
  children?: ReactNode
}

/** Page header: optional eyebrow, the H1, optional lede. One per page. */
export function PageTitle({ title, eyebrow, lede, className, children }: PageTitleProps) {
  return (
    <header className={cx('flex flex-col', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="m-0 font-sans text-title text-pine">{title}</h1>
      {lede && <Lede className="mt-7">{lede}</Lede>}
      {children}
    </header>
  )
}

interface SectionTitleProps {
  children: ReactNode
  eyebrow?: ReactNode
  lede?: ReactNode
  className?: string
}

/** Section heading (H2) with optional eyebrow and lede. */
export function SectionTitle({ children, eyebrow, lede, className }: SectionTitleProps) {
  return (
    <div className={cx('flex flex-col', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="m-0 font-sans text-h2 text-pine">{children}</h2>
      {lede && <Lede className="mt-4">{lede}</Lede>}
    </div>
  )
}

/** Card / sub-section title (H3 by default; pass `as` to keep the outline correct). */
export function CardTitle({ children, as: Tag = 'h3', className }: { children: ReactNode; as?: ElementType; className?: string }) {
  return <Tag className={cx('m-0 font-sans text-h3 text-pine', className)}>{children}</Tag>
}
