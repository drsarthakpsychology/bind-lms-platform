#!/usr/bin/env bash
# Heavy-check lock. Runs ONE heavy check at a time across every agent on this
# machine (about 7 GB shared), waiting its turn. Run it from your worktree root.
#
#   bash scripts/agents/gate.sh tsc                 # web type check
#   bash scripts/agents/gate.sh tsc-app             # mobile app type check
#   bash scripts/agents/gate.sh vitest <paths...>   # web unit/component tests
#   bash scripts/agents/gate.sh jest <paths...>     # mobile tests (runs in apps/mobile)
#   bash scripts/agents/gate.sh eslint <paths...>   # lint the given files
#   bash scripts/agents/gate.sh run <command...>    # any other heavy command
#
# Never run a full `next build` (it is denied in .claude/settings.json).
# Lock file: $VIBHA_CHECK_LOCK, default /tmp/vibha-heavy-check.lock. Every agent
# in a round must use the same lock file, so if some agents still use an older
# copy of this script, point VIBHA_CHECK_LOCK at that copy's lock file.
set -u
L="${VIBHA_CHECK_LOCK:-/tmp/vibha-heavy-check.lock}"
what="${1:-}"
[ $# -gt 0 ] && shift
case "$what" in
  tsc)     exec flock "$L" timeout 900 env NODE_OPTIONS=--max-old-space-size=3072 npx tsc --noEmit -p . ;;
  tsc-app) exec flock "$L" timeout 900 env NODE_OPTIONS=--max-old-space-size=3072 npx tsc --noEmit -p apps/mobile ;;
  vitest)  exec flock "$L" timeout 1500 npx vitest run --pool=forks --maxWorkers=2 "$@" ;;
  jest)    cd apps/mobile || exit 2; exec flock "$L" timeout 900 npx jest --forceExit "$@" ;;
  eslint)  exec flock "$L" timeout 900 npx eslint "$@" ;;
  run)     [ $# -gt 0 ] || { echo "gate.sh run needs a command" >&2; exit 2; }
           exec flock "$L" timeout 900 "$@" ;;
  *)       echo "usage: gate.sh tsc | tsc-app | vitest [paths] | jest [paths] | eslint <paths> | run <cmd...>" >&2; exit 2 ;;
esac
