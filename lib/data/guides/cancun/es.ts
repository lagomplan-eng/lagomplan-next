import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'cancun',
  locale: 'es',

  hero: {
    title: 'Cancún',
    subtitle: 'El azul más famoso del mundo para todas las edades. Una pausa equilibrada entre el confort del resort, la aventura natural y el valor inteligente.',
    eyebrow: 'Guía curada · Viaje familiar',
    tags: ['Familia', 'Playa', 'Resort', 'Valor inteligente'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'El aterrizaje',
      items: [
        {
          time: '15:00',
          title: 'Check-in y primera inmersión en la alberca',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Caminata por la playa y cena familiar en el hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'El highlight del viaje',
      items: [
        {
          time: '08:30',
          title: 'Día completo en Xcaret o Xel-Há',
          description: 'El show nocturno está lleno de cultura: una experiencia que los niños recordarán toda la vida. Reserva con 21 días de antelación para un 15% de descuento.',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Regreso al hotel después del show nocturno',
          description: 'Los niños caerán rendidos.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Isla Mujeres "Smart"',
      items: [
        {
          time: '09:30',
          title: 'Ferry desde Playa Tortugas hacia Isla Mujeres',
          description: 'Tomen el ferry de UltraMar. Al llegar, renten un carrito de golf.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Playa Norte y comida local de pescado Tikin-xic',
          description: 'El agua es tan baja y tranquila que parece una alberca gigante.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Regreso y cena de tacos en el centro de Cancún',
          description: 'Más barato y auténtico.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Despedida y compras',
      items: [
        {
          time: '10:00',
          title: 'Visita a Playa Delfines para la foto familiar',
          description: 'El mirador con las letras de Cancún.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Compras en Chedraui Selecto y salida al aeropuerto',
          description: 'Mejores precios que en tiendas de souvenirs.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Nizuc Resort & Spa',
      type: 'Resort · Zona Hotelera sur',
      priceTier: '$$$',
      description: 'El refugio de lujo más exclusivo al final de la Zona Hotelera. Ideal para familias que buscan paz, una playa sin sargazo (por su ubicación) y un Kids\' Club de primer nivel.',
      tag: 'Lujo zen y privacidad',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/PlmvNbFRph?aid=lagomplan&campaign=lagomplan-cancunfamilyvalueedition&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Canc%C3%BAn%2C+Quintana+Roo%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fcancun-family-value-edition',
    },
    {
      name: 'Grand Fiesta Americana Coral Beach',
      type: 'Resort todo incluido · Playa',
      priceTier: '$$',
      description: 'El mejor deal de lujo familiar. Recientemente se volvió All-Inclusive, pero mantiene una calidad gastronómica superior. Su club de niños es de los mejores de México.',
      tag: 'Resort de alta gama todo incluido',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/8ezclsJ3wa?aid=lagomplan&campaign=lagomplan-cancunfamilyvalueedition&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Canc%C3%BAn%2C+Quintana+Roo%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fcancun-family-value-edition',
    },
    {
      name: 'Aloft Cancun',
      type: 'Hotel · Smart value',
      priceTier: '$',
      description: 'La opción smart value. No es un resort frente al mar, pero está a pasos de la playa pública y rodeado de servicios. Perfecto para familias que prefieren invertir su presupuesto en parques y excursiones.',
      tag: 'Ubicación estratégica y ahorro',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/WSZq7xX49s?aid=lagomplan&campaign=lagomplan-cancunfamilyvalueedition&product=allez&habl=false&isinc=false&sid22=nB51ac2dT7PdXnNS&plng=en&pageCategory=travel&lmaID=69b992c248666aca4133dbbe&address=Canc%C3%BAn%2C+Quintana+Roo%2C+Mexico&source=direct&ref22=https%3A%2F%2Fwww.lagomplan.com%2Fguias%2Fcancun-family-value-edition',
    },
  ],

  experiences: [
    {
      name: 'Día en Isla Mujeres',
      description: 'Tomen el ferry de UltraMar (un plan económico y divertido). Al llegar, renten un carrito de golf y pasen el día en Playa Norte; el agua es tan baja y tranquila que parece una alberca gigante.',
      tags: [],
      affiliateUrl: 'https://booking.stay22.com/lagomplan/UGkuXdeIfI',
    },
    {
      name: 'Parque Xcaret',
      description: 'Es una inversión, pero es el parque más completo. El show nocturno está lleno de cultura: una experiencia que los niños recordarán toda la vida.',
      tags: ['Reservar 21 días antes para 15% de descuento'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/Q74zZ8LQfv',
    },
    {
      name: 'Cenote Azul',
      description: 'A una hora y media de Cancún. Es un cenote abierto, ideal para niños que no se sienten cómodos en cuevas cerradas. Es el deal perfecto para un día de naturaleza por poco dinero.',
      tags: ['~1.5 hrs desde Cancún', 'Ideal para niños'],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: 'Tres opciones que entienden la dinámica familiar y el valor del dinero.',

  tips: [
    'El supermercado es tu aliado: El Chedraui Selecto de la Zona Hotelera tiene comida gourmet preparada, bloqueadores y bebidas a precios de ciudad. Es el mejor lugar para armar un picnic de playa y ahorrar mucho dinero.',
    'Protección inteligente: El sol del Caribe no perdona. Más que bloqueador, usen playeras de natación con protección UV. Ahorrarán en crema y evitarán quemaduras que arruinen el viaje.',
    'Agua siempre embotellada: Incluso en los hoteles de lujo, para beber usa siempre agua embotellada. Evita la venganza de Moctezuma que los puede dejar fuera de combate por un día entero.',
  ],

  funFact: 'Cancún significa "Nido de Serpientes" en maya. Antes de 1970, sólo vivían aquí una docena de cuidadores de una plantación de coco; hoy es el destino turístico más importante de América Latina.',

  checklist: [
    '🩱 Traje de baño (para alberca y playa)',
    '🧴 Bloqueador solar SPF 50+ y playeras UV',
    '🕶️ Lentes de sol y sombrero de ala ancha',
    '🩴 Sandalias para la arena y escarpines',
    '💊 Botiquín básico y medicamento para el mareo',
    '💵 Efectivo en pesos mexicanos',
    '💧 Agua embotellada siempre a la mano',
    '🔋 Power bank para el día de parque',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Llegada al Aeropuerto de Cancún (CUN).',
    },
    {
      mode: 'Traslado desde el aeropuerto',
      description: 'Prohibido tomar taxi al llegar (son súper caros). Reserven un transporte privado tipo shuttle con anticipación (como Happy Shuttle o USA Transfers). Es más barato, seguro y los esperan con su nombre.',
    },
    {
      mode: 'Movilidad en la ciudad',
      description: 'Usen el autobús local (R1 o R2) para moverse dentro de la Zona Hotelera. Cuesta solo 12 pesos y pasa cada 2 minutos. Es el mejor secreto para evitar taxis de 40 USD por trayectos cortos.',
    },
  ],
}
