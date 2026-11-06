# Workflow: Video upload & processing
> Verified against `main` @ `b2a9698`, from `scripts/publish-lecture.ts`. **Processing is an operator CLI step, not an in-app upload pipeline.**
```mermaid
flowchart LR
  Raw["raw .mp4 on operator machine"] --> P["npm run publish-lecture -- file --lesson id"]
  P --> F["ffprobe checks"] --> E["ffmpeg multi-bitrate HLS 1080/720/480/240, 6 s segments, AES-128"]
  E --> U["upload segments+playlists to R2 lessons/<id>/hls/ (resumable, idempotent)"]
  U --> M["upsert media_assets row (provider=r2, ladder, duration)"]
  M --> L["lesson plays via /api/media/playback + stream proxy"]
```
Flags: `--dry-run` (encode only), `--lesson`. Needs `ffmpeg`/`ffprobe`, R2 + Supabase env in `.env.local`. Admin UI adds the lesson record and cohort sharing; whether an in-app uploader to Supabase Storage (`videos` bucket) is still used is `UNVERIFIED` (see `NEXT_PUBLIC_MEDIA_PROVIDER`). Diagnostics: `media-doctor`, `media-promote`. Delivery: [VIDEO_SYSTEM](../modules/VIDEO_SYSTEM.md).
