import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'queretaro',
  locale: 'en',

  hero: {
    title: 'Querétaro',
    subtitle: 'Baroque architecture, nearby vineyards, and a food scene that surprises. The perfect city to walk by day and toast by night.',
    eyebrow: 'Curated guide · Friends group',
    tags: ['Friends', 'Gastronomy', 'Culture', 'Wine'],
    image: '/images/guides/guides-headers/Quer%C3%A9taro.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Landing',
      items: [
        {
          time: '2:00 PM',
          title: 'Check-in and lunch in the Centro',
          description: 'Try the "Gorditas de migajas."',
          tags: [],
        },
        {
          time: '5:00 PM',
          title: 'Stroll through Plaza de Armas and the Andador Protasio Tagle',
          description: '',
          tags: [],
        },
        {
          time: '8:00 PM',
          title: 'Dinner at Hacienda La Laborcilla',
          description: 'For a stunning atmosphere.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Vineyards and the Peña',
      items: [
        {
          time: '10:00 AM',
          title: 'Road trip to Bernal',
          description: 'Partial or full climb of the Peña de Bernal.',
          tags: [],
        },
        {
          time: '2:00 PM',
          title: 'Lunch and tasting at Viñedos De Cote',
          description: 'Book in advance.',
          tags: [],
        },
        {
          time: '7:00 PM',
          title: 'Back to the city for a mezcal night in the Centro',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Culture and design',
      items: [
        {
          time: '11:00 AM',
          title: 'Visit to the Querétaro Art Museum',
          description: 'The cloister is one of the most beautiful in the Americas.',
          tags: [],
        },
        {
          time: '2:00 PM',
          title: 'Long brunch at Mosecafé',
          description: '',
          tags: [],
        },
        {
          time: '5:00 PM',
          title: 'Afternoon browsing local design stores and galleries',
          description: '',
          tags: [],
        },
        {
          time: '9:00 PM',
          title: 'Farewell dinner at La Biznaga',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'The gentle close',
      items: [
        {
          time: '10:00 AM',
          title: 'Visit to the Aqueduct and walk through the La Cruz neighborhood',
          description: '',
          tags: [],
        },
        {
          time: '12:00 PM',
          title: 'Light lunch and departure toward Mexico City',
          description: 'To arrive before nightfall.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel Boutique Casa del Atrio',
      type: 'Boutique hotel · Historic center',
      priceTier: '$$$',
      description: 'A gem across from the Temple of San Agustín. Eclectic rooms filled with art. The central courtyard is the perfect place for that first morning coffee.',
      tag: 'Art and sophistication',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/717u9iT-_f?aid=lagomplan&campaign=lagomplan-queretaroamigosestilo&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Santiago+de+Quer%C3%A9taro%2C+Qro.%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fqueretaro-amigos-estilo',
    },
    {
      name: 'Hotel Danza del Sol',
      type: 'Hotel · Downtown',
      priceTier: '$$',
      description: 'Spacious, with the feel of a renovated hacienda and excellent service. Ideal for larger groups looking for comfort without complications.',
      tag: 'Classic comfort',
      affiliateUrl: 'https://expedia.stay22.com/lagomplan/1im52898y3?aid=lagomplan&campaign=lagomplan-queretaroamigosestilo&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Santiago+de+Quer%C3%A9taro%2C+Qro.%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fqueretaro-amigos-estilo',
    },
    {
      name: 'Morazul Hotel Boutique',
      type: 'Boutique hotel · Historic center',
      priceTier: '$$',
      description: 'A retreat designed for those who value attention to detail, steps from the most iconic temples. Outdoor areas provide a calm respite to decompress after a day of exploration.',
      tag: 'Curated service and unbeatable location',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/_fF6NqiDqC?aid=lagomplan&campaign=lagomplan-queretaroamigosestilo&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Santiago+de+Quer%C3%A9taro%2C+Qro.%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fqueretaro-amigos-estilo',
    },
  ],

  experiences: [
    {
      name: 'Wine and Cheese Route',
      description: 'A getaway just 45 minutes away to Tequisquiapan or Ezequiel Montes. Visit Freixenet or De Cote for a tasting with views of the Peña de Bernal.',
      tags: [],
      affiliateUrl: 'https://www.getyourguide.com/tequisquiapan-l176257/queretaro-cheese-wine-tour-in-a-day-t640458/?ranking_uuid=9eab0807-6e3c-4a0f-b173-2fb752f7e2ca&adults=1',
    },
    {
      name: 'Rooftop bar hopping',
      description: 'Querétaro has the best views from above. Places like La Grupa or Dodo Café are essential for the evening "pre-game."',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Walk along the Aqueduct',
      description: 'A photographic tour through the iconic arches and alleys of the historic center (UNESCO World Heritage Site).',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: '3 options ideal for groups who value design and location.',
  experiencesDescription: 'Selected for enjoying in a group.',

  tips: [
    'The weather deceives: Querétaro is pleasantly warm by day but cools down sharply after sunset. A light jacket or blazer is essential for rooftop evenings.',
    'Group reservations: For groups of 4 or more, Querétaro fills up fast on weekends. Book dinners at least 4 days in advance — don\'t trust luck if you want a terrace table.',
    'Bedside water: The air in Querétaro is dry. Always keep a water bottle in your room to prevent that morning headache, especially after wine at the vineyards.',
  ],

  funFact: 'The iconic 74-arch Aqueduct was originally built for love, to carry water to a nun. Today it\'s the architectural backdrop for the best group photos in the city.',

  checklist: [
    '🧥 Light jacket or blazer (cool nights)',
    '👟 Comfortable shoes for cobblestones',
    '💵 Cash for gorditas and markets',
    '📷 Charged camera (the aqueduct demands a photo)',
    '🍷 Card for winery tastings',
    '💧 Reusable water bottle (dry air)',
    '🕶️ Sunglasses for vineyard day trips',
    '🎒 Small bag for evening bar hopping',
  ],

  transport: [
    {
      mode: 'Drive from Mexico City',
      description: 'About 3 hours via Highway 57. It\'s the main route, but often has stretches under repair. Leave early (7:00 AM) to avoid freight traffic.',
    },
    {
      mode: 'Bus',
      description: 'The most relaxed option. ETN or Primera Plus services from Taxqueña or the Norte terminal are luxury coaches with spacious seats — great for chatting or sleeping on the way.',
    },
    {
      mode: 'Getting around locally',
      description: 'Once in Querétaro, skip the car. The historic center is best on foot or by Uber. Local traffic can be heavy and parking is scarce.',
    },
  ],
}
