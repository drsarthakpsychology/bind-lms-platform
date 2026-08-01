#!/usr/bin/env tsx
/**
 * restore — restore a backup dump into a target database.
 *
 *   npm run restore -- <dumpfile.dump> [--target <db-url>]
 *
 * Confirmation prompt names the target so you can't accidentally restore over
 * production. Requires `pg_restore` (or docker) — prints install instructions
 * if missing.
 *
 * Usage:
 *   npm run restore -- ./db/2026-08-01.dump
 *   npm run restore -- ./db/2026-08-01.dump --target postgresql://...
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const dump = resolve(args.find((a) => !a.startsWith("-")) ?? "");
const targetIdx = args.indexOf("--target");
const target = targetIdx >= 0 ? args[targetIdx + 1] ?? "" : process.env.SUPABASE_DB_URL ?? "";

function red(s: string) {
  return `\x1b[31m${s}\x1b[0m`;
}

if (!dump || !existsSync(dump)) {
  console.error("Usage: npm run restore -- <dumpfile.dump> [--target <db-url>]");
  process.exit(1);
}
if (!target) {
  console.error("No target database. Pass --target <db-url> or set SUPABASE_DB_URL.");
  process.exit(1);
}

// Show which target we're about to wipe (safety).
console.log("\n" + red("⚠️  DESTRUCTIVE ACTION"));
console.log(`  Restoring: ${dump}`);
console.log(`  Target DB: ${target.split("@")[1] ?? target}`);
console.log("  This REPLACES the target database contents.\n");

// Confirmation prompt naming the target.
console.log(`Type YES to restore into ${target.split("@")[1]?.split("/")[0] ?? "this database"}:`);
process.stdout.write("> ");
process.stdin.once("data", (buf) => {
  const answer = buf.toString().trim();
  if (answer !== "YES") {
    console.log("Aborted.");
    process.exit(0);
  }

  // Prefer pg_restore; fall back to docker.
  const useDocker = spawnSync("pg_restore", ["--version"]).status !== 0;
  if (useDocker) {
    const d = spawnSync("docker", ["--version"], { encoding: "utf8" });
    if (d.status !== 0) {
      console.error(
        "Need pg_restore or docker.\n" +
          "macOS:  brew install libpq && echo 'export PATH=\"/opt/homebrew/opt/libpq/bin:$PATH\"' >> ~/.zshrc\n" +
          "Windows: install PostgreSQL (has pg_restore)",
      );
      process.exit(1);
    }
  }

  console.log("\nRestoring … (this can take a while for large dumps)");
  // The URL is for the pooler; pg_restore works better on the direct host.
  const url = new URL(target);
  const host = url.hostname;
  const port = url.port || "5432";
  const user = url.username;
  const pass = url.password;
  const db = url.pathname.replace(/^\//, "") || "postgres";

  if (useDocker) {
    const r = spawnSync(
      "docker",
      [
        "run", "--rm", "-v", `${resolve(dump)}:/tmp/db.dump`,
        "-e", `PGPASSWORD=${pass}`,
        "postgres:16-alpine",
        "pg_restore", "-h", host, "-p", port, "-U", user, "-d", db,
        "--clean", "--if-exists", "--no-owner", "/tmp/db.dump",
      ],
      { stdio: "inherit" },
    );
    if (r.status !== 0) {
      console.error("Restore failed. See output above.");
      process.exit(r.status ?? 1);
    }
  } else {
    const r = spawnSync(
      "pg_restore",
      ["-h", host, "-p", port, "-U", user, "-d", db, "--clean", "--if-exists", "--no-owner", dump],
      { stdio: "inherit", env: { ...process.env, PGPASSWORD: pass } },
    );
    if (r.status !== 0) {
      console.error("Restore failed. See output above.");
      process.exit(r.status ?? 1);
    }
  }

  console.log("\n✅ Restore complete.");
  process.exit(0);
});
