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
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/nmhs");
mkdirSync(RAW, { recursive: true });

async function main() {
  // NIMHANS NMHS 2015-16 main report PDF (public distribution).
  const url = "https://www.nimhans.ac.in/sites/default/files/u197/NMHS%20Report%20%28Prevalence%20patterns%20and%20outcomes%29%201.pdf";
  const res = await fetch(url);
  if (!res.ok) {
    console.error(
      `NMHS fetch failed (${res.status}) — the NIMHANS link rotates / has a TLS issue in Node. ` +
        `Open in a BROWSER and save the PDF to: scripts/corpus/raw/nmhs/\n` +
        `  URL: https://www.nimhans.ac.in/sites/default/files/u197/NMHS%20Report%20%28Prevalence%20patterns%20and%20outcomes%29%201.pdf`,
    );
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(RAW, "nmhs-main-report.pdf"), buf);
  console.log(`NMHS main report fetched (${(buf.length / 1024 / 1024).toFixed(1)} MB).`);
  console.log("Index: scripts/corpus/normalise-nmhs.ts — extracts help-seeking-delay + treatment-gap figures into corpus rows.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});