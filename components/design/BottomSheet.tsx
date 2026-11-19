'use client'
/**
 * components/design/BottomSheet.tsx
 *
 * Modal bottom sheet for mobile. role="dialog" aria-modal, labelled by its title; Esc and the backdrop close
 * it; Tab is trapped inside; body scroll is locked; focus returns to the element that opened it.
 * Rendered in a portal so no ancestor can clip or transform it.
 */
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from './cx'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  closeLabel: string
  children: ReactNode
  /** Sticky footer (primary action). */
  footer?: ReactNode
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export default function BottomSheet({ open, onClose, title, closeLabel, children, footer }: BottomSheetProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) { setShown(false); return }
    returnFocus.current = document.activeElement as HTMLElement | null
    const raf = requestAnimationFrame(() => setShown(true))
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prev
      returnFocus.current?.focus?.()
    }
  }, [open])

  // Escape and Tab are handled on the document while the sheet is open, not on the dialog: when the focused
  // button becomes disabled (e.g. "Limpiar" after clearing) focus falls to <body>, and a handler on the
  // dialog would never see the key again.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const panel = panelRef.current
    if (!panel) return
    if (e.key === 'Escape') { e.stopPropagation(); onCloseRef.current(); return }
    if (e.key !== 'Tab') return
    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.offsetParent !== null || el === document.activeElement)
    if (items.length === 0) { e.preventDefault(); panel.focus(); return }
    const first = items[0], last = items[items.length - 1]
    const active = document.activeElement
    if (!panel.contains(active) || active === panel) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return }
    if (e.shiftKey && active === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus() }
  }, [])
  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onKeyDown])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-[500]">
      <div
        data-testid="sheet-backdrop"
        aria-hidden="true"
        onClick={onClose}
        className={cx('absolute inset-0 bg-pine/40 transition-opacity duration-200 motion-reduce:transition-none', shown ? 'opacity-100' : 'opacity-0')}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(
          'absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-sheet bg-cream shadow-sheet outline-none transition-transform duration-300 ease-out motion-reduce:transition-none',
          shown ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div aria-hidden="true" className="mx-auto mt-3 h-1 w-10 flex-none rounded-full bg-pine/20" />
        <div className="flex flex-none items-center justify-between gap-4 px-5 pb-2 pt-3">
          <h2 id={titleId} className="m-0 font-sans text-[20px] font-extrabold tracking-[-0.01em] text-pine">{title}</h2>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="inline-flex size-10 flex-none items-center justify-center rounded-full text-pine hover:bg-sand">
            <span aria-hidden="true" className="text-[22px] leading-none">×</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer && <div className="flex-none border-t border-line-soft bg-cream px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
