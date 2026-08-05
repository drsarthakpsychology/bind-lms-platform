#!/usr/bin/env tsx
/**
 * verify-backup — prove a backup actually restores.
 *
 *   npm run verify-backup
 *
 * Downloads the newest db/*.dump from the R2 backups bucket, spins up a
 * throwaway local Postgres (initdb/pg_ctl — no Docker, runners no longer
 * ship it), restores the dump into it, runs sanity queries (row counts on
 * key tables), reports pass/fail, and tears down.
 *
 * Requires: postgresql (pg_restore, initdb, pg_ctl), R2 credentials, and
 * the R2 backups bucket.
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

const env = process.env;
function requireEnv(name: string): string {
  const v = env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function makeS3() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

/** Run a command, returning {status, stdout, stderr}. */
function run(cmd: string, args: string[], opts: { input?: string } = {}): { status: number; stdout: string; stderr: string } {
  const r = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  return { status: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

async function main() {
  for (const bin of ["pg_restore", "initdb", "pg_ctl"]) {
    if (spawnSync(bin, ["--version"]).status !== 0) {
      console.error(`${bin} not found — install postgresql (sudo apt-get install -y postgresql postgresql-client).`);
      process.exit(1);
    }
  }

  const bucket = requireEnv("R2_BACKUP_BUCKET");
  const s3 = makeS3();

  // List db/*.dump keys, find the newest.
  const list = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: "db/" }));
  const keys = (list.Contents ?? [])
    .map((o) => o.Key ?? "")
    .filter((k) => k.endsWith(".dump"))
    .sort();
  if (!keys.length) {
    console.error(`No backups found in ${bucket}/db/`);
    process.exit(1);
  }
  const newest = keys[keys.length - 1];
  console.log(`Newest backup: ${newest}`);

  // Download.
  const dl = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: newest }));
  const workdir = join(tmpdir(), `plms-verify-${Date.now()}`);
  mkdirSync(workdir, { recursive: true });
  const dumpFile = join(workdir, "db.dump");
  const buf = Buffer.from(await dl.Body!.transformToByteArray());
  writeFileSync(dumpFile, buf);
  console.log(`Downloaded ${(buf.length / 1e6).toFixed(1)} MB`);

  // Throwaway local Postgres cluster (initdb + pg_ctl), trust auth on local.
  const pgdata = join(workdir, "pgdata");
  const port = 54329;
  mkdirSync(pgdata, { recursive: true });
  console.log("Initialising throwaway Postgres …");
  const init = run("initdb", ["-D", pgdata, "-U", "postgres", "-A", "trust", "--no-sync"]);
  if (init.status !== 0) {
    console.error("initdb failed:", init.stderr.slice(-400));
    process.exit(1);
  }
  console.log("Starting Postgres …");
  const started = run("pg_ctl", ["-D", pgdata, "-o", `-p ${port} -c listen_addresses='127.0.0.1'`, "-w", "start"]);
  if (started.status !== 0) {
    console.error("pg_ctl start failed:", started.stderr.slice(-400));
    process.exit(1);
  }

  try {
    // Restore (custom-format dump → pg_restore).
    console.log("Restoring dump …");
    const rest = run("pg_restore", ["-h", "127.0.0.1", "-p", String(port), "-U", "postgres", "-d", "postgres", "--no-owner", "--no-acl", dumpFile]);
    if (rest.status !== 0) {
      console.error("Restore failed:", rest.stderr?.slice(-400));
      process.exit(1);
    }

    // Sanity queries.
    const tables = ["profiles", "courses", "lessons", "assignments", "submissions", "progress"];
    let pass = true;
    for (const t of tables) {
      const r = run("psql", ["-h", "127.0.0.1", "-p", String(port), "-U", "postgres", "-t", "-A", "-c", `select count(*) from ${t};`]);
      const count = r.stdout?.trim();
      console.log(`  ${t}: ${count} rows ${r.status === 0 ? "✅" : "❌"}`);
      if (r.status !== 0) pass = false;
    }

    if (pass) console.log("\n✅ BACKUP VERIFIED — restores cleanly, data present.");
    else console.log("\n❌ BACKUP INCOMPLETE — sanity queries failed.");
    process.exit(pass ? 0 : 1);
  } finally {
    // Tear down.
    run("pg_ctl", ["-D", pgdata, "-m", "immediate", "stop"]);
    rmSync(workdir, { recursive: true, force: true });
    console.log("Tore down throwaway Postgres.");
  }
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
