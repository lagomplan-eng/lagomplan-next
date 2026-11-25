'use client'
/**
 * app/dev/design/DesignGuide.tsx
 *
 * Style guide: every token and component in its states. Colour values are READ from the live CSS variables
 * (never typed here), so this page cannot drift from globals.css.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  BottomSheet, Body, Button, CardTitle, Chip, DestinationCard, Eyebrow, FilterPanel, InfoCard, Input, Lede, PageTitle, SearchInput, SectionTitle, Tag, Textarea,
} from '../../../components/design'
import type { FilterGroup } from '../../../components/design'

// ── helpers ──────────────────────────────────────────────────────────────────────

function toHex(rgb: string): string {
  const m = rgb.match(/[\d.]+/g)
  if (!m || m.length < 3) return rgb
  const hex = '#' + m.slice(0, 3).map(n => Math.round(+n).toString(16).padStart(2, '0')).join('').toUpperCase()
  return m.length > 3 && +m[3] < 1 ? `${hex} @${(+m[3]).toFixed(2).replace(/0+$/, '')}` : hex
}

function Swatch({ name, border }: { name: string; border?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('')
  useEffect(() => {
    if (ref.current) setValue(toHex(getComputedStyle(ref.current).getPropertyValue(border ? 'border-top-color' : 'background-color')))
  }, [border])
  return (
    <div className="flex items-center gap-3">
      <div
        ref={ref}
        data-swatch={name}
        className="size-12 flex-none rounded-info border border-line-soft"
        style={border ? { background: 'white', border: `2px solid var(--${name})` } : { background: `var(--${name})` }}
      />
      <div className="min-w-0 font-sans text-small leading-snug">
        <div className="font-mono text-[12px] font-medium text-pine">--{name}</div>
        <div className="font-mono text-[12px] text-label">{value}</div>
      </div>
    </div>
  )
}

function Block({ id, title, note, children }: { id: string; title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="border-t-2 border-pine py-section">
      <h2 className="m-0 font-sans text-h2 text-pine [text-wrap:balance]">{title}</h2>
      {note && <p className="m-0 mt-3 max-w-[70ch] font-sans text-body text-ink-body">{note}</p>}
      <div className="mt-8 flex flex-col gap-10">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="m-0 mb-3 font-mono text-[12px] uppercase tracking-[.08em] text-label">{label}</p>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </div>
  )
}

const Arrow = <span>→</span>

// ── FilterPanel demo data ────────────────────────────────────────────────────────

const ITEMS = [
  { id: 1, name: 'Parque Xcaret', region: 'mexico', who: 'familia' }, { id: 2, name: 'Casa Luis Barragán', region: 'mexico', who: 'pareja' },
  { id: 3, name: 'Sunset sail privado', region: 'mexico', who: 'amigos' }, { id: 4, name: 'Valle de la Luna', region: 'latam', who: 'amigos' },
  { id: 5, name: 'Machu Picchu', region: 'latam', who: 'pareja' }, { id: 6, name: 'Islas Feroe', region: 'europa', who: 'pareja' },
  { id: 7, name: 'Dolomitas en familia', region: 'europa', who: 'familia' }, { id: 8, name: 'Gorilas en Ruanda', region: 'africa', who: 'amigos' },
  { id: 9, name: 'Kioto y Osaka', region: 'asia', who: 'pareja' }, { id: 10, name: 'Napa y Sonoma', region: 'norteamerica', who: 'pareja' },
]
const REGIONS = [['mexico', 'México'], ['latam', 'Latinoamérica'], ['norteamerica', 'Norteamérica'], ['europa', 'Europa'], ['asia', 'Asia'], ['africa', 'África']] as const
const WHO = [['familia', 'Familia con niños'], ['pareja', 'Pareja'], ['amigos', 'Amigos']] as const

function FilterDemo() {
  const [regions, setRegions] = useState<string[]>([])
  const [who, setWho] = useState<string[]>([])
  const [q, setQ] = useState('')
  const toggle = (set: (f: (v: string[]) => string[]) => void, k: string) => set(v => (v.includes(k) ? v.filter(x => x !== k) : [...v, k]))
  const shown = ITEMS.filter(i => (regions.length === 0 || regions.includes(i.region)) && (who.length === 0 || who.includes(i.who)))
  const groups: FilterGroup[] = [
    { id: 'region', label: 'Región', activeCount: regions.length, chips: REGIONS.map(([k, l]) => <Chip key={k} label={l} selected={regions.includes(k)} onClick={() => toggle(setRegions, k)} />) },
    { id: 'who', label: 'Para quién', activeCount: who.length, chips: WHO.map(([k, l]) => <Chip key={k} label={l} selected={who.includes(k)} onClick={() => toggle(setWho, k)} />) },
  ]
  const active = [
    ...regions.map(k => ({ key: `r-${k}`, label: REGIONS.find(r => r[0] === k)![1], removeLabel: `Quitar ${k}`, onRemove: () => toggle(setRegions, k) })),
    ...who.map(k => ({ key: `w-${k}`, label: WHO.find(r => r[0] === k)![1], removeLabel: `Quitar ${k}`, onRemove: () => toggle(setWho, k) })),
  ]
  return (
    <div className="flex flex-col gap-6">
      <FilterPanel
        search={{ label: 'Buscar destino', placeholder: 'Busca un destino', value: q, onChange: setQ, noResultsText: 'Sin resultados', suggestions: ITEMS.filter(i => q && i.name.toLowerCase().includes(q.toLowerCase())).map(i => ({ key: String(i.id), label: i.name })), onPick: () => {} }}
        groups={groups}
        activeFilters={active}
        resultsCount={shown.length}
        onClear={() => { setRegions([]); setWho([]) }}
        labels={{ filters: 'Filtros', showResults: n => `Ver ${n ?? ''} resultados`.replace('  ', ' '), clear: 'Limpiar', close: 'Cerrar' }}
      />
      <p data-testid="results" className="m-0 font-sans text-body font-bold text-pine">{shown.length} experiencias</p>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">{shown.map(i => <li key={i.id}><InfoCard size="sm" title={i.name} headingLevel={3}><Tag>{i.who}</Tag></InfoCard></li>)}</ul>
    </div>
  )
}

function SheetDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open a bottom sheet</Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Sheet title" closeLabel="Close" footer={<Button fullWidth onClick={() => setOpen(false)}>Primary action</Button>}>
        <p className="m-0 font-sans text-body text-ink-body">Esc, the backdrop and × close it. Tab stays inside; focus returns to the button.</p>
      </BottomSheet>
    </>
  )
}

// ── Home vs components ────────────────────────────────────────────────────────────
// The "home" side is home's own markup: the class strings below are copied from app/[locale]/page.tsx,
// components/GuidesPreview.tsx, components/forms/HeroForm.tsx and the .sec-label / .btn-* rules in globals.css.
// They are the reference, so the legacy hex values stay here (components/design must not contain any).
// e2e/design-system.spec.ts compares each pair's computed style, and compares the home side with www /es.

function Pair({ id, name, status, bg = 'bg-white', home, component }: { id: string; name: string; status: 'match' | 'derived'; bg?: string; home?: ReactNode; component: ReactNode }) {
  return (
    <div data-pair={id} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2 flex items-center gap-3">
        <span className="font-sans text-small font-semibold text-pine">{name}</span>
        <span data-status={status} className={`rounded-full border px-2.5 py-0.5 font-sans text-micro ${status === 'match' ? 'border-pine/20 bg-mint text-pine' : 'border-line-sage bg-white text-sage-text'}`}>{status === 'match' ? 'matches home' : 'derived from home'}</span>
      </div>
      <div className={`min-w-0 rounded-info border border-line-hair p-6 ${bg}`}>
        <p className="m-0 mb-3 font-mono text-[11px] uppercase tracking-[.08em] text-label">Home (real classes)</p>
        <div data-side="home">{home ?? <p className="m-0 font-sans text-small text-label">Home has no example of this.</p>}</div>
      </div>
      <div className={`min-w-0 rounded-info border border-line-hair p-6 ${bg}`}>
        <p className="m-0 mb-3 font-mono text-[11px] uppercase tracking-[.08em] text-label">Component</p>
        <div data-side="component">{component}</div>
      </div>
    </div>
  )
}

function ComparePanel() {
  const [chipOn, setChipOn] = useState(true)
  return (
    <div className="flex flex-col gap-10">
      <Pair id="eyebrow" name="Eyebrow (.sec-label)" status="match"
        home={<span className="sec-label">Planificador de viajes</span>}
        component={<Eyebrow>Planificador de viajes</Eyebrow>} />
      <Pair id="h1" name="Page title (H1)" status="match"
        home={<h1 className="font-sans text-[60px] max-[768px]:text-[40px] font-bold text-[#0F3A33] leading-[1.05] tracking-[-1.5px] mb-5 [text-wrap:balance] m-0">Viaja bien. Planea menos.</h1>}
        component={<PageTitle title="Viaja bien. Planea menos." />} />
      <Pair id="lede" name="Hero lede" status="match"
        home={<p className="font-sans text-[15px] text-[#3E5F58] leading-[1.75] mb-7 max-w-[360px] max-[768px]:max-w-full [text-wrap:balance] m-0">Describe tu viaje: destino, días, quién va y en 60 segundos tienes el itinerario día por día.</p>}
        component={<Lede className="mb-7 max-w-[360px] !leading-[1.75] max-md:max-w-full">Describe tu viaje: destino, días, quién va y en 60 segundos tienes el itinerario día por día.</Lede>} />
      <Pair id="h2" name="Section title (H2) + lede" status="match"
        home={<div><h2 className="font-sans text-[40px] max-[768px]:text-[30px] font-bold text-[#0F3A33] leading-[1.15] mb-4 [text-wrap:balance] m-0">Del destino al itinerario en 60 segundos.</h2><p className="font-sans text-[15px] text-[#3E5F58] leading-[1.7] max-w-[520px] [text-wrap:balance] m-0">Sin pestañas abiertas, sin hojas de cálculo.</p></div>}
        component={<SectionTitle lede="Sin pestañas abiertas, sin hojas de cálculo.">Del destino al itinerario en 60 segundos.</SectionTitle>} />
      <Pair id="h2xl" name="Closing title (H2, 50px)" status="match"
        home={<h2 className="font-sans text-[50px] max-[768px]:text-[34px] font-bold text-[#0F3A33] leading-[1.08] [text-wrap:balance] m-0">Tu próximo viaje puede estar listo en 60 segundos.</h2>}
        component={<SectionTitle size="xl">Tu próximo viaje puede estar listo en 60 segundos.</SectionTitle>} />
      <Pair id="body" name="Paragraphs" status="match"
        home={<div><p className="font-sans text-[15px] text-[#0F3A33] leading-[1.8] mb-4 m-0 [text-wrap:pretty]">Planificar un viaje no debería tomar más tiempo que el viaje mismo.</p><p className="font-sans text-[15px] text-[#3E5F58] leading-[1.8] m-0 [text-wrap:pretty]">El nombre viene del sueco: lagom.</p></div>}
        component={<div><Body tone="strong" className="mb-4">Planificar un viaje no debería tomar más tiempo que el viaje mismo.</Body><Body>El nombre viene del sueco: lagom.</Body></div>} />
      <Pair id="btn-solid" name="Button · primary (.btn-solid)" status="match"
        home={<a href="#compare" className="btn-solid">Explorar destinos</a>}
        component={<Button href="#compare">Explorar destinos</Button>} />
      <Pair id="btn-outline" name="Button · secondary (.btn-outline)" status="match"
        home={<a href="#compare" className="btn-outline">Quiénes somos</a>}
        component={<Button variant="secondary" href="#compare">Quiénes somos</Button>} />
      <Pair id="btn-ghost" name="Button · ghost" status="derived"
        home={<a href="#compare" className="btn-ghost">Ver más guías →</a>}
        component={<Button variant="ghost" href="#compare">Ver más guías →</Button>} />
      <Pair id="btn-sm" name="Button · small" status="derived" component={<div className="flex gap-3"><Button size="sm">Small primary</Button><Button size="sm" variant="secondary">Small outline</Button></div>} />
      <Pair id="guide-card" name="Guide card (GuidesPreview)" status="match" bg="bg-cream"
        home={
          <a href="#compare" className="group overflow-hidden rounded-[22px] bg-white shadow-sm hover:shadow-md transition block">
            <div className="aspect-[4/3] overflow-hidden bg-[#EDE7E1] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/guides/cancun.jpg" alt="Cancún" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
            </div>
            <div className="p-6">
              <h3 className="text-[22px] leading-tight tracking-[-0.02em] text-[#0F3A33] transition group-hover:text-[#2D6B57] [text-wrap:balance] m-0">Cancún</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#35584F] [text-wrap:pretty] m-0">Playa, ritmo de resort y la puerta de entrada al Caribe mexicano.</p>
            </div>
          </a>}
        component={<DestinationCard href="#compare" image={{ src: '/images/guides/cancun.jpg', alt: 'Cancún' }} title="Cancún" excerpt="Playa, ritmo de resort y la puerta de entrada al Caribe mexicano." />} />
      <Pair id="review-card" name="Review card" status="match" bg="bg-white"
        home={<div className="rounded-[12px] p-9 max-[768px]:p-7" style={{ background: '#FFF9F3', border: '1px solid rgba(200,191,181,.22)' }}><p className="font-sans text-[15px] text-[#0F3A33] leading-[1.8] mb-6 m-0">&ldquo;Buen vino y arquitectura con historia.&rdquo;</p><p className="font-sans text-[13px] font-semibold text-[#0F3A33] m-0">Julia</p></div>}
        component={<InfoCard><p className="m-0 mb-6 font-sans text-body text-pine">&ldquo;Buen vino y arquitectura con historia.&rdquo;</p><p className="m-0 font-sans text-small font-semibold text-pine">Julia</p></InfoCard>} />
      <Pair id="form-card" name="Planner card (white InfoCard)" status="match" bg="bg-cream"
        home={<div className="bg-white border border-[#E5E5E5] rounded-[12px] px-6 pt-5 pb-4 shadow-[0_4px_24px_rgba(15,58,51,.06)]"><span className="font-sans text-[10px] font-medium tracking-[1.5px] text-[#6B8F86] uppercase block">Tu próximo viaje</span></div>}
        component={<InfoCard tone="white"><span className="block font-sans text-micro font-medium uppercase tracking-[1.5px] text-sage-text">Tu próximo viaje</span></InfoCard>} />
      <Pair id="chip-sm" name="Chip (interest chip)" status="match"
        home={<div className="flex gap-2"><button type="button" className="font-sans text-[10px] rounded-full px-3 py-[6px] border transition-all leading-none bg-white border-[rgba(107,143,134,.22)] text-[#6B8F86] hover:border-[rgba(15,58,51,.2)]">Playa</button><button type="button" className="font-sans text-[10px] rounded-full px-3 py-[6px] border transition-all leading-none bg-[#E4EFEC] border-[rgba(15,58,51,.2)] text-[#0F3A33]">Cultura</button></div>}
        component={<div className="flex gap-2"><Chip size="sm" label="Playa" selected={false} onClick={() => {}} /><Chip size="sm" label="Cultura" selected onClick={() => {}} /></div>} />
      <Pair id="chip-md" name="Chip · filter size" status="derived"
        home={<div className="flex gap-2"><button type="button" className="flex-1 min-h-[44px] font-sans text-[13px] text-center py-2.5 px-4 border rounded-[10px] bg-white border-[rgba(107,143,134,.22)] text-[#6B8F86]">relajado</button><button type="button" className="flex-1 min-h-[44px] font-sans text-[13px] text-center py-2.5 px-4 border rounded-[10px] bg-[#E4EFEC] border-[rgba(15,58,51,.24)] text-[#0F3A33]">balanceado</button></div>}
        component={<div className="flex gap-2"><Chip label="relajado" selected={false} onClick={() => {}} /><Chip label="Toggle me" selected={chipOn} onClick={() => setChipOn(v => !v)} /></div>} />
      <Pair id="tag" name="Tag" status="derived" component={<div className="flex gap-2"><Tag>Familia</Tag><Tag>Playa</Tag></div>} />
      <Pair id="field" name="Input · place / date field" status="match"
        home={<div><label className="font-sans text-[12px] font-semibold text-[#0F3A33] block mb-1.5">Origen</label><input readOnly placeholder="Ciudad de origen" className="w-full font-sans text-[13px] border bg-white py-2 text-[#0F1A16] placeholder-[#BDBDBD] rounded-[2px] border-[#C8D9D3] pr-7 pl-3" /></div>}
        component={<Input label="Origen" placeholder="Ciudad de origen" />} />
      <Pair id="field-soft" name="Input · budget field (soft)" status="match"
        home={<div><label className="font-sans text-[12px] font-semibold text-[#0F3A33] block mb-1.5">Presupuesto</label><input readOnly placeholder="¿Cuánto tienes en mente?" className="w-full font-sans text-[13px] border border-[rgba(107,143,134,.22)] bg-white pl-3 pr-3 py-2.5 text-[#0F3A33] placeholder-[#BDBDBD] rounded-[8px]" /></div>}
        component={<Input variant="soft" label="Presupuesto" placeholder="¿Cuánto tienes en mente?" />} />
      <Pair id="textarea" name="Textarea" status="match"
        home={<textarea readOnly rows={2} placeholder="¿Algo más? Ej. yoga, surf…" className="w-full font-sans text-[13px] border border-[rgba(107,143,134,.22)] bg-white px-3 py-2.5 text-[#0F3A33] placeholder-[#BDBDBD] resize-none rounded-[8px]" />}
        component={<Textarea label="Más intereses" hideLabel rows={2} placeholder="¿Algo más? Ej. yoga, surf…" />} />
      <Pair id="search" name="SearchInput" status="derived" component={<SearchInput label="Buscar" placeholder="Busca un destino" value="" onChange={() => {}} />} />
      <Pair id="on-dark" name="Newsletter field + button" status="derived"
        bg="bg-pine"
        home={<div className="flex"><input readOnly placeholder="Tu correo electrónico" className="min-w-0 flex-1 font-sans text-[15px] px-5 py-4 text-[#FFF9F3] placeholder-[rgba(255,249,243,0.58)]" style={{ border: '1px solid rgba(255,249,243,0.18)', background: 'rgba(255,255,255,0.10)' }} /><button type="button" className="font-sans text-[15px] font-semibold px-6 py-4 whitespace-nowrap border-none" style={{ background: '#FFF9F3', color: '#0F3A33' }}>Suscribirme</button></div>}
        component={<div className="flex gap-3"><Input variant="onDark" label="Correo" hideLabel className="min-w-0 flex-1" placeholder="Tu correo electrónico" /><Button variant="inverse">Suscribirme</Button></div>} />
    </div>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────────

const BRAND = ['pine', 'sage', 'sage-text', 'sand', 'cream', 'coral', 'fjord', 'mint', 'white']
const FUNCTIONAL = ['success', 'warning', 'error', 'field-error']
const TEXT = ['ink-body', 'ink-card', 'ink-input', 'ink-2', 'ink-3', 'label', 'placeholder']
const LINES = ['line-section', 'line-hair', 'line-field', 'line-sage', 'line-form', 'line-divider', 'line-soft', 'line-strong', 'line-card', 'line-panel', 'line-chip', 'line-btn']

export default function DesignGuide({ embed }: { embed: boolean }) {
  const [email, setEmail] = useState('hola@')
  const [search, setSearch] = useState('')
  const [chipSel, setChipSel] = useState(true)
  return (
    <div className="mx-auto max-w-[1180px] px-gutter pb-24 md:px-8">
      {!embed && (
        <header className="py-section">
          <PageTitle
            eyebrow="Design foundation · based on home · not linked, noindex"
            title="Tokens and components"
            lede="The canon is the home page (www.lagomplan.com/es). Values are read live from the CSS variables; the first section puts home's real elements next to the components."
          >
            <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2">
              {['compare', 'tokens', 'type', 'buttons', 'cards', 'chips', 'inputs', 'filters', 'mobile'].map(s => <Button key={s} size="sm" variant="secondary" href={`#${s}`}>{s}</Button>)}
            </nav>
          </PageTitle>
        </header>
      )}

      <Block id="compare" title="Home vs components" note="Left: home's own markup (the class strings copied from the home page). Right: the shared component. “matches home” = measured equal (e2e checks the computed styles, and against the live /es page). “derived from home” = home has no example, so it is built from home's colours, radii and type; see docs/design/home-canon.md.">
        <ComparePanel />
      </Block>

      <Block id="tokens" title="Tokens" note="One source: the :root block in app/globals.css. Tailwind reads it (tailwind.config.js); nothing re-defines a value.">
        <Row label="Brand">{BRAND.map(n => <Swatch key={n} name={n} />)}</Row>
        <Row label="Functional">{FUNCTIONAL.map(n => <Swatch key={n} name={n} />)}</Row>
        <Row label="Text">{TEXT.map(n => <Swatch key={n} name={n} />)}</Row>
        <Row label="Lines (border colour)">{LINES.map(n => <Swatch key={n} name={n} border />)}</Row>
        <Row label="Radii">
          {[['btn', '8px: buttons, textarea'], ['info', '12px: cards, tiles'], ['destination', '22px: guide card'], ['field', '2px: place fields'], ['sheet', '22px (top, derived)'], ['pill', '9999px: chips']].map(([n, v]) => (
            <div key={n} className="flex flex-col items-start gap-2">
              <div className="h-16 w-28 border border-line-strong bg-white" style={{ borderRadius: `var(--radius-${n})` }} />
              <span className="font-mono text-[12px] font-medium text-pine">--radius-{n}</span><span className="font-mono text-[12px] text-label">{v}</span>
            </div>
          ))}
        </Row>
        <Row label="Shadows">
          {[['soft', 'guide card'], ['lift', 'guide card hover'], ['form', 'planner card'], ['pop', 'menus (derived)'], ['sheet', 'bottom sheet (derived)']].map(([n, v]) => (
            <div key={n} className="flex flex-col items-start gap-2">
              <div className="h-16 w-28 rounded-info bg-white" style={{ boxShadow: `var(--shadow-${n})` }} />
              <span className="font-mono text-[12px] font-medium text-pine">--shadow-{n}</span><span className="font-mono text-[12px] text-label">{v}</span>
            </div>
          ))}
        </Row>
        <Row label="Spacing (4px base; home: sections 96, 64 on mobile; page 1280 / gutter 24; grid gap 24)">
          {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map(n => (
            <div key={n} className="flex flex-col items-start gap-2">
              <div className="h-4 bg-sage" style={{ width: `var(--space-${n})` }} />
              <span className="font-mono text-[12px] text-label">--space-{n}</span>
            </div>
          ))}
        </Row>
      </Block>

      <Block id="type" title="Typography" note="Home's scale, Manrope throughout. H1 60/700/−1.5px (40 on mobile); H2 40/700 (30 on mobile; closing title 50/34); card title 22/400/−0.02em; names 18/600; feature titles 15/600; eyebrow 11/500/.12em; body 15/1.8; small 13; tiny 12; micro 10.">
        <Row label="PageTitle = Eyebrow + H1 + Lede"><PageTitle eyebrow="Planificador de viajes" title="Viaja bien. Planea menos." lede="Describe tu viaje: destino, días, quién va y en 60 segundos tienes el itinerario día por día." /></Row>
        <Row label="SectionTitle (H2)"><SectionTitle eyebrow="Cómo funciona" lede="Sin pestañas abiertas, sin hojas de cálculo, sin horas de investigación.">Del destino al itinerario en 60 segundos.</SectionTitle></Row>
        <Row label="CardTitle (H3)"><CardTitle>Valle de Bravo / Avándaro</CardTitle></Row>
        <Row label="Eyebrow"><Eyebrow>Zonas de la ciudad</Eyebrow></Row>
        <Row label="Body steps"><div className="flex flex-col gap-2"><Lede>Lede 15/1.7: the intro line under a title.</Lede><Body>Body 15/1.8, ink-body.</Body><p className="m-0 font-sans text-small text-ink-body">Small 13/1.55, secondary text.</p><p className="m-0 font-sans text-tiny text-sage-text">Tiny 12/1.55, labels and hints.</p></div></Row>
      </Block>

      <Block id="buttons" title="Buttons" note="Home's: 8px radius, Manrope 13px, tracking .03em, padding 12/24. primary = .btn-solid, secondary = .btn-outline; ghost, inverse and sm are derived.">
        {(['md', 'sm'] as const).map(size => (
          <div key={size} className="flex flex-col gap-6">
            {(['primary', 'secondary', 'ghost'] as const).map(variant => (
              <Row key={variant} label={`${variant} · ${size}`}>
                <Button variant={variant} size={size}>Default</Button>
                <Button variant={variant} size={size} className={variant === 'primary' ? '!bg-btn-solid-hover' : '!bg-mint'}>Hover</Button>
                <Button variant={variant} size={size} className="outline outline-2 outline-offset-2 outline-fjord">Focus</Button>
                <Button variant={variant} size={size} disabled>Disabled</Button>
                {variant === 'primary' && <Button size={size} iconAfter={Arrow}>With icon</Button>}
                {variant === 'secondary' && <Button variant="secondary" size={size} href="#buttons">As a link</Button>}
              </Row>
            ))}
          </div>
        ))}
        <Row label="inverse (on pine)"><div className="rounded-info bg-pine p-6"><Button variant="inverse">Suscribirme</Button></div></Row>
        <Row label="Full width"><div className="w-full max-w-[360px]"><Button fullWidth>Generar itinerario →</Button></div></Row>
      </Block>

      <Block id="cards" title="Cards" note="Two cards. Destination (home's guide card: radius 22, no border, shadow-sm, image on top): guides, experiences, hotels. Info (radius 12): cream = home's review card, white = home's planner card.">
        <Row label="DestinationCard">
          <div className="w-full max-w-[420px]"><DestinationCard href="#cards" image={{ src: '/images/guides/cancun.jpg', alt: 'Cancún' }} title="Cancún" excerpt="Playa, ritmo de resort y la puerta de entrada al Caribe mexicano." /></div>
          <div className="w-full max-w-[420px]"><DestinationCard href="#cards" image={{ src: '/images/guides/cancun.jpg', alt: 'Cancún' }} eyebrow="Riviera Maya" title="Cancún" excerpt="With the derived eyebrow, tags and call to action." tags={['Playa', 'Familia']} cta="Ver guía" /></div>
          <div className="w-full max-w-[420px]"><DestinationCard href="#cards" image={{ src: '/images/guides/atacama.png', alt: 'Atacama' }} eyebrow="Chile" title="Atacama" badge="Featured" featured excerpt="Derived: title over the image." cta="Ver guía destacada" /></div>
        </Row>
        <Row label="InfoCard">
          <div className="w-full max-w-[320px] rounded-info bg-white p-4"><InfoCard title="Aeropuerto" eyebrow="Antes de llegar">Un taxi autorizado o Uber tarda 30–45 min a tu zona.</InfoCard></div>
          <div className="w-full max-w-[320px]"><InfoCard tone="white" title="Planner card" eyebrow="White tone">Border #E5E5E5 and the planner shadow.</InfoCard></div>
          <div className="w-full max-w-[320px]"><InfoCard href="#cards" size="sm" title="Interactive" eyebrow="Link card (derived)">The border darkens on hover.</InfoCard></div>
          <div className="w-full max-w-[320px]"><InfoCard tone="mint" size="sm" title="Mint (derived)">Home's selected tint.</InfoCard></div>
        </Row>
      </Block>

      <Block id="chips" title="Chips and tags" note="Chip sm = home's interest chip, exactly. Chip md (default) is derived for filters: same colours and shape at 13px, 44px high. Tag is the small label on cards.">
        <Row label="Chip sm (home)"><Chip size="sm" label="Playa" selected={false} onClick={() => {}} /><Chip size="sm" label="Cultura" selected onClick={() => {}} /></Row>
        <Row label="Chip md"><Chip label="Default" selected={false} onClick={() => {}} /><Chip label="Selected" selected onClick={() => {}} /><Chip label="Toggle me" selected={chipSel} onClick={() => setChipSel(v => !v)} /><Chip label="With count" count={24} selected={false} onClick={() => {}} /><Chip label="Disabled" selected={false} disabled onClick={() => {}} /></Row>
        <Row label="Tag"><Tag>Familia</Tag><Tag>Playa</Tag><Tag>Naturaleza</Tag></Row>
      </Block>

      <Block id="inputs" title="Inputs" note="Default = home's place / date field (radius 2, #C8D9D3). soft = home's budget field and textarea (radius 8). onDark and SearchInput are derived.">
        <Row label="Input">
          <div className="w-full max-w-[320px]"><Input label="Email" placeholder="tu@correo.com" /></div>
          <div className="w-full max-w-[320px]"><Input label="Filled" value={email} onChange={e => setEmail(e.target.value)} hint="We never share it." /></div>
          <div className="w-full max-w-[320px]"><Input label="Error" defaultValue="hola@" error="Ingresa un email válido" /></div>
          <div className="w-full max-w-[320px]"><Input label="Disabled" disabled defaultValue="locked" /></div>
          <div className="w-full max-w-[320px]"><Input variant="soft" label="Soft" placeholder="¿Cuánto tienes en mente?" /></div>
        </Row>
        <Row label="SearchInput (derived)"><div className="w-full max-w-[420px]"><SearchInput label="Buscar" placeholder="Busca un destino" value={search} onChange={setSearch} clearLabel="Limpiar" /></div><div className="w-full max-w-[420px]"><SearchInput label="Buscar (con texto)" value="Oaxaca" onChange={() => {}} clearLabel="Limpiar" /></div></Row>
      </Block>

      <Block id="filters" title="FilterPanel (derived)" note="Home has no filter. Derived from home's planner card (white card, 12/600 labels, chips) and home's outline button for “Filtros (n)”. Desktop: chips inline in a panel. Mobile (under 768px): a bottom sheet with a live result count.">
        <FilterDemo />
        <Row label="BottomSheet on its own (derived)"><SheetDemo /></Row>
      </Block>

      {!embed && (
        <Block id="mobile" title="Mobile preview (390 px)" note="The same page inside a 390px frame, so the mobile layout and the filter bottom sheet can be checked from a desktop screen.">
          <iframe title="Mobile preview" src="/dev/design?embed=1" width={390} height={780} className="max-w-full rounded-sheet border-2 border-pine bg-cream" />
        </Block>
      )}
    </div>
  )
}
