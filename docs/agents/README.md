# How Claude Code is set up in this repo

For the owner and for future sessions. Checked against Claude Code 2.1.330 and
the official docs at code.claude.com (subagents, agent teams, model config,
memory, skills, hooks, permissions, settings, worktrees), November 2026.

## The shape

One main session plans and decides. It hands self-contained pieces to helper
agents, each with a fixed job, and every helper sends back the same short
report (defined once in `CLAUDE.md`). Builders work in their own git worktree
and branch; the main session reviews and merges. Plain subagents, not "agent
teams": teams are experimental, cost more, and turn named helpers into
teammates once switched on. Our work is mostly "do this, report back".

## Where each thing lives

| What | Where | Loaded |
|---|---|---|
| Hard rules, report shape | `CLAUDE.md` (imports `AGENTS.md`) | every session and helper |
| Next.js note, design pointer | `AGENTS.md` | via CLAUDE.md |
| Student text rules | `.claude/rules/student-text.md` | when matching files are read |
| Design precedence | `.claude/rules/design.md` | when UI files are read |
| Database rule | `.claude/rules/database.md` | when `supabase/` is read |
| Video rule | `.claude/rules/video.md` | when video code is read |
| Helper roles | `.claude/agents/*.md` | names and descriptions always; body when used |
| How to split work | `.claude/skills/worktree-workflow` | when invoked |
| After-round review | `.claude/skills/learnings-review` | when invoked |
| Heavy-check lock | `scripts/agents/gate.sh` | run by hand |
| New worktree | `scripts/agents/new-worktree.sh` | run by hand |
| Permissions | `.claude/settings.json` | every session |
| Lessons waiting | `docs/agents/LEARNINGS.md` | only by the review skill |

## The helpers and why each exists

| Agent | Job | Can edit? | Default model | Why it exists |
|---|---|---|---|---|
| built-in `Explore` | find files, quick answers | no | built-in | cheapest way to search without filling the main context |
| `auditor` | investigate, trace, audit an area | no | sonnet | judgement-heavy reading with file:line findings |
| `builder` | one scoped change in its own worktree | yes | inherit | the only role that writes code; isolated by worktree |
| `verifier` | review a branch it did not write, run checks | no | sonnet | the person who wrote the code should not grade it |
| `clinical-checker` | accuracy of drug, diagnosis, case and quiz content | no | opus | wrong clinical facts are the costliest mistake here |
| `visual-qa` | screenshots at phone and desktop, light and dark | screenshots only | sonnet | design must be checked on real renders |

The seven old design agents were removed: they repeated the skills they loaded,
described the old peach/cream palette that `vibha-design` now overrides, and
one (quality-gate) ran a full `next build`, which the memory rule forbids. Their
work is now: builder + `vibha-design` (+ the reference skills) to make, and
visual-qa + verifier to check. They are in git history if ever wanted.

## How the model is chosen

Order (from the docs): the `model` passed on the call, then the agent file's
`model`, then `CLAUDE_CODE_SUBAGENT_MODEL`, then the main session's model. The
agent files hold a default that fits the role; the main session overrides per
call when the task is easier or harder (guide in `worktree-workflow`, step 2).
Aliases used: `haiku`, `sonnet`, `opus`, `fable`, `inherit`, which follow the
newest model your account offers. Builders inherit, so the main session decides
per task.

## Parallel or in order

Parallel when areas and files do not overlap; in order when one step needs
another's output or two steps touch the same file. Heavy checks always queue on
one lock (`gate.sh`) because the machine has about 7 GB shared.

## Safety settings (what changed and why)

- Removed `"defaultMode": "bypassPermissions"`: the docs say a project file can
  no longer set it (since 2.1.257), so it did nothing, and it read as if every
  check were off.
- Removed allow rules for `git push`, `vercel`, `supabase db push`, `psql`.
  They are now "ask" rules, so they always need a human yes. Builds of the app
  (`eas build`) also ask.
- Added deny rules: reading or editing `.env` files (the `.env.example`
  template stays readable), key files, `~/.ssh`, `~/.aws`, the student roster
  CSV, and full `next build` / `npm run build`.
- Removed the hook that auto-approved every web fetch (the allow list already
  covers it, and the hook hid it from review).
- The remaining broad allows (`Bash`, `Edit`, `WebFetch`, ...) were already
  there; nothing was widened.
- Plugins already enabled were left as they were; no MCP servers or plugins
  were added. Two of them (42crunch-api-security-testing, data-engineering) are
  switched on in settings but not installed, so Claude prints a warning; they
  do nothing until installed.
- Allow rules from this file only apply once the folder is trusted. Until
  someone opens Claude Code interactively in the main checkout and accepts the
  trust question, headless runs print "Ignoring 11 permissions.allow entries".
  Deny and ask rules apply either way.

## Hooks: removed, and why

- `keep-going.sh` (Stop and SubagentStop): blocked every stop while QUEUE.md
  had unchecked items (46 on 22 Nov), with a 500-continue cap. Because it also
  ran on SubagentStop, every helper was told "you are not finished, next task
  T208" instead of returning its report. It ignored `stop_hook_active`, told
  agents to run a full build, and wrote to NIGHT_LOG.md in the repo. Loop risk
  and hijacking: removed.
- `survive-compact.sh` (PreCompact) and the SessionStart hook: wrote and
  re-injected a "never stop, never ask, you have full authority, invent more
  work" directive after every compaction. That overrides the owner's current
  rules: removed.
- `bootstrap-neverstop.sh`, `run-all-night.sh` and `setup-once.sh` at the repo
  root still contain those hooks and launch Claude with
  `--dangerously-skip-permissions`. They were not changed (outside this
  task); do not run them unless you want that mode back.

No hooks are configured now. If one is wanted later, keep it a small local
script that reads stdin JSON, never evals it, makes no network calls, checks
`stop_hook_active` on Stop events, and exits 0 on anything unexpected.

## What was tested (22 Nov 2026, Claude Code 2.1.330)

- All agent, rule and skill frontmatter parses as YAML; names match files.
- `.claude/settings.json` is valid JSON and passes the published settings
  schema (the old file failed it: the tool name `Task` is now `Agent`).
- A fresh headless session listed all five agents and picked the right one for
  five sample tasks, and repeated the hard rules.
- Deny rules, checked with the project rules file hidden so only settings
  decide: Read `.env` blocked, `.env.example` allowed, `npm run build` blocked,
  `echo` allowed. `git push` needed approval.
- Two auditors started in parallel in one message, each on the model passed
  on the call, and both returned the report block unchanged.
- An auditor with no model passed ran on its file default (sonnet) while the
  main session ran on haiku.
- An auditor asked to edit a file reported `STATUS: blocked` and changed
  nothing (git status clean).
- `gate.sh` takes the lock and runs; bad input exits 2. `new-worktree.sh` made
  and linked a worktree, which was then removed.
- The removed `keep-going.sh`, fed a finished helper's stop event, exited 2
  with "You are not finished ... NEXT TASK: T208": the hijack is real.

Not tested end to end: a full builder, then verifier, then merge round; the
clinical-checker and visual-qa agents on real content (their definitions load
and were routed to correctly).

## Optional, not switched on

- Agent teams: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Useful for a debate
  between reviewers; costs several times more.
- `isolation: worktree` in an agent file: Claude makes the worktree itself under
  `.claude/worktrees/`, branched from the default branch, without our
  node_modules symlinks. We use `new-worktree.sh` instead so builders start from
  the branch we choose with packages ready.
- `"permissions": {"disableBypassPermissionsMode": "disable"}` in your own
  user settings, if you want to make skip-permissions impossible on this machine.

## How to inspect and manage

- See the helpers: type `/agents` in Claude Code.
- See which settings files loaded: `/status`. Problems in them: `claude doctor`.
- See which rule files loaded: `/memory`.
- Change a helper: edit its file in `.claude/agents/`.
- Add a rule for some files: a new `.md` in `.claude/rules/` with `paths:`.
- After each round: ask for "learnings review".
