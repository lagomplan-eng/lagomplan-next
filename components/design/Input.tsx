'use client'
/**
 * components/design/Input.tsx
 *
 * Home has two field styles and both are here:
 *   Input (default)       home's place / date field: 13px, 38px high, radius 2, 1px #C8D9D3 border, text #0F1A16,
 *                         placeholder #BDBDBD, focus = pine border + 3px pine/6% ring.
 *   Input variant="soft"  home's budget field and textarea: radius 8, 1px sage/22% border, 10px vertical padding.
 *   Textarea              the soft field, multi-line.
 * Label: 12px / 600 / pine. Error: #B94030. Hint: 10px sage (the home note under the planner button).
 * DERIVED (home has no example): `variant="onDark"` (home's newsletter field colours, radius 8), SearchInput.
 */
import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cx } from './cx'

const FIELD = 'w-full border bg-white font-sans text-small text-ink-input placeholder:text-placeholder transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
const VARIANT = {
  default: 'rounded-field py-2 pl-3 pr-7 focus:border-pine focus:shadow-[0_0_0_3px_rgb(var(--pine-rgb)/0.06)]',
  soft: 'rounded-btn px-3 py-2.5 !text-pine focus:border-pine',
  onDark: 'rounded-btn !border-cream/20 !bg-white/10 px-5 py-4 !text-body !text-cream placeholder:!text-cream/60 focus:!border-cream/50',
} as const
const BORDER = { default: 'border-line-field', soft: 'border-line-sage', onDark: '' } as const

type Variant = keyof typeof VARIANT

interface CommonProps {
  label: string
  hint?: ReactNode
  error?: ReactNode
  /** Hide the visible label (it stays as the accessible name). */
  hideLabel?: boolean
}

function Wrapper({ label, hint, error, hideLabel, id, className, children }: CommonProps & { id: string; className?: string; children: ReactNode }) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cx('font-sans text-tiny font-semibold text-pine', hideLabel && 'sr-only')}>{label}</label>
      {children}
      {hint && !error && <p id={hintId} className="m-0 font-sans text-micro text-sage">{hint}</p>}
      {error && <p id={errorId} role="alert" className="m-0 font-sans text-[11px] leading-snug text-field-error">{error}</p>}
    </div>
  )
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, CommonProps {
  variant?: Variant
}

export function Input({ label, hint, error, hideLabel, id, className, variant = 'default', ...rest }: InputProps) {
  const auto = useId()
  const inputId = id ?? auto
  return (
    <Wrapper id={inputId} label={label} hint={hint} error={error} hideLabel={hideLabel} className={className}>
      <input
        {...rest}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[error ? `${inputId}-error` : '', hint ? `${inputId}-hint` : ''].filter(Boolean).join(' ') || undefined}
        className={cx(FIELD, VARIANT[variant], error ? 'border-field-error' : BORDER[variant])}
      />
    </Wrapper>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, CommonProps {
  variant?: Exclude<Variant, 'default'>
}

export function Textarea({ label, hint, error, hideLabel, id, className, variant = 'soft', ...rest }: TextareaProps) {
  const auto = useId()
  const inputId = id ?? auto
  return (
    <Wrapper id={inputId} label={label} hint={hint} error={error} hideLabel={hideLabel} className={className}>
      <textarea
        {...rest}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[error ? `${inputId}-error` : '', hint ? `${inputId}-hint` : ''].filter(Boolean).join(' ') || undefined}
        className={cx(FIELD, VARIANT[variant], 'resize-none', error ? 'border-field-error' : BORDER[variant])}
      />
    </Wrapper>
  )
}

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value'> {
  /** Accessible name (the field has no visible label). */
  label: string
  value: string
  onChange: (value: string) => void
  clearLabel?: string
}

/** DERIVED: home's default field with a search icon and a clear button; 46px high (the button height) for touch. */
export function SearchInput({ label, value, onChange, clearLabel = 'Clear', className, ...rest }: SearchInputProps) {
  return (
    <div className={cx('flex h-control items-center gap-3 rounded-field border border-line-field bg-white px-3 focus-within:border-pine focus-within:shadow-[0_0_0_3px_rgb(var(--pine-rgb)/0.06)]', className)}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none text-sage">
        <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        {...rest}
        type="search"
        aria-label={label}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Escape' && value) onChange('') }}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-small text-ink-input outline-none placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" aria-label={clearLabel} onClick={() => onChange('')} className="inline-flex size-7 flex-none items-center justify-center rounded-btn text-sage hover:bg-mint hover:text-pine">
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  )
}
