---
description: Publica una demo co-branded nueva (preview primero, Production solo con confirmación explícita)
argument-hint: <slug> [--json ruta] [--logo ruta]
---

Publica la demo `$ARGUMENTS` siguiendo `docs/demos/README.md`. **Nunca promuevas a Production sin una confirmación explícita del usuario en este chat.**

## Reglas fijas
- No toques Supabase ni migraciones. No cambies el diseño de `GuiaClient`.
- Todo va por `npm run demo:*` (no hagas `vercel deploy --prod` a mano).
- Los `[placeholders]` se quedan resaltados; no los rellenes ni inventes datos.
- Nada llega a Production si no está en `main`.

## Paso 1 — Preview
1. Estando en `main` limpio y actualizado, corre:
   `COMMIT_TRAILER="<trailer de atribución de commits>" npm run demo:preview -- <slug> [--json <ruta>] [--logo <ruta>]`
2. Si falla la validación, muestra los errores tal cual (con su ruta) y pregunta qué corregir. No los arregles inventando contenido.
3. Cuando termine, muestra al usuario: el **link de Preview** (pide sesión de Vercel), el estado de `review`, y la lista de placeholders pendientes. **Detente aquí.**

## Paso 2 — Production (solo tras confirmación explícita)
Pregunta: «¿Publico `<slug>` a Production?». Solo con un sí claro:
1. Comprueba que `demo.json` tiene `review: { by, date }` válido (lo llena el usuario tras el OK de Pili). Sin él, **no publiques**: dile qué falta.
2. Corre `npm run demo:promote -- <slug>` **sin** `--yes` primero. Si se detiene porque saldrían otros archivos además de la demo, **enséñaselos** al usuario; solo con su aceptación expresa repite con `--allow-other`.
3. Ya con la confirmación del usuario en el chat, repite con `--yes`: `PR_FOOTER="<pie de PR>" npm run demo:promote -- <slug> --yes [--allow-other]`.
4. Entrega el link completo `https://www.lagomplan.com/demo/<slug>?ref=<ref>` y recuerda que **aún no se ha compartido**; las visitas se leen filtrando `ref` y excluyendo `qa-elena` y `ua_summary` que empiece con `bot:`.
5. Si el CLI de Vercel da un error de red durante el deploy, **no lo vuelvas a lanzar**: el script comprueba solo si el deploy llegó; si no, avisa al usuario.
