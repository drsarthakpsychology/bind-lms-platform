#!/usr/bin/env bash
# make-offline-backup.sh
#
# Makes an offline copy of this repository in backup-out/ (git-ignored):
#   1. <name>.bundle      every branch and tag, full history (git bundle --branches --tags --remotes)
#   2. <name>-source.tar.gz  the current working tree: tracked files plus new
#                         files that are not ignored. No node_modules, no build
#                         output, no .env files (only .env.example is kept).
#   3. <name>.sha256      checksums of both files
#   4. <name>-manifest.txt  what was included and how to restore
# Then it checks the bundle with `git bundle verify` and checks that the
# tarball holds no env files.
#
# Usage (from anywhere inside the repo or a worktree):
#   bash scripts/make-offline-backup.sh
#
# Restore:
#   git clone backup-out/<name>.bundle restored-repo
#   cd restored-repo && git branch -a
# See docs/BACKUP.md.

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

OUT="$ROOT/backup-out"
mkdir -p "$OUT"

STAMP="$(date -u +%Y%m%d-%H%M%S)"
SHA="$(git rev-parse --short HEAD)"
NAME="vibha-lms-${STAMP}-${SHA}"
BUNDLE="$OUT/${NAME}.bundle"
TARBALL="$OUT/${NAME}-source.tar.gz"
LIST="$OUT/${NAME}-files.txt"
MANIFEST="$OUT/${NAME}-manifest.txt"

echo "Repository: $ROOT"
echo "Output:     $OUT"
echo

# 1. Git bundle with full history.
#    A shallow clone (like the one on the build machine) is missing old
#    commits, so a bundle made from it cannot be cloned. In that case the
#    script makes a temporary full mirror of GitHub (origin) in a temp folder,
#    adds the local branches that were never pushed under refs/heads/local/*,
#    and bundles that. The working repo itself is not changed.
#    Without a shallow clone it bundles every local branch, tag and
#    remote-tracking branch (origin/main is what is live) directly.
#    Low memory settings: this machine is shared.
echo "[1/4] Creating git bundle (all branches and tags, full history)..."
PACKOPTS=(-c pack.threads=1 -c pack.windowMemory=128m)
if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
  echo "This clone is shallow. Making a temporary full mirror from origin..."
  TMP="$(mktemp -d)"
  trap 'rm -rf "$TMP"' EXIT
  git clone --quiet --mirror "$(git remote get-url origin)" "$TMP/mirror.git"
  # Local branches (agent work not on GitHub yet) go in under local/<name>.
  git -C "$TMP/mirror.git" fetch --quiet "$ROOT" '+refs/heads/*:refs/heads/local/*' \
    || echo "Warning: could not add local branches; the bundle holds GitHub branches only."
  git -C "$TMP/mirror.git" "${PACKOPTS[@]}" bundle create "$BUNDLE" HEAD --branches --tags
  VERIFY_DIR="$TMP/mirror.git"
else
  git "${PACKOPTS[@]}" bundle create "$BUNDLE" HEAD --branches --tags --remotes
  VERIFY_DIR="$ROOT"
fi
echo

# 2. Source tarball of the current tree.
#    git ls-files: tracked files (-c) plus untracked files that are not ignored
#    (-o --exclude-standard). Ignored paths (node_modules, .next, .env.local,
#    backup-out itself) never appear. Env files are removed explicitly as a
#    second guard, except the empty template .env.example.
echo "[2/4] Creating source tarball (no ignored files, no env files)..."
git ls-files -co --exclude-standard -z \
  | tr '\0' '\n' \
  | grep -vE '(^|/)\.env($|\.)' \
  | grep -vE '^backup-out/' \
  > "$LIST.tmp" || true
# Keep the template.
if [ -f .env.example ]; then echo ".env.example" >> "$LIST.tmp"; fi
# Only files that exist (a deleted-but-tracked file would break tar).
while IFS= read -r f; do [ -f "$f" ] && printf '%s\n' "$f"; done < "$LIST.tmp" | sort -u > "$LIST"
rm -f "$LIST.tmp"
tar -czf "$TARBALL" -T "$LIST"
echo

# 3. Checks.
echo "[3/4] Verifying..."
git -C "$VERIFY_DIR" bundle verify --quiet "$BUNDLE"
echo "git bundle verify: ok"
# A real restore test: clone the bundle into a throwaway folder.
RESTORE="$(mktemp -d)"
git clone --quiet "$BUNDLE" "$RESTORE/repo"
echo "Test restore: ok ($(git -C "$RESTORE/repo" branch -r | wc -l | tr -d ' ') branches, $(git -C "$RESTORE/repo" rev-list --all --count) commits, oldest $(git -C "$RESTORE/repo" log --all --reverse --format=%cs | head -1))"
rm -rf "$RESTORE"
if tar -tzf "$TARBALL" | grep -E '(^|/)\.env($|\.)' | grep -vE '(^|/)\.env\.example$' >/dev/null; then
  echo "ERROR: an env file ended up in the tarball. Delete $TARBALL." >&2
  exit 1
fi
if tar -tzf "$TARBALL" | grep -E '^(node_modules|\.next)/' >/dev/null; then
  echo "ERROR: node_modules or .next ended up in the tarball." >&2
  exit 1
fi
echo "Tarball holds no env files, node_modules or build output."
echo

# 4. Checksums and manifest.
echo "[4/4] Writing checksums and manifest..."
( cd "$OUT" && sha256sum "$(basename "$BUNDLE")" "$(basename "$TARBALL")" > "${NAME}.sha256" )
{
  echo "VIBHA School of Psychology LMS: offline backup"
  echo "Made (UTC):      $STAMP"
  echo "From commit:     $(git rev-parse HEAD)"
  echo "Current branch:  $(git rev-parse --abbrev-ref HEAD)"
  echo "Refs in bundle:  $(git bundle list-heads "$BUNDLE" | wc -l | tr -d ' ')"
  echo "Tags:            $(git tag | wc -l | tr -d ' ')"
  echo "Files in tarball: $(wc -l < "$LIST" | tr -d ' ')"
  echo
  echo "Bundle:  $(basename "$BUNDLE")  ($(du -h "$BUNDLE" | cut -f1))"
  echo "Tarball: $(basename "$TARBALL")  ($(du -h "$TARBALL" | cut -f1))"
  echo
  echo "Not included: secrets and .env files, node_modules, .next build output,"
  echo "anything in .gitignore, database rows, Supabase Storage files, R2 videos and books."
  echo
  echo "Restore the full history:"
  echo "  git clone $(basename "$BUNDLE") vibha-lms"
  echo "Check the files:"
  echo "  sha256sum -c ${NAME}.sha256"
} > "$MANIFEST"

echo
echo "Done."
ls -lh "$OUT" | grep "$NAME"
