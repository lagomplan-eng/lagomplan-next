'use client'
/**
 * components/design/Input.tsx
 *
 * Input: single-line text field, 48px pill, visible label, hint and error.
 * SearchInput: the 56px search field (icon, clear button), as on /guias.
 */
import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cx } from './cx'

const FIELD =
  'w-full rounded-full border bg-white font-sans text-body text-pine placeholder:text-label transition-colors ' +
  'focus:outline-none focus-visible:border-pine focus-visible:ring-2 focus-visible:ring-fjord/30 disabled:cursor-not-allowed disabled:opacity-50'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  hint?: ReactNode
  error?: ReactNode
  /** Hide the visible label (it stays as the accessible name). */
  hideLabel?: boolean
}

export function Input({ label, hint, error, hideLabel, id, className, ...rest }: InputProps) {
  const auto = useId()
  const inputId = id ?? auto
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className={cx('font-sans text-small font-semibold text-pine', hideLabel && 'sr-only')}>{label}</label>
      <input
        {...rest}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        className={cx(FIELD, 'h-control px-5', error ? 'border-error' : 'border-line-chip hover:border-pine/60')}
      />
      {hint && !error && <p id={hintId} className="m-0 font-sans text-tiny text-label">{hint}</p>}
      {error && <p id={errorId} role="alert" className="m-0 font-sans text-tiny font-semibold text-error">{error}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: ReactNode
  error?: ReactNode
  hideLabel?: boolean
}

/** Multi-line sibling of Input (same border, focus ring and label rules; radius 16 instead of a pill). */
export function Textarea({ label, hint, error, hideLabel, id, className, ...rest }: TextareaProps) {
  const auto = useId()
  const inputId = id ?? auto
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className={cx('font-sans text-small font-semibold text-pine', hideLabel && 'sr-only')}>{label}</label>
      <textarea
        {...rest}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        className={cx(FIELD.replace('rounded-full', 'rounded-info'), 'resize-none px-5 py-3', error ? 'border-error' : 'border-line-chip hover:border-pine/60')}
      />
      {hint && !error && <p id={hintId} className="m-0 font-sans text-tiny text-label">{hint}</p>}
      {error && <p id={errorId} role="alert" className="m-0 font-sans text-tiny font-semibold text-error">{error}</p>}
    </div>
  )
}

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value'> {
  /** Accessible name (the field has no visible label). */
  label: string
  value: string
  onChange: (value: string) => void
  clearLabel?: string
}

export function SearchInput({ label, value, onChange, clearLabel = 'Clear', className, ...rest }: SearchInputProps) {
  return (
    <div className={cx('flex h-control-lg items-center gap-3 rounded-full border border-line-chip bg-white px-5 focus-within:border-pine focus-within:ring-2 focus-within:ring-fjord/30', className)}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none text-label">
        <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        {...rest}
        type="search"
        aria-label={label}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Escape' && value) onChange('') }}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-body text-pine outline-none placeholder:text-label [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" aria-label={clearLabel} onClick={() => onChange('')} className="inline-flex size-8 flex-none items-center justify-center rounded-full text-label hover:bg-sand hover:text-pine">
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  )
}
