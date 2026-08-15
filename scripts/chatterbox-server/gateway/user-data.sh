#!/usr/bin/env bash
# Voice gateway bootstrap - a tiny always-on t3.nano running the scale-to-zero
# manager + OpenAI-compatible TTS proxy. Uses an IAM instance role (no secrets).
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
echo "=== gateway bootstrap start $(date -u) ===" > /tmp/gateway-boot.log
{
  apt-get update -y
  apt-get install -y python3-venv python3-pip > /dev/null
  python3 -m venv /opt/gw-venv
  # shellcheck disable=SC1091
  source /opt/gw-venv/bin/activate
  pip install --upgrade pip > /dev/null
  pip install fastapi uvicorn httpx boto3

  mkdir -p /opt/gateway
  echo "${GATEWAY_B64}" | base64 -d > /opt/gateway/main.py
  cat > /opt/gateway/env <<ENV
GPU_INSTANCE_ID=${GPU_INSTANCE_ID}
AWS_REGION=${CHATTERBOX_REGION}
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
ExecStart=/opt/gw-venv/bin/uvicorn main:app --host 0.0.0.0 --port ${CHATTERBOX_PORT}
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT
  systemctl daemon-reload
  systemctl enable voice-gateway
  systemctl start voice-gateway
} >> /tmp/gateway-boot.log 2>&1
echo "=== gateway bootstrap done $(date -u) ===" >> /tmp/gateway-boot.log
