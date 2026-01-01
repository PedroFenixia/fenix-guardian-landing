import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// ============ Rate Limiting ============
const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 5; // Conservative limit for form submissions
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour

function getRateLimitKey(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const rateLimit = RATE_LIMIT_MAP.get(ip);

  if (!rateLimit || now > rateLimit.resetAt) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }

  if (rateLimit.count >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, remaining: 0, resetIn: rateLimit.resetAt - now };
  }

  rateLimit.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - rateLimit.count, resetIn: rateLimit.resetAt - now };
}

// ============ Input Validation ============
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIp = getRateLimitKey(req);
  const { allowed, remaining, resetIn } = checkRateLimit(clientIp);

  if (!allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
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

  try {
    const HOLDED_API_KEY = Deno.env.get('HOLDED_API_KEY');
    
    if (!HOLDED_API_KEY) {
      console.error('HOLDED_API_KEY not configured');
      throw new Error('Holded API key not configured');
    }

    // Validate input
    const rawBody = await req.json();
    const validation = validateInput(rawBody);

    if (!validation.valid || !validation.parsed) {
      console.warn('Input validation failed:', validation.error);
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, company, message } = validation.parsed;

    console.log('Creating lead in Holded CRM:', { name, email, company });

    // Step 1: Create the contact first (required to get contactId)
    const contactData = {
      name: name,
      email: email,
      tradename: company || '',
      notes: `Mensaje del formulario web:\n\n${message}`,
      type: 'lead',
      tags: ['web-lead', 'fenix-ia'],
    };

    console.log('Creating contact with data:', contactData);

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
      const errorText = await contactResponse.text();
      console.error('Holded Contact API error:', contactResponse.status, errorText);
      throw new Error(`Holded Contact API error: ${contactResponse.status} - ${errorText}`);
    }

    const contactResult = await contactResponse.json();
    console.log('Contact created successfully:', contactResult);

    const contactId = contactResult.id;

    // Step 2: Get all funnels to find "FORMULARIO CONTACTO WEB"
    console.log('Fetching funnels from Holded...');
    const funnelsResponse = await fetch('https://api.holded.com/api/crm/v1/funnels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'key': HOLDED_API_KEY,
      },
    });

    if (!funnelsResponse.ok) {
      const errorText = await funnelsResponse.text();
      console.error('Error fetching funnels:', funnelsResponse.status, errorText);
      // Contact was created, but funnel assignment failed - still return success
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
    console.log('Available funnels:', funnels.map(f => ({ id: f.id, name: f.name })));

    // Find the funnel "FORMULARIO CONTACTO WEB"
    const targetFunnel = funnels.find(f => 
      f.name.toUpperCase().includes('FORMULARIO CONTACTO WEB') || 
      f.name.toUpperCase() === 'FORMULARIO CONTACTO WEB'
    );

    if (!targetFunnel) {
      console.error('Funnel "FORMULARIO CONTACTO WEB" not found. Available funnels:', funnels.map(f => f.name));
      // Contact was created, but funnel not found - still return success
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

    console.log('Target funnel found:', targetFunnel);

    // Step 3: Create the lead in the CRM with the funnel and contact ID
    const leadData = {
      funnelId: targetFunnel.id,
      contactId: contactId,
      name: company ? `${company} - ${name}` : name,
      value: 0,
      potential: 0,
    };

    console.log('Creating lead with data:', leadData);

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
      const errorText = await leadResponse.text();
      console.error('Holded CRM API error:', leadResponse.status, errorText);
      // Contact was created, but lead creation in funnel failed
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Contact created but lead creation failed',
          contactId: contactId,
          error: errorText
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const leadResult = await leadResponse.json();
    console.log('Lead created successfully in CRM:', leadResult);

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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
