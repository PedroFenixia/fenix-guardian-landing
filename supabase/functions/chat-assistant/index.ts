import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets when function cold starts)
// In production, consider using a database or Redis for persistence
const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 20; // 20 requests per hour per IP
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour in milliseconds

function getRateLimitKey(req: Request): string {
  // Try to get the real client IP from various headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  
  // Use the first IP from x-forwarded-for, or fall back to other headers
  const ip = (forwardedFor?.split(",")[0]?.trim()) || realIp || cfConnectingIp || "unknown";
  return ip;
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const rateLimit = RATE_LIMIT_MAP.get(ip);
  
  // If no record exists or window has expired, create new record
  if (!rateLimit || now > rateLimit.resetAt) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  // Check if limit exceeded
  if (rateLimit.count >= MAX_REQUESTS_PER_HOUR) {
    const resetIn = rateLimit.resetAt - now;
    return { allowed: false, remaining: 0, resetIn };
  }
  
  // Increment counter
  rateLimit.count++;
  RATE_LIMIT_MAP.set(ip, rateLimit);
  
  return { 
    allowed: true, 
    remaining: MAX_REQUESTS_PER_HOUR - rateLimit.count, 
    resetIn: rateLimit.resetAt - now 
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIp = getRateLimitKey(req);
    const { allowed, remaining, resetIn } = checkRateLimit(clientIp);
    
    if (!allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIp}`);
      const resetInMinutes = Math.ceil(resetIn / 60000);
      return new Response(
        JSON.stringify({ 
          error: `Demasiadas solicitudes. Por favor, intenta de nuevo en ${resetInMinutes} minutos.` 
        }), 
        {
          status: 429,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(resetIn / 1000))
          },
        }
      );
    }

    const { messages } = await req.json();
    
    // Basic input validation
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Formato de mensaje inválido" }), 
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Limit message history to prevent abuse
    const MAX_MESSAGES = 20;
    const truncatedMessages = messages.slice(-MAX_MESSAGES);
    
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
          ...truncatedMessages,
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
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "X-RateLimit-Remaining": String(remaining)
      },
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
