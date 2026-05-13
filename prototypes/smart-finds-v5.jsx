import { useState } from "react";

const PINE="#0F3A33",SAGE="#6B8F86",SAND="#EDE7E1",OW="#FAFAF8",MUTED="#9A9690",BORDER="#DDD8D1";
const FONTS=`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Manrope:wght@400;500;600;700&display=swap');`;

const PERSONA_COLORS={familias:{bg:"#E1F5EE",text:"#085041"},parejas:{bg:"#EEEDFE",text:"#26215C"},fan:{bg:"#FAEEDA",text:"#412402"}};
const PERSONA_LABELS={familias:"Familias",parejas:"Parejas",fan:"Fan"};

const ic={
  doona:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="20" width="36" height="20" rx="10" stroke={c} strokeWidth="2.5"/><rect x="20" y="12" width="16" height="10" rx="4" stroke={c} strokeWidth="2.5"/><circle cx="18" cy="42" r="5" stroke={c} strokeWidth="2.5"/><circle cx="46" cy="42" r="5" stroke={c} strokeWidth="2.5"/><line x1="46" y1="20" x2="52" y2="12" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  stroller:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M14 14 L14 36 Q14 44 22 44 L44 44" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><circle cx="22" cy="50" r="5" stroke={c} strokeWidth="2.5"/><circle cx="44" cy="50" r="5" stroke={c} strokeWidth="2.5"/><path d="M14 22 L44 22 L44 36 Q44 44 36 44" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="8" y1="14" x2="20" y2="14" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  carrier:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><circle cx="32" cy="14" r="7" stroke={c} strokeWidth="2.5"/><path d="M20 28 Q20 22 32 22 Q44 22 44 28 L44 48 L20 48 Z" stroke={c} strokeWidth="2.5" fill="none"/><circle cx="32" cy="34" r="6" stroke={c} strokeWidth="2"/><line x1="20" y1="36" x2="8" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="44" y1="36" x2="56" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  suitcase:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="20" width="44" height="34" rx="3" stroke={c} strokeWidth="2.5"/><rect x="22" y="13" width="20" height="9" rx="3" stroke={c} strokeWidth="2.5"/><line x1="10" y1="34" x2="54" y2="34" stroke={c} strokeWidth="2" strokeDasharray="4 3"/><circle cx="20" cy="56" r="3" stroke={c} strokeWidth="2"/><circle cx="44" cy="56" r="3" stroke={c} strokeWidth="2"/></svg>,
  airtag:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><circle cx="32" cy="32" r="14" stroke={c} strokeWidth="2.5"/><circle cx="32" cy="32" r="5" fill={c}/><path d="M18 32 Q18 18 32 18" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/><path d="M46 32 Q46 46 32 46" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/><circle cx="32" cy="14" r="3" stroke={c} strokeWidth="2"/></svg>,
  backpack:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M20 14 Q20 8 32 8 Q44 8 44 14 L44 52 Q44 56 40 56 L24 56 Q20 56 20 52 Z" stroke={c} strokeWidth="2.5" fill="none"/><path d="M26 8 Q26 4 32 4 Q38 4 38 8" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="20" y1="30" x2="44" y2="30" stroke={c} strokeWidth="2"/><rect x="26" y="34" width="12" height="10" rx="2" stroke={c} strokeWidth="2"/><path d="M14 16 Q10 16 10 20 L10 44 Q10 48 14 48 L20 48" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M50 16 Q54 16 54 20 L54 44 Q54 48 50 48 L44 48" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>,
  pouches:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="8" y="20" width="28" height="36" rx="3" stroke={c} strokeWidth="2.5"/><line x1="8" y1="28" x2="36" y2="28" stroke={c} strokeWidth="2"/><line x1="16" y1="24" x2="28" y2="24" stroke={c} strokeWidth="3" strokeLinecap="round"/><rect x="28" y="10" width="28" height="36" rx="3" stroke={c} strokeWidth="2" opacity=".5"/><line x1="28" y1="18" x2="56" y2="18" stroke={c} strokeWidth="2" opacity=".5"/><line x1="36" y1="14" x2="48" y2="14" stroke={c} strokeWidth="3" strokeLinecap="round" opacity=".5"/></svg>,
  journal:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="14" y="8" width="36" height="48" rx="3" stroke={c} strokeWidth="2.5"/><line x1="22" y1="20" x2="42" y2="20" stroke={c} strokeWidth="2" strokeLinecap="round"/><line x1="22" y1="28" x2="42" y2="28" stroke={c} strokeWidth="2" strokeLinecap="round"/><line x1="22" y1="36" x2="34" y2="36" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="8" y="8" width="6" height="48" rx="3" fill={`${c}20`} stroke={c} strokeWidth="1.5"/></svg>,
  ghost:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M16 28 Q16 14 32 14 Q48 14 48 28 L48 52 L42 46 L36 52 L30 46 L24 52 L18 46 L16 52 Z" stroke={c} strokeWidth="2.5" fill="none"/><circle cx="26" cy="30" r="3.5" fill={c}/><circle cx="38" cy="30" r="3.5" fill={c}/><path d="M26 38 Q32 42 38 38" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/></svg>,
  magnetic:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="10" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><rect x="36" y="10" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><rect x="10" y="36" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><rect x="36" y="36" width="18" height="18" rx="2" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><circle cx="32" cy="32" r="4" fill={c}/><line x1="28" y1="32" x2="24" y2="32" stroke={c} strokeWidth="2.5"/><line x1="36" y1="32" x2="40" y2="32" stroke={c} strokeWidth="2.5"/><line x1="32" y1="28" x2="32" y2="24" stroke={c} strokeWidth="2.5"/><line x1="32" y1="36" x2="32" y2="40" stroke={c} strokeWidth="2.5"/></svg>,
  crayons:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M24 12 L28 8 L36 8 L40 12 L40 48 L24 48 Z" stroke={c} strokeWidth="2.5" fill="none"/><line x1="24" y1="18" x2="40" y2="18" stroke={c} strokeWidth="2"/><path d="M24 48 L28 56 L32 52 L36 56 L40 48" stroke={c} strokeWidth="2.5" strokeLinejoin="round" fill="none"/></svg>,
  cards:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="8" y="14" width="34" height="44" rx="3" stroke={c} strokeWidth="2.5" fill="none"/><rect x="22" y="6" width="34" height="44" rx="3" stroke={c} strokeWidth="2" opacity=".4" fill="none"/><circle cx="25" cy="30" r="7" stroke={c} strokeWidth="2"/><line x1="14" y1="44" x2="34" y2="44" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/></svg>,
  headphones:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M14 34 Q14 18 32 18 Q50 18 50 34" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><rect x="8" y="32" width="12" height="18" rx="5" stroke={c} strokeWidth="2.5"/><rect x="44" y="32" width="12" height="18" rx="5" stroke={c} strokeWidth="2.5"/></svg>,
  tablet:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="12" y="8" width="40" height="48" rx="5" stroke={c} strokeWidth="2.5"/><rect x="17" y="14" width="30" height="34" rx="2" stroke={c} strokeWidth="2" fill={`${c}10`}/><circle cx="32" cy="53" r="2" fill={c} opacity=".4"/><path d="M24 28 L30 24 L30 32 Z" fill={c} opacity=".6"/></svg>,
  snackspinner:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><circle cx="32" cy="32" r="22" stroke={c} strokeWidth="2.5"/><circle cx="32" cy="32" r="6" stroke={c} strokeWidth="2.5"/><line x1="32" y1="10" x2="32" y2="26" stroke={c} strokeWidth="2"/><line x1="32" y1="38" x2="32" y2="54" stroke={c} strokeWidth="2"/><line x1="10" y1="32" x2="26" y2="32" stroke={c} strokeWidth="2"/><line x1="38" y1="32" x2="54" y2="32" stroke={c} strokeWidth="2"/><circle cx="32" cy="10" r="3" fill={c}/><circle cx="32" cy="54" r="3" fill={c}/><circle cx="10" cy="32" r="3" fill={c}/><circle cx="54" cy="32" r="3" fill={c}/></svg>,
  driedfruit:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><ellipse cx="22" cy="36" rx="10" ry="13" stroke={c} strokeWidth="2.5"/><ellipse cx="42" cy="34" rx="9" ry="11" stroke={c} strokeWidth="2.5"/><path d="M22 23 Q24 16 28 14" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M42 23 Q44 17 40 14" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  crackers:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="10" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5"/><rect x="34" y="10" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5"/><rect x="10" y="34" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5"/><rect x="34" y="34" width="20" height="20" rx="2" stroke={c} strokeWidth="2.5"/><circle cx="20" cy="20" r="2" fill={c} opacity=".35"/><circle cx="44" cy="20" r="2" fill={c} opacity=".35"/><circle cx="20" cy="44" r="2" fill={c} opacity=".35"/><circle cx="44" cy="44" r="2" fill={c} opacity=".35"/></svg>,
  bottle:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M24 14 L24 10 L40 10 L40 14 Q46 18 46 26 L46 50 Q46 54 42 54 L22 54 Q18 54 18 50 L18 26 Q18 18 24 14 Z" stroke={c} strokeWidth="2.5" fill="none"/><line x1="18" y1="36" x2="46" y2="36" stroke={c} strokeWidth="2" strokeDasharray="4 3" opacity=".4"/><line x1="26" y1="10" x2="38" y2="10" stroke={c} strokeWidth="3" strokeLinecap="round"/></svg>,
  wipes:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="16" width="44" height="36" rx="5" stroke={c} strokeWidth="2.5"/><path d="M10 28 L54 28" stroke={c} strokeWidth="2"/><path d="M26 16 L26 28" stroke={c} strokeWidth="2"/><path d="M26 20 Q32 14 38 20" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="18" y1="38" x2="46" y2="38" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/></svg>,
  neckpillow:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M16 32 Q16 14 32 14 Q48 14 48 32 Q48 50 32 50 Q16 50 16 32 Z" stroke={c} strokeWidth="2.5" fill="none"/><ellipse cx="32" cy="32" rx="8" ry="10" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><path d="M20 22 Q24 18 32 18" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/></svg>,
  toy:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><circle cx="32" cy="28" r="14" stroke={c} strokeWidth="2.5"/><circle cx="26" cy="24" r="3" fill={c} opacity=".7"/><circle cx="38" cy="24" r="3" fill={c} opacity=".7"/><path d="M26 34 Q32 38 38 34" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M20 14 Q16 8 22 8 Q28 8 24 14" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M44 14 Q48 8 42 8 Q36 8 40 14" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  blanket:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M10 14 Q10 10 14 10 L50 10 Q54 10 54 14 L54 42 Q54 46 50 50 L32 56 L14 50 Q10 46 10 42 Z" stroke={c} strokeWidth="2.5" fill="none"/><path d="M10 22 L54 22" stroke={c} strokeWidth="1.5" opacity=".25"/><path d="M10 30 L54 30" stroke={c} strokeWidth="1.5" opacity=".25"/></svg>,
  tent:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M8 48 L32 12 L56 48 Z" stroke={c} strokeWidth="2.5" fill={`${c}10`}/><path d="M22 48 L32 32 L42 48 Z" stroke={c} strokeWidth="2" fill={`${c}20`}/><line x1="32" y1="12" x2="32" y2="6" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="8" y1="48" x2="56" y2="48" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  sunscreen:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="20" y="20" width="24" height="36" rx="5" stroke={c} strokeWidth="2.5"/><rect x="24" y="13" width="16" height="9" rx="3" stroke={c} strokeWidth="2.5"/><line x1="26" y1="30" x2="38" y2="30" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/><line x1="26" y1="36" x2="38" y2="36" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/><path d="M32 8 L32 4 M40 10 L43 7 M44 18 L48 18" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".35"/></svg>,
  float:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><ellipse cx="32" cy="36" rx="22" ry="14" stroke={c} strokeWidth="2.5"/><ellipse cx="32" cy="36" rx="10" ry="6" stroke={c} strokeWidth="2.5"/><path d="M26 22 Q32 14 38 22" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="32" y1="13" x2="32" y2="8" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  mat:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="8" y="20" width="48" height="28" rx="3" stroke={c} strokeWidth="2.5"/><line x1="8" y1="28" x2="56" y2="28" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4"/><line x1="8" y1="36" x2="56" y2="36" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4"/><line x1="22" y1="20" x2="22" y2="48" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4"/><line x1="42" y1="20" x2="42" y2="48" stroke={c} strokeWidth="1.5" strokeDasharray="4 4" opacity=".4"/></svg>,
  diaper:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M10 20 Q10 16 14 16 L50 16 Q54 16 54 20 L54 44 Q54 48 50 48 L14 48 Q10 48 10 44 Z" stroke={c} strokeWidth="2.5"/><path d="M10 32 Q20 24 32 32 Q44 40 54 32" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none"/><circle cx="16" cy="38" r="3" stroke={c} strokeWidth="2"/><circle cx="48" cy="38" r="3" stroke={c} strokeWidth="2"/></svg>,
  // ─── NEW ICONS FOR ANDREA + ROBERTO ─────────────────────────────────────────
  speaker:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><circle cx="32" cy="32" r="18" stroke={c} strokeWidth="2.5"/><circle cx="32" cy="32" r="7" stroke={c} strokeWidth="2.5"/><circle cx="32" cy="32" r="2.5" fill={c}/><path d="M12 22 Q6 32 12 42" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/><path d="M52 22 Q58 32 52 42" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/></svg>,
  powerbank:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="22" width="44" height="22" rx="4" stroke={c} strokeWidth="2.5"/><rect x="54" y="28" width="4" height="10" rx="2" fill={c} opacity=".4"/><rect x="16" y="28" width="10" height="10" rx="2" stroke={c} strokeWidth="2"/><line x1="30" y1="33" x2="48" y2="33" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".4"/><line x1="26" y1="14" x2="26" y2="22" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="38" y1="14" x2="38" y2="22" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="20" y1="14" x2="44" y2="14" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  wallet:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="10" y="18" width="44" height="30" rx="3" stroke={c} strokeWidth="2.5"/><line x1="32" y1="18" x2="32" y2="48" stroke={c} strokeWidth="2"/><rect x="14" y="24" width="14" height="18" rx="2" stroke={c} strokeWidth="2" opacity=".5"/><line x1="36" y1="26" x2="50" y2="26" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/><line x1="36" y1="32" x2="50" y2="32" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/><line x1="36" y1="38" x2="44" y2="38" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/></svg>,
  poncho:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M32 10 L10 24 L16 24 L16 52 L48 52 L48 24 L54 24 Z" stroke={c} strokeWidth="2.5" fill="none"/><path d="M24 10 Q32 6 40 10" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><path d="M20 30 Q18 38 16 44" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity=".4" strokeDasharray="3 3"/><path d="M44 30 Q46 38 48 44" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity=".4" strokeDasharray="3 3"/></svg>,
  scale:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M24 8 Q24 4 32 4 Q40 4 40 8 L40 16 L24 16 Z" stroke={c} strokeWidth="2.5" fill="none"/><rect x="10" y="16" width="44" height="32" rx="4" stroke={c} strokeWidth="2.5"/><rect x="16" y="22" width="32" height="16" rx="2" stroke={c} strokeWidth="2" fill={`${c}10`}/><line x1="20" y1="30" x2="28" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><line x1="32" y1="30" x2="44" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  adapter:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="14" y="14" width="36" height="36" rx="5" stroke={c} strokeWidth="2.5"/><line x1="23" y1="14" x2="23" y2="8" stroke={c} strokeWidth="3" strokeLinecap="round"/><line x1="41" y1="14" x2="41" y2="8" stroke={c} strokeWidth="3" strokeLinecap="round"/><circle cx="32" cy="32" r="7" stroke={c} strokeWidth="2"/><line x1="32" y1="25" x2="32" y2="39" stroke={c} strokeWidth="2" opacity=".4"/><line x1="25" y1="32" x2="39" y2="32" stroke={c} strokeWidth="2" opacity=".4"/></svg>,
  esim:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="18" y="10" width="28" height="44" rx="4" stroke={c} strokeWidth="2.5"/><rect x="22" y="14" width="20" height="14" rx="2" stroke={c} strokeWidth="2" fill={`${c}10`}/><path d="M24 38 Q32 32 40 38" stroke={c} strokeWidth="2.5" strokeLinecap="round"/><path d="M20 44 Q32 36 44 44" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/><circle cx="32" cy="50" r="2.5" fill={c}/></svg>,
  crossbody:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><rect x="14" y="22" width="36" height="30" rx="4" stroke={c} strokeWidth="2.5"/><path d="M22 22 Q22 14 32 12 Q42 14 42 22" stroke={c} strokeWidth="2.5" fill="none"/><line x1="14" y1="36" x2="50" y2="36" stroke={c} strokeWidth="1.5" opacity=".4"/><rect x="26" y="40" width="12" height="8" rx="2" stroke={c} strokeWidth="2" opacity=".5"/><path d="M50 26 Q56 20 52 14" stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".5"/></svg>,
  insurance:c=><svg viewBox="0 0 64 64" fill="none" width={44} height={44}><path d="M32 8 L52 16 L52 36 Q52 50 32 58 Q12 50 12 36 L12 16 Z" stroke={c} strokeWidth="2.5" fill="none"/><path d="M22 32 L28 38 L42 26" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// ─── ALL 9 KITS ───────────────────────────────────────────────────────────────
const KITS_ALL=[
  // FAMILIAS
  {id:"sin-perder-a-nadie",num:"01",persona:"familias",title:"Sin perder a nadie.",subtitle:"Del aeropuerto al Uber al hotel al restaurante. Y repetir.",painMoment:"El taxi no acepta la carriola.",scene:"El taxi no acepta la carriola. Y ese es solo el primero de los once traslados del viaje.",type:"flat",
   products:[
    {id:"f1a",icon:"doona",hero:true,brand:"DOONA",name:"Silla de auto + carriola",tag:"LA INVERSIÓN QUE SE PAGA SOLA",opinion:"Tres segundos de silla de auto a carriola. La única manera de que llegar al taxi con un bebé no sea un proyecto de 8 minutos.",price:"$10,000–14,000 MXN",where:"Amazon MX · Liverpool",link:"#"},
    {id:"f1b",icon:"stroller",hero:false,brand:"BABYZEN",name:"YOYO2 — carriola de cabina",tag:"ENTRA EN CABINA. PUNTO.",opinion:"Cabe en el compartimento superior del avión. No documentas, no esperas, no rezas.",price:"$12,000–15,000 MXN",where:"Amazon MX",link:"#"},
    {id:"f1c",icon:"carrier",hero:false,brand:"ERGOBABY",name:"Omni Breeze — portabebé",tag:"MANOS LIBRES EN AEROPUERTOS",opinion:"Para cuando la carriola no entra o no cabe. Manos libres sin que tu espalda te lo cobre después.",price:"$2,800–3,500 MXN",where:"Amazon MX",link:"#"},
    {id:"f1d",icon:"suitcase",hero:false,brand:"SAMSONITE",name:"Maleta de cabina",tag:"TODO LO ESENCIAL, CONTIGO",opinion:"La maleta que documentas no está cuando la necesitas. Esta va siempre en cabina.",price:"Ver precio",where:"Amazon MX",link:"https://amzn.to/4bxXhrh"},
    {id:"f1e",icon:"airtag",hero:false,brand:"APPLE",name:"AirTag 4-pack",tag:"RASTREADOR DE PAZ MENTAL",opinion:"Una por maleta, una por carriola. Cuando el vuelo conecte y el equipaje no, sabrás exactamente dónde están.",price:"$1,400–1,600 MXN",where:"Amazon MX",link:"#"},
  ]},
  {id:"para-que-duerma",num:"02",persona:"familias",title:"Para que duerma.",subtitle:"Para vuelos largos y traslados que no terminan.",painMoment:"La mochila de los niños. Sin sistema, sin paz.",scene:"El avión tiene 3 horas de vuelo. El bebé no duerme si no llevas el sistema correcto. Esto es el sistema.",omit:"Tablets sin contenido descargado previamente — en el avión no hay wifi confiable. Snacks con azúcar para el despegue.",type:"systems",
   systems:[
    {id:"contenedor",label:"EL CONTENEDOR",note:"El niño carga su mochila. Tú no cargas todo.",products:[
      {id:"f2a",icon:"backpack",hero:true,brand:"SKIP HOP",name:"Mini mochila infantil",tag:"EL NIÑO CARGA SU PROPIA MOCHILA",opinion:"Ligera, fácil de abrir sola, con divisiones. El niño se siente independiente y tú no cargas todo.",price:"Ver precio",where:"Amazon MX",link:"#"},
      {id:"f2b",icon:"pouches",hero:false,brand:"ORGANIZADOR",name:"Packing pouches — 3 categorías",tag:"EL SISTEMA QUE EVITA EL CAOS",opinion:"Actividades · snacks · higiene en tres bolsitas. Cada cosa en su lugar antes de subir al avión.",price:"Ver precio",where:"Amazon MX",link:"https://amzn.to/3PP26VW"},
    ]},
    {id:"programa",label:"EL PROGRAMA",note:"Rotación cada 20–30 min. El mismo juego dos horas seguidas no funciona.",subSections:[
      {label:"A — INICIO DEL VUELO · tranquilas",products:[
        {id:"f2c",icon:"journal",hero:false,brand:"MELISSA & DOUG",name:"Travel journal + stickers",tag:"PRIMER BLOQUE — 0 A 30 MIN",opinion:"Primera media hora: alta concentración, cero ruido, cero piezas sueltas.",price:"Ver precio",where:"Amazon MX",link:"https://amzn.to/4lE5vCU"},
        {id:"f2d",icon:"ghost",hero:true,brand:"FANTASY FLIGHT",name:"Mysterium kids",tag:"EL QUE DURA MÁS",opinion:"Juego de mesa compacto para 2+ jugadores. Funciona en la mesita y dura más que cualquier libro de actividades.",price:"Ver precio",where:"Amazon MX",link:"https://amzn.to/3NEblrj"},
        {id:"f2e",icon:"magnetic",hero:false,brand:"PICASSO TILES",name:"Magnetic tiles — 40 piezas",tag:"45 MIN. SIN PANTALLA",opinion:"Sin piezas sueltas, caja metálica. 45 minutos de concentración sin pantalla.",price:"Ver precio",where:"MercadoLibre",link:"#"},
      ]},
      {label:"B — MITAD DEL VUELO · interactivas",products:[
        {id:"f2g",icon:"cards",hero:false,brand:"CREATIVITY HUB",name:"Tarjetas — preguntas y memoria",tag:"ACTIVA SIN ESPACIO",opinion:"Para cuando las actividades tranquilas terminaron. Activa sin ocupar espacio.",price:"Ver precio",where:"Amazon MX",link:"#"},
        {id:"f2h",icon:"magnetic",hero:false,brand:"SMILY PLAY",name:"Pizarrón magnético portátil",tag:"DRAW. ERASE. REPEAT.",opinion:"Dibujo libre, se borra, no hace ruido, no tiene piezas.",price:"Ver precio",where:"Amazon MX",link:"#"},
      ]},
      {label:"C — CUANDO TODO FALLA · backup digital",products:[
        {id:"f2i",icon:"headphones",hero:true,brand:"BUDDYPHONES",name:"Play+ — audífonos con limitador",tag:"EL PLAN C QUE SIEMPRE LLEGA",opinion:"Límite de volumen real. El plan C que siempre llega en algún punto del vuelo.",price:"$600–900 MXN",where:"Amazon MX",link:"#"},
        {id:"f2j",icon:"tablet",hero:false,brand:"AMAZON FIRE",name:"Fire HD Kids — tablet",tag:"SOLO OFFLINE. SOLO AL FINAL.",opinion:"Para el tramo final cuando todo lo demás falló. Solo offline, solo al final.",price:"Ver precio",where:"Amazon MX",link:"https://amzn.to/4rNZcOC"},
      ]},
    ]},
    {id:"despensa",label:"LA DESPENSA",note:"Donde muchas mamás improvisan. No improvises.",products:[
      {id:"f2k",icon:"snackspinner",hero:true,brand:"SISTEMA",name:"Snack spinner — bento box",tag:"EL SISTEMA DE SNACKS",opinion:"Fácil de abrir sola, no se derrama. El niño saca su snack sin ayuda.",price:"Ver precio",where:"Amazon MX",link:"#"},
      {id:"f2l",icon:"driedfruit",hero:false,brand:"VARIADOS",name:"Fruta deshidratada — 3 tipos",tag:"SIN PICO DE AZÚCAR",opinion:"Sin azúcar añadida, sin derrame, sin olor. Rotar los tres tipos evita que se aburra.",price:"Ver precio",where:"Amazon MX",link:"#"},
      {id:"f2m",icon:"bottle",hero:false,brand:"CONTIGO",name:"Botella anti-derrame reusable",tag:"EL VASO DEL AVIÓN SE TIRA",opinion:"El vaso del avión siempre se tira. La botella tuya, nunca.",price:"Ver precio",where:"Amazon MX",link:"#"},
    ]},
    {id:"ritual",label:"EL RITUAL",note:"Lo que reduce el estrés emocional. No es secundario.",products:[
      {id:"f2p",icon:"toy",hero:false,brand:"EL FAVORITO",name:"Objeto favorito del niño",tag:"IRREMPLAZABLE. SIN EXCEPCIONES.",opinion:"No sustituible, no opcional. Va en la mochila de mano, nunca en la documentada.",price:"—",where:"Ya lo tienes",link:"#"},
      {id:"f2q",icon:"neckpillow",hero:false,brand:"TRTL / BCOZZY",name:"Neck pillow — kids",tag:"DUERME BIEN. LLEGA BIEN.",opinion:"Para vuelos de más de 2 horas. El que se queda dormido mal despertará mal el resto del día.",price:"Ver precio",where:"Amazon MX",link:"#"},
      {id:"f2r",icon:"blanket",hero:false,brand:"LIGERA",name:"Suéter ligero o mantita",tag:"EL AVIÓN SIEMPRE ESTÁ FRÍO.",opinion:"El avión siempre está frío cuando el niño se queda dormido. Siempre.",price:"—",where:"Ya lo tienes",link:"#"},
    ]},
  ]},
  {id:"para-no-salir-corriendo",num:"03",persona:"familias",title:"Para no salir corriendo.",subtitle:"Lo que los hoteles no te dan. Y no son más toallas.",painMoment:"40 minutos en la playa. Demasiado sol.",scene:"Llegaron a la playa. Cuarenta minutos después, todos están de regreso en el cuarto. Con el kit correcto esas 40 minutos se convierten en 3 horas.",type:"flat",
   products:[
    {id:"f3a",icon:"tent",hero:true,brand:"MONOBEACH",name:"Carpa pop-up UPF 50+",tag:"LA QUE ALARGA EL DÍA",opinion:"La diferencia entre 40 minutos en la playa y 3 horas. Abre sola, protege del sol directo.",price:"$900–1,300 MXN",where:"Amazon MX",link:"#"},
    {id:"f3b",icon:"sunscreen",hero:false,brand:"BABYGANICS",name:"Mineral SPF 50 — bebé",tag:"MINERAL. SOLO MINERAL.",opinion:"Mineral puro, no arde en los ojos, no huele raro. La diferencia importa más en bebés de menos de 12 meses.",price:"$400–600 MXN",where:"Amazon MX",link:"#"},
    {id:"f3c",icon:"float",hero:false,brand:"SWIMWAYS",name:"Baby Spring Float + techito",tag:"SOMBRA EN EL AGUA",opinion:"Techito de sol incorporado. El bebé en el agua y tú con las manos libres.",price:"$450–650 MXN",where:"Amazon MX",link:"#"},
    {id:"f3d",icon:"mat",hero:false,brand:"CGEAR",name:"Sandless Beach Mat",tag:"SIN ARENA ARRIBA",opinion:"La arena no se queda arriba — se va para abajo. Una vez que lo usas, la toalla normal se vuelve obsoleta.",price:"$700–1,200 MXN",where:"Amazon MX",link:"#"},
    {id:"f3e",icon:"diaper",hero:false,brand:"HUGGIES",name:"Little Swimmers",tag:"LOS QUE NO PUEDEN FALTAR",opinion:"La tiendita del resort los cobra el triple. Lleva los tuyos.",price:"$200–280 MXN",where:"Amazon MX · Soriana",link:"#"},
  ]},
  // PAREJAS
  {id:"nunca-mas-en-el-carrusel",num:"04",persona:"parejas",title:"Nunca más en el carrusel.",subtitle:"Cuatro días. Una maleta de mano. Sin esperar en baggage claim.",painMoment:"Aterrizaste. Todo el mundo camina a la salida. Tú esperas.",scene:"Aterrizaste. Todo el mundo camina directo a la salida. Tú esperas la maleta. Esta es la última vez.",type:"flat",
   products:[
    {id:"a1a",icon:"suitcase",hero:true,brand:"CALPAK",name:"Carry-on expandible",tag:"LA QUE NO DOCUMENTAS",opinion:"El balance correcto entre tamaño y estilo. Expandible cuando necesitas el espacio extra, cabe en cabina cuando no.",price:"$3,500–5,000 MXN",where:"Amazon MX",link:"#"},
    {id:"a1b",icon:"pouches",hero:false,brand:"EAGLE CREEK",name:"Pack-It Cubes — set 3",tag:"EL SISTEMA, NO EL PRODUCTO",opinion:"Un cubo por categoría. Tres cubos y sabes exactamente qué va dónde. El carry-on only no existe sin esto.",price:"$700–1,200 MXN",where:"Amazon MX",link:"#"},
    {id:"a1c",icon:"wipes",hero:false,brand:"MATADOR",name:"FlatPak toiletry bag",tag:"FLAT. TSA. LISTO.",opinion:"La bolsa de toiletries que no ocupa el espacio que no tiene. Flat, TSA-ready.",price:"$500–900 MXN",where:"Amazon MX",link:"#"},
    {id:"a1d",icon:"scale",hero:false,brand:"ETEKCITY",name:"Báscula de equipaje digital",tag:"PÉSALA ANTES DE SALIR",opinion:"Pésala antes de salir. El aeropuerto no tiene compasión con los kilos de más.",price:"$200–350 MXN",where:"Amazon MX",link:"#"},
    {id:"a1e",icon:"pouches",hero:false,brand:"BELLROY",name:"Tech Kit — cable organizer",tag:"EL CAOS DE CABLES, RESUELTO",opinion:"Todo tu cable chaos en un flat pouch. Sin revolver el bolso cada vez que necesitas algo.",price:"$900–1,400 MXN",where:"Amazon MX",link:"#"},
  ]},
  {id:"para-que-el-lunes-no-duela-tanto",num:"05",persona:"parejas",title:"Para que el lunes no duela tanto.",subtitle:"72 horas. Sin desperdiciar ninguna.",painMoment:"3 días. Sin aprovecharlos, regresas como de la oficina.",scene:"Tienes del viernes por la noche al domingo a las 10pm. O lo aprovechas bien, o regresas sintiéndote como si hubieras desperdiciado el único puente del mes.",type:"flat",
   products:[
    {id:"a2a",icon:"speaker",hero:true,brand:"JBL",name:"Clip 5 — bocina portátil",tag:"EL VIAJE SUENA MEJOR",opinion:"La bocina que no pesa y cabe en cualquier bolso. Del balcón del hotel a la vista al mar, al restaurante de noche.",price:"$900–1,400 MXN",where:"Amazon MX",link:"#"},
    {id:"a2b",icon:"backpack",hero:false,brand:"BÉIS",name:"The Weekender bag",tag:"EL BAG DEL PUENTE",opinion:"Para 72 horas, ni la maleta grande ni solo el backpack. Cabe en cabina, se lleva al restaurante sin pena.",price:"$2,500–3,500 MXN",where:"BÉIS online",link:"#"},
    {id:"a2c",icon:"neckpillow",hero:false,brand:"SLIP",name:"Silk eye mask — 2-pack",tag:"DORMIRSE DE VERDAD",opinion:"Para la pareja que viaja para descansar de verdad. El cuarto del hotel nunca está completamente oscuro.",price:"$350–600 MXN",where:"Amazon MX",link:"#"},
    {id:"a2d",icon:"bottle",hero:false,brand:"WACACO",name:"Nanopresso — espresso portátil",tag:"PORQUE EL CAFÉ DEL HOTEL NO",opinion:"El café del hotel es un insulto. Este cabe en el bolsillo, hace un espresso real, y pesa 336 gramos.",price:"$1,200–1,800 MXN",where:"Amazon MX",link:"#"},
    {id:"a2e",icon:"bottle",hero:false,brand:"HYDROFLASK",name:"32oz — termo de viaje",tag:"SIN COMPRAR AGUA TODO EL DÍA",opinion:"Para el par que siempre está buscando agua en el resort. Llena el tuyo al salir del cuarto.",price:"$700–1,200 MXN",where:"Amazon MX",link:"#"},
  ]},
  {id:"sin-cargador-prestado",num:"06",persona:"parejas",title:"Sin cargador prestado.",subtitle:"Para el viajero que siempre encuentra la forma de quedarse sin batería.",painMoment:"El teléfono en 4%. El vuelo en 20 minutos.",scene:"El teléfono en 4%, el vuelo en 20 minutos, nadie alrededor con el cable correcto. Esto no vuelve a pasar.",type:"flat",
   products:[
    {id:"a3a",icon:"powerbank",hero:true,brand:"ANKER",name:"733 Power Bank GaNPrime 65W",tag:"UN CABLE PARA TODO",opinion:"Carga el laptop, el teléfono, y la tablet al mismo tiempo. Desde un solo cuerpo. El único hub de viaje que realmente funciona.",price:"$1,500–2,200 MXN",where:"Amazon MX",link:"#"},
    {id:"a3b",icon:"adapter",hero:false,brand:"ANKER",name:"727 GaN charger — 4 puertos",tag:"EL BLOCK QUE REEMPLAZA A TODOS",opinion:"El block de corriente que reemplaza a todos tus blocks. 4 puertos, 100W total, del tamaño de un borrador.",price:"$800–1,300 MXN",where:"Amazon MX",link:"#"},
    {id:"a3c",icon:"adapter",hero:false,brand:"EPICKA",name:"Universal travel adapter",tag:"150 DESTINOS, UN ADAPTADOR",opinion:"Para el viajero que va a más de un país. Compatible con más de 150 destinos, USB-C incluido.",price:"$350–600 MXN",where:"Amazon MX",link:"#"},
    {id:"a3d",icon:"esim",hero:false,brand:"AIRALO",name:"eSIM — sin roaming",tag:"SIN SORPRESAS EN LA FACTURA",opinion:"Sin SIM física. Sin roaming. Compras el plan antes de subir al avión y llegas con señal.",price:"desde $150 MXN",where:"airalo.com",link:"#"},
    {id:"a3e",icon:"pouches",hero:false,brand:"NOMAD",name:"Cable organizer pouch",tag:"SIN REVOLVER EL BOLSO",opinion:"Un pouch flat con separadores. Nada se enreda, todo se encuentra.",price:"$600–900 MXN",where:"Amazon MX",link:"#"},
  ]},
  // FAN
  {id:"en-las-gradas",num:"07",persona:"fan",title:"En las gradas, no en la pantalla.",subtitle:"Lo que llevas el día del partido. Nada más, nada menos.",painMoment:"La entrada costó lo que costó. Y la mochila no pasó la revisión.",scene:"La entrada costó lo que costó. Lo último que quieres es que algo falle en la puerta. Esto es exactamente lo que llevas al estadio.",type:"flat",
   products:[
    {id:"r1a",icon:"crossbody",hero:true,brand:"PATAGONIA",name:"Black Hole Crossbody 5L",tag:"EL QUE ENTRA AL ESTADIO",opinion:"La mayoría de los estadios FIFA tienen restricciones de bolso. Este entra. Cabe el teléfono, la billetera, los documentos, y la cámara.",price:"$1,200–1,800 MXN",where:"Amazon MX · patagonia.com",link:"#"},
    {id:"r1b",icon:"powerbank",hero:false,brand:"ANKER",name:"PowerCore 10000 slim",tag:"PARA LAS 6 HORAS DE PARTIDO",opinion:"Día de partido = 6-8 horas fuera de casa. Videos, fotos, stories, GPS, Uber. El teléfono no llega. Este sí.",price:"$550–800 MXN",where:"Amazon MX",link:"#"},
    {id:"r1c",icon:"headphones",hero:false,brand:"LOOP",name:"Experience earplugs",tag:"EL AMBIENTE, SIN EL DAÑO",opinion:"Un estadio lleno puede llegar a 110dB. Estos filtran el ruido dañino sin quitar la emoción.",price:"$800–1,200 MXN",where:"Amazon MX",link:"#"},
    {id:"r1d",icon:"poncho",hero:false,brand:"SOL",name:"Emergency rain poncho compacto",tag:"PARA LA LLUVIA QUE NO VES VENIR",opinion:"En el estadio no puedes salir cuando llueve. Este pesa 60 gramos y cabe en el bolsillo.",price:"$150–300 MXN",where:"Amazon MX",link:"#"},
    {id:"r1e",icon:"wallet",hero:false,brand:"BELLROY",name:"Travel Wallet — slim",tag:"TODO EN UN SOLO LUGAR",opinion:"La entrada, el pasaporte, el efectivo, la tarjeta — en uno. Para entrar al estadio con todo en orden.",price:"$900–1,400 MXN",where:"Amazon MX",link:"#"},
  ]},
  {id:"de-estadio-en-estadio",num:"08",persona:"fan",title:"De estadio en estadio.",subtitle:"Tres ciudades. Tres partidos. Una sola mochila.",painMoment:"Tres ciudades, diez días, y una maleta que no cabe en cabina.",scene:"Tres ciudades. Tres partidos. Diez días. Si documentas maleta en cada vuelo, pierdes dos horas de viaje en cada escala.",type:"flat",
   products:[
    {id:"r2a",icon:"backpack",hero:true,brand:"OSPREY",name:"Farpoint 40 — travel backpack",tag:"CERO MALETAS DOCUMENTADAS",opinion:"40 litros. Cabe en cabina. El backpack que cambia la manera de viajar multi-ciudad.",price:"$3,500–5,500 MXN",where:"Amazon MX · decathlon.mx",link:"#"},
    {id:"r2b",icon:"pouches",hero:false,brand:"SEA TO SUMMIT",name:"Scrubba Wash Bag",tag:"PARA LLEVAR MENOS Y LAVAR MÁS",opinion:"Un bolso que es también una lavadora manual. Lavas un jersey en 3 minutos en cualquier lavabo.",price:"$700–1,000 MXN",where:"Amazon MX",link:"#"},
    {id:"r2c",icon:"pouches",hero:false,brand:"EAGLE CREEK",name:"Compression packing cubes",tag:"EL TRUCO DEL ESPACIO",opinion:"Para comprimir los jerseys y la ropa de partido. Lo que normalmente llenaría dos bolsos cabe en uno.",price:"$600–1,000 MXN",where:"Amazon MX",link:"#"},
    {id:"r2d",icon:"scale",hero:false,brand:"ETEKCITY",name:"Báscula de equipaje digital",tag:"PÉSALA EN CADA CIUDAD",opinion:"Las aerolíneas en Estados Unidos cobran $35 USD por maleta de más. Sin sorpresas.",price:"$200–350 MXN",where:"Amazon MX",link:"#"},
    {id:"r2e",icon:"journal",hero:false,brand:"LAGOMPLAN",name:"Planificador IA — ruta WC",tag:"PLANIFICA LA RUTA PRIMERO",opinion:"Antes de reservar vuelos entre ciudades, planifica la ruta completa con el planificador.",price:"Gratis",where:"lagomplan.com",link:"/planificador"},
  ]},
  {id:"el-viaje-grande",num:"09",persona:"fan",title:"El viaje que le vas a contar a tus hijos.",subtitle:"Primera vez cruzando al otro lado para ver un partido.",painMoment:"Primera vez en el extranjero. Puede salir perfecto o puede salir como una película de terror logístico.",scene:"Es la primera vez que cruzas para ver un partido. Puede salir perfecto o puede salir como una película de terror logístico.",type:"flat",
   products:[
    {id:"r3a",icon:"wallet",hero:true,brand:"BELLROY",name:"Passport Sleeve — document wallet",tag:"TODO EN ORDEN, DESDE EL INICIO",opinion:"El pasaporte, la visa, el seguro impreso, los confirmations del hotel. Todo en una cosa.",price:"$700–1,000 MXN",where:"Amazon MX",link:"#"},
    {id:"r3b",icon:"insurance",hero:false,brand:"WORLD NOMADS",name:"Travel insurance",tag:"EL QUE NADIE CONTRATA (Y TODOS NECESITAN)",opinion:"El que más se arrepiente de no haberlo contratado es el que tuvo un problema. Para el viaje grande, no es opcional.",price:"desde $500 MXN",where:"worldnomads.com",link:"#"},
    {id:"r3c",icon:"esim",hero:false,brand:"AIRALO",name:"eSIM USA + Canadá",tag:"SEÑAL DESDE QUE ATERRIZAS",opinion:"Sin SIM física, sin ir a la tienda de AT&T en el aeropuerto, sin depender del WiFi del hotel.",price:"desde $200 MXN",where:"airalo.com",link:"#"},
    {id:"r3d",icon:"cards",hero:false,brand:"WISE",name:"Wise card — tipo de cambio real",tag:"EL TIPO DE CAMBIO REAL",opinion:"La tarjeta que convierte pesos a dólares al tipo de cambio real, sin comisiones absurdas.",price:"Gratis (app)",where:"wise.com",link:"#"},
    {id:"r3e",icon:"suitcase",hero:false,brand:"PACSAFE",name:"Coversafe anti-theft belt",tag:"LO QUE NADIE VE QUE LLEVAS",opinion:"Para el primer viaje a una ciudad que no conoces. El efectivo y los documentos extra van en el cinturón.",price:"$500–800 MXN",where:"Amazon MX",link:"#"},
  ]},
];

const PERSONAS=[{id:"all",label:"Todos"},{id:"familias",label:"Familias"},{id:"parejas",label:"Parejas"},{id:"fan",label:"Fans"}];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const IconZone=({product,height=72})=>(
  <div style={{width:"100%",height,background:SAND,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",flexShrink:0,transition:"background .2s"}}>
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.3}}><defs><pattern id={`d${product.id}`} width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r=".6" fill={`${PINE}30`}/></pattern></defs><rect width="100%" height="100%" fill={`url(#d${product.id})`}/></svg>
    <div style={{position:"relative",opacity:.78}}>{ic[product.icon]&&ic[product.icon](PINE)}</div>
  </div>
);

const Card=({product})=>{
  const[hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:OW,border:`1px solid ${hov?PINE:BORDER}`,display:"flex",flexDirection:"column",transition:"border-color .15s",position:"relative"}}>
      <IconZone product={product} height={72}/>
      <div style={{padding:"16px 16px 14px",display:"flex",flexDirection:"column",flex:1}}>
        <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".2em",color:SAGE,marginBottom:4}}>{product.brand}</div>
        <div style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:700,color:PINE,lineHeight:1.2,marginBottom:5}}>{product.name}</div>
        <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:600,letterSpacing:".1em",color:MUTED,marginBottom:12}}>— {product.tag}</div>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:12,color:"#5A5754",lineHeight:1.7,marginBottom:16,flex:1}}>"{product.opinion}"</div>
        <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'Fraunces',serif",fontSize:13,fontWeight:700,color:PINE}}>{product.price}</div>
            <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,color:MUTED,marginTop:2}}>{product.where}</div>
          </div>
          <a href={product.link} target="_blank" rel="noopener noreferrer" style={{background:hov?PINE:"transparent",color:hov?SAND:PINE,border:`1px solid ${PINE}`,fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".1em",padding:"7px 12px",textDecoration:"none",transition:"all .14s"}}>VER →</a>
        </div>
      </div>
    </div>
  );
};

const HeroCard=({product})=>{
  const[hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{display:"flex",border:`1px solid ${PINE}`,background:OW,marginBottom:1,transition:"border-color .15s",minHeight:180}}>
      <div style={{width:200,flexShrink:0,background:hov?`${PINE}08`:SAND,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",transition:"background .2s"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.3}}><defs><pattern id={`h${product.id}`} width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r=".6" fill={`${PINE}30`}/></pattern></defs><rect width="100%" height="100%" fill={`url(#h${product.id})`}/></svg>
        <div style={{position:"relative"}}>{ic[product.icon]&&ic[product.icon](PINE)}</div>
      </div>
      <div style={{flex:1,padding:"24px 28px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".2em",color:SAGE}}>{product.brand}</div>
          <div style={{background:`${PINE}0E`,padding:"3px 10px"}}><span style={{fontFamily:"'Manrope',sans-serif",fontSize:7,fontWeight:700,letterSpacing:".16em",color:PINE}}>DESTACADO</span></div>
        </div>
        <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:700,color:PINE,lineHeight:1.15,marginBottom:6}}>{product.name}</div>
        <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:600,letterSpacing:".1em",color:MUTED,marginBottom:12}}>— {product.tag}</div>
        <p style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:13,color:"#5A5754",lineHeight:1.75,maxWidth:440,marginBottom:18}}>"{product.opinion}"</p>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div>
            <div style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:700,color:PINE}}>{product.price}</div>
            <div style={{fontFamily:"'Manrope',sans-serif",fontSize:9,color:MUTED,marginTop:2}}>{product.where}</div>
          </div>
          <a href={product.link} target="_blank" rel="noopener noreferrer" style={{background:hov?PINE:"transparent",color:hov?SAND:PINE,border:`1px solid ${PINE}`,fontFamily:"'Manrope',sans-serif",fontSize:9,fontWeight:700,letterSpacing:".12em",padding:"9px 18px",textDecoration:"none",transition:"all .14s"}}>VER EN AMAZON →</a>
        </div>
      </div>
    </div>
  );
};

const FlatKit=({kit})=>{const[hero,...rest]=kit.products;return(<div><HeroCard product={hero}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:BORDER}}>{rest.map(p=><Card key={p.id} product={p}/>)}</div></div>);};

const SystemContent=({system})=>(
  <div>
    {system.note&&<p style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:13,color:MUTED,marginBottom:18}}>{system.note}</p>}
    {system.products&&<div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(system.products.length,3)},1fr)`,gap:1,background:BORDER}}>{system.products.map(p=><Card key={p.id} product={p}/>)}</div>}
    {system.subSections&&system.subSections.map(sub=>(
      <div key={sub.label} style={{marginBottom:24}}>
        <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".16em",color:MUTED,paddingBottom:10,marginBottom:14,borderBottom:`1px solid ${BORDER}`}}>{sub.label}</div>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(sub.products.length,3)},1fr)`,gap:1,background:BORDER}}>{sub.products.map(p=><Card key={p.id} product={p}/>)}</div>
      </div>
    ))}
  </div>
);

const MochilaKit=({kit})=>{
  const[active,setActive]=useState(kit.systems[0].id);
  const sys=kit.systems.find(s=>s.id===active);
  return(
    <div>
      <div style={{display:"flex",borderBottom:`1px solid ${BORDER}`,marginBottom:28,gap:0}}>
        {kit.systems.map(s=>{const isA=s.id===active;return(
          <button key={s.id} onClick={()=>setActive(s.id)} style={{padding:"11px 22px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"'Manrope',sans-serif",fontSize:9,fontWeight:700,letterSpacing:".16em",color:isA?PINE:MUTED,borderBottom:isA?`2px solid ${PINE}`:"2px solid transparent",marginBottom:-1,transition:"color .15s"}}>
            {s.label}
          </button>
        );})}
      </div>
      <SystemContent system={sys}/>
    </div>
  );
};

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
const FilterBar=({active,onChange})=>(
  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    {PERSONAS.map(p=>{
      const isA=p.id===active;
      return(
        <button key={p.id} onClick={()=>onChange(p.id)} style={{
          background:isA?PINE:"transparent",
          color:isA?SAND:MUTED,
          border:`1px solid ${isA?PINE:BORDER}`,
          fontFamily:"'Manrope',sans-serif",
          fontSize:11,fontWeight:isA?700:500,
          letterSpacing:".1em",
          padding:"9px 22px",
          cursor:"pointer",
          transition:"all .15s",
        }}>
          {p.label}
        </button>
      );
    })}
  </div>
);

// ─── KIT SECTION ──────────────────────────────────────────────────────────────
const KitSection=({kit,isLast})=>{
  const pc=PERSONA_COLORS[kit.persona];
  return(
    <section id={kit.id} style={{marginBottom:isLast?0:88,scrollMarginTop:72}}>
      <div style={{marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:52,fontWeight:900,color:`${PINE}0D`,lineHeight:1,flexShrink:0}}>{kit.num}</div>
          <div style={{flex:1,height:1,background:BORDER}}/>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".2em",color:MUTED}}>KIT {kit.num}</span>
            <span style={{fontFamily:"'Manrope',sans-serif",fontSize:9,fontWeight:700,padding:"3px 10px",background:pc.bg,color:pc.text,borderRadius:999}}>{PERSONA_LABELS[kit.persona]}</span>
          </div>
        </div>
        <h2 style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:40,fontWeight:700,color:PINE,lineHeight:1.0,letterSpacing:"-.02em",marginBottom:5}}>{kit.title}</h2>
        <div style={{fontFamily:"'Manrope',sans-serif",fontSize:13,color:SAGE,marginBottom:20}}>{kit.subtitle}</div>
        <p style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:14,color:"#7A7773",lineHeight:1.8,borderLeft:`2px solid ${BORDER}`,paddingLeft:18,maxWidth:600,marginBottom:kit.omit?14:0}}>{kit.scene}</p>
        {kit.omit&&<div style={{background:SAND,padding:"10px 16px",display:"flex",gap:10,alignItems:"flex-start",maxWidth:600}}>
          <span style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".14em",color:PINE,flexShrink:0,marginTop:1}}>POR QUÉ NO INCLUIMOS:</span>
          <span style={{fontFamily:"'Manrope',sans-serif",fontSize:11,color:"#7A7773",lineHeight:1.6}}>{kit.omit}</span>
        </div>}
      </div>
      {kit.type==="flat"&&<FlatKit kit={kit}/>}
      {kit.type==="systems"&&<MochilaKit kit={kit}/>}
    </section>
  );
};

const PainStrip=()=>{
  const three=[KITS_ALL[0],KITS_ALL[6],KITS_ALL[8]];
  return(
    <div style={{background:PINE,borderBottom:`1px solid ${BORDER}`}}>
      <div style={{maxWidth:1140,margin:"0 auto",padding:"0 40px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr"}}>
        {three.map((kit,i)=>(
          <a key={kit.id} href={`#${kit.id}`} style={{padding:"34px 28px",display:"flex",flexDirection:"column",gap:12,textDecoration:"none",borderRight:i<2?`1px solid ${SAND}15`:"none"}}
            onMouseEnter={e=>e.currentTarget.style.background=`${SAND}07`}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:18,fontWeight:700,color:SAND,lineHeight:1.2}}>"{kit.painMoment}"</div>
            <div style={{fontFamily:"'Manrope',sans-serif",fontSize:9,fontWeight:700,letterSpacing:".12em",color:`${SAND}55`,display:"flex",alignItems:"center",gap:6}}>
              {kit.title.replace(".","").toUpperCase()} <span style={{color:`${SAND}30`}}>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function SmartFinds(){
  const[persona,setPersona]=useState("all");
  const[email,setEmail]=useState("");
  const[submitted,setSubmitted]=useState(false);
  const visible=persona==="all"?KITS_ALL:KITS_ALL.filter(k=>k.persona===persona);

  return(
    <div style={{fontFamily:"'Manrope',sans-serif",background:OW,minHeight:"100vh",color:PINE}}>
      <style>{FONTS}{`*{box-sizing:border-box;margin:0;padding:0;}::selection{background:${PINE};color:${SAND};}a{text-decoration:none;color:inherit;}p{margin:0;}`}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(250,250,248,.96)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${BORDER}`}}>
        <div style={{maxWidth:1140,margin:"0 auto",padding:"0 40px",height:58,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <a href="/" style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:18,fontWeight:700,color:PINE}}>lagomplan</a>
          <div style={{display:"flex",gap:28}}>
            {["Planificador","Guías","Smart Finds","Hoteles","Mundial"].map(item=>(
              <a key={item} href="#" style={{fontFamily:"'Manrope',sans-serif",fontSize:13,color:item==="Smart Finds"?PINE:MUTED,fontWeight:item==="Smart Finds"?600:400,borderBottom:item==="Smart Finds"?`1px solid ${PINE}`:"none",paddingBottom:item==="Smart Finds"?2:0}}>{item}</a>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{fontFamily:"'Manrope',sans-serif",fontSize:10,fontWeight:700,letterSpacing:".08em",padding:"6px 14px",border:`1px solid ${BORDER}`,color:MUTED}}>ES</div>
          </div>
        </div>
      </nav>

      {/* MASTHEAD */}
      <header style={{borderBottom:`1px solid ${BORDER}`}}>
        <div style={{maxWidth:1140,margin:"0 auto",padding:"0 40px"}}>
          <div style={{padding:"32px 0 0",display:"flex",alignItems:"center",gap:16}}>
            <div style={{fontFamily:"'Manrope',sans-serif",fontSize:9,fontWeight:700,letterSpacing:".24em",color:SAGE}}>SMART FINDS</div>
            <div style={{flex:1,height:1,background:BORDER}}/>
            <div style={{fontFamily:"'Manrope',sans-serif",fontSize:9,letterSpacing:".14em",color:MUTED}}>VOL. 01 · 2026</div>
          </div>
          <div style={{padding:"28px 0 0",display:"grid",gridTemplateColumns:"5fr 3fr",gap:72,alignItems:"end"}}>
            <div>
              <h1 style={{fontFamily:"'Fraunces',serif",fontSize:76,fontWeight:900,color:PINE,lineHeight:.88,letterSpacing:"-.03em",marginBottom:20}}>Smart<br/><em>Finds.</em></h1>
              <p style={{fontFamily:"'Manrope',sans-serif",fontSize:15,color:"#7A7773",lineHeight:1.65,maxWidth:420}}>Nueve kits curados para viajar bien. Lo que sí llevar, por qué, y dónde conseguirlo.</p>
            </div>
            <div style={{borderLeft:`2px solid ${PINE}`,paddingLeft:24,paddingBottom:6}}>
              <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".2em",color:PINE,opacity:.35,marginBottom:12}}>NOTA DE LA EDITORA</div>
              <p style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:14,color:PINE,lineHeight:1.75,marginBottom:12}}>"No somos una tienda. Solo recomendamos lo que usaríamos."</p>
              <div style={{fontFamily:"'Manrope',sans-serif",fontSize:9,color:MUTED}}>✱ Usamos enlaces de afiliados. Sin costo para ti.</div>
            </div>
          </div>
          {/* 2-metric strip */}
          <div style={{display:"flex",borderTop:`1px solid ${BORDER}`,marginTop:28}}>
            {[["09","kits curados"],["0","patrocinios pagados"]].map(([n,l],i)=>(
              <div key={l} style={{padding:"14px 0",paddingLeft:i>0?28:0,borderRight:i===0?`1px solid ${BORDER}`:none,marginRight:i===0?28:0}}>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:900,color:PINE}}>{n}</div>
                <div style={{fontFamily:"'Manrope',sans-serif",fontSize:9,color:MUTED,letterSpacing:".1em",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* PAIN STRIP */}
      <PainStrip/>

      {/* MAIN */}
      <main style={{maxWidth:1140,margin:"0 auto",padding:"64px 40px 100px"}}>

        {/* ── FILTER BAR ── */}
        <div style={{marginBottom:12}}>
          <FilterBar active={persona} onChange={setPersona}/>
        </div>
        <div style={{fontFamily:"'Manrope',sans-serif",fontSize:11,color:MUTED,marginBottom:48}}>
          {visible.length} {visible.length===1?"kit":"kits"}
        </div>

        {/* ── KITS ── */}
        {visible.map((kit,i)=>(
          <div key={kit.id}>
            <KitSection kit={kit} isLast={i===visible.length-1}/>
            {i<visible.length-1&&(
              <div style={{display:"flex",alignItems:"center",gap:16,margin:"72px 0"}}>
                <div style={{height:1,flex:1,background:BORDER}}/>
                <div style={{fontFamily:"'Manrope',sans-serif",fontSize:9,color:MUTED}}>✦</div>
                <div style={{height:1,flex:1,background:BORDER}}/>
              </div>
            )}
          </div>
        ))}

        {/* ── PLANNER CTA ── */}
        <div style={{background:PINE,padding:"48px 52px",marginTop:88,display:"grid",gridTemplateColumns:"1fr auto",gap:48,alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".2em",color:SAGE,marginBottom:12}}>ANTES DE EMPACAR</div>
            <h3 style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:28,fontWeight:700,color:SAND,lineHeight:1.1,marginBottom:12}}>¿Ya tienes el itinerario?</h3>
            <p style={{fontFamily:"'Manrope',sans-serif",fontSize:13,color:`${SAND}75`,lineHeight:1.6,maxWidth:440}}>El mejor kit de viaje no sirve de nada si no sabes adónde vas. Genera tu plan completo en 30 segundos.</p>
          </div>
          <a href="/planificador" style={{display:"inline-block",background:SAND,color:PINE,fontFamily:"'Manrope',sans-serif",fontSize:10,fontWeight:700,letterSpacing:".14em",padding:"16px 28px"}}>PLANEA CON IA →</a>
        </div>

        {/* ── EMAIL ── */}
        <div style={{borderTop:`1px solid ${BORDER}`,marginTop:72,paddingTop:56,display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".2em",color:SAGE,marginBottom:12}}>EL ITINERARIO</div>
            <h3 style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:26,fontWeight:700,color:PINE,lineHeight:1.2,marginBottom:10}}>Nuevos kits, directo a tu correo.</h3>
            <p style={{fontFamily:"'Manrope',sans-serif",fontSize:13,color:MUTED,lineHeight:1.65}}>Sin spam. Una vez por semana, desde la perspectiva de alguien que viaja de verdad.</p>
          </div>
          <div>
            {!submitted?(<>
              <div style={{display:"flex"}}>
                <input type="email" placeholder="tu@correo.com" value={email} onChange={e=>setEmail(e.target.value)} style={{flex:1,padding:"13px 16px",border:`1px solid ${BORDER}`,borderRight:"none",fontFamily:"'Manrope',sans-serif",fontSize:14,color:PINE,background:"#FDFCFA",outline:"none"}}/>
                <button onClick={()=>email&&setSubmitted(true)} style={{background:PINE,color:SAND,border:"none",cursor:"pointer",fontFamily:"'Manrope',sans-serif",fontSize:9,fontWeight:700,letterSpacing:".12em",padding:"13px 22px"}}>SUSCRIBIRME</button>
              </div>
              <div style={{fontFamily:"'Manrope',sans-serif",fontSize:9,color:MUTED,marginTop:8}}>Al suscribirte aceptas la política de privacidad.</div>
            </>):(
              <div style={{padding:"22px",background:SAND,borderLeft:`2px solid ${PINE}`}}>
                <div style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:17,fontWeight:700,color:PINE,marginBottom:5}}>Ya estás en la lista.</div>
                <div style={{fontFamily:"'Manrope',sans-serif",fontSize:12,color:MUTED}}>El próximo jueves, en tu correo.</div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${BORDER}`,background:PINE,padding:"24px 40px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:15,fontWeight:700,color:SAND}}>lagomplan</div>
          <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,color:`${SAND}35`,letterSpacing:".14em"}}>SMART FINDS · VOL. 01 · 2026</div>
          <div style={{fontFamily:"'Manrope',sans-serif",fontSize:8,color:`${SAND}35`,letterSpacing:".12em"}}>© 2026 LAGOMPLAN</div>
        </div>
      </footer>
    </div>
  );
}
