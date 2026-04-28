import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#E1615B'

export const es: CityGuide = {
  id:"atl",
  city:"Atlanta",
  country:"Estados Unidos",
  state:"Georgia",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Fútbol","Cultura","Gastronomía","Sede co-anfitriona"],

  stadium:{ name:"Atlanta Stadium (Mercedes-Benz Stadium)", capacity:"~75,000", area:"Downtown — junto al Centennial Olympic Park" },

  headline:"El único estadio mundialista con techo retráctil y aire acondicionado en Estados Unidos. En julio en Georgia, eso no es un lujo — es una política de salud pública.",
  description:"El único estadio mundialista con techo retráctil y aire acondicionado en Estados Unidos. En julio en Georgia, eso no es un lujo — es una política de salud pública. Atlanta llega al Mundial con ocho partidos, dos presentaciones de España, una Semifinal y una ciudad que lleva dos décadas construyendo la cultura de soccer más seria del sur del país.",

  scores:[
    { label:"Ambiente",     value:4 },
    { label:"Fútbol local", value:4 },
    { label:"Gastronomía",  value:4 },
    { label:"Transporte",   value:4 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:3 },
  ],

  matches:[
    { id:"m1", date:"15 Jun", day:"Lun", time:"12:00 ET", teams:[{name:"España",flag:"🇪🇸"},{name:"Cabo Verde",flag:"🇨🇻"}], stadium:"Atlanta Stadium", tag:"Grupo H — apertura de la sede", highlight:true },
    { id:"m2", date:"18 Jun", day:"Jue", time:"12:00 ET", teams:[{name:"Sudáfrica",flag:"🇿🇦"},{name:"Repechaje UEFA D",flag:""}], stadium:"Atlanta Stadium", tag:"Grupo A", highlight:false },
    { id:"m3", date:"21 Jun", day:"Dom", time:"12:00 ET", teams:[{name:"España",flag:"🇪🇸"},{name:"Arabia Saudita",flag:"🇸🇦"}], stadium:"Atlanta Stadium", tag:"Grupo H — España confirma el grupo", highlight:true },
    { id:"m4", date:"24 Jun", day:"Mié", time:"18:00 ET", teams:[{name:"Marruecos",flag:"🇲🇦"},{name:"Haití",flag:"🇭🇹"}], stadium:"Atlanta Stadium", tag:"Grupo C", highlight:false },
    { id:"m5", date:"27 Jun", day:"Sáb", time:"19:30 ET", teams:[{name:"RD Congo",flag:"🇨🇩"},{name:"Uzbekistán",flag:"🇺🇿"}], stadium:"Atlanta Stadium", tag:"Grupo K", highlight:false },
    { id:"m6", date:"1 Jul",  day:"Mié", time:"12:00 ET", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Atlanta Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m7", date:"7 Jul",  day:"Mar", time:"12:00 ET", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"Atlanta Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m8", date:"15 Jul", day:"Mié", time:"15:00 ET", teams:[{name:"Semifinal",flag:""},{name:"Por definir",flag:""}], stadium:"Atlanta Stadium", tag:"Semifinal", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",    value:"Atlanta Stadium (Mercedes-Benz Stadium)" },
      { label:"Aforo",           value:"~75,000 — configuración FIFA" },
      { label:"Clima",           value:"Días: 30–34°C · Humedad alta · Interior climatizado con techo retráctil y temperatura controlada" },
      { label:"Partidos",        value:"8 confirmados — 5 grupos + 1 Ronda de 32 + 1 Ronda de 16 + 1 Semifinal" },
      { label:"Nota del estadio",value:"Mercedes-Benz Stadium: primer estadio profesional con certificación LEED Platinum en EE.UU. Los precios de comida dentro son deliberadamente más bajos que en cualquier otro estadio de la NFL." },
      { label:"Aeropuerto",      value:"ATL — Hartsfield-Jackson Atlanta International · el aeropuerto más transitado del mundo · MARTA directo al centro en ~20 min" },
    ],
    body:"Atlanta llega al Mundial con ocho partidos, el único estadio climatizado de Estados Unidos en el torneo y una ciudad que lleva dos décadas construyendo la cultura de soccer más seria del sur del país. España juega dos de sus tres partidos de grupos en Atlanta. Si avanza — lo que el sorteo sugiere fuertemente — los aficionados españoles tienen una base fija aquí durante dos semanas. La diáspora africana llena las tribunas de Marruecos y RD Congo desde adentro de la ciudad; y el 15 de julio, una Semifinal llega al mismo recinto donde Atlanta United gana sus títulos.",
    lagomNote:"España juega dos partidos en Atlanta (15 y 21 de junio). Para la Semifinal del 15 de julio, los precios de hotel en Midtown suben a niveles de Super Bowl. Reserva ambas fechas simultáneamente o busca Airbnb en Decatur o Virginia-Highland, barrios bien conectados por MARTA con precios más razonables.",
  },

  vibe:{
    body:"Atlanta tiene una de las comunidades africanas más grandes de Estados Unidos — las diásporas de Ghana, Nigeria, Etiopía y Senegal dan a los partidos de Cabo Verde, Marruecos y RD Congo una tribuna local que nadie tuvo que comprar un vuelo para estar ahí. España suma una comunidad hispanohablante de más de 800,000 personas en el área metropolitana. El Atlanta United fue el equipo que demostró que el sur de Estados Unidos podía sostener una cultura de soccer seria. Los Five Stripes promedian 45,000 espectadores por partido en el mismo estadio del Mundial — la mayor asistencia de la MLS. La capital culinaria del sur de Estados Unidos suma chicken and waffles, cocina coreana en Doraville, la mejor escena de restaurantes de autor del sureste del país y el Sweet Auburn Curb Market con décadas de historia.",
    lagomNote:"Más accesible que las sedes de la Costa Este. Los precios suben en las fechas de España y la Semifinal, pero el margen de aumento es manejable comparado con Nueva York o Miami.",
  },

  stayNeighborhoods:{
    intro:"Atlanta es una ciudad pensada para el auto — pero el Mundial cambia eso en parte. El Mercedes-Benz Stadium está en el centro, conectado al MARTA, y los barrios más interesantes para quedarse están a distancia razonable de la línea.",
    items:[
      { kind:"recommended", title:"Base recomendada: Midtown Atlanta", body:"El corredor de Peachtree Street en Midtown tiene la mejor concentración de hoteles boutique, restaurantes de autor y bares de la ciudad, con acceso directo al MARTA (estaciones Midtown y Arts Center en la línea Roja/Dorada). Al estadio: 15 minutos en metro sin transbordo. Para el fan que quiere vivir Atlanta entre partidos y no depender del auto, Midtown es la base más completa." },
      { kind:"alternative", title:"Opción con carácter: Inman Park / Ponce City Market", body:"El barrio más victoriano de Atlanta con la mejor selección de restaurantes independientes de la ciudad. El Ponce City Market — un mercado en un antiguo edificio de distribución de Sears — tiene más de cien tiendas y restaurantes en un solo recinto. Acceso al MARTA por la estación King Memorial (línea Este/Oeste, transbordo en Five Points para el estadio). Ambiente genuino, precios más bajos que Midtown." },
      { kind:"alternative", title:"Para fans africanos y de España: Doraville / Buford Highway", body:"El corredor de Buford Highway al noreste de Atlanta concentra la mayor diversidad gastronómica de la ciudad — cocina coreana, china, vietnamita, etíope y mexicana en un radio de diez kilómetros. Doraville tiene también la comunidad africana más activa del área metropolitana. Acceso por MARTA línea Dorada (estación Doraville, terminal de línea). Para el fan que quiere comer bien y gastar poco entre el partido del 15 y el del 21 de junio." },
      { kind:"avoid", title:"Evitar como base: Downtown inmediato al estadio", body:"El downtown de Atlanta fuera del complejo del CNN Center y el Centennial Olympic Park tiene bloques sin vida de barrio real. Conveniente en teoría para el estadio; frustrante como base de varios días. Midtown está a diez minutos en MARTA y tiene todo lo que el downtown no tiene." },
    ],
  },
  stays:[
    { name:"Hotel Clermont", area:"Ponce de Leon / Midtown-Inman Park", price:"$$$", priceCAD:"$220–380 USD/noche (periodo mundialista)", tags:["Hotel boutique","Rooftop","Ponce City Market cerca"], note:"El hotel que revivió el Ponce de Leon corridor de Atlanta: rooftop bar con vistas al skyline, restaurante propio y habitaciones con diseño deliberado en un edificio de los años 20. A dos cuadras del Ponce City Market y a quince minutos del estadio en MARTA.", best_for:"Carácter", url:"https://booking.stay22.com/lagomplan/wHIiapcEkW" },
    { name:"Loews Atlanta Hotel", area:"Midtown", price:"$$$", priceCAD:"$190–320 USD/noche (periodo mundialista)", tags:["Valor","MARTA cerca","Habitaciones amplias"], note:"La mejor relación posición-precio-servicio de Midtown: habitaciones amplias, gimnasio, pool y acceso caminando a la estación de MARTA Midtown. Cuatro cuadras de Peachtree Street.", best_for:"Fan WC", url:"https://booking.stay22.com/lagomplan/d1JnNPNPDU" },
    { name:"Four Seasons Atlanta", area:"Midtown / 14th Street", price:"$$$$", priceCAD:"$480–850 USD/noche (periodo mundialista)", tags:["Lujo","Piedmont Park","Spa"], note:"La dirección de referencia en Atlanta: vistas al parque Piedmont, restaurante Park 75 y spa de piso completo. A tres cuadras de la estación de MARTA Arts Center.", best_for:"Lujo", url:"https://booking.stay22.com/lagomplan/rFOlKarvir" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Atlanta — ATL", text:"ATL — Hartsfield-Jackson Atlanta International es el aeropuerto más transitado del mundo. El MARTA Gold Line sale del aeropuerto directamente al centro de Atlanta en veinte minutos. Desde el avión hasta la puerta del Mercedes-Benz Stadium en menos de 35 minutos, sin taxi." },
      { icon:"🚇", title:"Ruta maestra — MARTA Roja o Dorada", text:"MARTA línea Roja o Dorada → Vine City Station o GWCC/CNN Center Station. Desde Midtown (Arts Center o Midtown Station) hasta Vine City: dos o tres paradas sin transbordo, en ocho a doce minutos. Tarifa: $2.50 con tarjeta Breeze." },
      { icon:"🏟", title:"Al estadio el día del partido", text:"El MARTA conecta directamente con el complejo del estadio desde múltiples puntos de la ciudad. Es el tránsito público más limpio y directo de cualquier sede del sur del país. Desde Inman Park, transbordo en Five Points y llegada al complejo del estadio en aproximadamente veinte minutos." },
      { icon:"⚠️", title:"Error crítico — subestimar el calor exterior", text:"El trayecto entre la estación de MARTA y la entrada del estadio, las filas de seguridad exteriores y las zonas de espera al aire libre pueden sumar 20–30 minutos bajo el sol de julio en Atlanta con humedad alta. Lleva agua, protector solar y ropa que permita sudar.", isWarning:true },
    ],
    timings:[
      { label:"Desde Midtown (Arts Center) en MARTA",         value:"~12 min" },
      { label:"Desde ATL (aeropuerto) en MARTA Gold Line",    value:"~30 min puerta a puerta" },
      { label:"Desde Inman Park en MARTA",                    value:"~20 min con transbordo en Five Points" },
      { label:"Uber desde Midtown",                           value:"10–20 min · regreso post-partido con espera larga" },
    ],
    matchDayCronologia:{
      matchName:"15 Jul · Semifinal · 15:00 ET",
      steps:[
        { time:"H-3:00", text:"Almuerza en Midtown o Inman Park. La Semifinal arranca a las 3pm — el mediodía tiene el calor más intenso del día." },
        { time:"H-2:30", text:"MARTA desde tu estación hacia Vine City o GWCC/CNN Center Station." },
        { time:"H-1:30", text:"Llegada al estadio. El aire acondicionado entra en funcionamiento en cuanto cruzas el acceso." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:45", text:"MARTA de regreso. Servicio ampliado post-partido." },
      ],
    },
    timing:"Mercedes-Benz Stadium tiene lo que no tiene ningún otro estadio mundialista norteamericano, salvo el BC Place de Vancouver: un techo que se cierra y aire acondicionado. El calor de julio en Georgia deja de ser un problema en el momento en que cruzas la puerta del estadio.",
    cost:"Más accesible que las sedes de la Costa Este. Los precios suben en las fechas de España y la Semifinal, pero el margen de aumento es manejable comparado con Nueva York o Miami.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Centennial Olympic Park", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest de Atlanta se instala en el Centennial Olympic Park — el parque construido para los Juegos Olímpicos de 1996 en el corazón del downtown, a cinco minutos caminando del estadio. Pantallas gigantes, programación musical y acceso gratuito desde el MARTA. Para los partidos de España en especial, el parque acumula una multitud que mezcla la diáspora hispanohablante de Atlanta con aficionados internacionales.", tag:"Sin boleto OK" },
    { title:"Centennial Olympic Park — exterior", type:"Pantalla exterior", typeColor:FJORD, desc:"Las dimensiones del Centennial son tan generosas que el perímetro exterior del parque, con pantallas orientadas hacia las calles adyacentes, funciona como segundo anillo de transmisión. Para el fan que llega tarde al Fan Fest oficial, el exterior tiene ambiente sin necesidad de registro.", tag:"Icónico" },
    { title:"Decatur Square — WatchFest 26", type:"WatchFest 26", typeColor:SAGE, desc:"El ayuntamiento del municipio de Decatur, a 10 km del downtown de Atlanta por la línea MARTA, organiza WatchFest 26: 34 días de transmisiones al aire libre en la plaza principal con conciertos incluidos. Para el fan que quiere el ambiente sin la masividad del Fan Fest central.", tag:"Local" },
    { title:"Piedmont Park (Midtown)", type:"Parque urbano", typeColor:PINE, desc:"El parque urbano más grande de Atlanta activa su gran prado central con pantallas para partidos de alta demanda. La comunidad de fanáticos de Atlanta United — los más organizados de la ciudad — usa Piedmont como punto de reunión orgánico para los partidos que no tienen pantalla en el Centennial.", tag:"Comunidad" },
    { title:"The Midway Pub", type:"Bar de barrio", typeColor:"#1A3A5C", desc:"Bar de barrio con pantallas en todos los ángulos y una clientela mixta que va desde los aficionados del Atlanta United hasta quienes siguen la Premier League con criterio. Para los partidos de Marruecos y España, The Midway es de los pocos lugares en Atlanta donde la afición del equipo visitante también encuentra su comunidad. Qué pedir: Alitas + cerveza artesanal de Georgia. Vibe: Bar auténtico, el más futbolero de Atlanta fuera del Centennial.", tag:"Little Five Points" },
    { title:"Fado Irish Pub", type:"Pub irlandés", typeColor:"#093b12", desc:"El pub irlandés de referencia de Atlanta, con pantallas de gran formato y una tradición establecida de transmitir fútbol europeo desde antes de que la MLS existiera en la ciudad. Para el partido de España vs. Arabia Saudita (21 de junio), la afición española de Atlanta convierte Fado en un punto de concentración. Qué pedir: Shepherd's pie + Guinness de barril. Vibe: Pub europeo, historial de fútbol serio.", tag:"Buckhead" },
    { title:"Stats Brewpub", type:"Cervecería", typeColor:"#5A3A2A", desc:"Cervecería con el mayor número de pantallas de cualquier local del downtown de Atlanta y una selección de cervezas artesanales de Georgia seria. A cinco minutos caminando del Mercedes-Benz Stadium. Para los partidos sin afición masiva, Stats tiene el ambiente correcto sin el caos del Fan Fest. Qué pedir: Lo que esté de temporada en el taproom + pizza de masa madre. Vibe: Cervecero, pantallas serias.", tag:"Downtown" },
  ],

  food:[
    { dish:"The Midway Pub",                          where:"Little Five Points — alitas + cerveza artesanal de Georgia; bar de barrio auténtico, el más futbolero de Atlanta fuera del Centennial",           price:"$$",  type:"Pre-partido" },
    { dish:"Fado Irish Pub",                           where:"Buckhead — shepherd's pie + Guinness de barril; pub europeo con historial de fútbol serio",                                                       price:"$$",  type:"Pub europeo" },
    { dish:"Stats Brewpub",                            where:"Downtown — cerveza de temporada + pizza de masa madre; pantallas serias a cinco minutos del estadio",                                             price:"$$",  type:"Pantallas" },
    { dish:"Sweet Auburn Curb Market",                 where:"Sweet Auburn — mercado histórico desde 1918 en el barrio donde nació Martin Luther King Jr.; cocina sureña y ambiente auténtico",                price:"$–$$", type:"Mercado" },
    { dish:"Cocina coreana, vietnamita y etíope",      where:"Doraville / Buford Highway — la mayor diversidad gastronómica de la ciudad en un radio de diez kilómetros",                                       price:"$–$$", type:"Excursión" },
    { dish:"Chicken and waffles",                      where:"Atlanta — capital culinaria del sur de Estados Unidos, con argumento gastronómico propio y serio",                                               price:"$$",  type:"Local" },
  ],

  experiences:[
    { title:"Martin Luther King Jr. National Historic Site", duration:"Medio día", desc:"El complejo del National Park Service en Sweet Auburn incluye la casa natal de King, la iglesia Ebenezer Baptist Church donde predicó y su tumba junto a Coretta Scott King — todo en el mismo radio de cuatro cuadras. Entrada gratuita, acceso por MARTA (estación King Memorial). El Centro Internacional de los Derechos Civiles y los Derechos Humanos, a diez minutos caminando del Centennial Olympic Park, complementa el recorrido con una exposición sobre el movimiento global.", type:"Historia", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver información" },
    { title:"Georgia Aquarium + World of Coca-Cola", duration:"Día completo", desc:"El Georgia Aquarium en el downtown es el más grande del hemisferio occidental: cuatro millones de galones de agua, tiburones ballena, belugas y delfines. A cien metros, el World of Coca-Cola tiene degustación de más de cien sabores de la marca desde todo el mundo. Los dos en el mismo radio de tres cuadras, con aire acondicionado — un día completo sin auto y sin sol directo.", type:"Familia", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver entradas" },
    { title:"Piedmont Park + BeltLine", duration:"Mañana o tarde", desc:"Piedmont Park en Midtown tiene 185 acres de parque urbano con lago, senderos y los mejores atardeceres de la ciudad. Conecta con el Atlanta BeltLine — corredor peatonal y ciclista de 35 kilómetros alrededor del núcleo de la ciudad. El tramo Eastside Trail, desde Inman Park hasta Ponce City Market, es el más activo y tiene acceso a mercados, restaurantes y galerías. Para el día libre entre el 21 y el 24 de junio, el BeltLine en bicicleta es el plan más completo de Atlanta.", type:"Ciudad", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Alquilar bicicleta" },
    { title:"Ponce City Market + Eastside Trail", duration:"Medio día", desc:"El Ponce City Market ocupa un antiguo edificio de distribución de Sears con más de cien tiendas y restaurantes en un solo recinto. Conectado al BeltLine, funciona como punto de entrada natural a Inman Park, al corredor gastronómico del Eastside Trail y a la Atlanta que se entiende mejor caminando que desde un auto.", type:"Gastronomía", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver opciones" },
  ],

  lagomTips:[
    "España juega dos de sus tres partidos de grupos en Atlanta. Si avanza — lo que el sorteo sugiere fuertemente — los aficionados españoles tienen una base fija aquí durante dos semanas.",
    "MARTA línea Roja o Dorada hacia Vine City Station o GWCC/CNN Center Station es la ruta maestra. Desde Midtown son dos o tres paradas sin transbordo, en ocho a doce minutos.",
    "No subestimes el calor exterior. El estadio está climatizado, pero filas, caminatas y zonas de espera pueden sumar 20–30 minutos bajo sol de julio con humedad alta.",
    "Reserva simultáneamente fechas de España y Semifinal. Para el 15 de julio, Midtown puede subir a niveles de Super Bowl; Decatur y Virginia-Highland son alternativas razonables.",
  ],

  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Tarjeta Breeze o pago sin contacto para MARTA",
    "Ruta MARTA definida: Vine City o GWCC/CNN Center",
    "Agua para el trayecto exterior",
    "Protector solar",
    "Ropa ligera que permita sudar",
    "Reserva de hotel confirmada para 15 y 21 de junio (España) y 15 de julio (Semifinal)",
    "Llegada al estadio 90 min antes — el A/C empieza al cruzar el acceso",
  ],

  didYouKnow:"Mercedes-Benz Stadium es el primer estadio deportivo profesional en obtener la certificación LEED Platinum en Estados Unidos. Los precios de comida dentro del recinto son notablemente más bajos que en cualquier otro estadio de la NFL — política deliberada del propietario.",
  closingNote:"Atlanta llega al Mundial con ocho partidos, el único estadio climatizado de Estados Unidos en el torneo y una ciudad que lleva dos décadas construyendo la cultura de soccer más seria del sur del país. España juega aquí dos veces seguidas; la diáspora africana llena las tribunas de Marruecos y RD Congo desde adentro de la ciudad; y el 15 de julio, una Semifinal en el mismo recinto donde Atlanta United gana sus títulos. El MARTA llega directo. El aire acondicionado funciona. LagomPlan te da la estación y el barrio. La ciudad pone el resto.",
  closingSignature:"Lagomplan · Guía de campo · Atlanta · Mundial 2026",
  plannerCTA:"Generar mi viaje a Atlanta",

  sectionSubtitles:{
    matches:"8 partidos en Atlanta Stadium — España juega dos veces (15 y 21 jun), y una Semifinal el 15 de julio.",
    vibe:"Fan Fest oficial en el Centennial Olympic Park, WatchFest 26 en Decatur y los pubs que Atlanta United convirtió en referencia.",
    logistics:"MARTA directo al Mercedes-Benz Stadium desde downtown, Midtown y el aeropuerto — el único estadio climatizado del torneo en Estados Unidos.",
    food:"Cocina sureña seria, Sweet Auburn Curb Market, Buford Highway y los pubs europeos del corredor de Buckhead.",
  },
  staysWarning:"Los precios son estimaciones para el periodo mundialista. España (15 y 21 de junio) y la Semifinal (15 de julio) son las fechas más críticas — Midtown puede subir a niveles de Super Bowl. Decatur y Virginia-Highland, bien conectados por MARTA, son las alternativas razonables.",
}

export const en: CityGuide = {
  id:"atl",
  city:"Atlanta",
  country:"United States",
  state:"Georgia",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Football","Culture","Food","Co-host city"],

  stadium:{ name:"Atlanta Stadium (Mercedes-Benz Stadium)", capacity:"~75,000", area:"Downtown — next to Centennial Olympic Park" },

  headline:"The only World Cup stadium in the United States with a retractable roof and air conditioning. In a Georgia July, that's not a luxury — it's public health policy.",
  description:"The only World Cup stadium in the United States with a retractable roof and air conditioning. In a Georgia July, that's not a luxury — it's public health policy. Atlanta arrives at the World Cup with eight matches, two Spain appearances, a Semifinal, and a city that has spent two decades building the most serious soccer culture in the U.S. South.",

  scores:[
    { label:"Atmosphere", value:4 },
    { label:"Football",   value:4 },
    { label:"Food",       value:4 },
    { label:"Transit",    value:4 },
    { label:"Safety",     value:4 },
    { label:"Cost",       value:3 },
  ],

  matches:[
    { id:"m1", date:"Jun 15", day:"Mon", time:"12:00 ET", teams:[{name:"Spain",flag:"🇪🇸"},{name:"Cape Verde",flag:"🇨🇻"}], stadium:"Atlanta Stadium", tag:"Group H — venue opener", highlight:true },
    { id:"m2", date:"Jun 18", day:"Thu", time:"12:00 ET", teams:[{name:"South Africa",flag:"🇿🇦"},{name:"UEFA Playoff D",flag:""}], stadium:"Atlanta Stadium", tag:"Group A", highlight:false },
    { id:"m3", date:"Jun 21", day:"Sun", time:"12:00 ET", teams:[{name:"Spain",flag:"🇪🇸"},{name:"Saudi Arabia",flag:"🇸🇦"}], stadium:"Atlanta Stadium", tag:"Group H — Spain confirms the group", highlight:true },
    { id:"m4", date:"Jun 24", day:"Wed", time:"18:00 ET", teams:[{name:"Morocco",flag:"🇲🇦"},{name:"Haiti",flag:"🇭🇹"}], stadium:"Atlanta Stadium", tag:"Group C", highlight:false },
    { id:"m5", date:"Jun 27", day:"Sat", time:"19:30 ET", teams:[{name:"DR Congo",flag:"🇨🇩"},{name:"Uzbekistan",flag:"🇺🇿"}], stadium:"Atlanta Stadium", tag:"Group K", highlight:false },
    { id:"m6", date:"Jul 1",  day:"Wed", time:"12:00 ET", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"Atlanta Stadium", tag:"Knockout stage", highlight:false },
    { id:"m7", date:"Jul 7",  day:"Tue", time:"12:00 ET", teams:[{name:"Round of 16",flag:""},{name:"TBD",flag:""}], stadium:"Atlanta Stadium", tag:"Knockout stage", highlight:false },
    { id:"m8", date:"Jul 15", day:"Wed", time:"15:00 ET", teams:[{name:"Semifinal",flag:""},{name:"TBD",flag:""}], stadium:"Atlanta Stadium", tag:"Semifinal", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",  value:"Atlanta Stadium (Mercedes-Benz Stadium)" },
      { label:"Capacity",      value:"~75,000 — FIFA configuration" },
      { label:"Weather",       value:"Days: 30–34°C · High humidity · Climate-controlled interior with retractable roof and regulated temperature" },
      { label:"Matches",       value:"8 confirmed — 5 group + 1 Round of 32 + 1 Round of 16 + 1 Semifinal" },
      { label:"Stadium note",  value:"Mercedes-Benz Stadium: the first professional stadium with LEED Platinum certification in the U.S. Food prices inside are deliberately lower than at any other NFL stadium." },
      { label:"Airport",       value:"ATL — Hartsfield-Jackson Atlanta International · the busiest airport in the world · MARTA direct to downtown in ~20 min" },
    ],
    body:"Atlanta arrives at the World Cup with eight matches, the only climate-controlled stadium in the U.S. tournament, and a city that has spent two decades building the most serious soccer culture in the country's South. Spain plays two of its three group matches in Atlanta. If they advance — which the draw strongly suggests — Spanish fans have a fixed base here for two weeks. The African diaspora fills the stands for Morocco and DR Congo from inside the city; and on July 15, a Semifinal arrives at the same venue where Atlanta United wins its titles.",
    lagomNote:"Spain plays two matches in Atlanta (June 15 and 21). For the Semifinal on July 15, Midtown hotel prices rise to Super Bowl levels. Book both dates simultaneously or look for Airbnb in Decatur or Virginia-Highland, neighborhoods well-connected by MARTA with more reasonable prices.",
  },

  vibe:{
    body:"Atlanta has one of the largest African communities in the United States — the diasporas of Ghana, Nigeria, Ethiopia, and Senegal give Cape Verde, Morocco, and DR Congo matches a local crowd nobody had to buy a flight to join. Spain adds a Spanish-speaking community of more than 800,000 in the metro area. Atlanta United is the team that proved the U.S. South could sustain a serious soccer culture. The Five Stripes average 45,000 spectators per match in the same World Cup stadium — the highest attendance in MLS. The culinary capital of the U.S. South contributes chicken and waffles, Korean food in Doraville, the best chef-driven restaurant scene in the Southeast, and the Sweet Auburn Curb Market with decades of history.",
    lagomNote:"More affordable than the East Coast host cities. Prices rise for Spain's dates and the Semifinal, but the markup is manageable compared to New York or Miami.",
  },

  stays:[
    { name:"Hotel Clermont", area:"Ponce de Leon / Midtown-Inman Park", price:"$$$", priceCAD:"$220–380 USD/night (World Cup period)", tags:["Boutique hotel","Rooftop","Near Ponce City Market"], note:"The hotel that revived Atlanta's Ponce de Leon corridor: rooftop bar with skyline views, in-house restaurant, and thoughtfully designed rooms in a 1920s building. Two blocks from Ponce City Market and fifteen minutes from the stadium on MARTA.", best_for:"Character", url:"https://booking.stay22.com/lagomplan/wHIiapcEkW" },
    { name:"Loews Atlanta Hotel", area:"Midtown", price:"$$$", priceCAD:"$190–320 USD/night (World Cup period)", tags:["Value","Near MARTA","Large rooms"], note:"Midtown's best position-to-price-to-service ratio: large rooms, gym, pool, and walking access to MARTA Midtown Station. Four blocks from Peachtree Street.", best_for:"WC fan", url:"https://booking.stay22.com/lagomplan/d1JnNPNPDU" },
    { name:"Four Seasons Atlanta", area:"Midtown / 14th Street", price:"$$$$", priceCAD:"$480–850 USD/night (World Cup period)", tags:["Luxury","Piedmont Park","Spa"], note:"Atlanta's reference address: views of Piedmont Park, the Park 75 restaurant, and a full-floor spa. Three blocks from MARTA Arts Center Station.", best_for:"Luxury", url:"https://booking.stay22.com/lagomplan/rFOlKarvir" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Atlanta — ATL", text:"ATL — Hartsfield-Jackson Atlanta International is the busiest airport in the world. MARTA's Gold Line leaves the airport direct to downtown Atlanta in twenty minutes. From the plane to the Mercedes-Benz Stadium gate in under 35 minutes, no taxi." },
      { icon:"🚇", title:"Master route — MARTA Red or Gold", text:"MARTA Red or Gold Line → Vine City Station or GWCC/CNN Center Station. From Midtown (Arts Center or Midtown Station) to Vine City: two or three stops with no transfer, in eight to twelve minutes. Fare: $2.50 with a Breeze card." },
      { icon:"🏟", title:"To the stadium on match day", text:"MARTA connects directly with the stadium complex from multiple points in the city. It's the cleanest, most direct public transit at any host city in the South. From Inman Park, transfer at Five Points and arrive at the stadium complex in about twenty minutes." },
      { icon:"⚠️", title:"Critical error — underestimating the outdoor heat", text:"The walk between the MARTA station and the stadium entrance, the outdoor security lines, and the open-air waiting zones can add 20–30 minutes under a July Atlanta sun with high humidity. Bring water, sunscreen, and clothing that breathes.", isWarning:true },
    ],
    timings:[
      { label:"From Midtown (Arts Center) on MARTA",       value:"~12 min" },
      { label:"From ATL (airport) on MARTA Gold Line",     value:"~30 min door-to-door" },
      { label:"From Inman Park on MARTA",                  value:"~20 min with a transfer at Five Points" },
      { label:"Uber from Midtown",                          value:"10–20 min · long post-match wait on the return" },
    ],
    matchDayCronologia:{
      matchName:"Jul 15 · Semifinal · 15:00 ET",
      steps:[
        { time:"H-3:00", text:"Lunch in Midtown or Inman Park. The Semifinal kicks off at 3pm — midday is the hottest part of the day." },
        { time:"H-2:30", text:"MARTA from your station toward Vine City or GWCC/CNN Center Station." },
        { time:"H-1:30", text:"Arrive at the stadium. Air conditioning kicks in the moment you cross the entrance." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:45", text:"MARTA back. Expanded post-match service." },
      ],
    },
    timing:"Mercedes-Benz Stadium has what no other North American World Cup venue has, except Vancouver's BC Place: a closing roof and air conditioning. Georgia July heat stops being a problem the moment you cross the stadium gate.",
    cost:"More affordable than the East Coast host cities. Prices rise for Spain's dates and the Semifinal, but the markup is manageable compared to New York or Miami.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Centennial Olympic Park", type:"Official fan fest", typeColor:CORAL, desc:"Atlanta's Fan Fest sets up at Centennial Olympic Park — the park built for the 1996 Olympic Games in the heart of downtown, a five-minute walk from the stadium. Giant screens, musical programming, and free access from MARTA. For Spain's matches especially, the park pulls a crowd that mixes Atlanta's Spanish-speaking diaspora with international visitors.", tag:"No ticket needed" },
    { title:"Centennial Olympic Park — perimeter", type:"Outdoor screen", typeColor:FJORD, desc:"The Centennial's dimensions are generous enough that the park's outer perimeter, with screens facing the adjacent streets, functions as a second broadcast ring. For fans who arrive after the official Fan Fest is full, the perimeter has atmosphere without needing registration.", tag:"Iconic" },
    { title:"Decatur Square — WatchFest 26", type:"WatchFest 26", typeColor:SAGE, desc:"The city hall of Decatur, 10 km from downtown Atlanta on the MARTA line, is hosting WatchFest 26: 34 days of outdoor broadcasts in the main plaza with concerts included. For fans who want the atmosphere without the central Fan Fest's crowds.", tag:"Local" },
    { title:"Piedmont Park (Midtown)", type:"Urban park", typeColor:PINE, desc:"Atlanta's largest urban park activates its central lawn with screens for high-demand matches. The Atlanta United fan community — the city's most organized — uses Piedmont as an organic meeting point for matches that don't have a screen at Centennial.", tag:"Community" },
    { title:"The Midway Pub", type:"Neighborhood bar", typeColor:"#1A3A5C", desc:"A neighborhood bar with screens at every angle and a mixed crowd that ranges from Atlanta United supporters to Premier League watchers who know what they're watching. For Morocco and Spain matches, The Midway is one of the few places in Atlanta where visiting fans also find their community. What to order: Wings + Georgia craft beer. Vibe: Authentic bar, the most football-focused in Atlanta outside Centennial.", tag:"Little Five Points" },
    { title:"Fado Irish Pub", type:"Irish pub", typeColor:"#093b12", desc:"Atlanta's reference Irish pub, with big-format screens and a long-established tradition of showing European football since before MLS existed in the city. For Spain vs. Saudi Arabia (June 21), the Spanish community in Atlanta turns Fado into a gathering point. What to order: Shepherd's pie + Guinness on tap. Vibe: European pub, serious football history.", tag:"Buckhead" },
    { title:"Stats Brewpub", type:"Brewpub", typeColor:"#5A3A2A", desc:"A brewpub with more screens than any other downtown Atlanta venue and a serious Georgia craft beer selection. Five minutes on foot from Mercedes-Benz Stadium. For matches without a massive crowd, Stats has the right atmosphere without Fan Fest chaos. What to order: Whatever's seasonal at the taproom + sourdough pizza. Vibe: Brewery, serious screens.", tag:"Downtown" },
  ],

  food:[
    { dish:"The Midway Pub",               where:"Little Five Points — wings + Georgia craft beer; an authentic neighborhood bar, the most football-focused in Atlanta outside Centennial", price:"$$",   type:"Pre-match" },
    { dish:"Fado Irish Pub",                where:"Buckhead — shepherd's pie + Guinness on tap; European pub with serious football history",                                                  price:"$$",   type:"European pub" },
    { dish:"Stats Brewpub",                 where:"Downtown — seasonal beer + sourdough pizza; serious screens five minutes from the stadium",                                                price:"$$",   type:"Screens" },
    { dish:"Sweet Auburn Curb Market",      where:"Sweet Auburn — a historic market since 1918 in the neighborhood where Martin Luther King Jr. was born; Southern cooking and real atmosphere", price:"$–$$", type:"Market" },
    { dish:"Korean, Vietnamese, Ethiopian", where:"Doraville / Buford Highway — the city's deepest food diversity within a ten-kilometer radius",                                             price:"$–$$", type:"Excursion" },
    { dish:"Chicken and waffles",           where:"Atlanta — the culinary capital of the U.S. South, with a serious gastronomic argument of its own",                                         price:"$$",   type:"Local" },
  ],

  experiences:[
    { title:"Martin Luther King Jr. National Historic Site", duration:"Half day", desc:"The National Park Service complex in Sweet Auburn includes King's birth home, Ebenezer Baptist Church where he preached, and his tomb next to Coretta Scott King — all within a four-block radius. Free admission, MARTA access (King Memorial station). The International Civil and Human Rights Center, ten minutes on foot from Centennial Olympic Park, complements the route with an exhibit on the global movement.", type:"History", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See info" },
    { title:"Georgia Aquarium + World of Coca-Cola", duration:"Full day", desc:"The Georgia Aquarium downtown is the largest in the Western Hemisphere: four million gallons of water, whale sharks, belugas, and dolphins. A hundred meters away, the World of Coca-Cola has tastings of more than a hundred flavors from around the world. Both within a three-block radius, with air conditioning — a full day without a car and without direct sun.", type:"Family", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See tickets" },
    { title:"Piedmont Park + BeltLine", duration:"Morning or afternoon", desc:"Piedmont Park in Midtown has 185 acres of urban park with a lake, trails, and the best sunsets in the city. It connects to the Atlanta BeltLine — a 35-kilometer pedestrian and cycling corridor around the city core. The Eastside Trail section, from Inman Park to Ponce City Market, is the busiest and has access to markets, restaurants, and galleries. For the off-day between June 21 and 24, the BeltLine on a bike is the most complete plan in Atlanta.", type:"City", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Rent a bike" },
    { title:"Ponce City Market + Eastside Trail", duration:"Half day", desc:"Ponce City Market occupies a former Sears distribution building with more than a hundred shops and restaurants under one roof. Connected to the BeltLine, it functions as the natural entry point to Inman Park, the Eastside Trail food corridor, and the Atlanta that reads better on foot than from a car.", type:"Food", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See options" },
  ],

  lagomTips:[
    "Spain plays two of its three group matches in Atlanta. If they advance — which the draw strongly suggests — Spanish fans have a fixed base here for two weeks.",
    "MARTA Red or Gold Line to Vine City Station or GWCC/CNN Center Station is the master route. From Midtown it's two or three stops with no transfer, in eight to twelve minutes.",
    "Don't underestimate the outdoor heat. The stadium is climate-controlled, but lines, walks, and waiting zones can add 20–30 minutes under a July sun with high humidity.",
    "Book Spain and Semifinal dates simultaneously. For July 15, Midtown can hit Super Bowl levels; Decatur and Virginia-Highland are reasonable alternatives.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "Breeze card or contactless payment for MARTA",
    "MARTA route defined: Vine City or GWCC/CNN Center",
    "Water for the outdoor walk",
    "Sunscreen",
    "Light clothing that breathes",
    "Hotel reservation confirmed for June 15 and 21 (Spain) and July 15 (Semifinal)",
    "Arrive at the stadium 90 min before — the A/C starts as you cross the gate",
  ],

  didYouKnow:"Mercedes-Benz Stadium is the first professional sports stadium to earn LEED Platinum certification in the United States. Food prices inside the venue are notably lower than at any other NFL stadium — a deliberate owner policy.",
  closingNote:"Atlanta arrives at the World Cup with eight matches, the only climate-controlled stadium in the U.S. tournament, and a city that has spent two decades building the most serious soccer culture in the U.S. South. Spain plays here twice in a row; the African diaspora fills the stands for Morocco and DR Congo from inside the city; and on July 15, a Semifinal at the same venue where Atlanta United wins its titles. MARTA arrives direct. The air conditioning works. LagomPlan gives you the station and the neighborhood. The city handles the rest.",
  closingSignature:"Lagomplan · Field Guide · Atlanta · World Cup 2026",
  plannerCTA:"Generate my Atlanta trip",

  sectionSubtitles:{
    matches:"8 matches at Atlanta Stadium — Spain plays twice (Jun 15 and 21), and a Semifinal on July 15.",
    vibe:"Official Fan Fest at Centennial Olympic Park, WatchFest 26 in Decatur, and the pubs Atlanta United turned into the reference.",
    logistics:"MARTA direct to Mercedes-Benz Stadium from downtown, Midtown, and the airport — the only climate-controlled stadium in the U.S. tournament.",
    food:"Serious Southern cooking, Sweet Auburn Curb Market, Buford Highway, and the European pubs on the Buckhead corridor.",
  },
  staysWarning:"Prices are estimates for the World Cup period. Spain (June 15 and 21) and the Semifinal (July 15) are the critical dates — Midtown can hit Super Bowl levels. Decatur and Virginia-Highland, well-connected by MARTA, are the reasonable alternatives.",
}
