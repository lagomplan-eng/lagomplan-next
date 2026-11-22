/**
 * components/design/DestinationCard.tsx
 *
 * Card 1 of 2: destination card (illustration on top). For guides, experiences and hotels.
 * Visual source: home's guide card (GuidesPreview): white, radius 22, no border, shadow-sm (shadow-md on hover),
 * image 4:3 on sand that zooms 1.04 on hover, body padding 24, title 22/400/-0.02em, excerpt 15px in ink-card.
 * DERIVED (home has no example): the small eyebrow, `badge`, `tags`, `cta`, `footer`, and `featured` (title over the image).
 * The whole card is one link; the optional `cta` is a pill-looking span (never a nested link).
 */
import Image from 'next/image'
import type { ReactNode } from 'react'
import { Tag } from './Chip'
import { cx } from './cx'

export interface DestinationCardProps {
  href: string
  image: { src: string; alt: string }
  title: string
  /** Small caps line above the title (destination, region…). */
  eyebrow?: string
  excerpt?: string
  tags?: string[]
  /** Top-right glass badge on the image (e.g. "Featured"). */
  badge?: string
  /** Pill label at the end of the card (looks like the primary button). */
  cta?: string
  /** Title over the image instead of below it. */
  featured?: boolean
  /** Heading level of the title (default 3). */
  headingLevel?: 2 | 3 | 4
  className?: string
  /** Extra footer content (price line, provider…). */
  footer?: ReactNode
}

export default function DestinationCard({
  href, image, title, eyebrow, excerpt, tags, badge, cta, featured, headingLevel = 3, className, footer,
}: DestinationCardProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  return (
    <a href={href} className={cx('group block h-full text-pine no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fjord rounded-destination', className)}>
      <article data-card="destination" className="flex h-full flex-col overflow-hidden rounded-destination bg-white shadow-soft transition-shadow group-hover:shadow-lift">
        <div className={cx('relative overflow-hidden bg-sand', featured ? 'h-[250px]' : 'aspect-[4/3]')}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
          />
          {featured && <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-pine/45 to-pine/[0.03]" />}
          {badge && (
            <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-sm">
              {badge}
            </span>
          )}
          {featured && (
            <div className="absolute inset-x-6 bottom-6 text-white">
              {eyebrow && <p className="m-0 font-sans text-[10px] font-bold uppercase tracking-[.16em] text-white/75">{eyebrow}</p>}
              <Heading className="m-0 mt-2 max-w-[10ch] font-sans text-[38px] font-bold leading-[.98] tracking-[-0.02em] text-white">{title}</Heading>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          {!featured && (
            <div>
              {eyebrow && <p className="m-0 mb-2 font-sans text-eyebrow uppercase text-sage">{eyebrow}</p>}
              <Heading className="m-0 font-sans text-h3 text-pine transition-colors group-hover:text-ink-3 [text-wrap:balance]">{title}</Heading>
            </div>
          )}
          {excerpt && <p className="m-0 font-sans text-body leading-7 text-ink-card [text-wrap:pretty]">{excerpt}</p>}
          {tags && tags.length > 0 && <ul className="m-0 flex list-none flex-wrap gap-2 p-0">{tags.map(t => <li key={t}><Tag>{t}</Tag></li>)}</ul>}
          {footer}
          {cta && (
            <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-btn bg-pine px-6 py-3 font-sans text-button font-semibold text-white">
              {cta} <span aria-hidden="true">→</span>
            </span>
          )}
        </div>
      </article>
    </a>
  )
}
