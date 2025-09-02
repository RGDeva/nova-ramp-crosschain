import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { PrivyApi } from 'https://esm.sh/@privy-io/server-auth@1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const privy = new PrivyApi(
      Deno.env.get('PRIVY_APP_ID') ?? '',
      Deno.env.get('PRIVY_APP_SECRET') ?? ''
    )

    if (req.method === 'POST') {
      const { idToken } = await req.json()

      // Verify Privy JWT token
      const claims = await privy.verifyAuthToken(idToken)
      
      if (!claims || !claims.userId) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get user info from Privy
      const privyUser = await privy.getUser(claims.userId)
      const primaryAddress = privyUser.wallet?.address

      if (!primaryAddress) {
        return new Response(
          JSON.stringify({ error: 'No wallet address found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Upsert user in our database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert({
          privy_user_id: claims.userId,
          primary_address: primaryAddress,
        })
        .select()
        .single()

      if (userError) {
        console.error('User upsert error:', userError)
        return new Response(
          JSON.stringify({ error: 'Failed to create user session' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Return success with user data
      return new Response(
        JSON.stringify({ 
          success: true, 
          user: userData,
          sessionId: claims.userId 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Session error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})