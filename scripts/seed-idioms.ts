#!/usr/bin/env tsx
/**
 * Seed the idioms bank into the database (v5 Part 1, §1.3).
 *
 *   npm run seed-idioms
 *
 * Reads IDIOMS from src/lib/decode/idioms.ts (the canonical bank — 65+
 * entries) and upserts them into public.idioms with approved=false so they
 * land in the admin queue for review.
 *
 * Idempotent: each entry's stable slug `id` becomes the row id, so a re-run
 * updates the row rather than duplicating.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (in .env.local).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  if (existsSync(".env.local")) {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) out[m[1]] = m[2].trim();
    }
  }
  return { ...process.env, ...out } as Record<string, string>;
}

// Hand-rolled loader so this script doesn't have to compile the whole app
// (the idioms file is pure data — no ts-only deps in its surface types).
function loadIdioms(): Array<{
  id: string;
  phrase: string;
  register: string[];
  possible_meanings: Array<{ reading: string; likelihood: "high" | "medium" | "low"; clue?: string; physical?: boolean }>;
  disambiguating_questions: string[];
  trap: string;
  sources: string[];
}> {
  const src = readFileSync("src/lib/decode/idioms.ts", "utf8");
  const re = /\{\s*id:\s*"([a-z0-9-]+)",\s*phrase:\s*"((?:[^"\\]|\\.)*)",([\s\S]*?)\n\s*\},/g;
  const out: Array<{
    id: string;
    phrase: string;
    register: string[];
    possible_meanings: Array<{ reading: string; likelihood: "high" | "medium" | "low"; clue?: string; physical?: boolean }>;
    disambiguating_questions: string[];
    trap: string;
    sources: string[];
  }> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const id = m[1];
    const phrase = m[2].replace(/\\(.)/g, "$1");
    const body = m[3];
    // register: ["Hindi", "all ages", "very common"]
    const regM = body.match(/register:\s*\[([^\]]*)\]/);
    const register = regM
      ? regM[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      : [];
    // possible_meanings: [{ reading: "...", likelihood: "...", clue: "..." }, ...]
    const pmM = body.match(/possible_meanings:\s*\[([\s\S]*?)\n\s*\],/);
    const possible_meanings = pmM
      ? Array.from(pmM[1].matchAll(/reading:\s*"((?:[^"\\]|\\.)*)"\s*,\s*likelihood:\s*"(high|medium|low)"(?:,\s*clue:\s*"((?:[^"\\]|\\.)*)")?(?:,\s*physical:\s*(true))?/g)).map(
          (x) => ({
            reading: x[1].replace(/\\(.)/g, "$1"),
            likelihood: x[2] as "high" | "medium" | "low",
            clue: x[3] ? x[3].replace(/\\(.)/g, "$1") : undefined,
            physical: x[4] === "true" || undefined,
          }),
        )
      : [];
    // disambiguating_questions: ["...", "..."]
    const dqM = body.match(/disambiguating_questions:\s*\[([\s\S]*?)\],/);
    const disambiguating_questions = dqM
      ? Array.from(dqM[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)).map((x) => x[1].replace(/\\(.)/g, "$1"))
      : [];
    // trap: "..."
    const trapM = body.match(/trap:\s*"((?:[^"\\]|\\.)*)"/);
    const trap = trapM ? trapM[1].replace(/\\(.)/g, "$1") : "";
    // sources: ["...", "..."]
    const srcM = body.match(/sources:\s*\[([^\]]*)\]/);
    const sources = srcM
      ? srcM[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      : [];
    out.push({ id, phrase, register, possible_meanings, disambiguating_questions, trap, sources });
  }
  return out;
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const idioms = loadIdioms();
  console.log(`Loaded ${idioms.length} idioms from src/lib/decode/idioms.ts`);

  const admin = createClient(url, key, { auth: { persistSession: false } });

  const rows = idioms.map((i) => ({
    phrase: i.phrase,
    register: i.register,
    possible_meanings: i.possible_meanings as unknown as Array<Record<string, unknown>>,
    disambiguators: i.disambiguating_questions,
    trap: i.trap,
    sources: i.sources,
    approved: false, // admin queue — promote with /admin/idioms
  }));

  // Upsert by phrase+trap so re-runs don't dup rows.
  let inserted = 0;
  let updated = 0;
  for (const row of rows) {
    const { data: existing } = await admin
      .from("idioms")
      .select("id")
      .eq("phrase", row.phrase)
      .eq("trap", row.trap)
      .maybeSingle();
    if (existing) {
      const { error } = await admin.from("idioms").update(row).eq("id", existing.id);
      if (error) {
        console.error("  ✗ update", row.phrase, error.message);
        continue;
      }
      updated++;
    } else {
      const { error } = await admin.from("idioms").insert(row);
      if (error) {
        console.error("  ✗ insert", row.phrase, error.message);
        continue;
      }
      inserted++;
    }
  }

  const { count } = await admin.from("idioms").select("id", { count: "exact", head: true });
  console.log(`Upserted: +${inserted} inserts, ~${updated} updates. Total in bank: ${count}.`);
  console.log("All entries land approved=false — review at /admin/idioms (or promote in bulk).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
