import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'cancun',
  locale: 'en',

  hero: {
    title: 'Cancún',
    subtitle: "The world's most famous blue for all ages. A balanced pause between resort comfort, natural adventure, and smart value.",
    eyebrow: 'Curated guide · Family travel',
    tags: ['Family', 'Beach', 'Resort', 'Smart value'],
    image: '/images/guides/guides-headers/Canc%C3%BAn.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Landing day',
      items: [
        {
          time: '3:00 PM',
          title: 'Check-in and first dip in the pool',
          description: '',
          tags: [],
        },
        {
          time: '6:00 PM',
          title: 'Walk on the beach and family dinner at the hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'The trip highlight',
      items: [
        {
          time: '8:30 AM',
          title: 'Full day at Xcaret or Xel-Há',
          description: 'The evening show is full of culture — an experience kids will remember their whole lives. Book 21 days in advance for a 15% discount.',
          tags: [],
        },
        {
          time: '9:00 PM',
          title: 'Return to hotel after the evening show',
          description: 'The kids will fall asleep immediately.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Smart Isla Mujeres day',
      items: [
        {
          time: '9:30 AM',
          title: 'Ferry from Playa Tortugas to Isla Mujeres',
          description: 'Take the UltraMar ferry. Once there, rent a golf cart.',
          tags: [],
        },
        {
          time: '11:00 AM',
          title: 'Playa Norte and local Tikin-xic fish lunch',
          description: 'The water is so shallow and calm it feels like a giant swimming pool.',
          tags: [],
        },
        {
          time: '5:00 PM',
          title: 'Return and taco dinner in Cancún center',
          description: 'Cheaper and more authentic.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Farewell and shopping',
      items: [
        {
          time: '10:00 AM',
          title: 'Visit to Playa Delfines for the family photo',
          description: 'The viewpoint with the Cancún letters sign.',
          tags: [],
        },
        {
          time: '12:00 PM',
          title: 'Last-minute shopping at Chedraui Selecto and departure',
          description: 'Better prices than souvenir shops.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Nizuc Resort & Spa',
      type: 'Resort · Southern Hotel Zone',
      priceTier: '$$$',
      description: "The most exclusive luxury retreat at the end of the Hotel Zone. Ideal for families seeking peace, a sargassum-free beach (due to its location), and a world-class Kids' Club.",
      tag: 'Zen luxury and privacy',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/PlmvNbFRph?aid=lagomplan&campaign=lagomplan-cancunfamilyvalueedition&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Canc%C3%BAn%2C+Quintana+Roo%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fcancun-family-value-edition',
    },
    {
      name: 'Grand Fiesta Americana Coral Beach',
      type: 'All-inclusive resort · Beachfront',
      priceTier: '$$',
      description: "The best family luxury deal. Recently turned All-Inclusive but maintains superior dining quality. Its kids' club is one of the best in Mexico.",
      tag: 'Premium all-inclusive resort',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/8ezclsJ3wa?aid=lagomplan&campaign=lagomplan-cancunfamilyvalueedition&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Canc%C3%BAn%2C+Quintana+Roo%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fcancun-family-value-edition',
    },
    {
      name: 'Aloft Cancun',
      type: 'Hotel · Smart value',
      priceTier: '$',
      description: 'The smart value option. Not a beachfront resort, but steps from a public beach and surrounded by services. Perfect for families who prefer to invest their budget in parks and excursions.',
      tag: 'Strategic location and savings',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/WSZq7xX49s?aid=lagomplan&campaign=lagomplan-cancunfamilyvalueedition&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Canc%C3%BAn%2C+Quintana+Roo%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fcancun-family-value-edition',
    },
  ],

  experiences: [
    {
      name: 'Day trip to Isla Mujeres',
      description: 'Take the UltraMar ferry (an affordable and fun plan). Once there, rent a golf cart and spend the day at Playa Norte; the water is so shallow and calm it feels like a giant swimming pool.',
      tags: [],
      affiliateUrl: 'https://booking.stay22.com/lagomplan/UGkuXdeIfI',
    },
    {
      name: 'Xcaret Park',
      description: 'An investment, but the most complete park. The evening show is packed with culture — an experience kids will remember their whole lives.',
      tags: ['Book 21 days ahead for 15% off'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/Q74zZ8LQfv',
    },
    {
      name: 'Cenote Azul',
      description: 'An hour and a half from Cancún. An open cenote, ideal for kids who are not comfortable in closed caves. The perfect deal for a day in nature on a small budget.',
      tags: ['~1.5 hrs from Cancún', 'Ideal for kids'],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: 'Three options that understand family dynamics and value for money.',

  tips: [
    'The supermarket is your best ally: Chedraui Selecto in the Hotel Zone carries prepared gourmet food, sunscreen, and drinks at city prices. Best place to build a beach picnic and save money.',
    'Smart sun protection: The Caribbean sun shows no mercy. Beyond sunscreen, use UV-protection swim shirts. You will save on cream and avoid burns that ruin the trip.',
    'Always bottled water: Even in luxury hotels, only drink bottled water. Avoid stomach illness that can knock you out for an entire day.',
  ],

  funFact: 'Cancún means "Nest of Snakes" in Maya. Before 1970, only a dozen caretakers of a coconut plantation lived here; today it is the most important tourist destination in Latin America.',

  checklist: [
    '🩱 Swimsuit (for pool and beach)',
    '🧴 SPF 50+ sunscreen and UV swim shirts',
    '🕶️ Sunglasses and wide-brim hat',
    '🩴 Sandals and water shoes',
    '💊 Basic first-aid kit and motion sickness medicine',
    '💵 Cash in Mexican pesos',
    '💧 Bottled water always on hand',
    '🔋 Power bank for full park days',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Arrival at Cancún International Airport (CUN).',
    },
    {
      mode: 'Airport transfer',
      description: 'Never take a regular taxi on arrival (very expensive). Book a private shuttle in advance (such as Happy Shuttle or USA Transfers). Cheaper, safer, and they wait with a name sign.',
    },
    {
      mode: 'Getting around the city',
      description: 'Use the local bus (R1 or R2) to move within the Hotel Zone. Costs only 12 pesos and passes every 2 minutes. The best-kept secret to avoid $40 USD taxi rides for short trips.',
    },
  ],
}
