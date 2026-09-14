import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'capadocia',
  locale: 'es',

  hero: {
    title: 'Capadocia, Turquía',
    subtitle: 'El paisaje que parece generado por inteligencia artificial lleva 60 millones de años en el mismo lugar: las chimeneas de hadas son el escenario más fotografiado de Turquía. Septiembre trae 26–28°C de día, cielos despejados y la probabilidad de vuelo en globo más alta del año, 85–90%, porque el viento otoñal aún no llega y las lluvias de verano ya pasaron.',
    eyebrow: 'Guía curada · Viaje entre amigos · 6 días · Presupuesto medio',
    tags: ['Amigos', 'Globo', 'Paisaje'],
    image: '/images/guides/capadocia.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada y primera noche en Göreme',
      items: [
        {
          time: '14:00',
          title: 'Llegada al aeropuerto y transfer al hotel',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Paseo por el centro de Göreme',
          description: '',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Museo al Aire Libre de Göreme',
          description: 'Cierra a las 19:30 en septiembre, entrada: $15 USD. A 1.5 km del centro caminando',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en terraza con vistas al valle',
          description: 'Alguno de los restaurantes de la calle principal',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Vuelo en globo al amanecer',
      items: [
        {
          time: '05:30',
          title: 'Recogida en el hotel para el vuelo en globo',
          description: 'El plan del día más importante, según la hora del amanecer puede variar entre las 5:00 y las 6:30am',
          tags: [],
        },
        {
          time: '07:00–08:00',
          title: 'Vuelo sobre Capadocia al amanecer',
          description: '',
          tags: [],
        },
        {
          time: '08:30',
          title: 'Champán y certificado de vuelo',
          description: '',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Regreso al hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Desayuno tardío',
          description: '',
          tags: [],
        },
        {
          time: 'Tarde',
          title: 'Tarde libre de recuperación',
          description: 'Piscina (si el hotel la tiene), lectura',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Tour de valles y las ciudades subterráneas',
      items: [
        {
          time: '09:00',
          title: 'Salida hacia Paşabağ (Valle de los Monjes)',
          description: 'En taxi privado o tour',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Valle Rojo',
          description: 'Senderismo de 2 horas desde Çavuşin, nivel fácil',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Almuerzo en el camino',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Ciudad Subterránea de Derinkuyu',
          description: 'Entrada: $8 USD. Excavada a 85 metros de profundidad con capacidad para 20,000 personas, usada como refugio por los primeros cristianos',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Regreso a Göreme',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena con el grupo',
          description: 'La noche más larga del viaje',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Uchisar, Avanos y cerámica',
      items: [
        {
          time: '09:30',
          title: 'Drive a Uchisar',
          description: '15 minutos',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Castillo de Uchisar y vistas panorámicas',
          description: 'El punto más alto de Capadocia, con vistas de 360 grados a todos los valles',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Drive a Avanos',
          description: '20 minutos',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Almuerzo en Avanos',
          description: 'A orillas del río Kızılırmak',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Taller de cerámica roja en Avanos',
          description: 'La cerámica de arcilla del río tiene 3,000 años de historia ininterrumpida. Los talleres permiten hacer tu propia pieza',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Regreso a Göreme',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Espectáculo de los Derviches Girantes',
          description: 'Teatro Saruhan, Avanos — reserva previa',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Día libre: ATV, senderismo o no hacer nada',
      items: [
        {
          time: 'Mañana',
          title: 'ATV por el Valle de las Palomas o el Valle de Amor',
          description: 'O senderismo libre desde el centro de Göreme al amanecer antes de que lleguen los tours',
          tags: [],
        },
        {
          time: 'Alternativa',
          title: 'Mañana entera en la terraza del hotel',
          description: 'Café turco y el desfile de globos al fondo',
          tags: [],
        },
        {
          time: 'Noche',
          title: 'Última cena del grupo',
          description: 'En el restaurante más serio de Göreme',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Regreso',
      items: [
        {
          time: '',
          title: 'Desayuno y transfer al aeropuerto',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Cappadocia Cave Lodge',
      type: 'Hotel cueva · Göreme',
      priceTier: '$$$',
      description: 'El hotel cueva más valorado de Göreme: calificación 9.6 sobre 10 en Booking y 9.7 de ubicación. Habitaciones excavadas en la roca volcánica con chimenea, minibar y terraza privada con vistas a las chimeneas de hadas. Desde la azotea del hotel se ve el despegue de los globos al amanecer, el plan del primer día resuelto sin moverse del hotel. Para el grupo de amigos que quiere el hotel correcto: Cave Lodge es la referencia objetiva de Göreme. Precio estimado: €120–220/noche.',
      tag: 'La referencia objetiva de Göreme',
      affiliateUrl: 'https://www.booking.com/hotel/tr/cappadocia-cave-lodge.html',
      archetypes: [],
    },
    {
      name: 'Cappadocia Cave Suites',
      type: 'Suites cueva · Göreme',
      priceTier: '$$$',
      description: 'Habitaciones de lujo y suites en cuevas reales con diseño cálido y acogedor en ubicación central en Göreme. La terraza Sunset Café sirve bebidas y aperitivos con vistas al valle todo el día, y el restaurante Historia tiene cocina local en ambiente relajado. Tours de globo, espectáculos de derviches girantes y paseos a caballo organizados por el hotel. Para el grupo que quiere estar en el centro del pueblo sin sacrificar el carácter de cueva. Precio estimado: €110–200/noche.',
      tag: 'En el centro de Göreme, sin sacrificar el carácter de cueva',
      affiliateUrl: 'https://www.booking.com/hotel/tr/cappadocia-cave-suites.html',
      archetypes: [],
    },
    {
      name: 'Grand Cave Suites',
      type: 'Hotel cueva · Göreme',
      priceTier: '$$$',
      description: 'Construido dentro de la roca en un edificio de piedra renovado en 2013, con terrazas de vistas a Göreme desde todas las habitaciones. Habitaciones auténticas en cueva con paredes arqueadas de piedra, bañera de hidromasaje en algunas suites y calificación 9.6 para parejas en Booking. Para el grupo que quiere las fotos más dramáticas del viaje: las terrazas de Grand Cave Suites al atardecer con los globos en el horizonte son la imagen de referencia de Capadocia. Precio estimado: €100–180/noche.',
      tag: 'Las terrazas con la mejor vista de globos al atardecer',
      affiliateUrl: 'https://www.booking.com/hotel/tr/grand-cave-suites.html',
      archetypes: [],
    },
  ],

  hotelsDescription: 'Göreme como base, dormir dentro de la roca a minutos de todo lo demás.',

  experiences: [
    {
      name: 'Vuelo en Globo al Amanecer sobre Göreme',
      description: 'El vuelo en globo sobre las chimeneas de hadas de Göreme al amanecer es la experiencia más fotografiada de Turquía y una de las más impresionantes a nivel mundial. Recogida en el hotel 1 hora antes del amanecer, desayuno ligero en el punto de despegue, 1 hora de vuelo a hasta 600 metros de altura sobre el paisaje volcánico y brindis de champán al aterrizar. Certificado de vuelo incluido. Para el grupo que tiene un solo plan inamovible en los seis días: este es.',
      tags: ['Globo', 'Amanecer', 'Imprescindible'],
      affiliateUrl: 'https://www.getyourguide.com/cappadocia-l1400/cappadocia-goreme-hot-air-balloon-flight-at-sunrise-t26992/',
    },
    {
      name: 'Royal Queen Hot Air Balloon Tour',
      description: 'La versión premium del vuelo en globo: canasta más pequeña, servicio más personalizado, desayuno incluido y cobertura de seguro de Eureko Insurance. Para el grupo que quiere repetir la experiencia o para quienes buscan la versión con más espacio y menos personas en la misma cesta. Organizado por Royal Balloon, uno de los operadores más veteranos de Capadocia.',
      tags: ['Globo premium', 'Royal Balloon', 'Amanecer'],
      affiliateUrl: 'https://www.getyourguide.com/cappadocia-l1400/cappadocia-royal-queen-hot-air-balloon-tour-at-sunrise-t13752/',
    },
    {
      name: 'Globo + Tour de lo Mejor de Capadocia: Día Completo',
      description: 'Combinación de vuelo en globo al amanecer más tour de día completo por los principales sitios de Capadocia: Museo al Aire Libre de Göreme (iglesias del siglo X excavadas en la roca con frescos bizantinos), Uchisar (el castillo más alto de la región), el Valle de los Monjes de Paşabağ (chimeneas de hadas con cabezas dobles) y una visita a un taller de cerámica en Avanos. La opción más eficiente para el grupo que tiene solo 6 días y quiere el panorama completo sin renunciar al globo.',
      tags: ['Globo', 'Tour día completo', 'Panorama'],
      affiliateUrl: 'https://www.getyourguide.com/cappadocia-l1400/hot-air-balloon-and-best-of-cappadocia-city-tour-t377126/',
    },
  ],

  experiencesDescription: 'Globos, caballos y valles de roca.',

  tips: [
    'El globo en septiembre: la probabilidad de vuelo es de aproximadamente 85–90% en septiembre, la más alta del año. Los días de viento fuerte (los operadores cancelan si la seguridad lo requiere) son reales pero infrecuentes. Si el vuelo se cancela el día reservado, la mayoría de los operadores ofrecen reprogramar al día siguiente o reembolso completo. Reservar para el segundo día del viaje, no el último, da margen para reprogramar.',
    'La lirafobia: la lira turca (TRY) fluctúa significativamente. Los hoteles y experiencias suelen cotizar en USD o EUR, más estable. El efectivo en TRY es útil para restaurantes locales, mercados y taxi. No cambies más de lo necesario y lleva tarjeta internacional con pocas comisiones.',
    'El café turco: se pide, se espera 3 minutos a que el poso baje al fondo, se bebe lento y se deja el poso. El café turco no se revuelve. La primera sorpresa del grupo que lo pide sin saber esto: el amargo del poso al final del vaso es la bienvenida oficial a Turquía.',
  ],

  funFact: 'Las chimeneas de hadas de Capadocia son el resultado de 60 millones de años de erosión sobre las capas de ceniza volcánica del Monte Erciyes y el Monte Hasan. La capa de roca basáltica más dura en la cima protege la roca más blanda debajo: cuando la capa dura cae, la columna entera se desintegra. Las que tienen "sombreros" todavía intactos son las más jóvenes del paisaje. La NASA ha utilizado Capadocia como análogo geológico para simular condiciones de Marte.',

  checklist: [
    '🎈 Reserva del vuelo en globo para el día 2, no el último',
    '🧥 Capa o chamarra ligera para el amanecer del globo (a 600m hace frío)',
    '👟 Calzado cómodo para senderismo por los valles',
    '💵 Efectivo en TRY para restaurantes locales, mercados y taxi',
    '💳 Tarjeta internacional con pocas comisiones para hoteles y tours',
    '📷 Cámara cargada para el amanecer y el despegue de los globos',
    '🎭 Reserva previa para el espectáculo de Derviches Girantes en Avanos',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Dos aeropuertos sirven Capadocia. El Aeropuerto de Nevşehir Kapadokya (NAV) está a 40 km de Göreme, el más cercano, con vuelos domésticos desde Estambul (Turkish Airlines, Pegasus, 1.5 horas). El Aeropuerto de Kayseri (ASR) está a 80 km, con más conexiones internacionales pero más lejos. Desde México: conexión en Estambul (Turkish Airlines, vuelos directos CDMX–IST). Transfer desde el aeropuerto a Göreme: shuttle organizado por el hotel o taxi privado (~400–600 TRY).',
    },
    {
      mode: 'Desde Estambul',
      description: 'Turkish Airlines y Pegasus tienen vuelos domésticos cada 1–2 horas a Nevşehir y Kayseri. El bus nocturno desde Estambul (10–11 horas) también es opción para el grupo con presupuesto ajustado y tiempo disponible.',
    },
    {
      mode: 'Moverse en Capadocia',
      description: 'Göreme es suficientemente pequeño para moverse a pie entre el centro y los hoteles. Para los valles y sitios más alejados: alquiler de ATV o scooter ($30–60 USD/día), tour organizado o taxi local. Las rutas de senderismo conectan Göreme con el Valle Rojo, el Valle de las Palomas y el Valle de Amor, todas accesibles a pie directamente desde el centro del pueblo.',
      tip: 'Clima en septiembre: 26–28°C de día, 15–18°C de noche. El mejor mes del año para el vuelo en globo, la proporción de vuelos cancelados por viento es la más baja de todo el calendario anual. Lleva una capa para el amanecer del globo: a 600 metros de altura con el sol recién saliendo, la temperatura es notablemente más baja que en tierra.',
    },
  ],
}
