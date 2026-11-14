# Tools installed

Last updated 2026-11-14 (branch `agent/eco`). Every tool here is free.

## In the project

### `@axe-core/playwright` 4.14.0 (devDependency)

- **Why:** finds accessibility problems (contrast, labels, keyboard, ARIA) on real pages. Uses the Playwright we already have. Licence MPL-2.0.
- **Added:** `package.json` devDependencies, `package-lock.json`, and the test `e2e/a11y.spec.ts`.
- **Side effect:** axe-core in the lockfile moves from 4.12.1 to 4.14.0 (it is shared with the ESLint accessibility plugin). Minor version, no breaking changes.
- **How to run:**
  1. `npm install` (once, to fetch it).
  2. Start the app: `npm run dev`.
  3. In a second terminal: `npm run test:a11y`.
  It uses the same test login as the other e2e tests (`E2E_EMAIL`, `E2E_PASSWORD`). It checks 10 pages at phone and desktop width and fails only on "serious" or "critical" problems.
- **How to remove:** `npm uninstall @axe-core/playwright`, delete `e2e/a11y.spec.ts`, and remove the `test:a11y` line from `package.json`.

### Script `npm run analyze`

- **Why:** shows what makes each page's JavaScript big. Uses `next analyze`, built into Next.js 16.1 and later. Nothing to install. We did **not** add `@next/bundle-analyzer` because it only works with webpack builds and does the same job.
- **How to run:** `npm run analyze` on your laptop (it builds the app, so it is heavy). The report is saved in `.next/diagnostics/analyze`. Not run in the agent containers (memory rule: no full builds).
- **How to remove:** delete the `analyze` line in `package.json`.

### Script `npm run knip:files`

- **Why:** lists files nothing imports. knip was already installed (`npm run knip`); this shows only the unused files and never fails.
- **How to run:** `npm run knip:files`. Results from 2026-11-14: [KNIP_2026_11_14.md](KNIP_2026_11_14.md).
- **How to remove:** delete the `knip:files` line in `package.json`.

## Run once, not added to the project

These ran from the agent scratchpad. Nothing was added to the repo. Results: [TOOL_RUNS_2026_11.md](TOOL_RUNS_2026_11.md).

| Tool | Version | What it checks | How to run it yourself |
|---|---|---|---|
| gitleaks | 8.30.0 | Passwords and keys in code and git history | Install from github.com/gitleaks/gitleaks/releases, then in the project folder: `gitleaks git --redact .` |
| osv-scanner | 2.3.0 | Known security issues in our packages | Install from github.com/google/osv-scanner/releases, then: `osv-scanner scan source --lockfile package-lock.json` |
| Supabase advisors | | Database security and speed warnings | Supabase dashboard, then **Advisors**. Or ask Claude: "run the Supabase security and performance advisors". |
| axe on the fixture harness | 4.14.0 | Accessibility of 15 student pages | Agents only: scratchpad `eco/scripts/axe-run.mjs` with the harness in `eco/harness`. |

## Design tools (MCP servers)

Nothing installed in the repo. See [DESIGN_MCP_SETUP.md](DESIGN_MCP_SETUP.md) to add the free ones to your own Claude, and [../design/REFERENCE_LIBRARY_2026_11.md](../design/REFERENCE_LIBRARY_2026_11.md) for what they found.

## Not installed on purpose

See [ECOSYSTEM_2026_11.md](ECOSYSTEM_2026_11.md) for the full list and reasons. In short: pa11y (same rules as axe), `@next/bundle-analyzer` (replaced by `next analyze`), lost-pixel (unmaintained), paid visual testing, repomix, hosted AI tracing (would store student data).
