-- =============================================================================
-- Add week support to courses, lessons, materials
-- =============================================================================

-- Add weeks to courses
alter table if exists public.courses
  add column if not exists weeks int default 12;

-- Add week to lessons
alter table if exists public.lessons
  add column if not exists week int default 1;

-- Add week to materials
alter table if not exists public.materials
  add column if not exists week int default 1;

-- Indexes for week queries
create index if not exists idx_lessons_week on public.lessons (week);
create index if not exists idx_materials_week on public.materials (week);