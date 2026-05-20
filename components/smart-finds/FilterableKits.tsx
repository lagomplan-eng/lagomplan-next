'use client'

/**
 * components/smart-finds/FilterableKits.tsx
 *
 * Client island that owns the persona-filter state for the Smart Finds
 * page. Renders the FilterBar (4 pills + count) and the filtered list
 * of KitSections.
 *
 * Why a client island instead of the whole page going client:
 *   - The page's masthead, PainStrip, planner CTA, and newsletter
 *     block are static and don't need state, so they stay server-
 *     rendered for SSR/SEO
 *   - `generateMetadata` stays a server export in page.tsx
 *   - Only the kit list re-renders on filter changes
 */

import { useMemo, useState } from 'react'
import type { Kit, Persona } from '../../lib/smart-finds'
import KitSection from './KitSection'
import { PINE, SAND, MUTED, BORDER } from './tokens'

type FilterId = 'all' | Persona

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all',      label: 'Todos'    },
  { id: 'familias', label: 'Familias' },
  { id: 'parejas',  label: 'Parejas'  },
  { id: 'fan',      label: 'Fans'     },
]

interface Props {
  kits: Kit[]
}

export default function FilterableKits({ kits }: Props) {
  const [active, setActive] = useState<FilterId>('all')

  const visible = useMemo(
    () => (active === 'all' ? kits : kits.filter(k => k.persona === active)),
    [kits, active],
  )

  const countLabel = `${visible.length} ${visible.length === 1 ? 'kit' : 'kits'}`

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
        marginBottom: 8,
      }}>
        {FILTERS.map(f => {
          const isActive = f.id === active
          return (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              style={{
                fontFamily:    "'Manrope',sans-serif",
                fontSize:      12,
                fontWeight:    600,
                padding:       '8px 18px',
                borderRadius:  999,
                border:        isActive ? 'none' : `1px solid ${BORDER}`,
                background:    isActive ? PINE : 'transparent',
                color:         isActive ? SAND : MUTED,
                cursor:        'pointer',
                transition:    'all .15s',
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Count label */}
      <div style={{
        fontFamily:    "'Manrope',sans-serif",
        fontSize:      11,
        color:         MUTED,
        letterSpacing: '.04em',
        marginBottom:  56,
      }}>
        {countLabel}
      </div>

      {/* Filtered kit list */}
      {visible.length === 0 ? (
        <div style={{
          padding: '48px 0', textAlign: 'center',
          fontFamily: "'Fraunces',serif",
          fontSize: 16, color: MUTED,
        }}>
          Sin kits para esta selección.
        </div>
      ) : (
        visible.map((kit, i) => (
          <div key={kit.id}>
            <KitSection kit={kit} isLast={i === visible.length - 1} />
            {i < visible.length - 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center',
                margin: '80px 0',
                fontFamily: "'Manrope',sans-serif", fontSize: 11, color: MUTED,
              }}>✦</div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
