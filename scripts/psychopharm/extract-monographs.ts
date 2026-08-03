#!/usr/bin/env tsx
/**
 * Pass 1 — deterministic monograph extractor (Stahl Prescriber's Guide 7th ed).
 *
 * Stahl monographs are sequential pages, each starting with a drug name line
 * followed by "Therapeutics". For each such monograph we assemble its contiguous
 * pages and pull the verbatim section blocks (dosing, mechanism, uses, side
 * effects), each attached to the page where it starts. Output is draft data
 * with genuine page refs and snippets — ready for reviewer approval.
 *
 * Rules honoured: quote-first (each field is the source's exact words), fields
 * not present in a monograph stay empty (Rule 4), nothing inferred.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT = join(process.cwd(), "scripts/psychopharm/text/stahl_pg_7th.txt");

function loadPages(): Map<number, string> {
  const t = readFileSync(TEXT, "utf8");
  const pages = new Map<number, string>();
  const blocks = t.split(/<<<PAGE (\d+)>>>/);
  for (let i = 1; i < blocks.length; i += 2) pages.set(Number(blocks[i]), blocks[i + 1] ?? "");
  return pages;
}

/**
 * Monograph section headers, in the order they appear.
 *
 * "If It Works", "If It Doesn't Work", "Best Augmenting Combos for Partial
 * Response or Treatment Resistance", "Tests", and "Pharmacokinetics" were
 * previously missing here. Without them, "How Long Until It Works" (and other
 * sections) swallowed everything up to the next KNOWN header — for most
 * monographs that meant onset text absorbed several thousand characters of
 * prescriber-directed content ("consider increasing dose", "switching to
 * another agent") that must never reach a student.
 */
const SECTIONS = [
  "Commonly Prescribed for",
  "How the Drug Works",
  "How Long Until It Works",
  "If It Works",
  "If It Doesn't Work",
  "Best Augmenting Combos for Partial Response or Treatment Resistance",
  "Tests",
  "Usual Dosage Range",
  "Dosage Forms",
  "How to Dose",
  "Dosing Tips",
  "Notable Side Effects",
  "Life-Threatening or Dangerous Side Effects",
  "What to Do About Side Effects",
  "Pharmacokinetics",
  "Special Populations",
  "The Art of Psychopharmacology",
  "Potential Advantages",
  "Potential Disadvantages",
  "Pearls",
];

/**
 * Normalise curly apostrophes (U+2019) to straight ones so the source text's
 * "Doesn’t" matches our SECTIONS entry "Doesn't" without pasting the Unicode
 * character into the array.
 */
function straightenApostrophes(s: string): string {
  return s.replace(/’/g, "'");
}

/**
 * "Best Augmenting Combos for Partial Response or Treatment Resistance" wraps
 * across two source lines ("...Treatment" / "Resistance"). We match it by
 * prefix against the normalised line pair rather than requiring the full
 * heading on one line.
 */
const BEST_AUGMENTING_PREFIX = "Best Augmenting Combos for Partial Response or Treatment";

/**
 * For a single assembled monograph text, return fresh data: map of header -> {
 * page, text } where `page` is the page the header appeared on and `text` is
 * the verbatim block up to the next header (or the next page).
 */
function extractMonograph(assembled: Array<{ page: number; text: string }>): {
  generic: string;
  sections: Record<string, { page: number; text: string }>;
} {
  // The drug name is the first non-empty line of the first page.
  const firstLines = assembled[0].text.trim().split("\n").map((l) => l.trim());
  const generic = firstLines[0] || "unknown";

  const sections: Record<string, { page: number; text: string }> = {};

  // Flatten to a single (page, line) list so a header wrapping across two
  // source lines (e.g. "Best Augmenting Combos ... Treatment" / "Resistance")
  // can be detected with one line of lookahead.
  const flat: Array<{ page: number; line: string }> = [];
  for (const { page, text } of assembled) {
    for (const rawLine of text.split("\n")) {
      const t = straightenApostrophes(rawLine.trim());
      if (t) flat.push({ page, line: t });
    }
  }

  let current: string | null = null;
  let buffer: string[] = [];
  let currentPage = 0;

  const flush = () => {
    if (current && buffer.length && !sections[current]) {
      sections[current] = { page: currentPage, text: buffer.map((l) => l.trim()).join(" ") };
    }
    buffer = [];
  };

  for (let i = 0; i < flat.length; i++) {
    const { page, line } = flat[i];

    // Wrapped header: "Best Augmenting Combos ... Treatment" on this line,
    // "Resistance" on the next.
    if (
      line.startsWith(BEST_AUGMENTING_PREFIX) &&
      flat[i + 1]?.line === "Resistance"
    ) {
      flush();
      current = "Best Augmenting Combos for Partial Response or Treatment Resistance";
      currentPage = page;
      i++; // consume the "Resistance" continuation line
      continue;
    }

    const headerIdx = SECTIONS.indexOf(line);
    if (headerIdx >= 0) {
      flush();
      current = line;
      currentPage = page;
      continue;
    }
    if (current) buffer.push(line);
  }
  flush();
  return { generic, sections };
}

function main() {
  const pages = loadPages();
  const pageList = [...pages.keys()].sort((a, b) => a - b);

  // Find monograph starts: a page whose first non-empty lines are
  //   <Drug Name>
  //   Therapeutics
  const starts: Array<{ page: number }> = [];
  for (const p of pageList) {
    const body = pages.get(p) ?? "";
    const non = body.trim().split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 6);
    if (non.length >= 2 && non[1] === "Therapeutics") starts.push({ page: p });
  }

  const out: Record<string, unknown> = {};
  for (let k = 0; k < starts.length; k++) {
    const start = starts[k].page;
    const end = k + 1 < starts.length ? starts[k + 1].page : start + 60; // last monograph: assume length caps
    const assembled = pageList
      .filter((p) => p >= start && p < end)
      .map((p) => ({ page: p, text: pages.get(p) ?? "" }));
    const { generic, sections } = extractMonograph(assembled);
    out[generic] = { monograph_start_page: start, pages: assembled.map((a) => a.page).join(","), sections };
  }

  const outPath = join(process.cwd(), "docs/psychopharm/extracted_mono_stahl7.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log(`wrote ${Object.keys(out).length} monographs → ${outPath}`);
}

main();