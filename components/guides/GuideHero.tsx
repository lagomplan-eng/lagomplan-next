/**
 * components/guides/GuideHero.tsx
 *
 * Guide hero — two-column layout: text (left) + image (right).
 * Matches the prototype exactly. Accepts pre-translated HeroData.
 */

import Image from 'next/image'
import type { HeroData } from '../../lib/data/guides/types'

interface Props {
  data: HeroData
  slug: string
  plannerHref: string
  onSave?: () => void
  onShare?: () => void
  onPdf?: () => void
}

export function GuideHero({ data, plannerHref, onSave, onShare, onPdf }: Props) {
  return (
    <section
      data-guide="hero"
      className="pt-10 pb-12 border-b border-[#E2DDD5] bg-[#FDFCF9]"
    >
      <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-5">
        <div className="grid grid-cols-[1fr_400px] gap-16 items-start max-[900px]:grid-cols-1 max-[900px]:gap-10 print:block">

          {/* ── Left: text ── */}
          <div>
            {/* Eyebrow */}
            <div
              data-hero="eyebrow"
              className="font-mono text-[10px] font-medium tracking-[.14em] uppercase text-[#6B8F86] mb-5 flex items-center gap-2"
            >
              <span className="block w-5 h-px bg-[#6B8F86] flex-shrink-0" />
              {data.eyebrow}
            </div>

            {/* Title */}
            <h1
              className="font-display font-normal leading-[1.05] tracking-[-0.02em] text-[#1A1A1A] mb-4"
              style={{ fontSize: 'clamp(32px, 3.8vw, 52px)' }}
            >
              {data.title}
            </h1>

            {/* Subtitle */}
            <p
              data-hero="subtitle"
              className="text-[15px] font-light leading-[1.7] text-[#4A4A4A] max-w-[400px] mb-7"
            >
              {data.subtitle}
            </p>

            {/* Meta chips */}
            <div data-hero="chips" className="flex flex-wrap gap-2 mb-7">
              {data.chips.map((chip) => (
                <span
                  key={chip}
                  className="flex items-center gap-1.5 font-mono text-[11px] tracking-[.04em] text-[#4A4A4A] px-3 py-1.5 bg-[#EDE7E1] border border-[#E2DDD5] rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B8F86] flex-shrink-0" />
                  {chip}
                </span>
              ))}
            </div>

            {/* Actions bar — hidden in print */}
            <div className="flex items-center pt-5 border-t border-[#E2DDD5] print:hidden">
              {onSave && (
                <button
                  type="button"
                  onClick={onSave}
                  className="font-mono text-[11px] tracking-[.06em] text-[#8A8A8A] pr-3.5 hover:text-[#0F3A33] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  ✓ Guardar
                </button>
              )}
              {onSave && onShare && (
                <span className="text-[#C8C2B8] text-[10px] pr-3.5 select-none">·</span>
              )}
              {onShare && (
                <button
                  type="button"
                  onClick={onShare}
                  className="font-mono text-[11px] tracking-[.06em] text-[#8A8A8A] pr-3.5 hover:text-[#0F3A33] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  ⟶ Compartir
                </button>
              )}
              {onShare && (
                <span className="text-[#C8C2B8] text-[10px] pr-3.5 select-none">·</span>
              )}
              {onPdf && (
                <button
                  type="button"
                  onClick={onPdf}
                  className="font-mono text-[11px] tracking-[.06em] text-[#8A8A8A] pr-3.5 hover:text-[#0F3A33] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  ⬇ Guardar PDF
                </button>
              )}
              <a
                href={plannerHref}
                className="inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[.08em] uppercase text-white bg-[#0F3A33] px-5 py-2.5 rounded-lg transition-all hover:bg-[#2D6B5A] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(15,58,51,.25)] ml-auto"
              >
                ✦ Planear mi viaje →
              </a>
            </div>
          </div>

          {/* ── Right: image — hidden in print ── */}
          <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden max-[900px]:order-[-1] print:hidden">
            {data.coverImage ? (
              <>
                <Image
                  src={data.coverImage}
                  alt={data.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 900px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,58,51,.4)] to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0F3A33] via-[#2D6B5A] to-[#6B8F86]" />
            )}
            {data.imageTag && (
              <span className="absolute top-5 right-5 font-mono text-[10px] font-medium tracking-[.1em] uppercase text-white bg-[rgba(15,58,51,.7)] backdrop-blur-sm px-2.5 py-[5px] rounded-full">
                {data.imageTag}
              </span>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
