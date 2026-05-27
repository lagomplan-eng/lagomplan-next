import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'atacama',
  locale: 'en',

  hero: {
    title: 'San Pedro de Atacama, Chile',
    subtitle: 'The driest desert on earth has geysers at dawn, lagoons with pink flamingos, and a night sky that kids will remember longer than any theme park. And you don\'t need a resort budget to live it well.',
    eyebrow: 'Curated guide · Family with small kids · 5 days · Tight budget',
    tags: ['Family', 'Small kids', 'Nature', 'Budget'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and acclimatization',
      items: [
        {
          time: '12:00',
          title: 'Check-in and rest',
          description: 'Arrival at the hotel before noon.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Walk through the village, book tours',
          description: 'Calle Caracoles has tour agencies, a crafts market and ice-cream shops. Compare prices across two or three agencies before booking.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Dinner at one of the budget restaurants on Caracoles',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Atacama sky from the hotel courtyard',
          description: 'No tour, just looking up.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Valle de la Luna',
      items: [
        {
          time: '09:00',
          title: 'Breakfast',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Archaeology Museum',
          description: 'Free entry, excellent for explaining Atacama culture to kids. About an hour.',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Hotel pool / free time',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Valle de la Luna tour or bikes',
          description: 'Valle de la Luna by bike or group tour.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Sunset in the valley',
          description: 'The dunes work as natural slides.',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Dinner and early bedtime',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Tatio Geysers',
      items: [
        {
          time: '04:00',
          title: 'Tour departure',
          description: 'The earliest day. Breakfast included in the tour.',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Back in the village',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Late breakfast at the hotel',
          description: '',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Rest / pool',
          description: 'Long nap, pool, nothing strenuous.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Quiet dinner',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Lagoons and flamingos',
      items: [
        {
          time: '08:00',
          title: 'Tour departure',
          description: 'Full-day tour to the Altiplanic Lagoons (Miscanti and Miñiques).',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Back in the village',
          description: 'Lunch happens on the road — pack snacks and water.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Crafts market',
          description: 'Free afternoon in the village to shop the local market.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Dinner and pre-departure prep',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Free morning and flight home',
      items: [
        {
          time: '09:00',
          title: 'Long breakfast',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Last walk through the village',
          description: 'Or a daytime stargazing tour (some operators have telescopes for viewing the sun and moon simultaneously).',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Transfer to Calama',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Flight back to Santiago',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hoteles Pueblo de Tierra',
      type: 'Hotel · San Pedro de Atacama',
      priceTier: '$$',
      description: 'Mid-range hotel in San Pedro with an outdoor pool and breakfast included that starts at 4am for those heading to the Tatio geysers. Heated rooms — the desert\'s nighttime cold at 2,400 meters surprises everyone — and staff used to organizing family tours. Five minutes\' walk from the bus terminal. Estimated price: $80–130 USD/night for a family room.',
      tag: 'Best price-to-comfort ratio',
      affiliateUrl: '',
      archetypes: ['Families'],
    },
    {
      name: 'Quechua Hotel',
      type: 'Hotel · San Pedro de Atacama',
      priceTier: '$$',
      description: 'Buffet breakfast included, free Wi-Fi and a location 300 meters from Calle Caracoles — the village\'s main artery. Rooms for up to four. The hotel keeps a temperature and oxygen monitor at the front desk for altitude — a detail that reassures parents traveling with small kids. Family-run, with staff that knows every local tour agency. Estimated price: $70–110 USD/night for a family room.',
      tag: 'Family-run with altitude-aware touches',
      affiliateUrl: '',
      archetypes: ['Families'],
    },
    {
      name: 'Hostal Belen',
      type: 'Guesthouse · San Pedro de Atacama',
      priceTier: '$',
      description: 'For families on the tightest budget: private en-suite rooms, a quiet inner courtyard and homemade breakfast included. A 15-minute walk from the center — a distance that, with small kids, can be solved by tuk-tuk for $2. The owner adapts breakfast for pre-dawn departures with something to go. The most honest option in the low range. Estimated price: $40–65 USD/night for a family room.',
      tag: 'Honest, budget-friendly for families',
      affiliateUrl: '',
      archetypes: ['Families'],
    },
  ],

  hotelsDescription: 'Comfortable base, honest price — three options by budget.',

  experiences: [
    {
      name: 'Tatio Geysers at dawn',
      description: 'The highest geothermal field in the world (4,320 meters), 90 kilometers from San Pedro. The tour leaves at 4am to arrive at sunrise, when the geysers reach peak activity with the temperature contrast. For kids 4 and up: the show of steam, boiling water and rising sun over the volcanoes needs no explanation. All tours include a hot breakfast on site. Agency tour: $20–30 USD per person.',
      tags: ['Geysers', 'Sunrise', 'Family'],
      affiliateUrl: '',
    },
    {
      name: 'Valle de la Luna at sunset',
      description: '15 kilometers from San Pedro, the valley of salt and clay formations that NASA uses as a Martian analog to train astronauts. The ride by bike — rentals in town for $8–12 USD/day — or by group tour features salt dunes to climb and the most photogenic sunset in the desert. For kids of any age: the dunes work as natural slides.',
      tags: ['Sunset', 'Bike', 'Dunes'],
      affiliateUrl: '',
    },
    {
      name: 'Altiplanic Lagoons and flamingos',
      description: 'The Miscanti and Miñiques lagoons, at 4,200 meters, have colonies of pink flamingos feeding on red algae in salt water. Full-day tour: $25–35 USD per person. For kids who already know what a flamingo is and have seen them at the zoo: seeing them in the wild at twenty meters is another category of experience.',
      tags: ['Lagoons', 'Flamingos', 'Altiplano'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Nighttime cold: At 2,400 meters, Atacama nights drop to 5–8°C even in summer. For the Tatio tour (4am departure), pack a fleece jacket, gloves and a hat for the kids — the bus is warm, but the 30 minutes outside at the geysers are intense.',
    'There\'s no such thing as a cheap tour: Caracoles agencies have very similar prices because the costs are the same (fuel, guide, permits, insurance). The real difference is group size and the guide\'s language. For families with small kids: always choose a small group (max 8) even if it costs $5 more.',
    'Market vs. Caracoles shops: Crafts at the local market — weaving, Atacameña ceramics, volcanic-stone pendants — cost 30–50% less than shops on Calle Caracoles. For kids who want to take something home: the market has small pieces for $2–5 USD.',
  ],

  funFact: 'The Atacama Desert has zones where no precipitation has been recorded in over 400 years. It\'s so arid that NASA uses it as a Mars analog to test rovers and train astrobiologists. The same aridity that makes life hostile makes it the best place in the world for astronomy: more than 300 clear nights a year and the least light pollution in the southern hemisphere.',

  checklist: [
    '🧥 Fleece jacket for everyone (nights at 5–8°C)',
    '🧤 Gloves and beanie for the Tatio geysers',
    '💧 500ml water bottle per person',
    '🧴 High-SPF sunscreen (altitude sun)',
    '🕶️ Sunglasses with strong UV protection',
    '👟 Comfortable shoes for sand, salt and stone',
    '🧦 Extra socks (the geysers get wet)',
    '💵 Chilean pesos in cash for market and tours',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'El Loa Airport (CJC) in Calama, 100 kilometers from San Pedro. Direct flights from Santiago (SCL) with LATAM, Sky Airline and JetSMART, a 2-hour trip. Transfer from Calama to San Pedro: Transfer Atacama bus ($9–12 USD/person) or private transfer ($80–100 USD per vehicle). The bus is the most affordable family option if kids tolerate 90 minutes on the road.',
    },
    {
      mode: 'Altitude',
      description: 'San Pedro is at 2,400 meters — less critical than Cusco, but small kids are more sensitive. The first two days, go slowly and skip high-altitude tours (Tatio is at 4,320 meters — book for day 3 or 4). Constant hydration.',
    },
    {
      mode: 'Water',
      description: 'Tap water in San Pedro is not drinkable. Hotels provide bottled water; tour agencies carry jugs. For kids, always carry a 500ml bottle per person.',
    },
  ],
}
