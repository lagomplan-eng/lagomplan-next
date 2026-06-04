/**
 * tests/e2e/fixtures/trip-data.ts
 *
 * Canned `trip_data` envelopes the Anthropic mock returns. Deliberately
 * minimal — just enough for the normalizer to produce a renderable
 * itinerary. Add fields here when a specific test needs them.
 *
 * Why a fixture file instead of inline objects in the mock:
 *   - shareable across multiple tests and the regen / replaceTrip
 *     code paths (T-PW-03 needs the regen modal, which means a second
 *     mocked generation)
 *   - one place to update if the trip_data contract changes
 */

export type FixtureTripData = Record<string, unknown>

export const mexicoCityWeekend: FixtureTripData = {
  title:    'Fin de semana cultural en la Ciudad de México',
  subtitle: 'Plan de viaje generado con IA',
  days: [
    {
      n: 1,
      label: 'Día 01',
      title: 'Llegada y Centro Histórico',
      items: [
        {
          id:   'd1-1',
          type: 'transfer',
          name: 'Llegada al aeropuerto',
          desc: 'Trasládate al hotel y deja el equipaje.',
          time: '14:00',
        },
        {
          id:   'd1-2',
          type: 'tour',
          name: 'Zócalo y Templo Mayor',
          desc: 'Caminata por el centro histórico al atardecer.',
          time: '17:00',
        },
        {
          id:   'd1-3',
          type: 'restaurant',
          name: 'Cena en Azul Histórico',
          desc: 'Cocina mexicana contemporánea en patio colonial.',
          time: '20:30',
        },
      ],
    },
    {
      n: 2,
      label: 'Día 02',
      title: 'Coyoacán y Frida Kahlo',
      items: [
        {
          id:   'd2-1',
          type: 'tour',
          name: 'Museo Frida Kahlo (Casa Azul)',
          desc: 'Reserva entradas con anticipación — entrada con horario.',
          time: '10:00',
        },
        {
          id:   'd2-2',
          type: 'restaurant',
          name: 'Comida en Los Danzantes Coyoacán',
          desc: 'Mezcal y cocina oaxaqueña en el centro de Coyoacán.',
          time: '14:00',
        },
      ],
    },
    {
      n: 3,
      label: 'Día 03',
      title: 'Despedida',
      items: [
        {
          id:   'd3-1',
          type: 'free',
          name: 'Brunch en Roma Norte',
          desc: 'Pasea por Álvaro Obregón antes del check-out.',
          time: '10:30',
        },
        {
          id:   'd3-2',
          type: 'transfer',
          name: 'Salida al aeropuerto',
          desc: 'Allow 60 min con tráfico.',
          time: '14:00',
        },
      ],
    },
  ],
  accommodations: [
    {
      id:                'acc-0',
      city:              'Mexico City',
      neighborhood:      'Roma Norte',
      accommodationType: 'hotel',
      rationale:         'Walkable to the centro and good restaurant density.',
      priceTier:         'mid',
      familyFriendly:    false,
      checkInDate:       '2026-07-10',
      checkOutDate:      '2026-07-12',
      nights:            2,
      source:            'ai',
      fallback:          false,
    },
  ],
  packing: [
    'Zapatos cómodos',
    'Chaqueta ligera',
    'Bloqueador solar',
  ],
  budgetRows: [
    { id: 'b1', label: 'Hotel Roma Norte', category: 'Alojamiento', aiEst: 280, userEst: null, actual: null },
    { id: 'b2', label: 'Comida y bebida', category: 'Gastronomía',   aiEst: 180, userEst: null, actual: null },
    { id: 'b3', label: 'Entradas y tours', category: 'Actividades',  aiEst: 95,  userEst: null, actual: null },
  ],
  doneChecks: [],
}

/**
 * Variation for T-PW-03 (regen modal). The destination differs so the
 * mocked second generation can be visually distinguished from the
 * first — useful for asserting which itinerary actually rendered.
 */
export const oaxacaWeekend: FixtureTripData = {
  ...mexicoCityWeekend,
  title: 'Fin de semana en Oaxaca',
  accommodations: [
    {
      ...((mexicoCityWeekend.accommodations as Array<Record<string, unknown>>)[0]),
      city:         'Oaxaca',
      neighborhood: 'Centro',
    },
  ],
}
