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
  // The demo turns the PMS line (switch B, off by default for clients) on, to show how a guest's name and dates would appear.
  switches: { ...DEFAULT_PAID_SWITCHES, pmsLink: true },
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
    // No href and no whatsapp: the demo never carries a real number or link.
  },
  shareUrl: 'https://www.lagomplan.com/guia/demo',
  guest: { name: 'María', arrive: '2026-12-12', depart: '2026-12-15' },
  house: {
    wifi: { network: 'CasaLagom-Guests', password: 'sample-password' },
    checkIn: '15:00',
    checkOut: '12:00',
    access: {
      en: 'Your room card is waiting at reception. The street door has a code; reception sends it the evening before you arrive.',
      es: 'Tu tarjeta de habitación te espera en recepción. La puerta de la calle tiene un código; recepción te lo envía la tarde anterior a tu llegada.',
    },
    luggage: {
      en: 'Reception keeps your bags before check-in and after check-out, free of charge.',
      es: 'Recepción guarda tus maletas antes del check-in y después del check-out, sin costo.',
    },
    rules: {
      en: 'Quiet hours from 22:00. No smoking indoors. Visitors are welcome in the courtyard until 20:00.',
      es: 'Horario de silencio desde las 22:00. No se fuma en interiores. Las visitas son bienvenidas en el patio hasta las 20:00.',
    },
    whoToCall: {
      en: 'Reception, 24 hours. In an emergency call 911.',
      es: 'Recepción, las 24 horas. En una emergencia llama al 911.',
    },
  },
  services: [
    {
      id: 'late-checkout',
      title: { en: 'Late check-out', es: 'Check-out tardío' },
      text: { en: 'Keep your room until 15:00 on the day you leave, subject to availability.', es: 'Conserva tu habitación hasta las 15:00 el día de tu salida, según disponibilidad.' },
      request: { en: 'Hi, I would like to request a late check-out.', es: 'Hola, quisiera pedir un check-out tardío.' },
    },
    {
      id: 'airport-transfer',
      title: { en: 'Airport transfer', es: 'Traslado al aeropuerto' },
      text: { en: 'A driver meets you at arrivals. Tell us your flight and we confirm the price.', es: 'Un chofer te recibe en llegadas. Cuéntanos tu vuelo y te confirmamos el precio.' },
      request: { en: 'Hi, I would like an airport transfer.', es: 'Hola, quisiera un traslado al aeropuerto.' },
    },
    {
      id: 'breakfast',
      title: { en: 'Breakfast', es: 'Desayuno' },
      text: { en: 'In the courtyard or in your room, from 8:00 to 11:00.', es: 'En el patio o en tu habitación, de 8:00 a 11:00.' },
      request: { en: 'Hi, I would like to book breakfast.', es: 'Hola, quisiera reservar el desayuno.' },
    },
    {
      id: 'massage',
      title: { en: 'In-room massage', es: 'Masaje en tu habitación' },
      text: { en: 'A licensed therapist comes to your room. Please ask a day ahead.', es: 'Una terapeuta con licencia va a tu habitación. Pídelo con un día de anticipación.' },
      request: { en: 'Hi, I would like to book an in-room massage.', es: 'Hola, quisiera reservar un masaje en mi habitación.' },
    },
  ],
  // No review link in the demo: the button renders disabled and labelled sample.
}
