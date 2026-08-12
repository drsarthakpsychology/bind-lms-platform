-- =============================================================================
-- Lumen Practice Layer — Modules (v5 Part 7.4)
-- =============================================================================
-- A module is a named group of lessons + practice activities + quizzes, with
-- an order index. A DEPRESSION module holds its own sim cases (each patient
-- talking differently), SCT items, cards, etc. via module_items.
--
-- Additive + idempotent. Every table gets a nullable organization_id.

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  course_id uuid references public.courses (id) on delete set null,
  title text not null,
  order_index integer not null default 0,
  state text not null default 'draft'
    check (state in ('draft','scheduled','published','archived')),
  release_at timestamptz,
  created_at timestamptz not null default now()
);

-- Polymorphic membership: an item can be a sim case, a lesson, an SCT item, etc.
create table if not exists public.module_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  module_id uuid not null references public.modules (id) on delete cascade,
  item_type text not null
    check (item_type in ('lesson','sim_case','sct_item','card','mse_stimulus','osce_station','idiom','landmark_case','quiz')),
  item_id uuid not null,
  order_index integer not null default 0,
  unique (module_id, item_type, item_id)
);

-- Who can see a module. scope: cohort-wide grant or a single student grant.
create table if not exists public.module_access (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  module_id uuid not null references public.modules (id) on delete cascade,
  scope text not null check (scope in ('cohort','student')),
  cohort_id uuid,
  student_id uuid references public.profiles (id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles (id) on delete set null
);

alter table public.modules enable row level security;
alter table public.module_items enable row level security;
alter table public.module_access enable row level security;

-- modules: published + released are student-visible; admins see all.
create policy "modules_select_visible" on public.modules
  for select using (
    (state = 'published' and (release_at is null or release_at <= now()))
    or public.is_admin()
  );
create policy "modules_admin_manage" on public.modules
  for all using (public.is_admin()) with check (public.is_admin());

-- module_items: visible with the parent module; admins manage.
create policy "module_items_select_with_module" on public.module_items
  for select using (
    exists (select 1 from public.modules m where m.id = module_items.module_id and (m.state = 'published' and (m.release_at is null or m.release_at <= now())))
    or public.is_admin()
  );
create policy "module_items_admin_manage" on public.module_items
  for all using (public.is_admin()) with check (public.is_admin());

-- module_access: a granted student sees their grant; admins manage.
create policy "module_access_select_own_or_admin" on public.module_access
  for select using (
    (auth.uid() = student_id or scope = 'cohort')
    or public.is_admin()
  );
create policy "module_access_admin_manage" on public.module_access
  for all using (public.is_admin()) with check (public.is_admin());
