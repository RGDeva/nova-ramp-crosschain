import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateMakerRequest {
  rawPayeeId: string
  provider: string
  currency?: string
  minAmount: number
  maxAmount: number
  conversionRate: number
  feePercentage?: number
}

interface ValidateMakerRequest {
  rawPayeeId: string
  provider: string
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : ''
  console.log(`[MAKERS] ${step}${detailsStr}`)
}

// Simple hash function for payee IDs (in production, use proper hashing)
const hashPayeeId = (payeeId: string): string => {
  let hash = 0
  for (let i = 0; i < payeeId.length; i++) {
    const char = payeeId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0')
}

const normalizePayeeId = (payeeId: string, provider: string): string => {
  // Normalize payee ID based on provider rules
  switch (provider.toLowerCase()) {
    case 'venmo':
      return payeeId.toLowerCase().replace(/[^a-z0-9]/g, '')
    case 'cashapp':
      return payeeId.toLowerCase().replace(/[^a-z0-9]/g, '')
    case 'zelle':
      return payeeId.toLowerCase() // Usually email
    case 'wise':
      return payeeId.toLowerCase()
    case 'revolut':
      return payeeId.toLowerCase()
    default:
      return payeeId.toLowerCase()
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep('Makers request started', { method: req.method })

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
      const url = new URL(req.url)
      const action = url.pathname.split('/').pop()

      if (action === 'validate') {
        const { rawPayeeId, provider }: ValidateMakerRequest = body

        logStep('Validating maker', { rawPayeeId, provider })

        // Basic validation rules
        const validation = {
          isValid: true,
          errors: [] as string[],
          normalizedId: normalizePayeeId(rawPayeeId, provider),
          hashedId: hashPayeeId(normalizePayeeId(rawPayeeId, provider))
        }

        // Provider-specific validation
        switch (provider.toLowerCase()) {
          case 'venmo':
            if (rawPayeeId.length < 3) {
              validation.isValid = false
              validation.errors.push('Venmo username must be at least 3 characters')
            }
            break
          case 'cashapp':
            if (!rawPayeeId.startsWith('$') || rawPayeeId.length < 4) {
              validation.isValid = false
              validation.errors.push('Cash App cashtag must start with $ and be at least 4 characters')
            }
            break
          case 'zelle':
            if (!rawPayeeId.includes('@')) {
              validation.isValid = false
              validation.errors.push('Zelle requires an email address')
            }
            break
        }

        // Check if already exists
        const { data: existing } = await supabaseClient
          .from('deposits_offchain_meta')
          .select('id')
          .eq('normalized_payee_id', validation.normalizedId)
          .eq('provider', provider)
          .eq('is_active', true)
          .single()

        if (existing) {
          validation.isValid = false
          validation.errors.push('This payee ID is already registered')
        }

        logStep('Validation result', validation)

        return new Response(JSON.stringify(validation), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (action === 'create') {
        const { rawPayeeId, provider, currency = 'USD', minAmount, maxAmount, conversionRate, feePercentage = 0.01 }: CreateMakerRequest = body

        logStep('Creating maker', { rawPayeeId, provider, minAmount, maxAmount })

        // First validate
        const normalizedId = normalizePayeeId(rawPayeeId, provider)
        const hashedId = hashPayeeId(normalizedId)

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

        // Create deposit metadata
        const { data: deposit, error: depositError } = await supabaseClient
          .from('deposits_offchain_meta')
          .insert({
            deposit_id: `deposit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            user_id: userId,
            raw_payee_id: rawPayeeId,
            normalized_payee_id: normalizedId,
            hashed_onchain_id: hashedId,
            provider,
            currency,
            min_amount: minAmount,
            max_amount: maxAmount,
            conversion_rate: conversionRate,
            fee_percentage: feePercentage
          })
          .select()
          .single()

        if (depositError) {
          logStep('Error creating deposit', { error: depositError.message })
          return new Response(JSON.stringify({ error: 'Failed to create deposit' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        logStep('Deposit created successfully', { depositId: deposit.deposit_id })

        return new Response(JSON.stringify({
          success: true,
          depositId: deposit.deposit_id,
          hashedOnchainId: hashedId,
          normalizedId
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    if (req.method === 'GET') {
      // Get user's deposits
      const { data: deposits, error } = await supabaseClient
        .from('deposits_offchain_meta')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        logStep('Error fetching deposits', { error: error.message })
        return new Response(JSON.stringify({ error: 'Failed to fetch deposits' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ deposits }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    logStep('Error in makers function', { error: error.message })
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})