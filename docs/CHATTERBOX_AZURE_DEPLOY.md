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

## BLOCKED: ACA T4 CUDA compute hangs

The GPU container starts + `torch.cuda.is_available()` = True + reports
`Tesla T4`, and chatterbox imports — but `ChatterboxTurboTTS.from_local` never
completes (the model's `.to("cuda")` hangs; the container stays ready:false).
This is an ACA host-driver vs container-CUDA mismatch. Likely fixes (in order):

1. **Match the base image CUDA to the ACA T4 driver.** The image uses
   `nvidia/cuda:12.8.1-runtime`; if the ACA T4 host driver is older (12.4/12.2),
   cu128 kernels hang. Try `nvidia/cuda:12.4.1-runtime-ubuntu22.04` + torch
   `cu124` (needs an older torch that still has py3.14 wheels — torch 2.7/2.8).
2. **Use a Dockerfile with the ACA-recommended GPU base** (the ACA docs list a
   supported CUDA toolkit for GPU containers).
3. If neither works, raise an Azure support case for "T4 CUDA compute hangs in
   a Consumption-GPU container" — a known-area issue.

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
