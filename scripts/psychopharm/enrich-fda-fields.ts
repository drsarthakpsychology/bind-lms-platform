#!/usr/bin/env tsx
/**
 * P0 enrichment — turn a parsed full-label JSON (from fetch-fda-full.ts) into
 * quote-first psych_drug_fields rows + a KB artifact update.
 *
 * Reads:  scripts/psychopharm/fda/<slug>.json  (full-label sections)
 * Writes: docs/psychopharm/FDA_FIELD_ROWS.json (draft fields, quoted)
 *         + appends rows to KNOWLEDGE_BASE.json (field rows only, no bands)
 *
 * Field mapping (quote-first, never paraphrased):
 *   indications_usage         → common_uses
 *   dosage_admin              → dose_range (verbatim dosing section)
 *   contraindications         → contraindications
 *   warnings_precautions      → monitoring (precautions that imply monitoring)
 *   drug_interactions         → interactions
 *   adverse_reactions         → side_effects_serious (adverse reactions)
 *   overdosage                → overdose
 *   specific_populations      → special_populations
 *   patient_counseling        → patient_counseling
 *   clinical_pharmacology     → mechanism (mechanism of action, verbatim)
 *
 * Provenance: source_id = fda_label (resolved by title in DB), page_ref =
 * "FDA label (setid …)", snippet = first 600 chars of the section.
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const FDA_DIR = join(process.cwd(), "scripts/psychopharm/fda");
const OUT_ROWS = join(process.cwd(), "docs/psychopharm/FDA_FIELD_ROWS.json");
const KB = join(process.cwd(), "docs/psychopharm/KNOWLEDGE_BASE.json");

const FIELD_MAP: Array<{ jsonKey: string; fieldKey: string }> = [
  { jsonKey: "indications_usage", fieldKey: "common_uses" },
  { jsonKey: "dosage_admin", fieldKey: "dose_range" },
  { jsonKey: "contraindications", fieldKey: "contraindications" },
  { jsonKey: "warnings_precautions", fieldKey: "monitoring" },
  { jsonKey: "drug_interactions", fieldKey: "interactions" },
  { jsonKey: "adverse_reactions", fieldKey: "side_effects_serious" },
  { jsonKey: "overdosage", fieldKey: "overdose" },
  { jsonKey: "specific_populations", fieldKey: "special_populations" },
  { jsonKey: "patient_counseling", fieldKey: "patient_counseling" },
  { jsonKey: "clinical_pharmacology", fieldKey: "mechanism" },
];

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

interface FieldRow {
  drug: string;
  kind: "field";
  field_key: string;
  value: string;
  source_id: string;
  page_ref: string;
  snippet: string;
  evidence: string;
}

function main() {
  const drugArg = process.argv.find((a) => a.startsWith("--drug="))?.split("=")[1];
  const files = drugArg
    ? [join(FDA_DIR, `${slug(drugArg)}.json`)]
    : readFileSync(join(FDA_DIR, "_index.txt"), "utf8").split("\n").filter(Boolean).map((f) => join(FDA_DIR, f));

  const allRows: FieldRow[] = [];
  let kbChanged = false;
  let kb = existsSync(KB) ? JSON.parse(readFileSync(KB, "utf8")) : [];

  for (const file of files) {
    if (!existsSync(file)) {
      console.error(`missing ${file}`);
      continue;
    }
    const label = JSON.parse(readFileSync(file, "utf8"));
    // Canonicalize the drug name to the existing KB spelling, so FDA rows merge
    // onto the canonical name instead of creating duplicate pseudo-drugs.
    // Matching is case-insensitive AND ignores parentheticals, spaces/punct
    // ("amphetamine d" → "Amphetamine (D)", "methylfolate l" → "Methylfolate (L)").
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const rawName = label.meta.drug;
    const canonical =
      (kb.find((r: any) => norm(String(r.drug)) === norm(rawName)) as any)?.drug ?? rawName;
    const drug = canonical;
    const setid = label.meta.setid;
    const pageRef = `FDA label (setid ${setid})`;
    for (const { jsonKey, fieldKey } of FIELD_MAP) {
      const body = label.sections?.[jsonKey];
      if (!body || body.trim().length < 40) continue; // skip absent/empty sections
      const row: FieldRow = {
        drug,
        kind: "field",
        field_key: fieldKey,
        value: body.trim(),
        source_id: "fda_label",
        page_ref: pageRef,
        snippet: body.trim().slice(0, 600),
        evidence: "verbatim FDA label section",
      };
      allRows.push(row);

      // Local artifact: replace the same-source same-field KB row if present,
      // else append. KB rows have {drug, kind, field_key, value, page_ref, source_id}.
      const idx = kb.findIndex((r: any) => r.drug === drug && r.field_key === fieldKey && r.source_id === "fda_label");
      if (idx >= 0) kb[idx] = { drug, kind: "field", field_key: fieldKey, value: row.value, page_ref: pageRef, source_id: "fda_label" };
      else kb.push({ drug, kind: "field", field_key: fieldKey, value: row.value, page_ref: pageRef, source_id: "fda_label" });
      kbChanged = true;
    }
    console.log(`${drug}: ${allRows.filter((r) => r.drug === drug).length} field rows`);
  }

  writeFileSync(OUT_ROWS, JSON.stringify(allRows, null, 2), "utf8");
  if (kbChanged) writeFileSync(KB, JSON.stringify(kb, null, 2), "utf8");
  console.log(`\nwrote ${allRows.length} field rows → ${OUT_ROWS}`);
  if (kbChanged) console.log(`updated ${KB} (total rows: ${kb.length})`);
}

main();
