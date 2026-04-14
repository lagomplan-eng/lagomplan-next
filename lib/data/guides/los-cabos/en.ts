import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'los-cabos',
  locale: 'en',

  hero: {
    title: 'Los Cabos',
    subtitle: 'Where the desert embraces the sea. A getaway designed to renew body and mind, with the perfect balance between mysticism and sophistication.',
    eyebrow: 'Curated guide · Relax with friends',
    tags: ['Friends', 'Relaxation', 'Spa', 'Luxury'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival',
      items: [
        {
          time: '3:00 PM',
          title: 'Check-in and welcome toast with ocean view',
          description: '',
          tags: [],
        },
        {
          time: '5:30 PM',
          title: 'Sunset walk on the beach',
          description: '',
          tags: [],
        },
        {
          time: '8:00 PM',
          title: 'Relaxed dinner at the hotel',
          description: 'The Rooftop at The Cape or Los Riscos at Hacienda Encantada.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Spa and sea',
      items: [
        {
          time: '9:00 AM',
          title: 'Morning yoga or meditation',
          description: '',
          tags: [],
        },
        {
          time: '11:00 AM',
          title: 'Spa session: massage and hydrotherapy',
          description: 'Dedicate 2–3 hours to the hydrotherapy circuit (steam room, sauna, cold plunge).',
          tags: [],
        },
        {
          time: '4:30 PM',
          title: 'Private sailing to the Arch',
          description: 'Watching the sunset with a glass of wine from the sea is the peak moment of the trip.',
          tags: [],
        },
        {
          time: '8:30 PM',
          title: 'Gala dinner in the San José Art District',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'San José and design',
      items: [
        {
          time: '10:00 AM',
          title: 'Long and nutritious brunch',
          description: '',
          tags: [],
        },
        {
          time: '11:30 AM',
          title: 'Stroll through San José galleries',
          description: 'Local design shopping.',
          tags: [],
        },
        {
          time: '2:30 PM',
          title: 'Last coffee by the sea and departure to the airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'The Cape, a Thompson Hotel',
      type: 'Hotel · Tourist Corridor',
      priceTier: '$$$',
      description: 'Striking architecture and mid-century modern aesthetic. The place to see and be seen, with front-row views of the Arch from every bathtub.',
      tag: 'Iconic luxury and design',
      affiliateUrl: '',
    },
    {
      name: 'Hacienda Encantada Resort & Residences',
      type: 'Resort · Tourist Corridor',
      priceTier: '$$',
      description: 'The classic Baja experience. Hacienda-style architecture with spectacular Sea of Cortez views. Ideal for groups seeking spacious suites and villas, and a full traditional spa.',
      tag: 'Classic comfort and spaciousness',
      affiliateUrl: '',
    },
    {
      name: 'Drift San José',
      type: 'Boutique hotel · Art District',
      priceTier: '$',
      description: 'Industrial minimalism in the heart of the Art District. A smart retreat for those who prefer neighborhood life, evening bonfires, and clean aesthetics without the cost of a large resort.',
      tag: 'Smart value and local style',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Morning spa and water circuit',
      description: 'Dedicate 2–3 hours to the hydrotherapy circuit (steam room, sauna, cold plunge). In Los Cabos, the spa is one of the main activities of the trip.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Private sunset sail',
      description: 'A catamaran just for your group heading to the Arch. Watching the sunset with a glass of wine from the sea is the peak moment of the entire stay.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Garden dinner: Flora Farms or Acre',
      description: 'Farm-to-table gastronomy in San José surrounded by flowers and botanical cocktails.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: 'Three moods for your group of friends.',

  tips: [
    "The Baja dry look: The air here is very dry. Pack a good facial oil and hair oil. The Baja sun and Pacific breeze can dehydrate more than you expect.",
    "Table with a view: If you're going to The Cape for sunset (even if you're not staying there), book the Rooftop a week in advance. It's the best spot in the area and fills up fast.",
    'Light layers: Even though it\'s desert, the sea breeze at night in Los Cabos can be cool. A pashmina or light blazer is your best ally for outdoor dinners.',
  ],

  funFact: 'Jacques Cousteau called this place "the aquarium of the world." It is the exact point where the Sea of Cortez meets the Pacific at the "Land\'s End."',

  checklist: [
    '🩱 Swimsuit and sarongs',
    '🧴 SPF 50+ sunscreen (desert amplifies the sun)',
    '🌿 Facial and hair oil (very dry air)',
    '🧣 Pashmina or light blazer for outdoor dinners',
    '🕶️ Quality sunglasses',
    '💵 Cash and credit card',
    '👗 Midi dress or linen guayabera for dinners',
    '🔋 Power bank',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Arrival at San José del Cabo Airport (SJD).',
    },
    {
      mode: 'Airport transfer',
      description: 'For groups, the most Lagom option is booking a private transport in advance. Avoids taxi lines and Uber confusion (which has restrictions in the federal airport zone).',
    },
    {
      mode: 'Getting around',
      description: 'If staying at Hacienda Encantada or The Cape, you are on the Tourist Corridor. Uber works well for moving between hotels or heading to San José.',
    },
  ],
}
