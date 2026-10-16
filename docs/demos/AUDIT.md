# Auditoría de demos co-branded (`/demo/[slug]`)

Fecha: 2026-10-12 · Modo: solo lectura · Repo: `~/Claude/lagomplan-next`
Rama auditada para código: `feature/demo-route-rebased` @ `78ba2b8` (leída con `git show`/`git grep`, sin cambiar de rama).
Convención: **confirmado** = lo vi en código/Git/GitHub en esta sesión; **no confirmado** = no pude verificarlo.
Las rutas `archivo:línea` de la demo son de `78ba2b8`.

> **Note (2026-10-16):** sections 1–12 are the Spanish pre-build audit and are kept as history. **Part II (sections 13–16, English)** at the end of this file is the current systems audit: inheritance map, test coverage, done vs. not done, and a prioritised backlog.

---

## 1. Ramas

| Rama | Local | Remoto | Estado |
|---|---|---|---|
| `main` | `984b92a` | `origin/main` = `e5cd68d` | Local **1 commit atrás** (falta #109). Incluye #106 (SEO) y #108/#109 (landing checklist). **No** incluye nada de la demo. |
| `seo/canonical-hreflang-v2` | `a4294a4` | igual | **Mergeada** (PR #106, merge `53dc624`). Contenida en `origin/main`. Sin commits sin subir. Se puede borrar. |
| `feature/demo-route-rebased` | `78ba2b8` | igual | **No mergeada**. PR #107 en **DRAFT**. Sin commits locales sin subir. CI: Vercel, Preview Comments y tests en verde, e2e en verde (último estado conocido). |

Divergencia de la demo respecto a `origin/main`: **+10 commits** (de `768d22c` a `78ba2b8`), **−4** (le faltan 60b22a4, 37e4af7, 984b92a, e5cd68d, todos del landing checklist/Mailchimp).
`git merge-tree origin/main feature/demo-route-rebased` resuelve **sin conflictos** (confirmado), aunque `main` tocó `middleware.ts` y `app/sitemap.ts`, que la demo también modifica (`middleware.ts`). Hay que rebasar antes del merge.

Otros hallazgos:
- Rama `feature/demo-route` (`602bb07`) es la versión **antigua pre-rebase** (el `gitStatus` inicial de esta sesión apuntaba al clon viejo en Desktop). Está obsoleta: no usar.
- `backup/visit-log-7a73e35` es un respaldo local; borrable cuando se mergee #107.
- El árbol de trabajo está en `feat/landing-conversion-w3` (su remoto ya fue borrado, `[gone]`, porque #109 se mergeó). Hay un cambio sin commit ajeno al trabajo: `supabase/.temp/cli-latest` (ruido del CLI, se versiona por error).
- La migración `guide_demo_visits` ya está **aplicada en el Supabase de producción** (único proyecto, sin staging) pero el código que la usa **aún no está en `main`**.

## 2. Ruta `/demo/[prospect]`

**Resolución del slug** (`app/demo/[prospect]/page.tsx`): el segmento dinámico se llama `prospect`, no `slug`. `getDemoProspect(slug)` (`content/guia/demos/index.ts:159-161`) busca en el objeto `PROSPECTS` (`:121-150`) con `hasOwnProperty`; si no existe, `notFound()` (`page.tsx:51`). `generateStaticParams` (`page.tsx:15-17`) lista las llaves de `PROSPECTS`; `dynamicParams = false` (`:13`). **Un slug solo existe si está escrito a mano en `PROSPECTS`.**

**Fuente de datos:** `PROSPECTS` en TypeScript. Solo `host-me-tender` lee un JSON, y lo hace con un `import` estático (`demos/index.ts:18`). La ruta con espacio `B2B demos/` se importa por path relativo.

**¿100 % genérica?** La ruta (`page.tsx`) y el cliente (`GuiaClient.tsx`) **sí** son genéricos: en `GuiaClient` no hay ningún `if` por operador (grep de `host-me-tender|sabores|hostmetender` en `app/`, `components/`, `lib/`, `middleware.ts` = 0 coincidencias de código). **El cableado específico de HMT vive entero en `content/guia/demos/index.ts`:**

| Archivo:línea | Qué está cableado a HMT |
|---|---|
| `demos/index.ts:18` | `import hostMeTenderJson` (un import por demo) |
| `:50-52` | `TOUR_IMAGES = {'tour-4': exp-tacos.jpg}` — mapea por **posición** del tour (`tour-4`), asume el orden del JSON de HMT |
| `:55` | `EXCLUDED_TOURS = ['Secrets & Spice']` |
| `:75-78` | `TOUR_LINK_TEXT` = "el recorrido a pie por la Roma Norte" / "the Roma Norte walking tour" |
| `:88-99` | `splitLetter()` lee **solo** `hostMeTenderJson.hostLetter`; exige exactamente 6 líneas, que la línea 3 contenga `TOUR_LINK_TEXT` y que la 4 contenga `[` o `@`; si no, lanza error. `href: '#tour-1'` fijo |
| `:102-111` | `stayGlanceFromJson()` lee `hostMeTenderJson.contact`/`rules`; parsea `contact` separando por ` · ` y buscando `Instagram ` |
| `:113-117` | `SABORES_NOTE` (nota de atribución "Sabores México", provisional hasta revisión de Pili) |
| `:122-145` | entrada `'host-me-tender'`: slug, accent `#194332` (muestreado del logo, **provisional**), ruta del logo, tours, checkout |
| `:146-149` | entrada `'dave-nat'` (solo slug y nombre; sin logo/carta/tours) |
| `tests/guia-visit.test.ts:51-52` | usa `'host-me-tender'` como slug de ejemplo (inocuo) |
| `tests/seo-validate.mjs:141` | lista `['/demo/host-me-tender', '/demo/dave-nat']` **a mano**: una demo nueva no se valida automáticamente |

Cableado **de plantilla** (no de HMT pero tampoco configurable por demo), en `buildDemoPartner` (`demos/index.ts:192-242`):
- `home = 'Condesa'` (`:193`) y `defaultNeighborhood` = Condesa: **todas las demos caen en Condesa**; el campo `neighborhood` del JSON **no se lee**.
- `city: 'cdmx'` (`:202`), `pilotId: 'mxcity_demo'` (`:206`), `cobrand: true` (`:207`), `arrivalItemsOmit: ['health-pharmacies']` (`:214`).
- `faqAnswers.chefsAtHome` y `massages` como placeholders fijos (`:224-229`).
- `operatorWhatsApp` placeholder fijo (`:231-233`); no hay campo en el JSON ni en `DemoProspect` para el número real.
- `placeholderHouse()` (`:174-190`): nombre y 3 spots como `[lugar cercano]`.

**Campos del JSON de HMT que el código NO lee** (confirmado por grep): `logoUrl`, `brandColor`, `neighborhood`. El logo y el accent se escriben **a mano en TS**; el JSON solo es “documentación”.

**Otros puntos de la ruta:** `app/demo/layout.tsx` re-exporta el layout de `/guia` (html/body/fuentes/GA). `middleware.ts:46-51` hace bypass de next-intl para `/guia` y `/demo`.

## 3. Relación con `/guia/[partner]`

**Mismo componente, no copia.** Ambas rutas renderizan `app/guia/[partner]/GuiaClient.tsx`. La demo construye un `Partner` con `buildDemoPartner()` y lo pasa con el prop `demo`. Capa de ciudad (`content/guia/cities/cdmx.ts`) y capa de zona (`content/guia/zones/*`, FAQ resolver) son **las mismas**. Pestañas, zonas y tarjetas de experiencias **no se perdieron**: las pestañas salen de `[HOME_TAB_ID, ...city.neighborhoodOrder]` (`GuiaClient.tsx:476`), igual en ambas.

Diferencias (todas confirmadas en código; capturas de la sesión anterior en `~/Claude/screenshots/hmt-vs-livin/`):

| # | Elemento | Livin (`/guia/livin_condesa`) | Demo HMT | Origen |
|---|---|---|---|---|
| 1 | Banner superior | no | "Demo preparada para…" + "Powered by Lagomplan" | `GuiaClient.tsx:509-514` (prop `demo`) |
| 2 | Header | logo Lagomplan | solo logo HMT 32 px (opción `cobrand`); sin logo → "Lagomplan × Nombre" | `:518-553` |
| 3 | Pestaña "Tu casa" | nombre real, 6 spots reales, mapa | `[nombre de la propiedad]`, 3 spots placeholder, sin mapa | `demos/index.ts:174-190` |
| 4 | Pestaña inicial | "Tu casa" | Condesa (`defaultNeighborhood`) | `:365`, `demos/index.ts:205` |
| 5 | Zonas del barrio | 5 zonas + casa | 5 zonas + casa (idénticas) | misma capa de ciudad |
| 6 | Carta del host | cita + cuerpo de la ciudad | 3 párrafos en 8 col + tarjeta "Tu estancia de un vistazo" (4 col) | `:593-643`; `StayGlance.tsx` |
| 7 | Tarjetas de experiencias | 4 tarjetas Insider → WhatsApp de Lagomplan | 4 tours propios → Peek; imagen `[imagen]` en 3 | `:828-849`, `ExperienceCard` |
| 8 | Nota bajo experiencias | "Booked through Insider…" | "Booked through Sabores México…" (provisional) | `experiencesPartnerNote` |
| 9 | Banner "Your own plan" | CTA a WhatsApp de Lagomplan | `[WhatsApp del operador]` deshabilitado | `:259-290`, prop `operator` |
| 10 | FAQ chefs / masajes | contenido real + enlaces | placeholders `[...]` | `demos/index.ts:224-229` |
| 11 | Check-out | `11:00` | `[check-out]` | `atAGlance` |
| 12 | Reglas / contacto | no existe | tarjeta nueva (`[reglas de la casa]`, correo, Instagram) | `StayGlance.tsx` |
| 13 | Analytics | `host_guide_*` | `demo_guide_*` | `:371-373` |
| 14 | Cookie de atribución | `lagom_ref=host:<slug>` | `lagom_ref=demo:<slug>` | `:398` |
| 15 | Tracking de visitas | tabla `guide_visits` | tabla `demo_visits` | `:411-422` |
| 16 | Robots | por partner (`index,follow`) | `noindex,nofollow` siempre | `page.tsx:24` |
| 17 | Título | "Livin · Your stay guide" | "Host Me Tender · Your stay guide" | `page.tsx:30` |
| 18 | `utm_source` | `livin_condesa` | `demo_host-me-tender` | `GuiaClient.tsx:465`, `demos/index.ts:199` |
| 19 | Sección "Durante tu estancia" | ya integrada en Practical | igual (retirada la sección propia) | `PracticalSection.tsx` |

**Divergencias que hoy NO están protegidas por prueba:** la paridad 1:1 se verificó **a mano** (conteo de paneles 12/8/4/2, 5 zonas, capturas). No hay una prueba automatizada que falle si alguien cambia la plantilla de Livin y la demo se queda atrás. El rediseño anterior perdió pestañas justo por eso.

Además, Livin sigue teniendo `edition` ("Edición Julio 2026") en `types.ts`, pero `GuiaClient` **no lo renderiza** (grep sin resultados): campo huérfano.

## 4. Formato de datos

### 4.1 Lo que lee la demo hoy (real, derivado de `host-me-tender.json` + `demos/index.ts`)

El JSON **no es** el contrato; el contrato real es `DemoProspect` (TS) y el JSON se transforma con código ad hoc por prospecto. Forma actual del JSON (`B2B demos/host-me-tender.json`):

```jsonc
{
  "name": "Host Me Tender",
  "logoUrl": "https://…png",          // NO se lee (el logo se copia a mano a public/)
  "brandColor": "[hex verde selva]",   // NO se lee (el accent está en TS)
  "neighborhood": "Condesa",           // NO se lee (home fijo = Condesa)
  "hostLetter": { "es": "6 líneas separadas por \n", "en": "…" },
  "checkout": "[check-out]",
  "rules": "[reglas de la casa]",
  "contact": "correo · [WhatsApp del operador] · Instagram @usuario",  // string a parsear por ' · '
  "tours": [{ "name", "description": {"es","en"}, "price", "url" }]
}
```

### 4.2 Esquema propuesto en TypeScript (unificado, describe lo que hoy se necesita)

```ts
type Lang = 'es' | 'en'
type Bilingual<T = string> = Record<Lang, T>

/** Cualquier texto puede ser "[placeholder]": se renderiza resaltado y NO bloquea el publicar,
 *  pero el validador lo lista (ver §9). Regla: /^\[[^\]]+\]$/ o contiene [..]. */
type Text = string

interface DemoConfig {
  // ── Obligatorios ──────────────────────────────────────────────
  slug: string                    // ^[a-z0-9][a-z0-9-]{0,63}$ (coincide con el CHECK de demo_visits.slug)
  name: string                    // nombre visible
  // ── Marca ─────────────────────────────────────────────────────
  logo?: string                   // archivo en public/images/demos/<slug>-logo.png; sin logo ⇒ header "Lagomplan × Nombre" y sin layout cobrand
  accent?: string                 // #rgb|#rrggbb; si es inválido se ignora en silencio (hoy). Ponerlo como error
  accentIsProvisional?: boolean   // hoy solo vive en un comentario de TS
  // ── Ubicación ─────────────────────────────────────────────────
  city?: 'cdmx'                   // hoy fijo; única ciudad existente (content/guia/cities)
  neighborhood?: string           // colonia de la pestaña inicial; hoy ignorada (fijo 'Condesa'). Debe ser llave de City.neighborhoods
  zone?: ZoneId                   // capa de FAQ (condesa|roma|polanco); hoy se deriva de la 1ª palabra del barrio
  // ── Carta del host ────────────────────────────────────────────
  hostLetter?: Bilingual<{
    paragraphs: string[]          // hoy: 3 (bienvenida / recomendación / despedida)
    link?: { text: string; href: string }   // hoy: texto fijo + '#tour-1'
  }>
  // ── Estancia ──────────────────────────────────────────────────
  checkOut?: Text                 // default '[check-out]'
  rules?: Text                    // default '[reglas de la casa]'
  contact?: {
    email?: string
    whatsapp?: { label?: Bilingual; href?: string }  // hoy sin soporte de href real; solo placeholder
    instagram?: { handle: string }
  }
  house?: {                       // pestaña "Tu casa"; hoy siempre placeholder
    name?: string
    mapUrl?: string
    spots?: Bilingual<Spot[]>     // 3 mínimo hoy
  }
  // ── Tours propios ─────────────────────────────────────────────
  tours?: Array<{
    id?: string                   // hoy se infiere "tour-<i+1>"
    name: string                  // en inglés en ambos idiomas por decisión de producto
    description: Bilingual
    price: Text                   // '[precio]' si falta
    url: string                   // https
    image?: string                // ilustración propia en /images/guia/experiences/; si falta ⇒ '[imagen]'
  }>
  tourPartnerNote?: Bilingual     // "Reservas con X, nuestro aliado local." (provisional)
  excludedTours?: string[]        // hoy EXCLUDED_TOURS en TS; mejor quitar del JSON directamente
}

/** Lo que consume GuiaClient: content/guia/types.ts → Partner (ya existe). */
```

Campos reales de `Partner` (`content/guia/types.ts`, rama demo), con obligatorios/opcionales:

- **Obligatorios:** `slug`, `displayName`, `hostName`, `city`, `homeNeighborhood`, `yourHouse: Neighborhood`, `pilotId`.
- **Opcionales:** `edition?`, `hostLetterSignature?`, `insiders?`, `zone?`, `faqAnswers?`, `atAGlance?`, `arrivalItemsOmit?`, `noindex?`, `defaultNeighborhood?`, `hostLetter?` (con `paragraphs?`, `link?`), `ownTours?`, `experiencesPartnerNote?`, `operatorWhatsApp?`, `cobrand?`, `stayGlance?`, `brand?: {logo?, accent?}`, `utmContent?`, `practicalSubhead?`.

**ES/EN:** `Record<Lang, string>` en casi todo el contenido propio del partner (`tagline`, `orientation`, `tabLabel`, `hostLetter`, `ownTours`, `operatorWhatsApp.label`, `faqAnswers.*.body`). Excepción: `checkOut`, `rules`, `stayGlance.*` y el nombre del tour son una sola cadena, sin idioma. Idioma activo: `?lang=` o toggle; por defecto `en` en servidor.

**Placeholders `[corchetes]`:** son texto literal; `withPlaceholders()` (`app/guia/[partner]/placeholders.tsx`) los envuelve en `<mark class="placeholder">` en tagline, orientation, spots, tarjetas del Practical, strip, precios, WhatsApp. Nada los impide en producción: **no hay chequeo de que ya no queden** al publicar.

**Capas de ciudad y barrio:**
- Ciudad: `content/guia/cities/cdmx.ts` (copy ES/EN, 5 zonas con spots, moods, experiencias Insider, itinerario, destinos, newsletter). Registro: `content/guia/index.ts:14-16`.
- Zona (FAQ Tier B): `content/guia/zones/{condesa,roma,polanco}.ts` + `zones/index.ts`; resolución Partner > Zone > base en `content/guia/faq/resolve.ts`.
- Partner/propiedad (Tier A + marca): `content/guia/partners/*.ts` para `/guia`; `content/guia/demos/index.ts` para `/demo`.

### 4.3 Config de `livin_condesa` (`content/guia/partners/livin_condesa.ts`)
Es un objeto `Partner` completo escrito a mano: `yourHouse` con 6 spots reales ES/EN (`:18-42`), `edition` (`:43`), `pilotId: 'mxcity_pilot'` (`:47`), `insiders.publish:false` (`:53`), `zone:'condesa'` (`:57`), `atAGlance.checkOut:'11:00'` (`:58`), `arrivalItemsOmit` (`:66`), `faqAnswers.chefsAtHome/massages` con enlaces (WhatsApp con `CHEF_WHATSAPP_NUMBER` de `lib/guia/links.ts:16`, Take a Chef, Acuity) (`:73-141`). **No** tiene `brand`, `cobrand`, `ownTours`, `stayGlance` ni `operatorWhatsApp`. Las demos añaden esos campos; Livin no los usa.

## 5. Assets

- **Logo:** `public/images/demos/<slug>-logo.png`. Hoy hay uno (`host-me-tender-logo.png`, 202×42 RGBA, recortado, transparente; 12.8 kB). La convención `<slug>-logo.png` es de facto, no está validada.
- **Origen:** el JSON trae `logoUrl` remoto, pero el código **no lo usa**; se descargó y recortó a mano (se evitó hotlink).
- **Si falta el logo (sin `brand.logo`):** el header cae en "Lagomplan × Nombre" y **`cobrand` queda en `false`** aunque el partner lo pida (`GuiaClient.tsx:483`), por lo que la carta nueva tampoco aparece. Sin error ni aviso. Es lo que pasa hoy con `dave-nat`.
- **Si se declara `brand.logo` pero el archivo no existe:** el `<img>` de cobrand (`:522`) **no tiene `onError`** ⇒ imagen rota visible (solo el logo de Lagomplan del header normal tiene fallback, `:532-537`). Esto es un riesgo real y no tiene prueba. Confirmado leyendo código; no lo reproduje en navegador.
- **Imágenes de tours:** solo ilustraciones propias de `public/images/guia/experiences/` (`exp-tacos`, `exp-ballet`, `exp-frida`, `exp-lucha`, `exp-own-plan`, `exp-teotihuacan`, `exp-xochimilco`). Sin imagen ⇒ `[imagen]` resaltado. No hay carpeta por demo para imágenes.
- **Calidad:** el logo es 42 px de alto nativo, se ve suave en retina; no hay convención de tamaño mínimo (recomendar ≥ 2× la altura mostrada, es decir ≥ 64 px, o SVG).

## 6. Tracking

1. El cliente (`GuiaClient.tsx:411-422`) llama a `buildVisit(demo ? demo.slug : partner.slug, window.location.search, navigator.userAgent)` (`lib/guia/visit.ts:46-56`).
2. `?ref=` se lee con `sanitizeRef` (`visit.ts:22-26`): se pasa a minúsculas y debe cumplir `^[a-z0-9_-]{1,32}$`; si no, se descarta y queda `null`. Mismo patrón en el CHECK de la tabla (`migrations/20261008000000_guide_demo_visits.sql:29-30,52-53`).
3. Inserta en `demo_visits` (demo) o `guide_visits` (guía) con columnas `slug, lang, params_present, ua_summary, ref` (único `GRANT INSERT` permitido, `:70-71`); sin `.select()` porque anon no tiene SELECT. Se hace con `import()` dinámico para no engordar el bundle.
4. **Solo producción:** la página pasa `recordVisits={process.env.VERCEL_ENV === 'production'}` (`demo/[prospect]/page.tsx:58`, `guia/[partner]/page.tsx:53`). Local y Preview **no escriben**. Consecuencia: **un link de Preview no deja rastro de visitas**; solo cuenta tras desplegar a Production.
5. **Sin `?ref=`:** se inserta igual con `ref = NULL`. No se rechaza ni se etiqueta.
6. Otras dos cosas llamadas "ref" que no deben confundirse: la cookie/localStorage `lagom_ref=demo:<slug>` (`GuiaClient.tsx:398-403`, se usa para atribuir el viaje que se genere después) y el `utm_source` de los CTA al planner. Ninguna depende de `?ref=`.
7. Lectura: solo desde el dashboard de Supabase / service role (sin policy SELECT, confirmado en la migración). No hay vista ni consulta guardada para "visitas por demo y ref".
8. Limitación: el `slug` que se guarda es el de la demo (`host-me-tender`) y el CHECK acepta guiones; el prefijo `demo_` solo se usa en `utm_source`.

## 7. Deploy y SEO

- **noindex:** `generateMetadata` en `app/demo/[prospect]/page.tsx:24-25` fija `robots: {index:false, follow:false, googleBot:{...}}` también para slugs desconocidos. Los dos layouts no lo sobrescriben (`app/guia/layout.tsx:35-37` solo define `metadataBase`). `app/robots.ts` no menciona `/demo` y `app/sitemap.ts` tampoco (no hay entradas de demo). Verificado con `tests/seo-validate.mjs:141-145` (26/26 en la sesión anterior). **No hay cabecera `X-Robots-Tag`** ni `Disallow` en robots.txt (a propósito: un Disallow impediría que Google lea el noindex).
- **Compartir un Preview:** cada push al PR genera un Preview. Los previews están protegidos con **Vercel Authentication** (observado en esta sesión: devuelve página de login/401 sin sesión). Para compartir hay que generar un *Shareable Link* (`?_vercel_share=…`) desde el dashboard. El estado exacto de la protección **no lo puedo confirmar por API** desde aquí (no se consultó `vercel`/dashboard en esta fase). `vercel.json` está vacío (`{}`), así que la protección es de configuración del proyecto.
- **Por qué la raíz del preview redirige al home:** la demo vive en `/demo/<slug>`, no en `/`. La raíz es el home de Lagomplan y el middleware de next-intl la manda a `/es` (`middleware.ts`; el bypass solo cubre `/guia` y `/demo`, líneas 46-51). Además, en la sesión anterior un `_vercel_share` con ID inválido respondió **307 → home** (observado). Por tanto el link que se comparte debe ser `…/demo/<slug>?_vercel_share=…` **y** `?ref=`; una URL con solo el host del preview cae en el home. La causa exacta del redirect en el caso real del usuario **no está confirmada**; lo anterior es coherente con el código y con lo observado.
- **Merge a `main` ≠ producción:** (confirmado en #106) un merge crea solo Preview; el último deploy de Production sigue siendo del 30-sep (`7932848`). No se verificó cuál es el mecanismo exacto de promoción (manual en el dashboard o `vercel --prod`).

## 8. Simulación: publicar `kasava-homes` hoy

Supuesto: partimos de `feature/demo-route-rebased` ya mergeada. Si no, hay que agregar primero el rebase sobre `main` (+15 min).

| # | Paso | Archivo / comando | Qué se rompe si falla |
|---|---|---|---|
| 1 | Crear el JSON | `B2B demos/kasava-homes.json` (copiar HMT y editar) | Nada se valida: un campo mal escrito no avisa |
| 2 | Descargar y recortar el logo | a mano; guardar `public/images/demos/kasava-homes-logo.png` | Logo con fondo/espacio ⇒ header desalineado; sin logo ⇒ sin layout nuevo (silencioso) |
| 3 | Sacar el color de marca | a mano (muestrear logo o pedir hex) | Si es inválido se ignora sin aviso |
| 4 | Importar el JSON | `content/guia/demos/index.ts`: `import kasavaJson from '../../../B2B demos/kasava-homes.json'` | Error de TS si falta; el import es por prospecto |
| 5 | Escribir transformadores | `splitLetter()` y `stayGlanceFromJson()` están **atados a `hostMeTenderJson`**: duplicar o parametrizar | Cambia el comportamiento de HMT si se parametriza mal; sin pruebas de snapshot |
| 6 | Tours | `TOUR_IMAGES` por `tour-<n>`, `EXCLUDED_TOURS`, `TOUR_LINK_TEXT` ("Roma Norte" fijo) | Texto de enlace de HMT apareciendo en otra demo; imagen equivocada |
| 7 | Registrar | `PROSPECTS['kasava-homes'] = {…}` | Sin esto la ruta da 404 (`dynamicParams=false`) |
| 8 | Barrio | `home='Condesa'` fijo en `buildDemoPartner` | Si Kasava está en otra colonia, la demo muestra Condesa. Requiere cambio de código |
| 9 | Typecheck/tests | `npx tsc --noEmit`, `npx tsx tests/guia-visit.test.ts` | Ninguna prueba cubre la nueva demo |
| 10 | Añadir al validador | `tests/seo-validate.mjs:141` (lista a mano) | La demo nueva queda sin comprobar el noindex |
| 11 | Build | `npm run build` | El build de producción valida tipos y `generateStaticParams` |
| 12 | Commit/push | rama `feature/…`, PR (o a `feature/demo-route-rebased`) | Si la rama base aún no está en `main`, el PR arrastra los 10 commits |
| 13 | Preview | esperar CI de Vercel (~3–5 min), generar Shareable Link | `recordVisits` es false en Preview ⇒ no hay tracking; link sin `/demo/…` cae en home |
| 14 | Producción | merge + promoción (requiere tu OK) | Un merge a `main` no despliega a Production por sí solo (confirmado en #106) |
| 15 | Armar el link | `https://www.lagomplan.com/demo/kasava-homes?ref=<tag>` | Si `ref` no cumple `^[a-z0-9_-]{1,32}$` se descarta sin aviso |

**Archivos que se tocan:** 4–5 (JSON, logo, `demos/index.ts`, `seo-validate.mjs`, opcionalmente `TOUR_IMAGES`). **Comandos:** 5–6. **Tiempo estimado hoy:** 2–3 h si el operador se parece a HMT; 1 día completo si tiene otra colonia, otro formato de carta o tours distintos (hay que tocar la plantilla). El valor “medio día” del objetivo se cumple solo cuando se eliminan los pasos 4–8 y 10.

## 9. Brechas para llegar al objetivo

### 9.1 Una demo = un JSON + un logo, cero código
- **B1.** Mover `PROSPECTS` fuera del TS: un cargador que lea `B2B demos/*.json` (o `content/demos/<slug>/demo.json`) y construya la lista; `generateStaticParams` lo recorre. Hoy el registro y los transformadores están escritos por prospecto.
- **B2.** `splitLetter`, `stayGlanceFromJson`, `TOUR_LINK_TEXT`, `TOUR_IMAGES`, `EXCLUDED_TOURS` pasan **al JSON** (párrafos ya separados, `link`, `image`, sin tours excluidos). Eliminar la regla de “6 líneas”.
- **B3.** Leer los campos que hoy se ignoran (`neighborhood`, `brandColor`, `logoUrl` solo como origen) o eliminarlos del JSON.
- **B4.** Convención de logo `public/images/demos/<slug>-logo.png` con comprobación de existencia y tamaño; fallback `onError` en el logo cobrand.
- **B5.** Soporte real para número de WhatsApp (`href`) y datos de la casa (`yourHouse`) por JSON, para poder pasar de placeholder a dato real sin tocar código.

### 9.2 `/demo` amarrado a la plantilla de Livin
- **B6.** Hoy la paridad es manual. Agregar una **prueba de paridad** (SSR + conteo de secciones/paneles/zonas/tarjetas) que compare `/guia/livin_condesa` con cualquier demo y falle ante divergencias no listadas en una lista blanca explícita (las del §3).
- **B7.** Extraer una función `buildPartner(config, base)` compartida: la demo y los `Partner` de `/guia` deben salir de la misma estructura, de modo que Livin sea “una demo con datos reales”.

### 9.3 Validación con esquema (Zod)
- **B8.** No hay Zod ni ningún validador en `package.json` (confirmado). Añadir `zod` y un `DemoConfigSchema` que:
  - falle (exit 1) con mensajes legibles tipo `kasava-homes.json › tours[2].url: debe empezar con https://`;
  - valide hex de color, slug (mismo regex que el CHECK de la BD), existencia del logo, que `neighborhood` sea llave de `City.neighborhoods`, longitud de párrafos, ES y EN presentes;
  - **liste los `[placeholders]` pendientes** como advertencias (no error) y tenga un modo `--strict` que los trate como error al promover a producción;
  - verifique que ningún tour use dominios no permitidos ni imágenes de terceros.
- **B9.** Un solo esquema compartido por el script, la ruta y (a futuro) la API; hoy `DemoProspect`, `Partner` y el JSON son tres formas distintas.

### 9.4 Comando `/nueva-demo <slug>`
No existe `.claude/commands` ni `scripts/` para esto (confirmado). Propuesta: un script `scripts/demo.ts` (`npm run demo:new -- <slug>`, `npm run demo:check`) y un *slash command* `.claude/commands/nueva-demo.md` que lo invoque. Flujo:
1. recibe `<slug>` + ruta del JSON + ruta del logo;
2. valida el slug y el JSON con Zod; falla antes de tocar nada;
3. copia el logo a `public/images/demos/<slug>-logo.png` y lo recorta/valida alfa;
4. añade la demo al seed (si el registro sigue siendo código) o solo suelta el JSON (si se carga dinámicamente);
5. corre typecheck + tests + `seo-validate` solo de esa ruta;
6. crea rama `demo/<slug>` desde `main`, commit y push (sin merge);
7. **se detiene para pedir OK** antes de promover; tras el OK imprime el link completo `…/demo/<slug>?ref=<tag>` (y un link de Preview con instrucciones de Shareable Link).
Reglas fijas: nunca despliega a Production sin confirmación expresa; nunca toca migraciones; avisa si quedan placeholders.

### 9.5 Brechas adicionales encontradas
- **B10.** `seo-validate.mjs:141` lista demos a mano ⇒ derivarla del registro.
- **B11.** Logo cobrand sin `onError` (§5).
- **B12.** `accent` inválido se ignora en silencio; `cobrand` se apaga en silencio sin logo (§5).
- **B13.** `dave-nat` existe como demo vacía sin logo/carta: decidir si se queda o se elimina.
- **B14.** Preview no registra visitas (por diseño). Para ensayar el tracking hace falta una vía de prueba sin contaminar producción (p. ej. `ref=test` filtrable).
- **B15.** `main` local atrasado y `#107` sin rebasar sobre `e5cd68d`: rebasar y repetir `seo-validate` antes de cualquier merge.
- **B16.** `supabase/.temp/cli-latest` versionado por error genera ruido en `git status`.
- **B17.** Campo `edition` huérfano en `Partner`.

## 10. Compatibilidad con el onboarding self-serve (partners / properties / guides)

**Recomendación: las demos siguen siendo archivos JSON en el repo por ahora, pero con el mismo esquema que luego se guarda en Supabase.**

Razones:
- Una demo es efímera, la crea el equipo (no el operador), debe poder revisarse en un PR y no necesita editor. Un JSON versionado da historial y revisión gratis.
- Los placeholders y el contenido están en revisión continua; en Git quedan auditables.
- Migrar a Supabase es una decisión de producto (quién edita, con qué permisos); hacerlo ahora duplicaría trabajo y obligaría a una migración (que debes aprobar).

**Cómo mantener un solo esquema:**
1. Definir `PartnerGuideConfig` con Zod en `lib/guia/schema.ts` y exportar el tipo TS. La demo es `PartnerGuideConfig` + `{ kind: 'demo', noindex: true, prospect: {...} }`.
2. Una interfaz `GuideSource` con dos implementaciones: `fileSource` (lee JSON; hoy) y `dbSource` (lee `partners`/`properties`/`guides`; mañana). `app/demo` y `app/guia` solo hablan con la interfaz.
3. Mapeo previsto (sin crear nada): `partners` = operador y marca (nombre, logo, accent, contacto); `properties` = casa (colonia, nombre, spots, check-out, reglas); `guides` = publicación (slug, tipo `demo|live`, idioma, tours, carta, estado, noindex). El JSON de demo ya se puede partir en esas tres secciones.
4. Guardar `schema_version` en cada JSON y en la fila (`jsonb`), para migrar sin romper demos antiguas.
5. Cuando se migre, un script `demo:import` sube los JSON existentes a la BD con el mismo Zod; así los JSON dejan de ser fuente pero siguen como semilla/respaldo.
6. Reutilizar el patrón de RLS de `guide_visits/demo_visits` (insert limitado por columnas, sin SELECT público). Las tablas nuevas **requieren migración: se pide aprobación antes**.
Pregunta abierta: ¿las guías `live` de operadores (`/guia/<slug>`) y las demos serán la misma tabla con un campo `kind`, o tablas separadas?

## 11. Plan por fases

| Fase | Contenido | Cómo se prueba | Tiempo (estimación) |
|---|---|---|---|
| **0. Limpieza** | Rebasar #107 sobre `e5cd68d`; resolver `main` local atrasado; borrar ramas obsoletas (`feature/demo-route`, backup, `seo/…`) | `merge-tree` limpio, `tsc`, `seo-validate` 26/26, CI verde | 1–2 h |
| **1. Esquema + validador** | `zod`; `DemoConfigSchema`; `npm run demo:check <slug>`; tipos exportados; lista de placeholders pendientes; `--strict` | Pruebas `tsx` con JSON válidos/ inválidos (snapshots de errores legibles); correr contra HMT sin cambiar su render | 0.5–1 día |
| **2. Demo 100 % por datos** | Cargador de JSON; mover `splitLetter`/`stayGlance`/`TOUR_*`/`barrio` al JSON; `onError` del logo; leer `neighborhood`; derivar la lista del validador SEO | Hash SSR de HMT **antes/después idéntico**; prueba de paridad con Livin (B6); Livin sin cambios (capturas + hash) | 1–1.5 días |
| **3. Comando `/nueva-demo`** | Script + slash command; copia/recorte del logo; rama y commit; imprime link con `?ref=`; pide OK antes de promover | Ensayo con una demo de prueba (`kasava-homes` de ejemplo) en rama temporal; medir tiempo extremo a extremo (< 4 h incluyendo contenido) | 0.5–1 día |
| **4. Observabilidad** | Vista/consulta guardada de visitas por demo y `ref`; ruta de prueba sin contaminar producción | Insert en producción con `ref=test` y verificación por dashboard (pide OK) | 0.5 día |
| **5. Puente a self-serve** | `PartnerGuideConfig` con `schema_version`; `GuideSource` (file/db); borrador de tablas `partners/properties/guides` **solo como documento** | Revisión de diseño; ninguna migración sin tu OK | 1 día de diseño + implementación después |

Total fases 0–3: **aprox. 3–4 días** de trabajo para dejar “JSON + logo + un comando”.

---

## Preguntas abiertas
1. ¿La plantilla de la demo debe seguir fija a Condesa/CDMX o cada demo elegirá su colonia (¿hay otras ciudades pronto)?
2. ¿Los placeholders pueden llegar a producción en una demo (hoy sí) o `--strict` debe bloquearlos?
3. ¿Dónde vive el JSON: `B2B demos/` (con espacio) o `content/demos/<slug>/`? Recomiendo lo segundo.
4. ¿Qué se hace con `dave-nat`?
5. ¿La promoción a Production se mantiene manual (tu OK) o el comando puede hacerla tras OK explícito?
6. Dos sistemas llamados "ref" (query `?ref=` en la tabla vs cookie `lagom_ref`): ¿unificar?
7. ¿Las demos y las guías reales compartirán tabla en el futuro?

---

## 12. Decisiones de Elena (2026-10-12) y su efecto en el plan

| # | Decisión | Efecto |
|---|---|---|
| 1 | Cada demo elige su colonia entre las capas existentes (Condesa, Roma, Polanco) y puede llevar varias (ej. Capitalia: Polanco + Condesa). `city: "cdmx"` en el esquema; no se construyen otras ciudades. | `city: "cdmx"` (literal), `zones: ZoneId[]` (≥1), zona inicial. Reemplaza el `home='Condesa'` fijo. |
| 2 | Placeholders permitidos en demos, también en producción (el tracking solo funciona ahí). `--strict` los bloquea en guías reales de partners. Campo de revisión editorial (`review: { by, date }`): sin él, el comando no publica. | Validador: placeholders = aviso en `kind: "demo"`, error con `--strict` / `kind: "partner"`. `review` obligatorio para publicar. |
| 3 | JSON en `content/demos/<slug>/` (`demo.json` + logo). | Se retira `B2B demos/` y `public/images/demos/`. |
| 4 | `dave-nat` se queda; primer caso de prueba del flujo nuevo. | Migra a `content/demos/dave-nat/`. |
| 5 | `/nueva-demo` despliega a preview, muestra el link y pide confirmación explícita antes de promover. Nunca automático. | Dos pasos; la promoción exige confirmación. |
| 6 | Esquema pensado para que demos y guías de partners compartan tabla, con `kind: "demo" \| "partner"`. Hoy siguen como archivos. | La forma del JSON imita esas columnas; `schema_version` incluido. |

Plan aprobado: Fase A (base) → B (datos fuera del código) → C (validación) → D (comando y paridad). Se reporta al final de cada fase.

### Limitaciones conocidas (aprobadas 2026-10-13)
- **Varias zonas por demo:** `property.zones` acepta varias (ej. Polanco + Condesa), pero solo la **primera** fija la pestaña inicial y la capa de FAQ. Las demás son informativas hasta que el resolver de FAQ admita más de una zona. Todas las pestañas del barrio (Roma Norte, Condesa, Polanco, Centro) ya se muestran en cualquier demo.
- **`review`:** `by` solo acepta nombres de una lista de revisores en config (hoy: "Pili"); `date` en ISO `YYYY-MM-DD`. Sin `review` válido el comando no publica a Production (a preview sí). Lo rellena Elena tras el OK de Pili.


---

# Part II — Systems audit (2026-10-16, English)

Mode: **read-only**. No code was changed, nothing was deployed, Supabase was not accessed (the live database state was **not** re-verified here). Base: `main` @ `e69a6b8` (PRs #107, #111, #112, #113, #114, #115, #116 merged; `[verified by running]` with `git log --merges`). Production serves `e69a6b8`.

Every claim carries a tag:
- `[read in code]` — read in the file cited.
- `[verified by running]` — a command, script or HTTP request was executed in this audit; the method is stated.

Throwaway scripts (ES/EN parity, link probe, coverage) ran from the scratchpad, outside the repo.

Sections 1–12 above are the Spanish pre-build audit and are historical. Two of its statements are now stale: §2's note that `seo-validate.mjs` hard-codes the demo list (it now derives demos from `content/demos/*`, `tests/seo-validate.mjs:143-146` `[read in code]`) and §4/§9 (the data format and the validator now exist: `content/guia/demos/schema.ts`, `validate.ts`).

---

## 13. Inheritance map

### 13.1 One rendering path, two partner-data paths

**Rendering: one.** Both routes render the same client component, `app/guia/[partner]/GuiaClient.tsx`:
- `/guia/<slug>`: `app/guia/[partner]/page.tsx:53` `[read in code]`
- `/demo/<slug>`: `app/demo/[prospect]/page.tsx:54-57` `[read in code]`

**Content stack: one.** Both resolve city layer (`content/guia/cities/cdmx.ts`) → zone layer (`content/guia/zones/*.ts`) → FAQ base (`content/guia/faq/base.ts`), merged by `content/guia/faq/resolve.ts:31-75` `[read in code]`.

**Partner layer: two ways in, one type.**

| | `/guia/*` | `/demo/*` |
|---|---|---|
| Partner data written as | hand-written TypeScript, `content/guia/partners/*.ts` | JSON, `content/demos/<slug>/demo.json` |
| Registered in | `content/guia/index.ts:18-23` | folder discovery, `content/guia/demos/validate.ts` (`listDemoFolders`) |
| Validated by | TypeScript types only (`content/guia/types.ts:277`) | Zod strict schema at build, `content/guia/demos/index.ts:32-38`, plus `npm run demo:check` |
| Mapped to `Partner` by | nothing, it already is one | `buildDemoPartner`, `content/guia/demos/index.ts:112-191` |
| Placeholders for missing data | none (missing = hidden) | explicit `[brackets]` + implicit defaults, `index.ts:73,87-88,94-109,172,176,180` |
| Environment gate | none | `environments`, `index.ts:43-46` |

**Where they diverge** (all inside `GuiaClient.tsx`, gated on the `demo` prop, so `/guia/*` cannot reach them) `[read in code]`:
- "Demo prepared for" banner, `:532-537`
- co-brand header and logo, `:506,541-545` (`/guia` always shows the Lagomplan logo, `:551`)
- split host letter + "Your stay at a glance" card, `:507,614-644`
- analytics rename `host_guide_*` → `demo_guide_*`, `:395-396`
- attribution `demo:<slug>` vs `host:<slug>`, `:421`
- visit log table `demo_visits` vs `guide_visits`, `:443`

Divergence outside the component: robots (`/guia` per-partner `noindex`, `page.tsx:34-36`; `/demo` always `noindex,nofollow`, `app/demo/[prospect]/page.tsx:24`), `pilotId` (`mxcity_demo`, `content/guia/demos/index.ts:153`, vs `mxcity_pilot`, e.g. `livin_condesa.ts:47`), and sitemap (`/demo/*` is absent: `[verified by running]` `curl https://www.lagomplan.com/sitemap.xml | grep -c /demo/` → 0).

The parity test (`e2e/guia-parity.spec.ts`) is the only thing that ties the two together structurally.

### 13.2 Levels used below

- **template**: `GuiaClient.tsx`, `PracticalSection.tsx`, `StayGlance.tsx`, `guia.module.css` (shared by every guide and demo).
- **city**: `content/guia/cities/cdmx.ts` (shared by every guide and demo, both languages).
- **zone**: `content/guia/zones/{condesa,roma,polanco}.ts`.
- **faq base**: `content/guia/faq/base.ts`.
- **demo.json**: `content/demos/host-me-tender/demo.json` (this demo only).
- **partner-specific hardcoded**: partner TypeScript (`content/guia/partners/*.ts`) or constants inside shared code.

"If changed" lists who else changes: **ALL** = every `/guia/*` page and every `/demo/*`; **GUIAS** = every `/guia/*` only; **DEMOS** = every demo only; **THIS** = only that page.

### 13.3 Section-by-section map

Section order follows `GuiaClient.tsx`. HMT = `/demo/host-me-tender`; Livin = `/guia/livin_condesa`. All rows `[read in code]` unless tagged.

| # | Section / item | HMT source (level) | Livin source (level) | If changed at the source |
|---|---|---|---|---|
| 0 | Demo banner "Demo prepared for X" | `GuiaClient.tsx:532-537` (template, strings inline) + `partner.name` (demo.json) | not rendered | strings: DEMOS. name: THIS |
| 0 | "Powered by Lagomplan" | `GuiaClient.tsx:535` (template, **English only, not in the copy objects**) | not rendered | DEMOS (cobrand ones) |
| 1 | Header logo | `demo.json` `partner.logo` → `content/guia/demos/index.ts:59-61,186-189` (demo.json) | `/images/logo.png` hard-coded, `GuiaClient.tsx:551` (template) | HMT: THIS. Livin: ALL non-cobrand |
| 1 | Brand accent | `partner.brand_color` → `--accent`, `GuiaClient.tsx:530` (demo.json) | none | THIS |
| 1 | ES/EN toggle, nav label | template `:577-589`; label `cdmx.ts:194,397` (city) | same | ALL |
| 2 | Hero image | `cdmx.ts:11` (city) | same | ALL |
| 2 | Hero eyebrow "Curated by {host}" | `cdmx.ts:195,398` (city) + `{host}` = `partner.name` (demo.json) | city + `hostName: 'Livin'` `livin_condesa.ts:15` (partner hardcoded) | text: ALL. host: THIS |
| 2 | Hero title / subtitle / CTA | `cdmx.ts:196-198,399-401` (city) | same | ALL |
| 2 | "Your N nights in X" | `lib/guia/stay.ts:59-64` (template) + `homeNeighborhood` = first zone tab (`content/guia/demos/types.ts:15`) | same, `livin_condesa.ts:17` | ALL |
| 3 | Host letter | `demo.json` `guide.host_letter` → split layout (`GuiaClient.tsx:614-644`) | generic Lagomplan letter `cdmx.ts:388-395,590+` signed "Livin" (`livin_condesa.ts:48`) | HMT: THIS. Livin: ALL guides (see F9) |
| 3 | "Your stay at a glance" card (rules, email, Instagram, WhatsApp) | `demo.json` `property.rules`, `partner.contact` → `index.ts:132-141,179-183`; labels in `StayGlance.tsx:19-24` (template) | not rendered | THIS (data); DEMOS (labels) |
| 4 | "Before you arrive" cards | `cdmx.ts:202-238,405-440` (city) minus `arrivalItemsOmit` | same, minus `livin_condesa.ts:66` | ALL |
| 4 | `arrivalItemsOmit` | **hard-coded for every demo**, `index.ts:161` (partner-specific hardcoded in shared code, F3) | `livin_condesa.ts:66` (partner hardcoded) | HMT: ALL demos. Livin: THIS |
| 4 | Omit gate | `ARRIVAL_FAQ_COUNTERPART`, `GuiaClient.tsx:105-116` (template; map of id → FAQ key) | same | ALL |
| 4 | Check-in/out badge | `demo.json` `property.check_out` → `index.ts:115,158` | `livin_condesa.ts:58-60` (partner hardcoded) | THIS |
| 4 | Practical sub-head | `PracticalSection.tsx:197` default (template) | default; Polanco overrides `livin_polanco.ts:69` | ALL |
| 4 | FAQ "Check-in and check-out" | `index.ts:163-168`, built from `check_out` (loader) | not set on Livin (resolves nothing) | DEMOS |
| 4 | FAQ errands (laundry, supermarkets, money, ATMs, odd hours, coworking, haircuts) | zone file of the **first** zone, `condesa.ts:32-139` | zone file, same | every partner/demo in that zone |
| 4 | FAQ eating (group restaurants, catering, wine) | zone, `condesa.ts:160-197` | same | same |
| 4 | FAQ "Chefs at home" | `demo.json` `guide.faq.chefs_at_home(+_links)` → `index.ts:171-174`; if absent, placeholder (demo.json) | `livin_condesa.ts:74-113` (partner hardcoded; uses `CHEF_WHATSAPP_NUMBER`, `lib/guia/links.ts:16`) | HMT: THIS. Livin: THIS (the same chefs block is copy-pasted in `livin_roma.ts:63`, `livin_polanco.ts:84`) |
| 4 | FAQ "Massages" | `demo.json` `guide.faq.massages` or placeholder, `index.ts:175-177` | `livin_condesa.ts:114-141` (partner hardcoded: Casa Ancestras), duplicated in `livin_roma.ts:101+` | THIS (Livin Condesa and Roma drift independently) |
| 4 | FAQ "Gyms and studios" | falls to base default (Fitpass), `base.ts:92-97` (faq base) | same (Polanco has its own, `polanco.ts:139`) | ALL without an override (F1) |
| 4 | FAQ "Health & pharmacies" | base default `base.ts:121-132` (+ duplicate in `cdmx.ts:237,439`) | same | ALL (F3) |
| 4 | Tier-A property answers (early/late, keys, luggage, cleaning, towels, late return) and `privateEvents`, `familiesPets` | **never render** (no layer defines them) | **never render** | n/a: `resolve.ts:56-59` skips items with no body at any layer, no trace |
| 5 | "Your neighborhood" tabs | `cdmx.ts:12-115` (city), home tab from `property.house` (demo.json) or placeholders `index.ts:80-110` | city + `livin_condesa.ts:18-42` | tabs: ALL. house: THIS |
| 5 | Default open tab | first zone tab, `index.ts:152` (demo.json via `ZONE_TAB`) | `livin_condesa` has none → "Your house" (`GuiaClient.tsx:388`) | THIS |
| 5 | Zone `orientation` / `tagline` / spots | city `neighborhoods` | same | ALL |
| 6 | 48-hour itinerary | `cdmx.ts:129-191` (city) | same | ALL |
| 7 | Mood picker | `cdmx.ts:247-278,449-480` (city) | same | ALL |
| 8 | Weather card | live Open-Meteo, `lib/guia/weather.ts:42-43,53` (template; fixed CDMX coords) | same | ALL |
| 8 | "Today"/weekly-rhythm items | `cdmx.ts:284-289,486-491` (city; no dates, see §15) | same | ALL |
| 9 | Experiences: cards | own tours: `demo.json` `guide.tours` → `index.ts:63-77,184` | 4 Insider experiences, `cdmx.ts:299-351,501-553` (city) | HMT: THIS. Livin: ALL guides + any demo without own tours |
| 9 | Experiences: partner note | `demo.json` `tours_partner_note` → `index.ts:185`, rendered `GuiaClient.tsx:848` | "Booked through Insider…" `cdmx.ts:293,495` (city) | HMT: THIS. Livin: ALL |
| 9 | Experiences: images | tour `image` in demo.json; must be `/images/guia/experiences/*` (`schema.ts:45`) | `EXP_PHOTOS`, `GuiaClient.tsx:119-125` (template, keyed by Insider ids) | HMT: THIS. Livin: ALL |
| 9 | "Your Own Plan" banner | city text `cdmx.ts:352-360,554-562`, **CTA re-routed to the operator's WhatsApp** when own tours exist, `GuiaClient.tsx:868-870` | city text + Insider CTA | text: ALL; CTA routing: DEMOS with tours |
| 9 | Insider WhatsApp number | `WA_BOOK_URL`, `GuiaClient.tsx:94-97` and again in `cdmx.ts:357,559` (F5) | same | ALL |
| 10 | Food collections | `cdmx.ts:365-374,567-576` (city) | same | ALL |
| 11 | Insiders section | `partner.insiders` never set for demos → hidden | `insiders.publish:false` (`livin_condesa.ts:53`) → hidden | n/a |
| 12 | Planner CTA, sticky CTA, newsletter | city copy `cdmx.ts:375-386,577-588`; link UTMs `GuiaClient.tsx:486-493`, `utm_source=demo_<slug>`, `utm_campaign=mxcity_demo` (`index.ts:146,153`) | same, `utm_source=livin_condesa`, `mxcity_pilot` | copy: ALL. UTMs: per page |
| 12 | Newsletter submit | `NewsletterSignup.tsx:32` → `/api/subscribe` (Mailchimp). **Not demo-aware** | same | ALL |
| 13 | "Discover more" | `cdmx.ts:116-128` (city) | same | ALL |
| 13 | Footer | `cdmx.ts:387,589` (city) | same | ALL |
| 14 | `<title>`, description | `app/demo/[prospect]/page.tsx:30-32` from `partner.name` | `app/guia/[partner]/page.tsx:27-29` from `displayName`/`hostName` | per page |
| 14 | `og:image` | `city.heroImage`, `app/demo/[prospect]/page.tsx:41` | `guide.city.heroImage`, `app/guia/[partner]/page.tsx:41`. `[verified by running]` both return `https://www.lagomplan.com/images/guia/cdmx-banner.jpg` | ALL (no per-demo image) |

### 13.4 Partner-specific data living in shared code

Flags, ranked by how likely they are to bite:

| ID | Where | What | Reaches |
|---|---|---|---|
| F3 | `content/guia/demos/index.ts:161` | `arrivalItemsOmit: ['health-pharmacies']` hard-coded for **every** demo ("same omission Livin applies"). Its effect depends on `ARRIVAL_FAQ_COUNTERPART` (`GuiaClient.tsx:105-116`) and on a duplicated text in `cdmx.ts:237,439` and `base.ts:121-132`. Three places must agree. | all demos |
| F2 | `content/guia/faq/base.ts:101-110` | default "Chefs at home": *"contáctanos y lo organizamos"*, a promise made in the partner's voice. Unreachable today (every Livin guide and every demo sets its own chefs entry) but any new `/guia` partner with a zone and no override inherits it. | future partners |
| F1 | `content/guia/faq/base.ts:92-97` | "Gyms and studios": names Fitpass, identical text in ES and EN on purpose (`base.ts:82,90-91`). Shown for every partner/demo in a zone without a gyms entry (all but Polanco). | all guides, all demos |
| F5 | `GuiaClient.tsx:94-97`, `cdmx.ts:357,559` | Insider's WhatsApp number (`525539149062`) is hard-coded in three places. | all guides, demos without tours |
| F9 | `cdmx.ts:388-395,590+` + `livin_*.ts:48` | A Lagomplan-voiced letter (*"Esta guía nació de una pregunta que nos hacen nuestros huéspedes…"*) is signed with the partner name. | every `/guia` partner without a bespoke letter |
| F4 | `livin_condesa.ts:74-141`, `livin_roma.ts:63,101+`, `livin_polanco.ts:84+` | Livin's chef and massage blocks are correct *at the partner level* but copy-pasted across three files; `CHEF_WHATSAPP_NUMBER` (`lib/guia/links.ts:16`) is a Lagomplan number shared by all. | the three Livin guides |
| F6 | `GuiaClient.tsx:119-125` | Experience photos are keyed by Insider experience ids inside the component. | Insider cards |
| F7 | `GuiaClient.tsx:534-535` | Banner and "Powered by Lagomplan" strings are inline literals, not in `city.copy`; the second is English-only. | all demos |
| F8 | `cdmx.ts:218,421` | The Airalo affiliate link shows on every guide and demo. `[verified by running]` it returns 200. Harmless but monetised content appears on a sales demo. | ALL |
| F10 | `content/guia/demos/index.ts:71-73,87,153,172,176,180` | Demo defaults (how-to-book text, tagline, `mxcity_demo`, placeholder strings) are code, not schema. | all demos |
| F11 | `content/guia/partners/demo.ts` (registered at `content/guia/index.ts:22`) | A **legacy second "demo"**: a byte-for-byte copy of Livin Condesa (Veracruz 85, `displayName: 'Livin'`) published at `/guia/demo`. `[verified by running]` `curl` → 200, `noindex, nofollow`. It is not the same thing as `/demo/*`, and it will not follow edits made to `livin_condesa.ts`. | one extra public page |

### 13.5 How the FAQ module resolves (needed to read the table above)

`resolve.ts:31-75` `[read in code]`:
1. The module returns `null` unless the partner has `faqAnswers` or its zone has `answers` (`:36-40`).
2. For each item and each **language separately**: partner → zone → base default (`:51-56`).
3. An item with no body at any layer is dropped with no trace (`:59`). A missing translation therefore makes a card disappear in one language instead of failing.
4. Links come from the layer that supplied the body (`:66`).

For demos the zone is `zones[0]` only (`content/guia/demos/index.ts:113,155`), the known limitation from §12.

---

## 14. Test coverage

### 14.1 Coverage numbers

**Method** `[verified by running]`: `npx c8@10 --all` wrapped around the exact loop CI uses for unit tests (`for f in tests/*.ts; do npx tsx $f; done`, `.github/workflows/ci.yml`), then aggregated from `coverage-summary.json`. All 27 test files in `tests/*.ts` passed (no `FAIL` line). Jest was **not** included: it is not run in CI (below) and none of its 4 specs touch these folders. Playwright (e2e) is not instrumented, so anything covered only by e2e shows as 0%.

| Area | Lines | Branches | Files | Reading |
|---|---|---|---|---|
| `lib/guia` | **61.3%** (146/238) | 90.1% | 4 | `stay.ts` and `visit.ts` 100%; `links.ts` 68%; **`weather.ts` 0%** |
| `content/guia` (all) | **76.3%** (2335/3060) | 80.4% | 19 | inflated, see below |
| `content/guia`, logic only (excluding `cities/`, `zones/`, `partners/`) | **44.2%** (556/1257) | 83.4% | 9 | the honest number |
| `scripts/` (all files) | **15.4%** (184/1198) | 89.3% | 9 | 3 `scripts/lib/*` cores at 100%; the 6 CLI entry files at 0% |
| `scripts/lib` | 100% (184/184) | 93.9% | 3 | `demo-publish-core`, `demo-review-core`, `visits-core` |
| `scripts` CLI entries | 0% (0/1014) | n/a | 6 | `demo-check`, `demo-publish`, `demo-review`, `demo-visits` plus 2 unrelated seed/probe scripts |

Caveats that matter:
- **Data files look covered but are not asserted.** `cdmx.ts`, the three zone files and the Livin partner files show ~99% only because importing them executes every line. No test checks their content.
- **`content/guia/faq/base.ts` (134 lines) and `faq/resolve.ts` (75 lines) are at 0%.** The FAQ resolver, the layer that decides which cards every guide and demo shows, has no unit test. It runs only inside the e2e parity spec, which is not instrumented and checks structure, not resolution rules.
- `content/guia/types.ts` and `zones/types.ts` at 0% are type-only (no runtime lines); not a gap.
- The CLI entry files (`demo-publish.ts` 213 lines) contain the git/`gh`/`vercel` orchestration. Only their pure helpers are tested.

### 14.2 What each test protects and what it does not catch

CI facts `[read in code]`: `ci.yml` runs typecheck, the `tests/*.ts` loop, and a production build. `e2e.yml` runs `playwright test --project=desktop-chrome` on a production build. **Jest (`npm test`) and `tests/seo-validate.mjs` are not run by any workflow** (`grep jest|seo-validate .github/workflows` → no match; `seo-validate.mjs` is only referenced from `docs/seo-validation.md`).

| Test | Protects | Does **not** catch |
|---|---|---|
| `tests/demos-schema.test.ts` (29 assertions) | Zod shape, cross-field rules, placeholder detection, HMT placeholder state | rendering; whether an image *matches* its tour (the Coyoacán/Roma Norte mix-up passed validation); whether a logo is the prospect's logo; contrast; link liveness |
| `tests/demos-loader.test.ts` (31) | `buildDemoPartner` mapping, `VERCEL_ENV` filtering, HMT specifics (tours, images, chefs links) | how `GuiaClient` renders the result |
| `tests/demo-publish.test.ts` (27) | pure helpers: slug, ref, branch, "other changes", promote blockers | the actual git / `gh` / `vercel` calls (`demo-publish.ts` 0%) |
| `tests/demo-review.test.ts` (10) | `applyReview` (reviewer list, date rules, no overwrite) | file I/O and CLI wiring |
| `tests/demo-visits.test.ts` (22) | query building, fixed filters, aggregation, column whitelist | the live table, RLS, or what is actually stored |
| `tests/guia-visit.test.ts` (22) | `buildVisit` output satisfies the CHECK regexes | the real DB constraints (no DB in unit tests) |
| `tests/guia-stay.test.ts` (21) | `parseStay` validation and heading strings | the UI that consumes them |
| `tests/guia-partner-registry.test.ts` | registry + redirects for the Livin rename | content of any guide |
| `tests/seo-slugs-sitemap.test.ts` (11) | alias redirects and sitemap shape for `/guias` | `/guia` and `/demo` entirely |
| `tests/seo-validate.mjs` | canonical/hreflang/noindex on a running build, including every `content/demos/*` folder and the ES-only pages | **not in CI**; only runs when someone runs it by hand |
| `e2e/guia-parity.spec.ts` | every demo has the same sections/tabs/cards/groups as Livin, ES and EN | copy; placeholder content; visuals; links; images loading; which FAQ items render *for the right reason* |
| `e2e/smoke.spec.ts` | site smoke | no mention of `/guia` or `/demo` (`grep` → none) |
| `__tests__/*.jest.test.tsx` (4) | login copy, trip guard, affiliate fallback, alternate-locale URL | nothing in `/guia` or `/demo`; and **not run in CI** |

### 14.3 The six suspected gaps

| Gap | Verdict | Evidence |
|---|---|---|
| ES/EN key completeness | **Confirmed gap in tooling; currently clean.** No test compares ES and EN. A throwaway script found **0 differences** across `cdmx.copy` (every key, array length), neighborhood spot counts, the 3 zone files, the 3 Livin FAQ blocks and base labels. Only `faqBase.defaults.gyms` has identical ES/EN text, deliberately (`base.ts:82,90-91`). `[verified by running]` The danger is silent: a missing translation drops the card in that language (`resolve.ts:56-59`). Demos are protected for the fields the schema makes bilingual (`schema.ts:27-28`). |
| Placeholders rendered highlighted | **Partial, with one real hole.** `[verified by running]` On the live HMT page (EN) there are 14 `<mark>` placeholders (4× min booking time, 4× price, 3× operator WhatsApp, rules, massage, check-out) and **0** bracketed tokens outside a `<mark>`; Livin has 0. But nothing tests it, and `withPlaceholders` is not applied everywhere: **host-letter paragraphs are rendered raw** (`GuiaClient.tsx:620-629`), as are tour titles and teasers (`:174-175`), `stayGlance` email/Instagram (`StayGlance.tsx:44-49`) and the hero host name. The validator flags a `[bracket]` in `host_letter` as pending (`validate.ts`), but the page would show it as plain text. |
| Dead external links (Peek) | **Confirmed gap.** No link checker exists in `tests/`, `e2e/`, `scripts/` or `.github/`. One-off run `[verified by running]`: 18 unique external URLs found in `content/guia`, `content/demos`, `app/guia`, `lib/guia` (the 19th match, `schema.ts:26`, is a doc string) all return HTTP 200, including the four `book.peek.com` tour links and 10 Google Maps short links. `wa.me` and `lagomplan.com` were not probed. A 200 from Peek or `goo.gl` is necessary but not sufficient: both can serve 200 for a retired listing or redirect to a generic page, so a human must open each one. |
| Deterministic visual regression (weather block) | **Confirmed gap.** No screenshot assertion exists (`grep toHaveScreenshot e2e` → none). The parity spec compares structure only. The weather card fetches live Open-Meteo in the browser (`lib/guia/weather.ts:42-43,53`; `WeatherCard.tsx:38`) and the e2e does not stub it (`page.route` appears only in `e2e/README.md` and `e2e/support/helpers.ts` comments, never in `guia-parity.spec.ts`), so a pixel baseline changes with the forecast. This already happened during Phase D (ES-mobile height moved 20px and the baseline failed; server HTML was compared instead). |
| `og:image` per demo | **Confirmed gap.** Demos use the shared city banner (`app/demo/[prospect]/page.tsx:41`); `[verified by running]` HMT and Livin both return `…/images/guia/cdmx-banner.jpg`. A link shared on WhatsApp previews as Lagomplan's banner with no prospect branding. `seo-validate.mjs` checks `og:url` only; no test mentions `og:image`. |
| Accessibility basics | **Confirmed gap in tooling; partial in code.** No axe or a11y tool in `package.json`, `tests/` or `e2e/`. Not run, so contrast and focus are **unverified**. `[read in code]`: alt text on hero, cards, logos (`GuiaClient.tsx:162,170,544,567,598`); toggle uses `aria-pressed` + labelled group (`:577-589`); `document.lang` follows the toggle (`:448-450`); disclosure buttons use `aria-expanded` (`:205,305`). Weak spots: the zone tabs use `role="tablist"/"tab"/aria-selected` (`:689-699`) but have no `tabpanel`, `aria-controls` or arrow-key handling; `brand_color` flows into `--accent` (`:530`) with no contrast check; the `[placeholder]` mark colour is not checked. |

### 14.4 Manual review checklist (what only a human can catch)

Run once per demo, in ES and EN, at ~375 px and desktop, before anyone outside the team sees it:

1. **Images match their tours.** Open each tour card; the picture must show what the title says. (Today's HMT case: images of Coyoacán sat on the Roma Norte and Historic Center tours.)
2. **Text inside illustrations.** Signs, chalkboards and menus in generated images (e.g. a sign reading "Roma Norte" or "Coyoacán") must be correct, spelled right and not contradict the tour.
3. **The logo is the prospect's.** Not Lagomplan's, not a competitor's; legible at 42 px height, sharp on retina, not on a dark or transparent background that disappears.
4. **Brand colour** comes from the prospect's brand guide (not the provisional placeholder), is readable on cream and on pine, and the accent buttons keep sufficient contrast.
5. **Every claim made in the operator's name** is true: chefs, massages, rules, check-out, prices, minimum booking times. The prospect (or Pili) confirms these; the page cannot.
6. **Tour links open the right product** (not just a 200): the Peek page shows the tour named on the card, in the right language and currency.
7. **WhatsApp opens the right chat** with the right prefilled message; the number belongs to the operator (or, for the guarantee/chef cases, to Lagomplan).
8. **Maps lists** open the intended places.
9. **ES and EN read naturally** and agree with each other; tour names stay in English by rule.
10. **No Lagomplan-voiced copy is attributed to the operator** (the generic letter, "Booked through Insider", "Your Own Plan").
11. **Banner spelling** of the prospect's name and the page title.
12. **Link preview** looks acceptable when pasted into WhatsApp and iMessage (it will show the Lagomplan CDMX banner).
13. **Third-party rights**: no third-party images or logos beyond the prospect's own.
14. **Weather block** shows plausible data; the weekly rhythm is not misleading for the visit date.
15. **Review recorded** (`review.by`/`date`) before Production sharing, and the link carries `?ref=<slug>` so visits are attributable.

---

## 15. Done vs. not done

Against the original sales brief (five numbered items) and the approved Phases A–D (§12). Status as of `e69a6b8`.

### 15.1 Sales brief

| Item | Status | Evidence |
|---|---|---|
| 1a. Optional `llegada`, `noches`, `adultos`, `ninos`; validate; invalid = page unchanged | **Done** | `lib/guia/stay.ts`; applied in `GuiaClient.tsx:413`; `tests/guia-stay.test.ts` (21 assertions) |
| 1b. Bilingual header "Tus 3 noches en Condesa" / "Your 3 nights in Condesa" | **Done** | `lib/guia/stay.ts:59-64`, rendered `GuiaClient.tsx:602-604` |
| 1c. Highlight weekly-rhythm events that fall on the stay dates | **Not started** | weekly rhythm items are `{tag,title,body}` with no weekday or date (`cdmx.ts:284-289,486-491`); rendered without any date logic (`GuiaClient.tsx:824-832`). Needs a content-model change first |
| 1d. `ninos > 0` opens the kids mood | **Done** | `GuiaClient.tsx:416` |
| 2. `/demo/[prospect]` reusing the same component | **Done** | `app/demo/[prospect]/page.tsx:54-57` |
| 2. Per-prospect config: name, logo, accent, host letter, neighbourhood(s), check-out, own tours | **Done** (zones partial) | `content/guia/demos/schema.ts:73-127`. Up to 3 zones are accepted but only `zones[0]` drives the tab and the FAQ (`index.ts:113,155`), approved limitation in §12 |
| 2. noindex/nofollow, out of sitemap, no internal links | **Done** | `app/demo/[prospect]/page.tsx:24`; `[verified by running]` live HMT `noindex, nofollow`, sitemap has 0 `/demo/` entries; `grep "/demo/"` in `app/ components/ lib/ content/` finds no link to a demo page |
| 2. Discreet bilingual banner | **Done, one literal** | `GuiaClient.tsx:532-537`; "Powered by Lagomplan" is English-only (`:535`, F7) |
| 2. Cookie `lagom_ref = demo:{slug}` | **Done** | `GuiaClient.tsx:421-425` |
| 2. First demos `host-me-tender` and `dave-nat` | **Partial** | HMT live. `dave-nat` exists but is `environments:["preview"]` and minimal (no letter, no tours), so Production returns 404 (`[verified by running]`); it needs its property layer |
| 3. `demo_visits` + `guide_visits`: slug, time, lang, params present, summarised UA, no PII | **Done** | `supabase/migrations/20261008000000_guide_demo_visits.sql:11-53`; columns written by `lib/guia/visit.ts:11-52`; insert at `GuiaClient.tsx:434-445` |
| 3. RLS: public insert, no open SELECT | **Done in code; live state not re-verified here** | RLS enabled `:60-61`, `REVOKE ALL` from `anon`/`authenticated` `:68-69`, column-level `GRANT INSERT` `:70`, no SELECT policy in the file `[read in code]`. Supabase was not touched in this audit |
| 3. (extra) reading visits safely | **Done** | `npm run demo:visits` (aggregates only, fixed columns and filters) |
| 4. Planner prefilled from the guide (`start, end, nights, adults, children, destination`) via `initialValues`; form editable; never jump to generation | **Not started** | `HeroForm` already accepts `initialValues` (`components/forms/HeroForm.tsx:46,76`) but `GuiaClient.tsx:486-493` builds the planner link with UTM parameters only |
| 4. Partner CTA "Tu próximo viaje por México" / "Your next trip in Mexico", no same-city lodging | **Not started** | strings absent (`grep` in `app/ content/` → none); the CTA still reads `cdmx.ts:378,580` |
| 5. Guarantee line in footer and by place lists, linking to a Lagomplan WhatsApp (placeholder configurable) | **Not started** | strings absent (`grep` for the sentence in `app/ content/ lib/` → none) |

### 15.2 Phases A–D and follow-ups

| Phase | Status | Evidence |
|---|---|---|
| A. Merge the demo route | **Done** | PR #107 (`cede24c`), `[verified by running]` `git log --merges` |
| B. Demos as data in `content/demos/<slug>/` | **Done** | PR #111 (`a3972de`); `content/guia/demos/index.ts`; `scripts/sync-demo-assets.mjs` |
| C. Zod schema, validator, `demo:check` | **Done** | PR #112; `schema.ts`, `validate.ts`, `scripts/demo-check.ts` |
| D. `/nueva-demo`, preview → confirm → promote, Livin parity test | **Done** | PR #113; `.claude/commands/nueva-demo.md`, `scripts/demo-publish.ts`, `e2e/guia-parity.spec.ts` |
| Follow-ups: `demo:visits`, `demo:review`, ES-only exemption, `dave-nat` hidden, HMT `logo_note` | **Done** | PR #114 and #112/#113 |
| HMT chefs card + tour images | **Done** | PRs #115, #116 |

### 15.3 Open items inside "done"

- HMT is live with `review: null` and **16 pending placeholders** `[verified by running]` `npm run demo:check -- host-me-tender` (operator WhatsApp ×3, check-out, rules, house name and 3 nearby spots, price ×4, minimum booking time ×4, massage, `logo_note`) plus two warnings (42 px logo, provisional brand colour).
- Tour 2 (Historic Center) still shows a Coyoacán image (§14.4 item 1).
- `docs/demos/README.md` and `example.demo.json` do not document `faq.chefs_at_home_links` (`grep` → 0 matches).
- The first real `demo:promote` will list the infrastructure files from #112–#116 as "other changes" and require `--allow-other`.
- Production was deployed by CLI (not by Vercel's git integration), so `lagomSha` and the `production` tag are the only record of what is live.

---

## 16. Prioritised backlog (not implemented)

Effort: **S** ≤ half a day, **M** 1–2 days, **L** > 2 days. Order is the recommended order.

| # | Fix | Impact | Effort | Risk |
|---|---|---|---|---|
| 1 | Run `tests/seo-validate.mjs` and the Jest suite in CI (needs `next start` in the job; the build already exists there) | **High**: today nothing automatic guards the `noindex` on demos or the canonicals | S–M | Low; adds CI minutes, may expose latent failures |
| 2 | Wrap host-letter paragraphs, tour title/teaser, `stayGlance` email/Instagram and host name in `withPlaceholders`; add a unit test | **High**: a `[bracket]` in the letter currently renders as unmarked text in a sales page | S | Low; `GuiaClient`/`StayGlance` are touched, so behind the parity test |
| 3 | Per-demo `og:image` (optional `partner.og_image`, validated in `schema.ts`, synced with the logo) + a test | **High** for the sales use case (WhatsApp previews show Lagomplan's banner) | M | Low–Med; new asset path in the sync script |
| 4 | `demo:links`: HEAD/GET every external URL in a demo (Peek, Maps, Take a Chef), run in `demo:check --production` and weekly in CI | Med–High; Peek links are the demo's product | S | Low; false positives from bot blocking, 200-but-wrong stays a manual check |
| 5 | ES/EN completeness test (city copy keys and array lengths, zone answers, partner FAQ blocks, base labels) — the throwaway script from this audit is the starting point | Med; prevents silent vanishing cards | S | None |
| 6 | Unit tests for `resolveFaqModule` (layer precedence, per-language fallback, gate, link-layer rule) and `lib/guia/links.ts`, `weather.ts` category mapping | Med; the resolver is the least-tested logic that decides what every guest sees | S–M | None |
| 7 | Retire or redirect the legacy `/guia/demo` partner (`partners/demo.ts`, `index.ts:22`); check inbound links first | Med; removes a stale public copy of Livin data | S | Low–Med (needs a decision; may be referenced by old links) |
| 8 | Make the newsletter form demo-aware (hide it, or tag the source) so prospects cannot subscribe to the real Mailchimp list from a sales demo | Med | S | Low; touches shared `NewsletterSignup` |
| 9 | Deterministic visual checks: stub Open-Meteo with `page.route`, freeze the date, then `toHaveScreenshot` for HMT and Livin at two widths, ES and EN | Med | M | Med; snapshot upkeep and font-loading flakes (the Google Fonts fetch already flakes in CI) |
| 10 | Accessibility: add `@axe-core/playwright` for Livin + each demo; fix the tab pattern (`tabpanel`, `aria-controls`, arrow keys); add a WCAG contrast check of `brand_color` to the schema | Med | M | Low |
| 11 | Promote logo height < 64 px and a provisional colour from warning to **error** under `--production` (they are warnings today) | Med; stops soft logos reaching Production | S | Low; may block a demo someone wants to ship anyway (keep an explicit override) |
| 12 | Move demo hard-codes into schema/types: `arrivalItemsOmit`, default tagline and how-to-book text, `pilotId` (`index.ts:71-73,87,153,161`); document them in the README | Med | S | Low |
| 13 | Single source for the Insider WhatsApp number (`GuiaClient.tsx:94-97`, `cdmx.ts:357,559`) and for the Health & pharmacies text (`cdmx.ts:237,439`, `base.ts:121-132`) | Low–Med; removes drift | S | Low |
| 14 | Rewrite the base "Chefs at home" default so it does not promise a concierge, or gate it behind an opt-in flag (`base.ts:101-110`) | Low today, Med for future partners | S | Low (unreachable by current pages) |
| 15 | Delete the dead `weatherTemp`/`weatherBody` keys from the city copy (`cdmx.ts:282-283,484-485`; only `WeatherCard` renders weather, `WeatherCard.tsx:65-66`) | Low; editing them does nothing | S | None |
| 16 | Move the banner and "Powered by Lagomplan" strings into the copy objects, ES + EN (`GuiaClient.tsx:534-535`) | Low | S | Low |
| 17 | Documentation: add `chefs_at_home_links` to README and `example.demo.json`; sync this audit | Low | S | None |
| 18 | Brief item 5: guarantee line in footer and by the place lists, linking to a Lagomplan WhatsApp number (config) | Med | M | Low; needs the number and approved copy |
| 19 | Brief item 4: planner prefill via `initialValues` from guide params, plus the partner CTA copy; never auto-generate | Med–High for conversion | M | Med; touches the planner entry (`TripGeneratorClient`) |
| 20 | Multi-zone demos: let `zones[1..]` contribute tabs and FAQ layers (approved limitation in §12) | Low–Med | M | Med; changes the `Partner` zone model |
| 21 | Smoke tests for the CLI entry points (`demo-publish`, `demo-visits`, `demo-review`, `demo-check`) with fake `git`/`gh`/`vercel` on `PATH` | Low–Med | M | Low |
| 22 | Brief item 1c: highlight weekly-rhythm events by date (needs weekday/date in the content model, then logic and copy) | Med | L | Med |
| 23 | `dave-nat` property layer (letter, rules, tours) so it can leave Preview-only | Depends on the prospect | M (content-bound) | Low |
