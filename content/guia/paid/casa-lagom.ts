// content/guia/paid/casa-lagom.ts
//
// "Casa Lagom": an INVENTED boutique hotel in Condesa, for the paid-edition demo at /guia/demo.
// No real client name, logo, phone number or address. Every host-supplied piece of content here is SAMPLE
// content and is labelled as such on the page. The place picks come from the hotel edition (ours, verified).

import type { PaidClient } from './types'
import { DEFAULT_PAID_SWITCHES } from './types'

export const CASA_LAGOM: PaidClient = {
  id: 'casa-lagom',
  name: 'Casa Lagom',
  logo: '/images/guia/paid/casa-lagom.svg',
  brandColor: '#3D4F7C',
  switches: { ...DEFAULT_PAID_SWITCHES },
  sample: true,
  letter: {
    en: {
      eyebrow: 'A letter from your host',
      paragraphs: [
        'Welcome to Casa Lagom. We opened this small hotel in Condesa so you could live the neighbourhood the way we do: coffee in the park, a long lunch, a late walk home.',
        'This guide holds the places we send our own friends to, checked by Lagomplan. If something is missing, write to us. We would love to help.',
      ],
      signature: 'The Casa Lagom team',
      roleLabel: 'Your host',
    },
    es: {
      eyebrow: 'Una carta de tu anfitrión',
      paragraphs: [
        'Te damos la bienvenida a Casa Lagom. Abrimos este pequeño hotel en la Condesa para que vivas el barrio como lo vivimos nosotros: un café en el parque, una comida larga, un paseo de regreso por la noche.',
        'Esta guía reúne los lugares a los que mandamos a nuestros propios amigos, revisados por Lagomplan. Si falta algo, escríbenos. Con gusto te ayudamos.',
      ],
      signature: 'El equipo de Casa Lagom',
      roleLabel: 'Tu anfitrión',
    },
  },
  contact: {
    label: { en: 'Message the host', es: 'Escribir al anfitrión' },
    // No href: the demo never carries a real number or link.
  },
}
