#!/usr/bin/env bash
# Deploy the Chatterbox-Turbo server as ONE g4dn.xlarge SPOT instance.
#
# Prereqs:
#   - aws CLI configured with a working profile (AWS_PROFILE env if not default)
#   - Region defaults to ap-south-1 (Mumbai, nearest the LiveKit Cloud "India
#     South" region). Override: REGION=us-east-1 ./deploy.sh
#
# Emits the public IP + the exact CHATTERBOX_URL to set.
#
#   CHATTERBOX_AUTH_TOKEN=<secret> ./scripts/chatterbox-server/deploy.sh
set -euo pipefail

REGION="${REGION:-ap-south-1}"
PORT=4123
INSTANCE_TYPE="g4dn.xlarge"
# Spot max price = on-demand ceiling; you only PAY the current spot price.
MAX_SPOT_PRICE="${MAX_SPOT_PRICE:-0.74}"
AUTH_TOKEN="${CHATTERBOX_AUTH_TOKEN:-$(openssl rand -hex 24)}"

HERE="$(cd "$(dirname "$0")" && pwd)"

echo "=== Chatterbox deploy: ${INSTANCE_TYPE} spot @ ${REGION} ==="
echo "auth token: ${AUTH_TOKEN}"

# 1. Latest NVIDIA DL AMI (Ubuntu 22.04) for the region.
AMI=$(aws ec2 describe-images \
  --region "$REGION" \
  --owners amazon \
  --filters "Name=name,Values=Deep Learning Base OSS Nvidia Driver GPU AMI*Ubuntu 22.04*" \
  --query 'sort_by(Images, &CreationDate)[-1].ImageId' --output text)
echo "AMI: ${AMI}"
[ -z "${AMI}" ] && { echo "no DL AMI found; pass AMI=<id> explicitly"; exit 1; }

# 2. Security group: TTS port open (token-gated), SSH from this IP.
SG_NAME="chatterbox-tts-${REGION}"
SG_ID=$(aws ec2 describe-security-groups --region "$REGION" \
  --filters "Name=group-name,Values=${SG_NAME}" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)
MY_IP=$(curl -s https://checkip.amazonaws.com)
if [ -z "${SG_ID}" ] || [ "${SG_ID}" = "None" ]; then
  SG_ID=$(aws ec2 create-security-group --region "$REGION" \
    --group-name "${SG_NAME}" --description "Chatterbox TTS (token-gated) + SSH" \
    --query 'GroupId' --output text)
  aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_ID" \
    --ip-permissions \
    "IpProtocol=tcp,FromPort=${PORT},ToPort=${PORT},IpRanges=[{CidrIp=0.0.0.0/0}]" \
    "IpProtocol=tcp,FromPort=22,ToPort=22,IpRanges=[{CidrIp=${MY_IP}/32}]"
fi
echo "security group: ${SG_ID}"

# 3. Build user-data (embed the server + auth token). Substitute the three
#    placeholders with Python (envsubst isn't on macOS by default).
SERVER_B64=$(base64 < "${HERE}/main.py")
USERDATA=$(HERE_PATH="${HERE}/user-data.sh" SERVER_B64="${SERVER_B64}" \
  CHATTERBOX_AUTH_TOKEN="${AUTH_TOKEN}" CHATTERBOX_PORT="${PORT}" python3 -c '
import os, pathlib, sys
t = pathlib.Path(os.environ["HERE_PATH"]).read_text()
for k in ("SERVER_B64", "CHATTERBOX_AUTH_TOKEN", "CHATTERBOX_PORT"):
    t = t.replace("${" + k + "}", os.environ[k])
sys.stdout.write(t)
' | base64 | tr -d '\n')

# 4. Launch the spot instance.
INSTANCE_ID=$(aws ec2 run-instances \
  --region "$REGION" \
  --image-id "${AMI}" \
  --instance-type "${INSTANCE_TYPE}" \
  --security-group-ids "${SG_ID}" \
  --instance-market-options "MarketType=spot,SpotOptions={MaxPrice=${MAX_SPOT_PRICE},SpotInstanceType=one-time}" \
  --block-device-mappings "DeviceName=/dev/sda1,Ebs={VolumeSize=60,VolumeType=gp3}" \
  --user-data "${USERDATA}" \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=chatterbox-tts},{Key=Purpose,Value=ai-patient-voice}]" \
  --query 'Instances[0].InstanceId' --output text)
echo "instance: ${INSTANCE_ID}"
aws ec2 create-tags --region "$REGION" --resources "$INSTANCE_ID" \
  --tags "Key=Name,Value=chatterbox-tts" 2>/dev/null || true

echo "=== waiting for a public IP (spot can take a few minutes) ==="
PUBLIC_IP=""
for i in $(seq 1 30); do
  PUBLIC_IP=$(aws ec2 describe-instances --region "$REGION" --instance-ids "$INSTANCE_ID" \
    --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
  [ -n "${PUBLIC_IP}" ] && [ "${PUBLIC_IP}" != "None" ] && break
  sleep 10
done
[ -z "${PUBLIC_IP}" ] || [ "${PUBLIC_IP}" = "None" ] && { echo "no public IP yet; check the console"; exit 1; }

echo
echo "=== DEPLOYED ==="
echo "instance:  ${INSTANCE_ID}"
echo "public ip: ${PUBLIC_IP}"
echo "auth token: ${AUTH_TOKEN}"
echo
echo "Set in .env.local:"
echo "  CHATTERBOX_URL=http://${PUBLIC_IP}:${PORT}"
echo "  CHATTERBOX_API_KEY=${AUTH_TOKEN}"
echo
echo "Then restart the worker: npx tsx livekit-agent/agent.ts dev"
echo "Health check: curl http://${PUBLIC_IP}:${PORT}/healthz"
echo
echo "To STOP billing when done: aws ec2 stop-instances --instance-ids ${INSTANCE_ID}"
echo "To DESTROY:              aws ec2 terminate-instances --instance-ids ${INSTANCE_ID}"
