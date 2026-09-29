 // supabase/functions/generate-trip/index.ts
  import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
  import {
    buildInput, isFamilyTraveler, computeHeadcount, isBudgetCurrencySuspect,
  } from "./logic.ts";
  import {
    type Locale, systemPromptFor, TRIP_SCHEMA, TRIP_SCHEMA_DAYS_ONLY,
    TRIP_SCHEMA_FRONTMATTER_ONLY, buildPrompt, isMultiCity,
  } from "./prompt.ts";
                                                            
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

  // Fire-and-forget metrics logging — same project-wide secrets the worker
  // uses to reach Postgres directly (no supabase-js import here, this
  // function otherwise has zero DB dependency; a raw REST insert is enough
  // for a write-only metrics row and keeps this function's footprint small).
  const METRICS_SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const METRICS_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  function logGenerationMetric(row: Record<string, unknown>): void {
    if (!METRICS_SUPABASE_URL || !METRICS_SERVICE_ROLE_KEY) return;
    fetch(`${METRICS_SUPABASE_URL}/rest/v1/generation_metrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey:         METRICS_SERVICE_ROLE_KEY,
        Authorization:  `Bearer ${METRICS_SERVICE_ROLE_KEY}`,
        Prefer:         "return=minimal",
      },
      body: JSON.stringify(row),
    }).catch((e) => console.warn("[generate-trip] metrics insert failed:", e));
  }

  // Fire-and-forget self-persist of a successful single-city async chunk
  // (day or front-matter) straight into generation_chunks, independent of
  // whether the worker's own fetch() ever receives this response. Added
  // 2026-09-25 after a live Buenos Aires failure: the worker's own
  // AbortController fired at the job's 60s deadline while this exact call
  // was still in flight; the call went on to complete successfully 9s
  // later (confirmed via generation_metrics: ok:true, logged after the job
  // had already been marked failed) but the result was discarded because
  // the only place it was ever going to be written -- the worker, after
  // parsing *its* response to this fetch -- had already given up. Writing
  // it here, from inside the call that actually produced it, means a
  // result that finishes just past the worker's patience is still durable:
  // the worker's pre-failure re-check (runConcurrentSingleCity) can pick it
  // up from generation_chunks even though its own fetch was aborted.
  // Idempotent via the same (job_id, chunk_index) unique index the worker's
  // own insert relies on -- ignore-duplicates means whichever writer (this
  // one or the worker's normal path) lands first wins, silently, no error
  // either way. Scoped to single-city day/front-matter chunks only --
  // multi-city is a different persistence contract (deliberately untouched
  // by this redesign) and isn't self-persisted here.
  function persistChunkContent(jobId: string, chunkIndex: number, content: unknown): void {
    if (!METRICS_SUPABASE_URL || !METRICS_SERVICE_ROLE_KEY) return;
    // on_conflict names the (job_id, chunk_index) unique index explicitly --
    // don't rely on PostgREST inferring it -- so ignore-duplicates has a
    // real target and this is a true upsert-or-noop, not a 409.
    fetch(`${METRICS_SUPABASE_URL}/rest/v1/generation_chunks?on_conflict=job_id,chunk_index`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey:         METRICS_SERVICE_ROLE_KEY,
        Authorization:  `Bearer ${METRICS_SERVICE_ROLE_KEY}`,
        Prefer:         "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({ job_id: jobId, chunk_index: chunkIndex, content }),
    }).catch((e) => console.warn("[generate-trip] chunk self-persist failed:", e));
  }

  // Per-model $/MTok rates, 2026-09-28. Confirmed against
  // platform.claude.com/docs/en/about-claude/pricing (fetched live twice,
  // same result both times): claude-sonnet-4-6 is $3 in / $15 out. A
  // $2/$10 rate was tried briefly the same day on a claimed account
  // discount, but the account has no negotiated rate for this model --
  // $2/$10 is Sonnet 5's published price, a different model, per the
  // pricing page's own footnote. Reverted to the published list price.
  // cacheWrite/cacheRead are the 5-minute-cache multipliers (1.25x / 0.1x
  // of input) since cache_control here uses the default 5m TTL, not the
  // 1h beta.
  const MODEL_RATES: Record<string, { input: number; cacheWrite: number; cacheRead: number; output: number }> = {
    "claude-sonnet-4-6":         { input: 3, cacheWrite: 3.75, cacheRead: 0.30, output: 15 },
    "claude-haiku-4-5-20251001": { input: 1, cacheWrite: 1.25, cacheRead: 0.10, output: 5 },
    // Added 2026-09-28 for the Sonnet 5 migration evaluation (backlog
    // #101, test_model hook). Confirmed against
    // platform.claude.com/docs/en/models/sonnet-5/overview.
    "claude-sonnet-5":           { input: 2, cacheWrite: 2.50, cacheRead: 0.20, output: 10 },
  };
  function computeCostUsd(model: string, usage: {
    input_tokens?: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number; output_tokens?: number;
  } | undefined): number | null {
    const rates = MODEL_RATES[model];
    if (!rates || !usage) return null;
    const cost =
      ((usage.input_tokens ?? 0) * rates.input +
       (usage.cache_creation_input_tokens ?? 0) * rates.cacheWrite +
       (usage.cache_read_input_tokens ?? 0) * rates.cacheRead +
       (usage.output_tokens ?? 0) * rates.output) / 1_000_000;
    return Number(cost.toFixed(6));
  }

  const corsHeaders = {                                                                                      
    "Access-Control-Allow-Origin": "*",                                                                          
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",                        
    "Access-Control-Allow-Methods": "POST, OPTIONS",        
  };                                                                                                           
                                                                                                                 
  type ErrBody = { success: false; code: string; message: string; detail?: unknown };
  const errorResponse = (status: number, code: string, message: string, detail?: unknown) =>                     
    new Response(                                                                                                
      JSON.stringify({ success: false, code, message, detail } satisfies ErrBody),                             
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }                                
    );                                                                                                         
                                                                                                                 
  serve(async (req) => {          
    if (req.method === "OPTIONS") {                                                                              
      return new Response(null, { headers: corsHeaders });  
    }                                                                                                          
                                                                                                                 
    if (req.method !== "POST") {  
      return errorResponse(405, "method_not_allowed", "Only POST is supported");                                 
    }                                                       
                                                                                                               
    const startedAt = Date.now();                                                                                
                                                                                                               
    try {                                                                                                        
      if (!ANTHROPIC_API_KEY) {                             
        console.error("[generate-trip] ANTHROPIC_API_KEY missing");                                              
        return errorResponse(503, "config_missing", "Anthropic API key not configured");
      }                                                                                                        
                                                                                                                 
      let body: any;              
      try {                                                                                                      
        body = await req.json();                            
      } catch {                                                                                                
        return errorResponse(400, "invalid_body", "Request body is not valid JSON");                             
      }                           
                                                                                                                 
      if (!body?.destination) {                                                                                
        return errorResponse(400, "missing_destination", "destination is required");                             
      }                           
                                                                                                                 
      // Body → prompt-input normalization (nights/overnight/locale
      // derivation, the traveler/travelers field-name fix, currency
      // default) lives in ./logic.ts — see buildInput() there.
      const input = buildInput(body);

      // Model is read from a Supabase secret so we can flip between Sonnet
      // 4.0 / 4.6 / future models instantly via `supabase secrets set` —
      // no code change, no redeploy. Critical for the Sonnet 4.6
      // migration's rollback path: if 4.6 misbehaves in prod, flip the
      // secret back to claude-sonnet-4-20250514 and the next request
      // uses 4.0 within ~30s of the secret propagating. Moved above the
      // single-block-regeneration branch below (2026-09-25) since that
      // path needs it too and used to run before this was defined.
      // TEMPORARY TEST HOOK -- 2026-09-28, for the Sonnet 5 migration
      // evaluation (backlog #101). Per-request override so a handful of
      // test trips can run against a candidate model without touching
      // the GENERATE_TRIP_MODEL secret (which would affect ALL real
      // traffic for the duration of the test). REMOVE before this
      // evaluation concludes, win or lose.
      const MODEL = typeof (input as any).test_model === "string"
        ? (input as any).test_model
        : Deno.env.get("GENERATE_TRIP_MODEL") ?? "claude-sonnet-4-6";

      // ── Single-block regeneration (worker's duplicate-venue repair) ──────
      // A separate, minimal early-return path — deliberately NOT threaded
      // through the big buildPrompt()/TRIP_SCHEMA machinery below, which is
      // built for a whole day (or whole trip) at once. This replaces
      // exactly one duplicated block with a different real venue. Added
      // 2026-09-25: failing the whole job on a duplicate venue was too
      // blunt (20% of a 10-city test got blocked this way) — regenerating
      // just the offending block is the actual last resort, a full job
      // failure should be rare.
      if ((body as any)?.regenerate_block === true) {
        if (!ANTHROPIC_API_KEY) {
          return errorResponse(503, "config_missing", "Anthropic API key not configured");
        }
        const isEN = input.locale === "en";
        const avoid: string[] = Array.isArray((body as any).avoid_venues) ? (body as any).avoid_venues : [];
        const blockType = typeof (body as any).block_type === "string" ? (body as any).block_type : "restaurant";
        const blockTime = typeof (body as any).block_time === "string" ? (body as any).block_time : "";
        const dayNumber = typeof (body as any).day_number === "number" ? (body as any).day_number : null;

        const BLOCK_SCHEMA = {
          type: "object",
          required: ["title", "description"],
          properties: {
            title:        { type: "string" },
            description:  { type: "string" },
            neighborhood: { type: "string" },
          },
        };

        const blockPrompt = isEN
          ? `For day ${dayNumber ?? "?"} of a trip to ${input.destination}, suggest ONE real, specific "${blockType}" venue for the ${blockTime || "this"} time slot. It must NOT be any of these already-used places: ${avoid.join(", ") || "(none listed)"}. Give a real, specific venue name as the block title (e.g. "Breakfast at X"), a short 1-2 sentence description, and its neighborhood (lowercase, no accents). Call the emit_block_replacement tool.`
          : `Para el día ${dayNumber ?? "?"} de un viaje a ${input.destination}, sugiere UN lugar real y específico de tipo "${blockType}" para el horario ${blockTime || "este bloque"}. NO puede ser ninguno de estos lugares ya usados: ${avoid.join(", ") || "(ninguno listado)"}. Da un nombre de lugar real y específico como título del bloque (ej. "Desayuno en X"), una descripción breve de 1-2 oraciones, y su barrio (minúsculas, sin acentos). Llama a la herramienta emit_block_replacement.`;

        const blockRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type":      "application/json",
            "x-api-key":         ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 500,
            system: [{
              type: "text",
              text: systemPromptFor(input.locale),
              cache_control: { type: "ephemeral" },
            }],
            tools: [{
              name: "emit_block_replacement",
              description: isEN ? "Emit a single replacement itinerary block." : "Emite un único bloque de itinerario de reemplazo.",
              input_schema: BLOCK_SCHEMA,
            }],
            tool_choice: { type: "tool", name: "emit_block_replacement" },
            messages: [{ role: "user", content: blockPrompt }],
          }),
        });

        if (!blockRes.ok) {
          const errText = await blockRes.text().catch(() => "");
          return errorResponse(502, "claude_upstream_failed", `Claude API returned ${blockRes.status}`, { status: blockRes.status, body: errText.slice(0, 500) });
        }
        const blockData = await blockRes.json();
        const blockToolUse = Array.isArray(blockData.content)
          ? blockData.content.find((c: any) => c?.type === "tool_use" && c?.name === "emit_block_replacement")
          : null;
        if (!blockToolUse?.input?.title) {
          return errorResponse(502, "llm_no_tool_use", "El modelo no emitió el bloque de reemplazo");
        }
        return new Response(
          JSON.stringify({ success: true, block: blockToolUse.input }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Single Claude call — no internal retry. The previous version (commit
      // 91e98d3) added a one-shot internal retry to mitigate Sonnet 4.6
      // intermittent shape failures, but on Supabase Free's 150s function
      // cap the retry could push total execution past the limit (base ~140s
      // + retry ~140s = 280s). Now the Edge Fn does ONE call, validates,
      // and returns a clean 502 on shape failure. The caller (sync route
      // or async worker) decides whether to retry on a fresh invocation
      // with its own 150s budget.
      //
      // Returns true when the tool_use payload is genuinely missing the
      // itinerary (empty days, or every day has zero blocks). These are
      // the shapes the FE normalizer can't handle — both surface as the
      // "no itinerary days found in the expected format" error.
      function isInvalidShape(toolUseInput: any): boolean {
        if (!toolUseInput) return true;
        // Frontmatter responses correctly have NO `days` field at all —
        // the day-emptiness check below doesn't apply to them. The
        // TRIP_SCHEMA_FRONTMATTER_ONLY tool's own `required` array (title/
        // tagline/hero_tags/before_you_go/budget_breakdown/accommodations)
        // is what Anthropic already enforces before returning tool_use at
        // all, so "toolUseInput exists" is sufficient here. Without this,
        // every frontmatter call was rejected as "invalid shape" for
        // missing days it was never asked to produce (confirmed live
        // 2026-09-25 — all 3 retry attempts on one job failed this way).
        if (isFrontmatterOnly) return false;
        if (!Array.isArray(toolUseInput.days) || toolUseInput.days.length === 0) return true;
        // A single day with blocks is enough to treat as valid (partial-day
        // trips are real); we only flag fully-empty itineraries.
        const anyDayHasBlocks = toolUseInput.days.some(
          (d: any) => Array.isArray(d?.blocks) && d.blocks.length > 0
        );
        return !anyDayHasBlocks;
      }

      // Four cases, in priority order:
      //   1. Multi-city sub-chunk (segment_index present, segments array
      //      valid) — always full schema. Each sub-chunk needs its own
      //      title/budget/accommodations per the per-segment lodging
      //      contract above; unchanged by this redesign.
      //   2. frontmatter_only (worker's generateFrontmatter, single-city
      //      only) — title/tagline/hero_tags/before_you_go/budget_breakdown/
      //      accommodations, no days.
      //   3. Single-city day chunk (segment_index present, not multi-city,
      //      not frontmatter_only) — lean, days only. ALL single-city async
      //      chunks now, including what used to be "chunk 0" — front-matter
      //      moved to its own concurrent call (case 2) instead of being
      //      bundled into one day chunk, which made that one call
      //      consistently the slowest (~40-48s vs ~23-31s for a plain lean
      //      day, confirmed via generation_metrics on the 10-city test).
      //   4. Sync whole-trip call (segment_index absent entirely — the
      //      direct /api/generate-trip path for trips short enough to skip
      //      the async worker) — full schema, one call does everything.
      //      Untouched by this redesign.
      const hasSegmentIndex  = typeof input.segment_index === "number";
      const isMultiCityInput = isMultiCity(input.segments);
      const isFrontmatterOnly = input.frontmatter_only === true;
      const isLeanChunk = hasSegmentIndex && !isMultiCityInput && !isFrontmatterOnly;

      const toolName = isFrontmatterOnly ? "emit_trip_frontmatter" : (isLeanChunk ? "emit_trip_days" : "emit_trip");
      const toolSchema = isFrontmatterOnly ? TRIP_SCHEMA_FRONTMATTER_ONLY : (isLeanChunk ? TRIP_SCHEMA_DAYS_ONLY : TRIP_SCHEMA);
      // Multi-city and sync-whole-trip both need the original full budget —
      // multi-city sub-chunks can span up to MC_SEGMENT_DAYS=5 days, and a
      // sync call does the ENTIRE trip (up to 5 days by ASYNC_THRESHOLD) in
      // one shot. Capping either at 4000 (as an earlier pass here briefly
      // did) starves them — 16000 is the original, correct budget for both.
      const maxTokens = isFrontmatterOnly ? 2000 : (isLeanChunk ? 2500 : 16000);

      // Wrapped so EVERY failure path -- a non-ok HTTP response from
      // Anthropic, or the fetch() call itself throwing (network error,
      // DNS, abort) -- logs a metrics row before returning/rethrowing.
      // Added 2026-09-28: three single-city day-chunk failures (Lisboa/
      // chunk 1, Tokyo/chunk 6, Madrid/chunk 2) died with NO metrics row
      // at all, because both failure branches below used to return early
      // without ever reaching the success-path logGenerationMetric() call
      // further down -- the root cause (429? 5xx? network?) was invisible.
      // These now self-log the same way persistChunkContent self-persists
      // successful chunks: independent of what the caller ends up doing
      // with the response.
      const metricBase = {
        job_id:      typeof input.job_id === "string" ? input.job_id : null,
        chunk_index: typeof input.segment_index === "number" ? input.segment_index : null,
        schema_kind: isFrontmatterOnly ? "frontmatter" : (isLeanChunk ? "lean" : "full"),
        path:        isMultiCityInput ? "multi" : "single",
        model:       MODEL,
        attempt:     typeof input.attempt === "number" ? input.attempt : 0,
        ok:          false,
      };

      let claudeRes: Response;
      try {
        claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type":      "application/json",
            "x-api-key":         ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: maxTokens,
            system: [{
              type: "text",
              text: systemPromptFor(input.locale),
              cache_control: { type: "ephemeral" },
            }],
            tools: [{
              name: toolName,
              description: isFrontmatterOnly
                ? (input.locale === "en" ? "Emit the trip's front matter (title, tagline, budget, lodging) — no days." : "Emite los datos generales del viaje (título, tagline, presupuesto, alojamiento) — sin días.")
                : isLeanChunk
                ? (input.locale === "en" ? "Emit this day's itinerary block." : "Emite el bloque de itinerario de este día.")
                : (input.locale === "en" ? "Emit the structured travel itinerary." : "Emite el itinerario de viaje estructurado."),
              input_schema: toolSchema,
            }],
            tool_choice: { type: "tool", name: toolName },
            messages: [{ role: "user", content: buildPrompt(input) }],
          }),
        });
      } catch (fetchErr) {
        const message = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        console.error("[generate-trip] claude fetch threw", message);
        logGenerationMetric({ ...metricBase, ms: Date.now() - startedAt, status_code: null, error: message.slice(0, 500) });
        return errorResponse(502, "claude_fetch_failed", `No se pudo contactar al modelo: ${message}`);
      }

      if (!claudeRes.ok) {
        const errText = await claudeRes.text().catch(() => "");
        console.error("[generate-trip] claude upstream", claudeRes.status, errText.slice(0, 500));
        logGenerationMetric({ ...metricBase, ms: Date.now() - startedAt, status_code: claudeRes.status, error: errText.slice(0, 500) });
        return errorResponse(502, "claude_upstream_failed", `Claude API returned ${claudeRes.status}`, {
          status: claudeRes.status,
          body:   errText.slice(0, 500),
        });
      }

      const claudeData = await claudeRes.json();
      const ms = Date.now() - startedAt;

      if (claudeData.stop_reason === "max_tokens") {
        // Same class of gap as the two branches above -- this used to
        // return before ever reaching the logGenerationMetric() call
        // further down, so a truncation was as invisible as a 429 was.
        logGenerationMetric({
          ...metricBase, ms, status_code: null, error: "max_tokens truncation",
          input_tokens: claudeData.usage?.input_tokens ?? null,
          output_tokens: claudeData.usage?.output_tokens ?? null,
          stop_reason: "max_tokens",
          cost_usd: computeCostUsd(MODEL, claudeData.usage),
        });
        return errorResponse(502, "llm_truncated",
          `La respuesta del modelo excedió el límite de tokens. Reduce la duración o los intereses e intenta de nuevo.`,
          { output_tokens: claudeData.usage?.output_tokens }
        );
      }

      console.log("[generate-trip]", JSON.stringify({
        model:         MODEL,
        stop_reason:   claudeData.stop_reason,
        output_tokens: claudeData.usage?.output_tokens,
        ms,
      }));

      // Fire-and-forget metrics row — around every Anthropic call in this
      // function, success or shape-failure alike (the HTTP call itself
      // already succeeded by this point; later validation failures still
      // get logged as ok:false below at their own return points, but the
      // core timing/token/schema signal is captured here regardless).
      logGenerationMetric({
        job_id:        typeof input.job_id === "string" ? input.job_id : null,
        chunk_index:   typeof input.segment_index === "number" ? input.segment_index : null,
        schema_kind:   isFrontmatterOnly ? "frontmatter" : (isLeanChunk ? "lean" : "full"),
        path:          isMultiCityInput ? "multi" : "single",
        model:         MODEL,
        ms,
        input_tokens:  claudeData.usage?.input_tokens ?? null,
        output_tokens: claudeData.usage?.output_tokens ?? null,
        // cache_read_input_tokens is only present on the response when the
        // request actually sent cache_control — >0 confirms a real hit,
        // 0 means it was eligible but missed (e.g. no prior write yet),
        // undefined/null means the field wasn't in the response at all.
        cache_read:    claudeData.usage?.cache_read_input_tokens ?? null,
        attempt:       typeof input.attempt === "number" ? input.attempt : 0,
        stop_reason:   claudeData.stop_reason ?? null,
        ok:            claudeData.stop_reason !== "max_tokens",
        // Three-way split: fresh input_tokens at the base rate, cache
        // reads at 0.1x, cache writes (cache_creation_input_tokens -- not
        // otherwise persisted, only used here) at 1.25x, output at the
        // output rate. See MODEL_RATES above.
        cost_usd:      computeCostUsd(MODEL, claudeData.usage),
      });

      const toolUse = Array.isArray(claudeData.content)
        ? claudeData.content.find((c: any) => c?.type === "tool_use" && c?.name === toolName)
        : null;

      if (!toolUse?.input) {
        console.error("[generate-trip] no tool_use in response", JSON.stringify(claudeData).slice(0, 500));
        return errorResponse(502, "llm_no_tool_use", "El modelo no emitió la estructura esperada", {
          stop_reason: claudeData.stop_reason,
        });
      }

      // Shape validation — return a clean 502 with a specific code so
      // callers see distinct telemetry (sync route may retry with
      // retryHint; analytics error_occurred tags this distinctly from
      // generic upstream failures). The user clicking regenerate gets
      // a fresh attempt on the next invocation.
      if (isInvalidShape(toolUse.input)) {
        console.error("[generate-trip] shape invalid",
          JSON.stringify({
            top_keys:    Object.keys(toolUse.input),
            days_length: Array.isArray(toolUse.input.days) ? toolUse.input.days.length : null,
          })
        );
        return errorResponse(502, "llm_empty_days",
          "El modelo no produjo días de itinerario.",
          { stop_reason: claudeData.stop_reason }
        );
      }

      const budgetCurrencySuspect = isBudgetCurrencySuspect(
        toolUse.input.budget_breakdown, input.currency, input.nights, computeHeadcount(input)
      );
      if (budgetCurrencySuspect) {
        console.warn("[generate-trip] budget_currency_suspect", JSON.stringify({
          currency: input.currency, nights: input.nights, destination: input.destination,
        }));
      }

      // Self-persist -- see persistChunkContent above. Single-city async
      // day/front-matter chunks only; -1 is FRONTMATTER_UNIT in the worker
      // (kept as a literal here, not imported -- these are separate Deno
      // deployments with no shared module).
      if (typeof input.job_id === "string" && (isLeanChunk || isFrontmatterOnly)) {
        const chunkIndex = isFrontmatterOnly ? -1 : (input.segment_index as number);
        persistChunkContent(input.job_id, chunkIndex, toolUse.input);
      }

      return new Response(
        JSON.stringify({ success: true, trip_data: toolUse.input, budget_currency_suspect: budgetCurrencySuspect }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (err) {                                                                                              
      const message = err instanceof Error ? err.message : String(err);                                          
      console.error("[generate-trip] unhandled", message);                                                       
      return errorResponse(500, "internal", `Internal error: ${message}`);                                     
    }                                                                                                            
  });