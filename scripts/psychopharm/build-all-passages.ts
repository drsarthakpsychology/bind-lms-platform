#!/usr/bin/env tsx
/**
 * Batch: generate scoped passage files for every (drug, source) pair that has
 * real (scored>0) pages in the locator index. This is the scoped-loading
 * engine for Rule 3 — each output file is ONE drug from ONE source, capped at
 * a context budget, so the extraction pass only ever reads that drug's pages.
 *
 *   npm run psych:all-passages
 *
 * Writes: scripts/psychopharm/passages/<source>__<slug(drug)>.txt
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const TEXT_DIR = join(process.cwd(), "scripts/psychopharm/text");
const OUT_DIR = join(process.cwd(), "scripts/psychopharm/passages");
mkdirSync(OUT_DIR, { recursive: true });
const INDEX = JSON.parse(
  readFileSync(join(process.cwd(), "docs/psychopharm/LOCATOR_INDEX.json"), "utf8"),
);
import { DRUG_CATALOG } from "./drug-catalog";

const BUDGET = 42_000; // chars per drug-source file

function loadPages(sourceId: string): Map<number, string> {
  const path = join(TEXT_DIR, `${sourceId}.txt`);
  const text = readFileSync(path, "utf8");
  const pages = new Map<number, string>();
  const blocks = text.split(/<<<PAGE (\d+)>>>/);
  for (let i = 1; i < blocks.length; i += 2) pages.set(Number(blocks[i]), blocks[i + 1] ?? "");
  return pages;
}

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scorePage(text: string, names: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const n of names) {
    const hits = lower.split(n.toLowerCase()).length - 1;
    score += hits * 6;
    if (new RegExp(`(^|\\n)\\s*${esc(n)}\\s*\\n`, "i").test(text)) score += 40;
  }
  if (/\b\d+(\.\d+)?\s*mg\b/i.test(text)) score += 8;
  for (const kw of ["dose", "dosing", "half-life", "adverse", "interaction", "pregnan", "breast", "renal", "hepatic", "overdose"]) {
    if (lower.includes(kw)) score += 1;
  }
  return score;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

const pagemaps = new Map<string, Map<number, string>>();
const sources = new Set<string>();
for (const drug of Object.keys(INDEX)) {
  for (const p of INDEX[drug]) sources.add(p.source_id);
}

let files = 0, dropped = 0;
for (const drug of DRUG_CATALOG) {
  const key = drug.generic;
  const ps = INDEX[key];
  if (!ps) continue;
  for (const src of sources) {
    const pages = ps.filter((p: any) => p.source_id === src);
    if (!pages.length) continue;
    const pageNos: number[] = Array.from(new Set<number>(
      pages.flatMap((p: any) => {
        const out: number[] = [];
        for (let i = p.page_start; i <= p.page_end; i++) out.push(i);
        return out;
      }),
    )).sort((a, b) => a - b);
    const pagemap = pagemaps.get(src) ?? (() => { const m = loadPages(src); pagemaps.set(src, m); return m; })();
    if (!pagemap.size) { dropped++; continue; }
    const names = [key, ...drug.aliases].filter(Boolean);
    const scored = pageNos
      .map((p) => ({ p, s: scorePage(pagemap.get(p) ?? "", names), t: pagemap.get(p) ?? "" }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);

    const picked: number[] = [];
    let used = 0;
    for (const x of scored) {
      if (used + x.t.length > BUDGET && picked.length > 0) break;
      picked.push(x.p);
      used += x.t.length;
    }
    picked.sort((a, b) => a - b);
    if (!picked.length) continue;

    const body = picked.map((p) => `<<<PAGE ${p}>>>\n${pagemap.get(p)}`).join("\n\n");
    writeFileSync(join(OUT_DIR, `${src}__${slug(key)}.txt`), body, "utf8");
    files++;
  }
}

console.log(`wrote ${files} scoped passage files (${dropped} pairs with unloadable cache)`);