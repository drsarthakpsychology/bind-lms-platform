#!/usr/bin/env tsx
/**
 * Fetch the Mental Healthcare Act 2017 full text (public government
 * publication, open distribution) + POCSO 2012 + RCI Act — the three
 * statutes the ethics layer cites.
 *
 *   npm run corpus:mha
 *
 * Sources (all public/government):
 *   - MHA 2017: legislative.gov.in (Act 10 of 2017)
 *   - POCSO 2012: legislative.gov.in (Act 32 of 2012)
 *   - RCI Act 1992: legislative.gov.in (Act 39 of 1992)
 *
 * The statutes are long; we store the raw text and a normalised index of
 * sections so the ethics builder can cite actual sections, not vibes.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/statutes");
mkdirSync(RAW, { recursive: true });

const SOURCES: Array<{ name: string; urls: string[] }> = [
  {
    name: "mha2017",
    urls: [
      "https://www.indiacode.nic.in/bitstream/123456789/2249/1/A2017-10.pdf",
      "https://www.indiacode.nic.in/bitstream/123456789/2249/3/A2017-10.pdf",
    ],
  },
  {
    name: "pocso2012",
    urls: ["https://www.indiacode.nic.in/bitstream/123456789/2073/1/A2012-32.pdf"],
  },
  {
    name: "rci1992",
    urls: ["https://www.indiacode.nic.in/bitstream/123456789/1941/1/A1992-39.pdf"],
  },
];

async function fetchAny(urls: string[]): Promise<Buffer> {
  let lastErr: Error | null = null;
  for (const u of urls) {
    try {
      const res = await fetch(u);
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      lastErr = new Error(`${u}: ${res.status}`);
    } catch (e) {
      lastErr = e as Error;
    }
  }
  throw lastErr ?? new Error("no urls");
}

async function main() {
  for (const s of SOURCES) {
    try {
      const buf = await fetchAny(s.urls);
      writeFileSync(join(RAW, `${s.name}.pdf`), buf);
      console.log(`${s.name}: ${(buf.length / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.error(`${s.name}: FAILED (${(e as Error).message}) — download manually to scripts/corpus/raw/statutes/`);
    }
  }
  console.log("Index: scripts/corpus/normalise-statutes.ts — extracts section headings for the ethics section-citation builder.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});