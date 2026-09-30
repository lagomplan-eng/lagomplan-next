import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'roma',
  locale: 'en',

  hero: {
    title: 'Rome',
    subtitle: "October is the month Rome keeps for itself. Summer's heat and four-hour lines are gone, and the city gets its human scale back. For the couple who wants to eat well, walk slowly, and end every night at a Trastevere trattoria with no reservation needed.",
    eyebrow: 'Curated guide · Couple · Food & relaxation · 5 days · Mid-range budget',
    tags: ['Couple', 'Food', 'Relaxation', 'History'],
    image: '/images/guides/roma.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and first night in Trastevere',
      items: [
        {
          time: '15:00',
          title: 'Arrival and check-in',
          description: 'Leonardo Express to Termini, then a taxi or Bolt to the hotel. The first afternoon has no agenda.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'First walk through Trastevere',
          description: 'A stroll at the neighborhood\'s own pace.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Aperitivo at Piazza di Santa Maria',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Dinner at a local trattoria (Da Enzo al 29 or Tonnarello)',
          description: 'Somewhere with no English menu visible on the front.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: "Campo de' Fiori and a pasta class",
      items: [
        {
          time: '08:30',
          title: "Campo de' Fiori market",
          description: "Rome's most photogenic market — and its most touristy — but at 8:30am it's still vegetables and local shoppers.",
          tags: [],
        },
        {
          time: '10:30',
          title: 'Coffee in Monti (Antico Caffè del Moro)',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at a Monti enoteca',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Pasta-making class in Trastevere with a food tour',
          description: 'At sunset.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Back to the hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'The Vatican and Prati',
      items: [
        {
          time: '09:00',
          title: 'Vatican Museums (booked online in advance)',
          description: 'Priority-access online tickets are essential.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Lunch in Prati',
          description: "The neighborhood next to the Vatican has Rome's best tiramisù (Il Sorpasso) and the best pizza al taglio in the north-center.",
          tags: [],
        },
        {
          time: '14:30',
          title: "Walk past Castel Sant'Angelo and along the Tiber",
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Aperitivo at a Prati bar',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: "Trastevere night food tour with wine tasting (if not done on day 2)",
          description: 'Four hours at dusk with a local guide who knows exactly which trattoria makes the real carbonara.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Colosseum, Roman Forum, and Testaccio',
      items: [
        {
          time: '09:00',
          title: 'Colosseum (booked online, priority access)',
          description: "Rome's oldest side.",
          tags: [],
        },
        {
          time: '11:00',
          title: 'Roman Forum and Palatine Hill',
          description: 'An archaeological complex that fills the whole morning with no guide needed.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Testaccio Market',
          description: "The city center's best Roman food stalls at market, not restaurant, prices.",
          tags: [],
        },
        {
          time: '15:30',
          title: 'Pasta class near the Colosseum (if not done earlier)',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner in Testaccio',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'A soft goodbye through the Castelli Romani',
      items: [
        {
          time: '09:30',
          title: 'Train from Termini to Frascati',
          description: '30 minutes, €2.10.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'The town of Frascati or Castel Gandolfo',
          description: 'The popes\' summer residence.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'A long lunch with Frascati DOC',
          description: 'The most Lagom plan of the five days: nothing scheduled after dessert. 30 km southeast of Rome, the Castelli Romani have Lazio\'s freshest white wines and views of the Albano volcano.',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Back to Rome',
          description: '',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Last-minute shopping in Monti',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Transfer to the airport',
          description: 'Timed to your flight.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Casa Monti Roma',
      type: 'Boutique hotel · Monti',
      priceTier: '$$$',
      description: "The highest-rated boutique hotel for couples in the whole historic center (9.8/10 on Booking). Opened in 2024 in a house in Rome's most bohemian neighborhood, with its own signature Italian restaurant, bar, jacuzzi, and a terrace overlooking Trajan's Forum. Monti has the highest concentration of wine bars, independent design shops, and menu-free trattorias in the city. The Colosseum is an eight-minute walk; Cavour metro station, three.",
      tag: "Couples' favorite in the historic center",
      affiliateUrl: 'https://www.booking.com/hotel/it/casa-monti-roma-roma.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'Trastevere Luxury Rooms',
      type: 'Hotel · Trastevere',
      priceTier: '$$$',
      description: "In Rome's most photogenic neighborhood, steps from Piazza di Santa Maria in Trastevere. Continental buffet breakfast with vegan and gluten-free options, welcome beer and wine in the room, minibar included, and exceptionally friendly staff. For the couple who wants to wake up in Trastevere before the day's tourists arrive.",
      tag: 'Wake up in Trastevere before anyone else',
      affiliateUrl: 'https://www.booking.com/hotel/it/trastevere-luxury-rooms.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'Condominio Monti Boutique Hotel',
      type: 'Hotel · Monti',
      priceTier: '$$',
      description: "A rooftop garden with panoramic views over Rome's rooftops, buffet breakfast with fruit and croissants. A five-minute walk from the Colosseum, one metro stop from Termini. Rooms are functional and spacious, the vibe is old-school neighborhood hotel, and the rooftop aperitivo bar is, by reviews, the best terrace in the center.",
      tag: 'Monti without the design-hotel price tag',
      affiliateUrl: 'https://www.booking.com/hotel/it/hotelapolloroma.html',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'Three options split between Monti and Trastevere — the two neighborhoods worth staying in.',

  experiences: [
    {
      name: 'Pasta class in Trastevere',
      description: 'Three hours through the Trastevere alleys with stops at the San Cosimato market (where Romans do their own shopping every morning), followed by a fresh pasta class at Rione XIII trattoria with unlimited wine included. You\'ll learn to make fettuccine and ravioli from scratch. Porchetta and artisanal gelato tastings included.',
      tags: ['Food', 'Class', 'Trastevere'],
      affiliateUrl: 'https://www.getyourguide.com/rome-l33/rome-trastevere-street-food-tour-t261067/',
    },
    {
      name: 'Exclusive Colosseum tour with arena underground access',
      description: 'Access to the Colosseum\'s restricted areas: the underground tunnels where gladiators and animals waited before entering the arena, and the arena floor itself. Includes the Roman Forum and Palatine Hill. The most different thing you can do at the Colosseum compared to a standard ticket.',
      tags: ['History', 'Colosseum', 'Exclusive access'],
      affiliateUrl: 'https://www.getyourguide.com/rome-l33/rome-exclusive-colosseum-underground-and-arena-guided-tour-t431012/',
    },
    {
      name: 'Trastevere night food tour with wine tasting',
      description: 'Four hours at dusk through the streets of Trastevere with a local guide who knows exactly which trattoria has the real carbonara and which cellar to go down into for the local wine. Roman pizza, pasta, porchetta, gelato, and wine in a 150-year-old cellar included.',
      tags: ['Food', 'Wine', 'Night'],
      affiliateUrl: 'https://www.getyourguide.com/rome-l33/rome-4-hour-twilight-trastevere-food-tour-t252097/',
    },
  ],

  tips: [
    'The real carbonara: egg, guanciale (cured pork jowl, not pancetta), pecorino romano, and black pepper. No cream, no onion, no garlic. The best: Roscioli (historic center, reservation needed), Da Enzo al 29 (Trastevere), Osteria dell\'Angelo (Prati).',
    "Rome's drinking water: the nasoni (cast-iron public fountains) run on spring water from the Acqua Vergine aqueduct, in service since 19 BC. Don't buy plastic water bottles in Rome.",
    'Skip the terraces around the Pantheon: bars and restaurants immediately around the Pantheon and the Trevi Fountain charge prices with no culinary justification. Walk two streets in any direction and the same coffee costs half as much and is better made.',
  ],

  funFact: "Rome has more public fountains than any other city in the world. Parts of the city's aqueduct system are over 2,000 years old and still operating. The Acqua Vergine aqueduct, which feeds the Trevi Fountain, was built in 19 BC by Marcus Agrippa to supply water to the Baths of Agrippa.",

  checklist: [
    '👟 Comfortable shoes for cobblestones',
    '🧥 Light jacket for the evenings (11-15°C)',
    '☔ Compact rain jacket — some rain possible in October',
    '📱 Pre-booked online tickets for the Colosseum and the Vatican',
    '💶 Euros in cash for markets and small trattorias',
    "🍝 An appetite — there's a lot to eat",
  ],

  transport: [
    {
      mode: 'Flight',
      description: "Leonardo da Vinci International Airport (FCO, Fiumicino), 32 km from the center. The Leonardo Express runs direct to Roma Termini every 30 minutes: 32 minutes, €14. Cheaper alternative: Ciampino (CIA), 15 km out, with a Terravision or SIT Bus Shuttle to Termini (~50 min, €6). Direct flights from Madrid, Barcelona, Mexico City (with a connection), and most European capitals.",
    },
    {
      mode: 'Getting around Rome',
      description: "The historic center is walkable; Trastevere, Monti, the Pantheon, Campo de' Fiori, and the Vatican are all connected on foot. The Metro has two lines (A and B) useful for reaching the far ends of the city. Bolt works well and is cheaper than the yellow street taxis. For the Vatican and Colosseum in October: book tickets online before you arrive.",
    },
    {
      mode: 'Weather',
      description: "In October: 17-22°C by day, 11-15°C at night. Some rain is possible — bring a light jacket and a compact rain jacket. October light in Rome has a quality photographers specifically chase: the low sun angle over the travertine buildings at sunset.",
    },
  ],
}
