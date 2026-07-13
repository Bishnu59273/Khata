-- 1) Per-transaction discount. customer_charge stays the gross (list) price;
--    discount is subtracted from it, so profit and udhaar dues are net.
-- 2) Retire the 'online' payment mode — it duplicated 'upi'. Existing rows are
--    folded into 'upi' before the check constraints are tightened.

alter table transactions add column discount numeric(10, 2) not null default 0
  check (discount >= 0);

-- A generated column's expression can't be altered in place; recreate profit
-- net of discount.
alter table transactions drop column profit;
alter table transactions add column profit numeric(10, 2)
  generated always as (customer_charge - discount - cost_paid) stored;

update transactions set payment_mode = 'upi' where payment_mode = 'online';
alter table transactions drop constraint transactions_payment_mode_check;
alter table transactions add constraint transactions_payment_mode_check
  check (payment_mode in ('cash', 'upi', 'udhaar'));

update customer_payments set payment_mode = 'upi' where payment_mode = 'online';
alter table customer_payments drop constraint customer_payments_payment_mode_check;
alter table customer_payments add constraint customer_payments_payment_mode_check
  check (payment_mode in ('cash', 'upi'));

-- Udhaar dues are what the customer actually owes, i.e. net of discount.
create or replace view customer_balances with (security_invoker = on) as
select
  c.id as customer_id,
  c.shop_id,
  coalesce(t.total, 0)                        as total_udhaar,
  coalesce(p.total, 0)                        as total_paid,
  coalesce(t.total, 0) - coalesce(p.total, 0) as balance
from customers c
left join (
  select customer_id, sum(customer_charge - discount) as total
  from transactions
  where payment_mode = 'udhaar'
  group by customer_id
) t on t.customer_id = c.id
left join (
  select customer_id, sum(amount) as total
  from customer_payments
  group by customer_id
) p on p.customer_id = c.id;
