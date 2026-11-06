# Architectural Decisions (as implemented)
> Each record states the **current** decision and where it lives. Status: ACTIVE unless noted.

| ID | Decision | Rationale (from code/comments) | Where |
|---|---|---|---|
| AD-1 | Thin `proxy.ts`; authoritative session check in layout/`getSession()` | Next 16 proxy contract; avoids logout loops from stale cookies | `src/proxy.ts`, `lib/auth/session.ts` |
| AD-2 | One active session per user via `active_session_token` + cookie | prevents credential sharing | `session.ts`, `auth/actions.ts` |
| AD-3 | No public sign-up; admin-created accounts, user-set passwords via one-time hashed token | invitation-only programme | `roster.ts`, `supabase/schema.sql` |
| AD-4 | Video never exposed as storage URL: HMAC stream tokens + proxy + AES-128 HLS on R2 | deter downloading/sharing | `lib/media/*`, `api/media/*` |
| AD-5 | Media provider interface (`supabase`\|`r2`) | swap storage without touching player | `lib/media/provider.ts` |
| AD-6 | Server Actions for mutations; each re-checks auth | actions are directly invokable | `lib/auth/guards.ts` |
| AD-7 | Service-role client for cross-user reads, RLS for owner reads, `*_visible` views for anonymity | wall privacy | `lib/supabase/server.ts`, migrations |
| AD-8 | Durable Postgres rate limiting, fail-closed | serverless instances | `lib/rate-limit.ts` |
| AD-9 | Three-state feature flags (off/live/unlocked), cached 30 s, enforced per route | staged go-live | `lib/flags.ts` |
| AD-10 | Multi-provider AI router, no-train providers first for student data | cost + privacy + availability | `lib/ai/router.ts` |
| AD-11 | Cohort-based lecture visibility with legacy fallback for unplaced students | nobody loses access during rollout | `lib/cohorts/rules.ts` |
| AD-12 | Per-student scope + feature blocks; lectures governed by cohort only | support Full vs Lectures-only | `lib/access/*`, `lib/auth/scope.ts` |
| AD-13 | Learning moved out of Practice (`/study`, `/games`) with permanent-style redirects kept | old links keep working | `next.config.ts` |
| AD-14 | Two leaderboards (Quiz weekly XP; Overall all-time points) | motivation, clarity | `lib/standing/boards.ts` |
| AD-15 | Additive SQL staged in `*migrations_pending`; owner applies | infra safety rule (owner approval) | `supabase/`, `src/migrations_pending/` |
| AD-16 | Hide `is_test` + robot-email accounts everywhere | clean metrics | `lib/people/hidden.ts` |
| AD-17 | Support key stored scrypt-hashed, admin-settable, student/alumni only, every use logged | helpdesk access without reading passwords | `lib/auth/master*.ts` |
| AD-18 | Tailwind v4 tokens, Neo-Brutalist Pastel design system | brand | `docs/UI_RULES.md` |
| AD-19 | Pure rule modules separated from `server-only` loaders so they are unit-testable | testability | e.g. `cohorts/rules.ts` vs `access.ts` |

SUPERSEDED / HISTORICAL: blueprint's "middleware checks expiry on every request" (replaced by AD-1); per-process in-memory rate limit (replaced by AD-8); `/practice/learn` and `/practice/notes` (redirected, AD-13).
