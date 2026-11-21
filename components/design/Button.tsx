/**
 * components/design/Button.tsx
 *
 * The one button. Pill, Manrope 700, 48px (md) or 40px (sm).
 *   primary    pine fill
 *   secondary  1px outline
 *   ghost      no border, sand wash on hover
 * Pass `href` to render a link (same look). Tokens: tailwind.config.js / globals.css :root.
 */
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType, ReactNode } from 'react'
import { cx } from './cx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse'
export type ButtonSize = 'md' | 'sm'

interface Common {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  iconBefore?: ReactNode
  iconAfter?: ReactNode
  className?: string
  children: ReactNode
}

/** Link-only: render another element for the anchor (the locale-aware `Link` from lib/navigation). */
interface LinkAs { as?: ElementType }

export type ButtonProps =
  | (Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined })
  | (Common & LinkAs & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common> & { href: string; disabled?: boolean })

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-bold no-underline transition-colors ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fjord'

const SIZE: Record<ButtonSize, string> = {
  md: 'h-control px-6 text-button',
  sm: 'h-control-sm px-5 text-button-sm',
}

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'border border-pine bg-pine text-cream hover:border-pine-hover hover:bg-pine-hover',
  secondary: 'border border-line-btn bg-transparent text-pine hover:border-pine',
  ghost: 'border border-transparent bg-transparent text-pine hover:bg-sand',
  /** On a pine band: cream fill, pine text. */
  inverse: 'border border-cream bg-cream text-pine hover:border-white hover:bg-white',
}

const DISABLED = 'cursor-not-allowed opacity-45 pointer-events-none'

export default function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', fullWidth, iconBefore, iconAfter, className, children, ...rest } = props
  const classes = cx(BASE, SIZE[size], VARIANT[variant], fullWidth && 'w-full', className)
  const content = (
    <>
      {iconBefore && <span aria-hidden="true" className="inline-flex flex-none">{iconBefore}</span>}
      {children}
      {iconAfter && <span aria-hidden="true" className="inline-flex flex-none">{iconAfter}</span>}
    </>
  )

  if ('href' in rest && rest.href !== undefined) {
    const { href, disabled, as: Anchor = 'a', ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: boolean } & LinkAs
    return (
      <Anchor
        {...anchor}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : anchor.tabIndex}
        data-variant={variant}
        data-size={size}
        className={cx(classes, disabled && DISABLED)}
      >
        {content}
      </Anchor>
    )
  }

  const { type = 'button', disabled, ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button {...button} type={type} disabled={disabled} data-variant={variant} data-size={size} className={cx(classes, disabled && DISABLED)}>
      {content}
    </button>
  )
}
