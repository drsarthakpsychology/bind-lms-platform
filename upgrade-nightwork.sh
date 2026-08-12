#!/usr/bin/env bash
# ============================================================================
#  NIGHTWORK UPGRADE — "finish what I asked, whatever I asked"
#
#  Before: only kept going while QUEUE.md had items.
#  After:  keeps going until the work you asked for is actually finished,
#          whatever that work was, whatever time of day.
#
#  Run once:  bash upgrade-nightwork.sh
# ============================================================================
set -uo pipefail
G='\033[32m'; C='\033[36m'; R='\033[31m'; N='\033[0m'
ok(){ printf "  ${G}OK${N}    %s\n" "$*"; }
add(){ printf "  ${C}+${N}     %s\n" "$*"; }
die(){ printf "  ${R}FAIL${N}  %s\n" "$*"; exit 1; }

printf "\n=== NIGHTWORK UPGRADE ===\n\n"
mkdir -p "$HOME/.claude/hooks"

# ---------------------------------------------------------------------------
# The new brain. Reads the actual transcript and decides if Claude really
# finished, instead of relying on a to-do file.
# ---------------------------------------------------------------------------
cat > "$HOME/.claude/hooks/nightwork-keepgoing.sh" <<'KG'
#!/usr/bin/env bash
# Stop hook. Blocks Claude ending the session until the work is genuinely done.
#   exit 0          -> allow the stop
#   exit 2 + stderr -> BLOCK, stderr becomes Claude's instruction
#   exit 1          -> blocks NOTHING. never use.
set -uo pipefail

D="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$D" 2>/dev/null || exit 0

INPUT="$(cat)"

# --- OFF SWITCH: always wins -----------------------------------------------
if [ -f "$D/STOP_CLAUDE" ]; then rm -f "$D/.claude/.nwcount"; exit 0; fi

# --- Only active in projects opted in --------------------------------------
# A project is opted in if it has QUEUE.md OR .claude/NIGHTWORK.
if [ ! -f "$D/QUEUE.md" ] && [ ! -f "$D/.claude/NIGHTWORK" ]; then exit 0; fi

mkdir -p "$D/.claude"
CF="$D/.claude/.nwcount"; C=0
[ -f "$CF" ] && C=$(cat "$CF" 2>/dev/null || echo 0)
case "$C" in ''|*[!0-9]*) C=0;; esac
C=$((C+1)); printf '%s' "$C" > "$CF"
if [ "$C" -gt 300 ]; then rm -f "$CF"; exit 0; fi

# --- 1. Explicit to-do list still has items? -------------------------------
if [ -f "$D/QUEUE.md" ]; then
  NEXT=$(grep -m1 -E '^[[:space:]]*-[[:space:]]*\[ \]' "$D/QUEUE.md" 2>/dev/null || true)
  LEFT=$(grep -cE '^[[:space:]]*-[[:space:]]*\[ \]' "$D/QUEUE.md" 2>/dev/null || printf '0')
  if [ -n "$NEXT" ]; then
    {
      printf 'NOT FINISHED. %s task(s) remain in QUEUE.md.\n\nNEXT:\n%s\n\n' "$LEFT" "$NEXT"
      printf 'Start it now. Do not summarise. Do not ask. Continuation #%s.\n' "$C"
    } >&2
    exit 2
  fi
fi

# --- 2. No list. Did Claude actually finish, or did it trail off? ----------
# Read the last thing Claude said from the transcript.
TP=$(printf '%s' "$INPUT" | sed -n 's/.*"transcript_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
LAST=""
if [ -n "$TP" ] && [ -f "$TP" ]; then
  LAST=$(tail -c 40000 "$TP" 2>/dev/null | tr '\n' ' ' | tail -c 4000)
fi

# Signals that Claude stopped early instead of finishing.
STALL=""
case "$LAST" in
  *"Would you like"*|*"would you like"*)          STALL="asked permission" ;;
  *"Let me know"*|*"let me know"*)                STALL="deferred to the user" ;;
  *"Shall I"*|*"shall I"*|*"Should I"*)           STALL="asked permission" ;;
  *"Do you want"*|*"do you want"*)                STALL="asked permission" ;;
  *"next steps"*|*"Next steps"*)                  STALL="listed next steps instead of doing them" ;;
  *"I can also"*|*"I could also"*)                STALL="offered instead of acting" ;;
  *"if you'd like"*|*"If you'd like"*)            STALL="offered instead of acting" ;;
  *"ready for your review"*|*"Ready for"*)        STALL="handed back for review" ;;
  *"?"*)                                          STALL="ended on a question" ;;
esac

if [ -n "$STALL" ]; then
  {
    printf 'NOT FINISHED — you %s.\n\n' "$STALL"
    cat <<'RL'
There is nobody available to answer. You have full authority to decide.

Do this instead:
  - Make the decision yourself. Pick the option cheaper to reverse.
  - Note the decision in NIGHT_LOG.md and carry on.
  - If something is genuinely impossible without a human, write ONE line in
    NEEDS_KAVYA.md and move on to the next piece of work. Never idle.
  - If the original request is fully complete, verify it: run the build, run
    the tests, check the files actually exist, then commit.

Continue working now. Do not summarise. Do not ask.
RL
  } >&2
  exit 2
fi

# --- 3. Sounds done. Verify it really is before letting go. ----------------
VERIFIED="$D/.claude/.nwverified"
if [ ! -f "$VERIFIED" ]; then
  : > "$VERIFIED"
  cat >&2 <<'VF'
Before you finish, verify the work rather than assuming it.

Do all of this now, then stop:
  1. Check on disk that every file you claimed to create or edit exists and
     contains what you said. Do not trust your memory of the session.
  2. Run: npm run lint && npx tsc --noEmit && npm run test && npm run build
     If anything is red, fix it or revert that slice.
  3. Commit everything. The branch must be buildable.
  4. Update NIGHT_LOG.md with what shipped and the commit hash.
  5. Put anything still open into QUEUE.md as "- [ ]" items, and anything
     needing a human into NEEDS_KAVYA.md.

If step 1 or 2 reveals a problem, fix it and keep working.
VF
  exit 2
fi

rm -f "$VERIFIED" "$CF"
exit 0
KG
chmod +x "$HOME/.claude/hooks/nightwork-keepgoing.sh"
add "smarter Stop hook (judges the transcript, not just QUEUE.md)"

# ---------------------------------------------------------------------------
# Reset the verify flag at the start of each session
# ---------------------------------------------------------------------------
cat > "$HOME/.claude/hooks/nightwork-start.sh" <<'ST'
#!/usr/bin/env bash
D="${CLAUDE_PROJECT_DIR:-$(pwd)}"
[ -f "$D/QUEUE.md" ] || [ -f "$D/.claude/NIGHTWORK" ] || exit 0
rm -f "$D/.claude/.nwverified" "$D/.claude/.nwcount"
cat "$D/.claude/DIRECTIVE.md" 2>/dev/null
if [ -f "$D/QUEUE.md" ]; then
  printf '\n--- FIRST UNCHECKED TASK ---\n'
  grep -m1 -E '^[[:space:]]*-[[:space:]]*\[ \]' "$D/QUEUE.md" 2>/dev/null
fi
exit 0
ST
chmod +x "$HOME/.claude/hooks/nightwork-start.sh"
add "SessionStart resets the verify flag"

# ---------------------------------------------------------------------------
# beastmode / normal commands — turn it on and off per project
# ---------------------------------------------------------------------------
mkdir -p "$HOME/.local/bin"

cat > "$HOME/.local/bin/beastmode" <<'BM'
#!/usr/bin/env bash
mkdir -p .claude && : > .claude/NIGHTWORK && rm -f STOP_CLAUDE .claude/.nwcount
touch .gitignore
for p in ".claude/NIGHTWORK" ".claude/.nwcount" ".claude/.nwverified" "STOP_CLAUDE" "night-runner.log"; do
  grep -qxF "$p" .gitignore 2>/dev/null || printf '%s\n' "$p" >> .gitignore
done
echo "BEAST MODE ON for this folder."
echo "Claude will not stop until the work you ask for is finished."
echo "Turn it off with:  normal"
BM

cat > "$HOME/.local/bin/normal" <<'NM'
#!/usr/bin/env bash
rm -f .claude/NIGHTWORK .claude/.nwcount .claude/.nwverified
touch STOP_CLAUDE
echo "NORMAL MODE. Claude answers and stops, like usual."
echo "Turn beast mode back on with:  beastmode"
NM

chmod +x "$HOME/.local/bin/beastmode" "$HOME/.local/bin/normal"
add "beastmode command"
add "normal command"

# ---------------------------------------------------------------------------
# Verify
# ---------------------------------------------------------------------------
printf "\nVerifying...\n"
T=$(mktemp -d); mkdir -p "$T/.claude"; : > "$T/.claude/NIGHTWORK"

R1=0; printf '{"transcript_path":"/nope"}' | CLAUDE_PROJECT_DIR="$T" "$HOME/.claude/hooks/nightwork-keepgoing.sh" >/dev/null 2>&1 || R1=$?
[ "$R1" -eq 2 ] && ok "first stop attempt -> forces verification" || die "expected 2, got $R1"

R2=0; printf '{"transcript_path":"/nope"}' | CLAUDE_PROJECT_DIR="$T" "$HOME/.claude/hooks/nightwork-keepgoing.sh" >/dev/null 2>&1 || R2=$?
[ "$R2" -eq 0 ] && ok "after verifying -> allows the stop" || die "expected 0, got $R2"

TR="$T/t.jsonl"; printf 'assistant: Done. Would you like me to continue?\n' > "$TR"
rm -f "$T/.claude/.nwverified"
R3=0; printf '{"transcript_path":"%s"}' "$TR" | CLAUDE_PROJECT_DIR="$T" "$HOME/.claude/hooks/nightwork-keepgoing.sh" >/dev/null 2>&1 || R3=$?
[ "$R3" -eq 2 ] && ok "'Would you like...' -> BLOCKED, told to decide itself" || die "stall detection broken ($R3)"

touch "$T/STOP_CLAUDE"
R4=0; printf '{}' | CLAUDE_PROJECT_DIR="$T" "$HOME/.claude/hooks/nightwork-keepgoing.sh" >/dev/null 2>&1 || R4=$?
[ "$R4" -eq 0 ] && ok "off switch -> allows the stop" || die "off switch broken ($R4)"

T2=$(mktemp -d)
R5=0; printf '{}' | CLAUDE_PROJECT_DIR="$T2" "$HOME/.claude/hooks/nightwork-keepgoing.sh" >/dev/null 2>&1 || R5=$?
[ "$R5" -eq 0 ] && ok "other projects -> completely unaffected" || die "would break other projects ($R5)"
rm -rf "$T" "$T2"

cat <<'DONE'

===========================================
 UPGRADE DONE
===========================================

TURN IT ON, once per project:

    cd ~/your-project
    beastmode

FROM THEN ON, just use Claude Code normally:

    claude

Give it any prompt, any time. It will not stop until the work is
actually done. If it tries to ask you a question, the hook tells it
to decide for itself and keep going. Before it is allowed to finish
it must verify the files exist, run the build, and commit.

    normal      -> back to ordinary Claude in this folder
    beastmode   -> turn it back on
    nightwork   -> unattended run that also survives crashes

>>> Close this terminal and open a new one. <<<

DONE
