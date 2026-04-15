import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'riviera-maya',
  locale: 'es',

  hero: {
    title: 'Riviera Maya',
    subtitle: 'Una travesía de siete días diseñada para encontrar el lujo de la privacidad en la época más vibrante del año. El equilibrio exacto entre la energía del Caribe y el refugio de la selva.',
    eyebrow: 'Guía curada · Roadtrip familiar de temporada alta',
    tags: ['Familia', 'Aventura', 'Lujo', 'Naturaleza'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'El refugio de Mayakoba',
      items: [
        {
          time: '15:00',
          title: 'Arribo y check-in en Mayakoba',
          description: 'Sacúdete el estrés de la ciudad en un entorno donde el único transporte son los carritos de golf y los botes eléctricos por los canales.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena de bienvenida en Zapote Bar',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Kayak y arena',
      items: [
        {
          time: '09:00',
          title: 'Mañana de kayak y snorkel en los canales de Mayakoba',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Comida en Aquí me quedo',
          description: 'Pies en la arena.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Exploración subterránea',
      items: [
        {
          time: '09:00',
          title: 'Expedición en Río Secreto',
          description: 'Reserva el primer turno. Al ser una reserva con grupos controlados y horarios estrictos, es la mejor forma de vivir la aventura subterránea sin sentir el peso de la temporada alta.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Comida en Ciudad Mayakoba para evitar entrar al centro de Playa',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Check-in en Hotel Esencia, Xpu-Há',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'El secreto de Xpu-Há',
      items: [
        {
          time: '10:00',
          title: 'Mañana de lectura y mar en la playa de Xpu-Há',
          description: 'En temporada alta, tener acceso privado a Xpu-Há es un privilegio.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Comida de mariscos en el hotel o en un club de playa privado',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Tarde de spa para los padres, paddle board para los hijos',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Tulum & Sian Ka\'an',
      items: [
        {
          time: '08:00',
          title: 'Ruinas de Tulum',
          description: 'Es vital ser de los primeros en entrar.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Comida en Hartwood',
          description: 'Reserva con semanas de antelación.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Check-in en Habitas Tulum',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Canales milenarios',
      items: [
        {
          time: '09:00',
          title: 'Tour privado por los canales de Sian Ka\'an (entrada por Muyil)',
          description: 'Flotar por los canales milenarios en total silencio es el antídoto perfecto para el ruido de temporada alta.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena de despedida en Arca',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Despedida nutritiva',
      items: [
        {
          time: '10:00',
          title: 'Brunch en The Real Coconut',
          description: '',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Compras finales en el pueblo de Tulum (lino y cerámica)',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Salida estratégica hacia el aeropuerto',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Mayakoba',
      type: 'Resort · Playa del Carmen',
      priceTier: '$$$',
      description: 'El refugio perfecto para los primeros días. Al ser una comunidad cerrada, te aísla por completo de las multitudes. Las villas con alberca propia son ideales para que cada quien tenga su espacio mientras disfrutan del silencio de los canales.',
      tag: 'Privacidad absoluta y logística impecable',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/Pbav6MvoS0?aid=lagomplan&campaign=lagomplan-rivieramayaroadtripdesemanasanta&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Riviera+Maya%2C+Quintana+Roo%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Friviera-maya-roadtrip-de-semana-santa',
    },
    {
      name: 'Hotel Esencia, Xpu-Há',
      type: 'Hotel · Xpu-Há',
      priceTier: '$$$',
      description: 'Ubicado en una de las playas más hermosas y amplias de la zona. Su exclusividad garantiza que la playa nunca se sienta saturada. El punto medio perfecto entre Playa del Carmen y Tulum.',
      tag: 'Lujo silencioso y la mejor playa de la Riviera',
      affiliateUrl: 'https://hotelscom.stay22.com/lagomplan/lT2IMyWNzu?aid=lagomplan&campaign=lagomplan-rivieramayaroadtripdesemanasanta&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Riviera+Maya%2C+Quintana+Roo%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Friviera-maya-roadtrip-de-semana-santa',
    },
    {
      name: 'Habitas Tulum',
      type: 'Eco-resort · Tulum',
      priceTier: '$$',
      description: 'Si buscas el "vibe" de Tulum pero con orden. Sus tiendas de campaña de lujo en la zona de la selva ofrecen una desconexión total. Visualmente increíble con un enfoque de bienestar muy auténtico.',
      tag: 'Eco-diseño y sofisticación bohemia',
      affiliateUrl: 'https://expedia.stay22.com/lagomplan/wAI91b98X-?aid=lagomplan&campaign=lagomplan-rivieramayaroadtripdesemanasanta&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Riviera+Maya%2C+Quintana+Roo%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Friviera-maya-roadtrip-de-semana-santa',
    },
  ],

  experiences: [
    {
      name: 'Río Secreto',
      description: 'Al ser una reserva con grupos controlados y horarios estrictos, es la mejor forma de vivir la aventura subterránea sin sentir el peso de la temporada alta. La versión "Plus" incluye actividades que mantienen a los jóvenes en constante movimiento.',
      tags: [],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/ygCQ8dKAja',
    },
    {
      name: 'Sian Ka\'an por Muyil',
      description: 'En lugar de entrar por la saturada zona hotelera de Tulum, entren por Muyil. Flotar por los canales milenarios en total silencio es el antídoto perfecto para el ruido de temporada alta.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Cenote Zapote (ruta de los cenotes)',
      description: 'Mientras todos se agolpan en los cenotes famosos de Tulum, este cenote en Puerto Morelos ofrece plataformas de saltos y una arquitectura natural impresionante con mucha menos gente.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: 'Tres paradas estratégicas para esquivar el bullicio.',

  tips: [
    'Reserva TODO ahora: En temporada alta, no existe el "llegar a ver si hay mesa". Restaurantes como Hartwood o Arca requieren reserva inmediata.',
    'El semáforo del sargazo: En marzo/abril el sargazo puede ser un factor. Sigue los reportes diarios de la Red de Monitoreo del Sargazo de Quintana Roo para elegir la playa del día.',
    'Efectivo en pesos: Muchos cenotes y propinas en barcos no aceptan tarjeta. En temporada alta, los cajeros de Tulum suelen quedarse sin efectivo rápido. Lleven lo necesario desde CDMX.',
  ],

  funFact: '¿Sabías que el arrecife que corre frente a la Riviera Maya es el segundo más grande del mundo? Se llama el Gran Arrecife Maya (o Sistema Arrecifal Mesoamericano) y se extiende por más de 1,000 kilómetros. Nadar en él durante el amanecer es una de las experiencias más potentes de este viaje.',

  checklist: [
    '🩱 Trajes de baño (varios)',
    '🧴 Bloqueador solar biodegradable (obligatorio en cenotes)',
    '🌿 Repelente de insectos biodegradable',
    '💵 Efectivo en pesos (cajeros escasos en cenotes)',
    '👟 Aquashoes o sandalias acuáticas',
    '🎒 Mochila pequeña para excursiones',
    '🔋 Power bank para los días largos',
    '🌊 Toalla de microfibra (ligera y secado rápido)',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Si pueden, vuelen al nuevo Aeropuerto de Tulum (TQO). Les ahorrará el tráfico pesado que se forma entre Cancún y Playa del Carmen durante temporada alta.',
    },
    {
      mode: 'Renta de auto',
      description: 'Indispensable una SUV. Durante temporada alta hay más retenes y el tráfico en la carretera 307 puede ser lento; un vehículo cómodo y alto hace toda la diferencia.',
    },
    {
      mode: 'Estrategia de horarios',
      description: 'Salgan siempre antes de las 8:30 AM. En temporada alta, quien llega tarde a un cenote o a una playa, llega a una fila. La regla de oro: "aventura temprano, brunch largo después".',
    },
  ],
}
