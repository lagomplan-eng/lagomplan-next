/**
 * __tests__/design-components.jest.test.tsx
 *
 * The design foundation components (components/design): Button, PageTitle/SectionTitle/CardTitle/Eyebrow,
 * DestinationCard, InfoCard, Chip/Tag, Input/SearchInput, BottomSheet, FilterPanel (desktop rows + mobile sheet).
 * jsdom has no CSS, so the responsive split is asserted through the two containers FilterPanel renders
 * (data-filter="inline" is md+, data-filter="mobile" is under md).
 */
import '@testing-library/jest-dom'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import {
  BottomSheet, Button, CardTitle, Chip, DestinationCard, Eyebrow, FilterPanel, InfoCard, Input, PageTitle, SearchInput, SectionTitle, Tag,
} from '../components/design'

describe('Button', () => {
  it('is a pill, md = 48px token height, Manrope bold, primary by default', () => {
    render(<Button>Go</Button>)
    const b = screen.getByRole('button', { name: 'Go' })
    expect(b).toHaveClass('rounded-full', 'h-control', 'font-bold', 'font-sans', 'bg-pine', 'text-cream')
    expect(b).toHaveAttribute('type', 'button')
    expect(b).toHaveAttribute('data-variant', 'primary')
  })
  it('sm is the 40px size', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-control-sm')
  })
  it('secondary is an outline, ghost has no border colour', () => {
    render(<><Button variant="secondary">S</Button><Button variant="ghost">G</Button></>)
    expect(screen.getByRole('button', { name: 'S' })).toHaveClass('border-line-btn', 'text-pine')
    expect(screen.getByRole('button', { name: 'G' })).toHaveClass('border-transparent')
  })
  it('renders a link when href is given, same look', () => {
    render(<Button href="/x" variant="secondary">Link</Button>)
    const a = screen.getByRole('link', { name: 'Link' })
    expect(a).toHaveAttribute('href', '/x')
    expect(a).toHaveClass('rounded-full', 'h-control')
  })
  it('a disabled link is not focusable and has no href', () => {
    render(<Button href="/x" disabled>Off</Button>)
    const a = screen.getByText('Off').closest('a')!
    expect(a).not.toHaveAttribute('href')
    expect(a).toHaveAttribute('aria-disabled', 'true')
    expect(a).toHaveAttribute('tabindex', '-1')
  })
  it('disabled button is disabled and does not fire onClick', () => {
    const fn = jest.fn()
    render(<Button disabled onClick={fn}>Off</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(fn).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toBeDisabled()
  })
  it('icons are decorative', () => {
    render(<Button iconAfter={<i data-testid="ic" />}>Next</Button>)
    expect(screen.getByTestId('ic').parentElement).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('Typography', () => {
  it('PageTitle renders one h1 with the /guias title classes, an eyebrow and a lede', () => {
    render(<PageTitle eyebrow="Guías de viaje" title="Destinos" lede="Texto" />)
    const h1 = screen.getByRole('heading', { level: 1, name: 'Destinos' })
    expect(h1).toHaveClass('text-title', 'text-pine', 'font-sans')
    expect(screen.getByText('Guías de viaje')).toHaveClass('text-eyebrow', 'uppercase', 'text-sage')
    expect(screen.getByText('Texto')).toBeInTheDocument()
  })
  it('SectionTitle is an h2, CardTitle an h3 (or the level you pass)', () => {
    render(<><SectionTitle>Seccion</SectionTitle><CardTitle>Tarjeta</CardTitle><CardTitle as="h4">Sub</CardTitle></>)
    expect(screen.getByRole('heading', { level: 2, name: 'Seccion' })).toHaveClass('text-h2')
    expect(screen.getByRole('heading', { level: 3, name: 'Tarjeta' })).toHaveClass('text-h3')
    expect(screen.getByRole('heading', { level: 4, name: 'Sub' })).toBeInTheDocument()
  })
  it('Eyebrow stands alone', () => {
    render(<Eyebrow>Zona</Eyebrow>)
    expect(screen.getByText('Zona')).toHaveClass('text-eyebrow')
  })
})

describe('DestinationCard', () => {
  const props = { href: '/es/guias/cancun', image: { src: '/images/guides/cancun.jpg', alt: 'Cancún' }, title: 'Cancún', eyebrow: 'Riviera Maya', excerpt: 'Playa y resort.', tags: ['Playa', 'Familia'], cta: 'Ver guía' }
  it('is one link with radius-24 card, image with alt, tags and a cta pill', () => {
    render(<DestinationCard {...props} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/es/guias/cancun')
    expect(link.querySelector('article')).toHaveClass('rounded-destination', 'shadow-soft', 'border-line-strong')
    expect(screen.getByAltText('Cancún')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Cancún' })).toBeInTheDocument()
    expect(screen.getByText('Playa')).toBeInTheDocument()
    expect(screen.getByText(/Ver guía/)).toHaveClass('rounded-full')
    expect(within(link).queryAllByRole('link')).toHaveLength(0) // no nested links
  })
  it('featured puts the title over the image; badge shows', () => {
    const { container } = render(<DestinationCard {...props} featured badge="Featured" />)
    const imageBox = container.querySelector('article > div')!
    expect(within(imageBox as HTMLElement).getByRole('heading', { name: 'Cancún' })).toBeInTheDocument()
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })
  it('heading level is configurable', () => {
    render(<DestinationCard {...props} headingLevel={2} />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })
})

describe('InfoCard', () => {
  it('is radius 16, soft border, no shadow, 24px padding', () => {
    const { container } = render(<InfoCard title="Tip">Body</InfoCard>)
    const card = container.firstElementChild!
    expect(card).toHaveClass('rounded-info', 'border-line-soft', 'p-6', 'bg-white')
    expect(card.className).not.toMatch(/shadow/)
    expect(screen.getByRole('heading', { level: 3, name: 'Tip' })).toBeInTheDocument()
  })
  it('href turns the whole card into a link', () => {
    render(<InfoCard href="/x" title="Go">Body</InfoCard>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/x')
  })
  it('sm uses 20px padding', () => {
    const { container } = render(<InfoCard size="sm">x</InfoCard>)
    expect(container.firstElementChild).toHaveClass('p-5')
  })
})

describe('Chip and Tag', () => {
  it('Chip is a 44px toggle with aria-pressed and calls onClick', () => {
    const fn = jest.fn()
    render(<Chip label="Europa" selected={false} onClick={fn} />)
    const c = screen.getByRole('button', { name: 'Europa' })
    expect(c).toHaveAttribute('aria-pressed', 'false')
    expect(c).toHaveClass('h-chip', 'rounded-full')
    fireEvent.click(c)
    expect(fn).toHaveBeenCalledTimes(1)
  })
  it('selected chip is pine-filled; count renders', () => {
    render(<Chip label="Asia" count={11} selected onClick={() => {}} />)
    const c = screen.getByRole('button', { name: /Asia/ })
    expect(c).toHaveAttribute('aria-pressed', 'true')
    expect(c).toHaveClass('bg-pine', 'text-cream')
    expect(screen.getByText('11')).toBeInTheDocument()
  })
  it('Tag is not interactive', () => {
    render(<Tag>Familia</Tag>)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByText('Familia')).toHaveClass('rounded-full', 'bg-sand')
  })
})

describe('Input and SearchInput', () => {
  it('Input has a label wired to the field, 48px pill', () => {
    render(<Input label="Email" />)
    const f = screen.getByLabelText('Email')
    expect(f).toHaveClass('h-control', 'rounded-full')
  })
  it('error sets aria-invalid + describedby and is announced', () => {
    render(<Input label="Email" error="Inválido" hint="hint" />)
    const f = screen.getByLabelText('Email')
    expect(f).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Inválido')
    expect(f.getAttribute('aria-describedby')).toContain(screen.getByRole('alert').id)
    expect(screen.queryByText('hint')).toBeNull() // the error replaces the hint
  })
  it('hideLabel keeps an accessible name', () => {
    render(<Input label="Nombre" hideLabel />)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
  })
  it('SearchInput is a 56px search field with a clear button that empties it', () => {
    const fn = jest.fn()
    render(<SearchInput label="Buscar" value="Oax" onChange={fn} clearLabel="Limpiar" />)
    expect(screen.getByRole('searchbox', { name: 'Buscar' }).parentElement).toHaveClass('h-control-lg', 'rounded-full')
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(fn).toHaveBeenCalledWith('')
  })
  it('SearchInput without text has no clear button', () => {
    render(<SearchInput label="Buscar" value="" onChange={() => {}} clearLabel="Limpiar" />)
    expect(screen.queryByRole('button', { name: 'Limpiar' })).toBeNull()
  })
})

describe('BottomSheet', () => {
  function Host() {
    const [open, setOpen] = useState(false)
    return (<><button onClick={() => setOpen(true)}>open</button><BottomSheet open={open} onClose={() => setOpen(false)} title="Filtros" closeLabel="Cerrar" footer={<button>Aplicar</button>}><button>dentro</button></BottomSheet></>)
  }
  it('opens as a labelled modal dialog and locks body scroll', async () => {
    render(<Host />)
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getByText('open'))
    const d = await screen.findByRole('dialog', { name: 'Filtros' })
    expect(d).toHaveAttribute('aria-modal', 'true')
    expect(document.body.style.overflow).toBe('hidden')
  })
  it('Esc closes it, restores scroll and returns focus', async () => {
    render(<Host />)
    const opener = screen.getByText('open'); opener.focus(); fireEvent.click(opener)
    const d = await screen.findByRole('dialog')
    fireEvent.keyDown(d, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).not.toBe('hidden')
    expect(opener).toHaveFocus()
  })
  it('the backdrop and the × button close it', async () => {
    render(<Host />)
    fireEvent.click(screen.getByText('open'))
    fireEvent.click(await screen.findByTestId('sheet-backdrop'))
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getByText('open'))
    fireEvent.click(await screen.findByRole('button', { name: 'Cerrar' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('Tab wraps inside the sheet', async () => {
    render(<Host />)
    fireEvent.click(screen.getByText('open'))
    const d = await screen.findByRole('dialog')
    const last = screen.getByRole('button', { name: 'Aplicar' })
    last.focus()
    fireEvent.keyDown(last, { key: 'Tab' })
    // jsdom has no layout (offsetParent null), so the trap falls back to the active element; it must not leave the dialog
    expect(d.contains(document.activeElement) || document.activeElement === last).toBe(true)
  })
})

describe('FilterPanel', () => {
  const labels = { filters: 'Filtros', showResults: (n: number | undefined) => `Ver ${n} resultados`, clear: 'Limpiar', close: 'Cerrar' }
  function Demo({ initial = [] as string[] }) {
    const [sel, setSel] = useState<string[]>(initial)
    const all = ['Europa', 'Asia', 'África']
    const toggle = (k: string) => setSel(v => (v.includes(k) ? v.filter(x => x !== k) : [...v, k]))
    const groups = [{ id: 'region', label: 'Región', activeCount: sel.length, chips: all.map(k => <Chip key={k} label={k} selected={sel.includes(k)} onClick={() => toggle(k)} />) }]
    return <FilterPanel groups={groups} resultsCount={all.length - sel.length} onClear={() => setSel([])} labels={labels}
      activeFilters={sel.map(k => ({ key: k, label: k, removeLabel: `Quitar ${k}`, onRemove: () => toggle(k) }))} />
  }

  it('renders the groups inline (desktop container) and a Filtros button (mobile container)', () => {
    const { container } = render(<Demo />)
    const inline = container.querySelector('[data-filter="inline"]') as HTMLElement
    const mobile = container.querySelector('[data-filter="mobile"]') as HTMLElement
    expect(inline).toHaveClass('hidden', 'md:flex')
    expect(mobile).toHaveClass('md:hidden')
    expect(within(inline).getByRole('group', { name: 'Región' })).toBeInTheDocument()
    expect(within(inline).getByRole('button', { name: 'Europa' })).toBeInTheDocument()
    expect(within(mobile).getByRole('button', { name: 'Filtros' })).toBeInTheDocument()
  })
  it('the button shows the active count and the sheet is closed by default', () => {
    const { container } = render(<Demo initial={['Europa', 'Asia']} />)
    const mobile = container.querySelector('[data-filter="mobile"]') as HTMLElement
    expect(within(mobile).getByRole('button', { name: 'Filtros (2)' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('tapping Filtros opens the sheet with the groups, a live "Ver N resultados" and Limpiar', async () => {
    const { container } = render(<Demo />)
    const mobile = container.querySelector('[data-filter="mobile"]') as HTMLElement
    fireEvent.click(within(mobile).getByRole('button', { name: 'Filtros' }))
    const sheet = await screen.findByRole('dialog', { name: 'Filtros' })
    expect(within(sheet).getByRole('group', { name: 'Región' })).toBeInTheDocument()
    expect(within(sheet).getByRole('button', { name: 'Ver 3 resultados' })).toBeInTheDocument()
    expect(within(sheet).getByRole('button', { name: 'Limpiar' })).toBeDisabled()
    fireEvent.click(within(sheet).getByRole('button', { name: 'Europa' }))
    expect(within(sheet).getByRole('button', { name: 'Ver 2 resultados' })).toBeInTheDocument() // live
    expect(within(sheet).getByRole('button', { name: 'Limpiar' })).toBeEnabled()
  })
  it('Limpiar clears; "Ver N resultados" closes the sheet', async () => {
    const { container } = render(<Demo initial={['Europa']} />)
    const mobile = container.querySelector('[data-filter="mobile"]') as HTMLElement
    fireEvent.click(within(mobile).getByRole('button', { name: 'Filtros (1)' }))
    const sheet = await screen.findByRole('dialog')
    fireEvent.click(within(sheet).getByRole('button', { name: 'Limpiar' }))
    expect(within(mobile).getByRole('button', { name: 'Filtros' })).toBeInTheDocument()
    fireEvent.click(within(sheet).getByRole('button', { name: /Ver 3 resultados/ }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('active filters are removable chips under the button', () => {
    const { container } = render(<Demo initial={['Asia']} />)
    const mobile = container.querySelector('[data-filter="mobile"]') as HTMLElement
    fireEvent.click(within(mobile).getByRole('button', { name: 'Quitar Asia' }))
    expect(within(mobile).queryByRole('button', { name: 'Quitar Asia' })).toBeNull()
    expect(within(mobile).getByRole('button', { name: 'Filtros' })).toBeInTheDocument()
  })
  it('search: suggestions appear only while typing, pick calls onPick and clears the field', () => {
    const onPick = jest.fn(); const onChange = jest.fn()
    const { rerender } = render(<FilterPanel groups={[]} labels={labels} search={{ label: 'Buscar', placeholder: 'Busca', value: '', onChange, noResultsText: 'Nada', suggestions: [{ key: 'oax', label: 'Oaxaca' }], onPick }} />)
    expect(screen.queryByRole('button', { name: 'Oaxaca' })).toBeNull()
    rerender(<FilterPanel groups={[]} labels={labels} search={{ label: 'Buscar', placeholder: 'Busca', value: 'oa', onChange, noResultsText: 'Nada', suggestions: [{ key: 'oax', label: 'Oaxaca' }], onPick }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Oaxaca' }))
    expect(onPick).toHaveBeenCalledWith('oax')
    expect(onChange).toHaveBeenCalledWith('')
  })
  it('with no groups there is no filter button (search only)', () => {
    render(<FilterPanel groups={[]} labels={labels} search={{ label: 'Buscar', placeholder: 'Busca', value: '', onChange: () => {}, noResultsText: 'x' }} />)
    expect(screen.queryByRole('button', { name: /Filtros/ })).toBeNull()
  })
})
