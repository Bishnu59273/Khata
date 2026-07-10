-- Customer khata (udhaar) tracking.
-- Udhaar is modelled as a 4th payment_mode on transactions plus a
-- customer_payments table for lump-sum settlements. A customer's balance is
-- always derived (sum of udhaar charges minus sum of payments) via the
-- customer_balances view, so editing/deleting a transaction self-corrects.
-- transactions.customer_name stays as a denormalized snapshot for walk-ins
-- and so bills/history keep working if a customer record is deleted.

create table customers (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops (id) on delete cascade,
  name text not null,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);
create index idx_customers_shop_id on customers (shop_id);
alter table customers enable row level security;

alter table transactions add column customer_id uuid references customers (id) on delete set null;
create index idx_transactions_customer_id on transactions (customer_id) where customer_id is not null;

-- Widen the payment_mode check from 0001. The inline column check there gets
-- Postgres's default name transactions_payment_mode_check.
alter table transactions drop constraint if exists transactions_payment_mode_check;
alter table transactions add constraint transactions_payment_mode_check
  check (payment_mode in ('cash', 'upi', 'online', 'udhaar'));
alter table transactions add constraint transactions_udhaar_requires_customer
  check (payment_mode <> 'udhaar' or customer_id is not null);

create table customer_payments (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops (id) on delete cascade,
  customer_id uuid not null references customers (id) on delete cascade,
  amount numeric(10, 2) not null check (amount > 0),
  payment_mode text not null default 'cash' check (payment_mode in ('cash', 'upi', 'online')),
  note text,
  created_at timestamptz not null default now()
);
create index idx_customer_payments_shop_id on customer_payments (shop_id);
create index idx_customer_payments_customer_id on customer_payments (customer_id);
alter table customer_payments enable row level security;

-- Single place that defines the balance math. Only the backend queries this
-- (service_role bypasses RLS, matching every other table here).
-- security_invoker is required: without it the view runs as its creator
-- (postgres, which bypasses RLS) and would be readable through Supabase's
-- public REST API with just the anon key. With it, callers hit the
-- deny-by-default RLS on the underlying tables; service_role still bypasses.
create view customer_balances with (security_invoker = on) as
select
  c.id as customer_id,
  c.shop_id,
  coalesce(t.total, 0)                        as total_udhaar,
  coalesce(p.total, 0)                        as total_paid,
  coalesce(t.total, 0) - coalesce(p.total, 0) as balance
from customers c
left join (
  select customer_id, sum(customer_charge) as total
  from transactions
  where payment_mode = 'udhaar'
  group by customer_id
) t on t.customer_id = c.id
left join (
  select customer_id, sum(amount) as total
  from customer_payments
  group by customer_id
) p on p.customer_id = c.id;
