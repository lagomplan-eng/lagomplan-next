/**
 * components/design/InfoCard.tsx
 *
 * Card 2 of 2: info card (radius 16, 1px line-soft border, white, no shadow, 24px padding).
 * For everything that is not a destination: tips, steps, products, landing blocks, form wrappers.
 * Pass `href` to make the whole card a link (border darkens on hover).
 */
import type { ElementType, ReactNode } from 'react'
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
  size?: 'md' | 'sm'
  className?: string
}

export default function InfoCard({ children, title, eyebrow, headingLevel = 3, href, as, size = 'md', className }: InfoCardProps) {
  const Tag: ElementType = href ? 'a' : (as ?? 'div')
  return (
    <Tag
      {...(href ? { href } : {})}
      data-card="info"
      className={cx(
        'block rounded-info border border-line-soft bg-white text-pine',
        size === 'md' ? 'p-6' : 'p-5',
        href && 'no-underline transition-colors hover:border-pine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fjord',
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && <CardTitle as={`h${headingLevel}`} className="text-[20px] leading-[1.2]">{title}</CardTitle>}
      {children && <div className={cx('font-sans text-small text-ink-2', title && 'mt-3')}>{children}</div>}
    </Tag>
  )
}
