#!/usr/bin/env tsx
/**
 * Pass 1 — scoped passage loader + draft row model.
 *
 * Loads ONLY the pages the locator lists for ONE drug from ONE source, within
 * a context budget (chars). Scores each page so the most clinically relevant
 * pages — the monograph, dosing, side-effect, special-population content —
 * survive the budget, and passing mentions fall out last.
 *
 * This is the scoping engine behind Rule 3 ("one drug per context, load only
 * that drug's passages"). It never loads a whole book.
 *
 *   npm run psych:passages -- --drug Risperidone --source maudsley_2021
 *
 * Output: scripts/psychopharm/passages/<source>__<drug>.txt  (capped, scored)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const TEXT_DIR = join(process.cwd(), "scripts/psychopharm/text");
const OUT_DIR = join(process.cwd(), "scripts/psychopharm/passages");
mkdirSync(OUT_DIR, { recursive: true });
const INDEX = JSON.parse(
  readFileSync(join(process.cwd(), "docs/psychopharm/LOCATOR_INDEX.json"), "utf8"),
);

// Context budget for one drug-source pass. Kept small enough that two or three
// sources fit in one context sequentially.
const BUDGET = 42_000; // chars

function loadPages(sourceId: string): Map<number, string> {
  const path = join(TEXT_DIR, `${sourceId}.txt`);
  if (!existsSync(path)) return new Map();
  const text = readFileSync(path, "utf8");
  const pages = new Map<number, string>();
  const blocks = text.split(/<<<PAGE (\d+)>>>/);
  for (let i = 1; i < blocks.length; i += 2) pages.set(Number(blocks[i]), blocks[i + 1] ?? "");
  return pages;
}

// Score a page for a given drug: name hits (weighted where it looks like a
// heading), dose numbers, and section keywords.
function scorePage(text: string, names: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const n of names) {
    const hits = lower.split(n.toLowerCase()).length - 1;
    score += hits * 6;
    // A heading: drug name at start of a short line
    if (new RegExp(`(^|\\n)\\s*${escapeRegExp(n)}\\s*\\n`, "i").test(text)) score += 40;
  }
  if (/\b\d+(\.\d+)?\s*mg\b/i.test(text)) score += 8;
  for (const kw of ["dose", "dosing", "dosage", "half-life", "adverse", "interaction", "pregnan", "breast", "renal", "hepatic"]) {
    if (lower.includes(kw)) score += 1;
  }
  return score;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function main() {
  const drug = process.argv.find((a) => a.startsWith("--drug="))?.split("=")[1];
  const sourceArg = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1];
  if (!drug || !sourceArg) {
    console.error("usage: psych:passages -- --drug=<Generic> --source=<id>");
    process.exit(1);
  }

  const catalog = require("./drug-catalog").DRUG_CATALOG;
  const entry = catalog.find((c: { generic: string }) => c.generic.toLowerCase() === drug.toLowerCase());
  if (!entry) { console.error(`drug not in catalog: ${drug}`); process.exit(1); }
  const names = [entry.generic, ...entry.aliases].filter(Boolean);

  const passages = (INDEX[drug] ?? INDEX[entry.generic] ?? []).filter(
    (p: any) => p.source_id === sourceArg,
  );
  const pageNos = Array.from(new Set(
    passages.flatMap((p: any) => {
      const out: number[] = [];
      for (let i = p.page_start; i <= p.page_end; i++) out.push(i);
      return out;
    }),
  )).sort((a, b) => a - b);
  if (!pageNos.length) { console.log(`no passages for ${drug} in ${sourceArg}`); process.exit(0); }

  const pages = loadPages(sourceArg);
  const scored = pageNos
    .map((p) => ({ p, s: scorePage(pages.get(p) ?? "", names), t: pages.get(p) ?? "" }))
    .sort((a, b) => b.s - a.s);

  // Take the highest-scoring pages until the budget is consumed.
  const picked: number[] = [];
  let used = 0;
  for (const { p, s, t } of scored) {
    if (s === 0) continue; // passing mention with no signal — dropped from extraction load
    if (used + t.length > BUDGET && picked.length > 0) break;
    picked.push(p);
    used += s === 0 ? 0 : t.length;
  }
  picked.sort((a, b) => a - b);

  const body = picked.map((p) => `<<<PAGE ${p}>>>\n${pages.get(p)}`).join("\n\n");
  const outFile = join(OUT_DIR, `${sourceArg}__${slug(drug)}.txt`);
  writeFileSync(outFile, body, "utf8");

  console.log(`${drug} in ${sourceArg}: ${scored.length} pass. pages, loaded ${picked.length} (${Math.round(used / 1000)}KB) → ${outFile}`);
  console.log(`  pages: ${picked.join(", ")}`);
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

main();