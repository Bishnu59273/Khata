-- Lets a single transaction record multiple units of a service (e.g. 100 xerox
-- copies) instead of forcing one row per unit.

alter table transactions add column quantity integer not null default 1 check (quantity > 0);
