import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vercel build output (generated, not source).
    ".vercel/**",
    // One-off knowledge-base build pipeline (PDF extraction, FDA fetch,
    // seeding). Developer tools that parse external data; not app code.
    "scripts/psychopharm/**",
    // Claude Code skill tooling (helper scripts for the auditing skill).
    ".claude/skills/**",
    // Local git worktrees (never linted in CI, but present locally).
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;
