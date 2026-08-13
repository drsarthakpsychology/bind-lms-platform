# NEEDS KAVYA — do this in one sitting (free ones first)

Every item: paste → something switches on → verify with one command. Free first.

## 🟢 Free — no card, no cost

### 1. `NVIDIA_API_KEY` — build.nvidia.com (free, no card, ≈40 RPM)
- **URL:** https://build.nvidia.com → sign in → any model page → "Get API Key" → copy
- **Switches on the moment you paste it (add to `.env.local`):**
  - **CosyVoice 2 server TTS** — `/api/practice/voice/synthesis` (emotion tags live)
  - **Whisper STT** `/api/practice/voice/stt` — full server transcription
  - **Director/Actor patient engine** — the real model instead of fixtures
  - **Debrief scoring** — real rubric scoring instead of fixtures
- **Verify:** `curl -s https://integrate.api.nvidia.com/v1/models -H "Authorization: Bearer $NVIDIA_API_KEY" | head -c 200`

### 2. `GROQ_API_KEY` — console.groq.com (free, no card)
- **URL:** https://console.groq.com/keys
- **Switches on:** Whisper STT (fast path, first in the chain) + fast Director lane
- **Verify:** `curl -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY" | head -c 200`

### 3. `GEMINI_API_KEY` — aistudio.google.com (free)
- **URL:** https://aistudio.google.com/apikey
- **Switches on:** content generation, embed lane, second Director/Actor provider
- **Verify:** `curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY" | head -c 200`

### 4. `CEREBRAS_API_KEY` — cloud.cerebras.ai (free)
- **URL:** https://cloud.cerebras.ai/platform (API keys page)
- **Switches on:** bulk drafting lane (JSON capability priority)
- **Verify:** `curl -s https://api.cerebras.ai/v1/models -H "Authorization: Bearer $CEREBRAS_API_KEY" | head -c 200`

### 5. `CLOUDFLARE_ACCOUNT_ID` + `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` + `R2_BUCKET_NAME` — dash.cloudflare.com (free 10 GB)
- **URL:** https://dash.cloudflare.com → R2 → create bucket `plms-media` (or reuse) → Manage API Tokens → create token with Object Read/Write on the bucket
- **Switches on:** voice synthesis cache (sha256-keyed objects in `voice/`), plus the pre-existing video/audio storage migration paths
- **Verify:** `npm run pregen-voice -- --dry-run` (dry-run needs no creds) then `npm run pregen-voice` once `NVIDIA_API_KEY` + R2 are both set

### 6. `CRON_SECRET` + `APP_URL` — generate locally, no cost
- **Generate:** `openssl rand -base64 32`
- **Switches on:** the GitHub Actions crons (keepalive, infra-check, alumni-transition) can authenticate to `/api/internal/cron`. Add as GitHub repo secrets + `.env.local`.
- **Verify:** after deploying, `curl -s -H "Authorization: Bearer $CRON_SECRET" https://<your-app>/api/internal/cron?task=keepalive`

## 🟡 Optional — nice but not blocking

### 7. `KOKORO_API_URL` — self-host Kokoro-82M (Apache 2.0, CPU)
- **URL:** https://github.com/hexgrad/kokoro (local install; expose an OpenAI-compatible `/v1/audio/speech`)
- **Switches on:** second TTS tier when NVIDIA is down
- **Verify:** `curl -s -X POST $KOKORO_API_URL/v1/audio/speech -H "Content-Type: application/json" -d '{"model":"kokoro","input":"hello","voice":"af_heart"}' -o /tmp/t.mp3 && ls -la /tmp/t.mp3`

### 8. `ANTHROPIC_API_KEY` — paid, no-train provider for live student sessions
- **URL:** https://console.anthropic.com
- **Switches on:** the strongest `trainsOnData === false` provider — live patient turns + debrief scoring + journal "help me think" route to it. Until a no-train key exists, **student-data workloads refuse non-compliant free tiers by design** (the data-policy guard).
- **Verify:** run a Consulting Room session and watch `/admin/infra` provider health

### 9. `ICD_CLIENT_ID` + `ICD_CLIENT_SECRET` — WHO ICD-11 API programmatic tier (free for research)
- **URL:** https://icd.who.int/icdapi (register for API access)
- **Switches on:** reliable ICD-11 chapter walking (the public browser tier 401s intermittently)
- **Verify:** `npm run corpus:icd11`

## 📝 Manual downloads (the fetchers point at these)

- **WHO mhGAP-IG 2.0 PDF** → save to `scripts/corpus/raw/mhgap/mhgap-ig-2.0-eng.pdf` (the IRIS link serves a redirect page; manual download covers it). Source: https://iris.who.int/handle/10665/250239
- **NMHS main report PDF** → `scripts/corpus/raw/nmhs/` (NIMHANS link has a TLS cert issue in Node; browser download works). Source: https://www.nimhans.ac.in (NMHS publications page)
- **POCSO 2012 / RCI 1992 PDFs** → `scripts/corpus/raw/statutes/` (India Code links 302 to the browser; MHA 2017 already fetched programmatically)

## 🎙️ Content review — the highest-value asset

- **Dictate your 20 composite cases** → `/admin/corpus/dictate` (ten minutes talking beats an hour of typing; the interviewer state-machine fills the case spec)
- **Score calibration transcripts** → `/admin/calibration` (20 AI-vs-AI self-play sessions are seeded now — blind-score them; provisional dimensions hide from students until validated)
- **Review drafted flashcards** → `cards` table drafts (7 from the seeded MSE lesson transcript; approve the good ones)
- **Flip feature flags when ready** → `/admin/flags` (6 live — Consulting Room, Decoder, MSE, Judgment, Rounds, Journal; 12 built-but-off tools reveal on one click)

## 🕵️ STRIX PENTEST — DONE (ran with your DeepSeek key)
- STRIX 1.5.3 installed + ran against `./src` (quick, headless) with the
  DeepSeek key you pasted. **0 exploitable vulnerabilities**; follow-up
  validation of the flagged service-role routes confirmed ownership checks are
  in code. Report: `docs/SECURITY_AUDIT.md` (STRIX section). Re-run anytime:
  `DOCKER_HOST=unix://$HOME/.docker/run/docker.sock ~/.strix/bin/strix -t ./src -m standard -n`.
  For a deeper pass, use a recommended frontier model (e.g. openai/gpt-5.4)
  instead of deepseek-chat.

## 🔒 SECURITY AUDIT 2026-08-14 — ONE action to apply
- **Enable RLS on `_migrations_applied`** (the only public table with RLS off —
  anon key can read the migration ledger via REST). Fix is staged, ready:
  `npm run apply-pending` on `src/migrations_pending/rls_migrations_applied.sql`
  (a single `ALTER ... ENABLE ROW LEVEL SECURITY`; additive, no policies). Full
  report: `docs/SECURITY_AUDIT.md`. Everything else audited clean (secrets,
  middleware, RLS, headers, deps).
- **Auth-consistency sweep DONE**: every API route that used bare
  `auth.getUser()` now routes through `requireSession()` (profiles row + expiry
  + concurrent-session token). 38 routes hardened. `sim/debrief|rewind|turn|
  session` were intentionally left JWT-only this round (see QUEUE).

## Reminder (already done this session)
- MHA 2017 full text: fetched 409 KB into `scripts/corpus/raw/statutes/` (gitignored).
- 65 idioms seeded (18 compulsory approved); 20 calibration transcripts; wall reactions/replies live; journal sharing live.
- Content volume rounds: idioms bank 95, SCT 154, quiz bank 51, out-of-depth 50, ethics 40, landmark 22, clinic 101.
- **Review the 7 drafted flashcards + 20 calibration transcripts + the new content batches** in the admin queues — approval is the human step the build cannot do.
## 🎁 NEW — the paid books (you said they're paid for)

**57 titles are already flipped to `licensed` in the registry** and the
ingester ran — 3 were acquired via the archive.org ladder (POCSO +
governance docs). The rest are retail-license titles with **no free copy**.
To make them land:

1. **Drop the purchased files (PDF/ePub) into `/mnt/acquire/`** — the watcher
   ingests them into the right layer automatically (ladder step 6, the
   catch-all). This is the highest-value single action: it turns your
   purchases into the patient-voice corpus.
2. OR **paste a purchased-account credential** (Kindle/Google Play/VitalSource
   download access) in `.env` — the ladder's step 2 reads it.

Until files exist on disk the registry honestly shows `acquisition_failed`
with the reason — that's the pipeline working, not a bug.

## 🗄️ Schema debt needing a product call (not a bug, not blocking)

- **`practice_chains` + `sim_cases.follow_up`** (multi-session "recurring
  patient" arcs) — table + column went live tonight but were authored as
  speculative scaffolding in an earlier round: zero cases have `follow_up`
  content, zero application code reads either. Building UI around an empty,
  unspecced concept isn't in the master brief, so it's parked rather than
  invented from nothing. If you want this feature, it needs: what a
  "follow-up session" actually contains, and one call to just delete the
  table if it turns out you don't.
- **`osce_stations` / `mse_stimuli` / `formulation_cases` / `public.idioms`**
  — four DB tables, full RLS, zero readers. OSCE/MSE/Formulation/the
  Decoder all ship their real content as static TS files instead (see
  `docs/PRACTICE_LAYER.md` § "Content: code vs DB"). Two options, your
  call: (1) wire a real admin-authoring flow so faculty can add OSCE
  stations etc. without a code change, or (2) drop the unused tables.
  Currently harmless either way — flagging so it doesn't sit unexplained.

## 🔊 Voice — FREE-FIRST (use Kokoro + MiMo, not ElevenLabs)

The synthesis chain is reordered free-first (`src/lib/voice/synthesize.ts`):
MiMo (MIT) → Kokoro (Apache, CPU) → Qwen3 → Chatterbox → CosyVoice → ElevenLabs
LAST. The zero-cost voice that works TODAY:
- **Kokoro-82M** (Apache-2.0, CPU, runs on the Mac) — set `KOKORO_API_URL` to a
  local OpenAI-compatible audio/speech server.
- **MiMo-V2.5-TTS** (MIT, arena-top) — set `MIMO_TTS_URL` (Xiaomi API free beta
  or self-host) for the best free quality.

ElevenLabs is NOT recommended (paid). It's only a last-resort tier if you
specifically want premium voices — `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID`.

## ✉️ Cohort-pulse one-tap nudge — one key away

The code path is BUILT: `/api/admin/nudge` sends via Resend's REST API (fetch,
no SDK) when configured, and the /admin/pulse button calls it. It only needs
two env vars to actually send:
- `RESEND_API_KEY` (Resend account)
- `RESEND_FROM_EMAIL` (e.g. "VIBHA School of Psychology <noreply@…>")

Until those exist it honestly returns `email-not-configured` and sends
nothing — it never claims a message went out.

## 🧠 Research-round decisions (2026-08-14)
- **OpenRouter**: free tier is 50 RPD — unusable for daily turns. One-time $10
  top-up permanently unlocks 1,000 RPD. Decide if that's worth it, or drop
  OpenRouter from the overflow lane. It's already a last-resort fallback.
- **Quota re-verify at go-live**: Gemini/Groq/Cerebras free quotas moved
  repeatedly through 2026 and are account-dependent — re-check each dashboard
  before wiring the keys to production.
- **json_schema**: intentionally NOT used — Groq's strict mode is in flux and
  Cerebras requires `additionalProperties:false` on every object (a known 422
  failure). The json_object + Zod-repair + failover path is provider-agnostic
  and reliable. Revisit if Groq ships stable strict outputs.

## 📥 THE ONE BLOCKING ITEM (drop-folder ingest)

The licensed ingester's ladder step 6 is `/mnt/acquire/` — the drop folder.
It does not exist on this machine (`ls /mnt/acquire` → No such file). To
activate the 57 paid titles:

1. `mkdir -p /mnt/acquire` (anywhere the ingester runs — on this Mac or the
   Linux box)
2. Drop the purchased PDFs/ePubs there (filename ≈ title slug)
3. `npm run corpus:licensed` — the watcher ingests them into the right
   layer, hashes, and marks them acquired.

Until a file exists in the folder, the registry honestly shows
`acquisition_failed` — that is the pipeline working, not a bug.

## 🧠 2026-08-14 free-tier research — read before adding keys

- **Gemini free tier is NOT safe for student data.** Google may train on
  free-tier prompts and human-review them (users outside EEA/UK/CH). The
  GEMINI_API_KEY item above lists "second Director/Actor provider" — restrict
  it to non-student lanes (content gen / embeddings) or use the billed API for
  any student turn. Free 2.5 Pro was removed Apr 2026.
- **Groq + Cerebras are the two verified no-training free providers** — Groq is
  the recommended Primary (DPA forbids training, ZDR available, 30 RPM / 1K RPD
  per model), Cerebras the Fallback (~1M tok/day). Both no card, both
  OpenAI-compatible JSON.
- **OpenRouter**: no-training but only 50 RPD at $0 — needs a one-time $10
  top-up to reach 1,000 RPD. Decide if that's acceptable.
- **NVIDIA free tier** may use request data for model improvement — fine for
  TTS/STT, not for student transcripts.
