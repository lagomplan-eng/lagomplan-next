import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'guadalajara',
  locale: 'es',

  hero: {
    title: 'Guadalajara',
    subtitle: 'Tierra de tequila, arquitectura y sabores audaces. Una pausa diseñada para explorar mercados, brindar en destilerías y descubrir por qué es la capital del estilo tapatío.',
    eyebrow: 'Guía curada · Amigos aventureros',
    tags: ['Amigos', 'Gastronomía', 'Aventura', 'Cultura'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Barrio y coctelería',
      items: [
        {
          time: '15:00',
          title: 'Check-in en la Americana y caminata por la zona',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Comida tarde en Hueso',
          description: 'Arquitectura y comida de autor.',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Tour de bares: empiecen en El Gallo Altanero',
          description: 'El templo del tequila.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'El corazón del agave',
      items: [
        {
          time: '09:00',
          title: 'Salida hacia el pueblo de Tequila o Amatitán',
          description: 'Renten un conductor privado para visitar destilerías boutique como Cascahuín o Fortaleza.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Comida rústica en el mercado de Tequila o en una hacienda',
          description: '',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Regreso a GDL y cena de alivio con una carne en su jugo en Kamilos 333',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Tradición y cierre',
      items: [
        {
          time: '10:00',
          title: 'Desayuno en Pal Real',
          description: 'El mejor lonche de pancita.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Visita al Hospicio Cabañas para ver los murales de Orozco',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Última ronda de tejuinos y salida al aeropuerto',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Casa Habita',
      type: 'Hotel boutique · Colonia Americana',
      priceTier: '$$',
      description: 'Ubicado en la Colonia Americana (el barrio más cool). Diseño retro-moderno con una alberca en la terraza ideal para el pre con los amigos.',
      tag: 'Estilo puro y vida nocturna',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/Fa7ydor9Ks?aid=lagomplan&campaign=lagomplan-guadalajarafoodiesadventure&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Guadalajara%2C+Jalisco%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fguadalajara-foodies-adventure',
    },
    {
      name: 'Villa Ganz',
      type: 'Casona restaurada · Zona foodie',
      priceTier: '$$$',
      description: 'Una casona antigua restaurada con un gusto impecable. Se siente como la casa de un amigo sofisticado. Perfecta para quienes buscan confort clásico en el corazón de la zona foodie.',
      tag: 'Calidez y sofisticación',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/xtCO1IKwvn?aid=lagomplan&campaign=lagomplan-guadalajarafoodiesadventure&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Guadalajara%2C+Jalisco%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fguadalajara-foodies-adventure',
    },
    {
      name: 'Hilton DoubleTree Centro Histórico',
      type: 'Hotel · Centro histórico',
      priceTier: '$',
      description: 'El equilibrio ideal entre la eficiencia de una gran cadena y el alma vibrante del centro tapatío. Habitaciones insonorizadas y terraza con vistas del skyline histórico a pasos de la Catedral.',
      tag: 'Fiabilidad y ubicación premium',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/PvecFbkHpn?aid=lagomplan&campaign=lagomplan-guadalajarafoodiesadventure&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Guadalajara%2C+Jalisco%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fguadalajara-foodies-adventure',
    },
  ],

  experiences: [
    {
      name: 'Tour de tequila artesanal',
      description: 'Eviten el tren turístico masivo. Renten un conductor privado hacia la zona de Tequila para visitar destilerías boutique como Cascahuín o Fortaleza. Es aventura líquida para conocedores.',
      tags: [],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/mcSDi9xF38',
    },
    {
      name: 'Safari de tortas ahogadas',
      description: 'No se queden con una. Hagan un recorrido por las clásicas (como El Güerito) y las modernas. Es el rito de iniciación obligatorio para cualquier foodie.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Caminata por la Colonia Americana',
      description: 'Exploren las galerías y tiendas de diseño independiente. Terminen la tarde en una cata de café de especialidad en Pólvora o Taller de Espresso.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: 'Tres opciones para estar en el centro de la acción.',

  tips: [
    'La cruda es real: El tequila artesanal no perdona si no te hidratas. El tejuino (bebida de maíz fermentado con nieve de limón) es el mejor remedio local; no se vayan sin probarlo en el mercado.',
    'Reserva con estrategia: Restaurantes como Alcalde o Xokol se llenan con semanas de antelación. Si son foodies serios, aseguren su mesa con antelación.',
    'Zapatos para caminar: Guadalajara se disfruta caminando por sus colonias. Olviden lo formal; unos tenis con estilo son el uniforme adecuado para aguantar del mercado a la terraza.',
  ],

  funFact: 'Guadalajara es la cuna del mariachi y el tequila, pero también es conocida como el "Silicon Valley de México" por su enorme industria tecnológica y creativa que convive con sus tradiciones más antiguas.',

  checklist: [
    '👟 Tenis cómodos para caminar colonias',
    '🧥 Chamarra ligera o blazer (las noches refrescan)',
    '💵 Efectivo para el mercado y tortas ahogadas',
    '🎒 Bolsa pequeña para el tour de bares',
    '💊 Botiquín básico e ibuprofeno',
    '🔋 Power bank para el día de destilería',
    '🕶️ Lentes de sol para el tour a Tequila',
    '💳 Tarjeta para restaurantes de autor',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Llegada al Aeropuerto de Guadalajara (GDL).',
    },
    {
      mode: 'Traslado desde el aeropuerto',
      description: 'Uber funciona perfectamente y es muy económico en la ciudad. Desde el aeropuerto a la Colonia Americana son unos 30–40 minutos.',
    },
    {
      mode: 'Movilidad en la ciudad',
      description: 'Guadalajara es una ciudad de barrios. Para moverse entre la Americana, Providencia y el Centro, Uber es la mejor opción. No renten coche; el tráfico y el estacionamiento son un dolor de cabeza innecesario.',
    },
  ],
}
