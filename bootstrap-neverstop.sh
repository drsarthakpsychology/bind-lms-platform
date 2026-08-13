#!/usr/bin/env bash
# ============================================================================
#  CASEBOOK / VIBHA — NEVER-STOP BOOTSTRAP
#  One script. Writes every file, verifies it works, tells you what to do next.
#
#  RUN FROM YOUR REPO ROOT:
#      bash bootstrap-neverstop.sh
#
#  Written for macOS (bash 3.2 / BSD userland) and Linux both.
#  Run this YOURSELF. Never ask Claude Code to run it — hooks load when the
#  Claude Code process starts, so they must exist before you launch.
# ============================================================================

set -uo pipefail

say()  { printf '%s\n' "$*"; }
ok()   { printf '  \033[32mOK\033[0m    %s\n' "$*"; }
add()  { printf '  \033[36m+\033[0m     %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m     %s\n' "$*"; }
die()  { printf '  \033[31mFAIL\033[0m  %s\n' "$*"; exit 1; }

REPO="$(pwd)"

say ""
say "=============================================="
say " NEVER-STOP BOOTSTRAP"
say " Target: $REPO"
say "=============================================="
say ""

[ -d "$REPO/.git" ] || die "Not a git repo. cd into your repo root first."
command -v claude >/dev/null 2>&1 || warn "'claude' not on PATH — install Claude Code before launching."

mkdir -p "$REPO/.claude/hooks"

# ---------------------------------------------------------------------------
# 1. THE STOP HOOK — refuses to let Claude end its turn
# ---------------------------------------------------------------------------
cat > "$REPO/.claude/hooks/keep-going.sh" <<'KEEPGOING_SH'
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
KEEPGOING_SH
add ".claude/hooks/keep-going.sh"

# ---------------------------------------------------------------------------
# 2. THE PRECOMPACT HOOK — the fix for the actual bug
# ---------------------------------------------------------------------------
cat > "$REPO/.claude/hooks/survive-compact.sh" <<'COMPACT_SH'
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
COMPACT_SH
add ".claude/hooks/survive-compact.sh"

chmod +x "$REPO/.claude/hooks/keep-going.sh" "$REPO/.claude/hooks/survive-compact.sh"
ok "chmod +x applied (missing this fails SILENTLY)"

# ---------------------------------------------------------------------------
# 3. SETTINGS — merge-safe
# ---------------------------------------------------------------------------
SETTINGS_BODY='{
  "hooks": {
    "Stop": [
      { "hooks": [ { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/keep-going.sh", "timeout": 30 } ] }
    ],
    "SubagentStop": [
      { "hooks": [ { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/keep-going.sh", "timeout": 30 } ] }
    ],
    "PreCompact": [
      { "hooks": [ { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/survive-compact.sh", "timeout": 30 } ] }
    ],
    "SessionStart": [
      { "hooks": [ { "type": "command", "command": "cat \"$CLAUDE_PROJECT_DIR\"/.claude/DIRECTIVE.md 2>/dev/null; echo; echo \"--- FIRST UNCHECKED TASK ---\"; grep -m1 -E \"^[[:space:]]*-[[:space:]]*\\\\[ \\\\]\" \"$CLAUDE_PROJECT_DIR\"/QUEUE.md 2>/dev/null", "timeout": 15 } ] }
    ]
  }
}'

if [ -f "$REPO/.claude/settings.json" ]; then
  cp "$REPO/.claude/settings.json" "$REPO/.claude/settings.json.bak"
  printf '%s\n' "$SETTINGS_BODY" > "$REPO/.claude/settings.json.NEW"
  warn "settings.json exists — backed up to .bak"
  warn "MERGE the hooks block from .claude/settings.json.NEW by hand"
else
  printf '%s\n' "$SETTINGS_BODY" > "$REPO/.claude/settings.json"
  add ".claude/settings.json"
fi

# ---------------------------------------------------------------------------
# 4. WORKING FILES
# ---------------------------------------------------------------------------
if [ ! -f "$REPO/QUEUE.md" ]; then
cat > "$REPO/QUEUE.md" <<'QUEUE_MD'
# QUEUE
# Format is STRICT. Unchecked: "- [ ]" with exactly one space. Done: "- [x]".
# The Stop hook only blocks while unchecked items exist. This is the fuel.

- [ ] Build Presenting Complaint Decoder + 60-idiom bank (V5 Part 1)
- [ ] Rebuild patient engine: Director/Actor split (V5 Part 3)
- [ ] PatientState + 24-move library + anti-repetition
- [ ] Gates as code not prose; unit tests with scripted transcripts
- [ ] Retry-from-turn-N with side-by-side comparison strip (Addendum A1)
- [ ] Scorer calibration harness at /admin/calibration (Addendum A3)
- [ ] Practice page redesign: state chips, time badges, verb labels, unique icons
- [ ] /today front door + bottom nav + <=2-tap friction audit
- [ ] MSE five-level ladder + confusable-pair drills (V5 Part 2)
- [ ] Voice: CosyVoice 2 + affect mapping + R2 cache + Whisper STT
- [ ] 60 cases across 16 traps, 9 of them no-disorder
- [ ] Feature flags + cut Cohort One to six live surfaces (Addendum A2)
- [ ] Out of Depth module, 30 scenarios (Addendum A4)
- [ ] Review queue triage + Cohort Pulse (Addendum A5, A6)
- [ ] halfvec(384) migration — assert no vector(1536) column exists
- [ ] /admin/infra free-tier headroom dashboard, red at 70%
QUEUE_MD
add "QUEUE.md (seeded, 16 tasks)"
else
  ok "QUEUE.md already exists — left alone"
fi

[ -f "$REPO/NIGHT_LOG.md" ]   || { printf '# NIGHT LOG\n\n'   > "$REPO/NIGHT_LOG.md";   add "NIGHT_LOG.md"; }
[ -f "$REPO/BUGS.md" ]        || { printf '# BUGS\n\n| ID | Sev | Feature | Symptom | Repro | Status | Fix |\n|---|---|---|---|---|---|---|\n' > "$REPO/BUGS.md"; add "BUGS.md"; }
[ -f "$REPO/NEEDS_KAVYA.md" ] || { printf '# NEEDS KAVYA\n\n' > "$REPO/NEEDS_KAVYA.md"; add "NEEDS_KAVYA.md"; }
[ -f "$REPO/IDEAS_NEXT.md" ]  || { printf '# IDEAS NEXT\n\n'  > "$REPO/IDEAS_NEXT.md";  add "IDEAS_NEXT.md"; }

# ---------------------------------------------------------------------------
# 5. THE OUTER LOOP — survives a dead process
# ---------------------------------------------------------------------------
cat > "$REPO/run-all-night.sh" <<'RUNNER_SH'
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
RUNNER_SH
chmod +x "$REPO/run-all-night.sh"
add "run-all-night.sh"

# ---------------------------------------------------------------------------
# 6. GITIGNORE
# ---------------------------------------------------------------------------
touch "$REPO/.gitignore"
for p in ".claude/.continue_count" "STOP_CLAUDE" "night-runner.log" ".claude/DIRECTIVE.md" ".claude/settings.json.bak" ".claude/settings.json.NEW"; do
  grep -qxF "$p" "$REPO/.gitignore" 2>/dev/null || printf '%s\n' "$p" >> "$REPO/.gitignore"
done
add ".gitignore entries"

# ---------------------------------------------------------------------------
# 7. SELF-VERIFY — a silently broken hook looks exactly like a working one
# ---------------------------------------------------------------------------
say ""
say "Verifying..."
rm -f "$REPO/.claude/.continue_count" "$REPO/STOP_CLAUDE"

RC=0; printf '{}' | CLAUDE_PROJECT_DIR="$REPO" "$REPO/.claude/hooks/keep-going.sh" >/dev/null 2>&1 || RC=$?
[ "$RC" -eq 2 ] && ok "work remaining -> exit 2 (BLOCKS the stop)" \
                || die "expected exit 2, got $RC. Check QUEUE.md uses '- [ ]' with one space."

touch "$REPO/STOP_CLAUDE"
RC=0; printf '{}' | CLAUDE_PROJECT_DIR="$REPO" "$REPO/.claude/hooks/keep-going.sh" >/dev/null 2>&1 || RC=$?
rm -f "$REPO/STOP_CLAUDE" "$REPO/.claude/.continue_count"
[ "$RC" -eq 0 ] && ok "STOP_CLAUDE -> exit 0 (ALLOWS the stop)" \
                || die "kill switch broken, got $RC"

CLAUDE_PROJECT_DIR="$REPO" "$REPO/.claude/hooks/survive-compact.sh" >/dev/null 2>&1
[ -f "$REPO/.claude/DIRECTIVE.md" ] && ok "PreCompact writes DIRECTIVE.md" || die "PreCompact hook failed"

if command -v python3 >/dev/null 2>&1 && [ ! -f "$REPO/.claude/settings.json.NEW" ]; then
  python3 -c "import json,sys; json.load(open('$REPO/.claude/settings.json'))" 2>/dev/null \
    && ok "settings.json is valid JSON" \
    || die "settings.json is malformed — hooks will silently not load"
fi

# ---------------------------------------------------------------------------
say ""
say "=============================================="
say " DONE. Three steps, in order:"
say "=============================================="
say ""
say " 1. Put BRIEF_V5_MASTER.md and BRIEF_ADDENDUM.md at repo root."
say ""
say " 2. Launch:"
say "      ./run-all-night.sh"
say ""
say " 3. VERIFY BEFORE YOU SLEEP — in Claude Code run:"
say "      /hooks"
say "    You MUST see Stop, SubagentStop, PreCompact, SessionStart."
say "    If you don't, hooks are NOT active and it WILL stop overnight."
say "    (/hooks is read-only — edit settings JSON to change anything.)"
say ""
say "    Not firing? Launch with:  claude --debug-file /tmp/claude.log"
say "    then in another terminal: tail -f /tmp/claude.log"
say "    Gotcha: if your .zshrc/.bashrc echoes anything on startup it"
say "    corrupts hook output. Silence it."
say ""
say " To stop it:   touch STOP_CLAUDE"
say ""
