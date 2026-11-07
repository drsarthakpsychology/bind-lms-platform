import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Owner rule (2026-11-06): nothing a student or staff member reads may contain
 * an em dash or an en dash; they read as AI-written. This guard covers the app,
 * components and lib code (strings and comments alike, so nothing slips
 * through). Every folder is covered, including games and medicines.
 *
 * Code that must still recognise a dash in incoming text (stored titles, model
 * output) writes it as an escape: — or –.
 */
const ROOTS = ["src/app", "src/components", "src/lib"];
const SKIP: string[] = [];
const DASH = /[–—]/g;

const cwd = process.cwd();
const rel = (p: string) => relative(cwd, p).split(sep).join("/");
const skipped = (p: string) => SKIP.some((s) => rel(p) === s || rel(p).startsWith(`${s}/`));

function files(dir: string): string[] {
  if (skipped(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return files(p);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [p] : [];
  });
}

describe("app, components and lib have no em or en dashes", () => {
  for (const root of ROOTS) {
    it(root, () => {
      const hits: string[] = [];
      for (const f of files(join(cwd, root))) {
        const text = readFileSync(f, "utf8");
        for (const m of text.matchAll(DASH)) {
          const line = text.slice(0, m.index).split("\n").length;
          hits.push(`${rel(f)}:${line}: ${text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, " ")}`);
        }
      }
      expect(hits).toEqual([]);
    });
  }
});
