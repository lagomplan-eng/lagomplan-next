/**
 * components/guides/GuideInfo.tsx
 *
 * Quick-info strip rendered immediately below the hero.
 * Shows 4 at-a-glance facts: duration, best time, trip type, budget.
 * Returns null if the guide has no quick_info data.
 */

import type { Guide } from '../../lib/guides'
import type { Locale } from '../../i18n'

interface Props {
  guide:  Guide
  locale: Locale
}

export function GuideInfo({ guide, locale }: Props) {
  const { quick_info } = guide
  if (!quick_info) return null

  const isES = locale === 'es'

  const items = [
    {
      label: isES ? 'Duración'     : 'Duration',
      value: isES ? quick_info.duration_es  : quick_info.duration_en,
    },
    {
      label: isES ? 'Mejor época'  : 'Best time',
      value: isES ? quick_info.best_time_es : quick_info.best_time_en,
    },
    {
      label: isES ? 'Tipo de viaje': 'Trip type',
      value: isES ? quick_info.trip_type_es : quick_info.trip_type_en,
    },
    {
      label: isES ? 'Presupuesto'  : 'Budget',
      value: isES ? quick_info.budget_es    : quick_info.budget_en,
    },
  ]

  return (
    <section
      className="border-y"
      style={{ background: '#EDE7E1', borderColor: 'rgba(200,191,181,0.6)' }}
    >
      <div className="page-inner py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.label}>
              <span className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase block mb-1.5 text-[#6B8F86]">
                {item.label}
              </span>
              <span className="font-sans text-[14px] font-semibold text-[#0F3A33]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
