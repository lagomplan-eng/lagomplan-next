import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'eslovenia',
  locale: 'es',

  hero: {
    title: 'Eslovenia',
    subtitle: 'El país más pequeño y más denso de los Alpes. Un roadtrip de diez días con el carro alquilado más barato de Europa Central, un lago que parece inventado, un río tan verde que parece Photoshop y hostales que llevan años recibiendo a viajeros solos con la misma energía de bienvenida.',
    eyebrow: 'Guía curada · Viajero solo · Backpacking & Roadtrip · 10 días · Presupuesto bajo',
    tags: ['Viajero solo', 'Backpacking', 'Roadtrip', 'Naturaleza'],
    image: '/images/guides/eslovenia.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada a Ljubljana',
      items: [
        {
          time: '14:00',
          title: 'Llegada al aeropuerto LJU',
          description: 'Bus al centro (30 min, €4) o transfer privado.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Check-in en Celica Hostel (barrio Metelkova)',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Ljubljana Bike Tour con guía local',
          description: 'Castillo, mercado de Plečnik, puentes triples (3 horas).',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena en la orilla del río Ljubljanica (terrazas de Stari Trg)',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Ljubljana a fondo: Trnovo y el Castillo',
      items: [
        {
          time: '09:00',
          title: 'Mercado Central de Plečnik para el desayuno',
          description: 'Café y frutas de temporada.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Recorrido libre por el barrio de Trnovo (el menos turístico de Ljubljana)',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en algún local de la calle Mestni Trg',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Castillo de Ljubljana en funicular (€4 ida y vuelta)',
          description: 'Vistas panorámicas.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Preparación del roadtrip del día siguiente',
          description: 'Compra de la vinheta, revisión del carro.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Última cena en Ljubljana',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Bled: primera vista y castillo al atardecer',
      items: [
        {
          time: '08:30',
          title: 'Salida en carro hacia Bled (50 min)',
          description: '',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Check-in en Bled Hostel (o deja las maletas si es muy temprano)',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Bajada a pie a la orilla del lago',
          description: 'Primera vista panorámica.',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Barca Pletna a la isla del lago (€15 EUR ida y vuelta, 20 min de travesía)',
          description: '',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Almuerzo en el paseo marítimo',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Subida al Castillo de Bled al atardecer (€13 EUR entrada)',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena en el hostel o en un restaurante del pueblo',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Vintgar Gorge al amanecer y Lago Bohinj',
      items: [
        {
          time: '07:30',
          title: 'Tour Vintgar Gorge de madrugada',
          description: 'Salida desde el hostel antes de las 8am.',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Regreso al lago',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo libre',
          description: '',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Lago Bohinj de día',
          description: 'Drive de 30 min, paseo por la orilla del lago más tranquilo de Eslovenia.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Cascada Savica (2 horas ida y vuelta desde el aparcamiento de Bohinj)',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Regreso a Bled para cenar',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Lago Bohinj y cascada Savica',
      items: [
        {
          time: '09:00',
          title: 'Salida en carro hacia Bohinj (30 min desde Bled)',
          description: '',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Paseo por la orilla del lago Bohinj',
          description: 'Sin barcos de turistas, agua igualmente esmeralda.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Sendero a la cascada Savica (2 horas ida y vuelta)',
          description: '',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Almuerzo en el muelle de Ribčev Laz',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Regreso a Bled para recoger el equipaje',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Opcional: baño en el lago antes de continuar o pasar la noche en Bled',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Ruta a Bovec por el Puerto de Vrsic y rafting en el Soča',
      items: [
        {
          time: '08:30',
          title: 'Salida hacia Bovec por el Puerto de Vrsic',
          description: '1.5 horas — la carretera más espectacular de los Alpes Julianos.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Parada en el mirador del Puerto de Vrsic (1,611 metros)',
          description: '',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Llegada a Bovec',
          description: 'Check-in en Camp Korita.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en el hostel',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Rafting en el Soča (2–3 horas con guía — reservar con antelación)',
          description: '',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Regreso al hostel',
          description: 'Cena comunitaria o en el bar del Camp.',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Pozas esmeraldas y kayak en el Soča',
      items: [
        {
          time: '09:00',
          title: 'Desayuno en el hostel',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Senderismo libre a las pozas esmeraldas del Soča (30 min desde el hostel, acceso libre)',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en Bovec pueblo',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Kayak de alquiler por libre en el Soča (€20–30 EUR/hora)',
          description: '',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena en Bovec',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 8,
      title: 'Llegada a Piran y primer baño en el Adriático',
      items: [
        {
          time: '09:00',
          title: 'Salida hacia Piran (1.5 horas desde Bovec)',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Llegada a Piran',
          description: 'Aparcamiento en el parking exterior (los coches no entran al centro histórico).',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Check-in en hostal del centro histórico',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en la Plaza Tartini frente al mar',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Primer baño en el Mar Adriático (25°C en julio)',
          description: '',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Paseo por las murallas medievales de Piran con vistas a Italia en días despejados',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena de pescado fresco en el puerto',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 9,
      title: 'Salinas de Sečovlje y playa libre',
      items: [
        {
          time: '09:00',
          title: 'Desayuno en el mercado de Piran',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Salinas de Sečovlje (20 min en carro)',
          description: 'La única salina activa de Eslovenia, Patrimonio UNESCO.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo de regreso en Piran',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Tarde libre de playa',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Última cena en Piran',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 10,
      title: 'Regreso a Ljubljana',
      items: [
        {
          time: '08:00',
          title: 'Desayuno y recogida de equipaje',
          description: '',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Salida hacia Ljubljana (2 horas)',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Última parada en el Mercado Central de Ljubljana',
          description: 'Café y los krofi (donuts eslovenos con mermelada de rosa mosqueta).',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Devolución del carro en el aeropuerto LJU',
          description: '',
          tags: [],
        },
        {
          time: '15:00+',
          title: 'Vuelo de regreso o conexión al siguiente destino',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Celica Hostel',
      type: 'Hostel · Ljubljana',
      priceTier: '$',
      description: 'El hostal más singular de los Balcanes: una cárcel de la época de la Yugoslavia comunista reconvertida en hostal de diseño. Cada celda fue intervenida por un artista diferente — las rejas originales siguen en su lugar, el arte también. Café propio, galería, eventos nocturnos y una ubicación en el barrio de Metelkova a dos cuadras del mercado central. Para el viajero solo que quiere base en Ljubljana sin pagar precio de hotel: Celica tiene dorms desde €22 y habitaciones privadas desde €60. Precio estimado: €22–30/noche dorm · €60–85/noche privada.',
      tag: 'Antigua cárcel reconvertida en hostal de diseño',
      affiliateUrl: 'https://www.booking.com/hotel/si/hostel-celica.en-gb.html',
    },
    {
      name: 'Bled Hostel',
      type: 'Hostel · Lago Bled',
      priceTier: '$',
      description: 'El hostal más céntrico y más social del lago: a 3 minutos caminando de la orilla, bar propio donde los mochileros se organizan en grupos para subir al Castillo de Bled a la primera hora o compartir transporte al Lago Bohinj. Desayuno disponible, cocina comunitaria, WiFi y el personal que lleva años sabiendo cuáles son los miradores menos conocidos. Para el viajero solo que quiere hacer amigos: Bled Hostel tiene la infraestructura para eso. Precio estimado: €26–32/noche dorm · €65–85/noche privada.',
      tag: 'El hostal más social, a 3 minutos del lago',
      affiliateUrl: 'https://www.booking.com/hotel/si/hostel-joya.html',
    },
    {
      name: 'Camp Korita',
      type: 'Camping · Valle del Soča',
      priceTier: '$',
      description: 'Hostal campestre en el valle del río Soča — el río más verde del planeta — a pasos de los mejores puntos de acceso al agua y a las rutas de rafting. Ambiente de aventura outdoor: kayak, rafting y senderismo en los alrededores directos, cena comunitaria, bar de cerveza eslovena y la terraza con vistas al valle alpino. Para la noche más diferente del roadtrip: rodeado de los Alpes Julianos con el sonido del río de fondo. Precio estimado: €18–28/noche dorm · €55–75/noche privada.',
      tag: 'Hostal de aventura junto al río más verde del mundo',
      affiliateUrl: 'http://booking.com/hotel/si/camp-korita.es.html',
    },
  ],

  hotelsDescription: 'Tres bases a precio de mochilero.',

  experiences: [
    {
      name: 'Lake Bled & Vintgar Gorge Half Day Tour',
      description: 'La garganta de Vintgar — 1.6 kilómetros de tablones de madera sobre un cañón con cascadas, pozas esmeraldas y paredes de roca caliza — es la excursión obligatoria desde Bled que la mayoría hace mal: llegan a las 11am con todo el mundo. El tour sale a las 8am cuando la luz entra entre las paredes y el cañón está prácticamente solo. Incluye transporte desde Ljubljana o desde Bled y entrada al sendero. Tiempo total: 4 horas.',
      tags: ['Vintgar Gorge', 'Cascadas', '4 horas'],
      affiliateUrl: 'https://www.getyourguide.com/bled-l1336/bled-la-mejor-experiencia-y-degustacion-gastronomica-del-desfiladero-de-vintgar-t704583/',
    },
    {
      name: 'Soča River Rafting — Bovec',
      description: 'El río Soča tiene el mejor rafting de los Alpes con agua a 8–12°C de origen glaciar y un verde imposible que los ópticos dicen que no existe en la naturaleza. Las excursiones de rafting desde Bovec duran 2–3 horas con guía, casco y traje de neopreno incluidos. Para el viajero solo: los grupos son mixtos y el dinero empleado en el alquiler del carro se recupera en experiencia pura. Nivel principiante o intermedio disponible.',
      tags: ['Rafting', 'Río glaciar', 'Grupos mixtos'],
      affiliateUrl: 'https://www.getyourguide.com/bovec-l32330/bovec-rafting-de-aventura-en-el-rio-esmeralda-soca-fotos-gratis-t609351/',
    },
    {
      name: 'Ljubljana Bike Tour with Local Guide',
      description: 'La capital eslovena tiene un centro histórico completamente peatonal y una red de carriles bici que cubre la mayor parte de los barrios de interés. El bike tour con guía local dura 3 horas, pasa por el Castillo de Ljubljana, el Mercado Central de Plečnik (el arquitecto que diseñó la ciudad casi entera en los años 30), los murales de Metelkova y los puentes triples. La mejor introducción posible para el primer día en el país. Disponible en inglés y español.',
      tags: ['Bike tour', 'Guía local', '3 horas'],
      affiliateUrl: 'https://www.getyourguide.com/liubliana-l318/liubliana-tour-en-bici-por-el-arte-urbano-y-la-cultura-alternativa-t1158847/',
    },
  ],

  experiencesDescription: 'Lagos, gargantas y ríos verdes.',

  tips: [
    'El agua de grifo es bebible: Toda Eslovenia tiene agua del grifo de calidad de montaña. No compres botellas de plástico — el impacto ambiental en un país donde el 60% del territorio es bosque protegido no tiene sentido cuando el agua del grifo es mejor que la embotellada.',
    'La vinheta: Eslovenia cobra un peaje por usar sus autopistas mediante una vinheta (pegatina de vinilo para el parabrisas). Cuesta €15 EUR para 7 días o €30 EUR para un mes. Se compra en cualquier gasolinera fronteriza o en la app oficial. Sin vinheta, la multa en carretera es de €300 EUR.',
    'Plečnik: Jože Plečnik es el arquitecto que diseñó Ljubljana casi en su totalidad entre 1921 y 1956: los puentes triples, el Mercado Central, la Biblioteca Nacional, las escaleras del Castillo. No es una figura que aparezca en los libros de historia de arte fuera de Eslovenia, pero la ciudad completa es un museo de su trabajo. Vale buscar dos artículos sobre él antes de llegar.',
  ],

  funFact: 'El Lago Bled fue la primera pista de remo olímpica de agua natural usada en unos Juegos Olímpicos — en 1966 para los Campeonatos del Mundo. En 2023 albergó el Campeonato Mundial de Remo. El lago tiene exactamente 2.1 km de largo y 1.3 km de ancho: las dimensiones perfectas para una distancia de remo olímpica. Ni un metro más, ni uno menos.',

  checklist: [
    '💧 Lleva una botella reutilizable — el agua del grifo es potable en todo el país',
    '💶 Ten efectivo o tarjeta a mano para la vinheta de autopista (€15/7 días)',
    '🩱 Empaca traje de baño para el Lago Bled y el Mar Adriático',
    '🧥 Lleva capas ligeras: hasta 32°C en el valle, 18°C en los Alpes',
    '👟 Trae calzado de trekking para Vintgar Gorge y la cascada Savica',
    '🪪 Confirma tu licencia de conducir antes del roadtrip',
    '🩳 Usa ropa de secado rápido bajo el traje de neopreno del rafting',
    '📅 Reserva el rafting en Bovec con antelación',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto de Ljubljana Jože Pučnik (LJU), a 27 km del centro. Vuelos directos desde Londres, Frankfurt, Amsterdam, Madrid y Viena. Desde México o Latinoamérica: conexión en cualquier hub europeo. Alternativa económica: volar a Trieste (Italia) o Zagreb (Croacia) y entrar en carro alquilado o autobús — ambas opciones pueden ser hasta €100 EUR más baratas en vuelo.',
    },
    {
      mode: 'El carro',
      description: 'Eslovenia tiene 20,000 km² y los diez destinos más interesantes del país están a menos de 2.5 horas de distancia entre sí. Alquilar un carro en Ljubljana por €25–40 EUR/día durante los 10 días es la decisión que hace que el viaje funcione. Sin carro, la mitad de las paradas son inaccesibles en transporte público.',
    },
    {
      mode: 'Clima en julio',
      description: 'Días de 26–32°C en el valle, 18–22°C en los Alpes. El Lago Bled alcanza los 24°C en julio — temperatura de baño. El río Soča nunca pasa de los 12°C — neopreno obligatorio para el rafting. Sin lluvia significativa en julio.',
    },
  ],
}
