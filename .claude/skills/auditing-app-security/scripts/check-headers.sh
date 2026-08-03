#!/usr/bin/env bash
# check-headers.sh — security-header audit via curl.
# Uses:  bash check-headers.sh <url>
# Degrades gracefully if curl is absent (lists manual step).
set -uo pipefail

URL="${1:-}"
if [ -z "$URL" ]; then
  echo "usage: check-headers.sh <url>"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl not available. Manually run: curl -sI '$URL' and compare headers."
  exit 0
fi

echo "== Security headers for $URL =="
headers="$(curl -sI --max-time 15 "$URL")"
if [ -z "$headers" ]; then
  echo "  (no headers returned — host unreachable or empty)"
  exit 0
fi
echo "$headers" | tr -d '\r' | sed 's/^/  /'

echo ""
echo "== Checks =="
wanted=(
  "Strict-Transport-Security:max-age"
  "X-Frame-Options:DENY"
  "X-Content-Type-Options:nosniff"
  "Referrer-Policy:"
  "Permissions-Policy:"
  "Content-Security-Policy:"
)
for pair in "${wanted[@]}"; do
  name="${pair%%:*}"; probe="${pair#*:}"
  if echo "$headers" | tr -d '\r' | grep -qi "^${name}:"; then
    echo "  ✓ $name present"
  else
    echo "  ✗ $name MISSING"
  fi
done
echo ""
echo "  Note: 'Access-Control-Allow-Origin: *' with no auth context is a flag."
if echo "$headers" | tr -d '\r' | grep -qi "Access-Control-Allow-Origin: \*"; then
  echo "  ✗ ACAO: * present (permissive CORS — confirm no sensitive endpoints depend on it)"
fi
exit 0