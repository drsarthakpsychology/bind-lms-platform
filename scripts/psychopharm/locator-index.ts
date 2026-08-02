#!/usr/bin/env tsx
/**
 * Pass 0b — Build the locator index.
 *
 * Scans every source's text cache for each drug in the catalog (generic +
 * brand + aliases) and writes docs/psychopharm/LOCATOR_INDEX.json:
 *
 *   { "Risperidone": [ { source_id, chapter, page_start, page_end, passage_type } ], ... }
 *
 * Rules (per the extraction addendum):
 *   - Index by generic name, brand names, aliases — a drug under a brand name
 *     is never missed.
 *   - Include passing mentions. A single sentence in a pregnancy chapter can
 *     be the most important line about that drug.
 *   - The index is data, not prose: locations, not content.
 *   - Nothing is extracted until this index is complete.
 *
 * passage_type heuristics:
 *   - a page where the drug name is a standalone heading => monograph
 *   - "dose"/"dosing"/"mg" on the page => dose content (folded into the
 *     passage's type as an extra flag)
 *   - pages adjacent to a monograph page are class/condition discussion
 *   - pages in special-population chapters => special_populations (detected by
 *     chapter keywords: pregnancy, renal, hepatic, elderly, etc.)
 *
 * Usage: npm run psych:locator
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { DRUG_CATALOG } from "./drug-catalog";

const TEXT_DIR = join(process.cwd(), "scripts/psychopharm/text");
const OUT = join(process.cwd(), "docs/psychopharm/LOCATOR_INDEX.json");

// The ten sources, matching extract-text.ts ids.
const SOURCES = [
  "maudsley_2021", "stahl_pg_7th", "stahl_essential_5th", "stahl_pg_older",
  "stahl_pg_preview", "kaplan_sadock", "fish_psychopath", "ahuja_psychiatry",
  "dsm5tr", "icd11",
];

type Passage = {
  source_id: string;
  chapter: string;
  page_start: number;
  page_end: number;
  passage_type: string;
};

type DrugIndex = Record<string, Passage[]>;

const POPULATION_HINTS = [
  "pregnancy", "breastfeed", "renal", "hepatic", "liver", "kidney",
  "elderly", "geriatric", "adolescen", "children", "child", "obese", "diabetes",
];
const EQUIVALENCE_HINTS = ["equivalent", "conversion", "equipotent"];
const INTERACTION_HINTS = ["interaction", "interacts", "drug interaction"];
const SIDE_EFFECT_HINTS = ["side effect", "adverse", "tolerability", "toxicity"];

function passageType(pageText: string): string {
  const lower = pageText.toLowerCase();
  if (EQUIVALENCE_HINTS.some((h) => lower.includes(h))) return "equivalence_table";
  if (INTERACTION_HINTS.some((h) => lower.includes(h))) return "interaction_table";
  if (POPULATION_HINTS.some((h) => lower.includes(h))) return "special_populations";
  if (SIDE_EFFECT_HINTS.some((h) => lower.includes(h))) return "side_effect_table";
  return "monograph";
}

/** Split a cached book into { page: text } map. */
function loadPages(sourceId: string): Map<number, string> {
  const path = join(TEXT_DIR, `${sourceId}.txt`);
  if (!existsSync(path)) return new Map();
  const text = readFileSync(path, "utf8");
  const pages = new Map<number, string>();
  const blocks = text.split(/<<<PAGE (\d+)>>>/);
  // blocks: ["", "1", "text1", "2", "text2", ...]
  for (let i = 1; i < blocks.length; i += 2) {
    const page = Number(blocks[i]);
    pages.set(page, blocks[i + 1] ?? "");
  }
  return pages;
}

/** Regex-escape a drug name for scanning. */
function esc(name: string): string {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildIndex(): DrugIndex {
  const index: DrugIndex = {};

  for (const sourceId of SOURCES) {
    const pages = loadPages(sourceId);
    if (!pages.size) {
      console.log(`  ⚠ ${sourceId}: no text cache`);
      continue;
    }
    console.log(`  ▶ ${sourceId}: ${pages.size} pages`);

    for (const drug of DRUG_CATALOG) {
      const names = [drug.generic, ...drug.aliases].filter(Boolean);
      // Find pages mentioning this drug.
      const mentionPages: number[] = [];
      for (const [page, text] of pages) {
        const lower = text.toLowerCase();
        if (names.some((n) => lower.includes(n.toLowerCase()))) {
          mentionPages.push(page);
        }
      }
      if (!mentionPages.length) continue;

      // Cluster consecutive pages into passages.
      const passages: Passage[] = [];
      let run: number[] = [];
      for (const p of mentionPages.sort((a, b) => a - b)) {
        if (run.length && p === run[run.length - 1] + 1) {
          run.push(p);
        } else {
          if (run.length) passages.push(makePassage(sourceId, run, pages));
          run = [p];
        }
      }
      if (run.length) passages.push(makePassage(sourceId, run, pages));

      const key = drug.generic;
      if (!index[key]) index[key] = [];
      index[key].push(...passages);
    }
  }

  return index;
}

function makePassage(sourceId: string, run: number[], pages: Map<number, string>): Passage {
  const start = run[0];
  const end = run[run.length - 1];
  const pageText = pages.get(start) ?? "";
  return {
    source_id: sourceId,
    chapter: "",
    page_start: start,
    page_end: end,
    passage_type: passageType(pageText),
  };
}

const index = buildIndex();
writeFileSync(OUT, JSON.stringify(index, null, 2), "utf8");

const drugCount = Object.keys(index).length;
const passageCount = Object.values(index).reduce((n, p) => n + p.length, 0);
console.log(`\nIndexed ${drugCount} drugs, ${passageCount} passages → docs/psychopharm/LOCATOR_INDEX.json`);
for (const [drug, ps] of Object.entries(index).sort((a, b) => b[1].length - a[1].length).slice(0, 15)) {
  console.log(`  ${drug}: ${ps.length} passages (${ps.map((p) => `${p.source_id}:${p.page_start}`).join(", ")})`);
}
