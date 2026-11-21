# Agent learnings

A short holding list for lessons about how helpers and the main session work in
this repo. It is not loaded into every session; the `learnings-review` skill
reads it after each round.

Promotion rule: an entry moves into a real config file only when it happened at
least twice (or once with real damage) AND it was verified. It then lives in
exactly one place (rule, agent file, skill, or CLAUDE.md) and is removed from
Open. Never paste every observation into CLAUDE.md.

Format: `YYYY-MM-DD | seen in | lesson | proposed home`

## Open

- 2026-11-22 | orchestr audit | Turbopack fails in worktrees because packages are symlinked; use `next dev --webpack` | already in CLAUDE.md
- 2026-11-22 | orchestr audit | A Stop or SubagentStop hook that keeps sessions going can hijack helpers and stop them returning their report | docs/agents/README.md (hooks section)

## Promoted

- 2026-11-22 | heavy-check lock, SQL-to-pending, video rule, react-dom/server rule, owner text rules, design precedence | moved from the session scratchpad into CLAUDE.md, `.claude/rules/`, `scripts/agents/gate.sh`
