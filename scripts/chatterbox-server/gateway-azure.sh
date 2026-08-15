#!/usr/bin/env bash
# Gateway cloud-init (Azure) - a tiny always-on B1s running Caddy (auto-HTTPS)
# in front of the scale-to-zero gateway. Uses a managed identity (no secrets).
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
echo "=== gateway bootstrap start $(date -u) ===" > /tmp/gw-boot.log
{
  apt-get update -y
  apt-get install -y python3-venv python3-pip curl > /dev/null

  # Caddy (auto-HTTPS with Let's Encrypt for the cloudapp DNS name).
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https > /dev/null
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list > /dev/null
  apt-get update -y
  apt-get install -y caddy > /dev/null

  python3 -m venv /opt/gw-venv
  # shellcheck disable=SC1091
  source /opt/gw-venv/bin/activate
  pip install --upgrade pip > /dev/null
  pip install fastapi uvicorn httpx azure-identity azure-mgmt-compute

  mkdir -p /opt/gateway
  echo "${GATEWAY_B64}" | base64 -d > /opt/gateway/main.py
  cat > /opt/gateway/env <<ENV
AZURE_SUBSCRIPTION_ID=${AZURE_SUBSCRIPTION_ID}
AZURE_RESOURCE_GROUP=${AZURE_RESOURCE_GROUP}
GPU_VM_NAME=${GPU_VM_NAME}
GPU_PRIVATE_IP=${GPU_PRIVATE_IP}
CHATTERBOX_AUTH_TOKEN=${CHATTERBOX_AUTH_TOKEN}
GPU_PORT=${CHATTERBOX_PORT}
IDLE_SECONDS=480
ENV

  cat > /etc/systemd/system/voice-gateway.service <<UNIT
[Unit]
Description=Chatterbox voice gateway (scale-to-zero)
After=network-online.target
Wants=network-online.target

[Service]
WorkingDirectory=/opt/gateway
EnvironmentFile=/opt/gateway/env
ExecStart=/opt/gw-venv/bin/uvicorn main:app --host 127.0.0.1 --port ${CHATTERBOX_PORT}
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

  # Caddy: terminate HTTPS for the cloudapp DNS name, proxy to the gateway.
  cat > /etc/caddy/Caddyfile <<CADDY
${GATEWAY_DNS} {
  reverse_proxy 127.0.0.1:${CHATTERBOX_PORT}
  encode gzip
}
CADDY

  systemctl daemon-reload
  systemctl enable voice-gateway caddy
  systemctl start voice-gateway
  systemctl restart caddy
} >> /tmp/gw-boot.log 2>&1
echo "=== gateway bootstrap done $(date -u) ===" >> /tmp/gw-boot.log
