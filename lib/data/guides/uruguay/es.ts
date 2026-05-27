import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'uruguay',
  locale: 'es',

  hero: {
    title: 'Uruguay',
    subtitle: 'El país más tranquilo de América del Sur. Un viaje pensado para familias que quieren aventura sin adrenalina innecesaria, historia que se puede tocar y el asado más honesto del continente.',
    eyebrow: 'Guía curada · Familia & Naturaleza · 6 días',
    tags: ['Familia', 'Naturaleza', 'Historia', 'Calma'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Aterrizaje en Montevideo',
      items: [
        {
          time: '14:00',
          title: 'Check-in y descanso',
          description: 'Check-in en el Hyatt Centric.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Rambla de Pocitos con los niños',
          description: 'Tarde libre en la rambla — los niños en la playa urbana, los adultos con mate mirando el río.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Ciudad Vieja',
          description: 'Cena en el Mercado de los Artesanos: platos sencillos, precios razonables, ambiente de barrio.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Ciudad Vieja & Mercado del Puerto',
      items: [
        {
          time: '09:30',
          title: 'Recorrido Ciudad Vieja',
          description: 'Catedral Metropolitana, Cabildo, Teatro Solís. 90 minutos caminando.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Almuerzo en el Mercado del Puerto',
          description: 'El asado más fotogénico de Uruguay, con parrillas abiertas al público y ambiente de fervor local.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Museo Nacional de Historia Natural',
          description: 'Entrada gratuita, ideal para niños.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena tranquila en el barrio Pocitos',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Excursión al campo',
      items: [
        {
          time: '08:30',
          title: 'Salida en transfer',
          description: 'Transfer privado a una estancia a 60 kilómetros de Montevideo.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Llegada a la estancia',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Actividades en el campo',
          description: 'Cabalgata de 90 minutos y avistamiento de fauna: carpinchos libres en el campo.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Asado y sobremesa',
          description: 'Asado de mediodía con vino tannat de la región.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Regreso a Montevideo',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Traslado a Colonia del Sacramento',
      items: [
        {
          time: '09:00',
          title: 'Salida hacia Colonia',
          description: 'Bus o transfer a Colonia (2.5 horas).',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Check-in en Radisson',
          description: 'Llegada al Radisson antes del mediodía.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Recorrido por el Barrio Histórico a pie',
          description: 'El Faro, las calles empedradas del siglo XVII, la Puerta de la Ciudadela y el Paseo de San Gabriel.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Del Carmen Restaurante',
          description: 'Restaurante del hotel, con vistas al río.',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Colonia libre',
      items: [
        {
          time: '09:30',
          title: 'Desayuno buffet en el hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Museo Portugués y Museo Municipal',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en el restaurante Buen Suspiro',
          description: 'Vista al río, terraza.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Piscina / spa / tiempo libre',
          description: 'Piscina del hotel para los niños, spa para los adultos.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Atardecer desde el Faro',
          description: 'El Río de la Plata encendiéndose de naranja.',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Regreso tranquilo',
      items: [
        {
          time: '09:00',
          title: 'Desayuno',
          description: 'Desayuno largo.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Transfer a MVD',
          description: 'El transfer de regreso a Montevideo sale con tiempo para el vuelo vespertino.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Últimas horas en Montevideo o aeropuerto',
          description: 'Si el vuelo es nocturno, tarde libre en Pocitos para una última caminata por la rambla.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Radisson Hotel Colonia del Sacramento',
      type: 'Hotel · Colonia del Sacramento',
      priceTier: '$$$',
      description: 'A una cuadra del Barrio Histórico Patrimonio UNESCO, con vistas panorámicas al Río de la Plata y piscinas interior y exterior. Las habitaciones familiares con dos camas queen tienen balcón sobre el río — el desayuno buffet es el mejor argumento para no salir corriendo a explorar antes de las 9am. El parque de juegos en el jardín resuelve la primera media hora después de comer mientras los adultos toman café. Precio estimado: $110–160 USD/noche habitación familiar.',
      tag: 'Frente al Patrimonio UNESCO',
      affiliateUrl: '',
      archetypes: ['Familias'],
    },
    {
      name: 'Hyatt Centric Montevideo',
      type: 'Hotel · Montevideo · Pocitos',
      priceTier: '$$$',
      description: 'Frente a la rambla de Pocitos, con el letrero icónico de "MONTEVIDEO" visible desde la habitación. Piscina interior climatizada, habitaciones amplias con cuna disponible sin cargo y acceso directo a la playa urbana para los niños. El Plantado Restaurant sirve desayuno buffet con frutas tropicales y opciones para dietas infantiles. Para llegar al Mercado del Puerto en el casco histórico: 20 minutos en taxi o Uber. Precio estimado: $180–280 USD/noche habitación familiar.',
      tag: 'Frente a la rambla de Pocitos',
      affiliateUrl: '',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Dos bases para un viaje en familia: Montevideo y Colonia, ambas pensadas para descanso real.',

  experiences: [
    {
      name: 'Cruce en ferry a Colonia desde Buenos Aires',
      description: 'Si el viaje arranca desde Argentina, el Buquebus de 1 hora es el mejor primer recuerdo de Uruguay para niños. El río marrón del Plata, la cubierta al aire libre y la llegada al muelle de Colonia funcionan como umbral de entrada al país.',
      tags: ['Ferry', 'Familia', 'Cruce'],
      affiliateUrl: '',
    },
    {
      name: 'Estancia de un día en el campo uruguayo',
      description: 'A 60–80 kilómetros de Montevideo, las estancias históricas abren sus puertas para jornadas completas: avistamiento de ñandúes y carpinchos en libertad, recorrido a caballo por campos de eucaliptos y almuerzo de asado tradicional. La Estancia La Magdalena en Canelones y la Estancia Panagea en San José operan excursiones de día sin necesidad de pernoctar. Para niños de 4 años en adelante: la experiencia más memorable del viaje.',
      tags: ['Estancia', 'Campo', 'Asado'],
      affiliateUrl: '',
    },
    {
      name: 'Visita a las ruinas de Colonia Valdense',
      description: 'El pueblo de colonos valdenses fundado en 1858 a 30 kilómetros de Colonia del Sacramento tiene la arquitectura más inusual del Uruguay — casas de piedra con techos europeos en medio de la pampa. Para adolescentes y adultos que quieran salir del circuito turístico estándar.',
      tags: ['Historia', 'Arquitectura', 'Off the beaten path'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'El tannat: El vino emblema de Uruguay es un tinto de uva francesa que aquí encuentra su mejor expresión. Si la excursión al campo incluye bodega, aprovecha. El Pisano y el Bouza son las referencias nacionales que los niños toleran ver en la mesa de los adultos sin protestar demasiado.',
    'Tarjeta en todos lados, pero lleva pesos: Los hoteles y restaurantes aceptan tarjeta. Los mercados, las estancias y los puestos callejeros de Colonia prefieren pesos uruguayos. Cambio disponible en el aeropuerto y en cualquier banco de Montevideo.',
    'La rambla de Pocitos: Es el parque lineal más largo de América del Sur — 22 kilómetros junto al río. Con niños pequeños, una hora de caminata por la rambla en la mañana funciona mejor que cualquier actividad organizada.',
  ],

  funFact: 'Uruguay fue el primer país de América Latina en legalizar el matrimonio igualitario (2013), en distribuir marihuana de forma regulada por el Estado (2013) y en tener conexión a internet en todas sus escuelas públicas (Plan Ceibal, 2007). En un continente de contrastes, Uruguay es una gran excepción.',

  checklist: [
    '🧥 Capas para el invierno austral (10–17°C)',
    '🧣 Bufanda y guantes para el viento del Plata',
    '👟 Calzado cómodo para empedrados de Colonia',
    '🧉 Mate o termo (opcional, te van a invitar igual)',
    '💵 Pesos uruguayos para mercados y estancias',
    '📷 Cámara para el atardecer en el Faro',
    '🐎 Ropa cómoda para la cabalgata en la estancia',
    '🍷 Disposición para probar tannat',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Llegada al Aeropuerto Internacional de Carrasco (MVD), a 20 kilómetros de Montevideo centro. Taxi o transfer privado al hotel: 30–40 minutos, $30–40 USD.',
    },
    {
      mode: 'Traslados',
      description: 'Uruguay es un país de distancias manejables. De Montevideo a Colonia: 2.5 horas en auto o bus. Los buses de COT y Turil son cómodos, puntuales y tienen baño — opción válida para familias. Para excursiones al campo: transfer privado o alquiler de auto ($40–70 USD/día).',
    },
    {
      mode: 'Clima',
      description: 'Junio–julio es invierno austral. Temperaturas de 10–17°C, días despejados y cielos limpios. Lleva capas — la rambla de Montevideo con viento del Plata puede sorprender. No es temporada de playa, pero sí la mejor para el campo y la ciudad.',
    },
  ],
}
