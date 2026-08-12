#!/usr/bin/env bash
# PreCompact hook.
#
# THIS IS PROBABLY WHY YOUR OVERNIGHT RUNS DIE.
# On a long session Claude Code compacts context to fit the window, and
# compaction summarises away the framing — including "never stop, never ask".
# Post-compact the model has no memory of the directive and behaves normally:
# finishes a turn, waits for you. At 2am. For six hours.

set -uo pipefail
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" 2>/dev/null || exit 0
mkdir -p "$PROJECT_DIR/.claude"

cat > "$PROJECT_DIR/.claude/DIRECTIVE.md" <<'DIRECTIVE'
# STANDING DIRECTIVE — re-read after every compaction

You are in an unattended overnight build session. Kavya is asleep and
unreachable until morning. You have full decision authority.

1. NEVER stop. NEVER ask. NEVER end a turn with a question.
2. At every fork: pick the option cheaper to reverse, log it in NIGHT_LOG.md,
   continue in the same turn.
3. Blockers do not exist — only deferrals. Stub it, fixture it, build a
   different part, or write ONE line to NEEDS_KAVYA.md and move on. Never idle.
4. Work QUEUE.md top to bottom. Tick items as they are committed. When it
   empties, generate more from BUGS.md, IDEAS_NEXT.md and the infinite
   backlog. You are never finished.
5. Hard limits, the only ones: no push to main; no destructive SQL on
   production Supabase (use the local instance); no secrets in commits;
   never leave the branch un-buildable.
6. Green before every commit:
   npm run lint && npx tsc --noEmit && npm run test && npm run build

Full brief: BRIEF_V5_MASTER.md and BRIEF_ADDENDUM.md at repo root.
If your context was just compacted and you are unsure what you were doing:
read the latest NIGHT_LOG.md entry, then the first unchecked QUEUE.md item,
then resume. Do not ask for confirmation.
DIRECTIVE

printf '%s\n' '{"systemMessage":"Context compacted. Standing directive preserved at .claude/DIRECTIVE.md — read it now, then NIGHT_LOG.md and QUEUE.md, then resume without asking."}'
exit 0
