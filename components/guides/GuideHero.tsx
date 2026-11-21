/**
 * components/guides/GuideHero.tsx
 *
 * Guide hero — two-column layout: text (left) + image (right).
 * Matches the prototype exactly. Accepts pre-translated HeroData.
 */

import Image from 'next/image'
import { Button, PageTitle, Tag } from '../design'
import type { HeroData } from '../../lib/data/guides/types'

interface Props {
  data: HeroData
  slug: string
  locale: string
  plannerHref: string
  onSave?: () => void
  onShare?: () => void
  onPdf?: () => void
}

const HERO_LABELS: Record<string, { save: string; share: string; savePdf: string; planTrip: string }> = {
  es: { save: '✓ Guardar', share: '⟶ Compartir', savePdf: '⬇ Guardar PDF', planTrip: '✦ Planear mi viaje →' },
  en: { save: '✓ Save',    share: '⟶ Share',    savePdf: '⬇ Save PDF',    planTrip: '✦ Plan my trip →' },
}

export function GuideHero({ data, locale, plannerHref, onSave, onShare, onPdf }: Props) {
  const labels = HERO_LABELS[locale] ?? HERO_LABELS.es
  return (
    <section
      data-guide="hero"
      className="border-b border-line-soft bg-white pb-12 pt-10"
    >
      <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-5">
        <div className="grid grid-cols-[1fr_400px] gap-16 items-start max-[900px]:grid-cols-1 max-[900px]:gap-10 print:block">

          {/* ── Left: text ── */}
          <div>
            <PageTitle
              eyebrow={
                // The rule span is hidden in print by the print stylesheet ([data-hero="eyebrow"] span).
                <span data-hero="eyebrow" className="flex items-center gap-2">
                  <span className="block h-px w-5 flex-shrink-0 bg-sage" />
                  {data.eyebrow}
                </span>
              }
              title={data.title}
              lede={<span data-hero="subtitle" className="block">{data.subtitle}</span>}
            />

            {/* Meta chips */}
            <div data-hero="chips" className="mt-7 flex flex-wrap gap-2">
              {data.chips.map((chip) => (
                <Tag key={chip} className="gap-1.5">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sage" />
                  {chip}
                </Tag>
              ))}
            </div>

            {/* Actions bar — hidden in print */}
            <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-line-soft pt-5 print:hidden">
              {onSave && (
                <Button variant="ghost" size="sm" onClick={onSave}>{labels.save}</Button>
              )}
              {onShare && (
                <Button variant="ghost" size="sm" onClick={onShare}>{labels.share}</Button>
              )}
              {onPdf && (
                <Button variant="ghost" size="sm" onClick={onPdf}>{labels.savePdf}</Button>
              )}
              <Button href={plannerHref} size="sm" className="ml-auto">
                {labels.planTrip}
              </Button>
            </div>
          </div>

          {/* ── Right: image — hidden in print ── */}
          <div className="relative w-full aspect-[4/3] rounded-destination overflow-hidden max-[900px]:order-[-1] print:hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-pine/40 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pine via-pine-hover to-sage" />
            )}
            {data.imageTag && (
              <span className="absolute right-5 top-5 rounded-full bg-pine/70 px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-sm">
                {data.imageTag}
              </span>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
