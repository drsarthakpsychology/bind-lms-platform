# Offline backup of the repository

How to keep a complete offline copy of the code, docs and history, without secrets. This is about the **repository**. The database has its own nightly backup (`docs/RESTORE_RUNBOOK.md`), and lecture video, uploads and certificates live in R2 and Supabase Storage.

## Make a backup

From anywhere inside the repo (or a worktree):

```bash
bash scripts/make-offline-backup.sh
```

It writes five files to `backup-out/` (git-ignored), named `vibha-lms-<UTC date and time>-<commit>`:

| File | What it is |
|---|---|
| `<name>.bundle` | A git bundle: every branch and tag with full history, in one file |
| `<name>-source.tar.gz` | The current working tree as plain files, for reading without git |
| `<name>-files.txt` | The list of files in the tarball |
| `<name>.sha256` | Checksums of the bundle and the tarball |
| `<name>-manifest.txt` | When, from which commit, counts, and how to restore |

Copy the whole `backup-out/` folder to an external drive or private cloud storage.

## What the script does

1. **Bundle.** If the clone is shallow (missing old history, as on the build machine), it makes a temporary full mirror of GitHub in a temp folder, adds local branches that were never pushed under `local/<name>`, and bundles that. Otherwise it bundles local branches, tags and remote branches directly. Your working repo is not changed.
2. **Tarball.** Files from `git ls-files` (tracked files, plus new files that are not ignored). Anything in `.gitignore` is left out. `.env` files are removed by name as a second guard; only the empty template `.env.example` is kept.
3. **Checks.** `git bundle verify`, then a real test: it clones the bundle into a throwaway folder and counts branches and commits. It fails if an env file, `node_modules` or `.next` is in the tarball.
4. **Checksums and manifest.**

## Included

- All source code (`src`, `scripts`, `livekit-agent`, `e2e`, `supabase`, `content`, `public`).
- All documentation (`docs`, root notes).
- Configuration and templates: `package.json`, `package-lock.json`, `next.config.ts`, `vercel.json`, `tsconfig.json`, lint, test and format config, `.github/workflows`, `.env.example`, `.claude` skills.
- All SQL files, including `supabase/migrations_pending` and `src/migrations_pending`.
- Full git history of every branch on GitHub plus local agent branches.

## Not included

| Left out | Why | Where it lives |
|---|---|---|
| `.env`, `.env.local` and every other env file | Secrets | Vercel variables, GitHub secrets, the owner's password manager |
| `node_modules` | Rebuilt with `npm ci` from `package-lock.json` | npm |
| `.next`, `test-results`, `playwright-report` | Build and test output | Rebuilt |
| Ignored local data (`scripts/roster/*.csv`, `scripts/corpus/raw`, `scripts/knowledge/cache`, FDA raw files) | Student details, licensed book text, or downloads that can be fetched again | Owner's machine |
| Database rows | Application data | Supabase; nightly dumps in R2 `plms-backups` |
| Lecture video, books, uploads, certificates | Application data | R2 `plms-videos`, `vibha-books-private`; Supabase Storage |

Secrets that were committed in the past stay in git history, and so in the bundle. The audit report (`docs/AUDIT_2026_11.md`) lists any that need rotation. Rotating a key makes the old copy useless.

## Restore

```bash
cd backup-out
sha256sum -c vibha-lms-<name>.sha256
git clone vibha-lms-<name>.bundle vibha-lms
cd vibha-lms
git branch -a                 # every branch is there
git remote set-url origin https://github.com/drsarthakpsychology/bind-lms-platform.git
npm ci
cp .env.example .env.local    # fill in values from the password manager
```

Then follow `docs/LOCAL_SETUP.md`.

## Proof run (2026-11-14)

Run from the `agent/docs` worktree at commit `e4cb5ef0`:

- Bundle 111 MB, 143 refs, `git bundle verify` ok.
- Test restore ok: 143 branches, 2,168 commits, oldest commit 2026-07-31.
- Tarball 44 MB, 3,420 files, no env files, no `node_modules`, no build output.

The first try bundled the local shallow clone directly; `verify` passed but a clone failed with missing objects. That is why the script now mirrors GitHub when the clone is shallow and always does a test clone.

## How often

Before every production release, and once a month. Keep the last three.
