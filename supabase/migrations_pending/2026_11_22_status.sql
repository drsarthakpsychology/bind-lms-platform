-- 2026_11_22_status.sql
-- The database itself now refuses writes from a paused student, a student
-- whose access has ended, and (for the class wall) a lectures-only student.
-- It also stops students writing their own practice scores, passport events
-- and streaks straight into the database: only the website's server does.
--
-- Additive only: two new functions and new RESTRICTIVE rules. Existing rules
-- are not changed or dropped. A restrictive rule only ever takes rights away,
-- and the website's server key is not affected by any of them, so the site
-- works the same before and after this runs.
--
-- Test after running: sign in as the test student, post on the wall, ask a
-- doubt, hand in work. Then pause the test student and try again (refused).

-- Signed in, not paused, access not ended (alumni never end). Staff always pass.
create or replace function public.is_active_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and (
        p.role in ('admin', 'view_admin')
        or (
          coalesce(p.status, 'active') <> 'blocked'
          and (p.expires_at is null or p.expires_at > now() or p.role = 'alumni')
        )
      )
  );
$$;

-- Active, and Full access (not lectures-only).
create or replace function public.is_full_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_active_member() and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and (p.role in ('admin', 'view_admin') or coalesce(p.scope, 'full') <> 'lectures_only')
  );
$$;

revoke all on function public.is_active_member() from public, anon;
revoke all on function public.is_full_member() from public, anon;
grant execute on function public.is_active_member() to authenticated, service_role;
grant execute on function public.is_full_member() to authenticated, service_role;

-- Helper: one restrictive rule per table and write kind, made safe to run twice.
do $$
declare
  t record;
begin
  for t in
    select * from (values
      -- Class wall: Full access only.
      ('wall_posts', 'full'), ('wall_replies', 'full'), ('wall_reactions', 'full'), ('wall_reports', 'full'),
      -- Doubts and hand-ins: lectures-only students may use them.
      ('doubts', 'active'), ('doubt_replies', 'active'), ('doubt_votes', 'active'),
      ('submissions', 'active'), ('submission_files', 'active')
    ) as v(tbl, need)
  loop
    if to_regclass('public.' || t.tbl) is null then continue; end if;
    execute format('drop policy if exists %I on public.%I', t.tbl || '_active_ins', t.tbl);
    execute format('drop policy if exists %I on public.%I', t.tbl || '_active_upd', t.tbl);
    execute format('drop policy if exists %I on public.%I', t.tbl || '_active_del', t.tbl);
    execute format('create policy %I on public.%I as restrictive for insert to authenticated with check (public.%s())',
      t.tbl || '_active_ins', t.tbl, case t.need when 'full' then 'is_full_member' else 'is_active_member' end);
    execute format('create policy %I on public.%I as restrictive for update to authenticated using (public.%s())',
      t.tbl || '_active_upd', t.tbl, case t.need when 'full' then 'is_full_member' else 'is_active_member' end);
    execute format('create policy %I on public.%I as restrictive for delete to authenticated using (public.%s())',
      t.tbl || '_active_del', t.tbl, case t.need when 'full' then 'is_full_member' else 'is_active_member' end);
  end loop;
end $$;

-- Scores, passport events and streaks: written by the server only. A student's
-- own key can still read their rows, but no longer insert or change them.
-- (The Super Admin keeps direct rights for corrections.)
do $$
declare
  t text;
begin
  foreach t in array array['quiz_attempts', 'mse_attempts', 'osce_attempts', 'formulation_attempts', 'competency_events', 'streaks', 'card_reviews']
  loop
    if to_regclass('public.' || t) is null then continue; end if;
    execute format('drop policy if exists %I on public.%I', t || '_server_only_ins', t);
    execute format('drop policy if exists %I on public.%I', t || '_server_only_upd', t);
    execute format('create policy %I on public.%I as restrictive for insert to authenticated, anon with check (public.is_super_admin())', t || '_server_only_ins', t);
    execute format('create policy %I on public.%I as restrictive for update to authenticated, anon using (public.is_super_admin())', t || '_server_only_upd', t);
  end loop;
end $$;
