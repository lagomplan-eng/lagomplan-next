import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'puerto-vallarta',
  locale: 'es',

  hero: {
    title: 'Puerto Vallarta',
    subtitle: 'Donde la Sierra Madre se funde con el Pacífico. Una escapada diseñada para redescubrir el encanto del Viejo Vallarta, con el equilibrio perfecto entre lujo contemporáneo y alma colonial.',
    eyebrow: 'Guía curada · pareja & sofisticación',
    tags: ['Pareja', 'Romance', 'Relax', 'Gastronomía'],
    image: '/images/guides/guides-headers/Puerto%20Vallarta.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Atardecer y viejo Vallarta',
      items: [
        {
          time: '15:00',
          title: 'Check-in y brindis de bienvenida',
          description: '',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Cócteles en la terraza de The Iguana (Casa Kimberly)',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena romántica en Tintoque',
          description: 'Cocina de autor frente al río.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Mar, selva y calma',
      items: [
        {
          time: '10:00',
          title: 'Salida en bote privado desde Los Muertos hacia el sur',
          description: 'Navegar hacia las calas del sur, donde la selva toca el océano.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Comida de mariscos frescos en Casitas Maraika',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Regreso al hotel y tiempo de descanso y alberca',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena relajada en La Palapa',
          description: 'Cenar con los pies en la arena.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Arte y jardines secretos',
      items: [
        {
          time: '10:00',
          title: 'Visita al Jardín Botánico de Vallarta',
          description: 'Un oasis de paz.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Brunch tardío en Bistro Teresa',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Recorrido por las galerías del centro (Art Walk)',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena de gala en Café des Artistes',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Brunch y despedida',
      items: [
        {
          time: '10:00',
          title: "Brunch en Coco's Kitchen",
          description: 'Un clásico local en la Zona Romántica.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Última caminata por el muelle y compras de diseño local',
          description: '',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Salida hacia el aeropuerto',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Casa Kimberly',
      type: 'Hotel boutique · Zona Romántica',
      priceTier: '$$$',
      description: 'El epítome del romance histórico. Fue el refugio de Elizabeth Taylor y Richard Burton; hoy es una joya boutique con puentes de mármol, tinas al aire libre y un servicio que te transporta a la época dorada de Hollywood.',
      tag: 'Lujo legendario y elegancia clásica',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/HW6l2Lk3x8?aid=lagomplan&campaign=lagomplan-puertovallartaromancerelax&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Puerto+Vallarta%2C+Jalisco%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fpuerto-vallarta-romance-relax',
    },
    {
      name: 'Hotel Mousai',
      type: 'Hotel · Zona Sur (Adults Only)',
      priceTier: '$$$',
      description: 'Vanguardia y diseño exclusivo en la Zona Sur. Un hotel "Adults Only" con una de las albercas infinity más espectaculares del mundo. El lugar para quienes buscan tecnología, vistas infinitas y una atmósfera vibrante y moderna.',
      tag: 'Modernidad audaz y vistas panorámicas',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/g_5prIqCps?aid=lagomplan&campaign=lagomplan-puertovallartaromancerelax&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Puerto+Vallarta%2C+Jalisco%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fpuerto-vallarta-romance-relax',
    },
    {
      name: 'Hotel Amapa',
      type: 'Hotel boutique · Zona Romántica (Adults Only)',
      priceTier: '$$',
      description: 'Minimalismo contemporáneo en el corazón de la Zona Romántica. Un hotel boutique "Adults Only" que celebra el diseño mexicano con una estética limpia, textiles locales y una terraza perfecta para ver el atardecer sin pretensiones.',
      tag: 'Diseño "smart" y pulso local',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/iOevGf3QhC?aid=lagomplan&campaign=lagomplan-puertovallartaromancerelax&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Puerto+Vallarta%2C+Jalisco%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fpuerto-vallarta-romance-relax',
    },
  ],

  experiences: [
    {
      name: 'Navegación privada a Majahuitas',
      description: 'Evita los barcos turísticos masivos. Renta una panga de lujo o un yate pequeño para ir a las calas del sur. El agua es más clara, el entorno es selvático y la privacidad es el verdadero lujo de la jornada.',
      tags: [],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/pFK0IfOG3p',
    },
    {
      name: 'Atardecer en The Iguana',
      description: 'Cenar o tomar un coctel en el restaurante de Casa Kimberly. La vista de las cúpulas de la Iglesia de Guadalupe bajo el cielo rosado es, probablemente, el momento más romántico de todo el Pacífico mexicano.',
      tags: [],
      affiliateUrl: 'https://www.opentable.com/s?dateTime=2026-04-14T19%3A00%3A00&covers=2&latitude=20.6516335&longitude=-105.2487681&term=kimberly%20puerto%20vallarta&shouldUseLatLongSearch=true&originCorrelationId=f18ba663-55a3-4747-8807-49a5713c0263&corrid=e08b4372-b84f-4f1c-8374-8bc07cc41ed1&intentModifiedTerm=kimberly&metroId=328&originalTerm=kimberly%20puerto%20vallarta&queryUnderstandingType=location&showMap=true&sortBy=web_conversion',
    },
    {
      name: 'Visita al mercado y clase de cocina mexicana',
      description: 'Del mercado a la cocina, despierta tus sentidos con sabores atrevidos y un ambiente vibrante. Descubre la magia de la cultura mexicana con una divertida y auténtica aventura culinaria.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: 'Tres estados de ánimo para tu estancia.',

  tips: [
    'Reserva con antelación: En temporada alta, los restaurantes con vista (como Le Kliff o The Iguana) se llenan meses antes. No dejes nada al azar si buscas esa mesa específica frente al mar.',
    'El look Vallarta: El clima es húmedo y cálido. Opta por lino y algodones ligeros. Para las cenas elegantes, un vestido midi o una guayabera de lino son el estándar del lujo relajado en la costa.',
    'Evita el malecón al mediodía: En fechas de temporada alta, el malecón se satura de turistas. Recórrelo muy temprano en la mañana o ya entrada la noche; es cuando realmente se aprecia la escultura y la arquitectura sin el ruido de las masas.',
  ],

  funFact: 'Puerto Vallarta saltó a la fama mundial en 1963 gracias a la filmación de La Noche de la Iguana. Lo que hoy es un destino de lujo, era entonces un pequeño pueblo de pescadores accesible solo por mar. Richard Burton y Elizabeth Taylor pusieron a Vallarta en el mapa, y su legado de romance sigue siendo el alma de la Zona Romántica.',

  checklist: [
    '👗 Vestidos midi o guayaberas de lino',
    '🩱 Traje de baño y pareo',
    '🧴 Protector solar SPF 50+ resistente al agua',
    '👟 Zapatos cómodos para adoquines (no tacones)',
    '🌿 Repelente de insectos (húmedo y cálido)',
    '💵 Efectivo para mercado y propinas en barco',
    '🕶️ Lentes de sol de calidad',
    '🔋 Power bank para el día de navegación',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Llegada al Aeropuerto Internacional de Puerto Vallarta (PVR).',
    },
    {
      mode: 'Traslado desde el aeropuerto',
      description: 'En temporada alta, el aeropuerto es un caos. Reserva un transporte privado para que te esperen a la salida. Uber funciona bien en la ciudad, pero para salir del aeropuerto deberás cruzar el puente peatonal hacia la zona federal.',
    },
    {
      mode: 'Movilidad local',
      description: 'Si te hospedas en la Zona Romántica o el Centro, lo mejor es caminar. Para ir a la Zona Sur o Marina Vallarta, Uber es la opción más rápida y segura. Evita rentar auto si planeas quedarte en el casco histórico; el estacionamiento es casi inexistente.',
    },
  ],
}
