#!/usr/bin/env tsx
/**
 * Fetch the National Mental Health Survey of India (NMHS) main report —
 * the survey that documents India's realistic help-seeking delays (the
 * median is years, not weeks) and treatment gaps. Open government
 * publication via NIMHANS.
 *
 *   npm run corpus:nmhs
 *
 * Stored raw + a normalised summary; the DELAY numbers feed case authoring
 * (help_seeking_delay is drawn from NMHS-realistic distributions).
 *
 * NOTE (verified 2026-08-14): the live NIMHANS link rotates / has a TLS issue
 * from Node. This fetcher falls back to a verified Wayback snapshot (2018) of
 * the same file, which always works from Node.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/nmhs");
const DEST = join(RAW, "nmhs-main-report.pdf");
mkdirSync(RAW, { recursive: true });

// NIMHANS NMHS 2015-16 main report PDF (public distribution). Primary = live;
// fallback = Wayback snapshot (verified 4.1 MB, 2018-11-08).
const URLS = [
  "https://www.nimhans.ac.in/sites/default/files/u197/NMHS%20Report%20%28Prevalence%20patterns%20and%20outcomes%29%201.pdf",
  "http://web.archive.org/web/20181108073800id_/http://www.nimhans.ac.in/sites/default/files/u197/NMHS%20Report%20%28Prevalence%20patterns%20and%20outcomes%29%201.pdf",
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
        console.warn(`  ${url}: response is not a PDF (${buf.length} bytes)`);
        continue;
      }
      writeFileSync(DEST, buf);
      console.log(`NMHS main report fetched (${(buf.length / 1024 / 1024).toFixed(1)} MB) from ${url}`);
      console.log("To index it: npm run corpus:normalise (extracts text → normalised/nmhs.json).");
      return;
    } catch (e) {
      console.warn(`  ${url}: ${e instanceof Error ? e.message : "error"}`);
    }
  }
  console.error(
    `NMHS fetch failed on all mirrors — open in a BROWSER and save the PDF to: ${DEST}\n` +
      `  URL: https://www.nimhans.ac.in/sites/default/files/u197/NMHS%20Report%20%28Prevalence%20patterns%20and%20outcomes%29%201.pdf`,
  );
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
