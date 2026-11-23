'use client'

/**
 * components/catalog/DestinationBanner.tsx
 *
 * The destination's illustration once, above the grid, when exactly one
 * destination is chosen. Pine gradient from the left keeps the text readable. Tokens only.
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
    <section aria-label={name} className="relative h-[160px] overflow-hidden rounded-destination bg-pine md:h-[200px]">
      <Image
        src={illustration}
        alt=""
        fill
        sizes="(min-width: 1280px) 1232px, 100vw"
        className="object-cover"
        style={{ objectPosition: `center ${focus}` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-pine/90 to-transparent" />
      <div className="relative flex h-full flex-col justify-end gap-1 p-5 text-white md:p-8">
        <p className="m-0 font-sans text-eyebrow uppercase">{t('eyebrow')}</p>
        <h2 className="m-0 font-sans text-h2 text-white">{name}</h2>
        {guideHref && (
          <a href={guideHref} className="inline-flex min-h-chip items-center font-sans text-button font-semibold text-white underline underline-offset-4">
            {t('guide')}
          </a>
        )}
      </div>
    </section>
  )
}
