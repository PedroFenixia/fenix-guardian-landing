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

    console.log('Creating lead in Holded:', { name, email, company });

    // Create contact in Holded CRM
    const holdedResponse = await fetch('https://api.holded.com/api/invoicing/v1/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'key': HOLDED_API_KEY,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        tradename: company || '',
        notes: message,
        type: 'lead',
        tags: ['web-lead', 'fenix-ia'],
      }),
    });

    if (!holdedResponse.ok) {
      const errorText = await holdedResponse.text();
      console.error('Holded API error:', holdedResponse.status, errorText);
      throw new Error(`Holded API error: ${holdedResponse.status}`);
    }

    const holdedData = await holdedResponse.json();
    console.log('Lead created successfully in Holded:', holdedData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead created in Holded',
        holdedId: holdedData.id 
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
