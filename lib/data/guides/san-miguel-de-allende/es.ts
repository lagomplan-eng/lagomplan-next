import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'san-miguel-de-allende',
  locale: 'es',

  hero: {
    title: 'San Miguel de Allende',
    subtitle: 'Estética colonial, viñedos de altura y los mejores atardeceres de México. Una pausa diseñada para caminar, brindar y reconectar en el corazón del país.',
    eyebrow: 'Guía curada · Viaje de parejas',
    tags: ['Pareja', 'Romance', 'Gastronomía', 'Cultura'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Atardecer y tejados',
      items: [
        {
          time: '15:00',
          title: 'Check-in y caminata suave hacia la Parroquia',
          description: 'Para la foto obligatoria.',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Drinks en Luna Rooftop (Rosewood)',
          description: 'Para ver cómo se ilumina la ciudad.',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena de bienvenida en The Restaurant',
          description: 'Cocina de autor en un patio precioso.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Arte y gastronomía',
      items: [
        {
          time: '11:00',
          title: 'Recorrido por Fábrica La Aurora',
          description: 'Un antiguo centro textil convertido en galerías de arte y diseño.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Comida larga en el mercado gastronómico Doce-18 Concept House',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Tarde libre para explorar tiendas de diseño o descansar en el hotel',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena en Quince Rooftop',
          description: 'Considerado uno de los mejores rooftops del mundo.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Viñedos y alrededores',
      items: [
        {
          time: '11:00',
          title: 'Roadtrip a Dolores Hidalgo y visita al viñedo Cuna de Tierra',
          description: 'A solo 40 minutos. La bodega más premiada de la zona.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Comida maridaje en el viñedo',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Regreso a SMA y paseo nocturno por el Parque Juárez',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Mezcales y tapas en La Azotea',
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
          title: 'Brunch en Lavanda Café',
          description: 'Prepárense para una pequeña fila; vale la pena por el café de especialidad.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Últimas compras en el Mercado de Artesanías',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Salida de regreso con el espíritu renovado',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Rosewood San Miguel de Allende',
      type: 'Hotel · Centro histórico',
      priceTier: '$$$',
      description: 'Es el referente del lujo en la ciudad. Sus suites son amplias y el servicio es impecable. Su bar en la terraza (Luna Rooftop) es el punto de reunión obligatorio para ver cómo se ilumina San Miguel.',
      tag: 'El estándar de oro',
      affiliateUrl: '',
    },
    {
      name: 'Hotel Casa Blanca 7',
      type: 'Hotel boutique · Centro',
      priceTier: '$$',
      description: 'Un refugio de lujo mediterráneo en el corazón de San Miguel. Su atmósfera de 5 estrellas combina la serenidad de sus jardines internos con amenidades de bienestar que invitan a la pausa total.',
      tag: 'Sofisticación y calma absoluta',
      affiliateUrl: '',
    },
    {
      name: 'Selina San Miguel de Allende',
      type: 'Hotel boutique · Centro histórico',
      priceTier: '$',
      description: 'No te dejes engañar por el nombre; sus "Suites Privadas" en la casona histórica son amplias, con mucho estilo y a una fracción del costo de los grandes hoteles. La ubicación es inmejorable (a pasos de la Parroquia).',
      tag: 'Smart Value en el centro',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Día de viñedos en Cuna de Tierra',
      description: 'A solo 40 minutos. Es la bodega más premiada de la zona. Una cata con maridaje entre los viñedos es la actividad perfecta para dos o cuatro adultos.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Fábrica La Aurora',
      description: 'Un antiguo centro textil convertido en galerías de arte y diseño. Ideal para caminar sin prisa, comprar decoración o simplemente inspirarse.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Mañana de aguas termales',
      description: 'Visita a The Mayan Baths o Escondida Place. Pozas de agua caliente en entornos diseñados para la relajación, ideales para una mañana de "reset".',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: '3 opciones que ofrecen el equilibrio perfecto entre privacidad y áreas comunes.',
  experiencesDescription: 'Seleccionadas para disfrutar de la conversación y el entorno.',

  tips: [
    'La regla de las puertas: No juzgues por la fachada; los mejores spots no tienen letreros. Asómate a los patios interiores tras las puertas pesadas de madera para encontrar el San Miguel auténtico, silencioso y sin multitudes.',
    'Break de independencia: Programen un par de horas de exploración libre por separado el tercer día. Reencontrarse en la cena con historias nuevas mantiene la dinámica grupal fresca y evita el agotamiento de estar siempre juntos.',
    'Foto en la Parroquia: Evita el tumulto yendo en la "Hora Azul" (amanecer o 15 min tras el ocaso). Haz la toma desde la calle de Aldama; el encuadre con paredes ocre y la cúpula iluminada es mucho más sofisticado.',
  ],

  funFact: 'La famosa Parroquia no fue diseñada por un arquitecto, sino por un maestro de obras local que se inspiró en postales de catedrales góticas europeas. Sus terrazas ofrecen la "hora azul" más larga y fotogénica del país.',

  checklist: [
    '👟 Zapatos cómodos con buen agarre (adoquines)',
    '🧥 Chamarra ligera o blazer (noches frescas de altura)',
    '👗 Outfits para terraza (fotos de atardecer)',
    '🍷 Tarjeta para catas en viñedos',
    '💵 Efectivo para artesanías del mercado',
    '📷 Cámara con batería cargada (la Parroquia al amanecer)',
    '💧 Botella de agua reutilizable (aire seco de altura)',
    '🎁 Espacio en maleta para llevar artesanías de regreso',
  ],

  transport: [
    {
      mode: 'Coche desde CDMX',
      description: 'Un trayecto de 3.5 a 4 horas. Usa el libramiento para entrar a la ciudad y evita meterte al centro histórico con el coche; las calles son extremadamente estrechas y empedradas.',
    },
    {
      mode: 'Autobús',
      description: 'Los servicios de lujo (ETN o Primera Plus) llegan a la terminal de SMA. De ahí, un Uber de 10 minutos te deja en tu hotel.',
    },
    {
      mode: 'Movilidad local',
      description: 'San Miguel se camina. Lleva zapatos cómodos. Para distancias largas o si llevan maletas, Uber funciona de manera excelente y económica.',
    },
  ],
}
