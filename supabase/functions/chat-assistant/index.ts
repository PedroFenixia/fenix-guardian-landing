import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Allowed origins for CORS
const allowedOrigins = [
  "https://fenixia.tech",
  "https://www.fenixia.tech",
  "https://fenix-ia-landing-es.lovable.app",
];

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset_in_seconds: number;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "false",
  };
}

const MAX_REQUESTS_PER_HOUR = 20;

function getRateLimitKey(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  const ip = (forwardedFor?.split(",")[0]?.trim()) || realIp || cfConnectingIp || "unknown";
  return ip;
}

// deno-lint-ignore no-explicit-any
async function checkRateLimitDB(supabase: SupabaseClient<any>, ip: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  try {
    const { data, error } = await supabase.rpc('check_edge_function_rate_limit', {
      p_ip_address: ip,
      p_function_name: 'chat-assistant',
      p_max_requests: MAX_REQUESTS_PER_HOUR,
      p_window_hours: 1
    });

    if (error) {
      console.error('Rate limit check error:', error.message);
      return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR, resetIn: 3600 };
    }

    const result = data as RateLimitResult;
    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetIn: result.reset_in_seconds * 1000
    };
  } catch (err) {
    console.error('Rate limit exception:', err);
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR, resetIn: 3600000 };
  }
}

async function verifyRecaptcha(token: string): Promise<{ success: boolean; score: number }> {
  const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY');
  
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured, skipping verification');
    return { success: true, score: 1.0 };
  }

  if (!token) {
    console.warn('No reCAPTCHA token provided');
    return { success: false, score: 0 };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });

    const result = await response.json();
    console.log('reCAPTCHA verification result:', { success: result.success, score: result.score, action: result.action });
    
    return {
      success: result.success === true,
      score: result.score || 0,
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, score: 0 };
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase credentials not configured");
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const clientIp = getRateLimitKey(req);
    const { allowed, remaining, resetIn } = await checkRateLimitDB(supabase, clientIp);
    
    if (!allowed) {
      const maskedIp = clientIp.includes('.') 
        ? clientIp.split('.').slice(0, 2).join('.') + '.xxx.xxx'
        : 'masked';
      console.log(`Rate limit exceeded for IP: ${maskedIp}`);
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

    const { messages, recaptchaToken } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Formato de mensaje inválido" }), 
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify reCAPTCHA token
    if (recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken);
      
      if (!recaptchaResult.success || recaptchaResult.score < 0.3) {
        console.warn('reCAPTCHA verification failed or low score:', recaptchaResult.score);
        return new Response(
          JSON.stringify({ error: 'Verificación de seguridad fallida.' }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log('reCAPTCHA passed with score:', recaptchaResult.score);
    }
    
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
      console.error("AI gateway error:", response.status);
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
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
