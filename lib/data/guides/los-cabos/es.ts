import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'los-cabos',
  locale: 'es',

  hero: {
    title: 'Los Cabos',
    subtitle: 'Donde el desierto abraza al mar. Una escapada diseñada para renovar cuerpo y mente, con el equilibrio perfecto entre misticismo y sofisticación.',
    eyebrow: 'Guía curada · Relax entre amigas',
    tags: ['Amigas', 'Relax', 'Spa', 'Lujo'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'La llegada',
      items: [
        {
          time: '15:00',
          title: 'Check-in y brindis con vista al mar',
          description: '',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Caminata por la playa al atardecer',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena relajada en el hotel',
          description: 'The Rooftop en The Cape o Los Riscos en Hacienda Encantada.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Spa y mar',
      items: [
        {
          time: '09:00',
          title: 'Yoga o meditación matutina',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Sesión de spa: masaje e hidroterapia',
          description: 'Dedicar 2–3 horas al circuito de hidroterapia (vapor, sauna, fosa fría).',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Navegación privada hacia el Arco',
          description: 'Ver el atardecer con una copa de vino desde el mar es el momento cumbre de la desconexión.',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena de gala en el Distrito del Arte de San José',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'San José y diseño',
      items: [
        {
          time: '10:00',
          title: 'Brunch largo y nutritivo',
          description: '',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Paseo por las galerías de San José',
          description: 'Compras de diseño local.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Último café frente al mar y salida al aeropuerto',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'The Cape, a Thompson Hotel',
      type: 'Hotel · Corredor Turístico',
      priceTier: '$$$',
      description: 'Arquitectura impactante y estética mid-century modern. Es el lugar para ver y ser visto, con vistas frontales al Arco desde cada tina de baño.',
      tag: 'Lujo icónico y diseño',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/uB2_au9uci?aid=lagomplan&campaign=lagomplan-loscabosrelaxspaedition&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Los+Cabos%2C+Dolores+Hidalgo%2C+Dolores+Hidalgo%2C+Guanajuato%2C+37807%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Flos-cabos-relax-spa-edition',
    },
    {
      name: 'Hacienda Encantada Resort & Residences',
      type: 'Resort · Corredor Turístico',
      priceTier: '$$',
      description: 'La experiencia clásica de la Baja. Arquitectura tipo hacienda con vistas espectaculares al Mar de Cortés. Ideal para grupos que buscan amplitud (suites y villas enormes) y un spa tradicional y completo.',
      tag: 'Confort clásico y amplitud',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/tGFeKKQIrw?aid=lagomplan&campaign=lagomplan-loscabosrelaxspaedition&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Los+Cabos%2C+Dolores+Hidalgo%2C+Dolores+Hidalgo%2C+Guanajuato%2C+37807%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Flos-cabos-relax-spa-edition',
    },
    {
      name: 'Drift San José',
      type: 'Hotel boutique · Distrito del Arte',
      priceTier: '$',
      description: 'Minimalismo industrial en el corazón del Distrito del Arte. Un refugio smart para quienes prefieren la vida de barrio, las fogatas nocturnas y una estética limpia sin el costo de un gran resort.',
      tag: 'Smart value y estilo local',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/oWKB_Zby-Q?aid=lagomplan&campaign=lagomplan-loscabosrelaxspaedition&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Los+Cabos%2C+Dolores+Hidalgo%2C+Dolores+Hidalgo%2C+Guanajuato%2C+37807%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Flos-cabos-relax-spa-edition',
    },
  ],

  experiences: [
    {
      name: 'Mañana de spa y agua',
      description: 'Dedicar 2–3 horas al circuito de hidroterapia (vapor, sauna, fosa fría). En Los Cabos, el spa es una de las principales actividades del viaje.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Sunset sail privado',
      description: 'Un catamarán solo para ustedes hacia el Arco. Ver el atardecer con una copa de vino desde el mar es el momento cumbre de la desconexión.',
      tags: [],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/-uH48XyB3E',
    },
    {
      name: 'Cena en el huerto: Flora Farms o Acre',
      description: 'Gastronomía farm-to-table en San José rodeadas de flores y coctelería botánica.',
      tags: [],
      affiliateUrl: 'https://www.opentable.com/',
    },
  ],

  hotelsDescription: 'Tres estados de ánimo para tu grupo de amigas.',

  tips: [
    'El "dry look" de la Baja: El aire aquí es muy seco. Empaca un buen aceite facial y capilar. El sol y la brisa del Pacífico pueden resecar más de lo que imaginas.',
    'Mesa con vista: Si vas a The Cape para el atardecer (incluso si no te hospedas ahí), reserva en el Rooftop con una semana de antelación. Es el mejor spot de la zona y se llena rápido.',
    'Capas ligeras: Aunque es desierto, la brisa marina de noche en Los Cabos puede ser fresca. Un pashmina o un blazer ligero es tu mejor aliado para las cenas al aire libre.',
  ],

  funFact: 'Jacques Cousteau llamó a este lugar "el acuario del mundo". Es el punto exacto donde el Mar de Cortés se abraza con el Pacífico en el "Fin de la Tierra".',

  checklist: [
    '🩱 Traje de baño y pareos',
    '🧴 Bloqueador solar SPF 50+ (el desierto amplifica el sol)',
    '🌿 Aceite facial y capilar (aire muy seco)',
    '🧣 Pashmina o blazer ligero para cenas al aire libre',
    '🕶️ Lentes de sol de calidad',
    '💵 Efectivo y tarjeta',
    '👗 Vestido midi o guayabera de lino para cenas',
    '🔋 Power bank',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Llegada al Aeropuerto de San José del Cabo (SJD).',
    },
    {
      mode: 'Traslado desde el aeropuerto',
      description: 'Para grupos de amigas, lo más Lagom es reservar un transporte privado previo. Evita las filas de taxis y la confusión del Uber (que tiene restricciones en la zona federal del aeropuerto).',
    },
    {
      mode: 'Movilidad en la zona',
      description: 'Si se quedan en Hacienda Encantada o The Cape, están en el Corredor Turístico. Uber funciona bien para ir de un hotel a otro o hacia San José.',
    },
  ],
}
