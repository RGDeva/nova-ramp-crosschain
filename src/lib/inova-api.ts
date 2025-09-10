// INoVA API client for backend integration
import { supabase } from '@/integrations/supabase/client'

export interface Quote {
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

export interface Order {
  orderId: string
  status: 'pending' | 'signaled' | 'proving' | 'fulfilled' | 'cancelled' | 'failed'
  fiatAmount: number
  tokenAmount: number
  provider: string
  createdAt: string
}

export interface CreateOrderRequest {
  depositId: string
  orderType: 'onramp' | 'offramp'
  provider: string
  fiatAmount: number
  tokenAmount: number
  conversionRate: number
  recipientAddress?: string
}

export interface MakerDeposit {
  depositId: string
  provider: string
  currency: string
  minAmount: number
  maxAmount: number
  conversionRate: number
  feePercentage: number
  isActive: boolean
  createdAt: string
}

// Quote Engine API
export const fetchQuotes = async (
  fiatAmount: number,
  provider?: string,
  currency = 'USD',
  orderType: 'onramp' | 'offramp' = 'onramp'
): Promise<Quote[]> => {
  try {
    const params = new URLSearchParams({
      fiatAmount: fiatAmount.toString(),
      currency,
      orderType
    })
    
    if (provider) {
      params.append('provider', provider)
    }

    const { data, error } = await supabase.functions.invoke(`quotes?${params.toString()}`)

    if (error) throw error
    return data.quotes || []
  } catch (error) {
    console.error('Error fetching quotes:', error)
    throw error
  }
}

// Order Management API
export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  try {
    const { data, error } = await supabase.functions.invoke('inova-orders', {
      body: orderData
    })

    if (error) throw error
    return data.order
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export const updateOrder = async (
  orderId: string,
  updates: {
    status?: string
    intentHash?: string
    proofBytes?: string
    txHash?: string
    errorMessage?: string
    metadata?: any
  }
): Promise<Order> => {
  try {
    const { data, error } = await supabase.functions.invoke('inova-orders', {
      method: 'PUT',
      body: { orderId, ...updates }
    })

    if (error) throw error
    return data.order
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}

export const fetchUserOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('inova-orders', {
      method: 'GET'
    })

    if (error) throw error
    return data.orders || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export const fetchOrderById = async (orderId: string): Promise<Order> => {
  try {
    const { data, error } = await supabase.functions.invoke(`inova-orders?orderId=${orderId}`)

    if (error) throw error
    return data.order
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

// Maker Management API
export const validateMaker = async (rawPayeeId: string, provider: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('makers/validate', {
      body: { rawPayeeId, provider }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error validating maker:', error)
    throw error
  }
}

export const createMaker = async (makerData: {
  rawPayeeId: string
  provider: string
  currency?: string
  minAmount: number
  maxAmount: number
  conversionRate: number
  feePercentage?: number
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('makers/create', {
      body: makerData
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating maker:', error)
    throw error
  }
}

export const fetchUserDeposits = async (): Promise<MakerDeposit[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('makers', {
      method: 'GET'
    })

    if (error) throw error
    return data.deposits || []
  } catch (error) {
    console.error('Error fetching deposits:', error)
    throw error
  }
}

// Contract Integration Helpers
export const signalIntent = async (
  depositId: string,
  amount: number,
  recipientAddress: string,
  verifierAddress: string,
  fiatHash: string,
  gatingSig = '0x'
) => {
  // This would integrate with wagmi/viem for actual contract calls
  // For now, return mock data
  const intentHash = `0x${Math.random().toString(16).substring(2, 66)}`
  
  console.log('Signaling intent:', {
    depositId,
    amount,
    recipientAddress,
    verifierAddress,
    fiatHash,
    gatingSig,
    intentHash
  })

  return {
    intentHash,
    txHash: `0x${Math.random().toString(16).substring(2, 66)}`
  }
}

export const fulfillIntent = async (proofBytes: string, intentHash: string) => {
  // This would integrate with wagmi/viem for actual contract calls
  // For now, return mock data
  const txHash = `0x${Math.random().toString(16).substring(2, 66)}`
  
  console.log('Fulfilling intent:', {
    proofBytes: proofBytes.substring(0, 100) + '...',
    intentHash,
    txHash
  })

  return { txHash }
}

// Utility functions
export const formatAmount = (amount: number, decimals = 6): string => {
  return (amount / Math.pow(10, decimals)).toFixed(decimals)
}

export const parseAmount = (amount: string, decimals = 6): number => {
  return Math.floor(parseFloat(amount) * Math.pow(10, decimals))
}

export const generateFiatHash = (amount: number, currency: string): string => {
  // Simple hash for demo - in production use proper hashing
  const input = `${amount}_${currency}_${Date.now()}`
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0')
}