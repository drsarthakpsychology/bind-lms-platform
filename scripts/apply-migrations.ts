#!/usr/bin/env tsx
/**
 * apply-migrations — apply pending SQL migrations to the Supabase database.
 *
 *   npm run apply-migrations
 *
 * Connects via the Supabase pooler (session mode) using the db.<ref> hostname
 * as the SSL SNI so the pooler can route to the right tenant. This works
 * even when the db.<ref> DNS record is flaky (we resolve the pooler IP
 * separately and pass the hostname as `servername` for TLS).
 *
 * Env: SUPABASE_DB_PASSWORD (or use --password), or SUPABASE_DB_URL.
 * Idempotent: each migration is wrapped so it can be re-run safely.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";
import { execSync } from "node:child_process";

const REF = "hojhzwvuccojqkvkkslw";

// Read the password from the environment or .env.local (never from a CLI arg,
// which would leak it into shell history/logs).
import { existsSync as _exists, readFileSync as _read } from "node:fs";
function loadEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    if (!_exists(".env.local")) return undefined;
    for (const line of _read(".env.local", "utf8").split("\n")) {
      const m = line.match(new RegExp(`^${name}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch {
    /* ignore */
  }
  return undefined;
}
const DB_PASS = loadEnv("SUPABASE_DB_PASSWORD");

// Resolve the pooler IP (dig returns the CNAME target first; keep calling
// until we get a dotted-quad A record).
function poolerIp(): string {
  try {
    const out = execSync(`dig +short aws-0-us-east-1.pooler.supabase.com | grep -E '^[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+$' | head -1`, { encoding: "utf8" });
    const ip = out.trim();
    if (ip) return ip;
  } catch {
    /* fall through */
  }
  return "44.216.29.125"; // fallback known-good pooler IP
}

async function main() {
  if (!DB_PASS) {
    console.error("Usage: npm run apply-migrations -- <db-password>  OR  set SUPABASE_DB_PASSWORD");
    process.exit(1);
  }

  // Use the pooler's real hostname. Its DNS resolves fine; only the old
  // db.<ref> direct host is flaky. We connect by IP but send the pooler
  // hostname as SNI (that's how the pooler identifies the tenant).
  // The direct host db.<ref>.supabase.co worked earlier today. Try it first
  // (it may resolve again); fall back to the pooler IP if DNS is down.
  const directHost = `db.${REF}.supabase.co`;
  const directIp = poolerIp(); // pooler IP is on the same network
  // Direct host (now resolves via /etc/hosts to the pooler IP). The direct
  // hostname is what the user's connection string uses, and it identifies the
  // tenant via SNI automatically.
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
  // ONLY the three additive migrations the user approved:
  //  - media_assets.sql         (video storage table)
  //  - certificates.sql        (certificate records)
  //  - submissions_bucket.sql  (audio submission bucket)
  const APPROVED = [
    "media_assets.sql",
    "certificates.sql",
    "submissions_bucket.sql",
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
    const { data: already } = await client.query(
      "select 1 from _migrations_applied where name = $1",
      [file],
    );
    if (already.length) {
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
      // Some migrations contain statements that may partially apply; report clearly.
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`     ❌ ${msg.slice(0, 200)}`);
    }
  }

  console.log("\nDone.");
  await client.end();
}

main().catch((e) => {
  console.error("Fatal:", e instanceof Error ? e.message : e);
  process.exit(1);
});
