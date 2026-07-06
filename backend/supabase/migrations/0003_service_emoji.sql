-- Lets shop owners pick any emoji icon for a service instead of relying on
-- keyword-matched defaults computed on the frontend.

alter table services add column emoji text not null default '🧰';
