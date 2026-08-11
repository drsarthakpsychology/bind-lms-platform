#!/usr/bin/env bash
# ============================================================================
#  ONE-TIME SETUP. Run once, ever.
#  After this: type  nightwork  in any project. That's the whole workflow.
# ============================================================================
set -uo pipefail

G='\033[32m'; C='\033[36m'; Y='\033[33m'; R='\033[31m'; N='\033[0m'
ok(){ printf "  ${G}OK${N}    %s\n" "$*"; }
add(){ printf "  ${C}+${N}     %s\n" "$*"; }
warn(){ printf "  ${Y}!${N}     %s\n" "$*"; }
die(){ printf "  ${R}FAIL${N}  %s\n" "$*"; exit 1; }

printf "\n===========================================\n"
printf " NIGHTWORK — one-time setup\n"
printf "===========================================\n\n"

mkdir -p "$HOME/.claude/hooks"

# ---------------------------------------------------------------------------
# 1. GLOBAL STOP HOOK — works in every project, forever
#    Only activates if that project has a QUEUE.md. No QUEUE.md = normal Claude.
# ---------------------------------------------------------------------------
cat > "$HOME/.claude/hooks/nightwork-keepgoing.sh" <<'KG'
#!/usr/bin/env bash
set -uo pipefail
D="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$D" 2>/dev/null || exit 0
cat > /dev/null

# No QUEUE.md in this project? Behave completely normally.
[ -f "$D/QUEUE.md" ] || exit 0

# Kill switch always wins.
[ -f "$D/STOP_CLAUDE" ] && { rm -f "$D/.claude/.nwcount"; exit 0; }

mkdir -p "$D/.claude"
CF="$D/.claude/.nwcount"; C=0
[ -f "$CF" ] && C=$(cat "$CF" 2>/dev/null || echo 0)
case "$C" in ''|*[!0-9]*) C=0;; esac
C=$((C+1)); printf '%s' "$C" > "$CF"
[ "$C" -gt 400 ] && { rm -f "$CF"; exit 0; }

NEXT=$(grep -m1 -E '^[[:space:]]*-[[:space:]]*\[ \]' "$D/QUEUE.md" 2>/dev/null || true)
LEFT=$(grep -cE '^[[:space:]]*-[[:space:]]*\[ \]' "$D/QUEUE.md" 2>/dev/null || printf '0')

if [ -z "$NEXT" ]; then
cat >&2 <<'RF'
QUEUE.md has no unchecked items, but the session is NOT over.

Do this now, without asking:
  1. Read BUGS.md. Add every open bug to QUEUE.md as an unchecked item.
  2. Read IDEAS_NEXT.md. Promote the top 3 by impact into QUEUE.md.
  3. If both empty, generate work: clear bugs -> raise test coverage on
     scoring logic -> add content volume (idioms, cases, quiz items) ->
     free-tier optimisation -> polish -> docs -> performance.
  4. Append at least 5 new unchecked items to QUEUE.md.
  5. Start the first one immediately.

Do not summarise. Do not wait. Continue working.
RF
exit 2
fi

{
printf 'You are not finished. %s task(s) remain in QUEUE.md.\n\nNEXT TASK:\n%s\n\n' "$LEFT" "$NEXT"
cat <<'RL'
Rules that still apply:
  - Never push to main. Branch only.
  - No destructive SQL on production. Local instance only.
  - No secrets in commits.
  - Green before every commit:
      npm run lint && npx tsc --noEmit && npm run test && npm run build
  - Blocked? ONE line in NEEDS_KAVYA.md, then move to the next task. Never idle.
  - Tick the QUEUE.md item only when done AND committed.
  - Log the slice in NIGHT_LOG.md with the commit hash.
RL
printf '\nContinuation #%s. Begin now. Do not reply with a summary.\n' "$C"
} >&2
exit 2
KG
add "global Stop hook"

# ---------------------------------------------------------------------------
# 2. GLOBAL PRECOMPACT HOOK — the actual bug fix
# ---------------------------------------------------------------------------
cat > "$HOME/.claude/hooks/nightwork-compact.sh" <<'CP'
#!/usr/bin/env bash
set -uo pipefail
D="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$D" 2>/dev/null || exit 0
[ -f "$D/QUEUE.md" ] || exit 0
mkdir -p "$D/.claude"
cat > "$D/.claude/DIRECTIVE.md" <<'DV'
# STANDING DIRECTIVE — re-read after every compaction

Unattended overnight session. Nobody is awake. Full decision authority.

1. NEVER stop. NEVER ask. NEVER end a turn with a question.
2. At every fork: pick the option cheaper to reverse, log it in NIGHT_LOG.md,
   continue in the same turn.
3. Blockers do not exist, only deferrals. Stub it, fixture it, build a
   different part, or ONE line in NEEDS_KAVYA.md and move on. Never idle.
4. Work QUEUE.md top to bottom. Tick only when done AND committed. When it
   empties, refill from BUGS.md and IDEAS_NEXT.md. You are never finished.
5. Hard limits: no push to main; no destructive SQL on production; no secrets
   in commits; never leave the branch un-buildable.
6. Green before every commit:
   npm run lint && npx tsc --noEmit && npm run test && npm run build

Lost after a compaction? Read RESUME.md, then the latest NIGHT_LOG.md entry,
then the first unchecked QUEUE.md item. Resume. Do not ask.
DV
printf '%s\n' '{"systemMessage":"Context compacted. Read .claude/DIRECTIVE.md now, then NIGHT_LOG.md and QUEUE.md, then resume without asking."}'
exit 0
CP
add "global PreCompact hook"

# ---------------------------------------------------------------------------
# 3. GLOBAL SESSIONSTART — restores context on every launch
# ---------------------------------------------------------------------------
cat > "$HOME/.claude/hooks/nightwork-start.sh" <<'ST'
#!/usr/bin/env bash
D="${CLAUDE_PROJECT_DIR:-$(pwd)}"
[ -f "$D/QUEUE.md" ] || exit 0
cat "$D/.claude/DIRECTIVE.md" 2>/dev/null
printf '\n--- FIRST UNCHECKED TASK ---\n'
grep -m1 -E '^[[:space:]]*-[[:space:]]*\[ \]' "$D/QUEUE.md" 2>/dev/null
exit 0
ST
add "global SessionStart hook"

chmod +x "$HOME"/.claude/hooks/nightwork-*.sh
ok "hooks executable"

# ---------------------------------------------------------------------------
# 4. MERGE INTO GLOBAL settings.json — never clobbers what you already have
# ---------------------------------------------------------------------------
python3 - <<'PY' || die "could not write ~/.claude/settings.json"
import json, os, shutil
p = os.path.expanduser("~/.claude/settings.json")
cfg = {}
if os.path.exists(p):
    shutil.copy(p, p + ".bak")
    try: cfg = json.load(open(p))
    except Exception: cfg = {}
h = cfg.setdefault("hooks", {})
def put(evt, script, timeout):
    cmd = f'"$HOME"/.claude/hooks/{script}'
    grp = h.setdefault(evt, [])
    for g in grp:
        for hk in g.get("hooks", []):
            if script in hk.get("command", ""): return
    grp.append({"hooks": [{"type": "command", "command": cmd, "timeout": timeout}]})
put("Stop",          "nightwork-keepgoing.sh", 30)
put("SubagentStop",  "nightwork-keepgoing.sh", 30)
put("PreCompact",    "nightwork-compact.sh",   30)
put("SessionStart",  "nightwork-start.sh",     15)
json.dump(cfg, open(p, "w"), indent=2)
print("  \033[32mOK\033[0m    ~/.claude/settings.json  events:", ", ".join(cfg["hooks"].keys()))
PY

# ---------------------------------------------------------------------------
# 5. FIX ANY PROJECT-LEVEL settings.json.NEW LEFT BEHIND (your current problem)
# ---------------------------------------------------------------------------
FIXED=0
for d in "$PWD" "$HOME/Downloads"/*/ ; do
  [ -f "$d/.claude/settings.json.NEW" ] || continue
  python3 - "$d" <<'PY2'
import json, sys, os, shutil
d = sys.argv[1]
main = os.path.join(d, ".claude/settings.json")
new  = os.path.join(d, ".claude/settings.json.NEW")
try:
    cur = json.load(open(main)) if os.path.exists(main) else {}
    nw  = json.load(open(new))
except Exception:
    sys.exit(0)
if os.path.exists(main): shutil.copy(main, main + ".bak")
cur.setdefault("hooks", {}).update(nw.get("hooks", {}))
json.dump(cur, open(main, "w"), indent=2)
os.rename(new, new + ".merged")
print("  \033[32mOK\033[0m    merged leftover settings.json.NEW in", d)
PY2
  FIXED=1
done
[ "$FIXED" -eq 0 ] && ok "no leftover settings.json.NEW found"

# ---------------------------------------------------------------------------
# 6. THE nightwork COMMAND — installed into your shell, works from anywhere
# ---------------------------------------------------------------------------
mkdir -p "$HOME/.local/bin"
cat > "$HOME/.local/bin/nightwork" <<'NW'
#!/usr/bin/env bash
# nightwork            -> run all night on this repo
# nightwork "do X"     -> run all night with your own prompt
# stopwork             -> stop it
set -uo pipefail

if [ ! -d .git ]; then
  echo "Not a git repo. cd into your project folder first."; exit 1
fi

REPO="$(pwd)"
LOG="$REPO/night-runner.log"
ts(){ date '+%Y-%m-%dT%H:%M:%S'; }

# Make sure the project has the working files the hook needs.
[ -f QUEUE.md ]        || printf '# QUEUE\n\n- [ ] Read the brief and generate the task list\n' > QUEUE.md
[ -f NIGHT_LOG.md ]    || printf '# NIGHT LOG\n\n' > NIGHT_LOG.md
[ -f BUGS.md ]         || printf '# BUGS\n\n' > BUGS.md
[ -f NEEDS_KAVYA.md ]  || printf '# NEEDS KAVYA\n\n' > NEEDS_KAVYA.md
[ -f IDEAS_NEXT.md ]   || printf '# IDEAS NEXT\n\n' > IDEAS_NEXT.md
for p in ".claude/.nwcount" "STOP_CLAUDE" "night-runner.log" ".claude/DIRECTIVE.md"; do
  touch .gitignore; grep -qxF "$p" .gitignore 2>/dev/null || printf '%s\n' "$p" >> .gitignore
done

rm -f STOP_CLAUDE .claude/.nwcount

# Build the opening prompt.
CUSTOM="${1:-}"
if [ -n "$CUSTOM" ]; then
  OPENING="$CUSTOM"
else
  OPENING=""
  for f in BRIEF_V5_MASTER.md BRIEF_ADDENDUM.md; do
    [ -f "$f" ] && OPENING="$OPENING$(cat "$f")

"
  done
  [ -z "$OPENING" ] && OPENING="Read QUEUE.md and work through every unchecked item. Never stop, never ask."
fi

printf '=== nightwork started %s in %s ===\n' "$(ts)" "$REPO" | tee -a "$LOG"
echo "Stop it any time with:  stopwork"
echo

RUN=0
while [ "$RUN" -lt 200 ]; do
  [ -f STOP_CLAUDE ] && { printf '[%s] stopped by user\n' "$(ts)" | tee -a "$LOG"; break; }
  RUN=$((RUN+1))
  printf '[%s] --- launch #%s ---\n' "$(ts)" "$RUN" | tee -a "$LOG"

  if [ "$RUN" -eq 1 ]; then
    printf '%s' "$OPENING" | claude --dangerously-skip-permissions -p - 2>&1 | tee -a "$LOG"
  else
    printf '%s' "Resume. Read .claude/DIRECTIVE.md, then RESUME.md if it exists, then the latest NIGHT_LOG.md entry, then the first unchecked QUEUE.md item. Continue without asking." \
      | claude --dangerously-skip-permissions --continue -p - 2>&1 | tee -a "$LOG"
  fi
  EXIT=${PIPESTATUS[1]}

  printf '[%s] exited %s\n' "$(ts)" "$EXIT" | tee -a "$LOG"
  [ -f STOP_CLAUDE ] && { printf '[%s] stopped by user\n' "$(ts)" | tee -a "$LOG"; break; }

  S=30; [ "$EXIT" -ne 0 ] && S=180
  printf '[%s] sleeping %ss\n' "$(ts)" "$S" | tee -a "$LOG"
  sleep "$S"
done
printf '=== nightwork finished %s after %s launches ===\n' "$(ts)" "$RUN" | tee -a "$LOG"
NW

cat > "$HOME/.local/bin/stopwork" <<'SW'
#!/usr/bin/env bash
touch STOP_CLAUDE 2>/dev/null && echo "Stopping after the current task finishes." || echo "Run this from your project folder."
SW

chmod +x "$HOME/.local/bin/nightwork" "$HOME/.local/bin/stopwork"
add "nightwork command"
add "stopwork command"

# ---------------------------------------------------------------------------
# 7. WIRE INTO THE SHELL (zsh on macOS, bash fallback)
# ---------------------------------------------------------------------------
RC="$HOME/.zshrc"; [ -n "${BASH_VERSION:-}" ] && [ ! -f "$RC" ] && RC="$HOME/.bashrc"
touch "$RC"
if ! grep -q "NIGHTWORK PATH" "$RC" 2>/dev/null; then
cat >> "$RC" <<'RCB'

# --- NIGHTWORK PATH ---
export PATH="$HOME/.local/bin:$PATH"
nightwork() { caffeinate -i "$HOME/.local/bin/nightwork" "$@"; }
RCB
add "added to $RC (wrapped in caffeinate so your Mac stays awake)"
else
  ok "shell already configured"
fi

export PATH="$HOME/.local/bin:$PATH"

# ---------------------------------------------------------------------------
# 8. VERIFY
# ---------------------------------------------------------------------------
printf "\nVerifying...\n"
TMP=$(mktemp -d); cd "$TMP"
printf '# QUEUE\n- [ ] test task\n' > QUEUE.md; mkdir -p .claude
RC2=0; printf '{}' | CLAUDE_PROJECT_DIR="$TMP" "$HOME/.claude/hooks/nightwork-keepgoing.sh" >/dev/null 2>&1 || RC2=$?
[ "$RC2" -eq 2 ] && ok "work remaining -> BLOCKS the stop" || die "expected 2, got $RC2"

touch STOP_CLAUDE
RC2=0; printf '{}' | CLAUDE_PROJECT_DIR="$TMP" "$HOME/.claude/hooks/nightwork-keepgoing.sh" >/dev/null 2>&1 || RC2=$?
[ "$RC2" -eq 0 ] && ok "stopwork -> ALLOWS the stop" || die "kill switch broken ($RC2)"

rm -f QUEUE.md STOP_CLAUDE
RC2=0; printf '{}' | CLAUDE_PROJECT_DIR="$TMP" "$HOME/.claude/hooks/nightwork-keepgoing.sh" >/dev/null 2>&1 || RC2=$?
[ "$RC2" -eq 0 ] && ok "no QUEUE.md -> normal Claude, never interferes" || die "would break other projects ($RC2)"
cd - >/dev/null; rm -rf "$TMP"

python3 -c "import json,os;json.load(open(os.path.expanduser('~/.claude/settings.json')))" 2>/dev/null \
  && ok "settings.json is valid JSON" || die "settings.json malformed"

cat <<'DONE'

===========================================
 SETUP COMPLETE. You never run this again.
===========================================

FROM NOW ON, THE WHOLE WORKFLOW IS:

    cd ~/your-project
    nightwork

That's it. It keeps your Mac awake, feeds the briefs, skips all
permission prompts, refuses to stop while QUEUE.md has work, and
relaunches itself if it crashes.

To stop:      stopwork
To watch:     tail -f night-runner.log
Morning:      open MORNING_REPORT.md

Projects WITHOUT a QUEUE.md are completely unaffected. Claude Code
behaves normally there.

>>> LAST STEP: close this terminal and open a NEW one. <<<
    (the shell needs to reload before 'nightwork' exists)

DONE
