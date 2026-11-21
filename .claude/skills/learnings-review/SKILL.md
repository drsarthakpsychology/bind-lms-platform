---
name: learnings-review
description: End-of-round checklist that turns repeated mistakes and useful findings into small, reviewed changes to the agent setup. Use after merging a round of helper work, or when the same problem has shown up twice.
---

# Learnings review (about 5 minutes)

1. Read `docs/agents/LEARNINGS.md` and this round's helper reports.
2. For each new lesson, add one dated line under "Open" with where it was seen.
   Skip one-offs and anything already written somewhere.
3. Promote an entry only if it happened at least twice or caused real damage,
   and it is verified (you saw it in code, output or a report). Put it in the
   ONE place that fits, then delete it from Open and log it under "Promoted":
   - rule for certain files: `.claude/rules/<topic>.md`
   - how one agent works: `.claude/agents/<agent>.md`
   - a repeated procedure: the relevant skill
   - a hard rule for everyone: `CLAUDE.md` (keep it under about 80 lines)
4. Delegation check: did any helper come back partial because the model was
   too weak, or waste effort on a task the main session could have done in a
   minute? Note it, and adjust section 2 of `worktree-workflow` if it repeats.
5. Duplication check: `grep` the new wording across CLAUDE.md, AGENTS.md,
   `.claude/rules`, `.claude/agents`, skills. One home per rule.
6. Commit the changes on their own with a message starting "Agents:".
