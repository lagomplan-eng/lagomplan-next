import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'marrakech',
  locale: 'en',

  hero: {
    title: 'Marrakech, Morocco',
    subtitle: 'September is the exact window: temperatures drop from summer\'s 40°C to a more livable 28–32°C, Europeans are back at work, and the Medina regains the human scale that July and August strip away. For the woman traveling solo for the first time in an Arab destination: Marrakech is safer than most prior fears suggest, and more transformative than any guide can anticipate.',
    eyebrow: 'Curated guide · Solo woman · Spiritual retreat, ceramics and ancestral gastronomy · 10 days · High budget',
    tags: ['Solo', 'Culture', 'Craft', 'Wellness'],
    image: '/images/guides/marrakech.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and first night in the Medina',
      items: [
        {
          time: '14:00',
          title: 'Arrival at RAK airport',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Check-in at Maïpa Boutique Riad',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'First mint tea in the courtyard',
          description: 'The first afternoon isn\'t for the souk — it\'s for sitting in the riad\'s courtyard and listening to the city through the walls',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at the riad or a restaurant in the derb',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Jemaa el-Fna and the souk',
      items: [
        {
          time: '09:30',
          title: 'Morning walk through the Spice Souk',
          description: 'Rahba Kedima, the spice heart of the Medina',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Tanneries and leather workshops',
          description: 'Souk des Teinturiers',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at the riad',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Rest',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Jemaa el-Fna at sunset',
          description: 'When the snake charmers and storytellers turn the square into Marrakech\'s oldest show',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Hammam and pottery workshop',
      items: [
        {
          time: '09:00',
          title: 'Hammam (book ahead)',
          description: 'At the riad, or at Hammam El Bacha in Souk Semmarine — the most authentic option available to tourists',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Light lunch at the riad',
          description: '',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Pottery workshop in the Medina',
          description: 'With the artisan Tariq, right in front of Jemaa el-Fna Square',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Back to the riad to rest',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Jardin Majorelle and museums',
      items: [
        {
          time: '09:00',
          title: 'Jardin Majorelle',
          description: 'Entry: 150 MAD, book online. Designed by Jacques Majorelle in 1923, rescued by Yves Saint Laurent and Pierre Bergé in 1980',
          tags: [],
        },
        {
          time: '11:30',
          title: 'YSL Museum',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch in the Guéliz district',
          description: 'Modern Marrakech, a 20-minute walk from the garden',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Bahia Palace',
          description: '19th-century palace with 150 rooms decorated in stucco and zellige',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Back to the Medina',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Atelier Lamsaty pottery workshop',
      items: [
        {
          time: '10:00',
          title: 'Atelier Lamsaty workshop',
          description: 'The trip\'s second pottery workshop: different technique, different artisan, different context',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch in the souk',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Carpet Souk and Babouche Souk',
          description: 'The most colorful corner of the Medina',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Tea on a café terrace overlooking the Medina',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Excursion to the Ourika Valley and the Atlas',
      items: [
        {
          time: '08:30',
          title: 'Departure for the Ourika Valley by private taxi',
          description: 'Negotiate the fare, ~400–600 MAD. The route crosses Berber villages, rural markets, and palm groves before climbing into the Atlas meadows',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Arrival at Ferme Sidi Safou',
          description: 'Cooking class, pottery, and mosaic in a countryside sanctuary of olive trees, pomegranates, and aromatic herbs',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Return to Marrakech via the scenic Atlas route',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Aït Benhaddou (day trip)',
      items: [
        {
          time: '07:30',
          title: 'Departure by private taxi or organized tour',
          description: '~800–1,200 MAD. 3 hours from Marrakech',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Arrival and visit to the ksar',
          description: 'UNESCO World Heritage site and the most used backdrop in Moroccan film history: Gladiator, Lawrence of Arabia, Game of Thrones',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch in the village of Aït Benhaddou',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Return to Marrakech',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 8,
      title: 'Free day · The Mellah and slower souks',
      items: [
        {
          time: '10:00',
          title: 'The Mellah',
          description: 'The Medina\'s historic Jewish quarter',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Unhurried lunch',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Souk shopping, without the first day\'s pace',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 9,
      title: 'Free day · Repeat what won you over',
      items: [
        {
          time: '10:00',
          title: 'A second round of hammam or pottery',
          description: 'Whatever the trip made you want to do again',
          tags: [],
        },
        {
          time: '14:00',
          title: 'A courtyard afternoon',
          description: 'Reading at the riad, no itinerary',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner somewhere already familiar',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 10,
      title: 'Farewell',
      items: [
        {
          time: '09:00',
          title: 'One last breakfast made by the owner',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Last-minute shopping at the Spice Souk',
          description: 'Saffron, ras el hanout, rose water',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Taxi to the airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Maïpa Boutique Riad',
      type: 'Boutique riad · Medina',
      priceTier: '$$$',
      description: 'A miniature palace of cedar wood and Fez brick, a few minutes\' walk from Jemaa el-Fna, tucked into a quiet derb well outside the mass-tourism circuit. Five suites decorated in traditional zellige and Moroccan stucco, a solarium with a tiled jacuzzi, and views of the Koutoubia and Mulay Idriss Palace from the terrace. The owner cooks breakfast himself: bread baked that morning, rose jam, Berber eggs. Estimated price: €150–280/night.',
      tag: 'A miniature palace minutes from Jemaa el-Fna',
      affiliateUrl: 'https://www.booking.com/hotel/ma/riad-maa-pa.html',
      archetypes: [],
    },
    {
      name: 'Riad Mint — Luxury Oasis in the Medina',
      type: 'Luxury riad · Mouassine, Medina',
      priceTier: '$$$',
      description: 'In Mouassine, the Medina\'s most elegant and least crowded neighborhood, steps from Le Jardin Secret and an eight-minute walk from Jemaa el-Fna. A private pool in the courtyard, a terrace with views of the Koutoubia, the Two Brothers (Atlas peaks), and the courtyard of Mulay Idriss Palace. Surrounded by art galleries, design boutiques, and the Medina\'s best restaurants. For the trip\'s most elegant night: Mouassine at 10pm has the quiet of a residential neighborhood and the polish of a destination that hasn\'t made it onto every map yet. Estimated price: €180–350/night.',
      tag: 'A private pool in the Medina\'s most elegant corner',
      affiliateUrl: 'https://www.booking.com/hotel/ma/riad-mint-marrakech-exclusive-boutique-riad-in-the-heart-of-the-medina.html',
      archetypes: [],
    },
    {
      name: 'Riad Anya & SPA',
      type: 'Riad with spa · Medina',
      priceTier: '$$$',
      description: 'A ten-minute walk from the main souk and Jemaa el-Fna Square, with its own spa and hammam available to riad guests. Reviews consistently single out the staff and the spa as the property\'s two standout features. For the days built around hammam and argan massage after walking the Medina: having the spa inside the riad itself removes the logistics and adds privacy. Estimated price: €130–240/night.',
      tag: 'Its own spa and hammam, no need to leave the riad',
      affiliateUrl: 'https://www.booking.com/hotel/ma/riad-anya.html',
      archetypes: [],
    },
  ],

  hotelsDescription: 'Riads with a history of their own, in the heart of the Medina.',

  experiences: [
    {
      name: 'Pottery Workshop in Marrakech',
      description: 'Marrakech\'s most recommended workshop for learning the two core techniques of Moroccan pottery: the traditional potter\'s wheel and hand-molding. The artisan Tariq — named by title in dozens of reviews — has run his workshop facing Jemaa el-Fna Square for 30 years, working through his translator Khaoula, who turns every instruction into a short lesson on the history of Moroccan craft. Includes clay preparation, firing and glazing, and the requisite mint tea between pieces. For the solo woman traveling with the intention to learn something: this is the most recommended workshop available.',
      tags: ['Pottery', 'Tariq', 'Half day'],
      affiliateUrl: 'https://www.getyourguide.com/marrakesh-l208/pottery-workshop-t157266/',
    },
    {
      name: 'Pottery Workshop with Moroccan Tea — Atelier Lamsaty',
      description: 'The atelier of a certified craftswoman specializing in the two molding techniques most practiced in the workshops of Fez and Marrakech. The class includes a break for Moroccan tea with pastries made on-site — the only moment of the day when clay-covered hands and sugar in your tea coexist without contradiction. For the woman who wants the more intimate workshop: Lamsaty works with small groups.',
      tags: ['Pottery', 'Moroccan tea', 'Small groups'],
      affiliateUrl: 'https://www.getyourguide.com/marrakesh-l208/marrakech-pottery-workshop-with-moroccan-tea-t422038/',
    },
    {
      name: 'Sidi Safou Experience: Cooking, Pottery and Mosaic',
      description: 'The sanctuary of Ferme Sidi Safou, 20 minutes from Marrakech, combines a traditional Moroccan cooking class, a pottery workshop, and a mosaic workshop into one full day, with lunch prepared on-site. The countryside setting — olive trees, pomegranates, aromatic herbs — makes this the day furthest from the Medina\'s tourist circuit, and the closest to the crafts the whole trip is built around.',
      tags: ['Farm', 'Cooking', 'Full day'],
      affiliateUrl: 'https://www.getyourguide.com/marrakech-l208/experience-cooking-peotry-mosaic-class-spa-t462755/',
    },
  ],

  experiencesDescription: 'Hands in the clay, and the flavor of the Atlas.',

  tips: [
    'The dirham (MAD): 1 EUR ≈ 10–11 MAD. Upscale riads and restaurants take cards; markets, transport, and souk artisans are cash-in-dirhams only. Currency exchange is available at the airport and any bank downtown.',
    'Haggling: in the souk, the opening price on anything is 3 to 5 times its real value. Haggling isn\'t optional — it\'s the protocol. Never accept the first price. If a seller accepts your first offer without pushback, you offered too much. General rule: open at 30–40% of the asking price and settle somewhere between 50 and 60%.',
    'Ras el hanout: Morocco\'s most complex spice blend — anywhere from 20 to 35 spices depending on the vendor — is the most useful souvenir you can bring home from Marrakech. The Spice Souk in Rahba Kedima has the neighborhood\'s best vendors. Buy it in sealed pouches, not cardboard souvenir tins.',
  ],

  funFact: 'The name Marrakech comes from the Berber mur n\'akush, meaning "land of God." The city was founded in 1062 by the Almoravids, the Berber dynasty that also built the Koutoubia and part of the Great Mosque of Seville in Spain. The blue popularly associated with Morocco isn\'t from Marrakech — it\'s from Chefchaouen, in the north of the country. Marrakech is the pink city: the color of the local stone, imposed as urban law by the authorities in the 20th century.',

  checklist: [
    '🧣 A light scarf to cover your shoulders in palaces and religious spaces',
    '👡 Comfortable sandals or walking shoes for the Medina\'s cobblestones',
    '💵 Cash in dirhams for the souk, artisans, and haggling',
    '👗 Loose clothing that covers shoulders and knees for walking the Medina',
    '🧴 Sunscreen and water — September midday sun still hits hard',
    '🩱 A swimsuit for the hammam and riad pools',
    '📍 The riad\'s address saved on your phone and on paper — the alleys don\'t always have signal',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Marrakech Menara International Airport (RAK), 6 km from the city center. Direct flights from Madrid, Barcelona, Paris, London, Amsterdam, and several other European cities. From Mexico: connect via Madrid (Iberia, 2 hours + 3.5 hours) or Paris (Air France, 12 hours + 3.5 hours). Official airport taxi to the Medina: 70–100 MAD (€6–9 EUR).',
      tip: 'Don\'t take a taxi from outside the airport without negotiating the price first.',
    },
    {
      mode: 'Getting around Marrakech',
      description: 'The Medina has no car traffic on most of its streets — everything is on foot or by bicycle. Riads inside the Medina sit in alleys taxis can\'t reach: the driver stops at the entrance to the derb, and from there you walk in with your bag. For excursions into the Atlas: private taxi, organized tour, or a day driver ($30–60 EUR per excursion).',
    },
    {
      mode: 'Safety for solo women',
      description: 'Marrakech has a reputation as a difficult destination for women traveling alone — partly earned, partly overstated. The Medina is safe by day; at night, the main alleys are well lit. Jemaa el-Fna Square at night is lively and requires no more caution than any European plaza. Unsolicited "guides" at the souk entrance (faux guides) are handled by being direct and walking with purpose. The riad solves the part that matters most: a locked door on the other side of which the outside world doesn\'t come in.',
    },
  ],
}
