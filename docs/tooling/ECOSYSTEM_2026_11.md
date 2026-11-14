# Tools ecosystem review (November 2026)

Written 2026-11-14 on branch `agent/eco`. Stars and dates are from the GitHub and npm registries on that day.

Rule used: pick a tool only if it is free, well kept, fits Next.js 16 + React 19 + Supabase + Vercel, and adds something we do not already have.

Verdicts: **Installed** (done in this branch), **Add** (owner adds to their Claude, free), **Already have**, **Skip**.

## 1. Claude Code plugins and skills

Source: the official marketplace `anthropics/claude-plugins-official` (47,259 stars, Apache-2.0, 317 plugins). Plugins run inside Claude Code; they do not touch the app.

| Plugin | What it does | Verdict |
|---|---|---|
| `typescript-lsp` | Real TypeScript "go to definition" and errors for Claude | **Add.** Cheaper and more exact than grep on a big codebase. Free. |
| `playwright` | Microsoft Playwright MCP (39,632 stars, Apache-2.0, npm `@playwright/mcp` 0.0.85) | **Add.** Lets Claude click through `next dev` like a user. We already use Playwright, so no new skills needed. |
| `chrome-devtools-mcp` | Google's DevTools MCP (55,977 stars, Apache-2.0, 1.13.0) | **Add.** Performance traces, network and console from a real Chrome. Best free way to find slow pages. |
| `context7` | Up to date library docs (64,791 stars, MIT) | **Add with a free key.** Without a key the shared quota runs out (we got "Monthly quota exceeded"). Next.js docs already ship in `node_modules/next/dist/docs`, so it helps most for Supabase, motion and Radix. |
| `security-guidance` | Warns on risky code while Claude edits, reviews the diff | **Add.** Free, local. |
| `code-review`, `pr-review-toolkit` | Multi agent review of a change | **Add one** (`pr-review-toolkit`). Do not add both. |
| `supabase`, `vercel`, `sentry`, `github` | Official MCPs | **Already have** Supabase and Vercel as connectors and Sentry in the app. GitHub MCP (34,454 stars, MIT) is worth adding only if you want Claude to open issues and PRs. |
| `semgrep` | Security scanner plugin | **Skip for now.** Needs a Semgrep login for the plugin; gitleaks and osv-scanner below cover secrets and dependencies. |
| `expo` | Official Expo skills | **Later**, for the native app phase only. |
| `serena` | Code navigation MCP (31,373 stars) | **Skip.** `typescript-lsp` does the same for TypeScript with less setup. |
| `frontend-design` | Design skill | **Already have** (plus `vibha-design`, `impeccable`, `no-ui-slop`). |

Codebase context tools:

| Tool | Stars | Verdict |
|---|---|---|
| repomix (`yamadashy/repomix`, MIT, 1.19.0) | 29,267 | **Skip.** Packs a repo into one file for chat apps. Claude Code reads files directly; packing this repo would also bundle content we do not want sent anywhere. |
| Next.js `next-bundle-optimizer` skill (`npx skills add vercel/next.js --skill next-bundle-optimizer`) | part of next.js | **Add** when doing bundle work. Uses the built in `next analyze` data. |

## 2. MCP servers vs what we have

| Server | We have? | Verdict |
|---|---|---|
| Supabase (`https://mcp.supabase.com/mcp`) | Yes, in `.mcp.json` and as a connector | Keep. Used for the advisors run below. |
| Vercel | Yes, connector | Keep. |
| Playwright MCP | No | Add (above). |
| Chrome DevTools MCP | No | Add (above). |
| Context7 | No | Add with free key. |
| Sentry MCP (`@sentry/mcp-server` 0.49.0, FSL licence) | No | **Optional.** Free with our Sentry account. Useful to read production errors from Claude. Error reports can hold user emails; keep it to the owner's own Claude. |
| GitHub MCP | No | Optional. |

## 3. Accessibility

| Tool | Stars | Licence | Last release | Verdict |
|---|---|---|---|---|
| axe-core | 7,818 | MPL-2.0 | 4.14.0, 2026-11-13 | Engine behind the others. Already in the lockfile through ESLint. |
| `@axe-core/playwright` | 737 | MPL-2.0 | 4.14.0, 2026-11-06 | **Installed** (dev only). Fits our Playwright setup exactly. |
| pa11y / pa11y-ci | 4,599 | LGPL-3.0 | 10.0.0, 2026-10-09 | **Skip.** Uses the same axe rules through its own browser; a second runner adds nothing. |

## 4. Visual regression

| Tool | Verdict |
|---|---|
| Playwright `toHaveScreenshot()` | **Already have** (built into `@playwright/test`). Use it before adding anything. |
| lost-pixel (1,678 stars, MIT) | **Skip.** Last npm release 2024-11-14, a year old. |
| Chromatic, Percy, Argos | **Skip.** Paid above small free tiers, and they upload screenshots of student pages to a third party. |

## 5. Performance

| Tool | Stars | Verdict |
|---|---|---|
| `next analyze` (built into Next.js 16.1+) | | **Installed as a script** (`npm run analyze`). Reads Turbopack's module graph, writes to `.next/diagnostics/analyze`. Replaces `@next/bundle-analyzer`, which only works with webpack builds. |
| `@next/bundle-analyzer` 16.4.6 | | **Skip.** Duplicate of `next analyze`. |
| Lighthouse CI (`@lhci/cli` 0.16.1) | 7,144 | **Later, in CI.** Needs a built app and a server; cannot run here under the memory rule. Vercel Speed Insights (already installed) gives real user numbers, which matter more. |
| size-limit | 7,049 | **Skip** until bundle budgets are agreed. |
| Chrome DevTools MCP | 55,977 | Add (above). |

## 6. Security

| Tool | Stars | Licence | Verdict |
|---|---|---|---|
| gitleaks 8.30.0 | 31,017 | MIT | **Ran once** (binary, nothing added to the repo). Checks code and all 1,003 commits for secrets. |
| osv-scanner 2.3.0 | 11,516 | Apache-2.0 | **Ran once.** Checks `package-lock.json` against the OSV database. Better than `npm audit` at showing which package pulls a bad version. |
| semgrep | 17,670 | LGPL-2.1 | Skip for now (see plugins). |
| `npm audit` | | | Already available. |

## 7. Dead code

| Tool | Verdict |
|---|---|
| knip (12,674 stars, ISC) | **Already have** (6.32.2 in devDependencies, `npm run knip`). Added `npm run knip:files` for just the unused files. Latest is 6.45.1; upgrade when convenient. |

## 8. Database

| Tool | Verdict |
|---|---|
| Supabase advisors (splinter lints) | **Ran once** through the Supabase MCP. Read only. Results in TOOL_RUNS. |
| `pg_stat_statements` | **Already on** (schema `extensions`). Read the top queries below. |
| `index_advisor` (1,709 stars, PostgreSQL licence) | Available on our project but **not enabled**. Enabling is a migration, so it is the owner's call. Low risk, free. |
| `hypopg` | Available, not enabled. Needed by index_advisor. |

## 9. Animation and components

| Library | We have? | Verdict |
|---|---|---|
| motion 12 (35,137 stars, MIT) | Yes (`motion` ^12.43.0) | Keep. |
| Radix primitives (19,500 stars, MIT) | Yes (`radix-ui` ^1.6.7) | Keep. |
| shadcn/ui (128,167 stars, MIT) | Yes (`components.json`, `src/components/ui/*`) | Keep. Several shadcn files are unused (accordion, form, popover, separator, table, tabs, tooltip): see KNIP_2026_11_14.md. |
| Any new UI kit | | **Skip.** Would fight the VIBHA design world. |

## 10. Docs generation

| Tool | Verdict |
|---|---|
| TypeDoc 0.28 (8,457 stars) | **Skip.** Our docs are written for people, not API references. |

## 11. AI tooling for the product

See [../research/AI_RELIABILITY_2026_11.md](../research/AI_RELIABILITY_2026_11.md). Short version: no new AI library. Fix a few bugs in `src/lib/ai/client.ts` and remove dead provider lanes.
