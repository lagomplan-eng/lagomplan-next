# Demos co-branded — cómo agregar una

1. Crea `content/demos/<slug>/` con `demo.json` y el logo (`logo.png`, ≥ 64 px de alto o SVG, ≤ 300 kB).
   Punto de partida: `docs/demos/example.demo.json` (todos los campos, sin placeholders).
2. Valida: `npm run demo:check -- <slug>` (o `--all`).
   - `--strict`: los `[placeholders]` pasan a ser errores (siempre activo si `kind` es `"partner"`).
   - `--production`: exige `review: { by, date }` válido. Preview no lo exige.
3. El esquema vive en `content/guia/demos/schema.ts` (Zod); los chequeos de archivos en `validate.ts`;
   los revisores permitidos en `content/demos/config.json`.
4. Un demo inválido rompe el build con todos los errores listados. No hay que tocar TypeScript.

Placeholders: lo que no se conoce se escribe entre `[corchetes]` (o se omite el campo) y se pinta resaltado.
`demo:check` lista los pendientes, incluidos los que la página rellena por defecto.

Limitaciones conocidas: `property.zones` acepta varias, pero solo la primera fija la pestaña inicial y la
capa de FAQ. Cada demo vive en `/demo/<slug>`; `environments: ["preview"]` la oculta (404) en Production.
