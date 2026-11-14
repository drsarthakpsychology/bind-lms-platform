/**
 * Guard: no browser code may import a game's answer key.
 *
 * Every "use client" file is walked through its static imports (type-only
 * imports are dropped by the compiler, and a "use server" file is only a
 * reference in the browser, so the walk stops at both). If any chain reaches
 * one of the modules below, the answers would ship in the page's JavaScript.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve(import.meta.dirname, "../..");

/** Modules that hold answers, explanations or hints. Server code only. */
const FORBIDDEN: { game: string; re: RegExp }[] = [
  { game: "Clinic detective", re: /^lib\/learn\/detective(-deal|-server)?\.ts$/ },
  { game: "Escape Room", re: /^lib\/games-sims\/escape\/(rooms(-[a-z]+)?|deal)\.ts$/ },
  { game: "Rx Detective", re: /^lib\/games-sims\/rx\/(content|drugs|mysteries|puzzles(-[a-z]+)?|reviews(-[a-z]+)?|game|deal|server|med-pages)\.ts$/ },
];

const EXT = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

function resolve(from: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(from), spec);
  else return null;
  for (const e of EXT) {
    const f = base + e;
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

const directive = (src: string, d: string) => new RegExp(`^(\\s*(//[^\\n]*\\n|/\\*[\\s\\S]*?\\*/))*\\s*["']${d}["']`).test(src);

/** Value imports of a file (type-only imports and re-exports are left out). */
function valueImports(src: string): string[] {
  const out: string[] = [];
  const stmt = /(?:^|\n)\s*(import|export)\s+([^;]*?)\s*from\s*["']([^"']+)["']/g;
  for (const m of src.matchAll(stmt)) {
    const clause = m[2].trim();
    if (/^type\b/.test(clause)) continue;
    const braces = clause.match(/^\{([\s\S]*)\}$/);
    if (braces) {
      const names = braces[1].split(",").map((x) => x.trim()).filter(Boolean);
      if (names.length && names.every((n) => /^type\s/.test(n))) continue;
    }
    out.push(m[3]);
  }
  for (const m of src.matchAll(/(?:^|\n)\s*import\s*["']([^"']+)["']/g)) out.push(m[1]);
  for (const m of src.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)) out.push(m[1]);
  return out;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (/\.(ts|tsx)$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) out.push(f);
  }
  return out;
}

const rel = (f: string) => path.relative(SRC, f).split(path.sep).join("/");

/** The first chain from `entry` to a forbidden module, or null. */
function leak(entry: string, cache: Map<string, string>): string[] | null {
  const seen = new Set<string>();
  const stack: { file: string; chain: string[] }[] = [{ file: entry, chain: [rel(entry)] }];
  while (stack.length) {
    const { file, chain } = stack.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    if (FORBIDDEN.some((x) => x.re.test(rel(file)))) return chain;
    let src = cache.get(file);
    if (src === undefined) {
      src = fs.readFileSync(file, "utf8");
      cache.set(file, src);
    }
    if (file !== entry && directive(src, "use server")) continue;
    for (const spec of valueImports(src)) {
      const to = resolve(file, spec);
      if (to && !seen.has(to)) stack.push({ file: to, chain: [...chain, rel(to)] });
    }
  }
  return null;
}

describe("answer keys stay out of browser code", () => {
  const files = walk(SRC);
  const cache = new Map<string, string>();
  const clients = files.filter((f) => directive(fs.readFileSync(f, "utf8"), "use client"));

  it("finds the browser files and the answer modules", () => {
    expect(clients.length).toBeGreaterThan(100);
    for (const x of FORBIDDEN) expect(files.some((f) => x.re.test(rel(f))), x.game).toBe(true);
  });

  it("the walk does follow imports (a server file reaches the rooms)", () => {
    expect(leak(path.join(SRC, "lib/games-sims/escape/deal.ts"), cache)).not.toBeNull();
    expect(leak(path.join(SRC, "lib/hints/resolve.ts"), cache)).not.toBeNull();
  });

  it("drops type-only imports and keeps value imports", () => {
    expect(valueImports(`import type { Room } from "./rooms";\nimport { type A, type B } from "./x";\nexport type { C } from "./y";`)).toEqual([]);
    expect(valueImports(`import { STAGE_LABEL, type Stage } from "./types";\nexport { ROOMS } from "./rooms";\nimport "./side";`)).toEqual(["./types", "./rooms", "./side"]);
  });

  it("no 'use client' file imports an answer key", () => {
    const bad = clients.map((f) => leak(f, cache)).filter((c): c is string[] => !!c);
    expect(bad.map((c) => c.join(" -> "))).toEqual([]);
  });
});
