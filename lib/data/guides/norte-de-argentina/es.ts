import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'norte-de-argentina',
  locale: 'es',

  hero: {
    title: 'Norte de Argentina: Salta & Quebrada de Humahuaca',
    subtitle: 'El noroeste argentino no necesita esforzarse para impresionar. Tiene montañas de catorce colores, pueblos de adobe con 400 años sin reformar, la mejor empanada del país y el silencio que la Patagonia tiene pero sin el frío.',
    eyebrow: 'Guía curada · Amigas · 4 días · Lujo, relax, arte',
    tags: ['Amigas', 'Lujo', 'Relax', 'Arte'],
    image: '/images/guides/norte-de-argentina.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Salta: la ciudad colonial más bella de Argentina',
      items: [
        {
          time: '13:00',
          title: 'Check-in y primer café en el patio',
          description: 'Llegada a Salta. Check-in en Legado Mítico.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Plaza 9 de Julio y Catedral',
          description: 'La tarde para la Plaza 9 de Julio y la Catedral Basílica.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Teleférico al Cerro San Bernardo',
          description: 'Vistas panorámicas de la ciudad.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en El Solar del Convento',
          description: 'Cocina salteña de autor en un claustro colonial.',
          tags: [],
        },
        {
          time: '22:00',
          title: 'Peña en Balcarce',
          description: 'El corredor de peñas folclóricas donde el bombo y el charango suenan hasta la madrugada.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Valles Calchaquíes y bodegas',
      items: [
        {
          time: '08:30',
          title: 'Salida en transfer privado',
          description: 'Excursión privada hacia el sur por los Valles Calchaquíes.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Llegada a Cafayate',
          description: '160 km, aproximadamente 2.5 horas de ruta.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Visita y cata en Bodega El Esteco o Domingo Hermanos',
          description: 'Cata de torrontés, el vino blanco más representativo de Argentina.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Almuerzo en Cafayate',
          description: 'Empanadas al horno de barro.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Regreso hacia Salta',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Llegada. Cena ligera o spa en el hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'La Quebrada de Humahuaca',
      items: [
        {
          time: '08:00',
          title: 'Salida desde Salta',
          description: 'Salida temprana hacia el norte.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Purmamarca (Cerro 7 Colores, artesanías, empanadas)',
          description: 'La imagen del viaje.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Almuerzo en Tilcara, check-in en CasaCalma',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Piscina / descanso / caminata por Tilcara',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Pachamama',
          description: 'Cocina andina local, pocas mesas.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Hornocal y regreso',
      items: [
        {
          time: '06:30',
          title: 'Salida temprana hacia Hornocal',
          description: 'El desvío más importante del viaje.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Serranía de Hornocal (mirador principal)',
          description: 'Catorce colores en una formación de roca de 4 kilómetros de frente, a 4,350 metros. Lleva agua, abrigo y la cámara con batería.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Regreso hacia Salta vía Humahuaca',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Llegada a Salta, entrega del coche y vuelo',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Legado Mítico Salta',
      type: 'Hotel boutique · Salta centro histórico',
      priceTier: '$$$',
      description: 'Una mansión de 1930 en el centro histórico de Salta convertida en hotel boutique de once habitaciones — cada una con nombre propio y dedicada a un personaje de la historia argentina. Biblioteca con sillones de cuero, patio interior con jazmines, pillow menu y desayuno buffet con yogur artesanal. A 500 metros de la Plaza 9 de Julio, sin ruido de calle. Precio estimado: $160–300 USD/noche.',
      tag: 'Mansión 1930 con carácter',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/BXLpR7YhAQ',
      archetypes: ['Parejas'],
    },
    {
      name: 'CasaCalma Hotel Boutique',
      type: 'Hotel boutique · Tilcara',
      priceTier: '$$$',
      description: 'Boutique de jardines y piscina en Tilcara, el pueblo de la Quebrada de Humahuaca a 2,461 metros sobre el nivel del mar. Desayuno buffet incluido, terraza con vistas al cerro multicolor y una escala más íntima que cualquier cadena. A cuatro cuadras de la plaza principal. Precio estimado: $120–200 USD/noche.',
      tag: 'Jardines y piscina en la Quebrada',
      affiliateUrl: 'https://www.booking.com/hotel/ar/casacalma-tilcara.en-gb.html?aid=311984&label=casacalma-tilcara-2bgwmtcgvdW91HTtP__cZQS675444454441%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atiaud-2393881721446%3Akwd-2485497643367%3Alp9047093%3Ali%3Adec%3Adm%3Appccp%3DUmFuZG9tSVYkc2RlIyh9YboIMJYQAPicrzwdxpGM5o8&sid=ce3990bc71d7c5bd11b7b98f41809970&age=1&all_sr_blocks=945359105_367026340_2_34_0&checkin=2026-06-23&checkout=2026-06-26&dest_id=-1016953&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&highlighted_blocks=945359105_367026340_2_34_0&hpos=1&matching_block_id=945359105_367026340_2_34_0&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&sr_pri_blocks=945359105_367026340_2_34_0__19038&srepoch=1779193813&srpvid=9fa757dffa4e0c52&type=total&ucfs=1&',
      archetypes: ['Parejas'],
    },
    {
      name: 'Las Marías Hotel Boutique',
      type: 'Hotel boutique · Tilcara',
      priceTier: '$$$',
      description: 'El hotel mejor valorado de Tilcara por cuatro años consecutivos — número 1 en TripAdvisor de entre 21 opciones — en una casa diseñada con piedra y madera local. Doce habitaciones con terraza privada, vistas panorámicas a los cerros multicolores, spa con hidromasaje, piscina exterior de temporada y restaurante con menú de cocina andina. A tres cuadras de la plaza principal de Tilcara. Precio estimado: $150–200 USD/noche.',
      tag: 'Vistas, spa y cocina andina',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/w_BaYY9D-S',
      archetypes: ['Parejas', 'Bienestar'],
    },
  ],

  hotelsDescription: 'Dos bases con carácter propio: Salta para la primera mitad del viaje y la Quebrada de Humahuaca para la segunda.',

  experiences: [
    {
      name: 'Visita a la bodega Cachi y cata de torrontés',
      description: 'El torrontés salteño es el vino blanco más representativo de Argentina — aromático, floral y completamente diferente al torrontés que se cultiva en Galicia. Las bodegas de los Valles Calchaquíes (Cachi, Cafayate) ofrecen visitas con cata desde $20–40 USD. El paisaje de viñedos a 1,700 metros de altura con los cerros anaranjados de fondo es el argumento visual más convincente del viaje.',
      tags: ['Bodega', 'Vino', 'Paisaje'],
      affiliateUrl: '',
    },
    {
      name: 'Tren a las Nubes (opcional, según disponibilidad)',
      description: 'El tren que sube desde Salta hasta el viaducto La Polvorilla a 4,200 metros de altura opera de forma irregular — verificar disponibilidad en el sitio oficial antes de planificar el itinerario alrededor de él. Si opera: es uno de los recorridos ferroviarios más espectaculares de América del Sur.',
      tags: ['Tren', 'Altitud', 'Paisaje'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/j4LbWaVi1o',
    },
    {
      name: 'Recorrido por la Quebrada de Humahuaca',
      description: 'El tramo de 155 kilómetros entre Jujuy y Humahuaca fue declarado Patrimonio de la Humanidad por la UNESCO en 2003. Purmamarca (el cerro de los Siete Colores), Tilcara (el Pucará y el mercado de artesanías), Humahuaca (el cabildo y los músicos de charango en la plaza) y la Serranía de Hornocal (el Cerro de los Catorce Colores, a 70 kilómetros de Humahuaca) son las cuatro paradas que justifican el desvío hasta el norte.',
      tags: ['UNESCO', 'Cultura', 'Paisaje'],
      affiliateUrl: 'https://www.getyourguide.com/es-mx/capital-l1153/salta-quebrada-de-humahuaca-t476303/?ranking_uuid=1c537976-cb7c-48b1-9ef4-09a014a70f1f',
    },
  ],

  tips: [
    'La empanada salteña: La empanada más seria de Argentina se hace al horno de barro, con masa de trigo, relleno de carne cortada a cuchillo (no molida), papa, cebolla y comino. Sin aceitunas, sin huevo duro — eso es la versión de Buenos Aires. La referencia en Salta es El Patio de la Empanada, a dos cuadras de la plaza.',
    'La altitud en la Quebrada: Tilcara está a 2,461 metros; Humahuaca a 2,940; Hornocal a 4,350. Si en Cusco la altitud importa, aquí también — especialmente en Hornocal. Camina despacio, no corras, lleva agua y chocolates.',
    'El peso argentino: Argentina tiene una situación cambiaria particular. Consulta el tipo de cambio oficial vs. el cambio blue antes de viajar — la diferencia puede ser significativa. Los hoteles de la selección aceptan tarjeta internacional, pero para artesanías y restaurantes pequeños se necesita efectivo en pesos.',
  ],

  funFact: 'La Quebrada de Humahuaca ha estado habitada de forma continua durante 10,000 años. El Camino Real que la recorre — hoy la Ruta Nacional 9 — fue la principal arteria del Imperio Inca y después de la colonia española para conectar el Alto Perú (hoy Bolivia) con Buenos Aires. Los pueblos de la Quebrada hablan quechua antes que español en las conversaciones entre vecinos.',

  checklist: [
    '🧥 Capas para el invierno austral (días templados, noches frías)',
    '🧤 Guantes y gorro para Hornocal (4,350 m)',
    '💧 Agua y chocolates para la altitud',
    '📷 Cámara con batería de repuesto',
    '💵 Efectivo en pesos argentinos para artesanías',
    '🥾 Calzado cómodo para caminatas por pueblos andinos',
    '🕶️ Lentes de sol y bloqueador (sol de altura)',
    '🧉 Disposición para el folclor y la peña',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Internacional Martín Miguel de Güemes (SLA) en Salta, a 9 kilómetros del centro. Vuelos directos desde Buenos Aires (AEP/EZE) con Aerolíneas Argentinas, Flybondi y JetSMART en aproximadamente 2 horas. Desde Ciudad de México o Santiago: conexión en Buenos Aires.',
    },
    {
      mode: 'Traslados',
      description: 'La Quebrada de Humahuaca se recorre en auto con conductor o alquiler propio. Las distancias son manejables — de Salta a Tilcara son 84 kilómetros por la RN9. Transfer privado con conductor para los 4 días: $150–250 USD total para el grupo, la opción más eficiente para un grupo de amigas.',
    },
    {
      mode: 'Clima en junio',
      description: 'Invierno austral. Días soleados y secos, 15–20°C. Noches frías, especialmente en la Quebrada: 0–5°C. La temporada seca de junio es la ideal para la fotografía — sin nubes, sin lluvia, colores al máximo.',
    },
  ],
}
