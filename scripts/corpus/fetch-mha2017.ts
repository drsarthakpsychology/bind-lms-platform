#!/usr/bin/env tsx
/**
 * Fetch the Mental Healthcare Act 2017 full text (public government
 * publication, open distribution) + POCSO 2012 + RCI Act — the three
 * statutes the ethics layer cites.
 *
 *   npm run corpus:mha
 *
 * Sources (all public/government):
 *   - MHA 2017: indiacode.nic.in (Act 10 of 2017)
 *   - POCSO 2012: indiacode.nic.in (Act 32 of 2012)
 *   - RCI Act 1992: samagrashiksha.ssagujarat.org (official Gujarat mirror —
 *                   India Code serves a JS shell to Node; verified 2026-08-14)
 *
 * The statutes are long; we store the raw text and a normalised doc so the
 * ethics builder can cite actual sections, not vibes.
 *
 * NOTE (verified 2026-08-14): India Code's bitstream endpoints now redirect
 * to a JS-rendered shell for Node clients. MHA 2017 was acquired earlier and
 * lives at scripts/corpus/raw/statutes/mha2017.pdf; the fetcher still tries
 * live first, then prints the browser instruction. RCI resolves from an
 * official state mirror, so it downloads without a browser. POCSO now resolves
 * from the WBCPCR mirror (a scanned Gazette copy — normalise.ts OCRs it).
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
    urls: [
      // India Code's bitstream serves a JS shell to Node (verified); the
      // WBCPCR mirror is a real %PDF Gazette copy and is Node-reachable.
      "https://www.indiacode.nic.in/bitstream/123456789/2073/1/A2012-32.pdf",
      "https://wbcpcr.org/pdf/acts/POCSO-Act-2012.pdf",
    ],
  },
  {
    name: "rci1992",
    urls: [
      // India Code's bitstream for RCI was never a working handle; use the
      // official Samagra Shiksha (Gujarat education dept) mirror instead.
      "https://samagrashiksha.ssagujarat.org/images/RCI-Act_1992.pdf",
      "https://bombayhighcourt.nic.in/libweb/actc/yearwise/1992/1992.34.pdf",
    ],
  },
];

async function fetchAny(urls: string[]): Promise<{ buf: Buffer; url: string }> {
  let lastErr: Error | null = null;
  for (const u of urls) {
    try {
      const res = await fetch(u, { redirect: "follow" });
      if (!res.ok) {
        lastErr = new Error(`${u}: ${res.status}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (!buf.subarray(0, 4).equals(Buffer.from("%PDF"))) {
        // India Code serves an Angular shell to Node clients (verified
        // 2026-08-14) — a real PDF is the only acceptable response.
        lastErr = new Error(`${u}: not a PDF (${buf.length} bytes)`);
        continue;
      }
      return { buf, url: u };
    } catch (e) {
      lastErr = e as Error;
    }
  }
  throw lastErr ?? new Error("no urls");
}

async function main() {
  for (const s of SOURCES) {
    try {
      const { buf, url } = await fetchAny(s.urls);
      writeFileSync(join(RAW, `${s.name}.pdf`), buf);
      console.log(`${s.name}: ${(buf.length / 1024).toFixed(0)} KB from ${url}`);
    } catch (e) {
      console.error(
        `${s.name}: FAILED (${(e as Error).message}) — download manually to scripts/corpus/raw/statutes/${s.name}.pdf`,
      );
    }
  }
  console.log("Index: npm run corpus:normalise (extracts section structure → normalised/statutes.json).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
