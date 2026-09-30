import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'udaipur',
  locale: 'en',

  hero: {
    title: 'Udaipur',
    subtitle: "The city built around Asia's largest artificial lakes is exactly as beautiful as the photos claim. For the family with teenagers who wants the trip to be the definitive argument that the real world beats any screen: Udaipur in October, once the monsoon has passed and the lakes are full and green.",
    eyebrow: 'Curated guide · Family with teens · Culture & palaces · 6 days · High budget',
    tags: ['Family', 'Culture', 'Palaces', 'Lakes'],
    image: '/images/guides/udaipur.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and the first boat ride',
      items: [
        {
          time: '14:00',
          title: 'Arrival and check-in',
          description: 'Arrival at UDR airport, transfer to the hotel.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Walk along the Lake Pichola ghats',
          description: 'The steps down to the lake where women wash clothes and locals picnic.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Chai masala on a lake-view terrace',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Dinner with a view of the illuminated Lake Palace',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'City Palace and a boat tour',
      items: [
        {
          time: '09:00',
          title: 'City Palace Museum Tour + Lake Pichola Boat Tour',
          description: "The trip's most historic day.",
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at Ambrai restaurant',
          description: "Right on the lake — the city's most photogenic setting.",
          tags: [],
        },
        {
          time: '15:30',
          title: 'Badi Pol bazaar and the old town alleys',
          description: 'First textile shopping of the trip.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cultural show at Bagore Ki Haveli',
          description: 'Classical Rajasthani dance, 7-8pm.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'A day on Lake Pichola with an old-city walk',
      items: [
        {
          time: '09:00',
          title: 'Old City Heritage Walk + Boat Ride',
          description: 'The alleys of the historic bazaar, with stops at miniature-painting workshops and 17th-century havelis.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Lunch in the old town',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Shilpgram',
          description: 'The rural arts-and-crafts village 3 km from the center, where artisans from 14 Indian states sell directly, no middleman.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Sunset over Fateh Sagar Lake',
          description: 'The northern lake, quieter than Pichola.',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Dinner',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Day trip to Kumbhalgarh',
      items: [
        {
          time: '08:00',
          title: 'Depart by private car for Kumbhalgarh',
          description: '2 hours.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Kumbhalgarh Fort and a walk along the wall',
          description: "84 km north of Udaipur, it has the second-longest wall in the world after the Great Wall of China — 36 km built in the 15th century. Inside the perimeter, 360 temples.",
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch on the road',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Ranakpur',
          description: 'The white-marble Jain temples with 1,444 columns, no two alike.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Back to Udaipur',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'A night at the Taj Lake Palace',
      items: [
        {
          time: '11:00',
          title: 'Check out of the base hotel',
          description: "The trip's most memorable day, by deliberate design.",
          tags: [],
        },
        {
          time: '12:00',
          title: 'Boat transfer to the Taj Lake Palace',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at the Lake Palace',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Free afternoon at the floating hotel',
          description: 'The pool, the jasmine gardens, the spa.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at Jharokha Restaurant',
          description: 'With the illuminated City Palace right outside the window.',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Monsoon Palace and departure',
      items: [
        {
          time: '09:30',
          title: 'Boat transfer back to the dock',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Drive to the Monsoon Palace',
          description: "20 minutes. Sajjangarh, the white-marble fortress built in 1884 atop Bansdara hill to watch the monsoons come in.",
          tags: [],
        },
        {
          time: '12:00',
          title: 'Panoramic views of Udaipur and the lake from the summit',
          description: '',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch on the road',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Transfer to UDR airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'The Leela Palace Udaipur',
      type: 'Luxury hotel · Lake Pichola shore',
      priceTier: '$$$',
      description: "Udaipur's most complete hotel for families with teens: an infinity pool over the lake, a spa, four restaurants, a private boat service to the City Palace, and a buffet breakfast with Rajasthani, continental, and tropical-fruit options. Family rooms look straight out onto Pichola.",
      tag: 'Wake up with the City Palace right there',
      affiliateUrl: 'https://www.booking.com/hotel/in/the-leela-palace-udaipur.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Taj Lake Palace',
      type: 'Palace hotel · Island on Lake Pichola',
      priceTier: '$$$',
      description: "Asia's most photographed hotel — literally floating in the middle of Lake Pichola, reachable only by boat from the City Palace dock. 83 rooms in an 18th-century palace that once housed the Maharanas of Mewar. For the family that wants the trip's single most memorable night.",
      tag: 'One night floating on the lake',
      affiliateUrl: 'https://www.booking.com/hotel/in/taj-lake-palace-udaipur.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Fateh Garh',
      type: 'Boutique fort-palace · Hills above Udaipur',
      priceTier: '$$$',
      description: "An 18th-century fort-palace turned 60-room boutique hotel in the hills north of the city, with panoramic views of the lake and the Udaipur skyline. Its infinity pool has the city's best view — better than the Monsoon Palace for sunset, and without the crowd.",
      tag: 'The best sunset view, no line',
      affiliateUrl: 'https://www.booking.com/hotel/in/fatehgarh-udaipur.html',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Three ways to sleep among palaces, from the lakeshore to the hills.',

  experiences: [
    {
      name: 'City Palace and a Lake Pichola boat tour',
      description: "A tour of the City Palace (Rajasthan's largest palace complex, built over 400 years by successive Mewar Maharanas) followed by a boat ride on Lake Pichola. The guide covers the history of the Mewar royal family, who never submitted to either the Mughal or the British Empire.",
      tags: ['History', 'City Palace', 'Boat'],
      affiliateUrl: 'https://www.getyourguide.com/udaipur-l1930/guided-tour-udaipur-city-palace-museum-lake-pichola-tour-t393134/',
    },
    {
      name: 'Indian cooking class with Shashi',
      description: "Four hours in Shashi's kitchen learning Indian and Rajasthani cooking, with a regular or a special Rajasthani menu. The itinerary's most different plan: no palaces, no lakes, just spices, fire, and a table set with what you made yourself.",
      tags: ['Food', 'Class', 'Family'],
      affiliateUrl: 'https://www.getyourguide.com/udaipur-l1930/udaipur-authentic-indian-cooking-class-with-lunch-or-dinner-t808453/',
    },
    {
      name: 'Boat ride with an old-city walking tour',
      description: 'Four hours combining the alleys of the historic bazaar (miniature-painting workshops, 17th-century havelis, the ghats where locals do their morning rituals) with a private sunset boat ride past the City Palace, the Lake Palace, and the Jag Mandir. Includes a live miniature-painting demonstration.',
      tags: ['Boat', 'Old city', 'Craft'],
      affiliateUrl: 'https://www.getyourguide.com/udaipur-l1930/udaipur-bootsfahrt-auf-dem-pichola-see-mit-altstadt-sightseeing-rundgang-t1405641/',
    },
  ],

  tips: [
    "Bargaining in the bazaar: at Badi Pol market and Hathi Pol bazaar, the opening price is always the tourist price (2 to 4 times the real one). For teens bargaining in India for the first time: set a hard ceiling before you walk in, and never reveal it. Your first offer should always be under 40% of the asking price.",
    "Rickshaw vs. taxi: tuk-tuks are the most authentic way to get around the city. For short trips within the old town they're faster and cheaper than a car. Negotiate the price before you get in.",
    "Rajasthani food: dal baati churma (wheat balls baked over coals with lentils and a sugar syrup) is the most specifically Rajasthani dish you'll find. Natraj Dining Hall in the center serves the city's best reasonably priced Rajasthani thali: unlimited buffet for under $5 USD.",
  ],

  funFact: "The Mewar royal family, the Maharanas of Udaipur, holds the longest unbroken dynastic lineage in world history: 76 uninterrupted generations from the 7th century AD to today. Neither the Mughal Empire nor the British Empire ever got the dynasty to sign a treaty of submission. The current Maharana, Arvind Singh Mewar, still runs part of the City Palace as a museum and hotel.",

  checklist: [
    '🧢 Hat or cap and sunscreen',
    '👕 Light clothes for the day, something warmer for the evening (18-22°C)',
    '👟 Comfortable shoes for walking the old town',
    '💵 Rupees in cash for bargaining at the bazaars',
    '🎒 A bargaining budget set before you walk into the markets',
    '📷 A camera — the City Palace and the Lake Palace ask for photos',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Maharana Pratap Airport (UDR), 22 km from the center. Domestic flights from Delhi (1.5 hours), Mumbai (1.5 hours), and Jaipur (50 minutes) on IndiGo, Air India, and Vistara. From Mexico or Latin America: an international flight to Delhi (DEL) or Mumbai (BOM), then a domestic flight to Udaipur. Airport-to-hotel transfer: prepaid taxi (~$10–15 USD) or a hotel transfer.',
    },
    {
      mode: 'The Rajasthan route',
      description: "Udaipur is the ideal finish for the extended Golden Triangle: Delhi → Agra (Taj Mahal) → Jaipur → Udaipur, by overnight train or domestic flight. For families with teens who have 10+ days, this route has the best cultural-density-to-distance ratio of any itinerary in India.",
    },
    {
      mode: 'Weather',
      description: "In October: 25-32°C by day, 18-22°C at night. The monsoon ends in September — October has the greenest landscape of the year, with the lakes completely full. No significant rain, clear skies. The best month of the year to visit Udaipur.",
    },
  ],
}
