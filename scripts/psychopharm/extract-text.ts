#!/usr/bin/env tsx
/**
 * Pass 0a — Extract every source PDF to a per-book text cache.
 *
 * Produces scripts/psychopharm/text/<source_id>.txt with one page per
 * `\n<<<PAGE n>>>\n` marker, so the locator index and extraction passes can
 * address text by page without re-running pdftotext.
 *
 * Normalisations applied at cache time (configurable per source):
 *   - Maudsley uses `−` (minus) as a hyphen inside dose ranges like "7.5–15mg"
 *     and "DSM−IV". We keep the original but ALSO record a note; extraction
 *     handles dose parsing defensively. We do NOT silently rewrite here —
 *     page-anchored fidelity matters. The hyphen is only an extraction-time
 *     parsing concern, handled in the parser.
 *   - No header stripping here (context-dependent, done at passage load).
 *
 * Usage: npm run psych:text
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CACHE_DIR = join(process.cwd(), "scripts/psychopharm/text");
mkdirSync(CACHE_DIR, { recursive: true });

type Source = {
  id: string;
  path: string;
};

const SOURCES: Source[] = [
  { id: "maudsley_2021", path: "/Users/kavyabothra/Desktop/psy-books/Prescribing Guidelines in Psychiatry, David M. Taylor (2021).pdf" },
  { id: "stahl_pg_7th", path: "/Users/kavyabothra/Desktop/psy-books/prescribers-guide-stahls-essential-psychopharmacology-7nbsped-1108926010-9781108926010_compress.pdf" },
  { id: "stahl_essential_5th", path: "/Users/kavyabothra/Desktop/psy-books/stahlx27s-essential-psychopharmacology-5th-edition_compress.pdf" },
  { id: "stahl_pg_older", path: "/Users/kavyabothra/Desktop/psy-books/Essential Psychopharmacology Prescribers Guide - Stephen M Stahl.pdf" },
  { id: "stahl_pg_preview", path: "/Users/kavyabothra/Desktop/psy-books/preview-9781009464765_A49238956.pdf" },
  { id: "kaplan_sadock", path: "/Users/kavyabothra/Desktop/psy-books/Kaplan _ Sadock’s Synopsis of Psychiatry (2021).pdf" },
  { id: "fish_psychopath", path: "/Users/kavyabothra/Desktop/psy-books/Fish's Clinical Psychopathology, 3rd Edition_230806_023436.pdf" },
  { id: "ahuja_psychiatry", path: "/Users/kavyabothra/Desktop/psy-books/Niraj Ahuja-A Short Textbook of Psychiatry_ 20th Year Edition-Jaypee Brothers Med. Pub. (2010).pdf" },
  { id: "dsm5tr", path: "/Users/kavyabothra/Desktop/psy-books/DSM 5 TR-APA (2022).pdf" },
  { id: "icd11", path: "/Users/kavyabothra/Desktop/psy-books/refguide.pdf" },
];

function pageCount(path: string): number {
  const r = spawnSync("pdfinfo", [path], { encoding: "utf8" });
  const m = (r.stdout ?? "").match(/^Pages:\s+(\d+)/m);
  return m ? Number(m[1]) : 0;
}

function extractPage(path: string, page: number): string {
  const r = spawnSync("pdftotext", ["-f", String(page), "-l", String(page), path, "-"], { encoding: "utf8" });
  return r.stdout ?? "";
}

function main() {
  const manifest: Record<string, { pages: number; normalized: string[] }> = {};
  for (const s of SOURCES) {
    const pages = pageCount(s.path);
    console.log(`▶ ${s.id}: ${pages} pages`);
    const chunks: string[] = [];
    for (let p = 1; p <= pages; p++) {
      const text = extractPage(s.path, p);
      chunks.push(`<<<PAGE ${p}>>>\n${text}`);
    }
    writeFileSync(join(CACHE_DIR, `${s.id}.txt`), chunks.join("\n"), "utf8");
    manifest[s.id] = { pages, normalized: [] };
    console.log(`  ✓ wrote ${s.id}.txt (${chunks.length} pages)`);
  }
  writeFileSync(join(CACHE_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log("done");
}

main();
