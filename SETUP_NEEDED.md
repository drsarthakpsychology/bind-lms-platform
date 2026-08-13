# SETUP_NEEDED — one sitting, ordered, free first

Everything below switches on something real. Paste → verify → move on.
~20 minutes total.

---

## 🟢 FREE-AND-INSTANT (no card, no account approval)

### 1. `NVIDIA_API_KEY` — build.nvidia.com (free, ~40 RPM)
- **URL:** https://build.nvidia.com → sign in → any model page → "Get API Key"
- **Switches on:** CosyVoice2 TTS tier (`synthesize.ts`), Whisper STT
  (`/api/practice/voice/stt`), and the Director/Actor live lane + debrief
  scoring (real models instead of fixtures)
- **Verify:** `curl -s https://integrate.api.nvidia.com/v1/models -H "Authorization: Bearer $NVIDIA_API_KEY" | head -c 200`

### 2. `GROQ_API_KEY` — console.groq.com (free)
- **URL:** https://console.groq.com/keys
- **Switches on:** Whisper STT fast path + the fast Director lane (llama-3.3-70b, trainsOnData:false — student-data compliant)
- **Verify:** `curl -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY" | head -c 200`

### 3. `GEMINI_API_KEY` — aistudio.google.com (free)
- **URL:** https://aistudio.google.com/apikey
- **Switches on:** second chat/embed provider + the bulk drafting lane. NOTE: free Gemini trains on data — the data-policy guard sends only content-generation work to it, never student sessions.
- **Verify:** `curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY" | head -c 200`

### 4. `CEREBRAS_API_KEY` — cloud.cerebras.ai (free)
- **URL:** https://cloud.cerebras.ai/platform → API keys
- **Switches on:** the JSON-capability Director lane (llama-3.3-70b, trainsOnData:false)
- **Verify:** `curl -s https://api.cerebras.ai/v1/models -H "Authorization: Bearer $CEREBRAS_API_KEY" | head -c 200`

### 5. R2 — `CLOUDFLARE_ACCOUNT_ID` + `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` + `R2_BUCKET_NAME` (+ `R2_PUBLIC_URL` optional) — free 10 GB
- **URL:** https://dash.cloudflare.com → R2 → create bucket → Manage API Tokens → Object Read/Write on the bucket
- **Switches on:** the synthesis cache (sha256-keyed `voice/*.mp3` objects — every TTS line rendered once), plus the corpus full-text store
- **Verify:** `npm run pregen-voice -- --dry-run` (needs no creds) then `npm run pregen-voice` once NVIDIA + R2 are both set

### 6. `CRON_SECRET` + `APP_URL` — generate locally, no cost
- **Generate:** `openssl rand -base64 32`
- **Switches on:** the GitHub Actions crons (keepalive, infra-check, alumni-transition) can authenticate to `/api/internal/cron`
- **Verify:** after deploy, `curl -s -H "Authorization: Bearer $CRON_SECRET" https://<app>/api/internal/cron?task=keepalive`

---

## 🟡 NEEDS-AN-ACCOUNT (free but requires registration)

### 7. `QWEN_TTS_URL` (+ optional `QWEN_TTS_API_KEY`) — the PRIMARY TTS tier
- **URL:** SiliconFlow (https://siliconflow.com) hosts Qwen3-TTS with an OpenAI-compatible `/v1/audio/speech`; or self-host via vLLM on a rented GPU (below). Qwen3-TTS is commercially permissive (Apache 2.0/Qwen license), 10 languages, voice cloning, natural-language voice direction.
- **Switches on:** the primary TTS tier in `synthesize.ts` — the patient's voice, affect-mapped
- **Verify:** `curl -s -X POST "$QWEN_TTS_URL/v1/audio/speech" -H "Content-Type: application/json" -d '{"model":"Qwen3-TTS","input":"Hello","voice":"en-IN-hinglish-male-adult"}' -o /tmp/t.mp3 && ls -la /tmp/t.mp3`

### 8. `CHATTERBOX_TTS_URL` (+ `CHATTERBOX_TTS_API_KEY`) — the QUALITY tier (MIT)
- **URL:** self-hosted Chatterbox-Turbo (MIT, beats ElevenLabs in Resemble's blind test). Run on a rented GPU or a beefy Mac via a local OpenAI-compatible server; set the URL.
- **Switches on:** the quality tier with native `[laugh] [sigh] [sob] [cough]` tags + emotion exaggeration — the affect states map directly
- **Verify:** same curl shape as Qwen3 with `"model":"Chatterbox-Turbo"`

### 9. `KOKORO_API_URL` — CPU fallback (Apache 2.0, 82M params)
- **URL:** https://github.com/hexgrad/kokoro — self-host, expose `/v1/audio/speech`
- **Switches on:** the CPU fallback tier — runs on the Mac, no GPU, decent quality
- **Verify:** `curl -s -X POST "$KOKORO_API_URL/v1/audio/speech" -H "Content-Type: application/json" -d '{"model":"kokoro","input":"hello","voice":"af_heart"}' -o /tmp/t.mp3 && ls -la /tmp/t.mp3`

### 10. `ANTHROPIC_API_KEY` — paid, no-train provider for live student sessions
- **URL:** https://console.anthropic.com
- **Switches on:** the strongest trainsOnData:false provider — live patient turns + debrief scoring + journal "help me think". Until this exists, student-data workloads REFUSE non-compliant free tiers by design (the data-policy guard). This is the one key that unlocks the full live experience.
- **Verify:** run a Consulting Room session and watch `/admin/infra` provider health

### 11. `ICD_CLIENT_ID` + `ICD_CLIENT_SECRET` — WHO ICD-11 API (free for research)
- **URL:** https://icd.who.int/icdapi
- **Switches on:** reliable ICD-11 chapter walking (the public browser tier 401s intermittently)
- **Verify:** `npm run corpus:icd11`

---

## 💰 NEEDS-PAYMENT (optional, only when volume demands)

### 12. Rented GPU for TTS (if you don't want SiliconFlow)
- **Options:** RunPod / Vast.ai / Lambda — a single RTX 4090 (24GB) rents ~$0.30-0.60/hr. Hosts Qwen3-TTS (primary) + Chatterbox-Turbo (quality) on one box behind an OpenAI-compatible server; set both URLs to it.
- **Monthly cost for 30 students:** TTS is tiny per line (~1-3s audio each). Even 3,000 patient lines/month ≈ 2-4 GPU-hours ≈ **under $5/month** on spot. The dominant cost is NOT TTS — it's the live Director/Actor model calls, which the no-train providers above cover free.

### 13. Whisper large-v3 (if Groq free tier isn't enough)
- Groq's Whisper large-v3 is free at generous limits. If you outgrow it: NVIDIA NIM Whisper (the key in #1) or a rented GPU. Browser Web Speech stays the zero-cost default with `lang="en-IN"` and the editable interim transcript.

---

## 🖥️ NEEDS-HARDWARE (the honest TTS answer)

**What runs on your Mac right now, no GPU:**
- **Kokoro-82M** (Apache 2.0, CPU) — real TTS, decent quality, ~instant on an M-series Mac. Set `KOKORO_API_URL` to a local server. **This is the zero-cost path that works TODAY.**
- Browser `speechSynthesis` with `en-IN` voices + the affect-mapped rate/pitch — always-on, zero keys, the fixture-mode patient voice.

**What needs a rented GPU (or SiliconFlow's hosted API):**
- Qwen3-TTS (primary) and Chatterbox-Turbo (quality) both want a GPU for real-time. SiliconFlow hosts Qwen3-TTS for ~free/cheap per-minute; Chatterbox is best on a rented 4090.

**RECOMMENDED PATH (one line, research 2026-08-14):** **Groq** for the Director/Actor + Whisper STT (no-train, no card, fastest), **Kokoro-82M local** for the patient's voice today (CPU, runs on the Mac, zero cost) with **MiMo-V2.5-TTS** (MIT, arena-top, voice cloning) as the upgrade when you host it, and **Cerebras** as the no-train JSON fallback. ~$0/month at 30 students. **No ElevenLabs — the free tiers cover the voice.**

**The three voice answers, plainly:**
- **Runs on your Mac now, no GPU, no payment:** Kokoro-82M (Apache-2.0, CPU) — real expressive-enough TTS, ~instant on an M-series. Plus browser `speechSynthesis` en-IN with affect-mapped rate/pitch as the zero-key fixture voice.
- **Needs a rented GPU:** MiMo-V2.5-TTS or a fine-tuned Whisper for Indian-English. A single RTX 4090 (~$0.30–0.60/hr on RunPod/Vast) hosts both for a small cohort; 30 students ≈ 2–4 GPU-hours/month ≈ **under $5/month**.
- **Recommended:** Kokoro local now (zero cost) → MiMo-V2.5-TTS hosted/self-hosted when the cohort grows. Groq drives the conversation + STT free, no card.

---

## What switches on the second each is pasted (summary)

| Env var | Switches on | Free? |
|---|---|---|
| NVIDIA_API_KEY | CosyVoice2 TTS + Whisper STT + live Director/Actor + scoring | ✅ |
| GROQ_API_KEY | **PRIMARY Director/Actor** (no-train, JSON) + Whisper STT | ✅ |
| GEMINI_API_KEY | content-drafting + embed lane (never student data) | ✅ |
| CEREBRAS_API_KEY | JSON Director lane | ✅ |
| R2 4-vars | synthesis cache + corpus store | ✅ |
| CRON_SECRET + APP_URL | GitHub Actions crons | ✅ |
| QWEN_TTS_URL | PRIMARY patient voice | ✅/cheap |
| CHATTERBOX_TTS_URL | QUALITY tier + native affect tags | ✅/cheap |
| KOKORO_API_URL | CPU fallback TTS — runs today on the Mac | ✅ |
| ANTHROPIC_API_KEY | the live student-data lane (the one that matters) | paid |
| ICD_* | ICD-11 chapter walking | ✅ |
