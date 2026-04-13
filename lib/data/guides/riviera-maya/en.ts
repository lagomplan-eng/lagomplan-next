import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'riviera-maya',
  locale: 'en',

  hero: {
    title: 'Riviera Maya',
    subtitle: 'A seven-day journey designed to find the luxury of privacy during the most vibrant time of year. The exact balance between Caribbean energy and jungle sanctuary.',
    tags: ['Family', 'Adventure', 'Luxury', 'Nature'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'The Mayakoba sanctuary',
      items: [
        {
          time: '3:00 PM',
          title: 'Arrival and check-in at Mayakoba',
          description: 'Shed the city stress in a place where the only transport is golf carts and electric boats through the canals.',
          tags: [],
        },
        {
          time: '8:00 PM',
          title: 'Welcome dinner at Zapote Bar',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Kayak and sand',
      items: [
        {
          time: '9:00 AM',
          title: 'Morning kayak and snorkel through Mayakoba\'s canals',
          description: '',
          tags: [],
        },
        {
          time: '1:00 PM',
          title: 'Lunch at Aquí me quedo',
          description: 'Feet in the sand.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Underground exploration',
      items: [
        {
          time: '9:00 AM',
          title: 'Expedition at Río Secreto',
          description: 'Book the first slot. With controlled groups and strict schedules, it\'s the best way to experience underground adventure without the weight of peak season.',
          tags: [],
        },
        {
          time: '3:00 PM',
          title: 'Lunch in Ciudad Mayakoba to avoid entering central Playa del Carmen',
          description: '',
          tags: [],
        },
        {
          time: '6:00 PM',
          title: 'Check-in at Hotel Esencia, Xpu-Há',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'The secret of Xpu-Há',
      items: [
        {
          time: '10:00 AM',
          title: 'Morning of reading and sea at Xpu-Há beach',
          description: 'During peak season, private access to Xpu-Há is a true privilege.',
          tags: [],
        },
        {
          time: '2:00 PM',
          title: 'Seafood lunch at the hotel or a private beach club',
          description: '',
          tags: [],
        },
        {
          time: '5:00 PM',
          title: 'Spa afternoon for the parents, paddleboard for the kids',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Tulum & Sian Ka\'an',
      items: [
        {
          time: '8:00 AM',
          title: 'Tulum Ruins',
          description: 'Being among the first to enter is essential.',
          tags: [],
        },
        {
          time: '1:00 PM',
          title: 'Lunch at Hartwood',
          description: 'Book weeks in advance.',
          tags: [],
        },
        {
          time: '7:00 PM',
          title: 'Check-in at Habitas Tulum',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Ancient canals',
      items: [
        {
          time: '9:00 AM',
          title: 'Private tour through Sian Ka\'an canals (enter via Muyil)',
          description: 'Floating through the ancient canals in total silence is the perfect antidote to peak season noise.',
          tags: [],
        },
        {
          time: '8:00 PM',
          title: 'Farewell dinner at Arca',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Nourishing farewell',
      items: [
        {
          time: '10:00 AM',
          title: 'Brunch at The Real Coconut',
          description: '',
          tags: [],
        },
        {
          time: '12:00 PM',
          title: 'Final shopping in the Tulum town (linen and ceramics)',
          description: '',
          tags: [],
        },
        {
          time: '3:00 PM',
          title: 'Strategic departure to the airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Mayakoba',
      type: 'Resort · Playa del Carmen',
      priceTier: '$$$',
      description: 'The perfect sanctuary for the first days. As a gated community, Mayakoba completely isolates you from the crowds. Villas with private pools give everyone their own space while you enjoy the silence of the canals.',
      tag: 'Absolute privacy and impeccable logistics',
      affiliateUrl: '',
    },
    {
      name: 'Hotel Esencia, Xpu-Há',
      type: 'Hotel · Xpu-Há',
      priceTier: '$$$',
      description: 'Set on one of the most beautiful and spacious beaches in the area. Its exclusivity ensures the beach never feels crowded. The perfect midpoint between Playa del Carmen and Tulum.',
      tag: 'Quiet luxury and the Riviera\'s best beach',
      affiliateUrl: '',
    },
    {
      name: 'Habitas Tulum',
      type: 'Eco-resort · Tulum',
      priceTier: '$$',
      description: 'For the Tulum vibe with structure. Luxury tents in the jungle zone offer total disconnection. Visually stunning with a very authentic wellness focus.',
      tag: 'Eco design and bohemian sophistication',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Río Secreto',
      description: 'With controlled groups and strict schedules, it\'s the best way to experience underground adventure without peak season overwhelm. The "Plus" version includes activities that keep teenagers constantly engaged.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Sian Ka\'an via Muyil',
      description: 'Instead of entering through the crowded Tulum hotel zone, enter via Muyil. Floating through the ancient canals in total silence is the perfect antidote to peak season noise.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Cenote Zapote (cenote route)',
      description: 'While everyone crowds the famous Tulum cenotes, this cenote in Puerto Morelos offers jumping platforms and stunning natural architecture with far fewer people.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Book EVERYTHING now: During peak season, there\'s no such thing as "showing up to see if there\'s a table." Restaurants like Hartwood or Arca require immediate reservations.',
    'The sargassum traffic light: In March/April, seaweed can be a factor. Follow the daily reports from the Quintana Roo Sargassum Monitoring Network to choose the best beach for each day.',
    'Cash in pesos: Many cenotes and boat tips don\'t accept cards. During peak season, Tulum ATMs run out of cash quickly. Bring what you need from Mexico City.',
  ],

  funFact: 'Did you know the reef running along the Riviera Maya is the second largest in the world? Called the Mesoamerican Reef System, it stretches over 1,000 kilometers. Swimming in it at dawn is one of the most powerful experiences of this trip.',

  checklist: [
    '🩱 Multiple swimsuits',
    '🧴 Biodegradable sunscreen (mandatory at cenotes)',
    '🌿 Biodegradable insect repellent',
    '💵 Cash in pesos (ATMs scarce at cenotes)',
    '👟 Aquashoes or water sandals',
    '🎒 Small backpack for excursions',
    '🔋 Power bank for long days',
    '🌊 Microfiber towel (light and quick-drying)',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'If possible, fly into the new Tulum Airport (TQO). It will save you the heavy traffic that builds between Cancún and Playa del Carmen during peak season.',
    },
    {
      mode: 'Car rental',
      description: 'An SUV is essential. During peak season there are more checkpoints and Highway 307 traffic can be slow — a comfortable, high-clearance vehicle makes all the difference.',
    },
    {
      mode: 'Timing strategy',
      description: 'Always leave before 8:30 AM. During peak season, arriving late to a cenote or beach means arriving to a line. The golden rule: "adventure early, long brunch after."',
    },
  ],
}
