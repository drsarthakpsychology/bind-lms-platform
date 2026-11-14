# Removal and backup register

One row for every file or group taken out of the active code. Newest first.

Rules this register follows (owner brief, section 15):
- Nothing is removed until its backup archive exists and has been test-extracted and compared byte for byte.
- Each archive is a `.tar.gz` with a `MANIFEST.md` inside: original path, backup date, what it does, why it was removed, size and checksum of every file.
- Archives are made in `archive-out/` (git-ignored, never committed) and then uploaded to the private Cloudflare R2 bucket `vibha-code-archive`.
- Application data is never touched: no database rows, migrations, storage buckets, lectures, recordings, uploads or certificates.
- Git history still holds every removed file. The archive is a second, offline copy.

Backup status values:
- `ready to upload to R2 bucket vibha-code-archive`: archive made and verified locally; upload not done yet (the agent cannot upload objects to R2).
- `uploaded to R2 (date)`: in R2 and checked.

The bucket `vibha-code-archive` did not exist on 2026-11-14 (only `vibha-books-private` does). Create it as a private bucket, then upload every archive in `archive-out/`.

## 2026-11-14 (repository audit, branch agent/audit2)

| # | Archive file (in archive-out/) | Size | Files | Original location | What it was | Why removed | Kind | Backup status | Commit |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `vibha-archive-2026-11-14-book-texts-local.tar.gz` | 7.3 MB | 12 | `scripts/psychopharm/text/*.txt`, `scripts/finetune/data/*.jsonl` | Full text extracts of licensed textbooks, and the fine-tune dataset built from them. Read only by offline scripts. | Copyright: the repo was public. Taken out of git only (git rm --cached) and git-ignored. Note: when this change is merged into another checkout, git deletes these files from that checkout's disk. Restore them from the archive afterwards if the knowledge scripts are needed there. | Untracked, kept locally | ready to upload to R2 bucket vibha-code-archive (or keep in `vibha-books-private`) | 46fb4516 |
| 2 | `vibha-archive-2026-11-14-unused-ui-kit.tar.gz` | 4.6 KB | 7 | `src/components/ui/{accordion,form,popover,separator,table,tabs,tooltip}.tsx` | Stock generated UI components, never imported. Packages `react-hook-form`, `@hookform/resolvers`, `@tailwindcss/forms` removed with them. | Verified unused. Can be re-added with `npx shadcn@latest add <name>`. | Removed | ready to upload to R2 bucket vibha-code-archive | 860141c9 |
| 3 | `vibha-archive-2026-11-14-orphan-screens.tar.gz` | 30 KB | 23 | old landing page (`src/components/landing/`), retired admin panels, old student home, old MSE trainer, early mobile pieces, `src/lib/{faculty,reminders}.ts`, `src/lib/practice/rounds-seeds.ts`, `src/lib/psychopharm/{mode,review-store}.ts` | Screens and helpers that were replaced; no page uses them. Full list with one line each in the MANIFEST. | Unused and replaced. Archived in case any is wanted again. | Removed after backup | ready to upload to R2 bucket vibha-code-archive | a4610b98 |
| 4 | `vibha-archive-2026-11-14-decoder-screens.tar.gz` | 8 KB | 6 | `src/app/(dashboard)/practice/decode/*.tsx` (not page.tsx), `src/components/mobile/mobile-mode-switcher.tsx` | The four Decoder idiom drills and their switcher. | Decoder already retired (page redirects, flag off). `src/lib/decode` stays. | Removed after backup | ready to upload to R2 bucket vibha-code-archive | a4610b98 |
| 5 | `vibha-archive-2026-11-14-tutor-chat.tar.gz` | 7 KB | 2 | `src/components/knowledge/{tutor-chat,voice-ask-button}.tsx` | Ask-the-books chat box. | Flag `knowledge_tutor` off, no page places it. Server routes stay. | Removed after backup | ready to upload to R2 bucket vibha-code-archive | a4610b98 |
| 6 | `vibha-archive-2026-11-14-old-scripts.tar.gz` | 17 KB | 11 | `r2diag.mjs`, `scripts/{tmp-token-test,audit-item-bank,demo-complete-module,seed-idioms}.ts`, `scripts/knowledge/verify-concepts.ts`, five one-off `scripts/psychopharm/*.ts` | Finished one-time helpers. | Not in package.json, workflows or imports. One wrote to the live database; one read env from a laptop path. | Removed after backup | ready to upload to R2 bucket vibha-code-archive | ca705af4 |
| 7 | `vibha-archive-2026-11-14-casebook-corpus-a1.tar.gz` | 1.2 MB | 10 | `scripts/corpus/{acquire,fetch-pmc-casereports,fetch-samhsa,extract-casereports,extract-dialogue,move-transitions}.ts`, `scripts/corpus/lib/types.ts`, `scripts/corpus/extracted/*` | August 2026 experiment to extract case records and counsellor dialogue from outside sources, plus its 7.6 MB output. | Nothing reads the scripts or the output. | Removed after backup | ready to upload to R2 bucket vibha-code-archive | ca705af4 |

## How to restore anything

1. Download the archive from R2 (or take it from `archive-out/`).
2. `tar -xzf <archive>.tar.gz`
3. Read `MANIFEST.md`, then copy the files under `files/` back to the same paths in the repo.

Or from git: `git checkout <commit>^ -- <path>` using the commit in the table.
