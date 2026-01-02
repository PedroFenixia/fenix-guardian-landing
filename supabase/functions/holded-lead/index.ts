import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Allowed origins for CORS
const allowedOrigins = [
  'https://fenixia.tech',
  'https://www.fenixia.tech',
  'https://fenix-ia-landing-es.lovable.app',
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'false',
  };
}

interface LeadData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

interface HoldedFunnel {
  id: string;
  name: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset_in_seconds: number;
}

const MAX_REQUESTS_PER_HOUR = 5;

function getRateLimitKey(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

// deno-lint-ignore no-explicit-any
async function checkRateLimitDB(supabase: SupabaseClient<any>, ip: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  try {
    const { data, error } = await supabase.rpc('check_edge_function_rate_limit', {
      p_ip_address: ip,
      p_function_name: 'holded-lead',
      p_max_requests: MAX_REQUESTS_PER_HOUR,
      p_window_hours: 1
    });

    if (error) {
      console.error('Rate limit check error:', error.message);
      return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR, resetIn: 3600000 };
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

function validateInput(data: unknown): { valid: boolean; error?: string; parsed?: LeadData } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { name, email, company, message } = data as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return { valid: false, error: 'Name is required and must be less than 100 characters' };
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    return { valid: false, error: 'Valid email is required' };
  }

  if (company !== undefined && (typeof company !== 'string' || company.length > 200)) {
    return { valid: false, error: 'Company must be less than 200 characters' };
  }

  if (typeof message !== 'string' || message.trim().length === 0 || message.length > 2000) {
    return { valid: false, error: 'Message is required and must be less than 2000 characters' };
  }

  return {
    valid: true,
    parsed: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: typeof company === 'string' ? company.trim() : undefined,
      message: message.trim(),
    },
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
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
      console.warn(`Rate limit exceeded for IP: ${maskedIp}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Demasiadas solicitudes. Por favor, intenta más tarde.',
          retryAfterMs: resetIn,
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': String(remaining),
            'Retry-After': String(Math.ceil(resetIn / 1000)),
          } 
        }
      );
    }

    const HOLDED_API_KEY = Deno.env.get('HOLDED_API_KEY');
    
    if (!HOLDED_API_KEY) {
      console.error('HOLDED_API_KEY not configured');
      throw new Error('Holded API key not configured');
    }

    const rawBody = await req.json();
    const validation = validateInput(rawBody);

    if (!validation.valid || !validation.parsed) {
      console.warn('Input validation failed');
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, company, message } = validation.parsed;

    console.log('Creating lead in Holded CRM');

    const contactData = {
      name: name,
      email: email,
      tradename: company || '',
      notes: `Mensaje del formulario web:\n\n${message}`,
      type: 'lead',
      tags: ['web-lead', 'fenix-ia'],
    };

    console.log('Creating contact in Holded');

    const contactResponse = await fetch('https://api.holded.com/api/invoicing/v1/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'key': HOLDED_API_KEY,
      },
      body: JSON.stringify(contactData),
    });

    if (!contactResponse.ok) {
      console.error('Holded Contact API error:', contactResponse.status);
      throw new Error(`Holded Contact API error: ${contactResponse.status}`);
    }

    const contactResult = await contactResponse.json();
    console.log('Contact created successfully with ID:', contactResult.id);

    const contactId = contactResult.id;

    console.log('Fetching funnels from Holded...');
    const funnelsResponse = await fetch('https://api.holded.com/api/crm/v1/funnels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'key': HOLDED_API_KEY,
      },
    });

    if (!funnelsResponse.ok) {
      console.error('Error fetching funnels:', funnelsResponse.status);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Contact created but funnel not found',
          contactId: contactId,
          warning: 'Could not fetch funnels'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const funnels: HoldedFunnel[] = await funnelsResponse.json();
    console.log('Fetched funnels count:', funnels.length);

    const targetFunnel = funnels.find(f => 
      f.name.toUpperCase().includes('FORMULARIO CONTACTO WEB') || 
      f.name.toUpperCase() === 'FORMULARIO CONTACTO WEB'
    );

    if (!targetFunnel) {
      console.error('Target funnel not found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Contact created but specific funnel not found',
          contactId: contactId,
          availableFunnels: funnels.map(f => f.name)
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log('Target funnel found');

    const leadData = {
      funnelId: targetFunnel.id,
      contactId: contactId,
      name: company ? `${company} - ${name}` : name,
      value: 0,
      potential: 0,
    };

    console.log('Creating lead in funnel');

    const leadResponse = await fetch('https://api.holded.com/api/crm/v1/leads', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'key': HOLDED_API_KEY,
      },
      body: JSON.stringify(leadData),
    });

    if (!leadResponse.ok) {
      console.error('Holded CRM API error:', leadResponse.status);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Contact created but lead creation failed',
          contactId: contactId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const leadResult = await leadResponse.json();
    console.log('Lead created successfully in CRM with ID:', leadResult.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead created in Holded CRM funnel "FORMULARIO CONTACTO WEB"',
        contactId: contactId,
        leadId: leadResult.id,
        funnelId: targetFunnel.id,
        funnelName: targetFunnel.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating lead in Holded:', errorMessage);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
