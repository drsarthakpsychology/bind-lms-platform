# Local setup

From a fresh clone to the app running on your computer, plus tests and lint. Checked on 2026-11-14.

## You need

- Node.js 22 (the version CI uses) and npm.
- Git.
- For video encoding only: `ffmpeg` and `ffprobe`.
- Access to a Supabase project. The only project is the live one; see the warning below.

## 1. Get the code

```bash
git clone https://github.com/drsarthakpsychology/bind-lms-platform.git
cd bind-lms-platform
npm ci
```

From an offline backup instead: `git clone vibha-lms-<date>.bundle bind-lms-platform` (see `docs/BACKUP.md`).

## 2. Environment file

```bash
cp .env.example .env.local
```

Fill in at least:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase, Project Settings, API)
- `SUPABASE_SERVICE_ROLE_KEY` (only if you need admin writes)
- `SESSION_SECRET` (`openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- `AI_ENABLED=false` (uses fixture answers, no AI keys needed)

Everything else is optional. `docs/ENVIRONMENT_VARIABLES.md` explains each one.

**Warning:** there is no separate development database. Pointing `.env.local` at the live project means every click writes real rows. For UI work without real data, use dummy `NEXT_PUBLIC_SUPABASE_*` values: pages that need data show their error or empty state, and component tests run without any database.

## 3. Run

```bash
npm run dev
```

Open http://localhost:3000.

In a git worktree (a second checkout that shares `node_modules` by a link) Turbopack fails. Use webpack:

```bash
npx next dev --webpack
```

Health checks for a configured machine:

```bash
npm run doctor   # read-only: env vars, Supabase, R2, production /api/health
npm run setup    # also creates missing R2 buckets and sets CORS. Lists optional vars as missing; that is fine
```

## 4. Tests and checks

| Check | Command | Notes |
|---|---|---|
| Types | `npx tsc --noEmit` | Same as CI |
| Lint | `npm run lint` | ESLint 9 with `eslint-config-next` and the React 19 rules |
| Format | `npm run format:check` (or `npm run format`) | Prettier with the Tailwind plugin |
| Unit and component tests | `npm test` (`vitest run`) | Files `src/**/*.test.ts(x)`. Node environment by default; a file opts into the browser DOM with `// @vitest-environment jsdom` |
| One test file | `npx vitest run src/lib/save/outbox.test.ts` | |
| Unused code report | `npm run knip` | Report only |
| End-to-end | `npm run test:e2e` | Playwright, Chromium, `e2e/*.spec.ts`. Needs a running app at `E2E_BASE_URL` (default `http://localhost:3000`) and the `E2E_*` login variables. Install the browser once with `npx playwright install chromium` |
| Build | `npm run build` | CI runs it on every push |

On the shared build machine use the lock for heavy checks: `bash <scratchpad>/gate.sh tsc` and `gate.sh vitest <paths>`, and do not run a full `next build` there.

## 5. Useful scripts

| Script | Does |
|---|---|
| `npm run publish-lecture -- ./file.mp4 --lesson <id>` | Encodes HLS and uploads a lecture to R2 (needs ffmpeg and R2 keys) |
| `npm run media-doctor`, `npm run media-promote` | Check and promote video rows |
| `npm run verify-r2`, `npm run set-r2-cors`, `npm run rotate-r2` | R2 checks and key rotation |
| `npm run restore`, `npm run verify-backup` | Database restore and backup check (`docs/RESTORE_RUNBOOK.md`) |
| `npx tsx scripts/apply-pending.ts <name>` | Apply a named file from `src/migrations_pending` to the live database (owner only) |
| `npm run seed-test` | Create the test account (`docs/TEST_ACCOUNT.md`) |
| `bash scripts/make-offline-backup.sh` | Offline copy of the repo (`docs/BACKUP.md`) |

Scripts named `corpus:*`, `psych:*`, `knowledge:*`, `finetune:*`, `sim:*` build content or run evaluations. They are not needed to run the app.

## 6. Before UI work

Read `.claude/skills/vibha-design/SKILL.md` and `docs/UI_RULES.md`. Follow the React 19 lint rules and the no-dashes rule in `docs/architecture/FRONTEND.md`.
