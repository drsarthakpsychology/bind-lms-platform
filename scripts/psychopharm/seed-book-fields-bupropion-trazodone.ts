#!/usr/bin/env tsx
/**
 * Quick book-extraction for Bupropion and Trazodone (the two remaining
 * non-empty book-cache drugs that lack only the 5 fields the FDA didn't
 * give them — these drugs DO have FDA coverage, so the 5 fields below
 * are additional context from Maudsley).
 *
 * Reads book passages, finds the "Drug Interactions", "Pre-treatment
 * screening", "Special populations" / "Pregnancy" sections, and writes
 * rows to BOOK_FIELD_ROWS.json (re-seeding — seeder is idempotent).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PASSAGES = join(process.cwd(), "scripts/psychopharm/passages");
const OUT = join(process.cwd(), "docs/psychopharm/BOOK_FIELD_ROWS.json");

interface Row {
  drug: string;
  field_key: string;
  value: string;
  source_id: string;
  page_ref: string;
  snippet: string;
}

function readPassage(book: string, drug: string): string {
  const p = join(PASSAGES, `${book}__${drug.toLowerCase()}.txt`);
  if (!require("fs").existsSync(p)) return "";
  return readFileSync(p, "utf8");
}

/**
 * Find a section in the book passage by anchor word, return a window
 * of up to 3000 chars.
 */
function extractSection(text: string, anchor: RegExp, maxChars = 3000): { text: string; page: number } | null {
  const m = text.match(anchor);
  if (!m || m.index === undefined) return null;
  // find the nearest <<<PAGE n>>> before the match
  const before = text.slice(0, m.index);
  const pageMatch = [...before.matchAll(/<<<PAGE (\d+)>>>/g)].pop();
  const page = pageMatch ? Number(pageMatch[1]) : 0;
  return { text: text.slice(m.index, m.index + maxChars), page };
}

function main() {
  const drugs = [
    {
      drug: "Bupropion",
      sources: { maudsley: "maudsley_2021", kaplan: "kaplan_sadock", ahuja: "ahuja_psychiatry" } as Record<string, string>,
      extracts: [
        { field: "interactions", anchor: /(Drug Interactions|Drug interactions|Interactions)/i, book: "maudsley" },
        { field: "monitoring", anchor: /(pre[- ]treatment|blood pressure|monitoring)/i, book: "maudsley" },
        { field: "special_populations", anchor: /(Pregnancy|breast[- ]feeding|renal|hepatic|elderly)/i, book: "maudsley" },
      ],
    },
    {
      drug: "Trazodone",
      sources: { maudsley: "maudsley_2021", kaplan: "kaplan_sadock", ahuja: "ahuja_psychiatry" } as Record<string, string>,
      extracts: [
        { field: "interactions", anchor: /(Drug Interactions|Drug interactions|Interactions)/i, book: "maudsley" },
        { field: "monitoring", anchor: /(pre[- ]treatment|monitoring|blood)/i, book: "maudsley" },
        { field: "special_populations", anchor: /(Pregnancy|breast[- ]feeding|renal|hepatic|elderly)/i, book: "maudsley" },
      ],
    },
  ];

  const rows: Row[] = [];
  for (const d of drugs) {
    for (const ext of d.extracts) {
      const text = readPassage(d.sources[ext.book], d.drug);
      if (!text) continue;
      const section = extractSection(text, ext.anchor);
      if (!section || section.text.length < 80) continue;
      const sourceId = d.sources[ext.book];
      rows.push({
        drug: d.drug,
        field_key: ext.field,
        value: section.text.trim(),
        source_id: sourceId,
        page_ref: `${sourceId} p${section.page}`,
        snippet: section.text.trim().slice(0, 600),
      });
    }
  }
  // Merge with existing rows
  const existing: Row[] = JSON.parse(readFileSync(OUT, "utf8"));
  const merged = [...existing, ...rows];
  writeFileSync(OUT, JSON.stringify(merged, null, 2), "utf8");
  console.log(`wrote ${rows.length} new rows; total: ${merged.length}`);
}

main();
