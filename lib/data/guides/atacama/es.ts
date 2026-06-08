import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'atacama',
  locale: 'es',

  hero: {
    title: 'San Pedro de Atacama, Chile',
    subtitle: 'El desierto más seco del mundo tiene géiseres al amanecer, lagunas con flamencos rosados y un cielo nocturno que los niños van a recordar más que cualquier parque de atracciones. Y no requiere presupuesto de resort para vivirlo bien.',
    eyebrow: 'Guía curada · Familia con niños pequeños · 5 días · Presupuesto limitado',
    tags: ['Familia', 'Niños pequeños', 'Naturaleza', 'Presupuesto'],
    image: '/images/guides/atacama.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada y aclimatación',
      items: [
        {
          time: '12:00',
          title: 'Check-in y descanso',
          description: 'Llegada al hotel antes del mediodía.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Caminata por el pueblo, reserva de tours',
          description: 'La calle Caracoles tiene agencias de tour, mercado de artesanías y heladerías. Comparar precios entre dos o tres agencias antes de decidir.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena en alguno de los restaurantes económicos de Caracoles',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cielo de Atacama en el patio del hotel',
          description: 'Sin tour, solo mirando.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Valle de la Luna',
      items: [
        {
          time: '09:00',
          title: 'Desayuno',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Museo Arqueológico',
          description: 'Entrada libre, excelente para explicarle a niños la cultura atacameña. Una hora.',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Piscina del hotel / tiempo libre',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Tour Valle de la Luna o bicicletas',
          description: 'Valle de la Luna en bicicleta o en tour grupal.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Atardecer en el Valle',
          description: 'Las dunas funcionan como tobogán natural.',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena y dormir temprano',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Géiseres del Tatio',
      items: [
        {
          time: '04:00',
          title: 'Salida en tour',
          description: 'El día más temprano. Desayuno incluido en el tour.',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Regreso al pueblo',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Desayuno tardío en el hotel',
          description: '',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Descanso / piscina',
          description: 'Siesta larga, piscina, nada que requiera esfuerzo.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena tranquila',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Lagunas y flamencos',
      items: [
        {
          time: '08:00',
          title: 'Salida en tour',
          description: 'Tour de día completo a las Lagunas Altiplánicas (Miscanti y Miñiques).',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Regreso al pueblo',
          description: 'El almuerzo se hace en el camino — llevar snacks y agua.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Mercado de artesanías',
          description: 'Tarde libre en el pueblo para comprar artesanías en el mercado local.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena y preparación del regreso',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Mañana libre y vuelo de regreso',
      items: [
        {
          time: '09:00',
          title: 'Desayuno largo',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Última caminata por el pueblo',
          description: 'O el tour de observación de estrellas si es diurno (algunos operadores tienen telescopios en el día para ver el sol y la luna simultáneamente).',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Transfer a Calama',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Vuelo de regreso a Santiago',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hoteles Pueblo de Tierra',
      type: 'Hotel · San Pedro de Atacama',
      priceTier: '$$',
      description: 'Hotel de categoría media en San Pedro con piscina al aire libre y desayuno incluido que empieza a las 4am para los que salen a los géiseres del Tatio. Habitaciones con calefacción — el frío de la noche en el desierto a 2,400 metros sorprende — y personal habituado a organizar tours para familias. A cinco minutos caminando del terminal de buses. Precio estimado: $80–130 USD/noche habitación familiar.',
      tag: 'Mejor relación precio-comodidad',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/SwxT-6Dqas',
      archetypes: ['Familias'],
    },
    {
      name: 'Lodge Quelana',
      type: 'Hotel · San Pedro de Atacama',
      priceTier: '$$',
      description: 'Para las familias con el presupuesto más ajustado: habitaciones privadas con baño, patio interior tranquilo y desayuno casero incluido. A 15 minutos caminando del centro — distancia que con niños pequeños puede resolverse en tuk-tuk por $2. La propietaria adapta el desayuno para salidas de madrugada con algo para llevar. La opción más honesta del rango bajo en San Pedro.',
      tag: 'La opción más honesta del rango bajo',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/_Rk0FuD10c',
      archetypes: ['Familias'],
    },
    {
      name: 'Hostal Belen',
      type: 'Hostal · San Pedro de Atacama',
      priceTier: '$',
      description: 'Para las familias con el presupuesto más ajustado: habitaciones privadas con baño, patio interior tranquilo y desayuno casero incluido. A 15 minutos caminando del centro — distancia que con niños pequeños puede resolverse en tuk-tuk por $2. La propietaria adapta el desayuno para salidas de madrugada con algo para llevar. La opción más honesta del rango bajo. Precio estimado: $40–65 USD/noche habitación familiar.',
      tag: 'Honesto y económico para familias',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/caPigyS07F',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Base cómoda, precio honesto — tres opciones según presupuesto.',

  experiences: [
    {
      name: 'Géiseres del Tatio al amanecer',
      description: 'El campo geotérmico más alto del mundo (4,320 metros) a 90 kilómetros de San Pedro. El tour sale a las 4am para llegar al amanecer, cuando los géiseres alcanzan su máxima actividad con el contraste de temperatura. Para niños de 4 años en adelante: el espectáculo de vapor, agua hirviendo y sol naciendo sobre los volcanes no requiere explicación. Todos los tours incluyen desayuno caliente en el sitio. Tour organizado por agencia: $20–30 USD por persona.',
      tags: ['Géiseres', 'Amanecer', 'Familia'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/klCBsc0o2Q',
    },
    {
      name: 'Valle de la Luna al atardecer',
      description: 'A 15 kilómetros de San Pedro, el valle de formaciones de sal y arcilla que la NASA usa como análogo marciano para entrenar astronautas. El recorrido en bicicleta — alquiler disponible en el pueblo por $8–12 USD/día — o en tour grupal tiene dunas de sal para trepar y el atardecer más fotogénico del desierto. Para niños de cualquier edad: las dunas funcionan como tobogán natural.',
      tags: ['Atardecer', 'Bicicleta', 'Dunas'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/zMkLv3dwE-',
    },
    {
      name: 'Lagunas Altiplánicas y flamencos',
      description: 'Las lagunas Miscanti y Miñiques, a 4,200 metros, tienen colonias de flamencos rosados que se alimentan de algas rojas en el agua salada. Tour de día completo: $25–35 USD por persona. Para niños que ya saben qué es un flamenco y los ven en zoológico: verlos en libertad a veinte metros es una experiencia de otra categoría.',
      tags: ['Lagunas', 'Flamencos', 'Altiplano'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/_NIFOG54ed',
    },
  ],

  tips: [
    'El frío de la noche: A 2,400 metros, las noches de Atacama bajan a 5–8°C incluso en verano. Para el tour del Tatio (salida 4am), lleva chaqueta polar, guantes y gorro para los niños — dentro del bus hace calor, pero los 30 minutos en el exterior de los géiseres son intensos.',
    'El tour barato no existe: Las agencias de Caracoles tienen precios muy similares entre sí porque los costos son los mismos (combustible, guía, permisos, seguro). La diferencia real está en el tamaño del grupo y el idioma del guía. Para familias con niños pequeños: elige siempre grupo pequeño (máximo 8 personas) aunque cueste $5 más.',
    'El mercado vs. las tiendas de Caracoles: Las artesanías del mercado local — tejidos, cerámica atacameña, colgantes de piedra volcánica — cuestan entre un 30% y 50% menos que en las tiendas de la calle Caracoles. Para niños que quieren llevarse algo del desierto: el mercado tiene piezas pequeñas a $2–5 USD.',
  ],

  funFact: 'El desierto de Atacama tiene zonas donde no se ha registrado precipitación en más de 400 años. Es tan árido que la NASA lo usa como análogo de Marte para probar rovers y entrenar astrobiólogos. La misma aridez que hace hostil la vida lo convierte en el mejor lugar del mundo para la astronomía: más de 300 noches despejadas al año y la menor contaminación lumínica del hemisferio sur.',

  checklist: [
    '🧥 Chaqueta polar para todos (noches a 5–8°C)',
    '🧤 Guantes y gorro para los géiseres del Tatio',
    '💧 Botella de agua de 500ml por persona',
    '🧴 Bloqueador solar factor alto (sol de altitud)',
    '🕶️ Lentes de sol con buena protección UV',
    '👟 Zapatos cómodos para arena, sal y piedra',
    '🧦 Calcetines extra (los géiseres mojan)',
    '💵 Pesos chilenos en efectivo para mercado y tours',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto El Loa (CJC) en Calama, a 100 kilómetros de San Pedro. Vuelos directos desde Santiago (SCL) con LATAM, Sky Airline y JetSMART, 2 horas de trayecto. Transfer desde Calama a San Pedro: bus de Transfer Atacama ($9–12 USD/persona) o transfer privado ($80–100 USD por vehículo). El bus es la opción familiar más económica si los niños toleran 90 minutos de ruta.',
    },
    {
      mode: 'Altitud',
      description: 'San Pedro está a 2,400 metros — menos crítico que Cusco, pero los niños pequeños son más sensibles. Los primeros dos días hay que ir despacio, no hacer tours de alta altitud (el Tatio está a 4,320 metros — reservar para el día 3 o 4). Hidratación permanente.',
    },
    {
      mode: 'Agua',
      description: 'El agua del grifo en San Pedro no es apta para consumo. Los hoteles proveen agua embotellada; las agencias de tour llevan bidones. Para niños, lleva siempre una botella de 500ml por persona.',
    },
  ],
}
