# Restore Runbook — follow this while panicking

This is the exact sequence to recover if something breaks. Follow it top to
bottom; each step is short and explains what it's doing.

---

## Step 1 — What broke? (30 seconds)

| Symptom | Likely fix path |
|---|---|
| Site down / 500s on data pages | Restore the database (below) |
| Data corrupted (e.g. someone deleted rows) | Restore the database (below) |
| Lost a video | Don't restore — videos live on R2 or your laptop, not the DB. See Step 4. |
| Only one student's account broken | Fix the row directly in Supabase, don't restore the whole DB |

---

## Step 2 — Restore the database (~5–15 min)

Backups run nightly and live in the R2 bucket under `db/YYYY-MM-DD.dump`.
The newest is the safest choice unless the corruption happened recently
(see Step 3).

### 2a. Pick the dump
1. Go to **Cloudflare dashboard → R2 → your backups bucket → db/**.
2. Note the newest file: `db/2026-08-XX.dump`.

### 2b. Download it
- Download the `.dump` file from the R2 dashboard to your computer.

### 2c. Restore it
Run the restore script (it will **ask you to type YES** and shows the target
DB before doing anything):

```bash
npm run restore -- ./db/2026-08-XX.dump
```

- If you haven't set `SUPABASE_DB_URL`, pass the target explicitly:
  ```bash
  npm run restore -- ./db/2026-08-XX.dump --target postgresql://...
  ```
- The script needs `pg_restore` or Docker. If neither is installed, it prints
  the exact command to install one.
- **Estimated time:** 1–5 minutes for a small DB.

### 2d. Verify
```bash
npm run verify-backup
```
This restores the newest backup into a throwaway database and checks row
counts — it proves the restore worked without touching production.

---

## Step 3 — "It broke AFTER the last backup"

The nightly backup may not include changes from today. Options:
- **Replay recent changes** from your admin UI (re-create the student, re-add
  the lesson). For a small cohort this is usually faster and safer than
  hunting in a partial backup.
- If you need the exact state, you'd need point-in-time recovery — Supabase
  **Pro** includes PITR (paid). Decide whether that's worth $25/mo for the
  peace of mind; the nightly dump is the free option.

---

## Step 4 — Recover a lost video (NOT a DB restore)

Videos are **not** in the database — they're objects in storage:
- **R2:** check the `plms-videos` bucket → the lesson's folder.
- **Laptop:** the original lecture files live on your computer (that's why
  re-encoding is always possible). Re-run:
  ```bash
  npm run publish-lecture -- ./raw/lecture-XX.mp4 --lesson <lessonId>
  ```
- **Supabase Storage (old):** check the `videos` bucket for the original
  `.mp4` before it was migrated.

---

## Step 5 — After recovery

1. Confirm students can log in and see their courses.
2. Run `npm run doctor` (C2) to check all systems are healthy.
3. Note what happened in `docs/QA/TEST_LOG.md`.

---

## Timings (what to expect)

| Action | Time |
|---|---|
| Pick + download dump | 1–2 min |
| Run restore script | 1–5 min |
| Verify backup | 2–4 min |
| Total database recovery | ~5–15 min |

---

## Should we also back up the R2 media (videos)?

**Recommendation: no — not the encoded R2 objects.** The source lecture
masters live on your laptop, and re-encoding with
`npm run publish-lecture` regenerates every R2 segment from that master.
Backing up the encoded HLS would:
- **Cost:** R2 storage for ~50 GB of encoded video at R2 rates (~$0.015/GB/mo)
  ≈ **$0.75/mo** for a single copy. Egress is zero, so delivery cost is nil.
- **Value:** ~zero, because the masters are the source of truth and are
  already on your machine. Re-encoding a lecture takes minutes.
- **The one thing to protect:** the **masters on your laptop**. If you're
  worried about losing them, keep a copy of `./raw/` on an external drive or
  in your existing cloud drive. That's cheaper and safer than an R2 backup
  of encoded segments.

**If you ever change this:** the weekly job already has the bucket plumbing
(`R2_BACKUP_BUCKET`); adding media sync is a small extension.

---

## GitHub secrets you need to create

For the backup jobs to run, add these to **GitHub → repo → Settings →
Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `SUPABASE_DB_URL` | Your Supabase database connection string (pooler or direct). NEVER the service-role key. |
| `R2_ACCESS_KEY_ID` | R2 API token access key (read/write on the backups bucket) |
| `R2_SECRET_ACCESS_KEY` | The token secret |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_BACKUP_BUCKET` | The backups bucket name, e.g. `plms-backups` |
| `RESEND_API_KEY` | Resend API key (for failure emails) |
| `ALERT_EMAIL` | Where failure alerts go (e.g. your email) |

Never commit any of these to the repo.

---

## Backups are verified weekly

The nightly job uploads a dump; the weekly `verify-backup` job proves it
restores. If a backup is silently broken, you'll get an **email alert**
(the job fails loudly — see `.github/workflows/backup.yml`).
