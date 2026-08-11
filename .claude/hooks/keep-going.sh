#!/usr/bin/env bash
# Stop hook. Blocks Claude Code ending the session until QUEUE.md is empty
# or STOP_CLAUDE exists.
#
# CONTRACT — get this wrong and it silently does nothing:
#   exit 0            -> allow the stop
#   exit 2 + stderr   -> BLOCK; stderr is fed back to Claude as the reason
#   exit 1            -> blocks NOTHING. Never use it here.
#   JSON on stdout is only parsed on exit 0, so we use exit 2 + stderr.

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" 2>/dev/null || exit 0

QUEUE="$PROJECT_DIR/QUEUE.md"
STOPFILE="$PROJECT_DIR/STOP_CLAUDE"
COUNTER="$PROJECT_DIR/.claude/.continue_count"
MAX_CONTINUES=400

cat > /dev/null    # drain the Stop event JSON on stdin

# 1. Manual override — the kill switch, checked first, always wins.
if [ -f "$STOPFILE" ]; then
  printf '%s STOP_CLAUDE present — allowing stop.\n' "$(date '+%Y-%m-%dT%H:%M:%S')" >> "$PROJECT_DIR/NIGHT_LOG.md"
  rm -f "$COUNTER"
  exit 0
fi

# 2. Infinite-loop ceiling.
COUNT=0
[ -f "$COUNTER" ] && COUNT=$(cat "$COUNTER" 2>/dev/null || echo 0)
case "$COUNT" in ''|*[!0-9]*) COUNT=0 ;; esac
COUNT=$((COUNT + 1))
printf '%s' "$COUNT" > "$COUNTER"

if [ "$COUNT" -gt "$MAX_CONTINUES" ]; then
  printf '%s Continue ceiling reached — allowing stop.\n' "$(date '+%Y-%m-%dT%H:%M:%S')" >> "$PROJECT_DIR/NIGHT_LOG.md"
  rm -f "$COUNTER"
  exit 0
fi

# 3. Is there work left?
[ -f "$QUEUE" ] || exit 0

NEXT_TASK=$(grep -m1 -E '^[[:space:]]*-[[:space:]]*\[ \]' "$QUEUE" 2>/dev/null || true)
REMAINING=$(grep -cE '^[[:space:]]*-[[:space:]]*\[ \]' "$QUEUE" 2>/dev/null || printf '0')

if [ -z "$NEXT_TASK" ]; then
  cat >&2 <<'REFILL'
QUEUE.md has no unchecked items, but the session is NOT over.

Do this now, without asking:
  1. Read BUGS.md. Add every open bug to QUEUE.md as an unchecked item.
  2. Read IDEAS_NEXT.md. Promote the top 3 by impact into QUEUE.md.
  3. If both are empty, generate work from the infinite backlog:
     clear bugs -> raise test coverage on scoring logic -> add content volume
     (idioms, cases, SCT items, MSE stimuli, quiz items) -> free-tier
     optimisation -> polish -> docs -> performance -> new proposals.
  4. Append at least 5 new unchecked items to QUEUE.md.
  5. Start the first one immediately.

Do not summarise. Do not wait. Continue working.
REFILL
  exit 2
fi

# 4. Block the stop, hand back the next task.
{
  printf 'You are not finished. %s task(s) remain in QUEUE.md.\n\n' "$REMAINING"
  printf 'NEXT TASK:\n%s\n\n' "$NEXT_TASK"
  cat <<'RULES'
Rules that still apply:
  - Never push to main. Branch only.
  - No destructive SQL on production Supabase. Local instance only.
  - No secrets in commits.
  - Green before every commit:
      npm run lint && npx tsc --noEmit && npm run test && npm run build
  - Blocked? ONE line in NEEDS_KAVYA.md, then move to the next task. Never idle.
  - Tick the QUEUE.md item the moment it is genuinely done and committed.
  - Log the slice in NIGHT_LOG.md with the commit hash.
RULES
  printf '\nContinuation #%s. Begin the next task now. Do not reply with a summary.\n' "$COUNT"
} >&2
exit 2
