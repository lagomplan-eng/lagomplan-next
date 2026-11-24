/**
 * The paid demo (Casa Lagom) in Spanish, in the browser (?lang=es): the paid layer reads in Spanish, and nothing of it is left in English.
 */
import { render } from '@testing-library/react'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { CASA_LAGOM } from '../content/guia/paid/casa-lagom'
import { buildPaidGuideProps } from '../content/guia/paid/resolve'
import { welcomeLine } from '../content/guia/paid/dates'

beforeEach(() => { (global as { fetch?: unknown }).fetch = jest.fn(() => Promise.reject(new Error('offline'))) })

function es() {
  window.history.pushState({}, '', '/guia/demo?lang=es')
  const view = render(<GuiaClient {...buildPaidGuideProps(CASA_LAGOM, 'condesa')!} />)
  return view.container.textContent ?? ''
}

describe('paid demo, Spanish', () => {
  test('letter, house, guest line, services and review read in Spanish; the sample labels too', () => {
    const t = es()
    for (const x of [
      'Una carta de tu anfitrión', 'Escribir al anfitrión', 'Tu casa', 'Todo para tu estancia en Casa Lagom', 'Contraseña', 'A quién llamar', 'Llaves y acceso',
      'Equipaje', 'Reglas de la casa', 'Servicios de tu anfitrión', 'Pedir por WhatsApp', 'Check-out tardío', 'Traslado al aeropuerto', 'Desayuno',
      'Masaje en tu habitación', 'Dejar una reseña', 'Te damos la bienvenida, María · 12–15 de diciembre', 'Huésped de ejemplo', 'Ejemplo', 'con tecnología de Lagomplan',
      'Casa Lagom es un hotel inventado',
    ]) expect(t).toContain(x)
  })

  test('none of the paid layer\'s English is left on the page', () => {
    const t = es()
    for (const x of ['A letter from your host', 'Message the host', 'Request on WhatsApp', 'Leave a review', 'Sample guest', 'Anything we can arrange', 'powered by Lagomplan', 'Late check-out']) {
      expect(t).not.toContain(x)
    }
    expect(welcomeLine('María', '2026-12-12', '2026-12-15', 'es')).toContain('bienvenida')
  })
})
