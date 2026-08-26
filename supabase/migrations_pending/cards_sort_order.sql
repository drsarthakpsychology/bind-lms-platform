-- T105: manual reorder of the study-cards review queue. Additive only.
alter table cards add column if not exists sort_order int not null default 0;
create index if not exists cards_sort_order_idx on cards (sort_order, status, created_at);
