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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HOLDED_API_KEY = Deno.env.get('HOLDED_API_KEY');
    
    if (!HOLDED_API_KEY) {
      console.error('HOLDED_API_KEY not configured');
      throw new Error('Holded API key not configured');
    }

    const { name, email, company, message }: LeadData = await req.json();

    console.log('Creating lead in Holded CRM:', { name, email, company });

    // Step 1: Get all funnels to find "FORMULARIO CONTACTO WEB"
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
      throw new Error(`Error fetching funnels: ${funnelsResponse.status}`);
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
      throw new Error('Funnel "FORMULARIO CONTACTO WEB" not found');
    }

    console.log('Target funnel found:', targetFunnel);

    // Step 2: Create the lead in the CRM with the funnel
    const leadData = {
      funnelId: targetFunnel.id,
      contactName: name,
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
      throw new Error(`Holded CRM API error: ${leadResponse.status} - ${errorText}`);
    }

    const leadResult = await leadResponse.json();
    console.log('Lead created successfully in CRM:', leadResult);

    // Step 3: Also create/update the contact with full details and tags
    const contactData = {
      name: name,
      email: email,
      tradename: company || '',
      notes: `Mensaje del formulario web:\n\n${message}`,
      type: 'lead',
      tags: ['web-lead', 'fenix-ia'],
    };

    console.log('Creating/updating contact with data:', contactData);

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
      console.error('Holded Contact API error (non-critical):', contactResponse.status, errorText);
      // Don't throw here, lead was already created
    } else {
      const contactResult = await contactResponse.json();
      console.log('Contact created successfully:', contactResult);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead created in Holded CRM funnel "FORMULARIO CONTACTO WEB"',
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
