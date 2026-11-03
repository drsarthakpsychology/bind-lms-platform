-- =============================================================================
-- Permanent student roll numbers — additive
-- =============================================================================
-- Every student gets one immutable roll number (VIBHA-000001, ...) assigned
-- server-side in chronological account-creation order. New students take the
-- next value from a sequence (concurrency-safe); existing students are
-- backfilled by an authorised Super Admin action, never auto-assigned here.
-- =============================================================================

alter table public.profiles add column if not exists roll_number text;
create unique index if not exists profiles_roll_number_unique on public.profiles (roll_number) where roll_number is not null;
create sequence if not exists public.student_roll_number_seq;

create or replace function public.assign_roll_number()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.roll_number is null then
    new.roll_number := 'VIBHA-' || lpad(nextval('public.student_roll_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create or replace function public.protect_roll_number()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.roll_number is not null and new.roll_number is distinct from old.roll_number then
    raise exception 'Roll number is immutable.';
  end if;
  return new;
end;
$$;

drop trigger if exists assign_roll_number_trigger on public.profiles;
create trigger assign_roll_number_trigger
  before insert on public.profiles
  for each row when (new.role = 'student') execute function public.assign_roll_number();

drop trigger if exists protect_roll_number_trigger on public.profiles;
create trigger protect_roll_number_trigger
  before update of roll_number on public.profiles
  for each row execute function public.protect_roll_number();
