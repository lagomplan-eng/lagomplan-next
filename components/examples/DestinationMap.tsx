/**
 * A small decorative "map" illustration used in place of a real screenshot
 * on /ejemplos cards until real captures are ready. Not a geographic map —
 * a stylized route + pin motif in the site's own palette, extending the
 * same small-map-preview idea already used elsewhere (guia's neighborhood
 * map thumbnail: a soft tile with a couple of dots standing in for pins).
 */

const VARIANTS = {
  // Gentle S-curve, pin top-right.
  a: {
    path: 'M40,230 C120,210 140,140 90,110 C40,80 70,40 150,55 C230,68 260,40 320,40',
    waypoints: [
      { x: 90, y: 110 },
      { x: 150, y: 55 },
    ],
    pin: { x: 320, y: 40 },
  },
  // Gentle downward arc, pin bottom-right.
  b: {
    path: 'M40,60 C110,55 150,90 140,150 C130,205 190,235 260,230 C300,227 320,240 340,255',
    waypoints: [
      { x: 140, y: 150 },
      { x: 260, y: 230 },
    ],
    pin: { x: 340, y: 255 },
  },
  // Zigzag, pin bottom-left-of-center.
  c: {
    path: 'M360,50 C300,55 290,100 240,120 C180,145 190,190 130,205 C90,215 90,240 60,250',
    waypoints: [
      { x: 240, y: 120 },
      { x: 130, y: 205 },
    ],
    pin: { x: 60, y: 250 },
  },
} as const

export default function DestinationMap({ variant }: { variant: keyof typeof VARIANTS }) {
  const { path, waypoints, pin } = VARIANTS[variant]

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="300" fill="#EDE7E1" />
      {/* Faint dot grid — reads as "map" without being an actual map. */}
      {Array.from({ length: 10 }).map((_, row) =>
        Array.from({ length: 13 }).map((_, col) => (
          <circle key={`${row}-${col}`} cx={20 + col * 32} cy={20 + row * 32} r="1.4" fill="#0F3A33" opacity="0.08" />
        )),
      )}
      {/* Route */}
      <path d={path} fill="none" stroke="#6B8F86" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 9" />
      {/* Waypoint dots */}
      {waypoints.map((w, i) => (
        <circle key={i} cx={w.x} cy={w.y} r="4.5" fill="#FFF9F3" stroke="#0F3A33" strokeWidth="2" />
      ))}
      {/* Destination pin */}
      <g transform={`translate(${pin.x}, ${pin.y})`}>
        <path
          d="M0,-26 C11,-26 19,-18 19,-7 C19,7 0,26 0,26 C0,26 -19,7 -19,-7 C-19,-18 -11,-26 0,-26 Z"
          fill="#E1615B"
        />
        <circle cx="0" cy="-7" r="6.5" fill="#FFF9F3" />
      </g>
    </svg>
  )
}
