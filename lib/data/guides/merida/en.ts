import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'merida',
  locale: 'en',

  hero: {
    title: 'Mérida',
    subtitle: 'The vibrant heart of Yucatán. An expedition designed to explore hidden cenotes, climb pyramids, and connect with wild nature — without losing the comfort of the White City.',
    eyebrow: 'Curated guide · Adventure family',
    tags: ['Family', 'Adventure', 'Archaeology', 'Nature'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Landing',
      items: [
        {
          time: '3:00 PM',
          title: 'Check-in and stroll along Paseo de Montejo',
          description: '',
          tags: [],
        },
        {
          time: '7:00 PM',
          title: 'Dinner of Yucatecan antojitos in Santa Ana',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Cenotes and bicycles',
      items: [
        {
          time: '9:30 AM',
          title: 'Expedition to the Santa Bárbara cenotes',
          description: 'Three different cenotes covered by truck or bicycle. Safe, organized, and the water is crystal clear.',
          tags: [],
        },
        {
          time: '3:00 PM',
          title: 'Village lunch in Homún and return to the hotel for pool time',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Pyramids and chocolate',
      items: [
        {
          time: '8:30 AM',
          title: 'Exploration of Uxmal',
          description: 'Arrive early to beat the heat. Less crowded than Chichén Itzá.',
          tags: [],
        },
        {
          time: '12:00 PM',
          title: 'Cacao workshop at Choco-Story',
          description: 'Kids can see rescued animals and learn how the Mayans made cacao.',
          tags: [],
        },
        {
          time: '6:00 PM',
          title: 'Legends night in the center of Mérida',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Mangroves and coast',
      items: [
        {
          time: '10:00 AM',
          title: 'El Corchito Reserve in Progreso',
          description: 'A short boat ride to an oasis of mangroves and shallow cenotes. Ideal for spotting raccoons and coatis in their natural habitat.',
          tags: [],
        },
        {
          time: '2:30 PM',
          title: 'Lunch by the sea at Crabster and beach time',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'The yellow city',
      items: [
        {
          time: '10:00 AM',
          title: 'Visit to Izamal',
          description: 'Climb the Kinich Kakmó pyramid (free and fun).',
          tags: ['Free entry'],
        },
        {
          time: '1:00 PM',
          title: 'Lunch at Kinich',
          description: 'The best restaurant in the area.',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Market and farewell',
      items: [
        {
          time: '9:00 AM',
          title: 'Breakfast of lechón tacos at Mercado de Santiago',
          description: '',
          tags: [],
        },
        {
          time: '11:00 AM',
          title: 'Final shopping for hammocks or guayaberas and departure to the airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Chablé Yucatán',
      type: 'Resort · Jungle hacienda',
      priceTier: '$$$',
      description: "Absolute luxury integrated into the jungle. Set in a historic hacienda, it features its own cenote, casitas with private pools, and a kids' program focused on nature and Mayan cuisine.",
      tag: 'The ultimate Mayan sanctuary',
      affiliateUrl: '',
    },
    {
      name: 'Hacienda Xcanatun by Angsana',
      type: 'Hacienda · Mérida',
      priceTier: '$$',
      description: 'The historic elegance of a hacienda with modern amenities. Its spacious gardens and pools are perfect for kids to run freely after a day of archaeological exploration.',
      tag: 'Classic comfort and gardens',
      affiliateUrl: '',
    },
    {
      name: 'Las Brisas',
      type: 'Hotel · Paseo de Montejo',
      priceTier: '$',
      description: 'The perfect balance between traditional luxury and urban practicality. Its pool is one of the best in the city and its location steps from Paseo de Montejo lets you enjoy without complications.',
      tag: 'Iconic comfort and location',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Santa Bárbara Cenotes',
      description: 'Three different cenotes covered by truck (a wagon pulled by horses on rails) or bicycle. Safe, organized, and the water is crystal clear.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Uxmal and Choco-Story',
      description: 'Explore the Uxmal archaeological zone (less crowded than Chichén Itzá) and cross the street to the chocolate museum. Kids can see rescued animals and learn how the Mayans made cacao.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'El Corchito Reserve',
      description: 'A short boat ride from Progreso to an oasis of mangroves and shallow cenotes. The ideal place to spot raccoons and coatis in their natural habitat as they swim.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: 'Three moods for your family.',

  tips: [
    'The "peak heat" rule: Between 1:00 PM and 4:00 PM, the Yucatán sun is relentless. Do what the locals do: schedule heavy activities early, return to the pool at midday, and head out again when the sun drops.',
    'Jungle-grade repellent: Don\'t trust mild commercial sprays. Look for repellents with strong natural ingredients or moderate DEET, especially for afternoons at haciendas or cenotes.',
    'Rigid water shoes: For kids, aquashoes with rubber soles are mandatory. Cenote rocks can be slippery and these give them the confidence to jump and explore fearlessly.',
  ],

  funFact: 'Mérida was built over the ruins of an ancient Mayan city called T\'Hó. If you look carefully at the walls of the Cathedral of San Ildefonso, you\'ll see carved stones that once belonged to the original pyramids.',

  checklist: [
    '👟 Aquashoes with rubber soles (for cenotes)',
    '🧴 Insect repellent with moderate DEET',
    '🧢 Wide-brim hat (relentless Yucatán sun)',
    '🩱 Swimsuit (cenotes and pools)',
    '💊 First-aid kit and motion sickness medicine (winding roads)',
    '💵 Cash for markets and crafts',
    '♻️ Reusable water bottle',
    '👒 Light linen or cotton clothing',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Arrival at Mérida Airport (MID).',
    },
    {
      mode: 'Car rental',
      description: 'For a family of 4 or 5, the most Lagom option is renting an SUV directly at the airport. Mérida is very safe to drive and the real adventure lies in the surrounding villages and cenotes.',
    },
    {
      mode: 'Getting around the city',
      description: 'In the city, Uber works great. For excursions to the jungle or coast, having your own car gives you the flexibility to return to the hotel when the little ones need a nap.',
    },
  ],
}
