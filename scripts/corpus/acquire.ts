#!/usr/bin/env tsx
/**
 * Casebook acquisition CLI.
 *
 * Reads rights_registry rows (Kavya holds the rights to every book, so there
 * is no licence gate — every row is eligible), attempts acquisition via the
 * ladder (scripts/corpus/lib/acquire.ts), stores the raw file to disk under
 * scripts/corpus/raw/acquired/<slug>/, and records acquired_file + sha256 +
 * retrieved_at + rights_status on the row via the service-role client.
 *
 * A row that fails every ladder step is marked acquisition_failed with the
 * reason in notes.
 *
 *   npm run corpus:acquire
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (from .env.local
 * — never committed). Optional ACQUIRE_<VENDOR>_USER / ACQUIRE_<VENDOR>_PASS
 * for purchased-account steps (values stay in env, never in code or git).
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import {
  acquireTitle,
  cachedAcquisition,
  titleTokens,
} from "./lib/acquire";
import { extractBuffer } from "./lib/extract";

const DRY_RUN = process.argv.includes("--dry-run");
const OCR = process.argv.includes("--ocr");

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

interface RegistryRow {
  id: string;
  title: string;
  authors?: string[] | null;
  publisher?: string | null;
  isbn?: string | null;
  contact_url?: string | null;
  rights_status: string;
  acquired_file?: string | null;
  sha256?: string | null;
  retrieved_at?: string | null;
  notes?: string | null;
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  const admin = createClient(url, key, { auth: { persistSession: false } });

  console.log(
    DRY_RUN
      ? "dry-run: scanning registry, no downloads, no DB writes"
      : "acquiring all registry rows (no licence gate — Kavya holds the rights)",
  );

  const { data: rows, error } = await admin
    .from("rights_registry")
    .select("id,title,authors,publisher,isbn,contact_url,rights_status,acquired_file,sha256,retrieved_at,notes")
    .order("priority", { ascending: true })
    .limit(200);
  if (error) {
    console.error(`rights_registry read failed: ${error.message}`);
    process.exit(1);
  }
  const registry = (rows ?? []) as RegistryRow[];
  console.log(`registry: ${registry.length} rows`);

  let ok = 0;
  let failed = 0;
  for (const row of registry) {
    const result = await acquireTitle(row.title, row.contact_url ?? undefined, env);

    if (result.ok) {
      const extracted = extractBuffer(readFileSync(result.file), {
        title: row.title,
        ocrForPdf: OCR,
      });
      const detail = extracted.text.length > 0
        ? `extracted ${extracted.format} (${extracted.text.length.toLocaleString()} chars via ${extracted.method})`
        : `NO TEXT LAYER — raw kept (run with --ocr for OCR on scanned PDFs)`;
      console.log(`✓ ${row.title} [${result.step}] ${result.file} (${(result.bytes / 1024).toFixed(0)} KB, sha256 ${result.sha256.slice(0, 12)}…) — ${detail}`);
      if (!DRY_RUN) {
        const { error: upd } = await admin
          .from("rights_registry")
          .update({
            acquired_file: result.file,
            sha256: result.sha256,
            retrieved_at: new Date().toISOString(),
            rights_status: row.rights_status, // unchanged
            notes: `acquired via ${result.step} from ${result.source_url}`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
        if (upd) console.error(`  ✗ row update failed: ${upd.message}`);
      }
      ok++;
    } else {
      // No hit — mark the row acquisition_failed with the reason, so a human
      // sees it in the registry screen and can drop a file in /mnt/acquire/.
      console.log(`✗ ${row.title}: ${result.reason}`);
      if (!DRY_RUN) {
        const { error: upd } = await admin
          .from("rights_registry")
          .update({
            rights_status: "acquisition_failed",
            notes: result.reason,
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
        if (upd) console.error(`  ✗ row update failed: ${upd.message}`);
      }
      failed++;
    }
    // Be polite between ladder runs.
    await new Promise((r) => setTimeout(r, 500));
  }

  // Titles with zero useful tokens can never match patterns — one summary line.
  const untokenisable = registry.filter((r) => titleTokens(r.title).length === 0);
  if (untokenisable.length) {
    console.log(`(skipped pattern matching for ${untokenisable.length} titles with no tokenisable words)`);
  }

  console.log(`\ndone — acquired ${ok}, failed ${failed}`);
  const cacheHits = registry.filter((r) => cachedAcquisition(r.title)).length;
  if (cacheHits > 0) console.log(`${cacheHits} titles were already cached under scripts/corpus/raw/acquired/`);
  if (!DRY_RUN) console.log("files: scripts/corpus/raw/acquired/<slug>/ — registry rows updated with acquired_file, sha256, retrieved_at");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});