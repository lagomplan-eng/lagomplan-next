import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'guatemala',
  locale: 'en',

  hero: {
    title: 'Guatemala',
    subtitle: 'The heart of the Maya world. A trip designed for getting lost among bougainvilleas, waking up to active volcanoes, and sailing the most beautiful lake on earth — with the perfect balance of comfort and adventure.',
    eyebrow: 'Curated guide · Romance & Nature · 5 days · Luxury, gastronomy',
    tags: ['Couples', 'Nature', 'Luxury', 'Food'],
    image: '/images/guides/guatemala.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Colonial landing',
      items: [
        {
          time: '14:00',
          title: 'Check-in and light lunch at Hector\'s Bistro',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Historic walk through the center',
          description: 'Iglesia de la Merced and Antigua\'s cobblestone streets under the Arco de Santa Catalina.',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Romantic dinner at Mesón Panza Verde',
          description: 'Dinner in a candlelit patio, enjoying the first night between colonial walls.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Flavors and volcanoes',
      items: [
        {
          time: '09:00',
          title: 'Private tour and coffee tasting at Finca Filadelfia',
          description: 'Morning dedicated to the senses on a coffee estate.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Long brunch at Bistrot Cinq',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Local-design shopping at Casa del Algodón',
          description: 'Fine textile boutiques.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at Tartines',
          description: 'Views of the Cathedral ruins.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Toward the eye of the world',
      items: [
        {
          time: '09:00',
          title: 'Private transfer to Lake Atitlán',
          description: 'The first sight of the lake as you descend the mountain will take your breath away.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Check-in at Casa Palopó and lunch with a lake view',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Reading and meditation facing the volcanoes',
          description: 'Sunset toast from the private terrace.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Tasting-menu dinner at the hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Blue and art',
      items: [
        {
          time: '09:00',
          title: 'Private boat tour to San Juan and Santiago Atitlán',
          description: 'San Juan offers art galleries and women\'s weaving cooperatives that use natural dyes.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Lunch at the dock of a local boutique hotel',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Couples massage with local oils',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Farewell dinner under Atitlán\'s sky',
          description: 'Last night of stars and a fire pit.',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Gentle goodbye',
      items: [
        {
          time: '09:00',
          title: 'Long, slow breakfast',
          description: 'Final nourishing breakfast with tropical fruit and freshly ground coffee in front of the water.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Transfer back to Guatemala City (airport)',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Casa Santo Domingo',
      type: 'Hotel · Antigua',
      priceTier: '$$$',
      description: 'An icon of Guatemalan hospitality built over the ruins of the 17th-century Convento de Santo Domingo. A "museum hotel" where contemporary luxury weaves into colonial walls, archaeological crypts, and secret gardens lit by hundreds of candles at dusk. Perfect for travelers who want a deep dive into Antigua\'s history and sacred art without leaving their refuge.',
      tag: 'Colonial splendor and luxury archaeology',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/c-2gW8Gp-L',
      archetypes: ['Couples'],
    },
    {
      name: 'Casa Palopó',
      type: 'Boutique villa · Lake Atitlán',
      priceTier: '$$$',
      description: 'Set in the hills above Santa Catarina Palopó. A private villa with impeccable service, fine-craft Guatemalan décor, and an infinity pool that melts into the blue of the lake. Probably the most romantic place in Central America.',
      tag: 'Dream views and exclusivity',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/C6_K1iudtq',
      archetypes: ['Couples', 'Wellness'],
    },
    {
      name: 'Mesón Panza Verde',
      type: 'Boutique villa · Antigua',
      priceTier: '$$$',
      description: 'Antigua\'s first European-style boutique hotel—established in 1986 and still looking fresh. Nine suites with fireplaces surround a colonial garden with a fountain. The restaurant, with its vaulted ceilings and extensive wine list, is considered one of the best in the country. Breakfast is included. Four blocks from Central Park.',
      tag: 'One of the best in the country',
      // TODO: replace with Mesón Panza Verde's own Stay22 link (currently duplicates Casa Palopó's)
      affiliateUrl: 'https://booking.stay22.com/lagomplan/C6_K1iudtq',
      archetypes: ['Couples', 'Wellness'],
    },
  ],

  hotelsDescription: 'Two strategic stops for a high-end stay.',

  experiences: [
    {
      name: 'Private coffee tasting',
      description: 'Guatemala produces some of the best beans in the world. A sensory tasting at a historic estate like La Azotea lets you understand the connection between volcanic soil and the perfect cup.',
      tags: ['Coffee', 'Tasting', 'Estate'],
      affiliateUrl: '',
    },
    {
      name: 'Private sailing on Atitlán',
      description: 'Avoid the public boats. Rent a private launch to visit San Juan La Laguna (the village of art and textiles) and Santa Catarina. Seeing the three volcanoes (Atitlán, Tolimán and San Pedro) from the middle of the lake in silence is a spiritual experience.',
      tags: ['Lake', 'Volcanoes', 'Private'],
      affiliateUrl: '',
    },
    {
      name: 'Helicopter transfer',
      description: 'For the highest level of luxury and to skip the traffic, the helicopter transfer from Antigua to Atitlán offers an aerial perspective of the volcanoes that is simply unforgettable.',
      tags: ['Helicopter', 'Aerial', 'Luxury'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Layers for rain: In June, a light trench or designer windbreaker is essential for the afternoons. Don\'t forget shoes with good traction for Antigua\'s cobblestones, which can be slippery in the rain.',
    'Cash (quetzales): Although luxury hotels and restaurants accept cards, you\'ll need cash to buy crafts in the villages around Atitlán. Exchange at the airport or in Antigua.',
    'The "Xocomil": On the lake, after midday, a strong wind called Xocomil tends to pick up and shake the water. If you\'re prone to seasickness, make sure your boat transfers are early in the morning.',
  ],

  funFact: 'Antigua Guatemala was the capital of all Central America for more than 200 years until a series of earthquakes in 1773 forced the move to present-day Guatemala City. Thanks to that "abandonment," the city kept its Baroque architecture nearly intact and is today a UNESCO World Heritage Site.',

  checklist: [
    '🧥 Windbreaker or light trench for afternoons',
    '👟 Shoes with good traction for cobblestones',
    '💵 Quetzales in cash for crafts',
    '📷 Camera for the volcanoes and textiles',
    '🧴 Sunscreen and repellent',
    '🕶️ Sunglasses',
    '👗 Something elegant for dinner at Mesón Panza Verde',
    '☕ Openness to tasting Guatemalan coffee',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Arrival at La Aurora International Airport (GUA).',
    },
    {
      mode: 'Transfers',
      description: 'Traffic in Guatemala can be unpredictable. The most Lagom move is booking private door-to-door transfers. GUA to Antigua is 1 hour; Antigua to Atitlán is roughly 2.5 to 3 hours on a winding road.',
    },
    {
      mode: 'Weather in June',
      description: 'Rainy season ("Invierno"). Mornings tend to be sunny and spectacular; the rain arrives in the afternoon. Plan all outdoor activities before 14:00.',
    },
  ],
}
