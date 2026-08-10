import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'ruanda',
  locale: 'es',

  hero: {
    title: 'Parque Nacional de los Volcanes, Ruanda',
    subtitle: 'El destino más caro por día de África es también el que tiene el impacto de conservación más medible del continente. Un permiso de $1,500 USD protege a los últimos 1,000 gorilas de montaña del planeta y financia a las comunidades del borde del bosque. Para el viajero solo que quiere que su dinero cambie algo concreto.',
    eyebrow: 'Guía curada · Viajero solo · Gorilas de Montaña · 7 días · Presupuesto alto',
    tags: ['Solo', 'Aventura', 'Naturaleza'],
    image: '/images/guides/ruanda.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Kigali',
      items: [
        {
          time: '13:00',
          title: 'Llegada al aeropuerto KGL',
          description: 'Transfer al hotel en Kigali',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Kigali Genocide Memorial',
          description: 'Entrada gratuita, 2 horas. Visita necesaria, no como turismo sino como contexto para entender Ruanda actual',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Paseo por el distrito de Nyamirambo',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Repub Lounge o Meze Fresh',
          description: 'Cocina ruandesa contemporánea',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Kigali y traslado a Musanze',
      items: [
        {
          time: '09:30',
          title: 'Inema Arts Centre',
          description: 'Galería y taller de artistas locales en Kacyiru, entrada libre. La mejor galería de arte contemporáneo ruandés',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Almuerzo en Heaven Restaurant',
          description: 'Cocina de fusión, terraza con vistas a Kigali',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Transfer privado hacia Musanze',
          description: '2.5 horas',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Check-in en el lodge elegido',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Briefing informal con el guía del lodge',
          description: 'Sobre el trekking del día siguiente',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Gorilla trekking',
      items: [
        {
          time: '06:30',
          title: 'Desayuno y salida hacia el park headquarters en Kinigi',
          description: 'El día más importante del viaje. Lleva botas de montaña, guantes, pantalón largo y la cámara sin flash',
          tags: [],
        },
        {
          time: '07:00',
          title: 'Briefing en el headquarters',
          description: 'Asignación de familia de gorilas según nivel de forma física, instrucciones de comportamiento',
          tags: [],
        },
        {
          time: '08:00',
          title: 'Inicio del trek con guía y rangers',
          description: 'Entre 1 y 4 horas según dónde se movió la familia durante la noche',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Encuentro con los gorilas',
          description: 'Una hora exacta con la familia asignada. Puede ocurrir entre las 10am y las 2pm',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Regreso al trailhead y transfer al lodge',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena y procesamiento de lo que acaba de pasar',
          description: 'El almuerzo posterior en el lodge es el mejor del viaje, el hambre post-trekking tiene esa particularidad',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Golden Monkey Trekking',
      items: [
        {
          time: '07:00',
          title: 'Desayuno en el lodge',
          description: 'El día más ligero del itinerario, tanto en esfuerzo físico como en precio',
          tags: [],
        },
        {
          time: '08:00',
          title: 'Salida hacia el parque para el Golden Monkey Trek',
          description: '2-3 horas de trek total, los monos dorados viven más cerca de la entrada del parque que los gorilas',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Regreso al lodge',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Tarde libre',
          description: 'Piscina, lectura, visita al pueblo de Musanze',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Dian Fossey Hike',
      items: [
        {
          time: '07:30',
          title: 'Desayuno y salida hacia el trailhead',
          description: 'La excursión más reflexiva del viaje',
          tags: [],
        },
        {
          time: '08:30',
          title: 'Inicio del sendero hacia Karisoke',
          description: 'Sube 300 metros hasta el sitio del Karisoke Research Centre en las faldas del Bisoke (4,374m). 4 horas ida y vuelta',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Regreso al punto de inicio',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Almuerzo tardío en el lodge',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Visita a la Gorilla Guardians Village',
          description: 'Ex-cazadores furtivos reconvertidos en guías comunitarios, el programa de conservación más directo disponible',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Comunidades y volcán Bisoke (opcional)',
      items: [
        {
          time: '07:30',
          title: 'Desayuno',
          description: '',
          tags: [],
        },
        {
          time: '08:30',
          title: 'Opción A: subida al Bisoke, u Opción B: cooperativas artesanales',
          description: 'Bisoke (4,374m): 6-8 horas, permiso adicional de $75 USD, vistas al cráter y a la RD Congo. Cooperativas: tejidos y cerámica de Musanze, el mejor souvenir de Ruanda',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Última cena en Musanze',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Regreso a Kigali',
      items: [
        {
          time: '09:00',
          title: 'Desayuno y check-out',
          description: '',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Transfer a Kigali',
          description: '2.5 horas',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Llegada, almuerzo en Kigali si hay tiempo',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Transfer al aeropuerto KGL',
          description: 'Según horario de vuelo',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Le Bambou Gorilla Lodge',
      type: 'Eco-lodge · Musanze',
      priceTier: '$',
      description: 'El alojamiento más accesible del corredor de Volcanes: cabañas de bambú y eucalipto diseñadas con materiales locales, piscina, restaurante y el ambiente más social de cualquier lodge de la zona, el punto de encuentro natural de viajeros solos que llegaron sin grupo pero que van a salir de trekking con otros. Breakfast incluido, transfer al parque organizado por el hotel. Precio estimado: $80–150 USD/noche.',
      tag: 'El lodge más social y accesible del corredor',
      affiliateUrl: 'https://www.booking.com/searchresults.html?ss=Le+Bambou+Gorilla+Lodge+Musanze',
      archetypes: [],
    },
    {
      name: 'Five Volcanoes Boutique Hotel',
      type: 'Hotel boutique · Musanze',
      priceTier: '$$',
      description: 'El hotel boutique mejor posicionado de Musanze, la ciudad gateway de los Volcanes, con vistas directas a los cinco volcanes Virunga desde la terraza del desayuno. Habitaciones con chimenea y decoración de artesanía local, restaurante con ingredientes de la región, jardín con caminos de piedra volcánica y el personal más informado sobre logística de permisos y grupos de gorilas de la ciudad. A 30 minutos del parque headquarters en Kinigi. Precio estimado: $150–250 USD/noche.',
      tag: 'Vistas a los cinco volcanes desde el desayuno',
      affiliateUrl: 'https://www.booking.com/searchresults.html?ss=Five+Volcanoes+Boutique+Hotel',
      archetypes: [],
    },
    {
      name: 'Mountain Gorilla View Lodge',
      type: 'Chalets de piedra · Kinigi',
      priceTier: '$$$',
      description: '30 chalets de piedra y paja a 3 kilómetros del parque headquarters, la distancia más corta de cualquier alojamiento al punto de partida del trekking. Los chalets tienen chimenea, alfombras de sisal, muebles de ratán y arte ruandés en las paredes. El restaurante sirve cocina de fusión local-internacional con ingredientes del huerto propio. Para el viajero solo que quiere llegar al briefing de las 7am sin calcular trayecto de transfer. Precio estimado: $200–320 USD/noche.',
      tag: 'A 3 km del headquarters, sin transfer que calcular',
      affiliateUrl: 'https://www.booking.com/searchresults.html?ss=Mountain+Gorilla+View+Lodge+Kinigi',
      archetypes: [],
    },
  ],

  hotelsDescription: 'Musanze y Kinigi como base, a minutos del park headquarters.',

  experiences: [
    {
      name: 'Mountain Gorilla Trekking',
      description: 'El permiso de gorila ($1,500 USD) se compra a través del Rwanda Development Board en la plataforma Irembo o a través de un operador registrado. El briefing arranca a las 7am en el headquarters de Kinigi: asignación de familia de gorilas según nivel de forma física, instrucciones de comportamiento (distancia mínima de 7 metros, sin flash, sin alimentos visibles) y salida hacia el trailhead. El trek dura entre 1 y 4 horas según dónde se movió la familia durante la noche. Al llegar: una hora con los gorilas. No hay segunda hora.',
      tags: ['Gorilas', 'Permiso RDB', 'Trekking'],
      affiliateUrl: 'https://visitrwandabookings.rdb.rw/rdbportal/mountain-gorilla-tracking',
    },
    {
      name: 'Dian Fossey Hike to Karisoke Research Centre',
      description: 'El sendero de 4 horas ida y vuelta hasta la tumba de Dian Fossey y el Karisoke Research Centre en las faldas del Monte Bisoke. El lugar donde la primatóloga que inspiró Gorillas in the Mist vivió y trabajó durante 18 años, y donde está enterrada junto a varios de los gorilas que estudió. La excursión más reflexiva disponible en el parque, y la que da contexto completo a lo que se vio el día anterior.',
      tags: ['Karisoke', 'Historia', 'Medio día'],
      affiliateUrl: 'https://www.getyourguide.com/kigali-l32466/1-journee-de-randonnee-pour-les-gorilles-et-le-centre-de-recherche-de-karisoke-pn-des-volcans-t867231/',
    },
    {
      name: 'Golden Monkey Trekking',
      description: 'Los monos dorados de las Virunga, endémicos de la región y con una densidad de población aún más vulnerable que la de los gorilas, viven en los bambusales de las laderas bajas del parque. El trekking dura 2-3 horas con guía y el permiso cuesta $100 USD por persona, significativamente menos que el gorila pero con el mismo nivel de encuentro cercano. Para el día en que el cuerpo pide algo menos exigente que cuatro horas de bosque vertical.',
      tags: ['Monos dorados', 'Permiso $100 USD', 'Medio día'],
      affiliateUrl: 'https://www.getyourguide.com/parc-national-des-volcans-l144502/kigali-trekking-au-singe-dore-et-transfert-vers-les-volcans--t850037/',
    },
  ],

  experiencesDescription: 'Gorilas, monos dorados y el legado de Dian Fossey.',

  tips: [
    'El Umuganda: El último sábado de cada mes, toda Ruanda para sus actividades de 8am a 11am para realizar trabajo comunitario, limpiar calles, construir infraestructura, plantar árboles. Los turistas no están obligados a participar pero tampoco pueden circular en vehículo durante esas horas. Si tu itinerario cae en ese sábado, aprovecha para observar o para unirte, es la experiencia más específicamente ruandesa disponible sin pagar entrada.',
    'El porter: Contratar un porter local para el trek de gorila ($15–20 USD) no es un lujo, es la forma más directa de dejar dinero en la comunidad. Los porters son principalmente ex-cazadores furtivos reconvertidos por el programa de conservación. El trek de 4 horas con una mochila de 10 kilos en bosque vertical con humedad tropical ya es suficiente argumento.',
    'La cámara: Sin flash, sin teleobjetivo largo (los gorilas pueden interpretar el vidrio del lente grande como ojo amenazante de otro primate), sin música de fondo. La cámara con lente estándar o una buena cámara de teléfono con el flash desactivado manualmente desde la configuración. El gorila silverback a tres metros no necesita más contexto.',
  ],

  funFact: 'Ruanda prohibió las bolsas de plástico en 2008 y realiza limpiezas comunitarias mensuales llamadas "Umuganda" en todo el país. El aeropuerto de Kigali confisca las bolsas de plástico a los viajeros internacionales a la llegada, antes de que puedan entrar al país. Es la única política de ese tipo en el mundo y funciona: Ruanda tiene las ciudades más limpias de África sin excepción.',

  checklist: [
    '🥾 Botas de montaña para el trek de gorila',
    '🧤 Guantes gruesos para las plantas urticantes del bosque',
    '👖 Pantalón largo e impermeable',
    '📷 Cámara con flash desactivado manualmente, sin teleobjetivo largo',
    '💵 Efectivo para el porter ($15–20 USD) y propinas',
    '💳 Permiso de gorila reservado con meses de anticipación en Irembo',
    '🎒 Mochila pequeña para el trek (agua, snacks, capa impermeable)',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Internacional de Kigali (KGL), con conexiones directas desde Nairobi (Kenya Airways, 1.5h), Addis Abeba (Ethiopian Airlines, 2h), Dubái (RwandAir, 7h), Londres (RwandAir, 8.5h) y Bruselas. Desde México o América Latina: conexión en Nairobi, Addis Abeba, Dubái o Ámsterdam.',
    },
    {
      mode: 'Transfer al parque',
      description: 'Kigali al parque headquarters en Kinigi: 2.5 horas en carretera en perfecto estado. Minibuses compartidos desde la estación de Nyabugogo ($5–8 USD) o transfer privado organizado por el hotel ($60–80 USD). La mayoría de los lodges en Musanze organiza el recojo en el aeropuerto.',
      tip: 'Reserva el permiso de gorila antes que cualquier vuelo u hotel: es el punto fijo alrededor del cual se construye el itinerario. Los permisos para agosto se agotan con meses de anticipación y no hay reembolso por cancelación, solo reemplazo de fecha sujeto a disponibilidad.',
    },
    {
      mode: 'Seguridad',
      description: 'Ruanda está consistentemente clasificado entre los 10 países más seguros del mundo. Kigali es la capital más limpia de África por política municipal activa. No hay preocupaciones de seguridad específicas para el viajero solo.',
    },
  ],
}
