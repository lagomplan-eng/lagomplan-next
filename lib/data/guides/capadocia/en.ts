import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'capadocia',
  locale: 'en',

  hero: {
    title: 'Cappadocia, Turkey',
    subtitle: 'The landscape that looks AI-generated has sat in the same place for 60 million years: fairy chimneys are Turkey\'s most photographed backdrop. September brings 26–28°C days, clear skies, and the year\'s best balloon-flight odds, 85–90%, because the autumn wind hasn\'t arrived yet and the summer rains are already gone.',
    eyebrow: 'Curated guide · Group of friends · 6 days · Mid-range budget',
    tags: ['Friends', 'Balloon', 'Landscape'],
    image: '/images/guides/capadocia.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and first night in Göreme',
      items: [
        {
          time: '14:00',
          title: 'Airport arrival and transfer to the hotel',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Walk through central Göreme',
          description: '',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Göreme Open Air Museum',
          description: 'Closes at 7:30pm in September, entry: $15 USD. A 1.5 km walk from the center',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner on a terrace with valley views',
          description: 'Pick any restaurant on the main street',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Sunrise balloon flight',
      items: [
        {
          time: '05:30',
          title: 'Hotel pickup for the balloon flight',
          description: 'The single most important plan of the trip — pickup time shifts between 5:00 and 6:30am depending on sunrise',
          tags: [],
        },
        {
          time: '07:00–08:00',
          title: 'Sunrise flight over Cappadocia',
          description: '',
          tags: [],
        },
        {
          time: '08:30',
          title: 'Champagne toast and flight certificate',
          description: '',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Return to the hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Late breakfast',
          description: '',
          tags: [],
        },
        {
          time: 'Afternoon',
          title: 'Free afternoon to recover',
          description: 'Pool (if the hotel has one), reading',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Valley tour and the underground cities',
      items: [
        {
          time: '09:00',
          title: 'Departure for Paşabağ (Monks Valley)',
          description: 'By private taxi or tour',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Red Valley',
          description: '2-hour hike from Çavuşin, easy level',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch on the way',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Derinkuyu Underground City',
          description: 'Entry: $8 USD. Dug 85 meters deep with capacity for 20,000 people, used as a refuge by early Christians',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Return to Göreme',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner with the group',
          description: 'The longest night of the trip',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Uchisar, Avanos, and pottery',
      items: [
        {
          time: '09:30',
          title: 'Drive to Uchisar',
          description: '15 minutes',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Uchisar Castle and panoramic views',
          description: 'The highest point in Cappadocia, with 360-degree views over every valley',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Drive to Avanos',
          description: '20 minutes',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Lunch in Avanos',
          description: 'On the banks of the Kızılırmak River',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Red clay pottery workshop in Avanos',
          description: 'The river clay pottery here has 3,000 years of unbroken history. Workshops let you throw your own piece',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Return to Göreme',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Whirling Dervishes ceremony',
          description: 'Saruhan Theater, Avanos — book ahead',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Free day: ATV, hiking, or doing nothing',
      items: [
        {
          time: 'Morning',
          title: 'ATV through Pigeon Valley or Love Valley',
          description: 'Or a free hike from central Göreme at sunrise, before the tour groups arrive',
          tags: [],
        },
        {
          time: 'Alternative',
          title: 'A full morning on the hotel terrace',
          description: 'Turkish coffee with the balloon parade in the background',
          tags: [],
        },
        {
          time: 'Evening',
          title: 'The group\'s last dinner',
          description: 'At Göreme\'s most serious restaurant',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Departure',
      items: [
        {
          time: '',
          title: 'Breakfast and transfer to the airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Cappadocia Cave Lodge',
      type: 'Cave hotel · Göreme',
      priceTier: '$$$',
      description: 'Göreme\'s highest-rated cave hotel: a 9.6-out-of-10 on Booking and 9.7 for location. Rooms carved into volcanic rock with a fireplace, minibar, and private terrace overlooking the fairy chimneys. The hotel rooftop has a clear view of the balloons taking off at sunrise — day one\'s plan is solved without leaving the property. For the friend group that wants the correct hotel: Cave Lodge is Göreme\'s benchmark. Estimated price: €120–220/night.',
      tag: 'Göreme\'s objective benchmark',
      affiliateUrl: 'https://www.booking.com/hotel/tr/cappadocia-cave-lodge.html',
      archetypes: [],
    },
    {
      name: 'Cappadocia Cave Suites',
      type: 'Cave suites · Göreme',
      priceTier: '$$$',
      description: 'Luxury rooms and suites in genuine caves, warmly designed and centrally located in Göreme. The Sunset Café terrace serves drinks and snacks with valley views all day, and the Historia restaurant serves local food in a relaxed setting. Balloon tours, whirling dervish shows, and horseback rides are organized by the hotel. For the group that wants to be in the middle of town without giving up the cave character. Estimated price: €110–200/night.',
      tag: 'Central Göreme, without giving up the cave character',
      affiliateUrl: 'https://www.booking.com/hotel/tr/cappadocia-cave-suites.html',
      archetypes: [],
    },
    {
      name: 'Grand Cave Suites',
      type: 'Cave hotel · Göreme',
      priceTier: '$$$',
      description: 'Built into the rock inside a stone building renovated in 2013, with Göreme views from every room\'s terrace. Genuine cave rooms with arched stone walls, a jacuzzi tub in some suites, and a 9.6 couples rating on Booking. For the group chasing the trip\'s most dramatic photos: Grand Cave Suites\' terraces at sunset, with balloons on the horizon, are Cappadocia\'s reference image. Estimated price: €100–180/night.',
      tag: 'The best sunset balloon view from the terrace',
      affiliateUrl: 'https://www.booking.com/hotel/tr/grand-cave-suites.html',
      archetypes: [],
    },
  ],

  hotelsDescription: 'Göreme as a base — sleeping inside the rock, minutes from everything else.',

  experiences: [
    {
      name: 'Sunrise Hot Air Balloon Flight over Göreme',
      description: 'The sunrise balloon flight over Göreme\'s fairy chimneys is Turkey\'s most photographed experience and one of the most striking anywhere in the world. Hotel pickup 1 hour before sunrise, a light breakfast at the launch site, a 1-hour flight up to 600 meters over the volcanic landscape, and a champagne toast on landing. Flight certificate included. For the group with exactly one fixed, non-negotiable plan across the six days: this is it.',
      tags: ['Balloon', 'Sunrise', 'Must-do'],
      affiliateUrl: 'https://www.getyourguide.com/cappadocia-l1400/cappadocia-goreme-hot-air-balloon-flight-at-sunrise-t26992/',
    },
    {
      name: 'Royal Queen Hot Air Balloon Tour',
      description: 'The premium version of the balloon flight: a smaller basket, more personalized service, breakfast included, and Eureko Insurance coverage. For the group that wants to do it again, or for those after the version with more room and fewer people sharing the same basket. Run by Royal Balloon, one of Cappadocia\'s most established operators.',
      tags: ['Premium balloon', 'Royal Balloon', 'Sunrise'],
      affiliateUrl: 'https://www.getyourguide.com/cappadocia-l1400/cappadocia-royal-queen-hot-air-balloon-tour-at-sunrise-t13752/',
    },
    {
      name: 'Balloon + Best of Cappadocia Full-Day Tour',
      description: 'A sunrise balloon flight combined with a full-day tour of Cappadocia\'s main sites: the Göreme Open Air Museum (10th-century rock-cut churches with Byzantine frescoes), Uchisar (the region\'s highest castle), the Paşabağ Monks Valley (double-headed fairy chimneys), and a pottery workshop visit in Avanos. The most efficient option for the group with only 6 days that wants the full picture without giving up the balloon.',
      tags: ['Balloon', 'Full-day tour', 'Highlights'],
      affiliateUrl: 'https://www.getyourguide.com/cappadocia-l1400/hot-air-balloon-and-best-of-cappadocia-city-tour-t377126/',
    },
  ],

  experiencesDescription: 'Balloons, horses, and valleys carved from rock.',

  tips: [
    'The balloon in September: flight odds run around 85–90% in September, the highest of the year. Days with strong wind — when operators cancel for safety — are real but infrequent. If your booked flight is cancelled, most operators offer a next-day reschedule or a full refund. Book it for day two of the trip, not the last day, to leave room to reschedule.',
    'Lira anxiety: the Turkish lira (TRY) fluctuates significantly. Hotels and experiences are usually priced in USD or EUR, which are more stable. Cash in TRY is useful for local restaurants, markets, and taxis. Don\'t exchange more than you need, and bring a low-fee international card.',
    'Turkish coffee: you order it, wait 3 minutes for the grounds to settle, drink it slowly, and leave the grounds at the bottom. Turkish coffee is never stirred. The first surprise for anyone in the group who orders it without knowing this: the bitterness at the bottom of the cup is the official welcome to Turkey.',
  ],

  funFact: 'Cappadocia\'s fairy chimneys are the result of 60 million years of erosion on the volcanic ash layers of Mount Erciyes and Mount Hasan. The harder basalt cap on top protects the softer rock underneath — when the hard cap finally falls, the whole column disintegrates. The ones that still have their "hats" intact are the youngest formations in the landscape. NASA has used Cappadocia as a geological analog to simulate conditions on Mars.',

  checklist: [
    '🎈 Balloon flight booked for day 2, not the last day',
    '🧥 Light jacket or layer for the balloon sunrise (600m up is cold)',
    '👟 Comfortable shoes for hiking the valleys',
    '💵 Cash in TRY for local restaurants, markets, and taxis',
    '💳 Low-fee international card for hotels and tours',
    '📷 Camera charged for sunrise and the balloon launch',
    '🎭 Advance booking for the Whirling Dervishes ceremony in Avanos',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Two airports serve Cappadocia. Nevşehir Kapadokya Airport (NAV) is 40 km from Göreme, the closer of the two, with domestic flights from Istanbul (Turkish Airlines, Pegasus, 1.5 hours). Kayseri Airport (ASR) is 80 km away, with more international connections but a longer transfer. From Mexico: connect through Istanbul (Turkish Airlines, direct CDMX–IST flights). Airport-to-Göreme transfer: hotel-arranged shuttle or private taxi (~400–600 TRY).',
    },
    {
      mode: 'From Istanbul',
      description: 'Turkish Airlines and Pegasus run domestic flights every 1–2 hours to Nevşehir and Kayseri. The overnight bus from Istanbul (10–11 hours) is also an option for the budget-conscious group with time to spare.',
    },
    {
      mode: 'Getting around Cappadocia',
      description: 'Göreme is small enough to walk between the center and the hotels. For the farther valleys and sites: ATV or scooter rental ($30–60 USD/day), an organized tour, or a local taxi. Hiking trails connect Göreme directly to the Red Valley, Pigeon Valley, and Love Valley, all reachable on foot from the town center.',
      tip: 'September weather: 26–28°C by day, 15–18°C at night. The best month of the year for the balloon flight — the share of flights cancelled for wind is the lowest of the entire calendar. Bring a layer for the balloon sunrise: at 600 meters with the sun just coming up, the air is noticeably colder than on the ground.',
    },
  ],
}
