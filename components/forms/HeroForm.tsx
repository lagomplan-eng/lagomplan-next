'use client'

import { useState } from 'react'
import { useRouter } from '../../lib/navigation'
import { useTranslations } from 'next-intl'
import PlacesInput, { type PlaceResult } from './PlacesInput'
import DateRangePicker, { type DateRange } from './DateRangePicker'

type Traveler = 'solo' | 'pareja' | 'familia' | 'amigos'

const INTERESTS = [
  'Playa',
  'Gastronomia',
  'Cultura',
  'Naturaleza',
  'Aventura',
  'Arte',
  'Vida nocturna',
  'Compras',
]

const BABY_AGES = ['0-11 m', '1 ano', '2 anos']
const KID_AGES = Array.from({ length: 12 }, (_, i) => `${i + 3} anos`)

interface Child {
  id: number
  type: 'baby' | 'kid'
  age: string
}

type HeroFormProps = {
  locale?: 'es' | 'en'
  initialValues?: {
    origin?: string
    destination?: string
    start?: string
    end?: string
    nights?: string
    traveler?: string
    interests?: string
    pace?: string
    budget?: string
  }
}

// ── Inline helpers ─────────────────────────────────────────────────
function Req() {
  return <span className="text-[#B94030] ml-0.5 font-normal" aria-hidden="true">*</span>
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p role="alert" className="font-sans text-[11px] text-[#B94030] mt-1.5 leading-snug">
      {msg}
    </p>
  )
}

// ── Component ──────────────────────────────────────────────────────
export default function HeroForm({
  locale = 'es',
  initialValues,
}: HeroFormProps) {
  const router = useRouter()
  const t = useTranslations('form')

const parsedStart = initialValues?.start ? new Date(initialValues.start) : null
const parsedEnd = initialValues?.end ? new Date(initialValues.end) : null

const initialInterestList = initialValues?.interests
  ? initialValues.interests.split(',').map((i) => i.trim()).filter(Boolean)
  : []

const knownInterests = INTERESTS.filter((item) => initialInterestList.includes(item))
const extraInterests = initialInterestList.filter((item) => !INTERESTS.includes(item))

const [originText,  setOriginText]  = useState(initialValues?.origin ?? '')
const [originPlace, setOriginPlace] = useState<PlaceResult | null>(null)

const [destText,    setDestText]    = useState(initialValues?.destination ?? '')
const [destPlace,   setDestPlace]   = useState<PlaceResult | null>(null)

const [dates, setDates] = useState<DateRange>({
  start: parsedStart,
  end: parsedEnd,
  nights: Number(initialValues?.nights ?? 0),
})

const [traveler, setTraveler] = useState<Traveler | null>(
  (initialValues?.traveler as Traveler) ?? null
)

const [adults, setAdults] = useState(2)

const [children, setChildren] = useState<Child[]>([
  { id: 0, type: 'baby', age: '0-11 m' },
  { id: 1, type: 'kid',  age: '3 anos' },
])

const [nextKidId, setNextKidId] = useState(2)
const [groupCount, setGroupCount] = useState(4)

const [interests, setInterests] = useState<string[]>(knownInterests)
const [extra, setExtra] = useState(extraInterests.join(', '))

const [pace, setPace] = useState(initialValues?.pace ?? '')
const [budget, setBudget] = useState(initialValues?.budget ?? '')

const [submitted, setSubmitted] = useState(false)
const [generating, setGenerating] = useState(false)

  const originValue = originPlace?.displayName ?? originText
const destValue = destPlace?.displayName ?? destText
const datesValid = !!(dates.start && dates.end)

function submit(e: React.FormEvent) {
  e.preventDefault()
  setSubmitted(true)

  if (!originValue || !destValue || !datesValid || !traveler || !pace) return

    setGenerating(true)

    const params = new URLSearchParams({
      origin: originValue,
      destination: destValue,
      start:       dates.start?.toISOString().split('T')[0] ?? '',
      end:         dates.end?.toISOString().split('T')[0] ?? '',
      nights:      String(dates.nights),
      traveler:    traveler,
      interests:   [...interests, extra].filter(Boolean).join(', '),
      pace,
      budget,
    })

    router.push(`/planner?${params}` as any)
  }

  // ── Shared style tokens ──────────────────────────────────────────
  const sectionLabel =
    'font-sans text-[12px] font-semibold text-[#0F3A33] block mb-1.5'
  const stepButton =
    'w-8 h-8 border border-[rgba(107,143,134,.28)] bg-white flex items-center justify-center cursor-pointer text-[#0F3A33] text-[16px] hover:border-[#0F3A33] hover:bg-[#E4EFEC] transition-colors select-none'
  const chipBase =
    'font-sans text-[10px] rounded-full px-3 py-[6px] border transition-all leading-none'
  // Divider used between major form sections
  const sectionDivider = 'border-t border-[#EDE9E4] pt-4 mt-2 mb-4'

  return (
    <div className="w-full max-w-[920px] ml-auto max-[1024px]:max-w-full max-[1024px]:ml-0">
      <form onSubmit={submit} noValidate className="flex flex-col">

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E5E5] border-b-0 rounded-[12px_12px_0_0] px-6 pt-5 pb-4 shadow-[0_4px_24px_rgba(15,58,51,.06)]">

          <span className="font-sans text-[10px] font-medium tracking-[1.5px] text-[#6B8F86] uppercase border-b border-[#E5E5E5] pb-3 mb-4 block">
            {t('title')}
          </span>

          {/* ── 1. Where ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2.5 mb-4 max-[560px]:grid-cols-1">
            <div>
  <label htmlFor="origin" className={sectionLabel}>
    {t('origin')}<Req />
  </label>
  <PlacesInput
    id="origin"
    locale={locale}
    placeholder={t('originPlaceholder')}
    value={originText}
    onChange={(v) => { setOriginText(v); if (!v) setOriginPlace(null) }}
    onSelect={setOriginPlace}
  />
  {submitted && !originValue && (
    <FieldError msg={t('errorFrom')} />
  )}
</div>

            <div>
              <label htmlFor="destination" className={sectionLabel}>
                {t('destination')}<Req />
              </label>
              <PlacesInput
                id="destination"
                locale={locale}
                placeholder={t('destinationPlaceholder')}
                value={destText}
                onChange={(v) => { setDestText(v); if (!v) setDestPlace(null) }}
                onSelect={setDestPlace}
              />
              {submitted && !destValue && (
                <FieldError msg={t('errorDestination')} />
              )}
            </div>
          </div>

          {/* ── 2. When ──────────────────────────────────────────── */}
          <div className={sectionDivider}>
            <label className={sectionLabel}>
              {t('dates')}<Req />
            </label>
            <DateRangePicker value={dates} onChange={setDates} />
            {submitted && !datesValid && (
              <FieldError msg={t('errorDates')} />
            )}
          </div>

          {/* ── 3. Who ───────────────────────────────────────────── */}
          <div className="mb-4">
            <label className={`${sectionLabel} mb-2`}>
              {t('whoTravels')}<Req />
            </label>

            <div className="grid grid-cols-4 gap-2 max-[560px]:grid-cols-2">
              {([
                ['solo',    '🧳', t('solo'),    1],
                ['pareja',  '💑', t('pareja'),  2],
                ['familia', '👨‍👩‍👧‍👦', t('familia'), null],
                ['amigos',  '🙌', t('amigos'),  null],
              ] as [Traveler, string, string, number | null][]).map(
                ([id, icon, label, count]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTraveler(id)}
                    className={[
                      'relative flex flex-col items-center gap-1.5 py-2 px-2 border rounded-[12px] transition-all bg-white min-h-[68px]',
                      traveler === id
                        ? 'border-[rgba(15,58,51,.28)] bg-[#E4EFEC]'
                        : 'border-[rgba(107,143,134,.22)] hover:border-[rgba(15,58,51,.24)] hover:bg-[#F7F3EE]',
                    ].join(' ')}
                  >
                    {count && (
                      <span className="absolute top-1.5 right-2 font-mono text-[8px] bg-[#0F3A33] text-[#EDE7E1] px-1.5 py-[1px] rounded-full leading-tight">
                        {count}
                      </span>
                    )}
                    <span className="text-[18px] leading-none">{icon}</span>
                    <span className={`font-sans text-[11px] font-medium ${traveler === id ? 'text-[#0F3A33]' : 'text-[#6B8F86]'}`}>
                      {label}
                    </span>
                  </button>
                )
              )}
            </div>

            {submitted && !traveler && (
              <FieldError msg={t('errorTraveler')} />
            )}

            {/* Family expanded */}
            {traveler === 'familia' && (
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-white border border-[rgba(107,143,134,.22)] rounded-[10px] px-3 py-2.5">
                  <span className="font-sans text-[12px] font-semibold text-[#0F3A33] flex-1">
                    {t('adults')}
                  </span>
                  <div className="flex">
                    <button type="button" onClick={() => setAdults(n => Math.max(1, n - 1))} className={`${stepButton} rounded-l-[4px]`}>−</button>
                    <div className="w-9 h-8 border-y border-[rgba(107,143,134,.28)] bg-white flex items-center justify-center font-mono text-[12px] text-[#0F3A33]">{adults}</div>
                    <button type="button" onClick={() => setAdults(n => Math.min(10, n + 1))} className={`${stepButton} rounded-r-[4px]`}>+</button>
                  </div>
                </div>

                <div>
                  <p className="font-sans text-[12px] font-semibold text-[#0F3A33] mb-2">
                    {t('childrenAges')}
                  </p>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center gap-1.5 bg-white border border-[rgba(107,143,134,.22)] rounded-full px-3 py-1.5">
                        <span className="text-[12px]">{child.type === 'baby' ? '👶' : '🧒'}</span>
                        <select
                          value={child.age}
                          title="age"
                          onChange={e => setChildren(prev => prev.map(c => c.id === child.id ? { ...c, age: e.target.value } : c))}
                          className="font-sans text-[11px] text-[#0F3A33] border-none bg-transparent cursor-pointer outline-none appearance-none"
                        >
                          {(child.type === 'baby' ? BABY_AGES : KID_AGES).map(age => (
                            <option key={age}>{age}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setChildren(prev => prev.filter(c => c.id !== child.id))}
                          className="text-[#BDBDBD] hover:text-[#4A4A4A] text-[13px] leading-none transition-colors"
                        >×</button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setChildren(prev => [...prev, { id: nextKidId, type: 'kid', age: '3 anos' }])
                        setNextKidId(n => n + 1)
                      }}
                      className="font-mono text-[10px] text-[#0F3A33] border border-dashed border-[rgba(15,58,51,.25)] rounded-full px-3 py-1.5 hover:border-[#0F3A33] hover:bg-[#E4EFEC] transition-all"
                    >
                      {t('addChild')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Friends expanded */}
            {traveler === 'amigos' && (
              <div className="mt-3">
                <div className="flex items-center gap-3 bg-white border border-[rgba(107,143,134,.22)] rounded-[10px] px-3 py-2.5">
                  <span className="font-sans text-[12px] font-semibold text-[#0F3A33] flex-1">
                    {t('groupCount')}
                  </span>
                  <div className="flex">
                    <button type="button" onClick={() => setGroupCount(n => Math.max(3, n - 1))} className={`${stepButton} rounded-l-[4px]`}>−</button>
                    <div className="w-9 h-8 border-y border-[rgba(107,143,134,.28)] bg-white flex items-center justify-center font-mono text-[12px] text-[#0F3A33]">{groupCount}</div>
                    <button type="button" onClick={() => setGroupCount(n => Math.min(30, n + 1))} className={`${stepButton} rounded-r-[4px]`}>+</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── 4. Interests + Pace ──────────────────────────────── */}
          <div className={sectionDivider}>
            <label className={sectionLabel}>{t('interests')}</label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {INTERESTS.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setInterests(prev =>
                      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
                    )
                  }
                  className={[
                    chipBase,
                    interests.includes(item)
                      ? 'bg-[#E4EFEC] border-[rgba(15,58,51,.2)] text-[#0F3A33]'
                      : 'bg-white border-[rgba(107,143,134,.22)] text-[#6B8F86] hover:border-[rgba(15,58,51,.2)]',
                  ].join(' ')}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-[11px] text-[10px] text-[#C8D9D3] pointer-events-none">✏</span>
              <textarea
                rows={2}
                value={extra}
                onChange={e => setExtra(e.target.value)}
                placeholder={t('interestsPlaceholder')}
                className="w-full font-sans text-[12px] border border-[rgba(107,143,134,.22)] bg-white pl-8 pr-3 py-2.5 text-[#0F3A33] placeholder-[#BDBDBD] resize-none focus:outline-none focus:border-[#0F3A33] rounded-[8px] transition-colors leading-relaxed"
              />
            </div>
          </div>

          {/* Pace */}
          <div className="mb-4">
            <label className={sectionLabel}>
              {t('pace')}<Req />
            </label>
            <div className="flex gap-1.5 max-[560px]:flex-col">
              {([
  ['Relajado', t('paceRelax')],
  ['Equilibrado', t('paceBalance')],
  ['Activo', t('paceActive')],
] as [string, string][]).map(([id, label]) => (
  <button
    key={id}
    type="button"
    onClick={() => setPace(id)}
    className={[
      'flex-1 min-h-[44px] font-sans text-[13px] font-normal text-center py-2.5 px-4 border rounded-[10px] transition-all',
      pace === id
        ? 'bg-[#E4EFEC] border-[rgba(15,58,51,.24)] text-[#0F3A33]'
        : 'bg-white border-[rgba(107,143,134,.22)] text-[#6B8F86] hover:border-[rgba(15,58,51,.2)] hover:bg-[#FAF8F4]',
    ].join(' ')}
  >
    {label}
  </button>
))}
            </div>
            {submitted && !pace && (
              <FieldError msg={t('errorPace')} />
            )}
          </div>

          {/* ── 5. Budget ────────────────────────────────────────── */}
          <div className="border-t border-[#EDE9E4] pt-4 mb-1">
            <label htmlFor="budget" className={sectionLabel}>
              {t('budget')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[13px] text-[#6B8F86] pointer-events-none">$</span>
              <input
                id="budget"
                type="text"
                value={budget}
                onChange={e => setBudget(e.target.value.replace(/[^0-9,]/g, ''))}
                placeholder={t('budgetPlaceholder')}
                className="w-full font-mono text-[13px] border border-[rgba(107,143,134,.22)] bg-white pl-6 pr-14 py-2.5 text-[#0F3A33] placeholder-[#BDBDBD] focus:outline-none focus:border-[#0F3A33] rounded-[8px] transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[8px] text-[#A0A0A0] uppercase pointer-events-none">
                MXN
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer / CTA ──────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E5E5] border-t-0 rounded-[0_0_12px_12px] px-5 py-3 shadow-[0_4px_24px_rgba(15,58,51,.06)]">
          <button
            type="submit"
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 font-sans text-[12px] font-semibold tracking-[1.5px] uppercase bg-[#0F3A33] text-white py-3.5 rounded-[8px] hover:bg-[#1a4a42] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                {locale === 'es' ? 'Generando...' : 'Generating...'}
              </>
            ) : (
              t('submit')
            )}
          </button>

          <p className="font-sans text-[10px] text-[#6B8F86] text-center mt-2.5 tracking-[.3px]">
            {t('freeNote')}
          </p>
        </div>

      </form>
    </div>
  )
}
