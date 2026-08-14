-- =============================================================================
-- ai_response_cache.sql — AI response cache (cuts API calls per §37 model)
-- -----------------------------------------------------------------------------
-- Additive + idempotent. Caches grounded AI responses keyed by a content hash
-- of the request, with a TTL, so repeated questions (common quiz items, the
-- same tutor ask from many students) hit the cache instead of the API. The
-- capacity model (docs/CAPACITY_MODEL.md) identified Groq's requests/day as the
-- 45-DAU bottleneck; this trims ~10%+ of calls on top of the provider lanes.
--
-- Cache key: sha256(workload | question | provider | tier). TTL is checked at
-- read time (expired rows are returned as a miss and pruned lazily).
-- =============================================================================

create table if not exists public.ai_response_cache (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  cache_key text not null,
  workload text not null,
  provider text not null,
  response_text text not null,
  model text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  unique (cache_key)
);

alter table public.ai_response_cache enable row level security;

create policy "ai_response_cache_admin_manage" on public.ai_response_cache
  for all to public using (is_admin()) with check (is_admin());

create index if not exists idx_ai_response_cache_key on public.ai_response_cache (cache_key);
create index if not exists idx_ai_response_cache_expiry on public.ai_response_cache (expires_at);
