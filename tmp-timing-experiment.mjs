// Standalone Step-0 timing experiment for Option G viability.
// Mirrors the production Supabase Edge Function (generate-trip) prompt exactly:
// same SYSTEM_PROMPT, same TRIP_SCHEMA tool, same buildPrompt() logic. The only
// changes vs production are: (1) target claude-sonnet-4-6 (current Sonnet,
// production is on the deprecated 4.0), (2) max_tokens up to 64000 (production
// is 16000 because it was designed for chunked 1-day calls), (3) full 30-day
// duration in a single call (production calls it 30 times for chunks).
//
// Decision rule (from the implementation spec):
//   output ≤ 28K tokens AND wall ≤ 260s → proceed with Option G as written
//   28K-35K tokens OR 260-290s → proceed with caveats
//   > 35K tokens OR > 290s → switch to 3-segment chunking, pause + reconsider
//
// Run: ANTHROPIC_API_KEY=sk-... node tmp-timing-experiment.mjs

import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Eres un experto planificador de viajes mexicano con profundo conocimiento de destinos, gastronomía, cultura y logística en México.
Tu tono es cálido y cercano, como un amigo experto que recomienda, no un guía turístico genérico.
Usas información real: nombres de restaurantes, carreteras, tiempos de manejo, tips locales.
Cuando el usuario te pida un itinerario, llama a la herramienta emit_trip con los datos completos. No respondas con texto, sólo con la llamada a la herramienta.`

const budgetLine = {
  type: 'object',
  required: ['label', 'range'],
  properties: { label: { type: 'string' }, range: { type: 'string' } },
}

const TRIP_SCHEMA = {
  type: 'object',
  required: ['title', 'tagline', 'hero_tags', 'before_you_go', 'days', 'budget_breakdown'],
  properties: {
    title:   { type: 'string' },
    tagline: { type: 'string' },
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
                type:        { type: 'string', enum: ['transport', 'food', 'culture', 'nature', 'walk', 'rest', 'free'] },
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
  },
}

function buildPrompt(input) {
  const d = input.duration_days
  const interests = (input.interests || []).join(', ') || '(sin preferencias)'
  return `Genera un itinerario de viaje con estos datos:
- Origen: ${input.origin ?? '(no especificado)'}
- Destino: ${input.destination}
- Duración: ${d} días
- Viajeros: ${input.travelers} persona(s)
- Estilo: ${input.travel_style}
- Presupuesto: ${input.budget_level}
- Intereses: ${interests}

Llama a la herramienta emit_trip con el itinerario completo. Usa lugares, restaurantes y rutas reales de ${input.destination}. Incluye exactamente ${d} día(s). Cada día debe tener entre 4 y 7 bloques.`
}

const TEST_INPUT = {
  destination:  'Ciudad de México y alrededores',
  origin:       'Mexico City',
  duration_days: 30,
  travelers:    2,
  travel_style: 'cultural',
  budget_level: 'medium',
  interests:    ['Cultura', 'Naturaleza', 'Gastronomía'],
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY env var required')
    process.exit(1)
  }

  const client = new Anthropic()

  console.log('=== Step 0: Option G timing experiment ===')
  console.log('Model:        claude-sonnet-4-6')
  console.log('Max tokens:   64000 (Sonnet 4.6 ceiling)')
  console.log('Trip:         30-day, ' + TEST_INPUT.destination)
  console.log('Streaming:    yes (required for max_tokens > 16K)')
  console.log('')
  console.log('Decision rule:')
  console.log('  ≤28K tokens AND ≤260s wall → Option G GREEN')
  console.log('  28-35K tokens OR 260-290s  → Option G YELLOW')
  console.log('  >35K tokens OR >290s       → Option G RED, use chunking')
  console.log('')
  console.log('Starting LLM call (this will take 1-5 minutes)...')
  console.log('')

  const t0 = Date.now()
  let firstByteAt = null

  const stream = client.messages.stream({
    model:      'claude-sonnet-4-6',
    max_tokens: 64000,
    system:     SYSTEM_PROMPT,
    tools:      [{
      name: 'emit_trip',
      description: 'Emite el itinerario de viaje estructurado.',
      input_schema: TRIP_SCHEMA,
    }],
    tool_choice: { type: 'tool', name: 'emit_trip' },
    messages: [{ role: 'user', content: buildPrompt(TEST_INPUT) }],
  })

  let chunkCount = 0
  for await (const event of stream) {
    if (firstByteAt === null) {
      firstByteAt = Date.now()
      console.log(`[${((firstByteAt - t0) / 1000).toFixed(1)}s] first byte received`)
    }
    if (event.type === 'content_block_delta' && event.delta?.type === 'input_json_delta') {
      chunkCount++
      if (chunkCount % 50 === 0) {
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
        process.stdout.write(`\r[${elapsed}s] streaming... (${chunkCount} input_json_delta events received)`)
      }
    }
  }
  console.log('')

  const finalMessage = await stream.finalMessage()
  const totalMs = Date.now() - t0
  const totalSec = totalMs / 1000

  const usage = finalMessage.usage
  const stopReason = finalMessage.stop_reason
  const toolBlock = finalMessage.content.find(b => b.type === 'tool_use')
  const tripData = toolBlock?.input
  const dayCount = Array.isArray(tripData?.days) ? tripData.days.length : 0

  console.log('')
  console.log('=== RESULTS ===')
  console.log(`Wall clock:      ${totalSec.toFixed(1)}s`)
  console.log(`Input tokens:    ${usage.input_tokens}`)
  console.log(`Output tokens:   ${usage.output_tokens}`)
  console.log(`Cache write:     ${usage.cache_creation_input_tokens ?? 0}`)
  console.log(`Cache read:      ${usage.cache_read_input_tokens ?? 0}`)
  console.log(`Stop reason:     ${stopReason}`)
  console.log(`Days generated:  ${dayCount} (expected 30)`)
  console.log('')

  // Decision
  const tokens = usage.output_tokens
  let verdict
  if (stopReason === 'max_tokens') {
    verdict = 'RED — output truncated at max_tokens cap. Need higher cap (Opus 4.6) or chunking.'
  } else if (dayCount < 30) {
    verdict = `RED — only ${dayCount} days generated, expected 30. Model not delivering full trip.`
  } else if (tokens > 35_000 || totalSec > 290) {
    verdict = 'RED — exceeds limits. Switch to 3-segment chunking (10 days each) instead of single-call.'
  } else if (tokens > 28_000 || totalSec > 260) {
    verdict = 'YELLOW — proceed with caveats. Note model-choice escape hatch in code (Opus fallback for very long trips).'
  } else {
    verdict = 'GREEN — proceed with Option G as written.'
  }
  console.log(`VERDICT: ${verdict}`)
  console.log('')

  // Cost estimate (Sonnet 4.6: $3/M input, $15/M output)
  const costUsd = (usage.input_tokens * 3 + usage.output_tokens * 15) / 1_000_000
  console.log(`Approx cost of this experiment: $${costUsd.toFixed(4)}`)
}

main().catch(err => {
  console.error('Experiment failed:', err)
  process.exit(1)
})
