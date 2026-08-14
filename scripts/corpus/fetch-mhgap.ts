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
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/mhgap");
mkdirSync(RAW, { recursive: true });

async function main() {
  // WHO mhGAP-IG 2.0 PDF (public distribution).
  const pdfUrl = "https://iris.who.int/bitstream/handle/10665/250239/9789241549790-eng.pdf";
  const res = await fetch(pdfUrl, { redirect: "follow" });
  if (!res.ok) {
    console.error(`mhGAP fetch failed (${res.status}) — WHO IRIS occasionally rate-limits; try again later or download manually to scripts/corpus/raw/mhgap/.`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  // A HTML/stub page from a failed redirect is <20 KB and won't start with %PDF.
  if (buf.length < 20_000 || !buf.subarray(0, 4).equals(Buffer.from("%PDF"))) {
    // WHO IRIS migrated to a JS-rendered DSpace SPA (verified 2026-08-14): it
    // serves the Angular shell to curl/Node regardless of params, and the REST
    // API is unreachable from this machine. A BROWSER download is the reliable
    // path — the browser executes the JS and lands the real file.
    console.error(
      `mhGAP response is not a PDF (${buf.length} bytes) — WHO IRIS serves a JS shell to Node. ` +
        `Open in a BROWSER and save as: scripts/corpus/raw/mhgap/mhgap-ig-2.0-eng.pdf\n` +
        `  URL: https://iris.who.int/bitstream/handle/10665/250239/9789241549790-eng.pdf`,
    );
    process.exit(1);
  }
  writeFileSync(join(RAW, "mhgap-ig-2.0-eng.pdf"), buf);
  console.log(`mhGAP-IG 2.0 fetched (${(buf.length / 1024 / 1024).toFixed(1)} MB).`);
  console.log("To index it: run scripts/corpus/normalise-mhgap.ts (PDF text extraction → chunked corpus rows, CC attribution).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});