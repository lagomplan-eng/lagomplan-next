# Azores — Stay22 link worksheet

**Actualización 2026-07-08 (v2):** las 6 filas (3 hoteles + 3 experiencias) ya NO
requieren shortlink por ahora — se publicó el link directo y limpio en el `.ts`
(hoteles → Booking.com, experiencias → GetYourGuide). Confirmado en código: el sitio
monetiza clics salientes a Booking.com/Hotels.com/Expedia vía el script LetMeAllez de
Stay22 (`app/[locale]/layout.tsx`). **Para GetYourGuide la cobertura de LetMeAllez NO
está confirmada en el código** (nunca se le menciona junto a Booking/Hotels.com/Expedia
en los comentarios de `layout.tsx` ni de `Stay22Guard.tsx`) — publicamos el link limpio
de todos modos por decisión explícita de Elena, aceptando que los 3 clics a GetYourGuide
podrían no monetizarse hasta que se generen shortlinks reales de
`getyourguide.stay22.com`. Vale la pena confirmar empíricamente (DevTools → Network, ver
si el clic redirige por stay22.com) antes de asumir que ya está resuelto del todo.

| # | Ítem | URL destino limpio | Formato final | Shortlink |
|---|---|---|---|---|
| 1 | ~~SENSI Azores Nature and SPA~~ | https://www.booking.com/hotel/pt/sensi-azores-nature-and-spa.en-gb.html | **RESUELTO** — link directo publicado | — |
| 2 | ~~White Exclusive Suites & Villas~~ | https://www.booking.com/hotel/pt/white-exclusive-suites-amp-villas.en-gb.html | **RESUELTO** — link directo publicado | — |
| 3 | ~~Octant Furnas~~ | http://booking.com/hotel/pt/octant-furnas.html | **RESUELTO** — link directo publicado | — |
| 4 | ~~Avistamiento de ballenas — Terra Azul~~ | https://www.getyourguide.com/azores-whale-watching-terra-azul-s9545/ | **RESUELTO (sin confirmar monetización)** — link directo publicado | — |
| 5 | ~~Sete Cidades & Lagoa do Fogo — Full Day Tour~~ | https://www.getyourguide.com/sao-miguel-l1663/sete-cidades-y-lagoa-do-fogo-tour-de-dia-completo-con-almuerzo-t62199/ | **RESUELTO (sin confirmar monetización)** — link directo publicado | — |
| 6 | ~~Furnas: piscinas termales nocturnas & cena~~ | https://www.getyourguide.com/sao-miguel-l1663/experiencia-nocturna-en-furnas-con-bano-termal-y-cena-t120166/ | **RESUELTO (sin confirmar monetización)** — link directo publicado | — |
