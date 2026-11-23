/**
 * components/design/Button.tsx
 *
 * The one button, home's: 8px radius, Manrope 13px, tracking .03em, padding 12/24.
 *   primary    home .btn-solid: pine fill, 600, hover #1A4A42 + 1px lift
 *   secondary  home .btn-outline: 1.5px pine border, 500, mint wash on hover
 *   ghost      home .btn-ghost text button (derived: padding + mint wash on hover)
 *   inverse    DERIVED for pine bands (home's newsletter button colours, same shape as primary)
 * sm is DERIVED (padding 8/16, 12px).
 * Pass `href` to render a link (same look). Tokens: tailwind.config.js / globals.css :root.
 */
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
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

export type ButtonProps =
  | (Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined })
  | (Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common> & { href: string; disabled?: boolean })

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn font-sans no-underline transition-[background-color,transform,border-color] duration-150 ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fjord'

const SIZE: Record<ButtonSize, string> = {
  md: 'px-6 py-3 text-button',
  sm: 'px-4 py-2 text-button-sm',
}

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-pine font-semibold text-white hover:-translate-y-px hover:bg-btn-solid-hover',
  secondary: 'border-[1.5px] border-pine bg-transparent font-medium text-pine hover:bg-mint',
  ghost: 'bg-transparent font-medium text-pine hover:bg-mint',
  inverse: 'bg-cream font-semibold text-pine hover:-translate-y-px hover:bg-white',
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
    const { href, disabled, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: boolean }
    return (
      <a
        {...anchor}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : anchor.tabIndex}
        data-variant={variant}
        data-size={size}
        className={cx(classes, disabled && DISABLED)}
      >
        {content}
      </a>
    )
  }

  const { type = 'button', disabled, ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button {...button} type={type} disabled={disabled} data-variant={variant} data-size={size} className={cx(classes, disabled && DISABLED)}>
      {content}
    </button>
  )
}
