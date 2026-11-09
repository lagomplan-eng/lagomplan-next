'use client'

/**
 * components/catalog/FilterPanel.tsx
 *
 * Search + labelled chip rows. Desktop: one white box, chips wrap. Mobile: no box,
 * search on top, then each row is its label above a horizontal scroll strip.
 *
 * The search is a destination picker: typing lists matching options, picking one
 * calls onPick; chosen options show as pine tokens ("Ciudad de México ×") inside
 * the field. The panel owns no filter state.
 */

import { useId, useRef, type ReactNode } from 'react'

export interface FilterRow {
  /** Stable key for the row. */
  id: string
  label: string
  chips: ReactNode
}

export interface FilterSearch {
  /** Accessible name (the field has no visible label). */
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  /** Chosen options, shown as removable tokens inside the field. */
  tokens?: { key: string; label: string; removeLabel: string }[]
  onRemoveToken?: (key: string) => void
  /**
   * Options matching `value`. Only shown while `value` is not empty. An entry with a
   * `link` is information plus a link, not something onPick can select.
   */
  suggestions?: { key: string; label: string; hint?: string; link?: { label: string; href: string } }[]
  onPick?: (key: string) => void
  noResultsText: string
}

interface Props {
  search?: FilterSearch
  rows: FilterRow[]
}

export default function FilterPanel({ search, rows }: Props) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const open = !!search && search.value.trim().length > 0

  const pick = (key: string) => {
    search?.onPick?.(key)
    search?.onChange('')
  }

  return (
    <div className="flex flex-col gap-5 md:rounded-panel md:border md:border-line-panel md:bg-white md:px-6 md:py-5">
      {search && (
        <div className="relative">
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex min-h-[56px] cursor-text items-center gap-3 rounded-full border border-line-chip bg-white px-5 py-2 focus-within:border-pine"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none text-label">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
            {search.tokens?.map(tok => (
              <button
                key={tok.key}
                type="button"
                aria-label={tok.removeLabel}
                onClick={e => { e.stopPropagation(); search.onRemoveToken?.(tok.key) }}
                className="inline-flex min-h-[40px] flex-none items-center gap-2 whitespace-nowrap rounded-full bg-pine px-4 text-[15px] font-semibold text-cream"
              >
                {tok.label}
                <span aria-hidden="true">×</span>
              </button>
            ))}
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-label={search.label}
              aria-expanded={open}
              aria-controls={listId}
              aria-autocomplete="list"
              value={search.value}
              placeholder={search.tokens?.length ? '' : search.placeholder}
              autoComplete="off"
              onChange={e => search.onChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') search.onChange('')
                if (e.key === 'Enter' && open) {
                  const first = search.suggestions?.find(x => !x.link)
                  if (first) { e.preventDefault(); pick(first.key) }
                }
              }}
              className="min-w-[120px] flex-1 border-0 bg-transparent p-0 text-[16px] text-pine outline-none placeholder:text-label"
            />
          </div>

          <ul
            id={listId}
            hidden={!open}
            className="absolute inset-x-0 top-[calc(100%+8px)] z-30 m-0 max-h-72 list-none overflow-y-auto rounded-card border border-line-panel bg-white p-2 shadow-[0_12px_32px_rgba(15,58,51,.14)]"
          >
            {open && search.suggestions?.length === 0 && (
              <li className="px-4 py-3 text-[15px] text-ink-2">{search.noResultsText}</li>
            )}
            {open && search.suggestions?.map(s => (
              <li key={s.key}>
                {s.link ? (
                  <div className="flex min-h-[44px] flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl px-4 py-2">
                    <span className="text-[15px] text-pine">
                      <span className="font-semibold">{s.label}</span>
                      {s.hint && <span className="text-label"> · {s.hint}</span>}
                    </span>
                    <a href={s.link.href} className="inline-flex min-h-[44px] items-center text-[15px] font-bold text-pine underline underline-offset-4">
                      {s.link.label}
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => pick(s.key)}
                    className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl px-4 text-left text-[15px] font-semibold text-pine hover:bg-sand"
                  >
                    <span>{s.label}</span>
                    {s.hint && <span className="text-[13px] font-medium text-label">{s.hint}</span>}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rows.map(row => (
        <div key={row.id} role="group" aria-label={row.label} className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
          <p className="m-0 text-[12px] font-bold uppercase tracking-[.14em] text-label md:flex md:min-h-[44px] md:w-[104px] md:flex-none md:items-center">
            {row.label}
          </p>
          <div className="-mx-[18px] flex gap-2 overflow-x-auto px-[18px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            {row.chips}
          </div>
        </div>
      ))}
    </div>
  )
}
