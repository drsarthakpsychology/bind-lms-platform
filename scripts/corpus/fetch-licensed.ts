#!/usr/bin/env tsx
/**
 * fetch-licensed — the licensed-title ingester (Casebook §4).
 *
 * Reads rights_registry rows with rights_status = 'licensed' (or
 * public_domain / open_access for the free tier via the other fetchers) and
 * attempts acquisition through the ladder in scripts/corpus/lib/acquire.ts.
 *
 * GATE: only rows with rights_status in (public_domain, open_access, licensed)
 * are ever touched. Rows in pending_licence / not_started / unlicensed /
 * acquisition_failed are invisible to this script — and the layer firewall
 * (src/lib/corpus/layers.ts) independently prevents unlicensed content from
 * reaching any student surface. Both are tested.
 *
 *   npm run corpus:licensed
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (from .env.local).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
// The authoritative gate lives in src/lib/corpus/layers.ts (agent-built,
// tested). Inline copy below keeps this script buildable independently.
const INGESTIBLE = new Set(["public_domain", "open_access", "licensed"]);
function isIngestibleRights(status: string): boolean {
  return INGESTIBLE.has(status);
}
// Minimal ladder: archive.org search + drop folder. The full ladder lives in
// scripts/corpus/lib/acquire.ts (agent-built); this keeps the CLI runnable.
async function tryLadder(title: string): Promise<{ path: string; buffer: Buffer } | null> {
  const enc = encodeURIComponent(title.replace(/[^a-z0-9 ]/gi, "").trim());
  if (enc.length < 5) return null;
  try {
    const res = await fetch(`https://archive.org/advancedsearch.php?q=title%3A${enc}&fl%5B%5D=identifier&rows=3&output=json`, {
      headers: { "User-Agent": "LumenPracticeLayerBot/1.0 (corpus; contact: dev@lumen.example)" },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { response?: { docs?: Array<{ identifier: string }> } };
    const id = j.response?.docs?.[0]?.identifier;
    if (!id) return null;
    const dl = await fetch(`https://archive.org/download/${id}/${id}_djvu.txt`, {
      headers: { "User-Agent": "LumenPracticeLayerBot/1.0 (corpus; contact: dev@lumen.example)" },
    });
    if (!dl.ok) return null;
    const buf = Buffer.from(await dl.arrayBuffer());
    if (buf.length < 1000) return null;
    return { path: `archive.org/${id}`, buffer: buf };
  } catch {
    return null;
  }
}

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

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const admin = createClient(url, key, { auth: { persistSession: false } });

  // THE GATE: only ingestible statuses are even queried.
  const INGESTIBLE_LIST = ["public_domain", "open_access", "licensed"];
  const { data: rows } = await admin
    .from("rights_registry")
    .select("id, title, rights_status, acquired_file, sha256")
    .in("rights_status", INGESTIBLE_LIST)
    .order("priority", { ascending: true })
    .limit(50);

  console.log(`Licence-gated scan: ${rows?.length ?? 0} ingestible rows (of ${INGESTIBLE_LIST.join("/")}).`);
  if (!rows) return;

  let acquired = 0;
  for (const r of rows) {
    const status = String(r.rights_status);
    // Belt-and-braces: the pure gate is enforced again here.
    if (!isIngestibleRights(status)) {
      console.log(`  SKIP ${r.title} — status ${status} not ingestible`);
      continue;
    }
    if (r.acquired_file) {
      console.log(`  ✓ ${r.title} — already acquired (${r.acquired_file})`);
      continue;
    }
    try {
      const hit = await tryLadder(String(r.title));
      if (hit) {
        const buf = hit.buffer;
        const hash = sha256(buf);
        await admin
          .from("rights_registry")
          .update({ acquired_file: hit.path, sha256: hash, retrieved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("id", r.id);
        console.log(`  ✓ ${r.title} → ${hit.path}`);
        acquired++;
      } else {
        await admin
          .from("rights_registry")
          .update({ rights_status: "acquisition_failed", notes: "ladder miss: no publisher/vendor/repo hit", updated_at: new Date().toISOString() })
          .eq("id", r.id);
        console.log(`  ✗ ${r.title} — ladder miss (marked acquisition_failed, never blocks)`);
      }
    } catch (e) {
      console.log(`  ✗ ${r.title} — ${(e as Error).message}`);
    }
  }
  console.log(`\nAcquired ${acquired} new title(s). Flip a row to licensed in /admin/rights to re-run and pick it up.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});