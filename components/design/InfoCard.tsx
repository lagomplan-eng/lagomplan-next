/**
 * components/design/InfoCard.tsx
 *
 * Card 2 of 2: info card (radius 16, 1px line-soft border, white, no shadow, 24px padding).
 * For everything that is not a destination: tips, steps, products, landing blocks, form wrappers.
 * Pass `href` to make the whole card a link (border darkens on hover).
 */
import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { CardTitle, Eyebrow } from './Typography'
import { cx } from './cx'

interface InfoCardProps {
  children?: ReactNode
  title?: ReactNode
  eyebrow?: ReactNode
  /** Heading level of `title` (default 3). */
  headingLevel?: 2 | 3 | 4
  href?: string
  as?: ElementType
  /** md = 24px padding, sm = 20px, flush = none (the caller pads: accordions, lists with row dividers). */
  size?: 'md' | 'sm' | 'flush'
  /** Fill: white (default), sand (soft panel), mint (soft green callout) or pine (inverted call to action). */
  tone?: 'white' | 'sand' | 'mint' | 'pine'
  className?: string
}

const TONE = {
  white: 'border-line-soft bg-white text-pine',
  sand: 'border-line-strong bg-sand text-pine',
  mint: 'border-line-chip bg-mint text-pine',
  pine: 'border-pine bg-pine text-cream',
} as const

export default function InfoCard({ children, title, eyebrow, headingLevel = 3, href, as, size = 'md', tone = 'white', className, ...rest }: InfoCardProps & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children' | 'title'>) {
  const Tag: ElementType = href ? 'a' : (as ?? 'div')
  return (
    <Tag
      {...rest}
      {...(href ? { href } : {})}
      data-card="info"
      className={cx(
        'block rounded-info border', TONE[tone],
        size === 'md' && 'p-6', size === 'sm' && 'p-5', size === 'flush' && 'overflow-hidden',
        href && 'no-underline transition-colors hover:border-pine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fjord',
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && <CardTitle as={`h${headingLevel}`} className="text-[20px] leading-[1.2]">{title}</CardTitle>}
      {/* With a title or eyebrow the body is wrapped (and gets the body text style); a bare card renders its children as given. */}
      {children && (title || eyebrow ? <div className={cx('font-sans text-small text-ink-2', title && 'mt-3')}>{children}</div> : children)}
    </Tag>
  )
}
