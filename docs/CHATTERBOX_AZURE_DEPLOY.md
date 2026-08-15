# Chatterbox TTS on Azure — scale-to-zero (port of the AWS design)

_2026-08-15 · Pivot from AWS. Same architecture: a stable gateway + a GPU that
is DEALLOCATED until a voice request arrives, started on demand, deallocated
after 8 min idle. All secrets via env + managed identities (none in git)._

## Architecture (identical shape to the AWS plan, Azure-native)

```
Student → LiveKit → AI patient engine → Groq LLM → Chatterbox TTS → back
                                                  │
   ┌───────────── ALWAYS-ON gateway (B1s, Caddy HTTPS, managed identity)
   │   owns CHATTERBOX_URL · starts the GPU on request · deallocates after 8 min idle
   ▼
   ┌───────────── ONE NC4as_T4_v3 SPOT GPU (T4 16 GB) — DEALLOCATED when idle
   │   boots ~5-10 min cold; first turn served by the worker's Cartesia fallback
   └───────────── Chatterbox-Turbo + OpenAI-compatible server (private IP only)
```

- **No voice users → no GPU billing.** The gateway (B1s ~$0.011/hr) is the only
  always-on cost (~$10/mo incl. disk + a Standard public IP ~$3.6/mo).
- **GPU cold start is invisible:** the worker's `tts.FallbackAdapter` serves the
  natural Cartesia voice for the first turn while the GPU warms; Chatterbox
  takes over from the next turn.
- **GPU never exposed** — it has a static private IP + no public IP; the gateway
  proxies over the VNet. NSG allows only HTTPS (80/443) + SSH-from-your-IP to
  the gateway; the GPU subnet is reachable only from the gateway.
- **Self-deallocates** after 15 min idle via its own managed identity (safety
  net) + the gateway's 8-min idle timer (primary).

## Region / SKU (discovered via CLI)

| Item | Choice | Why |
|---|---|---|
| Region | centralindia (Pune) | Nearest Azure region to LiveKit Cloud (India South); NC4as_T4_v3 listed with no restrictions |
| GPU | NC4as_T4_v3 (4 vCPU, 1× T4 16 GB) | Smallest/cheapest T4; fits Chatterbox-Turbo (4-6 GB VRAM) |
| GPU spot | ~$0.17/hr | ~22% of the $0.76/hr on-demand |
| Gateway | B1s (or B1ls/B2s fallback) | Tiny always-on proxy |

## Cost model (Free Trial → after upgrade)

| Item | Cost |
|---|---|
| Gateway VM (B1s, always-on) | ~$0.011/hr ≈ $8/mo |
| Gateway Standard public IP | ~$3.6/mo |
| GPU (NC4as_T4_v3 spot) | ~$0.17/hr while running, **$0 while deallocated** (disk ~$4/mo persists) |
| GPU usage estimate | ~85 GPU-hrs/mo (50 students, 1-5 concurrent, bursts) ≈ $14/mo spot |
| **3-month total** | ~**$110** of the $200 credits (gateway ~$35 + GPU ~$45 + disk ~$12 + margin) |

## Status: BLOCKED on the subscription offer

The Azure subscription is a **Free Trial** offer (`FreeTrial_2014-09-01`). Free
Trial blocks GPU VMs — the T4 create fails with `ResourceNotAvailableForOffer`,
and even basic B-series VMs fail with capacity restrictions. The quota is 4
regional vCPUs / 3 spot vCPUs, and GPU-family quota increases also fail
(`ResourceNotAvailableForOffer`).

**The one action required: upgrade the subscription from Free Trial to
Pay-As-You-Go** (portal → subscription → "Azure subscription 1" → Upgrade).
This unlocks GPU VMs + larger quota; the $200 credits still apply to usage. The
deploy scripts below re-run idempotently the moment the upgrade lands.

## Deploy (ready to run)

```bash
# after the Free Trial → PAYG upgrade
CHATTERBOX_AUTH_TOKEN=<secret> REGION=centralindia ./scripts/chatterbox-server/deploy-azure.sh
# prints CHATTERBOX_URL → set in .env.local, restart the worker
./scripts/chatterbox-server/destroy-azure.sh   # teardown
```

Files: `deploy-azure.sh`, `gateway-azure.sh`, `gpu-azure.sh`, `destroy-azure.sh`,
`gateway/azure_main.py` (managed-identity scale-to-zero manager).

## Cost protection

- GPU is **spot + eviction-policy Deallocate**, max price $0.30/hr.
- GPU **deallocates after 8 min idle** (gateway) + self-deallocate safety net.
- Recommend an Azure budget alert ($20/$50) once the upgrade lands.
- Nothing bills while the GPU is deallocated except its ~$4/mo disk.
