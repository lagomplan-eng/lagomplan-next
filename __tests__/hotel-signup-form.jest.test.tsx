/**
 * The hotel signup form in the browser: required fields are marked, hints are there, a refused submit puts a red
 * message under each field that has a problem and scrolls to the first one, and a server refusal lands next to its field.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HotelSignupForm from '../components/forms/HotelSignupForm'

const scrollSpy = jest.fn()
beforeAll(() => { Element.prototype.scrollIntoView = scrollSpy })
beforeEach(() => { scrollSpy.mockClear(); (global as { fetch?: unknown }).fetch = jest.fn() })

const REQUIRED_IDS = ['h-hotelName', 'h-zone', 'h-contactName', 'h-email', 'h-contactPhone', 'h-rooms']
const labelOf = (id: string) => document.querySelector(`label[for="${id}"]`) as HTMLElement
const submit = () => fireEvent.click(screen.getByRole('button', { name: /Pedir mi guía|Request my guide/ }))
const type = (id: string, value: string) => fireEvent.change(document.getElementById(id)!, { target: { value } })

describe.each([
  ['es', { note: '* Campos obligatorios', phoneHint: 'Con lada, por ejemplo 55 1234 5678', roomsHint: 'Solo el número, por ejemplo 12', roomsMissing: 'Escribe el número de habitaciones', phoneMissing: 'Escribe un WhatsApp o teléfono', terms: 'Acepta los términos para continuar', optional: '(opcional)' }],
  ['en', { note: '* Required fields', phoneHint: 'With area code, for example 55 1234 5678', roomsHint: 'Just the number, for example 12', roomsMissing: 'Enter the number of rooms', phoneMissing: 'Enter a WhatsApp or phone number', terms: 'Accept the terms to continue', optional: '(optional)' }],
] as const)('signup form (%s)', (locale, s) => {
  const mount = () => render(<HotelSignupForm locale={locale} />)

  test('says which fields are required, and marks each one', () => {
    mount()
    expect(screen.getByText(s.note)).toBeInTheDocument()
    for (const id of REQUIRED_IDS) expect(labelOf(id).textContent).toMatch(/ \*$/)
    expect(document.querySelector('label:has(#h-terms)')!.textContent).toMatch(/\*$/)
    for (const id of REQUIRED_IDS) expect(document.getElementById(id)).toHaveAttribute('aria-required', 'true')
  })

  test('optional fields say so and carry no asterisk', () => {
    mount()
    for (const id of ['h-contactRole', 'h-mapsUrl']) {
      expect(labelOf(id).textContent).toContain(s.optional)
      expect(labelOf(id).textContent).not.toContain('*')
    }
  })

  test('hints under WhatsApp/phone and rooms', () => {
    mount()
    expect(document.getElementById('h-contactPhone-hint')).toHaveTextContent(s.phoneHint)
    expect(document.getElementById('h-rooms-hint')).toHaveTextContent(s.roomsHint)
    expect(document.getElementById('h-rooms')).toHaveAttribute('aria-describedby', 'h-rooms-hint')
  })

  test('an empty submit shows a red message under every required field, scrolls to and focuses the first, sends nothing', () => {
    mount()
    submit()
    for (const id of ['hotelName', 'zone', 'contactName', 'email', 'contactPhone', 'rooms', 'terms']) {
      const msg = document.getElementById(`h-${id}-err`)
      expect(msg).toBeInTheDocument()
      expect(msg!.className).toContain('text-[#B3261E]')
      expect(document.getElementById(`h-${id}`)).toHaveAttribute('aria-invalid', 'true')
    }
    expect(document.getElementById('h-rooms-err')).toHaveTextContent(s.roomsMissing)
    expect(document.getElementById('h-contactPhone-err')).toHaveTextContent(s.phoneMissing)
    expect(document.getElementById('h-terms-err')).toHaveTextContent(s.terms)
    expect(document.getElementById('h-mapsUrl-err')).toBeNull()
    expect(document.activeElement).toBe(document.getElementById('h-hotelName'))
    expect(scrollSpy).toHaveBeenCalledTimes(1)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  test('the first problem is the one it scrolls to, and a field clears its message when fixed', () => {
    mount()
    type('h-hotelName', 'Casa Roma'); fireEvent.change(document.getElementById('h-zone')!, { target: { value: 'roma' } })
    type('h-contactName', 'Ana'); type('h-email', 'ana@hotel.com'); type('h-contactPhone', '55 1234 5678')
    type('h-rooms', 'doce')
    submit()
    expect(document.activeElement).toBe(document.getElementById('h-rooms'))
    expect(document.getElementById('h-rooms-err')!.textContent).toMatch(/12/)
    type('h-rooms', '12')
    expect(document.getElementById('h-rooms-err')).toBeNull()
    expect(document.getElementById('h-terms-err')).toBeInTheDocument() // untouched fields keep theirs
  })

  test('a server refusal appears next to the right field', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ status: 422, ok: false, json: async () => ({ error: 'contactPhone' }) })
    mount()
    type('h-hotelName', 'Casa Roma'); fireEvent.change(document.getElementById('h-zone')!, { target: { value: 'roma' } })
    type('h-contactName', 'Ana'); type('h-email', 'ana@hotel.com'); type('h-contactPhone', '55 1234 5678'); type('h-rooms', '12')
    fireEvent.click(document.getElementById('h-terms')!)
    submit()
    await waitFor(() => expect(document.getElementById('h-contactPhone-err')).toBeInTheDocument())
    expect(document.activeElement).toBe(document.getElementById('h-contactPhone'))
    expect(document.getElementById('h-rooms-err')).toBeNull()
  })

  test('a valid form is sent and shows the confirmation', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ status: 200, ok: true, json: async () => ({ ok: true }) })
    mount()
    type('h-hotelName', 'Casa Roma'); fireEvent.change(document.getElementById('h-zone')!, { target: { value: 'roma' } })
    type('h-contactName', 'Ana'); type('h-email', 'ana@hotel.com'); type('h-contactPhone', '55 1234 5678'); type('h-rooms', '12')
    fireEvent.click(document.getElementById('h-terms')!)
    submit()
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument())
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
