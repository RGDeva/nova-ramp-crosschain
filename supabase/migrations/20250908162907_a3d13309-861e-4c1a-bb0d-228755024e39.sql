-- Create users table for additional user metadata
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create deposits_offchain_meta table for maker deposit metadata
CREATE TABLE public.deposits_offchain_meta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deposit_id TEXT NOT NULL UNIQUE, -- on-chain deposit ID
  user_id UUID NOT NULL REFERENCES public.users(id),
  raw_payee_id TEXT NOT NULL, -- original payee identifier from provider
  normalized_payee_id TEXT NOT NULL, -- normalized version
  hashed_onchain_id TEXT NOT NULL, -- hash used on-chain
  provider TEXT NOT NULL, -- venmo, cashapp, etc
  currency TEXT NOT NULL DEFAULT 'USD',
  min_amount DECIMAL(18,6) NOT NULL,
  max_amount DECIMAL(18,6) NOT NULL,
  conversion_rate DECIMAL(18,6) NOT NULL,
  fee_percentage DECIMAL(5,4) NOT NULL DEFAULT 0.01, -- 1% default
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for tracking order lifecycle
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE, -- client-generated order ID
  user_id UUID NOT NULL REFERENCES public.users(id),
  deposit_id TEXT REFERENCES public.deposits_offchain_meta(deposit_id),
  order_type TEXT NOT NULL CHECK (order_type IN ('onramp', 'offramp')),
  provider TEXT NOT NULL,
  fiat_amount DECIMAL(18,6) NOT NULL,
  token_amount DECIMAL(18,6) NOT NULL,
  conversion_rate DECIMAL(18,6) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signaled', 'proving', 'fulfilled', 'cancelled', 'failed')),
  intent_hash TEXT,
  proof_bytes TEXT,
  tx_hash TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits_offchain_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (wallet_address = auth.jwt() ->> 'wallet_address' OR wallet_address = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (wallet_address = auth.jwt() ->> 'wallet_address' OR wallet_address = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (wallet_address = auth.jwt() ->> 'wallet_address' OR wallet_address = auth.jwt() ->> 'sub');

-- Create RLS policies for deposits_offchain_meta
CREATE POLICY "Users can view all deposits for quoting" 
ON public.deposits_offchain_meta 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create their own deposits" 
ON public.deposits_offchain_meta 
FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM public.users WHERE wallet_address = auth.jwt() ->> 'wallet_address' OR wallet_address = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own deposits" 
ON public.deposits_offchain_meta 
FOR UPDATE 
USING (user_id IN (SELECT id FROM public.users WHERE wallet_address = auth.jwt() ->> 'wallet_address' OR wallet_address = auth.jwt() ->> 'sub'));

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (user_id IN (SELECT id FROM public.users WHERE wallet_address = auth.jwt() ->> 'wallet_address' OR wallet_address = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM public.users WHERE wallet_address = auth.jwt() ->> 'wallet_address' OR wallet_address = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (user_id IN (SELECT id FROM public.users WHERE wallet_address = auth.jwt() ->> 'wallet_address' OR wallet_address = auth.jwt() ->> 'sub'));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deposits_updated_at
BEFORE UPDATE ON public.deposits_offchain_meta
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_deposits_provider_active ON public.deposits_offchain_meta(provider, is_active);
CREATE INDEX idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX idx_orders_status_created ON public.orders(status, created_at DESC);