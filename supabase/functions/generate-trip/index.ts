 // supabase/functions/generate-trip/index.ts                                                                 
  import { serve } from "https://deno.land/std@0.168.0/http/server.ts";                                          
                                                            
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");                                                   
                                                                                                                 
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
                                                                                                                 
  const SYSTEM_PROMPT = `Eres un experto planificador de viajes mexicano con profundo conocimiento de destinos, 
  gastronomía, cultura y logística en México.                                                                    
  Tu tono es cálido y cercano, como un amigo experto que recomienda, no un guía turístico genérico.              
  Usas información real: nombres de restaurantes, carreteras, tiempos de manejo, tips locales.                   
  Cuando el usuario te pida un itinerario, llama a la herramienta emit_trip con los datos completos. No respondas
   con texto, sólo con la llamada a la herramienta.`;                                                            
                                                                                                                 
  const budgetLine = {                                                                                           
    type: "object",                                                                                              
    required: ["label", "range"],                                                                                
    properties: { label: { type: "string" }, range: { type: "string" } },
  };                                                                                                             
                                                                                                               
  const TRIP_SCHEMA = {                                                                                          
    type: "object",               
    required: ["title", "tagline", "hero_tags", "before_you_go", "days", "budget_breakdown"],                    
    properties: {                                           
      title:   { type: "string" },                                                                             
      tagline: { type: "string" },                                                                               
      hero_tags: {                                                                                             
        type: "object",                                                                                          
        required: ["from", "duration", "travelers", "budget"],
        properties: {                                                                                            
          from:      { type: "string" },                                                                       
          duration:  { type: "string" },                                                                         
          travelers: { type: "string" },
          budget:    { type: "string" },                                                                         
        },                                                                                                       
      },                          
      before_you_go: {                                                                                           
        type: "object",                                     
        required: ["departure_details", "best_time_to_leave", "what_to_pack", "tips"],
        properties: {
          departure_details:  { type: "string" },                                                              
          best_time_to_leave: { type: "string" },                                                                
          what_to_pack:       { type: "array", items: { type: "string" } },                                    
          tips:               { type: "array", items: { type: "string" } },                                      
        },                                                  
      },                                                                                                         
      days: {                                                                                                    
        type: "array",            
        items: {                                                                                                 
          type: "object",                                   
          required: ["day_number", "day_label", "title", "objective", "blocks"],
          properties: {
            day_number: { type: "integer" },                                                                   
            day_label:  { type: "string" },                                                                      
            title:      { type: "string" },
            objective:  { type: "string" },                                                                      
            blocks: {                                                                                            
              type: "array",      
              items: {                                                                                           
                type: "object",                             
                required: ["time", "title", "description", "type"],
                properties: {
                  time:        { type: "string" },                                                             
                  title:       { type: "string" },                                                               
                  description: { type: "string" },
                  type:        { type: "string", enum: ["transport", "food", "culture", "nature", "walk", "rest",
   "free"] },                                                                                                    
                },                                                                                             
              },                                                                                                 
            },                                              
          },                                                                                                     
        },                                                  
      },                                                                                                       
      budget_breakdown: {                                                                                        
        type: "object",           
        required: ["accommodation", "food", "activities", "transport", "total"],                                 
        properties: {                                       
          accommodation: budgetLine,
          food:          budgetLine,                                                                           
          activities:    budgetLine,                                                                             
          transport:     budgetLine,
          total:         budgetLine,                                                                             
        },                                                  
      },                                                                                                       
    },                                                                                                           
  };                              
                                                                                                                 
  function buildPrompt(input: any): string {                
    const d = input.duration_days as number;
    const interests = (input.interests || []).join(", ") || "(sin preferencias)";
    return `Genera un itinerario de viaje con estos datos:                                                     
  - Origen: ${input.origin ?? "(no especificado)"}                                                               
  - Destino: ${input.destination}                                                                                
  - Duración: ${d} días                                                                                          
  - Viajeros: ${input.travelers} persona(s)                                                                      
  - Estilo: ${input.travel_style}                                                                                
  - Presupuesto: ${input.budget_level}                                                                           
  - Intereses: ${interests}                                                                                    
                                                                                                                 
  Llama a la herramienta emit_trip con el itinerario completo. Usa lugares, restaurantes y rutas reales de 
  ${input.destination}. Incluye exactamente ${d} día(s). Cada día debe tener entre 4 y 7 bloques.`;              
  }                                                                                                            
                                                                                                                 
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
                                                                                                                 
      const rawDays = Number(body.duration_days ?? body.nights ?? 5);                                            
      const duration_days = Math.min(Math.max(rawDays || 5, 1), 30);                                           
                                                                                                                 
      const input = {                                                                                          
        ...body,                                                                                                 
        duration_days,                                      
        travelers:    body.travelers    ?? 2,                                                                    
        travel_style: body.travel_style ?? body.pace   ?? "cultural",                                          
        budget_level: body.budget_level ?? body.budget ?? "medium",                                              
      };                                                                                                       
                                                                                                                 
      const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",                                                                                          
        headers: {                                                                                               
          "Content-Type":      "application/json",
          "x-api-key":         ANTHROPIC_API_KEY,                                                                
          "anthropic-version": "2023-06-01",                                                                   
        },                                                                                                       
        body: JSON.stringify({                                                                                 
          model: "claude-sonnet-4-20250514",                                                                     
          max_tokens: 16000,                                
          system: SYSTEM_PROMPT,                                                                                 
          tools: [{                                         
            name: "emit_trip",                                                                                 
            description: "Emite el itinerario de viaje estructurado.",                                           
            input_schema: TRIP_SCHEMA,
          }],                                                                                                    
          tool_choice: { type: "tool", name: "emit_trip" },                                                      
          messages: [{ role: "user", content: buildPrompt(input) }],
        }),                                                                                                      
      });                                                                                                        
                                  
      const ms = Date.now() - startedAt;                                                                         
                                                                                                               
      if (!claudeRes.ok) {                                                                                       
        const errText = await claudeRes.text().catch(() => "");
        console.error("[generate-trip] claude upstream", claudeRes.status, errText.slice(0, 500));               
        return errorResponse(502, "claude_upstream_failed", `Claude API returned ${claudeRes.status}`, {       
          status: claudeRes.status,                                                                              
          body: errText.slice(0, 500),                                                                           
        });                                                                                                      
      }                                                                                                          
                                                                                                                 
      const claudeData = await claudeRes.json();            
                                                                                                               
      console.log("[generate-trip]", JSON.stringify({                                                            
        stop_reason:   claudeData.stop_reason,
        input_tokens:  claudeData.usage?.input_tokens,                                                           
        output_tokens: claudeData.usage?.output_tokens,                                                        
        ms,                                                                                                      
      }));                                                                                                     
                                                                                                                 
      if (claudeData.stop_reason === "max_tokens") {        
        return errorResponse(502, "llm_truncated", `La respuesta del modelo excedió el límite de tokens. Reduce  
  la duración o los intereses e intenta de nuevo.`, {       
          output_tokens: claudeData.usage?.output_tokens,                                                      
        });                                                                                                      
      }                                                                                                        
                                                                                                                 
      const toolUse = Array.isArray(claudeData.content)     
        ? claudeData.content.find((c: any) => c?.type === "tool_use" && c?.name === "emit_trip")                 
        : null;                                             
                                                                                                               
      if (!toolUse?.input) {                                                                                     
        console.error("[generate-trip] no tool_use in response", JSON.stringify(claudeData).slice(0, 500));    
        return errorResponse(502, "llm_no_tool_use", "El modelo no emitió la estructura esperada", {             
          stop_reason: claudeData.stop_reason,                                                                 
        });                                                                                                      
      }                                                                                                          
                                                                                                                 
      return new Response(                                                                                       
        JSON.stringify({ success: true, trip_data: toolUse.input }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );                                                                                                       
                                                                                                                 
    } catch (err) {                                                                                              
      const message = err instanceof Error ? err.message : String(err);                                          
      console.error("[generate-trip] unhandled", message);                                                       
      return errorResponse(500, "internal", `Internal error: ${message}`);                                     
    }                                                                                                            
  });