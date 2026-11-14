# VIBHA School of Psychology LMS: documentation

Start here. Everything marked **current** was checked against the code and the live services on 2026-11-14. If a doc and the code disagree, the code wins; fix the doc in the same change.

## Where to start

1. `architecture/OVERVIEW.md`: what the system is, one diagram, the big facts.
2. `LOCAL_SETUP.md`: run it on your computer.
3. `DEPLOYMENT.md`: how a change reaches vibhapsychology.com, migrations, rollback.
4. `FEATURES_STATUS.md`: what is live, what is on the test link, what is off, what is pending.

## Current docs

| Doc | Covers |
|---|---|
| `architecture/OVERVIEW.md` | System diagram, parts, request flow, key facts |
| `architecture/FRONTEND.md` | App Router layout, route groups, shell, design tokens, shared components, client stores |
| `architecture/BACKEND.md` | Server Actions, route handlers, `/api/save` outbox, rate limiting, flags, crons, caching |
| `architecture/DATABASE.md` | Tables by domain, relationships, row level security, functions, triggers, migrations process |
| `architecture/AUTH.md` | Account creation, login, sessions, roles, scope, access blocks |
| `architecture/VIDEO.md` | Upload, HLS encoding, playback, AES-128 key derivation, stream tokens |
| `architecture/STORAGE.md` | Every bucket in Supabase and R2 and what it holds |
| `architecture/INTEGRATIONS.md` | Every outside service, what for, env vars, free tier limits |
| `API.md` | Every route handler and Server Action: method, auth, input, output |
| `ENVIRONMENT_VARIABLES.md` | Every env var the code reads, where it is set, what is missing |
| `DEPLOYMENT.md` | Branches, release steps, migrations_pending procedure, rollback, feature flags |
| `LOCAL_SETUP.md` | Clone to running, tests, lint, e2e, scripts |
| `DEPENDENCIES.md` | Each npm package and why |
| `FEATURES_STATUS.md` | Feature status, known issues, pending owner steps, deferred content work |
| `NATIVE_APP_READINESS.md` | Web and PWA state, what a native app can reuse, blockers, staged plan |
| `SCALABILITY_30_TO_300.md` | Bottlenecks with evidence and the smallest fix for each, ranked |
| `BACKUP.md` | Offline copy of the repo (`scripts/make-offline-backup.sh`) |
| `AUDIT_2026_11.md`, `REMOVAL_REGISTER.md` | Repository audit and the record of removals (written by the audit work) |
| `RESTORE_RUNBOOK.md` | Restoring the database from the nightly dump |
| `R2_KEY_ROTATION.md` | Rotating R2 keys |
| `TEST_ACCOUNT.md` | The test account |
| `security/SECURITY_AUDIT_2026_11.md` | Latest security audit, fixes and open items |
| `qa/*.md` | November 2026 QA reports (data saving, games and practice, study and prep) |
| `releases/2026-11-learning-platform.md` | Release notes for the learning platform rebuild |
| `design/*.md`, `UI_RULES.md`, `UI_UX_GUIDELINES.md` | Design rules and research. Load `.claude/skills/vibha-design/SKILL.md` before UI work |
| `plans/*.md` | Product plans (admin redesign, student learning, exam prep) |
| `research/*.md` | Research notes behind design and content choices |

## Superseded (kept for history, each has a banner at the top)

| Old doc | Replaced by |
|---|---|
| `MASTER_ARCHITECTURE.md` | this README and `architecture/OVERVIEW.md` |
| `SYSTEM_MAP.md` | `architecture/OVERVIEW.md` |
| `DEPLOYMENT_GUIDE.md` | `DEPLOYMENT.md` |
| `LOCAL_DEVELOPMENT.md`, `PROJECT_SETUP.md` | `LOCAL_SETUP.md` |
| `INFRA_SETUP.md` | `architecture/INTEGRATIONS.md`, `architecture/STORAGE.md`, `DEPLOYMENT.md` |
| `CAPACITY_MODEL.md` | `SCALABILITY_30_TO_300.md` |
| `SECURITY_AUDIT.md` (August) | `security/SECURITY_AUDIT_2026_11.md` |
| `architecture/SYSTEM_OVERVIEW.md`, `architecture/SYSTEM_ARCHITECTURE.md` | `architecture/OVERVIEW.md` |
| `architecture/FRONTEND_ARCHITECTURE.md` | `architecture/FRONTEND.md` |
| `architecture/BACKEND_ARCHITECTURE.md` | `architecture/BACKEND.md` |
| `architecture/API_ARCHITECTURE.md`, `inventory/API_INVENTORY.md` | `API.md` |
| `architecture/DATABASE_ARCHITECTURE.md`, `inventory/DATABASE_INVENTORY.md` | `architecture/DATABASE.md` |
| `architecture/INFRASTRUCTURE.md` | `architecture/INTEGRATIONS.md`, `architecture/STORAGE.md`, `DEPLOYMENT.md` |
| `architecture/SECURITY_ARCHITECTURE.md`, `modules/AUTHENTICATION.md` | `architecture/AUTH.md` |
| `inventory/INTEGRATION_INVENTORY.md` | `architecture/INTEGRATIONS.md` |
| `inventory/FEATURE_INVENTORY.md` | `FEATURES_STATUS.md` |
| `modules/VIDEO_SYSTEM.md`, `workflows/VIDEO_PROCESSING.md` | `architecture/VIDEO.md` |

## Older docs not re-checked this round

Useful background, but not verified on 2026-11-14. Check against the code before relying on them: `AI_ARCHITECTURE.md`, `AI_FREE_TIERS.md`, `AI_PATIENT_ARCHITECTURE.md`, `MODEL_RESEARCH.md`, `OMNIROUTE.md`, `REALTIME_VOICE_PLAN.md`, `CHATTERBOX_*.md`, `FINETUNING.md`, `KNOWLEDGE_SYSTEM*.md`, `PRACTICE_LAYER.md`, `PRACTICE_TOOLS.md`, `COHORTS.md`, `STUDY.md`, `GAMIFICATION.md`, `IDIOMS.md`, `CONTENT_EDITING.md`, `DATA_POLICY.md`, `PLAIN_LANGUAGE.md`, `DESIGN_DECISIONS.md`, `PRODUCT_SIMPLIFICATION_AUDIT.md`, `DEAD_CODE.md`, `item-bank-audit.md`, `mobile-*.md`, `modules/*` (other than the two above), `workflows/*`, `inventory/TECHNICAL_DEBT.md`, `inventory/UNUSED_FEATURES.md`, `history/*`, `changes/*`, `transformation/*`, `psychopharm/*`, `QA/*` (August test plans), `rights-requests/*`.

The root of the repo also holds working notes from earlier agent runs (`AUDIT.md`, `BUGS.md`, `QUEUE.md`, `NEEDS_KAVYA.md`, `NIGHT_LOG.md` and others). They are history, not documentation.

## Rules for changing docs

- Plain English, short sentences, no em or en dashes.
- Name the file and function you mean, so a reader can find it.
- Never write a secret or an env var value in a doc. Names only.
- When you replace a doc, add a SUPERSEDED banner at its top and update the tables above.
