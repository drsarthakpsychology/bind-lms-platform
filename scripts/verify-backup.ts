#!/usr/bin/env tsx
/**
 * verify-backup — prove a backup actually restores.
 *
 *   npm run verify-backup
 *
 * Downloads the newest db/*.dump from the R2 backups bucket, starts a
 * throwaway Postgres in docker, restores the dump into it, runs sanity
 * queries (row counts on key tables), reports pass/fail, and tears down.
 *
 * Requires: docker, R2 credentials, and the R2 backups bucket.
 */

import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
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

async function main() {
  // Docker check.
  const d = spawnSync("docker", ["--version"], { encoding: "utf8" });
  if (d.status !== 0) {
    console.error("Docker is required for verify-backup (throwaway Postgres).");
    process.exit(1);
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
  const { writeFileSync } = await import("node:fs");
  const buf = Buffer.from(await dl.Body!.transformToByteArray());
  writeFileSync(dumpFile, buf);
  console.log(`Downloaded ${(buf.length / 1e6).toFixed(1)} MB`);

  // Throwaway Postgres container.
  const container = `plms-verify-${Date.now()}`;
  console.log(`Starting throwaway Postgres: ${container}`);
  const up = spawnSync("docker", ["run", "-d", "--name", container, "-e", "POSTGRES_PASSWORD=verify", "-p", "54329:5432", "postgres:16-alpine"], { encoding: "utf8" });
  if (up.status !== 0) {
    console.error("Could not start Postgres:", up.stderr);
    process.exit(1);
  }

  try {
    // Wait for readiness.
    for (let i = 0; i < 30; i++) {
      const ok = spawnSync("docker", ["exec", container, "pg_isready", "-U", "postgres"], { encoding: "utf8" });
      if (ok.status === 0) break;
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Restore.
    console.log("Restoring dump …");
    const rest = spawnSync(
      "docker", ["exec", "-i", container, "pg_restore", "-U", "postgres", "-d", "postgres", "--no-owner", "--no-acl", "-"],
      { input: buf, encoding: "utf8" },
    );
    if (rest.status !== 0) {
      console.error("Restore failed:", rest.stderr?.slice(-400));
      process.exit(1);
    }

    // Sanity queries.
    const tables = ["profiles", "courses", "lessons", "assignments", "submissions", "progress"];
    let pass = true;
    for (const t of tables) {
      const r = spawnSync("docker", ["exec", container, "psql", "-U", "postgres", "-t", "-A", "-c", `select count(*) from ${t};`], { encoding: "utf8" });
      const count = r.stdout?.trim();
      console.log(`  ${t}: ${count} rows ${r.status === 0 ? "✅" : "❌"}`);
      if (r.status !== 0) pass = false;
    }

    if (pass) console.log("\n✅ BACKUP VERIFIED — restores cleanly, data present.");
    else console.log("\n❌ BACKUP INCOMPLETE — sanity queries failed.");
    process.exit(pass ? 0 : 1);
  } finally {
    // Tear down.
    spawnSync("docker", ["rm", "-f", container]);
    console.log(`Tore down ${container}.`);
  }
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
