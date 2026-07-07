-- Adds shop contact details used on the printed bill header.

alter table shops add column address text;
alter table shops add column phone text;
alter table shops add column gstin text;
