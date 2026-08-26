#!/usr/bin/env bash
# Deploy Chatterbox TTS to Azure - scale-to-zero (gateway + on-demand GPU).
#
#   - ONE always-on B1s gateway (Caddy HTTPS + the scale-to-zero manager)
#   - ONE NC4as_T4_v3 SPOT GPU, DEALLOCATED until a voice request arrives,
#     started by the gateway, deallocated after 8 min idle (+15 min self-stop).
#
# Idempotent: re-running reuses existing resources (same names).
#
# Prereqs: az login done + a subscription selected (default).
#   REGION  defaults to centralindia (has NC4as_T4_v3 with no restrictions).
set -euo pipefail

REGION="${REGION:-centralindia}"
RG="chatterbox-tts"
VNET="chatterbox-vnet"
SUBNET="chatterbox-subnet"
NSG="chatterbox-nsg"
GW_NAME="chatterbox-gateway"
GPU_NAME="chatterbox-gpu"
GW_SKUS="${GW_SKUS:-Standard_B1s Standard_B1ls Standard_B2s Standard_D2s_v3}"
GPU_SKU="${GPU_SKU:-Standard_NC4as_T4_v3}"
GPU_IP="10.0.0.4"   # static private IPs (free) so the gateway always finds the GPU
GW_IP="10.0.0.5"
PORT=4123
DNS_LABEL="${DNS_LABEL:-chatterbox-tts}"
SPOT_MAX_PRICE="${SPOT_MAX_PRICE:-0.30}"
AUTH_TOKEN="${CHATTERBOX_AUTH_TOKEN:-$(openssl rand -hex 24)}"
GATEWAY_DNS="${DNS_LABEL}.${REGION}.cloudapp.azure.com"

HERE="$(cd "$(dirname "$0")" && pwd)"
echo "=== Azure Chatterbox deploy @ ${REGION} (rg ${RG}) ==="
echo "GPU: ${GPU_SKU} SPOT (max \$${SPOT_MAX_PRICE}/hr, evict=Deallocate)"
echo "Gateway: small burstable, SKU fallback"
echo "CHATTERBOX_URL will be: https://${GATEWAY_DNS}"

SUB=$(az account show --query id -o tsv)

# ---- 1. Resource group (idempotent) ----
az group create --name "$RG" --location "$REGION" > /dev/null

# ---- 2. VNet + subnet + NSG (idempotent) ----
if ! az network vnet show -g "$RG" -n "$VNET" > /dev/null 2>&1; then
  az network vnet create -g "$RG" -n "$VNET" --address-prefix 10.0.0.0/16 \
    --subnet-name "$SUBNET" --subnet-prefix 10.0.0.0/24 > /dev/null
fi
if ! az network nsg show -g "$RG" -n "$NSG" > /dev/null 2>&1; then
  az network nsg create -g "$RG" -n "$NSG" --location "$REGION" > /dev/null
  # HTTPS (Caddy/LE validation) + SSH-from-this-IP to the gateway.
  az network nsg rule create -g "$RG" --nsg-name "$NSG" -n Allow443 \
    --priority 100 --direction Inbound --protocol Tcp --destination-port-ranges 443 \
    --access Allow --source-address-prefixes Internet --destination-address-prefixes '*' > /dev/null
  az network nsg rule create -g "$RG" --nsg-name "$NSG" -n Allow80 \
    --priority 110 --direction Inbound --protocol Tcp --destination-port-ranges 80 \
    --access Allow --source-address-prefixes Internet --destination-address-prefixes '*' > /dev/null
  MY_IP=$(curl -s https://checkip.amazonaws.com)
  az network nsg rule create -g "$RG" --nsg-name "$NSG" -n AllowSSH \
    --priority 120 --direction Inbound --protocol Tcp --destination-port-ranges 22 \
    --access Allow --source-address-prefixes "${MY_IP}/32" --destination-address-prefixes '*' > /dev/null
fi

# ---- 3. Cloud-init payloads (embed servers + env, substitute placeholders) ----
SERVER_B64=$(base64 < "${HERE}/main.py")
GATEWAY_B64=$(base64 < "${HERE}/gateway/azure_main.py")
render() { # $1=template → stdout
  HERE_PATH="$1" SERVER_B64="$SERVER_B64" GATEWAY_B64="$GATEWAY_B64" \
    CHATTERBOX_AUTH_TOKEN="$AUTH_TOKEN" CHATTERBOX_PORT="$PORT" \
    AZURE_SUBSCRIPTION_ID="$SUB" AZURE_RESOURCE_GROUP="$RG" \
    GPU_VM_NAME="$GPU_NAME" GPU_PRIVATE_IP="$GPU_IP" GATEWAY_DNS="$GATEWAY_DNS" \
    python3 -c '
import os, pathlib, sys
t = pathlib.Path(os.environ["HERE_PATH"]).read_text()
for k in ("SERVER_B64","GATEWAY_B64","CHATTERBOX_AUTH_TOKEN","CHATTERBOX_PORT","AZURE_SUBSCRIPTION_ID","AZURE_RESOURCE_GROUP","GPU_VM_NAME","GPU_PRIVATE_IP","GATEWAY_DNS"):
    t = t.replace("${" + k + "}", os.environ[k])
sys.stdout.write(t)
'
}
GPU_CI="$(mktemp)"; GW_CI="$(mktemp)"
trap 'rm -f "$GPU_CI" "$GW_CI"' EXIT
render "${HERE}/gpu-azure.sh" > "$GPU_CI"
render "${HERE}/gateway-azure.sh" > "$GW_CI"

# ---- 5. Create the gateway VM (always-on) ----
if ! az vm show -g "$RG" -n "$GW_NAME" > /dev/null 2>&1; then
  az network public-ip create -g "$RG" -n "${GW_NAME}-ip" --sku Standard --allocation-method Static \
    --dns-name "$DNS_LABEL" > /dev/null
  GW_SKU=""
  for sku in $GW_SKUS; do
    if az vm create -g "$RG" -n "$GW_NAME" \
      --image "Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest" \
      --size "$sku" --vnet-name "$VNET" --subnet "$SUBNET" --nsg "$NSG" \
      --public-ip-address "${GW_NAME}-ip" --private-ip-address "$GW_IP" \
      --admin-username azureuser --generate-ssh-keys \
      --assign-identity --custom-data "$GW_CI" --output none 2>/tmp/gw-create.err; then
      GW_SKU="$sku"; echo "gateway created with $sku"; break
    else
      echo "gateway SKU $sku failed (capacity) - trying next"; tail -1 /tmp/gw-create.err | head -c 120; echo
    fi
  done
  [ -z "$GW_SKU" ] && { echo "ERROR: no gateway SKU available"; exit 1; }
else
  echo "gateway exists - reusing"
fi

# ---- 6. Create the GPU VM (spot, no public IP, static private IP) ----
if ! az vm show -g "$RG" -n "$GPU_NAME" > /dev/null 2>&1; then
  az vm create -g "$RG" -n "$GPU_NAME" \
    --image "Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest" \
    --size "$GPU_SKU" --vnet-name "$VNET" --subnet "$SUBNET" --nsg "$NSG" \
    --private-ip-address "$GPU_IP" \
    --admin-username azureuser --generate-ssh-keys \
    --priority Spot --eviction-policy Deallocate --max-price "$SPOT_MAX_PRICE" \
    --assign-identity --custom-data "$GPU_CI" \
    --output none
else
  echo "gpu exists - reusing"
fi

# ---- 7. Role assignments (scoped to the GPU VM; idempotent) ----
VM_CONTRIBUTOR="b24988ac-6180-42a0-ab88-20f7382dd24c"
GPU_VM_ID="/subscriptions/${SUB}/resourceGroups/${RG}/providers/Microsoft.Compute/virtualMachines/${GPU_NAME}"
GW_PRINCIPAL=$(az vm show -g "$RG" -n "$GW_NAME" --query identity.principalId -o tsv)
GPU_PRINCIPAL=$(az vm show -g "$RG" -n "$GPU_NAME" --query identity.principalId -o tsv)
az role assignment create --assignee "$GW_PRINCIPAL" --role "$VM_CONTRIBUTOR" --scope "$GPU_VM_ID" > /dev/null 2>&1 || true
az role assignment create --assignee "$GPU_PRINCIPAL" --role "$VM_CONTRIBUTOR" --scope "$GPU_VM_ID" > /dev/null 2>&1 || true

# ---- 8. Wait for the GPU bootstrap (driver+model install), then deallocate ----
echo "=== waiting for the GPU to install (first boot only, ~10-15 min) ==="
for i in $(seq 1 40); do
  done_flag=$(az vm run-command invoke -g "$RG" -n "$GPU_NAME" \
    --command-id RunShellScript --scripts "grep -q 'gpu bootstrap done' /tmp/gpu-boot.log && echo READY || echo NOTYET" \
    --query 'value[0].message' -o tsv 2>/dev/null | tr -d '\r' | tail -1)
  if [ "$done_flag" = "READY" ]; then echo "GPU ready"; break; fi
  sleep 30
done
echo "=== deallocating GPU (scale-to-zero start state) ==="
az vm deallocate -g "$RG" -n "$GPU_NAME" > /dev/null

echo
echo "=== DEPLOYED (scale-to-zero) ==="
echo "resource group:  ${RG}  (${REGION})"
GW_ACTUAL=$(az vm show -g "$RG" -n "$GW_NAME" --query hardwareProfile.vmSize -o tsv 2>/dev/null)
echo "gateway:         ${GW_NAME} (${GW_ACTUAL}, always-on) -> https://${GATEWAY_DNS}"
echo "gpu:             ${GPU_NAME} (${GPU_SKU} SPOT, now DEALLOCATED)"
echo "auth token:      ${AUTH_TOKEN}"
echo
echo "Set in .env.local (then restart the worker):"
echo "  CHATTERBOX_URL=https://${GATEWAY_DNS}"
echo "  CHATTERBOX_API_KEY=${AUTH_TOKEN}"
echo
echo "Verify:  curl -sk https://${GATEWAY_DNS}/healthz"
echo "         curl -sk https://${GATEWAY_DNS}/status   (gpu: deallocated until first request)"
echo
echo "Teardown: ./scripts/chatterbox-server/destroy-azure.sh"
