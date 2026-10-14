# Auditoría de demos co-branded (`/demo/[slug]`)

Fecha: 2026-10-12 · Modo: solo lectura · Repo: `~/Claude/lagomplan-next`
Rama auditada para código: `feature/demo-route-rebased` @ `78ba2b8` (leída con `git show`/`git grep`, sin cambiar de rama).
Convención: **confirmado** = lo vi en código/Git/GitHub en esta sesión; **no confirmado** = no pude verificarlo.
Las rutas `archivo:línea` de la demo son de `78ba2b8`.

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
