import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\./.test(name)) out.push(p);
  }
  return out;
}
const files = walk(root);
const rel = (p: string) => path.relative(root, p);

describe("account rules on every write", () => {
  it("server actions never read the Supabase user directly (that skips paused, ended and other-device checks)", () => {
    const allowed = new Set(["lib/auth/actions.ts"]); // sign-in and sign-out themselves
    const bad = files.filter((f) => {
      const s = readFileSync(f, "utf8");
      return /^["']use server["']/m.test(s) && /auth\.getUser\(\)/.test(s) && !allowed.has(rel(f));
    });
    expect(bad.map(rel)).toEqual([]);
  });

  it("scores, passport events and streaks are written with the server key, never the student's", () => {
    const tables = ["quiz_attempts", "mse_attempts", "osce_attempts", "formulation_attempts", "competency_events", "streaks", "card_reviews"];
    const bad: string[] = [];
    for (const f of files) {
      const s = readFileSync(f, "utf8");
      for (const t of tables) {
        const re = new RegExp(`supabase\\s*\\.from\\("${t}"\\)\\s*\\.(insert|update|upsert)`);
        if (re.test(s)) bad.push(`${rel(f)}: ${t}`);
      }
    }
    // clinic/complete names its server client `supabase`; it must be the admin one.
    const clinic = readFileSync(path.join(root, "app/api/practice/clinic/complete/route.ts"), "utf8");
    expect(clinic).toMatch(/const supabase = createAdminClient\(\)/);
    expect(bad.filter((b) => !b.startsWith("app/api/practice/clinic/complete"))).toEqual([]);
  });

  it("the database step covers the wall, doubts, hand-ins and the score tables", () => {
    const sql = readFileSync(path.resolve(root, "../supabase/migrations_pending/2026_11_22_status.sql"), "utf8");
    for (const t of ["wall_posts", "wall_replies", "wall_reactions", "wall_reports", "doubts", "doubt_replies", "submissions", "submission_files"]) expect(sql).toContain(`'${t}'`);
    for (const t of ["quiz_attempts", "osce_attempts", "competency_events", "streaks"]) expect(sql).toContain(`'${t}'`);
    expect(sql).toMatch(/as restrictive/);
    expect(sql).not.toMatch(/drop policy if exists (?!%I)/i);
  });
});
