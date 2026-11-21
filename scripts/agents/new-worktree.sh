#!/usr/bin/env bash
# Make a worktree for one helper: ../wt-<name> on branch agent/<name>.
#
#   bash scripts/agents/new-worktree.sh <name> [base-branch]
#
# Run from the main checkout. Base defaults to the branch the main checkout is on.
# Shares the main checkout's installed packages (node_modules) by symlink, so
# nothing is installed. Local only: no fetch, no push.
set -eu
name="${1:-}"
case "$name" in
  ''|*[!a-z0-9-]*) echo "usage: new-worktree.sh <name: lowercase letters, digits, dashes> [base]" >&2; exit 2 ;;
esac
root="$(git rev-parse --show-toplevel)"
base="${2:-$(git -C "$root" branch --show-current)}"
dir="$(dirname "$root")/wt-$name"
branch="agent/$name"

if [ -e "$dir" ]; then echo "already exists: $dir" >&2; exit 1; fi
git -C "$root" worktree add -b "$branch" "$dir" "$base"

link() { # link <relative path>: share a dependency folder from the main checkout
  src="$(readlink -f "$root/$1" 2>/dev/null || true)"
  if [ -n "$src" ] && [ -d "$src" ] && [ ! -e "$dir/$1" ]; then ln -s "$src" "$dir/$1"; fi
}
link node_modules
link apps/mobile/node_modules

echo "worktree: $dir"
echo "branch:   $branch (from $base)"
