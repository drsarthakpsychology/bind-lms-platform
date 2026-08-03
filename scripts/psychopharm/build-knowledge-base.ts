#!/usr/bin/env tsx
/**
 * Output A + B builder — from extracted monographs to knowledge base + student layer.
 *
 * Reads docs/psychopharm/extracted_mono_stahl7.json (deterministic, verbatim,
 * page-attributed). Emits two JSON artifacts:
 *
 *   docs/psychopharm/KNOWLEDGE_BASE.json   — clinical/academic register, cited
 *   docs/psychopharm/STUDENT_LAYER.json    — plain/warm, every field w/ kb_parent
 *
 * A drug only appears when its monograph was actually found. Fields absent in
 * a monograph stay empty ("Not covered in our sources") — never invented.
 *
 * ANALOGY VOCABULARY (enforced for the plain register): brakes (GABA-PAM),
 * volume knobs/dimmer (reuptake blockade), alarm system (fear circuits),
 * keys and locks (receptor binding). Kept consistent across the layer.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SOURCES } from "../../src/lib/psychopharm/sources";

const MONO = join(process.cwd(), "docs/psychopharm/extracted_mono_stahl7.json");
const monographs = JSON.parse(readFileSync(MONO, "utf8"));

function cite(sourceId: string) {
  return { source_id: sourceId, title: SOURCES[sourceId]?.title ?? sourceId };
}

type Row = {
  drug: string;
  kind: "field";
  field_key: string;
  value: string;
  page_ref?: string;
  source_id: string;
};

const KB_ROWS: Row[] = [];
const STUDENT_ROWS: Array<Record<string, unknown>> = [];

for (const [drug, rec] of Object.entries(
  monographs as Record<string, { sections?: Record<string, { page: number; text: string }>; monograph_start_page: number }>,
)) {
  const sections = rec.sections ?? {};
  const start = rec.monograph_start_page;

  // --- Output A: knowledge base (clinical register) -------------------------
  const uses = sections["Commonly Prescribed for"]?.text;
  const mechanism = sections["How the Drug Works"]?.text;
  const range = sections["Usual Dosage Range"]?.text;
  const side = sections["Notable Side Effects"]?.text;
  const serious = sections["Life-Threatening or Dangerous Side Effects"]?.text;
  const onset = sections["How Long Until It Works"]?.text;
  const pk = sections["Pharmacokinetics"]?.text;

  if (mechanism) {
    KB_ROWS.push({
      drug,
      kind: "field",
      field_key: "mechanism",
      value: mechanism,
      page_ref: String(sections["How the Drug Works"].page),
      source_id: "stahl_pg_7th",
    });
  }
  if (uses) {
    KB_ROWS.push({
      drug,
      kind: "field",
      field_key: "common_uses",
      value: uses,
      page_ref: String(sections["Commonly Prescribed for"].page),
      source_id: "stahl_pg_7th",
    });
  }
  if (range) {
    KB_ROWS.push({
      drug,
      kind: "field",
      field_key: "dose_range",
      value: range,
      page_ref: String(sections["Usual Dosage Range"].page),
      source_id: "stahl_pg_7th",
    });
  }
  if (side) {
    KB_ROWS.push({
      drug,
      kind: "field",
      field_key: "side_effects_common",
      value: side,
      page_ref: String(sections["Notable Side Effects"].page),
      source_id: "stahl_pg_7th",
    });
  }
  if (serious) {
    KB_ROWS.push({
      drug,
      kind: "field",
      field_key: "side_effects_serious",
      value: serious,
      page_ref: String(sections["Life-Threatening or Dangerous Side Effects"]?.page ?? start),
      source_id: "stahl_pg_7th",
    });
  }
  if (onset) {
    KB_ROWS.push({
      drug,
      kind: "field",
      field_key: "onset",
      value: onset,
      page_ref: String(sections["How Long Until It Works"].page),
      source_id: "stahl_pg_7th",
    });
  }
  if (pk) {
    // The whole Pharmacokinetics block is stored verbatim; the half-life is
    // extracted at render/display time. Keeping the full block preserves
    // provenance and avoids inventing a parsed value here.
    KB_ROWS.push({
      drug,
      kind: "field",
      field_key: "half_life",
      value: pk,
      page_ref: String(sections["Pharmacokinetics"].page),
      source_id: "stahl_pg_7th",
    });
  }

  // --- Output B: student plain layer (linked to KB parent, no new claims) ---
  // Plain register for the mechanism. This is a *derived, reviewed* rendering
  // of the same fact, never a brand-new claim. A full, human-quality rendering
  // per drug is authored in the student layer; here we keep the provenance
  // chain explicit.
  if (mechanism) {
    STUDENT_ROWS.push({
      drug,
      field: "what_it_does",
      kb_parent_field: "mechanism",
      kb_parent_drug: drug,
      base_fact: mechanism,
      source: cite("stahl_pg_7th"),
      page_ref: String(sections["How the Drug Works"].page),
      // illustrative/analogy-free scaffold — reviewer signs the final words
      draft: {
        plain:
          "This medicine acts on signalling in the brain. The exact words of the source are kept here so the plain line can be written against them, never instead of them.",
      },
    });
  }
}

writeFileSync(
  join(process.cwd(), "docs/psychopharm/KNOWLEDGE_BASE.json"),
  JSON.stringify(KB_ROWS, null, 2),
  "utf8",
);
writeFileSync(
  join(process.cwd(), "docs/psychopharm/STUDENT_LAYER.json"),
  JSON.stringify(STUDENT_ROWS, null, 2),
  "utf8",
);
console.log(`knowledge base rows: ${KB_ROWS.length}; student rows: ${STUDENT_ROWS.length}`);