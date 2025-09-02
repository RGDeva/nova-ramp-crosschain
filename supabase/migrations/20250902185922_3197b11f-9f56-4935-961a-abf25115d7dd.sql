-- INoVA Ramp Database Schema - Complete Setup
-- Users table for Privy integration
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  privy_user_id text unique not null,
  primary_address text not null,
  created_at timestamptz default now()
);

-- Orders table for onramp intents
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  intent_hash text,
  provider text,
  fiat_currency text,
  fiat_amount numeric,
  token_amount numeric,
  chain_id bigint,
  status text default 'created',
  tx_signal text,
  tx_fulfill text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Deposits table for maker functionality
create table if not exists deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  amount_usdc numeric,
  min_per_order numeric,
  max_per_order numeric,
  verifier text,
  status text default 'active',
  tx_create text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table users enable row level security;
alter table orders enable row level security;
alter table deposits enable row level security;

-- Create policies that allow service role access only
create policy "service_role_only_users"
  on users for all using (false) with check (false);

create policy "service_role_only_orders"
  on orders for all using (false) with check (false);

create policy "service_role_only_deposits"
  on deposits for all using (false) with check (false);

-- Create function to update timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for automatic timestamp updates
create trigger update_orders_updated_at
  before update on orders
  for each row execute function update_updated_at_column();

create trigger update_deposits_updated_at
  before update on deposits
  for each row execute function update_updated_at_column();