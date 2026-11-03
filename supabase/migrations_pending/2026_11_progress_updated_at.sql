-- =============================================================================
-- OPTIONAL. Lecture progress integrity (DISCOVERY_AUDIT H1). Additive and safe
-- to apply any time. With this column, pingProgress bounds how far the saved
-- position may jump forward by the wall time since the previous ping
-- (src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/progress-clamp.ts).
-- Without it that bound is skipped; the duration clamp still applies.
-- =============================================================================
alter table public.progress add column if not exists updated_at timestamptz not null default now();

-- Keep it fresh on every write, including writes that don't set it.
create or replace function public.touch_progress_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists progress_touch_updated_at on public.progress;
create trigger progress_touch_updated_at before update on public.progress
  for each row execute function public.touch_progress_updated_at();
