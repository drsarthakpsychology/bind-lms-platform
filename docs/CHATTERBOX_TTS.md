# Chatterbox TTS — the patient's natural voice

_2026-08-15. The AI patient's VOICE is now Chatterbox (open-source, MIT), not a
robotic TTS. The brain is untouched: the LLM engine still writes every word,
the case truth, memory and personality are unchanged. Chatterbox only turns the
reply into natural speech._

## Why Chatterbox

| | Old (Inworld via LiveKit Inference) | New (Chatterbox) |
|---|---|---|
| Voice | robotic, flat, single "Guy" | human, expressive, natural prosody |
| Emotion | none | paralinguistic tags + zero-shot expressiveness |
| Cost | LiveKit Inference per-request | self-hosted, MIT, near-$0 compute |
| Control | closed | open weights, voice cloning, fine-tunable |

Chatterbox-Turbo (350M) is the recommended model for low-latency voice agents
(sub-200 ms streaming, ~4–6 GB VRAM at Q4). Chatterbox-Nano (110M) runs 3×
realtime on 8 CPU cores for CPU-only boxes. Both MIT-licensed.

## Architecture (simplest reliable setup)

```
Student → LiveKit WebRTC → AgentSession (realtime, barge-in)
                              │
                              ├─ STT: deepgram/nova-3 (LiveKit Inference)
                              ├─ LLM: the EXISTING patient engine (src/lib/sim)
                              │        → runSessionTurn → runPatientTurn (case truth, memory)
                              └─ TTS: ChatterboxTTS plugin  ←  ChatGPT-like natural voice
                                       │
                                       └─ Chatterbox-TTS-Server (OpenAI-compatible /v1/audio/speech, SSE)
```

- **The engine is the brain.** `livekit-agent/agent.ts` routes every student
  turn through `runSessionTurn` → `runPatientTurn` — same case, state, gates,
  memory, provider as text mode. Zero changes to patient logic.
- **Chatterbox is the mouth.** `livekit-agent/chatterbox-tts.ts` is a LiveKit
  `tts.TTS` plugin that streams text to an OpenAI-compatible Chatterbox server
  and feeds PCM16 back into the realtime pipeline (which resamples to the
  room's 48 kHz). Streaming + barge-in work natively.
- **The voice carries the patient's emotion.** After each engine turn the
  Director's `affect` is set on the TTS (`setAffect`); Chatterbox's native
  paralinguistic tags add natural colour — `[sigh]` for sombre affects,
  `[chuckle]` for brittle cheerfulness — mapped conservatively in
  `affectToParalinguistic` so the patient never sounds like a caricature.
- **Fallback.** No `CHATTERBOX_URL` set → Cartesia `sonic-2` (natural,
  ~75 ms TTFB) via LiveKit Inference. The old robotic Inworld voice is gone.

## Files changed

- `livekit-agent/chatterbox-tts.ts` — the custom LiveKit `TTS` plugin (new).
- `livekit-agent/agent.ts` — `makeTTS()`: Chatterbox when configured, Cartesia
  sonic-2 otherwise (replaces `inworld/inworld-tts-2`).
- `.env.local` (gitignored) — Chatterbox config keys.

## Env vars

| Key | Required | Meaning |
|---|---|---|
| `CHATTERBOX_URL` | to enable | Base URL of the OpenAI-compatible Chatterbox server, e.g. `http://10.0.0.5:4123` |
| `CHATTERBOX_TTS_MODEL` | optional | Model id the server understands (default `chatterbox-turbo`) |
| `CHATTERBOX_TTS_VOICE` | optional | Registered voice id on the server (reference clip) |
| `CHATTERBOX_API_KEY` | optional | Bearer token if the server requires auth |
| `LIVEKIT_TTS_MODEL` / `LIVEKIT_TTS_VOICE` | optional | Fallback override (default `cartesia/sonic-2` + a natural Cartesia voice id) |

`LIVEKIT_API_SECRET` never reaches the browser — only the worker reads it to
sign short-lived room tokens.

## Deploy the Chatterbox server (production path)

The worker (LiveKit Cloud) calls the Chatterbox server over HTTP, so the server
just needs a reachable address + a GPU.

**Cheapest infra (with AWS credits):** one `g4dn.xlarge` (T4, ~16 GB VRAM) or
`g5.xlarge`, or an 8-GB-VRAM free-tier GPU spot from a cloud provider. Turbo
needs ~4–6 GB VRAM at Q4. For CPU-only boxes use Nano
(`CHATTERBOX_TTS_MODEL` = nano checkpoint).

**Recommended server image** — an OpenAI-compatible FastAPI server that mirrors
`/v1/audio/speech` with SSE PCM16 streaming and a voice library:

- [BisocM/chatterbox-openai](https://github.com/BisocM/chatterbox-openai) —
  `/v1/audio/speech`, SSE PCM16, voice cloning, NVIDIA Docker.
- [danielrosehill/Chatterbox-TTS-Server](https://github.com/danielrosehill/Chatterbox-TTS-Server) —
  feature-rich: web UI, voice cloning, predefined voices, CPU/ROCm/MPS.
- [petermg/Chatterbox_TTS_Streaming_API](https://github.com/petermg/Chatterbox_TTS_Streaming_API) —
  local, OpenAI-compatible, voice library, Docker compose (CPU/GPU/uv).

Run it, register a reference voice clip for the patient (`VOICE_LIBRARY_PATH`),
and set `CHATTERBOX_URL`. The worker picks it up on next start — no code change.

The plugin speaks the **Realtime-API-style SSE format** emitted by these
servers:

```
data: {"type":"response.output_audio.delta","audio":"<base64 pcm16>","sample_rate":24000}
...
data: [DONE]
```

## Verification (run 2026-08-15)

- **Gate:** `npx tsc --noEmit` clean, `npm run lint` clean, `npm run test`
  505/505, `npm run build` green. Plugin + worker are typechecked by the gate.
- **Worker:** `npx tsx livekit-agent/agent.ts dev` registers on LiveKit Cloud
  (agent `bind-patient`); at session start it logs
  `[patient-agent] TTS primary: chatterbox|livekit-inference (cartesia/sonic-2)`.
- **Real Chatterbox audio:** Chatterbox-Turbo (350M) ran locally on Apple MPS,
  generated real patient lines to WAV (native 24 kHz, valid WAVE, afinfo-verified):

  | Line | Audio | RMS | Peak | Gen time (MPS) |
  |---|---|---|---|---|
  | "It's just… I haven't been sleeping well…" | 7.84 s | 0.041 | 0.49 | 41 s |
  | "How have you been feeling lately?" | 1.76 s | 0.044 | 0.40 | 15 s |
  | "I'm not okay, but I'm scared to say that out loud." | 2.88 s | 0.045 | 0.37 | 13 s |

  Samples on disk at `docs/samples/` (gitignored; listen with `afplay`).
- **Plugin ↔ server contract test:** a local OpenAI-compatible server
  (`/v1/audio/speech`, SSE PCM16) + the ACTUAL `ChatterboxTTS.stream()` code
  (the same path the LiveKit voice pipeline calls) produced 3 valid WAVs —
  proves the SSE parsing, AudioFrame construction, and resampling work.

## Verification checklist for the deployed Chatterbox server

- [ ] `curl http://<CHATTERBOX_URL>/healthz` → `{"ok":true,...}`
- [ ] `curl -N http://<CHATTERBOX_URL>/v1/audio/speech -H 'Content-Type: application/json' -d '{"input":"hello","stream":true,"response_format":"pcm"}'` streams `response.output_audio.delta` events
- [ ] Worker log shows `TTS primary: chatterbox`
- [ ] A student voice turn produces an audible, natural patient reply

## Cost (50 students, concurrency 1–10)

| Path | Cost |
|---|---|
| Chatterbox self-hosted (T4/spot) | ~$0.10–0.20/hr GPU, near-zero per-second TTS; throughput >> 10 concurrent |
| Fallback Cartesia sonic-2 (LiveKit Inference) | free tier, else per-character |
| STT + LLM | unchanged (Groq no-train / LiveKit Inference) |

Chatterbox is the cheapest *human* voice available; per-second compute on a
GPU is negligible at this scale.
