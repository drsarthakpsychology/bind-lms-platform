# Storage

Files live in two places: Supabase Storage and Cloudflare R2. All buckets are private. Checked against the code and the live services on 2026-11-14.

## Supabase Storage (project `hojhzwvuccojqkvkkslw`)

| Bucket | File size cap | Holds | Written by | Read by |
|---|---|---|---|---|
| `materials` | 100 MB | Course files (PDF, slides) | `prepareMaterialUpload` / `confirmMaterialUpload` in `src/app/(dashboard)/admin/courses/[courseId]/materials-actions.ts` (signed upload URL) | `GET /api/media/materials/:id` (proxy) and the PDF viewer `courses/[courseId]/materials/[materialId]/viewer.tsx` |
| `submissions` | 50 MB | Student assignment files and audio | `prepareSubmissionUpload`, `submitWithFiles`, `submitAudioAssignment` in `src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions.ts` | The student (`/api/media/submissions/:id`), admins (`getSubmissionFileUrl`, 15 minute signed URL) |
| `videos` | none | Old single-file lecture videos (3 objects, about 150 MB). No lesson uses them now | Old upload path, no longer used | Proxy fallback for rows that record `video_provider = 'supabase'` (none today) |

On 2026-11-14 `materials` held 1 object and `submissions` held 0. Storage policies: admins read every bucket, only the super admin writes (`2026_11_14_security.sql`). The Free plan allows 1 GB of Supabase Storage in total.

## Cloudflare R2

| Bucket | Holds | Written by | Read by |
|---|---|---|---|
| `plms-videos` (value of `R2_BUCKET_NAME` in production) | `lessons/<courseId>/source/*` original uploads; `lessons/<lessonId>/hls/*` HLS playlists and chunks; credential PDFs and badge images; certificate signature images; `voice/*.mp3` text to speech cache | Admin browser uploads (presigned PUT), `scripts/publish-lecture.ts`, `src/lib/achievements/storage.ts`, `src/lib/voice/synthesize.ts` | Stream proxy (server side). Credential downloads use a 1 hour presigned GET URL (`credentialDownloadUrl`), the one place a browser talks to R2 directly |
| `plms-backups` | Nightly database dumps (`daily/`, `monthly/`) and the uptime failure counter | `.github/workflows/backup.yml`, `uptime.yml` | `verify-backup.yml`, `scripts/restore.ts`, `scripts/verify-backup.ts` |
| `vibha-books-private` | Book files for the library | The owner, by hand in the Cloudflare dashboard | Nothing in the app code reads it yet |

R2 keys: `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` (app, Vercel production only). GitHub Actions use their own secrets (`R2_ACCOUNT_ID`, `R2_BACKUP_BUCKET` and the key pair).

Note: the R2 variables are set for production only, not for preview. From that setting (not tested), on the `admin-redesign` test link admin video upload and credential PDFs should fail with "R2 bucket isn't configured", and playback of lectures, which also reads R2, should fail there too. Add the four R2 variables to the preview environment for the `admin-redesign` branch if the test link must play video.

## What is not in the repo

Student uploads, lecture video, certificates and books are application data. They are not in git and not in the offline backup (`docs/BACKUP.md`). Never delete or move them as part of a code change.

## Repo files read at request time

Some routes read JSON from the repo with `readFileSync`: `docs/psychopharm/**` (medicines), `scripts/corpus/normalised/**` (case library), `content/policies/**`. `outputFileTracingIncludes` in `next.config.ts` makes sure Vercel ships them. Do not move these folders without updating that list.
