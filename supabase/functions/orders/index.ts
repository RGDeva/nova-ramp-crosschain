import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { PrivyApi } from 'https://esm.sh/@privy-io/server-auth@1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null
  
  const token = authHeader.replace('Bearer ', '')
  
  try {
    const privy = new PrivyApi(
      Deno.env.get('PRIVY_APP_ID') ?? '',
      Deno.env.get('PRIVY_APP_SECRET') ?? ''
    )
    
    const claims = await privy.verifyAuthToken(token)
    return claims?.userId || null
  } catch {
    return null
  }
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

    const privyUserId = await verifyUser(req.headers.get('authorization'))
    
    if (!privyUserId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user from database
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('privy_user_id', privyUserId)
      .single()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (req.method) {
      case 'GET':
        if (action === 'list') {
          const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) throw error

          return new Response(
            JSON.stringify({ orders }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'POST':
        if (action === 'create') {
          const orderData = await req.json()
          
          const { data: order, error } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              ...orderData,
            })
            .select()
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify({ order }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else if (action === 'update') {
          const { orderId, ...updateData } = await req.json()
          
          const { data: order, error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', orderId)
            .eq('user_id', user.id)
            .select()
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify({ order }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Orders API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})