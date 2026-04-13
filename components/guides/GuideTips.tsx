/**
 * components/guides/GuideTips.tsx
 *
 * Lagom tips — editorial list style with subtle separators.
 * Keeps the unique editorial feel from the prototype (not card grid).
 */

import type { Locale } from '../../i18n'

interface Props {
  tips:   string[]
  locale: Locale
}

export function GuideTips({ tips, locale }: Props) {
  const isES = locale === 'es'
  if (tips.length === 0) return null

  return (
    <section
      id="tips"
      className="py-12 max-[768px]:py-8 border-t"
      style={{ background: '#FAF8F5', borderColor: 'rgba(200,191,181,0.5)' }}
    >
      <div className="max-w-[900px] mx-auto px-7">

        <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-1">
          {isES ? 'Tips Lagom' : 'Lagom tips'}
        </div>
        <h2
          className="font-sans font-bold text-[#0F3A33] tracking-[-0.5px] mb-8"
          style={{ fontSize: 'clamp(18px, 2.4vw, 22px)' }}
        >
          {isES ? 'Lo que marca la diferencia' : 'What makes the difference'}
        </h2>

        {/* Editorial list — matching prototype tips-list style */}
        <div className="flex flex-col">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="flex gap-4 py-5"
              style={{
                borderBottom: i < tips.length - 1
                  ? '1px solid rgba(200,191,181,0.45)'
                  : 'none',
              }}
            >
              {/* Left accent */}
              <div
                className="flex-shrink-0 w-[3px] rounded-full self-stretch"
                style={{ background: '#6B8F86', minHeight: '44px' }}
              />
              <div>
                <div className="font-sans text-[13px] font-semibold text-[#0F3A33] mb-1 flex items-center gap-1.5">
                  <span>💡</span>
                  <span>{isES ? 'Tip Lagom' : 'Lagom tip'}</span>
                </div>
                <p className="font-sans text-[14px] text-[#4A4A46] leading-[1.75]">
                  {tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
