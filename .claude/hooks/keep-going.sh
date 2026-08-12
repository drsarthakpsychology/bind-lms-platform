#!/usr/bin/env bash
# Stop hook for unattended Claude sessions.
#
# IMPORTANT:
# - Block Claude only while genuine unchecked QUEUE.md work exists.
# - An exhausted queue is a normal completion state.
# - NEVER manufacture new queue work from this hook.
# - The queue matcher MUST distinguish [ ] from [x].

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" 2>/dev/null || exit 0

QUEUE="$PROJECT_DIR/QUEUE.md"
STOPFILE="$PROJECT_DIR/STOP_CLAUDE"
COUNTER="$PROJECT_DIR/.claude/.continue_count"
MAX_CONTINUES="${CLAUDE_MAX_CONTINUES:-50}"

# Drain Stop event JSON from stdin.
cat > /dev/null

# Manual kill switch always wins.
if [ -f "$STOPFILE" ]; then
  printf '%s STOP_CLAUDE present — allowing stop.\n' \
    "$(date '+%Y-%m-%dT%H:%M:%S')" >> "$PROJECT_DIR/NIGHT_LOG.md"
  rm -f "$COUNTER"
  exit 0
fi

# No queue = nothing to continue.
if [ ! -f "$QUEUE" ]; then
  rm -f "$COUNTER"
  exit 0
fi

# IMPORTANT:
# Match ONLY "- [ ]", never "- [x]".
NEXT_TASK=$(
  grep -m1 -E '^[[:space:]]*-[[:space:]]*\[ \]' "$QUEUE" 2>/dev/null || true
)

REMAINING=$(
  grep -cE '^[[:space:]]*-[[:space:]]*\[ \]' "$QUEUE" 2>/dev/null || printf '0'
)

# Queue exhausted = NORMAL completion.
# Do not refill it. Do not ask Claude to invent work.
if [ -z "$NEXT_TASK" ]; then
  rm -f "$COUNTER"
  printf '%s Queue exhausted — allowing normal Claude stop.\n' \
    "$(date '+%Y-%m-%dT%H:%M:%S')" >> "$PROJECT_DIR/NIGHT_LOG.md"
  exit 0
fi

# Safety ceiling for a genuinely long queue.
COUNT=0
if [ -f "$COUNTER" ]; then
  COUNT=$(cat "$COUNTER" 2>/dev/null || echo 0)
fi

case "$COUNT" in
  ''|*[!0-9]*) COUNT=0 ;;
esac

COUNT=$((COUNT + 1))
printf '%s' "$COUNT" > "$COUNTER"

if [ "$COUNT" -gt "$MAX_CONTINUES" ]; then
  printf '%s Continue ceiling reached (%s) — allowing stop for safety.\n' \
    "$(date '+%Y-%m-%dT%H:%M:%S')" "$MAX_CONTINUES" \
    >> "$PROJECT_DIR/NIGHT_LOG.md"
  rm -f "$COUNTER"
  exit 0
fi

# Genuine work remains: block the stop and give Claude the next task.
{
  printf 'You are not finished. %s unchecked task(s) remain in QUEUE.md.\n\n' \
    "$REMAINING"

  printf 'NEXT TASK:\n%s\n\n' "$NEXT_TASK"

  cat <<'RULES'
Rules:
  - Never push to main. Branch only.
  - No destructive SQL on production Supabase. Local instance only.
  - No secrets in commits.
  - Green before every commit:
      npm run lint && npx tsc --noEmit && npm run test && npm run build
  - Blocked? ONE line in NEEDS_KAVYA.md, then move to the next task.
  - Tick the QUEUE.md item when it is genuinely done and committed.
  - Log the slice in NIGHT_LOG.md with the commit hash.
  - Do NOT invent new queue items from this Stop hook.
  - When QUEUE.md has no "- [ ]" items, stop normally.
RULES

  printf '\nContinuation #%s. Begin the next task now. Do not reply with a summary.\n' \
    "$COUNT"
} >&2

exit 2
