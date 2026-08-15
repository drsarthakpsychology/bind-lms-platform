#!/usr/bin/env bash
# Chatterbox-Turbo server bootstrap — EC2 user-data for a g4dn.xlarge (T4)
# on the NVIDIA Deep Learning AMI (Ubuntu 22.04).
#
# Expected env provided by the launch script:
#   SERVER_B64    — base64 of scripts/chatterbox-server/main.py
#   CHATTERBOX_AUTH_TOKEN — the bearer token the LiveKit worker must send
#   CHATTERBOX_PORT        — default 4123
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
echo "=== chatterbox bootstrap start $(date -u) ===" > /tmp/chatterbox-boot.log

log() { echo "$@" >> /tmp/chatterbox-boot.log; }
{
  # 1. Verify the GPU (the DL AMI ships NVIDIA drivers + CUDA).
  nvidia-smi > /dev/null 2>&1 || log "WARN: nvidia-smi missing — check the AMI"

  # 2. Python 3.11 (chatterbox's tested version).
  if ! command -v python3.11 > /dev/null; then
    apt-get update -y
    apt-get install -y software-properties-common > /dev/null
    add-apt-repository -y ppa:deadsnakes/ppa > /dev/null
    apt-get install -y python3.11 python3.11-venv python3.11-dev > /dev/null
  fi

  # 3. venv + deps (CUDA 12.1 torch, matching the DL AMI).
  cd /opt
  rm -rf /opt/chatterbox-venv
  python3.11 -m venv /opt/chatterbox-venv
  # shellcheck disable=SC1091
  source /opt/chatterbox-venv/bin/activate
  pip install --upgrade pip > /dev/null
  pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
  pip install chatterbox-ng fastapi uvicorn huggingface-hub

  # 4. Pre-download the model (public repo; token=False avoids a token demand).
  MODEL_DIR=$(python - <<'PY'
from huggingface_hub import snapshot_download
print(snapshot_download(repo_id="ResembleAI/chatterbox-turbo", token=False))
PY
  )

  # 5. Write the server + env, then run it under systemd.
  mkdir -p /opt/chatterbox-server
  echo "${SERVER_B64}" | base64 -d > /opt/chatterbox-server/main.py
  cat > /opt/chatterbox-server/env <<ENV
CHATTERBOX_MODEL_DIR=${MODEL_DIR}
CHATTERBOX_AUTH_TOKEN=${CHATTERBOX_AUTH_TOKEN}
CHATTERBOX_CONCURRENCY=4
PORT=${CHATTERBOX_PORT}
ENV

  cat > /etc/systemd/system/chatterbox.service <<UNIT
[Unit]
Description=Chatterbox-Turbo OpenAI-compatible TTS
After=network-online.target
Wants=network-online.target

[Service]
WorkingDirectory=/opt/chatterbox-server
EnvironmentFile=/opt/chatterbox-server/env
ExecStart=/opt/chatterbox-venv/bin/uvicorn main:app --host 0.0.0.0 --port ${CHATTERBOX_PORT}
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT

  systemctl daemon-reload
  systemctl enable chatterbox
  systemctl start chatterbox
} >> /tmp/chatterbox-boot.log 2>&1

log "=== chatterbox bootstrap done $(date -u) ==="
