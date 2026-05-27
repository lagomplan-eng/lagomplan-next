import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'guanacaste',
  locale: 'es',

  hero: {
    title: 'Guanacaste, Costa Rica',
    subtitle: 'La provincia del Pacífico Norte que resuelve el fin de semana perfecto: playa sin masificación, puestas de sol que la gente fotografía durante veinte minutos seguidos y la posibilidad de hacer nada de forma elegante.',
    eyebrow: 'Guía curada · Amigos & Relax · Fin de semana',
    tags: ['Amigos', 'Relax', 'Playa', 'Fin de semana'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Viernes · Llegada',
      items: [
        {
          time: '16:00',
          title: 'Check-in',
          description: 'Llegada en la tarde. Transfer del aeropuerto al hotel.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Caminata a Playa Langosta',
          description: 'A dos kilómetros al sur de Tamarindo, arena oscura y olas más fuertes para el atardecer más fotogénico de la zona.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en el pueblo',
          description: 'La Palapa Beach Club o cualquier restaurante del paseo marítimo de Tamarindo.',
          tags: [],
        },
        {
          time: '22:00',
          title: 'La noche decide sola',
          description: 'El pueblo tiene una calle principal con bares que no intenta ser Cancún.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Sábado · Surf y descanso',
      items: [
        {
          time: '07:30',
          title: 'Desayuno',
          description: '',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Clases de surf (2 horas)',
          description: 'La ola de Tamarindo es larga, suave y perfecta para principiantes.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Almuerzo en el hotel o en la playa',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Piscina / descanso / sin agenda',
          description: 'Tarde de piscina y lectura — o lo que cada quien necesite.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Atardecer desde la terraza',
          description: 'La terraza o el bar del hotel con las vistas al Pacífico.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena',
          description: 'En el hotel o en el pueblo.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Domingo · Manglares y regreso',
      items: [
        {
          time: '07:00',
          title: 'Tour en kayak en el Estero El Salado',
          description: 'Mañana temprana en el manglar, tour de 2 horas.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Regreso al hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Brunch / piscina',
          description: 'Último chapuzón en la piscina.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Transfer al aeropuerto LIR',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Tamarindo Diria Beach Resort',
      type: 'Resort · Playa Tamarindo',
      priceTier: '$$',
      description: 'El resort más establecido de Tamarindo, directamente en la playa. Tres piscinas, cuatro restaurantes, bar en la arena y zona de hamacas con vista al Pacífico. Para un grupo de amigos que quiere despertarse caminando hasta el mar y no pensar en logística. Desayuno buffet incluido y bar de playa que cierra el ciclo sin que nadie tenga que tomar decisiones adicionales. Precio estimado: $130–200 USD/noche por habitación.',
      tag: 'Resort de playa sin fricciones',
      affiliateUrl: '',
      archetypes: ['Familias', 'Parejas'],
    },
    {
      name: 'Wyndham Tamarindo',
      type: 'Hotel · Colina sobre Tamarindo',
      priceTier: '$$',
      description: 'En la colina sobre Tamarindo, con piscina infinity y vistas al Pacífico que son el argumento de venta que más aparece en los reviews. Shuttle gratuito al pueblo y al Langosta Beach Club cada hora — lo que resuelve la distancia sin necesitar auto. Para el grupo que quiere vistas espectaculares al atardecer y acceso fácil al pueblo para la noche. Precio estimado: $110–180 USD/noche por habitación.',
      tag: 'Vistas infinity y shuttle al pueblo',
      affiliateUrl: '',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'Base sin complicaciones para un fin de semana que no quiere fricción.',

  experiences: [
    {
      name: 'Surf o clases de surf en Playa Tamarindo',
      description: 'La ola de Tamarindo es larga, suave y perfecta para principiantes. Las escuelas de surf del pueblo (Witch\'s Rock Surf Camp, Tamarindo Surf School) ofrecen clases de dos horas por $60–80 USD con instructor privado. Para el grupo que nunca ha surfeado — o que lleva años queriendo intentarlo — este es el plan del sábado por la mañana.',
      tags: ['Surf', 'Principiantes', 'Playa'],
      affiliateUrl: '',
    },
    {
      name: 'Tour en kayak por el Estero El Salado',
      description: 'A 15 minutos en auto de Tamarindo, el manglar del Estero tiene cocodrilos tomando el sol en los bancos de arena, aves tropicales en los árboles y el silencio que no existe en el pueblo. Tours de 2 horas en kayak con guía por $40–55 USD por persona. El plan del domingo antes del vuelo de regreso.',
      tags: ['Kayak', 'Manglar', 'Naturaleza'],
      affiliateUrl: '',
    },
    {
      name: 'Atardecer en Playa Langosta',
      description: 'A dos kilómetros al sur de Tamarindo, Playa Langosta no tiene vendedores ni turistas con altavoces. Arena oscura, olas más fuertes y el atardecer más fotogénico de la zona. Se llega caminando por la playa en 25 minutos o en tuk-tuk en 10. El plan del viernes en la noche, recién llegados.',
      tags: ['Atardecer', 'Playa', 'Foto'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'El casado: El plato nacional de Costa Rica — arroz, frijoles negros, carne o pescado, plátano maduro y ensalada — es el almuerzo más honesto y más barato del viaje. En cualquier soda (restaurante local) de Tamarindo cuesta entre $7 y $12 USD. Úsalo como almuerzo de día activo.',
    'El pura vida: Úsalo. No como cliché — como instrucción de viaje. El ritmo de Guanacaste no acepta prisa. El transfer que llega tarde, el restaurante que tarda, la ola que no viene: todo se resuelve con la misma frase. El grupo que lo entiende el primer día pasa mejor fin de semana que el que lo aprende el último.',
    'Crema solar obligatoria: El sol del Pacífico Norte de Costa Rica a las 10am es el argumento más convincente para aplicar factor 50 antes de desayunar. La quemadura del primer día arruina el segundo.',
  ],

  funFact: 'Guanacaste fue parte de la República Federal de Centroamérica antes de anexarse a Costa Rica en 1824 por votación popular. El 25 de julio — Día de la Anexión — es la fiesta más importante de la provincia, con corridas de toros, música típica y fiestas civiles. Si el fin de semana coincide, la experiencia cambia por completo.',

  checklist: [
    '🩱 Traje de baño y ropa de playa',
    '🧴 Bloqueador solar factor 50',
    '🏄 Disposición para una clase de surf',
    '🕶️ Lentes de sol',
    '💵 Algunos dólares y colones en efectivo',
    '🥾 Sandalias y un par cómodo para caminar',
    '📷 Cámara para el atardecer en Langosta',
    '🧢 Gorra o sombrero para el sol del mediodía',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Internacional Daniel Oduber Quirós (LIR) en Liberia, a 80 kilómetros de Tamarindo. Vuelos directos desde Ciudad de México (Aeroméxico, Volaris), Miami, Houston y varias ciudades de los EE.UU. Transfer privado del aeropuerto a Tamarindo: 70–80 minutos, $60–80 USD por vehículo (no por persona).',
    },
    {
      mode: 'Ruta alterna',
      description: 'Aeropuerto Juan Santamaría (SJO) en San José, a 4.5 horas de Tamarindo. Solo si los vuelos a LIR están al tope o son significativamente más caros.',
    },
    {
      mode: 'Clima',
      description: 'La temporada seca en Guanacaste va de noviembre a abril — el verano por excelencia, con sol garantizado. De mayo a octubre es temporada de lluvias: mañanas soleadas, aguaceros de tarde de 30–60 minutos. Ambas funcionan para un fin de semana de playa.',
    },
  ],
}
