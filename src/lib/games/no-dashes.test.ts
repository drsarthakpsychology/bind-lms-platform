import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Owner rule (2026-11-06): no em or en dashes in student text; they read as
 * AI-written. The games and their content (cases, clues, explanations, UI
 * strings) are kept free of both everywhere, comments included, so the check
 * stays simple and nothing slips through a string.
 */
const ROOTS = ["src/app/(dashboard)/games", "src/app/(dashboard)/practice/daily", "src/app/(dashboard)/practice/detective", "src/app/(dashboard)/practice/scenarios", "src/app/(dashboard)/practice/terms", "src/lib/games", "src/components/learn", "src/lib/learn"];
const DASH = /[\u2013\u2014]/g;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return files(p);
    return /\.(tsx?|css)$/.test(name) ? [p] : [];
  });
}

describe("games have no em or en dashes", () => {
  for (const root of ROOTS) {
    it(root, () => {
      const hits: string[] = [];
      for (const f of files(join(process.cwd(), root))) {
        const text = readFileSync(f, "utf8");
        for (const m of text.matchAll(DASH)) hits.push(`${f.slice(process.cwd().length + 1)}: ${text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, " ")}`);
      }
      expect(hits).toEqual([]);
    });
  }
});
