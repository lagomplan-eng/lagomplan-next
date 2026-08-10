import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'napa-sonoma',
  locale: 'es',

  hero: {
    title: 'Napa Valley & Sonoma, California',
    subtitle: 'El primer valle vitícola del mundo con programa de certificación sustentable. Cinco días diseñados para beber bien, pedalear entre viñedos orgánicos y descubrir que la viticultura regenerativa no es una moda, es el motivo por el que este valle sigue produciendo los mejores vinos de Norteamérica.',
    eyebrow: 'Guía curada · Pareja · Vino Regenerativo · 5 días · Presupuesto medio',
    tags: ['Pareja', 'Vino', 'Sostenibilidad'],
    image: '/images/guides/napa-sonoma.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada a Yountville',
      items: [
        {
          time: '14:00',
          title: 'Check-in en Bardessono',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Paseo por Yountville',
          description: 'Washington Street, boutiques, galerías',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Copa de bienvenida en el jardín del hotel',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Lucy Restaurant',
          description: 'Dentro de Bardessono, cocina californiana con ingredientes del propio jardín',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Vine Trail en bicicleta',
      items: [
        {
          time: '08:30',
          title: 'Desayuno en el hotel',
          description: '',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Salida en bicicleta por el Vine Trail hacia Rutherford',
          description: '',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Degustación en Frog\'s Leap Winery',
          description: 'Reserva previa. Viticultura de secano, sin riego, solar desde 1994',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Almuerzo en Rutherford o picnic entre los viñedos',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Regreso a Yountville en bicicleta',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena libre en Yountville',
          description: 'Bouchon Bistro para un segundo plano de Thomas Keller',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Benziger y traslado a Sonoma',
      items: [
        {
          time: '09:00',
          title: 'Salida desde Yountville hacia Glen Ellen',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Tour biodinámico en Benziger Family Winery',
          description: 'Tour en tractor, reserva obligatoria',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en Glen Ellen o en el camino hacia Healdsburg',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Check-in en H2Hotel',
          description: '',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Primera vuelta por la plaza de Healdsburg',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Spoonbar',
          description: 'Restaurante del hotel',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Día gastronómico en Healdsburg',
      items: [
        {
          time: '10:00',
          title: 'Desayuno en el hotel o en el Healdsburg Bar & Grill',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Tasting rooms de la plaza',
          description: 'Locals Tasting Room o Banshee Wines para empezar. Más de 30 tasting rooms en un radio de 10 minutos a pie',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Almuerzo en Bravas Bar de Tapas',
          description: 'La mejor cocina del centro',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Tarde libre',
          description: 'Spa del hotel, piscina, lectura',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Farm-to-Table Dinner en bodega',
          description: 'Reserva con antelación',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Despedida por la costa',
      items: [
        {
          time: '09:00',
          title: 'Desayuno largo en H2Hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Salida hacia la costa por la Route 116',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en Bodega Bay',
          description: 'Mariscos del Pacífico',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Point Reyes National Seashore',
          description: 'Primera vista del Pacífico del viaje',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Llegada a San Francisco o aeropuerto SFO',
          description: 'Ruta por la Highway 1, pasando Bodega Bay, Point Reyes y la costa de Marin antes de cruzar el Golden Gate',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Bardessono Hotel & Spa',
      type: 'Hotel LEED Platinum · Yountville, Napa Valley',
      priceTier: '$$$',
      description: 'El único hotel LEED Platinum de California y uno de los 14 en el mundo con esa certificación. 190 paneles solares en los techos, 72 pozos geotérmicos a 90 metros de profundidad para calefacción y refrigeración, madera de nogales recuperados de viñedos como suelos de las habitaciones, y un restaurante que cultiva sus propios ingredientes en el jardín del hotel. Las 62 suites tienen terraza privada, bañera de hidromasaje y servicio de spa en habitación. A cinco minutos caminando del French Laundry de Thomas Keller. Ganador de dos Llaves Michelin en 2025. Precio estimado: $550–950 USD/noche.',
      tag: 'LEED Platinum, 190 paneles solares',
      affiliateUrl: 'https://www.booking.com/hotel/us/bardessono.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'H2Hotel',
      type: 'Hotel eco-boutique · Healdsburg, Sonoma',
      priceTier: '$$',
      description: 'El hotel eco-boutique de referencia en el corazón de Healdsburg, el pueblo más gastronómico de Sonoma. Materiales orgánicos, bambú en los suelos, lino certificado y una piscina en el patio interior rodeada de jardines que abastecen el restaurante Spoonbar. Acceso caminando a la plaza central de Healdsburg y a más de 30 tasting rooms en un radio de 10 minutos a pie. La opción que combina diseño, sostenibilidad y posición sin intentarlo demasiado. Precio estimado: $280–450 USD/noche.',
      tag: 'LEED, piscina solar-heated en el patio',
      affiliateUrl: 'https://www.booking.com/hotel/us/healdsburg-219-healdsburg-avenue.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'River Terrace Inn',
      type: 'Hotel · Napa',
      priceTier: '$$',
      description: 'Junto al Oxbow Preserve y el río Napa, con cargadores de vehículo eléctrico, estaciones de agua reutilizable en cada pasillo, programa de reciclaje y compostaje activo y habitaciones que dan directamente al sendero de ciclismo del Vine Trail. Rooftop bar con vistas al río para el atardecer. La base más práctica del viaje si la pareja llega en coche eléctrico desde la Bay Area, el hotel tiene 10 puestos de carga LEVEL 2. Precio estimado: $320–500 USD/noche.',
      tag: '10 cargadores EV propios, junto al Vine Trail',
      affiliateUrl: 'https://www.booking.com/hotel/us/river-terrace-inn.html',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'Yountville y Healdsburg como bases, cada hotel con certificación o práctica sustentable propia.',

  experiences: [
    {
      name: 'Napa Valley: Guided Bike Tour through Sustainable Vineyards',
      description: 'El Napa Valley Vine Trail conecta el centro de Napa con Yountville y San Helena en 47 kilómetros pavimentados sin tráfico. El tour guiado de día completo pasa por tres viñedos certificados Napa Green con paradas para degustación, explica la diferencia entre viticultura convencional, orgánica y biodinámica, y termina con un almuerzo de temporada en una bodega activa. Para la pareja que quiere entender qué están bebiendo antes de pedir la siguiente copa.',
      tags: ['Vine Trail', 'Napa Green', 'Día completo'],
      affiliateUrl: 'https://www.getyourguide.com/yountville-l145323/napa-valley-guided-e-bike-tour-with-winery-visits-t1146315/',
    },
    {
      name: 'Sonoma: Explore Natural Wineries with a Local Sommelier',
      description: 'Tour de 6 horas con sommelier local a dos bodegas independientes y familiares de vinos naturales de Sonoma, con degustación incluida e introducción a prácticas de viticultura sostenible. Lo más cercano al espíritu biodinámico.',
      tags: ['Vinos naturales', 'Sommelier', 'Sonoma'],
      affiliateUrl: 'https://www.getyourguide.com/sonoma-l2495/sonoma-explore-natural-wineries-with-a-local-sommeliere-t592711/',
    },
    {
      name: 'Farm-to-Table Dinner & Winery Experience en Napa',
      description: 'Cena privada en una bodega activa con chef residente: ingredientes del huerto de la finca, maridaje de vinos de esa misma cosecha y una mesa bajo las vides al atardecer. Tour de la bodega incluido antes de cenar. Para la noche más memorable de los cinco días, la que reemplaza cualquier restaurante con estrella Michelin en términos de contexto.',
      tags: ['Farm-to-table', 'Cena privada', 'Bodega'],
      affiliateUrl: 'https://www.getyourguide.com/s/?q=Farm%20to%20Table%20Dinner%20Winery%20Napa',
    },
  ],

  experiencesDescription: 'Viticultura regenerativa, bicicleta entre viñedos y una cena inolvidable en bodega.',

  tips: [
    'El Napa Green: El programa de certificación sostenible de Napa Valley verifica prácticas suelo-a-botella: calidad del agua, biodiversidad, gestión de residuos y energía renovable. No todos los vinos de Napa tienen esta certificación, busca el sello en la botella o pregunta directamente. Las bodegas con certificación Napa Green ofrecen degustaciones con ese contexto incluido en la visita.',
    'Reserva con anticipación: En agosto, las bodegas de Napa más solicitadas (Opus One, Far Niente, Harlan) se reservan con meses de anticipación. Frog\'s Leap y Benziger tienen cupo más amplio pero también conviene reservar con una semana mínima.',
    'El Dry Creek de Healdsburg: Es el valle menos conocido de California y el que tiene los mejores zinfandels del mundo, un varietal que aquí encontró su terroir hace 150 años. Para la pareja que quiere algo que no está en las guías habituales: un día en Dry Creek Valley con bodegas pequeñas como Quivira (biodinámica) o Preston Farm & Winery (también con huerto, pan casero y aceite de oliva).',
  ],

  funFact: 'Rutherford fue la primera apelación en lograr el 100% de participación en el programa Napa Green Land. El sistema de certificación cubre no sólo las prácticas vitícolas sino también el edificio de la bodega y toda la operación de producción, haciendo de Rutherford el corredor vitivinícola más auditado en términos de sostenibilidad del hemisferio occidental.',

  checklist: [
    '🚲 Ropa cómoda para pedalear el Vine Trail',
    '🕶️ Protector solar y lentes de sol para los 28–36°C del día',
    '🧥 Suéter ligero para las noches de 15–18°C',
    '👟 Calzado cómodo para caminar tasting rooms y viñedos',
    '📅 Reservas de bodegas y cenas hechas con semanas de anticipación',
    '🩱 Traje de baño para las piscinas de Bardessono y H2Hotel',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'San Francisco International (SFO) u Oakland International (OAK), ambos a menos de 1.5 horas de Yountville en coche. Alternativa sin coche: tren SMART desde San Francisco a Santa Rosa, luego Uber al hotel. El aeropuerto más cercano al norte del valle es el de Sonoma County (STS), con vuelos domésticos desde Los Ángeles y Seattle.',
    },
    {
      mode: 'Moverse en el valle',
      description: 'Coche eléctrico de alquiler es la opción perfecta para este itinerario, la red de cargadores en Napa y Sonoma es completa y Bardessono tiene 10 cargadores propios. Para los días sin coche: el Vine Trail en bicicleta cubre todo Yountville-Napa, y Healdsburg tiene acceso a pie a todas sus bodegas.',
    },
    {
      mode: 'Clima en agosto',
      description: 'Días de 28–36°C en el valle, noches de 15–18°C. El verano en Napa es el período más concurrido, reserva bodegas y restaurantes con semanas de anticipación. Las bodegas de Sonoma tienen menos masificación que las de Napa en agosto.',
    },
  ],
}
