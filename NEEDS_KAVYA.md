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
