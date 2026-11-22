/**
 * components/design/InfoCard.tsx
 *
 * Card 2 of 2: for everything that is not a destination. Home has two of these and both are here:
 *   cream (default)  home's review card: cream fill, 1px hairline border (line-strong at 22%), radius 12,
 *                    padding 36 (28 on mobile), no shadow. Sits on a white section.
 *   white            home's planner card: white, 1px #E5E5E5 border, radius 12, shadow 0 4px 24px pine/6%,
 *                    padding 20/24/16/24.
 * DERIVED (home has no example): `mint` (home's selected tint), `pine` (inverted block), `size="sm"`, `flush`, `href`.
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
  /** md = home padding, sm = 20px (derived), flush = none (the caller pads: accordions, row lists). */
  size?: 'md' | 'sm' | 'flush'
  tone?: 'cream' | 'white' | 'mint' | 'pine'
  className?: string
}

const TONE = {
  cream: 'border-line-hair bg-cream text-pine',
  white: 'border-line-form bg-white text-pine shadow-form',
  mint: 'border-line-sage bg-mint text-pine',
  pine: 'border-pine bg-pine text-cream',
} as const

export default function InfoCard({ children, title, eyebrow, headingLevel = 3, href, as, size = 'md', tone = 'cream', className, ...rest }: InfoCardProps & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children' | 'title'>) {
  const Tag: ElementType = href ? 'a' : (as ?? 'div')
  const pad =
    size === 'flush' ? 'overflow-hidden'
    : size === 'sm' ? 'p-5'
    : tone === 'white' ? 'px-6 pb-4 pt-5'
    : 'p-9 max-md:p-7'
  return (
    <Tag
      {...rest}
      {...(href ? { href } : {})}
      data-card="info"
      className={cx(
        'block rounded-info border', TONE[tone], pad,
        href && 'no-underline transition-colors hover:border-pine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fjord',
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && <CardTitle as={`h${headingLevel}`} className="!text-h4">{title}</CardTitle>}
      {/* With a title or eyebrow the body is wrapped (and gets the body text style); a bare card renders its children as given. */}
      {children && (title || eyebrow ? <div className={cx('font-sans text-small', tone === 'pine' ? 'text-cream/80' : 'text-ink-body', title && 'mt-3')}>{children}</div> : children)}
    </Tag>
  )
}
