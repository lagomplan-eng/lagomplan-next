/**
 * components/catalog/CatalogCard.tsx
 *
 * One card for every catalog page. Every part renders only when it has data.
 * Top row: optional thumbnail + eyebrow (+ meta) on the left, the plan button on
 * the right. Tags are flat sand pills so they never read as filter chips.
 */

import Image from 'next/image'
import type { HTMLAttributes, ReactNode } from 'react'

export interface CardAction {
  label: string
  href: string
  onClick?: () => void
  /** Opens in a new tab as a sponsored link. */
  external?: boolean
}

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  thumb?: { src: string; focus?: string }
  eyebrow?: string
  /** Makes the eyebrow a button (e.g. to filter by that destination). */
  onEyebrowClick?: () => void
  eyebrowAriaLabel?: string
  meta?: string
  title: string
  titleAs?: 'h2' | 'h3'
  description?: string
  tags?: string[]
  /** Absent when there is nowhere to send the traveler (no booking link): nothing is invented. */
  primary?: CardAction
  secondary?: CardAction
  providerLine?: string
  planButton?: ReactNode
}

const EYEBROW = 'text-[12px] font-bold uppercase tracking-[.14em] text-label'

function Action({ a, kind }: { a: CardAction; kind: 'primary' | 'secondary' }) {
  return (
    <a
      href={a.href}
      onClick={a.onClick}
      {...(a.external ? { target: '_blank', rel: 'sponsored noopener' } : {})}
      className={[
        'inline-flex min-h-[48px] items-center justify-center rounded-full px-6 text-[15px] no-underline transition-colors',
        kind === 'primary'
          ? 'bg-pine font-bold text-white hover:bg-[#2D6B5A]'
          : 'border border-line-btn bg-transparent px-5 font-semibold text-pine hover:border-pine',
      ].join(' ')}
    >
      {a.label}
    </a>
  )
}

export default function CatalogCard({
  thumb, eyebrow, onEyebrowClick, eyebrowAriaLabel, meta, title, titleAs: Title = 'h2', description, tags,
  primary, secondary, providerLine, planButton, className, ...rest
}: Props) {
  const hasLeft = !!(thumb || eyebrow || meta)
  const hasTop = hasLeft || !!planButton

  return (
    <article
      {...rest}
      className={['flex flex-col gap-3 rounded-card border border-line-card bg-white p-[18px] md:p-[22px]', className].filter(Boolean).join(' ')}
    >
      {hasTop && (
        <div className={['flex items-start gap-3', hasLeft ? 'justify-between' : 'justify-end'].join(' ')}>
          {hasLeft && (
            <div className="flex min-w-0 items-center gap-3">
              {thumb && (
                <span className="relative h-12 w-12 flex-none overflow-hidden rounded-xl bg-sand md:h-14 md:w-14">
                  <Image
                    src={thumb.src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                    style={{ objectPosition: `center ${thumb.focus ?? '60%'}` }}
                  />
                </span>
              )}
              <div className="flex min-w-0 flex-col">
                {eyebrow && (onEyebrowClick ? (
                  <button
                    type="button"
                    onClick={onEyebrowClick}
                    aria-label={eyebrowAriaLabel}
                    className={`${EYEBROW} min-h-[44px] bg-transparent p-0 text-left underline-offset-4 hover:underline`}
                  >
                    {eyebrow}
                  </button>
                ) : (
                  <p className={`${EYEBROW} m-0`}>{eyebrow}</p>
                ))}
                {meta && <p className="m-0 text-[13px] text-label">{meta}</p>}
              </div>
            </div>
          )}
          {planButton}
        </div>
      )}

      <Title className="m-0 text-[20px] font-bold leading-[1.25] tracking-[-0.01em] text-pine md:text-[22px]">{title}</Title>

      {description && (
        <p className="m-0 line-clamp-3 text-[15px] leading-[1.55] text-ink-2 md:text-[16px]">{description}</p>
      )}

      {tags && tags.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {tags.map(tag => (
            <li key={tag} className="rounded-full bg-sand px-3 py-1 text-[13px] font-semibold text-pine">{tag}</li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-1">
        {(primary || secondary) && (
          <div className="flex flex-wrap gap-2.5">
            {primary && <Action a={primary} kind="primary" />}
            {secondary && <Action a={secondary} kind="secondary" />}
          </div>
        )}
        {providerLine && <p className="m-0 text-[13px] text-label">{providerLine}</p>}
      </div>
    </article>
  )
}
