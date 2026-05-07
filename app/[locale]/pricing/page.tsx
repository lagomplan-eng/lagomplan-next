/**
 * app/[locale]/pricing/page.tsx
 * Route ES: /es/precios | EN: /en/pricing
 *
 * Server component. Pulls every visible string from the `pricing`
 * namespace in messages/{es,en}.json. No interactive state — the
 * four CTA buttons render with `data-plan` attributes; Stripe
 * wiring is a follow-up that will happen in a client wrapper.
 */

import type { Metadata }              from 'next'
import { getTranslations }            from 'next-intl/server'
import { buildAlternates, buildOpenGraph } from '../../../lib/seo'
import type { Locale }                from '../../../i18n'

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pricing.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  buildAlternates('pricing'),
    openGraph:   buildOpenGraph(locale),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pricing' })

  return (
    <main className="pt-[100px] min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6 max-[768px]:px-5 py-16 max-[768px]:py-10">

        {/* ── 1 · Hero ─────────────────────────────────────────────── */}
        <section className="mb-12">
          <p className="font-mono text-[10px] font-medium tracking-[0.18em] uppercase text-sage mb-3">
            {t('eyebrow')}
          </p>
          <h1 className="font-display text-[38px] max-[640px]:text-[32px] font-bold text-pine leading-[1.05] tracking-[-0.5px] mb-4">
            {t('hero.line1')}<br />{t('hero.line2')}
          </h1>
          <p className="font-sans text-[15px] text-pine leading-relaxed max-w-[520px]">
            {t('hero.body')}
          </p>
        </section>

        {/* ── 2 · Divider ──────────────────────────────────────────── */}
        <hr className="border-0 h-px bg-pine/[0.13] mb-12" />

        {/* ── 3 · Free tiers strip ─────────────────────────────────── */}
        <section className="mb-16 bg-[#FDFCF9] border border-pine/[0.13] rounded-lg overflow-hidden">
          <ul className="grid grid-cols-3 max-[640px]:grid-cols-1 divide-x max-[640px]:divide-x-0 max-[640px]:divide-y divide-pine/[0.13]">
            {([1, 2, 3] as const).map(n => (
              <li key={n} className="p-6">
                <p className="font-display text-[13px] font-semibold text-sage mb-2">
                  {`0${n}`}
                </p>
                <p className="font-sans text-[12px] font-bold text-pine mb-1">
                  {t(`free.tier${n}.title`)}
                </p>
                <p className="font-sans text-[11px] text-[#4A5568] leading-relaxed">
                  {t(`free.tier${n}.sub`)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 4 · Paid plans header ────────────────────────────────── */}
        <header className="flex justify-between items-baseline mb-6 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2">
          <h2 className="font-display text-[21px] font-semibold text-pine">
            {t('paid.headline')}
          </h2>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-sage">
            {t('paid.eyebrow')}
          </span>
        </header>

        {/* ── 5 · 4-card pricing grid ──────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2 mb-16 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">

          <PlanCard
            name={t('plans.perTrip.name')}
            price={t('plans.perTrip.price')}
            currency={t('common.currency')}
            usd={t('plans.perTrip.usd')}
            note={t('plans.perTrip.note')}
            cta={t('common.buy')}
            dataPlan="per-trip"
          />
          <PlanCard
            name={t('plans.pack5.name')}
            price={t('plans.pack5.price')}
            currency={t('common.currency')}
            usd={t('plans.pack5.usd')}
            note={t('plans.pack5.note')}
            cta={t('common.buy')}
            dataPlan="pack-5"
          />
          <PlanCard
            name={t('plans.pack10.name')}
            price={t('plans.pack10.price')}
            currency={t('common.currency')}
            usd={t('plans.pack10.usd')}
            note={t('plans.pack10.note')}
            cta={t('common.buy')}
            dataPlan="pack-10"
            badge={t('plans.pack10.badge')}
            emphasis
          />
          <ExplorerCard
            name={t('plans.explorer.name')}
            price={t('plans.explorer.price')}
            priceSuffix={t('plans.explorer.priceSuffix')}
            usd={t('plans.explorer.usd')}
            features={[
              t('plans.explorer.feature1'),
              t('plans.explorer.feature2'),
              t('plans.explorer.feature3'),
            ]}
            badge={t('plans.explorer.badge')}
            cta={t('plans.explorer.cta')}
          />
        </div>

        {/* ── 6 · Divider ──────────────────────────────────────────── */}
        <hr className="border-0 h-px bg-pine/[0.13] mb-10" />

        {/* ── 7 · FAQ ──────────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="font-display text-[18px] font-semibold text-pine mb-6">
            {t('faq.title')}
          </h2>
          <div className="border-t border-pine/[0.13]">
            {([1, 2, 3, 4, 5, 6] as const).map(n => (
              <details
                key={n}
                className="group border-b border-pine/[0.13] [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer flex justify-between items-center gap-4 py-4 font-sans text-[13px] font-semibold text-pine list-none">
                  <span>{t(`faq.q${n}`)}</span>
                  <span className="font-display text-[18px] font-medium text-sage shrink-0 group-open:hidden">+</span>
                  <span className="font-display text-[18px] font-medium text-sage shrink-0 hidden group-open:inline">−</span>
                </summary>
                <p className="font-sans text-[13px] text-[#4A5568] leading-[1.65] pb-4 pr-6 max-w-[680px]">
                  {t(`faq.a${n}`)}
                </p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}

// ── Cards 1–3 (one-time purchase) ──────────────────────────────────────────────

interface PlanCardProps {
  name:     string
  price:    string
  currency: string
  usd:      string
  note:     string
  cta:      string
  dataPlan: string
  /** Renders the "best value" badge above the name + thicker accent border. */
  badge?:    string
  emphasis?: boolean
}

function PlanCard({ name, price, currency, usd, note, cta, dataPlan, badge, emphasis }: PlanCardProps) {
  const border = emphasis
    ? 'border-[1.5px] border-pine/[0.30]'
    : 'border border-pine/[0.13]'

  return (
    <article className={`bg-[#FDFCF9] rounded-[10px] flex flex-col p-5 ${border}`}>
      {badge && (
        <span className="self-start font-sans text-[9px] font-bold uppercase tracking-[0.08em] text-pine bg-pine/[0.08] px-2 py-1 rounded mb-3">
          {badge}
        </span>
      )}
      <p className="font-sans text-[12px] font-bold text-pine mb-2">{name}</p>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="font-display text-[26px] font-semibold text-pine leading-none">${price}</span>
        <span className="font-sans text-[10px] font-normal text-sage">{currency}</span>
      </div>
      <p className="font-sans text-[10px] text-sage mb-4">{usd}</p>
      <p className="font-sans text-[10px] text-[#4A5568] leading-relaxed border-t border-pine/[0.13] pt-3 mb-4 flex-1">
        {note}
      </p>
      {/* TODO: wire Stripe checkout for `dataPlan` (per-trip / pack-5 / pack-10) */}
      <button
        type="button"
        data-plan={dataPlan}
        className="w-full bg-transparent border border-pine/[0.20] text-pine font-sans text-[10px] font-semibold py-2.5 rounded-[5px] transition-colors hover:bg-pine/[0.05]"
      >
        {cta}
      </button>
    </article>
  )
}

// ── Card 4 — Explorer Mensual (subscription) ───────────────────────────────────

interface ExplorerCardProps {
  name:        string
  price:       string
  priceSuffix: string
  usd:         string
  features:    string[]
  badge:       string
  cta:         string
}

function ExplorerCard({ name, price, priceSuffix, usd, features, badge, cta }: ExplorerCardProps) {
  return (
    <article className="bg-pine rounded-[10px] flex flex-col p-5">
      <span className="self-start font-sans text-[9px] font-bold uppercase tracking-[0.08em] text-sand bg-coral px-2 py-1 rounded mb-3">
        {badge}
      </span>
      <p className="font-sans text-[12px] font-bold text-sand/[0.85] mb-2">{name}</p>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="font-display text-[26px] font-semibold text-sand leading-none">${price}</span>
        <span className="font-sans text-[10px] font-normal text-sand/[0.45]">{priceSuffix}</span>
      </div>
      <p className="font-sans text-[10px] text-sand/[0.30] mb-4">{usd}</p>
      <ul className="border-t border-sand/[0.12] pt-3 mb-4 flex-1 flex flex-col gap-2">
        {features.map(feature => (
          <li
            key={feature}
            className="flex items-start gap-2 font-sans text-[10px] text-sand/[0.70] leading-snug"
          >
            <span aria-hidden className="text-coral leading-none mt-[1px]">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {/* TODO: wire Stripe checkout for `explorer-monthly` */}
      <button
        type="button"
        data-plan="explorer-monthly"
        className="w-full bg-transparent border border-sand/[0.25] text-sand font-sans text-[10px] font-semibold py-2.5 rounded-[5px] transition-colors hover:bg-sand/[0.05]"
      >
        {cta}
      </button>
    </article>
  )
}
