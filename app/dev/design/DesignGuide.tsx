'use client'
/**
 * app/dev/design/DesignGuide.tsx
 *
 * Style guide: every token and component in its states. Colour values are READ from the live CSS variables
 * (never typed here), so this page cannot drift from globals.css.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  BottomSheet, Button, CardTitle, Chip, DestinationCard, Eyebrow, FilterPanel, InfoCard, Input, Lede, PageTitle, SearchInput, SectionTitle, Tag,
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
      <h2 className="m-0 font-sans text-h2 text-pine">{title}</h2>
      {note && <p className="m-0 mt-3 max-w-[70ch] font-sans text-body text-ink-2">{note}</p>}
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
        <p className="m-0 font-sans text-body text-ink-2">Esc, the backdrop and × close it. Tab stays inside; focus returns to the button.</p>
      </BottomSheet>
    </>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────────

const BRAND = ['pine', 'sage', 'sand', 'cream', 'coral', 'fjord', 'mint', 'white']
const FUNCTIONAL = ['success', 'warning', 'error']
const TEXT = ['ink-2', 'ink-3', 'label']
const LINES = ['line-soft', 'line-strong', 'line-card', 'line-panel', 'line-chip', 'line-btn']

export default function DesignGuide({ embed }: { embed: boolean }) {
  const [email, setEmail] = useState('hola@')
  const [search, setSearch] = useState('')
  const [chipSel, setChipSel] = useState(true)
  return (
    <div className="mx-auto max-w-[1180px] px-gutter pb-24 md:px-8">
      {!embed && (
        <header className="py-section">
          <PageTitle
            eyebrow="Design foundation · not linked, noindex"
            title="Tokens and components"
            lede="Every token and component in its states. Values are read live from the CSS variables, so this page cannot drift from globals.css."
          >
            <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2">
              {['tokens', 'type', 'buttons', 'cards', 'chips', 'inputs', 'filters', 'mobile'].map(s => <Button key={s} size="sm" variant="secondary" href={`#${s}`}>{s}</Button>)}
            </nav>
          </PageTitle>
        </header>
      )}

      <Block id="tokens" title="Tokens" note="One source: the :root block in app/globals.css. Tailwind reads it (tailwind.config.js); nothing re-defines a value.">
        <Row label="Brand">{BRAND.map(n => <Swatch key={n} name={n} />)}</Row>
        <Row label="Functional">{FUNCTIONAL.map(n => <Swatch key={n} name={n} />)}</Row>
        <Row label="Text neutrals (plus pine and sage)">{TEXT.map(n => <Swatch key={n} name={n} />)}</Row>
        <Row label="Lines (border colour)">{LINES.map(n => <Swatch key={n} name={n} border />)}</Row>
        <Row label="Radii">
          {[['pill', '999px'], ['destination', '24px'], ['info', '16px'], ['sheet', '24px (top)']].map(([n, v]) => (
            <div key={n} className="flex flex-col items-start gap-2">
              <div className="h-16 w-28 border border-line-strong bg-white" style={{ borderRadius: `var(--radius-${n})` }} />
              <span className="font-mono text-[12px] font-medium text-pine">--radius-{n}</span><span className="font-mono text-[12px] text-label">{v}</span>
            </div>
          ))}
        </Row>
        <Row label="Shadows">
          {[['soft', 'cards'], ['pop', 'menus'], ['sheet', 'bottom sheet']].map(([n, v]) => (
            <div key={n} className="flex flex-col items-start gap-2">
              <div className="h-16 w-28 rounded-info bg-white" style={{ boxShadow: `var(--shadow-${n})` }} />
              <span className="font-mono text-[12px] font-medium text-pine">--shadow-{n}</span><span className="font-mono text-[12px] text-label">{v}</span>
            </div>
          ))}
        </Row>
        <Row label="Spacing (4px base)">
          {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map(n => (
            <div key={n} className="flex flex-col items-start gap-2">
              <div className="h-4 bg-sage" style={{ width: `var(--space-${n})` }} />
              <span className="font-mono text-[12px] text-label">--space-{n}</span>
            </div>
          ))}
        </Row>
      </Block>

      <Block id="type" title="Typography" note="The page title is the /guias H1 (clamp 44–72px, 800, −0.04em, line-height .92, pine). H2, H3 and the eyebrow come from the same page.">
        <Row label="PageTitle = Eyebrow + H1 + Lede"><PageTitle eyebrow="Guías de viaje" title={<>Destinos que<br />conocemos bien</>} lede="Guías editoriales con criterio real, sin listas genéricas ni ads disfrazados de contenido." /></Row>
        <Row label="SectionTitle (H2)"><SectionTitle eyebrow="Destinos" lede="Un destino a la vez.">Destinos curados</SectionTitle></Row>
        <Row label="CardTitle (H3)"><CardTitle>Valle de Bravo / Avándaro</CardTitle></Row>
        <Row label="Eyebrow"><Eyebrow>Zonas de la ciudad</Eyebrow></Row>
        <Row label="Body steps"><div className="flex flex-col gap-2"><Lede>Lede 18/1.75: the intro line under a title.</Lede><p className="m-0 font-sans text-body text-ink-2">Body 16/1.6, ink-2.</p><p className="m-0 font-sans text-small text-ink-2">Small 14/1.7, secondary text.</p><p className="m-0 font-sans text-tiny text-label">Tiny 12/1.5, labels and hints.</p></div></Row>
      </Block>

      <Block id="buttons" title="Buttons" note="Pill, Manrope 700. md = 48px, sm = 40px. primary / secondary / ghost, each in default, hover, focus, disabled.">
        {(['md', 'sm'] as const).map(size => (
          <div key={size} className="flex flex-col gap-6">
            {(['primary', 'secondary', 'ghost'] as const).map(variant => (
              <Row key={variant} label={`${variant} · ${size}`}>
                <Button variant={variant} size={size}>Default</Button>
                <Button variant={variant} size={size} className={variant === 'primary' ? '!border-pine-hover !bg-pine-hover' : variant === 'secondary' ? '!border-pine' : '!bg-sand'}>Hover</Button>
                <Button variant={variant} size={size} className="outline outline-2 outline-offset-2 outline-fjord">Focus</Button>
                <Button variant={variant} size={size} disabled>Disabled</Button>
                {variant === 'primary' && <Button size={size} iconAfter={Arrow}>With icon</Button>}
                {variant === 'secondary' && <Button variant="secondary" size={size} href="#buttons">As a link</Button>}
              </Row>
            ))}
          </div>
        ))}
        <Row label="Full width"><div className="w-full max-w-[360px]"><Button fullWidth>Generar itinerario →</Button></div></Row>
      </Block>

      <Block id="cards" title="Cards" note="Two cards. Destination (radius 24, illustration on top): guides, experiences, hotels. Info (radius 16): everything else.">
        <Row label="DestinationCard">
          <div className="w-full max-w-[420px]"><DestinationCard href="#cards" image={{ src: '/images/guides/cancun.jpg', alt: 'Cancún' }} eyebrow="Riviera Maya" title="Cancún" excerpt="Playa, ritmo de resort y la puerta de entrada al Caribe mexicano." tags={['Playa', 'Familia', 'Resort']} cta="Ver guía" /></div>
          <div className="w-full max-w-[420px]"><DestinationCard href="#cards" image={{ src: '/images/guides/atacama.png', alt: 'Atacama' }} eyebrow="Chile" title="Atacama" badge="Featured" featured excerpt="Desierto, salares y los cielos más claros del mundo." cta="Ver guía destacada" /></div>
        </Row>
        <Row label="InfoCard">
          <div className="w-full max-w-[320px]"><InfoCard title="Aeropuerto" eyebrow="Antes de llegar">Un taxi autorizado o Uber tarda 30–45 min a tu zona.</InfoCard></div>
          <div className="w-full max-w-[320px]"><InfoCard href="#cards" title="Interactive" eyebrow="Link card">The whole card is a link; the border darkens on hover.</InfoCard></div>
          <div className="w-full max-w-[320px]"><InfoCard size="sm" title="Small padding">20px instead of 24px.</InfoCard></div>
        </Row>
      </Block>

      <Block id="chips" title="Chips and tags" note="Chip: 44px filter toggle (aria-pressed). Tag: the small non-interactive label on cards.">
        <Row label="Chip"><Chip label="Default" selected={false} onClick={() => {}} /><Chip label="Selected" selected onClick={() => {}} /><Chip label="Toggle me" selected={chipSel} onClick={() => setChipSel(v => !v)} /><Chip label="With count" count={24} selected={false} onClick={() => {}} /><Chip label="Disabled" selected={false} disabled onClick={() => {}} /></Row>
        <Row label="Tag"><Tag>Familia</Tag><Tag>Playa</Tag><Tag>Naturaleza</Tag></Row>
      </Block>

      <Block id="inputs" title="Inputs" note="Input: 48px pill with a visible label. SearchInput: 56px pill with icon and clear.">
        <Row label="Input">
          <div className="w-full max-w-[320px]"><Input label="Email" placeholder="tu@correo.com" /></div>
          <div className="w-full max-w-[320px]"><Input label="Filled" value={email} onChange={e => setEmail(e.target.value)} hint="We never share it." /></div>
          <div className="w-full max-w-[320px]"><Input label="Error" defaultValue="hola@" error="Ingresa un email válido" /></div>
          <div className="w-full max-w-[320px]"><Input label="Disabled" disabled defaultValue="locked" /></div>
        </Row>
        <Row label="SearchInput"><div className="w-full max-w-[420px]"><SearchInput label="Buscar" placeholder="Busca un destino" value={search} onChange={setSearch} clearLabel="Limpiar" /></div><div className="w-full max-w-[420px]"><SearchInput label="Buscar (con texto)" value="Oaxaca" onChange={() => {}} clearLabel="Limpiar" /></div></Row>
      </Block>

      <Block id="filters" title="FilterPanel" note="One filter pattern for every catalog page. Desktop: chips inline in a panel. Mobile (under 768px): a “Filtros (n)” button opens a bottom sheet with a live result count. Resize the window, or use the 390px preview below.">
        <FilterDemo />
        <Row label="BottomSheet on its own"><SheetDemo /></Row>
      </Block>

      {!embed && (
        <Block id="mobile" title="Mobile preview (390 px)" note="The same page inside a 390px frame, so the mobile layout and the filter bottom sheet can be checked from a desktop screen.">
          <iframe title="Mobile preview" src="/dev/design?embed=1" width={390} height={780} className="rounded-sheet border-2 border-pine bg-cream" />
        </Block>
      )}
    </div>
  )
}
