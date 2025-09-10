-- Create deposits_offchain_meta table for maker deposit metadata (since users already exists)
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

-- Update existing orders table with missing columns if they don't exist
DO $$ 
BEGIN
    -- Add order_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'orders' AND column_name = 'order_id') THEN
        ALTER TABLE public.orders ADD COLUMN order_id TEXT UNIQUE;
    END IF;
    
    -- Add deposit_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'orders' AND column_name = 'deposit_id') THEN
        ALTER TABLE public.orders ADD COLUMN deposit_id TEXT;
    END IF;
    
    -- Add order_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'orders' AND column_name = 'order_type') THEN
        ALTER TABLE public.orders ADD COLUMN order_type TEXT CHECK (order_type IN ('onramp', 'offramp'));
    END IF;
    
    -- Add proof_bytes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'orders' AND column_name = 'proof_bytes') THEN
        ALTER TABLE public.orders ADD COLUMN proof_bytes TEXT;
    END IF;
    
    -- Add error_message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'orders' AND column_name = 'error_message') THEN
        ALTER TABLE public.orders ADD COLUMN error_message TEXT;
    END IF;
    
    -- Add metadata column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'orders' AND column_name = 'metadata') THEN
        ALTER TABLE public.orders ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END $$;

-- Enable Row Level Security on new table
ALTER TABLE public.deposits_offchain_meta ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deposits_offchain_meta (make it public for quoting)
CREATE POLICY "Anyone can view active deposits for quoting" 
ON public.deposits_offchain_meta 
FOR SELECT 
USING (is_active = true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_deposits_meta_updated_at
BEFORE UPDATE ON public.deposits_offchain_meta
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_deposits_meta_provider_active ON public.deposits_offchain_meta(provider, is_active);
CREATE INDEX idx_deposits_meta_currency ON public.deposits_offchain_meta(currency, is_active);

-- Add foreign key constraint for deposit_id reference
ALTER TABLE public.orders ADD CONSTRAINT fk_orders_deposit_id 
FOREIGN KEY (deposit_id) REFERENCES public.deposits_offchain_meta(deposit_id);