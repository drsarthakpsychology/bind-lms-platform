# Vercel + Cloudflare R2 — deployment exposure, headers, caching, signed URLs

## Vercel

- **Preview deployments are public and indexable** unless Deployment
  Protection is on; branch names appear in the URL. "Standard Protection"
  (Vercel Authentication) is default-on for NEW projects, except the latest
  production deployment — but it's frequently disabled and older projects
  predate it. On the Hobby plan, protecting production domains needs
  Pro/Enterprise.
- **Preview env vars commonly duplicate production secrets** — a public preview
  can reach the production DB. Audit with `vercel env ls`; use sandbox keys for
  Preview.
- **Security headers are NOT added by default** — no CSP, HSTS, X-Frame-Options,
  or X-Content-Type-Options. Configure via `async headers()` in `next.config.js`
  or `headers` in `vercel.json`:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - nonce-based `Content-Security-Policy`
  - set `poweredByHeader: false`
  - Detect with `curl -I`.

## Cloudflare R2

- **Buckets are private by default.** Public exposure comes from a custom
  domain or a **`r2.dev` development URL** (dev-only, rate-limited, and it
  **cannot** use WAF/caching/access controls). If you protect a custom domain
  with WAF/Access but forget to disable `r2.dev`, the bucket stays public via
  `r2.dev`.
- R2 public buckets don't allow root listing, but known/guessable keys are
  fetchable.
- CORS defaults to none; devs often set `AllowedOrigins: ["*"]`.
- **CORS ≠ access control.** A restrictive CORS policy does NOT stop direct or
  public reads.

## Signed / presigned URLs

- **Presigned URLs are bearer tokens.** R2 max expiry = 7 days (604800s).
- Common bugs:
  - excessive/no expiry (recommend 5–15 min downloads, ≤1h uploads),
  - signing PUT when only GET is needed (arbitrary upload/overwrite),
  - the signing principal has overly broad IAM permissions,
  - reuse (no native single-use),
  - signature leaking in logs / `Referer` / error trackers,
  - using a public bucket URL for paid/private content,
  - **predictable/sequential object keys** enabling storage IDOR.
- Fixes: least-privilege dedicated signing principal; authorize the requester
  **before** signing; UUID/random keys with user IDs embedded;
  `Referrer-Policy: no-referrer`; redact `X-Amz-Signature` from logs; AWS
  `s3:signatureAge` bucket-policy condition; POST-policy `content-length-range`.