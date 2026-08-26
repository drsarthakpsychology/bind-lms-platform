# PLATFORM FIXES — 2026-08-26

Eight-part overnight pass. Everything below was verified against the actual
source and the live app, not against past QUEUE.md checkmarks. All commits are
on the worktree branch `worktree-night-rights-roster-video` (off
`feat/mobile-design-system`); nothing was pushed to `main`.

---

## Part 0 — what QUEUE.md claimed vs. what was actually live

QUEUE.md marked T98 (rights UI removal) and T111–T114 (calibration
automation) as `[x]` done. Both were false:

- `/admin/rights` was fully present in source (route, nav entry, API) and live
  (`https://vibhapsychology.com/admin/rights` redirects to /login — the route
  exists, it isn't a 404).
- `/admin/calibration` was a manual blind-scoring screen, not automatic.

Root cause: the checkbox described intent, not shipped behaviour. A scoring UI
shell + an agreement dashboard shipped, but that is still a manual scoring
screen — it never automated anything. Kavya's report was correct on both.

---

## Part 1 — `/admin/rights` removed for real

Deleted the route (`(dashboard)/admin/rights/`), its nav entry, the
`rights-list` component, and `/api/admin/rights`. Then removed every gating
check tied to `rights_status` / `rights_registry`:

- `src/lib/corpus/layers.ts` — the `INGESTIBLE_RIGHTS` gate
  (`isIngestibleRights` / `assertIngestible`) removed. The layer/use firewall
  (clinical vs style) is untouched — only the licence gate came out.
- `scripts/corpus/acquire.ts` and `scripts/corpus/fetch-licensed.ts` — now scan
  ALL `rights_registry` rows (Kavya holds the rights to every book).
- `scripts/corpus/firewall-check.ts` dropped its licence-gate rule;
  `layers.test.ts` dropped the licence-gate describe block.

Kept: the `rights_registry` table + seeder + RLS migrations (the ingest CLIs
still write `acquired_file`/`sha256` to it for acquisition tracking). Grep
confirms zero remaining references to `admin/rights`, `isIngestibleRights`,
`assertIngestible`, or `INGESTIBLE_RIGHTS`. Build route list no longer contains
`/admin/rights`.

---

## Part 4 — roster import (name + email only)

Sheet parsed: `~/Downloads/COPY SHEET (1).xlsx`, sheet "Form responses 1".

| Metric | Count |
|---|---|
| Rows read | **64** |
| Would create (valid, unique) | **64** |
| Duplicates skipped | 0 |
| Invalid emails skipped | 0 |
| Empty "Full Name" (kept, name from email) | **50** |
| Emails sent | 0 (Resend not configured) |
| Emails failed | 0 |

Built a shared `src/lib/auth/roster.ts` (parse/validate/dedupe/provision) used
by both the admin server action and a new CLI `npm run roster:import`
(`--dry-run`). The invite flow creates each account with a random throwaway
password (never emailed), stamps `profiles.scope='lectures_only'`, and emails a
set-your-password recovery link via Resend — never a plaintext password. The
bulk-import form dropped its default-password field.

The roster CSV (PII) is gitignored, not committed.

---

## Part 2 — calibration, automated

Three signals. Two were already live; two are new:

1. **Passive capture** — already live: faculty edits/overrides write
   `scoring_corrections`, which feed the few-shot scoring loop.
2. **Multi-model consensus** (new) — `scripts/calibration-auto.ts` scores each
   sample transcript with two independent no-train models and writes
   `rubric_dimensions.inter_model_agreement`.
3. **Self-consistency variance** (new) — the same script scores 3× at
   temperature 0.7 and writes `rubric_dimensions.variance`.

A dimension whose agreement is poor stays `provisional`, and provisional
dimensions hide their number from students (qualitative feedback only) — that
gate already existed in `src/lib/practice/rubric.ts` and the debrief renderer.
Run `npm run calibration:auto`; the `/admin/calibration` page now shows the
automatic signals. Manual scoring remains as an optional tool, not a
requirement.

---

## Part 3 — `/admin/corpus/dictate` stripped

Before: a conversational flow **plus** a collapsed "classic form" fallback
(title, difficulty, presentation, history, red flags — a full schema-shaped
form). After: only record → live transcript → save. The form is gone, and the
transcript is now inline-editable (pencil → textarea → save/cancel) so Dr.
Sarthak can correct a mis-transcription before saving. He never faces an empty
structured form.

---

## Part 6 — video: real ABR quality ladder

Verified the repo first: the HLS **serving** stack already existed
(`media_assets` table, `/api/media/stream/[...lessonId]` proxy with per-session
AES-128 encryption, the playback route returning `mediaType: hls|mp4`), and
`scripts/publish-lecture.ts` already had the ffmpeg transcode pipeline
(`encodeHls`/`encodeRung`/`writeMaster`). What was missing was the ladder
**config** matching the spec and the **player quality selector**.

- Ladder corrected to the spec: **1080p 5000k / 720p 2800k / 480p 1400k /
  240p 600k** (was 2800/1800/1000/600 with a 360p floor). ≥1.5× bitrate gaps,
  6s segments, keyint=48 (~2s keyframes), H.264+AAC, `seg_%04d.ts`. 240p is
  now the floor.
- Player: a genuine quality selector (Auto/1080p/720p/480p/240p). Auto uses
  native ABR (`currentLevel = -1`); a manual pick locks the level and persists
  per-device in `localStorage`. Rendered unobtrusively (desktop secondary
  controls + mobile overflow menu), only when HLS levels exist. Added
  `preload="metadata"`.
- Backward compat: existing single-file lessons keep playing via the `mp4`
  fallback; `migrate-supabase-to-r2.ts --lesson <id>` is the offline
  re-transcode script.

Runtime evidence (network-tab bitrate change, devtools throttling, real-device
play) needs a live video + browser — flagged in NEEDS_KAVYA as the same
human device-QA step as the existing T151 video QA.

---

## Part 5 — lecture-only locked access (server-side)

Added `profiles.scope` (`'full'` | `'lectures_only'`). Enforcement is in the
dashboard layout (server-side): a lecture-only account can reach only
`/dashboard` (a flat, newest-first lecture list) and `/courses/*` (the player);
every other route redirects to `/dashboard`. The enrollment checks and the
stream proxy grant lecture-only accounts any published lesson with no
enrollment gate, so a newly published lecture appears with no redeploy. Nav is
scoped to a single "Lectures" destination. Pure helpers extracted to
`src/lib/auth/scope.ts` + unit-tested.

Provisioning: the roster import stamps `scope='lectures_only'` (default
`lectures_only` in the CLI). To create the cohort, see NEEDS_KAVYA.

---

## Still open — see NEEDS_KAVYA.md

- **`RESEND_API_KEY` + `RESEND_FROM_EMAIL`** — the one hard blocker for the
  roster emails. Without it the importer creates accounts but can't deliver the
  set-your-password link.
- **Apply `profiles_access_scope.sql`** (and `calibration_auto_signals.sql`)
  via `npm run apply-migrations`.
- **Device-QA the video** (real phone + network-tab quality switch) and
  **device-QA the voice** — the machine side is verified; the human loop remains.
