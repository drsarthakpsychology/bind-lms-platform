---
name: worktree-workflow
description: How the main session splits a job across helpers in this repo. Use when a request has several independent parts, needs code changes plus independent review, or would flood the main context with search output. Covers choosing the agent and model, making a worktree per builder, writing the brief, running in parallel or in order, reviewing, and merging.
---

# Splitting work across helpers

## 1. Decide whether to delegate at all

Do it yourself when the change is small (a few files, one area) or when you
need the context you already have. Delegate when:
- a search or audit would pour lots of output into your context (auditor, or
  the built-in Explore agent for plain file finding);
- parts are independent and each owns different files (one builder each);
- a change needs a second pair of eyes (verifier, clinical-checker, visual-qa).

Roster and reasons: `docs/agents/README.md`.

## 2. Choose the model per task (pass it on the call)

The agent file sets a sensible default; pass `model` on the call when the task
needs something else. Use the aliases the installed version supports
(`haiku`, `sonnet`, `opus`, `fable`, `inherit`):
- `haiku`: mechanical reading, listing, counting, simple checks.
- `sonnet`: routine builds, reviews, screenshot checks, most audits.
- `opus`: subtle bugs, security or data-loss risk, clinical accuracy, changes
  that cross many files or the web app and the mobile app together.
- `fable`: only for the hardest long, open-ended work, when available.
Start cheaper; move up a level when a helper comes back `partial` because the
task was harder than expected.

## 3. One worktree and branch per builder

From the main checkout:

    bash scripts/agents/new-worktree.sh <name> [base-branch]

This makes `../wt-<name>` on `agent/<name>` and shares installed packages by
symlink. Give each builder a set of files or an area nobody else owns this
round. If two parts must touch the same file, run them in order, not together.

## 4. Write the brief to a file

Put round-wide rules once in a shared brief file and per-builder detail in a
short file of its own; point the helper at both. A brief says:
- goal in one sentence, and what "done" looks like;
- worktree path, branch, files or area owned;
- how to check (`bash scripts/agents/gate.sh ...` commands);
- commit attribution lines to use; "do not push";
- the report block from CLAUDE.md.

## 5. Parallel or in order

- Parallel: independent areas, read-only audits, reviews of different branches.
  Heavy checks still queue on the lock, so more than about four builders at
  once mostly waits.
- In order: research, then build, then verify; schema (pending SQL) before the
  code that uses it; anything that edits the same files.

## 6. Review and merge

1. Read each report. `partial` or `blocked` is a result, not a failure to hide:
   decide to re-brief, re-run on a stronger model, or park it.
2. Run `verifier` on each finished branch (it did not write the code). Add
   `clinical-checker` for clinical or quiz content, `visual-qa` for UI.
3. Merge in the main checkout, one branch at a time; re-run `gate.sh tsc` after
   a merge that touched shared files.
4. Pending SQL stays in `supabase/migrations_pending/` and goes to the owner.
5. Tell the owner in plain English what changed, what was checked, what is left.

## 7. After the round

Run the `learnings-review` skill.
