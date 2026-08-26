#!/usr/bin/env bash
# Deploy Chatterbox TTS to Azure Container Apps - Consumption GPU T4, scale-to-zero.
#
#   GPU app (chatterbox-gpu):  Consumption-GPU-NC8as-T4 workload profile,
#                              min-replicas 0 (scale-to-zero), max 3.
#   Gateway (chatterbox-gw):   tiny CPU app, always-on (min 1), owns the stable
#                              CHATTERBOX_URL, proxies to the GPU app, 503s while
#                              it cold-starts (worker falls back to Cartesia).
#
# Prereqs: az login + subscription set. Region = australiaeast (ACA T4 GPU).
set -euo pipefail

REGION="${REGION:-australiaeast}"
RG="chatterbox-tts"
ENV="cb-aca-env"
ACR="chatterboxttsae"
GPU_APP="chatterbox-gpu"
GW_APP="chatterbox-gw"
GPU_PROFILE="gpu-t4"
AUTH_TOKEN="${CHATTERBOX_AUTH_TOKEN:-$(openssl rand -hex 24)}"

ACR_PASS=$(az acr credential show --name "$ACR" --query 'passwords[0].value' -o tsv)

echo "=== ACA Chatterbox deploy @ ${REGION} ==="
echo "GPU: Consumption-GPU-NC8as-T4 (T4, scale-to-zero)"
echo "gateway: tiny CPU, always-on"
echo "auth token: ${AUTH_TOKEN}"

# ---- 1. GPU app (scale-to-zero, T4) ----
if ! az containerapp show -g "$RG" -n "$GPU_APP" > /dev/null 2>&1; then
  az containerapp create -g "$RG" -n "$GPU_APP" --environment "$ENV" \
    --image "${ACR}.azurecr.io/chatterbox:latest" \
    --registry-server "${ACR}.azurecr.io" --registry-username "$ACR" --registry-password "$ACR_PASS" \
    --workload-profile-name "$GPU_PROFILE" \
    --min-replicas 0 --max-replicas 3 \
    --target-port 4123 --ingress external \
    --secrets "cb-auth=${AUTH_TOKEN}" \
    --env-vars "CHATTERBOX_AUTH_TOKEN=secretref:cb-auth" "CHATTERBOX_CONCURRENCY=4" "CHATTERBOX_MODEL_DIR=/opt/chatterbox-model" \
    --scale-rule-name http --scale-rule-type http --scale-rule-http-concurrency 5 \
    --output none
  echo "GPU app created"
else
  echo "GPU app exists - reusing"
fi

# ---- 2. Gateway app (tiny CPU, always-on, stable CHATTERBOX_URL) ----
if ! az containerapp show -g "$RG" -n "$GW_APP" > /dev/null 2>&1; then
  az containerapp create -g "$RG" -n "$GW_APP" --environment "$ENV" \
    --image "${ACR}.azurecr.io/gateway:latest" \
    --registry-server "${ACR}.azurecr.io" --registry-username "$ACR" --registry-password "$ACR_PASS" \
    --cpu 0.25 --memory 0.5Gi \
    --min-replicas 1 --max-replicas 1 \
    --target-port 4123 --ingress external \
    --secrets "cb-auth=${AUTH_TOKEN}" \
    --env-vars "CHATTERBOX_AUTH_TOKEN=secretref:cb-auth" "GPU_APP_URL=http://${GPU_APP}" "GPU_PORT=4123" "WARM_TIMEOUT=8" \
    --output none
  echo "gateway app created"
else
  echo "gateway app exists - reusing"
fi

GW_URL=$(az containerapp show -g "$RG" -n "$GW_APP" --query 'properties.configuration.ingress.fqdn' -o tsv 2>/dev/null)
GPU_URL=$(az containerapp show -g "$RG" -n "$GPU_APP" --query 'properties.configuration.ingress.fqdn' -o tsv 2>/dev/null)

echo
echo "=== DEPLOYED (scale-to-zero) ==="
echo "gateway:  https://${GW_URL}"
echo "gpu app:  https://${GPU_URL} (scale-to-zero; cold ~60-90s, Cartesia covers it)"
echo
echo "Set in .env.local (then restart the worker):"
echo "  CHATTERBOX_URL=https://${GW_URL}"
echo "  CHATTERBOX_API_KEY=${AUTH_TOKEN}"
echo
echo "Verify:  curl -s https://${GW_URL}/healthz"
echo "Teardown: az containerapp delete -g ${RG} -n ${GW_APP} --yes; az containerapp delete -g ${RG} -n ${GPU_APP} --yes"
