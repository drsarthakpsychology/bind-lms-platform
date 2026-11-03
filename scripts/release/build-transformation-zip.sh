#!/usr/bin/env bash
# Build the reviewable release package for the VIBHA LMS transformation.
#
#   scripts/release/build-transformation-zip.sh [BASE] [OUT_DIR]
#
# BASE defaults to the commit the branch started from (2b42099 = main at the
# time). The ZIP contains: full copies of every changed/new file, a
# format-patch series, a file manifest with SHA-256 checksums, the docs, and
# the Claude Code integration prompt. It never includes .env files, secrets,
# node_modules, build caches, git internals or the source textbooks.
set -euo pipefail

BASE="${1:-2b42099}"
OUT_DIR="${2:-$(pwd)/release}"
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
HEAD_SHA="$(git rev-parse --short HEAD)"
NAME="vibha-lms-transformation"
STAGE="$(mktemp -d)/$NAME"
mkdir -p "$STAGE/files" "$STAGE/patches" "$OUT_DIR"

# Files changed between BASE and HEAD (added/modified/renamed; deletions listed separately).
mapfile -t CHANGED < <(git diff --name-only --diff-filter=AMR "$BASE" HEAD)
mapfile -t DELETED < <(git diff --name-only --diff-filter=D "$BASE" HEAD)

is_excluded() {
  case "$1" in
    .env|.env.*|*/.env|*/.env.*) return 0 ;;
    node_modules/*|.next/*|*/node_modules/*) return 0 ;;
    BOOKS/*|*.pdf|*.epub) return 0 ;;
    *.pem|*.key|*credentials*|*secret*) return 0 ;;
  esac
  return 1
}

: > "$STAGE/checksums.sha256"
{
  echo "# File manifest"
  echo
  echo "Base: \`$BASE\` · Head: \`$HEAD_SHA\` · Built: $(date -u +%Y-%m-%dT%H:%MZ)"
  echo
  echo "| Status | Path | Bytes |"
  echo "|---|---|---|"
} > "$STAGE/FILE_MANIFEST.md"

for f in "${CHANGED[@]}"; do
  if is_excluded "$f"; then echo "skip (excluded): $f" >&2; continue; fi
  mkdir -p "$STAGE/files/$(dirname "$f")"
  git show "HEAD:$f" > "$STAGE/files/$f"
  if git cat-file -e "$BASE:$f" 2>/dev/null; then status="modified"; else status="new"; fi
  size=$(wc -c < "$STAGE/files/$f")
  echo "| $status | \`$f\` | $size |" >> "$STAGE/FILE_MANIFEST.md"
  (cd "$STAGE" && sha256sum "files/$f" >> checksums.sha256)
done
for f in "${DELETED[@]}"; do
  echo "| deleted | \`$f\` | 0 |" >> "$STAGE/FILE_MANIFEST.md"
done

{
  echo
  echo "## Dependency and configuration changes"
  echo
  if git diff --quiet "$BASE" HEAD -- package.json package-lock.json; then
    echo "- \`package.json\` / \`package-lock.json\`: **unchanged** (no new dependencies)."
  else
    echo "- \`package.json\` changed:"; echo; echo '```diff'; git diff "$BASE" HEAD -- package.json; echo '```'
  fi
  for c in next.config.ts vercel.json tsconfig.json eslint.config.mjs vitest.config.mts playwright.config.ts; do
    if git diff --quiet "$BASE" HEAD -- "$c"; then echo "- \`$c\`: unchanged."; else echo "- \`$c\`: **changed** (see patch)."; fi
  done
  echo
  echo "## Database migrations"
  echo
  git diff --name-only --diff-filter=AMR "$BASE" HEAD -- 'supabase/**' 'src/migrations_pending/**' | sed 's/^/- `/; s/$/` (NOT applied anywhere; review before running on a non-production database first)/'
} >> "$STAGE/FILE_MANIFEST.md"

# Patch series (one file per commit) + one combined diff.
git format-patch -q "$BASE"..HEAD -o "$STAGE/patches"
git diff "$BASE" HEAD -- . ':(exclude)BOOKS' > "$STAGE/CHANGES.patch"

# Docs at the top level for quick reading.
for d in IMPLEMENTATION_SUMMARY.md TESTING_REPORT.md CLAUDE_CODE_INTEGRATION_PROMPT.md; do
  [ -f "docs/transformation/$d" ] && cp "docs/transformation/$d" "$STAGE/$d"
done

cat > "$STAGE/README.md" <<EOF
# VIBHA LMS transformation — release package

Proposed changes on top of \`main\` @ \`$BASE\` (branch \`feature/vibha-lms-transformation\` @ \`$HEAD_SHA\`).
This is a review package, **not** a drop-in copy. Start with:

1. \`IMPLEMENTATION_SUMMARY.md\` — what changed and why.
2. \`FILE_MANIFEST.md\` — every file, new or modified, plus dependency/config/migration notes.
3. \`TESTING_REPORT.md\` — what was tested, how, and what was not.
4. \`CLAUDE_CODE_INTEGRATION_PROMPT.md\` — paste into a new Claude Code session to integrate safely.

Contents: \`files/\` (full copies of changed files at their repo paths), \`patches/\` (git format-patch series,
apply with \`git am --3way patches/*.patch\`), \`CHANGES.patch\` (one combined diff), \`checksums.sha256\`
(verify with \`sha256sum -c checksums.sha256\`).

Excluded on purpose: .env files, keys, credentials, node_modules, build caches, git internals, the textbooks.
EOF

# Final secret scan of the staged package (fails the build on a hit).
if grep -rEn --exclude=checksums.sha256 '(sk_live_|sk-ant-|SUPABASE_SERVICE_ROLE_KEY=ey|-----BEGIN (RSA |EC )?PRIVATE KEY|AKIA[0-9A-Z]{16})' "$STAGE" ; then
  echo "Possible secret found in package; aborting." >&2
  exit 1
fi

(cd "$(dirname "$STAGE")" && rm -f "$OUT_DIR/$NAME.zip" && zip -qr "$OUT_DIR/$NAME.zip" "$NAME")
echo "Wrote $OUT_DIR/$NAME.zip ($(du -h "$OUT_DIR/$NAME.zip" | cut -f1)), ${#CHANGED[@]} changed files."
