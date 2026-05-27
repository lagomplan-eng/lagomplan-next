import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'norte-de-argentina',
  locale: 'en',

  hero: {
    title: 'Northern Argentina: Salta & Quebrada de Humahuaca',
    subtitle: 'Northwestern Argentina does not need to try to impress. It has fourteen-color mountains, adobe villages unchanged for 400 years, the best empanada in the country, and the same silence Patagonia offers — without the cold.',
    eyebrow: 'Curated guide · Girlfriends · 4 days · Luxury, relaxation, art',
    tags: ['Friends', 'Luxury', 'Relaxation', 'Art'],
    image: '/images/guides/norte-de-argentina.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Salta: the most beautiful colonial city in Argentina',
      items: [
        {
          time: '13:00',
          title: 'Check-in and first coffee in the courtyard',
          description: 'Arrival in Salta. Check-in at Legado Mítico.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Plaza 9 de Julio and the Cathedral',
          description: 'Afternoon at Plaza 9 de Julio and the Cathedral Basilica.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Cable car to Cerro San Bernardo',
          description: 'Panoramic views of the city.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at El Solar del Convento',
          description: 'Signature Salta cuisine in a colonial cloister.',
          tags: [],
        },
        {
          time: '22:00',
          title: 'Peña on Balcarce street',
          description: 'The folk-music corridor where bombo and charango play until dawn.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Calchaquí Valleys and wineries',
      items: [
        {
          time: '08:30',
          title: 'Departure by private transfer',
          description: 'Private excursion south through the Calchaquí Valleys.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Arrival in Cafayate',
          description: '160 km, roughly 2.5 hours on the road.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Visit and tasting at Bodega El Esteco or Domingo Hermanos',
          description: 'Torrontés tasting — the most representative white wine in Argentina.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Lunch in Cafayate',
          description: 'Empanadas baked in a clay oven.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Return to Salta',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Arrival. Light dinner or spa at the hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Quebrada de Humahuaca',
      items: [
        {
          time: '08:00',
          title: 'Departure from Salta',
          description: 'Early start heading north.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Purmamarca (Seven-Color Hill, crafts, empanadas)',
          description: 'The signature image of the trip.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch in Tilcara, check-in at CasaCalma',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Pool / rest / walk through Tilcara',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at Pachamama',
          description: 'Local Andean cuisine, just a few tables.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Hornocal and return',
      items: [
        {
          time: '06:30',
          title: 'Early departure for Hornocal',
          description: 'The most important detour of the trip.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Serranía de Hornocal (main lookout)',
          description: 'Fourteen colors across a 4-kilometer-wide rock formation at 4,350 meters. Bring water, a warm layer and a charged camera.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Return to Salta via Humahuaca',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Arrival in Salta, car drop-off, flight out',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Legado Mítico Salta',
      type: 'Boutique hotel · Salta historic center',
      priceTier: '$$$',
      description: 'A 1930s mansion in Salta\'s historic center turned into an eleven-room boutique hotel — each suite named after a figure from Argentine history. Library with leather armchairs, jasmine-filled inner courtyard, pillow menu and a buffet breakfast with artisanal yogurt. Just 500 meters from Plaza 9 de Julio, away from street noise. Estimated price: $160–300 USD/night.',
      tag: '1930s mansion with character',
      affiliateUrl: '',
      archetypes: ['Couples'],
    },
    {
      name: 'CasaCalma Hotel Boutique',
      type: 'Boutique hotel · Tilcara',
      priceTier: '$$$',
      description: 'A garden-and-pool boutique in Tilcara, the village in the Quebrada de Humahuaca at 2,461 meters above sea level. Buffet breakfast included, terrace with views of the multicolored hill, and a more intimate scale than any chain. Four blocks from the main square. Estimated price: $120–200 USD/night.',
      tag: 'Gardens and a pool in the Quebrada',
      affiliateUrl: '',
      archetypes: ['Couples'],
    },
    {
      name: 'Las Marías Hotel Boutique',
      type: 'Boutique hotel · Tilcara',
      priceTier: '$$$',
      description: 'The top-rated hotel in Tilcara four years running — number 1 on TripAdvisor out of 21 options — set in a house built with local stone and wood. Twelve rooms with private terrace, panoramic views of the multicolored hills, spa with hydromassage, seasonal outdoor pool and a restaurant with an Andean menu. Three blocks from Tilcara\'s main square. Estimated price: $150–200 USD/night.',
      tag: 'Views, spa and Andean cuisine',
      affiliateUrl: '',
      archetypes: ['Couples', 'Wellness'],
    },
  ],

  hotelsDescription: 'Two bases with distinct personalities: Salta for the first half of the trip and the Quebrada de Humahuaca for the second.',

  experiences: [
    {
      name: 'Cachi winery visit and torrontés tasting',
      description: 'Salta\'s torrontés is the most representative white wine in Argentina — aromatic, floral and completely different from the torrontés grown in Galicia. The wineries of the Calchaquí Valleys (Cachi, Cafayate) offer tastings from $20–40 USD. The landscape of vineyards at 1,700 meters with orange-hued hills in the background is the trip\'s most convincing visual argument.',
      tags: ['Winery', 'Wine', 'Landscape'],
      affiliateUrl: '',
    },
    {
      name: 'Tren a las Nubes (optional, subject to availability)',
      description: 'The train climbing from Salta to the La Polvorilla viaduct at 4,200 meters runs irregularly — check availability on the official site before building the itinerary around it. If it runs: one of the most spectacular railway journeys in South America.',
      tags: ['Train', 'Altitude', 'Landscape'],
      affiliateUrl: '',
    },
    {
      name: 'Driving tour of the Quebrada de Humahuaca',
      description: 'The 155-kilometer stretch between Jujuy and Humahuaca was declared a UNESCO World Heritage Site in 2003. Purmamarca (the Seven-Color Hill), Tilcara (the Pucará and the crafts market), Humahuaca (the cabildo and the charango players on the square) and the Serranía de Hornocal (the Fourteen-Color Hill, 70 kilometers from Humahuaca) are the four stops that justify the detour north.',
      tags: ['UNESCO', 'Culture', 'Landscape'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Salta empanada: Argentina\'s most serious empanada is baked in a clay oven, with a wheat-flour shell, knife-cut beef (never minced), potato, onion and cumin. No olives, no hard-boiled egg — that\'s the Buenos Aires version. The reference in Salta is El Patio de la Empanada, two blocks from the square.',
    'Altitude in the Quebrada: Tilcara sits at 2,461 meters; Humahuaca at 2,940; Hornocal at 4,350. If altitude matters in Cusco, it matters here too — especially at Hornocal. Walk slowly, do not rush, carry water and chocolate.',
    'The Argentine peso: Argentina has a particular currency situation. Check the official exchange rate vs. the "blue" rate before traveling — the gap can be significant. The hotels on this list take international cards, but cash in pesos is needed for crafts and small restaurants.',
  ],

  funFact: 'The Quebrada de Humahuaca has been continuously inhabited for 10,000 years. The Camino Real that runs through it — today Route 9 — was the main artery of the Inca Empire and later of Spanish colonial trade, connecting Alto Perú (today Bolivia) with Buenos Aires. The villages of the Quebrada speak Quechua before Spanish in everyday conversation between neighbors.',

  checklist: [
    '🧥 Layers for the southern winter (mild days, cold nights)',
    '🧤 Gloves and a beanie for Hornocal (4,350 m)',
    '💧 Water and chocolate for altitude',
    '📷 Camera with a spare battery',
    '💵 Cash in Argentine pesos for crafts',
    '🥾 Comfortable shoes for walking through Andean villages',
    '🕶️ Sunglasses and sunscreen (high-altitude sun)',
    '🧉 Openness for folk music and a late peña night',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Martín Miguel de Güemes International Airport (SLA) in Salta, 9 kilometers from downtown. Direct flights from Buenos Aires (AEP/EZE) with Aerolíneas Argentinas, Flybondi and JetSMART in about 2 hours. From Mexico City or Santiago: connection in Buenos Aires.',
    },
    {
      mode: 'Transfers',
      description: 'The Quebrada de Humahuaca is best driven with a private driver or a rental car. Distances are manageable — Salta to Tilcara is 84 kilometers on Route 9. Private driver-transfer for the 4 days: $150–250 USD total for the group, the most efficient option for a group of friends.',
    },
    {
      mode: 'Weather in June',
      description: 'Southern winter. Sunny, dry days at 15–20°C. Cold nights, especially in the Quebrada: 0–5°C. The June dry season is ideal for photography — no clouds, no rain, colors at their peak.',
    },
  ],
}
