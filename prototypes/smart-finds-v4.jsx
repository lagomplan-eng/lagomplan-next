import { useState } from "react";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const PINE = "#0F3A33", SAGE = "#6B8F86", SAND = "#EDE7E1";
const OW = "#FAFAF8", MUTED = "#9A9690", BORDER = "#DDD8D1";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Manrope:wght@400;500;600;700&display=swap');`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const ic = {
  doona:       c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="20" width="36" height="20" rx="10" stroke={c} strokeWidth="2.5"/><rect x="20" y="12" width="16" height="10" rx="4" stroke={c} strokeWidth="2.5"/><circle cx="18" cy="42" r="5" stroke={c} strokeWidth="2.5"/><circle cx="46" cy="42" r="5" stroke={c} strokeWidth="2.5"/><line x1="46" y1="20" x2="52" y2="12" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  stroller:    c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M14 14 L14 36 Q14 44 22 44 L44 44" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><circle cx="22" cy="50" r="5" stroke={c} strokeWidth="2.5"/><circle cx="44" cy="50" r="5" stroke={c} strokeWidth="2.5"/><path d="M14 22 L44 22 L44 36 Q44 44 36 44" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="8" y1="14" x2="20" y2="14" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  carrier:     c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><circle cx="32" cy="14" r="7" stroke={c} strokeWidth="2.5"/><path d="M20 28 Q20 22 32 22 Q44 22 44 28 L44 48 L20 48 Z" stroke={c} strokeWidth="2.5" fill="none"/><circle cx="32" cy="34" r="6" stroke={c} strokeWidth="2"/><line x1="20" y1="36" x2="8" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="44" y1="36" x2="56" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  suitcase:    c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="20" width="44" height="34" rx="3" stroke={c} strokeWidth="2.5"/><rect x="22" y="13" width="20" height="9" rx="3" stroke={c} strokeWidth="2.5"/><line x1="10" y1="34" x2="54" y2="34" stroke={c} strokeWidth="2" strokeDasharray="4 3"/><circle cx="20" cy="56" r="3" stroke={c} strokeWidth="2"/><circle cx="44" cy="56" r="3" stroke={c} strokeWidth="2"/></svg>,
  airtag:      c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><circle cx="32" cy="32" r="14" stroke={c} strokeWidth="2.5"/><circle cx="32" cy="32" r="5" fill={c}/><path d="M18 32 Q18 18 32 18" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/><path d="M46 32 Q46 46 32 46" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/><circle cx="32" cy="14" r="3" stroke={c} strokeWidth="2"/></svg>,
  backpack:    c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M20 14 Q20 8 32 8 Q44 8 44 14 L44 52 Q44 56 40 56 L24 56 Q20 56 20 52 Z" stroke={c} strokeWidth="2.5" fill="none"/><path d="M26 8 Q26 4 32 4 Q38 4 38 8" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="20" y1="30" x2="44" y2="30" stroke={c} strokeWidth="2"/><rect x="26" y="34" width="12" height="10" rx="2" stroke={c} strokeWidth="2"/><path d="M14 16 Q10 16 10 20 L10 44 Q10 48 14 48 L20 48" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M50 16 Q54 16 54 20 L54 44 Q54 48 50 48 L44 48" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>,
  pouches:     c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="8" y="20" width="28" height="36" rx="3" stroke={c} strokeWidth="2.5"/><line x1="8" y1="28" x2="36" y2="28" stroke={c} strokeWidth="2"/><line x1="16" y1="24" x2="28" y2="24" stroke={c} strokeWidth="3" strokeLinecap="round"/><rect x="28" y="10" width="28" height="36" rx="3" stroke={c} strokeWidth="2" opacity=".5"/><line x1="28" y1="18" x2="56" y2="18" stroke={c} strokeWidth="2" opacity=".5"/><line x1="36" y1="14" x2="48" y2="14" stroke={c} strokeWidth="3" strokeLinecap="round" opacity=".5"/></svg>,
  journal:     c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="14" y="8" width="36" height="48" rx="3" stroke={c} strokeWidth="2.5"/><line x1="22" y1="20" x2="42" y2="20" stroke={c} strokeWidth="2" strokeLinecap="round"/><line x1="22" y1="28" x2="42" y2="28" stroke={c} strokeWidth="2" strokeLinecap="round"/><line x1="22" y1="36" x2="34" y2="36" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="8" y="8" width="6" height="48" rx="3" fill={`${c}20`} stroke={c} strokeWidth="1.5"/></svg>,
  ghost:       c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M16 28 Q16 14 32 14 Q48 14 48 28 L48 52 L42 46 L36 52 L30 46 L24 52 L18 46 L16 52 Z" stroke={c} strokeWidth="2.5" fill="none"/><circle cx="26" cy="30" r="3.5" fill={c}/><circle cx="38" cy="30" r="3.5" fill={c}/><path d="M26 38 Q32 42 38 38" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>,
  magnetic:    c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="10" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><rect x="36" y="10" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><rect x="10" y="36" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><rect x="36" y="36" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><circle cx="32" cy="32" r="4" fill={c}/><line x1="28" y1="32" x2="24" y2="32" stroke={c} strokeWidth="2.5"/><line x1="36" y1="32" x2="40" y2="32" stroke={c} strokeWidth="2.5"/><line x1="32" y1="28" x2="32" y2="24" stroke={c} strokeWidth="2.5"/><line x1="32" y1="36" x2="32" y2="40" stroke={c} strokeWidth="2.5"/></svg>,
  crayons:     c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M24 12 L28 8 L36 8 L40 12 L40 48 L24 48 Z" stroke={c} strokeWidth="2.5" fill="none"/><line x1="24" y1="18" x2="40" y2="18" stroke={c} strokeWidth="2"/><path d="M24 48 L28 56 L32 52 L36 56 L40 48" stroke={c} strokeWidth="2.5" strokeLinejoin="round" fill="none"/></svg>,
  cards:       c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="8" y="14" width="34" height="44" rx="3" stroke={c} strokeWidth="2.5" fill="none"/><rect x="22" y="6" width="34" height="44" rx="3" stroke={c} strokeWidth="2" opacity=".4" fill="none"/><circle cx="25" cy="30" r="7" stroke={c} strokeWidth="2"/><line x1="14" y1="44" x2="34" y2="44" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/></svg>,
  headphones:  c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M14 34 Q14 18 32 18 Q50 18 50 34" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><rect x="8" y="32" width="12" height="18" rx="5" stroke={c} strokeWidth="2.5"/><rect x="44" y="32" width="12" height="18" rx="5" stroke={c} strokeWidth="2.5"/></svg>,
  tablet:      c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="12" y="8" width="40" height="48" rx="5" stroke={c} strokeWidth="2.5"/><rect x="17" y="14" width="30" height="34" rx="2" stroke={c} strokeWidth="2" fill={`${c}10`}/><circle cx="32" cy="53" r="2" fill={c} opacity=".4"/><path d="M24 28 L30 24 L30 32 Z" fill={c} opacity=".6"/></svg>,
  snackspinner:c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><circle cx="32" cy="32" r="22" stroke={c} strokeWidth="2.5"/><circle cx="32" cy="32" r="6" stroke={c} strokeWidth="2.5"/><line x1="32" y1="10" x2="32" y2="26" stroke={c} strokeWidth="2"/><line x1="32" y1="38" x2="32" y2="54" stroke={c} strokeWidth="2"/><line x1="10" y1="32" x2="26" y2="32" stroke={c} strokeWidth="2"/><line x1="38" y1="32" x2="54" y2="32" stroke={c} strokeWidth="2"/><circle cx="32" cy="10" r="3" fill={c}/><circle cx="32" cy="54" r="3" fill={c}/><circle cx="10" cy="32" r="3" fill={c}/><circle cx="54" cy="32" r="3" fill={c}/></svg>,
  driedfruit:  c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><ellipse cx="22" cy="36" rx="10" ry="13" stroke={c} strokeWidth="2.5"/><ellipse cx="42" cy="34" rx="9" ry="11" stroke={c} strokeWidth="2.5"/><path d="M22 23 Q24 16 28 14" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M42 23 Q44 17 40 14" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  crackers:    c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="10" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5"/><rect x="34" y="10" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5"/><rect x="10" y="34" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5"/><rect x="34" y="34" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5"/><circle cx="20" cy="20" r="2" fill={c} opacity=".35"/><circle cx="44" cy="20" r="2" fill={c} opacity=".35"/><circle cx="20" cy="44" r="2" fill={c} opacity=".35"/><circle cx="44" cy="44" r="2" fill={c} opacity=".35"/></svg>,
  bottle:      c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M24 14 L24 10 L40 10 L40 14 Q46 18 46 26 L46 50 Q46 54 42 54 L22 54 Q18 54 18 50 L18 26 Q18 18 24 14 Z" stroke={c} strokeWidth="2.5" fill="none"/><line x1="18" y1="36" x2="46" y2="36" stroke={c} strokeWidth="2" strokeDasharray="4 3" opacity=".4"/><line x1="26" y1="10" x2="38" y2="10" stroke={c} strokeWidth="3" strokeLinecap="round"/></svg>,
  wipes:       c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="16" width="44" height="36" rx="5" stroke={c} strokeWidth="2.5"/><path d="M10 28 L54 28" stroke={c} strokeWidth="2"/><path d="M26 16 L26 28" stroke={c} strokeWidth="2"/><path d="M26 20 Q32 14 38 20" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="18" y1="38" x2="46" y2="38" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/></svg>,
  neckpillow:  c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M16 32 Q16 14 32 14 Q48 14 48 32 Q48 50 32 50 Q16 50 16 32 Z" stroke={c} strokeWidth="2.5" fill="none"/><ellipse cx="32" cy="32" rx="8" ry="10" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><path d="M20 22 Q24 18 32 18" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/></svg>,
  toy:         c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><circle cx="32" cy="28" r="14" stroke={c} strokeWidth="2.5"/><circle cx="26" cy="24" r="3" fill={c} opacity=".7"/><circle cx="38" cy="24" r="3" fill={c} opacity=".7"/><path d="M26 34 Q32 38 38 34" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M20 14 Q16 8 22 8 Q28 8 24 14" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M44 14 Q48 8 42 8 Q36 8 40 14" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  blanket:     c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M10 14 Q10 10 14 10 L50 10 Q54 10 54 14 L54 42 Q54 46 50 50 L32 56 L14 50 Q10 46 10 42 Z" stroke={c} strokeWidth="2.5" fill="none"/><path d="M10 22 L54 22" stroke={c} strokeWidth="1.5" opacity=".25"/><path d="M10 30 L54 30" stroke={c} strokeWidth="1.5" opacity=".25"/><path d="M10 38 L54 38" stroke={c} strokeWidth="1.5" opacity=".25"/></svg>,
  tent:        c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M8 48 L32 12 L56 48 Z" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><path d="M22 48 L32 32 L42 48 Z" stroke={c} strokeWidth="2" fill={`${c}20`}/><line x1="32" y1="12" x2="32" y2="6" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="8" y1="48" x2="56" y2="48" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  sunscreen:   c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="20" y="20" width="24" height="36" rx="5" stroke={c} strokeWidth="2.5"/><rect x="24" y="13" width="16" height="9" rx="3" stroke={c} strokeWidth="2.5"/><line x1="26" y1="30" x2="38" y2="30" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/><line x1="26" y1="36" x2="38" y2="36" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/><path d="M32 8 L32 4 M40 10 L43 7 M44 18 L48 18" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".35"/></svg>,
  float:       c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><ellipse cx="32" cy="36" rx="22" ry="14" stroke={c} strokeWidth="2.5"/><ellipse cx="32" cy="36" rx="10" ry="6" stroke={c} strokeWidth="2.5"/><path d="M26 22 Q32 14 38 22" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="32" y1="13" x2="32" y2="8" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  mat:         c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="8" y="20" width="48" height="28" rx="3" stroke={c} strokeWidth="2.5"/><line x1="8" y1="28" x2="56" y2="28" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4"/><line x1="8" y1="36" x2="56" y2="36" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4"/><line x1="22" y1="20" x2="22" y2="48" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4"/><line x1="42" y1="20" x2="42" y2="48" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4"/></svg>,
  diaper:      c => <svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M10 20 Q10 16 14 16 L50 16 Q54 16 54 20 L54 44 Q54 48 50 48 L14 48 Q10 48 10 44 Z" stroke={c} strokeWidth="2.5"/><path d="M10 32 Q20 24 32 32 Q44 40 54 32" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M22 16 L18 10 Q18 8 22 8 L42 8 Q46 8 46 10 L42 16" stroke={c} strokeWidth="2"/><circle cx="16" cy="38" r="3" stroke={c} strokeWidth="2"/><circle cx="48" cy="38" r="3" stroke={c} strokeWidth="2"/></svg>,
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const KITS = [
  {
    id: "operativo", num: "01", title: "El operativo.", type: "flat",
    subtitle: "Del aeropuerto al Uber al hotel al restaurante. Y repetir.",
    painMoment: "El taxi no acepta la carriola.",
    scene: "El taxi no acepta la carriola. Y ese es solo el primero de los once traslados del viaje.",
    products: [
      { id:"m1", icon:"doona",    brand:"DOONA",     name:"Silla de auto + carriola",   opinion:"Tres segundos de silla de auto a carriola. La única manera de que llegar al taxi con un bebé no sea un proyecto de 8 minutos.", tag:"LA INVERSIÓN QUE SE PAGA SOLA", price:"$10,000–14,000 MXN", where:"Amazon MX · Liverpool", link:"#",                       hero:true  },
      { id:"m2", icon:"stroller", brand:"BABYZEN",   name:"YOYO2 — carriola de cabina", opinion:"Cabe en el compartimento superior del avión. No documentas, no esperas, no rezas.",                                              tag:"ENTRA EN CABINA. PUNTO.",       price:"$12,000–15,000 MXN", where:"Amazon MX",             link:"#",                       hero:false },
      { id:"m3", icon:"carrier",  brand:"ERGOBABY",  name:"Omni Breeze — portabebé",    opinion:"Para cuando la carriola no entra o no cabe. Manos libres sin que tu espalda te lo cobre después.",                               tag:"MANOS LIBRES EN AEROPUERTOS",  price:"$2,800–3,500 MXN",   where:"Amazon MX",             link:"#",                       hero:false },
      { id:"m4", icon:"suitcase", brand:"SAMSONITE", name:"Maleta de cabina",            opinion:"La maleta que documentas no está cuando la necesitas. Esta va siempre en cabina, siempre a la mano.",                            tag:"TODO LO ESENCIAL, CONTIGO",    price:"Ver precio",          where:"Amazon MX",             link:"https://amzn.to/4bxXhrh", hero:false },
      { id:"m5", icon:"airtag",   brand:"APPLE",     name:"AirTag 4-pack",               opinion:"Una por maleta, una por carriola. Cuando el vuelo conecte y el equipaje no, sabrás exactamente dónde están.",                    tag:"RASTREADOR DE PAZ MENTAL",     price:"$1,400–1,600 MXN",   where:"Amazon MX",             link:"#",                       hero:false },
    ],
  },
  {
    id: "mochila", num: "02", title: "La mochila.", type: "systems",
    subtitle: "Para vuelos largos y traslados que no terminan.",
    painMoment: "La mochila de los niños. Sin sistema, sin paz.",
    scene: "La mochila del niño puede ser la mejor herramienta del viaje o el mayor generador de caos. La diferencia no está en los productos — está en el sistema.",
    omit: "Tablets sin contenido descargado previamente — en el avión no hay wifi confiable. Snacks con azúcar para el despegue — el pico y la caída se sienten en 60cm².",
    systems: [
      {
        id:"contenedor", label:"EL CONTENEDOR", note:"El niño carga su mochila. Tú no cargas todo.",
        products: [
          { id:"bp1", icon:"backpack", brand:"SKIP HOP",    name:"Mini mochila infantil",          opinion:"Ligera, fácil de abrir sola, con divisiones. El niño se siente independiente y tú no cargas todo.",   tag:"EL NIÑO CARGA SU PROPIA MOCHILA", price:"Ver precio", where:"Amazon MX",             link:"#",                        hero:true  },
          { id:"bp2", icon:"pouches",  brand:"ORGANIZADOR", name:"Packing pouches — 3 categorías", opinion:"Actividades · snacks · higiene en tres bolsitas. Cada cosa en su lugar antes de subir al avión.",      tag:"EL SISTEMA QUE EVITA EL CAOS",    price:"Ver precio", where:"Amazon MX",             link:"https://amzn.to/3PP26VW",  hero:false },
        ],
      },
      {
        id:"programa", label:"EL PROGRAMA", note:"Clave: rotación cada 20–30 min. El mismo juego dos horas seguidas no funciona.",
        subSections: [
          { label:"A — INICIO DEL VUELO · actividades tranquilas", products: [
            { id:"bp3", icon:"journal",  brand:"MELISSA & DOUG",  name:"Travel journal + stickers",      opinion:"Primera media hora: alta concentración, cero ruido, cero piezas sueltas.",                                   tag:"PRIMER BLOQUE — 0 A 30 MIN",  price:"Ver precio", where:"Amazon MX",     link:"https://amzn.to/4lE5vCU",  hero:false },
            { id:"bp4", icon:"ghost",    brand:"FANTASY FLIGHT",  name:"Mysterium kids — juego fantasma", opinion:"Juego de mesa compacto para 2+ jugadores. Funciona en la mesita y dura más que cualquier libro de actividades.", tag:"EL QUE DURA MÁS",             price:"Ver precio", where:"Amazon MX",     link:"https://amzn.to/3NEblrj",  hero:true  },
            { id:"bp5", icon:"magnetic", brand:"PICASSO TILES",   name:"Magnetic tiles — 40 piezas",     opinion:"Sin piezas sueltas, caja metálica. 45 minutos de concentración sin pantalla, garantizado.",               tag:"45 MIN. SIN PANTALLA",        price:"Ver precio", where:"MercadoLibre",  link:"https://www.mercadolibre.com.mx/picasso-tiles-pn01-nano-tiles-40-piezas-caja-metalica/up/MLMU3621311517", hero:false },
            { id:"bp6", icon:"crayons",  brand:"CRAYOLA",         name:"Cuaderno + crayones lavables",   opinion:"El clásico que siempre funciona. Los lavables son obligatorios — el asiento de atrás te lo agradece.",     tag:"EL CLÁSICO QUE NO FALLA",     price:"Ver precio", where:"Amazon MX",     link:"#",                        hero:false },
          ]},
          { label:"B — MITAD DEL VUELO · actividades interactivas", products: [
            { id:"bp7", icon:"cards",    brand:"CREATIVITY HUB", name:"Tarjetas — preguntas y memoria", opinion:"Para cuando las actividades tranquilas terminaron. Activa sin ocupar espacio.",                              tag:"ACTIVA SIN ESPACIO",          price:"Ver precio", where:"Amazon MX",     link:"https://amzn.to/41irNkd",  hero:false },
            { id:"bp8", icon:"magnetic", brand:"SMILY PLAY",     name:"Pizarrón magnético portátil",   opinion:"Dibujo libre, se borra, no hace ruido, no tiene piezas. Muy subestimado.",                                   tag:"DRAW. ERASE. REPEAT.",        price:"Ver precio", where:"Amazon MX",     link:"https://amzn.to/4uIzdLg",  hero:false },
          ]},
          { label:"C — CUANDO TODO FALLA · backup digital", products: [
            { id:"bp9",  icon:"headphones", brand:"BUDDYPHONES",  name:"Play+ — audífonos con limitador", opinion:"Límite de volumen real. El plan C que siempre llega en algún punto del vuelo.",                            tag:"EL PLAN C QUE SIEMPRE LLEGA", price:"$600–900 MXN",   where:"Amazon MX", link:"#",                        hero:true  },
            { id:"bp10", icon:"tablet",     brand:"AMAZON FIRE",  name:"Fire HD Kids — tablet",          opinion:"Para el tramo final cuando todo lo demás falló. Solo offline, solo al final.",                              tag:"SOLO OFFLINE. SOLO AL FINAL.",price:"Ver precio",      where:"Amazon MX", link:"https://amzn.to/4rNZcOC",  hero:false },
          ]},
        ],
      },
      {
        id:"despensa", label:"LA DESPENSA", note:"Donde muchas mamás improvisan. No improvises.",
        products: [
          { id:"bp11", icon:"snackspinner", brand:"SISTEMA",    name:"Snack spinner — bento box",      opinion:"Compartimentos pequeños, fácil de abrir sola, no se derrama. El niño saca su snack sin ayuda.",          tag:"EL SISTEMA DE SNACKS",        price:"Ver precio",  where:"Amazon MX",             link:"#",                        hero:true  },
          { id:"bp12", icon:"driedfruit",   brand:"VARIADOS",   name:"Fruta deshidratada — 3 tipos",   opinion:"Sin azúcar añadida, sin derrame, sin olor. Rotar los tres tipos evita que se aburra.",                     tag:"SIN PICO DE AZÚCAR",          price:"Ver precio",  where:"Amazon MX",             link:"https://amzn.to/3NxexVO",  hero:false },
          { id:"bp13", icon:"crackers",     brand:"GERBER",     name:"Galletas + crackers",             opinion:"Textura que entretiene la mano. Sin sal, sin relleno — aptos para los dos.",                               tag:"TEXTURA QUE ENTRETIENE",      price:"Ver precio",  where:"Amazon MX",             link:"#",                        hero:false },
          { id:"bp14", icon:"bottle",       brand:"CONTIGO",    name:"Botella anti-derrame reusable",   opinion:"El vaso del avión siempre se tira. La botella tuya, nunca.",                                                tag:"EL VASO DEL AVIÓN SE TIRA",   price:"Ver precio",  where:"Amazon MX",             link:"#",                        hero:false },
          { id:"bp15", icon:"wipes",        brand:"PAMPERS",    name:"Toallitas + bolsas zip extras",   opinion:"Las toallitas son obvias. Las bolsas zip son el comodín que nadie menciona — para todo lo demás.",          tag:"EL COMODÍN DEL VUELO",        price:"Ver precio",  where:"Amazon MX",             link:"https://amzn.to/3PP26VW",  hero:false },
        ],
      },
      {
        id:"ritual", label:"EL RITUAL", note:"Lo que reduce el estrés emocional. No es secundario.",
        products: [
          { id:"bp16", icon:"toy",        brand:"EL FAVORITO",   name:"Objeto favorito del niño",    opinion:"No sustituible, no opcional. Va en la mochila de mano, nunca en la documentada.",                              tag:"IRREMPLAZABLE. SIN EXCEPCIONES.", price:"—",          where:"Ya lo tienes",  link:"#", hero:false },
          { id:"bp17", icon:"neckpillow", brand:"TRTL / BCOZZY", name:"Neck pillow — kids",          opinion:"Para vuelos de más de 2 horas. El que se queda dormido mal despertará mal el resto del día.",                  tag:"DUERME BIEN. LLEGA BIEN.",        price:"Ver precio", where:"Amazon MX",     link:"#", hero:false },
          { id:"bp18", icon:"blanket",    brand:"LIGERA",        name:"Suéter ligero o mantita",     opinion:"El avión siempre está frío cuando el niño se queda dormido. Siempre.",                                         tag:"EL AVIÓN SIEMPRE ESTÁ FRÍO.",     price:"—",          where:"Ya lo tienes",  link:"#", hero:false },
        ],
      },
    ],
  },
  {
    id: "quedarse", num: "03", title: "Quedarse.", type: "flat",
    subtitle: "Lo que los hoteles no te dan. Y no son más toallas.",
    painMoment: "40 minutos en la playa. Demasiado sol.",
    scene: "El hotel tiene toallas, camastros, y un niñero que trae agua. Lo que no tiene es sombra de verdad para un bebé de 10 meses.",
    products: [
      { id:"p1", icon:"tent",       brand:"MONOBEACH",  name:"Carpa pop-up UPF 50+",           opinion:"La diferencia entre 40 minutos en la playa y 3 horas. Abre sola, es donde el bebé duerme la siesta mientras Isa sigue en la arena.",   tag:"LA QUE ALARGA EL DÍA",    price:"$900–1,300 MXN",  where:"Amazon MX",             link:"#",  hero:true  },
      { id:"p2", icon:"sunscreen",  brand:"BABYGANICS", name:"Mineral SPF 50 — bebé",          opinion:"Mineral puro, no arde en los ojos, no huele raro. La diferencia importa más en bebés de menos de 12 meses.",                         tag:"MINERAL. SOLO MINERAL.",  price:"$400–600 MXN",    where:"Amazon MX",             link:"#",  hero:false },
      { id:"p3", icon:"float",      brand:"SWIMWAYS",   name:"Baby Spring Float + techito",    opinion:"Techito de sol incorporado, asiento ergonómico. El bebé en el agua y tú con las manos libres.",                                       tag:"SOMBRA EN EL AGUA",       price:"$450–650 MXN",    where:"Amazon MX",             link:"#",  hero:false },
      { id:"p4", icon:"mat",        brand:"CGEAR",      name:"Sandless Beach Mat",             opinion:"La arena no se queda arriba — se va para abajo. Una vez que lo usas, la toalla normal se vuelve obsoleta.",                           tag:"SIN ARENA ARRIBA",        price:"$700–1,200 MXN",  where:"Amazon MX",             link:"#",  hero:false },
      { id:"p5", icon:"diaper",     brand:"HUGGIES",    name:"Little Swimmers",                opinion:"La tiendita del resort los cobra el triple. Lleva los tuyos — una caja alcanza para el viaje.",                                       tag:"LOS QUE NO PUEDEN FALTAR",price:"$200–280 MXN",    where:"Amazon MX · Soriana",   link:"#",  hero:false },
    ],
  },
];

// ─── ICON ZONE (shared) ───────────────────────────────────────────────────────
const IconZone = ({ product, height = 72 }) => (
  <div style={{
    width:"100%", height, background: SAND,
    display:"flex", alignItems:"center", justifyContent:"center",
    position:"relative", overflow:"hidden", flexShrink: 0,
    transition:"background .2s",
  }}>
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.3 }}>
      <defs><pattern id={`d${product.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="8" r=".6" fill={`${PINE}30`}/>
      </pattern></defs>
      <rect width="100%" height="100%" fill={`url(#d${product.id})`}/>
    </svg>
    <div style={{ position:"relative", opacity:.78 }}>{ic[product.icon] && ic[product.icon](PINE)}</div>
  </div>
);

// ─── STANDARD PRODUCT CARD ────────────────────────────────────────────────────
const Card = ({ product }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: OW, border: `1px solid ${hov ? PINE : BORDER}`,
      display:"flex", flexDirection:"column", transition:"border-color .15s", position:"relative",
    }}>
      <IconZone product={product} height={72} />
      <div style={{ padding:"18px 18px 16px", display:"flex", flexDirection:"column", flex:1 }}>
        <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:700, letterSpacing:".2em", color:SAGE, marginBottom:4 }}>{product.brand}</div>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:700, color:PINE, lineHeight:1.2, marginBottom:5 }}>{product.name}</div>
        <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:600, letterSpacing:".1em", color:MUTED, marginBottom:12 }}>— {product.tag}</div>
        <div style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontSize:12, color:"#5A5754", lineHeight:1.7, flex:1, marginBottom:14 }}>"{product.opinion}"</div>
        <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:13, fontWeight:700, color:PINE }}>{product.price}</div>
            <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, color:MUTED, marginTop:2 }}>{product.where}</div>
          </div>
          <a href={product.link} target="_blank" rel="noopener noreferrer" style={{
            background: hov ? PINE : "transparent", color: hov ? SAND : PINE,
            border:`1px solid ${PINE}`, fontFamily:"'Manrope',sans-serif",
            fontSize:8, fontWeight:700, letterSpacing:".1em",
            padding:"7px 12px", textDecoration:"none", transition:"all .14s",
          }}>VER →</a>
        </div>
      </div>
    </div>
  );
};

// ─── HERO CARD (horizontal, full-width) ───────────────────────────────────────
const HeroCard = ({ product }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      display:"flex", border:`1px solid ${hov ? PINE : PINE}`,
      background: OW, marginBottom:1, transition:"border-color .15s",
    }}>
      {/* Icon zone — left column */}
      <div style={{
        width:200, flexShrink:0, background: hov ? `${PINE}08` : SAND,
        display:"flex", alignItems:"center", justifyContent:"center",
        position:"relative", overflow:"hidden", transition:"background .2s",
      }}>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.3 }}>
          <defs><pattern id={`h${product.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r=".6" fill={`${PINE}30`}/>
          </pattern></defs>
          <rect width="100%" height="100%" fill={`url(#h${product.id})`}/>
        </svg>
        <div style={{ position:"relative" }}>{ic[product.icon] && ic[product.icon](PINE)}</div>
      </div>

      {/* Content — right column */}
      <div style={{ flex:1, padding:"28px 32px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
          <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:700, letterSpacing:".2em", color:SAGE }}>{product.brand}</div>
          <div style={{ background:`${PINE}0E`, padding:"3px 10px" }}>
            <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:7.5, fontWeight:700, letterSpacing:".16em", color:PINE }}>DESTACADO</span>
          </div>
        </div>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, color:PINE, lineHeight:1.15, marginBottom:6 }}>{product.name}</div>
        <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:600, letterSpacing:".1em", color:MUTED, marginBottom:14 }}>— {product.tag}</div>
        <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontSize:14, color:"#5A5754", lineHeight:1.75, maxWidth:480, marginBottom:20 }}>"{product.opinion}"</p>
        <div style={{ display:"flex", alignItems:"center", gap:24 }}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:PINE }}>{product.price}</div>
            <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:9, color:MUTED, marginTop:2 }}>{product.where}</div>
          </div>
          <a href={product.link} target="_blank" rel="noopener noreferrer" style={{
            background: hov ? PINE : "transparent", color: hov ? SAND : PINE,
            border:`1px solid ${PINE}`, fontFamily:"'Manrope',sans-serif",
            fontSize:9, fontWeight:700, letterSpacing:".12em",
            padding:"10px 20px", textDecoration:"none", transition:"all .14s",
          }}>VER EN AMAZON →</a>
        </div>
      </div>
    </div>
  );
};

// ─── FLAT KIT (hero + 2×2) ────────────────────────────────────────────────────
const FlatKit = ({ kit }) => {
  const [hero, ...rest] = kit.products;
  return (
    <div>
      <HeroCard product={hero} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:BORDER }}>
        {rest.map(p => <Card key={p.id} product={p} />)}
      </div>
    </div>
  );
};

// ─── SYSTEM CONTENT ───────────────────────────────────────────────────────────
const SystemContent = ({ system }) => (
  <div>
    {system.note && (
      <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontSize:13, color:MUTED, marginBottom:20 }}>
        {system.note}
      </p>
    )}
    {/* Flat products */}
    {system.products && (
      <div style={{
        display:"grid",
        gridTemplateColumns:`repeat(${Math.min(system.products.length, 3)}, 1fr)`,
        gap:1, background:BORDER,
      }}>
        {system.products.map(p => <Card key={p.id} product={p} />)}
      </div>
    )}
    {/* Sub-sections */}
    {system.subSections && system.subSections.map(sub => (
      <div key={sub.label} style={{ marginBottom:28 }}>
        <div style={{
          fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:700,
          letterSpacing:".16em", color:MUTED,
          paddingBottom:10, marginBottom:16,
          borderBottom:`1px solid ${BORDER}`,
        }}>
          {sub.label}
        </div>
        <div style={{
          display:"grid",
          gridTemplateColumns:`repeat(${Math.min(sub.products.length, 3)}, 1fr)`,
          gap:1, background:BORDER,
        }}>
          {sub.products.map(p => <Card key={p.id} product={p} />)}
        </div>
      </div>
    ))}
  </div>
);

// ─── MOCHILA KIT (tabbed) ─────────────────────────────────────────────────────
const MochilaKit = ({ kit }) => {
  const [active, setActive] = useState(kit.systems[0].id);
  const sys = kit.systems.find(s => s.id === active);

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display:"flex", borderBottom:`1px solid ${BORDER}`,
        marginBottom:32, gap:0,
      }}>
        {kit.systems.map(s => {
          const isActive = s.id === active;
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding:"12px 24px", border:"none", background:"transparent", cursor:"pointer",
              fontFamily:"'Manrope',sans-serif", fontSize:9, fontWeight:700,
              letterSpacing:".16em", color: isActive ? PINE : MUTED,
              borderBottom: isActive ? `2px solid ${PINE}` : "2px solid transparent",
              marginBottom:-1, transition:"color .15s, border-color .15s",
              whiteSpace:"nowrap",
            }}>
              {s.label}
            </button>
          );
        })}
      </div>
      {/* Active system */}
      <SystemContent system={sys} />
    </div>
  );
};

// ─── PAIN STRIP (2 rows per cell) ─────────────────────────────────────────────
const PainStrip = () => (
  <div style={{ background:PINE, borderBottom:`1px solid ${BORDER}` }}>
    <div style={{
      maxWidth:1140, margin:"0 auto", padding:"0 40px",
      display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
    }}>
      {KITS.map((kit, i) => (
        <a key={kit.id} href={`#${kit.id}`} style={{
          padding:"36px 32px", display:"flex", flexDirection:"column",
          gap:14, textDecoration:"none",
          borderRight: i < 2 ? `1px solid ${SAND}15` : "none",
          transition:"background .18s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = `${SAND}07`}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            fontFamily:"'Fraunces',serif", fontStyle:"italic",
            fontSize:20, fontWeight:700, color:SAND, lineHeight:1.2,
          }}>
            "{kit.painMoment}"
          </div>
          <div style={{
            fontFamily:"'Manrope',sans-serif", fontSize:9, fontWeight:700,
            letterSpacing:".14em", color:`${SAND}55`,
            display:"flex", alignItems:"center", gap:8,
          }}>
            {kit.title.toUpperCase().replace(".","").replace(".","  ")} <span style={{ color:`${SAND}30` }}>→</span>
          </div>
        </a>
      ))}
    </div>
  </div>
);

// ─── KIT SECTION ──────────────────────────────────────────────────────────────
const KitSection = ({ kit, isLast }) => (
  <section id={kit.id} style={{ marginBottom: isLast ? 0 : 96, scrollMarginTop:80 }}>
    {/* Header */}
    <div style={{ marginBottom:32 }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
        <div style={{
          fontFamily:"'Fraunces',serif", fontStyle:"italic",
          fontSize:56, fontWeight:900, color:`${PINE}0D`, lineHeight:1, flexShrink:0,
        }}>
          {kit.num}
        </div>
        <div style={{ flex:1, height:1, background:BORDER }} />
        <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:700, letterSpacing:".2em", color:MUTED }}>
          KIT {kit.num}
        </div>
      </div>

      <h2 style={{
        fontFamily:"'Fraunces',serif", fontStyle:"italic",
        fontSize:40, fontWeight:700, color:PINE, lineHeight:1, letterSpacing:"-.02em", marginBottom:5,
      }}>
        {kit.title}
      </h2>
      <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:13, color:SAGE, marginBottom:20 }}>
        {kit.subtitle}
      </div>

      <p style={{
        fontFamily:"'Fraunces',serif", fontStyle:"italic",
        fontSize:14, color:"#7A7773", lineHeight:1.8,
        borderLeft:`2px solid ${BORDER}`, paddingLeft:18, maxWidth:600,
        marginBottom: kit.omit ? 16 : 0,
      }}>
        {kit.scene}
      </p>

      {kit.omit && (
        <div style={{ background:SAND, padding:"10px 16px", display:"flex", gap:10, alignItems:"flex-start", maxWidth:600, marginTop:0 }}>
          <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:700, letterSpacing:".14em", color:PINE, flexShrink:0, marginTop:1 }}>
            POR QUÉ NO INCLUIMOS:
          </span>
          <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:11, color:"#7A7773", lineHeight:1.6 }}>
            {kit.omit}
          </span>
        </div>
      )}
    </div>

    {/* Content */}
    {kit.type === "flat"    && <FlatKit    kit={kit} />}
    {kit.type === "systems" && <MochilaKit kit={kit} />}
  </section>
);

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ display:"flex", alignItems:"center", gap:16, margin:"80px 0" }}>
    <div style={{ height:1, flex:1, background:BORDER }} />
    <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:9, color:MUTED }}>✦</div>
    <div style={{ height:1, flex:1, background:BORDER }} />
  </div>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function SmartFinds() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ fontFamily:"'Manrope',sans-serif", background:OW, minHeight:"100vh", color:PINE }}>
      <style>{FONTS}{`
        * { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:${PINE}; color:${SAND}; }
        a { text-decoration:none; color:inherit; }
        p { margin:0; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(250,250,248,.96)", backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${BORDER}`,
      }}>
        <div style={{
          maxWidth:1140, margin:"0 auto", padding:"0 40px",
          height:58, display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <a href="/" style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontSize:18, fontWeight:700, color:PINE }}>
            lagomplan
          </a>
          <a href="/smart-finds" style={{ fontFamily:"'Manrope',sans-serif", fontSize:9, fontWeight:700, letterSpacing:".12em", color:SAGE, borderBottom:`1px solid ${SAGE}`, paddingBottom:1 }}>
            ← SMART FINDS
          </a>
          <div style={{ display:"flex", gap:28 }}>
            {["Guías","Hoteles","Planificador"].map(item => (
              <a key={item} href="#" style={{ fontFamily:"'Manrope',sans-serif", fontSize:13, color:MUTED }}>{item}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* MASTHEAD */}
      <header style={{ borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 40px" }}>

          {/* Section label row */}
          <div style={{ padding:"36px 0 0", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:9, fontWeight:700, letterSpacing:".24em", color:SAGE }}>
              SMART FINDS / FAMILIAS
            </div>
            <div style={{ flex:1, height:1, background:BORDER }} />
            <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:9, letterSpacing:".14em", color:MUTED }}>
              VOL. 01 · 2026
            </div>
          </div>

          {/* 5-3 split */}
          <div style={{ padding:"28px 0 0", display:"grid", gridTemplateColumns:"5fr 3fr", gap:72, alignItems:"end" }}>
            <div>
              <h1 style={{
                fontFamily:"'Fraunces',serif", fontSize:76, fontWeight:900,
                color:PINE, lineHeight:.88, letterSpacing:"-.03em", marginBottom:20,
              }}>
                Smart<br /><em>Finds.</em>
              </h1>
              <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:15, color:"#7A7773", lineHeight:1.65, maxWidth:420 }}>
                Tres kits curados para viajar con niños pequeños. Lo que sí llevar, por qué, y dónde conseguirlo.
              </p>
            </div>

            <div style={{ borderLeft:`2px solid ${PINE}`, paddingLeft:24, paddingBottom:6 }}>
              <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:700, letterSpacing:".2em", color:PINE, opacity:.35, marginBottom:12 }}>
                NOTA DE LA EDITORA
              </div>
              <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontSize:14, color:PINE, lineHeight:1.75, marginBottom:14 }}>
                "Viajar con un toddler y un bebé no es un viaje más difícil. Es una categoría distinta. Esta selección la construimos para eso."
              </p>
              <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:9, color:MUTED }}>
                ✱ Usamos enlaces de afiliados. Sin costo para ti.
              </div>
            </div>
          </div>

          {/* 2-metric strip */}
          <div style={{ display:"flex", borderTop:`1px solid ${BORDER}`, marginTop:32 }}>
            {[["03","kits curados"],["0","patrocinios pagados"]].map(([n, l], i) => (
              <div key={l} style={{
                padding:"14px 0", paddingLeft: i > 0 ? 32 : 0,
                borderRight: i === 0 ? `1px solid ${BORDER}` : "none",
                marginRight: i === 0 ? 32 : 0,
              }}>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:PINE }}>{n}</div>
                <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:9, color:MUTED, letterSpacing:".1em", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* PAIN STRIP */}
      <PainStrip />

      {/* KITS */}
      <main style={{ maxWidth:1140, margin:"0 auto", padding:"72px 40px 100px" }}>
        {KITS.map((kit, i) => (
          <div key={kit.id}>
            <KitSection kit={kit} isLast={i === KITS.length - 1} />
            {i < KITS.length - 1 && <Divider />}
          </div>
        ))}

        {/* PLANNER CTA */}
        <div style={{
          background:PINE, padding:"48px 52px", marginTop:96,
          display:"grid", gridTemplateColumns:"1fr auto", gap:48, alignItems:"center",
        }}>
          <div>
            <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:700, letterSpacing:".2em", color:SAGE, marginBottom:12 }}>
              ANTES DE EMPACAR
            </div>
            <h3 style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontSize:28, fontWeight:700, color:SAND, lineHeight:1.1, marginBottom:12 }}>
              ¿Ya tienes el itinerario?
            </h3>
            <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:13, color:`${SAND}75`, lineHeight:1.6, maxWidth:440 }}>
              El mejor kit de viaje no sirve de nada si no sabes adónde vas. Genera tu plan completo en 30 segundos.
            </p>
          </div>
          <a href="/planificador" style={{
            background:SAND, color:PINE, fontFamily:"'Manrope',sans-serif",
            fontSize:10, fontWeight:700, letterSpacing:".14em",
            padding:"16px 28px", whiteSpace:"nowrap",
          }}>
            PLANEA CON IA →
          </a>
        </div>

        {/* EMAIL */}
        <div style={{ borderTop:`1px solid ${BORDER}`, marginTop:72, paddingTop:56, display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:700, letterSpacing:".2em", color:SAGE, marginBottom:12 }}>
              EL ITINERARIO
            </div>
            <h3 style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontSize:26, fontWeight:700, color:PINE, lineHeight:1.2, marginBottom:10 }}>
              Nuevos kits y guías,<br />directo a tu correo.
            </h3>
            <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:13, color:MUTED, lineHeight:1.65 }}>
              Sin spam. Una vez por semana, desde la perspectiva de alguien que viaja con niños.
            </p>
          </div>
          <div>
            {!submitted ? (
              <>
                <div style={{ display:"flex" }}>
                  <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ flex:1, padding:"13px 16px", border:`1px solid ${BORDER}`, borderRight:"none", fontFamily:"'Manrope',sans-serif", fontSize:14, color:PINE, background:"#FDFCFA", outline:"none" }}
                  />
                  <button onClick={() => email && setSubmitted(true)} style={{
                    background:PINE, color:SAND, border:"none", cursor:"pointer",
                    fontFamily:"'Manrope',sans-serif", fontSize:9, fontWeight:700, letterSpacing:".12em",
                    padding:"13px 22px",
                  }}>
                    SUSCRIBIRME
                  </button>
                </div>
                <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:9, color:MUTED, marginTop:8 }}>
                  Al suscribirte aceptas la política de privacidad.
                </div>
              </>
            ) : (
              <div style={{ padding:"22px", background:SAND, borderLeft:`2px solid ${PINE}` }}>
                <div style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontSize:17, fontWeight:700, color:PINE, marginBottom:5 }}>Ya estás en la lista.</div>
                <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:12, color:MUTED }}>El próximo jueves, en tu correo.</div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop:`1px solid ${BORDER}`, background:PINE, padding:"24px 40px" }}>
        <div style={{ maxWidth:1140, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontSize:15, fontWeight:700, color:SAND }}>lagomplan</div>
          <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, color:`${SAND}35`, letterSpacing:".14em" }}>
            SMART FINDS · FAMILIAS · VOL. 01 · 2026
          </div>
          <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:8, color:`${SAND}35`, letterSpacing:".12em" }}>
            © 2026 LAGOMPLAN
          </div>
        </div>
      </footer>
    </div>
  );
}
