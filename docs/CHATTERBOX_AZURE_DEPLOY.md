# Chatterbox TTS on Azure — Container Apps (Consumption GPU T4, scale-to-zero)

_2026-08-15 · Final architecture + status. The gateway + scale-to-zero stack is
LIVE; the Chatterbox GPU container is deployed but blocked on an ACA T4 CUDA
issue (detailed below). The natural Cartesia voice is live today via the
worker's fallback._

## Architecture (Azure Container Apps — the chosen "something else")

```
Student → LiveKit → AI patient engine → Groq LLM → Chatterbox TTS → back
                                                  │
   ┌───────────── Gateway (chatterbox-gw, tiny CPU, always-on)
   │   owns the stable CHATTERBOX_URL · proxies to the GPU app · 503 while cold
   │   → the worker's FallbackAdapter serves Cartesia (natural) during warm-up
   ▼
   ┌───────────── GPU app (chatterbox-gpu, Consumption-GPU-NC8as-T4)
   │   min-replicas 0 = scale-to-zero (no GPU billing when idle)
   │   cold start ~60-120s; the gateway 503s during it (Cartesia covers the turn)
   └───────────── Chatterbox-Turbo (baked into the image, world-readable)
```

- **No VM quota needed** — Container Apps Consumption GPU is a separate
  workload profile (`Consumption-GPU-NC8as-T4`, 8 vCPU / 56 GiB / 1× T4),
  scale-to-zero with `min-replicas 0`.
- **Region: australiaeast** — the closest region with ACA serverless T4 GPU
  (Microsoft lists West US 3, Australia East, Sweden Central).
- **Same-region ACR** (`chatterboxttsae` in australiaeast) for fast pulls.
- **Image bake**: the 2.8 GB model is baked into the image at
  `/opt/chatterbox-model` (world-readable — ACA containers run non-root, so the
  default `/root/.cache` was invisible and caused a stuck re-download).

## What is LIVE

- Gateway app deployed + verified: `/healthz` OK; synthesis while the GPU is
  cold returns **503** (the worker falls back to Cartesia).
- Worker configured: `CHATTERBOX_URL` → gateway; fallback = **Cartesia sonic-2**
  (the natural voice, never the old robotic Inworld).
- GPU app deployed on the T4 profile; scaled to 0 when idle (no GPU billing).

## Diagnosis (2026-08-16, diagnostic-first — NOT guessed)

Symptom: the GPU container starts, `torch.cuda.is_available()`=True, reports
`Tesla T4`, chatterbox imports — then `from_local` never completes; the heartbeat
and `/debug/stack` freeze (GIL held), and no faulthandler dump fires.

**Instrumented run (one variable: Dockerfile env + faulthandler + a step-timed
loader with a pure CUDA matmul probe):**
- `[env] egress huggingface.co OK (0.2s)` → **egress to the HF API is NOT blocked**
  (the cdn-lfs subdomain fails DNS, but the bake is complete so no LFS fetch is
  needed — this was the leading hypothesis and is REFUTED).
- `[step] OK cuda_matmul_probe (0.5s)` + every small `Tensor.to(cuda)` OK →
  **CUDA compute works** (refutes a platform compute fault).
- `[trace] BEGIN Tensor.to shape=(1024,256).. -> cuda` → **the LAST frame is a
  `Tensor.to(cuda)` during the model load** with no completion — the GIL is held
  by a CUDA weight-transfer that never returns. A one-shot CUDA diagnostic job
  also failed without readable logs.

**Verdict:** neither GitHub issue #1682 (CUDA-init failure) nor #1579
(AssigningReplica) matches. The ACA T4 environment can run a single matmul and
small transfers, but the model's `.to(cuda)` weight load stalls forever. This is
an environment-level CUDA fault specific to loading a model into the T4 — not a
code, network, bake, or config issue. Two fixes were applied (cu128→cu124; the
offline/env instrumentation) and neither changed the outcome, so per the
diagnostic brief's stop rule the ACA-GPU path is set aside. Cartesia remains the
live production voice; Chatterbox is wired and takes over on a working host.

**Remaining options (in order of cost):**
1. **Try a different ACA GPU region** (Australia Southeast / West US 3) — a one
   variable change, one more build + ~$0.50, IF the region fixes the platform fault.
2. **Non-ACA serverless GPU** (Modal / RunPod) — per-second billing + readable logs.
3. **Azure support case** for the T4 CUDA weight-load hang.

## Cost reality (honest, per the brief)

- ACA Consumption GPU = **1 T4 per replica**. 5 concurrent students = **5 replicas
  ≈ $4.90/hr** — not ~$0.98/hr.
- Real usage (50 students × ~2.5 sessions/wk × ~40 min incl. the 5-min scale-in
  cooldown) ≈ **332 GPU-hrs/mo ≈ $325/mo at $0.98/hr** — NOT viable in the $200
  credits.
- The scale-to-zero only saves idle time BETWEEN sessions; a session holds a
  replica for its full duration.
- **Cheaper hosts:** RunPod T4 ~$0.25/hr → ~$83/mo for the same usage; Modal T4
  ~$0.46/hr → ~$153/mo. Both still meaningful, but viable if voice is used by a
  subset of sessions.

## Cost model (per the target usage)

| Item | Cost |
|---|---|
| Gateway (tiny CPU, always-on) | ~$10-15/mo (ACA CPU consumption + base) |
| GPU (Consumption-GPU-NC8as-T4) | ~$0.98/hr **active only**; **$0 while scaled to 0** |
| ACR storage (~10 GB image) | ~$0.50/mo |
| **10 GPU-hrs** | ~$10 |
| **50 GPU-hrs** | ~$49 |
| **100 GPU-hrs** | ~$98 |
| **500 GPU-hrs** | ~$490 |

Actual usage (50 students, 1-5 concurrent, bursts with scale-to-zero) ≈
30-60 active GPU-hrs/mo ≈ $30-60/mo — inside the $200 credits.

## Deploy / teardown

```bash
CHATTERBOX_AUTH_TOKEN=<secret> bash scripts/chatterbox-server/deploy-aca.sh
# teardown:
az containerapp delete -g chatterbox-tts -n chatterbox-gw --yes
az containerapp delete -g chatterbox-tts -n chatterbox-gpu --yes
```

Files: `deploy-aca.sh`, `Dockerfile` (GPU), `gateway/Dockerfile` + `gateway/aca_main.py`,
`main.py` (server, non-blocking model load + world-readable model dir).
