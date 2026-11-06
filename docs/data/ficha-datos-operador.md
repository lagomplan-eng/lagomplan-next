# Ficha de datos para operadores de renta de corta estancia

**Para:** operadores de alojamiento (primera lectora: Host Me Tender) · **Versión:** borrador del 29 de octubre de 2026 · **De:** Lagomplan

Esta ficha explica, en palabras sencillas, qué hacemos con los datos de los huéspedes que abren la guía de su alojamiento. Se basa solo en lo que revisamos en nuestro código y en nuestra base de datos el 29 de octubre de 2026 (el detalle técnico está en `docs/data/data-inventory.md`). Lo que no pudimos comprobar dice **[por confirmar]**.

> **Nota interna: borrar antes de enviar.**
> 1. Esta ficha no ofrece nada que el sistema no haga hoy. Dos cosas que quizá quieras decidir antes de enviarla: (a) si el operador debe saber ya que hay permisos de la base de datos por corregir (riesgos R1, R2 y R3 del inventario; la sección 5 lo dice en general y no promete una fecha), y (b) que nuestro aviso de privacidad publicado no coincide con lo que hace el producto (R11). 
> 2. Los plazos de conservación que prometemos en el aviso de privacidad (5 años, 13 meses, 30 días) hoy no los aplica ningún proceso. Aquí no los repetimos como si existieran.
> 3. Todo lo marcado **[por confirmar]** necesita una respuesta tuya o de un asesor legal antes de enviarse.

## 1. Qué datos guardamos, por qué y por cuánto tiempo

| Qué guardamos | Para qué | Dónde | Cuánto tiempo |
|---|---|---|---|
| **Una visita anónima a la guía:** cuál guía, idioma, tipo de dispositivo y navegador en general (por ejemplo "móvil · Safari"), los *nombres* de los datos que traía el enlace (no sus valores) y una etiqueta de campaña si el enlace la trae | Saber cuántas personas abren la guía y desde qué enlaces | Nuestra base de datos (Supabase) | Sin plazo definido y sin borrado automático hoy |
| **Una etiqueta de origen** en el navegador del huésped (la guía por la que llegó) | Saber si un viaje vino de la guía del operador | El navegador del huésped | Una cookie de 180 días y una copia sin fecha de vencimiento; siguen ahí hasta que el huésped las borre |
| **La cuenta del huésped**, solo si la crea: nombre, correo y contraseña (la contraseña la guarda Supabase protegida; nosotros no la vemos). Copiamos el correo a su perfil y le damos 3 viajes gratis | Que pueda guardar sus viajes | Supabase | Mientras exista la cuenta. Hoy no hay un botón para borrarla: se pide por correo y se hace a mano **[por confirmar el procedimiento y el plazo]** |
| **Los viajes guardados**, solo con cuenta: destino, origen, fechas, quién viaja, **edades de los niños**, estilo, presupuesto e intereses (texto libre que escribe el huésped), las notas y enlaces que agrega, códigos de reserva si los anota, y la etiqueta de la guía de origen | Mostrarle su viaje, rehacerlo y usarlo en el celular | Supabase | Hasta que el huésped borre ese viaje o se elimine su cuenta. Sin plazo automático |
| **La elección de cookies**: qué eligió, la versión del aviso, el idioma, si su navegador pidió no ser rastreado, su cuenta si había iniciado sesión, un código irreversible derivado de su IP y **el nombre completo de su navegador** | Poder demostrar que respetamos su elección | Supabase | Sin plazo; no se borra |
| **Pagos**: guardamos el identificador de cliente y de suscripción, el plan y los viajes disponibles. **No** guardamos la tarjeta | Dar acceso al plan que pagó | Supabase (los datos de la tarjeta los maneja Stripe) | Mientras exista la cuenta |
| **Boletín y checklist**: correo (y nombre en el checklist), y etiquetas de qué descargó y desde qué campaña | Enviarle lo que pidió | Mailchimp | Hasta que se dé de baja **[por confirmar si se borra o solo se marca como baja]** |
| **Mensajes del formulario de contacto**: nombre, correo, asunto y mensaje | Responderle | Nuestro código primero lo guarda en la base de datos y solo después envía el aviso por correo. **Hoy ese guardado falla** (la tabla no existe), así que **[por confirmar] si el mensaje llega**. El nombre y el correo sí quedan en los registros técnicos del servidor | **[por confirmar]** cuánto conservan esos registros nuestros proveedores |
| **Registros técnicos de los proveedores** (dirección IP, página visitada, navegador de cada petición) | Que el sitio funcione y detectar fallas | Vercel y Supabase | **[por confirmar]** (depende de su plan) |

## 2. Qué NO guardamos nunca

Esta lista es lo que **hoy no existe** en nuestro sistema, comprobado el 29 de octubre de 2026. Convertirlo en un compromiso de "nunca" lo haremos por escrito en el contrato **[por confirmar]**.

- **Datos de la tarjeta** (número, vencimiento, código): los recibe solo Stripe.
- **La dirección IP completa** en las visitas a la guía. (Solo guardamos un código irreversible en la elección de cookies.)
- **Las fechas, noches, adultos y niños** que algunos enlaces de la guía traen: sirven para mostrar la guía y **no se guardan en nuestra base de datos**. Ojo: si el huésped aceptó cookies de analítica, Google Analytics sí ve la dirección web completa.
- **Teléfono, fecha de nacimiento, documentos de identidad o ubicación GPS**: la aplicación no los pide.
- **Nombre, correo o número de cuenta** del huésped en lo que enviamos a la inteligencia artificial (Anthropic): no se envían.
- **Reservaciones o datos de los huéspedes del operador**: hoy no hay ninguna conexión con sistemas de reservas, así que no los tenemos.
- Nuestro aviso de privacidad dice que **no vendemos datos personales** y no encontramos código que lo contradiga. (Sí usamos Google Analytics y el píxel de Meta con el consentimiento del huésped, como se explica en la sección 4.)

## 3. Qué pasa en cada paso del huésped

**a) Mira la guía del operador.** Se guarda una visita anónima (sección 1) y una etiqueta de origen en su navegador. La guía consulta el clima de la Ciudad de México a un servicio externo (Open-Meteo), que ve la dirección IP del huésped. **Esta página no muestra aviso de cookies**: el huésped no puede aceptar ni rechazar ahí (hoy solo puede hacerlo en el sitio principal) **[por confirmar cómo se resolverá]**. Si ya había aceptado la analítica, Google Analytics registra la visita con su dirección web completa.

**b) Usa el planificador sin cuenta.** Sus respuestas viajan en la **dirección web** de la página (origen, destino, fechas, quién viaja, edades de niños, intereses y presupuesto). Si aceptó cookies de analítica, esa dirección llega a Google Analytics; si aceptó todas, también a Meta. Para armar el viaje enviamos esas respuestas a Anthropic (destino, fechas, número de viajeros, edades de niños, intereses). Sin cuenta puede generar **un viaje gratis**, y **no guardamos el viaje en nuestra base de datos**: vive en su navegador mientras la pestaña esté abierta. Los registros técnicos del servidor sí pueden conservar el destino y un fragmento de la respuesta **[por confirmar el plazo]**. Al escribir un lugar, el buscador de Google recibe lo que teclea.

**c) Crea una cuenta o inicia sesión.** Guardamos su nombre, correo y contraseña protegida (Supabase), una copia del correo en su perfil y 3 viajes gratis. Si ya había elegido cookies, se registra esa elección. Su identificador de cuenta puede ir a Google Analytics y, si aceptó todas las cookies, a Meta.

**d) Guarda o comparte un viaje.** Guardar exige cuenta: se crea el viaje con todo lo de la sección 1. Compartir genera un enlace secreto; **quien tenga ese enlace puede ver el viaje**. El correo del huésped no lo escribe nuestro código en el viaje, pero **[por confirmar]** si algún viaje antiguo lo conserva.

**e) Toca un botón de reserva o de experiencia.** En nuestra base de datos **no se guarda nada**. Google Analytics registra el clic (qué botón, de qué guía). El sitio al que va (Insider, Peek, Localbird, Airalo, Stay22 u otro) recibe la visita con la dirección del enlace; los enlaces de Insider llevan etiquetas de campaña con el nombre de la guía, y los de Stay22 en el planificador llevan el destino y las fechas del viaje. Esos sitios tienen sus propias políticas.

## 4. Quién más recibe datos y para qué

| Proveedor | Para qué | Qué recibe | ¿Antes de que el huésped acepte cookies? |
|---|---|---|---|
| **Supabase** (base de datos y cuentas; servidores en Estados Unidos, región us-east-2 **[por confirmar]**) | Guardar cuentas, viajes y visitas | Todo lo de la sección 1 | Sí (es el servicio mismo) |
| **Vercel** (alojamiento del sitio) | Mostrar la página | Dirección IP, página y navegador de cada visita | Sí |
| **Google Analytics** | Medir el uso del sitio | La dirección web completa, eventos de uso y, con sesión iniciada, el identificador de cuenta. No recibe el correo | El programa se carga siempre; las cookies y la medición completa solo si el huésped acepta (no puede decidirlo en las guías) |
| **Meta (Facebook) Pixel** | Publicidad y conversiones | Páginas vistas y eventos, con la dirección web | **No**: solo si el huésped acepta todas las cookies |
| **Anthropic** (la inteligencia artificial) | Armar el itinerario | Destino, origen, fechas, viajeros, edades de niños, estilo, presupuesto e intereses. No el nombre ni el correo | No hace falta: se usa cuando el huésped pide un viaje. Cuánto tiempo conserva Anthropic esa información: **[por confirmar]** |
| **Mailchimp** | Boletín y checklist | Correo (y nombre en el checklist) y etiquetas. Además un programa de Mailchimp se carga en las páginas del sitio principal | El programa sí; el correo solo cuando el huésped lo escribe |
| **Resend** | Enviar correos (contacto y checklist) | Correo y nombre de quien escribe | Solo cuando el huésped lo pide |
| **Stripe** | Cobrar | Correo, plan e identificador de cuenta. La tarjeta se escribe en la página de Stripe | Solo al pagar |
| **Stay22** | Enlaces de hoteles y actividades con comisión | Un programa se carga en el sitio principal; los enlaces del planificador llevan destino, fechas y número de adultos | El programa sí, en el sitio principal |
| **Google Maps** | Autocompletar lugares en el planificador | Lo que el huésped teclea, letra por letra | Sí, al abrir el formulario |
| **Open-Meteo** | Clima en las guías | Solo la dirección IP del navegador (las coordenadas son fijas) | Sí |
| **Unsplash y Google Fonts** | Algunas imágenes y una tipografía en dos páginas | La dirección IP del navegador | Sí |
| **Sitios de reserva** (Insider, Peek, Localbird, Airalo, Take a Chef, OpenTable, Resy, TheFork, Uber, entre otros) | Que el huésped reserve | Solo lo reciben si el huésped hace clic | No aplica |

## 5. Quién puede ver los datos

- **El equipo de Lagomplan**, desde los paneles de Supabase, Vercel, Google Analytics, Mailchimp y Stripe. **[Por confirmar]** quiénes tienen acceso hoy y con qué nivel.
- **El operador:** hoy **no** tiene acceso a nuestra base de datos ni a los datos de sus huéspedes. Lo que podemos darle son conteos agregados de visitas a su guía **[por confirmar cómo y con qué frecuencia]**.
- **El huésped:** sus propios viajes cuando inicia sesión. Quien reciba un enlace de viaje compartido también puede verlo.
- **Otros usuarios con cuenta y otras personas:** el sistema debe impedir que alguien vea viajes o datos que no le corresponden, y debemos revisar y endurecer esos permisos antes de manejar datos de reservaciones **[por confirmar fecha y resultado de la revisión]**.
- **Los proveedores de la sección 4**, según lo que cada uno recibe.

## 6. Qué cambia si el operador quiere que guardemos sus reservaciones

Hoy no guardamos ninguna. Si lo hiciéramos, cambiarían estas cosas:

1. **Datos nuevos:** nombre y contacto del huésped, fechas de estancia, propiedad, número de personas y notas. Tendremos que acordar cuáles son indispensables y no recoger documentos de identidad salvo que haga falta.
2. **Quién es responsable:** por lo general el operador decide para qué se usan los datos de sus huéspedes y Lagomplan los trata por encargo suyo. Eso se firma en un contrato de tratamiento de datos **[por confirmar con asesoría legal, bajo la ley mexicana de protección de datos personales]**.
3. **Dónde se guardan:** hoy nuestros servidores están en Estados Unidos. Hay que decidir si el operador necesita avisar a sus huéspedes de esa transferencia **[por confirmar]**.
4. **Quién los ve:** solo el operador y el equipo de Lagomplan que él autorice. Hoy el sistema **no tiene una separación por operador**: habría que construirla antes de guardar reservaciones de más de un operador.
5. **Cuánto tiempo y cómo se borran:** hoy no hay borrado automático ni forma de pedir la eliminación desde la cuenta. Antes de guardar reservaciones definiremos plazos por escrito, y una forma de acceder, corregir o borrar esos datos.
6. **Avisos:** el aviso de privacidad del operador y el nuestro deberán decir lo mismo que hace el sistema. El nuestro hoy **no coincide del todo** con lo que ocurre (menciona proveedores que no usamos y no menciona algunos que sí) y hay que corregirlo **[por confirmar fecha]**.
7. **Seguridad:** antes de manejar reservaciones, cerraremos las correcciones de permisos pendientes (sección 5), evitaremos que nombres y correos queden en los registros técnicos y revisaremos qué proveedores adicionales intervendrían.
8. **Lo que necesitamos del operador:** qué datos quiere guardar y para qué, quién de su equipo debe tener acceso, cuánto tiempo quiere conservarlos y a qué correo atender las solicitudes de sus huéspedes **[por confirmar]**.
