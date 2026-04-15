import { useState } from "react";

const G   = "#1B4D3E";
const GD  = "#0D2219";
const AC  = "#5DCAA5";
const CR  = "#F4F0E8";
const OW  = "#FDFCF9";
const SL  = "#5F5E5A";
const MU  = "#888780";
const BD  = "#E8E4DC";
const WH  = "#FFFFFF";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&display=swap');`;

// ─── INLINE PRODUCT — embedded in prose like a magazine ───────────────────────
const InlineProduct = ({ name, brand, price, where, link, tag, note }) => (
  <div style={{
    margin: "32px 0", borderLeft: `3px solid ${G}`,
    paddingLeft: 24, display: "grid",
    gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start",
  }}>
    <div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".2em", color: AC, fontWeight: 500, marginBottom: 6 }}>{brand.toUpperCase()}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: G, marginBottom: 6 }}>{name}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MU, letterSpacing: ".08em" }}>— {tag}</div>
      {note && (
        <div style={{ marginTop: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: MU, fontStyle: "italic", lineHeight: 1.6 }}>{note}</div>
      )}
    </div>
    <div style={{ textAlign: "right", flexShrink: 0 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: G, marginBottom: 4 }}>{price}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: MU, letterSpacing: ".1em", marginBottom: 12 }}>{where}</div>
      <a href={link} style={{
        display: "inline-block", background: G, color: CR,
        fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
        letterSpacing: ".1em", padding: "9px 16px", textDecoration: "none",
      }}>VER →</a>
    </div>
  </div>
);

// ─── GRID PRODUCT CARD ────────────────────────────────────────────────────────
const GridCard = ({ product, tinted }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? WH : tinted ? CR : OW,
        border: `1px solid ${hov ? G : BD}`,
        padding: "26px 24px 22px",
        transition: "all .2s", position: "relative",
      }}
    >
      {/* Image zone */}
      <div style={{
        width: "100%", height: 130, background: hov ? `${G}08` : CR,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, transition: "background .2s", position: "relative",
      }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .6 }}>
          <defs>
            <pattern id={`p${product.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r=".8" fill={`${G}18`} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#p${product.id})`} />
        </svg>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".18em", color: `${G}35`, position: "relative" }}>IMAGEN</span>
      </div>

      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".18em", color: AC, fontWeight: 500, marginBottom: 5 }}>{product.brand}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: G, lineHeight: 1.25, marginBottom: 6 }}>{product.name}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: MU, letterSpacing: ".07em", marginBottom: 14 }}>— {product.tag}</div>

      {/* Opinion */}
      <div style={{
        fontFamily: "'Playfair Display', serif", fontSize: 13,
        fontStyle: "italic", color: SL, lineHeight: 1.7,
        marginBottom: 18, minHeight: 70,
      }}>"{product.opinion}"</div>

      {/* Margin note — connective tissue */}
      {product.aside && (
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 9, color: MU,
          letterSpacing: ".07em", lineHeight: 1.5, marginBottom: 18,
          paddingTop: 14, borderTop: `1px solid ${BD}`,
        }}>
          ✱ {product.aside}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${BD}`, paddingTop: 14 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: G }}>{product.price}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: MU, letterSpacing: ".1em", marginTop: 2 }}>{product.where}</div>
        </div>
        <a href={product.link} style={{
          background: hov ? G : "transparent",
          color: hov ? CR : G, border: `1px solid ${G}`,
          fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 500,
          letterSpacing: ".1em", padding: "8px 14px", textDecoration: "none",
          transition: "all .18s",
        }}>VER →</a>
      </div>
    </div>
  );
};

// ─── CHAPTER HEADER ───────────────────────────────────────────────────────────
const ChapterHeader = ({ num, title, scene, aside }) => (
  <div style={{ marginBottom: 44 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, color: `${G}12`, lineHeight: 1, flexShrink: 0 }}>{num}</div>
      <div style={{ flex: 1, height: 1, background: BD }} />
    </div>
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: G, lineHeight: 1.1, letterSpacing: "-.01em", marginBottom: 16 }}>
      {title}
    </h2>
    {/* Scene — the chapter's narrative opening */}
    <p style={{
      fontFamily: "'Playfair Display', serif", fontSize: 16,
      fontStyle: "italic", color: SL, lineHeight: 1.75,
      borderLeft: `2px solid ${BD}`, paddingLeft: 20, marginBottom: aside ? 16 : 0,
    }}>{scene}</p>
    {/* Editorial aside — what we deliberately left out */}
    {aside && (
      <div style={{
        background: CR, padding: "14px 20px",
        fontFamily: "'DM Mono', monospace", fontSize: 10, color: SL,
        letterSpacing: ".06em", lineHeight: 1.6, marginTop: 16,
      }}>
        <span style={{ color: G, fontWeight: 500 }}>POR QUÉ NO INCLUIMOS:</span> {aside}
      </div>
    )}
  </div>
);

// ─── COLLECTIONS (chapters 02–05) ─────────────────────────────────────────────
const CHAPTERS = [
  {
    id: "avion",
    num: "02",
    title: "El kit del avión.",
    scene: "Son las 6am. Estás en el aeropuerto. Tu teléfono tiene 11% de batería, no encuentras el cable, y el cuello del asiento de la última aerolínea te dejó sin poder girar el cuello durante dos días. Esto se resuelve antes de salir de casa.",
    aside: "Auriculares con cancelación de ruido. Ya los tienes o ya sabes que los quieres. No hace falta que te lo digamos nosotros.",
    products: [
      {
        id: "p2", name: "Cuello de viaje Trtl", brand: "TRTL",
        opinion: "El diseño parece raro. El resultado no lo es. El mejor sueño que hemos tenido en un avión fue con este. Y lo decimos habiendo probado tres versiones de los que parecen almohadas de dona.",
        tag: "Difícil de explicar, fácil de usar",
        price: "$39 USD", where: "Amazon", link: "#",
        aside: "La gente en el avión te va a mirar raro. Tú vas a llegar descansado.",
      },
      {
        id: "p3", name: "Antifaz de seda MZOO", brand: "MZOO",
        opinion: "La pantalla del asiento de adelante es el enemigo. Este lo resuelve en $12. Es la proporción precio-impacto más eficiente de todo este listado.",
        tag: "El más barato del kit",
        price: "$12 USD", where: "Amazon", link: "#",
        aside: null,
      },
      {
        id: "p1b", name: "Cargador portátil Anker 10K", brand: "ANKER",
        opinion: "10,000mAh, carga rápida, delgado. No ocupa todo el espacio de la bolsa. Ya no llegamos a ningún destino con el teléfono al 8% después de estar en el aeropuerto 3 horas.",
        tag: "El que no se siente pesado",
        price: "$28 USD", where: "Amazon", link: "#",
        aside: "Nota: llévalo en el equipaje de mano, no en la maleta documentada.",
      },
    ],
  },
  {
    id: "organizado",
    num: "03",
    title: "El sistema.",
    scene: "Hay dos tipos de personas: las que abren la maleta en el hotel y saben exactamente dónde está cada cosa, y las que pasan 4 minutos buscando los calcetines mientras el taxi espera abajo. Este capítulo es para convertirte en el primero.",
    aside: null,
    products: [
      {
        id: "p5", name: "Cartera de viaje RFID", brand: "TRAVELAMBO",
        opinion: "Pasaporte, boarding pass, dos tarjetas, efectivo. Todo en un lugar. Bloqueo RFID. Cabe en bolsillo trasero. El único momento en que vas a sacar la cartera normal es cuando regreses a casa.",
        tag: "Reemplaza la billetera normal",
        price: "$14 USD", where: "Amazon", link: "#",
        aside: null,
      },
      {
        id: "p1", name: "Organizador de cables BAGSMART", brand: "BAGSMART",
        opinion: "Antes de tener este, llegábamos al hotel a desempacar un nudo de cables. Ahora lo abrimos y está todo. Sin buscar. Sin enredar. Parece un detalle pequeño hasta que calculas cuánto tiempo pierdes buscando cables en cada viaje.",
        tag: "Lo usamos en cada viaje",
        price: "$18 USD", where: "Amazon", link: "#",
        aside: "Tiene espacio para cable USB-C, Lightning, adaptador, power bank pequeño y audífonos.",
      },
    ],
  },
  {
    id: "conectado",
    num: "04",
    title: "Internet y corriente. Sin sorpresas.",
    scene: "El roaming te puede arruinar el estado de ánimo en los primeros diez minutos de un viaje. Llegar a un destino sin datos es perder la primera hora buscando un chip en el aeropuerto. Ambas cosas tienen solución antes de que abordes.",
    aside: "Planes de datos de tu operadora local. Siempre cuestan más y dan menos. Hay mejores opciones.",
    products: [
      {
        id: "p7", name: "eSIM Airalo", brand: "AIRALO",
        opinion: "Sin ir a buscar chip en el aeropuerto. Sin roaming. Descargas el plan antes de salir y en el avión ya tienes datos para cuando aterrizas. Lo usamos en cada viaje internacional desde que lo descubrimos. No hemos vuelto a comprar un chip físico.",
        tag: "La que cambió los viajes internacionales",
        price: "Desde $5 USD", where: "Airalo", link: "#",
        aside: "Funciona en más de 200 países. Hay planes de 1GB hasta 20GB según el destino.",
      },
      {
        id: "p8", name: "Adaptador universal EPICKA", brand: "EPICKA",
        opinion: "Un solo adaptador para todos los países. Carga 4 dispositivos al mismo tiempo. Lo que necesitas cuando hay un enchufe en el cuarto y somos 2 personas con 6 gadgets.",
        tag: "El que se queda en la maleta permanente",
        price: "$20 USD", where: "Amazon", link: "#",
        aside: null,
      },
    ],
  },
  {
    id: "familia",
    num: "05",
    title: "Para viajar con niños.",
    scene: "Esta sección la construimos con recomendaciones de mamás que ya fueron y sobrevivieron. No con teoría. Porque viajar con un toddler y un bebé de 10 meses es un proyecto de logística que la mayoría de guías de viaje no entiende.",
    aside: null,
    label: "PARA FAMILIAS",
    products: [
      {
        id: "p9", name: "Audífonos LilGadgets para niños", brand: "LILGADGETS",
        opinion: "Se conectan al teléfono y al iPad al mismo tiempo. Tienen límite de volumen incorporado. Los niños se quedan en silencio, sus tímpanos están protegidos y tú puedes mirar por la ventana sin oír Bluey por décima vez en el vuelo.",
        tag: "Imprescindible en vuelos largos",
        price: "$35 USD", where: "Amazon", link: "#",
        aside: "Los que tienen el límite de volumen de verdad, no los que dicen que lo tienen.",
      },
      {
        id: "p10", name: "Bandeja de avión para toddlers", brand: "TRAY BUDDI",
        opinion: "Cubre la bandeja del asiento y tiene bolsillos para snacks, tablet y todo lo que necesitas tener a mano. El toddler puede comer, dibujar y ver la tablet sin tirar todo al piso cada 3 minutos. Inventado por alguien que definitivamente viajó con niños antes de diseñarlo.",
        tag: "La que hace que el vuelo sea tolerable",
        price: "$28 USD", where: "Amazon", link: "#",
        aside: null,
      },
    ],
  },
];

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [emailVal, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: OW, minHeight: "100vh", color: G }}>
      <style>{FONTS}{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${G}; color: ${CR}; }
        a { color: inherit; text-decoration: none; }
        p { margin: 0; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `rgba(253,252,249,.96)`, backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BD}`,
      }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 40px", height: 64, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: G, letterSpacing: "-.01em" }}>lagomplan</a>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {["Guías", "Hoteles", "Planificador"].map(item => (
              <a key={item} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: SL, transition: "color .15s" }}>{item}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── MASTHEAD ─────────────────────────────────────────────────────────── */}
      <header style={{ borderBottom: `1px solid ${BD}` }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 40px" }}>

          {/* Column label */}
          <div style={{ padding: "36px 0 0", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".24em", color: AC, fontWeight: 500 }}>LAGOMPLAN SELECCIÓN</div>
            <div style={{ flex: 1, height: 1, background: BD }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".14em", color: MU }}>VOL. 01 · 2026</div>
          </div>

          {/* Title + standfirst */}
          <div style={{ padding: "28px 0 36px", display: "grid", gridTemplateColumns: "5fr 4fr", gap: 80, alignItems: "end" }}>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 80, fontWeight: 900,
                color: G, lineHeight: .88, letterSpacing: "-.03em", marginBottom: 28,
              }}>
                Smart<br /><em>Finds.</em>
              </h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: SL, lineHeight: 1.65, maxWidth: 400 }}>
                Cosas que encontramos, probamos y decidimos que vale la pena recomendarlas. Sin más.
              </p>
            </div>

            {/* Editor's note — the trust anchor */}
            <div style={{ borderLeft: `3px solid ${G}`, paddingLeft: 28 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".2em", color: G, opacity: .4, marginBottom: 14 }}>NOTA DE LA EDITORA</div>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontSize: 15,
                fontStyle: "italic", color: G, lineHeight: 1.75, marginBottom: 18,
              }}>
                "No somos una tienda. Somos viajeros que encontramos cosas que funcionan, eliminamos las que no, y solo recomendamos lo que usamos o nos recomendó alguien en quien confiamos."
              </p>
              <div style={{ display: "flex", gap: 20 }}>
                {[["0","patrocinios pagados"],["100%","probados o verificados"],["5","colecciones"]].map(([n,l])=>(
                  <div key={l}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: G }}>{n}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: MU, letterSpacing: ".1em", marginTop: 2, lineHeight: 1.4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Affiliate disclosure — above the fold, before content */}
          <div style={{ borderTop: `1px solid ${BD}`, padding: "14px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MU, letterSpacing: ".06em", lineHeight: 1.5 }}>
              ✱ Este contenido contiene enlaces de afiliados. Si compras a través de ellos, recibimos una comisión sin costo adicional para ti. Nunca recomendamos algo que no usaríamos o recomendaríamos a alguien que queremos.
            </div>
          </div>
        </div>
      </header>

      {/* ── CHAPTER 01 — FULL EDITORIAL FEATURE (not a grid) ─────────────────── */}
      <article style={{ maxWidth: 1060, margin: "0 auto", padding: "72px 40px 0" }}>

        {/* Chapter identifier */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, color: `${G}12`, lineHeight: 1, flexShrink: 0 }}>01</div>
          <div style={{ flex: 1, height: 1, background: BD }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".14em", color: MU }}>ARTÍCULO PRINCIPAL</div>
        </div>

        {/* Feature headline */}
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700,
          color: G, lineHeight: 1.05, letterSpacing: "-.02em", marginBottom: 8,
          maxWidth: 640,
        }}>
          La noche antes de viajar, y el sistema que la hace menos caótica.
        </h2>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MU, letterSpacing: ".1em", marginBottom: 36 }}>
          Por Lagomplan · Lectura: 3 minutos
        </div>

        {/* Pull quote — antes de la lectura */}
        <div style={{
          background: G, padding: "28px 36px", marginBottom: 40,
          borderLeft: `4px solid ${AC}`,
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontSize: 20, fontStyle: "italic",
            color: CR, lineHeight: 1.6,
          }}>
            "Son las 11pm. El vuelo sale mañana a las 7. Estás abriendo la maleta por tercera vez porque no encuentras el organizador de cables y ahora el cable del iPhone está enredado con el del iPad, que está debajo del neceser, que está encima de los zapatos."
          </p>
        </div>

        {/* Editorial prose — column layout */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr", gap: 64,
          marginBottom: 0,
        }}>
          {/* Main text column */}
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: G, lineHeight: 1.85, marginBottom: 22 }}>
              Esto nos pasó más veces de las que queremos admitir. Años de viajar y todavía la noche anterior era la misma historia: maleta abierta, cosas por todos lados, convicción de que "esta vez sí lo tengo controlado" — y 40 minutos después, la misma parálisis.
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: G, lineHeight: 1.85, marginBottom: 22 }}>
              La solución no fue una app de listas. Fue un set de cubos de empaque que cuesta $22 dólares en Amazon. Y lo que parece un detalle menor cambió completamente cómo hacemos la maleta — y cómo llegamos al destino.
            </p>

            {/* Inline product — embedded naturally */}
            <InlineProduct
              name="Cubos de empaque — Set de 4"
              brand="BAGAIL"
              price="$22 USD"
              where="Amazon"
              link="#"
              tag="El cambio más barato que puedes hacer"
              note="Cada cubo tiene su categoría. Ropa superior en uno, inferior en otro, accesorios en el tercero, chargers y cables en el cuarto. Llegas al hotel, abres el cubo que necesitas. No la maleta entera."
            />

            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: G, lineHeight: 1.85, marginBottom: 22 }}>
              La diferencia no es solo logística. Es psicológica. Saber exactamente qué va a qué lugar — antes de hacer la maleta — quita la toma de decisiones de la noche anterior. El proceso pasa de ser caótico a ser casi mecánico.
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: G, lineHeight: 1.85, marginBottom: 22 }}>
              El organizador de cables llegó después. No porque fuera urgente, sino porque una vez que tienes el sistema de maleta resuelto, el siguiente dolor es ese momento en el hotel cuando necesitas cargar el teléfono y no encuentras el cable correcto entre cuatro que se ven iguales.
            </p>

            {/* Second inline product */}
            <InlineProduct
              name="Organizador de cables"
              brand="BAGSMART"
              price="$18 USD"
              where="Amazon"
              link="#"
              tag="Lo usamos en cada viaje"
              note={null}
            />

            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: G, lineHeight: 1.85, marginBottom: 22 }}>
              Hay algo que no incluimos en este capítulo aunque podría estar: la maleta. Tenemos una opinión sobre maletas — fuerte — pero es una compra distinta, más personal, y más costosa. La ponemos en la sección Premium al final de esta página, con todo el contexto que merece.
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: G, lineHeight: 1.85 }}>
              Por ahora: los cubos, el organizador, y el sistema. Es lo que funciona sin importar qué maleta uses ni adónde vayas.
            </p>
          </div>

          {/* Sidebar — margin notes, editorial details */}
          <div style={{ paddingTop: 4 }}>

            {/* Sidebar note 1 */}
            <div style={{ background: CR, padding: "20px", marginBottom: 20, borderTop: `2px solid ${G}` }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".2em", color: G, fontWeight: 500, marginBottom: 10 }}>LO QUE DESCARTAMOS</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: SL, lineHeight: 1.65 }}>
                Probamos tres marcas de cubos antes de quedarnos con BAGAIL. Los otros tenían el zipper mal posicionado o eran demasiado rígidos para maletas con espacio irregular. No todos los cubos son iguales.
              </p>
            </div>

            {/* Sidebar note 2 */}
            <div style={{ borderLeft: `2px solid ${BD}`, paddingLeft: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".14em", color: MU, marginBottom: 8 }}>EN RESUMEN</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: SL, lineHeight: 1.6 }}>
                Cubos + organizador de cables. $40 dólares totales. El cambio en la experiencia de hacer y desempacar la maleta es desproporcionado al costo.
              </p>
            </div>

            {/* Sidebar note 3 — the metric */}
            <div style={{ background: G, padding: "20px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 900, color: AC, lineHeight: 1 }}>$40</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(244,240,232,.6)", letterSpacing: ".12em", marginTop: 6, lineHeight: 1.5 }}>INVERSIÓN TOTAL PARA EL SISTEMA COMPLETO</div>
            </div>
          </div>
        </div>

        {/* Chapter 01 end divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "72px 0 0" }}>
          <div style={{ height: 1, flex: 1, background: BD }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: MU, letterSpacing: ".16em" }}>✦</div>
          <div style={{ height: 1, flex: 1, background: BD }} />
        </div>
      </article>

      {/* ── CHAPTERS 02–05 — GRID FORMAT con narrative headers ───────────────── */}
      <section style={{ maxWidth: 1060, margin: "0 auto", padding: "64px 40px 0" }}>
        {CHAPTERS.map((ch, ci) => (
          <div key={ch.id} style={{ marginBottom: 80 }}>

            <ChapterHeader
              num={ch.num}
              title={ch.title}
              scene={ch.scene}
              aside={ch.aside}
            />

            {/* Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${ch.products.length <= 2 ? ch.products.length : 3}, 1fr)`,
              gap: 1, background: BD,
            }}>
              {ch.products.map((p, pi) => (
                <GridCard key={p.id} product={p} tinted={pi % 2 === 1} />
              ))}
            </div>

            {/* Chapter-level connective note */}
            {ch.id === "avion" && (
              <div style={{ marginTop: 24, padding: "16px 20px", background: `${G}08`, borderLeft: `2px solid ${AC}` }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: SL, letterSpacing: ".06em", lineHeight: 1.6 }}>
                  ✱ Si ya tienes auriculares con cancelación de ruido, este kit está completo. Si no los tienes, son la compra número uno antes de cualquier otra cosa de este listado. No los incluimos porque es una decisión personal y de presupuesto que no queremos generalizar.
                </p>
              </div>
            )}

            {ch.id === "familia" && (
              <div style={{ marginTop: 24, padding: "16px 20px", background: CR }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: SL, letterSpacing: ".06em", lineHeight: 1.6 }}>
                  ✱ Esta sección va a crecer. Si viajaste con niños y encontraste algo que funciona de verdad, escríbenos a hello@lagomplan.com — lo probamos y si vale la pena, lo incluimos con crédito.
                </p>
              </div>
            )}

            {/* Divider between chapters */}
            {ci < CHAPTERS.length - 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 72 }}>
                <div style={{ height: 1, flex: 1, background: BD }} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: MU, letterSpacing: ".16em" }}>✦</div>
                <div style={{ height: 1, flex: 1, background: BD }} />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ── PREMIUM FEATURE — la maleta ───────────────────────────────────────── */}
      <section style={{ maxWidth: 1060, margin: "0 auto", padding: "0 40px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, color: `${G}12`, lineHeight: 1, flexShrink: 0 }}>06</div>
          <div style={{ flex: 1, height: 1, background: BD }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".14em", color: MU }}>LA INVERSIÓN GRANDE</div>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: G, lineHeight: 1.1, marginBottom: 16 }}>
          La maleta. Cuando estés listo para no comprar otra.
        </h2>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontSize: 15,
          fontStyle: "italic", color: SL, lineHeight: 1.75,
          borderLeft: `2px solid ${BD}`, paddingLeft: 20, marginBottom: 36,
        }}>
          Aquí está la recomendación que aplazamos hasta este punto porque requiere contexto: la maleta correcta depende de cómo viajas, cuánto documentas, y si puedes justificar una inversión de $300 dólares. Si puedes, hay una respuesta clara.
        </p>

        <div style={{ background: CR, padding: "40px", display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center", marginBottom: 80 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".2em", color: AC, fontWeight: 500, marginBottom: 10 }}>AWAY</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: G, marginBottom: 8 }}>Away Carry-On</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MU, letterSpacing: ".08em", marginBottom: 20 }}>— La que no compramos dos veces</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontStyle: "italic", color: SL, lineHeight: 1.7, marginBottom: 20, maxWidth: 480 }}>
              "Cara al principio. Indispensable después. El cargador incorporado, el peso, las ruedas silenciosas. No es marketing — es la diferencia entre una maleta buena y una excelente. Llevamos tres años con la misma y no hay ninguna razón para cambiarla."
            </p>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: SL, letterSpacing: ".06em", lineHeight: 1.6, padding: "12px 16px", background: `${G}08`, borderLeft: `2px solid ${G}` }}>
              ✱ Viene con cargador incorporado certificado para vuelos internacionales. Si van a documentar la maleta, el cargador se saca — el compartimento está diseñado para eso.
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: G, marginBottom: 6 }}>$295 USD</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: MU, letterSpacing: ".1em", marginBottom: 18 }}>Away / awaytravel.com</div>
            <a href="#" style={{
              display: "inline-block", background: G, color: CR,
              fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
              letterSpacing: ".1em", padding: "14px 24px", textDecoration: "none",
            }}>VER EN AWAY →</a>
          </div>
        </div>
      </section>

      {/* ── PLANIFICADOR CTA ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 40px 80px" }}>
        <div style={{
          background: G, padding: "52px 56px",
          display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
        }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".2em", color: AC, fontWeight: 500, marginBottom: 14 }}>ANTES DE EMPACAR</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: CR, lineHeight: 1.1, marginBottom: 14 }}>
              ¿Ya tienes el itinerario?
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(244,240,232,.7)", lineHeight: 1.6, maxWidth: 420 }}>
              El mejor kit de viaje no sirve de nada si no sabes adónde vas. Genera tu plan completo — destino, hoteles, actividades, presupuesto — en 30 segundos.
            </p>
          </div>
          <a href="/trip-generator" style={{
            display: "inline-block", background: AC, color: G,
            fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500,
            letterSpacing: ".12em", padding: "18px 32px", whiteSpace: "nowrap",
            textDecoration: "none",
          }}>
            PLANEA CON IA →
          </a>
        </div>
      </div>

      {/* ── EMAIL CAPTURE ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BD}`, background: OW }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "72px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".22em", color: AC, fontWeight: 500, marginBottom: 14 }}>EL ITINERARIO</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: G, lineHeight: 1.2, marginBottom: 14 }}>
              Nuevos finds y guías, una vez por semana.
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: SL, lineHeight: 1.65 }}>
              Sin spam. Sin newsletters de 40 emails al mes. Solo lo que vale la pena — curado, con la misma voz que tienes en esta página.
            </p>
          </div>
          <div>
            {!submitted ? (
              <>
                <div style={{ display: "flex", gap: 0 }}>
                  <input
                    type="email" placeholder="tu@correo.com" value={emailVal}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      flex: 1, padding: "14px 18px",
                      border: `1px solid ${BD}`, borderRight: "none",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: G,
                      background: WH, outline: "none",
                    }}
                  />
                  <button
                    onClick={() => emailVal && setSubmitted(true)}
                    style={{
                      background: G, color: CR, border: "none", cursor: "pointer",
                      fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
                      letterSpacing: ".1em", padding: "14px 24px", whiteSpace: "nowrap",
                    }}>
                    SUSCRIBIRME
                  </button>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: MU, letterSpacing: ".08em", marginTop: 10 }}>
                  Al suscribirte aceptas la política de privacidad. Puedes darte de baja cuando quieras.
                </div>
              </>
            ) : (
              <div style={{ padding: "24px", background: CR, borderLeft: `3px solid ${AC}` }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: G, marginBottom: 6 }}>Ya estás en la lista.</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: SL }}>El próximo jueves, en tu correo.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BD}`, background: G, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: CR }}>lagomplan</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(244,240,232,.35)", letterSpacing: ".14em" }}>
            SMART FINDS · VOL. 01 · 2026
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(244,240,232,.35)", letterSpacing: ".12em" }}>
            © 2026 LAGOMPLAN
          </div>
        </div>
      </footer>
    </div>
  );
}
