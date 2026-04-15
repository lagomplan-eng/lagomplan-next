import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'ciudad-de-mexico',
  locale: 'en',

  hero: {
    title: 'Mexico City',
    subtitle: 'A metropolis that breathes creativity at every corner. The perfect pulse between world-class museums and one of the most exciting dining scenes on the planet.',
    eyebrow: 'Curated guide · Couples',
    tags: ['Couple', 'Art', 'Gastronomy', 'Culture'],
    image: '/images/guides/guides-headers/Bellas%20Artes.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'The cultural axis',
      items: [
        {
          time: '11:00 AM',
          title: 'National Museum of Anthropology',
          description: 'Focus only on the Mexica room to avoid being overwhelmed.',
          tags: [],
        },
        {
          time: '2:30 PM',
          title: 'Lunch at Contramar',
          description: 'The charcoal octopus is a must.',
          tags: [],
        },
        {
          time: '5:00 PM',
          title: 'Walk through Chapultepec Forest',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Historic Center and murals',
      items: [
        {
          time: '10:00 AM',
          title: 'Palacio de Bellas Artes and murals at the National Palace',
          description: '',
          tags: [],
        },
        {
          time: '1:00 PM',
          title: 'Basket tacos "Los Especiales"',
          description: 'The most authentic quick snack in the Centro.',
          tags: [],
        },
        {
          time: '7:00 PM',
          title: 'Dinner at Lorea or Merotoro in La Condesa',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Design and farewell',
      items: [
        {
          time: '11:00 AM',
          title: 'Visit to Casa Barragán or Museo Soumaya / Jumex',
          description: '',
          tags: [],
        },
        {
          time: '2:00 PM',
          title: 'Long brunch at Panadería Rosetta',
          description: '',
          tags: [],
        },
        {
          time: '4:00 PM',
          title: 'Last design shopping at Lago DF and departure to airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'The Ritz-Carlton, Mexico City',
      type: 'Hotel · Paseo de la Reforma',
      priceTier: '$$$',
      description: 'Luxury in the sky. Located on the upper floors of a Reforma skyscraper, it offers the most romantic views of Chapultepec Castle from your bed.',
      tag: 'Luxury in the clouds',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/2oeHmjK31f?aid=lagomplan&campaign=lagomplan-ciudaddemexicoartemesa&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Mexico+City%2C+CDMX%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fciudad-de-mexico-arte-mesa',
    },
    {
      name: 'Brick Hotel',
      type: 'Boutique hotel · Roma Norte',
      priceTier: '$$',
      description: 'A gem in Roma Norte. Combines an early 20th-century façade with a modern, minimalist interior. The ideal starting point for exploring galleries on foot.',
      tag: 'Modern Heritage',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/4GOkOu55mT?aid=lagomplan&campaign=lagomplan-ciudaddemexicoartemesa&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Mexico+City%2C+CDMX%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fciudad-de-mexico-arte-mesa',
    },
    {
      name: 'Casa Cuenca',
      type: 'Boutique hotel · Roma',
      priceTier: '$$',
      description: 'A contemporary retreat that prioritizes rest and strategic location. Rooms designed for comfortable longer stays, complemented by a romantic restaurant.',
      tag: 'Unbeatable location and comfort',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/UifOIGl3dG?aid=lagomplan&campaign=lagomplan-ciudaddemexicoartemesa&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Mexico+City%2C+CDMX%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fciudad-de-mexico-arte-mesa',
    },
  ],

  experiences: [
    {
      name: 'Casa Luis Barragán',
      description: 'Essential to book months in advance. A lesson in light, color, and silence — the most intimate architectural experience you can have as a couple.',
      tags: ['Book months in advance'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/YC8OoqqWnR',
    },
    {
      name: 'Gallery route in La San Rafael',
      description: 'Leave Roma and explore the San Rafael neighborhood. Visit galleries like Hilario Galguera or Eco — high-level contemporary art without the crowds.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Dinner at a chef\'s counter',
      description: 'Look for places like Expendio de Maíz or the counter at Máximo. Watching the chefs\' precision just inches away while sharing a natural wine is the epitome of relaxed luxury.',
      tags: [],
      affiliateUrl: 'https://www.opentable.com/',
    },
  ],

  hotelsDescription: 'Three options to experience the city through its architecture.',

  tips: [
    "The bar-for-two hack: If you couldn't get a reservation at the top Roma spots, arrive at opening time and ask for bar seating. They almost always save a couple of seats for walk-in couples.",
    'Altitude and mezcal: Mexico City sits above 2,200 meters. Alcohol hits twice as hard here. The golden rule: one glass of water for every mezcal to avoid a headache that ruins the next day\'s art plans.',
    "The Sunday secret: Most museums fill up on Sundays. For peace, save museums for Friday or Saturday and use Sunday for the cycling parade on Reforma — they close the avenue to cars and it's glorious.",
  ],

  funFact: 'Mexico City is the second city in the world with the most museums (after London). It has over 150 cultural spaces — you could visit a different one every week for three years and still not finish.',

  checklist: [
    '👟 Comfortable walking shoes for long days',
    '🧥 Light jacket (the city gets cool in the afternoon)',
    '🎒 Anti-theft crossbody bag',
    '💊 Altitude sickness medicine (2,240 m elevation)',
    '💵 Cash for markets and basket tacos',
    '🔋 Power bank and adapters',
    '🌂 Small umbrella (rainy season: Jun–Oct)',
    '📷 Extra memory card',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Arrival at AICM (more central) or AIFA.',
    },
    {
      mode: 'Airport transfer',
      description: 'Uber and Didi work great. If arriving at AICM, walk to the authorized app pickup zones; faster and cheaper than the official taxi.',
    },
    {
      mode: 'Getting around the city',
      description: "Don't rent a car. Mexico City is the traffic capital. Use Uber for longer distances and EcoBici to move between Roma, Condesa, and Reforma — fast and efficient.",
    },
  ],
}
