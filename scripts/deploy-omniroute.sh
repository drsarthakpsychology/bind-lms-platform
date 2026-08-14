#!/usr/bin/env bash
# Deploy OmniRoute to Fly.io (always-on cloud gateway).
#
# The VIBHA app calls OmniRoute at $OMNIROUTE_URL (default localhost). Deploying
# to Fly gives a public URL (https://omniroute.fly.dev/v1) that works even when
# the laptop is closed — the gateway runs on Fly's always-on infra, not this
# machine.
#
# Prereq (one-time, interactive): flyctl auth login
#   — opens a browser to authenticate the Fly.io account. Only the account owner
#     can do this; it's the one human step.
#
# Then run this script:
#   bash scripts/deploy-omniroute.sh
#
# It clones the repo (or uses /tmp/OmniRoute if present), sets the VIBHA
# provider keys as Fly secrets, and deploys. The resulting public URL goes into
# .env.local as OMNIROUTE_URL.
set -euo pipefail

export PATH="$HOME/.fly/bin:$PATH"

APP="omniroute"
REPO="/tmp/OmniRoute"

echo "→ checking fly auth…"
flyctl auth whoami >/dev/null 2>&1 || {
  echo "✗ Not logged in. Run: flyctl auth login  (browser auth — one-time)"
  exit 1
}

if [ ! -d "$REPO/.git" ]; then
  echo "→ cloning OmniRoute…"
  git clone --depth 1 https://github.com/diegosouzapw/OmniRoute.git "$REPO"
fi
cd "$REPO"

echo "→ launching app $APP (creates if needed)…"
flyctl launch --name "$APP" --no-deploy --copy-config --yes 2>/dev/null || true

echo "→ setting VIBHA provider secrets…"
# The free no-train lanes OmniRoute should pool. Values come from .env.local.
set +e
for var in GROQ_API_KEY OPENROUTER_API_KEY OPENCODE_API_KEY DEEPSEEK_API_KEY; do
  val=$(grep -E "^${var}=" "/Users/kavyabothra/Downloads/plms (1)/.env.local" | cut -d= -f2- | tr -d '"')
  if [ -n "$val" ]; then
    echo "  setting $var…"
    echo "$val" | flyctl secrets set --app "$APP" "$var" 2>/dev/null || \
      flyctl secrets set "$var" 2>/dev/null
  fi
done
set -e

echo "→ deploying…"
flyctl deploy --app "$APP" --remote-only

echo ""
echo "✔ OmniRoute deployed. Public API:"
echo "  https://$APP.fly.dev/v1"
echo ""
echo "→ Point the VIBHA app at it (in .env.local):"
echo "  OMNIROUTE_URL=https://$APP.fly.dev/v1"
echo ""
echo "→ PRIVACY: in the OmniRoute dashboard (https://$APP.fly.dev), enable ONLY"
echo "  no-train upstreams (Groq, Cerebras, OpenRouter, DeepSeek) for student data."
