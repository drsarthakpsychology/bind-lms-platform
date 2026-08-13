#!/usr/bin/env tsx
/**
 * apply-pending — apply a named list of src/migrations_pending migrations to
 * the live Supabase database.
 *
 *   npx tsx scripts/apply-pending.ts mse_attempts_slug formulation_attempts_slug sct_items_slug
 *
 * Same connection + tracking as apply-migrations.ts (pg pooler, SNI), but for
 * the src/migrations_pending files that the APPROVED-list script doesn't
 * cover. Only runs the files you name. All migrations here are additive +
 * idempotent (IF NOT EXISTS / DO-block guarded). Password comes from
 * SUPABASE_DB_PASSWORD or .env.local — never from a CLI arg.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

const REF = "hojhzwvuccojqkvkkslw";
const DIR = "src/migrations_pending";

function loadEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    if (!existsSync(".env.local")) return undefined;
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(new RegExp(`^${name}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

const DB_PASS = loadEnv("SUPABASE_DB_PASSWORD");
const requested = process.argv.slice(2).filter((a) => a.endsWith(".sql") || !a.includes("."));
const names = requested.map((n) => (n.endsWith(".sql") ? n : `${n}.sql`));

async function main() {
  if (!DB_PASS || names.length === 0) {
    console.error("Usage: npx tsx scripts/apply-pending.ts <migration-name> [more...]  (needs SUPABASE_DB_PASSWORD)");
    process.exit(1);
  }

  const client = new Client({
    host: `db.${REF}.supabase.co`,
    port: 5432,
    user: "postgres",
    password: DB_PASS,
    database: "postgres",
    ssl: { rejectUnauthorized: false, servername: `db.${REF}.supabase.co` },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  console.log("Connected.\n");

  await client.query(`
    create table if not exists _migrations_applied (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  for (const file of names) {
    if (!existsSync(join(DIR, file))) {
      console.error(`  ✗ ${file} — not found in ${DIR}`);
      continue;
    }
    const { rows } = await client.query("select 1 from _migrations_applied where name = $1", [file]);
    if (rows.length) {
      console.log(`  ⏭  ${file} — already applied`);
      continue;
    }
    const sql = readFileSync(join(DIR, file), "utf8");
    console.log(`  ▶  ${file} …`);
    try {
      await client.query(sql);
      await client.query("insert into _migrations_applied (name) values ($1)", [file]);
      console.log(`     ✅ applied`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`     ❌ ${msg.slice(0, 300)}`);
    }
  }

  console.log("\nDone.");
  await client.end();
}

main().catch((e) => {
  console.error("Fatal:", e instanceof Error ? e.message : e);
  process.exit(1);
});
