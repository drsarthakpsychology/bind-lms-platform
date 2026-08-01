-- media_assets: one row per published video, pointing at the storage provider.
--
-- The player never builds a storage URL itself — it asks the API for a signed
-- playback URL. This table is that indirection: it records WHERE a lesson's
-- video lives and in what form, so the player and the rest of the app stay
-- provider-agnostic (Supabase Storage today, Cloudflare R2 tomorrow).
--
-- Run in the Supabase SQL Editor. Idempotent.
-- =============================================================================

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  provider text not null default 'supabase', -- 'supabase' | 'r2'
  key_prefix text not null,                   -- storage key / object prefix
  mime_type text,
  duration_seconds numeric,
  -- For HLS: the ladder rungs as JSON, e.g. ["1080p","720p","480p","360p"]
  ladder jsonb,
  master_playlist text,                       -- e.g. lessons/<id>/hls/master.m3u8
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id)
);

-- Keep updated_at fresh.
create or replace function public.touch_media_asset()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists media_assets_touch on media_assets;
create trigger media_assets_touch
  before update on media_assets
  for each row execute function public.touch_media_asset();
