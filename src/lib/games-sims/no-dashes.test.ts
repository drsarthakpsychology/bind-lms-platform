import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Student-facing text in the second-wave games never uses em or en dashes (they read as machine-written). */
const ROOTS = ["src/lib/games-sims", "src/app/(dashboard)/games/mse", "src/app/(dashboard)/games/ward", "src/app/(dashboard)/games/rx", "src/app/(dashboard)/games/escape", "src/app/(dashboard)/games/comorbid"];
const DASH = new RegExp("[\\u2013\\u2014]");

function files(dir: string): string[] {
  let out: string[] = [];
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const n of names) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out = out.concat(files(p));
    else if (/\.(ts|tsx)$/.test(n) && !/\.test\.tsx?$/.test(n)) out.push(p);
  }
  return out;
}

describe("games2 copy", () => {
  it("has no em or en dashes", () => {
    const bad: string[] = [];
    for (const r of ROOTS)
      for (const f of files(join(process.cwd(), r))) {
        readFileSync(f, "utf8")
          .split("\n")
          .forEach((line, i) => {
            if (DASH.test(line)) bad.push(`${f.replace(process.cwd(), "")}:${i + 1}`);
          });
      }
    expect(bad).toEqual([]);
  });
});
