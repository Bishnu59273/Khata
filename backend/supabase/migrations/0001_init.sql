-- Khata initial schema: services, transactions, expenses
-- RLS is enabled on every table with NO policies added for anon/authenticated.
-- This is deliberate: RLS-enabled-with-zero-policies denies all access by
-- default. The Express backend connects using the Supabase service_role key,
-- which carries BYPASSRLS and ignores RLS entirely. The frontend never talks
-- to Supabase directly, so this gives full access from the trusted backend
-- and zero access from anywhere else, with no per-row ownership model needed.

create extension if not exists pgcrypto;

create table services (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_hi text not null,
  name_bn text not null,
  default_charge numeric(10, 2) not null default 0,
  default_cost numeric(10, 2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services (id) on delete restrict,
  customer_name text,
  customer_charge numeric(10, 2) not null,
  cost_paid numeric(10, 2) not null default 0,
  profit numeric(10, 2) generated always as (customer_charge - cost_paid) stored,
  payment_mode text not null check (payment_mode in ('cash', 'upi', 'online')),
  created_at timestamptz not null default now()
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text not null,
  amount numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create index idx_transactions_service_id on transactions (service_id);
create index idx_transactions_created_at on transactions (created_at);
create index idx_expenses_created_at on expenses (created_at);
create index idx_services_is_active on services (is_active) where is_active = true;

alter table services enable row level security;
alter table transactions enable row level security;
alter table expenses enable row level security;
