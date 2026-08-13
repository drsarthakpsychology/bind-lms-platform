-- =============================================================================
-- Atomic rate-limit increment (2026-08-14)
--
-- The JS limiter did a non-atomic read-then-increment: concurrent requests for
-- the same key read the same base count and all write back base+1, so the limit
-- could be exceeded (login brute-force cap). This RPC collapses read+increment
-- into one atomic upsert. Additive + reversible (drop function to revert).
-- =============================================================================
create or replace function public.rate_limit_incr(p_key text, p_limit int, p_window_ms bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.rate_limits (key, count, reset_at)
  values (p_key, 1, now() + (p_window_ms::text || ' milliseconds')::interval)
  on conflict (key) do update
    set count = case
          when rate_limits.reset_at <= now() then 1
          else rate_limits.count + 1
        end,
        reset_at = case
          when rate_limits.reset_at <= now() then now() + (p_window_ms::text || ' milliseconds')::interval
          else rate_limits.reset_at
        end
  returning count into v_count;

  return v_count <= p_limit;
end;
$$;

revoke execute on function public.rate_limit_incr(text, int, bigint) from public;
