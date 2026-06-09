// e2e/fixtures/trips.ts
//
// Trip fixtures for the mobile-view E2E suite. These mirror the shapes in
// docs/qa/mobile-view-test-cases.md. The tester seeds these into the test
// Supabase project (or stubs the trip GET) — see e2e/README.md.
//
// Loaded by `id` (UUID). trip_data.checks is NOT stored — only
// trip_data.doneChecks (derived check IDs). Companion notes/links/packing
// live in the separate trip_progress column.

export type Fixture = {
  id: string
  user_id: string | null
  destination: string
  duration_days: number
  travelers: string
  is_shared: boolean
  trip_data: any
  trip_progress: any
}

export const TRIP_OWNER: Fixture = {
  id: 'e2e-owner-1',
  user_id: 'e2e-user-abc',
  destination: 'Mexico City',
  duration_days: 3,
  travelers: 'pareja',
  is_shared: false,
  trip_data: {
    title: 'Fin de semana en CDMX',
    subtitle: '',
    days: [
      { n: 1, label: 'DÍA 01', title: 'Llegada y primer sabor', progress: 0, items: [
        { id: 'item-0', type: 'tour',       name: 'Zócalo y Templo Mayor', time: '16:00', price: '$90 MXN' },
        { id: 'item-1', type: 'restaurant', name: 'Cena en El Cardenal',   time: '21:00', price: '$400 MXN' },
      ]},
      { n: 2, label: 'DÍA 02', title: 'Murales y la Roma–Condesa', progress: 0, items: [
        { id: 'item-2', type: 'restaurant', name: 'Contramar',      time: '13:30', price: '$600 MXN' },
        { id: 'item-3', type: 'restaurant', name: 'Máximo Bistrot', time: '20:00', price: '$800 MXN' },
      ]},
      { n: 3, label: 'DÍA 03', title: 'Coyoacán y Chapultepec', progress: 0, items: [
        { id: 'item-4', type: 'tour', name: 'Museo Frida Kahlo', time: '10:30', price: '$250 MXN' },
        { id: 'item-5', type: 'free', name: 'Paseo por Coyoacán', time: '13:00' },
      ]},
    ],
    accommodations: [
      { id: 'acc-0', city: 'Mexico City', neighborhood: 'Centro', checkInDate: '2026-04-12',
        checkOutDate: '2026-04-15', nights: 3, priceTier: 'mid' },
    ],
    budgetRows: [
      { id: 'b0', category: 'Hospedaje',   label: 'Hotel',       aiEst: 4500, userEst: 4500, actual: null },
      { id: 'b1', category: 'Gastronomía', label: 'Contramar',   aiEst: 1200, userEst: null, actual: 1180 },
      { id: 'b2', category: 'Actividades', label: 'Frida Kahlo', aiEst: 500,  userEst: null, actual: null },
      { id: 'b3', category: 'Traslados',   label: 'Uber',        aiEst: 700,  userEst: null, actual: null },
    ],
    packing: ['Ropa ligera', 'Paraguas', 'Tenis cómodos', 'Bloqueador solar'],
    doneChecks: ['pretrip-book-hotel', 'check-item-2'],
  },
  trip_progress: {
    annotations: { 'item-2': { note: 'Pedir terraza', link: 'https://contramar.com.mx' } },
    packedItems: [0, 2],
  },
}

// Confirmed-hotel variant
export const TRIP_OWNER_BOOKED: Fixture = (() => {
  const t: Fixture = JSON.parse(JSON.stringify(TRIP_OWNER))
  t.id = 'e2e-owner-booked'
  t.trip_data.accommodations[0].booking = {
    confirmed: true, code: 'BK-483920', checkinTime: '15:00', notes: 'Vista al patio', bookingUrl: 'https://booking.com/r/abc',
  }
  return t
})()

// Anonymous trip — accessible to anyone, editable (writes go to localStorage)
export const TRIP_ANONYMOUS: Fixture = { ...JSON.parse(JSON.stringify(TRIP_OWNER)), id: 'e2e-anon', user_id: null }

// Shared trip — a logged-in non-owner sees it read-only
export const TRIP_SHARED: Fixture = { ...JSON.parse(JSON.stringify(TRIP_OWNER)), id: 'e2e-shared', is_shared: true }

// Multi-city CDMX → Oaxaca (two stays + segments)
export const TRIP_MULTICITY: Fixture = {
  id: 'e2e-multicity', user_id: 'e2e-user-abc', destination: 'Mexico City',
  duration_days: 5, travelers: 'pareja', is_shared: false,
  trip_data: {
    title: 'CDMX y Oaxaca', subtitle: '',
    segments: [
      { destination: 'Mexico City', startDate: '2026-04-12', endDate: '2026-04-14', nights: 2 },
      { destination: 'Oaxaca',      startDate: '2026-04-14', endDate: '2026-04-17', nights: 3 },
    ],
    days: [1, 2, 3, 4, 5].map(n => ({
      n, label: `DÍA 0${n}`, title: `Día ${n}`, progress: 0,
      items: [{ id: `mc-item-${n}`, type: 'restaurant', name: `Comida día ${n}`, time: '14:00', price: '$300 MXN' }],
    })),
    accommodations: [
      { id: 'acc-0', city: 'Mexico City', checkInDate: '2026-04-12', checkOutDate: '2026-04-14', nights: 2, priceTier: 'mid' },
      { id: 'acc-1', city: 'Oaxaca',      checkInDate: '2026-04-14', checkOutDate: '2026-04-17', nights: 3, priceTier: 'mid' },
    ],
    budgetRows: [], packing: [], doneChecks: [],
  },
  trip_progress: { annotations: {}, packedItems: [] },
}

// Overnight trip with NO structured accommodations → exercises fallback hotel
export const TRIP_NO_ACCOMMODATIONS: Fixture = (() => {
  const t: Fixture = JSON.parse(JSON.stringify(TRIP_OWNER))
  t.id = 'e2e-noacc'
  t.trip_data.accommodations = []
  return t
})()
