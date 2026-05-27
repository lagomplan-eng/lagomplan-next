import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'cartagena',
  locale: 'es',

  hero: {
    title: 'Cartagena de Indias',
    subtitle: 'El corazón amurallado de Colombia. Una semana diseñada para descubrir tesoros piratas, islas de coral y la calidez del Caribe con el equilibrio exacto entre historia y descanso.',
    eyebrow: 'Guía curada · Familia · 7 días · Playa, aventura',
    tags: ['Familia', 'Playa', 'Aventura', 'Historia'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'El arribo amurallado',
      items: [
        {
          time: '15:00',
          title: 'Check-in y primer chapuzón',
          description: '',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Caminata por la muralla (Baluarte de Santo Domingo)',
          description: 'Caminata suave por las murallas al atardecer para reconocer el terreno. Dejen que los niños corran mientras ven volar los papalotes.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena informal de antojitos costeños',
          description: 'Arepas de huevo para entrar en el mood local.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Túneles y piratas',
      items: [
        {
          time: '08:30',
          title: 'Exploración del Castillo de San Felipe',
          description: 'La fortificación más grande construida por los españoles en América.',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Museo del Oro Zenú',
          description: 'Entrada gratuita y fresco — refugio del calor del mediodía.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Almuerzo de "corrientazo" gourmet y tarde de relax',
          description: 'Tarde de juegos en la alberca del hotel.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'El paraíso turquesa',
      items: [
        {
          time: '09:00',
          title: 'Salida en lancha privada desde el muelle',
          description: 'Eviten los tours masivos de "playa blanca". Renten un bote privado pequeño para ir a Isla Grande.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en Isla Grande',
          description: 'Snorkel en aguas cristalinas y almuerzo de pescado fresco en un club de playa privado.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Regreso y descanso',
          description: 'Cansados del sol y con el corazón lleno de mar.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Getsemaní y colores',
      items: [
        {
          time: '10:00',
          title: 'Tour de graffiti en Getsemaní',
          description: 'Murales de graffiti y la Plaza de la Trinidad. El lugar más vibrante y auténtico para que los niños vean el baile local.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Comida en Celele',
          description: 'Reservar con tiempo para probar cocina caribeña creativa.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Helados en La Palettería',
          description: 'Helado artesanal mientras cae la tarde.',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Alas y selva',
      items: [
        {
          time: '09:00',
          title: 'Visita al Aviario Nacional',
          description: 'Experiencia de naturaleza pura que rompe con la arquitectura de la ciudad.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Comida en Nena Beach (Barú)',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Regreso a Cartagena',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Chocolate y atardecer',
      items: [
        {
          time: '10:00',
          title: 'Taller de "frijol a la barra" en el Museo del Chocolate',
          description: 'Éxito total con niños.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Compras en Las Bóvedas',
          description: 'Últimas compras de artesanías.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Atardecer en el Baluarte de San Francisco Javier',
          description: 'Cena en las murallas, viendo cómo el sol se hunde en el Caribe.',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Despedida suave',
      items: [
        {
          time: '09:00',
          title: 'Desayuno de despedida con frutas y café colombiano',
          description: 'Desayuno largo con frutas tropicales.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Última caminata y salida al aeropuerto',
          description: 'Busquen una última mochila wayuu de recuerdo antes de enfilar hacia el aeropuerto.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel Bastión Luxury',
      type: 'Hotel boutique · Centro amurallado',
      priceTier: '$$$',
      description: 'Ubicado en una casona del siglo XVI pero con todas las comodidades modernas. Su terraza con alberca es el refugio perfecto para el mediodía cartagenero. Servicio impecable que entiende las necesidades de una familia.',
      tag: 'Lujo accesible y la mejor terraza de la ciudad',
      affiliateUrl: '',
      archetypes: ['Familias', 'Parejas'],
    },
    {
      name: 'Ananda Boutique Hotel',
      type: 'Hotel boutique · Centro histórico',
      priceTier: '$$',
      description: 'Un remanso de paz con arquitectura colonial, techos altos y una alberca rodeada de vegetación que fascina a los niños. Está en el corazón del centro, cerca de todo pero lo suficientemente privado.',
      tag: 'Elegancia equilibrada y frescura colonial',
      affiliateUrl: '',
      archetypes: ['Familias', 'Parejas'],
    },
    {
      name: 'San Lazaro Art Hotel',
      type: 'Hotel · Frente al Castillo de San Felipe',
      priceTier: '$',
      description: 'Ubicado frente al Castillo de San Felipe. Es moderno, con habitaciones amplias y una vista cinematográfica a la fortaleza. Es la opción inteligente para estar cerca de la acción con un costo menor que dentro de las murallas.',
      tag: 'Vistas épicas y valor "Smart"',
      affiliateUrl: '',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Tres opciones para un presupuesto intermedio que no sacrifica el diseño.',

  experiences: [
    {
      name: 'Castillo de San Felipe',
      description: 'Es la fortificación más grande construida por los españoles en América. Para niños de 6-8 años, recorrer sus túneles y rampas con una historia de piratas es la aventura definitiva.',
      tags: ['Historia', 'Familia', 'Aventura'],
      affiliateUrl: '',
    },
    {
      name: 'Islas del Rosario (Lancha Privada)',
      description: 'Eviten los tours masivos de "playa blanca". Lo más Lagom es rentar un bote privado pequeño para ir a Isla Grande. Snorkel en aguas cristalinas y un almuerzo de pescado fresco en un club de playa privado.',
      tags: ['Islas', 'Snorkel', 'Privado'],
      affiliateUrl: '',
    },
    {
      name: 'Aviario Nacional de Colombia',
      description: 'Ubicado en Barú. Es uno de los más impresionantes del mundo. Los niños pueden ver flamencos, cóndores y tucanes en hábitats casi libres. Es una inmersión educativa y visualmente potente.',
      tags: ['Naturaleza', 'Aves', 'Familia'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Hidratación estratégica: El agua de coco fresca se vende en cada esquina. Es la mejor forma de mantener a los niños hidratados y es una experiencia muy local.',
    'Manejo de vendedores: Cartagena tiene vendedores muy persistentes. Un "No, gracias" firme y una sonrisa suele ser suficiente. Enséñenle a los niños a no recibir "muestras gratis" de collares o masajes.',
    'Repelente y bloqueador: En las islas y en el aviario hay "jejenes" (mosquitos pequeños). Lleven un buen repelente y apliquen bloqueador cada 2 horas; el sol del Caribe no perdona.',
  ],

  funFact: 'Las murallas de Cartagena tardaron casi 200 años en terminarse. Se construyeron para proteger el oro y la plata que salían hacia España de los ataques de piratas ingleses y franceses. Hoy, esas mismas murallas son el mejor mirador gratuito de la ciudad.',

  checklist: [
    '🩱 Traje de baño para todos',
    '🧴 Bloqueador solar (aplicar cada 2 horas)',
    '🦟 Repelente contra jejenes',
    '👟 Sandalias y zapatos cómodos para empedrado',
    '🧢 Sombrero o gorra para el sol del mediodía',
    '💵 Pesos colombianos en efectivo',
    '🥥 Disposición para agua de coco en la calle',
    '🎒 Mochila wayuu (para llevar de vuelta)',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Llegada al Aeropuerto Internacional Rafael Núñez (CTG).',
    },
    {
      mode: 'Traslado',
      description: 'El trayecto al centro es corto (15 min). Usen taxis oficiales del aeropuerto o Uber/InDrive, que funcionan bien. Acuerden el precio antes de subir si es taxi.',
    },
    {
      mode: 'Clima',
      description: 'Cartagena es húmeda y calurosa. La regla de oro con niños: actividades afuera de 8:00 a 11:00 y después de las 16:30. El mediodía es sagrado para la alberca o museos con aire acondicionado.',
    },
  ],
}
