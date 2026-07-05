-- Adds multi-tenant authentication: shops + users, and scopes all existing
-- data tables to a shop. Existing rows are sample seed data, so they are
-- truncated rather than backfilled onto a placeholder shop.

create table shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops (id) on delete cascade,
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create index idx_users_shop_id on users (shop_id);

alter table shops enable row level security;
alter table users enable row level security;

-- Existing services/transactions/expenses rows are disposable sample data
-- (see supabase/seed.sql) and have no owning shop. Clear them before adding
-- the NOT NULL shop_id column below.
truncate table transactions, expenses, services restart identity cascade;

alter table services add column shop_id uuid references shops (id) on delete cascade;
alter table transactions add column shop_id uuid references shops (id) on delete cascade;
alter table expenses add column shop_id uuid references shops (id) on delete cascade;

alter table services alter column shop_id set not null;
alter table transactions alter column shop_id set not null;
alter table expenses alter column shop_id set not null;

create index idx_services_shop_id on services (shop_id);
create index idx_transactions_shop_id on transactions (shop_id);
create index idx_expenses_shop_id on expenses (shop_id);

-- Creates a shop and its owning user atomically: if the user insert fails
-- (e.g. duplicate email), the whole function rolls back and no shop is left
-- orphaned. The Supabase JS client has no cross-table transaction API, so
-- signup calls this function via supabase.rpc(...) instead of two inserts.
create or replace function create_shop_with_owner(
  p_shop_name text,
  p_user_name text,
  p_user_email text,
  p_password_hash text
) returns table (
  shop_id uuid,
  shop_name text,
  shop_created_at timestamptz,
  user_id uuid,
  user_name text,
  user_email text,
  user_created_at timestamptz
)
language plpgsql
as $$
declare
  v_shop_id uuid;
  v_user_id uuid;
begin
  insert into shops (name) values (p_shop_name) returning id into v_shop_id;

  insert into users (shop_id, name, email, password_hash)
    values (v_shop_id, p_user_name, p_user_email, p_password_hash)
    returning id into v_user_id;

  return query
    select s.id, s.name, s.created_at, u.id, u.name, u.email, u.created_at
    from shops s
    join users u on u.shop_id = s.id
    where s.id = v_shop_id and u.id = v_user_id;
end;
$$;
