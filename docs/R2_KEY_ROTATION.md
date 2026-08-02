# R2 Signing-Key Rotation

Rotating the R2 API credentials (the "signing key") invalidates any token or
URL signed with the old key. This is the remediation for the compromised path
flagged in round 8 (an old signed video URL in the wild).

Rotation is a **Cloudflare dashboard action** — there is no in-repo secret store.
This doc gives the exact steps plus a verify script so the swap is safe and
regression-free.

---

## Why it matters

- The old signed URL could still mint playback for up to its TTL. Rotating kills
  that.
- The R2 key must stay **server-only** (`.env.local` + Vercel secret settings).
  Never a `NEXT_PUBLIC_` var.

---

## Procedure (repeatable)

### 0. Baseline — prove the CURRENT keys work
```bash
npm run verify-r2
```
Expected: `✅ R2 read OK` + a `HEAD OK` line. If this fails, stop — the bucket
env vars are misconfigured before we touch anything.

### 1. Create the new token (Cloudflare dashboard)
1. Go to **https://dash.cloudflare.com** → your account → **R2** → **Manage R2
   API Tokens** → **Create API Token**.
2. For **the video bucket** (`plms-videos`): allow **Object Read** (GET) and
   **Object Write** (PUT) if this token also publishes lectures. For a
   read-only delivery token, Object Read is enough.
3. Note: the token is **bucket-scoped**. Do not give it `*` bucket access.
4. Copy the **Access Key ID** and **Secret Access Key** (the secret is shown
   once).

### 2. Update local + production env
- **`.env.local`** (local): replace `R2_ACCESS_KEY_ID` and
  `R2_SECRET_ACCESS_KEY` with the new token.
- **Vercel → Project → Settings → Environment Variables** (production): replace
  the same two vars. (Leave `CLOUDFLARE_ACCOUNT_ID` and `R2_BUCKET_NAME`
  unchanged.)

### 3. Delete the old token
In Cloudflare → R2 → Manage R2 API Tokens → find the old token → **Delete**.
Now only the new key can read.

### 4. Verify the new key
```bash
npm run verify-r2
```
Expected: `✅ R2 read OK` + `HEAD OK`. Then restart the app/Vercel so the new
key is live end-to-end.

### 5. Confirm playback
Log in as a student, play a lesson. The stream proxy must fetch segments from
R2 and render video.

---

## If the new key fails
- `verify-r2` error → the token lacks read access or the creds are mistyped.
  Confirm the token has Object Read on the exact bucket.
- App 500s on video → the Vercel env wasn't restarted, or a cached instance
  still held the old key. Redeploy / hard-refresh.
- Rollback: re-add the old token if you haven't deleted it and swap env back.

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