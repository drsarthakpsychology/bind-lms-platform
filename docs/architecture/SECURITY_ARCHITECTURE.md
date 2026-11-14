> **SUPERSEDED on 2026-11-14.** Use docs/architecture/AUTH.md and docs/security/SECURITY_AUDIT_2026_11.md instead. This file is kept for history and may be out of date. Index of current docs: docs/README.md.

# Security Architecture
> Verified against `main` @ `b2a9698`. No secrets are recorded here. Earlier audits: `docs/SECURITY_AUDIT.md` (2026-08-14, `HISTORICAL` for counts).

## Controls (VERIFIED in code)
| Area | Control | Source |
|---|---|---|
| Accounts | No public sign-up; admin roster import; one-time setup tokens (hashed) | `src/lib/auth/roster.ts` |
| Login | email+password via Supabase; per-email limit (10/min) + per-IP (60/min); optional Cloudflare Turnstile when `TURNSTILE_SECRET_KEY` set | `src/lib/auth/actions.ts` |
| Session | `profiles.active_session_token` ⇔ `plms_session` cookie → one active session; blocked > expired > replaced checks on every request | `src/lib/auth/session.ts` |
| Support key | Admin-settable fallback password, scrypt-hashed in `admin_settings`; works only for student/alumni accounts; each use logged to `master_login_events`; per-minute caps: 3 per email, 5 per IP, 30 global (`MASTER_LIMITS`) | `src/lib/auth/master*.ts`, `admin/tools/` |
| Authorization | role × status × scope × access_blocks × cohorts × flags; admin actions re-check via `requireAdmin()` | `guards.ts`, `scope.ts`, `access/*` |
| Self-escalation | DB trigger `protect_profile_columns` + RLS `WITH CHECK` | `supabase/migrations_pending/rls_hardening.sql` |
| Video | no raw storage URL to the client; 5-min HMAC stream token bound to (user, lesson, course); same-origin gate; AES-128 HLS; rate limits | `src/lib/media/*`, `api/media/*` |
| Cron | Bearer `CRON_SECRET`, fails closed when unset | `api/internal/cron/route.ts` |
| Webhooks | Svix HMAC-SHA256, 5-minute replay window, timing-safe compare | `src/lib/email/webhook.ts` |
| Headers | CSP (prod drops `unsafe-eval`; keeps `unsafe-inline`), `frame-ancestors 'self'`, `poweredByHeader:false` | `next.config.ts` |
| Rate limiting | Postgres atomic `rate_limit_incr()`; fails closed | `src/lib/rate-limit.ts` |
| Input | zod validation; write-time `stripMarkup` on public forms; honeypot on waitlist | `src/lib/sanitize.ts` |
| Privacy | anonymous wall via `*_visible` views; complaints in Doubts private to writer+admin | migrations, `src/lib/doubts/*` |
| AI data | provider order favours no-train providers for student data | `src/lib/ai/router.ts` comments |

## Known concerns (see [TECHNICAL_DEBT](../inventory/TECHNICAL_DEBT.md))
CSP `unsafe-inline`; wide service-role usage; the support key is a deliberate backdoor-class feature (admin-controlled, logged — policy decision, not a bug); `/api/emails/seed` and other admin/utility routes should be re-reviewed for guard parity (`UNVERIFIED`).
