# R2 Signing-Key Rotation

Rotating the R2 API credentials (the "signing key") invalidates any token or
URL signed with the old key. This is the remediation for the compromised path
flagged in round 8 (an old signed video URL in the wild).

## What's automated vs the one manual step

**Cloudflare does not allow an R2 S3 token to create another R2 token** — S3
credentials cannot mint credentials. So the ONE manual step (create the new
token in the dashboard) is unavoidable. Everything after that is automated:

```bash
npm run rotate-r2
```

The script:
1. Verifies the current key works (baseline) — stops if not.
2. Tells you exactly what to create and paste back.
3. Accepts the new key (interactive, or `R2_NEW_ACCESS_KEY_ID` /
   `R2_NEW_SECRET_ACCESS_KEY` in the shell).
4. Verifies the new key reads the bucket.
5. Swaps `.env.local`, backing up the old key to `.env.local.r2-rotate-backup`
   (gitignored).
6. Prints the Vercel env vars to set in the dashboard.

---

## Why it matters

- The old signed URL could still mint playback for up to its TTL. Rotating kills
  that.
- The R2 key must stay **server-only** (`.env.local` + Vercel secret settings).
  Never a `NEXT_PUBLIC_` var.

---

## Manual step (once)

1. Go to **https://dash.cloudflare.com** → your account → **R2** → **Manage R2
   API Tokens** → **Create API Token**.
2. For **the video bucket** (`plms-videos`): allow **Object Read** (GET) and
   **Object Write** (PUT) if this token also publishes lectures. For a
   read-only delivery token, Object Read is enough.
3. Note: the token is **bucket-scoped**. Do not give it `*` bucket access.
4. Copy the **Access Key ID** and **Secret Access Key** (the secret is shown
   once), then run `npm run rotate-r2` and paste them.

---

## After rotate-r2 completes

1. **Set the same two vars in Vercel** → Project → Settings → Environment
   Variables (replace `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`).
2. **Delete the old token** in Cloudflare → R2 → Manage R2 API Tokens.
3. `npm run verify-r2` → expect `✅ R2 read OK`.
4. Redeploy / restart so Vercel uses the new key.

---

## If the new key fails
- `verify-r2` error → the token lacks read access or the creds are mistyped.
  Confirm the token has Object Read on the exact bucket.
- App 500s on video → the Vercel env wasn't restarted, or a cached instance
  still held the old key. Redeploy / hard-refresh.
- Rollback: restore `.env.local.r2-rotate-backup`, or re-add the old token.

---

## Why this is safe
- The segment paths in R2 are per-lesson UUIDs; an old signed URL with the old
  key is worthless once the key is rotated (AWS S3/R2 presigns fail signature
  verification with a different secret).
- Combined with the 5-minute stream-token + session-bound segment encryption,
  a captured old URL or an old token is dead on arrival.

*Note: the token shown in this doc refers to R2 API credentials, not the
stream-session HMAC secret. `SESSION_SECRET` is separate and rotates by editing
the env var — see `.env.example`.*