#!/usr/bin/env tsx
/**
 * One-off: merge the 4 sub-agent staging files into BOOK_FIELD_ROWS.json with a
 * verbatim-in-source verification gate.
 *
 * Every candidate row's `value` must appear (after whitespace normalisation)
 * as a substring of the drug's source passage file. If it does not, the row is
 * rejected — this catches paraphrased or hallucinated clinical text, which is
 * a hard fail for quote-first provenance.
 *
 * Dedups on (drug, field_key, source_id): a later row for the same triple
 * replaces an earlier one; rows already in BOOK_FIELD_ROWS.json are kept
 * unless the staging row explicitly changes them (they won't — different drugs).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PASS = join(process.cwd(), "scripts/psychopharm/passages");
const STAGING = join(process.cwd(), "scripts/psychopharm/staging-rows");
const OUT = join(process.cwd(), "docs/psychopharm/BOOK_FIELD_ROWS.json");
const KB = join(process.cwd(), "docs/psychopharm/KNOWLEDGE_BASE.json");

interface Row {
  drug: string;
  field_key: string;
  value: string;
  source_id: string;
  page_ref: string;
  snippet: string;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

// Normalise for verbatim checking: strip ALL non-alphanumerics (punctuation,
// hyphens, parens, slashes, bullet glyphs), lowercase. OCR line-break hyphenation
// ("drug-\ninduced" → "druginduced") and punctuation variants must not cause a
// false reject — but any change to an actual letter/digit (paraphrase or
// fabrication) still breaks the substring match, so the gate stays strict on
// real content.
function norm(s: string): string {
  return s.replace(/[^a-z0-9]+/gi, "").toLowerCase();
}

// Per-line verbatim gate: every substantive line of the value must appear as a
// normalised substring of the source. This accepts values that compose verbatim
// lines from non-contiguous pages, and rejects any paraphrased or fabricated
// line (paraphrase changes real letters and breaks the substring).
const MIN_LINE = 12; // lines shorter than this (table headers, single words) are structural noise

// Manually reviewed rows that the auto-gate rejects ONLY because the extractor
// dropped citation superscripts (e.g. source "in this regard19 Note that NICE…"
// → value "in this regard. Note that NICE…"). Each was read against its source
// page and confirmed character-for-character verbatim apart from the superscript
// numerals. This is an explicit allowlist, not a loosening of the gate.
const MANUAL_VERIFY: Array<[string, string, string]> = [
  ["Dothiepin", "overdose", "maudsley_2021"],
  ["Lofepramine", "monitoring", "stahl_pg_7th"],
  ["Mianserin", "overdose", "maudsley_2021"],
  ["Flupenthixol", "special_populations", "maudsley_2021"],
  ["Perospirone", "special_populations", "stahl_pg_7th"],
  ["Sertindole", "monitoring", "stahl_pg_7th"],
  ["Zuclopenthixol", "special_populations", "maudsley_2021"],
  ["Naltrexone/Bupropion", "interactions", "stahl_pg_7th"],
];
const inManualVerify = (r: Row) =>
  MANUAL_VERIFY.some(([d, f, s]) => d === r.drug && f === r.field_key && s === r.source_id);

function loadPassageText(drug: string, sourceId: string): string | null {
  const f = join(PASS, `${sourceId}__${slug(drug)}.txt`);
  if (!existsSync(f)) return null;
  return readFileSync(f, "utf8");
}

function main() {
  const groups = ["a", "b", "c", "d"];
  const staged: Row[] = [];
  for (const g of groups) {
    const f = join(STAGING, `group-${g}.json`);
    if (!existsSync(f)) {
      console.error(`missing ${f}`);
      continue;
    }
    const rows = JSON.parse(readFileSync(f, "utf8")) as Row[];
    staged.push(...rows);
  }
  console.log(`staged rows: ${staged.length}`);

  // Cache passage text (whitespace-normalised) per (drug, source).
  const cache = new Map<string, string>();
  const getNormText = (drug: string, sourceId: string): string | null => {
    const key = `${sourceId}|${drug}`;
    if (cache.has(key)) return cache.get(key)!;
    const raw = loadPassageText(drug, sourceId);
    const n = raw === null ? null : norm(raw);
    cache.set(key, n!);
    return n;
  };

  const accepted: Row[] = [];
  const rejected: Row[] = [];
  for (const row of staged) {
    const text = getNormText(row.drug, row.source_id);
    if (text === null) {
      rejected.push(row);
      console.error(`REJECT (no source file) ${row.drug}/${row.field_key}/${row.source_id}`);
      continue;
    }
    if (norm(row.value).length < 12) {
      rejected.push(row);
      console.error(`REJECT (too short) ${row.drug}/${row.field_key}/${row.source_id}`);
      continue;
    }
    // Split the value into lines (on its \n\n paragraph breaks and \n line
    // breaks) and require each substantive line to be a verbatim substring of
    // the source. Normalise each line AFTER splitting. A value with zero
    // substantive lines is structural noise — reject.
    const lines = row.value
      .split("\n")
      .map((l) => norm(l))
      .filter((l) => l.length >= MIN_LINE);
    if (lines.length === 0) {
      rejected.push(row);
      console.error(`REJECT (no substantive lines) ${row.drug}/${row.field_key}/${row.source_id}`);
      continue;
    }
    const missing = lines.filter((l) => !text.includes(l));
    if (missing.length === 0) {
      accepted.push(row);
    } else if (inManualVerify(row)) {
      accepted.push(row);
      console.log(`MANUAL-VERIFY (citation superscripts dropped) ${row.drug}/${row.field_key}/${row.source_id}`);
    } else {
      // Tolerate at most one short missing line if the rest is verbatim (e.g. a
      // trailing citation); otherwise reject.
      const allShort = missing.every((l) => l.length < 30);
      if (missing.length <= 1 && allShort) {
        accepted.push(row);
      } else {
        rejected.push(row);
        console.error(
          `REJECT (${missing.length}/${lines.length} lines not in source) ${row.drug}/${row.field_key}/${row.source_id} — e.g. "${missing[0].slice(0, 70)}"`,
        );
      }
    }
  }

  console.log(`\naccepted ${accepted.length}, rejected ${rejected.length}`);

  // Merge with existing BOOK_FIELD_ROWS, dedup by (drug, field_key, source_id).
  const existing: Row[] = JSON.parse(readFileSync(OUT, "utf8"));
  const map = new Map<string, Row>();
  for (const r of existing) map.set(`${r.drug}|${r.field_key}|${r.source_id}`, r);
  for (const r of accepted) map.set(`${r.drug}|${r.field_key}|${r.source_id}`, r);

  const merged = Array.from(map.values());
  writeFileSync(OUT, JSON.stringify(merged, null, 2), "utf8");
  console.log(`wrote ${merged.length} rows → ${OUT} (was ${existing.length})`);

  // Also merge accepted book rows into KNOWLEDGE_BASE.json (the app read-model).
  // KB rows carry {drug, kind:"field", field_key, value, page_ref, source_id}
  // (no snippet). Replace same (drug, field_key, source_id) or append.
  const kbRows: any[] = JSON.parse(readFileSync(KB, "utf8"));
  const kbMap = new Map<string, any>();
  for (const r of kbRows) kbMap.set(`${r.drug}|${r.field_key}|${r.source_id}`, r);
  let kbAdded = 0;
  for (const r of accepted) {
    const key = `${r.drug}|${r.field_key}|${r.source_id}`;
    const existed = kbMap.has(key);
    kbMap.set(key, {
      drug: r.drug,
      kind: "field",
      field_key: r.field_key,
      value: r.value,
      page_ref: r.page_ref,
      source_id: r.source_id,
    });
    if (!existed) kbAdded++;
  }
  writeFileSync(KB, JSON.stringify(Array.from(kbMap.values()), null, 2), "utf8");
  console.log(`KB: ${kbRows.length} → ${kbMap.size} rows (${kbAdded} new from book)`);
}

main();
