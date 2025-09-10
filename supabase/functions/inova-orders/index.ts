import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateOrderRequest {
  depositId: string
  orderType: 'onramp' | 'offramp'
  provider: string
  fiatAmount: number
  tokenAmount: number
  conversionRate: number
  recipientAddress?: string
}

interface UpdateOrderRequest {
  orderId: string
  status?: 'pending' | 'signaled' | 'proving' | 'fulfilled' | 'cancelled' | 'failed'
  intentHash?: string
  proofBytes?: string
  txHash?: string
  errorMessage?: string
  metadata?: any
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : ''
  console.log(`[INOVA-ORDERS] ${step}${detailsStr}`)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep('Order request started', { method: req.method })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    logStep('User authenticated', { userId: userData.user.id })

    if (req.method === 'POST') {
      const body = await req.json()
      const { depositId, orderType, provider, fiatAmount, tokenAmount, conversionRate, recipientAddress }: CreateOrderRequest = body

      logStep('Creating order', { depositId, orderType, provider, fiatAmount, tokenAmount })

      // Get or create user
      const { data: existingUser } = await supabaseClient
        .from('users')
        .select('id')
        .eq('primary_address', userData.user.id)
        .single()

      let userId = existingUser?.id
      if (!userId) {
        const { data: newUser, error: userInsertError } = await supabaseClient
          .from('users')
          .insert({
            primary_address: userData.user.id,
            privy_user_id: userData.user.id
          })
          .select('id')
          .single()

        if (userInsertError) {
          logStep('Error creating user', { error: userInsertError.message })
          return new Response(JSON.stringify({ error: 'Failed to create user' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        userId = newUser.id
      }

      // Generate unique order ID
      const orderId = `inova_${orderType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Create order
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          order_id: orderId,
          user_id: userId,
          deposit_id: depositId,
          order_type: orderType,
          provider,
          fiat_amount: fiatAmount,
          token_amount: tokenAmount,
          fiat_currency: 'USD',
          chain_id: 8453, // Base
          status: 'created',
          metadata: {
            recipientAddress,
            createdAt: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (orderError) {
        logStep('Error creating order', { error: orderError.message })
        return new Response(JSON.stringify({ error: 'Failed to create order' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      logStep('Order created successfully', { orderId })

      return new Response(JSON.stringify({
        success: true,
        order: {
          orderId: order.order_id,
          status: order.status,
          fiatAmount: order.fiat_amount,
          tokenAmount: order.token_amount,
          provider: order.provider,
          createdAt: order.created_at
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'PUT') {
      const body = await req.json()
      const { orderId, status, intentHash, proofBytes, txHash, errorMessage, metadata }: UpdateOrderRequest = body

      logStep('Updating order', { orderId, status })

      // Build update object
      const updateData: any = {}
      if (status) updateData.status = status
      if (intentHash) updateData.intent_hash = intentHash
      if (proofBytes) updateData.proof_bytes = proofBytes
      if (txHash) updateData.tx_signal = txHash
      if (errorMessage) updateData.error_message = errorMessage
      if (metadata) updateData.metadata = metadata

      // Update order
      const { data: order, error: updateError } = await supabaseClient
        .from('orders')
        .update(updateData)
        .eq('order_id', orderId)
        .select()
        .single()

      if (updateError) {
        logStep('Error updating order', { error: updateError.message })
        return new Response(JSON.stringify({ error: 'Failed to update order' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      logStep('Order updated successfully', { orderId, status: order.status })

      return new Response(JSON.stringify({
        success: true,
        order: {
          orderId: order.order_id,
          status: order.status,
          intentHash: order.intent_hash,
          txHash: order.tx_signal,
          updatedAt: order.updated_at
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const orderId = url.searchParams.get('orderId')

      if (orderId) {
        // Get specific order
        const { data: order, error } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (error) {
          logStep('Error fetching order', { error: error.message })
          return new Response(JSON.stringify({ error: 'Order not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        return new Response(JSON.stringify({ order }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } else {
        // Get user's orders
        const { data: orders, error } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          logStep('Error fetching orders', { error: error.message })
          return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        return new Response(JSON.stringify({ orders }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    logStep('Error in orders function', { error: error.message })
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})