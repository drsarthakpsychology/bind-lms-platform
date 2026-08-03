#!/usr/bin/env bash
# scan-secrets.sh — grep-based secrets detector. Always available (no deps).
# Uses:  bash scan-secrets.sh [path]
# Flags any secret that is client-visible or hardcoded. Any NEXT_PUBLIC_ secret
# is inlined into the client bundle at build time (compromised by definition).
set -uo pipefail

ROOT="${1:-.}"
found=0

echo "== Secrets scan on $ROOT =="
echo "-- Client-exposed NEXT_PUBLIC_ secrets (compromised) --"
grep -rnE "NEXT_PUBLIC_.*(SECRET|KEY|TOKEN|PASSWORD)" "$ROOT" --include='*.env*' --include='*.ts' --include='*.tsx' --include='*.js' 2>/dev/null && found=1 || echo "  none"

echo "-- service_role / server keys (must be server-only) --"
grep -rlE "service_role|SERVICE_ROLE|sk_live|sk-[A-Za-z0-9]{20,}" "$ROOT" \
  --include='*.ts' --include='*.tsx' --include='*.js' --include='*.env*' 2>/dev/null && found=1 || echo "  none"

echo ""
echo "-- Hardcoded credential-like strings --"
grep -rnE "(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*['\"][A-Za-z0-9_\-]{12,}['\"]" "$ROOT" \
  --include='*.ts' --include='*.tsx' --include='*.js' --include='*.py' --include='*.env*' 2>/dev/null | grep -v node_modules | head -30 && found=1 || echo "  none"

if [ "$found" -eq "0" ]; then
  echo ""
  echo "No high-confidence secrets found by grep."
else
  echo ""
  echo "NOTICE: grep is coarse. If gitleaks/trufflehog are installed, run them for confirmation."
fi
exit 0