import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuoteRequest {
  fiatAmount: number
  provider?: string
  currency?: string
  orderType: 'onramp' | 'offramp'
}

interface Quote {
  depositId: string
  verifier: string
  provider: string
  fiatAmount: number
  tokenAmount: number
  conversionRate: number
  protocolFee: number
  makerFee: number
  netAmount: number
  eta: string
  fees: {
    protocol: number
    maker: number
    total: number
  }
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : ''
  console.log(`[QUOTES] ${step}${detailsStr}`)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep('Quote request started')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const fiatAmount = parseFloat(url.searchParams.get('fiatAmount') || '0')
      const provider = url.searchParams.get('provider') || ''
      const currency = url.searchParams.get('currency') || 'USD'
      const orderType = url.searchParams.get('orderType') as 'onramp' | 'offramp' || 'onramp'

      logStep('Parsed query parameters', { fiatAmount, provider, currency, orderType })

      if (fiatAmount <= 0) {
        return new Response(JSON.stringify({ error: 'Invalid fiat amount' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Query active deposits from our database
      let query = supabaseClient
        .from('deposits_offchain_meta')
        .select('*')
        .eq('is_active', true)
        .eq('currency', currency)
        .lte('min_amount', fiatAmount)
        .gte('max_amount', fiatAmount)

      if (provider) {
        query = query.eq('provider', provider)
      }

      const { data: deposits, error } = await query.order('conversion_rate', { ascending: false })

      if (error) {
        logStep('Database error', { error: error.message })
        return new Response(JSON.stringify({ error: 'Failed to fetch deposits' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      logStep('Found deposits', { count: deposits?.length || 0 })

      // Mock some deposits if none found (for demo purposes)
      const mockDeposits = deposits && deposits.length > 0 ? deposits : [
        {
          deposit_id: 'mock-1',
          provider: provider || 'venmo',
          currency: 'USD',
          min_amount: 10,
          max_amount: 1000,
          conversion_rate: 0.998,
          fee_percentage: 0.01,
          raw_payee_id: 'mock-venmo-user',
          normalized_payee_id: 'mock-venmo-user',
          hashed_onchain_id: '0x' + 'a'.repeat(64)
        },
        {
          deposit_id: 'mock-2',
          provider: 'cashapp',
          currency: 'USD',
          min_amount: 5,
          max_amount: 500,
          conversion_rate: 0.997,
          fee_percentage: 0.015,
          raw_payee_id: 'mock-cashapp-user',
          normalized_payee_id: 'mock-cashapp-user',
          hashed_onchain_id: '0x' + 'b'.repeat(64)
        }
      ]

      // Calculate quotes
      const quotes: Quote[] = mockDeposits
        .filter(deposit => {
          if (provider && deposit.provider !== provider) return false
          return fiatAmount >= deposit.min_amount && fiatAmount <= deposit.max_amount
        })
        .map(deposit => {
          const tokenAmount = fiatAmount * deposit.conversion_rate
          const protocolFee = tokenAmount * 0.001 // 0.1% protocol fee
          const makerFee = tokenAmount * deposit.fee_percentage
          const netAmount = tokenAmount - protocolFee - makerFee

          return {
            depositId: deposit.deposit_id,
            verifier: `${deposit.provider}Verifier`,
            provider: deposit.provider,
            fiatAmount,
            tokenAmount,
            conversionRate: deposit.conversion_rate,
            protocolFee,
            makerFee,
            netAmount,
            eta: deposit.provider === 'venmo' ? '2-5 minutes' : '5-10 minutes',
            fees: {
              protocol: protocolFee,
              maker: makerFee,
              total: protocolFee + makerFee
            }
          }
        })
        .sort((a, b) => b.netAmount - a.netAmount) // Sort by best net amount

      logStep('Generated quotes', { count: quotes.length })

      return new Response(JSON.stringify({ quotes }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    logStep('Error in quotes function', { error: error.message })
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})