/**
 * scripts/test-sonnet-4-6-shape.ts
 *
 * Diagnostic for the Sonnet 4.0 → 4.6 migration. Sends a real trip-
 * generation prompt to Claude 4.6 via the Anthropic API and verifies
 * the tool_use response shape against what `normalizeTripData` in
 * TripResult.tsx expects.
 *
 * Why this exists: the previous migration attempt (commit e961006)
 * was reverted because Sonnet 4.6 produced a tool-use response shape
 * the front-end normalizer couldn't parse (days.length === 0). The
 * failure was intermittent. This script reproduces it deterministically
 * across multiple trip configurations so the fix is targeted, not
 * defensive.
 *
 * Run with:
 *   ANTHROPIC_API_KEY=<key> npx tsx scripts/test-sonnet-4-6-shape.ts
 *
 * Optional flags:
 *   --runs=N        Number of attempts per scenario (default 3).
 *                   Higher catches intermittent shape variance.
 *   --model=NAME    Override model ID (default claude-sonnet-4-6).
 *                   Useful for comparing 4.0 vs 4.6 vs other models.
 *   --verbose       Print the full tool_use.input on every run.
 */

import { setTimeout as sleep } from 'node:timers/promises'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
if (!ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY env var.')
  process.exit(1)
}

const args = process.argv.slice(2)
const RUNS    = Number(args.find(a => a.startsWith('--runs='))?.split('=')[1] ?? '3')
const MODEL   = args.find(a => a.startsWith('--model='))?.split('=')[1] ?? 'claude-sonnet-4-6'
const VERBOSE = args.includes('--verbose')

// ── System prompt (copied verbatim from supabase/functions/generate-trip/index.ts) ─
const SYSTEM_PROMPT = `Eres un experto planificador de viajes mexicano con profundo conocimiento de destinos,
gastronomía, cultura y logística en México.
Tu tono es cálido y cercano, como un amigo experto que recomienda, no un guía turístico genérico.
Usas información real: nombres de restaurantes, carreteras, tiempos de manejo, tips locales.

REGLA DE ALOJAMIENTO (CRÍTICA):
Si el viaje incluye al menos una noche (overnight === true), DEBES llenar el campo
"accommodations" con al menos una entrada que cubra TODAS las noches del viaje.

Cuando el usuario te pida un itinerario, llama a la herramienta emit_trip con los datos completos.
No respondas con texto, sólo con la llamada a la herramienta.

IMPORTANTE: Escribe TODO el contenido del itinerario en español.`

// ── Trip schema (copied verbatim from generate-trip/index.ts) ────────────────
const budgetLine = {
  type: 'object',
  required: ['label', 'range'],
  properties: { label: { type: 'string' }, range: { type: 'string' } },
}

const accommodationItem = {
  type: 'object',
  required: ['city', 'accommodationType', 'rationale', 'priceTier', 'checkInDate', 'checkOutDate', 'nights'],
  properties: {
    city:              { type: 'string' },
    neighborhood:      { type: 'string' },
    accommodationType: { type: 'string', enum: ['hotel', 'boutique', 'hostel', 'apartment', 'resort', 'cabin', 'glamping', 'unspecified'] },
    rationale:         { type: 'string' },
    priceTier:         { type: 'string', enum: ['budget', 'mid', 'upscale', 'luxury'] },
    familyFriendly:    { type: 'boolean' },
    checkInDate:       { type: 'string' },
    checkOutDate:      { type: 'string' },
    nights:            { type: 'integer' },
  },
}

const TRIP_SCHEMA = {
  type: 'object',
  required: ['title', 'tagline', 'hero_tags', 'before_you_go', 'days', 'budget_breakdown', 'accommodations'],
  properties: {
    title:    { type: 'string' },
    tagline:  { type: 'string' },
    hero_tags: {
      type: 'object',
      required: ['from', 'duration', 'travelers', 'budget'],
      properties: {
        from:      { type: 'string' },
        duration:  { type: 'string' },
        travelers: { type: 'string' },
        budget:    { type: 'string' },
      },
    },
    before_you_go: {
      type: 'object',
      required: ['departure_details', 'best_time_to_leave', 'what_to_pack', 'tips'],
      properties: {
        departure_details:  { type: 'string' },
        best_time_to_leave: { type: 'string' },
        what_to_pack:       { type: 'array', items: { type: 'string' } },
        tips:               { type: 'array', items: { type: 'string' } },
      },
    },
    days: {
      type: 'array',
      items: {
        type: 'object',
        required: ['day_number', 'day_label', 'title', 'objective', 'blocks'],
        properties: {
          day_number: { type: 'integer' },
          day_label:  { type: 'string' },
          title:      { type: 'string' },
          objective:  { type: 'string' },
          blocks: {
            type: 'array',
            items: {
              type: 'object',
              required: ['time', 'title', 'description', 'type'],
              properties: {
                time:        { type: 'string' },
                title:       { type: 'string' },
                description: { type: 'string' },
                type:        { type: 'string', enum: ['hotel', 'restaurant', 'tour', 'transfer', 'culture', 'nature', 'free'] },
              },
            },
          },
        },
      },
    },
    budget_breakdown: {
      type: 'object',
      required: ['accommodation', 'food', 'activities', 'transport', 'total'],
      properties: {
        accommodation: budgetLine,
        food:          budgetLine,
        activities:    budgetLine,
        transport:     budgetLine,
        total:         budgetLine,
      },
    },
    accommodations: {
      type: 'array',
      items: accommodationItem,
    },
  },
}

// ── Test scenarios — vary along the axes that historically produced different shapes ─
interface Scenario {
  name:     string
  prompt:   string
  expected: { minDays: number; minBlocksPerDay: number }
}

const SCENARIOS: Scenario[] = [
  {
    name:   'short single-city (3 days CDMX)',
    prompt: `Genera un itinerario de viaje con estos datos:
- Origen: Monterrey
- Destino: Ciudad de México
- Duración: 3 días (2 noches)
- Fechas: 2026-06-15 → 2026-06-17
- Viajeros: 2 personas
- Estilo: cultural
- Presupuesto: medio
- Intereses: gastronomía, arte
Cada día debe tener entre 4 y 7 bloques.`,
    expected: { minDays: 3, minBlocksPerDay: 4 },
  },
  {
    name:   'medium single-city (7 days Oaxaca)',
    prompt: `Genera un itinerario de viaje con estos datos:
- Origen: Ciudad de México
- Destino: Oaxaca
- Duración: 7 días (6 noches)
- Fechas: 2026-07-01 → 2026-07-07
- Viajeros: 4 personas
- Estilo: familiar
- Presupuesto: medio
- Intereses: cultura, gastronomía, playas
Cada día debe tener entre 4 y 7 bloques.`,
    expected: { minDays: 7, minBlocksPerDay: 4 },
  },
  {
    name:   'long single-city (12 days CDMX) — stress test for max_tokens',
    prompt: `Genera un itinerario de viaje con estos datos:
- Origen: Guadalajara
- Destino: Ciudad de México
- Duración: 12 días (11 noches)
- Fechas: 2026-08-01 → 2026-08-12
- Viajeros: 2 personas
- Estilo: aventurero
- Presupuesto: alto
- Intereses: arte, gastronomía, vida nocturna
Cada día debe tener entre 4 y 7 bloques.`,
    expected: { minDays: 12, minBlocksPerDay: 4 },
  },
]

// ── Result type + validation ─────────────────────────────────────────────────

interface RunResult {
  scenario:      string
  attempt:       number
  ok:            boolean
  stopReason:    string | null
  inputTokens:   number | null
  outputTokens:  number | null
  ms:            number
  topLevelKeys:  string[]
  daysIsArray:   boolean
  daysLength:    number
  firstDayKeys:  string[]
  firstBlockKeys: string[]
  blocksKey:     'blocks' | 'items' | 'activities' | 'unknown' | 'missing'
  failures:      string[]
}

function inspectToolUse(input: any): Omit<RunResult, 'scenario' | 'attempt' | 'ok' | 'stopReason' | 'inputTokens' | 'outputTokens' | 'ms'> {
  const failures: string[] = []
  const topLevelKeys = input && typeof input === 'object' ? Object.keys(input) : []

  const daysIsArray = Array.isArray(input?.days)
  const days        = daysIsArray ? input.days : []
  const daysLength  = days.length

  if (!daysIsArray) failures.push('days is not an array (or missing)')
  if (daysIsArray && daysLength === 0) failures.push('days array is empty')

  const firstDay = days[0]
  const firstDayKeys = firstDay && typeof firstDay === 'object' ? Object.keys(firstDay) : []

  // Identify which key holds the per-day blocks (schema says "blocks";
  // normalizer also accepts "items"; some Claude versions emit "activities").
  let blocksKey: RunResult['blocksKey'] = 'missing'
  let blocks: any[] = []
  if (firstDay && typeof firstDay === 'object') {
    if (Array.isArray(firstDay.blocks)) { blocksKey = 'blocks';     blocks = firstDay.blocks }
    else if (Array.isArray(firstDay.items)) { blocksKey = 'items'; blocks = firstDay.items }
    else if (Array.isArray(firstDay.activities)) { blocksKey = 'activities'; blocks = firstDay.activities; failures.push(`per-day key is "activities" — normalizer expects "blocks" or "items"`) }
    else {
      const arrayKeys = Object.entries(firstDay).filter(([_, v]) => Array.isArray(v)).map(([k]) => k)
      if (arrayKeys.length > 0) { blocksKey = 'unknown'; failures.push(`unexpected per-day array key(s): ${arrayKeys.join(', ')}`) }
      else { failures.push('no per-day blocks array found') }
    }
  }

  const firstBlock = blocks[0]
  const firstBlockKeys = firstBlock && typeof firstBlock === 'object' ? Object.keys(firstBlock) : []

  // Validate the block has the four required fields the schema demands.
  const required = ['time', 'title', 'description', 'type']
  if (firstBlock && typeof firstBlock === 'object') {
    const missing = required.filter(k => !(k in firstBlock))
    if (missing.length) failures.push(`first block missing required fields: ${missing.join(', ')}`)
  }

  return {
    topLevelKeys,
    daysIsArray,
    daysLength,
    firstDayKeys,
    firstBlockKeys,
    blocksKey,
    failures,
  }
}

// ── Single attempt ───────────────────────────────────────────────────────────

async function runOnce(scenario: Scenario, attempt: number): Promise<RunResult> {
  const started = Date.now()
  let stopReason: string | null = null
  let inputTokens: number | null = null
  let outputTokens: number | null = null
  let input: any = null

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 16000,
        system:     SYSTEM_PROMPT,
        tools: [{
          name:        'emit_trip',
          description: 'Emite el itinerario de viaje estructurado.',
          input_schema: TRIP_SCHEMA,
        }],
        tool_choice: { type: 'tool', name: 'emit_trip' },
        messages: [{ role: 'user', content: scenario.prompt }],
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return {
        scenario: scenario.name, attempt,
        ok: false, stopReason: 'http_error', inputTokens, outputTokens,
        ms: Date.now() - started,
        topLevelKeys: [], daysIsArray: false, daysLength: 0,
        firstDayKeys: [], firstBlockKeys: [], blocksKey: 'missing',
        failures: [`HTTP ${res.status}: ${text.slice(0, 300)}`],
      }
    }

    const data = await res.json() as {
      stop_reason?: string
      usage?: { input_tokens?: number; output_tokens?: number }
      content?: { type: string; name?: string; input?: any }[]
    }

    stopReason   = data.stop_reason ?? null
    inputTokens  = data.usage?.input_tokens  ?? null
    outputTokens = data.usage?.output_tokens ?? null

    const toolUse = Array.isArray(data.content)
      ? data.content.find(c => c.type === 'tool_use' && c.name === 'emit_trip')
      : null
    input = toolUse?.input ?? null
  } catch (err) {
    return {
      scenario: scenario.name, attempt,
      ok: false, stopReason: 'fetch_failed', inputTokens, outputTokens,
      ms: Date.now() - started,
      topLevelKeys: [], daysIsArray: false, daysLength: 0,
      firstDayKeys: [], firstBlockKeys: [], blocksKey: 'missing',
      failures: [err instanceof Error ? err.message : String(err)],
    }
  }

  if (!input) {
    return {
      scenario: scenario.name, attempt,
      ok: false, stopReason, inputTokens, outputTokens,
      ms: Date.now() - started,
      topLevelKeys: [], daysIsArray: false, daysLength: 0,
      firstDayKeys: [], firstBlockKeys: [], blocksKey: 'missing',
      failures: ['no tool_use block in response'],
    }
  }

  const inspection = inspectToolUse(input)

  // Apply scenario-specific expectations.
  if (inspection.daysLength > 0 && inspection.daysLength < scenario.expected.minDays) {
    inspection.failures.push(`expected ≥${scenario.expected.minDays} days, got ${inspection.daysLength}`)
  }

  if (VERBOSE) {
    console.log('\n--- VERBOSE: tool_use.input ---')
    console.log(JSON.stringify(input, null, 2).slice(0, 4000))
    console.log('--- end verbose ---\n')
  }

  return {
    scenario: scenario.name, attempt,
    ok: inspection.failures.length === 0,
    stopReason, inputTokens, outputTokens,
    ms: Date.now() - started,
    ...inspection,
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n┌─ Testing model: ${MODEL}`)
  console.log(`├─ Scenarios:     ${SCENARIOS.length}`)
  console.log(`├─ Runs each:     ${RUNS}`)
  console.log(`└─ Total calls:   ${SCENARIOS.length * RUNS}\n`)

  const results: RunResult[] = []
  for (const scenario of SCENARIOS) {
    console.log(`▸ ${scenario.name}`)
    for (let i = 1; i <= RUNS; i++) {
      process.stdout.write(`    attempt ${i}/${RUNS}... `)
      const r = await runOnce(scenario, i)
      results.push(r)
      const status = r.ok ? '✓' : '✗'
      const tokens = r.outputTokens ? `${r.outputTokens}out` : 'no-tokens'
      const days   = r.daysIsArray ? `${r.daysLength}d` : 'no-days'
      console.log(`${status}  stop=${r.stopReason ?? '?'}  ${tokens}  ${days}  ${r.ms}ms  blocksKey=${r.blocksKey}`)
      if (!r.ok) for (const f of r.failures) console.log(`        ↳ ${f}`)
      // Brief pause between calls to be polite to the API.
      await sleep(300)
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  const total  = results.length
  const passed = results.filter(r => r.ok).length
  const failed = total - passed

  console.log(`\n┌─ SUMMARY`)
  console.log(`├─ Total runs:    ${total}`)
  console.log(`├─ Passed:        ${passed} (${Math.round(passed / total * 100)}%)`)
  console.log(`└─ Failed:        ${failed} (${Math.round(failed / total * 100)}%)`)

  // Group failures by message to spot patterns.
  if (failed > 0) {
    const failuresByMessage = new Map<string, number>()
    for (const r of results) {
      for (const f of r.failures) {
        failuresByMessage.set(f, (failuresByMessage.get(f) ?? 0) + 1)
      }
    }
    console.log(`\nFailure patterns:`)
    for (const [msg, count] of [...failuresByMessage.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ×${count}  ${msg}`)
    }
  }

  // Shape variance — show every distinct top-level key set + blocks key.
  const shapeVariants = new Map<string, number>()
  for (const r of results) {
    const key = `top=[${r.topLevelKeys.sort().join(',')}]  blocksKey=${r.blocksKey}`
    shapeVariants.set(key, (shapeVariants.get(key) ?? 0) + 1)
  }
  console.log(`\nShape variants observed:`)
  for (const [shape, count] of [...shapeVariants.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ×${count}  ${shape}`)
  }

  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(2)
})
