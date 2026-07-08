import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'azores',
  locale: 'en',

  hero: {
    title: 'Azores',
    subtitle: 'The volcanic archipelago in the middle of the Atlantic that has spent years being Europe\'s best-kept secret. A week designed to discover lakes inside craters, soak in thermal pools, and watch whales from a catamaran with the Atlantic as the only horizon.',
    eyebrow: 'Curated guide · Couple · Relax & Beach · 7 days · High budget',
    tags: ['Couple', 'Relax', 'Beach', 'Nature'],
    image: '/images/guides/azores.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and first dip',
      items: [
        {
          time: '14:00',
          title: 'Check-in and villa reveal',
          description: 'Check-in at SENSI.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'First private pool',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Dinner at the hotel restaurant with Azorean txakoli',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Terrace fire and a night with no agenda',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Sete Cidades',
      items: [
        {
          time: '08:00',
          title: 'Early departure toward Sete Cidades',
          description: 'Private tour or rental car toward the northwest of the island.',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Vista do Rei viewpoint',
          description: 'At sunrise.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Down to the village and the lake shore',
          description: 'Kayaking on the lagoon if physical condition allows.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at Lagoa Azul Restaurant',
          description: 'Restaurant right on the water.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Return via the north coast (Ribeira Grande)',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Whale watching',
      items: [
        {
          time: '09:00',
          title: 'Boarding at Vila Franca do Campo',
          description: 'Whale-watching tour (south of the island, 30 min by car from SENSI).',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Return to the dock',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Lunch at the hotel',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Ponta da Ferraria natural pools',
          description: 'Natural volcanic thermal-water pools 10 minutes from the hotel, where ocean water mixes with geothermal water.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Transfer to Furnas and nighttime pools',
      items: [
        {
          time: '10:00',
          title: 'Check-out at SENSI',
          description: '',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Check-in at Octant Furnas',
          description: 'Drive to the Furnas valley (1 hour).',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Terra Nostra Park (€8 EUR entry, bring an old swimsuit)',
          description: 'Botanical garden with the thermal pool of brown iron-rich water that stains swimsuits.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Nighttime thermal pools experience and Cozido das Furnas',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Furnas Valley and Lagoa do Fogo',
      items: [
        {
          time: '09:00',
          title: 'Walk among the fumaroles of Furnas park',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Drive to Lagoa do Fogo',
          description: 'The island\'s highest and most remote lagoon.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Trail down to the shore (round trip)',
          description: '90-minute round-trip trail.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Lunch in Ribeira Grande',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Check-out from Octant, transfer to White Exclusive Suites',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Relax and the south coast',
      items: [
        {
          time: '10:00',
          title: 'Check-in and a morning by the pool',
          description: 'Infinity pool, coffee with cliff views.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Free excursion to Praia dos Mosteiros or the south-coast viewpoints',
          description: 'Volcanic beach with waves and black stone, the most photogenic on the island.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Dinner in Ponta Delgada (O Caldo Verde or Anfiteatro restaurant)',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Slow goodbye',
      items: [
        {
          time: '09:00',
          title: 'Breakfast and one last swim',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Mercado da Graça in Ponta Delgada',
          description: 'Coffee and queijadinhas (Azorean cheese pastry).',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Light lunch',
          description: '',
          tags: [],
        },
        {
          time: '',
          title: 'Transfer to PDL airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'SENSI Azores Nature and SPA',
      type: 'Villas · Ginetes, São Miguel',
      priceTier: '$$$',
      description: 'Villas with a private plunge pool on the edge of a cliff over the Atlantic, in the island\'s quietest corner. Each unit has a terrace with loungers and direct ocean views, a bedroom with blackout curtains for sleeping to the sound of the sea, a spa with sauna and hammam, and a restaurant with product-driven Azorean cuisine. The most repeated review says the same thing: "we didn\'t want to leave the hotel." For the couple who wants the destination to also be the room. Estimated price: €300–500/night.',
      tag: 'Private plunge pool on the cliff edge',
      affiliateUrl: 'https://www.booking.com/hotel/pt/sensi-azores-nature-and-spa.en-gb.html',
      archetypes: ['Couples'],
    },
    {
      name: 'White Exclusive Suites & Villas',
      type: 'Suites and Villas · Lagoa, São Miguel',
      priceTier: '$$$',
      description: 'Suites and villas on a seafront cliff with an infinity pool and a design that blends the Greek islands with the volcanic palette of the Azores. Modern interiors, an outdoor fire pit at sunset, healthy breakfast, and saltwater pool. 20 minutes by car from Ponta Delgada and well positioned for exploring the island by car. The favorite of couples looking for visual impact and privacy at once. Estimated price: €280–480/night.',
      tag: 'Infinity pool with Greek-island aesthetic',
      affiliateUrl: 'https://www.booking.com/hotel/pt/white-exclusive-suites-amp-villas.en-gb.html',
      archetypes: ['Couples'],
    },
    {
      name: 'Octant Furnas',
      type: 'Hotel · Furnas Valley, São Miguel',
      priceTier: '$$$',
      description: 'Contemporary design hotel in the heart of Europe\'s most active geothermal valley. Two outdoor thermal pools, a restaurant with seasonal Azorean cuisine, and the option to dine on Cozido das Furnas — the stew literally cooked underground in the valley\'s fumaroles. For the strangest night of the week: falling asleep to the smell of sulfur from the ground and waking up to volcanic mist among the trees. Estimated price: €200–380/night.',
      tag: 'Thermal pools in the geothermal valley',
      affiliateUrl: 'http://booking.com/hotel/pt/octant-furnas.html',
      archetypes: ['Couples'],
    },
  ],

  hotelsDescription: 'Shelters with a volcano in the background.',

  experiences: [
    {
      name: 'Whale watching — Terra Azul',
      description: 'A 3-hour catamaran excursion from the Vila Franca do Campo dock with marine biologists on board. The Azores are one of the ten best destinations in the world for cetacean watching. Sperm whales, sei whales, and four dolphin species are the regulars. Safety and marine-ethics briefing before departure, with no minimum age limit for couples. Available with free cancellation 24 hours in advance.',
      tags: ['Catamaran', 'Marine biologists', 'Cetaceans'],
      affiliateUrl: 'https://www.getyourguide.com/azores-whale-watching-terra-azul-s9545/',
    },
    {
      name: 'Sete Cidades & Lagoa do Fogo — Full Day Tour',
      description: 'The single most important route on São Miguel: the twin lake inside the Sete Cidades crater — blue and green at once depending on where you look from — plus Lagoa do Fogo at the island\'s central peak. An 8-hour tour with lunch included, a local guide in English and Spanish, and stops at all the main viewpoints. For the couple renting a car, it can be done independently — but the local guide brings volcanic context that doesn\'t come up on Google Maps.',
      tags: ['Full day', 'Volcanic crater', 'Viewpoints'],
      affiliateUrl: 'https://www.getyourguide.com/sao-miguel-l1663/sete-cidades-y-lagoa-do-fogo-tour-de-dia-completo-con-almuerzo-t62199/',
    },
    {
      name: 'Furnas: nighttime thermal pools & dinner',
      description: 'The island\'s most unusual experience: a nighttime visit to the Furnas valley with a swim in the illuminated outdoor thermal pools, followed by dinner with an authentic Cozido das Furnas — seven meats and vegetables cooked in the ground\'s fumaroles for 7-8 hours. A 6-hour tour with pickup available from Ponta Delgada. Booking required.',
      tags: ['Thermal pools', 'Nighttime', 'Cozido das Furnas'],
      affiliateUrl: 'https://www.getyourguide.com/sao-miguel-l1663/experiencia-nocturna-en-furnas-con-bano-termal-y-cena-t120166/',
    },
  ],

  experiencesDescription: 'Volcanoes, whales, and tea.',

  tips: [
    'The car is freedom: The island has roads in perfect condition, and the most impressive viewpoints have no public transport. Renting a car for €40–50 EUR/day on the exploration days is the trip\'s best investment. On hotel days with a private pool, you won\'t need it.',
    'São Miguel cheese: Queijo da ilha — the region\'s spicy yellow cheese — is sold in any supermarket on the island for €3–5 EUR a piece. It\'s the best edible souvenir in Europe that nobody brings home. Bring more than one.',
    'The swimsuit at Terra Nostra: The thermal pool\'s iron-rich water permanently stains fabrics orange. Don\'t bring your new swimsuit.',
  ],

  funFact: 'The Azores belong to Portugal, but they\'re closer to Canada than to Lisbon. The archipelago sits 1,500 kilometers from the Portuguese coast and 3,900 kilometers from New York. The closest landmass to the Azores is the Iberian Peninsula — but only by 400 kilometers over Newfoundland, Canada.',

  checklist: [
    '🧴 Sunscreen for the catamaran and pool days',
    '🕶️ Sunglasses for the sunny July days',
    '🧥 A light jacket for the cool evenings',
    '👙 An old swimsuit for Terra Nostra\'s iron-rich pools',
    '👟 Trekking shoes for the Lagoa do Fogo trail',
    '💶 Cash in euros for the market and entrance fees',
    '🚗 Book the rental car ahead of the exploration days',
    '📷 A camera for the viewpoints and morning fog',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'João Paulo II International Airport (PDL) in Ponta Delgada, São Miguel. Direct flights from Lisbon (TAP Air Portugal, ~2 hours), Madrid, and London. From Mexico City or Buenos Aires: connection in Lisbon or Madrid. The island doesn\'t require a rental car if the plan is to stay at one hotel with organized excursions — but with your own car, access to viewpoints and small villages is notably better.',
    },
    {
      mode: 'Local transport',
      description: 'Uber works in São Miguel. Taxis available at the airport. Car rental costs €30–60 EUR/day and is the most independent way to get around the island.',
    },
    {
      mode: 'Weather in July',
      description: 'Sunny days of 22–26°C, cool nights of 17–20°C. July is the driest and sunniest month of the year in São Miguel. No significant rain. The only variable is the morning fog in the highlands — which clears before noon and makes for more dramatic photos.',
    },
  ],
}
