import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'pais-vasco',
  locale: 'en',

  hero: {
    title: 'Basque Country',
    subtitle: 'The region with more Michelin stars per square kilometer than anywhere else in the world. Four days designed for three couples who want to eat seriously, drink txakoli on the shore of the Cantabrian Sea, and discover that the difference between a pintxo and a tapa isn\'t just the toothpick holding it together — it\'s an entire philosophy.',
    eyebrow: 'Curated guide · 3 couples · Food, Wine & Relaxation · 4 days · Mid-range budget',
    tags: ['Couples', 'Food', 'Wine', 'Relaxation'],
    image: '/images/guides/pais-vasco.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and first round of pintxos',
      items: [
        {
          time: '14:00',
          title: 'Check-in',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Walk along La Concha and Monte Urgull',
          description: 'Arguably Europe\'s best urban beach, with a climb up Monte Urgull for bay views and a walk down to the Gros neighborhood for the first coffee on the Zurriola terrace.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'First round of pintxos in Parte Vieja',
          description: 'On your own — no tour, no list: Calle 31 de Agosto and Calle Fermín Calbetón have the highest density of bars per square meter in the city.',
          tags: [],
        },
        {
          time: '22:00',
          title: 'Optional formal dinner',
          description: 'Advance booking at Arzak or Mugaritz if the budget allows.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Pintxos tour + txakoli winery',
      items: [
        {
          time: '11:00',
          title: 'Private Pintxos Tour',
          description: '3 hours.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Rest at the hotel',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Departure for Getaria',
          description: 'Txakoli Winery Tour.',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Return and free dinner in Parte Vieja',
          description: 'The first night the group knows exactly what they\'re ordering and why, with newly acquired judgment.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Bilbao + Guggenheim',
      items: [
        {
          time: '09:00',
          title: 'Train to Bilbao',
          description: 'Early train, 1h15 journey.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Guggenheim Museum',
          description: 'Admission €13 EUR, book online. Frank Gehry\'s building, the most influential in architecture over the last 30 years.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Casco Viejo and Mercado de la Ribera',
          description: 'Europe\'s largest covered market.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Pintxos lunch in Casco Viejo',
          description: 'Bilbao\'s pintxos have their own style and deserve to be compared with San Sebastián\'s.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Return train to San Sebastián',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Market + cooking class + farewell',
      items: [
        {
          time: '09:30',
          title: 'Market Tour + Cooking Experience',
          description: '4 hours.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Lunch with what you cooked',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Free afternoon',
          description: 'One last stretch on La Concha, a final walk through Parte Vieja, shopping for canned anchovies and txakoli to take home.',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Farewell dinner',
          description: 'At the hotel restaurant or at one of the spots the group discovered during the trip.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel Arbaso',
      type: 'Boutique hotel · Parte Vieja',
      priceTier: '$$',
      description: 'Boutique hotel in a restored historic building steps from the Catedral del Buen Pastor and the pintxos district of Parte Vieja. The Narru restaurant, run by chef Iñigo Peña, holds a Michelin star and serves contemporary Basque cuisine — the hotel\'s best table, and you don\'t even have to leave the building. Free bicycles for exploring the city, and staff who know every pintxos bar in town by name and season. For the three couples who want to be at the center of Basque gastronomy without leaving the hotel. Estimated price: €180–320/night for a double room.',
      tag: 'Boutique in the pintxos heartland, with Narru (Michelin)',
      affiliateUrl: 'http://booking.com/hotel/es/arbaso.html',
      archetypes: ['Couples'],
    },
    {
      name: 'Lasala Plaza Hotel',
      type: 'Design hotel · Puerto Deportivo',
      priceTier: '$$',
      description: 'Contemporary design hotel facing the Puerto Deportivo marina and the Bahía de la Concha, with a rooftop bar and terrace overlooking the Cantabrian Sea and Monte Urgull. Perfectly located between Parte Vieja (a 5-minute walk) and Gros (the surf neighborhood). The in-house restaurant has access to the best local suppliers of txipirón and hake. For the couple in the group who wants ocean views with the same easy access to pintxos. Estimated price: €200–350/night for a double room.',
      tag: 'Ocean views facing the marina and La Concha',
      affiliateUrl: 'http://booking.com/hotel/es/plaza-lasala.html',
      archetypes: ['Couples'],
    },
    {
      name: 'Hotel de Londres y de Inglaterra',
      type: 'Historic hotel · La Concha',
      priceTier: '$$$',
      description: 'San Sebastián\'s grand historic hotel since 1863: Belle Époque balconies directly over Playa de la Concha, Europe\'s most photogenic bay right in front. Past guests have included Alfonso XIII, King Baudouin of Belgium, and Ava Gardner across different eras. Restaurante Negresco serves classic Basque cuisine, and the lobby bar has the city\'s best list of Rioja and Ribera del Duero wines. For the couple in the group who wants the most history on the Basque coast. Estimated price: €280–480/night for a double room.',
      tag: 'Belle Époque balconies over La Concha since 1863',
      affiliateUrl: 'https://www.booking.com/hotel/es/londresinglaterra.html',
      archetypes: ['Couples'],
    },
  ],

  hotelsDescription: 'San Sebastián as home base.',

  experiences: [
    {
      name: 'Private Pintxos Tour in Parte Vieja',
      description: 'San Sebastián\'s best-rated pintxos tour: a local guide with a curated selection of six bars in Parte Vieja, txakoli and Asturian cider pairings at every stop, and context on the culture of the Basque bar — the unwritten rules of pintxos, the difference between cold and hot pintxos bars, and why you eat standing up. For the three couples who want the right introduction before exploring on their own. 3 hours, groups of up to 8 people. Available in English and Spanish.',
      tags: ['Pintxos', 'Pairing', 'Small group'],
      affiliateUrl: 'https://www.getyourguide.com/en-gb/san-sebastian-l94/san-sebastian-food-tour-pintxo-tasting-wines-t110908/',
    },
    {
      name: 'Txakoli Winery Tour in Getaria',
      description: 'Getaria is 20 km west of San Sebastián — the fishing village where Juan Sebastián Elcano was born and where txakoli grows, the naturally sparkling white wine that is the Basque Country\'s signature wine. The tour includes a visit to a working family winery, a walk through the vineyards above the Cantabrian Sea, and a tasting of four txakolis with local anchovy pintxos. Half-day, transport from San Sebastián included.',
      tags: ['Wine', 'Vineyards', 'Getaria'],
      affiliateUrl: 'https://www.getyourguide.com/en-gb/san-sebastian-l94/discover-the-essence-of-txakoli-wine-from-san-sebastian-t110959/',
    },
    {
      name: 'San Sebastián Market Tour + Cooking Experience',
      description: 'The Mercado de La Bretxa in the heart of Parte Vieja has the best products from the Cantabrian coast: fresh anchovy from Bermeo, seasonal txipirón, mushrooms from Navarra, and Idiazabal cheese. The tour combines a morning walk through the market with the chef who buys the ingredients and a 2-hour Basque cooking class (bacalao al pil-pil or hake in green sauce). For the group that wants to understand Basque cuisine before sitting down to eat it.',
      tags: ['Market', 'Cooking class', 'Basque cuisine'],
      affiliateUrl: 'https://www.getyourguide.com/en-gb/san-sebastian-l94/san-sebastian-market-tour-and-basque-cooking-class-english-t980847/',
    },
  ],

  experiencesDescription: 'Pintxos, txakoli, and the Mercado de La Bretxa.',

  tips: [
    'Pintxo hour: Pintxos are eaten between 12:00 and 14:00 (vermouth hour) and between 19:00 and 21:00 (the hour before dinner). By 22:00 the best pintxos are already gone at most bars. The group that arrives at 7:30pm gets the full bar and the freshest product.',
    'The bar system: At the best bars in Parte Vieja, pintxos sit on the bar and you take them directly — it\'s counted up when you pay. Some newer bars have a menu instead. The difference between a serious pintxos bar and a touristy one: the locals\' bar is packed at 7:45pm and empty by 9pm. The touristy one is packed at 9pm.',
    'Txakoli is poured from a height: Txakoli is poured from 30–40 cm up to aerate the wine and create its natural sparkle. If the bartender doesn\'t do this, it\'s not a serious txakoli bar. If they do, the first glass becomes a small spectacle.',
  ],

  funFact: 'The Basque language — Euskera — is the only language in Western Europe with no known genetic relationship to any other language in the world. It isn\'t Indo-European, isn\'t Semitic, and doesn\'t derive from Latin or Arabic. Linguists have been debating its origin for 200 years with no consensus. The Basques call it "the mother tongue" — hitzezko erroa, the root of words — and it\'s spoken by 750,000 people across Spain and France as a first or second language.',

  checklist: [
    '👟 Comfortable shoes for walking the city and climbing Monte Urgull',
    '💵 Cash for the pintxos bars',
    '🩱 Swimsuit for La Concha',
    '🧴 Sunscreen for the clear-sky days',
    '📅 Restaurant and hotel reservations booked weeks ahead',
    '👗 Something dressy for dinner at Arzak or Mugaritz',
    '🎟️ Online ticket booked for the Guggenheim',
    '🚲 Comfortable clothes to make use of the hotel\'s free bikes',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'San Sebastián Airport (EAS), 20 km from downtown — domestic flights from Madrid and Barcelona. Better-connected alternative: Bilbao Airport (BIO), 100 km from San Sebastián (1 hour 15 minutes by ALSA bus, €12 EUR; direct flights from Madrid, Barcelona, London, Paris, and Amsterdam). Flying from Mexico or Latin America: connect through Madrid (Iberia) or through London or Paris.',
    },
    {
      mode: 'Local transport',
      description: 'San Sebastián on foot and by bike for all four days (the entire city fits within a 3 km radius). For the Bilbao day trip: Euskotren train from Amara station (1h 15min, €5 EUR) or ALSA bus. For the Getaria winery: transport is included in the tour.',
    },
    {
      mode: 'Weather in July',
      description: 'Days of 22–26°C, clear skies, and the Cantabrian Sea at 21°C. July is the busiest month in the city — book restaurants and hotels weeks in advance. The rain that characterizes the Basque Country the rest of the year practically disappears in July.',
    },
  ],
}
