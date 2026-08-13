# MODEL RESEARCH — free models, protected infrastructure

Research date: **2026-08-14**. Sources fetched live (licences from the actual
LICENSE/model cards; data policies from provider docs). This is the revisitable
record — re-check every claim before a go-live, the field moves monthly.

Context: an Indian clinical-training app. The patient's voice (TTS), the
student's voice (STT), a Director/Actor LLM (conversation + JSON), and
embeddings. Everything must be commercially usable and — for anything that
touches a named student's transcript — **no-training-guaranteed**. The
data-policy guard (`src/lib/ai/guards.ts`) enforces that in code.

---

## A. Text-to-speech — the patient's voice

Requirement: expressive, emotionally controllable (tired / flat / irritated /
tearful on command), low latency, Indian-English, commercially usable.

| Candidate | Licence (verified) | Quality | Emotion | Ind-EN | Free/self-host | Verdict |
|---|---|---|---|---|---|---|
| **MiMo-V2.5-TTS** (Xiaomi, Apr'26) | **MIT** (open-sourced series; TTS skill MIT) | Top of Artificial Analysis TTS arena (~1233 Elo, tied) | presets + voice-design + voice-clone variants | multilingual incl. Indian langs | API free-beta; weights open | **PRIMARY (open-weights)** — best quality + permissive licence |
| Qwen-Audio-3.0-TTS-Plus | commercial API (Alibaba) | arena leader ~1233 | strong | Hindi/Indian | hosted, paid | strong, but hosted-paid (not free) |
| ElevenLabs v3 | commercial | ~1172 Elo | excellent | en-IN voices | paid / small free | quality benchmark, not free |
| **Kokoro-82M** | **Apache-2.0** | decent | none native | English-focused | **CPU, runs today on the Mac** | **FALLBACK** — zero-cost, zero-GPU |
| IndexTTS-2 | **Bilibili custom — PROHIBITS medical/high-risk deployment** | excellent | good | — | self-host | **REJECT — the licence excludes a clinical app** |
| Parler-TTS / F5-TTS / XTTS-v2 / open Fish S2 | mixed; several non-commercial or restricted | good | some | varies | self-host | rejected — licence/quality trade-off worse than MiMo/Kokoro |

**Tier choice:** Primary = MiMo-V2.5-TTS (MIT, open, arena-top, voice design +
clone for the case voices). Fallback = Kokoro-82M (Apache-2.0, CPU, runs on the
Mac with zero cost/GPU — the honest "works today" path). Stub = browser
`speechSynthesis` with en-IN voices + affect-mapped rate/pitch (always-on,
fixture mode). The existing chain (`src/lib/voice/synthesize.ts`: ElevenLabs →
Qwen3 → Chatterbox → CosyVoice → Kokoro → fixture) already implements the
fallback-to-stub shape; MiMo becomes the recommended open-weights primary.

Data policy: ElevenLabs (free tier trains on data — keep voice cloning of real
people out), Google/OpenAI TTS (train on data), NVIDIA NIM (official terms claim
no training; self-host for certainty).

## B. Speech-to-text — the student's voice

Requirement: Indian-English accuracy, streaming, free hosted or CPU self-host,
commercial.

| Candidate | Licence (verified) | Ind-EN | Streaming | Verdict |
|---|---|---|---|---|
| **Whisper large-v3-turbo** (OpenAI) | **MIT** | weak 0-shot (~55% WER on raw Indian speech) but **Indic fine-tunes (Tara / Vaani-Whisper / whisper-hinglish) bring Ind-EN to ~8–15%** | via whisper.cpp/faster-whisper (VAD) | **PRIMARY (self-host fine-tune)** — MIT, CPU-capable at Q4–Q8, no clinical audio egress |
| **Groq Whisper large-v3/turbo** | — | same checkpoints | **no streaming** | **FALLBACK (hosted free)** — no-card, **no training** (DPA + ZDR), very low latency |
| Deepgram Nova-3 | commercial | good | yes, sub-300ms | paid ($200 one-time then per-min) — only if true streaming is mandatory |
| **Parakeet-tdt-0.6b-v2** (NVIDIA) | **CC-BY-4.0** | not Indic-tuned | streaming-aware | self-host option, attribution required |
| **Canary-1b** (NVIDIA) | **CC-BY-NC-4.0** | — | — | **REJECT — non-commercial** |
| Gemini / AssemblyAI free | commercial | good | — | **REJECT for clinical — trains on audio by default** |

**Tier choice:** Primary = self-host fine-tuned Whisper (Indic) on
whisper.cpp/faster-whisper (MIT, CPU, private). Fallback = Groq Whisper
large-v3-turbo (free, no-train, but no streaming). Stub = browser Web Speech
`en-IN` + editable interim transcript (already the default). Groq Whisper is
already wired as the STT fallback in the repo.

## C. Conversational LLM — Director/Actor

Requirement: free tier, no card, instruction-following + reliable JSON, and
no-training for student-data lanes.

| Provider (2026) | Free tier | Card? | Trains on data? | JSON | Verdict |
|---|---|---|---|---|---|
| **Groq** | ~30 RPM / 1K–14K RPD / ~12K TPM per model | no | **No (DPA forbids; ZDR available)** | `json_object` confirmed; `json_schema` in flux | **PRIMARY** — no-train + fast (LPU) |
| **Cerebras** | ~1M tok/day | no | **No** (inference-only) | `json_schema` on Llama 3.1/3.3-70b | **FALLBACK** — no-train, OpenAI-compatible |
| **Gemini free** | ~10–15 RPM / ~1.5K RPD | no | **YES — free tier trains on prompts (human review)** | yes | content-only (guard filters it from student lanes) |
| OpenRouter free | 50 RPD at $0 (1K after $10 one-time) | no | per-provider | yes | overflow lane only |
| **Anthropic** (paid) | — | paid | **No** | yes | the gold no-train tier when it can be afforded |

The registry (`src/lib/ai/router.ts`) now routes `chat`/`stream`/`json` to
**Groq first** (no-train → serves student data), Cerebras second, with Gemini
demoted to a non-student fallback (verified by `src/lib/ai/router.test.ts`).

## D. Embeddings

Requirement: free, 384-dim capable or truncatable, commercial.

| Candidate | Licence / data policy | Dims | Verdict |
|---|---|---|---|
| **all-MiniLM-L6-v2** (self-host) | **Apache-2.0** | 384 | **PRIMARY** — CPU-fast (~2–3ms/text), no egress |
| bge-small / gte-small (self-host) | MIT / Apache | 384 | +5–6 MTEB at same 384 |
| Gemini Embedding 2 (free) | free tier trains | 3,072→128–1,536 | non-sensitive only |
| Cohere embed-v4 trial | **trains trial data, no opt-out** | 1,024 | REJECT |
| Jina hosted free | **CC-BY-NC non-commercial** | 1,024 | REJECT |

The repo already stores `halfvec(384)` and uses MiniLM-class embeddings — this
matches the recommended primary.

## Rejection log (why these are out)
- **IndexTTS-2 / Canary-1b**: licence gates (medical-deployment prohibition /
  non-commercial) — hard fails regardless of quality.
- **Gemini / AssemblyAI / Cohere / Jina free tiers**: train on data (or
  non-commercial) — unsafe for named-student clinical transcripts. Gemini free
  stays for content-generation only, enforced by `assertProviderAllowed`.
- **Deepgram / ElevenLabs / Qwen-Plus**: strong but not free at the needed
  volume; Deepgram stays the answer if true streaming is a hard requirement.

## Sources
Artificial Analysis TTS arena (MiMo ~1233, Qwen-Plus ~1233, Eleven v3 ~1172) ·
Xiaomi MiMo-V2.5 open-source announcement (MIT, Apr 2026) · IndexTTS-2 HF model
card (Bilibili licence) · Kokoro-82M (Apache-2.0) · Whisper large-v3-turbo HF
card (MIT) · whisper.cpp / faster-whisper LICENSE (MIT) · Parakeet-tdt HF card
(CC-BY-4.0) · Canary-1b HF card (CC-BY-NC-4.0) · Exotel "Voice of India" (2026)
Ind-EN WER data · Trelis whisper-hinglish · Groq "Your Data in GroqCloud" (no
training, ZDR) · Cerebras structured-outputs docs (Apr 2026) · Gemini API
pricing/data page (free tier trains; paid doesn't) · all-MiniLM-L6-v2 HF card
(Apache-2.0) · Open ASR leaderboard.

All free tiers are prototyping-grade (no SLA) — for a clinical app, self-host or
paid plans are the compliant production paths.
