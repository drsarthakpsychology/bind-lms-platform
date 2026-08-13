-- =============================================================================
-- VIBHA Practice Layer — infra (v3 Part 3.6, made reproducible)
-- =============================================================================
-- These objects were previously applied directly to the live database only.
-- This migration makes them reproducible on a fresh Supabase project:
--   - infra_metrics() RPC (service_role only) feeding /admin/infra
--   - infra_snapshots table (daily snapshot history written by the cron)
--   - text-column size caps so one runaway row can't blow the 500 MB free tier
-- Additive + idempotent.

-- ---------------------------------------------------------------------------
-- infra_metrics() — returns the live headroom numbers in one JSONB object.
-- Service-role only (revoked from anon/authenticated below).
-- ---------------------------------------------------------------------------
create or replace function public.infra_metrics()
  returns jsonb
  language plpgsql
  set search_path = public
as $function$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'db_size_bytes', coalesce((select sum(pg_database_size(datname)) from pg_database where datname = current_database()), 0),
    'top_tables', (
      select coalesce(jsonb_agg(x order by x.size desc), '[]'::jsonb)
      from (
        select c.relname as name,
               pg_total_relation_size(c.oid) as size
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'public'
          and c.relkind in ('r','m')
        order by pg_total_relation_size(c.oid) desc
        limit 10
      ) x
    ),
    'ai_usage_7d', coalesce((
      select jsonb_agg(u order by u.calls desc)
      from (
        select provider, count(*) as calls, sum(tokens_in + tokens_out) as tokens
        from public.ai_usage_log
        where created_at > now() - interval '7 days'
        group by provider
      ) u
    ), '[]'::jsonb),
    'provider_health', coalesce((
      select jsonb_agg(h order by h.provider)
      from public.provider_health h
    ), '[]'::jsonb)
  ) into result;
  return result;
end;
$function$;

revoke all on function public.infra_metrics() from anon, authenticated;

-- ---------------------------------------------------------------------------
-- infra_snapshots — the daily snapshot written by the GitHub Actions cron
-- (infra-check.yml → /api/internal/cron?task=infra-snapshot).
-- ---------------------------------------------------------------------------
create table if not exists public.infra_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  snapshot jsonb not null default '{}'::jsonb,
  taken_at timestamptz not null default now()
);

alter table public.infra_snapshots enable row level security;
create policy "infra_snapshots_admin_all" on public.infra_snapshots
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- text-column size caps — one runaway row must never blow the free tier.
-- (The longest realistic clinical entries are far below these caps.)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'journal_content_cap') then
    alter table public.journal_entries add constraint journal_content_cap check (char_length(content) <= 20000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'wall_posts_content_cap') then
    alter table public.wall_posts add constraint wall_posts_content_cap check (char_length(content) <= 10000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'wall_replies_content_cap') then
    alter table public.wall_replies add constraint wall_replies_content_cap check (char_length(content) <= 5000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'corpus_docs_content_cap') then
    alter table public.corpus_documents add constraint corpus_docs_content_cap check (char_length(content) <= 2000000);
  end if;
end $$;