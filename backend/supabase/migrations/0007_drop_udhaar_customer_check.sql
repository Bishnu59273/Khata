-- 0006's transactions_udhaar_requires_customer check conflicts with the
-- customer_id FK's on delete set null: deleting a settled customer nulls
-- customer_id on their historical udhaar transactions, which the check then
-- rejects, so no customer with udhaar history could ever be deleted.
-- udhaar⇒customer is enforced at the API layer (zod schema on create, the
-- transactions controller on update), so drop the DB-level check. Historical
-- udhaar rows keep the customer_name snapshot, and the backend blocks
-- deletion while a balance is outstanding, so no dues can vanish.
alter table transactions drop constraint if exists transactions_udhaar_requires_customer;
