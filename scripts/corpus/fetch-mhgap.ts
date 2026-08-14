#!/usr/bin/env tsx
/**
 * Fetch WHO mhGAP operations manual (open access, published as a PDF/web
 * publication by WHO with permission to use — WHO publications are broadly
 * reusable with attribution; we store a normalised markdown summary, not the
 * verbatim text, in Postgres).
 *
 *   npm run corpus:mhgap
 *
 * Source: WHO mhGAP Intervention Guide 2.0 (WHO, 2016) — the canonical
 * low-resource mental-health treatment guide we reference throughout the
 * curriculum. Stored raw for reference + a normalised summary row.
 *
 * NOTE (verified 2026-08-14): WHO IRIS migrated to a JS-rendered DSpace SPA —
 * it serves an Angular shell to curl/Node regardless of params. This fetcher
 * therefore tries the live IRIS URL first, then falls back to a verified
 * Wayback Machine snapshot of the same PDF (always-on, works from Node). If
 * both fail, it prints the exact browser instruction.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/mhgap");
const DEST = join(RAW, "mhgap-ig-2.0-eng.pdf");
mkdirSync(RAW, { recursive: true });

// WHO mhGAP-IG 2.0 PDF. Primary = live IRIS; fallback = Wayback snapshot of
// the same file (timestamp-agnostic "2024" — Wayback serves the nearest).
const URLS = [
  "https://iris.who.int/bitstream/handle/10665/250239/9789241549790-eng.pdf",
  "https://web.archive.org/web/2024/https://iris.who.int/bitstream/handle/10665/250239/9789241549790-eng.pdf",
];

function isRealPdf(buf: Buffer): boolean {
  return buf.length >= 20_000 && buf.subarray(0, 4).equals(Buffer.from("%PDF"));
}

async function main() {
  for (const url of URLS) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) {
        console.warn(`  ${url}: HTTP ${res.status}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (!isRealPdf(buf)) {
        // HTML/stub page from a failed redirect is <20 KB and won't start
        // with %PDF (WHO IRIS serves its Angular shell here).
        console.warn(`  ${url}: response is not a PDF (${buf.length} bytes)`);
        continue;
      }
      writeFileSync(DEST, buf);
      console.log(`mhGAP-IG 2.0 fetched (${(buf.length / 1024 / 1024).toFixed(1)} MB) from ${url}`);
      console.log("To index it: npm run corpus:normalise (extracts text → normalised/mhgap.json).");
      return;
    } catch (e) {
      console.warn(`  ${url}: ${e instanceof Error ? e.message : "error"}`);
    }
  }
  console.error(
    `mhGAP fetch failed on all mirrors — open in a BROWSER and save as: ${DEST}\n` +
      `  URL: https://iris.who.int/bitstream/handle/10665/250239/9789241549790-eng.pdf`,
  );
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
