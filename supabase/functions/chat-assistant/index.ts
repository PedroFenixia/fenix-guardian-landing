import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Eres el asistente virtual de Fenix IA Solutions, una empresa española especializada en soluciones de inteligencia artificial para empresas.

INFORMACIÓN DE LA EMPRESA:
- Nombre: Fenix IA Solutions SL
- Ubicación: C/ La Paz, 83, 03320 Torrellano-Elche, Alicante, España
- Email: contacto@fenixia.tech
- Teléfono: +34 966 10 10 29

SERVICIOS PRINCIPALES:
1. Automatización de Procesos: Integración de IA en flujos de trabajo empresariales
2. Consultoría en IA: Asesoramiento personalizado para implementar soluciones de inteligencia artificial
3. Desarrollo a Medida: Creación de soluciones personalizadas según las necesidades del cliente
4. Análisis de Datos: Extracción de insights valiosos mediante inteligencia artificial

INSTRUCCIONES:
- Responde siempre en español de forma profesional y amable
- Sé conciso pero informativo
- Si te preguntan por precios o detalles específicos de proyectos, invita al usuario a contactar directamente con el equipo
- Si no conoces una respuesta, sugiere contactar por email o teléfono
- Destaca los beneficios de la IA: ahorro de tiempo, automatización, mejora de la eficiencia y toma de decisiones basada en datos`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Por favor, intenta de nuevo en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Servicio temporalmente no disponible." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Error del servicio de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
