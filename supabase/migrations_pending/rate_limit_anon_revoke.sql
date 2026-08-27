-- rate_limit_incr() is only ever invoked by the server via the service-role
-- client (src/lib/rate-limit.ts). Anon executing it directly is pure abuse
-- surface (bucket-flooding the app's own limiter). Revoke from anon; the
-- admin client keeps access via service_role.
--
-- Also hardens protect_profile_columns() (the privilege-escalation guard the
-- profiles RLS depends on) with a fixed search_path. Idempotent.
revoke all on function public.rate_limit_incr(text, integer, bigint) from anon;

create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if NEW.role is distinct from OLD.role
      or NEW.scope is distinct from OLD.scope
      or NEW.status is distinct from OLD.status
      or NEW.is_test is distinct from OLD.is_test
      or NEW.cohort_ended_at is distinct from OLD.cohort_ended_at
      or NEW.expires_at is distinct from OLD.expires_at then
      raise exception 'Cannot change protected profile fields.';
    end if;
  end if;
  return NEW;
end;
$$;
