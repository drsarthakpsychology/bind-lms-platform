-- =============================================================================
-- SCT items — slug so the seed items (sct-1..sct-7) can resolve a real FK
-- for sct_attempts (Part 6.3 follow-through; the osce/mse/formulation pattern).
-- =============================================================================
-- sct_attempts (practice_layer_tools.sql) references sct_items by uuid, but
-- Judgment Calls runs on static ALL_SEED_SCT_ITEMS with no DB rows behind
-- them. Add a stable slug so the upsert script / route can key on it.
-- Additive + idempotent.

alter table if exists public.sct_items
  add column if not exists slug text;

update public.sct_items set slug = id::text where slug is null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'sct_items_slug_key') then
    alter table public.sct_items add constraint sct_items_slug_key unique (slug);
  end if;
end $$;

alter table public.sct_items alter column slug set not null;
create index if not exists idx_sct_items_slug on public.sct_items (slug);

-- sct_attempts is unique(item_id, user_id): a repeat judgment call updates the
-- row rather than inserting a duplicate. That needs an owner update policy.
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'sct_attempts_update_own') then
    create policy "sct_attempts_update_own" on public.sct_attempts
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;
