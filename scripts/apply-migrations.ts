#!/usr/bin/env tsx
/**
 * apply-migrations — apply pending SQL migrations to the Supabase database.
 *
 *   npm run apply-migrations
 *
 * Connects via the Supabase pooler (session mode) using the db.<ref> hostname
 * as the SSL SNI so the pooler can route to the right tenant. The hostname
 * resolves (via /etc/hosts) to the pooler IP, so it works even when the
 * db.<ref> upstream DNS record is flaky.
 *
 * Env: SUPABASE_DB_PASSWORD (or use --password), or SUPABASE_DB_URL.
 * Idempotent: each migration is wrapped so it can be re-run safely.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

const REF = "hojhzwvuccojqkvkkslw";

// Read the password from the environment or .env.local (never from a CLI arg,
// which would leak it into shell history/logs).
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

async function main() {
  if (!DB_PASS) {
    console.error("Usage: npm run apply-migrations -- <db-password>  OR  set SUPABASE_DB_PASSWORD");
    process.exit(1);
  }

  // The direct host (db.<ref>.supabase.co) is what the user's connection
  // string uses; it identifies the tenant via SNI automatically. It now
  // resolves via /etc/hosts to the pooler IP, so connecting by this hostname
  // routes to the pooler even when upstream DNS is flaky.
  const host = `db.${REF}.supabase.co`;
  const user = "postgres";
  console.log(`Connecting to ${host}:5432 as ${user} …`);

  const client = new Client({
    host,
    port: 5432,
    user,
    password: DB_PASS,
    database: "postgres",
    ssl: {
      rejectUnauthorized: false,
      // Send the direct host as SNI so the pooler routes to the tenant.
      servername: host,
    },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  console.log("Connected.\n");

  const dir = "supabase/migrations_pending";
  // The migrations to apply. Kept explicit (not "apply everything in the dir")
  // so an unapproved file can't silently run against production. This run:
  // the roster/email/blocked/calibration feature set.
  const APPROVED = [
    "profiles_access_scope.sql",
    "credential_invites.sql",
    "credential_invites_password.sql",
    "profiles_status_blocked.sql",
    "calibration_auto_signals.sql",
    "videos_bucket.sql",
    "flags_lesson_status.sql",
  ];
  const files = APPROVED.filter((f) => existsSync(join(dir, f)));
  console.log(`Applying ${files.length} approved migrations: ${files.join(", ")}`);

  // Track which migration IDs are already applied (for idempotency).
  await client.query(`
    create table if not exists _migrations_applied (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  for (const file of files) {
    // node-postgres returns `{ rows }`, not `{ data }`. The prior `{ data }`
    // destructure yielded `undefined`, and `already.length` threw the bare
    // "Cannot read properties of undefined (reading 'length')" crash with no
    // migration name. Guard every step and name the file on any failure.
    let rows: Array<unknown>;
    try {
      const res = await client.query("select 1 from _migrations_applied where name = $1", [file]);
      rows = res.rows ?? [];
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  ❌ ${file} — could not check applied state: ${msg}`);
      process.exitCode = 1;
      continue;
    }

    if (rows.length) {
      console.log(`  ⏭  ${file} — already applied`);
      continue;
    }

    const sql = readFileSync(join(dir, file), "utf8");
    console.log(`  ▶  ${file} …`);
    try {
      await client.query(sql);
      await client.query("insert into _migrations_applied (name) values ($1)", [file]);
      console.log(`     ✅ applied`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`     ❌ ${file} failed: ${msg.slice(0, 400)}`);
      process.exitCode = 1;
    }
  }

  console.log("\nDone.");
  await client.end();
}

main().catch((e) => {
  console.error("Fatal:", e instanceof Error ? e.message : e);
  process.exit(1);
});
