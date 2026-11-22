/**
 * components/design/Typography.tsx
 *
 * Eyebrow, PageTitle (H1), SectionTitle (H2), CardTitle (H3), Lede, Body.
 * Every value is home's (www.lagomplan.com/es), read from the --fs-* / --lh-* / --ls-* / --fw-* tokens;
 * measured table in docs/design/home-canon.md.
 */
import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

/** Extra attributes a caller may need on the element itself (id, data-*, aria-*): print and analytics hooks. */
type Passthrough = Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>

/** Home's .sec-label: 11px, 500, 0.12em, uppercase, sage, 12px below. */
export function Eyebrow({ children, className, as: Tag = 'p', ...rest }: { children: ReactNode; className?: string; as?: ElementType } & Passthrough) {
  return <Tag {...rest} className={cx('m-0 mb-3 block font-sans text-eyebrow uppercase text-sage', className)}>{children}</Tag>
}

/** Home's lede: 15px, ink-body, line-height 1.7 (1.75 under the H1). */
export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('m-0 font-sans text-lede text-ink-body [text-wrap:balance]', className)}>{children}</p>
}

/** Home's paragraph: 15px, line-height 1.8. `tone="strong"` is pine (first paragraph), default is ink-body. */
export function Body({ children, className, tone = 'body' }: { children: ReactNode; className?: string; tone?: 'body' | 'strong' }) {
  return <p className={cx('m-0 font-sans text-body [text-wrap:pretty]', tone === 'strong' ? 'text-pine' : 'text-ink-body', className)}>{children}</p>
}

interface PageTitleProps {
  title: ReactNode
  eyebrow?: ReactNode
  lede?: ReactNode
  className?: string
  /** Extra content under the lede (actions, search…). */
  children?: ReactNode
}

/** Page header: optional eyebrow, the H1 (home: 60px / 700 / -1.5px, 40px on mobile), optional lede (max 360px). */
export function PageTitle({ title, eyebrow, lede, className, children }: PageTitleProps) {
  return (
    <header className={cx('flex flex-col', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="m-0 mb-5 font-sans text-title text-pine [text-wrap:balance]">{title}</h1>
      {lede && <Lede className="max-w-[360px] !leading-[1.75] max-md:max-w-full">{lede}</Lede>}
      {children}
    </header>
  )
}

interface SectionTitleProps {
  children: ReactNode
  eyebrow?: ReactNode
  lede?: ReactNode
  className?: string
  /** The closing call-to-action size (home: 50px, 34px on mobile). */
  size?: 'default' | 'xl'
  /** Attributes for the eyebrow / the h2 themselves (data-* hooks used by print CSS, ids). */
  eyebrowProps?: Passthrough
  titleProps?: Passthrough
}

/** Section heading (H2: home 40px / 700, 30px on mobile) with optional eyebrow and lede (max 520px). */
export function SectionTitle({ children, eyebrow, lede, className, size = 'default', eyebrowProps, titleProps }: SectionTitleProps) {
  return (
    <div className={cx('flex flex-col', className)}>
      {eyebrow && <Eyebrow {...eyebrowProps}>{eyebrow}</Eyebrow>}
      <h2 {...titleProps} className={cx('m-0 font-sans text-pine [text-wrap:balance]', size === 'xl' ? 'text-h2-xl' : 'text-h2')}>{children}</h2>
      {lede && <Lede className="mt-4 max-w-[520px]">{lede}</Lede>}
    </div>
  )
}

/** Card title (H3 by default; pass `as` to keep the outline correct): the home guide-card title, 22px / 400 / -0.02em. */
export function CardTitle({ children, as: Tag = 'h3', className, ...rest }: { children: ReactNode; as?: ElementType; className?: string } & Passthrough) {
  return <Tag {...rest} className={cx('m-0 font-sans text-h3 text-pine [text-wrap:balance]', className)}>{children}</Tag>
}
