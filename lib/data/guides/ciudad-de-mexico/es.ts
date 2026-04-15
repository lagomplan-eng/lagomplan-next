import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'ciudad-de-mexico',
  locale: 'es',

  hero: {
    title: 'Ciudad de México',
    subtitle: 'Una metrópoli que respira creatividad en cada esquina. El pulso perfecto entre museos de clase mundial y una de las escenas gastronómicas más excitantes del planeta.',
    eyebrow: 'Guía curada · Parejas',
    tags: ['Pareja', 'Arte', 'Gastronomía', 'Cultura'],
    image: '/images/guides/guides-headers/Bellas%20Artes.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'El eje cultural',
      items: [
        {
          time: '11:00',
          title: 'Museo Nacional de Antropología',
          description: 'Enfóquense solo en la sala Mexica para no abrumarse.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Comida en Contramar',
          description: 'El pulpo a las brasas es ley.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Caminata por el Bosque de Chapultepec',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Centro Histórico y murallas',
      items: [
        {
          time: '10:00',
          title: 'Palacio de Bellas Artes y los murales del Palacio Nacional',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Tacos de canasta "Los Especiales"',
          description: 'El snack rápido más auténtico del Centro.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena en Lorea o Merotoro en la Condesa',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Diseño y despedida',
      items: [
        {
          time: '11:00',
          title: 'Visita a Casa Barragán o Museo Soumaya/Jumex',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Brunch largo en Panadería Rosetta',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Últimas compras de diseño en Lago DF y salida al aeropuerto',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'The Ritz-Carlton, Mexico City',
      type: 'Hotel · Paseo de la Reforma',
      priceTier: '$$$',
      description: 'Lujo en las alturas. Ubicado en los pisos superiores de un rascacielos en Reforma, ofrece las vistas más románticas del Castillo de Chapultepec desde tu cama.',
      tag: 'Lujo en las nubes',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/2oeHmjK31f?aid=lagomplan&campaign=lagomplan-ciudaddemexicoartemesa&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Mexico+City%2C+CDMX%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fciudad-de-mexico-arte-mesa',
    },
    {
      name: 'Brick Hotel',
      type: 'Hotel boutique · Roma Norte',
      priceTier: '$$',
      description: 'Una joya en la Roma Norte. Combina una fachada de principios del siglo XX con un interior moderno y minimalista. Es el punto de partida ideal para explorar galerías a pie.',
      tag: 'Modern Heritage',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/4GOkOu55mT?aid=lagomplan&campaign=lagomplan-ciudaddemexicoartemesa&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Mexico+City%2C+CDMX%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fciudad-de-mexico-arte-mesa',
    },
    {
      name: 'Casa Cuenca',
      type: 'Hotel boutique · Roma',
      priceTier: '$$',
      description: 'Un refugio contemporáneo que prioriza el descanso y la ubicación estratégica. Sus habitaciones están diseñadas para estancias largas y cómodas, complementadas por un restaurante romántico.',
      tag: 'Ubicación imbatible y confort',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/UifOIGl3dG?aid=lagomplan&campaign=lagomplan-ciudaddemexicoartemesa&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Mexico+City%2C+CDMX%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fciudad-de-mexico-arte-mesa',
    },
  ],

  experiences: [
    {
      name: 'Casa Luis Barragán',
      description: 'Es indispensable reservar con meses de antelación. Es una lección de luz, color y silencio; la experiencia arquitectónica más íntima que puedes tener en pareja.',
      tags: ['Reserva con meses de anticipación'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/YC8OoqqWnR',
    },
    {
      name: 'Ruta de galerías en la San Rafael',
      description: 'Salgan de la Roma y exploren el barrio de la San Rafael. Visiten galerías como Hilario Galguera o Eco; encontrarán arte contemporáneo de alto nivel sin las multitudes.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Cena en barra de autor',
      description: 'Busquen lugares como Expendio de Maíz o la barra de Máximo. Ver la precisión de los chefs a pocos centímetros mientras comparten un vino natural es el epítome del lujo relajado.',
      tags: [],
      affiliateUrl: 'https://www.opentable.com/',
    },
  ],

  hotelsDescription: 'Tres opciones para vivir la ciudad desde su arquitectura.',

  tips: [
    'El hack de la barra para dos: Si no consiguieron reservación en los top de la Roma, lleguen a la hora de apertura y pregunten por espacio en barra. Casi siempre guardan un par de asientos para walk-ins que viajan en pareja.',
    'La altura y el mezcal: La CDMX está a más de 2,200 metros. El alcohol pega el doble de rápido aquí. La regla de oro: un vaso de agua por cada copa de mezcal para evitar que el mareo arruine el plan artístico del día siguiente.',
    'El secreto del domingo: La mayoría de los museos se llenan demasiado el domingo. Si quieren paz, dejen los museos para el viernes o sábado y usen el domingo para el paseo dominical en bici por Reforma; cierran la avenida a los coches y es una gloria.',
  ],

  funFact: 'La Ciudad de México es la segunda ciudad con más museos en el mundo (después de Londres). Tiene más de 150 espacios culturales, lo que significa que podrías visitar uno diferente cada semana durante tres años y no terminarías.',

  checklist: [
    '👟 Zapatos cómodos para caminar muchas horas',
    '🧥 Chamarra ligera (la ciudad refresca en la tarde)',
    '🎒 Bolsa cruzada antirrobo',
    '💊 Medicamento para el soroche (altitud 2,240 m)',
    '💵 Efectivo para mercados y tacos de canasta',
    '🔋 Power bank y adaptadores',
    '🌂 Paraguas pequeño (temporada de lluvias: jun–oct)',
    '📷 Tarjeta de memoria adicional',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Llegada al AICM (más céntrico) o AIFA.',
    },
    {
      mode: 'Traslado desde el aeropuerto',
      description: 'Uber y Didi funcionan de maravilla. Si llegan al AICM, caminen hacia las salidas autorizadas para apps; es más rápido y económico que el taxi oficial.',
    },
    {
      mode: 'Movilidad en la ciudad',
      description: 'No renten coche. La CDMX es la capital del tráfico. Usen Uber para distancias largas y EcoBici para moverse entre la Roma, Condesa y Reforma; es rápido y eficiente.',
    },
  ],
}
