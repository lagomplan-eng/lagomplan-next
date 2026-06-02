-- supabase/migrations/20260601_smart_finds_seed_phase_1.sql
--
-- Smart Finds seed — Phase 1: Valentina + Andrea + Roberto kits (7 kits, ~35 unique products).
--
-- Persona mapping from CSV labels → sf_persona enum:
--   Valentina  → familias  (baby / family travel)
--   Andrea     → parejas   (solo / couples / professional escape)
--   Roberto    → fan       (Mundial 2026 fan-day kit)
--
-- "The Kid" + "General" personas from the broader CSV are NOT included
-- in this phase — they need a schema decision first (3-enum schema can't
-- express "show to everyone"). Park for Phase 2.
--
-- Idempotency: every INSERT uses ON CONFLICT DO UPDATE so this script
-- is safe to re-run after editing copy in Supabase Studio (re-running
-- would overwrite Studio edits — only re-run when you want to reset).
--
-- All kits are content_type='flat' — no nested sections.
-- First product in each kit is marked hero (kit page needs exactly one).
--
-- Run via: paste into Supabase dashboard SQL editor.

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- PRODUCTS (deduplicated — products that appear in multiple kits get one row)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.sf_products (id, brand, name, tag, opinion, price, where_to_buy, link, aside, is_active) VALUES
  -- ── KIT 1 — Kit Playa Familiar ────────────────────────────────────────────
  ('monobeach-baby-beach-tent', 'Monobeach', 'Tienda pop-up UV playa',
   'PROTECCIÓN UV INSTANTÁNEA', 'Protege del sol y arena — arma en 60 seg.',
   '$30 USD', 'Amazon', 'https://amzn.to/3PC2CHh',
   'Cómpralo en Amazon.com — es más barato que en otros sitios.', true),

  ('swimways-baby-spring-float', 'SwimWays', 'Flotador con arnés bebé',
   'PARA BEBÉS 3–18 MESES', 'Para bebés 3–18 meses en alberca.',
   '$28 USD', 'Amazon', 'https://amzn.to/4uniYCC', NULL, true),

  ('thinkbaby-spf-50', 'Thinkbaby', 'Crema solar mineral kids SPF50+',
   'SIN QUÍMICOS AGRESIVOS', 'Sin químicos agresivos — desde recién nacido.',
   '$16 USD', 'Amazon', 'https://amzn.to/4eUKRNH', NULL, true),

  ('sealline-baja-dry-bag', 'SealLine', 'Bolsa de playa impermeable',
   'TELÉFONO + LLAVES A SALVO', 'Protege teléfono + llaves del agua.',
   '$35 USD', 'Amazon', 'https://amzn.to/4fx01sv', NULL, true),

  ('sawaruita-beach-toys', 'Sawaruita', 'Cubeta y pala compacta',
   'CABE EN CUALQUIER MALETA', 'Fácil de guardar en cualquier maleta.',
   '$12 USD', 'Amazon', 'https://amzn.to/3RD7koJ', NULL, true),

  ('alva-waterproof-diapers', 'Alva', 'Pañales impermeables',
   'RECOMENDADO', 'Pañales reutilizables impermeables — ideales para alberca y playa.',
   '$9 USD', 'Amazon', 'https://amzn.to/4ur5k1s', NULL, true),

  ('pampers-swim-diapers', 'Pampers', 'Pañales de natación desechables',
   'RECOMENDADO', 'Desechables — listos para tirar después del baño.',
   '$9 USD', 'Amazon', 'https://amzn.to/4dAfTrA', NULL, true),

  -- ── KIT 2 — Kit Dormir Lejos de Casa ──────────────────────────────────────
  ('skiphop-white-noise', 'Skiphop', 'Máquina de ruido blanco portátil',
   'LA MÁS COMPACTA', 'La más compacta — 10 sonidos — USB-C.',
   '$25 USD', 'Amazon', 'https://amzn.to/42D6hrf', NULL, true),

  ('guava-portable-crib', 'Guava', 'Cuna portátil ultraligera',
   'ARMA Y DESARMA EN 3 MIN', 'Arma y desarma en 3 min — bolsa incluida.',
   '$280 USD', 'Amazon', 'https://amzn.to/4nAXP5m', NULL, true),

  ('pack-n-play-fitted-sheet', 'Pack n Play', 'Sábana ajustable portátil',
   'COMPATIBLE CON CASI TODA CUNA', 'Compatible con casi cualquier cuna portátil.',
   '$18 USD', 'Amazon', 'https://amzn.to/4wGuLgT', NULL, true),

  ('honeykeeper-travel-toiletries', 'Honeykeeper', 'Travel baby toiletries (5-pack)',
   'KIT DE HIGIENE COMPLETO', 'Kit de viaje con todos los esenciales para el bebé.',
   '$15 USD', 'Amazon', 'https://www.amazon.com.mx/5PACK-BATHTIME-ARRIVAL-HONEYKEEPER-MIXTO/dp/B0BCSXZ5R7', NULL, true),

  ('keep-going-first-aid-kit', 'Keep Going', 'First aid kit de viaje',
   'BOTIQUÍN ESENCIAL', 'El botiquín que cabe en cualquier mochila.',
   '$25 USD', 'Amazon', 'https://amzn.to/4nGRkOl', NULL, true),

  ('momcozy-night-light', 'Momcozy', 'Luz nocturna + ruido blanco',
   '2-EN-1 PARA LA HABITACIÓN', 'Luz nocturna y máquina de sonido en uno.',
   '$27 USD', 'Amazon', 'https://amzn.to/3PWiXql', NULL, true),

  ('exergen-thermometer', 'Exergen', 'Termómetro temporal',
   'SIN CONTACTO', 'Lectura en 2 segundos — sin contacto.',
   '$25 USD', 'Amazon', 'https://amzn.to/42MjqhQ', NULL, true),

  -- ── KIT 3 — Kit Avión Sin Estrés ──────────────────────────────────────────
  ('joyspark-volume-headphones', 'Joyspark', 'Audífonos con límite de volumen',
   'BESTSELLER', 'Protegen oídos infantiles sin sacrificar la película.',
   '$17 USD', 'Amazon', 'https://amzn.to/4dZCJth', NULL, true),

  ('waterwipes', 'WaterWipes', 'Toallitas húmedas sin químicos',
   'BESTSELLER', 'Sin químicos — sirven para todo en el avión.',
   '$12 USD', 'Amazon', 'https://amzn.to/4uiEx7m', NULL, true),

  ('gobe-food-container', 'GoBe', 'Contenedor de comida para niños',
   'NO SE DERRAMA', 'A prueba de derrames — perfecto para snacks de vuelo.',
   '$22 USD', 'Amazon', 'https://amzn.to/4up8J0A', NULL, true),

  ('ergobaby-baby-carrier', 'Ergobaby', 'Baby carrier ergonómica',
   'MANOS LIBRES EN TRÁNSITO', 'Recién nacidos hasta 20 kg — manos libres para todo lo demás.',
   '$75 USD', 'Amazon', 'https://amzn.to/42NdnJK', NULL, true),

  ('keababies-changing-pad', 'Keababies', 'Cambiador portátil',
   'PLEGABLE Y LAVABLE', 'Se dobla en bolsillo — superficie impermeable.',
   '$13 USD', 'Amazon', 'https://amzn.to/4el9QYH', NULL, true),

  ('gb-pockit-all-city', 'GB', 'Carriola ultraligera Pockit+ All City',
   'LA MÁS PEQUEÑA EN CABINA', 'La más pequeña que entra en cabina.',
   '$189 USD', 'Amazon', 'https://amzn.to/4342m77', NULL, true),

  ('burts-bees-muslin', 'Burt''s Bees', 'Cobijas de muselina',
   'LIGERAS Y MULTIUSO', 'Cobija, manta de lactancia, cubre-carriola — todo en una.',
   '$33 USD', 'Amazon', 'https://amzn.to/4dTGuBs', NULL, true),

  -- ── KIT 4 — Sin perder a nadie ────────────────────────────────────────────
  ('apple-airtag-4pack', 'Apple', 'AirTag 4-pack',
   'EN MOCHILA + MALETA + CARRIOLA', 'En mochila + maleta + carriola — paz mental garantizada.',
   '$99 USD', 'Amazon', 'https://amzn.to/3PCVs5r', NULL, true),

  ('ridesafer', 'RideSafer', 'Asiento de viaje sin silla de auto',
   'NO MÁS CARGAR SILLA', 'Cumple normas de seguridad sin la voluminosidad de una silla de auto.',
   '$169 USD', 'Amazon', 'https://amzn.to/4eZa6OW', NULL, true),

  ('hiccapop-booster', 'Hiccapop', 'Booster inflable de viaje',
   'BOOSTER EN UNA MOCHILA', 'Booster que cabe en mochila — para Ubers y rentas.',
   '$40 USD', 'Amazon', 'https://amzn.to/4fynx8C', NULL, true),

  ('miamily-carry-on-seat', 'Miamily', 'Carry on con asiento integrado',
   'SE TRANSFORMA EN ASIENTO', 'Maleta de cabina que se convierte en asiento para el niño.',
   '$359 USD', 'Amazon', 'https://amzn.to/3PAjy0D', NULL, true),

  ('bagsmart-packing-tubes', 'Bagsmart', 'Tubos de empaque compresión',
   'COMPRIME SIN ARRUGAR', 'Cubos compactos para empacar el doble en la maleta.',
   '$30 USD', 'Amazon', 'https://amzn.to/4dWFYT6', NULL, true),

  -- ── KIT 5 — Kit Escapada Express ──────────────────────────────────────────
  ('swissgear-tech-backpack', 'Swissgear', 'Mochila compacta tech',
   'TODO EL TECH EN UN BOLSILLO', 'Cabe laptop + cables + papeles sin verse abultada.',
   '$100 USD', 'Amazon', 'https://amzn.to/42Zf1rY', NULL, true),

  ('beis-totebag-weekender', 'Béis', 'Tote bag weekender',
   'DE LA OFICINA AL HOTEL', 'El weekender que pasa de junta a vuelo sin escala.',
   '$110 USD', 'Béis (beistravel.com)', 'https://prz.io/j1KgbA8Ig', NULL, true),

  ('bagsmart-compression-cubes', 'Bagsmart', 'Cubos de empaque compresión set 4',
   'LA MALETA MÁS ORDENADA', 'La maleta más ordenada que habrás tenido.',
   '$22 USD', 'Amazon', 'https://amzn.to/4dvZPsk', NULL, true),

  ('mrs-dry-travel-bottles', 'Mrs Dry', 'Travel bottles',
   'TODO VISIBLE DE UN VISTAZO', 'Cuelga en el baño — todo visible de un vistazo.',
   '$10 USD', 'Amazon', 'https://amzn.to/433NDsK', NULL, true),

  ('fintie-document-holder', 'Fintie', 'Porta documentos compacto',
   'PASAPORTE + TARJETAS EN UNO', 'Pasaporte + tarjetas + efectivo en uno.',
   '$18 USD', 'Amazon', 'https://amzn.to/49SUSre', NULL, true),

  ('forge-tsa-lock', 'Forge', 'Candado TSA aprobado',
   'BÁSICO — NUNCA FALLA', 'Básico — nunca falla.',
   '$14 USD', 'Amazon', 'https://amzn.to/4f6hbND', NULL, true),

  -- ── KIT 6 — Kit Sin Cable Perdido ─────────────────────────────────────────
  ('bagsmart-cable-organizer', 'Bagsmart', 'Organizador de cables compacto',
   'SIN NUDO DE CABLES', 'Abre y todo está — sin nudo de cables.',
   '$18 USD', 'Amazon', 'https://amzn.to/4tWsMT1', NULL, true),

  ('anker-powercore-slim', 'Anker', 'Power bank delgado 10000mAh',
   'NO PESA — NO OCUPA', 'No pesa — no ocupa — nunca al 8%.',
   '$49 USD', 'Amazon', 'https://amzn.to/4fcgNxa', NULL, true),

  ('epicka-universal-adapter', 'Epicka', 'Adaptador universal 150+ países',
   'CARGA 4 AL MISMO TIEMPO', 'Carga 4 dispositivos al mismo tiempo.',
   '$50 USD', 'Amazon', 'https://amzn.to/4vc4F3V', NULL, true),

  ('airalo-esim', 'Airalo', 'eSIM internacional',
   'ACTIVAS ANTES DEL VUELO', 'Sin ir por chip al aeropuerto — activas antes del vuelo.',
   'Desde $5 USD', 'Airalo', 'https://airalo.tpm.li/xkRXTIKe', NULL, true),

  -- ── KIT 7 — Kit Fan Day ───────────────────────────────────────────────────
  ('gg-bags-clear-tote', 'GG Bags', 'Bolsa transparente reglamentaria FIFA',
   'OBLIGATORIA EN ESTADIOS FIFA', 'Obligatoria en estadios FIFA/MLS — pasa seguridad rápido.',
   '$10 USD', 'Amazon', 'https://amzn.to/4x151w7', NULL, true),

  ('frogg-toggs-poncho', 'Frogg Toggs', 'Poncho impermeable plegable UltraLite2',
   'SE DOBLA AL TAMAÑO DE UN PUÑO', 'Se dobla al tamaño de un puño.',
   '$30 USD', 'Amazon', 'https://amzn.to/4dLknMi', NULL, true),

  ('sunday-afternoons-upf-cap', 'Sunday Afternoons', 'Gorra con UPF 50 Ultra Adventure',
   'PARTIDOS DE DÍA CON SOL', 'Partidos de día con sol intenso.',
   '$22 USD', 'Amazon', 'https://amzn.to/4dRH4ys', NULL, true),

  ('hydro-flask-24oz', 'Hydro Flask', 'Termo bebida fría 24oz Standard Mouth',
   'AGUA FRÍA 24 HORAS', 'Agua fría por 24 horas en cualquier clima.',
   '$30 USD', 'Amazon', 'https://amzn.to/3RxPTWI', NULL, true),

  ('cetaphil-spf50-stick', 'Cetaphil', 'Protector solar en barra SPF50',
   'DURA TODO EL PARTIDO', 'No ensucia la mano — dura todo el partido.',
   '$7 USD', 'Amazon', 'https://amzn.to/4uJ2kxv', NULL, true)

ON CONFLICT (id) DO UPDATE SET
  brand        = EXCLUDED.brand,
  name         = EXCLUDED.name,
  tag          = EXCLUDED.tag,
  opinion      = EXCLUDED.opinion,
  price        = EXCLUDED.price,
  where_to_buy = EXCLUDED.where_to_buy,
  link         = EXCLUDED.link,
  aside        = EXCLUDED.aside,
  is_active    = EXCLUDED.is_active;


-- ─────────────────────────────────────────────────────────────────────────────
-- KITS (7 flat-content kits)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.sf_kits (id, num, title, subtitle, pain_moment, scene, persona, content_type, sort_order, is_active) VALUES
  ('kit-playa-familiar',         '01', 'Kit Playa Familiar',
   'Arena, sol y niños. Llega preparada.',
   'Sol, arena, y un bebé que no se queda quieto.',
   'Llegan a la playa con bebé. El sol pega fuerte, hay arena por todos lados, y olvidaste algo crítico. Otra vez.',
   'familias', 'flat', 1, true),

  ('kit-dormir-lejos-de-casa',   '02', 'Kit Dormir Lejos de Casa',
   'Para que duerman bien — y tú también.',
   'Llega la noche en un Airbnb y nadie duerme.',
   'El cuarto es nuevo. Las luces son raras. El bebé no se duerme. Tú tampoco.',
   'familias', 'flat', 2, true),

  ('kit-avion-sin-estres',       '03', 'Kit Avión Sin Estrés',
   'Tu hijo entretenido + tú tranquila.',
   '5 horas de vuelo con un niño aburrido.',
   'El vuelo es largo. El niño tiene energía. Necesitas un plan que no dependa de la tablet.',
   'familias', 'flat', 3, true),

  ('kit-sin-perder-a-nadie',     '04', 'Sin perder a nadie',
   'Rastreo, movilidad y paz mental.',
   'El taxi no acepta la carriola.',
   'Aeropuerto → Uber → hotel → restaurante → repetir. Y ese es solo el primer día.',
   'familias', 'flat', 4, true),

  ('kit-escapada-express',       '05', 'Kit Escapada Express',
   'De la oficina al hotel sin perder el tiempo.',
   'Viernes 6pm. Vuelo 8pm. Maleta sin hacer.',
   'Salir corriendo del trabajo, llegar al hotel sin perder tiempo en el lobby buscando el cargador.',
   'parejas', 'flat', 5, true),

  ('kit-sin-cable-perdido',      '06', 'Kit Sin Cable Perdido',
   'Gadgets, batería y señal. Los tres que no puedes perder.',
   'Llegas al hotel y el cargador se quedó en el escritorio de la oficina.',
   'Sin batería en el celular. Sin adaptador. Sin chip local. Tres problemas, ninguno divertido.',
   'parejas', 'flat', 6, true),

  ('kit-fan-day',                '07', 'Kit Fan Day',
   'El día del partido empieza mucho antes del kick-off.',
   'Cinco horas afuera del estadio bajo el sol.',
   'Tailgate, fila de seguridad, asientos al sol, lluvia inesperada. El día completo afuera, no solo los 90 minutos.',
   'fan', 'flat', 7, true)

ON CONFLICT (id) DO UPDATE SET
  num          = EXCLUDED.num,
  title        = EXCLUDED.title,
  subtitle     = EXCLUDED.subtitle,
  pain_moment  = EXCLUDED.pain_moment,
  scene        = EXCLUDED.scene,
  persona      = EXCLUDED.persona,
  content_type = EXCLUDED.content_type,
  sort_order   = EXCLUDED.sort_order,
  is_active    = EXCLUDED.is_active;


-- ─────────────────────────────────────────────────────────────────────────────
-- KIT → PRODUCT JUNCTIONS
--
-- For idempotency: delete existing junction rows for these 7 kits first,
-- then re-insert. Junction has no natural unique key (kit + product +
-- position) so we can't ON CONFLICT cleanly. This DELETE+INSERT block is
-- safe because the junction has no downstream FKs.
-- ─────────────────────────────────────────────────────────────────────────────

DELETE FROM public.sf_kit_section_products
WHERE kit_id IN (
  'kit-playa-familiar',
  'kit-dormir-lejos-de-casa',
  'kit-avion-sin-estres',
  'kit-sin-perder-a-nadie',
  'kit-escapada-express',
  'kit-sin-cable-perdido',
  'kit-fan-day'
);

INSERT INTO public.sf_kit_section_products (kit_id, product_id, position, is_hero) VALUES
  -- Kit 1
  ('kit-playa-familiar',         'monobeach-baby-beach-tent',    1, true),
  ('kit-playa-familiar',         'swimways-baby-spring-float',   2, false),
  ('kit-playa-familiar',         'thinkbaby-spf-50',             3, false),
  ('kit-playa-familiar',         'sealline-baja-dry-bag',        4, false),
  ('kit-playa-familiar',         'sawaruita-beach-toys',         5, false),
  ('kit-playa-familiar',         'alva-waterproof-diapers',      6, false),
  ('kit-playa-familiar',         'pampers-swim-diapers',         7, false),

  -- Kit 2
  ('kit-dormir-lejos-de-casa',   'skiphop-white-noise',          1, true),
  ('kit-dormir-lejos-de-casa',   'guava-portable-crib',          2, false),
  ('kit-dormir-lejos-de-casa',   'pack-n-play-fitted-sheet',     3, false),
  ('kit-dormir-lejos-de-casa',   'honeykeeper-travel-toiletries',4, false),
  ('kit-dormir-lejos-de-casa',   'keep-going-first-aid-kit',     5, false),
  ('kit-dormir-lejos-de-casa',   'momcozy-night-light',          6, false),
  ('kit-dormir-lejos-de-casa',   'exergen-thermometer',          7, false),

  -- Kit 3
  ('kit-avion-sin-estres',       'joyspark-volume-headphones',   1, true),
  ('kit-avion-sin-estres',       'waterwipes',                   2, false),
  ('kit-avion-sin-estres',       'gobe-food-container',          3, false),
  ('kit-avion-sin-estres',       'ergobaby-baby-carrier',        4, false),
  ('kit-avion-sin-estres',       'keababies-changing-pad',       5, false),
  ('kit-avion-sin-estres',       'gb-pockit-all-city',           6, false),
  ('kit-avion-sin-estres',       'burts-bees-muslin',            7, false),

  -- Kit 4 (gb-pockit-all-city + ergobaby-baby-carrier are reused from kit 3)
  ('kit-sin-perder-a-nadie',     'apple-airtag-4pack',           1, true),
  ('kit-sin-perder-a-nadie',     'gb-pockit-all-city',           2, false),
  ('kit-sin-perder-a-nadie',     'ergobaby-baby-carrier',        3, false),
  ('kit-sin-perder-a-nadie',     'ridesafer',                    4, false),
  ('kit-sin-perder-a-nadie',     'hiccapop-booster',             5, false),
  ('kit-sin-perder-a-nadie',     'miamily-carry-on-seat',        6, false),
  ('kit-sin-perder-a-nadie',     'bagsmart-packing-tubes',       7, false),

  -- Kit 5
  ('kit-escapada-express',       'swissgear-tech-backpack',      1, true),
  ('kit-escapada-express',       'beis-totebag-weekender',       2, false),
  ('kit-escapada-express',       'bagsmart-compression-cubes',   3, false),
  ('kit-escapada-express',       'mrs-dry-travel-bottles',       4, false),
  ('kit-escapada-express',       'fintie-document-holder',       5, false),
  ('kit-escapada-express',       'forge-tsa-lock',               6, false),

  -- Kit 6
  ('kit-sin-cable-perdido',      'bagsmart-cable-organizer',     1, true),
  ('kit-sin-cable-perdido',      'anker-powercore-slim',         2, false),
  ('kit-sin-cable-perdido',      'epicka-universal-adapter',     3, false),
  ('kit-sin-cable-perdido',      'airalo-esim',                  4, false),

  -- Kit 7
  ('kit-fan-day',                'gg-bags-clear-tote',           1, true),
  ('kit-fan-day',                'frogg-toggs-poncho',            2, false),
  ('kit-fan-day',                'sunday-afternoons-upf-cap',    3, false),
  ('kit-fan-day',                'hydro-flask-24oz',             4, false),
  ('kit-fan-day',                'cetaphil-spf50-stick',         5, false);

COMMIT;

-- Sanity check (run separately after the BEGIN/COMMIT block):
--   SELECT persona, COUNT(*) FROM public.sf_kits WHERE is_active = true GROUP BY persona;
--   SELECT kit_id, COUNT(*) FROM public.sf_kit_section_products GROUP BY kit_id ORDER BY kit_id;
--   SELECT COUNT(*) FROM public.sf_products WHERE is_active = true;
