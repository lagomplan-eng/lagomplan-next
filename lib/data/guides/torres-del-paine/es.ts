import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'torres-del-paine',
  locale: 'es',

  hero: {
    title: 'Torres del Paine, Chile',
    subtitle: 'Agosto es un gran momento para ir a las Torres del Paine. La temporada alta de diciembre tiene colas para el trekking y precios de resort; agosto tiene el parque casi solo, los mismos guanacos y los mismos lagos de un azul imposible, con 40% menos de precio y nieve en las montañas que hace las fotos más dramáticas del año.',
    eyebrow: 'Guía curada · Pareja sin hijos · Torres del Paine · 8 días · Presupuesto bajo',
    tags: ['Pareja', 'Trekking', 'Naturaleza'],
    image: '/images/guides/torres-del-paine.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Punta Arenas y Puerto Natales',
      items: [
        {
          time: '13:00',
          title: 'Llegada a PUQ',
          description: 'Bus o transfer a Puerto Natales (3 horas)',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Check-in en The Singing Lamb',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Paseo por el centro de Puerto Natales y el muelle',
          description: 'La ciudad tiene tres calles y un frente de mar al Seno Última Esperanza, el estuario donde termina el mundo',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Aldea Restaurant',
          description: 'El mejor de la ciudad, cocina patagónica con cordero y centolla',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Orientación al parque',
      items: [
        {
          time: '08:00',
          title: 'Desayuno en el hostal',
          description: '',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Salida en Full Day Tour desde Puerto Natales',
          description: 'Paradas en los miradores principales del parque para ver la geografía completa antes de caminarla',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Regreso a Puerto Natales',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena y preparación del equipaje',
          description: 'Última noche antes de entrar al parque',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Entrada al parque, Mirador Base Las Torres',
      items: [
        {
          time: '07:30',
          title: 'Transfer de Puerto Natales al parque nacional',
          description: '1.5 horas',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Inicio del sendero desde Hostería Las Torres',
          description: 'El sendero más icónico de Torres del Paine: 18 km ida y vuelta, +850m de desnivel',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Llegada al Mirador Base Las Torres',
          description: 'Almuerzo en el mirador, frente a la laguna glacial con las tres torres de granito rosa encima',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Descenso',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Check-in en EcoCamp Standard Dome',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Cena comunitaria en el gran domo de EcoCamp',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Valle del Francés',
      items: [
        {
          time: '08:00',
          title: 'Desayuno en EcoCamp',
          description: 'Salida hacia el Valle del Francés',
          tags: [],
        },
        {
          time: '08:30',
          title: 'Trek al Valle del Francés',
          description: '18km, refugio Los Cuernos como base intermedia. Paredes de 3,000 metros en vertical con avalanchas de hielo constantes',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena en EcoCamp',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Lago Grey y el glaciar',
      items: [
        {
          time: '08:00',
          title: 'Desayuno y salida hacia Lago Grey',
          description: '',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Glacier Grey Boat Tour',
          description: 'Reserva previa. Icebergs desprendidos del frente glaciar, algunos del tamaño de edificios de cuatro pisos',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Regreso al muelle',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Trek libre por la orilla del lago',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Última cena en EcoCamp',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Patagonia Camp, noche de yurta',
      items: [
        {
          time: '09:00',
          title: 'Check-out de EcoCamp',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Check-in en Patagonia Camp',
          description: 'La noche de mayor confort del viaje: yurtas de lujo en el bosque de lenga sobre el Lago Toro',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en el lodge',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Excursión incluida en el programa de Patagonia Camp',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en el lodge de la yurta',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Último día en el parque',
      items: [
        {
          time: '09:00',
          title: 'Actividad matutina libre',
          description: 'Senderismo suave o kayak en el lago según las condiciones',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Transfer a Puerto Natales',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Última vuelta por el centro',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena de despedida en Mesita Grande',
          description: 'Pizza de cordero patagónico, el mejor cierre disponible',
          tags: [],
        },
      ],
    },
    {
      day: 8,
      title: 'Regreso',
      items: [
        {
          time: '08:00',
          title: 'Desayuno y check-out',
          description: '',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Bus a Punta Arenas',
          description: '3 horas',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Llegada a PUQ',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Vuelo de regreso a Santiago',
          description: 'Horario según disponibilidad de LATAM o Sky Airline',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'EcoCamp Patagonia — Standard Dome',
      type: 'Domo geodésico · Torres del Paine',
      priceTier: '$$',
      description: 'Los domos geodésicos más fotografiados del planeta están inspirados en los refugios de la comunidad kawésqar, los primeros habitantes de la Patagonia. El Standard Dome es la opción más accesible de EcoCamp: 10 metros cuadrados, ventana cenital para ver las estrellas desde la cama, manta de polar y baño compartido. Sin electricidad, sin calefacción eléctrica, sin WiFi, sin señal de móvil. El primer hotel sustentable dentro del parque opera con energía solar, sistemas de compostaje y calentadores de agua por energía solar térmica. Los gorilas del paisaje, las torres de granito rosa, son visibles desde la ventana. Calificación de Booking para parejas: 9.6 sobre 10. Precio estimado: $120–200 USD/noche (baja temporada agosto).',
      tag: 'Domos sustentables con vista a las torres',
      affiliateUrl: 'https://www.booking.com/hotel/cl/ecocamp-patagonia.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'Hostal The Singing Lamb',
      type: 'Hostal · Puerto Natales',
      priceTier: '$',
      description: 'El hostal más social y mejor valorado de Puerto Natales, la ciudad gateway de Torres del Paine a 1.5 horas del parque. Habitaciones privadas con baño, cocina comunitaria equipada, salón con chimenea, biblioteca de guías de trekking y el tablero de información más actualizado sobre condiciones del parque disponible en la ciudad. Para las noches de llegada y salida antes y después de entrar al parque. Precio estimado: $45–80 USD/noche habitación privada.',
      tag: 'El hostal más social de Puerto Natales',
      affiliateUrl: 'https://www.booking.com/hotel/cl/the-singing-lamb.en-gb.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'Patagonia Camp',
      type: 'Yurtas de lujo · Lago Toro, Torres del Paine',
      priceTier: '$$$',
      description: 'Para la noche de mayor inversión del viaje: yurtas de lujo en el bosque de lenga sobre el Lago Toro, con calefacción, camas reales, baño privado y ventanas panorámicas hacia las montañas del parque. Programa all-inclusive con excursiones guiadas incluidas y el ambiente de campamento de lujo que justifica el precio en el contexto de Patagonia en temporada baja. Para la pareja que quiere contrastar dos noches de Standard Dome con una noche de yurta. Precio estimado: $280–400 USD/noche (baja temporada agosto).',
      tag: 'Yurtas con chimenea sobre el Lago Toro',
      affiliateUrl: 'https://www.booking.com/hotel/cl/patagonia-camp.html',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'Puerto Natales como base, EcoCamp y Patagonia Camp dentro del parque.',

  experiences: [
    {
      name: 'Glacier Grey Boat Tour',
      description: 'El Glaciar Grey tiene 6 kilómetros de frente azul de hielo sobre el Lago Grey. El tour en catamarán desde el muelle del Refugio Grey acerca la embarcación hasta los icebergs desprendidos del frente glaciar, algunos del tamaño de edificios de cuatro pisos, con el azul imposible del hielo comprimido durante miles de años. Para la pareja que no quiere el W Trek completo: el paseo en barca al Grey es el plan más impactante del parque en medio día.',
      tags: ['Glaciar Grey', 'Catamarán', 'Medio día'],
      affiliateUrl: 'https://www.getyourguide.com/torres-del-paine-national-park-l95549/torres-del-paine-3-hour-scenic-boat-tour-to-grey-glacier-t297935/',
    },
    {
      name: 'Torres del Paine W Trek',
      description: 'El W Trek recorre 80 kilómetros en 4–5 días usando los refugios de Las Torres y Vértice Patagonia. La ruta nombrada por la forma que dibuja en el mapa incluye el Mirador Base Las Torres (el más icónico), el Valle del Francés y el Glaciar Grey. En agosto la nieve en las torres hace las fotos más dramáticas del año y los senderos tienen menos tráfico que en temporada alta. Reserva con antelación.',
      tags: ['W Trek', 'Multi-día', 'Refugios'],
      affiliateUrl: 'https://www.getyourguide.com/s/?q=Torres%20del%20Paine%20W%20Trek',
    },
    {
      name: 'Torres del Paine: Full Day Tour desde Puerto Natales',
      description: 'Día completo desde Puerto Natales con paradas en los miradores principales del parque: Lago Nordenskjöld, Salto Grande, Lago Pehoé y Glaciar Grey. La orientación más completa del parque antes de entrar a caminar. Pickup incluido desde el hotel.',
      tags: ['Full day', 'Miradores', 'Pickup incluido'],
      affiliateUrl: 'https://www.getyourguide.com/puerto-natales-l32145/torres-del-paine-park-full-day-tour-from-puerto-natales-t216822/',
    },
  ],

  experiencesDescription: 'Trekking, glaciares y las Torres bajo la nieve de agosto.',

  tips: [
    'Las capas son el sistema: El viento patagónico no respeta pronósticos. La técnica de capas, base térmica, capa media de polar, membrana exterior cortaviento, funciona mejor que cualquier chaqueta única "para todo". La pareja que llega con capas separadas se adapta al clima que cambia cuatro veces en un día.',
    'La reserva de refugios: Los refugios del W Trek en agosto tienen menor ocupación que en diciembre pero no significa que estén vacíos, muchos grupos de trekking también prefieren la temporada baja. Reservar con al menos 30 días de anticipación en lastorres.com para los refugios del lado este y en vertice.travel para Paine Grande y Grey.',
    'El cordero patagónico: El cordero asado en varilla (al palo) es el plato más representativo de la Patagonia chilena. En Puerto Natales, el Mesita Grande lo sirve con pizza en versión informal; La Última Esperanza lo tiene en versión de restaurante. Para la última cena antes del vuelo de regreso: el cordero, el Carménère de la copa y la vista al estuario.',
  ],

  funFact: 'EcoCamp fue el primer alojamiento completamente sustentable dentro del Parque Nacional Torres del Paine, siendo los domos el primer cuarto de hotel geodésico del mundo. El diseño está inspirado en los refugios de los kawésqar, los primeros habitantes humanos de la Patagonia, y fue el modelo que se replicó después en docenas de hoteles de domo en Europa, Argentina y Chile. Dormir en EcoCamp es dormir en el prototipo original.',

  checklist: [
    '🥾 Botas impermeables con forro polar',
    '🧗 Pantalón de montaña con membrana',
    '🧥 Chaqueta cortaviento',
    '🧦 Capas térmicas para los -5 a 10°C del día',
    '🥢 Bastones de trekking para el sendero a Las Torres',
    '💵 Efectivo o tarjeta para la entrada CONAF (~$27 USD/persona)',
    '📅 Reservas de refugios y EcoCamp hechas con 30 días de anticipación',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Carlos Ibáñez del Campo (PUQ) en Punta Arenas, con vuelos directos desde Santiago (SCL) con LATAM y Sky Airline (3 horas). Desde Punta Arenas: bus directo a Puerto Natales (3 horas, $15–20 USD) o transfer privado. Alternativa: vuelo a El Calafate (Argentina) y cruce terrestre a Puerto Natales (5 horas en bus, visado no requerido entre Chile y Argentina para la mayoría de latinoamericanos).',
    },
    {
      mode: 'Agosto en Patagonia',
      description: 'Invierno austral, temperaturas de -5 a 10°C durante el día. Las torres pueden tener nieve en las cimas. Los refugios del W Trek están operativos pero con menos capacidad. El viento patagónico en agosto puede llegar a 80 km/h en ráfagas, las puertas de los domos de EcoCamp están diseñadas para eso.',
      tip: 'Equipo de invierno para las dos personas: botas impermeables con forro polar, pantalón de montaña con membrana, chaqueta cortaviento. No hay negociación con el equipo en Patagonia en agosto.',
    },
    {
      mode: 'Entrada al parque',
      description: 'CONAF cobra entrada al parque en las garitas, en 2025 fue aproximadamente $27 USD por persona para no residentes. Reservar el acceso al Mirador Base Las Torres es obligatorio en algunas temporadas, verificar en pasesparques.cl.',
    },
  ],
}
