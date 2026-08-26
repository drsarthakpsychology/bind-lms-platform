#!/usr/bin/env bash
# Teardown the Azure Chatterbox deployment (idempotent - safe to re-run).
set -euo pipefail
REGION="${REGION:-centralindia}"
RG="chatterbox-tts"
echo "=== Destroying Azure Chatterbox deployment (rg ${RG}) ==="
if az group show -g "$RG" > /dev/null 2>&1; then
  az group delete -g "$RG" --yes --no-wait
  echo "resource group ${RG} deletion started (all VMs, IPs, disks, NSGs, VNet go with it)"
else
  echo "nothing to destroy - resource group ${RG} does not exist"
fi
