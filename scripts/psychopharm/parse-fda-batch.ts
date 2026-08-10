#!/usr/bin/env tsx
/**
 * Batch parser — run fetch-fda-full.ts's extraction over every fetched
 * fda/<slug>.html and write fda/<slug>.json. Skips htmls already parsed.
 *
 *   npm run psych:fda-parse-batch
 */
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const FDA_DIR = join(process.cwd(), "scripts/psychopharm/fda");
const manifest = JSON.parse(readFileSync(join(FDA_DIR, "_manifest.json"), "utf8"));

// map drug name (lowercased, hyphenated slug AND plain lowercase) → setid
const setidFor = new Map<string, string>();
const slugOf = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
for (const [drug, v] of Object.entries(manifest as Record<string, { setid: string }>)) {
  setidFor.set(drug.toLowerCase(), v.setid);
  setidFor.set(slugOf(drug), v.setid);
}
// also read existing json files for their setid
for (const f of readdirSync(FDA_DIR).filter((f) => f.endsWith(".json") && f !== "_manifest.json")) {
  try {
    const j = JSON.parse(readFileSync(join(FDA_DIR, f), "utf8"));
    if (j.meta?.setid && j.meta?.setid !== "unknown") {
      setidFor.set(f.replace(/\.json$/, ""), j.meta.setid);
      setidFor.set(slugOf(f.replace(/\.json$/, "")), j.meta.setid);
    }
  } catch { /* ignore */ }
}

const htmls = readdirSync(FDA_DIR).filter((f) => f.endsWith(".html"));
let done = 0;
let skipped = 0;
for (const h of htmls) {
  const base = h.replace(/\.html$/, "");
  const outJson = join(FDA_DIR, `${base}.json`);
  if (existsSync(outJson) && !process.argv.includes("--force")) {
    skipped++;
    continue;
  }
  const setid = setidFor.get(base) ?? setidFor.get(slugOf(base)) ?? "unknown";
  const drug = base.replace(/-/g, " ");
  execSync(`npx tsx scripts/psychopharm/fetch-fda-full.ts --html=scripts/psychopharm/fda/${h} --drug="${drug}" --setid=${setid}`, {
    stdio: "inherit",
    cwd: process.cwd(),
  });
  done++;
}
console.log(`\nparsed ${done}, skipped ${skipped} of ${htmls.length} html files`);
