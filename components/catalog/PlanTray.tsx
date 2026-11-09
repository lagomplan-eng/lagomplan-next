'use client'

/**
 * components/catalog/PlanTray.tsx
 *
 * Sticky bar + panel for the traveler's plan, shared by Experiencias and Hoteles. Renders
 * nothing until something is in the plan. The panel groups items under Experiencias /
 * Hoteles. The only handoff is the destination: `/planner?destination=<name>`; item names
 * are never sent to the planner.
 */

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '../../lib/navigation'
import { groupPlan, planDestination, type PlanEntry, type PlanRef } from '../../lib/plan'

interface Props {
  items: PlanEntry[]
  onRemove: (ref: PlanRef) => void
  onClear: () => void
  /** A booking link inside the panel was clicked; position is its place in the plan. */
  onBook?: (e: PlanEntry, position: number) => void
  onHandoff?: (destinationSlug: string, count: number, mixed: boolean) => void
}

export default function PlanTray({ items, onRemove, onClear, onBook, onHandoff }: Props) {
  const t = useTranslations('catalog')
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const dest = planDestination(items)

  // Emptying the plan from inside the panel closes it.
  useEffect(() => { if (items.length === 0) setOpen(false) }, [items.length])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      triggerRef.current?.focus()
    }
  }, [open])

  if (!dest) return null

  const cta = (
    <Link
      href={{ pathname: '/planner', query: { destination: dest.name } }}
      onClick={() => onHandoff?.(dest.slug, items.length, dest.mixed)}
      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-pine px-5 text-[15px] font-bold text-white no-underline hover:bg-[#2D6B5A]"
    >
      {t('plan.cta', { name: dest.name })}
    </Link>
  )

  return (
    <>
      <div role="region" aria-label={t('plan.title')} className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-[18px]">
        <div className="pointer-events-auto mx-auto flex max-w-[640px] items-center justify-between gap-3 rounded-full bg-pine py-2 pl-6 pr-2 text-cream shadow-[0_10px_30px_rgba(15,58,51,.28)]">
          <p aria-live="polite" className="m-0 text-[15px] font-bold">
            {t('plan.bar', { count: items.length })}
          </p>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="inline-flex min-h-[44px] flex-none items-center rounded-full bg-cream px-5 text-[14px] font-bold text-pine hover:bg-white"
          >
            {t('plan.view')}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setOpen(false)} className="absolute inset-0 h-full w-full cursor-default bg-[rgba(15,58,51,.45)]" />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('plan.title')}
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-[#FFF9F3] shadow-[0_-8px_28px_rgba(15,58,51,.18)] outline-none sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none"
          >
            <div className="flex items-center justify-between border-b border-[rgba(107,143,134,.2)] px-5 py-3">
              <h2 className="m-0 text-[17px] font-bold text-[#0F3A33]">{t('plan.title')}</h2>
              <button type="button" onClick={() => setOpen(false)} className="min-h-[44px] min-w-[44px] text-[13px] font-semibold text-[#2D4F6C]">
                {t('plan.close')}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-2">
              {groupPlan(items).map(group => (
                <section key={group.type} aria-label={t(`plan.group.${group.type}`)}>
                  <h3 className="m-0 pb-1 pt-4 text-[12px] font-bold uppercase tracking-[.14em] text-label">{t(`plan.group.${group.type}`)}</h3>
                  <ul className="m-0 list-none divide-y divide-[rgba(15,58,51,.12)] p-0">
                    {group.items.map(e => (
                      <li key={`${e.type}:${e.id}`} className="flex items-start justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="m-0 text-[12px] font-medium text-label">{e.destinationName}</p>
                          <p className="m-0 text-[14px] font-semibold leading-[1.35] text-pine">{e.name}</p>
                          {e.bookingUrl && (
                            <a
                              href={e.bookingUrl}
                              target="_blank"
                              rel="sponsored noopener"
                              onClick={() => onBook?.(e, items.indexOf(e) + 1)}
                              className="inline-flex min-h-[44px] items-center text-[13px] font-semibold text-[#2D4F6C] underline underline-offset-2"
                            >
                              {t('plan.book', { provider: t(`provider.${e.provider}` as 'provider.other') })}
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove({ type: e.type, id: e.id })}
                          aria-label={t('plan.remove', { name: e.name })}
                          className="inline-flex min-h-[44px] min-w-[44px] flex-none items-center justify-center rounded-lg text-label hover:text-pine"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-[rgba(107,143,134,.2)] bg-[#FFF9F3] px-5 py-4">
              {dest.mixed && (
                <p className="m-0 rounded-lg bg-[#E4EFEC] px-3 py-2.5 text-[13px] leading-[1.5] text-[#0F3A33]">
                  {dest.tied ? t('plan.mixedTie', { name: dest.name }) : t('plan.mixed', { name: dest.name, count: dest.count })}
                </p>
              )}
              {cta}
              <div className="flex items-center justify-between gap-3">
                <p className="m-0 text-[12px] text-label">{t('plan.saved')}</p>
                <button type="button" onClick={onClear} className="min-h-[44px] flex-none px-1 text-[13px] font-medium text-[#2D4F6C] underline underline-offset-2">
                  {t('plan.clear')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
