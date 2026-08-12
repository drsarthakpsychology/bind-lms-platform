#!/usr/bin/env bash
# The Stop hook stops Claude ending its TURN.
# This loop stops the SESSION ending — rate limits, API errors, crashes,
# network drops, laptop sleep. A hook cannot save a dead process; this can.
#
#   Start:  ./run-all-night.sh
#   Stop:   touch STOP_CLAUDE

set -uo pipefail
cd "$(dirname "$0")" || exit 1

LOG="night-runner.log"
MAX_RESTARTS=200
RESTART=0
FIRST=1
ts() { date '+%Y-%m-%dT%H:%M:%S'; }

printf '=== run-all-night started %s ===\n' "$(ts)" | tee -a "$LOG"
rm -f STOP_CLAUDE .claude/.continue_count

BRIEFS=""
[ -f BRIEF_V5_MASTER.md ]     && BRIEFS="$BRIEFS BRIEF_V5_MASTER.md"
[ -f BRIEF_ADDENDUM.md ] && BRIEFS="$BRIEFS BRIEF_ADDENDUM.md"

if [ -z "$BRIEFS" ]; then
  printf 'ERROR: no brief files found at repo root. Add BRIEF_V5_MASTER.md first.\n' | tee -a "$LOG"
  exit 1
fi

while [ "$RESTART" -lt "$MAX_RESTARTS" ]; do
  if [ -f STOP_CLAUDE ]; then
    printf '[%s] STOP_CLAUDE found. Exiting.\n' "$(ts)" | tee -a "$LOG"; break
  fi

  RESTART=$((RESTART + 1))
  printf '[%s] --- launch #%s ---\n' "$(ts)" "$RESTART" | tee -a "$LOG"

  if [ "$FIRST" -eq 1 ]; then
    cat $BRIEFS | claude --dangerously-skip-permissions -p - 2>&1 | tee -a "$LOG"
    EXIT=${PIPESTATUS[1]}
    FIRST=0
  else
    printf '%s\n' "Resume. Read .claude/DIRECTIVE.md, then the latest NIGHT_LOG.md entry, then the first unchecked QUEUE.md item. Continue without asking." \
      | claude --dangerously-skip-permissions --continue -p - 2>&1 | tee -a "$LOG"
    EXIT=${PIPESTATUS[1]}
  fi

  printf '[%s] claude exited with %s\n' "$(ts)" "$EXIT" | tee -a "$LOG"
  [ -f STOP_CLAUDE ] && { printf '[%s] STOP_CLAUDE found. Done.\n' "$(ts)" | tee -a "$LOG"; break; }

  SLEEP=30
  [ "$EXIT" -ne 0 ] && SLEEP=180      # rate limits need real time
  printf '[%s] sleeping %ss\n' "$(ts)" "$SLEEP" | tee -a "$LOG"
  sleep "$SLEEP"
done

printf '=== finished %s after %s launches ===\n' "$(ts)" "$RESTART" | tee -a "$LOG"
