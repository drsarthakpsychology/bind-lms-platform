#!/usr/bin/env bash
# Scale-to-zero Chatterbox deploy: ONE tiny always-on gateway (t3.nano) that
# wakes ONE g4dn.xlarge SPOT GPU on demand and stops it when idle.
#
#   no voice users  → gateway only (~$4/mo), GPU stopped ($0 while stopped)
#   voice starts    → gateway starts the GPU; first turn falls back to the
#                     worker's natural Cartesia voice while it warms (~2-3 min)
#   voice ends      → GPU stops after 20 min idle (gateway + a self-stop timer)
#
# Prereqs: aws CLI + a working profile (AWS_PROFILE if not default).
#   REGION defaults to ap-south-1 (Mumbai, nearest LiveKit Cloud India South).
#   CHATTERBOX_AUTH_TOKEN defaults to a generated secret.
set -euo pipefail

REGION="${REGION:-ap-south-1}"
PORT=4123
GPU_TYPE="g4dn.xlarge"
GATEWAY_TYPE="t3.nano"
MAX_SPOT_PRICE="${MAX_SPOT_PRICE:-0.74}"
AUTH_TOKEN="${CHATTERBOX_AUTH_TOKEN:-$(openssl rand -hex 24)}"
TAG="Name=chatterbox-tts"

HERE="$(cd "$(dirname "$0")" && pwd)"
GPU_USERDATA_TMP="$(mktemp)"
GW_USERDATA_TMP="$(mktemp)"
trap 'rm -f "$GPU_USERDATA_TMP" "$GW_USERDATA_TMP"' EXIT

echo "=== Chatterbox scale-to-zero deploy: ${GATEWAY_TYPE} gateway + ${GPU_TYPE} spot @ ${REGION} ==="

# ---- 1. IAM roles (instance profiles — no secrets on disk) ----
ROLE_GW="chatterbox-gateway-role"
ROLE_GPU="chatterbox-gpu-role"

aws iam create-role --role-name "$ROLE_GW" --region "$REGION" \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}' > /dev/null 2>&1 || true
aws iam create-role --role-name "$ROLE_GPU" --region "$REGION" \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}' > /dev/null 2>&1 || true

# Gateway: describe all, start/stop only the tagged chatterbox-tts instance.
aws iam put-role-policy --role-name "$ROLE_GW" --region "$REGION" \
  --policy-name voice-scale \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["ec2:DescribeInstances","ec2:DescribeInstanceStatus"],"Resource":"*"},{"Effect":"Allow","Action":["ec2:StartInstances","ec2:StopInstances"],"Resource":"arn:aws:ec2:*:*:instance/*","Condition":{"StringEquals":{"aws:ResourceTag/Name":"chatterbox-tts"}}}]}' > /dev/null 2>&1 || true

# GPU: stop itself when idle.
aws iam put-role-policy --role-name "$ROLE_GPU" --region "$REGION" \
  --policy-name self-stop \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["ec2:StopInstances"],"Resource":"arn:aws:ec2:*:*:instance/*","Condition":{"StringEquals":{"aws:ResourceTag/Name":"chatterbox-tts"}}}]}' > /dev/null 2>&1 || true

for R in "$ROLE_GW" "$ROLE_GPU"; do
  aws iam create-instance-profile --instance-profile-name "$R" --region "$REGION" > /dev/null 2>&1 || true
  aws iam add-role-to-instance-profile --instance-profile-name "$R" --role-name "$R" --region "$REGION" > /dev/null 2>&1 || true
done

# ---- 2. Security groups ----
# Gateway: TTS port open (token-gated) + SSH from this IP. GPU: TTS port only
# reachable from the gateway's SG.
MY_IP=$(curl -s https://checkip.amazonaws.com)
SG_GW=$(aws ec2 describe-security-groups --region "$REGION" --filters "Name=group-name,Values=chatterbox-gateway" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)
[ -z "${SG_GW}" ] || [ "${SG_GW}" = "None" ] && SG_GW=$(aws ec2 create-security-group --region "$REGION" --group-name chatterbox-gateway --description "voice gateway" --query 'GroupId' --output text)
aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_GW" --ip-permissions \
  "IpProtocol=tcp,FromPort=${PORT},ToPort=${PORT},IpRanges=[{CidrIp=0.0.0.0/0}]" \
  "IpProtocol=tcp,FromPort=22,ToPort=22,IpRanges=[{CidrIp=${MY_IP}/32}]" > /dev/null 2>&1 || true

SG_GPU=$(aws ec2 describe-security-groups --region "$REGION" --filters "Name=group-name,Values=chatterbox-gpu" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)
[ -z "${SG_GPU}" ] || [ "${SG_GPU}" = "None" ] && SG_GPU=$(aws ec2 create-security-group --region "$REGION" --group-name chatterbox-gpu --description "chatterbox gpu" --query 'GroupId' --output text)
aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_GPU" \
  --ip-permissions "IpProtocol=tcp,FromPort=${PORT},ToPort=${PORT},UserIdGroupPairs=[{GroupId=${SG_GW}}]" > /dev/null 2>&1 || true

# ---- 3. AMIs ----
GPU_AMI=$(aws ec2 describe-images --region "$REGION" --owners amazon \
  --filters "Name=name,Values=Deep Learning Base OSS Nvidia Driver GPU AMI*Ubuntu 22.04*" \
  --query 'sort_by(Images, &CreationDate)[-1].ImageId' --output text)
GW_AMI=$(aws ec2 describe-images --region "$REGION" --owners amazon \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-noble-24.04-amd64-server-*" \
  --query 'sort_by(Images, &CreationDate)[-1].ImageId' --output text)
[ -z "${GPU_AMI}" ] && GPU_AMI="${AMI:?set AMI=<gpu-ami> if auto-find fails}"
[ -z "${GW_AMI}" ] && GW_AMI="${GW_AMI_FALLBACK:?set GW_AMI=... if auto-find fails}"

# ---- 4. User-data renderer (embeds servers + env, substitutes placeholders) ----
SERVER_B64=$(base64 < "${HERE}/main.py")
GATEWAY_B64=$(base64 < "${HERE}/gateway/main.py")
render() {  # $1=template → stdout
  HERE_PATH="$1" SERVER_B64="$SERVER_B64" GATEWAY_B64="$GATEWAY_B64" \
    GPU_INSTANCE_ID="${GPU_INSTANCE_ID:-}" CHATTERBOX_AUTH_TOKEN="$AUTH_TOKEN" \
    CHATTERBOX_PORT="$PORT" CHATTERBOX_REGION="$REGION" python3 -c '
import os, pathlib, sys
t = pathlib.Path(os.environ["HERE_PATH"]).read_text()
for k in ("SERVER_B64", "GATEWAY_B64", "GPU_INSTANCE_ID", "CHATTERBOX_AUTH_TOKEN", "CHATTERBOX_PORT", "CHATTERBOX_REGION"):
    t = t.replace("${" + k + "}", os.environ[k])
sys.stdout.write(t)
'
}

# ---- 5. Launch the GPU first (the gateway needs its id) ----
echo "launching GPU (${GPU_TYPE} spot)…"
render "${HERE}/user-data.sh" > "$GPU_USERDATA_TMP"
GPU_ID=$(aws ec2 run-instances --region "$REGION" \
  --image-id "${GPU_AMI}" --instance-type "${GPU_TYPE}" \
  --security-group-ids "${SG_GPU}" --iam-instance-profile "Name=${ROLE_GPU}" \
  --instance-market-options "MarketType=spot,SpotOptions={MaxPrice=${MAX_SPOT_PRICE},SpotInstanceType=one-time}" \
  --block-device-mappings "DeviceName=/dev/sda1,Ebs={VolumeSize=60,VolumeType=gp3}" \
  --user-data "file://${GPU_USERDATA_TMP}" \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=chatterbox-tts},{Key=Purpose,Value=ai-patient-voice}]" \
  --query 'Instances[0].InstanceId' --output text)
GPU_INSTANCE_ID="$GPU_ID"
echo "GPU: ${GPU_ID} (will be stopped — the gateway starts it on demand)"

# ---- 6. Launch the gateway (always-on) — now that GPU_INSTANCE_ID is known ----
echo "launching gateway (${GATEWAY_TYPE})…"
render "${HERE}/gateway/user-data.sh" > "$GW_USERDATA_TMP"
GW_ID=$(aws ec2 run-instances --region "$REGION" \
  --image-id "${GW_AMI}" --instance-type "${GATEWAY_TYPE}" \
  --security-group-ids "${SG_GW}" --iam-instance-profile "Name=${ROLE_GW}" \
  --block-device-mappings "DeviceName=/dev/sda1,Ebs={VolumeSize=8,VolumeType=gp3}" \
  --user-data "file://${GW_USERDATA_TMP}" \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=chatterbox-gateway},{Key=Purpose,Value=ai-patient-voice}]" \
  --query 'Instances[0].InstanceId' --output text)

# ---- 7. Allocate an EIP for the gateway (stable CHATTERBOX_URL) ----
EIP=$(aws ec2 allocate-address --region "$REGION" --domain vpc --query 'AllocationId' --output text)
for i in $(seq 1 30); do
  STATE=$(aws ec2 describe-instances --region "$REGION" --instance-ids "$GW_ID" --query 'Reservations[0].Instances[0].State.Name' --output text)
  [ "${STATE}" = "running" ] && break
  sleep 5
done
aws ec2 associate-address --region "$REGION" --allocation-id "$EIP" --instance-id "$GW_ID" > /dev/null
GW_IP=$(aws ec2 describe-addresses --region "$REGION" --allocation-ids "$EIP" --query 'Addresses[0].PublicIp' --output text)

echo
echo "=== DEPLOYED (scale-to-zero) ==="
echo "gateway:  ${GW_ID}  @ ${GW_IP}   (t3.nano, always-on, ~\$4/mo)"
echo "gpu:      ${GPU_ID}  (${GPU_TYPE} spot — started on demand by the gateway, self-stops idle)"
echo "auth:     ${AUTH_TOKEN}"
echo
echo "Set in .env.local (then restart the worker):"
echo "  CHATTERBOX_URL=http://${GW_IP}:${PORT}"
echo "  CHATTERBOX_API_KEY=${AUTH_TOKEN}"
echo
echo "Verify:  curl http://${GW_IP}:${PORT}/healthz   (gateway up)"
echo "         curl http://${GW_IP}:${PORT}/status     (gpu state: stopped until first request)"
echo
echo "Cold start: first voice request wakes the GPU (~2-3 min); that first turn"
echo "is served by the worker's Cartesia fallback so the student hears a natural"
echo "voice immediately. Later turns use Chatterbox."
echo
echo "Teardown (stops all billing):"
echo "  aws ec2 terminate-instances --instance-ids ${GW_ID} ${GPU_ID}"
echo "  aws ec2 release-address --allocation-id ${EIP}"
