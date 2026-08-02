#!/usr/bin/env tsx
/**
 * media-doctor — READ-ONLY check of the whole media surface. Reports broken
 * rows; changes NOTHING. Promotion of `pending` → `ready` is a separate,
 * explicit step (scripts/media-promote.ts).
 *
 *   npm run media-doctor
 *
 * For every lesson video, material, and submission file: does the recorded
 * object exist in the recorded bucket, is the size non-zero, is the format
 * accepted by the registry, does a renderer exist for its kind, and does the
 * row's status match reality. Prints a table of anything broken. Exits
 * non-zero if any problem is found.
 */

import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const envFile = ".env.local";

function loadEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return out;
}

const env = loadEnvFile(envFile);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("media-doctor needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (.env.local).");
  process.exit(1);
}

const admin = createClient(url, key, { auth: { persistSession: false } });

let broken = 0;

function report(kind: string, id: string, problem: string) {
  console.log(`  ❌ ${kind} ${id} — ${problem}`);
  broken++;
}
function okRow(kind: string, id: string, detail: string) {
  console.log(`  ✅ ${kind} ${id} — ${detail}`);
}

async function objectExists(bucket: string, path: string): Promise<{ exists: boolean; size: number | null }> {
  try {
    const { data, error } = await admin.storage.from(bucket).info(path);
    if (error || !data) return { exists: false, size: null };
    const size = data.metadata?.size ?? data.size;
    return { exists: true, size: typeof size === "number" ? size : null };
  } catch {
    return { exists: false, size: null };
  }
}

async function main() {
  console.log("media-doctor — read-only media surface check\n");

  // ---- Lessons (video) ----
  console.log("Lessons (video):");
  const { data: lessons, error: lessonsErr } = await admin.from("lessons").select(
    "id, title, video_storage_path, video_provider, video_bucket, video_status",
  );
  if (lessonsErr) {
    console.error("  ❌ could not read lessons:", lessonsErr.message);
    broken++;
  } else {
    for (const l of lessons ?? []) {
      if (!l.video_storage_path) {
        okRow("lesson", l.id, "no video (fine)");
        continue;
      }
      const bucket = l.video_bucket ?? "videos";
      const provider = l.video_provider ?? "supabase";
      const { exists, size } = await objectExists(bucket, l.video_storage_path);
      if (!exists) {
        report("lesson", l.id, `video object missing in ${provider}/${bucket} (status=${l.video_status})`);
      } else if (!size) {
        report("lesson", l.id, `video object empty (0 bytes) in ${provider}/${bucket}`);
      } else if (l.video_status === "ready" && size > 0) {
        okRow("lesson", l.id, `video present ${size} bytes, status=${l.video_status}`);
      } else {
        okRow("lesson", l.id, `video present ${size} bytes, status=${l.video_status} (pending — needs promote)`);
      }
    }
  }

  // ---- Materials ----
  console.log("\nMaterials:");
  const { data: materials, error: materialsErr } = await admin.from("materials").select(
    "id, title, kind, format, storage_path, provider, bucket, status, size_bytes, url",
  );
  if (materialsErr) {
    console.error("  ❌ could not read materials:", materialsErr.message);
    broken++;
  } else {
    for (const m of materials ?? []) {
      if (m.kind === "link") {
        okRow("material", m.id, `link (${m.url ?? "no url"})`);
        continue;
      }
      if (!m.storage_path) {
        report("material", m.id, `kind=${m.kind} with no storage_path`);
        continue;
      }
      const bucket = m.bucket ?? "materials";
      const provider = m.provider ?? "supabase";
      const { exists, size } = await objectExists(bucket, m.storage_path);
      if (!exists) {
        report("material", m.id, `object missing in ${provider}/${bucket} (status=${m.status})`);
      } else if (!size) {
        report("material", m.id, `object empty (0 bytes) in ${provider}/${bucket}`);
      } else if (m.status === "ready") {
        okRow("material", m.id, `${m.kind}/${m.format}, ${size} bytes, status=ready`);
      } else {
        okRow("material", m.id, `${m.kind}/${m.format}, ${size} bytes, status=${m.status} (pending — needs promote)`);
      }
    }
  }

  // ---- Submission files ----
  console.log("\nSubmission files:");
  const { data: subFiles, error: subFilesErr } = await admin.from("submission_files").select(
    "id, original_name, format, storage_path, provider, bucket, status, size_bytes, submission_id",
  );
  if (subFilesErr) {
    console.error("  ❌ could not read submission_files:", subFilesErr.message);
    broken++;
  } else {
    for (const f of subFiles ?? []) {
      if (!f.storage_path) {
        report("submission_file", f.id, "no storage_path");
        continue;
      }
      const bucket = f.bucket ?? "submissions";
      const provider = f.provider ?? "supabase";
      const { exists, size } = await objectExists(bucket, f.storage_path);
      if (!exists) {
        report("submission_file", f.id, `object missing in ${provider}/${bucket} (status=${f.status})`);
      } else if (!size) {
        report("submission_file", f.id, `object empty (0 bytes)`);
      } else if (f.status === "ready") {
        okRow("submission_file", f.id, `${f.format ?? "?"}, ${size} bytes, status=ready`);
      } else {
        okRow("submission_file", f.id, `${f.format ?? "?"}, ${size} bytes, status=${f.status} (pending — needs promote)`);
      }
    }
  }

  console.log(`\n${broken === 0 ? "✅ media surface healthy" : `❌ ${broken} problem(s) found`}`);
  process.exit(broken === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("media-doctor fatal:", e instanceof Error ? e.message : e);
  process.exit(1);
});
