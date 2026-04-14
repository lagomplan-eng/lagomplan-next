import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'tulum',
  locale: 'en',

  hero: {
    title: 'Tulum',
    subtitle: 'Jungle, turquoise sea, and the nightlife beat. A pause designed to reconnect with yourself without giving up the most iconic party in the Caribbean.',
    eyebrow: 'Curated guide · Solo trip',
    tags: ['Solo', 'Social', 'Wellness', 'Adventure'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Landing',
      items: [
        {
          time: '3:00 PM',
          title: 'Check-in and first walk on the sand',
          description: '',
          tags: [],
        },
        {
          time: '6:00 PM',
          title: 'Sunset drink at Azulik',
          description: 'Incredible views.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Water and calm',
      items: [
        {
          time: '8:30 AM',
          title: 'Cenote exploration',
          description: 'Visit Cenote Dos Ojos or Gran Cenote at 8:00 AM. Being alone in the crystal-clear water before the tour groups arrive is the definition of absolute peace.',
          tags: [],
        },
        {
          time: '1:00 PM',
          title: 'Gourmet taco lunch at Taquería La Eufemia',
          description: '',
          tags: [],
        },
        {
          time: '8:00 PM',
          title: 'Quiet dinner at Hartwood',
          description: 'Book ahead.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Reset and social',
      items: [
        {
          time: '10:00 AM',
          title: 'Yoga and spa session',
          description: '',
          tags: [],
        },
        {
          time: '3:00 PM',
          title: 'Beach Club afternoon at Gitano Beach',
          description: 'The perfect balance: world-class DJ music, great cocktails, and an atmosphere where being solo feels completely natural.',
          tags: [],
        },
        {
          time: '10:00 PM',
          title: 'Dinner and dancing at Casa Jaguar',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Ruins and night',
      items: [
        {
          time: '9:00 AM',
          title: 'Visit to the Tulum Ruins',
          description: 'Before the heat of the day.',
          tags: [],
        },
        {
          time: '2:00 PM',
          title: 'Lunch in the town to discover the local side',
          description: '',
          tags: [],
        },
        {
          time: '9:00 PM',
          title: 'Night out at Papaya Playa Project',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Gentle close',
      items: [
        {
          time: '10:00 AM',
          title: 'Long brunch facing the sea',
          description: '',
          tags: [],
        },
        {
          time: '12:00 PM',
          title: 'Local design shopping at roadside boutiques and departure',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Our Habitas',
      type: 'Eco-resort · Hotel zone',
      priceTier: '$$$',
      description: 'Sustainable luxury in high-design tents on the beach. Ideal for a solo traveler for its communal atmosphere, shared dinners, and welcome rituals.',
      tag: 'Eco-chic and connection',
      affiliateUrl: '',
    },
    {
      name: 'Dune Boutique Hotel',
      type: 'Boutique hotel · Hotel zone',
      priceTier: '$$',
      description: 'A wellness sanctuary where you can start the day with beachfront yoga and explore by bicycle, then retreat to a Mediterranean design atmosphere that blends jungle and Caribbean.',
      tag: 'Wellness and beachfront luxury',
      affiliateUrl: '',
    },
    {
      name: 'Astral Tulum',
      type: 'Hotel · Hotel zone',
      priceTier: '$',
      description: 'Directly on the beach, offering stylish private suites. The perfect retreat for those seeking Caribbean aesthetics without sacrificing full-service comfort.',
      tag: 'Beachfront and versatile',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Cenotes at dawn',
      description: 'Visit Cenote Dos Ojos or Gran Cenote at 8:00 AM. Being alone in the crystal-clear water before tour groups arrive is the definition of absolute peace.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Beach Club Day at Papaya Playa Project',
      description: 'Spend the afternoon at Papaya Playa Project. The perfect balance: world-class DJ music, great cocktails, and an atmosphere where being solo feels completely natural.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Sound healing ceremony',
      description: 'Take part in a jungle ceremony. The essential mystical experience to rebalance your energy after a night of dancing.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: 'Three safe, social options for a woman traveling solo.',

  tips: [
    'Cash in hand: Many beachside spots "lose signal" on their card terminal or only accept cash. Bring Mexican pesos — the dollar exchange rate at local shops will always work against you.',
    '"Sand-Chic" dress code: Forget heels — Tulum is sand and tree roots. Beautiful sandals or even bare feet is the norm, even at the fanciest dinners.',
    'Biodegradable sunscreen and repellent: Jungle mosquitoes are relentless at dusk and cenotes prohibit chemicals that harm the water.',
  ],

  funFact: 'Tulum is the only Mayan city built facing the sea. Its original name was "Zama," meaning "dawn," because its location allows it to see the first ray of sunlight to touch Mexican soil.',

  checklist: [
    '🩱 Swimsuit and beach cover-up',
    '🧴 Biodegradable sunscreen (mandatory at cenotes)',
    '🌿 Biodegradable insect repellent (dusk mosquitoes)',
    '💵 Cash in pesos (many places are card-free)',
    '🚲 Open mind for renting a bicycle or scooter',
    '👡 Nice sandals (no heels)',
    '📖 A book or podcast for quiet mornings',
    '🔋 Power bank (long beach and night days)',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'You can arrive via Cancún Airport (CUN) or the new Tulum Airport (TQY), which is much closer to the hotel zone.',
    },
    {
      mode: 'Airport transfer',
      description: 'The safest option for a solo traveler is a pre-paid private transfer. If going the smart route, the ADO bus is excellent, clean, and safe — drops you in town and a taxi gets you to your hotel.',
    },
    {
      mode: 'Getting around locally',
      description: 'Rent a bicycle or scooter. Tulum taxis are excessively expensive and the hotel zone traffic is slow — a bike gives you the freedom to move at your own pace.',
    },
  ],
}
