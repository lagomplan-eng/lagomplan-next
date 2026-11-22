'use client'
/**
 * components/design/FilterPanel.tsx
 *
 * THE filter pattern for every catalog page (guides, experiences, hotels, smart finds).
 *
 *   desktop (md+)  search + labelled rows of chips, wrapping, in one white panel
 *   mobile         search + a "Filtros (n)" button; the groups open in a bottom sheet with a live
 *                  "Ver N resultados" button and "Limpiar"; active filters show as removable chips
 *
 * The panel owns no filter state: pass the chips of each group as `chips` (use <Chip>), the number of
 * active filters per group, and the callbacks. The search is a destination picker (tokens + suggestions),
 * as the catalog FilterPanel it replaces (components/catalog/FilterPanel.tsx stays until the pages migrate).
 */
import { useId, useRef, useState, type ReactNode } from 'react'
import BottomSheet from './BottomSheet'
import Button from './Button'
import { cx } from './cx'

export interface FilterGroup {
  id: string
  label: string
  chips: ReactNode
  /** How many chips of this group are active (drives the "Filtros (n)" count). */
  activeCount?: number
}

export interface FilterSearch {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  tokens?: { key: string; label: string; removeLabel: string }[]
  onRemoveToken?: (key: string) => void
  suggestions?: { key: string; label: string; hint?: string; link?: { label: string; href: string } }[]
  onPick?: (key: string) => void
  noResultsText: string
}

export interface ActiveFilter {
  key: string
  label: string
  removeLabel: string
  onRemove: () => void
}

export interface FilterPanelLabels {
  /** Button + sheet title, e.g. "Filtros". */
  filters: string
  /** Sheet primary button; n is the live result count when known. */
  showResults: (n: number | undefined) => string
  clear: string
  close: string
}

interface Props {
  search?: FilterSearch
  groups: FilterGroup[]
  activeFilters?: ActiveFilter[]
  /** Live result count, shown in the sheet button. */
  resultsCount?: number
  onClear?: () => void
  labels: FilterPanelLabels
  className?: string
}

export default function FilterPanel({ search, groups, activeFilters = [], resultsCount, onClear, labels, className }: Props) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const suggestOpen = !!search && search.value.trim().length > 0
  const activeCount = groups.reduce((n, g) => n + (g.activeCount ?? 0), 0) || activeFilters.length

  const pick = (key: string) => { search?.onPick?.(key); search?.onChange('') }

  const rows = (idPrefix: string) => groups.map(g => (
    <div key={g.id} role="group" aria-label={g.label} className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
      <p className="m-0 font-sans text-tiny font-semibold text-pine md:flex md:min-h-chip md:w-[104px] md:flex-none md:items-center" id={`${idPrefix}-${g.id}`}>{g.label}</p>
      <div aria-labelledby={`${idPrefix}-${g.id}`} className="flex flex-wrap gap-2">{g.chips}</div>
    </div>
  ))

  return (
    <div className={cx('flex flex-col gap-4', className)}>
      {search && (
        <div className="relative">
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex min-h-control cursor-text items-center gap-3 rounded-field border border-line-field bg-white px-3 py-1.5 focus-within:border-pine focus-within:shadow-[0_0_0_3px_rgb(var(--pine-rgb)/0.06)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none text-sage">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
            {search.tokens?.map(tok => (
              <button
                key={tok.key}
                type="button"
                aria-label={tok.removeLabel}
                onClick={e => { e.stopPropagation(); search.onRemoveToken?.(tok.key) }}
                className="inline-flex flex-none items-center gap-2 whitespace-nowrap rounded-btn bg-pine px-4 py-2 font-sans text-button-sm font-semibold text-white"
              >
                {tok.label}<span aria-hidden="true">×</span>
              </button>
            ))}
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-label={search.label}
              aria-expanded={suggestOpen}
              aria-controls={listId}
              aria-autocomplete="list"
              value={search.value}
              placeholder={search.tokens?.length ? '' : search.placeholder}
              autoComplete="off"
              onChange={e => search.onChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') search.onChange('')
                if (e.key === 'Enter' && suggestOpen) {
                  const first = search.suggestions?.find(x => !x.link)
                  if (first) { e.preventDefault(); pick(first.key) }
                }
              }}
              className="min-w-[120px] flex-1 border-0 bg-transparent p-0 font-sans text-small text-ink-input outline-none placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
          <ul id={listId} hidden={!suggestOpen} className="absolute inset-x-0 top-[calc(100%+8px)] z-30 m-0 max-h-72 list-none overflow-y-auto rounded-info border border-line-form bg-white p-2 shadow-pop">
            {suggestOpen && search.suggestions?.length === 0 && <li className="px-4 py-3 font-sans text-small text-ink-body">{search.noResultsText}</li>}
            {suggestOpen && search.suggestions?.map(s => (
              <li key={s.key}>
                {s.link ? (
                  <div className="flex min-h-chip flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl px-4 py-2">
                    <span className="font-sans text-small text-pine"><span className="font-semibold">{s.label}</span>{s.hint && <span className="text-sage"> · {s.hint}</span>}</span>
                    <a href={s.link.href} className="inline-flex min-h-chip items-center font-sans text-small font-semibold text-pine underline underline-offset-4">{s.link.label}</a>
                  </div>
                ) : (
                  <button type="button" onClick={() => pick(s.key)} className="flex min-h-chip w-full items-center justify-between gap-3 rounded-xl px-4 text-left font-sans text-small font-semibold text-pine hover:bg-mint">
                    <span>{s.label}</span>{s.hint && <span className="text-tiny text-sage">{s.hint}</span>}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Desktop: inline rows in one panel */}
      {groups.length > 0 && (
        <div data-filter="inline" className="hidden flex-col gap-5 rounded-info border border-line-form bg-white px-6 py-5 shadow-form md:flex">
          {rows('inline')}
        </div>
      )}

      {/* Mobile: button + active chips; the groups live in the sheet */}
      {groups.length > 0 && (
        <div data-filter="mobile" className="flex flex-col gap-3 md:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" aria-haspopup="dialog" onClick={() => setSheetOpen(true)} iconBefore={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            }>
              {labels.filters}{activeCount > 0 ? ` (${activeCount})` : ''}
            </Button>
            {activeFilters.map(f => (
              <button key={f.key} type="button" aria-label={f.removeLabel} onClick={f.onRemove} className="inline-flex items-center gap-2 whitespace-nowrap rounded-btn bg-pine px-4 py-2 font-sans text-button-sm font-semibold text-white">
                {f.label}<span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={labels.filters}
        closeLabel={labels.close}
        footer={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => { onClear?.() }} disabled={activeCount === 0}>{labels.clear}</Button>
            <Button fullWidth onClick={() => setSheetOpen(false)}>{labels.showResults(resultsCount)}</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6 pt-2">{rows('sheet')}</div>
      </BottomSheet>
    </div>
  )
}
