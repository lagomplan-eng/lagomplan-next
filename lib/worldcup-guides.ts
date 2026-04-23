import { url } from "inspector"

export interface WorldcupGuide {
  id: string
  city: string
  country: string
  state: string
  short: string
  flag: string
  accent: string
  stadium: { name: string; capacity: string }
  matches: Array<{ date: string; day: string; teams: [string, string, string]; highlight: boolean }>
  scores: Record<string, { value: number; label: string }>
  manifesto: { headline: string; body: string; lagomNote: string }
  vibe: { body: string; zones: Array<{ name: string; type: string; desc: string }>; lagomNote: string }
  neighborhoods: Array<{ name: string; vibe: string; best_for: string; walk_to_stadium: string }>
  hotels: Array<{ name: string; price: string; area: string; note: string; url: string }>
  logistics: { arrival: string; airport_to_city: string; stadium_transport: string; visa: string; lagomNote: string }
  meetingPoints: Array<{ name: string; area: string; desc: string }>
  food: Array<{ dish: string; where: string; price: string; type: string }>
  experiences: Array<{ title: string; duration: string; desc: string; type: string }>
  closingNote: string
  closingSignature: string
  plannerCTA: string
}

export interface RosterItem {
  id: string
  city: string
  country: string
  flag: string
}

const CDMX: WorldcupGuide = {
  id:"cdmx", city:"Ciudad de México", country:"México", state:"CDMX",
  short:"CDMX", flag:"🇲🇽", accent:"#6B8F86",
  stadium:{ name:"Estadio Azteca", capacity:"87,523" },
  matches:[
    { date:"11 Jun", day:"Jue", teams:["México","vs","Sudáfrica"],   highlight:true  },
    { date:"17 Jun", day:"Mié", teams:["Portugal","vs","Alemania"], highlight:false },
    { date:"24 Jun", day:"Mié", teams:["México","vs","Argentina"],  highlight:true  },
  ],
  scores:{ ambiente:{value:5,label:"Ambiente"}, cultura:{value:5,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:4,label:"Transporte"}, seguridad:{value:3,label:"Seguridad"}, costo:{value:5,label:"Costo"} },
  manifesto:{
    headline:"El Azteca no es solo un estadio. Es una cita con la historia.",
    body:"El Estadio Azteca ha visto la Mano de Dios, el Gol del Siglo, dos finales de Copa del Mundo. No hay otro recinto en el planeta con ese peso. El 14 de junio, cuando México salte al campo para su primer partido mundialista en casa desde el 86, los 87 mil del Coloso de Santa Úrsula van a hacer temblar el suelo. Ciudad de México no recibe el torneo — lo protagoniza.",
    lagomNote:"CDMX es la sede más barata del torneo para visitantes internacionales. Hotel, comida y transporte cuestan entre el 30 y el 50% menos que cualquier sede de EE.UU. Aprovéchalo — quédate más días.",
  },
  vibe:{
    body:"El Zócalo se convierte en el fan fest más grande del continente desde 6 horas antes de cada partido. Pantallas gigantes, músicos en vivo, taqueros, cerveza fría. La afición mexicana no necesita instrucciones para celebrar — lleva décadas perfeccionando el ritual.",
    zones:[
      { name:"Zócalo", type:"Fan fest oficial", desc:"El corazón de México. El pre-partido más masivo e intenso del torneo. Llega 4 horas antes." },
      { name:"La Botica Pulquería", type:"Bar", desc:"Roma Norte. Pulque de verdad, ambiente de barrio, la gente más interesante de la ciudad." },
      { name:"Cantina La Mascota", type:"Histórico", desc:"Fundada en 1954. A 3 cuadras del Zócalo. Historia pura." },
    ],
    lagomNote:"El tranvía Azteca desde Tasqueña ($8 pesos) es el transporte correcto para el partido. No hay alternativa mejor. El Uber en día de partido es una trampa.",
  },
  neighborhoods:[
    { name:"Roma Norte",       vibe:"Cafés, bares, restaurantes top. Seguro, estético, con alma.", best_for:"Pareja",  walk_to_stadium:"40 min (Metro+tranvía)" },
    { name:"Condesa",          vibe:"Tranquilo, elegante, lleno de parques. La base ideal.", best_for:"Pareja / Familia", walk_to_stadium:"40 min (Metro+tranvía)" },
    { name:"Polanco",          vibe:"Seguro, hoteles de cadena, fácil para familia.", best_for:"Familia",  walk_to_stadium:"50 min" },
    { name:"Centro Histórico", vibe:"Historia masiva, muy turístico. Atención de noche.", best_for:"Fan WC",  walk_to_stadium:"40 min (Metro)" },
  ],
  hotels:[
    { name:"Condesa DF",          price:"$$$", area:"Condesa",    note:"El hotel de la ciudad para parejas. Azotea, diseño excepcional, terraza icónica.", url:"https://booking.stay22.com/lagomplan/o4UKtBz68_" },
    { name:"Hotel Carlota",       price:"$$",  area:"Roma Norte", note:"Diseño, ubicación perfecta, desayuno que vale la noche.", url:"https://booking.stay22.com/lagomplan/o3dW4TZ9vy" },
    { name:"Casa Comtesse",       price:"$$",  area:"Roma Norte", note:"Boutique, íntimo, estética editorial.", url:"https://hotelscom.stay22.com/lagomplan/MYxA88F_WA" },
    { name:"NH Collection Reforma", price:"$$", area:"Reforma",  note:"Familiar, bien ubicado, alberca en el piso 14.", url:"https://hotelscom.stay22.com/lagomplan/3la99RrZLl" },
    { name:"Freehand CDMX",       price:"$",   area:"Roma Norte", note:"Social, económico, bar en el rooftop.", url:"" },
  ],
  logistics:{
    arrival:"Para visitantes de otras ciudades de México: vuelo doméstico o CDMX ya es tu sede. Para internacionales: AICM o NAICM con conexiones directas desde toda Latinoamérica.",
    airport_to_city:"Metro Línea B desde NAICM hasta el centro ($5 pesos, 30 min). Desde AICM: Metro Línea 5 o taxi autorizado ($200–350 pesos).",
    stadium_transport:"Metro Línea 2 hasta Tasqueña, luego tranvía al Azteca. $8 pesos total. 45 min desde Roma/Condesa. La única opción correcta.",
    visa:"Mexicanos: sin trámite. Internacionales: revisar requisitos en embajada.sre.gob.mx.",
    lagomNote:"Llega al Azteca 3.5 horas antes. El ambiente exterior vale más tiempo que el interior. Los ultras llegan desde las 11am.",
  },
  meetingPoints:[
    { name:"Zócalo Plaza",      area:"Centro",    desc:"Fan zone oficial. Pantallas gigantes, música en vivo. El pre-partido más masivo del torneo." },
    { name:"Parque México",     area:"Condesa",   desc:"Punto de reunión para grupos. Tranquilo, con cafeterías alrededor." },
    { name:"Mercado de Medellín", area:"Roma Sur", desc:"Desayuno pre-partido. Los mejores jugos y enchiladas de la colonia." },
    { name:"Explanada del Azteca", area:"Estadio", desc:"Fan zone exterior 4 horas antes. Grupos de animación, taqueros, cerveza." },
  ],
  food:[
    { dish:"Tacos de canasta",  where:"Cualquier canastero en Tepito o La Merced",     price:"$10–15 c/u", type:"Ritual" },
    { dish:"Mole negro",        where:"El Cardenal, Centro Histórico",                 price:"$$",         type:"Ocasión especial" },
    { dish:"Tostadas de tinga", where:"Tostadas Coyoacán",                             price:"$",          type:"Imperdible" },
    { dish:"Birria de res",     where:"El Borrego Viudo, Tacubaya",                    price:"$",          type:"Pre-partido" },
    { dish:"Cena de autor",     where:"Rosetta, Roma Norte — reserva anticipada",      price:"$$$",        type:"Pareja" },
    { dish:"Pulque curado",     where:"La Botica Pulquería, Roma Norte",               price:"$",          type:"Cultural" },
  ],
  experiences:[
    { title:"El Azteca desde adentro",    duration:"4 horas",      desc:"El estadio más grande del torneo. 87 mil personas cantando el himno.", type:"Imperdible" },
    { title:"Recorrido Centro Histórico", duration:"Medio día",    desc:"Zócalo, Palacio Nacional, Templo Mayor. La historia de México en tres cuadras.", type:"Cultural" },
    { title:"Coyoacán a pie",             duration:"3 horas",      desc:"Casa de Frida, mercado de artesanías, jardín central. El barrio más querido de CDMX.", type:"Familia" },
    { title:"Museos de Chapultepec",      duration:"Día completo", desc:"El MNA, el MUCA, el Castillo. El parque urbano más grande del mundo.", type:"Cultural" },
    { title:"Rooftop en Roma Norte",      duration:"Noche",        desc:"Los mejores bares con terraza de la ciudad. El plan de la noche anterior al partido.", type:"Pareja" },
  ],
  closingNote:"CDMX no recibe el Mundial como quien presta su casa. Lo abraza como quien siempre supo que era suya.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Ciudad de México",
}

const GDL: WorldcupGuide = {
  id:"gdl", city:"Guadalajara", country:"México", state:"Jalisco",
  short:"GDL", flag:"🇲🇽", accent:"#8B2635",
  stadium:{ name:"Estadio Akron", capacity:"49,850" },
  matches:[
    { date:"11 Jun", day:"Mié", teams:["Portugal","vs","Uruguay"],    highlight:false },
    { date:"17 Jun", day:"Mar", teams:["Argentina","vs","Sudáfrica"], highlight:false },
    { date:"23 Jun", day:"Lun", teams:["Portugal","vs","Marruecos"],  highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:4,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:3,label:"Transporte"}, seguridad:{value:4,label:"Seguridad"}, costo:{value:5,label:"Costo"} },
  manifesto:{
    headline:"Guadalajara es México en su versión más accesible. Y el Akron, uno de los estadios más lindos del torneo.",
    body:"La perla tapatía tiene algo que las otras sedes mexicanas no tienen: escala humana. No es el caos de CDMX ni la frialdad industrial de Monterrey. Guadalajara es tequila, birria, mariachis y afición de Chivas en el barrio. Y Portugal juega aquí — lo que significa que la comunidad portuguesa de EE.UU. y Canadá va a llegar en masa a una ciudad que no esperaban amar tanto.",
    lagomNote:"El Estadio Akron está en Zapopan, a 20 min del Centro en Uber. La ciudad de Guadalajara tiene transporte propio que funciona. El Tren Ligero llega a varios puntos útiles pero no al estadio — Uber es la opción correcta para el partido.",
  },
  vibe:{
    body:"Las Nueve Esquinas — el barrio histórico de cantinas de Guadalajara — tiene el pre-partido más auténtico del torneo mexicano. Cantinas de barrio, cerveza de barril, afición tapatía mezclada con visitantes internacionales.",
    zones:[
      { name:"Plaza de Armas",      type:"Fan fest oficial",  desc:"Centro histórico. Fan zone oficial desde el mediodía." },
      { name:"Las Nueve Esquinas",  type:"Barrio histórico",  desc:"El ambiente más auténtico del torneo mexicano. Cantinas de barrio, birria, afición local." },
      { name:"Avenida Chapultepec", type:"Zona de bares",     desc:"El corazón social de Guadalajara. Bares, terrazas, restaurantes en fila." },
    ],
    lagomNote:"La birria de Guadalajara es la mejor del mundo y no es debate. Desayuna birria el día del partido. Es un ritual que da suerte.",
  },
  neighborhoods:[
    { name:"Colonia Americana", vibe:"El barrio más animado. Cafés, bares, restaurantes de todos los rangos.", best_for:"Pareja",  walk_to_stadium:"25 min (Uber)" },
    { name:"Tlaquepaque",       vibe:"Artesanías, galerías, restaurantes en espacios coloniales.",             best_for:"Familia", walk_to_stadium:"30 min (Uber)" },
    { name:"Centro Histórico",  vibe:"Arquitectura colonial, mercados, muy turístico.",                        best_for:"Fan WC",  walk_to_stadium:"20 min (Uber)" },
    { name:"Zapopan",           vibe:"Tranquilo, moderno, cerca del Akron.",                                   best_for:"Familia", walk_to_stadium:"10 min (Uber)" },
  ],
  hotels:[
    { name:"Quinta Real Guadalajara", price:"$$$", area:"López Mateos",  note:"En una antigua plaza de toros. Arquitectura excepcional.", url:"" },
    { name:"Casa Fayette",            price:"$$",  area:"Col. Americana", note:"Boutique, jardín, desayuno incluido. El favorito de la pareja con criterio.", url:"" },
    { name:"Demetria Hotel",          price:"$$",  area:"Col. Americana", note:"Diseño contemporáneo, bar en planta baja, en el mejor barrio.", url:"" },
    { name:"Hilton Garden Inn GDL",   price:"$$",  area:"Zapopan",        note:"Familiar, con alberca, a 10 min del Akron.", url:"" },
    { name:"Hotel Morales",           price:"$",   area:"Centro",         note:"Histórico, económico, bien ubicado para el transporte.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo directo CDMX–GDL: 1h10min. Desde EE.UU.: vuelos directos desde LAX, SFO, ORD.",
    airport_to_city:"Uber desde el aeropuerto al Centro: $180 pesos, 25 min.",
    stadium_transport:"Uber desde Colonia Americana al Akron: $80 pesos, 15 min.",
    visa:"Mexicanos: sin trámite. Internacionales: mismos requisitos que cualquier ciudad de México.",
    lagomNote:"Si manejas desde CDMX son 5.5 horas — solo si lo conviertes en road trip con paradas en Lagos de Moreno y San Juan de los Lagos.",
  },
  meetingPoints:[
    { name:"Plaza de la Liberación",   area:"Centro",   desc:"Fan zone oficial con pantallas. Punto de partida obligatorio." },
    { name:"Mercado San Juan de Dios", area:"Centro",   desc:"El mercado más grande de Latinoamérica. Desayuno pre-partido insuperable." },
    { name:"La Fuente",                area:"Centro",   desc:"Bar histórico con mezcal artesanal. Noche antes del partido." },
    { name:"Estadio Akron Plaza",      area:"Zapopan",  desc:"Fan zone exterior desde 3 horas antes." },
  ],
  food:[
    { dish:"Birria de res",       where:"El Kiosco de la Birria, Zapopan",           price:"$",   type:"Imperdible" },
    { dish:"Tortas ahogadas",     where:"El Güero de Chapultepec",                   price:"$",   type:"Local" },
    { dish:"Degustación tapatía", where:"La Tequila Restaurante, Col. Americana",    price:"$$$", type:"Pareja" },
    { dish:"Carne asada",         where:"La Morena — abierta hasta las 2am",         price:"$$",  type:"Post-partido" },
    { dish:"Mezcal artesanal",    where:"La Fuente o La Tequileña, Centro",          price:"$",   type:"Ritual" },
  ],
  experiences:[
    { title:"El Akron antes del partido", duration:"3 horas",    desc:"El estadio de los Chivas en modo Mundial. Fachada de tezontle rojo, diseño orgánico.", type:"Imperdible" },
    { title:"Tlaquepaque a pie",          duration:"Medio día",  desc:"El barrio colonial de artesanías más completo de México.", type:"Cultural" },
    { title:"Ruta del tequila",           duration:"Día completo", desc:"Tequila (el pueblo) está a 65 km. Tours organizados desde Guadalajara.", type:"Aventura" },
    { title:"Lago de Chapala",            duration:"Medio día",  desc:"El lago más grande de México a 45 min. Mariscos frescos, puesta de sol icónica.", type:"Familia" },
  ],
  closingNote:"Guadalajara no tiene el ego de CDMX ni la frialdad de Monterrey. Te recibe con birria, tequila, y música de mariachi que empieza cuando menos lo esperas.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Guadalajara",
}

const MTY: WorldcupGuide = {
  id:"mty", city:"Monterrey", country:"México", state:"Nuevo León",
  short:"MTY", flag:"🇲🇽", accent:"#2D4F6C",
  stadium:{ name:"Estadio BBVA", capacity:"53,500" },
  matches:[
    { date:"12 Jun", day:"Jue", teams:["Portugal","vs","Alemania"],   highlight:false },
    { date:"18 Jun", day:"Mié", teams:["Alemania","vs","EUA"],        highlight:false },
    { date:"24 Jun", day:"Mar", teams:["Portugal","vs","Marruecos"],  highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:3,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:4,label:"Transporte"}, seguridad:{value:4,label:"Seguridad"}, costo:{value:4,label:"Costo"} },
  manifesto:{
    headline:"Monterrey es el viaje que no sabías que necesitabas. El BBVA es el estadio más fotogénico del torneo.",
    body:"El Estadio BBVA tiene el Cerro de la Silla como telón de fondo en cada fotografía. Es probablemente la imagen más reproducida del Mundial 2026 antes de que empiece. Monterrey lleva 10 años reinventando su escena gastronómica. Portugal y Alemania juegan aquí.",
    lagomNote:"Monterrey en junio puede llegar a 38°C. Prioriza hoteles con alberca, hidratación constante, y actividades en horario de mañana temprano o nocturno.",
  },
  vibe:{
    body:"El Paseo Santa Lucía — canal artificial con bares y restaurantes en ambas orillas — es el fan zone más fotogénico del torneo. 3 kilómetros lineales con ambiente festivo, a 15 min en Uber del BBVA.",
    zones:[
      { name:"Paseo Santa Lucía",   type:"Fan zone natural",  desc:"Canal con bares y restaurantes. El ambiente pre-partido más bonito de las sedes mexicanas." },
      { name:"Barrio Antiguo",      type:"Histórico",         desc:"Arquitectura colonial, mezcal, bares independientes. La noche antes del partido." },
      { name:"BBVA Stadium Plaza",  type:"Fan fest oficial",  desc:"Exterior del estadio desde 3 horas antes. Con el Cerro de la Silla al fondo." },
    ],
    lagomNote:"El Mirador del Obispado al atardecer previo al partido — con el BBVA iluminado al fondo — es la fotografía del torneo que nadie anticipa.",
  },
  neighborhoods:[
    { name:"Valle",                   vibe:"El barrio más sofisticado. Restaurantes top, bares de calidad.",       best_for:"Pareja",  walk_to_stadium:"20 min (Uber)" },
    { name:"Barrio Antiguo",          vibe:"Histórico, con vida nocturna, bares independientes.",                  best_for:"Fan WC",  walk_to_stadium:"15 min (Uber)" },
    { name:"San Pedro Garza García",  vibe:"Seguro, moderno, suburbano. Muy tranquilo.",                          best_for:"Familia", walk_to_stadium:"25 min (Uber)" },
  ],
  hotels:[
    { name:"Fiesta Americana Monterrey",    price:"$$$", area:"Valle",          note:"Diseño, ubicación en Valle, rooftop bar.", url:"" },
    { name:"Krystal Grand Monterrey",       price:"$$",  area:"Centro",         note:"Confiable, bien ubicado, precio razonable.", url:"" },
    { name:"Hilton Garden Inn MTY",         price:"$$",  area:"Valle",          note:"Familiar, alberca, desayuno incluido.", url:"" },
    { name:"City Express Plus San Jerónimo", price:"$", area:"San Jerónimo",   note:"Cerca del BBVA, funcional.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–MTY: 1h30min, desde $1,800 pesos ida. El aeropuerto Mariano Escobedo está bien conectado.",
    airport_to_city:"Uber al Centro: $200 pesos, 25 min. Sin metro útil para turistas — todo en Uber.",
    stadium_transport:"Uber desde Valle al BBVA: $60 pesos, 10 min. Sal 2.5 horas antes en día de partido.",
    visa:"Mexicanos: sin trámite. Internacionales: mismos requisitos que cualquier ciudad de México.",
    lagomNote:"Todo en Uber. Monterrey es una ciudad de coche y los Ubers son rápidos y económicos.",
  },
  meetingPoints:[
    { name:"Paseo Santa Lucía",  area:"Centro",  desc:"El punto de encuentro más bonito del torneo. Bares en ambas orillas del canal." },
    { name:"Explanada BBVA",     area:"Estadio", desc:"Fan zone exterior 3 horas antes. Con el Cerro de la Silla al fondo." },
    { name:"Barrio Antiguo",     area:"Centro",  desc:"Calle Morelos. Bares históricos, mezcal, ambiente pre-partido." },
    { name:"Parque Fundidora",   area:"Centro",  desc:"Parque industrial reconvertido. Espacio amplio para familia y grupos." },
  ],
  food:[
    { dish:"Cabrito al pastor",   where:"El Rey del Cabrito, Centro — la institución",   price:"$$",   type:"Imperdible" },
    { dish:"Machacado con huevo", where:"Cualquier fonda del Mercado Juárez",            price:"$",    type:"Desayuno" },
    { dish:"Degustación norteña", where:"Pangea, Col. del Valle — reserva anticipada",   price:"$$$$", type:"Pareja" },
    { dish:"Carne asada",         where:"El Asador Castellano, San Pedro",               price:"$$",   type:"Post-partido" },
    { dish:"Mezcal artesanal",    where:"La Cantina del Barrio Antiguo",                 price:"$",    type:"Ritual" },
  ],
  experiences:[
    { title:"BBVA al atardecer",  duration:"2 horas",   desc:"El estadio más fotogénico del torneo con el Cerro de la Silla al fondo. La luz es perfecta entre 6 y 7pm.", type:"Imperdible" },
    { title:"Parque Fundidora",   duration:"Medio día", desc:"Antigua fundidora de acero convertida en parque urbano. El símbolo de la reinvención de Monterrey.", type:"Cultural" },
    { title:"MARCO",              duration:"3 horas",   desc:"Museo de Arte Contemporáneo de Monterrey. Gratuito los miércoles.", type:"Pareja" },
    { title:"Grutas de García",   duration:"Día completo", desc:"Sistema de cuevas a 45 min de MTY. Teleférico incluido.", type:"Familia" },
  ],
  closingNote:"Monterrey sorprende a los que llegan con prejuicios y confirma a los que ya lo sabían: el norte tiene su propio código.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Monterrey",
}

const LA: WorldcupGuide = {
  id:"la", city:"Los Ángeles", country:"EE.UU.", state:"California",
  short:"LA", flag:"🇺🇸", accent:"#C4622A",
  stadium:{ name:"SoFi Stadium", capacity:"70,240" },
  matches:[
    { date:"14 Jun", day:"Sáb", teams:["México","vs","Uruguay"],    highlight:true  },
    { date:"19 Jun", day:"Jue", teams:["Colombia","vs","Senegal"],  highlight:false },
    { date:"26 Jun", day:"Jue", teams:["México","vs","Arabia S."],  highlight:true  },
  ],
  scores:{ ambiente:{value:5,label:"Ambiente"}, cultura:{value:5,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:4,label:"Transporte"}, seguridad:{value:3,label:"Seguridad"}, costo:{value:2,label:"Costo"} },
  manifesto:{
    headline:"LA no va a recibir el torneo. LA es el partido de local.",
    body:"Hay más afición mexicana en Los Ángeles que en Guadalajara. El SoFi Stadium va a parecer el Azteca el día que juegue México — con mariachis afuera, banda sinaloense adentro, y taqueros en el estacionamiento. Ninguna ciudad del torneo tiene esta densidad de afición latinoamericana.",
    lagomNote:"Los Ángeles en junio puede sorprender: temperatura fresca por las mañanas (18°C), calurosa al mediodía (28°C). Reserva hotel con meses de anticipación — la ciudad se llena completamente para los partidos de México.",
  },
  vibe:{
    body:"Exposition Park — enfrente del SoFi — es el fan fest oficial. Pero el pre-partido real está en los estacionamientos alrededor del estadio: music systems, banda, taqueros, colores de México mezclados con Colombia.",
    zones:[
      { name:"Exposition Park",    type:"Fan fest oficial", desc:"Espacio abierto, pantallas gigantes. Perfecto para familia." },
      { name:"Olvera Street",      type:"Cultural",         desc:"El corazón histórico de la comunidad mexicana en LA." },
      { name:"SoFi Stadium Plaza", type:"Estadio",          desc:"Fan zone exterior 3 horas antes. La concentración de afición latinoamericana más densa del torneo." },
    ],
    lagomNote:"El Metro C Line (Green) desde Vermont/Athens llega directo al SoFi. $2.50 y 35 minutos desde downtown. Es la única opción inteligente.",
  },
  neighborhoods:[
    { name:"Koreatown",   vibe:"Central, precio razonable, acceso al metro.",        best_for:"Fan WC",  walk_to_stadium:"Metro 35 min" },
    { name:"Downtown LA", vibe:"Acceso al metro, hoteles de todos los rangos.",       best_for:"Fan WC",  walk_to_stadium:"Metro 40 min" },
    { name:"Culver City", vibe:"Tranquilo, parques, ideal para familia.",             best_for:"Familia", walk_to_stadium:"25 min (Uber)" },
    { name:"Santa Monica", vibe:"Caro pero cómodo. Playa, bares, restaurantes.",     best_for:"Pareja",  walk_to_stadium:"35 min (Uber)" },
  ],
  hotels:[
    { name:"Ace Hotel DTLA",     price:"$$$", area:"Downtown",  note:"Rooftop, diseño, restaurante de referencia.", url:"" },
    { name:"The LINE Koreatown", price:"$$",  area:"Koreatown", note:"Diseño coreano-americano, acceso al metro.", url:"" },
    { name:"Freehand LA",        price:"$$",  area:"Koreatown", note:"Social, rooftop, bien ubicado para el metro.", url:"" },
    { name:"citizenM DTLA",      price:"$",   area:"Downtown",  note:"Eficiente, moderno, precio competitivo.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–LAX: 4 horas directas. Reserva con 3 meses de anticipación para días de partido de México.",
    airport_to_city:"FlyAway Bus a Union Station ($9.75) + Metro, o Uber (~$45).",
    stadium_transport:"Metro C Line (Green) desde Vermont/Athens. $2.50. 35 minutos. Sin alternativa razonable en día de partido.",
    visa:"Mexicanos: visa de turista americana (B1/B2) o ESTA si califican. Tramitar con 8 semanas de anticipación.",
    lagomNote:"Boyle Heights tiene la concentración más alta de restaurantes mexicanos auténticos de EE.UU. Desayuna ahí el día del partido.",
  },
  meetingPoints:[
    { name:"Olvera Street",        area:"Downtown",  desc:"Barrio histórico mexicano. El más auténtico para pre-partido." },
    { name:"Grand Central Market", area:"Downtown",  desc:"Mercado cubierto, opciones de todos los tipos." },
    { name:"Exposition Park",      area:"Inglewood", desc:"Fan zone oficial. Espacio abierto con pantallas." },
    { name:"Leo's Tacos",          area:"Varios",    desc:"Los mejores tacos al pastor de LA. Abiertos las 24h." },
  ],
  food:[
    { dish:"Tacos al pastor",         where:"Leo's Tacos Truck — varios puntos, 24h",      price:"$",   type:"Imperdible" },
    { dish:"Birria de res",           where:"Teddy's Red Tacos, Mid-City",                  price:"$",   type:"Pre-partido" },
    { dish:"Cena de autor",           where:"Bestia, Arts District — reserva desde México", price:"$$$", type:"Pareja" },
    { dish:"Mariscos estilo Sinaloa", where:"Mariscos Jalisco, East LA",                    price:"$",   type:"Local" },
  ],
  experiences:[
    { title:"Partido de México en el SoFi", duration:"6 horas",  desc:"El partido de local que el aficionado mexicano no había tenido en EE.UU.", type:"Imperdible" },
    { title:"Boyle Heights a pie",          duration:"3 horas",  desc:"El barrio más mexicano de EE.UU. Murales, mercados, taqueros.", type:"Cultural" },
    { title:"Venice Beach",                 duration:"Medio día", desc:"Boardwalk, artistas, músicos, skaters. El espectáculo más gratuito de LA.", type:"Casual" },
    { title:"Griffith Observatory",         duration:"Tarde",    desc:"La mejor vista de LA. Gratis. Atardecer desde el mirador es icónico.", type:"Familia" },
  ],
  closingNote:"LA es el partido de casa que nunca tuvimos. La afición mexicana aquí no necesita anfitrión — son dueños de la ciudad.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Los Ángeles",
}

const MIA: WorldcupGuide = {
  id:"mia", city:"Miami", country:"EE.UU.", state:"Florida",
  short:"MIA", flag:"🇺🇸", accent:"#0E8B8B",
  stadium:{ name:"Hard Rock Stadium", capacity:"65,326" },
  matches:[
    { date:"11 Jun", day:"Mié", teams:["Argentina","vs","Sudáfrica"], highlight:false },
    { date:"17 Jun", day:"Mar", teams:["Colombia","vs","Senegal"],    highlight:false },
    { date:"23 Jun", day:"Lun", teams:["Argentina","vs","México"],    highlight:false },
  ],
  scores:{ ambiente:{value:5,label:"Ambiente"}, cultura:{value:4,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:3,label:"Transporte"}, seguridad:{value:4,label:"Seguridad"}, costo:{value:2,label:"Costo"} },
  manifesto:{
    headline:"Miami no recibe el Mundial. Miami lo convierte en carnaval.",
    body:"La ciudad más latina de EE.UU. en su momento más intenso. El español es el idioma de facto. Argentina y Colombia juegan aquí — lo que significa que Brickell, Wynwood y Little Havana van a tener un nivel de energía que no tienen ni en las noches de año nuevo.",
    lagomNote:"Hard Rock Stadium está en Miami Gardens, al norte de la ciudad. No hay metro directo — todo en Uber ($25-40 desde Brickell). Sal con 2.5 horas de margen.",
  },
  vibe:{
    body:"Wynwood el día del partido es el plan correcto: murales en cada pared, terrazas abiertas, cócteles de colores, música desde todos lados. Little Havana el mismo día — Calle Ocho con banderas de Argentina y Colombia.",
    zones:[
      { name:"Wynwood Arts District",    type:"Cultural",         desc:"Murales, música, bares al aire libre. El pre-partido más fotogénico del torneo." },
      { name:"Little Havana",            type:"Cultural",         desc:"Calle Ocho. Café cubano, música, afición argentina y colombiana mezclada." },
      { name:"Hard Rock Stadium Plaza",  type:"Fan fest oficial", desc:"Fan zone exterior con artistas en vivo. 4 horas antes del partido." },
    ],
    lagomNote:"Llegar a Little Havana en la mañana del partido de Argentina. El Domino Park tiene ambiente desde las 10am.",
  },
  neighborhoods:[
    { name:"Brickell",      vibe:"Moderno, hoteles, rooftops. El Manhattan de Miami.", best_for:"Pareja",           walk_to_stadium:"30 min (Uber)" },
    { name:"Wynwood",       vibe:"Arte, bares, restaurantes cool. El barrio más fotogénico.", best_for:"Pareja",   walk_to_stadium:"35 min (Uber)" },
    { name:"Coconut Grove", vibe:"Tranquilo, verde, ideal para familia.",                     best_for:"Familia",  walk_to_stadium:"35 min (Uber)" },
    { name:"Coral Gables",  vibe:"Elegante, histórico.",                                      best_for:"Pareja / Familia", walk_to_stadium:"30 min (Uber)" },
  ],
  hotels:[
    { name:"SLS Brickell",          price:"$$$",  area:"Brickell",     note:"Bazaar de José Andrés abajo, rooftop bar.", url:"" },
    { name:"The Elser Hotel",       price:"$$",   area:"Downtown",     note:"Nuevo, con cocina en el cuarto, acceso a Brickell.", url:"" },
    { name:"Hyatt Centric Brickell", price:"$$",  area:"Brickell",     note:"Confiable, rooftop, bien ubicado.", url:"" },
    { name:"Courtyard Coconut Grove", price:"$$", area:"Coconut Grove", note:"Familiar, alberca, zona tranquila.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–MIA: 3h15min directo. Reserva con 3 meses de anticipación.",
    airport_to_city:"Taxi/Uber al Brickell: $35, 20 min.",
    stadium_transport:"Uber desde Brickell al Hard Rock: $30-40. No hay metro directo.",
    visa:"Visa americana (B1/B2) o ESTA. Mismo trámite que cualquier ciudad de EE.UU.",
    lagomNote:"La Vizcaya Museum and Gardens — villa italiana del siglo XVIII sobre Biscayne Bay — es el secreto mejor guardado de Miami.",
  },
  meetingPoints:[
    { name:"Versailles Restaurant",  area:"Little Havana",  desc:"La institución cubana de Miami. El sándwich cubano es obligatorio." },
    { name:"Wynwood Walls",          area:"Wynwood",        desc:"Los murales más fotografiados de Miami." },
    { name:"Hard Rock Stadium North Lot", area:"Miami Gardens", desc:"Fan zone principal. El más activo 4 horas antes del partido." },
  ],
  food:[
    { dish:"Sándwich cubano",  where:"Versailles Restaurant, Little Havana",      price:"$",    type:"Imperdible" },
    { dish:"Ceviche peruano",  where:"La Mar, Mandarin Oriental — vista al mar",  price:"$$$",  type:"Pareja" },
    { dish:"Arepa venezolana", where:"Coyo Taco o cualquier ventanilla en Doral", price:"$",    type:"Local" },
    { dish:"Ropa vieja",       where:"Ball & Chain, Little Havana",               price:"$$",   type:"Cultural" },
  ],
  experiences:[
    { title:"Calle Ocho en día de partido", duration:"3 horas",  desc:"Little Havana con Argentina jugando es el fan zone no oficial más vivo del torneo.", type:"Imperdible" },
    { title:"La Vizcaya",                   duration:"3 horas",  desc:"Villa italiana de 1916 sobre Biscayne Bay. El lugar más inesperadamente bello de Miami.", type:"Pareja" },
    { title:"Wynwood a pie",                duration:"2 horas",  desc:"Los murales más densos de la ciudad. La galería más grande del mundo al aire libre.", type:"Cultural" },
    { title:"Zoo Miami",                    duration:"Medio día", desc:"El zoo más grande del sur de Florida. Gratis menores de 3 años.", type:"Familia" },
  ],
  closingNote:"Miami es la sede donde el torneo se convierte en festival. Ven por el fútbol, quédate por todo lo demás.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Miami",
}

const NYC: WorldcupGuide = {
  id:"nyc", city:"Nueva York", country:"EE.UU.", state:"New Jersey",
  short:"NYC", flag:"🇺🇸", accent:"#2D4F6C",
  stadium:{ name:"MetLife Stadium", capacity:"82,500" },
  matches:[
    { date:"12 Jun", day:"Jue", teams:["Argentina","vs","Marruecos"],  highlight:false },
    { date:"18 Jun", day:"Mié", teams:["Francia","vs","Argentina"],    highlight:false },
    { date:"24 Jun", day:"Mar", teams:["Argentina","vs","Marruecos"],  highlight:false },
  ],
  scores:{ ambiente:{value:5,label:"Ambiente"}, cultura:{value:5,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:5,label:"Transporte"}, seguridad:{value:4,label:"Seguridad"}, costo:{value:1,label:"Costo"} },
  manifesto:{
    headline:"La final del mundo se juega aquí. Todo lo demás es clasificación.",
    body:"MetLife Stadium en East Rutherford, New Jersey. La final del Mundial 2026. Si Argentina llega — y hay razones para creerlo — el partido más importante del siglo se jugará a 30 minutos de Manhattan. Jackson Heights en Queens es la comunidad latina más densa del planeta fuera de América Latina.",
    lagomNote:"Nueva York es cara. Hotel decente desde $150/noche, comida informal $25 por persona, transporte $2.90 el viaje. Presupuesta honestamente.",
  },
  vibe:{
    body:"Jackson Heights en Queens es el fan zone no oficial más extraordinario del torneo. 100 restaurantes latinoamericanos en 10 cuadras, comunidades colombiana, mexicana, ecuatoriana, argentina — todas juntas.",
    zones:[
      { name:"Jackson Heights, Queens",  type:"Fan zone cultural", desc:"El barrio más latinoamericano del mundo fuera de LATAM." },
      { name:"Midtown Manhattan",        type:"Fan zone oficial",  desc:"Times Square tiene pantallas exteriores." },
      { name:"MetLife Stadium Plaza",    type:"Fan fest oficial",  desc:"Fan zone exterior con escenarios. 4 horas antes del partido." },
    ],
    lagomNote:"NJ Transit desde Penn Station a MetLife: $15, 30 min. La única opción inteligente. Compra el ticket en la app antes de salir.",
  },
  neighborhoods:[
    { name:"Midtown Manhattan",     vibe:"Central, fácil para todo, muchas opciones de hotel.",   best_for:"Fan WC / Pareja", walk_to_stadium:"NJ Transit 30 min" },
    { name:"Queens (Astoria/LIC)",  vibe:"Más barato que Manhattan. Metro fácil.",                best_for:"Fan WC",          walk_to_stadium:"NJ Transit 40 min" },
    { name:"Brooklyn (Williamsburg)", vibe:"El barrio más interesante de NY para pareja.",        best_for:"Pareja",          walk_to_stadium:"NJ Transit 45 min" },
    { name:"Hoboken, NJ",           vibe:"Cerca del estadio, más barato, ferry a Manhattan.",     best_for:"Familia",         walk_to_stadium:"NJ Transit 15 min" },
  ],
  hotels:[
    { name:"The Hoxton Williamsburg", price:"$$$",  area:"Brooklyn",  note:"El hotel más interesante de NY. Restaurante hasta las 2am.", url:"" },
    { name:"Arlo Midtown",            price:"$$$",  area:"Midtown",   note:"Rooftop con vista a Midtown. Penn Station a 10 min caminando.", url:"" },
    { name:"Freehand New York",       price:"$$",   area:"Midtown",   note:"Social, bien ubicado, bar en el lobby.", url:"" },
    { name:"Paper Factory Hotel",     price:"$",    area:"Queens LIC", note:"Diseño industrial, acceso al metro.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–JFK o EWR: 5 horas directas. Reserva con 4 meses de anticipación.",
    airport_to_city:"JFK: AirTrain + Subway ($8.25, 60 min). EWR: NJ Transit + Penn Station ($16, 45 min).",
    stadium_transport:"NJ Transit desde Penn Station. $15 ida. 30 minutos. La opción más eficiente del torneo.",
    visa:"Visa americana (B1/B2) o ESTA si califican.",
    lagomNote:"Jackson Heights en Queens (Roosevelt Avenue entre 74th y 90th St) tiene la mejor comida latina del torneo.",
  },
  meetingPoints:[
    { name:"Jackson Heights, Queens", area:"Queens",  desc:"El fan zone no oficial más vivo del torneo. Roosevelt Avenue, 74th Street." },
    { name:"Penn Station",            area:"Midtown", desc:"El punto de partida para el estadio. NJ Transit desde aquí." },
    { name:"Times Square",            area:"Midtown", desc:"Pantallas exteriores en días de partido." },
    { name:"Domino Park",             area:"Brooklyn", desc:"Parque en el waterfront de Brooklyn con vista a Manhattan." },
  ],
  food:[
    { dish:"Cualquier cosa en Jackson Heights", where:"Roosevelt Ave entre 74th y 90th", price:"$",    type:"Imperdible" },
    { dish:"Pizza al horno",                    where:"Di Fara, Brooklyn o Lucali",      price:"$$",   type:"Ritual" },
    { dish:"Bagel con cream cheese",            where:"Absolute Bagels, Upper West Side", price:"$",   type:"Desayuno" },
    { dish:"Pasta fresca",                      where:"Via Carota, West Village",         price:"$$",  type:"Pareja" },
  ],
  experiences:[
    { title:"La final (si llegan)",   duration:"8 horas", desc:"MetLife Stadium el día de la final es el evento deportivo más grande del siglo.", type:"Imperdible" },
    { title:"High Line al atardecer", duration:"2 horas", desc:"Parque elevado sobre vías de tren en Chelsea. 3 km lineales.", type:"Pareja" },
    { title:"Brooklyn Bridge Park",   duration:"Tarde",   desc:"La mejor vista del skyline de Manhattan.", type:"Casual" },
    { title:"Jazz en Smalls",         duration:"Noche",   desc:"Greenwich Village. Entrada libre. Músicos en vivo desde las 10pm.", type:"Cultural" },
  ],
  closingNote:"Nueva York no te necesita, pero tú la necesitas a ella. Es la única ciudad del torneo que puede absorber cualquier afición, cualquier idioma, cualquier locura.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Nueva York",
}

const DAL: WorldcupGuide = {
  id:"dal", city:"Dallas", country:"EE.UU.", state:"Texas",
  short:"DAL", flag:"🇺🇸", accent:"#8B2635",
  stadium:{ name:"AT&T Stadium", capacity:"80,000" },
  matches:[
    { date:"11 Jun", day:"Mié", teams:["México","vs","Sudáfrica"], highlight:false },
    { date:"18 Jun", day:"Mié", teams:["España","vs","Brasil"],    highlight:false },
    { date:"26 Jun", day:"Jue", teams:["México","vs","Uruguay"],   highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:3,label:"Cultura"}, gastronomia:{value:4,label:"Gastronomía"}, transporte:{value:3,label:"Transporte"}, seguridad:{value:4,label:"Seguridad"}, costo:{value:3,label:"Costo"} },
  manifesto:{
    headline:"El estadio más grande del torneo. Y Texas encima.",
    body:"AT&T Stadium tiene algo que ningún otro estadio del torneo ofrece: escala absoluta. 80 mil personas, la pantalla HD más grande del mundo deportivo, y un nivel de producción que hace sentir cualquier partido como una final. México juega aquí.",
    lagomNote:"AT&T Stadium está en Arlington, entre Dallas y Fort Worth — no es Dallas ciudad. No hay metro directo. Planifica el transporte con anticipación.",
  },
  vibe:{
    body:"Deep Ellum es el barrio correcto para el pre-partido: galerías de arte urbano, bares independientes, música en vivo. El día que juegue México, los tejanos de camiseta del Tri que llevan 20 años en Dallas van a salir todos juntos.",
    zones:[
      { name:"Deep Ellum",         type:"Barrio",           desc:"Arte, música, bares independientes. El alma de Dallas." },
      { name:"Klyde Warren Park",  type:"Parque urbano",    desc:"Watch parties en pantalla exterior. Food trucks, espacio familiar." },
      { name:"AT&T Stadium Plaza", type:"Fan fest oficial", desc:"Fan zone exterior 4 horas antes." },
    ],
    lagomNote:"El AT&T Stadium tiene tours los días sin partido ($30, 90 min) que incluyen el campo y los $40M dlls en arte contemporáneo.",
  },
  neighborhoods:[
    { name:"Uptown Dallas", vibe:"El mejor barrio. Bares, restaurantes, hoteles de calidad.", best_for:"Pareja / Fan WC", walk_to_stadium:"30 min (Uber)" },
    { name:"Deep Ellum",    vibe:"Arte, música en vivo, bares independientes.",               best_for:"Fan WC",          walk_to_stadium:"35 min (Uber)" },
    { name:"Bishop Arts",   vibe:"Cafeterías, brunch, ambiente relajado.",                    best_for:"Pareja",          walk_to_stadium:"35 min (Uber)" },
    { name:"Frisco",        vibe:"Suburbio tranquilo, familiar, cerca del estadio.",          best_for:"Familia",         walk_to_stadium:"20 min (Uber)" },
  ],
  hotels:[
    { name:"The Joule Dallas",        price:"$$$", area:"Downtown",     note:"Edificio de 1927. Alberca en rooftop sobre Main Street.", url:"" },
    { name:"Omni Dallas Hotel",       price:"$$",  area:"Downtown",     note:"Confiable, bien ubicado, bar activo durante el torneo.", url:"" },
    { name:"Hotel Lumen",             price:"$$",  area:"Highland Park", note:"Boutique, bar con terraza, el favorito de los locales.", url:"" },
    { name:"Hyatt House Dallas Uptown", price:"$", area:"Uptown",       note:"Cocina en el cuarto, desayuno incluido.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–DFW: 2h30min directo. El aeropuerto DFW es enorme — 90 min de conexión mínimo.",
    airport_to_city:"DART Orange Line a Downtown Dallas ($2.50, 45 min) o Uber al hotel ($40).",
    stadium_transport:"Uber desde Uptown ($35-45). No hay metro directo a Arlington.",
    visa:"Visa americana (B1/B2) o ESTA.",
    lagomNote:"Dallas Museum of Art: entrada gratuita permanente. Nasher Sculpture Center: $10 dlls.",
  },
  meetingPoints:[
    { name:"Klyde Warren Park",     area:"Downtown",   desc:"Parque lineal sobre la autopista. Watch parties, food trucks." },
    { name:"The Rustic",            area:"Uptown",     desc:"Watch parties masivos al aire libre. 2,000+ personas." },
    { name:"Revelers Hall",         area:"Deep Ellum", desc:"Honky tonk texano con pantallas de fútbol." },
    { name:"AT&T Stadium North Gate", area:"Arlington", desc:"Fan zone principal. El punto de llegada 4 horas antes." },
  ],
  food:[
    { dish:"Brisket y burnt ends",  where:"Pecan Lodge, Deep Ellum — llega antes de las 11am", price:"$$",  type:"Imperdible" },
    { dish:"Cena de autor texana",  where:"Knife Dallas, Uptown",                              price:"$$$", type:"Pareja" },
    { dish:"Brunch pre-partido",    where:"Bisou, Bishop Arts — crêpes y terraza de 1920",    price:"$$",  type:"Desayuno" },
    { dish:"Tex-Mex",               where:"Mi Cocina, West Village",                          price:"$$",  type:"Local" },
  ],
  experiences:[
    { title:"Tour AT&T Stadium",    duration:"2 horas",  desc:"Campo, vestuario, colección de arte contemporáneo de $40M dlls.", type:"Imperdible" },
    { title:"Dallas Arts District", duration:"Mañana",   desc:"Museo de Arte (gratuito) + Nasher Sculpture Center ($10).", type:"Cultural" },
    { title:"Deep Ellum a pie",     duration:"3 horas",  desc:"Murales, galerías, bares, música en vivo.", type:"Casual" },
    { title:"Perot Museum",         duration:"Medio día", desc:"Dinosaurios, ciencias, pantallas táctiles.", type:"Familia" },
  ],
  closingNote:"Dallas es el coloso silencioso. El estadio va a dejar sin palabras a cualquier aficionado.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Dallas",
}

const SF: WorldcupGuide = {
  id:"sf", city:"San Francisco", country:"EE.UU.", state:"California",
  short:"SF", flag:"🇺🇸", accent:"#2D4F6C",
  stadium:{ name:"Levi's Stadium", capacity:"68,500" },
  matches:[
    { date:"15 Jun", day:"Dom", teams:["Brasil","vs","Suiza"],      highlight:false },
    { date:"20 Jun", day:"Vie", teams:["Alemania","vs","EUA"],      highlight:false },
    { date:"25 Jun", day:"Mié", teams:["Brasil","vs","Australia"],  highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:5,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:4,label:"Transporte"}, seguridad:{value:3,label:"Seguridad"}, costo:{value:1,label:"Costo"} },
  manifesto:{
    headline:"Brasil y Alemania juegan aquí. Y México podría avanzar a octavos en este mismo estadio.",
    body:"Mission District es el barrio latino más auténtico de EE.UU. en la costa oeste. Murales de Diego Rivera en las paredes, taquería El Farolito abierta hasta las 3am, y una comunidad que lleva décadas convirtiendo el fútbol en identidad.",
    lagomNote:"Levi's Stadium está en Santa Clara, 45 min al sur de SF. El Caltrain desde 4th & King Station hasta Santa Clara + shuttle al estadio: $15 total.",
  },
  vibe:{
    body:"Mission District el día del partido de Brasil o Alemania se convierte en algo que ningún fan zone oficial puede replicar: murales en cada pared, música en la calle, taquerías abiertas.",
    zones:[
      { name:"Mission District",     type:"Fan zone cultural", desc:"El barrio latino de SF. Pre-partido más auténtico de las sedes californianas." },
      { name:"Hayes Valley",         type:"Barrio",            desc:"Boutiques, cafés de especialidad, terrazas." },
      { name:"Levi's Stadium Plaza", type:"Fan fest oficial",  desc:"Santa Clara. Fan zone exterior masivo." },
    ],
    lagomNote:"El Caltrain tiene una app funcional — compra el ticket antes de salir de SF. En día de partido hay trenes adicionales hasta las 2am.",
  },
  neighborhoods:[
    { name:"Mission District", vibe:"Latino, auténtico, murales, taquerías.", best_for:"Fan WC", walk_to_stadium:"Caltrain 50 min" },
    { name:"Hayes Valley",     vibe:"Boutiques, cafés, restaurantes de autor.", best_for:"Pareja", walk_to_stadium:"Caltrain 50 min" },
    { name:"SOMA",             vibe:"Acceso al Caltrain, hoteles de precio medio.", best_for:"Fan WC", walk_to_stadium:"Caltrain 45 min" },
    { name:"Noe Valley",       vibe:"Tranquilo, familiar, verde.", best_for:"Familia", walk_to_stadium:"Caltrain 55 min" },
  ],
  hotels:[
    { name:"Proper Hotel SF",     price:"$$$",  area:"Civic Center", note:"Diseño de Kelly Wearstler en edificio de 1909.", url:"" },
    { name:"Hotel Zetta",         price:"$$",   area:"SOMA",         note:"Acceso al Caltrain, diseño jovial, bar decente.", url:"" },
    { name:"Inn at the Opera",    price:"$$",   area:"Civic Center", note:"Tranquilo, bien ubicado, desayuno incluido.", url:"" },
    { name:"Marriott Marquis SF", price:"$$$",  area:"Downtown",     note:"Familiar, alberca, habitaciones amplias.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–SFO: 4 horas directas.",
    airport_to_city:"BART desde SFO hasta el centro de SF ($10.25, 30 min).",
    stadium_transport:"Caltrain desde 4th & King Station hasta Santa Clara + shuttle. $15 total, 50 min.",
    visa:"Visa americana (B1/B2) o ESTA.",
    lagomNote:"El ferry a Sausalito ($13.25 ida y vuelta, 30 min) es la excursión más subestimada de la Bahía.",
  },
  meetingPoints:[
    { name:"La Taqueria, Mission",   area:"Mission District", desc:"Burritos legendarios. El punto de reunión de la comunidad latina de SF." },
    { name:"Dolores Park",           area:"Mission District", desc:"El parque de la ciudad. Vista al Downtown." },
    { name:"4th & King Caltrain",    area:"SOMA",             desc:"Punto de partida para el estadio." },
    { name:"Sightglass Coffee SOMA", area:"SOMA",             desc:"El café más fotogénico de la ciudad." },
  ],
  food:[
    { dish:"Burrito Mission-style",   where:"La Taqueria o El Farolito — debate eterno", price:"$",    type:"Imperdible" },
    { dish:"Sourdough y café",        where:"Tartine Bakery — llega antes de las 9am",   price:"$",    type:"Desayuno" },
    { dish:"Dim sum cantonés",        where:"Yank Sing o Ton Kiang en Richmond District", price:"$$",  type:"Ritual" },
    { dish:"Mariscos del Pacífico",   where:"Swan Oyster Depot — solo efectivo",          price:"$$",  type:"Local" },
  ],
  experiences:[
    { title:"Ferry a Sausalito",    duration:"Tarde",   desc:"30 min en ferry ($13.25). Pueblo costero, mariscos frescos, vista del Golden Gate.", type:"Imperdible" },
    { title:"Golden Gate a pie",    duration:"3 horas", desc:"Cruzar el puente a pie (2.7 km). La imagen icónica de SF.", type:"Casual" },
    { title:"Mission murals tour",  duration:"2 horas", desc:"Balmy Alley y Clarion Alley tienen los murales más densos de SF.", type:"Cultural" },
    { title:"Exploratorium",        duration:"Medio día", desc:"El mejor museo interactivo de ciencias del mundo.", type:"Familia" },
  ],
  closingNote:"SF es la ciudad que parece pequeña hasta que la vives. La densidad cultural por metro cuadrado no tiene rival en el torneo.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a San Francisco",
}

const HOU: WorldcupGuide = {
  id:"hou", city:"Houston", country:"EE.UU.", state:"Texas",
  short:"HOU", flag:"🇺🇸", accent:"#6B4226",
  stadium:{ name:"NRG Stadium", capacity:"72,220" },
  matches:[
    { date:"12 Jun", day:"Jue", teams:["Colombia","vs","Marruecos"], highlight:false },
    { date:"20 Jun", day:"Vie", teams:["Colombia","vs","Senegal"],   highlight:false },
    { date:"27 Jun", day:"Vie", teams:["Colombia","vs","Brasil"],    highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:4,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:3,label:"Transporte"}, seguridad:{value:3,label:"Seguridad"}, costo:{value:4,label:"Costo"} },
  manifesto:{
    headline:"Houston tiene la comunidad mexicana más grande de EE.UU. No es un dato — es el ambiente.",
    body:"Colombia juega los tres partidos de grupo aquí. Y Houston — con 1.6 millones de mexicanos, la comunidad vietnamita más grande de EE.UU. fuera de California, y una escena gastronómica que lleva 10 años siendo el secreto mejor guardado de la nación.",
    lagomNote:"El Menil Collection tiene entrada gratuita permanente y es uno de los museos de arte más importantes de EE.UU.",
  },
  vibe:{
    body:"East End (Second Ward) es el barrio mexicano histórico de Houston. Murales, cantinas, taquerías de 30 años. El día que juegue Colombia, la calle Navigation se convierte en algo único.",
    zones:[
      { name:"East End / Second Ward",  type:"Barrio latino",   desc:"El barrio mexicano histórico de Houston." },
      { name:"Montrose",                type:"Barrio cultural",  desc:"Bares, galerías, el Menil Collection." },
      { name:"NRG Stadium Fan Zone",    type:"Fan fest oficial", desc:"El más grande de las sedes de Texas." },
    ],
    lagomNote:"El Hugo's restaurante de chef Hugo Ortega en Montrose es el mejor restaurante mexicano de EE.UU. según múltiples rankings.",
  },
  neighborhoods:[
    { name:"Montrose",       vibe:"El barrio más interesante. Galerías, restaurantes, bares.", best_for:"Pareja",  walk_to_stadium:"20 min (Uber)" },
    { name:"Midtown",        vibe:"Central, hoteles de precio medio, acceso a todo.",          best_for:"Fan WC",  walk_to_stadium:"15 min (Uber)" },
    { name:"Museum District", vibe:"Tranquilo, verde, cerca del zoo y Hermann Park.",          best_for:"Familia", walk_to_stadium:"15 min (Uber)" },
  ],
  hotels:[
    { name:"Hotel Alessandra",    price:"$$$", area:"Downtown",       note:"El más bello de Houston ahora. Restaurante Lucienne de referencia.", url:"" },
    { name:"Hotel ZaZa Houston",  price:"$$$", area:"Museum District", note:"Habitaciones temáticas, junto al Hermann Park.", url:"" },
    { name:"The Lancaster",       price:"$$",  area:"Theater District", note:"Histórico 1926. Bar de jazz los viernes.", url:"" },
    { name:"Hyatt House Galleria", price:"$",  area:"Galleria",        note:"Cocina en el cuarto, desayuno incluido.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–IAH: 2 horas directas. Uno de los vuelos más accesibles del torneo.",
    airport_to_city:"Uber al Midtown o Montrose: $40-55. Houston no tiene metro útil para turistas.",
    stadium_transport:"Uber desde Midtown al NRG: $15-20. En día de partido, sal 2 horas antes.",
    visa:"Visa americana (B1/B2) o ESTA.",
    lagomNote:"Los Ubers en Houston son notablemente más baratos que en otras ciudades del torneo.",
  },
  meetingPoints:[
    { name:"Tacos Tierra Caliente", area:"East End",        desc:"Los mejores tacos de carne asada de Houston." },
    { name:"Hermann Park",          area:"Museum District", desc:"El parque más grande de Houston. Zona familiar." },
    { name:"Menil Collection",      area:"Montrose",        desc:"Museo de arte gratuito. El punto de encuentro cultural." },
    { name:"NRG North Gate",        area:"NRG Stadium",     desc:"Fan zone principal. El más activo de las sedes de Texas." },
  ],
  food:[
    { dish:"Tacos de carne asada",     where:"Tacos Tierra Caliente, Navigation Ave",    price:"$",   type:"Imperdible" },
    { dish:"Cocina mexicana regional", where:"Hugo's, Montrose — reserva anticipada",     price:"$$$", type:"Pareja" },
    { dish:"Pho vietnamita",           where:"Pho Saigon, Midtown",                       price:"$",   type:"Local" },
    { dish:"BBQ del puerto",           where:"Goode Company BBQ",                         price:"$$",  type:"Casual" },
  ],
  experiences:[
    { title:"Menil Collection + Rothko Chapel", duration:"3 horas",  desc:"El museo de arte gratuito más importante de EE.UU. más la capilla con 14 Rothkos originales.", type:"Imperdible" },
    { title:"Houston Zoo",              duration:"Medio día", desc:"El zoo más grande de Texas. Gratis menores de 2 años.", type:"Familia" },
    { title:"East End a pie",           duration:"2 horas",  desc:"El barrio mexicano histórico con murales y taquerías que no han cambiado en décadas.", type:"Cultural" },
    { title:"Kemah Boardwalk",          duration:"Día completo", desc:"40 min de Houston. Parque de atracciones sobre la bahía de Galveston.", type:"Familia" },
  ],
  closingNote:"Houston no pide permiso para ser extraordinaria. Lo es en silencio, desde hace años.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Houston",
}

const SEA: WorldcupGuide = {
  id:"sea", city:"Seattle", country:"EE.UU.", state:"Washington",
  short:"SEA", flag:"🇺🇸", accent:"#2D6E4E",
  stadium:{ name:"Lumen Field", capacity:"69,000" },
  matches:[
    { date:"13 Jun", day:"Vie", teams:["Alemania","vs","Japón"],    highlight:false },
    { date:"19 Jun", day:"Jue", teams:["Brasil","vs","Sudáfrica"],  highlight:false },
    { date:"24 Jun", day:"Mar", teams:["Alemania","vs","España"],   highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:5,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:5,label:"Transporte"}, seguridad:{value:4,label:"Seguridad"}, costo:{value:2,label:"Costo"} },
  manifesto:{
    headline:"Seattle es la sede que nadie tiene en el radar. Error.",
    body:"Lumen Field tiene el récord Guinness de estadio más ruidoso del mundo. Alemania y Brasil juegan aquí. Y Seattle — con su mercado de pescado, sus cafés de especialidad, el Pike Place a 5am antes de los turistas, y el ferry a Bainbridge con el Monte Rainier al fondo — es la ciudad del torneo que se queda más tiempo en la memoria.",
    lagomNote:"Lumen Field está a 5 minutos caminando de Pioneer Square. Es el estadio más accesible del torneo para alguien sin coche.",
  },
  vibe:{
    body:"Capitol Hill es el barrio correcto para el pre-partido: bares independientes, tiendas de discos, restaurantes de todos los niveles. La energía nocturna recuerda a Berlín más que a EE.UU.",
    zones:[
      { name:"Capitol Hill",       type:"Barrio",           desc:"Bares independientes, música, energía de ciudad europea." },
      { name:"Pike Place Market",  type:"Cultural",         desc:"Abre 9am. Pescado fresco, bakeries de décadas." },
      { name:"Lumen Field Plaza",  type:"Fan fest oficial", desc:"El más accesible del torneo — caminable desde Pioneer Square." },
    ],
    lagomNote:"El ferry a Bainbridge Island sale del Downtown Seattle ($9.10 ida y vuelta). 35 minutos. El domingo post-partido es la imagen del viaje.",
  },
  neighborhoods:[
    { name:"Capitol Hill",   vibe:"El barrio más animado. Bares, restaurantes, energía.",   best_for:"Pareja / Fan WC", walk_to_stadium:"20 min (caminando)" },
    { name:"Pioneer Square", vibe:"Histórico, adyacente al estadio.",                        best_for:"Fan WC",          walk_to_stadium:"5 min (caminando)" },
    { name:"South Lake Union", vibe:"Moderno, acceso al SkyTrain, tech-neighborhood.",      best_for:"Pareja",          walk_to_stadium:"25 min" },
    { name:"Fremont",        vibe:"Bohemio, tranquilo, cafés.",                              best_for:"Pareja",          walk_to_stadium:"30 min" },
  ],
  hotels:[
    { name:"Hotel Theodore",    price:"$$$", area:"Downtown",   note:"Boutique, art deco, a 10 min caminando del estadio.", url:"" },
    { name:"Fairmont Olympic",  price:"$$$", area:"Downtown",   note:"El clásico. Lobby de mármol, bar de whisky, historia.", url:"" },
    { name:"Inn at the Market", price:"$$$", area:"Pike Place", note:"Vista al Puget Sound desde las habitaciones.", url:"" },
    { name:"Hyatt at Olive 8",  price:"$$",  area:"Downtown",   note:"Familiar, alberca en el piso 8, cuna disponible.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–SEA: escala en LAX o SFO, 7-9 horas total.",
    airport_to_city:"Link Light Rail desde SEA-TAC al Downtown ($3.25, 38 min). Tiene elevadores.",
    stadium_transport:"Link Light Rail, estación Stadium. 2 min caminando al Lumen Field.",
    visa:"Visa americana (B1/B2) o ESTA.",
    lagomNote:"Seattle en junio: 20-23°C, días largos (sol hasta las 9pm), mínima lluvia. El mejor mes del año.",
  },
  meetingPoints:[
    { name:"Pike Place Market",  area:"Downtown",       desc:"Desde las 9am. Pescado, bakeries, café." },
    { name:"Zeitgeist Coffee",   area:"Pioneer Square", desc:"El café más cercano al estadio." },
    { name:"Lumen Field East Gate", area:"Estadio",     desc:"Fan zone exterior principal." },
  ],
  food:[
    { dish:"Ostras del Pacífico",  where:"Pike Place Market — puestos exteriores, $2-3 c/u", price:"$",    type:"Imperdible" },
    { dish:"Salmón ahumado",       where:"Pike Place Fish Company",                          price:"$$",   type:"Local" },
    { dish:"Cocina seasonal",      where:"Canlis — el restaurante histórico sobre Lake Union", price:"$$$$", type:"Pareja" },
    { dish:"Smash burger",         where:"Dick's Drive-In — institución desde 1954",          price:"$",    type:"Post-partido" },
  ],
  experiences:[
    { title:"Ferry a Bainbridge Island", duration:"Día completo", desc:"$9.10 ida y vuelta. 35 min. Pueblo costero, vistas del Howe Sound.", type:"Imperdible" },
    { title:"Lumen Field tour",          duration:"2 horas",      desc:"El estadio más ruidoso del mundo. Tour incluye vestuario y campo.", type:"Fan WC" },
    { title:"Capitol Hill de noche",     duration:"Noche",        desc:"Los bares más honestos de Seattle. La noche antes del partido.", type:"Pareja" },
    { title:"Woodland Park Zoo",         duration:"Medio día",    desc:"Aves tropicales. Gratis menores de 2 años.", type:"Familia" },
  ],
  closingNote:"Seattle es la ciudad del torneo que más se queda. Llegas por Alemania o Brasil. Vuelves por el ferry del domingo.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Seattle",
}

const KC: WorldcupGuide = {
  id:"kc", city:"Kansas City", country:"EE.UU.", state:"Missouri",
  short:"KC", flag:"🇺🇸", accent:"#7B3F8C",
  stadium:{ name:"Arrowhead Stadium", capacity:"76,416" },
  matches:[
    { date:"16 Jun", day:"Lun", teams:["España","vs","Marruecos"],  highlight:false },
    { date:"21 Jun", day:"Sáb", teams:["Francia","vs","Argentina"], highlight:false },
    { date:"26 Jun", day:"Jue", teams:["España","vs","Brasil"],     highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:4,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:3,label:"Transporte"}, seguridad:{value:4,label:"Seguridad"}, costo:{value:4,label:"Costo"} },
  manifesto:{
    headline:"Kansas City es la sede más subestimada del torneo. Y la más sorprendente.",
    body:"Arrowhead Stadium tiene el récord Guinness de estadio de fútbol americano más ruidoso del mundo. España y Francia juegan aquí. El BBQ de Kansas City es la conversación que los texanos no quieren tener.",
    lagomNote:"Kansas City es un 30-40% más barato que cualquier otra sede de EE.UU. del torneo. Es el secreto logístico del torneo.",
  },
  vibe:{
    body:"Power & Light District es el barrio de bares del centro — docenas de locales, pantallas en la calle. El 18th & Vine — el barrio histórico del jazz, donde Charlie Parker tocó hace 80 años.",
    zones:[
      { name:"Power & Light District", type:"Barrio de bares",  desc:"Pantallas en la calle, afición mixta, el punto de reunión del torneo en KC." },
      { name:"18th & Vine",           type:"Jazz histórico",    desc:"Charlie Parker nació aquí. El Green Lady Lounge lleva décadas activo." },
      { name:"Arrowhead Stadium East", type:"Fan fest oficial", desc:"El más activo de las sedes del Medio Oeste." },
    ],
    lagomNote:"El Nelson-Atkins Museum of Art tiene entrada gratuita permanente y la mejor colección de arte chino fuera de Asia en el hemisferio occidental.",
  },
  neighborhoods:[
    { name:"Country Club Plaza",       vibe:"El barrio más bonito. Estilo español, boutiques, restaurantes.", best_for:"Pareja",          walk_to_stadium:"20 min (Uber)" },
    { name:"Crossroads Arts District", vibe:"Galerías, cafés creativos, restaurantes.",                       best_for:"Pareja / Fan WC", walk_to_stadium:"15 min (Uber)" },
    { name:"Power & Light",            vibe:"Central, animado, bares y restaurantes.",                        best_for:"Fan WC",          walk_to_stadium:"10 min (Uber)" },
  ],
  hotels:[
    { name:"21c Museum Hotel",    price:"$$$", area:"Crossroads", note:"Galería de arte contemporáneo + hotel. El concepto más original del torneo.", url:"" },
    { name:"The Raphael Hotel",   price:"$$",  area:"Plaza",      note:"Boutique europeo desde 1927.", url:"" },
    { name:"Loews Kansas City",   price:"$$",  area:"Downtown",   note:"Familiar, alberca cubierta grande.", url:"" },
    { name:"Hyatt Place KC Downtown", price:"$", area:"Downtown", note:"Funcional, desayuno incluido.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–MCI: escala en DAL o HOU, 5-6 horas total.",
    airport_to_city:"Uber al hotel: $30-40. El aeropuerto de KC es pequeño y sin caos.",
    stadium_transport:"Uber desde el centro (~$20) + shuttle gratuito del estadio.",
    visa:"Visa americana (B1/B2) o ESTA.",
    lagomNote:"Joe's Kansas City Bar-B-Que tiene el Z-Man sandwich en todas las listas de mejor comida de EE.UU. desde hace 20 años.",
  },
  meetingPoints:[
    { name:"Joe's Kansas City",     area:"Westport",   desc:"BBQ de referencia nacional. El punto gastronómico del torneo en KC." },
    { name:"Crown Center",          area:"Midtown",    desc:"Zona familiar al aire libre." },
    { name:"Arrowhead North Plaza", area:"Estadio",    desc:"Fan zone principal." },
  ],
  food:[
    { dish:"Z-Man sandwich (brisket)", where:"Joe's Kansas City Bar-B-Que",  price:"$",  type:"Imperdible" },
    { dish:"Burnt ends",               where:"Arthur Bryant's — el original desde 1908", price:"$",  type:"Ritual" },
    { dish:"Cena de pareja",           where:"Tannin Wine Bar & Kitchen, Crossroads",   price:"$$", type:"Pareja" },
    { dish:"Jazz y bebida",            where:"Green Lady Lounge, 18th & Vine",          price:"$",  type:"Cultural" },
  ],
  experiences:[
    { title:"Arrowhead tour",        duration:"2 horas",  desc:"El estadio más ruidoso del mundo de fútbol americano. Tour del campo.", type:"Fan WC" },
    { title:"Nelson-Atkins Museum",  duration:"Mañana",   desc:"Entrada gratuita. Mejor colección de arte chino del hemisferio occidental.", type:"Cultural" },
    { title:"18th & Vine jazz tour", duration:"Noche",    desc:"El barrio donde nació el jazz de Kansas City.", type:"Pareja" },
    { title:"Kansas City Zoo",       duration:"Medio día", desc:"Una de las mejores exhibiciones de gorilas de Norteamérica.", type:"Familia" },
  ],
  closingNote:"Kansas City no pide que la elijas. Solo espera que llegues — y después no entiendes cómo no estaba en tu lista.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Kansas City",
}

const ATL: WorldcupGuide = {
  id:"atl", city:"Atlanta", country:"EE.UU.", state:"Georgia",
  short:"ATL", flag:"🇺🇸", accent:"#B5451B",
  stadium:{ name:"Mercedes-Benz Stadium", capacity:"71,000" },
  matches:[
    { date:"13 Jun", day:"Vie", teams:["Argentina","vs","Japón"],    highlight:false },
    { date:"18 Jun", day:"Mié", teams:["Brasil","vs","EUA"],         highlight:false },
    { date:"24 Jun", day:"Mar", teams:["Argentina","vs","Alemania"], highlight:false },
  ],
  scores:{ ambiente:{value:5,label:"Ambiente"}, cultura:{value:4,label:"Cultura"}, gastronomia:{value:4,label:"Gastronomía"}, transporte:{value:4,label:"Transporte"}, seguridad:{value:3,label:"Seguridad"}, costo:{value:3,label:"Costo"} },
  manifesto:{
    headline:"El estadio más moderno del torneo y una ciudad que no para.",
    body:"Mercedes-Benz Stadium fue inaugurado en 2017 con un techo retráctil en forma de ojo de pájaro y una pantalla de 360 grados. Es el recinto más espectacular construido en este siglo. Atlanta tiene la comunidad latinoamericana de crecimiento más rápido de EE.UU.",
    lagomNote:"MARTA — el metro de Atlanta — llega directo al Mercedes-Benz Stadium (State Farm Arena Station). $2.50. Del aeropuerto al centro: MARTA Red/Gold Line, $2.50, 20 min.",
  },
  vibe:{
    body:"Buford Highway, el corredor de 15 km al noreste de Atlanta, tiene más de 700 restaurantes de más de 50 naciones. El día del partido de Argentina la calle tiene más banderas latinoamericanas que ningún otro lugar del torneo.",
    zones:[
      { name:"Buford Highway",              type:"Corredor cultural", desc:"700+ restaurantes, 50+ naciones. El fan zone no oficial más diverso del torneo." },
      { name:"Ponce City Market",           type:"Gourmet",           desc:"Mercado gourmet en fábrica de 1926. Rooftop con vista a Midtown." },
      { name:"Mercedes-Benz Stadium Plaza", type:"Fan fest oficial",  desc:"El más espectacular visualmente del torneo." },
    ],
    lagomNote:"El National Center for Civil and Human Rights tiene una instalación interactiva que simula una manifestación de los años 60. No es opcional si estás en Atlanta.",
  },
  neighborhoods:[
    { name:"Inman Park",      vibe:"El más bonito de Atlanta. Victoriano, restaurantes, tranquilo.", best_for:"Pareja",           walk_to_stadium:"MARTA 15 min" },
    { name:"Midtown",         vibe:"Central, acceso al MARTA, museos, hoteles.",                    best_for:"Fan WC / Familia", walk_to_stadium:"MARTA 10 min" },
    { name:"Old Fourth Ward", vibe:"Histórico, Ponce City Market, BeltLine.",                       best_for:"Pareja",           walk_to_stadium:"MARTA 15 min" },
  ],
  hotels:[
    { name:"The Whitley",        price:"$$$", area:"Buckhead",   note:"Mejor hotel de Buckhead. Spa, rooftop bar.", url:"" },
    { name:"Hotel Clermont",     price:"$$",  area:"Ponce City", note:"Edificio de 1924. Historia de cabaret en las paredes.", url:"" },
    { name:"Hotel Artmore",      price:"$$",  area:"Midtown",    note:"Boutique, piscina al aire libre, a 10 min del estadio en MARTA.", url:"" },
    { name:"Loews Atlanta Hotel", price:"$$", area:"Midtown",    note:"Familiar, alberca grande, cuna disponible.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–ATL: escala en HOU o DAL, 5-6 horas. El aeropuerto Hartsfield-Jackson es el más transitado del mundo.",
    airport_to_city:"MARTA Red/Gold Line al centro: $2.50, 20 min.",
    stadium_transport:"MARTA State Farm Arena/GWCC Station. 5 min caminando al Mercedes-Benz Stadium.",
    visa:"Visa americana (B1/B2) o ESTA.",
    lagomNote:"El Oakland Cemetery — fundado en 1850 — tiene jardines victorianos y esculturas. Abierto todos los días, entrada gratuita.",
  },
  meetingPoints:[
    { name:"Ponce City Market",       area:"Old Fourth Ward", desc:"El mercado más completo de Atlanta. Rooftop con vistas a Midtown." },
    { name:"Centennial Olympic Park", area:"Downtown",        desc:"El parque de los JJ.OO. del 96. Pantallas exteriores." },
    { name:"Mercedes-Benz West Gate", area:"Stadium",         desc:"Fan zone principal. La fachada del estadio iluminada es la foto del partido." },
  ],
  food:[
    { dish:"Tacos estilo Jalisco",  where:"Taqueria El Rey, Buford Highway",          price:"$",    type:"Imperdible" },
    { dish:"Tlayudas oaxaqueñas",   where:"La Oaxaqueña, Buford Highway",             price:"$",    type:"Local" },
    { dish:"Menú degustación",      where:"Staplehouse, Inman Park — reserva con meses", price:"$$$$", type:"Pareja" },
    { dish:"Hot dog de The Varsity", where:"The Varsity, Downtown — desde 1928",      price:"$",    type:"Post-partido" },
  ],
  experiences:[
    { title:"Mercedes-Benz Stadium",        duration:"Partido completo", desc:"Pantalla 360°, techo retráctil, 71 mil personas. El recinto más espectacular del torneo.", type:"Imperdible" },
    { title:"Buford Highway gastro-tour",   duration:"Medio día",        desc:"50 naciones en 15 km. El tour gastronómico más diverso de todas las sedes.", type:"Cultural" },
    { title:"Georgia Aquarium",             duration:"3 horas",          desc:"El más grande del hemisferio occidental. Belugas, ballenas jorobadas.", type:"Familia" },
    { title:"National Center for Civil Rights", duration:"3 horas",      desc:"Uno de los museos más poderosos de EE.UU.", type:"Cultural" },
  ],
  closingNote:"Atlanta no necesita el Mundial para ser grande. Pero el Mundial necesita a Atlanta para ser completo.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Atlanta",
}

const PHI: WorldcupGuide = {
  id:"phi", city:"Filadelfia", country:"EE.UU.", state:"Pennsylvania",
  short:"PHI", flag:"🇺🇸", accent:"#2A5F8F",
  stadium:{ name:"Lincoln Financial Field", capacity:"69,796" },
  matches:[
    { date:"14 Jun", day:"Sáb", teams:["Colombia","vs","Marruecos"], highlight:false },
    { date:"19 Jun", day:"Jue", teams:["Francia","vs","Japón"],      highlight:false },
    { date:"25 Jun", day:"Mié", teams:["Colombia","vs","Brasil"],    highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:5,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:4,label:"Transporte"}, seguridad:{value:3,label:"Seguridad"}, costo:{value:3,label:"Costo"} },
  manifesto:{
    headline:"La ciudad de Rocky, el cheesesteak, y una comunidad latina que lleva décadas haciendo el barrio.",
    body:"La escena gastronómica de Filadelfia es el secreto mejor guardado de la costa este. Fishtown y Northern Liberties tienen restaurantes que compiten con Brooklyn o Chicago sin el precio. El Italian Market en South 9th — abierto desde 1900, ahora dominado por la comunidad mexicana y latinoamericana.",
    lagomNote:"SEPTA — el metro de Filadelfia — tiene la línea Broad Street que llega directo al Lincoln Financial Field. $2.50, 20 minutos desde Center City.",
  },
  vibe:{
    body:"South 9th Street Italian Market el día del partido de Colombia: taquerías, fruterías, música en la calle, afición colombiana mezclada con los mexicanos del barrio.",
    zones:[
      { name:"Italian Market (9th St)",  type:"Fan zone cultural", desc:"El mercado latino más antiguo de EE.UU." },
      { name:"Passyunk Avenue",          type:"Gastronómico",      desc:"La calle de restaurantes más activa de Filadelfia." },
      { name:"Lincoln Financial Plaza",  type:"Fan fest oficial",  desc:"3 horas antes del partido." },
    ],
    lagomNote:"Eastern State Penitentiary tiene tours diurnos que son una de las experiencias arquitectónicas más impresionantes de la costa este.",
  },
  neighborhoods:[
    { name:"Rittenhouse Square", vibe:"El parque más bonito, rodeado de restaurantes y boutiques.", best_for:"Pareja",          walk_to_stadium:"SEPTA 20 min" },
    { name:"Fishtown",           vibe:"El barrio más joven. Restaurantes de autor, bares creativos.", best_for:"Pareja / Fan WC", walk_to_stadium:"SEPTA 25 min" },
    { name:"Old City",           vibe:"Histórico, cerca de la Campana de la Libertad.",             best_for:"Fan WC",          walk_to_stadium:"SEPTA 20 min" },
    { name:"South Philadelphia", vibe:"El barrio más auténtico. Italian Market, comunidad latina.",  best_for:"Fan WC",          walk_to_stadium:"SEPTA 15 min" },
  ],
  hotels:[
    { name:"The Rittenhouse Hotel",    price:"$$$$", area:"Rittenhouse", note:"El más elegante de la ciudad. Spa.", url:"" },
    { name:"Hotel Monaco Philadelphia", price:"$$$", area:"Old City",    note:"Kimpton en edificio histórico de 1907.", url:"" },
    { name:"Loews Philadelphia Hotel", price:"$$",   area:"Downtown",    note:"En rascacielos de 1929. Bien ubicado para SEPTA.", url:"" },
    { name:"Homewood Suites Rittenhouse", price:"$$", area:"Rittenhouse", note:"Suites con cocina, desayuno incluido.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–PHL: escala en MIA o HOU, 6-7 horas. Filadelfia está a 1.5 horas en tren de Nueva York.",
    airport_to_city:"SEPTA Airport Line al centro: $8, 25 min.",
    stadium_transport:"SEPTA Broad Street Line desde Center City. $2.50, 20 min. Al final de la línea.",
    visa:"Visa americana (B1/B2) o ESTA.",
    lagomNote:"Filadelfia está a 1.5 horas de Nueva York en Amtrak ($30-60). Combina ambas ciudades si tienes tiempo.",
  },
  meetingPoints:[
    { name:"Reading Terminal Market",     area:"Center City",  desc:"Mercado cubierto desde 1893. DiNic's Roast Pork: nominado mejor sándwich de EE.UU." },
    { name:"Italian Market, 9th St",      area:"South Philly", desc:"El mercado más antiguo de EE.UU. El fan zone latino del torneo." },
    { name:"Rittenhouse Square",          area:"Rittenhouse",  desc:"El parque central. Bares en los cuatro lados." },
    { name:"Lincoln Financial South Gate", area:"Stadium",     desc:"Fan zone principal. SEPTA deja a 5 min caminando." },
  ],
  food:[
    { dish:"Cheesesteak",           where:"Pat's King of Steaks vs Geno's — misma esquina, 24h",   price:"$",    type:"Imperdible" },
    { dish:"Roast pork sandwich",   where:"DiNic's, Reading Terminal Market",                      price:"$",    type:"Local" },
    { dish:"Cocina israelí",        where:"Zahav, Old City — reserva con meses",                   price:"$$$$", type:"Pareja" },
    { dish:"Mariscos del Atlántico", where:"Oyster House, Rittenhouse",                            price:"$$",   type:"Cultural" },
  ],
  experiences:[
    { title:"Italian Market a pie",       duration:"2 horas",  desc:"El mercado más antiguo de EE.UU. dominado hoy por la comunidad latina.", type:"Cultural" },
    { title:"Eastern State Penitentiary", duration:"2 horas",  desc:"Prisión gótica de 1829. Tours diurnos con acceso al campo.", type:"Imperdible" },
    { title:"Murales de Filadelfia",      duration:"Mañana",   desc:"4,000+ murales en toda la ciudad. El programa de arte público más grande del mundo.", type:"Cultural" },
    { title:"Please Touch Museum",        duration:"Medio día", desc:"Diseñado para niños 0-7 años. Gratis menores de 1 año.", type:"Familia" },
  ],
  closingNote:"Filadelfia no grita — pero cuando habla, tiene razón.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Filadelfia",
}

const BOS: WorldcupGuide = {
  id:"bos", city:"Boston", country:"EE.UU.", state:"Massachusetts",
  short:"BOS", flag:"🇺🇸", accent:"#8B1A1A",
  stadium:{ name:"Gillette Stadium", capacity:"65,878" },
  matches:[
    { date:"15 Jun", day:"Dom", teams:["Argentina","vs","Suiza"],    highlight:false },
    { date:"21 Jun", day:"Sáb", teams:["Francia","vs","Colombia"],   highlight:false },
    { date:"27 Jun", day:"Vie", teams:["Argentina","vs","Brasil"],   highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:5,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:4,label:"Transporte"}, seguridad:{value:4,label:"Seguridad"}, costo:{value:2,label:"Costo"} },
  manifesto:{
    headline:"La ciudad más europea de EE.UU. recibe el partido de Argentina vs Brasil.",
    body:"Gillette Stadium, 27 de junio. Argentina vs Brasil. Si eso no es razón suficiente, Beacon Hill tiene faroles de gas y escaleras de ladrillo rojo que parecen París del siglo XIX. La clam chowder de Legal Sea Foods fue a la inauguración de JFK.",
    lagomNote:"Gillette Stadium está en Foxborough, 45 min al sur de Boston. Commuter Rail desde South Station: $15, 45 min. No uses Uber al estadio — el tráfico post-partido es de 60+ minutos.",
  },
  vibe:{
    body:"El North End el día del partido de Argentina: pubs de los 1700s, restaurantes con lista de espera, música en las calles. Los bares de Harvard Square en Cambridge van a tener afición porteña cantando desde el mediodía.",
    zones:[
      { name:"North End",             type:"Barrio histórico", desc:"El barrio italiano más antiguo de EE.UU. Pubs, restaurantes, música." },
      { name:"Harvard Square",        type:"Universitario",    desc:"Afición argentina mezclada con estudiantes de Harvard." },
      { name:"Gillette Stadium Plaza", type:"Fan fest oficial", desc:"Patriot Place exterior. 3 horas antes del partido." },
    ],
    lagomNote:"El Isabella Stewart Gardner Museum — villa veneciana de 1903 con el robo de arte más famoso de EE.UU. aún sin resolver — tiene una sala de mariposas de vidrio única en el mundo.",
  },
  neighborhoods:[
    { name:"Back Bay",    vibe:"Brownstones victorianas, Newbury Street, el más elegante.",    best_for:"Pareja",  walk_to_stadium:"South Station 45 min" },
    { name:"Beacon Hill", vibe:"El más bonito de Boston. Faroles de gas, adoquines.",          best_for:"Pareja",  walk_to_stadium:"South Station 45 min" },
    { name:"Cambridge",   vibe:"Harvard, MIT, bares universitarios, más económico.",           best_for:"Fan WC",  walk_to_stadium:"South Station 50 min" },
    { name:"South End",   vibe:"Restaurantes de autor, galería de arte, vida de barrio.",      best_for:"Pareja",  walk_to_stadium:"South Station 40 min" },
  ],
  hotels:[
    { name:"The Liberty Hotel",  price:"$$$",  area:"Beacon Hill", note:"Prisión del condado de 1851 convertida en hotel.", url:"" },
    { name:"The Newbury",        price:"$$$$", area:"Back Bay",     note:"En mansión de 1927. El más elegante de la ciudad.", url:"" },
    { name:"The Boxer Boston",   price:"$$",   area:"North Station", note:"Acceso directo al commuter rail para Gillette.", url:"" },
    { name:"Westin Copley Place", price:"$$$", area:"Back Bay",     note:"Familiar, alberca grande, cuna disponible.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–BOS: escala en HOU, MIA o NYC, 6-8 horas. Boston está a 1h en Amtrak de Nueva York.",
    airport_to_city:"Silver Line Bus directo a South Station ($1.70, 30 min) + MBTA a cualquier barrio.",
    stadium_transport:"Commuter Rail desde South Station a Foxborough. $15, 45 min. Compra en app antes de salir.",
    visa:"Visa americana (B1/B2) o ESTA.",
    lagomNote:"Combina Boston con Nueva York: Amtrak Acela hace el trayecto en 3h30 ($60-100). Argentina juega en ambas ciudades.",
  },
  meetingPoints:[
    { name:"Faneuil Hall / Quincy Market", area:"Downtown",    desc:"El mercado histórico más turístico de Boston." },
    { name:"The Bleacher Bar",             area:"Fenway",      desc:"Bar debajo de las gradas del Fenway Park." },
    { name:"South Station",               area:"Downtown",    desc:"Punto de partida para el commuter rail a Gillette." },
    { name:"Gillette North Gate",         area:"Foxborough",  desc:"Fan zone principal. Patriot Place exterior." },
  ],
  food:[
    { dish:"Clam chowder",     where:"Legal Sea Foods — la que fue a la inauguración de JFK", price:"$$",   type:"Imperdible" },
    { dish:"Langosta de Maine", where:"Island Creek Oyster Bar, Kenmore Square",              price:"$$$",  type:"Local" },
    { dish:"Cocina de temporada", where:"No. 9 Park, Beacon Hill",                            price:"$$$$", type:"Pareja" },
    { dish:"Fish & chips",     where:"Cualquier pub del North End — abiertos hasta las 2am",  price:"$",    type:"Post-partido" },
  ],
  experiences:[
    { title:"Argentina vs Brasil (27 Jun)", duration:"8 horas",  desc:"El partido del torneo. Los dos países más apasionados del fútbol mundial.", type:"Imperdible" },
    { title:"Freedom Trail a pie",          duration:"3 horas",  desc:"16 puntos históricos, 4 km, adoquines rojos en el suelo.", type:"Cultural" },
    { title:"Isabella Stewart Gardner Museum", duration:"2 horas", desc:"Villa veneciana de 1903. El robo de arte más famoso sin resolver.", type:"Pareja" },
    { title:"Fenway Park tour",             duration:"2 horas",  desc:"El estadio de béisbol más antiguo de EE.UU. (1912).", type:"Fan WC" },
  ],
  closingNote:"Boston sabe que tiene historia. Lo que no se esperaba es que también supiera tener fútbol — y resultara que es lo mismo.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Boston",
}

const TOR: WorldcupGuide = {
  id:"tor", city:"Toronto", country:"Canadá", state:"Ontario",
  short:"TOR", flag:"🇨🇦", accent:"#C41E3A",
  stadium:{ name:"BMO Field", capacity:"45,736" },
  matches:[
    { date:"13 Jun", day:"Vie", teams:["Portugal","vs","Polonia"],   highlight:false },
    { date:"19 Jun", day:"Jue", teams:["Canadá","vs","Serbia"],      highlight:true  },
    { date:"25 Jun", day:"Mié", teams:["Portugal","vs","Marruecos"], highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:5,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:5,label:"Transporte"}, seguridad:{value:5,label:"Seguridad"}, costo:{value:2,label:"Costo"} },
  manifesto:{
    headline:"La única sede canadiense en Ontario. Y la ciudad con más lenguas del planeta.",
    body:"Toronto tiene más de 200 lenguas habladas. Kensington Market, Distillery District, Little Italy en College Street — cada barrio tiene su propia identidad. Y tiene restaurantes que aparecen en rankings internacionales sin que nadie fuera de Canadá los conozca.",
    lagomNote:"Visado obligatorio para pasaporte mexicano: eTA ($7 CAD, tramitar en línea) o visa de turista canadiense. Tramitar con 6 semanas de anticipación mínimo.",
  },
  vibe:{
    body:"Kensington Market el día del partido de Portugal — con Little Portugal en Dundas West a pasos — tiene banderas portuguesas en cada balcón. El Distillery District tiene el mejor ambiente nocturno en un escenario arquitectónico único.",
    zones:[
      { name:"Little Portugal (Dundas West)", type:"Cultural",        desc:"Banderas en los balcones, café de tueste oscuro, afición portuguesa antes del partido." },
      { name:"Kensington Market",             type:"Barrio bohemio",  desc:"El más libre de Toronto. Comida de 50 países en 5 cuadras." },
      { name:"BMO Field, Exhibition Place",   type:"Fan fest oficial", desc:"El más grande de las sedes canadienses." },
    ],
    lagomNote:"El Toronto Islands ferry ($8.90 CAD ida y vuelta) sale cada 30 min. 10 minutos. Las mejores vistas del skyline son desde la isla al atardecer.",
  },
  neighborhoods:[
    { name:"Distillery District", vibe:"Victoriano-industrial, galerías, bares de craft. El más fotogénico.", best_for:"Pareja",          walk_to_stadium:"20 min" },
    { name:"Kensington Market",   vibe:"Bohemio, multicultural, cafés independientes.",                       best_for:"Fan WC / Pareja", walk_to_stadium:"30 min (TTC)" },
    { name:"Yorkville",           vibe:"Lujo, boutiques, los mejores hoteles.",                               best_for:"Pareja",          walk_to_stadium:"30 min (TTC)" },
    { name:"Harbourfront",        vibe:"Junto al lago Ontario, parques, accesible.",                          best_for:"Familia",         walk_to_stadium:"20 min" },
  ],
  hotels:[
    { name:"The Hazelton Hotel",         price:"$$$$", area:"Yorkville",    note:"El hotel del TIFF. El más fotografiado de la ciudad.", url:"" },
    { name:"Hotel Le Germain Maple Leaf", price:"$$$", area:"Downtown",     note:"Boutique canadiense con criterio europeo.", url:"" },
    { name:"Fairmont Royal York",        price:"$$$",  area:"Union Station", note:"El histórico. Alberca en el sótano. Frente a Union Station.", url:"" },
    { name:"Anndore House",              price:"$$",   area:"Church Street", note:"Boutique, bar activo, a pasos del subway.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–YYZ: directo con Air Canada o Aeroméxico, 4.5 horas.",
    airport_to_city:"UP Express tren directo a Union Station ($12.35 CAD, 25 min). El mejor tren aeroportuario del torneo.",
    stadium_transport:"TTC Subway a Bathurst + caminata 15 min, o Uber ($15 CAD).",
    visa:"eTA obligatoria para mexicanos ($7 CAD, tramitar en línea 6 semanas antes).",
    lagomNote:"El TTC (subway de Toronto) funciona excelente para turistas. Tarjeta PRESTO disponible en el aeropuerto — $3.30 CAD por viaje.",
  },
  meetingPoints:[
    { name:"St. Lawrence Market",        area:"Old Town",      desc:"El mercado más antiguo de Canadá. Sábados: peameal bacon sandwich." },
    { name:"Distillery District",        area:"East Downtown", desc:"Bares en una destilería victoriana de 1832." },
    { name:"Harbourfront",               area:"Waterfront",    desc:"Pantallas exteriores en días de partido." },
    { name:"BMO Field North Gate",       area:"Exhibition Place", desc:"Fan zone principal." },
  ],
  food:[
    { dish:"Dim sum cantonés",              where:"Sun Sui Wah, Main Street",                   price:"$$",   type:"Imperdible" },
    { dish:"Cocina indígena canadiense",    where:"Canoe, piso 54 del TD Tower",                price:"$$$$", type:"Pareja" },
    { dish:"Peameal bacon sandwich",        where:"St. Lawrence Market los sábados",             price:"$",    type:"Desayuno" },
    { dish:"Cualquier cosa en Kensington",  where:"Caminando — 50 naciones en 5 cuadras",       price:"$",    type:"Local" },
  ],
  experiences:[
    { title:"Ferry a Toronto Islands",   duration:"Tarde",    desc:"$8.90 CAD ida y vuelta. 10 minutos. Playas de agua dulce, vista del skyline.", type:"Imperdible" },
    { title:"Distillery District a pie", duration:"3 horas", desc:"Destilería victoriana de 1832 reconvertida. Galerías, restaurantes, bares.", type:"Pareja" },
    { title:"Kensington Market",         duration:"Mañana",  desc:"El mercado más libre de Canadá. Vintage, cafés, comida de 50 países.", type:"Cultural" },
    { title:"Ontario Science Centre",    duration:"Medio día", desc:"El mejor museo interactivo de ciencias de Canadá. Gratis menores de 3 años.", type:"Familia" },
  ],
  closingNote:"Toronto no te pide que la ames. Solo te da 200 idiomas, 50 cocinas, y un ferry al atardecer — y espera a ver qué haces con eso.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Toronto",
}

const VAN: WorldcupGuide = {
  id:"van", city:"Vancouver", country:"Canadá", state:"British Columbia",
  short:"VAN", flag:"🇨🇦", accent:"#2D4F6C",
  stadium:{ name:"BC Place", capacity:"54,500" },
  matches:[
    { date:"12 Jun", day:"Jue", teams:["Alemania","vs","Arabia Saudita"], highlight:false },
    { date:"17 Jun", day:"Mar", teams:["Canadá","vs","Uruguay"],          highlight:true  },
    { date:"22 Jun", day:"Dom", teams:["España","vs","Alemania"],         highlight:false },
  ],
  scores:{ ambiente:{value:4,label:"Ambiente"}, cultura:{value:5,label:"Cultura"}, gastronomia:{value:5,label:"Gastronomía"}, transporte:{value:5,label:"Transporte"}, seguridad:{value:5,label:"Seguridad"}, costo:{value:2,label:"Costo"} },
  manifesto:{
    headline:"Vancouver no necesita el Mundial para ser el destino. El Mundial necesita a Vancouver.",
    body:"Hay ciudades sede que se preparan para recibir el torneo. Vancouver ya es, de fábrica, el tipo de lugar que la gente del mundo quiere ver. Montañas con nieve visible desde el centro. Océano Pacífico a tres cuadras del BC Place. Un bosque antiguo de 400 hectáreas dentro de los límites de la ciudad.",
    lagomNote:"Vancouver es cara. Un café specialty cuesta $7 CAD, un hotel decente empieza en $180 CAD la noche. Planifica el presupuesto con honestidad.",
  },
  vibe:{
    body:"Vancouver tiene la afición de fútbol más comprometida de Canadá. Cuando Canadá juega el 17 de junio, la ciudad entera para. Gastown tendrá banderas de todos los países desde la semana anterior.",
    zones:[
      { name:"Gastown",        type:"Fan zone histórico",  desc:"Adoquines, pubs victorianos, afición europea mezclada." },
      { name:"False Creek",    type:"Waterfront",          desc:"Ruta peatonal desde Granville Island hasta Yaletown." },
      { name:"BC Place Plaza", type:"Fan fest oficial",    desc:"Abre 4 horas antes. El más grande de las sedes canadienses." },
    ],
    lagomNote:"El partido de Canadá (17 Jun) es el evento de la temporada. Reserva hotel, transporte y restaurante con meses de anticipación.",
  },
  neighborhoods:[
    { name:"Yaletown",    vibe:"Moderno, gastronómico, junto al False Creek.",  best_for:"Pareja",           walk_to_stadium:"15 min" },
    { name:"Gastown",     vibe:"Histórico, animado, el barrio del pre-partido.", best_for:"Fan WC",           walk_to_stadium:"20 min" },
    { name:"Coal Harbour", vibe:"Tranquilo, marina, vistas al North Shore.",    best_for:"Familia",          walk_to_stadium:"25 min" },
    { name:"West End",    vibe:"Residencial, verde, acceso a Stanley Park.",    best_for:"Pareja / Familia", walk_to_stadium:"30 min" },
  ],
  hotels:[
    { name:"Rosewood Hotel Georgia", price:"$$$$", area:"Downtown",     note:"El hotel histórico de Vancouver desde 1927.", url:"" },
    { name:"Loden Hotel",            price:"$$$",  area:"Coal Harbour", note:"Boutique con criterio europeo. Servicio de bicicletas.", url:"" },
    { name:"Westin Bayshore",        price:"$$$",  area:"Coal Harbour", note:"Junto a Stanley Park. Mejor alberca del torneo.", url:"" },
    { name:"Sutton Place Hotel",     price:"$$",   area:"West End",     note:"Confiable, bien ubicado, bar activo en noches de partido.", url:"" },
  ],
  logistics:{
    arrival:"Vuelo CDMX–YVR: escala en LAX o SFO. 7–9 horas. eTA canadiense obligatoria ($7 CAD).",
    airport_to_city:"Canada Line SkyTrain desde YVR hasta Waterfront Station. $11.25 CAD. 26 minutos.",
    stadium_transport:"SkyTrain Stadium–Chinatown Station. 2 minutos caminando del BC Place.",
    visa:"eTA canadiense obligatoria para mexicanos. $7 CAD, trámite en línea.",
    lagomNote:"Error crítico: no usar la estación Stadium-Chinatown en día de partido. Usa Waterfront + caminata de 18 min — evitas el colapso.",
  },
  meetingPoints:[
    { name:"Steamworks Brew Pub", area:"Gastown",     desc:"El punto de reunión más consistente. Cerveza artesanal, pantallas, 3 pisos." },
    { name:"BC Place North Plaza", area:"Estadio",    desc:"Fan fest oficial 4 horas antes." },
    { name:"Granville Island",    area:"False Creek", desc:"Mercado abierto todo el día. Pre-partido perfecto para familia o pareja." },
    { name:"Canada Place",        area:"Downtown",    desc:"Pantallas en el exterior en días de partido." },
  ],
  food:[
    { dish:"Ostras del Pacífico",   where:"Granville Island Market",        price:"$2–3 CAD c/u", type:"Imperdible" },
    { dish:"Salmón del Pacífico",   where:"Fish House Stanley Park",        price:"$$",           type:"Local" },
    { dish:"Ramen Tonkotsu",        where:"Marutama Ra-men, Robson St.",    price:"$",            type:"Casual" },
    { dish:"Degustación canadiense", where:"Hawksworth Restaurant",        price:"$$$$",         type:"Ocasión especial" },
  ],
  experiences:[
    { title:"Ferry a Bowen Island",      duration:"Día completo", desc:"Sale de Horseshoe Bay cada hora ($13 CAD). Pueblo, restaurante de pescado, vistas del Howe Sound.", type:"Imperdible" },
    { title:"Stanley Park en bici",      duration:"3–4 horas",   desc:"10 km de carril junto al océano. El recorrido más fotogénico del torneo.", type:"Activo" },
    { title:"Capilano Suspension Bridge", duration:"Medio día",  desc:"136 metros sobre el río entre secuoyas centenarias.", type:"Familia" },
    { title:"Recorrido Gastown",         duration:"2 horas",     desc:"El reloj de vapor de 1977. Galerías independientes. La noche perfecta antes del partido.", type:"Cultural" },
  ],
  closingNote:"Vancouver es el tipo de ciudad que te hace reconsiderar tus prioridades. Llegas por el fútbol. Te quedas por el resto.",
  closingSignature:"Lagomplan · Guía de campo, Mundial 2026",
  plannerCTA:"Generar mi viaje a Vancouver",
}

export const GUIDES: Record<string, WorldcupGuide> = {
  cdmx: CDMX, gdl: GDL,   mty: MTY,
  la:   LA,   mia: MIA,   nyc: NYC,
  dal:  DAL,  sf:  SF,    hou: HOU,
  sea:  SEA,  kc:  KC,    atl: ATL,
  phi:  PHI,  bos: BOS,   tor: TOR,
  van:  VAN,
}

export const ROSTER: RosterItem[] = [
  { id:"cdmx", city:"Ciudad de México", country:"México",  flag:"🇲🇽" },
  { id:"gdl",  city:"Guadalajara",      country:"México",  flag:"🇲🇽" },
  { id:"mty",  city:"Monterrey",        country:"México",  flag:"🇲🇽" },
  { id:"la",   city:"Los Ángeles",      country:"EE.UU.",  flag:"🇺🇸" },
  { id:"mia",  city:"Miami",            country:"EE.UU.",  flag:"🇺🇸" },
  { id:"nyc",  city:"Nueva York",       country:"EE.UU.",  flag:"🇺🇸" },
  { id:"dal",  city:"Dallas",           country:"EE.UU.",  flag:"🇺🇸" },
  { id:"sf",   city:"San Francisco",    country:"EE.UU.",  flag:"🇺🇸" },
  { id:"hou",  city:"Houston",          country:"EE.UU.",  flag:"🇺🇸" },
  { id:"sea",  city:"Seattle",          country:"EE.UU.",  flag:"🇺🇸" },
  { id:"kc",   city:"Kansas City",      country:"EE.UU.",  flag:"🇺🇸" },
  { id:"atl",  city:"Atlanta",          country:"EE.UU.",  flag:"🇺🇸" },
  { id:"phi",  city:"Filadelfia",       country:"EE.UU.",  flag:"🇺🇸" },
  { id:"bos",  city:"Boston",           country:"EE.UU.",  flag:"🇺🇸" },
  { id:"tor",  city:"Toronto",          country:"Canadá",  flag:"🇨🇦" },
  { id:"van",  city:"Vancouver",        country:"Canadá",  flag:"🇨🇦" },
]
