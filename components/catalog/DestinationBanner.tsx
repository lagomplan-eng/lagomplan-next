'use client'

/**
 * components/catalog/DestinationBanner.tsx
 *
 * The destination's illustration once, above the grid, when exactly one
 * destination is chosen. Pine gradient from the left keeps the text readable.
 */

import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface Props {
  name: string
  illustration: string
  /** Absent when the destination has no guide page to link to. */
  guideHref?: string
  /** Vertical focus of the crop, CSS percentage. */
  focus?: string
}

export default function DestinationBanner({ name, illustration, guideHref, focus = '60%' }: Props) {
  const t = useTranslations('catalog.banner')
  return (
    <section aria-label={name} className="relative h-[140px] overflow-hidden rounded-panel bg-pine md:h-[200px]">
      <Image
        src={illustration}
        alt=""
        fill
        sizes="(min-width: 1280px) 1232px, 100vw"
        className="object-cover"
        style={{ objectPosition: `center ${focus}` }}
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(15,58,51,.92) 0%, rgba(15,58,51,0) 75%)' }} />
      <div className="relative flex h-full flex-col justify-end gap-1 p-5 text-white md:p-8">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[.16em]">{t('eyebrow')}</p>
        <h2 className="m-0 text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] md:text-[38px]">{name}</h2>
        {guideHref && (
          <a href={guideHref} className="inline-flex min-h-[44px] items-center text-[15px] font-bold text-white underline underline-offset-4">
            {t('guide')}
          </a>
        )}
      </div>
    </section>
  )
}
