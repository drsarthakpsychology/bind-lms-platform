#!/usr/bin/env bash
# GPU worker cloud-init (Azure) - NCasT4_v3. Installs the NVIDIA driver + CUDA
# torch + Chatterbox-Turbo + the OpenAI-compatible server, and self-deallocates
# after 15 min idle via its managed identity (safety net; the gateway is primary).
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
echo "=== gpu bootstrap start $(date -u) ===" > /tmp/gpu-boot.log
{
  apt-get update -y
  apt-get install -y ubuntu-drivers-common > /dev/null
  # NVIDIA driver for the T4 (recommended release ~535/550).
  ubuntu-drivers install 2>&1 | tail -2 || apt-get install -y nvidia-driver-535 > /dev/null

  # Python 3.11 (chatterbox's tested version).
  apt-get install -y software-properties-common > /dev/null
  add-apt-repository -y ppa:deadsnakes/ppa > /dev/null
  apt-get install -y python3.11 python3.11-venv python3.11-dev > /dev/null

  python3.11 -m venv /opt/cb-venv
  # shellcheck disable=SC1091
  source /opt/cb-venv/bin/activate
  pip install --upgrade pip > /dev/null
  pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
  pip install chatterbox-ng fastapi uvicorn huggingface-hub

  # Pre-download the model (public repo, token=False).
  MODEL_DIR=$(python - <<'PY'
from huggingface_hub import snapshot_download
print(snapshot_download(repo_id="ResembleAI/chatterbox-turbo", token=False))
PY
  )

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
ExecStart=/opt/cb-venv/bin/uvicorn main:app --host 0.0.0.0 --port ${CHATTERBOX_PORT}
Restart=on-failure
RestartSec=3
StandardOutput=append:/var/log/chatterbox.log
StandardError=append:/var/log/chatterbox.log

[Install]
WantedBy=multi-user.target
UNIT

  # Self-deallocate safety net via managed identity + ARM REST (no az CLI needed).
  cat > /opt/chatterbox-server/selfstop.sh <<'SELF'
#!/usr/bin/env bash
if [ -n "$(find /var/log/chatterbox.log -mmin +15 2>/dev/null)" ]; then
  TOKEN=$(curl -s 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com' -H "Metadata: true" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
  SUB=$(curl -s -H "Metadata: true" http://169.254.169.254/metadata/instance?api-version=2021-02-01 | sed -n 's/.*"subscriptionId":"\([^"]*\)".*/\1/p')
  RG=$(curl -s -H "Metadata: true" http://169.254.169.254/metadata/instance?api-version=2021-02-01 | sed -n 's/.*"resourceGroupName":"\([^"]*\)".*/\1/p')
  VM=$(hostname)
  curl -s -X POST "https://management.azure.com/subscriptions/$SUB/resourceGroups/$RG/providers/Microsoft.Compute/virtualMachines/$VM/deallocate?api-version=2023-03-01" \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" > /dev/null 2>&1 || true
fi
SELF
  chmod +x /opt/chatterbox-server/selfstop.sh
  cat > /etc/systemd/system/chatterbox-idle-stop.service <<IDLE
[Unit]
Description=Stop the GPU after 15 minutes idle
[Service]
Type=oneshot
ExecStart=/opt/chatterbox-server/selfstop.sh
IDLE
  cat > /etc/systemd/system/chatterbox-idle-stop.timer <<IDLE_T
[Unit]
Description=Check GPU idle every 10 minutes
[Timer]
OnBootSec=5min
OnUnitActiveSec=10min
[Install]
WantedBy=timers.target
IDLE_T

  systemctl daemon-reload
  systemctl enable chatterbox chatterbox-idle-stop.timer
  systemctl start chatterbox
  systemctl start chatterbox-idle-stop.timer
} >> /tmp/gpu-boot.log 2>&1
echo "=== gpu bootstrap done $(date -u) ===" >> /tmp/gpu-boot.log
