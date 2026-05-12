/**
 * tests/classify-block.test.ts
 *
 * Lightweight regression suite for lib/planner/classify-block.
 * Self-contained — no test framework dependency. Run with:
 *
 *   npx tsx tests/classify-block.test.ts
 *
 * Exit code 0 on all-pass, 1 if anything failed. Suitable for CI
 * later if/when we add one for this layer.
 *
 * Coverage scope (Phase 1, per spec):
 *   - restaurant
 *   - transfer
 *   - hotel
 *   - free
 *
 * Tour / culture / nature aren't explicitly tested here (out of
 * Phase 1 scope), but a couple of cases are included as smoke
 * checks for the companion-type remap.
 */

import { classifyBlock, type ItemType } from '../lib/planner/classify-block'

type Case = readonly [
  label:    string,
  input:    { type?: string; title?: string; description?: string },
  expected: ItemType,
]

const cases: ReadonlyArray<Case> = [
  // ───────── RESTAURANT ─────────
  // Trust semantic type first (post-Edge-Fn rollout)
  ['semantic type=restaurant',           { type: 'restaurant', title: 'Cena en Pujol' },                          'restaurant'],

  // Legacy AI types that ended up as Libre in prod — must classify correctly now
  ['legacy type=food, title cena en',    { type: 'food',       title: 'Cena en La Casona' },                     'restaurant'],
  ['legacy type=food, title comida en',  { type: 'food',       title: 'Comida en Fonda Margarita' },             'restaurant'],
  ['legacy type=food, title desayuno en',{ type: 'food',       title: 'Desayuno en Café El Cardenal' },          'restaurant'],
  ['legacy type=food, title almuerzo en',{ type: 'food',       title: 'Almuerzo en Bistró Mosaico' },            'restaurant'],

  // Spanish restaurant naming — keyword expansion targets
  ['fonda in name',                      { type: 'food',       title: 'Fonda Margarita' },                       'restaurant'],
  ['taqueria',                           { type: 'food',       title: 'Tacos en Taquería Los Cocuyos' },         'restaurant'],
  ['marisquería',                        { type: 'food',       title: 'Marisquería Don Vergas' },                'restaurant'],
  ['parrilla',                           { type: 'food',       title: 'Parrilla Argentina La Cabrera' },         'restaurant'],
  ['café in title',                      { type: 'food',       title: 'Café de la mañana en El Pendulo' },       'restaurant'],
  ['bakery English',                     { type: 'food',       title: 'Sourdough at Tartine Bakery' },           'restaurant'],
  ['panadería',                          { type: 'food',       title: 'Pan dulce en Panadería Rosetta' },        'restaurant'],
  ['restaurant in name',                 { type: 'free',       title: 'Cena en Restaurante Quintonil' },         'restaurant'],
  ['bistro in name',                     { type: 'free',       title: 'Comida en bistro francés' },              'restaurant'],
  ['brunch',                             { type: 'free',       title: 'Brunch dominical' },                      'restaurant'],

  // ───────── HOTEL ─────────
  ['semantic type=hotel',                { type: 'hotel',      title: 'Check-in en Hotel Endémico' },            'hotel'],
  ['legacy type blank, hotel in title',  { type: '',           title: 'Llegada a Hotel La Casona' },             'hotel'],
  ['type=culture but title says check-in', { type: 'culture',  title: 'Check-in en Casa Lecanda' },              'hotel'],
  ['check-out',                          { type: 'free',       title: 'Check-out from Boutique Cuixmala' },      'hotel'],
  ['resort',                             { type: 'rest',       title: 'Llegada al Resort' },                     'hotel'],
  ['hostal',                             { type: 'free',       title: 'Hostal del Centro' },                     'hotel'],

  // ───────── TRANSFER ─────────
  ['semantic type=transfer',             { type: 'transfer',   title: 'Traslado al aeropuerto' },                'transfer'],
  ['legacy transport→transfer keyword',  { type: 'transport',  title: 'Transfer al hotel' },                     'transfer'],
  ['Spanish vuelo',                      { type: 'transport',  title: 'Vuelo a Mérida' },                        'transfer'],
  ['EN flight',                          { type: 'transport',  title: 'Flight to Tulum' },                       'transfer'],
  ['Uber',                               { type: 'free',       title: 'Uber al centro' },                        'transfer'],
  ['taxi',                               { type: 'free',       title: 'Taxi a la estación' },                    'transfer'],
  ['car rental EN',                      { type: 'free',       title: 'Pick up car rental' },                    'transfer'],
  ['renta de auto ES',                   { type: 'free',       title: 'Renta de auto en Vallarta' },             'transfer'],

  // ───────── FREE ─────────
  ['semantic type=free',                 { type: 'free',       title: 'Tarde libre' },                           'free'],
  ['nature companion → free',            { type: 'nature',     title: 'Día en la playa' },                       'free'],
  ['walk legacy → free via keyword',     { type: 'walk',       title: 'Caminata libre por el centro' },          'free'],
  ['rest legacy → free via spa keyword', { type: 'rest',       title: 'Tarde de spa' },                          'free'],
  ['playa as exploration',               { type: '',           title: 'Día de playa en Tulum' },                 'free'],
  ['descanso',                           { type: '',           title: 'Descanso por la tarde' },                  'free'],
  ['fully blank',                        {},                                                                      'free'],

  // ───────── COMPANION-TYPE SMOKE ─────────
  ['culture companion → tour',           { type: 'culture',    title: 'Visita al Museo Frida Kahlo' },           'tour'],
  ['semantic type=tour',                 { type: 'tour',       title: 'Tour gastronómico' },                     'tour'],
]

let passed = 0
let failed = 0
const failures: string[] = []

for (const [label, input, expected] of cases) {
  const got = classifyBlock(input)
  if (got === expected) {
    passed++
  } else {
    failed++
    failures.push(`  ✗ ${label}\n      input    ${JSON.stringify(input)}\n      expected ${expected}\n      got      ${got}`)
  }
}

const total = passed + failed
console.log(`\nclassify-block: ${passed}/${total} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failures.length) {
  console.log(failures.join('\n\n'))
  console.log()
  process.exit(1)
}
process.exit(0)
