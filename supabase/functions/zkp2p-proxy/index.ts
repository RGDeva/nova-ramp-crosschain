import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ZKP2P_API_BASE = Deno.env.get('ZKP2P_API_URL') || 'https://api.zkp2p.xyz'
const ZKP2P_API_KEY = Deno.env.get('ZKP2P_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/zkp2p-proxy', '')
    
    // Construct the target URL
    const targetUrl = `${ZKP2P_API_BASE}${path}${url.search}`

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add API key if available
    if (ZKP2P_API_KEY) {
      headers['Authorization'] = `Bearer ${ZKP2P_API_KEY}`
    }

    // Forward the request
    let body = undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.text()
    }

    console.log(`Proxying ${req.method} request to: ${targetUrl}`)

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    })

    const responseData = await response.text()
    
    return new Response(responseData, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('ZKP2P Proxy error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Proxy request failed', 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})