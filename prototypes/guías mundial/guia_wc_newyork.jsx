"use client";

const T = { pine:"#0F3A33", sage:"#6B8F86", sand:"#EDE7E1", sandDark:"#D9D2C9", inkFaint:"#9A9A94", bg:"#fff9f3" };
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });

export default function NYNJGuide() {
  return (
    <div style={{ background:T.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,900&family=Manrope:wght@400;600&display=swap');`}</style>
      <div style={{ textAlign:"center", padding:"80px 40px", maxWidth:520 }}>
        <div style={{ ...uf(11,600), letterSpacing:"0.14em", textTransform:"uppercase", color:T.sage, marginBottom:20 }}>
          Mundial 2026 · Guía de campo
        </div>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(36px,5vw,56px)", fontWeight:900, fontStyle:"italic", color:T.pine, lineHeight:1, letterSpacing:"-0.03em", marginBottom:20 }}>
          Nueva York
        </h1>
        <p style={{ ...uf(14,400), color:T.inkFaint, lineHeight:1.8, marginBottom:40 }}>
          Guía en construcción — contenido editorial próximamente.
        </p>
        <div style={{ width:40, height:2, background:T.sandDark, margin:"0 auto" }} />
      </div>
    </div>
  );
}
